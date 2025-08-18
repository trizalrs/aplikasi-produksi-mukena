// src/components/LoginPage.jsx

import React, { useState } from 'react';

function LoginPage({ authData, onSetup, onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isSetupMode = !authData;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (isSetupMode) {
            if (password.length < 6) {
                setError('Password minimal harus 6 karakter.');
                return;
            }
            onSetup(username, password);
        } else {
            const success = onLogin(username, password);
            if (!success) {
                setError('Username atau password salah.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Aplikasi Produksi Mukena
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    {isSetupMode ? "Pengaturan Akun Pertama Kali" : "Silakan Login"}
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            {isSetupMode ? "Simpan & Masuk" : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;