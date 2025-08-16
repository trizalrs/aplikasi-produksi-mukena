// src/App.jsx

import React, { useState, useEffect, useRef } from 'react';

// Impor Ikon
import {
    UserIcon, CubeIcon, ClipboardListIcon, CashIcon, DocumentReportIcon, ChartPieIcon,
    PlusIcon, DownloadIcon, UploadIcon, EditIcon, TrashIcon, XCircleIcon,
    ChevronDownIcon, SaveIcon, ArchiveIcon, DocumentChartBarIcon, PrinterIcon
} from './components/Icons';

// Impor Halaman
import PageDashboard from './components/PageDashboard';
import PagePegawai from './components/PagePegawai';
import PageProduk from './components/PageProduk';
import PageTransaksi from './components/PageTransaksi';
import PageKasbon from './components/PageKasbon';
import PagePenggajian from './components/PagePenggajian';
import PageLaporan from './components/PageLaporan';

// Impor Modal
import ModalPegawai from './components/ModalPegawai';
import ModalProduk from './components/ModalProduk';
import ModalTransaksi from './components/ModalTransaksi';
import ModalKasbon from './components/ModalKasbon';
import ModalKonfirmasi from './components/ModalKonfirmasi';
import ModalSuksesTransaksi from './components/ModalSuksesTransaksi';
import StrukTransaksi from './components/StrukTransaksi';
import ModalSuksesKasbon from './components/ModalSuksesKasbon';
import StrukKasbon from './components/StrukKasbon';
import SlipGaji from './components/SlipGaji';
import ModalSuksesGajian from './components/ModalSuksesGajian'; // <-- BARU: Impor modal sukses gajian

const getInitialState = (key, defaultValue = []) => {
    try {
        const storedItem = localStorage.getItem(key);
        if (storedItem) {
            return JSON.parse(storedItem);
        }
    } catch (error) {
        console.error(`Gagal memuat data ${key}:`, error);
    }
    return defaultValue;
};


