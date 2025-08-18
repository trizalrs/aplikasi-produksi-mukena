// src/components/PageKasbon.jsx

import React, { useState, useMemo } from 'react';
import { PlusIcon, ChevronDownIcon, TrashIcon } from './Icons';

function PageKasbon({ pegawai, kasbon, pembayaranKasbon = [], openModal, formatCurrency, formatDate, handleKasbonCancel }) {
    
    const [expandedRowId, setExpandedRowId] = useState(null);

    const handleToggleExpand = (pegawaiId) => {
        setExpandedRowId(prevId => (prevId === pegawaiId ? null : pegawaiId));
    };

    const ringkasanKasbon = useMemo(() => {
        const dataPegawai = {};

        pegawai.forEach(p => {
            if (p.status === 'Aktif') {
                dataPegawai[p.id] = {
                    id: p.id,
                    nama: p.nama,
                    totalPinjam: 0,
                    totalBayar: 0,
                };
            }
        });

        // <-- DIPERBARUI: Hanya hitung kasbon yang tidak dibatalkan -->
        kasbon.filter(k => k.status !== 'dibatalkan').forEach(k => {
            if (dataPegawai[k.pegawaiId]) {
                dataPegawai[k.pegawaiId].totalPinjam += k.jumlah;
            }
        });

        pembayaranKasbon.forEach(pb => {
            if (dataPegawai[pb.pegawaiId]) {
                dataPegawai[pb.pegawaiId].totalBayar += pb.jumlah;
            }
        });

        return Object.values(dataPegawai)
            .map(p => ({
                ...p,
                sisaKasbon: p.totalPinjam - p.totalBayar,
            }))
            .filter(p => p.sisaKasbon > 0 || p.totalBayar > 0); // Tampilkan yang masih punya sisa atau pernah bayar

    }, [pegawai, kasbon, pembayaranKasbon]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Ringkasan Kasbon Pegawai</h2>
                <button onClick={() => openModal()} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"><PlusIcon /> Tambah Kasbon</button>
            </div>
            {ringkasanKasbon.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pinjam (Aktif)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bayar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sisa Kasbon</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ringkasanKasbon.map(p => {
                                const isExpanded = expandedRowId === p.id;
                                const riwayatPegawai = kasbon.filter(k => k.pegawaiId == p.id).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

                                return (
                                    <React.Fragment key={p.id}>
                                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => handleToggleExpand(p.id)}>
                                            <td className="px-6 py-4"><ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nama}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(p.totalPinjam)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(p.totalBayar)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{formatCurrency(p.sisaKasbon)}</td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="5" className="px-10 py-4">
                                                    <div className="pl-4 border-l-4 border-indigo-500">
                                                        <h4 className="font-bold text-sm mb-2">Detail Riwayat Kasbon:</h4>
                                                        {riwayatPegawai.length > 0 ? (
                                                            <ul className="divide-y divide-gray-200">
                                                                {riwayatPegawai.map(item => (
                                                                    <li key={item.id} className={`py-2 flex justify-between items-center text-sm ${item.status === 'dibatalkan' ? 'text-gray-400 line-through' : ''}`}>
                                                                        <span>{formatDate(item.tanggal)}</span>
                                                                        <div className="flex items-center space-x-4">
                                                                            <span className="font-semibold">{formatCurrency(item.jumlah)}</span>
                                                                            {item.status !== 'dibatalkan' && (
                                                                                <button onClick={(e) => { e.stopPropagation(); handleKasbonCancel(item.id); }} className="text-red-500 hover:text-red-700" title="Batalkan Kasbon">
                                                                                    <TrashIcon />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : ( <p className="text-sm text-gray-500">Tidak ada riwayat kasbon.</p> )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : ( <div className="text-center bg-white p-10 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Belum Ada Riwayat Kasbon</h3></div> )}
        </div>
    );
}

export default PageKasbon;