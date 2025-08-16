import React from 'react';

// Komponen ini HANYA untuk dicetak, tidak akan tampil di layar utama
function StrukTransaksi({ transaksi, formatCurrency, formatDate }) {
    if (!transaksi) return null;

    return (
        <div className="printable-struk font-struk text-xs text-black bg-white p-2" style={{ width: '80mm' }}>
            <div className="text-center mb-2">
                <h2 className="font-bold text-sm">BUKTI SETOR PRODUKSI</h2>
                <p>PT HR Moslem</p>
            </div>

            <hr className="border-t border-dashed border-black my-1" />
            
            <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{formatDate(transaksi.tanggal)}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span>Pegawai:</span>
                <span>{transaksi.pegawaiNama}</span>
            </div>

            <hr className="border-t border-dashed border-black my-1" />

            {transaksi.items.map(item => (
                <div key={item.id}>
                    <p className="font-bold">{item.produkNama} ({item.varianNama})</p>
                    <div className="flex justify-between pl-2">
                        <span>{item.jumlah} Pcs x {formatCurrency(item.upah)}</span>
                        <span>{formatCurrency(item.totalUpah)}</span>
                    </div>
                </div>
            ))}

            <hr className="border-t border-dashed border-black my-1" />

            <div className="flex justify-between font-bold text-sm mt-2">
                <span>TOTAL UPAH:</span>
                <span>{formatCurrency(transaksi.grandTotalUpah)}</span>
            </div>

            <div className="text-center mt-4">
                <p>Terima kasih.</p>
                <p>Simpan struk ini sebagai bukti.</p>
            </div>
        </div>
    );
}

export default StrukTransaksi;
