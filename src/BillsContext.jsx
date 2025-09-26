import React, { createContext, useContext, useState, useEffect } from 'react';


import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from "firebase/firestore";
import { useAuth } from "./AuthContext";

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
    const [error, setError] = useState(null);
    const { user } = useAuth();


    const COLLECTION_NAME = 'companies';

    const ensureUserLoggedIn = () => {
  if (!user) {
    throw new Error("User must be logged in to perform this operation");
  }
  return user;
};

    const formatDate = (dateString) => {
        if (!dateString) return '';
        // If it's already in YYYY-MM-DD format, return as is
        if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        // Otherwise, convert from ISO format to YYYY-MM-DD
        return new Date(dateString).toISOString().slice(0, 10);
    };

    const fetchBills = async () => {
        try {
            setLoading(true);
            const billsRef = collection(db, 'companies'); // Hardcode or use a const for the collection name
            const q = query(billsRef, orderBy('data_emiteri', 'desc'), limit(5000));
            const querySnapshot = await getDocs(q);

            const bils = querySnapshot.docs.map(doc => ({
                id: doc.id, // Firestore 'id'
                tip_factura: doc.data().tip_factura || "iesire",
                client: doc.data().client || "",
                valoare_totala: doc.data().valoare_totala || "",
                data_emiteri: formatDate(doc.data().data_emiteri),
                data_scadenta: formatDate(doc.data().data_scadenta),
                platit: !!doc.data().platit,
                serie: doc.data().serie || "",
                numar: doc.data().numar || ""
            }));

            setBills(bils);
        } catch (error) {
            console.error("❌ Firebase error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
        console.log(bills)
    }, []);

    const addBill = async (newBill) => {



        // Format the new bill to match our data structure
        const formattedData = {
            tip_factura: newBill.tip_factura || "iesire",
            client: newBill.client || "",
            valoare_totala: newBill.valoare_totala || "",
            data_emiteri: formatDate(newBill.data_emiteri),
            data_scadenta: formatDate(newBill.data_scadenta),
            platit: !!newBill.platit,
            serie: newBill.serie || "",
            numar: newBill.numar || ""
        };

        const billsRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(billsRef, formattedData);

        const formattedBill = {
            id: docRef.id,
            ...formattedData
        };

        setBills(prevBills => {
            const updatedBills = [formattedBill, ...prevBills];
            // Sort by emission date (newest first)
            return updatedBills.sort((a, b) => new Date(b.data_emiteri) - new Date(a.data_emiteri));
        });


    };





    const updateBill = async (updatedBill) => {
        try {
            const billDocRef = doc(db, COLLECTION_NAME, updatedBill.id);
            await updateDoc(billDocRef, {
                tip_factura: updatedBill.tip_factura,
                client: updatedBill.client,
                valoare_totala: updatedBill.valoare_totala,
                data_emiteri: updatedBill.data_emiteri,
                data_scadenta: updatedBill.data_scadenta,
                platit: updatedBill.platit,
                serie: updatedBill.serie,
                numar: updatedBill.numar
            });

            await fetchBills();

        } catch (error) {
            console.error("Failed to update bill:", error);
            throw error;
        }
    };

    const deleteBill = async (billId) => {

        try {
            ensureUserLoggedIn();
            const billDocRef = doc(db, COLLECTION_NAME, billId);
            await deleteDoc(billDocRef);
            await fetchBills();
             setError(null)
        } catch (error) {
            setError("Trebuie sa te logez pentru a sterge data!");
            console.error("Failed to delete bill:", error);
            throw error;
        }
    };

    const value = {
        bills,
        loading,
        addBill,
        updateBill,
        deleteBill,
        refetchBills: fetchBills,
        error,
        setError
    };

    return (
        <BillsContext.Provider value={value}>
            {children}
        </BillsContext.Provider>
    );
};