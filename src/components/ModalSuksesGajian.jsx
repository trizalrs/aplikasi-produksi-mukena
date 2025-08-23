// src/components/ModalSuksesGajian.jsx

import React from 'react';
import { CameraIcon } from './Icons';

// Ganti nama prop handleCetakGambar menjadi handlePrintRequest agar konsisten
function ModalSuksesGajian({ isOpen, closeModal, dataGajianBaru, handlePrintRequest }) {
    if (!isOpen) return null;

    const handleCetakClick = (gajianData) => {
        // Panggil fungsi universal handlePrintRequest dan kirim seluruh objek datanya
        handlePrintRequest('slip', gajianData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 no-print px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-gray-800">Proses Gajian Berhasil!</h2>
                    <p className="text-gray-600 mb-6">Silakan cetak slip untuk setiap pegawai di bawah ini.</p>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto border-t border-b py-4 my-4">
                    {(dataGajianBaru && dataGajianBaru.length > 0) ? (
                        dataGajianBaru.map(gajian => (
                            <div key={gajian.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700">{gajian.pegawaiNama}</span>
                                <button
                                    type="button"
                                    // --- PERUBAHAN UTAMA DI SINI ---
                                    onClick={() => handleCetakClick(gajian)}
                                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
                                    title={`Cetak slip untuk ${gajian.pegawaiNama}`}
                                >
                                    <CameraIcon /> Cetak
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Tidak ada slip untuk dicetak.</p>
                    )}
                </div>
                
                <div className="flex items-center justify-end">
                    <button type="button" onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalSuksesGajian;