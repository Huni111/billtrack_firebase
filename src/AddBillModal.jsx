import React, { useState, useEffect,  useMemo } from "react";
import "./Bills.css";
import { dB } from "./appwriteConfig";
import { ID } from "appwrite";
import { Query } from "appwrite";
import { useBills } from "./BillsContext";


const COMPANIES_COLLECTION_ID = "68650f37002e918f8716";
const DATABASE_ID = "685a8b6f000745b9ad99";


export default function AddBillModal({ open, onClose }) {
    const { bills, addBill } = useBills();
  
    const [form, setForm] = useState({
        tip_factura: "",
        client: "",
        valoare_totala: "",
        data_emiteri: "",
        data_scadenta: "",
        platit: false,
        serie: "",
        numar: ""
    });

     const companies = useMemo(() => {
        const names = bills
            .map(bill => bill.client.trim().toLowerCase())
            .filter(name => name.length > 0);
        const uniqueNames = [...new Set(names)];
        // Optionally restore original casing by mapping to first matching bill client
        return uniqueNames.map(name => bills.find(bill => bill.client.trim().toLowerCase() === name)?.client || name);
    }, [bills]);

    if (!open) return null;

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.client || !form.valoare_totala || !form.data_emiteri || !form.data_scadenta) return;

        const createdBill = await dB.createDocument(
            DATABASE_ID,
            COMPANIES_COLLECTION_ID,
            ID.unique(),
            {
                ...form,
                valoare_totala: parseFloat(form.valoare_totala),
                numar: form.numar === "" ? null : parseInt(form.numar, 10),
                platit: !!form.platit,
                data_emiteri: form.data_emiteri, // Keep as YYYY-MM-DD format
                data_scadenta: form.data_scadenta // Keep as YYYY-MM-DD format
            }
        );

        addBill(createdBill)

        setForm({
            tip_factura: "iesire",
            client: "",
            valoare_totala: "",
            data_emiteri: "",
            data_scadenta: "",
            platit: false,
            serie: "",
            numar: ""
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3>Adaugă Factură Nouă</h3>
                <form className="add-bill-form" onSubmit={handleSubmit}>
                    <div>
                        <label>Tip factura: </label>
                        <select name="tip_factura" value={form.tip_factura} onChange={handleChange}>
                            <option value="iesire">Iesire</option>
                            <option value="intrare">Intrare</option>
                        </select>
                    </div>
                    <div>
                        <label>{form.tip_factura === "iesire" ? "Client" : "Furnizor"}: </label>
                        <input list="company-names" className="inputs" name="client" value={form.client} onChange={handleChange} required />
                    </div>
                    <datalist id="company-names">
                        {companies.map((name, index) => (
                            <option key={index} value={name} />
                        ))}
                    </datalist>
                    <div>
                        <label>Valoare totală: </label>
                        <input className="inputs" name="valoare_totala" type="number" step="0.01" value={form.valoare_totala} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Data emiterii: </label>
                        <input className="inputs" name="data_emiteri" type="date" value={form.data_emiteri} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Data scadentă: </label>
                        <input name="data_scadenta" type="date" value={form.data_scadenta} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Plătit: </label>
                        <input name="platit" type="checkbox" checked={form.platit} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Serie: </label>
                        <input className="inputs" name="serie" value={form.serie} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Număr: </label>
                        <input className="inputs" name="numar" type="number" value={form.numar} onChange={handleChange} />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <button type="submit" className="add-bill-save-btn">Salvează</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
