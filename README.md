## Tentang Apps ini 

App ini adalah chatbot yang di beri nama Chatbot AI. Nah app ini web based dan dapat berinteraksi dengan pengguna menggunakan teknologi AI dari Google yaitu Gemini 2 Flash. Untuk user interface app ini di develop untuk mobile.

## Fitur Utama

- UI chat yang bersih dan minimalis 
- Respons AI real-time menggunakan Gemini 2 Flash
- Menggunakan Figma MCP untuk design
- Fitur tambah file untuk mengirim dokumen atau gambar
- Dukungan bahasa Indonesia
- Dashboard menu sidebar dengan animasi slide dari kanan
- Reset chat functionality untuk memulai percakapan baru
- Recent chats yang tersimpan otomatis di localStorage
- RAG (Retrieval Augmented Generation) dengan system instruction untuk respons yang lebih humanis
- Icon SVG yang diambil langsung dari desain Figma

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

1. Klik tombol menu (ikon hamburger) di kiri atas untuk membuka dashboard sidebar
2. Klik tombol reset (ikon rotate-left) di kanan atas untuk mereset percakapan
3. Ketik pesan Anda di kotak input di bagian bawah
4. Klik tombol folder di kiri input untuk menambahkan file (opsional)
5. Klik tombol kirim di kanan input untuk mengirim pesan
6. Tunggu respons dari ChatBot AI yang akan muncul di layar
7. Recent chats akan otomatis tersimpan dan muncul di sidebar menu

## Fitur Tambah File

App ini mendukung pengiriman file melalui tombol folder di sebelah kiri kotak input. Setelah memilih file, nama dan ukuran file akan ditampilkan. File dapat dikirim bersama dengan pesan teks atau dikirim sendiri.

## Dashboard Menu

Dashboard menu dapat dibuka dengan mengklik tombol menu di kiri atas. Menu sidebar akan muncul dari kanan dengan animasi smooth. Menu ini berisi:

- **ChatBot** - Menu utama untuk kembali ke chat
- **Library** - Menu untuk melihat library
- **Recent Chats** - Daftar percakapan terbaru yang otomatis tersimpan
- **Search Bar** - Untuk mencari dalam menu
- **User Profile** - Informasi profil pengguna di bagian bawah

Recent chats akan otomatis tersimpan di localStorage dan muncul berdasarkan pesan yang dikirim oleh user.

## Reset Chat

Tombol reset chat di kanan atas memungkinkan pengguna untuk mereset percakapan saat ini. Akan muncul konfirmasi sebelum mereset untuk mencegah kehilangan data secara tidak sengaja.

## RAG Implementation

Aplikasi menggunakan RAG (Retrieval Augmented Generation) dengan system instruction yang membuat ChatBot AI:

- Merespons dengan cara yang lebih humanis dan natural
- Menyebutkan identitasnya sebagai ChatBot AI secara natural
- Tidak menggunakan em dash (—) dalam respons
- Tidak menggunakan format bold atau tanda bintang (*) untuk penekanan
- Menggunakan bahasa yang hangat, empati, dan mudah dihubungi
- Respons di-post-process untuk memastikan tidak ada karakter yang tidak diizinkan

## Icon Design

Semua icon dalam aplikasi diambil langsung dari desain Figma dan disimpan sebagai file SVG di folder `public/icons/`:

- `menu.svg` - Icon menu/dashboard
- `rotate-left.svg` - Icon reset chat
- `send.svg` - Icon tombol kirim
- `folder.svg` - Icon tombol tambah file
- `search.svg` - Icon search bar di sidebar

## Struktur Project

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API route untuk integrasi Gemini dengan RAG
│   ├── globals.css         # Style global
│   ├── layout.tsx          # Layout utama dengan favicon
│   └── page.tsx            # Halaman chat utama dengan dashboard dan reset
├── components/
│   ├── icons/              # Icon components (legacy, sekarang menggunakan SVG)
│   │   ├── SendIcon.tsx
│   │   ├── FolderIcon.tsx
│   │   ├── MenuIcon.tsx
│   │   └── RotateLeftIcon.tsx
│   ├── ChatMessage.tsx     # Komponen bubble pesan
│   ├── ChatInput.tsx       # Komponen input dan tombol
│   └── Sidebar.tsx         # Komponen sidebar dashboard menu
├── public/
│   ├── icons/              # Icon SVG dari Figma
│   │   ├── menu.svg
│   │   ├── rotate-left.svg
│   │   ├── send.svg
│   │   ├── folder.svg
│   │   └── search.svg
│   └── favicon.svg        # Favicon aplikasi
└── package.json
```

## Catatan (baca yah)

Pastikan kamu memiliki API key dari Google Gemini untuk menggunakan aplikasi ini. API key harus dikonfigurasi di file `.env.local` dengan nama variable `GEMINI_API_KEY`. File `.env.local` tidak akan di-commit ke repository untuk keamanan.
