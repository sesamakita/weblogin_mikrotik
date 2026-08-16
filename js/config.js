/**
 * KONFIGURASI WEB LOGIN HOTSPOT MIKROTIK
 * Silakan sesuaikan data bisnis, nomor WhatsApp, daftar paket, dan outlet di bawah ini.
 */
const HOTSPOT_CONFIG = {
  // Informasi Brand & Bisnis
  brand: {
    name: "NETSPEED HOTSPOT 🇮🇩",
    tagline: "Edisi Spesial HUT RI Ke-81",
    logoText: "NetSpeed",
    csWhatsApp: "6281234567890", // Ganti dengan nomor WhatsApp Admin (awali dengan 62)
    csTelegram: "admin_netspeed", // Username Telegram (opsional)
    runningText: "🇮🇩 Dirgahayu Republik Indonesia! Nikmati Promo Merdeka Super Cepat & Kuota Unlimited Sepuasnya! 🇮🇩"
  },

  // Daftar Paket Internet Hotspot
  packages: [
    {
      id: "pkt_1",
      name: "Paket Merdeka 2 Jam",
      duration: "2 Jam",
      speed: "Up to 5 Mbps",
      quota: "Unlimited FUP",
      price: 2000,
      popular: false,
      badge: "Hemat"
    },
    {
      id: "pkt_2",
      name: "Paket Pejuang 6 Jam",
      duration: "6 Jam",
      speed: "Up to 8 Mbps",
      quota: "Unlimited FUP",
      price: 4000,
      popular: false,
      badge: "Favorit"
    },
    {
      id: "pkt_3",
      name: "Paket Merdeka 24 Jam",
      duration: "24 Jam",
      speed: "Up to 17 Mbps",
      quota: "Full Unlimited Nonstop",
      price: 8000,
      popular: true,
      badge: "🇮🇩 Promo Merdeka"
    },
    {
      id: "pkt_4",
      name: "Paket Nusantara 7 Hari",
      duration: "7 Hari",
      speed: "Up to 20 Mbps",
      quota: "Full Unlimited",
      price: 30000,
      popular: false,
      badge: "Best Value"
    },
    {
      id: "pkt_5",
      name: "Paket Garuda 30 Hari",
      duration: "30 Hari",
      speed: "Up to 45 Mbps",
      quota: "Full Unlimited VIP",
      price: 85000,
      popular: false,
      badge: "VIP Member"
    }
  ],

  // Daftar Agen / Outlet Penjual Voucher Terdekat
  outlets: [
    {
      name: "Warung Berkah Bu Siti",
      address: "Jl. Mawar No. 12 (Depan Lapangan)",
      hours: "07:00 - 22:00 WIB",
      status: "Buka"
    },
    {
      name: "Konter Pulsa & Cell 88",
      address: "Pertigaan Gang Melati No. 05",
      hours: "08:00 - 23:00 WIB",
      status: "Buka"
    },
    {
      name: "Warkop Mas Bro",
      address: "Samping Masjid Al-Hidayah",
      hours: "24 Jam",
      status: "Buka 24 Jam"
    },
    {
      name: "Toko Sembako Barokah",
      address: "Jl. Raya Pos RT 02 / RW 04",
      hours: "06:30 - 21:00 WIB",
      status: "Buka"
    }
  ],

  // Bantuan / FAQ (Pertanyaan yang Sering Diajukan)
  faqs: [
    {
      q: "Bagaimana cara login menggunakan Voucher?",
      a: "Pilih tab 'Login', masukkan Kode Voucher yang tertera pada struk ke kolom Kode Voucher, lalu klik tombol 'Masuk / Login'."
    },
    {
      q: "Apa perbedaan Mode Voucher dan Mode Member?",
      a: "Mode Voucher menggunakan 1 kode unik (Username = Password). Sedangkan Mode Member untuk pelanggan langganan bulanan dengan username dan password terpisah."
    },
    {
      q: "Bagaimana jika voucher tidak bisa digunakan / error?",
      a: "Pastikan kode huruf besar/kecil dan angka sudah sesuai. Jika muncul pesan 'user not found' atau 'already logged in', silakan hubungi CS melalui tombol WhatsApp."
    },
    {
      q: "Apakah voucher bisa dipindah ke HP lain?",
      a: "Tergantung pengaturan jaringan. Jika fitur lock MAC aktif, voucher hanya bisa dipakai di HP pertama yang login hingga masa aktifnya habis."
    }
  ]
};
