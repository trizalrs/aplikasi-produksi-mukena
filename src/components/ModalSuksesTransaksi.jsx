import React from 'react';
import { PrinterIcon } from './Icons';

function ModalSuksesTransaksi({ isOpen, closeModal, setDataUntukStruk }) {
    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
        closeModal();
        setDataUntukStruk(null); // Membersihkan setelah mencetak
    };

    const handleClose = () => {
        closeModal();
        setDataUntukStruk(null); // Membersihkan jika tidak jadi cetak
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 no-print">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Transaksi Berhasil!</h2>
                <p className="text-gray-600 mb-6">Data setoran telah berhasil disimpan.</p>
                <div className="flex items-center justify-center space-x-4">
                    <button type="button" onClick={handleClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
                        Tutup
                    </button>
                    <button type="button" onClick={handlePrint} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        <PrinterIcon /> Cetak Struk
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalSuksesTransaksi;
