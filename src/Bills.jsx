import React, { useState, useEffect } from "react"
import facturi from '../data.json'
import './Bills.css'

export default function Bills() {

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthStr = today.toISOString().slice(0, 7);

    // Top 10 ügyfél kimenő számlák összértéke szerint
    const iesireFacturi = facturi.filter(f => f.tip_factura === "iesire");

    const top10Clienti = Object.entries(
        iesireFacturi.reduce((acc, f) => {
            acc[f.client] = (acc[f.client] || 0) + f.valoare_totala;
            return acc;
        }, {})
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);


    // Havi bejövő vs. kimenő számlák
    const facturiLunaCurenta = facturi.filter(f =>
        f.data_emiteri.startsWith(currentMonthStr)
    );


    const totalIntrari = facturiLunaCurenta
        .filter(f => f.tip_factura === "intrare")
        .reduce((sum, f) => sum + f.valoare_totala, 0);

    const totalIesiri = facturiLunaCurenta
        .filter(f => f.tip_factura === "iesire")
        .reduce((sum, f) => sum + f.valoare_totala, 0);


    //Évi bejövő vs. kimenő számlák
    const facturiAnCurent = facturi.filter(f => {
        const date = new Date(f.data_emiteri);
        return date.getFullYear() === currentYear;
    });

    const totalIntrariAnCurent = facturiAnCurent
        .filter(f => f.tip_factura === "intrare")
        .reduce((sum, f) => sum + f.valoare_totala, 0);

    const totalIesiriAnCurent = facturiAnCurent
        .filter(f => f.tip_factura === "iesire")
        .reduce((sum, f) => sum + f.valoare_totala, 0);



    //  Lejárt kimenő számlák (nem fizetett)
    const azi = new Date();

    const facturiIesireLejart = facturi.filter(f =>
        f.tip_factura === "iesire" &&
        f.platit === false &&
        new Date(f.data_scadenta) < azi
    );

    useEffect(() => {
        console.log("Top 10 clients (by outgoing invoices total):", top10Clienti);
        console.log("Total incoming invoices this month:", totalIesiriAnCurent);
        console.log("Total outgoing invoices this month:", totalIesiri);
        console.log("Unpaid overdue outgoing invoices:", facturiIesireLejart);

    }, [])

    return (
        <>
            {/* <div>{data}</div> */}
            <div>hej</div>
            
            <div className="top-clients-container">
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
        </>
    )
}