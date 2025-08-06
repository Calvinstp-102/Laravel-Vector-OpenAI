# 🤖 Laravel + OpenAI Integration

Proyek ini adalah integrasi Laravel + Vue.js (Vite) dengan berbagai fitur dari **OpenAI API**, termasuk:

- **Assistants API**: untuk membangun asisten AI yang dapat berdialog dan menggunakan tools seperti file retrieval.
- **Vector Store API**: untuk menyimpan dan mencari vektor embedding dari teks atau dokumen.
- **Files API**: untuk mengunggah file yang digunakan oleh Assistant.
- **Embeddings API**: untuk menghasilkan representasi vektor dari teks.

Proyek ini cocok digunakan untuk membangun chatbot, sistem tanya jawab dokumen, pencarian semantik, atau asisten cerdas internal.

---

## ⚙️ Teknologi yang Digunakan

- Laravel (PHP)
- Vue.js 3 (dengan Vite)
- Bootstrap 5
- MySQL
- OpenAI API

---

## 🚀 Cara Menjalankan Proyek

### 1. Clone repository ini:

```bash
git clone https://github.com/Calvinstp-102/Laravel-Vector-OpenAI.git
cd Laravel-Vector-OpenAI
````

### 2. Install dependencies:

```bash
composer install
npm install
```

### 3. Salin dan konfigurasi file `.env`:

```bash
cp .env.example .env
```

Lalu edit file `.env` dan isi variabel berikut:

```env
OPENAI_API_KEY=your_openai_api_key
```

Serta sesuaikan konfigurasi database MySQL Anda di bagian:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=username
DB_PASSWORD=password
```

### 4. Generate application key:

```bash
php artisan key:generate
```

### 5. Jalankan server lokal:

```bash
php artisan serve
npm run dev
```

Aplikasi akan tersedia di `http://localhost:8000`

---

## 📌 Catatan

* Pastikan Anda memiliki akun OpenAI dan API key yang aktif.
* Folder `vendor/`, `.env`, dan `node_modules/` tidak termasuk dalam repository (sesuai .gitignore).
* Proyek ini tidak menggunakan Tailwind, hanya Bootstrap.

---

## 📝 Lisensi

MIT License © 2025
Anda bebas menggunakan, memodifikasi, dan menyebarkan proyek ini dengan atribusi yang sesuai.

```

---

Kalau Anda ingin versi markdown ini saya simpankan sebagai file `README.md` siap upload ke GitHub, tinggal bilang saja — saya bisa bantu kirimkan file-nya juga.
```
