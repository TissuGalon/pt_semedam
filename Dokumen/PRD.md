# PRODUCT REQUIREMENT DOCUMENT (PRD)
## SISTEM PORTAL ERP & TEMA WARNA INTEGRASI - PT SEMADAM

| Informasi Dokumen | Detail |
| :--- | :--- |
| **Nama Proyek** | Sistem Informasi ERP Terintegrasi PT Semadam |
| **Modul / Subsistem** | Portal Gateway, Navigasi Modul-Aware \& Konsistensi Visual |
| **Versi Dokumen** | 1.0.0 |
| **Tanggal Terbit** | 29 Mei 2026 |
| **Status Dokumen** | Final (Disetujui untuk Produksi) |
| **Bahasa** | Bahasa Indonesia |

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang
Dalam rangka modernisasi sistem operasional PT Semadam dari sistem berbasis DOS (Clipper/dBase) menuju platform berbasis Web modern (Next.js, TailwindCSS, Supabase), integrasi antarmuka pengguna (UI/UX) antar departemen menjadi faktor krusial. Sistem ERP PT Semadam dikembangkan dalam 5 modul fungsional utama yang berjalan secara paralel:
1. **Accounting (Sistem Informasi Akuntansi - SIA)**
2. **Inventory (Logistik & Gudang)**
3. **Kas/Bank (Treasury)**
4. **Payroll (HRD & Penggajian)**
5. **Assets (Aktiva Tetap & Depresiasi)**

Sebelum pembaruan arsitektural ini dilakukan, terdapat beberapa masalah inkonsistensi yang dihadapi oleh pengguna:
* **Namespace Rute yang Membingungkan**: Beberapa modul menggunakan namespace `/dashboard/` sementara modul lain diakses secara terpisah, memicu kebingungan navigasi.
* **Kebocoran Identitas Visual (Visual Leakage)**: Modul-modul dengan fungsi yang berbeda sering menggunakan aksen warna yang sama secara tumpang tindih (misalnya modul Akuntansi yang sempat menggunakan warna hijau zamrud milik Payroll), sehingga pengguna kehilangan intuisi psikologis mengenai modul kerja aktif mereka.
* **Header & Pencarian yang Kaku**: Kotak pencarian menu (`CommandMenu`) dan remah roti (`Breadcrumbs`) bersifat statis dan tidak adaptif terhadap modul yang sedang digunakan.

Untuk menyelesaikan masalah di atas, sistem ini merombak total arsitektur navigasi global menjadi **Sistem Portal ERP Terpadu** yang menerapkan rute modular (`/portal/`), menu pencarian adaptif, bottom bar dinamis untuk perangkat seluler, serta **sistem pewarnaan eksklusif per modul (Module-Specific Color Theming)**.

### 1.2 Tujuan Dokumen
Dokumen Product Requirement Document (PRD) ini dibuat untuk:
* Menjelaskan spesifikasi produk dari sistem portal terpadu dan navigasi dinamis berbasis konteks.
* Menetapkan panduan standardisasi identitas visual (skema warna) untuk kelima modul utama ERP PT Semadam.
* Menjadi acuan teknis bagi tim pengembang dalam memelihara dan menambahkan fitur baru agar senantiasa konsisten secara estetika UI/UX premium.

### 1.3 Ruang Lingkup Sistem
Portal ERP ini mencakup gerbang selektor utama (`/portal`), penataan tata letak navigasi samping (Sidebar), sistem remah roti dinamis (Site Header & Breadcrumbs), modal pencarian modular (`CommandMenu`), bilah tombol bawah untuk mobile (`MobileBottomBar`), serta standardisasi tombol navigasi kembali (*Back to Portal*).

---

## 2. PANDUAN IDENTITAS VISUAL (COLOR THEMING SYSTEM)

Untuk meningkatkan kecepatan kognitif pengguna dalam mengenali modul aktif secara psikologis, ditetapkan aturan pewarnaan eksklusif untuk masing-masing modul. Seluruh tombol utama (*primary buttons*), ikon menu aktif, batas fokus teks (*focus border*), lencana inisial avatar, serta efek hover harus mematuhi kode warna TailwindCSS berikut:

| Nama Modul ERP | Warna Utama | Kode Tailwind CSS | Aksen Hover / Dark Mode | Representasi Psikologis |
| :--- | :--- | :--- | :--- | :--- |
| **Accounting (SIA)** | Oranye (Orange) | `bg-orange-500` / `text-orange-600` | `hover:bg-orange-600` / `dark:text-orange-400` | Keuangan, Anggaran, Neraca |
| **Inventory (Gudang)** | Biru (Blue) | `bg-blue-600` / `text-blue-600` | `hover:bg-blue-700` / `dark:text-blue-400` | Logistik, Stok, Inventaris |
| **Kas/Bank (Treasury)** | Indigo | `bg-indigo-650` / `text-indigo-600` | `hover:bg-indigo-700` / `dark:text-indigo-400` | Transaksi Kasir, Uang Tunai, Bank |
| **Payroll (HRD)** | Hijau Zamrud (Emerald) | `bg-emerald-600` / `text-emerald-600` | `hover:bg-emerald-700` / `dark:text-emerald-450` | Karyawan, Tenaga Kerja, Gaji |
| **Assets (Aktiva Tetap)**| Biru Langit (Sky Blue) | `bg-sky-600` / `text-sky-655` | `hover:bg-sky-700` / `dark:text-sky-400` | Aset Tetap, Nilai Manfaat, Tanah |

---

## 3. SPESIFIKASI FUNGSIONAL (FUNCTIONAL REQUIREMENTS)

### 3.1 RF-01: Portal Gateway & Namespace Rute Terpadu
Sistem harus menyatukan seluruh akses modul ERP di bawah satu gerbang utama.
* **RF-01.1**: Halaman `/portal` bertindak sebagai modul selector utama yang menyajikan ubin Bento Grid dinamis berisi kelima kartu modul.
* **RF-01.2**: Migrasi rute dari namespace `/dashboard/` ke `/portal/` secara penuh:
  * `/(accounting)/dashboard/...` ➔ `/(accounting)/portal/accounting/...`
  * `/(inventory)/dashboard/...` ➔ `/(inventory)/portal/inventory/...`
  * `/(kas-bank)/dashboard/...` ➔ `/(kas-bank)/portal/kas-bank/...`
  * `/(payroll)/dashboard/...` ➔ `/(payroll)/portal/payroll/...`
  * `/(assets)/dashboard/...` ➔ `/(assets)/portal/assets/...`

### 3.2 RF-02: Sistem Navigasi Sidebar Khusus Modul
Setiap modul harus memiliki komponen sidebar independen yang menampilkan menu spesifik modul terkait dengan pewarnaan yang serasi:
* **RF-02.1**: Logo atau huruf pengenal atas pada sidebar wajib menggunakan warna modul masing-masing (contoh: huruf "S" oranye untuk Akuntansi, "S" biru untuk Logistik).
* **RF-02.2**: Hover menu samping dan status link aktif (`isActive`) wajib menampilkan skema warna modul:
  * Akuntansi: `text-orange-600 bg-slate-100` (atau `dark:text-orange-400 dark:bg-zinc-800`).
  * Logistik: `text-blue-600 bg-slate-100`.
  * Treasury: `text-indigo-600 bg-slate-100`.
  * HRD/Gaji: `text-emerald-600 bg-slate-100`.
  * Aktiva: `text-sky-650 bg-slate-100`.

### 3.3 RF-03: SiteHeader & Breadcrumbs Context-Aware
Bilah header di bagian atas halaman harus mendeteksi posisi pengguna secara dinamis.
* **RF-03.1**: Remah roti (*Breadcrumbs*) otomatis mengurai URL pathname Next.js:
  * `/portal/accounting` ➔ `Portal` / `Accounting`
  * `/portal/inventory` ➔ `Portal` / `Inventory`
* **RF-03.2**: Elemen styling pada dropdown selektor unit global (`KOKE`), bulan, dan tahun harus mengadaptasi warna modul aktif.

### 3.4 RF-04: Command Menu Adaptif ("Cari fitur atau laporan...")
Modal utilitas pencarian cepat (dipanggil via `Ctrl + K` atau klik tombol pencarian) harus menyesuaikan perilakunya berdasarkan modul aktif:
* **RF-04.1**: Sistem mendeteksi modul aktif dari pathname URL dan memuat daftar fitur pencarian yang relevan saja (tidak mencampuradukkan menu payroll saat berada di modul akuntansi).
* **RF-04.2**: Warna penyorot baris pencarian terpilih (*highlight selector*) harus adaptif (contoh: `bg-orange-500` saat di akuntansi, `bg-blue-600` di gudang).
* **RF-04.3**: Placeholder teks dinamis berubah sesuai konteks modul (contoh: *"Cari rekening COA atau jurnal..."* untuk Akuntansi).

