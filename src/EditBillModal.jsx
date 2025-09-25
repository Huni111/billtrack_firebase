import React, { useState, useEffect } from "react";
import "./Bills.css";
import { useBills } from "./BillsContext"; 

export default function EditBillModal({ open, bill, onClose }) {

    const { updateBill } = useBills();

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
        if (bill) {
            setForm({
                tip_factura: bill.tip_factura || "iesire",
                client: bill.client || "",
                valoare_totala: bill.valoare_totala || "",
                data_emiteri: bill.data_emiteri || "",
                data_scadenta: bill.data_scadenta || "",
                platit: !!bill.platit,
                serie: bill.serie || "",
                numar: bill.numar || ""
            });
        }
    }, [bill, open]);

    if (!open || !bill) return null;

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [name]:
                type === "checkbox" ? checked :
                (name === "numar" ? (value === '' ? '' : parseInt(value, 10)) : value)
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.client || !form.valoare_totala || !form.data_emiteri || !form.data_scadenta) return;

        const numarValue = parseInt(form.numar, 10);
        if (isNaN(numarValue)) {
            alert("Introduceți un număr valid pentru Număr.");
            return;
        }

        updateBill({
            ...bill,
            ...form,
            valoare_totala: parseFloat(form.valoare_totala),
            numar: numarValue,
            platit: !!form.platit
        });
        console.log(typeof(form.numar))
        console.log(form.numar)
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3>Editează Factura</h3>
                <form className="add-bill-form" onSubmit={handleSubmit}>
                    <div>
                        <label>Tip factura: </label>
                        <select name="tip_factura" value={form.tip_factura} onChange={handleChange}>
                            <option value="iesire">Iesire</option>
                            <option value="intrare">Intrare</option>
                        </select>
                    </div>
                    <div>
                        <label> {form.tip_factura === "iesire" ? "Client" : "Furnizor"}: </label>
                        <input className="inputs" name="client" value={form.client} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Valoare totală: </label>
                        <input name="valoare_totala" type="number" step="0.01" value={form.valoare_totala} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Data emiterii: </label>
                        <input name="data_emiteri" type="date" value={form.data_emiteri} onChange={handleChange} required />
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
                        <input className="inputs" type="number" name="numar" value={form.numar} onChange={handleChange} required />
                    </div>
                    <div style={{marginTop: 16}}>
                        <button type="submit" className="add-bill-save-btn">Salvează</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
