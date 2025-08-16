// src/components/PageLaporan.jsx

import React, { useState, useMemo } from 'react';
import { TrashIcon, PrinterIcon, DownloadIcon } from './Icons';
import jsPDF from 'jspdf';
// <-- CARA IMPOR DIPERBAIKI: Impor 'autoTable' sebagai fungsi -->
import autoTable from 'jspdf-autotable';

// --- FUNGSI EXPORT PDF (DIPERBAIKI) ---
const exportToPdf = (title, head, body, fileName) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // <-- CARA PEMANGGILAN DIPERBAIKI: Gunakan autoTable(doc, {...}) -->
    autoTable(doc, {
        startY: 30,
        head: head,
        body: body,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(fileName);
};


// --- Sub-komponen Laporan Riwayat Gajian (tidak ada perubahan) ---
function LaporanRiwayatGajian({ riwayatGajian, formatCurrency, formatDate, handleDelete, handleCetak, pegawai }) {
    const [filters, setFilters] = useState({ startDate: '', endDate: '', pegawaiId: 'semua' });
    const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
    const filteredRiwayat = useMemo(() => { return riwayatGajian .filter(item => { const { startDate, endDate, pegawaiId } = filters; const itemDate = new Date(item.tanggalProses); const pegawaiMatch = pegawaiId === 'semua' || item.pegawaiId == pegawaiId; const startDateMatch = !startDate || itemDate >= new Date(startDate); const endDateMatch = !endDate || itemDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999)); return pegawaiMatch && startDateMatch && endDateMatch; }) .sort((a, b) => new Date(b.tanggalProses) - new Date(a.tanggalProses)); }, [riwayatGajian, filters]);
    return ( <div className="space-y-6"> <div className="bg-white p-4 rounded-xl shadow-lg no-print"> <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"> <div> <label className="block text-sm font-medium text-gray-700">Pegawai</label> <select name="pegawaiId" value={filters.pegawaiId} onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> <option value="semua">Semua Pegawai</option> {pegawai.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)} </select> </div> <div> <label className="block text-sm font-medium text-gray-700">Dari Tanggal</label> <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/> </div> <div> <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label> <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/> </div> </div> </div> {filteredRiwayat.length > 0 ? ( <div className="bg-white rounded-xl shadow-lg overflow-x-auto"> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Proses</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pegawai</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji Diterima</th> <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {filteredRiwayat.map(item => ( <tr key={item.id}> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.tanggalProses)}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.periodeAwal)} - {formatDate(item.periodeAkhir)}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pegawaiNama}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{formatCurrency(item.gajiDiterima)}</td> <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2"> <button onClick={() => handleCetak(item.id)} className="text-blue-600 hover:text-blue-900" title="Cetak Slip"> <PrinterIcon /> </button> <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900" title="Hapus Riwayat"> <TrashIcon /> </button> </td> </tr> ))} </tbody> </table> </div> ) : ( <div className="text-center bg-white p-10 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Tidak ada riwayat gajian yang cocok dengan filter.</h3></div> )} </div> );
}

// --- Sub-komponen Laporan Produksi (tidak ada perubahan) ---
function LaporanProduksi({ transaksi, formatCurrency, showNotification }) {
    const [filters, setFilters] = useState({ startDate: '', endDate: '', groupBy: 'pegawai' });
    const [showReport, setShowReport] = useState(false);
    const handleFilterChange = (e) => { setFilters(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const reportData = useMemo(() => { if (!showReport) return []; const { startDate, endDate, groupBy } = filters; const sDate = new Date(startDate); const eDate = new Date(endDate); eDate.setHours(23, 59, 59, 999); const filteredTransaksi = transaksi.filter(t => { const tDate = new Date(t.tanggal); return tDate >= sDate && tDate <= eDate; }); if (groupBy === 'pegawai') { const dataByPegawai = {}; filteredTransaksi.forEach(t => { if (!dataByPegawai[t.pegawaiId]) { dataByPegawai[t.pegawaiId] = { name: t.pegawaiNama, totalPcs: 0, totalUpah: 0 }; } const pcsInTx = t.items.reduce((sum, item) => sum + item.jumlah, 0); dataByPegawai[t.pegawaiId].totalPcs += pcsInTx; dataByPegawai[t.pegawaiId].totalUpah += t.grandTotalUpah; }); return Object.values(dataByPegawai); } if (groupBy === 'produk') { const dataByProduk = {}; filteredTransaksi.forEach(t => { t.items.forEach(item => { const key = `${item.produkId}-${item.varianId}`; if (!dataByProduk[key]) { dataByProduk[key] = { name: `${item.produkNama} (${item.varianNama})`, totalPcs: 0, totalUpah: 0 }; } dataByProduk[key].totalPcs += item.jumlah; dataByProduk[key].totalUpah += item.totalUpah; }); }); return Object.values(dataByProduk); } return []; }, [filters, showReport, transaksi]);
    const handleGenerateReport = () => { if (!filters.startDate || !filters.endDate) { showNotification("Harap tentukan rentang tanggal.", "error"); return; } setShowReport(true); };
    return ( <div className="space-y-6"> <div className="bg-white p-4 rounded-xl shadow-lg"> <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"> <div> <label className="block text-sm font-medium text-gray-700">Kelompokkan Berdasarkan</label> <select name="groupBy" value={filters.groupBy} onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> <option value="pegawai">Pegawai</option> <option value="produk">Produk</option> </select> </div> <div> <label className="block text-sm font-medium text-gray-700">Dari Tanggal</label> <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/> </div> <div> <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label> <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/> </div> <button onClick={handleGenerateReport} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Tampilkan Laporan</button> </div> </div> {showReport && ( <div className="bg-white rounded-xl shadow-lg overflow-x-auto"> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{filters.groupBy === 'pegawai' ? 'Nama Pegawai' : 'Nama Produk'}</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pcs</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Upah</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {reportData.map(item => ( <tr key={item.name}> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalPcs}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(item.totalUpah)}</td> </tr> ))} </tbody> </table> </div> )} </div> );
}

function LaporanDataPegawai({ pegawai }) {
    const handleExport = () => {
        const head = [['No', 'Nama', 'Alamat', 'Kontak', 'Status']];
        const body = pegawai.map((p, index) => [
            index + 1,
            p.nama,
            p.alamat || '-', // Menghindari nilai null/undefined
            p.kontak,
            p.status
        ]);
        exportToPdf('Laporan Data Pegawai', head, body, 'laporan-pegawai.pdf');
    };
    return ( <div className="space-y-6"> <div className="flex justify-end no-print"> <button onClick={handleExport} className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"> <DownloadIcon /> Export ke PDF </button> </div> <div className="bg-white rounded-xl shadow-lg overflow-x-auto"> <div className="p-6"> <h3 className="text-xl font-bold text-center mb-6">Laporan Data Pegawai</h3> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {pegawai.map((p, index) => ( <tr key={p.id}> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nama}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.alamat}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.kontak}</td> <td className="px-6 py-4 whitespace-nowrap text-sm"> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> {p.status} </span> </td> </tr> ))} </tbody> </table> </div> </div> </div> );
}

function LaporanDataProduk({ produk, formatCurrency }) {
    const handleExport = () => {
        const head = [['Nama Produk', 'Grup Varian', 'Nama Varian', 'Upah']];
        const body = produk.flatMap(p => 
            p.variantGroups.flatMap(g => 
                g.variants.map(v => [
                    p.namaProduk,
                    g.namaGrup,
                    v.namaVarian,
                    formatCurrency(v.upah)
                ])
            )
        );
        exportToPdf('Laporan Data Produk', head, body, 'laporan-produk.pdf');
    };
    return ( <div className="space-y-6"> <div className="flex justify-end no-print"> <button onClick={handleExport} className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"> <DownloadIcon /> Export ke PDF </button> </div> <div className="bg-white rounded-xl shadow-lg overflow-x-auto"> <div className="p-6"> <h3 className="text-xl font-bold text-center mb-6">Laporan Data Produk</h3> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grup Varian</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Varian</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upah</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {produk.flatMap(p => p.variantGroups.flatMap(g => g.variants.map(v => ( <tr key={`${p.id}-${g.id}-${v.id}`}> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.namaProduk}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{g.namaGrup}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.namaVarian}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{formatCurrency(v.upah)}</td> </tr> )) ) )} </tbody> </table> </div> </div> </div> );
}


function PageLaporan({ riwayatGajian, formatCurrency, formatDate, handleRiwayatGajianDelete, transaksi, pegawai, produk, showNotification, handleCetakSlip }) {
    const [activeReport, setActiveReport] = useState('riwayatGajian');

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pusat Laporan</h2>
            
            <div className="mb-6 border-b border-gray-200 no-print">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveReport('riwayatGajian')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'riwayatGajian' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Riwayat Gajian
                    </button>
                    <button onClick={() => setActiveReport('produksi')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'produksi' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Laporan Produksi
                    </button>
                    <button onClick={() => setActiveReport('dataPegawai')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'dataPegawai' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Data Pegawai
                    </button>
                    <button onClick={() => setActiveReport('dataProduk')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'dataProduk' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Data Produk
                    </button>
                </nav>
            </div>

            <div>
                {activeReport === 'riwayatGajian' && <LaporanRiwayatGajian riwayatGajian={riwayatGajian} formatCurrency={formatCurrency} formatDate={formatDate} handleDelete={handleRiwayatGajianDelete} handleCetak={handleCetakSlip} pegawai={pegawai} />}
                {activeReport === 'produksi' && <LaporanProduksi transaksi={transaksi} formatCurrency={formatCurrency} showNotification={showNotification} />}
                {activeReport === 'dataPegawai' && <LaporanDataPegawai pegawai={pegawai} />}
                {activeReport === 'dataProduk' && <LaporanDataProduk produk={produk} formatCurrency={formatCurrency} />}
            </div>
        </div>
    );
}

export default PageLaporan;