# Rencana Optimasi Performa Aplikasi (PT Semadam)

Dokumen ini berisi rencana strategi untuk mengoptimalkan performa aplikasi akuntansi PT Semadam yang menggunakan **Next.js (App Router)**, **Supabase**, dan **TanStack Table**.

---

## 1. Layer Database & Query (Supabase)

Ketika volume data transaksi akuntansi bertambah besar, efisiensi query database menjadi faktor paling penting dalam performa aplikasi.

### A. Penerapan Database Indexing
Query pada tabel `jurnal_transaksi` seringkali melakukan filtering berdasarkan unit (`KOKE`), bulan (`KOBU`), dan diurutkan berdasarkan `TANGGAL` serta `NO_BUKJUR`.
* **Rencana Tindakan:**
  Buat **Composite Index** di Supabase SQL Editor untuk mempercepat visualisasi dan pencarian data:
  ```sql
  CREATE INDEX idx_jurnal_filter ON jurnal_transaksi ("KOKE", "KOBU", "TANGGAL", "NO_BUKJUR");
  ```

### B. Membatasi Kolom Data (`Select Specific Columns`)
Menghindari penggunaan `.select('*')` jika beberapa kolom berukuran besar tidak digunakan dalam visualisasi tabel.
* **Rencana Tindakan:**
  Ubah query pada file action (misal `lib/actions/jurnal.ts`) agar hanya meminta kolom yang benar-benar ditampilkan di UI.
  ```typescript
  // Sebelum: .select('*')
  // Sesudah:
  const { data } = await supabase
    .from('jurnal_transaksi')
    .select('id, TANGGAL, NO_BUKJUR, DEBET, KREDIT, KOKE, KOREK, KETERANGAN');
  ```

### C. Server-Side Pagination
Saat ini, semua jurnal ditarik sekaligus tanpa batas. Ketika jumlah baris mencapai ribuan, client akan mengalami lag saat merender dan memproses data.
* **Rencana Tindakan:**
  * Implementasikan `.range(from, to)` pada query Supabase.
  * Atur parameter `manualPagination: true` di konfigurasi TanStack Table client-side untuk melakukan pagination dinamis dari server.

---

## 2. Layer Server (Next.js & React Server Components)

Optimalisasi pemrosesan di sisi server untuk mengurangi latency loading halaman.

### A. Pengambilan Data Paralel (`Concurrent Fetching`)
Menghindari pemanggilan data secara berurutan (*Waterfall*) pada Server Components yang menyebabkan halaman tertahan lebih lama.
* **Rencana Tindakan:**
  Gunakan `Promise.all` ketika mengambil data referensi (Unit dan Rekening) pada halaman dashboard secara bersamaan.
  ```typescript
  // Cepat (Parallel): Diambil bersamaan secara concurrent
  const [units, rekenings] = await Promise.all([
    getMasterUnit(),
    getMasterRekening()
  ]);
  ```

### B. Request Deduplication (React `cache`)
* **Rencana Tindakan:**
  Bungkus fungsi fetching data di file actions menggunakan `cache` dari React jika fungsi tersebut dipanggil berkali-kali di berbagai komponen server dalam siklus rendering yang sama.

---

## 3. Layer Client-Side & UI (React & TanStack)

Meningkatkan kehalusan (smoothness) interaksi UI bagi pengguna.

### A. Optimistic Updates (`useOptimistic`)
Mengurangi waktu tunggu respons server (seolah 0ms latency) bagi pengguna saat melakukan mutasi (tambah/hapus).
* **Rencana Tindakan:**
  Implementasikan hook `useOptimistic` (bawaan React 19) pada komponen UI input transaksi, sehingga baris baru langsung muncul di tabel secara instan sambil menunggu proses asinkron Server Action selesai di server.

### B. DOM Virtualization (`@tanstack/react-virtual`)
Jika tabel harus menampilkan data dalam jumlah yang sangat besar secara sekaligus tanpa pagination (misal ekspor laporan atau tinjauan mendalam).
* **Rencana Tindakan:**
  Integrasikan `@tanstack/react-virtual` ke komponen `data-table.tsx` untuk membatasi rendering elemen DOM hanya pada baris yang sedang terlihat di area pandang layar (*viewport*).

---

## 4. Environment & Build

* **Turbopack:** Pertahankan penggunaan flag `--turbopack` saat development (`npm run dev --turbopack`) untuk compile yang super cepat.
* **Prefetching Navigasi:** Pastikan semua navigasi menggunakan komponen `<Link>` dari `next/link` agar Next.js melakukan prefetch halaman tujuan sebelum pengguna mengkliknya.