// === Komponen Utama Aplikasi ===
function App() {
    // State Management
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [pegawai, setPegawai] = useState(() => getInitialState('dataPegawai'));
    const [produk, setProduk] = useState(() => getInitialState('dataProduk'));
    const [transaksi, setTransaksi] = useState(() => getInitialState('dataTransaksi'));
    const [kasbon, setKasbon] = useState(() => getInitialState('dataKasbon'));
    const [pembayaranKasbon, setPembayaranKasbon] = useState(() => getInitialState('pembayaranKasbon'));
    const [riwayatGajian, setRiwayatGajian] = useState(() => getInitialState('riwayatGajian'));
    const [isPegawaiModalOpen, setIsPegawaiModalOpen] = useState(false);
    const [editingPegawai, setEditingPegawai] = useState(null);
    const [formPegawaiData, setFormPegawaiData] = useState({ nama: '', alamat: '', kontak: '', status: 'Aktif' });
    const [isProdukModalOpen, setIsProdukModalOpen] = useState(false);
    const [editingProduk, setEditingProduk] = useState(null);
    const [formProdukData, setFormProdukData] = useState({ namaProduk: '', variantGroups: [{ id: Date.now(), namaGrup: '', variants: [{ id: Date.now(), namaVarian: '', upah: '' }] }] });
    const [isTransaksiModalOpen, setIsTransaksiModalOpen] = useState(false);
    const [editingTransaksi, setEditingTransaksi] = useState(null);
    const [isKasbonModalOpen, setIsKasbonModalOpen] = useState(false);
    const [editingKasbon, setEditingKasbon] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const fileInputRef = useRef(null);
    const [reportFilters, setReportFilters] = useState({ startDate: '', endDate: '', pegawaiId: 'semua' });
    const [reportData, setReportData] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [konfirmasi, setKonfirmasi] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });
    
    // --- STATE UNTUK STRUK & SLIP DIPERBARUI ---
    const [isSuksesModalOpen, setIsSuksesModalOpen] = useState(false);
    const [dataUntukStruk, setDataUntukStruk] = useState(null);
    const [isSuksesKasbonModalOpen, setIsSuksesKasbonModalOpen] = useState(false);
    const [dataUntukStrukKasbon, setDataUntukStrukKasbon] = useState(null);
    
    // <-- BARU: State untuk Slip Gaji (single & massal) & Modal Sukses Gajian -->
    const [isSuksesGajianModalOpen, setIsSuksesGajianModalOpen] = useState(false);
    const [dataUntukSlipGaji, setDataUntukSlipGaji] = useState(null); // Untuk cetak tunggal
    const [dataUntukSlipGajiMassal, setDataUntukSlipGajiMassal] = useState(null); // Untuk cetak massal

    // Local Storage Hooks
    useEffect(() => { localStorage.setItem('dataPegawai', JSON.stringify(pegawai)); }, [pegawai]);
    useEffect(() => { localStorage.setItem('dataProduk', JSON.stringify(produk)); }, [produk]);
    useEffect(() => { localStorage.setItem('dataTransaksi', JSON.stringify(transaksi)); }, [transaksi]);
    useEffect(() => { localStorage.setItem('dataKasbon', JSON.stringify(kasbon)); }, [kasbon]);
    useEffect(() => { localStorage.setItem('pembayaranKasbon', JSON.stringify(pembayaranKasbon)); }, [pembayaranKasbon]);
    useEffect(() => { localStorage.setItem('riwayatGajian', JSON.stringify(riwayatGajian)); }, [riwayatGajian]);

    // ... (Fungsi Bantuan tidak berubah) ...
    const showNotification = (message, type = 'success') => { setNotification({ show: true, message, type }); setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000); };
    const formatCurrency = (number) => { if (isNaN(number)) return "Rp 0"; return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number); };
    const formatDate = (dateString) => { if (!dateString) return ''; const options = { year: 'numeric', month: 'long', day: 'numeric' }; return new Date(dateString).toLocaleDateString('id-ID', options); };
    const handleKonfirmasi = (title, message, onConfirm) => { setKonfirmasi({ isOpen: true, title, message, onConfirm }); };
    const resetKonfirmasi = () => { setKonfirmasi({ isOpen: false, title: '', message: '', onConfirm: () => {} }); };

    // ... (Fungsi CRUD tidak berubah) ...
    const handlePegawaiInputChange = (e) => setFormPegawaiData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handlePegawaiSubmit = (e) => { e.preventDefault(); if (!formPegawaiData.nama || !formPegawaiData.kontak) { showNotification("Nama dan Kontak wajib diisi!", "error"); return; } if (editingPegawai) { setPegawai(pegawai.map(p => p.id === editingPegawai.id ? { ...p, ...formPegawaiData } : p)); showNotification("Data pegawai diperbarui!"); } else { setPegawai([...pegawai, { id: Date.now(), ...formPegawaiData }]); showNotification("Pegawai baru ditambahkan!"); } closePegawaiModal(); };
    const openPegawaiModal = (p = null) => { setEditingPegawai(p); setFormPegawaiData(p ? { nama: p.nama, alamat: p.alamat, kontak: p.kontak, status: p.status } : { nama: '', alamat: '', kontak: '', status: 'Aktif' }); setIsPegawaiModalOpen(true); };
    const closePegawaiModal = () => setIsPegawaiModalOpen(false);
    const handlePegawaiDelete = (id) => { const hasTransaksi = transaksi.some(t => t.pegawaiId === id); const hasKasbon = kasbon.some(k => k.pegawaiId === id); if (hasTransaksi || hasKasbon) { showNotification("Pegawai tidak bisa dihapus karena memiliki riwayat transaksi/kasbon.", "error"); return; } handleKonfirmasi("Hapus Pegawai?", "Apakah Anda yakin ingin menghapus data pegawai ini?", () => { setPegawai(pegawai.filter(p => p.id !== id)); showNotification("Data pegawai dihapus.", "warning"); resetKonfirmasi(); }); };
    const handleProdukNameChange = (e) => setFormProdukData(prev => ({ ...prev, namaProduk: e.target.value }));
    const handleGroupChange = (groupId, e) => { const newGroups = formProdukData.variantGroups.map(g => g.id === groupId ? { ...g, namaGrup: e.target.value } : g); setFormProdukData(prev => ({ ...prev, variantGroups: newGroups })); };
    const handleVariantChange = (groupId, variantId, e) => { const { name, value } = e.target; const newGroups = formProdukData.variantGroups.map(g => { if (g.id === groupId) { const newVariants = g.variants.map(v => v.id === variantId ? { ...v, [name]: value } : v); return { ...g, variants: newVariants }; } return g; }); setFormProdukData(prev => ({ ...prev, variantGroups: newGroups })); };
    const addGroup = () => setFormProdukData(prev => ({...prev, variantGroups: [...prev.variantGroups, { id: Date.now(), namaGrup: '', variants: [{ id: Date.now(), namaVarian: '', upah: '' }] }]}));
    const removeGroup = (groupId) => { if (formProdukData.variantGroups.length <= 1) { showNotification("Setidaknya harus ada satu grup varian", "error"); return; } setFormProdukData(prev => ({...prev, variantGroups: prev.variantGroups.filter(g => g.id !== groupId)})); };
    const addVariantToGroup = (groupId) => { const newGroups = formProdukData.variantGroups.map(g => g.id === groupId ? { ...g, variants: [...g.variants, { id: Date.now(), namaVarian: '', upah: '' }] } : g); setFormProdukData(prev => ({ ...prev, variantGroups: newGroups })); };
    const removeVariantFromGroup = (groupId, variantId) => { const newGroups = formProdukData.variantGroups.map(g => { if (g.id === groupId) { if (g.variants.length <= 1) { showNotification("Setidaknya harus ada satu varian dalam grup", "error"); return g; } return { ...g, variants: g.variants.filter(v => v.id !== variantId) }; } return g; }); setFormProdukData(prev => ({ ...prev, variantGroups: newGroups })); };
    const handleProdukSubmit = (e) => { e.preventDefault(); if (!formProdukData.namaProduk) { showNotification("Nama Produk wajib diisi!", "error"); return; } for (const group of formProdukData.variantGroups) { if (!group.namaGrup) { showNotification("Nama Grup Varian wajib diisi.", "error"); return; } for (const variant of group.variants) { if (!variant.namaVarian || !variant.upah) { showNotification(`Nama Varian dan Upah di grup "${group.namaGrup}" wajib diisi.`, "error"); return; } if (isNaN(parseInt(variant.upah, 10))) { showNotification(`Upah untuk varian "${variant.namaVarian}" harus angka.`, "error"); return; } } } const dataToSave = {...formProdukData, variantGroups: formProdukData.variantGroups.map(g => ({...g, variants: g.variants.map(v => ({ ...v, upah: parseInt(v.upah, 10) }))}))}; if (editingProduk) { setProduk(produk.map(p => p.id === editingProduk.id ? { ...p, ...dataToSave } : p)); showNotification("Data produk diperbarui!"); } else { setProduk([...produk, { id: Date.now(), ...dataToSave }]); showNotification("Produk baru ditambahkan!"); } closeProdukModal(); };
    const openProdukModal = (p = null) => { setEditingProduk(p); setFormProdukData(p ? { namaProduk: p.namaProduk, variantGroups: JSON.parse(JSON.stringify(p.variantGroups)) } : { namaProduk: '', variantGroups: [{ id: Date.now(), namaGrup: '', variants: [{ id: Date.now(), namaVarian: '', upah: '' }] }] }); setIsProdukModalOpen(true); };
    const closeProdukModal = () => setIsProdukModalOpen(false);
    const handleProdukDelete = (id) => { const hasTransaksi = transaksi.some(t => t.items.some(item => item.produkId === id)); if (hasTransaksi) { showNotification("Produk tidak bisa dihapus karena sudah digunakan dalam transaksi.", "error"); return; } handleKonfirmasi("Hapus Produk?", "Apakah Anda yakin ingin menghapus data produk ini?", () => { setProduk(produk.filter(p => p.id !== id)); showNotification("Data produk dihapus.", "warning"); resetKonfirmasi(); }); };
    const openTransaksiModal = (transaksiToEdit = null) => { setEditingTransaksi(transaksiToEdit); setIsTransaksiModalOpen(true); };
    const closeTransaksiModal = () => { setEditingTransaksi(null); setIsTransaksiModalOpen(false); };
    const handleTransaksiDelete = (id) => { handleKonfirmasi("Hapus Transaksi?", "Tindakan ini tidak bisa dibatalkan. Yakin ingin menghapus transaksi ini?", () => { setTransaksi(transaksi.filter(t => t.id !== id)); showNotification("Transaksi berhasil dihapus.", "warning"); resetKonfirmasi(); }); };
    const openKasbonModal = (kasbonToEdit = null) => { setEditingKasbon(kasbonToEdit); setIsKasbonModalOpen(true); };
    const closeKasbonModal = () => { setEditingKasbon(null); setIsKasbonModalOpen(false); };
    const handleKasbonDelete = (id) => { handleKonfirmasi("Hapus Kasbon?", "Yakin ingin menghapus data kasbon ini?", () => { setKasbon(kasbon.filter(k => k.id !== id)); showNotification("Data kasbon berhasil dihapus.", "warning"); resetKonfirmasi(); }); };
    
    // --- FUNGSI SUBMIT DIPERBARUI ---
    const handleTransaksiSubmit = (formData) => { 
        let newTransaksiData; 
        if (editingTransaksi) { 
            const updatedTransaksi = { ...editingTransaksi, ...formData }; 
            setTransaksi(transaksi.map(t => t.id === editingTransaksi.id ? updatedTransaksi : t)); 
            newTransaksiData = updatedTransaksi; 
            showNotification("Transaksi berhasil diperbarui!"); 
        } else { 
            newTransaksiData = { id: Date.now(), ...formData, sudahDibayar: false }; 
            setTransaksi(prev => [...prev, newTransaksiData]); 
            showNotification("Transaksi baru berhasil disimpan!"); 
        } 
        setDataUntukStruk(newTransaksiData);
        closeTransaksiModal();
        setIsSuksesModalOpen(true);
    };

    const handleKasbonSubmit = (formData) => { 
        let newKasbonData; 
        if (editingKasbon) { 
            const updatedKasbon = { ...editingKasbon, ...formData }; 
            setKasbon(kasbon.map(k => k.id === editingKasbon.id ? updatedKasbon : k)); 
            newKasbonData = updatedKasbon; 
            showNotification("Data kasbon berhasil diperbarui!"); 
        } else { 
            newKasbonData = { id: Date.now(), ...formData }; 
            setKasbon(prev => [...prev, newKasbonData]); 
            showNotification("Kasbon baru berhasil ditambahkan!"); 
        } 
        setDataUntukStrukKasbon(newKasbonData);
        closeKasbonModal();
        setIsSuksesKasbonModalOpen(true);
    };

    // --- FUNGSI CETAK SLIP GAJI DIPERBARUI ---
    // Untuk mencetak satu slip dari halaman laporan
    const handleCetakSlip = (riwayatId) => {
        const dataSlip = riwayatGajian.find(r => r.id === riwayatId);
        if (dataSlip) {
            setDataUntukSlipGaji(dataSlip);
            setTimeout(() => {
                window.print();
                setDataUntukSlipGaji(null); // Membersihkan setelah mencetak
            }, 100);
        }
    };
    
    // <-- BARU: Untuk mencetak semua slip dari modal sukses -->
    const handleCetakSlipMassal = () => {
        window.print();
        // Reset data setelah cetak
        setDataUntukSlipGajiMassal(null);
        setIsSuksesGajianModalOpen(false);
    };

    // --- FUNGSI PROSES GAJIAN DIPERBARUI ---
    const handleProsesGajian = () => {
        const newRiwayatGajian = [];
        const newPembayaranKasbon = [];
        const today = new Date().toISOString().slice(0, 10);
        const transactionIdsToUpdate = new Set();
        
        reportData.forEach(item => {
            if (item.totalUpah <= 0 && item.bayarKasbon <= 0) return;
            const gajianId = Date.now() + item.pegawaiId;
            const relatedTransactionIds = transaksi
                .filter(t => {
                    const tDate = new Date(t.tanggal);
                    const startDate = new Date(reportFilters.startDate);
                    const endDate = new Date(reportFilters.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    return t.pegawaiId == item.pegawaiId && !t.sudahDibayar && tDate >= startDate && tDate <= endDate;
                })
                .map(t => t.id);

            newRiwayatGajian.push({
                id: gajianId,
                ...item,
                periodeAwal: reportFilters.startDate,
                periodeAkhir: reportFilters.endDate,
                tanggalProses: today,
                transaksiIds: relatedTransactionIds
            });

            if (item.bayarKasbon > 0) {
                newPembayaranKasbon.push({
                    id: Date.now() + item.pegawaiId + 1,
                    pegawaiId: item.pegawaiId,
                    pegawaiNama: item.pegawaiNama,
                    tanggal: today,
                    jumlah: item.bayarKasbon,
                    keterangan: `Pembayaran dari gaji periode ${reportFilters.startDate} - ${reportFilters.endDate}`,
                    gajianId: gajianId
                });
            }
            relatedTransactionIds.forEach(id => transactionIdsToUpdate.add(id));
        });

        if (newRiwayatGajian.length === 0) {
            showNotification("Tidak ada data untuk diproses.", "warning");
            return;
        }

        setRiwayatGajian(prev => [...prev, ...newRiwayatGajian]);
        setPembayaranKasbon(prev => [...prev, ...newPembayaranKasbon]);
        setTransaksi(prevTransaksi =>
            prevTransaksi.map(t =>
                transactionIdsToUpdate.has(t.id) ? { ...t, sudahDibayar: true } : t
            )
        );

        // <-- LOGIKA BARU: Tampilkan modal sukses, jangan notifikasi lagi -->
        setDataUntukSlipGajiMassal(newRiwayatGajian); // Siapkan data untuk dicetak
        setIsSuksesGajianModalOpen(true); // Buka modal
        setShowReport(false); // Sembunyikan tabel laporan penggajian
    };
    
    // ... (Sisa fungsi tidak berubah) ...
    const handleRiwayatGajianDelete = (id) => { handleKonfirmasi("Batalkan Gajian?", "Ini akan mengembalikan status transaksi dan pembayaran kasbon terkait. Yakin?", () => { const riwayatToDelete = riwayatGajian.find(r => r.id === id); if (!riwayatToDelete) return; const transactionIdsToRevert = riwayatToDelete.transaksiIds || []; setTransaksi(prev => prev.map(t => transactionIdsToRevert.includes(t.id) ? { ...t, sudahDibayar: false } : t)); setPembayaranKasbon(prev => prev.filter(p => p.gajianId !== id)); setRiwayatGajian(prev => prev.filter(r => r.id !== id)); showNotification("Riwayat gajian berhasil dibatalkan.", "warning"); resetKonfirmasi(); }); };
    const handleBackup = () => { const dataToBackup = { pegawai, produk, transaksi, kasbon, pembayaranKasbon, riwayatGajian }; const jsonString = JSON.stringify(dataToBackup, null, 2); const blob = new Blob([jsonString], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); const date = new Date().toISOString().slice(0, 10); link.download = `backup-produksi-mukena-${date}.json`; link.href = url; link.click(); URL.revokeObjectURL(url); showNotification("Backup data berhasil diunduh!"); };
    const handleRestoreChange = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const restoredData = JSON.parse(event.target.result); handleKonfirmasi("Pulihkan Data?", "PERINGATAN: Ini akan menimpa semua data yang ada. Lanjutkan?", () => { if (restoredData && Array.isArray(restoredData.pegawai) && Array.isArray(restoredData.produk)) { setPegawai(restoredData.pegawai || []); setProduk(restoredData.produk || []); setTransaksi(restoredData.transaksi || []); setKasbon(restoredData.kasbon || []); setPembayaranKasbon(restoredData.pembayaranKasbon || []); setRiwayatGajian(restoredData.riwayatGajian || []); showNotification("Data berhasil dipulihkan dari backup!"); } else { throw new Error("Format file backup tidak valid."); } resetKonfirmasi(); }); } catch (error) { showNotification(`Gagal memulihkan data: ${error.message}`, "error"); } finally { e.target.value = null; } }; reader.readAsText(file); };

    // === Render Komponen (Tampilan UI) ===
    return (
        <>
            <div className="main-app no-print">
                {notification.show && (
                    <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {notification.message}
                    </div>
                )}
                <ModalKonfirmasi
                    isOpen={konfirmasi.isOpen}
                    title={konfirmasi.title}
                    message={konfirmasi.message}
                    onConfirm={konfirmasi.onConfirm}
                    onCancel={resetKonfirmasi}
                />
                <ModalSuksesTransaksi 
                    isOpen={isSuksesModalOpen}
                    closeModal={() => setIsSuksesModalOpen(false)}
                    setDataUntukStruk={setDataUntukStruk}
                />
                <ModalSuksesKasbon
                    isOpen={isSuksesKasbonModalOpen}
                    closeModal={() => setIsSuksesKasbonModalOpen(false)}
                    setDataUntukStrukKasbon={setDataUntukStrukKasbon}
                />
                {/* <-- BARU: Render Modal Sukses Gajian --> */}
                <ModalSuksesGajian
                    isOpen={isSuksesGajianModalOpen}
                    closeModal={() => {
                        setIsSuksesGajianModalOpen(false);
                        setDataUntukSlipGajiMassal(null);
                    }}
                    handlePrint={handleCetakSlipMassal}
                />
                
                <header className="bg-white shadow-md p-4 sticky top-0 z-40">
                    <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Aplikasi Produksi Mukena</h1>
                        <div className="flex items-center space-x-2">
                            <button onClick={handleBackup} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition duration-300 text-sm">
                                <DownloadIcon /> Backup
                            </button>
                            <button onClick={() => fileInputRef.current.click()} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition duration-300 text-sm">
                                <UploadIcon /> Restore
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleRestoreChange} accept=".json" className="hidden" />
                        </div>
                    </div>
                </header>
                
                <nav className="bg-white shadow-sm">
                    <div className="container mx-auto flex flex-wrap">
                        <button onClick={() => setActiveMenu('dashboard')} className={`flex items-center py-3 px-4 font-semibold text-sm transition-colors duration-300 ${activeMenu === 'dashboard' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <ChartPieIcon /> Dashboard
                        </button>
                        <button onClick={() => setActiveMenu('pegawai')} className={`flex items-center py-3 px-4 font-semibold text-sm transition-colors duration-300 ${activeMenu === 'pegawai' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <UserIcon /> Data Pegawai
                        </button>
                        <button onClick={() => setActiveMenu('produk')} className={`flex items-center py-3 px-4 font-semibold text-sm transition-colors duration-300 ${activeMenu === 'produk' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <CubeIcon /> Data Produk
                        </button>
                        <button onClick={() => setActiveMenu('transaksi')} className={`flex items-center py-3 px-4 font-semibold text-sm transition-colors duration-300 ${activeMenu === 'transaksi' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <ClipboardListIcon /> Transaksi
                        </button>
                        <button onClick={() => setActiveMenu('kasbon')} className={`flex items-center py-3 px-4 font-semibold text-sm transition-colors duration-300 ${activeMenu === 'kasbon' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <CashIcon /> Kasbon
                        </button>
                         <button onClick={() => setActiveMenu('penggajian')} className={`flex items-center py-3 px-4 font-semibold text-sm transition-colors duration-300 ${activeMenu === 'penggajian' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <ArchiveIcon /> Penggajian
                        </button>
                        <button onClick={() => setActiveMenu('laporan')} className={`flex items-center py-3 px-4 font-semibold text-sm transition-colors duration-300 ${activeMenu === 'laporan' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <DocumentChartBarIcon /> Laporan
                        </button>
                    </div>
                </nav>

                <main className="container mx-auto p-4 md:p-8">
                    {activeMenu === 'dashboard' && <PageDashboard pegawai={pegawai} transaksi={transaksi} kasbon={kasbon} formatCurrency={formatCurrency} formatDate={formatDate} />}
                    {activeMenu === 'pegawai' && <PagePegawai pegawai={pegawai} openModal={openPegawaiModal} handleDelete={handlePegawaiDelete} />}
                    {activeMenu === 'produk' && <PageProduk produk={produk} openModal={openProdukModal} handleDelete={handleProdukDelete} formatCurrency={formatCurrency} />}
                    {activeMenu === 'transaksi' && <PageTransaksi transaksi={transaksi} openModal={openTransaksiModal} handleDelete={handleTransaksiDelete} formatCurrency={formatCurrency} formatDate={formatDate} pegawai={pegawai} />}
                    {activeMenu === 'kasbon' && <PageKasbon pegawai={pegawai} kasbon={kasbon} pembayaranKasbon={pembayaranKasbon} openModal={openKasbonModal} formatCurrency={formatCurrency} formatDate={formatDate} />}
                    {activeMenu === 'penggajian' && <PagePenggajian pegawai={pegawai} transaksi={transaksi} kasbon={kasbon} pembayaranKasbon={pembayaranKasbon} formatCurrency={formatCurrency} reportFilters={reportFilters} setReportFilters={setReportFilters} reportData={reportData} setReportData={setReportData} showReport={showReport} setShowReport={setShowReport} handleProsesGajian={handleProsesGajian} showNotification={showNotification} />}
                    {activeMenu === 'laporan' && <PageLaporan riwayatGajian={riwayatGajian} formatCurrency={formatCurrency} formatDate={formatDate} handleRiwayatGajianDelete={handleRiwayatGajianDelete} transaksi={transaksi} pegawai={pegawai} produk={produk} showNotification={showNotification} handleCetakSlip={handleCetakSlip} />}
                </main>

                {isPegawaiModalOpen && <ModalPegawai editingPegawai={editingPegawai} formPegawaiData={formPegawaiData} handleInputChange={handlePegawaiInputChange} handleSubmit={handlePegawaiSubmit} closeModal={closePegawaiModal} />}
                {isProdukModalOpen && <ModalProduk editingProduk={editingProduk} formProdukData={formProdukData} handleProdukNameChange={handleProdukNameChange} handleGroupChange={handleGroupChange} handleVariantChange={handleVariantChange} addGroup={addGroup} removeGroup={removeGroup} addVariantToGroup={addVariantToGroup} removeVariantFromGroup={removeVariantFromGroup} handleSubmit={handleProdukSubmit} closeModal={closeProdukModal} />}
                {isTransaksiModalOpen && <ModalTransaksi pegawai={pegawai} produk={produk} editingTransaksi={editingTransaksi} handleSubmit={handleTransaksiSubmit} closeModal={closeTransaksiModal} formatCurrency={formatCurrency} showNotification={showNotification} />}
                {isKasbonModalOpen && <ModalKasbon pegawai={pegawai} editingKasbon={editingKasbon} handleSubmit={handleKasbonSubmit} closeModal={closeKasbonModal} formatCurrency={formatCurrency} />}
            </div>
            {/* --- AREA CETAK DIPERBARUI UNTUK MENDUKUNG CETAK TUNGGAL & MASSAL --- */}
            <div className="print-only">
                {dataUntukStruk && (
                    <StrukTransaksi 
                        transaksi={dataUntukStruk}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                    />
                )}
                {dataUntukStrukKasbon && (
                    <StrukKasbon
                        kasbon={dataUntukStrukKasbon}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                    />
                )}
                {dataUntukSlipGaji && (
                    <SlipGaji
                        data={dataUntukSlipGaji}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                    />
                )}
                {dataUntukSlipGajiMassal && dataUntukSlipGajiMassal.map(slip => (
                    <SlipGaji
                        key={slip.id}
                        data={slip}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                    />
                ))}
            </div>
        </>
    );
}

export default App;