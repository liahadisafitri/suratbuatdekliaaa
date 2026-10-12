# 💗 Website "Do You Love Me?" untuk Dek Lia

Website romantis dengan HTML, CSS, dan JavaScript murni. Tanpa backend, tanpa login, tanpa framework.

## Isi folder

```
index.html   → struktur halaman
style.css    → desain & animasi
script.js    → interaksi (tombol kabur, amplop, surat, musik)
README.md    → panduan ini
```

## Musik: "Semenjak Ada Dirimu" (Yovie Widianto & HIVI!)

Lagunya langsung diputar dari video resmi di YouTube (Official Lyric Video), jadi tidak perlu file MP3.

- Musik tidak berputar otomatis saat halaman dibuka.
- Tombol ▶ / ⏸ di bagian atas memutar dan menjeda lagu.
- Saat Dek Lia menekan **"Sayang Bangettt!"**, lagu ikut mulai dengan volume naik pelan.
- Tombol 🎬 menampilkan / menyembunyikan videonya.

Penting:
- Lagu YouTube **hanya jalan lewat link website** (misalnya GitHub Pages atau server lokal), tidak jalan kalau `index.html` dibuka langsung dari folder komputer. YouTube menolak pemutaran dari file lokal.
- Perlu koneksi internet.
- Cadangan: kalau kamu punya file MP3 sendiri, beri nama `semenjak-ada-dirimu.mp3` dan taruh di folder yang sama. File ini dipakai otomatis kalau YouTube gagal dimuat.

## Animasi yang tenang

Gerakan dibuat lembut supaya tulisan mudah dibaca:
- Latar (gradasi, bintang, hati kecil) bergerak sangat pelan, samar, dan selalu di belakang teks.
- Teks diam dan tidak bergoyang. Judul hanya muncul halus satu kali.
- Efek confetti hanya muncul di momen khusus (jawaban "Sayang" dan menutup surat), tidak saat surat dibaca.
- Surat berkertas polos dengan teks gelap dan ukuran huruf nyaman. Tombol "Tampilkan semua" tersedia kalau ingin langsung membaca.
- Mengikuti pengaturan "kurangi gerakan" di perangkat. Responsif untuk HP (portrait & landscape), tablet, dan desktop.

## Mengubah isi

- Teks pembuka ada di `index.html`.
- Isi surat ada di `script.js`, pada array `letter`.
- Warna ada di bagian `:root` di `style.css`.

## Publikasi lewat GitHub Pages

1. Buat akun di [github.com](https://github.com) kalau belum punya.
2. Klik **New repository**, beri nama misalnya `buat-dek-lia`, pilih **Public**, lalu **Create repository**.
3. Klik **uploading an existing file**, tarik semua file, lalu **Commit changes**.
4. Buka **Settings → Pages**.
5. Di **Build and deployment**, pilih **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, lalu **Save**.
6. Tunggu 1–3 menit. Link-nya muncul di halaman yang sama:
   `https://USERNAME-GITHUB.github.io/buat-dek-lia/`
7. Kirim link itu ke Dek Lia. 💌

Dibuat dengan sayang oleh Mamas ❤️
