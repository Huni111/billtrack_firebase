import React, { createContext, useContext, useState, useEffect } from "react";
import { account } from "./appwriteConfig";
import { ID } from "appwrite";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await account.get();
                setUser(userData);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    // Login function
    const login = async (email, password) => {
        await account.createEmailSession(email, password);
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
