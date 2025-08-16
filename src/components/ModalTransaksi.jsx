import React, { useState, useEffect } from 'react';
import { PlusIcon, XCircleIcon } from './Icons'; // Impor ikon yang digunakan

// Komponen Modal untuk Tambah/Edit Transaksi
function ModalTransaksi({ pegawai, produk, editingTransaksi, handleSubmit, closeModal, formatCurrency, showNotification }) {
    const [mainData, setMainData] = useState({
        pegawaiId: '',
        tanggal: new Date().toISOString().slice(0, 10),
    });
    const [currentItem, setCurrentItem] = useState({
        produkId: '',
        grupId: '',
        varianId: '',
        jumlah: 1,
    });
    const [keranjang, setKeranjang] = useState([]);

    useEffect(() => {
        if (editingTransaksi) {
            setMainData({
                pegawaiId: editingTransaksi.pegawaiId,
                tanggal: editingTransaksi.tanggal,
            });
            setKeranjang(editingTransaksi.items);
        }
    }, [editingTransaksi]);

    const availablePegawai = pegawai.filter(p => p.status === 'Aktif');
    const selectedProduk = produk.find(p => p.id == currentItem.produkId);
    const selectedGrup = selectedProduk?.variantGroups.find(g => g.id == currentItem.grupId);
    const selectedVarian = selectedGrup?.variants.find(v => v.id == currentItem.varianId);

    const handleMainDataChange = (e) => setMainData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleItemChange = (e) => {
        const { name, value } = e.target;
        let newItemData = { ...currentItem, [name]: value };
        if (name === 'produkId') { newItemData.grupId = ''; newItemData.varianId = ''; }
        if (name === 'grupId') { newItemData.varianId = ''; }
        setCurrentItem(newItemData);
    };

    const handleAddItem = () => {
        if (!selectedVarian || currentItem.jumlah <= 0) {
            showNotification("Pilih produk, varian, dan jumlah yang valid.", "error");
            return;
        }
        const newItem = {
            id: Date.now(),
            produkId: selectedProduk.id, produkNama: selectedProduk.namaProduk,
            grupId: selectedGrup.id, grupNama: selectedGrup.namaGrup,
            varianId: selectedVarian.id, varianNama: selectedVarian.namaVarian,
            jumlah: parseInt(currentItem.jumlah), upah: selectedVarian.upah,
            totalUpah: selectedVarian.upah * parseInt(currentItem.jumlah),
        };
        setKeranjang(prev => [...prev, newItem]);
        setCurrentItem({ produkId: '', grupId: '', varianId: '', jumlah: 1 });
    };

    const handleRemoveItem = (itemId) => setKeranjang(prev => prev.filter(item => item.id !== itemId));
    const grandTotalUpah = keranjang.reduce((total, item) => total + item.totalUpah, 0);

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (!mainData.pegawaiId || keranjang.length === 0) {
            showNotification("Pilih pegawai dan tambahkan setidaknya satu item.", "error");
            return;
        }
        const pegawaiNama = availablePegawai.find(p => p.id == mainData.pegawaiId)?.nama;
        const finalData = {
            tanggal: mainData.tanggal,
            pegawaiId: mainData.pegawaiId,
            pegawaiNama: pegawaiNama,
            items: keranjang,
            grandTotalUpah: grandTotalUpah,
        };
        handleSubmit(finalData);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start py-10 overflow-y-auto z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-3xl m-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingTransaksi ? 'Edit Transaksi Setor' : 'Tambah Transaksi Setor'}</h2>
                <form onSubmit={onFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal</label>
                            <input type="date" name="tanggal" value={mainData.tanggal} onChange={handleMainDataChange} className="shadow border rounded w-full py-2 px-3" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Pegawai</label>
                            <select name="pegawaiId" value={mainData.pegawaiId} onChange={handleMainDataChange} className="shadow border rounded w-full py-2 px-3" required disabled={!!editingTransaksi}>
                                <option value="">-- Pilih Pegawai --</option>
                                {availablePegawai.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Tambah Item Setoran</h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold">Produk & Varian</label>
                                <select name="produkId" value={currentItem.produkId} onChange={handleItemChange} className="shadow-sm border rounded w-full py-2 px-3 text-sm mt-1"><option value="">Pilih Produk</option>{produk.map(p => <option key={p.id} value={p.id}>{p.namaProduk}</option>)}</select>
                            </div>
                            <div><select name="grupId" value={currentItem.grupId} onChange={handleItemChange} className="shadow-sm border rounded w-full py-2 px-3 text-sm mt-1" disabled={!selectedProduk}><option value="">Pilih Grup</option>{selectedProduk?.variantGroups.map(g => <option key={g.id} value={g.id}>{g.namaGrup}</option>)}</select></div>
                            <div><select name="varianId" value={currentItem.varianId} onChange={handleItemChange} className="shadow-sm border rounded w-full py-2 px-3 text-sm mt-1" disabled={!selectedGrup}><option value="">Pilih Varian</option>{selectedGrup?.variants.map(v => <option key={v.id} value={v.id}>{v.namaVarian}</option>)}</select></div>
                            <div className="flex items-end space-x-2">
                                <div className="flex-grow"><label className="text-xs font-semibold">Jumlah</label><input type="number" name="jumlah" value={currentItem.jumlah} onChange={handleItemChange} min="1" className="shadow-sm border rounded w-full py-2 px-3 text-sm mt-1" /></div>
                                <button type="button" onClick={handleAddItem} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-2 rounded-lg h-10"><PlusIcon /></button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-3">Daftar Setoran</h3>
                        {keranjang.length > 0 ? (
                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100 text-sm"><tr><th className="p-2 text-left">Produk</th><th className="p-2 text-left">Jumlah</th><th className="p-2 text-left">Total Upah</th><th className="p-2"></th></tr></thead>
                                    <tbody>{keranjang.map(item => (<tr key={item.id} className="border-b"><td className="p-2 text-sm">{item.produkNama} ({item.grupNama} - {item.varianNama})</td><td className="p-2 text-sm">{item.jumlah}</td><td className="p-2 text-sm font-semibold">{formatCurrency(item.totalUpah)}</td><td className="p-2 text-center"><button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500"><XCircleIcon /></button></td></tr>))}</tbody>
                                    <tfoot className="bg-gray-100 font-bold"><tr><td colSpan="2" className="p-2 text-right">Grand Total</td><td className="p-2">{formatCurrency(grandTotalUpah)}</td><td></td></tr></tfoot>
                                </table>
                            </div>
                        ) : (<p className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">Keranjang setoran masih kosong.</p>)}
                    </div>
                    <div className="flex items-center justify-end space-x-4 mt-8 border-t pt-6">
                        <button type="button" onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Batal</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">{editingTransaksi ? 'Simpan Perubahan' : 'Simpan Transaksi'}</button>
                    </div>
                </form>
            </div>
         </div>
    );
}

export default ModalTransaksi;
