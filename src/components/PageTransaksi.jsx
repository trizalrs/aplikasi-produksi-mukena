import React, { useState, useMemo } from 'react';
import { PlusIcon, ChevronDownIcon, EditIcon, TrashIcon } from './Icons';

// Komponen Halaman Transaksi dengan Fitur Pencarian & Filter
function PageTransaksi({ transaksi, openModal, handleDelete, formatCurrency, formatDate, pegawai }) {
    const [expandedRow, setExpandedRow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const filteredTransaksi = useMemo(() => {
        return transaksi
            .filter(t => {
                const pegawaiMatch = t.pegawaiNama.toLowerCase().includes(searchTerm.toLowerCase());
                const dateMatch = !filterDate || t.tanggal === filterDate;
                return pegawaiMatch && dateMatch;
            })
            .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    }, [transaksi, searchTerm, filterDate]);
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-semibold text-gray-700">Riwayat Transaksi Setor</h2>
                <button onClick={() => openModal()} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"><PlusIcon /> Tambah Transaksi</button>
            </div>

            {/* --- BARU: Form Pencarian dan Filter --- */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4 items-center">
                <input
                    type="text"
                    placeholder="Cari nama pegawai..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow shadow-sm border rounded py-2 px-3 text-sm"
                />
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="shadow-sm border rounded py-2 px-3 text-sm"
                />
            </div>

            {filteredTransaksi.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                    {/* ... (Isi tabel tidak berubah) ... */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pegawai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grand Total Upah</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTransaksi.map(t => (
                                <React.Fragment key={t.id}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(t.tanggal)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.pegawaiNama}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.items.length}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(t.grandTotalUpah)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => setExpandedRow(expandedRow === t.id ? null : t.id)} className="text-indigo-600 hover:text-indigo-900"><ChevronDownIcon /></button>
                                            <button onClick={() => openModal(t)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                            <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                        </td>
                                    </tr>
                                    {expandedRow === t.id && (
                                        <tr className="bg-gray-50">
                                            <td colSpan="5" className="px-6 py-4">
                                                <div className="pl-4 border-l-4 border-indigo-500">
                                                    <h4 className="font-bold text-sm mb-2">Detail Setoran:</h4>
                                                    <ul className="divide-y divide-gray-200">
                                                        {t.items.map(item => (
                                                            <li key={item.id} className="py-2 flex justify-between items-center">
                                                                <span className="text-sm text-gray-800">
                                                                    {item.produkNama} ({item.grupNama} - {item.varianNama})
                                                                </span>
                                                                <span className="text-sm text-gray-600">
                                                                    {item.jumlah} x {formatCurrency(item.upah)} = <span className="font-semibold text-gray-800">{formatCurrency(item.totalUpah)}</span>
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center bg-white p-10 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Tidak ada transaksi yang cocok.</h3></div>
            )}
        </div>
    );
}

export default PageTransaksi;
