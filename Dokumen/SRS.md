# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## MODUL AKUNTANSI (ACCOUNTING) - ERP PT SEMADAM

| Informasi Dokumen | Detail |
| :--- | :--- |
| **Nama Proyek** | Sistem Informasi ERP Terintegrasi PT Semadam |
| **Modul** | Akuntansi & Keuangan (Accounting) |
| **Versi Dokumen** | 1.0.0 |
| **Tanggal Terbit** | 29 Mei 2026 |
| **Status Dokumen** | Final (Disetujui untuk Pengembangan) |
| **Bahasa** | Bahasa Indonesia |

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang
PT Semadam adalah perusahaan perkebunan kelapa sawit dan pabrik pengolahan kelapa sawit yang berlokasi di Provinsi Aceh. Operasional perusahaan mencakup pengelolaan kebun (Unit Kebun Semadam, dll.), pabrik pengolahan kelapa sawit (PKS), infrastruktur, hingga administrasi kantor pusat. 

Selama bertahun-tahun, PT Semadam menggunakan sistem akuntansi warisan (*legacy*) berbasis **Clipper/dBase** yang berjalan di lingkungan DOS. Meskipun fungsional, sistem tersebut memiliki keterbatasan yang signifikan, antara lain:
1. Tidak berbasis web (hanya dapat diakses secara lokal pada komputer tertentu).
2. Risiko kehilangan/kerusakan file database (`.DBF`) dan file indeks (`.NTX`/`.NDX`) yang tinggi.
3. Sulit diintegrasikan dengan modul operasional lain (Inventory, Kas/Bank, Payroll, dan Asset).
4. Keterbatasan visualisasi data dan pencetakan laporan fisik (lebar kertas printer dot matrix).

Dalam rangka modernisasi teknologi, PT Semadam memutuskan untuk membangun Sistem ERP modern berbasis **Next.js (React) + Supabase (PostgreSQL) + TailwindCSS (Shadcn UI)**. Modul Akuntansi diposisikan sebagai **pusat atau jantung (Financial Hub)** dari 5 modul utama yang dikembangkan secara paralel, yaitu:
1. **Accounting (Modul Utama)**
2. **Inventory (Gudang)**
3. **Kas/Bank**
4. **Payroll (Gaji & Kepegawaian)**
5. **Asset (Aktiva Tetap & Penyusutan)**

### 1.2 Tujuan Dokumen
Dokumen Software Requirements Specification (SRS) ini dibuat untuk:
* Mendefinisikan spesifikasi kebutuhan fungsional dan non-fungsional dari **Modul Akuntansi** PT Semadam.
* Menjelaskan mekanisme integrasi data keuangan dari 4 modul lainnya (Inventory, Kas/Bank, Payroll, Asset) ke dalam buku besar akuntansi.
* Menjadi acuan teknis bagi tim pengembang dalam mengimplementasikan kode program, skema database, Server Actions, dan antarmuka pengguna (UI/UX).

### 1.3 Ruang Lingkup Sistem
Modul Akuntansi ini mencakup fungsionalitas pencatatan jurnal transaksi, pengelolaan saldo awal, proses kalkulasi akhir periode (Neraca Percobaan & Laporan Manajemen), konsolidasi multi-unit kebun, pencetakan laporan keuangan formal, serta dasbor analisis biaya produksi perkebunan (LM-13).

> [!NOTE]
> Sistem akuntansi ini mempertahankan kode pengenal historis (legacy fields) seperti `KOKE` (Kode Kebun/Unit) dan `KOBU` (Kode Bulan) serta skema penomoran akun perkebunan (COA) untuk memudahkan transisi dan pemetaan data historis.

### 1.4 Singkatan & Definisi
* **COA (Chart of Accounts)**: Daftar perkiraan/rekening akuntansi terstruktur. Pada sistem PT Semadam disebut juga dengan **Master Rekening**.
* **KOKE (Kode Kebun)**: Pengenal unik untuk unit bisnis aktif (contoh: Kebun Semadam, Pabrik, Kantor Medan, Kantor Banda Aceh).
* **KOBU (Kode Buku)**: Kode penunjuk bulan pembukuan (contoh: "01" untuk Januari, "12" untuk Desember).
* **LNET (Laporan Netral)**: Tabel *caching* hasil agregasi biaya aktual vs anggaran untuk mempercepat pemuatan Laporan Manajemen.
* **LM (Laporan Manajemen)**: Paket laporan khusus perkebunan yang menganalisis efisiensi biaya per hektar, biaya pabrik, overhead, dan investasi tanaman (TBM/TM).
* **RLS (Row Level Security)**: Kebijakan keamanan tingkat baris pada database PostgreSQL untuk membatasi akses data.

