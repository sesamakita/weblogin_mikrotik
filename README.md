# 🚀 Modern Mobile-App MikroTik Hotspot Login Template

Template halaman login Hotspot MikroTik (**Captive Portal**) bergaya antarmuka **Aplikasi Mobile (App-Like UI)** dengan **Bottom Navigation Bar**. Sangat ringan (< 50 KB), responsif, dan 100% *Offline-First* (tanpa dependensi CDN online atau internet luar).

---

## 📁 Struktur Direktori & File

```text
weblogin_mikrotik/
├── login.html           # Halaman utama login + Bottom Nav (Voucher, Member, Paket, Agen, FAQ)
├── status.html          # Dashboard status koneksi aktif (sisa waktu, kuota, uptime, logout)
├── logout.html          # Halaman konfirmasi setelah logout beserta rangkuman pemakaian
├── alogin.html          # Halaman pengalihan otomatis sukses login
├── rlogin.html          # Fallback pengalihan
├── error.html           # Halaman pesan error
├── md5.js               # Enkripsi otentikasi CHAP RouterOS
├── css/
│   └── style.css        # Desain antarmuka Mobile App modern, glassmorphism, responsive
├── js/
│   ├── config.js        # File konfigurasi utama (Nama Usaha, No WA, Daftar Paket, Outlet, FAQ)
│   └── app.js           # Logika pergantian tab, switch voucher/member, & WhatsApp link
└── README.md            # Petunjuk penggunaan & instalasi ke MikroTik
```

---

## ⚙️ Cara Kustomisasi Data & Harga (Mudah)

Cukup buka dan ubah file **`js/config.js`** menggunakan teks editor (VS Code, Notepad, dll.):

1. **Ubah Nama Brand & WhatsApp Admin**:
   ```javascript
   brand: {
     name: "NAMA HOTSPOT ANDA",
     tagline: "Internet Cepat & Murah",
     csWhatsApp: "6281234567890", // Ganti dengan nomor WA Anda (awali dengan 62)
     runningText: "⚡ Promo: Beli Paket 24 Jam Gratis 2 Jam! Hubungi Admin jika ada kendala."
   }
   ```

2. **Ubah / Tambah Daftar Paket Internet**:
   ```javascript
   packages: [
     {
       name: "Paket 2 Jam",
       duration: "2 Jam",
       speed: "Up to 5 Mbps",
       quota: "Unlimited FUP",
       price: 2000,
       popular: false,
       badge: "Hemat"
     },
     ...
   ]
   ```

3. **Ubah Daftar Agen / Outlet Voucher**:
   ```javascript
   outlets: [
     {
       name: "Warung Berkah",
       address: "Jl. Mawar No. 12",
       hours: "07:00 - 22:00 WIB",
       status: "Buka"
     }
   ]
   ```

---

## 📡 Cara Upload & Pasang ke Router MikroTik

### Opsi 1: Menggunakan Winbox (Paling Mudah)
1. Buka aplikasi **Winbox** dan login ke router MikroTik Anda.
2. Buka menu **Files**.
3. *Drag & drop* (tarik) seluruh isi folder template ini ke dalam folder hotspot di MikroTik (misal folder `hotspot` atau buat folder baru `hotspot-app`).
4. Buka menu **IP** > **Hotspot** > tab **Server Profiles**.
5. Klik 2x profil hotspot yang aktif (misal `hsprof1`), lalu pada bagian **HTML Directory**, pilih folder yang baru Anda upload tadi.
6. Klik **Apply** & **OK**.

### Opsi 2: Menggunakan FTP
1. Sambungkan FTP client (seperti FileZilla atau Windows Explorer) ke IP MikroTik (contoh: `ftp://192.168.88.1`).
2. Masukkan user & password admin MikroTik.
3. Upload semua file template ke direktori target di router.

---

## 🧪 Cara Pengujian Lokal (Tanpa MikroTik)
Anda bisa langsung klik ganda file **`login.html`** di komputer Anda untuk melihat tampilannya di peramban web (Chrome / Edge / Firefox). Gunakan mode *Device Toolbar* (`F12` > ikon ponsel) untuk melihat simulasi tampilan di berbagai layar smartphone.
