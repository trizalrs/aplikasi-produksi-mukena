// src/components/GoogleDriveSync.jsx

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { gapi } from 'gapi-script';
import { XCircleIcon, UserIcon } from './Icons';

const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile';
const FILENAME = 'database-produksi-mukena.json';

const GoogleDriveSync = forwardRef(({ getAllData, restoreAllData, showNotification, handleKonfirmasi, resetKonfirmasi }, ref) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isGapiReady, setIsGapiReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const isInsideWebView = () => !!window.Android;

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
        gapi.load('client', start);
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

    const handleLoginManual = () => {
        const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const REDIRECT_URI = isInsideWebView() ? "https://trizalrs.github.io/aplikasi-produksi-mukena/" : window.location.origin + window.location.pathname;
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
        window.location.href = url;
    };

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            if (accessToken) {
                const tokenData = { access_token: accessToken };
                setToken(tokenData);
                localStorage.setItem('googleToken', JSON.stringify(tokenData));
                gapi.client.setToken(tokenData);
                fetchUserInfo(accessToken);
                window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            }
        }
    }, [fetchUserInfo]);

    useEffect(() => {
        if (isGapiReady) {
            const storedToken = localStorage.getItem('googleToken');
            if (storedToken) {
                const tokenData = JSON.parse(storedToken);
                gapi.client.setToken(tokenData);
                setToken(tokenData);
                const storedUser = localStorage.getItem('googleUser');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    fetchUserInfo(tokenData.access_token);
                }
            }
        }
    }, [isGapiReady, fetchUserInfo]);

    const handleDisconnect = () => { handleKonfirmasi('Putuskan Hubungan?', 'Anda akan diputuskan dari Google Drive.', () => { resetKonfirmasi(); setUser(null); setToken(null); localStorage.removeItem('googleUser'); localStorage.removeItem('googleToken'); gapi.client.setToken(null); showNotification('Hubungan dengan Google Drive telah diputuskan.', 'warning'); }); };
    
    // --- FUNGSI-FUNGSI UTAMA YANG DIPERBARUI TOTAL ---

    const findFileId = async () => {
        try {
            const response = await gapi.client.drive.files.list({
                q: `name='${FILENAME}' and trashed=false`,
                fields: 'files(id, name)',
                spaces: 'appDataFolder',
            });
            return response.result.files?.length > 0 ? response.result.files[0].id : null;
        } catch (err) {
            console.error("Error finding file:", err);
            throw new Error("Gagal mencari file di Google Drive.");
        }
    };
    
    const handleBackup = useCallback(async () => {
        if (!token) {
            showNotification('Harap hubungkan ke Google Drive.', 'error');
            return;
        }
        setIsProcessing(true);
        showNotification('Memulai backup...', 'warning');

        try {
            const fileId = await findFileId();
            const dataToBackup = getAllData();
            const jsonData = JSON.stringify(dataToBackup, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = async () => {
                const base64Data = reader.result.split(',')[1];
                const boundary = '-------314159265358979323846';
                const delimiter = `\r\n--${boundary}\r\n`;
                const close_delim = `\r\n--${boundary}--`;

                const metadata = {
                    name: FILENAME,
                    mimeType: 'application/json',
                };
                if (!fileId) {
                    metadata.parents = ['appDataFolder'];
                }

                const multipartRequestBody =
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: application/json\r\n' +
                    'Content-Transfer-Encoding: base64\r\n' +
                    '\r\n' +
                    base64Data +
                    close_delim;
                
                const request = gapi.client.request({
                    'path': `/upload/drive/v3/files${fileId ? `/${fileId}` : ''}`,
                    'method': fileId ? 'PATCH' : 'POST',
                    'params': { 'uploadType': 'multipart' },
                    'headers': { 'Content-Type': `multipart/related; boundary="${boundary}"` },
                    'body': multipartRequestBody
                });

                await request;
                showNotification(fileId ? 'Backup berhasil diperbarui!' : 'File backup baru berhasil dibuat!', 'success');
                setIsProcessing(false);
            };
        } catch (error) {
            showNotification(`Backup Gagal: ${error.message || 'Error tidak diketahui'}`, 'error');
            setIsProcessing(false);
        }
    }, [token, getAllData, showNotification]);

    const handleRestore = useCallback(async () => {
        if (!token) {
            showNotification('Harap hubungkan ke Google Drive.', 'error');
            return;
        }
        handleKonfirmasi('Restore dari Drive?', 'Ini akan menimpa semua data saat ini. Lanjutkan?', async () => {
            resetKonfirmasi();
            setIsProcessing(true);
            showNotification('Mencari data...', 'warning');
            try {
                const fileId = await findFileId();
                if (!fileId) {
                    throw new Error('File backup tidak ditemukan.');
                }
                const response = await gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                });
                restoreAllData(response.result); // Di gapi v2, hasil ada di `result`, bukan `body`
                showNotification("Data berhasil dipulihkan!");
            } catch (error) {
                const errorMessage = error.result?.error?.message || error.message || 'Error tidak diketahui';
                showNotification(`Restore Gagal: ${errorMessage}`, 'error');
            } finally {
                setIsProcessing(false);
            }
        });
    }, [token, showNotification, handleKonfirmasi, resetKonfirmasi, restoreAllData]);

    useImperativeHandle(ref, () => ({ backup: handleBackup, isConnected: !!user }));
    
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