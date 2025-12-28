# Small Business Inventory and Sales System (Retail Management)

**Retail Management** adalah aplikasi manajemen ritel berbasis web yang dirancang untuk membantu UMKM mendigitalisasi proses pencatatan transaksi dan pengelolaan inventaris secara aman dan terstruktur. Proyek ini dikembangkan sebagai tugas akhir mata kuliah Basis Data Semester Gasal 2025/2026 di Departemen Ilmu Komputer dan Elektronika, Universitas Gadjah Mada.

## Video Presentasi Demo Project
[Video Presentasi Demo Project](https://youtu.be/9s7H6Kd8Spk)

## Anggota Kelompok 5

* **Aloysius Pijar Hutama Indrianto** (24/534591/PA/22675) 

* **Pison Golda Mountera** (24/543770/PA/23107) 

* **Indratanaya Budiman** (24/534784/PA/22683) 

## Fitur Utama

* **Otomatisasi Transaksi & Dokumentasi**: Pemrosesan transaksi efisien dengan penyimpanan histori otomatis untuk kebutuhan audit internal.

* **Sentralisasi Katalog & Inventaris**: Antarmuka terpusat untuk mengelola kategori, pemasok, produk, dan status stok.

* **Role-Based Access Control (RBAC)**: Pembatasan hak akses yang ketat antara Admin dan Kasir untuk menjaga keamanan data sensitif.

* **UI/UX Filtering**: Pencarian data cepat menggunakan komponen *bubble button* berbasis kategori pada halaman Produk, Inventaris, dan Transaksi.

* **Integritas Harga Historis**: Menjamin akurasi laporan keuangan dengan mengunci nilai harga jual pada saat transaksi terjadi (*price persistence*).


## Teknologi yang Digunakan

* **Backend**: Go (Golang).

* **Database**: MariaDB / MySQL.

* **Manajemen ID**: UUID menggunakan tipe data `BINARY(16)` untuk skalabilitas dan keamanan.

* **Keamanan**: Enkripsi *hashing* untuk penyimpanan kata sandi pengguna.


## Desain Basis Data

Sistem ini telah melalui tahapan normalisasi hingga bentuk **3NF** untuk menghilangkan redundansi data dan dependensi transitif.

### Entitas Utama:

1. **Users**: Data akun pengguna dan kredensial.

2. **Roles & User_Roles**: Manajemen hak akses multi-peran (*Many-to-Many*).

3. **Categories**: Klasifikasi produk.

4. **Suppliers**: Informasi mitra pemasok barang.

5. **Products**: Data master barang dan informasi stok.

6. **Transactions & Transaction_Details**: Rekaman transaksi penjualan dan item spesifik yang terjual.


### Integritas Referensial:

* `ON DELETE RESTRICT`: Diterapkan pada data master (Kategori & Supplier) agar tidak dapat dihapus jika masih terkait dengan produk.


* `ON DELETE CASCADE`: Diterapkan pada transaksi agar rincian item otomatis terhapus jika induk transaksi dibatalkan.


## Hak Akses Pengguna

* **Admin**: Akses penuh ke seluruh modul, termasuk *User Management* dan manipulasi data (CRUD).

* **Cashier**: Akses terbatas hanya untuk melihat katalog (*view-only*) dan memproses transaksi. Kasir hanya diperbolehkan melihat histori transaksi miliknya sendiri.



## Kesimpulan Proyek

Melalui proyek ini, tim berhasil mengimplementasikan sistem yang menjamin integritas data tingkat tinggi melalui desain basis data yang matang. Penggunaan UUID dan integrasi *backend* Go memberikan pengalaman nyata dalam membangun sistem *enterprise* yang skalabel.

---

*Proyek ini dikembangkan untuk tujuan akademik di Universitas Gadjah Mada.*
