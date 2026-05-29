# RENCANA ANGGARAN BIAYA (RAB)
## DISTRIBUSI ANGGARAN FITUR ERP - PT SEMADAM

| Informasi Dokumen | Detail |
| :--- | :--- |
| **Nama Proyek** | Sistem Informasi ERP Terintegrasi PT Semadam |
| **Dokumen** | Rencana Anggaran Biaya (RAB) \& Alokasi Harga Fitur |
| **Versi Dokumen** | 1.0.0 |
| **Tanggal Terbit** | 29 Mei 2026 |
| **Status Dokumen** | Final (Disetujui untuk Lampiran Kontrak) |
| **Bahasa** | Bahasa Indonesia |

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang
Pengembangan Sistem Informasi ERP Terintegrasi PT Semadam mencakup lima modul operasional dan finansial terpadu. Untuk memastikan transparansi nilai pekerjaan dan menyusun milestones pembayaran berbasis fungsionalitas (*feature-based milestones*), diperlukan perincian anggaran biaya untuk setiap fitur di masing-masing modul.

### 1.2 Metode Alokasi Anggaran
Dalam menetapkan nilai nominal per fitur, tim pengembang tidak menerapkan pembagian rata (flat division), melainkan menggunakan **Metode Pembobotan Kompleksitas Fitur (Complexity-Weighted Allocation)**. Metode ini dinilai jauh lebih profesional dan akurat karena:
1. **Representasi Usaha (Effort Representation)**: Fitur yang membutuhkan arsitektur database rumit, Server Actions mutakhir, dan algoritma komputasi berat (seperti *GL Engine* dan *FIFO Valuation*) dinilai dengan harga lebih tinggi dibanding CRUD master data dasar.
2. **Keadilan Finansial (Financial Fairness)**: Menyelaraskan harga fitur dengan keahlian teknis (*expertise*) yang dibutuhkan untuk membangunnya.
3. **Kemudahan Audit**: Memudahkan manajemen PT Semadam dalam melakukan audit progress serah terima pekerjaan per fitur secara objektif.

---

## 2. RINGKASAN ANGGARAN MODUL ERP

Total nilai kontrak pengembangan Sistem ERP Terintegrasi PT Semadam adalah **Rp 92.000.000,- (Sembilan Puluh Dua Juta Rupiah)** dengan rincian per modul sebagai berikut:

| No. | Modul ERP | Harga Modul (IDR) | Persentase (%) | Status Pengembangan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Accounting (SIA)** | Rp 20.000.000,- | 21,74% | Financial Core Hub |
| 2 | **Kas/Bank (Treasury)** | Rp 15.000.000,- | 16,30% | Cash Flow Engine |
| 3 | **Inventory (Gudang)** | Rp 27.000.000,- | 29,35% | Logistics & Stocks |
| 4 | **Gaji (Payroll)** | Rp 17.000.000,- | 18,48% | Plantation HRD Engine |
| 5 | **Assets (Aktiva Tetap)** | Rp 15.000.000,- | 16,13% | Depreciation Engine |
| | **TOTAL** | **Rp 92.000.000,-** | **100,00%** | **Terintegrasi Penuh** |

---

## 3. DETAIL ALOKASI ANGGARAN FITUR PER MODUL

### 3.1 Modul 1: Accounting (SIA) - Total Rp 20.000.000,-
Modul ini bertindak sebagai jantung keuangan konsolidasi seluruh unit kebun PT Semadam.

