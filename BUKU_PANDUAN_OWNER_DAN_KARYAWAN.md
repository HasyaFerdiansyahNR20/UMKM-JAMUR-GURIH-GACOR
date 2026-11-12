# 📘 Buku Panduan Operasional Website UMKM Jamur Gurih Gacor
**Panduan Lengkap untuk Pemilik (Owner) & Karyawan Toko (Admin)**
*Versi Terbaru — Dilengkapi Sistem Keamanan OTP, Role Pengelola, Diskon Otomatis & Auto-Cancel*

Selamat datang di sistem katalog digital dan pemesanan **UMKM Jamur Gurih Gacor** (*"Jamur Crispy Paling Gacor Se-Indonesia"*). Buku panduan ini disusun dengan bahasa yang jelas dan praktis agar **Owner** maupun **Karyawan** dapat langsung mengoperasikan website dengan mudah dan aman lewat HP maupun Laptop.

---

## 1. Informasi Penting & Hak Akses Pengelola Toko

Sistem website kini memiliki **2 Tingkatan Role Pengelola** demi keamanan operasional toko:
1. **👑 Role OWNER (Pemilik Toko):** Memiliki hak akses penuh ke **6 Menu Dasbor** (Kelola Stok, Kelola Menu & Harga, Banner Promo Diskon, Log Transaksi Pesanan, Ubah Informasi Kontak/Alamat/Jam Operasional, dan Manajemen Akun Karyawan).
2. **👤 Role ADMIN (Karyawan Toko):** Memiliki akses khusus operasional harian ke **2 Menu Dasbor** (Mengatur Saklar Stok Menu & Mengelola Pesanan Pelanggan). Karyawan **tidak bisa** melihat/mengubah harga menu, rahasia akun Owner, atau informasi toko.

### Ringkasan Akses Login & Kontak:

| Keperluan | Keterangan / Informasi | Catatan |
| :--- | :--- | :--- |
| **Website Katalog Pelanggan** | `https://jamurgurihgacor.store` | Bagikan link ini di bio Instagram, TikTok, WhatsApp, dan meja warung. |
| **Halaman Login Pengelola** | `https://jamurgurihgacor.store/admin` | Halaman login khusus Owner dan Karyawan (tanpa tombol publik di footer). |
| **Login Akun OWNER** | Username / Email: `owner` atau `admin@gurihgacor.com`<br>Password: `admin01` *(bisa diubah di dasbor)* | Mengakses seluruh 6 menu dasbor toko. |
| **Login Akun KARYAWAN** | Username: `admin1`<br>Password: `admin123`<br>Email OTP: `hasyaferdiansyahnr@gmail.com` | Khusus mengelola Stok & Log Pesanan pelanggan. |
| **Email Pengirim OTP (Sistem)** | `jamurgurihgacor@gmail.com` | Mesin pengirim email kode verifikasi OTP otomatis. |
| **Email Pemulihan Kata Sandi** | Email Utama: `kuliahslebew@gmail.com`<br>Email Alternatif: `fnrhasya@gmail.com` | Digunakan saat Owner klik *Lupa Kata Sandi*. |
| **Nomor WhatsApp Toko** | `0895-6349-49189` | Menerima pesanan langsung dari keranjang website. |
| **Telegram Bot Pemesanan** | `@GurihGacorBot` | Saluran alternatif pemesanan pelanggan via Telegram. |
| **Instagram & TikTok Resmi** | `@gurih.gacor` | Tautan resmi media sosial UMKM Gurih Gacor. |

> **Tips Cepat di HP Android / iPhone:**  
> Buka `https://jamurgurihgacor.store/admin` di Chrome / Safari HP toko, lalu klik menu **Titik Tiga (⋮) → "Tambahkan ke Layar Utama" (Add to Home Screen)** agar muncul ikon seperti aplikasi kasir di layar HP!

---

## 2. Sistem Keamanan Login 2 Langkah (Verifikasi OTP) & Pemulihan Akun

Demi menjaga keamanan toko dari peretasan, website dilindungi sistem keamanan berstandar perbankan:

