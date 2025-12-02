## Tentang Apps ini 

App ini adalah chatbot yang di beri nama Chatbot AI. Nah app ini web based dan dapat berinteraksi dengan pengguna menggunakan teknologi AI dari Google yaitu Gemini 2 Flash. Untuk user interface app ini di develop untuk mobile.

## Fitur Utama

- UI chat yang bersih dan minimalis 
- Respons AI real-time menggunakan Gemini 2 Flash
- Menggunakan Figma MCP untuk design
- Fitur tambah file untuk mengirim dokumen atau gambar
- Dukungan bahasa Indonesia
- Dashboard menu sidebar dengan animasi slide dari kanan
- **Sistem chat berbasis topik** - Chat dikelompokkan per topik, bukan per message
- **New Chat** - Tombol untuk membuat topik chat baru sambil menyimpan topik sebelumnya
- **Search Recent Chats** - Fitur pencarian untuk mencari topik di Recent Chats
- **Delete Topic** - Tombol delete (tong sampah) pada setiap topik yang muncul saat hover
- Reset chat functionality untuk mereset percakapan dalam topik saat ini
- Recent chats yang tersimpan otomatis di localStorage (maksimal 20 topik)
- RAG (Retrieval Augmented Generation) dengan system instruction untuk respons yang lebih humanis

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
2. Klik tombol reset (ikon rotate-left) di kanan atas untuk mereset percakapan dalam topik saat ini
3. Ketik pesan Anda di kotak input di bagian bawah
4. Klik tombol folder di kiri input untuk menambahkan file (opsional)
5. Klik tombol kirim di kanan input untuk mengirim pesan
6. Tunggu respons dari ChatBot AI yang akan muncul di layar
7. Topik chat akan otomatis tersimpan dan muncul di sidebar menu

### Membuat Topik Chat Baru

- Klik tombol **"New Chat"** di sidebar untuk membuat topik chat baru
- Topik sebelumnya akan otomatis tersimpan dengan judul dari pesan pertama
- Chat area akan dikosongkan untuk memulai percakapan baru

### Mengelola Topik Chat

- **Membuka topik**: Klik pada topik di daftar Recent Chats untuk memuat kembali percakapan
- **Mencari topik**: Gunakan search bar di sidebar untuk mencari topik berdasarkan judul
- **Menghapus topik**: Arahkan kursor ke topik di Recent Chats, lalu klik tombol tong sampah yang muncul di kanan

## Fitur Tambah File

App ini mendukung pengiriman file melalui tombol folder di sebelah kiri kotak input. Setelah memilih file, nama dan ukuran file akan ditampilkan. File dapat dikirim bersama dengan pesan teks atau dikirim sendiri.

## Dashboard Menu

Dashboard menu dapat dibuka dengan mengklik tombol menu di kiri atas. Menu sidebar akan muncul dari kanan dengan animasi smooth. Menu ini berisi:

- **ChatBot** - Menu utama untuk kembali ke chat
- **Library** - Menu untuk melihat library
- **New Chat** - Tombol untuk membuat topik chat baru
- **Search Bar** - Untuk mencari topik di Recent Chats (fungsional dengan filter real-time)
- **Recent Chats** - Daftar topik chat terbaru yang otomatis tersimpan (maksimal 20 topik)
- **User Profile** - Informasi profil pengguna di bagian bawah

### Fitur Recent Chats

- **Penyimpanan per topik**: Setiap topik menyimpan semua pesan dalam percakapan tersebut
- **Judul otomatis**: Judul topik diambil dari pesan pertama user (maksimal 50 karakter)
- **Search functionality**: Gunakan search bar untuk mencari topik berdasarkan judul (case-insensitive)
- **Delete topic**: Hover pada topik untuk melihat tombol delete (tong sampah) di kanan
- **Auto-save**: Topik otomatis tersimpan saat user mengirim pesan
- **Penyimpanan lokal**: Semua topik disimpan di localStorage dengan key `chatTopics`

## Sistem Chat Berbasis Topik

Aplikasi menggunakan sistem chat berbasis topik di mana setiap percakapan dikelompokkan dalam topik terpisah:

- **Struktur Topik**: Setiap topik memiliki ID unik, judul (dari pesan pertama), array pesan, dan timestamp
- **Penyimpanan**: Maksimal 20 topik terbaru disimpan di localStorage
- **Auto-save**: Topik otomatis tersimpan saat user mengirim pesan pertama atau mengupdate percakapan
- **Switching Topik**: User dapat beralih antar topik dengan mengklik topik di Recent Chats
- **Isolasi Data**: Setiap topik memiliki history chat sendiri yang terpisah

### Manfaat Sistem Topik

- Organisasi chat yang lebih baik
- Kemudahan mengelola multiple percakapan
- History chat yang terstruktur
- Kemudahan mencari topik tertentu

## Reset Chat

Tombol reset chat di kanan atas memungkinkan pengguna untuk mereset percakapan dalam topik saat ini. Akan muncul konfirmasi sebelum mereset untuk mencegah kehilangan data secara tidak sengaja. Topik tetap tersimpan di Recent Chats meskipun percakapan di-reset.

**Catatan**: Reset chat hanya mengosongkan percakapan dalam topik saat ini, bukan menghapus topik dari Recent Chats.

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
│   └── page.tsx            # Halaman chat utama dengan sistem topik, dashboard dan reset
├── components/
│   ├── icons/              # Icon components (legacy, sekarang menggunakan SVG)
│   │   ├── SendIcon.tsx
│   │   ├── FolderIcon.tsx
│   │   ├── MenuIcon.tsx
│   │   └── RotateLeftIcon.tsx
│   ├── ChatMessage.tsx     # Komponen bubble pesan
│   ├── ChatInput.tsx       # Komponen input dan tombol
│   └── Sidebar.tsx         # Komponen sidebar dashboard menu dengan search dan delete topic
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
