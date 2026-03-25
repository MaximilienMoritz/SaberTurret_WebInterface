import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Exemple ultra simple (à remplacer par un vrai check plus tard là c'est pas ouf)
        if (username === "admin" && password === "sabre") {
            localStorage.setItem("auth", "true");
            navigate("/index");
        } else {
            alert("⛔ Identifiants incorrects");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black relative overflow-hidden">
            {/* Effet grille / scanlin */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[length:3px_3px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 backdrop-blur-sm"></div>

            {/* Formulaire */}
            <form
                onSubmit={handleLogin}
                className="relative z-10 flex flex-col p-8 border border-green-400/30 rounded-xl bg-black/60 shadow-[0_0_20px_rgba(0,255,0,0.2)] w-80"
            >
                <h2 className="text-green-400 text-2xl font-mono text-center mb-6">
                    S.A.B.R.E Console LOGIN
                </h2>

                <label className="text-green-300 text-xs mb-1">Username</label>
                <input
                    className="bg-black/70 border border-green-500/30 text-green-200 p-2 mb-4 rounded outline-none focus:border-green-400"
                    value={username}
                    autoFocus={true}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label className="text-green-300 text-xs mb-1">Password</label>
                <input
                    type="password"
                    className="bg-black/70 border border-green-500/30 text-green-200 p-2 mb-6 rounded outline-none focus:border-green-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="border border-green-400 text-green-400 hover:bg-green-500 hover:text-black transition font-bold py-2 rounded"
                >
                    LOGIN
                </button>
            </form>
        </div>
    );
};