---

## 2. GAMBARAN UMUM SISTEM

### 2.1 Arsitektur Sistem ERP PT Semadam
Sistem ERP ini dibangun menggunakan arsitektur modern berbasis cloud:
* **Frontend**: Next.js 15 (App Router) dengan TypeScript.
* **UI & Styling**: TailwindCSS dengan Shadcn UI dan Radix UI primitives.
* **Backend & Database**: Supabase (PostgreSQL) yang menyediakan autentikasi, database relasional, dan policy Row Level Security (RLS).
* **State Management**: React Context (`AccountingContext`) untuk menyimpan informasi Unit Aktif (`KOKE`), Bulan Aktif, dan Tahun Aktif yang tersinkron secara global di seluruh modul.

### 2.2 Hubungan Modul Akuntansi dengan 4 Modul Lain
Modul Akuntansi bertindak sebagai **Ledger Konsolidasi (General Ledger)**. Setiap transaksi operasional dari 4 modul lainnya akan bermuara pada pengisian jurnal transaksi di tabel `public.jurnal_transaksi` secara otomatis melalui integrasi API / database trigger, atau secara semi-otomatis melalui proses penggabungan data (`append`).

Berikut adalah diagram alir integrasi 5 modul dalam ERP PT Semadam:

```mermaid
graph TD
    %% Modul-Modul
    KB[Modul Kas/Bank] -->|1. Post Jurnal Kas/Bank| ACC[Modul Akuntansi / GL]
    INV[Modul Inventory / Gudang] -->|2. Post Jurnal Mutasi Bahan| ACC
    PAY[Modul Payroll / Gaji] -->|3. Post Jurnal Gaji Bulanan| ACC
    AST[Modul Asset / Aktiva] -->|4. Post Jurnal Penyusutan| ACC

    %% Sub-sistem Akuntansi
    subgraph Modul Akuntansi (Financial Hub)
        ACC --> COA[Master Rekening / COA]
        ACC --> JR[Jurnal Transaksi]
        ACC --> SA[Saldo Awal Periode]
        
        %% Engine Komputasi
        JR & SA --> ENG[Engine Akuntansi / Server Actions]
        
        %% Output
        ENG --> TB[Neraca Percobaan]
        ENG --> LM[Laporan Manajemen LM-13]
        ENG --> FREP[Laporan Neraca Klasifikasi & Buku Besar]
    end

    %% Database
    DB[(Supabase PostgreSQL)] <--> ACC
```

Berikut detail aliran integrasi data dari masing-masing modul:

#### 1. Integrasi Modul Kas/Bank (Cash & Bank)
* **Keterkaitan**: Setiap transaksi penerimaan kas/bank (Kas Masuk, Bank Masuk) dan pengeluaran kas/bank (Kas Keluar, Bank Keluar) wajib dicatat secara real-time.
* **Aliran Data**: Modul Kas/Bank melakukan penulisan langsung (direct insert) ke tabel `jurnal_transaksi` di Akuntansi.
* **Aturan Jurnal**: 
  * Kode Jurnal Bukti menggunakan prefix `KK` (Kas Keluar), `KM` (Kas Masuk), `BK` (Bank Keluar), atau `BM` (Bank Masuk).
  * Validasi: Kode rekening kas/bank penerima/pengirim harus terdaftar di `master_rekening` dan total jurnal Debet = Kredit.

#### 2. Integrasi Modul Inventory (Gudang)
* **Keterkaitan**: Mencatat mutasi keluar-masuk bahan baku, suku cadang, pupuk, bahan kimia, dan solar di Gudang Perkebunan.
* **Aliran Data**: Pada setiap akhir bulan (atau periodik), Modul Inventory menghasilkan rangkuman pemakaian barang per perkiraan biaya (COA) untuk di-append ke Akuntansi.
* **Aturan Jurnal**:
  * Kode Jurnal Bukti menggunakan prefix `GJ` (Gudang Jurnal).
  * Transaksi pemakaian pupuk akan mendebet akun investasi tanaman/biaya pemeliharaan (prefix `200` atau `257`) dan mengkredit akun persediaan barang di gudang (prefix `115` or `116`).

