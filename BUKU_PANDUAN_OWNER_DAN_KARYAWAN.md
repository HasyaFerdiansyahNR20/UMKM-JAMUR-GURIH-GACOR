# 📘 Buku Panduan Operasional Website UMKM Jamur Gurih Gacor
**Panduan Lengkap untuk Pemilik (Owner) & Karyawan Toko**

Selamat datang di sistem katalog digital dan pemesanan **UMKM Jamur Gurih Gacor** (*"Jamur Crispy Paling Gacor Se-Indonesia"*). Buku panduan ini disusun dengan bahasa yang sederhana agar **Owner** maupun **Karyawan** dapat langsung beradaptasi dan mengoperasikan website dengan mudah setiap hari lewat HP maupun Laptop.

---

## 1. Informasi Penting & Akses Toko

Simpan informasi di bawah ini di catatan HP pengelola toko:

| Keperluan | Link / Informasi | Keterangan |
| :--- | :--- | :--- |
| **Website Katalog (Untuk Pelanggan)** | `https://jamur-gurih-gacor.vercel.app` | Bagikan link ini di bio Instagram, status WA, atau QR Code gerobak/meja. |
| **Halaman Login Admin (Owner & Karyawan)** | `https://jamur-gurih-gacor.vercel.app/admin` | Halaman khusus pengelola untuk mengatur stok, menu, promo, dan pesanan. |
| **Email Login Admin 1 (Utama)** | `admin@gurihgacor.com` | Email login untuk operasional toko. |
| **Email Login Admin 2 (Cadangan)** | `fnrhasya@gmail.com` | Email login alternatif pengelola. |
| **Kata Sandi (Password) Admin** | `gacor123` | **Rahasiakan!** Jangan berikan kepada selain Owner & Karyawan. |
| **WhatsApp Toko Resmi** | `0895-6349-49189` | Nomor penerima pesanan WhatsApp dari website. |
| **Telegram Bot Pemesanan** | `@GurihGacorBot` | Bot penerima pesanan alternatif via Telegram. |
| **Instagram Resmi** | `@gurih.gacor` | Terhubung langsung dari tombol Instagram di website. |

> **Tips Cepat di HP Android / iPhone:**
> Buka halaman `https://jamur-gurih-gacor.vercel.app/admin` di browser Chrome / Safari HP toko, lalu pilih menu **Titik Tiga (⋮) → "Tambahkan ke Layar Utama" (Add to Home Screen)**. Dengan begitu, ikon Admin Gurih Gacor akan muncul di layar HP seperti aplikasi biasa!

---

## 2. Alur Kerja Harian Karyawan (SOP Harian)

Berikut adalah urutan langkah kerja harian yang perlu dilakukan oleh karyawan dari buka warung hingga tutup warung:

### A. Saat Buka Warung (Persiapan)
1. Cek ketersediaan bahan jamur, bumbu tabur, saus, dan minuman di warung.
2. Buka halaman Admin (`/admin`), lalu masuk ke tab **"Ketersediaan Stok"**.
3. Pastikan semua menu yang siap dijual memiliki **saklar berwarna HIJAU** (Tersedia).
4. Jika ada menu yang bahannya sedang kosong hari itu, klik saklarnya hingga berubah menjadi **ABU-ABU** (Habis).

### B. Saat Jam Jualan (Menerima Pesanan Pelanggan)
1. **Pelanggan tidak perlu daftar/login** untuk membeli. Mereka cukup memilih menu di website, memilih ukuran porsi (*Small*, *Medium* +Rp5.000, atau *Large* +Rp10.000), mengisi nama & alamat/nomor meja, lalu menekan tombol **Pesan via WhatsApp** atau **Pesan via Telegram**.
2. Pesanan pelanggan akan masuk ke **WhatsApp Toko (`0895-6349-49189`)** atau **Telegram (`@GurihGacorBot`)** dengan format rincian pesanan dan total harga yang sudah dihitung otomatis oleh sistem.
3. Balas chat pelanggan untuk konfirmasi pembayaran/pembuatan pesanan.
4. Di halaman Admin tab **"Log Pesanan & Webhook"**, ubah status pesanan sesuai progres dapur:
   - `Pending` (Baru masuk)
   - `Sedang Dimasak` (Sedang digoreng/disiapkan)
   - `Siap Diambil / Diantar` (Pesanan matang)
   - `Selesai` (Sudah diterima pelanggan)

### C. Saat Ada Menu yang Habis di Tengah Jam Jualan
- Jangan tunggu pelanggan kecewa! Begitu suatu menu habis di dapur, langsung buka tab **"Ketersediaan Stok"** di HP dan **geser saklar menu tersebut ke kiri (Abu-abu)**.
- Detik itu juga, tampilan di website pelanggan akan berubah menjadi **"Stok Habis"** dan tombol belinya otomatis terkunci.

