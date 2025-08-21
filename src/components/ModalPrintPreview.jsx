// src/components/ModalPrintPreview.jsx

import React from 'react';

// Ikon untuk tombol Share (bisa ditambahkan di Icons.jsx jika mau)
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);


function ModalPrintPreview({ imageData, onShare, onClose }) {
    if (!imageData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm m-4 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Pratinjau Struk</h2>
                </div>
                <div className="p-4 bg-gray-100 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                    <img src={imageData} alt="Pratinjau Struk" className="w-full h-auto shadow-md" />
                </div>
                <div className="p-4 flex items-center justify-end space-x-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Tutup
                    </button>
                    {/* Tombol Share hanya tampil jika didukung browser */}
                    {navigator.share && (
                         <button
                            type="button"
                            onClick={onShare}
                            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            <ShareIcon /> Bagikan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModalPrintPreview;