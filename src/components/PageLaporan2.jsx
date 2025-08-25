// src/components/PageLaporan.jsx

import React, { useState, useMemo } from 'react';
// --- PERUBAHAN: Impor CameraIcon, hapus PrinterIcon jika tidak dipakai di sini lagi ---
import { TrashIcon, ChevronDownIcon, DownloadIcon, CameraIcon } from './Icons'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ... (fungsi exportToPdf biarkan seperti semula) ...
const exportToPdf = (title, head, body, fileName) => {
    const doc = new jsPDF();
    const periode = title.split('\n')[1] || '';
    const mainTitle = title.split('\n')[0];
    
    doc.setFontSize(18);
    doc.text(mainTitle, 14, 22);
    if(periode) {
        doc.setFontSize(10);
        doc.text(periode, 14, 28);
    }
    
    autoTable(doc, {
        startY: 35,
        head: head,
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
    doc.save(fileName);
};


// --- PERUBAHAN: Ganti `handleCetak` menjadi `handleCetakGambar` di props ---
function LaporanRiwayatGajian({ riwayatGajian, formatCurrency, formatDate, handleDelete, handleCetakGambar, pegawai }) {
    const [filters, setFilters] = useState({ startDate: '', endDate: '', pegawaiId: 'semua' });
    const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
    const filteredRiwayat = useMemo(() => { return riwayatGajian.filter(item => { const { startDate, endDate, pegawaiId } = filters; const itemDate = new Date(item.tanggalProses); const pegawaiMatch = pegawaiId === 'semua' || item.pegawaiId == pegawaiId; const startDateMatch = !startDate || itemDate >= new Date(startDate); const endDateMatch = !endDate || itemDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999)); return pegawaiMatch && startDateMatch && endDateMatch; }).sort((a, b) => new Date(b.tanggalProses) - new Date(a.tanggalProses)); }, [riwayatGajian, filters]);
    return ( <div className="space-y-6"> <div className="bg-white p-4 rounded-xl shadow-lg no-print"> <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"> <div> <label className="block text-sm font-medium text-gray-700">Pegawai</label> <select name="pegawaiId" value={filters.pegawaiId} onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> <option value="semua">Semua Pegawai</option> {pegawai.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)} </select> </div> <div> <label className="block text-sm font-medium text-gray-700">Dari Tanggal</label> <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/> </div> <div> <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label> <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/> </div> </div> </div> {filteredRiwayat.length > 0 ? ( <div className="bg-white rounded-xl shadow-lg overflow-x-auto"> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Proses</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pegawai</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji Diterima</th> <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {filteredRiwayat.map(item => ( <tr key={item.id}> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.tanggalProses)}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.periodeAwal)} - {formatDate(item.periodeAkhir)}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pegawaiNama}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{formatCurrency(item.gajiDiterima)}</td> <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2"> {/* --- PERUBAHAN: Panggil handleCetakGambar --- */ } <button onClick={() => handleCetakGambar('slip', item.id)} className="text-blue-600 hover:text-blue-900" title="Cetak Slip sebagai Gambar"> <CameraIcon /> </button> <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900" title="Hapus Riwayat"> <TrashIcon /> </button> </td> </tr> ))} </tbody> </table> </div> ) : ( <div className="text-center bg-white p-10 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Tidak ada riwayat gajian yang cocok dengan filter.</h3></div> )} </div> );
}

// --- PERUBAHAN: Ganti `handleCetak` menjadi `handleCetakGambar` di props ---
function LaporanRiwayatKasbon({ kasbon, formatCurrency, formatDate, handleCetakGambar, pegawai }) {
    const [filters, setFilters] = useState({ startDate: '', endDate: '', pegawaiId: 'semua' });
    const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
    const filteredRiwayat = useMemo(() => { return kasbon.filter(item => { const { startDate, endDate, pegawaiId } = filters; const itemDate = new Date(item.tanggal); const pegawaiMatch = pegawaiId === 'semua' || item.pegawaiId == pegawaiId; const startDateMatch = !startDate || itemDate >= new Date(startDate); const endDateMatch = !endDate || itemDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999)); return pegawaiMatch && startDateMatch && endDateMatch; }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); }, [kasbon, filters]);
    return ( <div className="space-y-6"> <div className="bg-white p-4 rounded-xl shadow-lg no-print"> <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"> <div> <label className="block text-sm font-medium text-gray-700">Pegawai</label> <select name="pegawaiId" value={filters.pegawaiId} onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> <option value="semua">Semua Pegawai</option> {pegawai.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)} </select> </div> <div> <label className="block text-sm font-medium text-gray-700">Dari Tanggal</label> <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/> </div> <div> <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label> <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/> </div> </div> </div> {filteredRiwayat.length > 0 ? ( <div className="bg-white rounded-xl shadow-lg overflow-x-auto"> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pegawai</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {filteredRiwayat.map(item => ( <tr key={item.id} className={item.status === 'dibatalkan' ? 'bg-gray-100 text-gray-400' : ''}> <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(item.tanggal)}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.pegawaiNama}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{formatCurrency(item.jumlah)}</td> <td className="px-6 py-4 whitespace-nowrap text-sm"> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'dibatalkan' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}> {item.status || 'aktif'} </span> </td> <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"> {/* --- PERUBAHAN: Panggil handleCetakGambar --- */ } <button onClick={() => handleCetakGambar('kasbon', item.id)} className="text-blue-600 hover:text-blue-900" title="Cetak Struk sebagai Gambar"> <CameraIcon /> </button> </td> </tr> ))} </tbody> </table> </div> ) : (<div className="text-center bg-white p-10 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Tidak ada riwayat kasbon yang cocok dengan filter.</h3></div>)} </div> );
}

