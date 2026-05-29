# SCOPE OF WORK (SOW)
## PENGEMBANGAN MODUL AKUNTANSI & KEUANGAN (FINANCIAL HUB)
### SISTEM INFORMASI ERP TERINTEGRASI PT SEMADAM

---

## 1. PENDAHULUAN & LATAR BELAKANG
PT Semadam sedang melakukan modernisasi infrastruktur sistem informasinya dari sistem warisan (*legacy*) berbasis Clipper/dBase (DOS) menjadi **Sistem ERP Terintegrasi modern berbasis Web**. Pengembangan ERP ini dibagi menjadi 5 modul utama yang berjalan secara paralel, di mana **Modul Akuntansi (Accounting)** bertindak sebagai **Hub Keuangan Konsolidasi (General Ledger)**.

Dokumen *Scope of Work* (SOW) ini mendefinisikan batas pekerjaan, tahapan implementasi, tanggung jawab para pihak, serta kriteria keberterimaan (*acceptance criteria*) khusus untuk pengembangan **Modul Akuntansi**. Dokumen ini menjadi kesepakatan formal antara Tim Pengembang dan Manajemen PT Semadam.

---

## 2. TUJUAN PROYEK
Tujuan dari pekerjaan pengembangan Modul Akuntansi ini adalah:
1. **Menggantikan Sistem Clipper**: Menghilangkan ketergantungan pada sistem DOS dan database `.DBF` yang berisiko tinggi terhadap kehilangan data.
2. **Pusat Konsolidasi (Financial Hub)**: Menyediakan *endpoint* integrasi yang aman dan efisien untuk menerima jurnal otomatis/append dari 4 modul operasional (Inventory, Kas/Bank, Payroll, Asset).
3. **Optimasi Performa Laporan**: Menerapkan caching canggih via tabel `laporan_manajemen_netral` (LNET) dan Server Actions untuk kalkulasi Neraca Percobaan (Trial Balance) berkecepatan tinggi.
4. **Desain Ramah Akuntan (Accountant-Friendly UI)**: Menyediakan kalkulator audit mengambang (*floating calculator*), navigasi keyboard shortcut penuh untuk input jurnal, dan tata letak laporan keuangan yang optimal untuk dicetak (*print-optimized*).

---

## 3. RUANG LINGKUP PEKERJAAN (SCOPE OF WORK)

Pekerjaan pengembangan Modul Akuntansi ini dibagi menjadi 6 Fase Utama yang mencakup perancangan database, pengembangan logika backend, pengembangan antarmuka (frontend), integrasi modul, hingga pengujian kinerja.

### FASE 1: PERANCANGAN & MIGRASI DATABASE (SUPABASE POSTGRESQL)
*   **Implementasi DDL Database**: Membuat 6 tabel utama akuntansi di database Supabase sesuai dengan spesifikasi SRS:
    1.  `public.master_unit` (Data Unit/Kebun)
    2.  `public.master_rekening` (Chart of Accounts - COA)
    3.  `public.jurnal_transaksi` (Ledger Transaksi)
    4.  `public.saldo_awal` (Saldo Awal per Unit/Bulan/Tahun)
    5.  `public.anggaran_rabi` (Rencana Anggaran Biaya Perkebunan)
    6.  `public.laporan_manajemen_netral` (Cache LNET Laporan Manajemen)
*   **Penerapan Kebijakan Keamanan (RLS)**: Menulis skrip Row Level Security (RLS) PostgreSQL untuk membatasi hak akses data berdasarkan autentikasi pengguna.
*   **Optimasi Indeks Relasional**: Membuat indeks komposit pada `jurnal_transaksi` (`idx_jurnal_filter` pada kolom `koke`, `kobu`, `thn`, `norek`) untuk memastikan kecepatan query pencarian data historis skala besar.
*   **Seeding Data Awal**: Melakukan migrasi data master COA historis PT Semadam (sekitar 300+ rekening perkebunan) ke dalam tabel `master_rekening`.

### FASE 2: GLOBAL STATE CONTEXT & INFRASTRUKTUR HEADER (FRONTEND)
*   **Accounting Global Context (`AccountingContext`)**: Membangun React Context penyimpan *state* global pembukuan aktif:
    *   `KOKE` (Kode Kebun Aktif)
    *   `BULAN` (Bulan Pembukuan Aktif, 01-12)
    *   `TAHUN` (Tahun Pembukuan Aktif)
*   **Global Selector UI**: Mengintegrasikan selektor unit (`KOKE`), bulan, dan tahun pada `SiteHeader` (Navbar utama) menggunakan komponen Radix UI / Shadcn. Setiap perubahan pada selektor ini akan secara otomatis memicu pemuatan ulang (*refetching*) data pada halaman aktif tanpa reload halaman penuh (*Single Page Application experience*).

