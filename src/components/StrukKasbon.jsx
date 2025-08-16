import React from 'react';

// Komponen ini HANYA untuk dicetak
function StrukKasbon({ kasbon, formatCurrency, formatDate }) {
    if (!kasbon) return null;

    return (
        <div className="print-only font-struk text-xs text-black bg-white p-2" style={{ width: '80mm' }}>
            <div className="text-center mb-2">
                <h2 className="font-bold text-sm">BUKTI PENGAMBILAN KASBON</h2>
                <p>PT HR Moslem</p>
            </div>

            <hr className="border-t border-dashed border-black my-1" />
            
            <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{formatDate(kasbon.tanggal)}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span>Pegawai:</span>
                <span>{kasbon.pegawaiNama}</span>
            </div>

            <hr className="border-t border-dashed border-black my-1" />

            <div className="my-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>JUMLAH:</span>
                    <span>{formatCurrency(kasbon.jumlah)}</span>
                </div>
            </div>
            
            {kasbon.keterangan && (
                <>
                    <hr className="border-t border-dashed border-black my-1" />
                    <div className="mt-2">
                        <p className="font-bold">Keterangan:</p>
                        <p>{kasbon.keterangan}</p>
                    </div>
                </>
            )}


            <div className="text-center mt-6">
                <p>Telah diterima oleh,</p>
                <br />
                <br />
                <p>({kasbon.pegawaiNama})</p>
            </div>
             <div className="text-center mt-4 text-xs">
                <p>Simpan struk ini sebagai bukti.</p>
            </div>
        </div>
    );
}

export default StrukKasbon;
