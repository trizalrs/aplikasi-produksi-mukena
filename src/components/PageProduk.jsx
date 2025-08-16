import React, { useState, useMemo } from 'react';
import { PlusIcon, EditIcon, TrashIcon, ChevronDownIcon } from './Icons';

// Komponen Halaman Produk dengan Fitur Pencarian dan Accordion
function PageProduk({ produk, openModal, handleDelete, formatCurrency }) {
    const [expandedProdukId, setExpandedProdukId] = useState(null);
    // --- BARU: State untuk menyimpan kata kunci pencarian ---
    const [searchTerm, setSearchTerm] = useState('');

    const handleToggleExpand = (id) => {
        setExpandedProdukId(prevId => (prevId === id ? null : id));
    };

    // --- BARU: Logika untuk memfilter produk berdasarkan pencarian ---
    const filteredProduk = useMemo(() => {
        if (!searchTerm) {
            return produk; // Jika tidak ada pencarian, tampilkan semua
        }
        return produk.filter(p =>
            p.namaProduk.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [produk, searchTerm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-semibold text-gray-700">Data Master Produk</h2>
                <button onClick={() => openModal()} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                    <PlusIcon /> Tambah
                </button>
            </div>

            {/* --- BARU: Kolom Input Pencarian --- */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Cari nama produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full shadow-sm border rounded py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

             {filteredProduk.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* --- DIPERBARUI: Gunakan `filteredProduk` untuk menampilkan data --- */}
                    {filteredProduk.map(p => {
                        const isExpanded = expandedProdukId === p.id;
                        return (
                            <div key={p.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col">
                                <div className="flex justify-between items-start">
                                    <button 
                                        onClick={() => handleToggleExpand(p.id)} 
                                        className="flex justify-between items-center w-full text-left"
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 flex-1 mr-2">{p.namaProduk}</h3>
                                        <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className="flex space-x-2 flex-shrink-0 ml-4">
                                        <button onClick={() => openModal(p)} className="p-2 text-gray-500 hover:text-blue-600"><EditIcon /></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div className="mt-4 border-t pt-4 flex-grow space-y-3 animate-fade-in">
                                        {(p.variantGroups || []).map(g => (
                                            <div key={g.id}>
                                                <p className="text-sm font-bold text-gray-600 mb-2">{g.namaGrup}:</p>
                                                <ul className="space-y-2 pl-2">
                                                    {g.variants.map(v => (
                                                        <li key={v.id} className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-700">{v.namaVarian}</span>
                                                            <span className="font-semibold text-indigo-600">{formatCurrency(v.upah)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : ( 
                <div className="text-center bg-white p-10 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">
                        {searchTerm ? 'Produk tidak ditemukan.' : 'Belum Ada Data Produk'}
                    </h3>
                </div> 
            )}
        </div>
    )
}

export default PageProduk;
