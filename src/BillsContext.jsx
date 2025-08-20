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

            const formatDate = (isoString) => {
                if (!isoString) return '';
                return new Date(isoString).toISOString().slice(0, 10);
            };

            const bils = res.documents.map(doc => ({
                $id: doc.$id,
                nr_factura: doc.numar ? String(doc.numar) : '',
                numar: doc.numar ? Number(doc.numar) : '',
                tip_factura: doc.tip_factura ? doc.tip_factura.toLowerCase() : '',
                data_emiteri: formatDate(doc.data_emiteri),
                data_scadenta: formatDate(doc.data_scadenta),
                valoare_fara_tva: doc.valoare_fara_tva || 0,
                valoare_tva: doc.valoare_tva || 0,
                valoare_totala: parseFloat(doc.valoare_totala) || 0,
                platit: !!doc.platit,
                client: doc.client || '',
                serie: doc.serie || '',
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
        // Format the new bill to match our data structure
        const formattedBill = {
            $id: newBill.$id,
            nr_factura: newBill.numar ? String(newBill.numar) : '',
            numar: newBill.numar ? Number(newBill.numar) : '',
            tip_factura: newBill.tip_factura ? newBill.tip_factura.toLowerCase() : '',
            data_emiteri: newBill.data_emiteri,
            data_scadenta: newBill.data_scadenta,
            valoare_fara_tva: newBill.valoare_fara_tva || 0,
            valoare_tva: newBill.valoare_tva || 0,
            valoare_totala: parseFloat(newBill.valoare_totala) || 0,
            platit: !!newBill.platit,
            client: newBill.client || '',
            serie: newBill.serie || '',
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