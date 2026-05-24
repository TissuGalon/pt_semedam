# Rencana Aksi & Detail Implementasi Penyesuaian Sistem Akuntansi PT Semadam

Dokumen ini berisi analisis mendalam mengenai fitur-fitur dari sistem lama (berbasis Clipper/dBase) yang **belum ada** di sistem baru, serta rencana aksi taktis untuk menerapkannya ke dalam arsitektur modern Next.js + Supabase (PostgreSQL).

---

## 1. Analisis Kesenjangan Fitur (Legacy vs Modern)

Berdasarkan tinjauan file `Planning Penyesuaian Sistem Jadul.md` dan struktur codebase saat ini, berikut adalah tabel perbandingan status implementasi fitur:

| Modul / Fitur Sistem Lama | Deskripsi Teknis | Status di Sistem Baru | Rencana Penyesuaian & Implementasi Modern |
| :--- | :--- | :--- | :--- |
| **Navigasi & Global Context** | Memilih unit aktif (`KOKE`) & periode buku (`BULAN`/`TAHUN`) secara global | **Belum Ada** | Membuat **React Context** (`AccountingContext`) dan merender selector drop-down dinamis di `SiteHeader` agar data otomatis sinkron di semua halaman. |
| **Keyboard Navigation** | Shortcut keyboard untuk navigasi cepat (`GANTI()`, dll.) | **Belum Ada** | Menggunakan library react-hotkeys atau custom hooks untuk bind navigasi keyboard: `Ctrl + S` (Save Jurnal), `Esc` (Close Modal), dan navigasi arrow keys. |
| **Proses Neraca Percobaan** | Mengkalkulasi saldo awal + mutasi jurnal menjadi saldo akhir | **Belum Ada** | Membuat Server Action `calculateTrialBalance` yang memanggil PostgreSQL view/query relasional real-time tanpa tabel temporer. |
| **Proses Neraca Kompilasi** | Konsolidasi neraca percobaan antar unit/kebun | **Belum Ada** | Membuat query agregasi lintas unit (`KOKE`) pada periode tertentu. |
| **Proses Gabung Data (Append)** | Mengunggah dan menggabungkan data Kas, Gudang, & Penyusutan | **Belum Ada** | Membuat halaman `/proses/append` dengan fitur Upload CSV/Excel, validasi rekening (COA), balancing, dan append aman ke `jurnal_transaksi`. |
| **Proses & Cache Laporan Manajemen (LM)** | Perhitungan LNET & caching hasil kalkulasi untuk performa cepat | **Belum Ada** | Membuat tabel `laporan_manajemen_netral` dan Server Action untuk memproses & menyimpan cache perhitungan LM. |
| **Laporan Buku Besar** | Laporan rincian mutasi akun dengan fuzzy search & running balance | *Setengah Jalan* | Saat ini hanya ada `/laporan-jurnal` (tinjauan mentah). Perlu dibuat `/laporan/buku-besar` dengan filter rekening interaktif dan running balance kumulatif. |
| **Laporan Neraca Klasifikasi** | Laporan Neraca 13 Halaman terkelompok berdasarkan prefix rekening | **Belum Ada** | Membuat halaman `/laporan/neraca-klasifikasi` yang mengelompokkan akun berdasarkan prefix (`000.`, `021.`, dll.) dengan print-optimized CSS. |
| **Laporan Neraca Kompilasi** | Tampilan side-by-side konsolidasi unit kebun | **Belum Ada** | Membuat view multi-kolom yang membandingkan Unit 1, 2, 3, eliminasi, dan total konsolidasi. |
| **Laporan Manajemen (LM)** | Laporan Biaya Produksi (LM-13), Investasi (200), TM (257), Overhead, dll. | **Belum Ada** | Membuat modul khusus `/laporan-manajemen` dengan visualisasi grafik interaktif dan deteksi ketersediaan data cache. |
| **Utility: Floating Calculator** | Kalkulator dengan riwayat gulungan kertas (audit tape) | **Belum Ada** | Membuat komponen floating widget calculator di sudut kanan bawah aplikasi. |
| **Utility: Backup & Restore** | Backup disket / folder lokal $\rightarrow$ Modern format | **Belum Ada** | Membuat fitur ekspor enkripsi JSON/Excel dan impor aman dengan *dry-run* simulation. |
| **Utility: Admin Database Console** | Edit inline & browsing database mirip `TbBrowse()` | **Belum Ada** | Membuat halaman `/utility/console` khusus admin untuk manajemen data tabular yang aman. |
| **Keamanan Database (RLS)** | Kebijakan Row Level Security di PostgreSQL | *Critical Issue* | Mengaktifkan RLS pada seluruh tabel (`master_unit`, `master_rekening`, `jurnal_transaksi`, `saldo_awal`) dengan rule berbasis autentikasi Supabase. |

