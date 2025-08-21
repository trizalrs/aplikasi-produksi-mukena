// src/components/GoogleDriveSync.jsx

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { XCircleIcon } from './Icons';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY; // <-- Kunci baru kita
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
const FILENAME = 'database-produksi-mukena.json';

const GoogleDriveSync = forwardRef(({ getAllData, restoreAllData, showNotification, handleKonfirmasi, resetKonfirmasi }, ref) => {
    const [gapiReady, setGapiReady] = useState(false);
    const [gisReady, setGisReady] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pictureUrl, setPictureUrl] = useState(null);

    const fetchUserInfo = useCallback(async (tokenResponse) => { /* ... (Tidak ada perubahan di sini) ... */ try { const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` } }); if (!res.ok) throw new Error('Gagal mengambil info user.'); const userInfo = await res.json(); const userData = { name: userInfo.name }; setUser(userData); localStorage.setItem('googleUser', JSON.stringify(userData)); const pictureResponse = await fetch(userInfo.picture, { headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` } }); if (!pictureResponse.ok) throw new Error('Gagal mengunduh gambar profil.'); const imageBlob = await pictureResponse.blob(); const localUrl = URL.createObjectURL(imageBlob); setPictureUrl(localUrl); } catch (error) { console.error(error); showNotification('Gagal mendapatkan info user dari Google.', 'error'); } }, [showNotification]);

    useEffect(() => {
        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.async = true; gapiScript.defer = true;
        gapiScript.onload = () => window.gapi.load('client', () => {
            // <-- DIPERBARUI: Tambahkan apiKey saat inisialisasi -->
            window.gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] })
                .then(() => setGapiReady(true))
                .catch(err => console.error("Error initializing gapi client", err));
        });
        document.body.appendChild(gapiScript);

        const gisScript = document.createElement('script');
        gisScript.src = 'https://accounts.google.com/gsi/client';
        gisScript.async = true; gisScript.defer = true;
        gisScript.onload = () => setGisReady(true);
        document.body.appendChild(gisScript);
        return () => { document.body.removeChild(gapiScript); document.body.removeChild(gisScript); }
    }, []);

    useEffect(() => {
        if (gapiReady && gisReady) {
            const client = window.google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES, callback: (tokenResponse) => { if (tokenResponse && tokenResponse.access_token) { const expires_at = Date.now() + tokenResponse.expires_in * 1000; const tokenToStore = { ...tokenResponse, expires_at }; localStorage.setItem('googleToken', JSON.stringify(tokenToStore)); window.gapi.client.setToken(tokenToStore); fetchUserInfo(tokenToStore); showNotification(`Berhasil terhubung!`, 'success'); } }, });
            setTokenClient(client);
            const storedToken = localStorage.getItem('googleToken');
            if (storedToken) {
                const tokenData = JSON.parse(storedToken);
                if (tokenData.expires_at > Date.now()) {
                    window.gapi.client.setToken(tokenData);
                    setToken(tokenData);
                    const storedUser = localStorage.getItem('googleUser');
                    if(storedUser){ setUser(JSON.parse(storedUser)); fetchUserInfo(tokenData); }
                } else {
                    localStorage.removeItem('googleToken');
                    localStorage.removeItem('googleUser');
                }
            }
        }
    }, [gapiReady, gisReady, fetchUserInfo]);

    const handleLogin = () => { if (tokenClient) { tokenClient.requestAccessToken({ prompt: 'consent' }); } };
    const handleDisconnect = () => { handleKonfirmasi('Putuskan Hubungan?', 'Anda akan diputuskan dari Google Drive dan perlu menghubungkan ulang nanti.', () => { resetKonfirmasi(); setUser(null); setToken(null); setPictureUrl(null); localStorage.removeItem('googleUser'); localStorage.removeItem('googleToken'); if (window.gapi?.client) { window.gapi.client.setToken(null); } window.location.reload(); }); };
    const findFileId = async () => { /* ... (Tidak ada perubahan di sini) ... */ try { const response = await window.gapi.client.drive.files.list({ q: `name='${FILENAME}' and trashed=false`, fields: 'files(id, name)', spaces: 'appDataFolder', }); if (response.result.files?.length > 0) { return response.result.files[0].id; } return null; } catch (err) { console.error("Error finding file:", err); throw new Error("Gagal mencari file di folder aplikasi Drive."); } };
    const handleBackup = useCallback(async () => { /* ... (Tidak ada perubahan di sini) ... */ if (!token) { showNotification('Sesi Google Drive tidak valid.', 'error'); return Promise.reject(); } setIsProcessing(true); showNotification('Memulai backup...', 'warning'); try { const fileId = await findFileId(); const dataToBackup = getAllData(); const jsonData = JSON.stringify(dataToBackup, null, 2); const blob = new Blob([jsonData], { type: 'application/json' }); const metadata = { name: FILENAME, mimeType: 'application/json', parents: ['appDataFolder'] }; const form = new FormData(); if (fileId) { form.append('metadata', new Blob([JSON.stringify({mimeType: 'application/json'})], {type: 'application/json'})); form.append('file', blob); await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token.access_token}` }, body: form }); showNotification('Backup berhasil diperbarui!', 'success'); } else { form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'})); form.append('file', blob); await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { 'Authorization': `Bearer ${token.access_token}` }, body: form }); showNotification('File backup baru berhasil dibuat!', 'success'); } return Promise.resolve(); } catch (error) { showNotification(`Backup Gagal: ${error.message}`, 'error'); return Promise.reject(error); } finally { setIsProcessing(false); } }, [token, getAllData, showNotification]);
    useImperativeHandle(ref, () => ({ backup: handleBackup, isConnected: !!user }));
    const handleRestore = () => { /* ... (Tidak ada perubahan di sini) ... */ if (!token) { showNotification('Harap hubungkan ke Google Drive.', 'error'); return; } handleKonfirmasi('Restore dari Drive?', 'Ini akan menimpa semua data saat ini. Lanjutkan?', async () => { resetKonfirmasi(); setIsProcessing(true); showNotification('Mencari data...', 'warning'); try { const fileId = await findFileId(); if (!fileId) { showNotification('File backup tidak ditemukan.', 'error'); setIsProcessing(false); return; } const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers: { 'Authorization': `Bearer ${token.access_token}` } }); if (!res.ok) throw new Error('Gagal mengunduh data.'); const restoredData = await res.json(); restoreAllData(restoredData); } catch (error) { showNotification(`Restore Gagal: ${error.message}`, 'error'); } finally { setIsProcessing(false); } }); };
    
    return (
        <div ref={ref} className="flex items-center gap-2">
            {user ? (
                <>
                    <button onClick={handleBackup} disabled={isProcessing} className="flex-shrink-0 flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg text-sm disabled:bg-gray-400"> {isProcessing ? 'Memproses...' : 'Backup'} </button>
                    <button onClick={handleRestore} disabled={isProcessing} className="flex-shrink-0 flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg text-sm disabled:bg-gray-400"> {isProcessing ? 'Memproses...' : 'Restore'} </button>
                    <div onClick={handleDisconnect} className="flex-shrink-0 flex items-center space-x-2 cursor-pointer p-1 rounded-md hover:bg-gray-100" title="Putuskan Hubungan">
                        {pictureUrl && <img src={pictureUrl} alt="user" className="w-6 h-6 rounded-full" />}
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.name}</span>
                        <XCircleIcon className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </div>
                </>
            ) : (
                <button onClick={handleLogin} className="flex-shrink-0 flex items-center bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-3 rounded-lg text-sm"> Hubungkan ke Google Drive </button>
            )}
        </div>
    );
});

export default GoogleDriveSync;