### A. Cara Masuk (Login) dengan Kode OTP:
1. Buka `https://jamurgurihgacor.store/admin`.
2. Masukkan **Username / Email** dan **Kata Sandi**.
3. Klik tombol **`LANJUTKAN (KIRIM OTP KE EMAIL)`**.
4. Sistem akan otomatis mengirimkan **6 angka Kode OTP** ke email:
   - Jika **Owner** yang login: OTP masuk ke Email Utama Owner.
   - Jika **Karyawan** yang login: OTP masuk ke Email Karyawan **sekaligus tembusan ke Email Owner** (sehingga Owner selalu tahu kapan karyawan login).
5. Buka kotak masuk email (Inbox / Spam), masukkan 6 angka OTP tersebut di layar verifikasi, lalu klik **`VERIFIKASI & MASUK DASBOR`**.
   *(Kode OTP berlaku selama 5 menit dan langsung hangus setelah digunakan).*

### B. Cara Mengatur Ulang Kata Sandi jika Lupa (Pemulihan 2 Email):
1. Di halaman login `/admin`, klik tulisan oranye **`Lupa Kata Sandi?`**.
2. **Tahap 1 (Pilih Email):** Pilih salah satu opsi:
   - **Opsi 1 — Email Pemulihan Utama** (`ku***********@gmail.com`)
   - **Opsi 2 — Email Pemulihan Alternatif** (`fn******@gmail.com`)  
   Lalu klik **`KIRIM KODE PEMULIHAN KE EMAIL`**.
3. **Tahap 2 (Verifikasi OTP Dulu):** Cek email yang dipilih, masukkan 6 angka kode OTP, lalu klik **`VERIFIKASI KODE OTP`**. Kolom kata sandi baru tidak akan terbuka sebelum OTP dinyatakan valid.
4. **Tahap 3 (Buat Kata Sandi Baru):** Masukkan kata sandi baru Anda (minimal 6 karakter) dan konfirmasi, lalu klik **`SIMPAN KATA SANDI BARU`**.

---

## 3. Alur Kerja Harian Karyawan (SOP Harian)

Berikut adalah panduan langkah kerja karyawan dari buka warung hingga tutup:

### A. Saat Buka Warung (Persiapan)
1. Cek bahan jamur, bumbu tabur, saus, dan kemasan di gerobak/dapur.
2. Login ke halaman admin, buka tab **"Ketersediaan Stok"**.
3. Pastikan semua menu yang siap dijual memiliki **saklar berwarna HIJAU (Tersedia)**.
4. Jika ada menu yang bahannya kosong hari itu, geser saklar ke **ABU-ABU (Habis)**.

### B. Saat Jam Jualan & Menerima Pesanan Masuk (Auto-Cancel 10 Menit):
1. Pelanggan memilih menu di website, memilih porsi (*Small*, *Medium*, atau *Large*), memilih promo diskon jika tersedia, lalu klik **Pesan Sekarang via WhatsApp** atau **Telegram**.
2. Pesanan pelanggan otomatis masuk ke WhatsApp toko dan tercatat di tab **"Log Pesanan"** dasbor admin dengan status awal **`Pending`**.
3. **PENTING — Batas Waktu Bayar 10 Menit (Auto-Cancel):**
   - Setiap pesanan `Pending` memiliki waktu pembayaran **10 Menit**.
   - Di tabel Log Pesanan terdapat indikator jam hitung mundur: `Auto-Cancel: 09:45`.
   - Jika pelanggan mengonfirmasi pembayaran sebelum 10 menit, karyawan/owner cukup mengklik tombol hijau **`Sudah Bayar`** (status otomatis berubah menjadi `Sedang Dimasak`).
   - Jika dalam 10 menit pelanggan tidak ada kabar atau belum bayar, **sistem otomatis membatalkan pesanan** (`Cancelled`) sehingga karyawan tidak salah menggoreng bahan pesanan bodong.

### C. Saat Menu Habis Mendadak di Tengah Jam Jualan
- Segera buka tab **"Ketersediaan Stok"** di HP dan klik saklar menu tersebut menjadi **Abu-abu**.
- Detik itu juga, tombol beli menu tersebut di website pelanggan langsung terkunci menjadi **"Stok Habis"**.

