import React, { useState } from "react";
import "./Bills.css";
import { account } from "./appwriteConfig";
import { ID } from "appwrite"; // Added ID import for unique user IDs
import { useAuth } from "./AuthContext";



export default function Nou() {

    const [userForm, setUserForm] = useState({ username: "", password: "", confirm: "" });
    const [userMsg, setUserMsg] = useState("");
    const { register, errror } = useAuth();









    const handleUserChange = e => {
        const { name, value } = e.target;
        setUserForm(f => ({ ...f, [name]: value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setUserMsg("")
        if (!userForm.username || !userForm.password) {
            setUserMsg("Toate câmpurile sunt obligatorii!");
            return;
        }
        if (userForm.password !== userForm.confirm) {
            setUserMsg("Parolele nu coincid!");
            return;
        }


        try {
            // Create a new user
            await register(userForm.username, userForm.password);

            
            setUserMsg("Utilizator creat cu succes!");
            setUserForm({ username: "", password: "", confirm: "" });
        } catch (err) {
            setUserMsg(errror == "Firebase: Error (auth/email-already-in-use)." ? "Utilizatorul există deja!" : errror)
        }

    };


    return (

        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <form className="add-bill-form" onSubmit={handleCreateUser}>
                <h2 style={{ marginBottom: 10 }}>Creează Utilizator Nou</h2>
                <div>
                    <label>Utilizator</label>
                    <input className='inputs' name="username" value={userForm.username} onChange={handleUserChange} type="email" required />
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
                </div>
                {userMsg && <div style={{ color: userMsg.includes('succes') ? '#16a085' : '#e74c3c', marginTop: 8 }}>{userMsg}</div>}
            </form>
        </div>
    )

}
