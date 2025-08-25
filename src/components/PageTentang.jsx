// src/components/PageTentang.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';


function PageTentang() {
    const appVersion = "1.0.0"; // Anda bisa update versi ini nanti

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800">Tentang Aplikasi Produksi Mukena</h2>
                <p className="mt-2 text-lg text-gray-600">Solusi Digital untuk Manajemen Produksi Konveksi Anda.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Kolom Kiri: Deskripsi Aplikasi */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Deskripsi</h3>
                        <p className="text-gray-600 mb-4">
                            Aplikasi ini dirancang khusus untuk membantu para pengusaha konveksi mukena dalam mengelola dan mencatat setiap alur produksi. Mulai dari manajemen data pegawai dan produk, pencatatan setoran harian, pengelolaan kasbon, hingga proses penggajian yang otomatis dan akurat.
                        </p>
                        <p className="text-gray-600">
                            Dengan fitur backup dan restore data yang terintegrasi, data bisnis Anda akan selalu aman dan dapat diakses di mana saja.
                        </p>
                    </div>

                    {/* Kolom Kanan: Fitur Utama */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Fitur Unggulan</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>Dashboard ringkasan bisnis</li>
                            <li>Manajemen data pegawai & produk</li>
                            <li>Pencatatan transaksi setor & kasbon</li>
                            <li>Sistem penggajian otomatis</li>
                            <li>Cetak struk & slip gaji (via Web & APK)</li>
                            <li>Backup & Restore data via Google Drive</li>
                            <li>Akses fleksibel via Aplikasi Android</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t my-8"></div>

                <div className="mt-6 flex justify-center items-center space-x-6">
                        <a href="https://wa.me/6285315705215" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors" title="WhatsApp"><FontAwesomeIcon icon={faWhatsapp} size="2x" /></a>
                        <a href="https://facebook.com/tri.rangga20" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" title="Facebook"><FontAwesomeIcon icon={faFacebook} size="2x" /></a>
                        <a href="https://youtube.com/@katabijak2002" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors" title="YouTube"><FontAwesomeIcon icon={faYoutube} size="2x" /></a>
                </div>
            </div>
        </div>
    );
}

export default PageTentang;