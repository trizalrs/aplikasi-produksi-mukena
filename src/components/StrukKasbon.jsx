import React from 'react';
import logo from '../assets/logo.jpg'; // <-- BARU: Impor logo

function StrukKasbon({ kasbon, formatCurrency, formatDate, paperSize }) {
    if (!kasbon) return null;
    return (
        <div className={`print-only font-struk text-xs text-black bg-white struk-${paperSize}`}>
            <div className="struk-content">
                <div className="text-center mb-2">
                    <img src={logo} alt="Logo Perusahaan" className="mx-auto mb-2" style={{ maxWidth: '60px' }} /> {/* <-- DIPERBARUI */}
                    <h2 className="font-bold text-sm">BUKTI PENGAMBILAN KASBON</h2>
                    <p>PT HR Moslem</p>
                </div>
                {/* ... sisa kode tidak berubah ... */}
                <hr className="border-t border-dashed border-black my-1" />
                <div className="flex justify-between"><span>Tanggal:</span><span>{formatDate(kasbon.tanggal)}</span></div>
                <div className="flex justify-between mb-2"><span>Pegawai:</span><span>{kasbon.pegawaiNama}</span></div>
                <hr className="border-t border-dashed border-black my-1" />
                <div className="my-4"><div className="flex justify-between font-bold text-lg"><span>JUMLAH:</span><span>{formatCurrency(kasbon.jumlah)}</span></div></div>
                {kasbon.keterangan && (<><hr className="border-t border-dashed border-black my-1" /><div className="mt-2"><p className="font-bold">Keterangan:</p><p>{kasbon.keterangan}</p></div></>)}
                <div className="text-center mt-6"><p>Telah diterima oleh,</p><br /><br /><p>({kasbon.pegawaiNama})</p></div>
                <div className="text-center mt-4 text-xs"><p>Simpan struk ini sebagai bukti.</p></div>
            </div>
        </div>
    );
}
export default StrukKasbon;