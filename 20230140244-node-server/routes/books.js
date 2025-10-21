// =========================
// routes/books.js - Router Buku
// =========================

// Import express dan buat router
const express = require('express');
const router = express.Router();

// Data dummy buku
// Simulasi database sementara (Array)
let books = [
  { id: 1, title: 'Buku 1', author: 'author 1' },
  { id: 2, title: 'Buku 2', author: 'author 2' }
];

// ====================
// ROUTING BAGIAN BUKU
// ====================

// =========================
// READ (GET) /api/books - Ambil semua buku
// =========================

router.get('/', (req, res) => {
  res.json(books);
});

// =========================
// READ (GET by ID) /api/books/:id - Ambil buku berdasarkan ID
// =========================

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

// POST /api/books → tambah buku baru
router.post('/', (req, res) => {
  const { title, author } = req.body;

  // Validasi input
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  // Buat objek buku baru
  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author
  };

  books.push(newBook);
  res.status(201).json({
    message: 'Book created successfully',
    data: newBook
  });
});

// =========================
// UPDATE (PUT) /api/books/:id - Ubah buku berdasarkan ID
// =========================

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author } = req.body;
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  // Update data buku
  book.title = title;
  book.author = author;

  res.json({
    message: 'Book updated successfully',
    data: book
  });
});

// =========================
// DELETE (DELETE) /api/books/:id - Hapus buku berdasarkan ID
// =========================

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const deletedBook = books.splice(bookIndex, 1);
  res.json({
    message: 'Book deleted successfully',
    data: deletedBook[0]
  });
});

// Export router agar bisa dipakai di file lain
module.exports = router;