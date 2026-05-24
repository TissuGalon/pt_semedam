# Rencana Adaptasi & Penyesuaian Sistem Akuntansi Jadul PT Semadam

Dokumen ini berisi rencana strategis untuk memetakan, memigrasikan, dan menyesuaikan modul-modul dari sistem akuntansi lama berbasis **Clipper/dBase (PRG)** ke dalam arsitektur aplikasi modern berbasis **Next.js (React) + Supabase (PostgreSQL) + TailwindCSS (Shadcn UI)**.

---

## Ringkasan Pemetaan Sistem

Aplikasi modern dikembangkan dengan arsitektur web yang responsif, berkinerja tinggi, dan aman. Berikut adalah pemetaan fungsionalitas dari file sumber jadul ke struktur modern Next.js/Supabase:

```mermaid
graph TD
    subgraph Sistem Lama (Clipper/dBase)
        A1[AKUNT.PRG - Navigasi & UI]
        A2[DAMPROS.PRG - Proses Data]
        A3[DAMCET.PRG - Laporan Akunt.]
        A4[LMCET.PRG - Laporan Manajemen]
        A5[DAMOPERA.PRG - Lookup & Viewer]
        A6[DAMSERBA.PRG - Utility]
    end

    subgraph Sistem Baru (Next.js + Supabase)
        B1[Sidebar & AppSidebar - app-sidebar.tsx]
        B2[Server Actions - lib/actions/proses.ts]
        B3[Laporan Keuangan Web & PDF - app/laporan-keuangan]
        B4[Laporan Manajemen & Budgeting - app/laporan-manajemen]
        B5[Combobox & Context - components/ui/combobox]
        B6[Admin Control & Security - app/utility]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B4
    A5 --> B5
    A6 --> B6
```

---

## 1. Navigasi & UI Utama (AKUNT.PRG $\rightarrow$ Modern Sidebar)

Sistem lama menggunakan menu berhierarki berbasis teks DOS dengan key-remapping (`GANTI()` dan `normal()`) untuk navigasi keyboard. Pada sistem baru, navigasi dipetakan ke **Sidebar Navigasi Modern (Responsive)** dan **Top Header** dengan fungsionalitas web-safe.

### A. Pemetaan Struktur Menu

| Level-1 Menu (Lama) | Level-2 Menu (Lama) | Fungsi Teknis (Lama) | Implementasi Route Modern (Next.js) | Status Saat Ini |
| :--- | :--- | :--- | :--- | :--- |
| **AKUNTING SISTEM** | MASTER FILE | Memanggil `Damm1()` | `/master-unit` & `/master-rekening` | **Sudah Ada** |
| | TRANSAKSI | Memanggil `Damm2()` | `/input-jurnal` & `/input-saldo-awal` | **Sudah Ada** |
| | PROSES | Memanggil `MENPROS()` | `/proses` | *Perlu Dibuat* |
| | LAPORAN | Memanggil `damLAP()` | `/laporan` | *Perlu Dibuat* |
| | UTILITY | Memanggil `MONUTILI()` | `/utility` | *Perlu Dibuat* |
| **LAPORAN MANAJEMEN**| - | Paket cetak LM | `/laporan-manajemen` | *Perlu Dibuat* |
| **KELUAR** | - | Housekeeping & Exit | `/logout` (Session clear via Supabase Auth) | **Sudah Ada** |

### B. UI/Keyboard & Housekeeping Security
1. **Keyboard Navigation & Hotkeys**: 
   - *Lama*: Remap tombol panah via `GANTI()` (set key 4 & 19).
   - *Baru*: Integrasi keyboard shortcuts standar web (mis. `Tab` untuk navigasi form, `Ctrl + S` untuk menyimpan entri jurnal, `Esc` untuk menutup dialog/modal, dan panah keyboard untuk grid data).
2. **Housekeeping Keamanan**:
   - *Lama*: Menghapus file indeks/temporary (`*.NTX`, `*.NDX`, `*.CAT`) dan menjalankan perintah shell berisiko `!del ????????`.
   - *Baru*: **Tidak boleh ada perintah hapus file sistem via shell!** File temporary PDF/Excel hasil cetak akan dikelola di memori atau otomatis dihapus oleh web browser (client-side download), sementara sesi pengguna ditutup secara aman menggunakan Supabase Auth Session cleaner.

