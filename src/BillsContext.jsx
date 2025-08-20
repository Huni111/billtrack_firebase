import React, { createContext, useContext, useState, useEffect } from 'react';
import { dB } from "./appwriteConfig";
import { Query } from "appwrite";

const BillsContext = createContext();

export const useBills = () => {
    const context = useContext(BillsContext);
    if (!context) {
        throw new Error('useBills must be used within a BillsProvider');
    }
    return context;
};

export const BillsProvider = ({ children }) => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    const COMPANIES_COLLECTION_ID = import.meta.env.VITE_COMPANIES_COLLECTION_ID;
    const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;

    const fetchBills = async () => {
        try {
            setLoading(true);
            const res = await dB.listDocuments(DATABASE_ID, COMPANIES_COLLECTION_ID, [Query.limit(5000)]);

            const formatDate = (dateString) => {
                if (!dateString) return '';
                // If it's already in YYYY-MM-DD format, return as is
                if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return dateString;
                }
                // Otherwise, convert from ISO format to YYYY-MM-DD
                return new Date(dateString).toISOString().slice(0, 10);
            };

            const bils = res.documents.map(doc => ({
                $id: doc.$id,
                tip_factura: doc.tip_factura || "iesire",
                client: doc.client || "",
                valoare_totala: doc.valoare_totala || "",
                data_emiteri: formatDate(doc.data_emiteri),
                data_scadenta: formatDate(doc.data_scadenta),
                platit: !!doc.platit,
                serie: doc.serie || "",
                numar: doc.numar || ""
            }));

            // Sort by emission date (newest first)
            bils.sort((a, b) => new Date(b.data_emiteri) - new Date(a.data_emiteri));
            setBills(bils);
        } catch (error) {
            console.error("❌ Appwrite error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const addBill = (newBill) => {
        const formatDate = (dateString) => {
            if (!dateString) return '';
            // If it's already in YYYY-MM-DD format, return as is
            if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateString;
            }
            // Otherwise, convert from ISO format to YYYY-MM-DD
            return new Date(dateString).toISOString().slice(0, 10);
        };

        // Format the new bill to match our data structure
        const formattedBill = {
            $id: newBill.$id,
            tip_factura: newBill.tip_factura || "iesire",
            client: newBill.client || "",
            valoare_totala: newBill.valoare_totala || "",
            data_emiteri: formatDate(newBill.data_emiteri),
            data_scadenta: formatDate(newBill.data_scadenta),
            platit: !!newBill.platit,
            serie: newBill.serie || "",
            numar: newBill.numar || ""
        };

        setBills(prevBills => {
            const updatedBills = [formattedBill, ...prevBills];
            // Sort by emission date (newest first)
            return updatedBills.sort((a, b) => new Date(b.data_emiteri) - new Date(a.data_emiteri));
        });
    };

    const updateBill = (updatedBill) => {
        setBills(prevBills =>
            prevBills.map(bill => (bill.$id === updatedBill.$id ? updatedBill : bill))
        );
    };

    const deleteBill = (billId) => {
        setBills(prevBills => prevBills.filter(bill => bill.$id !== billId));
    };

    const value = {
        bills,
        loading,
        addBill,
        updateBill,
        deleteBill,
        refetchBills: fetchBills
    };

    return (
        <BillsContext.Provider value={value}>
            {children}
        </BillsContext.Provider>
    );
};