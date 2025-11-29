## Tentang This Apps

App ini adalah chatbot yang dapat berinteraksi dengan pengguna menggunakan teknologi kecerdasan buatan dari Google Gemini 2 Flash. Aplikasi dirancang dengan antarmuka yang bersih dan mudah digunakan, khusus untuk perangkat mobile.

## Fitur Utama

- UI chat yang bersih dan minimalis
- Respons AI real-time menggunakan Gemini 2 Flash
- Menggunakan Figma MCP untuk design
- Fitur tambah file untuk mengirim dokumen atau gambar
- Dukungan bahasa Indonesia

## Cara untuk run

1. Install next js karena diperlukan:
```bash
npm install
```

2. Buat file `.env.local` di root project dan isi dengan API key Gemini:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Jalankan server:
```bash
npm run dev
```

4. Buka browser dan akses [http://localhost:3000](http://localhost:3000)

## Teknologi yang Digunakan

- **Next.js 14** - Framework React untuk membangun aplikasi web
- **TypeScript** - Bahasa pemrograman untuk keamanan tipe data
- **Tailwind CSS** - Framework CSS untuk styling
- **Google Gemini 2 Flash** - Model AI untuk memproses dan merespons percakapan
- **@google/genai** - Library untuk mengintegrasikan Gemini AI

## Cara Menggunakan

1. Ketik pesan Anda di kotak input di bagian bawah
2. Klik tombol folder di kiri untuk menambahkan file (opsional)
3. Klik tombol kirim di kanan untuk mengirim pesan
4. Tunggu respons dari AI yang akan muncul di layar

## Fitur Tambah File

App ini mendukung pengiriman file melalui tombol folder di sebelah kiri kotak input. Setelah memilih file, nama dan ukuran file akan ditampilkan. File dapat dikirim bersama dengan pesan teks atau dikirim sendiri.

## Struktur Project

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API route untuk integrasi Gemini
│   ├── globals.css         # Style global
│   ├── layout.tsx          # Layout utama
│   └── page.tsx            # Halaman chat utama
├── components/
│   ├── icons/
│   │   ├── SendIcon.tsx    # Icon tombol kirim
│   │   └── FolderIcon.tsx  # Icon tombol tambah file
│   ├── ChatMessage.tsx     # Komponen bubble pesan
│   └── ChatInput.tsx       # Komponen input dan tombol
└── package.json
```

## Catatan (baca yah)

Pastikan kamu memiliki API key dari Google Gemini untuk menggunakan aplikasi ini. API key harus dikonfigurasi di file `.env.local` dengan nama variable `GEMINI_API_KEY`. File `.env.local` tidak akan di-commit ke repository untuk keamanan.