### FASE 3: FORM INPUT JURNAL TRANSAKSI & UTILITY WIDGET
*   **Form Input Jurnal Dinamis**:
    *   Mendukung entri baris Debet dan Kredit secara dinamis (tambah/hapus baris cepat).
    *   Sistem autokomplit pencarian nomor/nama rekening dari `master_rekening`.
    *   Validasi *Real-Time Balance*: Jurnal tidak dapat disimpan jika jumlah total Debet tidak sama dengan Kredit (harus *balance*).
*   **Navigasi Keyboard Penuh**: Mengimplementasikan *keyboard listeners* (Hotkeys) untuk akuntan:
    *   `Ctrl + S` untuk menyimpan jurnal secara instan.
    *   `Tab` / `Shift + Tab` untuk navigasi antar field input.
    *   `Esc` untuk membatalkan entri.
*   **Floating Audit Calculator Widget**: Membuat widget kalkulator mengambang yang dapat dipanggil di pojok kanan bawah layar untuk membantu akuntan melakukan perhitungan cepat saldo audit tanpa membuka aplikasi eksternal.

### FASE 4: BACKEND PROCESSING & CALCULATION ENGINE (SERVER ACTIONS)
*   **Server Action `calculateTrialBalance`**:
    *   Mengimplementasikan logika *Server-Side Memory Joining* antara saldo awal pembukuan (`saldo_awal`) dengan mutasi debet/kredit yang tercatat pada `jurnal_transaksi` untuk periode bulan dan tahun terpilih.
    *   Mengembalikan data baris Neraca Percobaan (Trial Balance) yang berisi Saldo Awal, Mutasi Debet, Mutasi Kredit, dan Saldo Akhir.
*   **Server Action `prosesLNET`**:
    *   Menghitung agregasi biaya aktual per divisi/afdeling dari tabel `jurnal_transaksi`.
    *   Membandingkan biaya aktual dengan anggaran dari tabel `anggaran_rabi`.
    *   Melakukan kalkulasi deviasi biaya dan menyimpan hasilnya (biaya aktual s/d bulan ini, anggaran s/d bulan ini, persentase efisiensi) ke dalam tabel cache `laporan_manajemen_netral`.

### FASE 5: MODUL INTEGRASI & IMPORT UTILITY (APPEND ENGINE)
*   **Append Engine Interface**: Membuat UI khusus untuk melakukan proses *append* (penggabungan data) transaksi bulanan dari file operasional eksternal (csv/xlsx) dari modul Gudang (Inventory) dan Kas/Bank.
*   **Validasi Integritas File Append**:
    *   Verifikasi kolom wajib (Tanggal, No. Jurnal, No. Rekening, Deskripsi, Nominal Debet/Kredit).
    *   Verifikasi keberadaan Kode Kebun (`KOKE`) dan Nomor Perkiraan (`norek`) terhadap tabel master.
*   **Transaction Atomicity**: Memastikan proses penulisan ribuan baris jurnal ke tabel `jurnal_transaksi` berjalan dalam satu transaksi database PostgreSQL (*All-or-Nothing transaction block*). Jika terjadi satu baris gagal validasi, seluruh proses *append* dibatalkan demi keamanan data.

### FASE 6: PELAPORAN KEUANGAN & PRINT OPTIMIZATION
*   **Laporan Buku Besar (Running Balance Ledger)**: Tampilan buku besar per rekening dengan kolom saldo berjalan (*running balance*) yang dihitung dinamis.
*   **Laporan Manajemen Perkebunan (LM-13 & LNET)**: Membuat dasbor visualisasi perbandingan Realisasi vs Anggaran Biaya per Afdeling untuk melacak efisiensi biaya perawatan tanaman kelapa sawit (TBM/TM) dan biaya pengolahan pabrik.
*   **Print-Optimized Stylesheets**: Menulis CSS `@media print` khusus untuk memastikan semua laporan keuangan bersih dari elemen navigasi web (navbar, sidebar, tombol) dan terformat rapi pada media kertas ukuran **A4 atau Folio/F4** secara vertikal (*portrait*) maupun horizontal (*landscape*).

---

## 4. DAFTAR DELIVERABLES (HASIL KERJA) & MILESTONES