---

## 4. Panduan Lengkap 6 Menu Dasbor Pengelola

### 🟢 1. Tab Ketersediaan Stok (Akses: Owner & Karyawan)
- Dirancang khusus untuk operasional kasir/karyawan: cukup sentuh 1 tombol saklar untuk membuka atau menutup stok menu tanpa risiko salah mengubah harga.
- Saklar Hijau = Tersedia. Saklar Abu-abu = Habis. Perubahan tersimpan seketika.

### 🍄 2. Tab Manajemen Produk & Harga (Akses: Khusus Owner)
Gunakan tab ini ketika Owner ingin menambah menu baru, mengubah harga, atau memasang promo diskon.
- **Tambah Menu Baru:** Klik **`+ Tambah Menu Baru`** -> Isi Nama, Kategori, Level Pedas, Harga Jual (Rp), dan Deskripsi singkat.
- **Fitur "🔥 Tandai Promo Diskon" & Harga Coret:**
  - Centang kotak **"Tandai Promo Diskon"** jika menu sedang diskon.
  - Masukkan harga asli sebelum diskon pada kolom **Harga Coret / Asli** (misal harga asli `20000`, harga jual `15000`).
  - Di website pelanggan, menu tersebut otomatis mendapat pita merah **🔥 PROMO** dan harga aslinya dicoret menarik.
- **Upload Foto Produk:** Klik tombol **`UPLOAD FOTO`** (maksimal 2 MB, format JPG/PNG/WebP). Sistem otomatis mengompres foto menjadi sangat ringan (< 100 KB) agar website pelanggan tetap kencang dibuka.

### 🎉 3. Tab Banner Promo & Diskon Keranjang (Akses: Khusus Owner)
Spanduk promo di halaman utama website sekarang terhubung langsung dengan keranjang belanja pelanggan:
- **Aturan Potongan Harga Keranjang Otomatis:**
  Saat membuat banner promo baru di dasbor, Owner dapat mengatur:
  - **Potongan (Rp):** Jumlah potongan harga (misal: `5000` atau `10000`).
  - **Min. Beli (Porsi):** Syarat minimal pembelian (misal: `2` porsi).
  - **Khusus Varian:** Bisa diatur berlaku untuk `Semua Varian` atau khusus varian tertentu seperti `Pedas Manis`.
- **Dampaknya di Pelanggan:**
  - Pelanggan yang membuka keranjang pesanan bisa memilih promo tersebut dari dropdown **"🎟️ Gunakan Promo / Diskon"**.
  - Jika syarat terpenuhi (misal sudah beli 2 porsi), harga **Total Pembayaran otomatis terpotong Rp 5.000 / Rp 10.000**.
  - Jika syarat belum terpenuhi, sistem otomatis memberi tahu pelanggan: *"Kurang 1 porsi lagi untuk menikmati promo ini"*.

### 📋 4. Tab Log Pesanan & Transaksi (Akses: Owner & Karyawan)
Memantau seluruh transaksi pesanan yang masuk dari website:
- **No. Pesanan & Pelanggan:** Rincian nama, nomor WhatsApp (klik nomor untuk langsung chat pelanggan), dan rincian menu.
- **Status Pesanan:** `Pending (Menunggu Bayar)` → `Sedang Dimasak` → `Siap Diambil / Diantar` → `Selesai` / `Batal`.
- **Tombol Cepat "Sudah Bayar":** Mengubah status pesanan menjadi sedang dimasak dan menghentikan timer auto-cancel 10 menit.
- **Simulasi Pesanan:** Tombol *Tes Simulasi Pesanan* untuk menguji coba fitur timer auto-cancel kapan saja.

### ⚙️ 5. Tab Pengaturan Toko (Akses: Khusus Owner)
Owner bisa mengubah informasi toko kapan saja secara mandiri tanpa perlu menyentuh kodingan website:
- **Nomor WhatsApp & Bot Telegram:** Ubah nomor tujuan penerima pesanan.
- **Alamat Lengkap & Link Google Maps:** Perbarui alamat gerobak/outlet dan tautan navigasi Google Maps.
- **Media Sosial:** Perbarui username & tautan akun Instagram dan TikTok Gurih Gacor.
- **Jam Operasional Toko:** Ubah jadwal buka/tutup (contoh: `Senin – Minggu, 09.00 – 21.00 WIB`).
- **Mode Darurat Operasional (Statis):** Nyalakan tombol darurat jika toko sedang libur panjang/renovasi agar halaman depan berubah menjadi pesan sederhana.

