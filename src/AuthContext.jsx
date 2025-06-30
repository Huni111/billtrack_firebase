import React, { createContext, useContext, useState, useEffect } from "react";
import { account } from "./appwriteConfig";
import { ID } from "appwrite";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.getSession("current");
                if (session) {
                    const userData = await account.get();
                    setUser(userData);
                }
            } catch (error) {
                // No active session or error
                setUser(null);
            } 
        };
        checkSession();
    }, []);


    // Login function
    const login = async (email, password) => {
        await account.deleteSession("current");
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

        await account.create(
            ID.unique(), // Correct function call
            email, // Use state values
            password,

        );
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