#### 3. Integrasi Modul Payroll (Gaji & Kepegawaian)
* **Keterkaitan**: Mencatat total biaya tenaga kerja (BHL, Karyawan Bulanan, Staff), BPJS Kesehatan, BPJS Ketenagakerjaan, serta PPh 21.
* **Aliran Data**: Payroll Engine menghitung rekapitulasi gaji bulanan per divisi/kebun, kemudian melakukan posting jurnal penyesuaian gaji ke Akuntansi.
* **Aturan Jurnal**:
  * Kode Jurnal Bukti menggunakan prefix `PG` (Payroll Gaji).
  * Menjurnal Debet ke perkiraan Biaya Tenaga Kerja (sesuai nomor divisi/afdeling) dan Kredit ke akun Hutang Gaji/Kas-Bank.

#### 4. Integrasi Modul Asset (Aktiva Tetap & Penyusutan)
* **Keterkaitan**: Mengelola siklus hidup aktiva tetap milik PT Semadam (Pembelian, Penyusutan Bulanan, Disposal).
* **Aliran Data**: Setiap akhir bulan, Modul Asset menghitung nilai penyusutan aktiva tetap secara otomatis berdasarkan metode garis lurus (straight line) atau saldo menurun, lalu memposting jurnal akumulasi penyusutan.
* **Aturan Jurnal**:
  * Kode Jurnal Bukti menggunakan prefix `AP` (Asset Penyusutan).
  * Mendebet akun Biaya Penyusutan dan mengkredit akun Akumulasi Penyusutan (prefix `021.`).

---

## 3. KEBUTUHAN FUNGSIONAL (FUNCTIONAL REQUIREMENTS)

### 3.1 RF-01: Sistem Navigasi & Global Context Selector
Sistem harus memiliki selector parameter pembukuan aktif di bagian atas halaman (Site Header) yang bertindak sebagai Global State.

* **RF-01.1**: Dropdown **Unit Aktif (`KOKE`)** untuk memilih lokasi kebun atau unit bisnis (Medan, Semadam, Pabrik, Banda Aceh).
* **RF-01.2**: Dropdown **Bulan Buku Aktif (`BULAN`/`KOBU`)** (Januari s.d Desember).
* **RF-01.3**: Dropdown **Tahun Buku Aktif (`TAHUN`)**.
* **RF-01.4**: Parameter terpilih harus disimpan ke dalam `AccountingContext` berbasis React, sehingga halaman input jurnal, input saldo awal, dan modul laporan keuangan akan secara otomatis memfilter data berdasarkan parameter global tersebut secara real-time tanpa *page reload* penuh.
* **RF-01.5**: Sistem harus memiliki **Keyboard Hotkeys Binding** untuk navigasi cepat:
  * `Ctrl + S`: Untuk menyimpan transaksi pada formulir input jurnal.
  * `Esc`: Untuk menutup jendela popup modal.
  * `Tab`: Untuk fokus navigasi dari kolom input satu ke kolom berikutnya secara berurutan.

### 3.2 RF-02: Manajemen Master Data Akuntansi
Sistem harus mampu mengelola data master penunjang akuntansi secara lengkap (CRUD).

* **RF-02.1: Master Unit (`master_unit`)**: Mengelola unit bisnis aktif dengan field wajib:
  * `KOKE` (Kode Unit, Primary Key, varchar)
  * `NAMA_UNIT` (Nama Unit, varchar)
  * `KETERANGAN` (varchar)
* **RF-02.2: Master Rekening / COA (`master_rekening`)**: Mengelola kode perkiraan akuntansi berstruktur dengan field wajib:
  * `REKSUB` (Kode Akun/Sub-rekening, Primary Key, varchar)
  * `REKIN` (Kode Induk Akun, varchar)
  * `NAMA_PERK` (Nama Rekening Perkiraan, varchar)
  * Fitur unggah/impor file Excel (`.xlsx`) untuk mengunggah ratusan COA sekaligus dengan validasi duplikasi.