---

## 2. Modul "PROSES" (DAMPROS.PRG + DAMPROS1.PRG $\rightarrow$ Server Actions & SQL Engine)

Modul proses adalah otak komputasi akuntansi PT Semadam. Pada sistem lama, proses ini memanipulasi file fisik `.DBF` (AAAA, BBBB, sa, jr, LNET). Pada sistem modern, seluruh logika dialihkan ke **PostgreSQL Views/Stored Functions** dan **Next.js Server Actions** untuk keamanan dan integritas data penuh.

### A. Proses Neraca Percobaan (FUNGNERA)
- **Mekanisme Kerja**:
  - *Lama*: Membuat tabel kerja `AAAA.DBF` dari struktur `struner`, memasukkan daftar rekening, menyalin saldo awal (`sa<kebun><bulan><tahun>`), menggabungkan entri jurnal (`jr<kebun><bulan><tahun>`), lalu merekapitulasi mutasi dan menulis tabel ringkasan `BBBB.DBF`.
  - *Baru*: Dibuat Server Action `calculateTrialBalance(koke, bulan, tahun)` yang melakukan kalkulasi *on-the-fly* menggunakan query relasional:
    ```sql
    -- Konsep kalkulasi Neraca Percobaan real-time
    WITH mutasi AS (
      SELECT 
        "REK",
        SUM(COALESCE("DEBET", 0)) as total_debet_mutasi,
        SUM(COALESCE("KREDIT", 0)) as total_kredit_mutasi
      FROM public.jurnal_transaksi
      WHERE "KOKE" = koke_param AND "KOBU" = kobu_param
      GROUP BY "REK"
    ),
    saldo AS (
      SELECT 
        "REK",
        SUM(COALESCE("DEBET", 0)) as saldo_awal_debet,
        SUM(COALESCE("KREDIT", 0)) as saldo_awal_kredit
      FROM public.saldo_awal
      WHERE "KOKE" = koke_param AND "BULAN" = bulan_param AND "TAHUN" = tahun_param
      GROUP BY "REK"
    )
    SELECT 
      r."REKSUB", r."NAMA_PERK",
      COALESCE(s.saldo_awal_debet, 0) as sa_debet,
      COALESCE(s.saldo_awal_kredit, 0) as sa_kredit,
      COALESCE(m.total_debet_mutasi, 0) as mutasi_debet,
      COALESCE(m.total_kredit_mutasi, 0) as mutasi_kredit,
      -- Perhitungan saldo akhir tergantung jenis akun (Aktiva vs Pasiva)
      (COALESCE(s.saldo_awal_debet, 0) + COALESCE(m.total_debet_mutasi, 0) - COALESCE(m.total_kredit_mutasi, 0)) as saldo_akhir_debet,
      (COALESCE(s.saldo_awal_kredit, 0) + COALESCE(m.total_kredit_mutasi, 0) - COALESCE(m.total_debet_mutasi, 0)) as saldo_akhir_kredit
    FROM public.master_rekening r
    LEFT JOIN saldo s ON r."REKSUB" = s."REK"
    LEFT JOIN mutasi m ON r."REKSUB" = m."REK";
    ```
- **Validasi Balance**: Menampilkan total mutasi Debet & Kredit dan selisih secara *real-time* di UI. Status pembukuan wajib menunjukkan **"Seimbang (Balanced)"** (selisih = 0) sebelum data dapat di-freeze atau diekspor.

### B. Proses Neraca Kompilasi (NERMADAM)
- **Mekanisme Baru**: Konsolidasikan data Neraca Percobaan dari seluruh unit/kebun (`KOKE`) pada periode aktif secara otomatis melalui query agregasi lintas unit.

