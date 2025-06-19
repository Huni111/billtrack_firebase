import React, { useState, useEffect } from "react";
import "./Bills.css";
import { account } from "./appwriteConfig";
import { ID } from "appwrite";

export default function Settings() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [userForm, setUserForm] = useState({ email: "", password: "", confirm: "" });
    const [loginError, setLoginError] = useState("");
    const [userMsg, setUserMsg] = useState("");

    // Check if user is already logged in
    useEffect(() => {
        const checkSession = async () => {
            try {
                await account.get();
                setLoggedIn(true);
            } catch (error) {
                setLoggedIn(false);
            }
        };
        checkSession();
    }, []);

    // Handle login with Appwrite
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        
        try {
            await account.createEmailSession(loginForm.email, loginForm.password);
            const userData = await account.get();
            setLoggedIn(true);
        } catch (error) {
            setLoginError("Autentificare eșuată: " + error.message);
        }
    };

    // Handle user creation
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setUserMsg("");
        
        // Validation
        if (!userForm.email || !userForm.password || !userForm.confirm) {
            setUserMsg("Toate câmpurile sunt obligatorii!");
            return;
        }
        if (userForm.password !== userForm.confirm) {
            setUserMsg("Parolele nu coincid!");
            return;
        }

        try {
            // Create new user
            await account.create(
                ID.unique(),
                userForm.email,
                userForm.password
            );
            setUserMsg("Utilizator creat cu succes!");
            setUserForm({ email: "", password: "", confirm: "" });
        } catch (error) {
            setUserMsg("Eroare la creare: " + error.message);
        }
    };

    // Handle input changes
    const handleLoginChange = e => {
        const { name, value } = e.target;
        setLoginForm(f => ({ ...f, [name]: value }));
    };

    const handleUserChange = e => {
        const { name, value } = e.target;
        setUserForm(f => ({ ...f, [name]: value }));
    };

    // Logout function
    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            setLoggedIn(false);
            setLoginForm({ email: "", password: "" });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            {!loggedIn ? (
                <form className="add-bill-form" onSubmit={handleLogin}>
                    <h2 style={{marginBottom: 10}}>Autentificare</h2>
                    <div>
                        <label>Email</label>
                        <input 
                            name="email" 
                            type="email"
                            value={loginForm.email} 
                            onChange={handleLoginChange} 
                            required 
                            className="inputs"
                        />
                    </div>
                    <div>
                        <label>Parolă</label>
                        <input 
                            name="password" 
                            type="password" 
                            value={loginForm.password} 
                            onChange={handleLoginChange} 
                            required 
                            className="inputs"
                        />
                    </div>
                    <div style={{marginTop: 16}}>
                        <button className="add-bill-save-btn" type="submit">Login</button>
                    </div>
                    {loginError && <div style={{color: '#e74c3c', marginTop: 8}}>{loginError}</div>}
                </form>
            ) : (
                <div>
                    <form className="add-bill-form" onSubmit={handleCreateUser}>
                        <h2 style={{marginBottom: 10}}>Creează Utilizator Nou</h2>
                        <div>
                            <label>Email</label>
                            <input 
                                name="email" 
                                type="email"
                                value={userForm.email} 
                                onChange={handleUserChange} 
                                required 
                                className="inputs"
                            />
                        </div>
                        <div>
                            <label>Parolă</label>
                            <input 
                                name="password" 
                                type="password" 
                                value={userForm.password} 
                                onChange={handleUserChange} 
                                required 
                                className="inputs"
                            />
                        </div>
                        <div>
                            <label>Confirmă Parola</label>
                            <input 
                                name="confirm" 
                                type="password" 
                                value={userForm.confirm} 
                                onChange={handleUserChange} 
                                required 
                            />
                        </div>
                        <div style={{marginTop: 16}}>
                            <button className="add-bill-save-btn" type="submit">Creează</button>
                        </div>
                        {userMsg && (
                            <div style={{
                                color: userMsg.includes('succes') ? '#16a085' : '#e74c3c', 
                                marginTop: 8
                            }}>
                                {userMsg}
                            </div>
                        )}
                    </form>
                    <div style={{ marginTop: 20 }}>
                        <button 
                            className="add-bill-save-btn"
                            onClick={handleLogout}
                            style={{ background: '#e74c3c' }}
                        >
                            Deloghează-te
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
