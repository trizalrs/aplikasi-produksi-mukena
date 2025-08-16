import React from 'react';
import { SaveIcon } from './Icons'; // Impor ikon yang digunakan

// Komponen Halaman Penggajian dengan Logika Perhitungan yang Benar
function PagePenggajian({ pegawai, transaksi, kasbon, pembayaranKasbon, formatCurrency, reportFilters, setReportFilters, reportData, setReportData, showReport, setShowReport, handleProsesGajian, showNotification }) {

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setReportFilters(prev => ({ ...prev, [name]: value }));
        setShowReport(false);
    };

    const handleBayarKasbonChange = (pegawaiId, value) => {
        const newValue = parseInt(value, 10) || 0;
        setReportData(prevData => prevData.map(item => {
            if (item.pegawaiId === pegawaiId) {
                const bayarKasbon = Math.min(newValue, item.totalKasbon, item.totalUpah);
                return {
                    ...item,
                    bayarKasbon: bayarKasbon,
                    gajiDiterima: item.totalUpah - bayarKasbon,
                    sisaKasbon: item.totalKasbon - bayarKasbon
                };
            }
            return item;
        }));
    };

    const generateReport = () => {
        if (!reportFilters.startDate || !reportFilters.endDate) {
            showNotification("Harap tentukan rentang tanggal.", "error");
            return;
        }

        const startDate = new Date(reportFilters.startDate);
        const endDate = new Date(reportFilters.endDate);
        endDate.setHours(23, 59, 59, 999);

        const targetPegawai = reportFilters.pegawaiId === 'semua' 
            ? pegawai.filter(p => p.status === 'Aktif')
            : pegawai.filter(p => p.id == reportFilters.pegawaiId);

        const data = targetPegawai.map(p => {
            // --- LOGIKA PERHITUNGAN KASBON YANG DIPERBARUI DAN BENAR ---
            // 1. Hitung semua pinjaman yang pernah diambil oleh pegawai ini.
            const totalSemuaPinjaman = kasbon
                .filter(k => k.pegawaiId == p.id)
                .reduce((sum, k) => sum + k.jumlah, 0);

            // 2. Hitung semua pembayaran yang pernah dilakukan SEBELUMNYA.
            const totalSemuaPembayaran = pembayaranKasbon
                .filter(pb => pb.pegawaiId == p.id)
                .reduce((sum, pb) => sum + pb.jumlah, 0);
            
            // 3. Sisa utang yang harus diperhitungkan adalah selisihnya.
            const totalKasbonKeseluruhan = totalSemuaPinjaman - totalSemuaPembayaran;

            // Hitung total upah HANYA dalam periode laporan
            const totalUpah = transaksi
                .filter(t => {
                    const tDate = new Date(t.tanggal);
                    return t.pegawaiId == p.id && !t.sudahDibayar && tDate >= startDate && tDate <= endDate;
                })
                .reduce((sum, t) => sum + t.grandTotalUpah, 0);
            
            // Tentukan pembayaran kasbon default (tidak boleh lebih besar dari upah atau sisa utang)
            const bayarKasbonDefault = Math.min(totalUpah, totalKasbonKeseluruhan);
            
            const gajiDiterima = totalUpah - bayarKasbonDefault;
            const sisaKasbon = totalKasbonKeseluruhan - bayarKasbonDefault;

            return {
                pegawaiId: p.id,
                pegawaiNama: p.nama,
                totalUpah,
                totalKasbon: totalKasbonKeseluruhan,
                bayarKasbon: bayarKasbonDefault,
                sisaKasbon,
                gajiDiterima
            };
        });

        setReportData(data);
        setShowReport(true);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Laporan Penggajian</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pegawai</label>
                        <select name="pegawaiId" value={reportFilters.pegawaiId} onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="semua">Semua Pegawai Aktif</option>
                            {pegawai.filter(p => p.status === 'Aktif').map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Dari Tanggal</label>
                        <input type="date" name="startDate" value={reportFilters.startDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
                        <input type="date" name="endDate" value={reportFilters.endDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                    <button onClick={generateReport} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Tampilkan Data</button>
                </div>
            </div>

            {showReport && (
                <div>
                    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                       <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Upah</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sisa Kasbon</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bayar Kasbon</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sisa Kasbon Akhir</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji Diterima</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.map(item => (
                                    <tr key={item.pegawaiId}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pegawaiNama}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(item.totalUpah)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.totalKasbon)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <input 
                                                type="number" 
                                                value={item.bayarKasbon}
                                                onChange={(e) => handleBayarKasbonChange(item.pegawaiId, e.target.value)}
                                                className="shadow-sm border rounded w-full py-1 px-2"
                                                max={Math.min(item.totalKasbon, item.totalUpah)}
                                                min="0"
                                            />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(item.sisaKasbon)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{formatCurrency(item.gajiDiterima)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={handleProsesGajian} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                            <SaveIcon /> Simpan Proses Gajian
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PagePenggajian;
