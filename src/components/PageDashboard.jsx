import React, { useState, useMemo } from 'react';
import { UserIcon } from './Icons'; // Impor ikon yang digunakan

// Komponen Halaman Dashboard dengan Filter Dinamis
function PageDashboard({ pegawai, transaksi, kasbon, formatCurrency, formatDate }) {
    // --- BARU: State untuk mengelola filter tanggal ---
    const [filter, setFilter] = useState('today'); // Pilihan: 'today', 'week', 'month', 'year'

    // --- BARU: Logika untuk menghitung statistik berdasarkan filter ---
    const stats = useMemo(() => {
        const now = new Date();
        let startDate, endDate = new Date();

        // Tentukan rentang tanggal berdasarkan filter yang dipilih
        switch (filter) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case 'today':
            default:
                startDate = new Date();
                break;
        }

        // Set waktu ke awal dan akhir hari untuk perbandingan yang akurat
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        // Filter transaksi dan kasbon berdasarkan rentang tanggal
        const filteredTransaksi = transaksi.filter(t => {
            const tDate = new Date(t.tanggal);
            return tDate >= startDate && tDate <= endDate;
        });

        const filteredKasbon = kasbon.filter(k => {
            const kDate = new Date(k.tanggal);
            return kDate >= startDate && kDate <= endDate;
        });

        // Hitung totalnya
        const totalProduksi = filteredTransaksi.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.jumlah, 0), 0);
        const totalKasbon = filteredKasbon.reduce((sum, k) => sum + k.jumlah, 0);

        return { totalProduksi, totalKasbon };
    }, [transaksi, kasbon, filter]);

    const pegawaiAktif = pegawai.filter(p => p.status === 'Aktif').length;
    const transaksiTerbaru = [...transaksi].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 5);
    
    // Fungsi untuk mendapatkan label filter yang lebih ramah
    const getFilterLabel = () => {
        switch (filter) {
            case 'week': return 'Minggu Ini';
            case 'month': return 'Bulan Ini';
            case 'year': return 'Tahun Ini';
            default: return 'Hari Ini';
        }
    };

    // Pegawai Paling Produktif (logika tidak berubah)
    const getMostProductiveEmployee = () => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const upahPerPegawai = {};
        transaksi.filter(t => {
            const tDate = new Date(t.tanggal);
            return tDate >= firstDayOfMonth && tDate <= lastDayOfMonth;
        }).forEach(t => {
            upahPerPegawai[t.pegawaiId] = (upahPerPegawai[t.pegawaiId] || 0) + t.grandTotalUpah;
        });
        let topPegawai = { nama: 'Belum ada', totalUpah: 0 };
        let maxUpah = 0;
        for (const pegawaiId in upahPerPegawai) {
            if (upahPerPegawai[pegawaiId] > maxUpah) {
                maxUpah = upahPerPegawai[pegawaiId];
                const p = pegawai.find(p => p.id == pegawaiId);
                if (p) {
                    topPegawai = { nama: p.nama, totalUpah: maxUpah };
                }
            }
        }
        return topPegawai;
    };
    const topPegawai = getMostProductiveEmployee();

    // --- TAMPILAN DIPERBARUI ---
    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                {/* --- BARU: Tombol Filter --- */}
                <div className="flex items-center bg-gray-200 rounded-lg p-1">
                    <button onClick={() => setFilter('today')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'today' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}>Hari Ini</button>
                    <button onClick={() => setFilter('week')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'week' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}>Minggu Ini</button>
                    <button onClick={() => setFilter('month')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'month' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}>Bulan Ini</button>
                    <button onClick={() => setFilter('year')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'year' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}>Tahun Ini</button>
                </div>
            </div>
            
            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Produksi <span className="font-bold">{getFilterLabel()}</span></p>
                        <p className="text-3xl font-bold text-indigo-600">{stats.totalProduksi} Pcs</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Kasbon <span className="font-bold">{getFilterLabel()}</span></p>
                        <p className="text-3xl font-bold text-red-600">{formatCurrency(stats.totalKasbon)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
                    <div>
                        <p className="text-sm text-gray-500">Pegawai Aktif</p>
                        <p className="text-3xl font-bold text-green-600">{pegawaiAktif} Orang</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaksi Terbaru */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4">5 Transaksi Setor Terbaru</h3>
                    {transaksiTerbaru.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {transaksiTerbaru.map(t => (
                                <li key={t.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{t.pegawaiNama}</p>
                                        <p className="text-sm text-gray-500">{formatDate(t.tanggal)}</p>
                                    </div>
                                    <p className="font-semibold text-green-600">{formatCurrency(t.grandTotalUpah)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Belum ada transaksi.</p>
                    )}
                </div>
                {/* Pegawai Produktif */}
                <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-center">
                     <h3 className="font-bold text-lg mb-2">Pegawai Paling Produktif</h3>
                     <p className="text-sm text-gray-500 mb-4">Bulan Ini</p>
                     <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <UserIcon className="w-12 h-12 text-indigo-600" />
                     </div>
                     <p className="font-bold text-xl text-gray-800">{topPegawai.nama}</p>
                     <p className="font-semibold text-indigo-600">{formatCurrency(topPegawai.totalUpah)}</p>
                </div>
            </div>
        </div>
    );
}

export default PageDashboard;
