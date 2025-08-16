import React, { useState, useEffect } from 'react';

// Komponen Modal untuk Tambah/Edit Kasbon
function ModalKasbon({ pegawai, editingKasbon, handleSubmit, closeModal, formatCurrency }) {
    const [formData, setFormData] = useState({
        pegawaiId: '',
        tanggal: new Date().toISOString().slice(0, 10),
        jumlah: '',
        keterangan: ''
    });

    useEffect(() => {
        if (editingKasbon) {
            setFormData({
                pegawaiId: editingKasbon.pegawaiId,
                tanggal: editingKasbon.tanggal,
                jumlah: editingKasbon.jumlah,
                keterangan: editingKasbon.keterangan || ''
            });
        }
    }, [editingKasbon]);
    
    const availablePegawai = pegawai.filter(p => p.status === 'Aktif');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.pegawaiId || !formData.jumlah || formData.jumlah <= 0) {
            alert("Pilih pegawai dan isi jumlah kasbon yang valid.");
            return;
        }
        const pegawaiNama = availablePegawai.find(p => p.id == formData.pegawaiId)?.nama;
        const finalData = {
            ...formData,
            jumlah: parseInt(formData.jumlah),
            pegawaiNama: pegawaiNama
        };
        handleSubmit(finalData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start py-10 overflow-y-auto z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg m-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingKasbon ? 'Edit Kasbon' : 'Tambah Kasbon Baru'}</h2>
                <form onSubmit={onFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal</label>
                            <input type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} className="shadow border rounded w-full py-2 px-3" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Pegawai</label>
                            <select name="pegawaiId" value={formData.pegawaiId} onChange={handleInputChange} className="shadow border rounded w-full py-2 px-3" required>
                                <option value="">-- Pilih Pegawai --</option>
                                {availablePegawai.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Jumlah Kasbon (Rp)</label>
                            <input type="number" name="jumlah" value={formData.jumlah} onChange={handleInputChange} min="1" className="shadow border rounded w-full py-2 px-3" placeholder="Contoh: 50000" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Keterangan (Opsional)</label>
                            <textarea name="keterangan" value={formData.keterangan} onChange={handleInputChange} rows="3" className="shadow border rounded w-full py-2 px-3" placeholder="Contoh: Untuk keperluan keluarga"></textarea>
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-4 mt-8 border-t pt-6">
                        <button type="button" onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Batal</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">{editingKasbon ? 'Simpan Perubahan' : 'Simpan Kasbon'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalKasbon;
