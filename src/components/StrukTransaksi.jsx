// src/components/StrukTransaksi.jsx

import React from 'react';
import logo from '../assets/logo.png';

function StrukTransaksi({ transaksi, formatCurrency, formatDate, paperSize }) {
    if (!transaksi) return null;
    return (
        // --- PERUBAHAN: Tambahkan ID unik 'struk-transaksi-to-print' di sini ---
        <div id="struk-transaksi-to-print" className={`print-only font-struk text-xs text-black bg-white struk-${paperSize}`}>
            <div className="struk-content">
                <div className="text-center mb-2">
                    <img src={logo} alt="Logo Perusahaan" className="mx-auto mb-2" style={{ maxWidth: '110px' }} />
                    <h2 className="font-bold text-sm">BUKTI SETOR PRODUKSI</h2>
                    <p className="font-bold text-sm">PT HR Moslem</p>
                </div>
                <hr className="border-t border-dashed border-black my-1" />
                <div className="flex justify-between"><span>Tanggal:</span><span>{formatDate(transaksi.tanggal)}</span></div>
                <div className="flex justify-between mb-2"><span>Pegawai:</span><span>{transaksi.pegawaiNama}</span></div>
                <hr className="border-t border-dashed border-black my-1" />
                {transaksi.items.map(item => (
                    <div key={item.id}><p className="font-bold">{item.produkNama} ({item.varianNama})</p><div className="flex justify-between pl-2"><span>{item.jumlah} Pcs x {formatCurrency(item.upah)}</span><span>{formatCurrency(item.totalUpah)}</span></div></div>
                ))}
                <hr className="border-t border-dashed border-black my-1" />
                <div className="flex justify-between font-bold text-sm mt-2"><span>TOTAL UPAH:</span><span>{formatCurrency(transaksi.grandTotalUpah)}</span></div>
                <div className="text-center mt-4"><p>Terima kasih.</p><p>Simpan struk ini sebagai bukti.</p></div>
            </div>
        </div>
    );
}
export default StrukTransaksi;