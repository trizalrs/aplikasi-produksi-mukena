// src/useAuth.jsx

import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const useAuth = () => {
    const SALT = 'secret-key-produksi-mukena-12345';
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // <-- DIPERBARUI: Fungsi setAuthData diekspos agar bisa diupdate dari luar -->
    const [authData, setAuthData] = useState(() => {
        try {
            const storedData = localStorage.getItem('authData');
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            return null;
        }
    });

    useEffect(() => {
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
        login(username, password);
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

    // <-- DIPERBARUI: Tambahkan setAuthData ke return -->
    return { isAuthenticated, authData, setup, login, logout, setAuthData };
};

export default useAuth;