// src/useAuth.jsx

import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const useAuth = () => {
    // Kunci rahasia untuk "mengasinkan" hash. Ganti dengan string acak Anda sendiri.
    const SALT = 'secret-key-produksi-mukena-12345';
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authData, setAuthData] = useState(() => {
        try {
            const storedData = localStorage.getItem('authData');
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            return null;
        }
    });

    // Cek status login setiap kali aplikasi dimuat
    useEffect(() => {
        // Otomatis login jika user sudah pernah login sebelumnya
        if (localStorage.getItem('isAuthenticated') === 'true' && authData) {
            setIsAuthenticated(true);
        }
    }, [authData]);

    const hashPassword = (password) => {
        return CryptoJS.SHA256(password + SALT).toString();
    };

    const setup = (username, password) => {
        if (!username || !password) return false;
        const hashedPassword = hashPassword(password);
        const newAuthData = { username, hashedPassword };
        localStorage.setItem('authData', JSON.stringify(newAuthData));
        setAuthData(newAuthData);
        login(username, password); // Langsung login setelah setup
        return true;
    };

    const login = (username, password) => {
        if (!authData || !username || !password) return false;
        
        const hashedPassword = hashPassword(password);
        if (username === authData.username && hashedPassword === authData.hashedPassword) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return { isAuthenticated, authData, setup, login, logout };
};

export default useAuth;