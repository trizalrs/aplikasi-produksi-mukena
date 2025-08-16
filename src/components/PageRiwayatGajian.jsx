import React from 'react';
import { TrashIcon } from './Icons'; // Impor ikon yang digunakan

// Komponen Halaman Riwayat Gajian
function PageRiwayatGajian({ riwayatGajian, formatCurrency, formatDate, handleDelete }) {
    const sortedRiwayat = [...riwayatGajian].sort((a, b) => new Date(b.tanggalProses) - new Date(a.tanggalProses));

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Riwayat Penggajian</h2>
            {sortedRiwayat.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Proses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pegawai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji Diterima</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedRiwayat.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.tanggalProses)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.periodeAwal)} - {formatDate(item.periodeAkhir)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pegawaiNama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{formatCurrency(item.gajiDiterima)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center bg-white p-10 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Belum Ada Riwayat Penggajian</h3></div>
            )}
        </div>
    );
}

export default PageRiwayatGajian;