* **RF-02.3: Master Wilayah Perkebunan (`master_areal` & `master_afdeling`)**:
  * Memetakan lokasi kebun berdasarkan kode areal (`KODA`) dan afdeling (`KODAF`). Ini digunakan untuk memisahkan alokasi biaya pemeliharaan kebun di Laporan Manajemen.

### 3.3 RF-03: Pencatatan Jurnal Transaksi
Sistem menyediakan modul input transaksi jurnal umum (Memorial Journal).

* **RF-03.1**: Formulir pembuatan jurnal baru dengan input field: Tanggal Transaksi, Nomor Bukti Jurnal, Unit/Kebun (`KOKE`), Bulan Buku (`KOBU`), dan tabel entri baris jurnal (Grid Entries).
* **RF-03.2**: Grid entries minimal harus memuat: Kode Rekening (`REK`), Rekening Lawan (`REKLA`), Uraian Penjelasan (`URAIAN1`), Nominal Debet, dan Nominal Kredit.
* **RF-03.3: Validasi Jurnal Berimbang (Balanced)**: Sistem **tidak boleh** menyimpan jurnal ke database jika total nominal Debet tidak sama dengan total nominal Kredit (selisih > 0.01).
* **RF-03.4: Validasi Integritas COA**: Kode rekening yang dimasukkan dalam entri jurnal harus divalidasi ke dalam tabel `master_rekening`. Sistem akan menolak jika kode rekening tidak ditemukan.

### 3.4 RF-04: Manajemen Saldo Awal Periode
Sistem harus mampu mengelola saldo awal perkiraan pada awal bulan buku/tahun buku berjalan.

* **RF-04.1**: Menyediakan form/grid input saldo awal per `KOKE`, `BULAN`, dan `TAHUN`.
* **RF-04.2**: Pengguna menginput nominal Debet atau Kredit untuk setiap akun COA aktif.
* **RF-04.3**: Saldo awal ini menjadi fondasi bagi perhitungan neraca percobaan pada periode berjalan.

### 3.5 RF-05: Modul Proses (Trial Balance & LNET Engine)
Modul ini bertindak sebagai mesin komputasi untuk memproses data mentah menjadi laporan yang siap disajikan.

* **RF-05.1: Proses Neraca Percobaan (Trial Balance)**:
  * Mengkalkulasi mutasi jurnal transaksi berjalan ditambah saldo awal periode untuk menghasilkan saldo akhir per rekening.
  * Perhitungan wajib dilakukan secara dinamis menggunakan Server Action `calculateTrialBalance` secara real-time di memori/query database tanpa menulis ke tabel fisik temporer.
* **RF-05.2: Proses LNET Laporan Manajemen**:
  * Menghitung nilai realisasi biaya aktual (`biayabi` dan `biayasd`) dari `jurnal_transaksi` dan menggabungkannya dengan target anggaran tahunan dari tabel `anggaran_rabi`.
  * Hasil kalkulasi LNET harus disimpan secara persisten ke dalam tabel cache `public.laporan_manajemen_netral`. Hal ini krusial agar pemanggilan Laporan Manajemen (LM) di masa depan berjalan sangat cepat tanpa melakukan *heavy aggregation query* pada jutaan baris transaksi.

### 3.6 RF-06: Proses Gabung Data (Append)
Sistem memfasilitasi integrasi data semi-otomatis dari modul eksternal melalui fitur unggah file.

* **RF-06.1**: Halaman unggah file `/proses/append` untuk mengunggah data transaksi dari file eksternal (Kas/Bank, Gudang/Inventory, Asset) dalam format CSV atau Excel.
* **RF-06.2**: Sistem melakukan *dry-run simulation* untuk memeriksa:
  * Keselarasan nominal (Total Debet = Total Kredit).
  * Validitas seluruh kode perkiraan (COA) yang diupload.
* **RF-06.3**: Jika simulasi sukses tanpa kesalahan, sistem akan menulis/menggabungkan data tersebut secara aman ke dalam tabel utama `jurnal_transaksi`. Jika gagal, seluruh operasi dibatalkan (*database transaction rollback*) dan sistem menampilkan pesan error detail per baris file.

