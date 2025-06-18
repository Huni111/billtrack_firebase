import React, { useState } from "react";
import "./Bills.css";

export default function Settings() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [userForm, setUserForm] = useState({ username: "", password: "", confirm: "" });
    const [loginError, setLoginError] = useState("");
    const [userMsg, setUserMsg] = useState("");

    // Dummy login: username: admin, password: admin
    const handleLogin = e => {
        e.preventDefault();
        if (loginForm.username === "admin" && loginForm.password === "admin") {
            setLoggedIn(true);
            setLoginError("");
        } else {
            setLoginError("Nume sau parolă greșită!");
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

    const handleCreateUser = e => {
        e.preventDefault();
        if (!userForm.username || !userForm.password) {
            setUserMsg("Toate câmpurile sunt obligatorii!");
            return;
        }
        if (userForm.password !== userForm.confirm) {
            setUserMsg("Parolele nu coincid!");
            return;
        }
        setUserMsg("Utilizator creat cu succes!");
        setUserForm({ username: "", password: "", confirm: "" });
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            {!loggedIn ? (
                <form className="add-bill-form" onSubmit={handleLogin}>
                    <h2 style={{marginBottom: 10}}>Autentificare</h2>
                    <div>
                        <label>Utilizator</label>
                        <input name="username" value={loginForm.username} onChange={handleLoginChange} required />
                    </div>
                    <div>
                        <label>Parolă</label>
                        <input name="password" type="password" value={loginForm.password} onChange={handleLoginChange} required />
                    </div>
                    <div style={{marginTop: 16}}>
                        <button className="add-bill-save-btn" type="submit">Login</button>
                    </div>
                    {loginError && <div style={{color: '#e74c3c', marginTop: 8}}>{loginError}</div>}
                </form>
            ) : (
                <form className="add-bill-form" onSubmit={handleCreateUser}>
                    <h2 style={{marginBottom: 10}}>Creează Utilizator Nou</h2>
                    <div>
                        <label>Utilizator</label>
                        <input name="username" value={userForm.username} onChange={handleUserChange} required />
                    </div>
                    <div>
                        <label>Parolă</label>
                        <input name="password" type="password" value={userForm.password} onChange={handleUserChange} required />
                    </div>
                    <div>
                        <label>Confirmă Parola</label>
                        <input name="confirm" type="password" value={userForm.confirm} onChange={handleUserChange} required />
                    </div>
                    <div style={{marginTop: 16}}>
                        <button className="add-bill-save-btn" type="submit">Creează</button>
                    </div>
                    {userMsg && <div style={{color: userMsg.includes('succes') ? '#16a085' : '#e74c3c', marginTop: 8}}>{userMsg}</div>}
                </form>
            )}
        </div>
    );
}