| Nama Fitur / Komponen | Kompleksitas | Bobot (%) | Nilai Fitur (IDR) | Deskripsi Fungsional |
| :--- | :--- | :---: | :--- | :--- |
| **Core GL \& Trial Balance Engine** | Tinggi | 30% | Rp 6.000.000,- | Server Action `calculateTrialBalance` untuk *real-time join* saldo awal \& mutasi jurnal. |
| **LNET \& Laporan Manajemen (LM-13)**| Tinggi | 27,5% | Rp 5.500.000,- | Mesin kalkulasi variansi aktual vs RAB, beserta *caching* persisten pada tabel `laporan_manajemen_netral`. |
| **Memorial Journal Entry Form** | Sedang | 17,5% | Rp 3.500.000,- | Formulir transaksi berimbang (debet = kredit), autokomplit COA, dan pintasan keyboard (`Ctrl+S`). |
| **Master Data CRUD (Unit \& COA)** | Rendah | 15% | Rp 3.000.000,- | CRUD `master_unit`, `master_rekening`, beserta utilitas import/upload ratusan COA dari Excel. |
| **Floating Calculator \& Admin Console**| Sedang | 10% | Rp 2.000.000,- | Widget pita audit kalkulator melayang, serta grid `TbBrowse()` khusus perbaikan darurat data oleh Admin. |
| **TOTAL** | | **100%** | **Rp 20.000.000,-** | |

### 3.2 Modul 2: Kas/Bank (Treasury) - Total Rp 15.000.000,-
Mengelola aliran masuk dan keluar dana cair kebun serta rekonsiliasi perbankan.

| Nama Fitur / Komponen | Kompleksitas | Bobot (%) | Nilai Fitur (IDR) | Deskripsi Fungsional |
| :--- | :--- | :---: | :--- | :--- |
| **Cash Flow Ledger Engine** | Tinggi | 33,3% | Rp 5.000.000,- | Otomasi posting jurnal instan berkode bukti `KM`, `KK`, `BM`, `BK` ke buku besar SIA. |
| **Bank Reconciliation Module** | Tinggi | 30% | Rp 4.500.000,- | Komparasi mutasi kas internal vs rekening koran bank menggunakan importir berkas bank `.csv`. |
| **Voucher Transaksi Entry Forms** | Sedang | 23,3% | Rp 3.500.000,- | Antarmuka pembuatan bukti pembayaran kas/bank multi-baris alokasi pembebanan COA. |
| **Master Kas \& Rekening Bank** | Rendah | 13,4% | Rp 2.000.000,- | Setup master akun kasir kebun, limit penarikan harian, dan otorisasi tanda tangan slip voucher. |
| **TOTAL** | | **100%** | **Rp 15.000.000,-** | |

### 3.3 Modul 3: Inventory (Logistik \& Gudang) - Total Rp 27.000.000,-
Modul terbesar yang menangani persediaan suku cadang pabrik sawit, pupuk, bahan bakar, dan logistik kebun.

| Nama Fitur / Komponen | Kompleksitas | Bobot (%) | Nilai Fitur (IDR) | Deskripsi Fungsional |
| :--- | :--- | :---: | :--- | :--- |
| **Plantation Stock Valuation Engine** | Tinggi | 31,5% | Rp 8.500.000,- | Perhitungan mutasi keluar-masuk barang menggunakan metode penilaian rata-rata tertimbang (*Weighted Average*). |
| **Append Gudang \& Stock Opname** | Tinggi | 24% | Rp 6.500.000,- | Utilitas closing bulanan persediaan, audit fisik berkala, dan penyesuaian selisih stok gudang. |
| **Buku Penerimaan \& Pengeluaran** | Sedang | 22,2% | Rp 6.000.000,- | Transaksi masuk (lpb/nota) dan nota pengeluaran barang (bon gudang/pemakaian bahan) per afdeling. |
| **Master Barang \& Auto-Order Alert** | Sedang | 14,8% | Rp 4.000.000,- | Manajemen data barang kebun, batas minimal stok, dan notifikasi otomatis restock solar/pupuk. |
| **Supplier \& Purchase Order** | Rendah | 7,5% | Rp 2.000.000,- | Registrasi rekanan/suplier luar, pencetakan PO resmi, dan pelacakan barang dalam perjalanan (*transit*). |
| **TOTAL** | | **100%** | **Rp 27.000.000,-** | |

### 3.4 Modul 4: Gaji (Payroll) - Total Rp 17.000.000,-
Sistem manajemen ketenagakerjaan khusus perkebunan sawit (staf bulanan vs buruh harian lepas panen).

