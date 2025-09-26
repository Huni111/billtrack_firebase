// ConfirmDeleteModal.jsx

import React, { useState } from 'react';
import { useBills } from "./BillsContext"

// Custom hook
export function useDeleteConfirmation() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const {deleteBill, error, setError } = useBills();
 


  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
    setError(null);
  };

const confirmDelete = async () => {
  try {
    await deleteBill(itemToDelete.id); // Await async deletion
    setDeleteModalOpen(false);
    setItemToDelete(null);
    setLocalError(null); // Clear previous errors if any
  } catch (e) {
    throw e
  }
};

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return {
    deleteModalOpen,
    itemToDelete,
    openDeleteModal,
    confirmDelete,
    cancelDelete,
    error
  };
}

// Modal component
export function ConfirmDeleteModal({ open, bill, onConfirm, onCancel, error }) {
  if (!open || !bill) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the invoice for <strong>{bill.client + " " + bill.serie + " " + bill.numar}</strong>?</p>
        {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
        <button onClick={() => onConfirm(bill.id)}>Yes, delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
