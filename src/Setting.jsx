import React, { useState, useEffect } from "react";
import "./Bills.css";
import { useAuth } from "./AuthContext"; // adjust the path if needed

export default function Settings() {
    const { user, login, logout, register } = useAuth();
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [userForm, setUserForm] = useState({ email: "", password: "", confirm: "" });
    const [loginError, setLoginError] = useState("");
    const [userMsg, setUserMsg] = useState("");

    


    // Dummy login: email: admin, password: admin
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        try {
            await login(loginForm.email, loginForm.password);
        } catch (error) {
            setLoginError("Autentificare eșuată: " + error.message);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setUserMsg("");
        if (!userForm.email || !userForm.password) {
            setUserMsg("Toate câmpurile sunt obligatorii!");
            return;
        }
        if (userForm.password !== userForm.confirm) {
            setUserMsg("Parolele nu coincid!");
            return;
        }
        try {
            await register(userForm.email, userForm.password);
            setUserMsg("Utilizator creat cu succes!");
            setUserForm({ email: "", password: "", confirm: "" });
        } catch (error) {
            setUserMsg("Eroare la creare: " + error.message);
        }
    };

    const handleLoginChange = e => {
        const { name, value } = e.target;
        setLoginForm(f => ({ ...f, [name]: value }));
    };

    const handleUserChange = e => {
        const { name, value } = e.target;
        setUserForm(f => ({ ...f, [name]: value }));
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            {!user ? (
                <form className="add-bill-form" onSubmit={handleLogin}>
                    <h2 style={{ marginBottom: 10 }}>Autentificare</h2>
                    <div>
                        <label>E-mail</label>
                        <input className='inputs' name="email" type="email" 
                            placeholder="Email" value={loginForm.email} onChange={handleLoginChange} required />
                    </div>
                    <div>
                        <label>Parolă</label>
                        <input className='inputs' placeholder="password" name="password" type="password" value={loginForm.password} onChange={handleLoginChange} required />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <button className="add-bill-save-btn" type="submit">Login</button>
                    </div>
                    {loginError && <div style={{ color: '#e74c3c', marginTop: 8 }}>{loginError}</div>}
                </form>
            ) : (
                <form className="add-bill-form" onSubmit={handleCreateUser}>
                    <h2 style={{ marginBottom: 10 }}>Creează Utilizator Nou</h2>
                    <div>
                        <label>Email</label>
                        <input className='inputs'  type="email" name="email" value={userForm.email} onChange={handleUserChange} required />
                    </div>
                    <div>
                        <label>Parolă</label>
                        <input className='inputs' name="password" type="password" value={userForm.password} onChange={handleUserChange} required />
                    </div>
                    <div>
                        <label>Confirmă Parola</label>
                        <input className='inputs' name="confirm" type="password" value={userForm.confirm} onChange={handleUserChange} required />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <button className="add-bill-save-btn" type="submit">Creează</button>
                        <button className="add-bill-save-btn" type="buton" onClick={handleLogout}>Logout</button>
                    </div>
                    {userMsg && <div style={{ color: userMsg.includes('succes') ? '#16a085' : '#e74c3c', marginTop: 8 }}>{userMsg}</div>}
                </form>
            )}
        </div>
    );
}