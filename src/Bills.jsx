import React, { useState, useEffect } from "react"
import facturiData from '../data.json'
import './Bills.css'
import AddBillModal from './AddBillModal'

export default function Bills() {
    // Local state for bills (so we can add new ones)
    const [bills, setBills] = React.useState(facturiData);
    const [addModalOpen, setAddModalOpen] = React.useState(false);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthStr = today.toISOString().slice(0, 7);

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

    useEffect(() => {
        console.log("Top 10 clients (by outgoing invoices total):", top10Clienti);
        console.log("Total incoming invoices this month:", totalIesiriAnCurent);
        console.log("Total outgoing invoices this month:", totalIesiri);
        console.log("Unpaid overdue outgoing invoices:", facturiIesireLejart);
    }, [bills]);

    // Modal state
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleBillClick = (factura) => {
        setSelectedBill(factura);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBill(null);
    };

    return (
        <>
            {/* <div>{data}</div> */}
            <button className="add-bill-btn" onClick={() => setAddModalOpen(true)} style={{marginBottom: 16}}>Adaugă Factură Nouă</button>
            <AddBillModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={bill => setBills(bills => [...bills, bill])}
            />
            <div className="bills-lists-wrapper">
                <div className="top-clients-container card-list">
                    <h2>Top 10 Clients</h2>
                    <ul className="top-clients-list">
                        {top10Clienti.map((client, index) => (
                            <li key={index} className="client-item">
                                <span className="client-name">{client[0]}</span>
                                <span className="client-value">{client[1].toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="overdue-bills-container card-list">
                    <h2>Facturi Iesire Lejart</h2>
                    <ul className="overdue-bills-list">
                        {facturiIesireLejart.length === 0 ? (
                            <li className="no-overdue">Nicio factura lejartă</li>
                        ) : (
                            facturiIesireLejart.map((factura, idx) => (
                                <li key={idx} className="overdue-bill-item" onClick={() => handleBillClick(factura)} style={{cursor: 'pointer'}}>
                                    <span className="client-name">{factura.client}</span>
                                    <span className="bill-value">{factura.valoare_totala.toFixed(2)}</span>
                                    <span className="bill-due-date">Scadentă: {factura.data_scadenta}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="overdue-bills-container card-list">
                    <h2>Facturi Intrare Lejart</h2>
                    <ul className="overdue-bills-list">
                        {facturiIntrareLejart.length === 0 ? (
                            <li className="no-overdue">Nicio factura lejartă</li>
                        ) : (
                            facturiIntrareLejart.map((factura, idx) => (
                                <li key={idx} className="overdue-bill-item" onClick={() => handleBillClick(factura)} style={{cursor: 'pointer'}}>
                                    <span className="client-name">{factura.client}</span>
                                    <span className="bill-value">{factura.valoare_totala.toFixed(2)}</span>
                                    <span className="bill-due-date">Scadentă: {factura.data_scadenta}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {showModal && selectedBill && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>&times;</button>
                        <h3>Detalii Factură</h3>
                        <div><strong>{selectedBill.tip_factura === 'iesire' ? 'Client' : 'Furnizor'}:</strong> {selectedBill.client}</div>
                        <div><strong>Valoare totală:</strong> {selectedBill.valoare_totala.toFixed(2)}</div>
                        <div><strong>Data emiterii:</strong> {selectedBill.data_emiteri}</div>
                        <div><strong>Data scadentă:</strong> {selectedBill.data_scadenta}</div>
                        <div><strong>Plătit:</strong> {selectedBill.platit ? 'Da' : 'Nu'}</div>
                        <div><strong>Serie/Număr:</strong> {selectedBill.serie || ''} {selectedBill.numar || ''}</div>
                        {/* Add more fields as needed */}
                    </div>
                </div>
            )}

            {/* Paginated list of all bills */}
            <div className="all-bills-section">
                <h2>Toate Facturile</h2>
                <PaginatedBillsTable
                    bills={bills}
                    onBillClick={handleBillClick}
                    rowsPerPage={10}
                />
            </div>
        </>
    )
}

// Paginated table component
function PaginatedBillsTable({ bills, onBillClick, rowsPerPage }) {
    const [page, setPage] = React.useState(1);
    const totalPages = Math.ceil(bills.length / rowsPerPage);
    const startIdx = (page - 1) * rowsPerPage;
    const pageBills = bills.slice(startIdx, startIdx + rowsPerPage);

    return (
        <div className="paginated-bills-table-wrapper">
            <table className="paginated-bills-table">
                <thead>
                    <tr>
                        <th>Tip</th>
                        <th>{'Client / Furnizor'}</th>
                        <th>Valoare</th>
                        <th>Scadentă</th>
                        <th>Plătit</th>
                    </tr>
                </thead>
                <tbody>
                    {pageBills.map((bill, idx) => (
                        <tr key={startIdx + idx} className="paginated-bill-row" onClick={() => onBillClick(bill)} style={{cursor: 'pointer'}}>
                            <td>{bill.tip_factura === 'iesire' ? 'Iesire' : 'Intrare'}</td>
                            <td>{bill.client}</td>
                            <td>{bill.valoare_totala.toFixed(2)}</td>
                            <td>{bill.data_scadenta}</td>
                            <td>{bill.platit ? 'Da' : 'Nu'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&lt;</button>
                <span>Pagina {page} din {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>&gt;</button>
            </div>
        </div>
    );
}