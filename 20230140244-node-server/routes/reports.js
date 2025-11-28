const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
// Import middleware yang baru
const { verifyToken, isAdmin } = require('../middleware/permissionMiddleware');

// Perbarui rute untuk menggunakan verifyToken untuk otentikasi, 
// kemudian cek apakah user adalah admin menggunakan isAdmin.
router.get('/daily', [verifyToken, isAdmin], reportController.getDailyReport);

module.exports = router;