### 3.7 RF-07: Modul Laporan Keuangan Interaktif
Menghasilkan laporan formal akuntansi yang interaktif di web dan ramah cetak (PDF/Excel).

* **RF-07.1: Laporan Buku Besar (General Ledger)**:
  * Menampilkan mutasi detail per rekening COA untuk unit dan periode tertentu.
  * Fitur pencarian fuzzy untuk mencari rekening dengan cepat.
  * Perhitungan **Running Balance (Saldo Berjalan)** dari baris ke baris secara kumulatif berdasarkan saldo awal perkiraan.
* **RF-07.2: Laporan Neraca Klasifikasi per Halaman**:
  * Menampilkan Neraca 13 Halaman terstruktur berdasarkan pengelompokan prefix akun perkebunan PT Semadam:
    * *Halaman 1*: Aktiva Tetap (Prefix `000.`)
    * *Halaman 2*: Akumulasi Penyusutan (Prefix `021.`)
    * *Halaman Lain*: Piutang, Inventaris, Overhead, Pendapatan, Biaya Produksi, dll.
  * Menyediakan navigasi tab interaktif untuk beralih antar halaman neraca.
* **RF-07.3: Laporan Neraca Kompilasi (Konsolidasi)**:
  * Menyajikan data neraca percobaan multi-unit bisnis secara berdampingan (side-by-side).
  * Kolom laporan terdiri dari: Unit 1, Unit 2, Unit 3, kolom Eliminasi Jurnal, dan kolom **Total Konsolidasian**.

### 3.8 RF-08: Laporan Manajemen Perkebunan (LM Dashboard)
Laporan khusus untuk kebutuhan analisis manajemen kebun PT Semadam.

* **RF-08.1**: Dasbor eksekutif yang memuat analisis variansi anggaran vs realisasi biaya.
* **RF-08.2: Visualisasi Chart**: Menggunakan grafik interaktif (Line/Bar Charts) untuk membandingkan nominal **Biaya Aktual S.D Bulan Ini (`BIAYASD`)** vs **Anggaran S.D Bulan Ini (`ANGGARANSD`)**.
* **RF-08.3: LM-13 (Biaya Produksi Kebun)**: Menyajikan rincian biaya per pos perkebunan:
  * Investasi TBM (Tanaman Belum Menghasilkan - Akun `200`-`205`)
  * Pemeliharaan TM (Tanaman Menghasilkan - Akun `257`-`258`)
  * Pengolahan Pabrik Kelapa Sawit (Akun `600`-`602`)
  * Overhead Kebun & Administrasi Umum (Akun `040`-`049` & `400`-`499`)

### 3.9 RF-09: Utilitas Tambahan
Fitur pelengkap untuk mempermudah akuntan dalam bekerja sehari-hari.

* **RF-09.1: Floating Widget Calculator**: 
  * Kalkulator melayang di sudut kanan bawah layar yang dapat dibuka/tutup kapan saja.
  * Memiliki fitur **Audit Paper Tape (Pita Kertas Gulung)** untuk melacak riwayat input hitungan dan memudahkan proses audit saldo.
  * Hasil perhitungan dapat disalin langsung ke input nominal jurnal hanya dengan sekali klik.
* **RF-09.2: Backup & Restore Data**:
  * Fitur ekspor seluruh data transaksi ke dalam format file enkripsi JSON atau Excel terkompresi.
  * Panel pemulihan data (Restore) dengan verifikasi ketat untuk mencegah penimpaan data yang tidak disengaja.
* **RF-09.3: Admin Database Console**:
  * Grid data interaktif layaknya `TbBrowse()` Clipper jadul khusus untuk pengguna ber-role **Administrator**.
  * Admin dapat meninjau, mencari secara instan, dan melakukan penyuntingan data perbaris secara langsung (inline editing) untuk penyesuaian darurat.

---

## 4. KEBUTUHAN NON-FUNGSIONAL (NON-FUNCTIONAL REQUIREMENTS)

### 4.1 Performa & Efisiensi
* **NFR-1.1: Database Composite Indexing**: Sistem harus menerapkan indeks komposit pada tabel transaksi utama PostgreSQL:
  ```sql
  CREATE INDEX idx_jurnal_filter ON jurnal_transaksi ("KOKE", "KOBU", "TANGGAL", "NO_BUKJUR");
  ```
  Hal ini wajib untuk mempercepat waktu query di bawah 200ms ketika jumlah data transaksi bertambah ratusan ribu baris.
