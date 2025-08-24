// src/components/GoogleDriveSync.jsx

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
// Hapus useGoogleLogin karena kita tidak akan memakainya lagi untuk memicu login
import { gapi } from 'gapi-script';
import { XCircleIcon, UserIcon } from './Icons';

const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile';
const FILENAME = 'database-produksi-mukena.json';

const GoogleDriveSync = forwardRef(({ getAllData, restoreAllData, showNotification, handleKonfirmasi, resetKonfirmasi }, ref) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isGapiReady, setIsGapiReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            }).then(() => { setIsGapiReady(true); }).catch(err => console.error("GAPI Init Error:", err));
        }
        gapi.load('client:auth2', start);
    }, []);

    const fetchUserInfo = useCallback(async (accessToken) => {
        try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error('Gagal mengambil info user.');
            const userInfo = await res.json();
            const userData = { name: userInfo.name };
            setUser(userData);
            localStorage.setItem('googleUser', JSON.stringify(userData));
        } catch (error) {
            console.error(error);
            showNotification(error.message, 'error');
            setUser(null);
            setToken(null);
            localStorage.removeItem('googleUser');
            localStorage.removeItem('googleToken');
        }
    }, [showNotification]);

    // --- FUNGSI LOGIN MANUAL YANG BARU ---
    const handleLoginManual = () => {
        const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const REDIRECT_URI = "https://trizalrs.github.io/aplikasi-produksi-mukena/";
        
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        
        const params = {
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'token',
            scope: SCOPES,
            include_granted_scopes: 'true',
            state: 'pass-through value'
        };
        
        const url = `${oauth2Endpoint}?${new URLSearchParams(params)}`;
        
        // Langsung arahkan halaman ke URL otentikasi Google
        window.location.href = url;
    };

    // --- useEffect BARU UNTUK MENANGKAP TOKEN SETELAH REDIRECT ---
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1)); // Hapus '#' di awal
            const accessToken = params.get('access_token');
            
            if (accessToken) {
                const tokenData = {
                    access_token: accessToken,
                    // Kita bisa menambahkan data lain jika ada, seperti expires_in
                };
                setToken(tokenData);
                localStorage.setItem('googleToken', JSON.stringify(tokenData));
                fetchUserInfo(accessToken);
                
                // Bersihkan hash dari URL agar terlihat rapi
                window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            }
        }
    }, [fetchUserInfo]);

    useEffect(() => {
        if (isGapiReady) {
            const storedToken = localStorage.getItem('googleToken');
            if (storedToken) {
                const tokenData = JSON.parse(storedToken);
                setToken(tokenData); // Pastikan token di-set di state
                const storedUser = localStorage.getItem('googleUser');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    // Jika user belum ada tapi token ada, coba ambil info user lagi
                    fetchUserInfo(tokenData.access_token);
                }
            }
        }
    }, [isGapiReady, fetchUserInfo]);

    const handleDisconnect = () => { handleKonfirmasi('Putuskan Hubungan?', 'Anda akan diputuskan dari Google Drive.', () => { resetKonfirmasi(); setUser(null); setToken(null); localStorage.removeItem('googleUser'); localStorage.removeItem('googleToken'); showNotification('Hubungan dengan Google Drive telah diputuskan.', 'warning'); }); };
    const findFileId = async () => { try { const res = await gapi.client.drive.files.list({ q: `name='${FILENAME}' and trashed=false`, fields: 'files(id, name)', spaces: 'appDataFolder', }); return res.result.files?.length > 0 ? res.result.files[0].id : null; } catch (err) { console.error("Error finding file:", err); throw err; } };
    
    const handleBackup = useCallback(async () => { /* ... (fungsi ini tidak berubah) ... */ }, [token, getAllData, showNotification]);

    useImperativeHandle(ref, () => ({ backup: handleBackup, isConnected: !!user, }));
    const handleRestore = () => { /* ... (fungsi ini tidak berubah) ... */ };
    
    if (!isGapiReady) { return <div className="text-sm text-gray-500 p-2">Menyiapkan layanan Drive...</div>; }

    return (
        <div ref={ref} className="flex items-center gap-2">
            {user ? (
                <>
                    <button onClick={handleBackup} disabled={isProcessing} className="flex-shrink-0 flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg text-sm disabled:bg-gray-400"> {isProcessing ? 'Memproses...' : 'Backup'} </button>
                    <button onClick={handleRestore} disabled={isProcessing} className="flex-shrink-0 flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg text-sm disabled:bg-gray-400"> {isProcessing ? 'Memproses...' : 'Restore'} </button>
                    <div onClick={handleDisconnect} className="flex-shrink-0 flex items-center space-x-2 cursor-pointer p-1 rounded-md hover:bg-gray-100" title="Putuskan Hubungan">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.name}</span>
                        <XCircleIcon className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </div>
                </>
            ) : (
                <button onClick={handleLoginManual} className="flex-shrink-0 flex items-center bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-3 rounded-lg text-sm"> Hubungkan ke Google Drive </button>
            )}
        </div>
    );
});

export default GoogleDriveSync;