### C. Proses Gabung/Append File Lain (gabungdat)
- **Mekanisme Baru**: Menyediakan halaman unggah file (Excel/CSV) untuk **Data Kas/Bank**, **Data Inventory/Gudang**, dan **Data Penyusutan Aktiva**. Sistem akan memvalidasi data terlebih dahulu (apakah kode rekening valid, apakah jumlah balance) sebelum di-append secara aman ke tabel `jurnal_transaksi`.

### D. Proses Laporan Manajemen / LM (PROSLM200 & LNET)
- **Logika Perhitungan**:
  - Menggabungkan data Saldo Awal, Jurnal Transaksi, dan Anggaran Biaya (RAB) dari tabel `anggaran_rabi` (tabel anggaran baru).
  - Menghitung kolom penting:
    - **Saldo Bulan Lalu (`salblnlal`)**
    - **Akumulasi Anggaran RAB s.d Bulan Berjalan (`salrablal`)**
    - **Biaya Bulan Ini (`biayabi` = Debet - Kredit)**
    - **Biaya s.d Bulan Ini (`biayasd`)**
  - **Penyimpanan LNET**: Hasil kalkulasi ini akan di-cache ke tabel persisten `public.laporan_manajemen_netral` (struktur disesuaikan dengan file `LNET<bulan><tahun>.DBF` jadul) agar pemuatan halaman Laporan Manajemen sangat cepat tanpa menghitung ulang data historis berukuran besar setiap kali dibuka.

---

## 3. Modul "LAPORAN" Akunting (DAMCET.PRG + DAMCET1..6.PRG $\rightarrow$ Interactive Web Reports)

Modul laporan mencakup pencetakan fisik berformat kertas lebar (A4/F4 dengan mode CPI). Di sistem modern, modul ini ditransformasikan menjadi **Interactive Dashboard Reports** dengan kemampuan ekspor ke **PDF berkualitas tinggi (Print-optimized CSS)** dan **Excel**.

### A. Fitur Cetak Utama
1. **Cetak Memorial, Saldo Awal, & Mutasi Perkiraan** (`DAMCET1.PRG`):
   - Grid interaktif per unit dan bulan buku.
   - Header dinamis (`KEPALABUK` versi React) menampilkan informasi unit, periode, dan nomor halaman.
2. **Cetak Buku Besar (General Ledger - `CETBUBES`)**:
   - Pencarian rekening secara cepat dengan pencarian fuzzy.
   - Kolom: Tanggal, No Bukti, Uraian Transaksi, Debet, Kredit, dan Saldo Kumulatif berjalan.
3. **Cetak Neraca Klasifikasi per Halaman (1 s.d 13 - `DAMCET3.PRG` / `CETraca`)**:
   - Replikasi pengelompokan rekening legasi menggunakan tab navigasi interaktif atau dropdown halaman:
     - **Halaman 1**: Aktiva Tetap (Prefix rekening `000.`)
     - **Halaman 2**: Penyusutan Kumulatif (Prefix rekening `021.`)
     - **Halaman Lain**: Prefix kelompok akun lainnya (`041.`, `060.`, `120.`, `161.`, `251.`, `424.`, `601.`, `603.`, `604.`, `720.`, `920.`).
   - Setiap halaman menghitung total sub-kelompok akun dan saldo bersih secara otomatis.

### B. Neraca Kompilasi / Konsolidasi (`DAMCET6.PRG`)
- Menampilkan perbandingan kolom berdampingan untuk seluruh unit (Unit 1, Unit 2, Unit 3, dsb.) beserta kolom eliminasi dan kolom **Total Konsolidasian**, memecahkan keterbatasan lebar kertas fisik pada printer jadul.

---

## 4. Laporan Manajemen (LM) (LMCET1.PRG s.d LMCET4.PRG $\rightarrow$ Executive Dashboard)

Laporan Manajemen (LM) berfokus pada analisis biaya produksi, anggaran (RAB), dan variansi. 

