import React from 'react';
import { PlusIcon, EditIcon, TrashIcon } from './Icons'; // Impor ikon yang digunakan

// Komponen Halaman Pegawai
function PagePegawai({ pegawai, openModal, handleDelete }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Data Master Pegawai</h2>
                <button onClick={() => openModal()} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"><PlusIcon /> Tambah</button>
            </div>
            {pegawai.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pegawai.map(p => (
                        <div key={p.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="flex justify-between items-start">
                                <div><h3 className="text-lg font-bold text-gray-900">{p.nama}</h3><p className={`mt-1 text-sm font-semibold ${p.status === 'Aktif' ? 'text-green-600' : 'text-red-600'}`}>{p.status}</p></div>
                                <div className="flex space-x-2"><button onClick={() => openModal(p)} className="p-2 text-gray-500 hover:text-blue-600"><EditIcon /></button><button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button></div>
                            </div>
                            <div className="mt-4 border-t pt-4"><p className="text-sm text-gray-600"><strong>Kontak:</strong> {p.kontak}</p><p className="text-sm text-gray-600 mt-1"><strong>Alamat:</strong> {p.alamat || 'Tidak ada'}</p></div>
                        </div>
                    ))}
                </div>
            ) : ( <div className="text-center bg-white p-10 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Belum Ada Data Pegawai</h3></div> )}
        </div>
    )
}

export default PagePegawai;
