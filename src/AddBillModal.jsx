import React, { useState, useEffect } from "react";
import "./Bills.css";
import { dB } from "./appwriteConfig";


const COMPANIES_COLLECTION_ID = "68650f37002e918f8716";
const DATABASE_ID = "685a8b6f000745b9ad99";


export default function AddBillModal({ open, onClose, onAdd }) {
    const [companies, setCompanies] = useState([]);
    const [form, setForm] = useState({
        tip_factura: "iesire",
        client: "",
        valoare_totala: "",
        data_emiteri: "",
        data_scadenta: "",
        platit: false,
        serie: "",
        numar: ""
    });

    useEffect(() => {
    const fetchCompanies = async () => {
        try {
            const res = await dB.listDocuments(DATABASE_ID, COMPANIES_COLLECTION_ID);
            const names = res.documents.map(doc => doc.nume);
            setCompanies(names);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    if (open) fetchCompanies(); // Only fetch when modal is open
}, [open]);

    if (!open) return null;

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.client || !form.valoare_totala || !form.data_emiteri || !form.data_scadenta) return;
        onAdd({
            ...form,
            valoare_totala: parseFloat(form.valoare_totala),
            platit: !!form.platit
        });
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
                        <input className="inputs" name="numar" value={form.numar} onChange={handleChange} />
                    </div>
                    <div style={{marginTop: 16}}>
                        <button type="submit" className="add-bill-save-btn">Salvează</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