### A. Pemetaan Menu Cetak Laporan Manajemen
Seluruh menu `menucetlm()` dipetakan ke tab menu modern di `/laporan-manajemen`:
1. **Rekening 200 - 205**: Laporan investasi tanaman baru/TBM.
2. **Rekening 257 - 258**: Laporan pemeliharaan tanaman menghasilkan/TM.
3. **LM-13**: Biaya Produksi Kebun (laporan paling krusial untuk manajemen perkebunan).
4. **LM Rinci (400 - 499)**: Rincian biaya administrasi & umum.
5. **Rekening 600 - 602 / 603**: Laporan pengolahan pabrik dan infrastruktur.
6. **Rekening 040 - 049**: Biaya overhead kebun.
7. **Pengeluaran Biaya / Harga Pokok (LMHP)**: Analisis harga pokok produksi per kilogram komoditas.

### B. Keamanan & Validasi Data
- **Validasi Ketersediaan Data**: Halaman laporan secara otomatis mengecek apakah tabel `public.laporan_manajemen_netral` untuk Kebun, Bulan, dan Tahun yang dipilih sudah diproses.
- **Peringatan Dinamis**: Jika data belum diproses, sistem akan menampilkan alert:
  > **Data Laporan Manajemen Belum Diproses!**  
  > Data LM untuk unit **Kebun Semadam** periode **Oktober 2026** belum dibentuk. Silakan lakukan proses pembentukan data terlebih dahulu.  
  > [Proses Laporan Manajemen Sekarang $\rightarrow$]

---

## 5. Modul "OPERASIONAL/LOOKUP" (DAMOPERA.PRG $\rightarrow$ React Context & Combobox)

Modul ini menangani input parameter seperti Kebun, Periode, Afdeling, Areal, dll. Pada sistem lama, ini menggunakan antarmuka berbasis indeks dBase (`ViewModal()`).

### A. Global State (Periode & Unit Context)
- Pada web modern, parameter ini dibuat menjadi **Global Header Selector** yang terletak di bagian atas `SiteHeader` (menggunakan React Context).
- Sekali pengguna memilih Unit Kebun dan Bulan/Tahun Buku aktif di Header, seluruh halaman input jurnal, input saldo awal, dan modul laporan akan secara otomatis menyesuaikan konteksnya tanpa perlu menginput ulang di setiap halaman.

### B. Modern Search Combobox
Lookup dBase digantikan dengan **Fuzzy Search Combobox (Shadcn/Command)** yang dinamis dan berkinerja tinggi:
- **Pencarian Areal & Afdeling**: Membuka modal popover pencarian cepat.
- **Pencarian Rekening (COA)**: Mengetik kode atau nama rekening langsung memfilter hasil secara instan.
- **Master Data Pendukung**: Data TBM (`NAMATBM`), Pihak Ketiga (`PIHAK`), Budidaya, dan Tahun Tanam disimpan dalam tabel PostgreSQL relasional dan dirender dengan select component premium.

---

## 6. Modul "UTILITY" (DAMSERBA.PRG $\rightarrow$ Web Admin Tools)

Utilitas sistem lama dimodernisasi dengan memprioritaskan keamanan data dan kemudahan penggunaan di browser web.

1. **Calculator (`HITUNG()`)**:
   - Dibuat menjadi panel kalkulator melayang (floating widget) yang dapat diakses di sudut kanan bawah aplikasi. Dilengkapi dengan riwayat perhitungan kertas gulung (audit tape) yang sangat disukai oleh akuntan.
2. **Backup & Restore Data (`RESTORDA()` & `SIMPANDA()`)**:
   - *Lama*: Backup ke Disket A/B atau folder lokal.
   - *Baru*: Menggunakan fitur ekspor aman data transaksi ke format encrypted JSON atau Excel. Halaman restore menyediakan upload file dengan mekanisme validasi dan *dry-run* (mensimulasikan impor sebelum benar-benar menulis ke database untuk mencegah kerusakan data).
3. **Edit/Browse DBF (BERUS / `TbBrowse()`)**:
   - Disediakan halaman **Admin Database Console** yang menampilkan tabel data master & transaksi dalam grid interaktif yang dapat di-filter, diurutkan, dan diedit secara inline (jika pengguna memiliki hak akses Administrator).
4. **Keamanan File**:
   - Menghapus fungsionalitas direktori OS (`DIRFILE()`) dan penghapusan file mentah (`HILANG()`) dari antarmuka pengguna untuk menjaga keamanan server.

