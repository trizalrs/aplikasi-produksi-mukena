// src/components/GoogleDriveSync.jsx

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { XCircleIcon } from './Icons';

const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
const FILENAME = 'database-produksi-mukena.json';

const GoogleDriveSync = forwardRef(({ getAllData, restoreAllData, showNotification, handleKonfirmasi, resetKonfirmasi }, ref) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pictureUrl, setPictureUrl] = useState(null);

    const fetchUserInfo = useCallback(async (tokenResponse) => {
        try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` },
            });
            if (!res.ok) throw new Error('Gagal mengambil info user.');
            const userInfo = await res.json();
            const userData = { name: userInfo.name };
            setUser(userData);
            localStorage.setItem('googleUser', JSON.stringify(userData));

            const pictureResponse = await fetch(userInfo.picture, {
                headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` }
            });
            if (!pictureResponse.ok) throw new Error('Gagal mengunduh gambar profil.');
            const imageBlob = await pictureResponse.blob();
            const localUrl = URL.createObjectURL(imageBlob);
            setPictureUrl(localUrl);

        } catch (error) {
            console.error(error);
            showNotification('Gagal mendapatkan info user dari Google.', 'error');
        }
    }, [showNotification]);

    const handleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            const tokenWithExpiry = { ...tokenResponse, expires_at: Date.now() + tokenResponse.expires_in * 1000 };
            setToken(tokenWithExpiry);
            localStorage.setItem('googleToken', JSON.stringify(tokenWithExpiry));
            fetchUserInfo(tokenWithExpiry);
            showNotification(`Berhasil terhubung!`, 'success');
        },
        scope: SCOPES,
        onError: (error) => showNotification(`Login Google Gagal: ${error.message || 'Error tidak diketahui'}`, 'error'),
    });
    
    useEffect(() => {
        const storedToken = localStorage.getItem('googleToken');
        if (storedToken) {
            const tokenData = JSON.parse(storedToken);
            if (tokenData.expires_at > Date.now()) {
                setToken(tokenData);
                const storedUser = localStorage.getItem('googleUser');
                if(storedUser){
                    setUser(JSON.parse(storedUser));
                    fetchUserInfo(tokenData);
                }
            } else {
                localStorage.removeItem('googleToken');
                localStorage.removeItem('googleUser');
            }
        }
    }, [fetchUserInfo]);

    const handleDisconnect = () => {
        handleKonfirmasi('Putuskan Hubungan?', 'Anda akan diputuskan dari Google Drive dan perlu menghubungkan ulang nanti.', () => {
            resetKonfirmasi();
            setUser(null);
            setToken(null);
            setPictureUrl(null);
            localStorage.removeItem('googleUser');
            localStorage.removeItem('googleToken');
            showNotification('Hubungan dengan Google Drive telah diputuskan.', 'warning');
        });
    };

    const findFileId = async () => { try { const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${FILENAME}' and 'appDataFolder' in parents and trashed=false&fields=files(id,name)`, { headers: { 'Authorization': `Bearer ${token.access_token}` } }); if (!res.ok) throw new Error('Gagal mencari file.'); const data = await res.json(); return data.files?.length > 0 ? data.files[0].id : null; } catch (err) { console.error("Error finding file:", err); throw err; } };
    
    const handleBackup = useCallback(async () => {
        if (!token) { showNotification('Sesi Google Drive tidak valid.', 'error'); return Promise.reject(); }
        setIsProcessing(true);
        showNotification('Memulai backup...', 'warning');
        try {
            const fileId = await findFileId();
            const dataToBackup = getAllData();
            const jsonData = JSON.stringify(dataToBackup, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const metadata = { name: FILENAME, mimeType: 'application/json' };
            if (!fileId) { metadata.parents = ['appDataFolder']; }
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            form.append('file', blob);
            let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
            let method = 'POST';
            if (fileId) {
                url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
                method = 'PATCH';
            }
            const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token.access_token}` }, body: form });
            if (!res.ok) throw new Error('Proses upload gagal.');
            showNotification(fileId ? 'Backup berhasil diperbarui!' : 'File backup baru berhasil dibuat!', 'success');
            return Promise.resolve();
        } catch (error) {
            showNotification(`Backup Gagal: ${error.message}`, 'error');
            return Promise.reject(error);
        } finally { setIsProcessing(false); }
    }, [token, getAllData, showNotification]);

    useImperativeHandle(ref, () => ({ backup: handleBackup, isConnected: !!user }));

    const handleRestore = () => { if (!token) { showNotification('Harap hubungkan ke Google Drive.', 'error'); return; } handleKonfirmasi('Restore dari Drive?', 'Ini akan menimpa semua data saat ini. Lanjutkan?', async () => { resetKonfirmasi(); setIsProcessing(true); showNotification('Mencari data...', 'warning'); try { const fileId = await findFileId(); if (!fileId) { showNotification('File backup tidak ditemukan.', 'error'); setIsProcessing(false); return; } const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers: { 'Authorization': `Bearer ${token.access_token}` } }); if (!res.ok) throw new Error('Gagal mengunduh data.'); const restoredData = await res.json(); restoreAllData(restoredData); } catch (error) { showNotification(`Restore Gagal: ${error.message}`, 'error'); } finally { setIsProcessing(false); } }); };
    
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
                <button onClick={() => handleLogin()} className="flex-shrink-0 flex items-center bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-3 rounded-lg text-sm"> Hubungkan ke Google Drive </button>
            )}
        </div>
    );
});

export default GoogleDriveSync;