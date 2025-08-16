import React from 'react';
import { TrashIcon, XCircleIcon, PlusIcon } from './Icons'; // Impor ikon yang digunakan

// Komponen Modal untuk Tambah/Edit Produk
function ModalProduk({ editingProduk, formProdukData, handleProdukNameChange, handleGroupChange, handleVariantChange, addGroup, removeGroup, addVariantToGroup, removeVariantFromGroup, handleSubmit, closeModal }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start py-10 overflow-y-auto z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{editingProduk ? 'Edit Data Produk' : 'Tambah Produk Baru'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6"><label className="block text-gray-700 text-sm font-bold mb-2">Nama Produk</label><input type="text" name="namaProduk" value={formProdukData.namaProduk} onChange={handleProdukNameChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required /></div>
                    <div className="border-t pt-4 mt-4 space-y-6">
                        {formProdukData.variantGroups.map((group) => (
                            <div key={group.id} className="p-4 bg-gray-50 rounded-lg border">
                                <div className="flex justify-between items-center mb-4">
                                    <input type="text" value={group.namaGrup} onChange={(e) => handleGroupChange(group.id, e)} placeholder="Nama Grup (Contoh: Anak)" className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none flex-grow" required />
                                    {formProdukData.variantGroups.length > 1 && <button type="button" onClick={() => removeGroup(group.id)} className="ml-4 text-red-500 hover:text-red-700"><TrashIcon /></button>}
                                </div>
                                <div className="space-y-3">
                                    {group.variants.map((variant) => (
                                        <div key={variant.id} className="flex items-center space-x-2">
                                            <input type="text" name="namaVarian" value={variant.namaVarian} onChange={(e) => handleVariantChange(group.id, variant.id, e)} placeholder="Nama Varian (Contoh: Merah)" className="shadow-sm border rounded w-full py-2 px-3 text-sm" required />
                                            <input type="number" name="upah" value={variant.upah} onChange={(e) => handleVariantChange(group.id, variant.id, e)} placeholder="Upah (Rp)" className="shadow-sm border rounded w-40 py-2 px-3 text-sm" required />
                                            {group.variants.length > 1 && <button type="button" onClick={() => removeVariantFromGroup(group.id, variant.id)} className="text-red-500 hover:text-red-700"><XCircleIcon /></button>}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => addVariantToGroup(group.id)} className="mt-4 flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold"><PlusIcon /> Tambah Varian</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addGroup} className="mt-6 flex items-center text-sm text-green-600 hover:text-green-800 font-bold py-2 px-4 border-2 border-dashed border-green-500 rounded-lg w-full justify-center"><PlusIcon /> Tambah Grup Varian</button>
                    <div className="flex items-center justify-end space-x-4 mt-8 border-t pt-6"><button type="button" onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Batal</button><button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">{editingProduk ? 'Simpan' : 'Simpan'}</button></div>
                </form>
            </div>
        </div>
    );
}

export default ModalProduk;
