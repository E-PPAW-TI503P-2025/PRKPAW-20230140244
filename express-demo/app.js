// =========================
// app.js - Server utama
// =========================

// Import modul Express
const express = require('express');

// import cors atau
// Mengimpor modul untuk mengizinkan akses API dari domain berbeda
const cors = require('cors');

// Buat instance aplikasi Express
const app = express();

// Tentukan port
const PORT = 3000;

// ====================
// Middleware Section
// ====================

// =========================
// Middleware global
// =========================

// Mengizinkan akses dari domain lain
// Mengaktifkan CORS untuk semua route (frontend manapun bisa mengakses API ini)
app.use(cors());

// Memungkinkan Express membaca body JSON dari request
// Middleware agar Express bisa membaca req.body dalam format JSON
app.use(express.json());

// =========================
// Middleware custom untuk logging
// =========================

// Custom middleware untuk loggin request, menampilkan timestamp, method, dan URL
app.use((req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}`;
    console.log(log);
    next(); // lanjut ke middleware/route berikutnya atau menandakan middleware selesai dan lanjut ke langkah berikutnya
});

// ====================
// ROUTER BAGIAN BUKU
// ====================

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes); 

// ====================
// Routing Section
// ====================

// Route utama (GET /)
app.get('/', (req, res) => {
  res.send('Welcome to Library Books API');
});

// Route kedua (GET /api/data)
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is JSON data from Express' });
});

// =========================
// Middleware 404 (Not Found)
// =========================

app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint Not Found' });
});

// =========================
// Global Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ====================
// Jalankan server
// ====================

// Jalankan server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});

// Bisa ganti port seperti 3001 agar tidak bentrok dengan sebelumnya.
// Port 3000 biasanya sudah digunakan server Express lain (misalnya proyek sebelumnya).
// Dengan PORT = 3001, kamu bisa menjalankan dua server sekaligus — 
// satu untuk percobaan Express dasar, dan satu untuk versi dengan middleware.