* **NFR-1.2: Server-Side Pagination**: Halaman peninjauan data transaksi berskala besar wajib menggunakan server-side pagination dengan range-based query (`.range(from, to)`) agar menghemat konsumsi memori browser klien.
* **NFR-1.3: DOM Virtualization**: Tabel data besar yang tidak dipaginasi (seperti laporan buku besar lengkap) wajib di-render menggunakan library virtualisasi DOM (`@tanstack/react-virtual`) agar browser tidak mengalami lag (*freeze*).
* **NFR-1.4: Concurrent Data Fetching**: Menggunakan pengambilan data secara paralel (`Promise.all`) untuk semua parameter master guna mempercepat waktu muat halaman awal.

### 4.2 Keamanan & Proteksi Data
* **NFR-2.1: PostgreSQL Row Level Security (RLS)**: Kebijakan RLS **wajib aktif** pada seluruh tabel database di Supabase (`master_unit`, `master_rekening`, `jurnal_transaksi`, `saldo_awal`, `anggaran_rabi`, `laporan_manajemen_netral`).
* **NFR-2.2: Autentikasi Keamanan**: Akses tulis dan baca pada data akuntansi hanya diizinkan bagi pengguna dengan status sesi terautentikasi (`authenticated` role) di Supabase. Pengguna anonim dilarang keras memodifikasi data.
* **NFR-2.3: Audit Trail**: Sistem mencatat identitas pembuat (`created_by`), pengubah, serta waktu pembuatan (`created_at`) untuk setiap transaksi jurnal guna kebutuhan audit.

### 4.3 Ketersediaan & Keandalan
* **NFR-3.1**: Ketersediaan database server dijamin oleh infrastruktur cloud Supabase dengan jaminan uptime 99.9%.
* **NFR-3.2**: Penggabungan file/append wajib dilindungi dengan transaksi database PostgreSQL (`database transactions`). Jika terjadi kegagalan sistem di tengah proses pengunggahan, database akan membatalkan seluruh operasi secara otomatis (*atomic transaction*).

### 4.4 Kemudahan Penggunaan & Estetika (Usabilitas)
* **NFR-4.1: Premium UI Design**: Tampilan antarmuka harus terlihat profesional, modern, dan memukau bagi pengguna. Menggunakan font sans-serif modern (Inter/Roboto), skema warna HSL yang harmonis (slate/zinc dark mode-friendly), efek *glassmorphism*, dan transisi mikro-animasi yang halus untuk hover state.
* **NFR-4.2: Print-Optimized Layout**: Semua halaman laporan keuangan wajib dilengkapi dengan CSS Media Query Cetak (`@media print`) sehingga ketika akuntan menekan `Ctrl + P`, laporan akan secara otomatis menyesuaikan ukuran kertas A4/F4 dengan margin rapi tanpa terpotong.
* **NFR-4.3: Responsive Web**: Antarmuka web harus adaptif dan ramah digunakan baik pada layar desktop besar di kantor kebun maupun tablet/ponsel pintar oleh direksi.

---

## 5. SKEMA DATABASE & MODEL DATA (DRAFT DDL)

Berikut skema relasional tabel-tabel utama Modul Akuntansi yang terintegrasi di PostgreSQL Supabase:

### 5.1 Tabel Master Unit
```sql
CREATE TABLE public.master_unit (
    "KOKE" varchar PRIMARY KEY,
    "NAMA_UNIT" varchar NOT NULL,
    "KETERANGAN" text,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);
```

### 5.2 Tabel Master Rekening (COA)
```sql
CREATE TABLE public.master_rekening (
    "REKSUB" varchar PRIMARY KEY,
    "REKIN" varchar,
    "NAMA_PERK" varchar NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);
```