| No. | Fase Pekerjaan | Target Deliverables (Output Fisik) | Kriteria Keberterimaan (Acceptance Criteria) | Est. Waktu |
|---|---|---|---|---|
| **1** | **Database & Security Setup** | - Skema tabel PostgreSQL aktif di Supabase.<br>- Kebijakan RLS teruji.<br>- Indeks komposit aktif. | Tabel database sukses diisi data inisiasi dan memblokir akses jika tidak terautentikasi. | Minggu 1 |
| **2** | **Global Context & Header Selector** | - Komponen `AccountingContext` terintegrasi.<br>- Widget Selector KOKE/Bulan/Tahun di navbar. | Perubahan selektor KOKE langsung meng-update komponen halaman tanpa reload. | Minggu 2 |
| **3** | **Form Entri Jurnal & Kalkulator** | - Form Input Jurnal dengan keyboard hotkeys.<br>- Widget Floating Calculator. | - Jurnal tidak seimbang diblokir.<br>- Navigasi Tab dan Ctrl+S berfungsi 100%. | Minggu 3 |
| **4** | **Calculation Engine & LNET** | - Server Action `calculateTrialBalance`.<br>- Server Action `prosesLNET`. | Kalkulasi Neraca Percobaan selesai dalam < 1.5 detik untuk data 10.000+ baris. | Minggu 4 |
| **5** | **Append Engine Modul Gudang/Kas** | - Antarmuka Import CSV/XLSX.<br>- Modul logging kesalahan import. | Transaksi ter-append secara atomik, file rusak ditolak tanpa merusak database. | Minggu 5 |
| **6** | **Financial Reports & Print Styles** | - Halaman Buku Besar & Neraca.<br>- Visualisasi LM-13.<br>- CSS Cetak F4/A4. | - Laporan rapi saat dicetak ke PDF / printer kertas (layout tidak terpotong). | Minggu 6 |

---

## 5. BATASAN PEKERJAAN (OUT OF SCOPE)
Pekerjaan yang didefinisikan di luar lingkup (Out of Scope) pengerjaan modul ini meliputi:
1.  **Pengembangan 4 Modul Operasional**: Pembuatan internal fungsionalitas modul Inventory, Kas/Bank, Payroll, dan Asset itu sendiri (karena dikerjakan oleh tim terpisah secara paralel). Akuntansi hanya bertanggung jawab atas **penerimaan data jurnal/append** dari modul tersebut.
2.  **Integrasi Direct Bank API**: Pengambilan data mutasi rekening bank secara otomatis (*Open Banking API*) tidak tercakup. Penginputan data bank menggunakan import manual file Excel/CSV (pada modul Kas/Bank).
3.  **Entri Data Historis Clipper**: Pengisian data pembukuan historis PT Semadam tahun-tahun sebelumnya secara manual. Tim pengembang hanya menyediakan skrip migrasi/seeding awal, sedangkan entri operasional dilakukan oleh Tim Akuntan PT Semadam.
4.  **Pengadaan Perangkat Keras**: Pembelian komputer server, printer, atau penyediaan jaringan internet fisik di lokasi kebun PT Semadam.

---

## 6. KRITERIA KEBERTERIMAAN UTAMA (KEY ACCEPTANCE CRITERIA)
Modul Akuntansi ini dianggap selesai dan dapat diserahterimakan jika memenuhi kriteria berikut:
*   **Fungsional**: Semua fitur (Selector KOKE, Input Jurnal, Trial Balance, Append, LNET, dan LM-13) berfungsi sesuai skenario SRS.
*   **Kecepatan Laporan**: Neraca Percobaan dan Laporan Manajemen LNET harus ter-load di bawah **1.5 detik** menggunakan mekanisme cache dan Server Actions.
*   **Keamanan RLS**: Uji coba penetrasi membuktikan bahwa pengguna dari Kebun A (`KOKE: 01`) tidak dapat melihat atau memodifikasi data milik Kebun B (`KOKE: 02`).
*   **Kemudahan Cetak**: Pengujian cetak fisik atau cetak ke berkas PDF pada peramban (Chrome, Edge, Safari) menunjukkan dokumen terformat rapi pada ukuran A4/F4 tanpa terpotong (*overflow*).
*   **Akurasi Perhitungan**: Hasil kalkulasi Debet/Kredit pada Neraca Percobaan 100% konsisten dengan akumulasi saldo transaksi.

---

## 7. STRUKTUR TIM & KOORDINASI

*   **Project Sponsor**: Direktur Keuangan PT Semadam.
*   **Product Owner**: Kepala Akuntan PT Semadam (menyediakan spesifikasi akun & alur audit).
*   **Lead Developer**: Arsitek Next.js & Database Supabase.
*   **System Integrator**: Penanggung jawab integrasi modul Kas/Bank & Inventory.

Koordinasi pengerjaan dilakukan melalui *Daily Standup* mingguan secara daring dan peninjauan berkala hasil build pada server staging setiap akhir fase.

---

*Disetujui oleh,*

| Untuk PT Semadam | Untuk Tim Pengembang |
| :---: | :---: |
| <br><br>____________________<br>**Manajemen PT Semadam** | <br><br>____________________<br>**Pimpinan Tim Pengembang** |
