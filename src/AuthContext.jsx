import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


// useEffect(() => {
//         const checkSession = async () => {
//             try {
//                 const session = await account.getSession("current");

//                 if (session) {
//                     const userData = await account.get();
//                     setUser(userData);
//                 }
//             } catch (error) {
//                 // No active session or error
//                 setUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         checkSession();
//     }, []);

    //logout inaktivitas utan
    //  useEffect(() => {
    //     if (!user) return;

    //     const timeout = setTimeout(() => {
    //         logout();
    //         console.log("User auto-logged out after 60 minutes");
    //     }, 60 * 60 * 1000);

    //     return () => clearTimeout(timeout);
    // }, [user]);


    // Login function
    const login = async (email, password) => {
    
        await account.createEmailPasswordSession(email, password);
        const userData = await account.get();
        setUser(userData);
    };

    // Logout function
    const logout = async () => {
        await account.deleteSession("current");
        setUser(null);
    };

    // Register function
    const register = async (email, password) => {

        await createUserWithEmailAndPassword(auth, email, password);
       
        setUser(userData)
    
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for easy access
export function useAuth() {
    return useContext(AuthContext);
}