### 3.5 RF-05: Mobile Bottom Bar Module-Aware
Bilah navigasi bawah khusus untuk resolusi layar perangkat seluler harus dinamis:
* **RF-05.1**: Bottom bar **wajib disembunyikan** (me-return `null`) ketika pengguna berada di halaman Landing Page (`/`) atau halaman selektor portal utama (`/portal`) agar tata letak visual bersih.
* **RF-05.2**: Menghilangkan tombol menu "Portal" dari bottom bar modul kerja guna memfasilitasi tata letak 4-tombol bawah (4-button layout) yang lapang dan fokus.
* **RF-05.3**: Garis indikator aktif pada menu bawah diselaraskan dengan warna modul berjalan (oranye untuk akuntansi, hijau untuk payroll).

### 3.6 RF-06: Standardisasi Tombol Kembali (Back to Portal)
Tombol kembali dari halaman utama masing-masing modul menuju halaman selector portal utama disamakan polanya di seluruh sistem:
* **RF-06.1**: Diletakkan secara konsisten di **sisi kiri judul halaman utama** (sebelum tulisan sub-modul).
* **RF-06.2**: Menggunakan tombol ikon persegi berbingkai melayang premium (`Button variant="outline" size="icon" className="rounded-xl h-9 w-9 cursor-pointer"`) yang memuat ikon `ArrowLeft` dari `lucide-react`.

---

## 4. KEBUTUHAN NON-FUNGSIONAL (NON-FUNCTIONAL REQUIREMENTS)

### 4.1 Konsistensi UI & UX Premium
* **NFR-1.1**: Seluruh transisi visual pada hover status menu, ikon, dan tombol wajib menggunakan animasi mikro transisi CSS (`transition-all duration-200 ease-in-out`) agar gerakan terasa alami dan premium.
* **NFR-1.2**: Tampilan wajib mematuhi panduan mode gelap (*dark mode*) yang rapi dengan kontras warna yang nyaman di mata menggunakan warna HSL slate/zinc.

### 4.2 Kepatuhan Tipe Data & Kompilasi
* **NFR-2.1**: Seluruh perubahan penamaan rute, integrasi parameter URL baru, dan penyelarasan tema warna wajib lulus uji tipe TypeScript tanpa kesalahan. Perintah pengujian kompilasi `npm run typecheck` wajib mengembalikan kode keluar `0`.

---

## 5. DETAIL ARSITEKTUR STRUKTUR FILE

Berikut adalah peta berkas antarmuka terintegrasi yang menerapkan parameter PRD ini:
* **Global App Layout & Context**: `app/layout.tsx` (Mengandung context modular global).
* **Portal Selector Gateway**: [page.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/app/portal/page.tsx) (Selector bento grid).
* **SiteHeader & Breadcrumbs**: [site-header.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/site-header.tsx).
* **Command Menu**: [command-menu.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/command-menu.tsx).
* **Mobile Navigation**: [mobile-bottom-bar.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/mobile-bottom-bar.tsx).
* **Accounting Module Components**:
  * Dashboard SIA: [page.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/app/(accounting)/portal/accounting/page.tsx)
  * Sidebar Akuntansi: [accounting-sidebar.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/accounting-sidebar.tsx)
  * Floating Calculator: [floating-calculator.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/accounting/floating-calculator.tsx)
  * Master Unit Components: [unit-table.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/master-unit/unit-table.tsx) & [unit-form.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/master-unit/unit-form.tsx)
  * Master Rekening Components: [rekening-table.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/master-rekening/rekening-table.tsx) & [rekening-form.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/master-rekening/rekening-form.tsx)
* **Inventory Module Components**:
  * Dashboard Inventory: [page.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/app/(inventory)/portal/inventory/page.tsx)
  * Sidebar Inventory: [inventory-sidebar.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/inventory-sidebar.tsx)
* **Kas/Bank Module Components**:
  * Sidebar Kas & Bank: [kas-bank-sidebar.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/kas-bank-sidebar.tsx)
* **Payroll Module Components**:
  * Sidebar Payroll: [payroll-sidebar.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/payroll-sidebar.tsx)
* **Assets Module Components**:
  * Sidebar Assets: [assets-sidebar.tsx](file:///e:/PROJECT/PT%2520Semedam/pt_semadam/components/assets-sidebar.tsx)

---

> **DOKUMEN SPESIFIKASI KEBUTUHAN PRODUK (PRD) PORTAL ERP PT SEMADAM INI TELAH DIRESMIKAN SEBAGAI ACUAN STANDAR VISUAL DAN ARSITEKTUR NAVIGASI.**
