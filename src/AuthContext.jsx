import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errror, setError] = useState(null);


 useEffect(() => {
    // This is the core Firebase authentication listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        
        console.log(currentUser);
        setUser(currentUser);
      } else {
        // No user is signed in.
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
    
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = userCredential.user
        setUser(userData);
        console.log(userData);
    };

    // Logout function
    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    // Register function
    const register = async (email, password) => {
        try{
        await createUserWithEmailAndPassword(auth, email, password);
        }catch(error){
            console.log(error.message);
            setError(error.message);
            throw error;
        }
        
    
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, errror }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for easy access
export function useAuth() {
    return useContext(AuthContext);
}
