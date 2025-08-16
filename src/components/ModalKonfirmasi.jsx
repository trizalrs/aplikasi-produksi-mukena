import React from 'react';

// Komponen Modal Konfirmasi Universal
function ModalKonfirmasi({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex items-center justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        type="button" 
                        onClick={onConfirm} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalKonfirmasi;
