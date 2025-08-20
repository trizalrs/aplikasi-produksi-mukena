import React from 'react';
import logo from '../assets/logo.jpg'; // <-- BARU: Impor logo

function SlipGaji({ data, formatCurrency, formatDate, paperSize }) {
    if (!data) return null;
    const { pegawaiNama, periodeAwal, periodeAkhir, tanggalProses, totalUpah, totalKasbon, bayarKasbon, sisaKasbon, gajiDiterima } = data;
    return (
        <div className={`print-only font-struk text-xs text-black bg-white page-break-after struk-${paperSize}`}>
            <div className="struk-content">
                <div className="text-center mb-2">
                    <img src={logo} alt="Logo Perusahaan" className="mx-auto mb-2" style={{ maxWidth: '60px' }} /> {/* <-- DIPERBARUI */}
                    <h2 className="font-bold text-sm">SLIP GAJI PEGAWAI</h2>
                    <p>PT HR Moslem</p>
                </div>
                {/* ... sisa kode tidak berubah ... */}
                <hr className="border-t border-dashed border-black my-1" />
                <div className="flex justify-between"><span>Tanggal Cetak:</span><span>{formatDate(tanggalProses)}</span></div>
                <div className="flex justify-between"><span>Periode:</span><span>{formatDate(periodeAwal)} s/d {formatDate(periodeAkhir)}</span></div>
                <div className="flex justify-between mb-2"><span>Pegawai:</span><span className="font-bold">{pegawaiNama}</span></div>
                <hr className="border-t border-dashed border-black my-1" />
                <p className="font-bold my-1">RINCIAN PENDAPATAN</p>
                <div className="flex justify-between pl-2"><span>Total Upah Produksi</span><span>{formatCurrency(totalUpah)}</span></div>
                <hr className="border-t border-dashed border-black my-1" />
                <p className="font-bold my-1">RINCIAN POTONGAN</p>
                <div className="flex justify-between pl-2"><span>Total Sisa Kasbon</span><span>{formatCurrency(totalKasbon)}</span></div>
                <div className="flex justify-between pl-2"><span>Pembayaran Kasbon</span><span>- {formatCurrency(bayarKasbon)}</span></div>
                <hr className="border-t border-solid border-black my-1" />
                <div className="flex justify-between font-bold mt-2"><span>Sisa Kasbon Akhir</span><span>{formatCurrency(sisaKasbon)}</span></div>
                <hr className="border-t border-solid border-black my-1" />
                <div className="flex justify-between font-bold text-sm mt-2"><span>GAJI DITERIMA:</span><span>{formatCurrency(gajiDiterima)}</span></div>
                <div className="text-center mt-6"><p>Telah diterima oleh,</p><br /><br /><p>({pegawaiNama})</p></div>
            </div>
        </div>
    );
}
export default SlipGaji;