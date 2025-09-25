import React, { useState, useEffect } from "react"
import facturiData from '../data.json'
import './Bills.css'
import AddBillModal from './AddBillModal'
import EditBillModal from './EditBillModal'
import { useAuth } from "./AuthContext"
import { useBills } from "./BillsContext"


export default function Bills() {
    const { bills, addBill, deleteBill } = useBills();
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const { user } = useAuth()

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthStr = today.toISOString().slice(0, 7);

   



    // Top 10 ügyfél kimenő számlák összértéke szerint
    const iesireFacturi = bills.filter(f => f.tip_factura === "iesire");

    const top10Clienti = Object.entries(
        iesireFacturi.reduce((acc, f) => {
           acc[f.client] = (acc[f.client] || 0) + Number(f.valoare_totala || 0);
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

    // useEffect(() => {
    //     console.log("Top 10 clients (by outgoing invoices total):", top10Clienti);
    //     console.log("Total incoming invoices this month:", totalIesiriAnCurent);
    //     console.log("Total outgoing invoices this month:", totalIesiri);
    //     console.log("Unpaid overdue outgoing invoices:", facturiIesireLejart);
    // }, [bills]);

    // Modal state
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Modal state for editing
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editBill, setEditBill] = useState(null);

    const handleBillClick = (factura) => {
        setSelectedBill(factura);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBill(null);
    };

    const handleEditClick = (bill) => {
        setEditBill(bill);
        setEditModalOpen(true);
    };

    const handdleDelete = (bill) => {
        deleteBill(bill.id);

    }
    

      const handleEditSave = async (updatedBill) => {
    try {
     await updateBillInDB(updatedBill);

      setEditModalOpen(false);
      setEditBill(null);
    } catch (error) {
      console.error("Failed to update bill:", error);
      // Optional: show UI error message here
    }
  };

    return (
        <div className="main-content">
            {/* <div>{data}</div> */}
            <div className="add-bill-btn-wrapper">
                <button className="add-bill-btn" onClick={() => setAddModalOpen(true)} style={{ marginBottom: 16 }}>Adaugă Factură Nouă</button>
            </div>
            <AddBillModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={addBill}
            />
            <div className="bills-lists-wrapper">
                <div className="top-clients-container card-list">
                    <h2>Top 10 Clienți</h2>
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
                    <h2>Facturi Iesire Expirate</h2>
                    <ul className="overdue-bills-list">
                        {facturiIesireLejart.length === 0 ? (
                            <li className="no-overdue">Nicio factura expirata</li>
                        ) : (
                            facturiIesireLejart.map((factura, idx) => (
                                <li key={idx} className="overdue-bill-item" onClick={() => handleEditClick(factura)} style={{ cursor: 'pointer' }}>
                                    <span className="client-name">{factura.client}</span>
                                    <span className="bill-value">{factura.valoare_totala.toFixed(2)}</span>
                                    <span className="bill-due-date">Scadentă: {factura.data_scadenta}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="overdue-bills-container card-list">
                    <h2>Facturi Intrare Expirate</h2>
                    <ul className="overdue-bills-list">
                        {facturiIntrareLejart.length === 0 ? (
                            <li className="no-overdue">Nicio factura expirata</li>
                        ) : (
                            facturiIntrareLejart.map((factura, idx) => (
                                <li key={idx} className="overdue-bill-item" onClick={() => handleEditClick(factura)} style={{ cursor: 'pointer' }}>
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
                        <div><strong>Valoare totală:</strong> {Number(selectedBill.valoare_totala || 0).toFixed(2)}</div>
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
                    onEditClick={handleEditClick}
                    onDeleteClick={handdleDelete}
                    rowsPerPage={10}
                />
            </div>
            <EditBillModal
                open={editModalOpen}
                bill={editBill}
                onClose={() => { setEditModalOpen(false); setEditBill(null); }}
                onSave={handleEditSave}
            />
        </div>
    )
}

// Paginated table component
function PaginatedBillsTable({ bills, onBillClick, onEditClick, rowsPerPage, onDeleteClick }) {
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
                        <th>Editează</th>
                        <th>Șterge</th>
                    </tr>
                </thead>
                <tbody>
                    {pageBills.map((bill, idx) => (
                        <tr key={startIdx + idx} className="paginated-bill-row">
                            <td onClick={() => onBillClick(bill)} style={{ cursor: 'pointer' }}>{bill.tip_factura === 'iesire' ? 'Iesire' : 'Intrare'}</td>
                            <td onClick={() => onBillClick(bill)} style={{ cursor: 'pointer' }}>{bill.client}</td>
                            <td onClick={() => onBillClick(bill)} style={{ cursor: 'pointer' }}>{Number(bill.valoare_totala || 0).toFixed(2)}</td>
                            <td onClick={() => onBillClick(bill)} style={{ cursor: 'pointer' }}>{bill.data_scadenta}</td>
                            <td onClick={() => onBillClick(bill)} style={{ cursor: 'pointer' }}>{bill.platit ? 'Da' : 'Nu'}</td>
                            <td><button className="edit-bill-btn" onClick={e => { e.stopPropagation(); onEditClick(bill); }}>Editează</button></td>
                            <td><button className="edit-bill-btn" onClick={e => { e.stopPropagation(); onDeleteClick(bill); }}>🗑️</button></td>
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