### 5.3 Tabel Jurnal Transaksi
```sql
CREATE TABLE public.jurnal_transaksi (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    "KOKE" varchar NOT NULL REFERENCES public.master_unit("KOKE") ON DELETE RESTRICT,
    "KOBU" varchar(2) NOT NULL, -- Bulan pembukuan: "01" - "12"
    "NO_BUKJUR" varchar NOT NULL, -- Nomor bukti transaksi
    "TANGGAL" date NOT NULL,
    "REK" varchar NOT NULL REFERENCES public.master_rekening("REKSUB") ON DELETE RESTRICT,
    "REKLA" varchar REFERENCES public.master_rekening("REKSUB") ON DELETE SET NULL, -- Rekening lawan
    "NAREK" varchar,
    "URAIAN1" text,
    "DEBET" numeric(15,2) DEFAULT 0.00,
    "KREDIT" numeric(15,2) DEFAULT 0.00,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);
```

### 5.4 Tabel Saldo Awal Perkiraan
```sql
CREATE TABLE public.saldo_awal (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    "KOKE" varchar NOT NULL REFERENCES public.master_unit("KOKE") ON DELETE CASCADE,
    "BULAN" varchar(2) NOT NULL,
    "TAHUN" varchar(4) NOT NULL,
    "REK" varchar NOT NULL REFERENCES public.master_rekening("REKSUB") ON DELETE CASCADE,
    "DEBET" numeric(15,2) DEFAULT 0.00,
    "KREDIT" numeric(15,2) DEFAULT 0.00,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_saldo_awal UNIQUE ("KOKE", "BULAN", "TAHUN", "REK")
);
```

### 5.5 Tabel Anggaran Tahunan Perkebunan (`anggaran_rabi`)
```sql
CREATE TABLE public.anggaran_rabi (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    "KOKE" varchar NOT NULL REFERENCES public.master_unit("KOKE") ON DELETE CASCADE,
    "TAHUN" varchar(4) NOT NULL,
    "REK" varchar NOT NULL REFERENCES public.master_rekening("REKSUB") ON DELETE CASCADE,
    "NOMINAL" numeric(15,2) DEFAULT 0.00, -- Total setahun
    "BULAN_01" numeric(15,2) DEFAULT 0.00,
    "BULAN_02" numeric(15,2) DEFAULT 0.00,
    "BULAN_03" numeric(15,2) DEFAULT 0.00,
    "BULAN_04" numeric(15,2) DEFAULT 0.00,
    "BULAN_05" numeric(15,2) DEFAULT 0.00,
    "BULAN_06" numeric(15,2) DEFAULT 0.00,
    "BULAN_07" numeric(15,2) DEFAULT 0.00,
    "BULAN_08" numeric(15,2) DEFAULT 0.00,
    "BULAN_09" numeric(15,2) DEFAULT 0.00,
    "BULAN_10" numeric(15,2) DEFAULT 0.00,
    "BULAN_11" numeric(15,2) DEFAULT 0.00,
    "BULAN_12" numeric(15,2) DEFAULT 0.00,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_anggaran_entry UNIQUE ("KOKE", "TAHUN", "REK")
);
```

### 5.6 Tabel Cache Laporan Manajemen (`laporan_manajemen_netral`)
```sql
CREATE TABLE public.laporan_manajemen_netral (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    "KOKE" varchar NOT NULL REFERENCES public.master_unit("KOKE") ON DELETE CASCADE,
    "BULAN" varchar(2) NOT NULL,
    "TAHUN" varchar(4) NOT NULL,
    "REK" varchar NOT NULL REFERENCES public.master_rekening("REKSUB") ON DELETE CASCADE,
    "SALBULNLAL" numeric(15,2) DEFAULT 0.00, -- Saldo s.d bulan lalu
    "SALRABLAL" numeric(15,2) DEFAULT 0.00,  -- Saldo akumulasi RAB s.d bulan lalu
    "BIAYABI" numeric(15,2) DEFAULT 0.00,    -- Biaya bulan ini
    "BIAYASD" numeric(15,2) DEFAULT 0.00,    -- Biaya s.d bulan ini
    "ANGGARANBI" numeric(15,2) DEFAULT 0.00, -- Anggaran bulan ini
    "ANGGARANSD" numeric(15,2) DEFAULT 0.00, -- Anggaran s.d bulan ini
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_lm_entry UNIQUE ("KOKE", "BULAN", "TAHUN", "REK")
);
```

---

> **DOKUMEN SRS MODUL AKUNTANSI PT SEMADAM INI TELAH DIRESMIKAN SEBAGAI LANDASAN PENGEMBANGAN FITUR DAN INTEGRASI ANTAR MODUL.**