---

## 3. Panduan Lengkap Fitur Dasbor Admin

Setelah berhasil login di `https://jamur-gurih-gacor.vercel.app/admin`, Anda akan melihat **4 Tab Menu Utama** di bagian atas halaman:

---

### 🟢 Tab 1: Ketersediaan Stok (Paling Sering Dipakai Karyawan)
Tab ini dirancang khusus agar karyawan bisa mengubah status stok dengan **1 kali sentuh** tanpa takut salah mengubah harga atau nama menu.

* **Saklar Hijau (Kanan):** Menu **Tersedia** dan bisa dipesan oleh pelanggan.
* **Saklar Abu-abu (Kiri):** Menu **Habis** dan tidak bisa diklik beli oleh pelanggan.
* Perubahan langsung tersimpan otomatis saat saklar diklik (tidak perlu tombol simpan).

---

### 🍄 Tab 2: Katalog & Harga (Tambah, Edit, & Hapus Menu)
Gunakan tab ini ketika **Owner** ingin menambahkan varian menu baru, mengubah harga jual, atau mengganti foto produk.

#### Cara Menambah Menu Baru:
1. Klik tombol oranye **"+ Tambah Menu Baru"** di pojok kanan atas.
2. Isi formulir yang muncul:
   - **Nama Produk \*:** Contoh: *Jamur Crispy Bumbu Balado Pedas*.
   - **Kategori:** Pilih kategori menu (misal: *Jamur Crispy*, *Snack & Gorengan*, *Minuman Segar*, atau *Paket Hemat*).
   - **Level Pedas:** Pilih tingkat kepedasan (`Tidak Pedas Level 0` s/d `Gacor Mampus Level 5`).
   - **Harga Jual (Rp) \*:** Masukkan angka saja tanpa titik/koma (contoh: `15000` untuk Rp 15.000).
   - **Harga Coret / Asli (Opsional):** Isi jika ingin menampilkan efek diskon harga coret (contoh: Harga Coret `20000`, Harga Jual `15000`). Kosongkan jika harga normal.
   - **Foto Produk \*:**
     1. Klik tombol oranye **`UPLOAD FOTO`**.
     2. Pilih foto makanan dari galeri HP atau komputer Anda.
     3. **Ketentuan Foto:** Maksimal ukuran foto adalah **2 MB** dengan format **JPG, PNG, atau WebP** (sesuai keterangan `Upload Max 2 MB (JPG, PNG, WebP)` di bawah tombol).
     4. *Catatan Pintar:* Website akan **otomatis mengompres foto Anda** menjadi sangat ringan (< 100 KB) di balik layar agar website tetap ngebut saat dibuka pelanggan!
   - **Deskripsi Menu:** Tulis penjelasan singkat rasa dan porsi menu agar pelanggan tertarik.
   - **Centang Pengaturan di Bawah:**
     - ☑️ **Tampilkan di "Paling Laris":** Centang jika menu ini adalah menu favorit/andalan agar mendapat label *Best Seller*.
     - ☑️ **Stok Tersedia:** Biarkan tercentang jika menu langsung siap dijual.
3. Klik tombol **"Simpan Menu Baru"**.

#### Cara Mengedit atau Menghapus Menu:
- Pada tabel daftar produk, klik **ikon Pensil (Edit)** di sebelah kanan menu untuk mengubah harga, foto, atau nama menu.
- Klik **ikon Tempat Sampah Merah (Hapus)** jika menu tersebut sudah tidak dijual lagi secara permanen.

---

### 🎉 Tab 3: Banner Promo (Mengatur Spanduk Diskon di Halaman Depan)
Tab ini berfungsi untuk mengatur spanduk pengumuman promo di bagian atas website pelanggan.

#### Cara Membuat Banner Promo Baru:
1. Buka tab **"Banner Promo"**, lalu klik tombol **"+ Tambah Banner"**.
2. Isi data promo:
   - **Judul Promo \*:** Contoh: *PROMO JUMAT BERKAH GACOR!*
   - **Sub-Judul / Keterangan:** Contoh: *Gratis Es Teh Manis setiap pembelian 2 porsi ukuran Large.*
   - **Badge Label:** Label kecil di pojok banner (Contoh: *PROMO SPESIAL* atau *TERBATAS*).
   - **Info Diskon:** Contoh: *HEMAT 25%*.
   - **Gambar Background Banner \*:** Klik tombol **`UPLOAD FOTO`** (`Upload Max 2 MB (JPG, PNG, WebP)`) untuk mengunggah gambar latar spanduk.
3. Klik **"Simpan Banner"**.

#### Cara Mematikan Sementara atau Menghapus Banner:
- Jika promo hanya berlaku di hari tertentu (misal khusus akhir pekan), Anda tidak perlu menghapusnya. Cukup klik tombol **"Aktif"** (Hijau) pada kartu banner hingga berubah menjadi **"Non-aktif"** (Abu-abu).
- Untuk menghapus banner selamanya, klik **ikon Tempat Sampah Merah** di pojok kanan bawah kartu banner.

---

### 📋 Tab 4: Log Pesanan & Webhook (Memantau Riwayat Transaksi)
Setiap kali pelanggan melakukan pemesanan dari website (baik melalui Keranjang Belanja maupun Pesan Cepat 1 Menu), data pesanan akan otomatis tercatat di tab ini.

* **No. Pesanan:** Kode unik pesanan pelanggan.
* **Pelanggan & Nomor WA:** Nama pembeli dan nomor HP-nya. **Tips:** Anda bisa langsung **mengklik nomor HP berwarna hijau** tersebut untuk membuka chat WhatsApp dengan pelanggan!
* **Tipe & Alamat:** Menampilkan apakah pesanan *Takeaway* (Bungkus), *Dine-in* (Makan di tempat + Nomor Meja), atau *Delivery* (Diantar + Alamat Lengkap).
* **Total:** Total tagihan yang sudah dihitung secara aman oleh sistem.
* **Ubah Status:** Gunakan pilihan di kolom paling kanan untuk memperbarui status (`Pending` → `Sedang Dimasak` → `Siap Diambil / Diantar` → `Selesai` / `Batal`).

---

### 🚨 Tombol Darurat (Statis) — Pojok Kanan Atas Dasbor
Di bagian kanan atas Dasbor Admin (di sebelah tombol *Tambah Menu Baru*), terdapat **"Tombol Darurat (Statis)"**.
- **Fungsinya:** Jika suatu saat warung sedang tutup total untuk renovasi/libur panjang atau sistem sedang dalam perawatan, Anda dapat menekan tombol ini agar halaman depan beralih ke mode informasi statis sederhana.
- **Untuk operasional harian normal:** Biarkan tombol ini dalam keadaan **Non-aktif** (warna abu-abu).

---

## 4. Keunggulan Sistem untuk Kenyamanan Pelanggan

Owner dan karyawan juga perlu mengetahui beberapa fitur pintar yang sudah terpasang di website pelanggan:

1. **Keranjang & Data Pembeli Tidak Akan Hilang:**
   Jika pelanggan sudah memilih banyak menu dan mengetik alamat panjang, lalu tidak sengaja menutup browser atau HP-nya mati, **data keranjang dan alamatnya tetap tersimpan otomatis**. Keranjang baru akan dikosongkan jika pelanggan sendiri yang menekan tombol *"Mulai Pesanan Baru"* atau *"Kosongkan"*.
2. **Dua Jalur Pemesanan (WhatsApp & Telegram):**
   Pelanggan bebas memilih memesan lewat **WhatsApp** maupun **Telegram Bot (`@GurihGacorBot`)**.
3. **Database Selalu Aktif 24 Jam:**
   Website sudah dilengkapi robot pengingat otomatis (*Cron Job*) setiap hari sehingga database toko tidak akan pernah mati/tertidur meskipun warung sedang libur beberapa hari.

---

## 5. Tanya Jawab & Solusi Kendala (FAQ)

**❓ 1. Saya gagal mengupload foto menu baru, muncul pesan error merah. Kenapa?**
> **Solusi:** Pastikan file yang dipilih adalah gambar (**JPG, PNG, atau WebP**) dan ukuran aslinya **tidak lebih dari 2 MB**. Jika foto diambil dari kamera HP dengan resolusi sangat besar (misal 8 MB), Anda bisa mengirim foto tersebut ke WhatsApp terlebih dahulu lalu mengunduhnya kembali (atau *screenshot*), kemudian upload ke website.

**❓ 2. Saat login ke `/admin`, muncul pesan *"Terlalu banyak percobaan login. Silakan tunggu 60 detik"*?**
> **Solusi:** Website dilengkapi pengaman anti-hacker. Jika seseorang salah mengetik password sebanyak **5 kali berturut-turut**, sistem akan mengunci login selama **1 menit**. Cukup tunggu 1 menit, pastikan email (`admin@gurihgacor.com`) dan password (`gacor123`) sudah benar (huruf kecil semua), lalu masuk kembali.

**❓ 3. Saya sudah mengubah harga atau stok di Admin, tapi di HP teman saya tampilannya belum berubah?**
> **Solusi:** Minta pelanggan atau teman Anda melakukan **Refresh / Muat Ulang halaman** (tarik layar browser ke bawah) untuk melihat perubahan terbaru.

**❓ 4. Bagaimana cara keluar (Logout) dari halaman Admin jika menggunakan HP bersama?**
> **Solusi:** Klik tombol **"Keluar"** di bagian pojok kanan atas layar Dasbor Admin setelah selesai bertugas.