// ... (Komponen LaporanProduksi, LaporanDataPegawai, LaporanDataProduk tidak perlu diubah) ...
function LaporanProduksi({ transaksi, formatCurrency, showNotification, formatDate }) {
    const [filters, setFilters] = useState({ startDate: '', endDate: '', groupBy: 'pegawai', searchTerm: '' });
    const [showReport, setShowReport] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});
    const handleToggleExpand1 = (id) => { setExpandedRows(prev => ({ ...prev, [id]: !prev[id] ? {} : undefined })); };
    const handleToggleExpand2 = (id1, id2) => { setExpandedRows(prev => ({ ...prev, [id1]: { ...prev[id1], [id2]: !prev[id1]?.[id2] } })); };
    const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => { const newFilters = { ...prev, [name]: value }; if (name === 'groupBy') { newFilters.searchTerm = ''; } return newFilters; }); setExpandedRows({}); };
    const reportData = useMemo(() => {
        if (!showReport) return { byEmployee: [], byProduct: [] };
        const { startDate, endDate, searchTerm } = filters;
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        eDate.setHours(23, 59, 59, 999);
        const filteredTx = transaksi.filter(t => { const tDate = new Date(t.tanggal); return tDate >= sDate && tDate <= eDate; });
        const employeeAgg = {};
        filteredTx.forEach(t => { const employee = employeeAgg[t.pegawaiId] || (employeeAgg[t.pegawaiId] = { id: t.pegawaiId, name: t.pegawaiNama, totalPcs: 0, totalUpah: 0, products: {} }); employee.totalUpah += t.grandTotalUpah; t.items.forEach(item => { employee.totalPcs += item.jumlah; const product = employee.products[item.produkId] || (employee.products[item.produkId] = { id: item.produkId, name: item.produkNama, totalPcs: 0, totalUpah: 0, variants: {} }); product.totalPcs += item.jumlah; product.totalUpah += item.totalUpah; const variant = product.variants[item.varianId] || (product.variants[item.varianId] = { id: item.varianId, name: item.varianNama, totalPcs: 0, totalUpah: 0 }); variant.totalPcs += item.jumlah; variant.totalUpah += item.totalUpah; }); });
        const productAgg = {};
        filteredTx.forEach(t => { t.items.forEach(item => { const product = productAgg[item.produkId] || (productAgg[item.produkId] = { id: item.produkId, name: item.produkNama, totalPcs: 0, totalUpah: 0, variants: {} }); product.totalPcs += item.jumlah; product.totalUpah += item.totalUpah; const variant = product.variants[item.varianId] || (product.variants[item.varianId] = { id: item.varianId, name: item.varianNama, totalPcs: 0, totalUpah: 0 }); variant.totalPcs += item.jumlah; variant.totalUpah += item.totalUpah; }); });
        let byEmployee = Object.values(employeeAgg).map(e => ({...e, products: Object.values(e.products).map(p => ({...p, variants: Object.values(p.variants)}))}));
        let byProduct = Object.values(productAgg).map(p => ({...p, variants: Object.values(p.variants)}));
        if (searchTerm) {
            if (filters.groupBy === 'pegawai') { byEmployee = byEmployee.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())); } 
            else { byProduct = byProduct.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())); }
        }
        return { byEmployee, byProduct };
    }, [filters, showReport, transaksi]);
    const handleGenerateReport = () => { if (!filters.startDate || !filters.endDate) { showNotification("Harap tentukan rentang tanggal.", "error"); return; } setShowReport(true); setExpandedRows({}); };
    
    const handleExport = () => {
        const title = `Laporan Produksi (${filters.groupBy === 'pegawai' ? 'per Pegawai' : 'per Produk'})`;
        const head = [['Rincian', 'Total Pcs', 'Total Upah']];
        const body = [];
        const periode = `Periode: ${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`;
        
        if (filters.groupBy === 'pegawai') {
            reportData.byEmployee.forEach((emp, index) => {
                body.push([{ content: emp.name, styles: { fontStyle: 'bold' } }, { content: `${emp.totalPcs} Pcs`, styles: { halign: 'right', fontStyle: 'bold' } }, { content: formatCurrency(emp.totalUpah), styles: { halign: 'right', fontStyle: 'bold' } }]);
                emp.products.forEach(prod => {
                    body.push([{ content: `  ${prod.name}`, styles: { fontStyle: 'bold' } }, { content: `${prod.totalPcs} Pcs`, styles: { halign: 'right' } }, { content: formatCurrency(prod.totalUpah), styles: { halign: 'right' } }]);
                    prod.variants.forEach(v => { body.push([`    ${v.name}`, { content: `${v.totalPcs} Pcs`, styles: { halign: 'right' } }, { content: formatCurrency(v.totalUpah), styles: { halign: 'right' } }]); });
                });
                if (index < reportData.byEmployee.length - 1) { body.push(['', '', '']); }
            });
        } else {
            reportData.byProduct.forEach((prod, index) => {
                body.push([{ content: prod.name, styles: { fontStyle: 'bold' } }, { content: `${prod.totalPcs} Pcs`, styles: { halign: 'right', fontStyle: 'bold' } }, { content: formatCurrency(prod.totalUpah), styles: { halign: 'right', fontStyle: 'bold' } }]);
                prod.variants.forEach(v => { body.push([`  ${v.name}`, { content: `${v.totalPcs} Pcs`, styles: { halign: 'right' } }, { content: formatCurrency(v.totalUpah), styles: { halign: 'right' } }]); });
                if (index < reportData.byProduct.length - 1) { body.push(['', '', '']); }
            });
        }
        exportToPdf(`${title}\n${periode}`, head, body, 'laporan-produksi.pdf');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-lg no-print"> <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"> <div><label className="block text-sm font-medium text-gray-700">Kelompokkan</label><select name="groupBy" value={filters.groupBy} onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"><option value="pegawai">Berdasarkan Pegawai</option><option value="produk">Berdasarkan Produk</option></select></div> <div><label className="block text-sm font-medium text-gray-700">Dari Tanggal</label><input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/></div> <div><label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label><input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/></div> <div className="md:col-span-1"><label className="block text-sm font-medium text-gray-700">Cari...</label><input type="text" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder={`Cari nama ${filters.groupBy}...`} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/></div> <button onClick={handleGenerateReport} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Tampilkan</button> </div> </div>
            {showReport && (
                <div>
                    <div className="flex justify-end no-print mb-4"><button onClick={handleExport} className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"><DownloadIcon /> Export ke PDF</button></div>
                    <div className="bg-white rounded-xl shadow-lg overflow-x-auto p-6 printable-area">
                        <div className="print-only mb-6"><h3 className="text-xl font-bold text-center">Laporan Produksi</h3><p className="text-center text-sm">Periode: {formatDate(filters.startDate)} - {formatDate(filters.endDate)}</p></div>
                        {filters.groupBy === 'pegawai' && ( <table className="min-w-full"> <thead className="bg-gray-50"><tr><th className="w-10"></th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pegawai</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pcs</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Upah</th></tr></thead> <tbody className="bg-white divide-y divide-gray-200"> {reportData.byEmployee.map(emp => { const isEmpExpanded = !!expandedRows[emp.id]; return ( <React.Fragment key={emp.id}> <tr className="cursor-pointer hover:bg-gray-50" onClick={() => handleToggleExpand1(emp.id)}> <td className="py-3 pl-4"><ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isEmpExpanded ? 'rotate-180' : ''}`} /></td> <td className="px-4 py-3 font-bold">{emp.name}</td><td className="px-4 py-3 text-right font-bold">{emp.totalPcs} Pcs</td><td className="px-4 py-3 text-right font-bold">{formatCurrency(emp.totalUpah)}</td> </tr> {isEmpExpanded && emp.products.map(prod => { const isProdExpanded = expandedRows[emp.id]?.[prod.id]; return ( <React.Fragment key={prod.id}> <tr className="cursor-pointer hover:bg-gray-50" onClick={() => handleToggleExpand2(emp.id, prod.id)}> <td></td><td className="pl-10 pr-4 py-2 font-semibold flex items-center"><ChevronDownIcon className={`h-4 w-4 mr-2 text-gray-400 transition-transform duration-300 ${isProdExpanded ? 'rotate-180' : ''}`} />{prod.name}</td> <td className="px-4 py-2 text-right font-semibold">{prod.totalPcs} Pcs</td><td className="px-4 py-2 text-right font-semibold">{formatCurrency(prod.totalUpah)}</td> </tr> {isProdExpanded && prod.variants.map(v => ( <tr key={v.id}><td colSpan="2" className="pl-16 pr-4 py-1 text-sm text-gray-600">{v.name}</td><td className="px-4 py-1 text-right text-sm text-gray-600">{v.totalPcs} Pcs</td><td className="px-4 py-1 text-right text-sm text-gray-600">{formatCurrency(v.totalUpah)}</td></tr>))} </React.Fragment> );})} </React.Fragment> );})} </tbody> </table> )}
                        {filters.groupBy === 'produk' && ( <table className="min-w-full"> <thead className="bg-gray-50"><tr><th className="w-10"></th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pcs</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Upah</th></tr></thead> <tbody className="bg-white divide-y divide-gray-200"> {reportData.byProduct.map(prod => { const isExpanded = !!expandedRows[prod.id]; return ( <React.Fragment key={prod.id}> <tr className="cursor-pointer hover:bg-gray-50" onClick={() => handleToggleExpand1(prod.id)}> <td className="py-3 pl-4"><ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} /></td> <td className="px-4 py-3 font-bold">{prod.name}</td><td className="px-4 py-3 text-right font-bold">{prod.totalPcs} Pcs</td><td className="px-4 py-3 text-right font-bold">{formatCurrency(prod.totalUpah)}</td> </tr> {isExpanded && (<tr><td colSpan="4" className="py-2 px-4"><div className="pl-8"><table className="min-w-full"><tbody>{prod.variants.map(v => ( <tr key={v.id}><td className="py-1 text-sm text-gray-600">{v.name}</td><td className="py-1 text-right text-sm text-gray-600">{v.totalPcs} Pcs</td><td className="py-1 text-right text-sm text-gray-600">{formatCurrency(v.totalUpah)}</td></tr>))}</tbody></table></div></td></tr>)} </React.Fragment> )})} </tbody> </table> )}
                    </div>
                </div>
            )}
        </div>
    );
}

function LaporanDataPegawai({ pegawai }) { const handleExport = () => { const head = [['No', 'Nama', 'Alamat', 'Kontak', 'Status']]; const body = pegawai.map((p, index) => [ index + 1, p.nama, p.alamat || '-', p.kontak, p.status ]); exportToPdf('Laporan Data Pegawai', head, body, 'laporan-pegawai.pdf'); }; return ( <div className="space-y-6"> <div className="flex justify-end no-print"> <button onClick={handleExport} className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"> <DownloadIcon /> Export ke PDF </button> </div> <div className="bg-white rounded-xl shadow-lg overflow-x-auto"> <div className="p-6"> <h3 className="text-xl font-bold text-center mb-6">Laporan Data Pegawai</h3> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {pegawai.map((p, index) => ( <tr key={p.id}> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nama}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.alamat}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.kontak}</td> <td className="px-6 py-4 whitespace-nowrap text-sm"> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> {p.status} </span> </td> </tr> ))} </tbody> </table> </div> </div> </div> ); }
function LaporanDataProduk({ produk, formatCurrency }) { const handleExport = () => { const head = [['Nama Produk', 'Grup Varian', 'Nama Varian', 'Upah']]; const body = produk.flatMap(p => p.variantGroups.flatMap(g => g.variants.map(v => [ p.namaProduk, g.namaGrup, v.namaVarian, formatCurrency(v.upah) ]))); exportToPdf('Laporan Data Produk', head, body, 'laporan-produk.pdf'); }; return ( <div className="space-y-6"> <div className="flex justify-end no-print"> <button onClick={handleExport} className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"> <DownloadIcon /> Export ke PDF </button> </div> <div className="bg-white rounded-xl shadow-lg overflow-x-auto"> <div className="p-6"> <h3 className="text-xl font-bold text-center mb-6">Laporan Data Produk</h3> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grup Varian</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Varian</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upah</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {produk.flatMap(p => p.variantGroups.flatMap(g => g.variants.map(v => ( <tr key={`${p.id}-${g.id}-${v.id}`}> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.namaProduk}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{g.namaGrup}</td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.namaVarian}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{formatCurrency(v.upah)}</td> </tr> )) ) )} </tbody> </table> </div> </div> </div> ); }

// --- PERUBAHAN: Ganti `handleCetakSlip` & `handleCetakStrukKasbon` menjadi `handleCetakGambar` di props ---
function PageLaporan({ riwayatGajian, kasbon, formatCurrency, formatDate, handleRiwayatGajianDelete, transaksi, pegawai, produk, showNotification, handleCetakGambar }) {
    const [activeReport, setActiveReport] = useState('riwayatGajian');
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pusat Laporan</h2>
            <div className="mb-6 border-b border-gray-200 no-print">
                <nav className="-mb-px flex space-x-6 horizontal-scrollbar" aria-label="Tabs">
                    <button onClick={() => setActiveReport('riwayatGajian')} className={`flex-shrink-0 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'riwayatGajian' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Riwayat Gajian</button>
                    <button onClick={() => setActiveReport('riwayatKasbon')} className={`flex-shrink-0 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'riwayatKasbon' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Riwayat Kasbon</button>
                    <button onClick={() => setActiveReport('produksi')} className={`flex-shrink-0 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'produksi' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Laporan Produksi</button>
                    <button onClick={() => setActiveReport('dataPegawai')} className={`flex-shrink-0 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'dataPegawai' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Data Pegawai</button>
                    <button onClick={() => setActiveReport('dataProduk')} className={`flex-shrink-0 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeReport === 'dataProduk' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Data Produk</button>
                </nav>
            </div>
            <div>
                {activeReport === 'riwayatGajian' && <LaporanRiwayatGajian riwayatGajian={riwayatGajian} formatCurrency={formatCurrency} formatDate={formatDate} handleDelete={handleRiwayatGajianDelete} handleCetakGambar={handleCetakGambar} pegawai={pegawai} />}
                {activeReport === 'riwayatKasbon' && <LaporanRiwayatKasbon kasbon={kasbon} formatCurrency={formatCurrency} formatDate={formatDate} handleCetakGambar={handleCetakGambar} pegawai={pegawai} />}
                {activeReport === 'produksi' && <LaporanProduksi transaksi={transaksi} formatCurrency={formatCurrency} showNotification={showNotification} formatDate={formatDate} />}
                {activeReport === 'dataPegawai' && <LaporanDataPegawai pegawai={pegawai} />}
                {activeReport === 'dataProduk' && <LaporanDataProduk produk={produk} formatCurrency={formatCurrency} />}
            </div>
        </div>
    );
}

export default PageLaporan;