---

## 7. Rencana Skema Database Tambahan

Untuk mendukung fitur-fitur di atas, kita perlu membuat beberapa tabel tambahan di Supabase:

### A. Tabel Anggaran (`anggaran_rabi`)
Menyimpan anggaran tahunan per rekening untuk analisis variansi Laporan Manajemen:
```sql
CREATE TABLE public.anggaran_rabi (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    "KOKE" varchar NOT NULL REFERENCES public.master_unit("KOKE"),
    "TAHUN" varchar(4) NOT NULL,
    "REK" varchar NOT NULL REFERENCES public.master_rekening("REKSUB"),
    "NOMINAL" numeric(15,2) DEFAULT 0.00,
    "BULAN_01" numeric(15,2) DEFAULT 0.00,
    -- ... s.d. BULAN_12 untuk breakdown bulanan jika diperlukan
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);
```

### B. Tabel Cache Laporan Manajemen (`laporan_manajemen_netral`)
Menyimpan hasil proses LM agar laporan manajemen dapat dimuat seketika:
```sql
CREATE TABLE public.laporan_manajemen_netral (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    "KOKE" varchar NOT NULL REFERENCES public.master_unit("KOKE"),
    "BULAN" varchar(2) NOT NULL,
    "TAHUN" varchar(4) NOT NULL,
    "REK" varchar NOT NULL REFERENCES public.master_rekening("REKSUB"),
    "SALBULNLAL" numeric(15,2) DEFAULT 0.00, -- Saldo bulan lalu
    "SALRABLAL" numeric(15,2) DEFAULT 0.00,  -- Saldo akumulasi RAB s.d bulan lalu
    "BIAYABI" numeric(15,2) DEFAULT 0.00,    -- Biaya bulan ini
    "BIAYASD" numeric(15,2) DEFAULT 0.00,    -- Biaya s.d bulan ini
    "ANGGARANBI" numeric(15,2) DEFAULT 0.00, -- Anggaran bulan ini
    "ANGGARANSD" numeric(15,2) DEFAULT 0.00, -- Anggaran s.d bulan ini
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_lm_entry UNIQUE ("KOKE", "BULAN", "TAHUN", "REK")
);
```

### C. Tabel Master Areal, Afdeling, & TBM
```sql
CREATE TABLE public.master_areal (
    "KODA" varchar PRIMARY KEY,
    "NAMA_AREAL" varchar NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.master_afdeling (
    "KODAF" varchar PRIMARY KEY,
    "NAMA_AFDELING" varchar NOT NULL,
    "KOKE" varchar REFERENCES public.master_unit("KOKE"),
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);
```

---

## 8. Langkah Implementasi Selanjutnya (Next Action Steps)

- `[ ]` Tahap 1: Inisialisasi Database (Eksekusi DDL Migrasi untuk Anggaran & Cache LM)
- `[ ]` Tahap 2: Buat Halaman Proses & Kalkulasi (Trial Balance & LNET Generation Server Actions)
- `[ ]` Tahap 3: Implementasi Global Context Selector untuk Unit & Periode di SiteHeader
- `[ ]` Tahap 4: Pembuatan Halaman Laporan Keuangan Utama (Buku Besar, Neraca 13 Halaman, Memorial)
- `[ ]` Tahap 5: Pembuatan Dashboard Laporan Manajemen (LM-13, Perbandingan Budget vs Aktual)
- `[ ]` Tahap 6: Utilitas Sistem (Kalkulator Floating, Ekspor/Impor Data, Console Editor)

---

> **PENTING: Catatan Keamanan RLS Database:**  
> Advisor Supabase mendeteksi bahwa **4 tabel utama (`master_unit`, `master_rekening`, `jurnal_transaksi`, `saldo_awal`) saat ini menonaktifkan Row Level Security (RLS)**.  
> Dalam implementasi berikutnya, RLS wajib diaktifkan bersamaan dengan policy autentikasi (misal, hanya mengizinkan role `authenticated` untuk melakukan modifikasi) agar database aman dari injeksi anonim.