---

## 2. Rencana Pengembangan Skema Database (Supabase DDL)

Untuk mendukung fitur-fitur baru tersebut, migrasi database SQL berikut harus dijalankan di Supabase:

### A. Tabel Master Pendukung & Anggaran (`anggaran_rabi`)
Menyimpan anggaran biaya (RAB) tahunan per rekening untuk analisis variansi Laporan Manajemen.
```sql
CREATE TABLE public.anggaran_rabi (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    "KOKE" varchar NOT NULL REFERENCES public.master_unit("KOKE") ON DELETE CASCADE,
    "TAHUN" varchar(4) NOT NULL,
    "REK" varchar NOT NULL REFERENCES public.master_rekening("REKSUB") ON DELETE CASCADE,
    "NOMINAL" numeric(15,2) DEFAULT 0.00,
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

### B. Tabel Cache Laporan Manajemen (`laporan_manajemen_netral`)
Menyimpan hasil perhitungan LNET per periode agar pembacaan laporan manajemen super cepat.
```sql
CREATE TABLE public.laporan_manajemen_netral (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    "KOKE" varchar NOT NULL REFERENCES public.master_unit("KOKE") ON DELETE CASCADE,
    "BULAN" varchar(2) NOT NULL,
    "TAHUN" varchar(4) NOT NULL,
    "REK" varchar NOT NULL REFERENCES public.master_rekening("REKSUB") ON DELETE CASCADE,
    "SALBULNLAL" numeric(15,2) DEFAULT 0.00, -- Saldo s.d bulan lalu
    "SALRABLAL" numeric(15,2) DEFAULT 0.00,  -- Saldo akumulasi RAB s.d bulan lalu
    "BIAYABI" numeric(15,2) DEFAULT 0.00,    -- Biaya bulan ini (Debet - Kredit)
    "BIAYASD" numeric(15,2) DEFAULT 0.00,    -- Biaya s.d bulan ini
    "ANGGARANBI" numeric(15,2) DEFAULT 0.00, -- Anggaran bulan ini
    "ANGGARANSD" numeric(15,2) DEFAULT 0.00, -- Anggaran s.d bulan ini
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_lm_entry UNIQUE ("KOKE", "BULAN", "TAHUN", "REK")
);
```

### C. Tabel Master Wilayah (`master_areal` & `master_afdeling`)
Untuk mendukung klasifikasi biaya operasional kebun secara presisi.
```sql
CREATE TABLE public.master_areal (
    "KODA" varchar PRIMARY KEY,
    "NAMA_AREAL" varchar NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.master_afdeling (
    "KODAF" varchar PRIMARY KEY,
    "NAMA_AFDELING" varchar NOT NULL,
    "KOKE" varchar REFERENCES public.master_unit("KOKE") ON DELETE CASCADE,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);
```

---

## 3. Rencana Struktur File & Route Baru (Next.js)

Untuk mempertahankan keterbacaan kode (clean code), modul baru akan diletakkan pada folder yang sesuai:

```bash
pt_semadam/
├── app/
│   └── (dashboard)/
│       ├── proses/
│       │   ├── page.tsx                 # UI eksekusi kalkulasi proses
│       │   └── append/
│       │       └── page.tsx             # Halaman import/append data Kas/Gudang
│       ├── laporan/
│       │   ├── buku-besar/
│       │   │   └── page.tsx             # Cetak/Tampilan Buku Besar
│       │   ├── neraca-klasifikasi/
│       │   │   └── page.tsx             # Cetak Neraca 13 Halaman
│       │   └── neraca-kompilasi/
│       │       └── page.tsx             # Tampilan Neraca multi-unit
│       ├── laporan-manajemen/
│       │   └── page.tsx                 # Executive Dashboard & grafik LNET
│       └── utility/
│           ├── page.tsx                 # Menu Utility utama
│           ├── console/
│           │   └── page.tsx             # Grid editor interaktif admin
│           └── backup-restore/
│               └── page.tsx             # Panel ekspor/impor JSON
├── components/
│   ├── accounting/
│   │   └── floating-calculator.tsx      # Komponen kalkulator melayang
│   └── ui/
│       └── fuzzy-combobox.tsx           # Search COA & Afdeling teroptimasi
├── hooks/
│   └── use-accounting-context.tsx       # Global State for Unit & Periode
└── lib/
    └── actions/
        ├── proses.ts                    # Server Actions: Trial Balance, LNET, Append
        ├── laporan.ts                   # Server Actions: Fetch BB, Neraca Halaman
        └── utility.ts                   # Server Actions: Export/Import, DBConsole
```

---

## 4. Langkah Detak Kerja & Strategi Migrasi (Roadmap)

### Tahap 1: Penguatan Fondasi (Keamanan RLS & Global Context)
1. **Penerapan RLS**: Aktifkan RLS di Supabase dan tambahkan kebijakan select/insert/update/delete hanya untuk user dengan role `authenticated`.
2. **Global Context Selector**:
   - Buat `AccountingProvider` untuk menyimpan state `koke` (Unit aktif), `bulan`, dan `tahun`.
   - Modifikasi `SiteHeader` untuk merender 3 Combobox dropdown (Pilih Unit, Pilih Bulan, Pilih Tahun) yang tersinkron secara real-time.
   - Halaman input jurnal & input saldo awal secara otomatis membaca Unit & Periode aktif ini.

### Tahap 2: Implementasi Mesin Komputasi (Modul PROSES)
1. **Server Action `calculateTrialBalance`**:
   - Dibuat menggunakan query agregasi tangguh di PostgreSQL untuk memproses mutasi `jurnal_transaksi` ditambah `saldo_awal` per unit dan periode yang dipilih.
2. **Proses LNET (Laporan Manajemen)**:
   - Buat fungsi pembentuk cache `laporan_manajemen_netral` dengan cara memadukan data transaksi riil dan data `anggaran_rabi`.
3. **Fitur Append**:
   - UI upload CSV/Excel di `/proses/append` dengan file parser client-side. Validasi akun COA dan keselarasan nominal (Debet = Kredit) dilakukan sebelum ditulis ke database.

### Tahap 3: Visualisasi & Reporting Premium (Modul LAPORAN & LM)
1. **Laporan Buku Besar**:
   - Menggunakan fuzzy search COA.
   - Skema running-balance: saldo kumulatif dihitung secara efisien dari baris ke baris menggunakan React/Server-side window function SQL.
2. **Neraca 13 Halaman**:
   - Replikasi grouping legasi menggunakan tab interaktif di browser (Tab 1: Kas & Setara Kas, Tab 2: Piutang, Tab 3: Aktiva Tetap, dst).
   - Fitur "Cetak PDF" dengan styling optimal (print media CSS agar layout tidak terpotong).
3. **Executive Dashboard (LM-13)**:
   - Chart komparatif antara Biaya Aktual (`BIAYASD`) vs Anggaran (`ANGGARANSD`) menggunakan Recharts/Shadcn charts.

### Tahap 4: Pelengkap Utilitas (Modul UTILITY)
1. **Floating Calculator**:
   - Panel kalkulator interaktif yang tetap berada di sudut kanan bawah. Setiap hasil perhitungan ditambahkan ke "riwayat pita audit" yang bisa disalin ke form input jurnal.
2. **Admin Database Console**:
   - Menggunakan `@tanstack/react-table` dengan inline editing untuk row-level adjustments. Hanya dapat diakses oleh user bertipe `admin`.

---

## 5. Rencana Pengujian & Verifikasi (Quality Assurance)

### Pengujian Otomatis & Konsistensi Data
- **Uji Balance Jurnal**: Menjalankan query verifikasi bahwa total Debet dan Kredit pada seluruh baris `jurnal_transaksi` per nomor bukti bernilai seimbang (selisih = 0).
- **Validasi Migrasi DBF**: Melakukan *cross-check* antara jumlah saldo akhir di sistem lama (Clipper) dengan hasil kalkulasi Server Action Next.js untuk periode yang sama.

### Pengujian Manual & UI
- **Uji Print-Friendly**: Melakukan simulasi cetak (`Ctrl + P`) pada halaman laporan untuk memastikan header, footer, dan baris tabel terdistribusi dengan rapi tanpa terpotong di kertas A4/F4.
- **Uji Responsivitas Global Selector**: Mengubah pilihan Kebun/Periode di header dan memastikan data di halaman input serta laporan langsung berubah seketika tanpa *page reload* penuh.

---

> **Rencana ini siap untuk ditindaklanjuti. Silakan berikan persetujuan atau saran perubahan sebelum kita memulai implementasi kode program.**
