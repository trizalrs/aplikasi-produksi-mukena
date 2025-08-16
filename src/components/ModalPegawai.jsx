import React from 'react';

// Komponen Modal untuk Tambah/Edit Pegawai
function ModalPegawai({ editingPegawai, formPegawaiData, handleInputChange, handleSubmit, closeModal }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start py-10 overflow-y-auto z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingPegawai ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2">Nama Pegawai</label><input type="text" name="nama" value={formPegawaiData.nama} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required /></div>
                    <div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2">Kontak</label><input type="text" name="kontak" value={formPegawaiData.kontak} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required /></div>
                    <div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2">Alamat</label><textarea name="alamat" value={formPegawaiData.alamat} onChange={handleInputChange} rows="3" className="shadow appearance-none border rounded w-full py-2 px-3"></textarea></div>
                    <div className="mb-6"><label className="block text-gray-700 text-sm font-bold mb-2">Status</label><select name="status" value={formPegawaiData.status} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3"><option value="Aktif">Aktif</option><option value="Tidak Aktif">Tidak Aktif</option></select></div>
                    <div className="flex items-center justify-end space-x-4"><button type="button" onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Batal</button><button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">{editingPegawai ? 'Simpan' : 'Simpan'}</button></div>
                </form>
            </div>
        </div>
    );
}

export default ModalPegawai;
