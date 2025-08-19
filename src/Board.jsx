import React, { useEffect } from "react";
import facturiData from '../data.json';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { dB } from "./appwriteConfig";


const Board = () => {

    const [bills, setBills] = React.useState(facturiData);
    const [addModalOpen, setAddModalOpen] = React.useState(false);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthStr = today.toISOString().slice(0, 7);
    const COMPANIES_COLLECTION_ID = import.meta.env.VITE_COMPANIES_COLLECTION_ID
    const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;


    useEffect(() => {

        const fetchCompanies = async () => {
            try {
                const res = await dB.listDocuments(DATABASE_ID, COMPANIES_COLLECTION_ID);

                const formatDate = (isoString) => {
                    if (!isoString) return '';
                    return new Date(isoString).toISOString().slice(0, 10);
                };

                const bils = res.documents.map(doc => ({
                    $id: doc.$id,
                    nr_factura: doc.numar ? String(doc.numar) : '',           // convert number → string
                    tip_factura: doc.tip_factura || '',                       // e.g., "intrare" or "iesire"
                    data_emiteri: formatDate(doc.data_emiteri),              // "yyyy-MM-dd"
                    data_scadenta: formatDate(doc.data_scadenta),            // "yyyy-MM-dd"
                    valoare_fara_tva: doc.valoare_fara_tva || 0,             // supply 0 if missing
                    valoare_tva: doc.valoare_tva || 0,
                    valoare_totala: doc.valoare_totala || 0,
                    platit: !!doc.platit,                                     // ensure boolean
                    client: doc.client || '',
                }));
                setBills(bils);
                console.log(bils);


            } catch (error) {
                console.error("❌ Appwrite error:", error);
            }


        };
        fetchCompanies();



    }, [])


    // Top 10 ügyfél kimenő számlák összértéke szerint
    const iesireFacturi = bills.filter(f => f.tip_factura === "iesire");

    const top10Clienti = Object.entries(
        iesireFacturi.reduce((acc, f) => {
            acc[f.client] = (acc[f.client] || 0) + f.valoare_totala;
            return acc;
        }, {})
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);


    // Havi bejövő vs. kimenő számlák
    const facturiLunaCurenta = bills.filter(f =>
        f.data_emiteri.startsWith(currentMonthStr)
    );


    const totalIntrari = facturiLunaCurenta
        .filter(f => f.tip_factura === "intrare")
        .reduce((sum, f) => sum + f.valoare_totala, 0);

    const totalIesiri = facturiLunaCurenta
        .filter(f => f.tip_factura === "iesire")
        .reduce((sum, f) => sum + f.valoare_totala, 0);


    //Évi bejövő vs. kimenő számlák
    const facturiAnCurent = bills.filter(f => {
        const date = new Date(f.data_emiteri);
        return date.getFullYear() === currentYear;
    });

    const totalIntrariAnCurent = facturiAnCurent
        .filter(f => f.tip_factura === "intrare")
        .reduce((sum, f) => sum + f.valoare_totala, 0);

    const totalIesiriAnCurent = facturiAnCurent
        .filter(f => f.tip_factura === "iesire")
        .reduce((sum, f) => sum + f.valoare_totala, 0);



    //  Lejárt kimenő számlák (nu sunt plătite)
    const azi = new Date();

    const facturiIesireLejart = bills.filter(f =>
        f.tip_factura === "iesire" &&
        f.platit === false &&
        new Date(f.data_scadenta) < azi
    );

    //  Lejárt facturi de intrare (nu sunt plătite)
    const facturiIntrareLejart = bills.filter(f =>
        f.tip_factura === "intrare" &&
        f.platit === false &&
        new Date(f.data_scadenta) < azi
    );

    // Bar chart data: total incoming vs outgoing per day (current month)
    const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
    const barDataMonth = Array.from({ length: daysInMonth }, (_, idx) => {
        const dayStr = `${currentMonthStr}-${(idx + 1).toString().padStart(2, '0')}`;
        const intrari = bills.filter(f => f.tip_factura === 'intrare' && f.data_emiteri.startsWith(dayStr))
            .reduce((sum, f) => sum + f.valoare_totala, 0);
        const iesiri = bills.filter(f => f.tip_factura === 'iesire' && f.data_emiteri.startsWith(dayStr))
            .reduce((sum, f) => sum + f.valoare_totala, 0);
        return { zi: (idx + 1).toString(), Intrare: intrari, Iesire: iesiri };
    });
    const barColorsMonth = ['#16a085', '#3498db'];

    // Bar chart data: total incoming vs outgoing per month (current year)
    const months = [
        'Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const barDataYear = months.map((label, idx) => {
        const monthStr = `${currentYear}-${(idx + 1).toString().padStart(2, '0')}`;
        const intrari = bills.filter(f => f.tip_factura === 'intrare' && f.data_emiteri.startsWith(monthStr))
            .reduce((sum, f) => sum + f.valoare_totala, 0);
        const iesiri = bills.filter(f => f.tip_factura === 'iesire' && f.data_emiteri.startsWith(monthStr))
            .reduce((sum, f) => sum + f.valoare_totala, 0);
        return { luna: label, Intrare: intrari, Iesire: iesiri };
    });
    const barColors = ['#27ae60', '#2980b9'];

    // Pie chart data for top 10 clients
    const top10PieData = top10Clienti.map(([name, value]) => ({ name, value }));
    const top10PieColors = [
        '#3498db', '#e67e22', '#16a085', '#9b59b6', '#f39c12',
        '#e74c3c', '#1abc9c', '#34495e', '#8e44ad', '#2ecc71'
    ];

    return (
        <>
            <div className="main-content">
                <div className="dashboard-pie-chart-card">
                    <h2 style={{ marginBottom: 0 }}>Raport Intrare vs Iesire (Luna curentă)</h2>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={barDataMonth} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                            <XAxis dataKey="zi" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Intrare" fill={barColorsMonth[0]} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Iesire" fill={barColorsMonth[1]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="dashboard-pie-chart-card">
                    <h2 style={{ marginBottom: 0 }}>Raport Intrare vs Iesire (An curent)</h2>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={barDataYear} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                            <XAxis dataKey="luna" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Intrare" fill={barColors[0]} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Iesire" fill={barColors[1]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="dashboard-pie-chart-card">
                    <h2 style={{ marginBottom: 0 }}>Top 10 Clienți (Valoare facturi ieșire)</h2>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={top10PieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                label
                            >
                                {top10PieData.map((entry, idx) => (
                                    <Cell key={`cell-top10-${idx}`} fill={top10PieColors[idx % top10PieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Aging Horizontal Bar Charts */}
                <div style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
                    <div className="dashboard-pie-chart-card" style={{ flex: 1, minWidth: 320 }}>
                        <h2 style={{ marginBottom: 0 }}>Aging Facturi Intrare Expirate</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                data={Object.entries(facturiIntrareLejart.reduce((acc, f) => {
                                    acc[f.client] = (acc[f.client] || 0) + f.valoare_totala;
                                    return acc;
                                }, {}))
                                    .map(([name, value]) => ({ name, value }))
                                    .sort((a, b) => b.value - a.value)
                                }
                                layout="vertical"
                                margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
                            >
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#16a085" barSize={22} radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="dashboard-pie-chart-card" style={{ flex: 1, minWidth: 320 }}>
                        <h2 style={{ marginBottom: 0 }}>Aging Facturi Iesire Expirate</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                data={Object.entries(facturiIesireLejart.reduce((acc, f) => {
                                    acc[f.client] = (acc[f.client] || 0) + f.valoare_totala;
                                    return acc;
                                }, {}))
                                    .map(([name, value]) => ({ name, value }))
                                    .sort((a, b) => b.value - a.value)
                                }
                                layout="vertical"
                                margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
                            >
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#e67e22" barSize={22} radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div>
                    board
                </div>
            </div>
        </>
    )
}


export default Board;