| Nama Fitur / Komponen | Kompleksitas | Bobot (%) | Nilai Fitur (IDR) | Deskripsi Fungsional |
| :--- | :--- | :---: | :--- | :--- |
| **Palm Oil Labor Payroll Engine** | Tinggi | 38,2% | Rp 6.500.000,- | Perhitungan gaji kompleks berbasis target panen (timbangan TBS), premi kehadiran, dan upah lembur. |
| **BPJS \& PPh 21 Calculator** | Sedang | 23,5% | Rp 4.000.000,- | Perhitungan otomatis iuran BPJS TK (JKK, JKM, JHT, JP), BPJS Kesehatan, dan potongan pajak PPh 21. |
| **Master Karyawan \& Absensi** | Sedang | 20,6% | Rp 3.500.000,- | Database profil karyawan, status kerja (SKU/BHL), dan tracker absensi sidik jari / denda keterlambatan. |
| **Slip Gaji Generator \& Rekap** | Rendah | 17,7% | Rp 3.000.000,- | Cetak slip gaji rapi per divisi, ekspor file payroll massal untuk transfer bank, dan rekap biaya upah bulanan. |
| **TOTAL** | | **100%** | **Rp 17.000.000,-** | |

### 3.5 Modul 5: Assets (Aktiva Tetap) - Total Rp 15.000.000,-
Pencatatan aset perkebunan, kendaraan pengangkut TBS, serta penyusutan berkala.

| Nama Fitur / Komponen | Kompleksitas | Bobot (%) | Nilai Fitur (IDR) | Deskripsi Fungsional |
| :--- | :--- | :---: | :--- | :--- |
| **Automatic Depreciation Engine** | Tinggi | 36,6% | Rp 5.500.000,- | Posting jurnal amortisasi/depresiasi bulanan otomatis berdasarkan metode garis lurus & saldo menurun. |
| **Asset Registry \& Lifecycle** | Sedang | 23,3% | Rp 3.500.000,- | Pencatatan status aset (aktif, rusak, perbaikan), pemindahan antar divisi, dan disposal/penghapusan aset. |
| **CAPEX \& Asset Acquisition** | Sedang | 23,3% | Rp 3.500.000,- | Alur persetujuan belanja modal (CAPEX) untuk pembelian alat berat PKS atau pembukaan lahan baru. |
| **Master Kategori Asset \& Penomoran** | Rendah | 16,8% | Rp 2.500.000,- | Pengelompokan masa manfaat aset sesuai regulasi pajak, penomoran fisik aset via cetak barcode. |
| **TOTAL** | | **100%** | **Rp 15.000.000,-** | |

---

## 4. METODE PEMBAYARAN \& TERMIN (PAYMENT MILESTONES)

Untuk menyelaraskan antara progress pengembangan fisik dengan komitmen keuangan, pembayaran dibagi menjadi **5 Termin** berdasarkan penyelesaian serah terima modul operasional:

1. **Termin 1 (Uang Muka / DP) - 20%**: Pembayaran awal setelah penandatanganan SOW dan persetujuan PRD (Rp 18.400.000,-).
2. **Termin 2 (Modul Accounting \& Kas/Bank) - 30%**: Setelah serah terima fungsionalitas penuh modul Keuangan & Treasury (Rp 27.600.000,-).
3. **Termin 3 (Modul Inventory / Gudang) - 25%**: Setelah modul persediaan barang dan logistik kebun dinyatakan *Go-Live* (Rp 23.000.000,-).
4. **Termin 4 (Modul Payroll \& Assets) - 20%**: Setelah modul HRD/Gaji dan modul penyusutan aktiva diserahterimakan (Rp 18.400.000,-).
5. **Termin 5 (Pemeliharaan / Retensi) - 5%**: Dibayarkan setelah masa garansi/pemeliharaan gratis selama 3 bulan selesai (Rp 4.600.000,-).

---

> **LAMPIRAN DOKUMEN RENCANA ANGGARAN BIAYA (RAB) INI MERUPAKAN BAGIAN INTEGRAL YANG TIDAK TERPISAHKAN DARI DOKUMEN SCOPE OF WORK (SOW) PENGEMBANGAN ERP PT SEMADAM.**