### 👥 6. Tab Akun & Role (Akses: Khusus Owner)
Pusat kendali hak akses pengelola toko:
- **Manajemen Akun Karyawan:**
  - Klik **`+ Buat Akun Karyawan`** untuk membuat akun baru kasir/karyawan (Username, Email OTP, Password).
  - Klik **`Edit`** untuk mengganti email atau password karyawan.
  - Klik tombol merah **`Hapus (Resign)`** saat karyawan berhenti kerja. Seketika itu juga karyawan tersebut tidak bisa login lagi dan emailnya tidak akan menerima kode OTP toko.
- **Keamanan Akun Owner & 2 Email Pemulihan:**
  - Mengubah Username Owner, Email Utama Penerima OTP Owner, dan Password Owner.
  - Mengatur **1. Email Pemulihan Utama** dan **2. Email Pemulihan Alternatif**.
  - Mengatur alamat email pengirim OTP (`jamurgurihgacor@gmail.com`) dan tombol **`✉️ Tes Kirim Email OTP`** untuk memastikan pengiriman email berjalan normal.

---

## 5. Fitur Pintar untuk Kenyamanan Pelanggan di Website

1. **Dropdown Promo Otomatis di Keranjang:** Pelanggan tidak perlu repot mengetik kode kupon yang rumit; cukup pilih promo aktif dari dropdown di keranjang.
2. **Keranjang Anti-Hilang:** Jika pelanggan tidak sengaja menutup browser atau HP-nya mati, data pesanan dan alamat yang sudah diketik tidak akan hilang.
3. **Pemberitahuan Aman Pasca-Pesan:** Nomor pesanan tersimpan di keranjang sehingga jika aplikasi WhatsApp pelanggan tertutup tidak sengaja, rincian pesanan tetap aman dan teks pesanan otomatis disalin ke clipboard.

---

## 6. Tanya Jawab & Solusi Kendala (FAQ)

**❓ 1. Karyawan tidak menerima kode OTP saat login, kenapa?**  
> **Solusi:**  
> 1. Pastikan karyawan mengecek folder **Spam** atau tab **Promosi** di Gmail mereka.  
> 2. Pastikan akun pengirim OTP (`jamurgurihgacor@gmail.com`) di tab *Akun & Role* memiliki 16-digit Sandi Aplikasi (*App Password*) Google yang masih aktif. Klik tombol **`✉️ Tes Kirim Email OTP`** di dasbor Owner untuk memastikannya.

**❓ 2. Bagaimana jika Owner lupa password login?**  
> **Solusi:** Klik **`Lupa Kata Sandi?`** di halaman login `/admin`. Pilih kirim OTP ke **Email Utama** atau **Email Alternatif**, masukkan 6 digit OTP yang masuk ke email tersebut, lalu buat password baru.

**❓ 3. Apakah karyawan bisa melihat rahasia password Owner atau mengubah harga menu?**  
> **Solusi:** Tidak bisa sama sekali. Akun Karyawan (`Role: Admin`) hanya diberikan akses ke tab **Ketersediaan Stok** dan **Log Pesanan**. Halaman pengelolaan harga, informasi toko, dan akun Owner dikunci rapat di sisi server.

**❓ 4. Pelanggan memesan tapi pesanan otomatis berubah jadi "Cancelled"?**  
> **Solusi:** Itu adalah fitur proteksi **Auto-Cancel 10 Menit**. Jika pelanggan belum melakukan konfirmasi pembayaran dalam 10 menit setelah klik pesan, sistem membatalkan pesanan otomatis agar bahan dapur tidak terbuang sia-sia. Jika pelanggan baru konfirmasi setelah 10 menit, karyawan bisa mengubah statusnya kembali secara manual menjadi `Sedang Dimasak`.
