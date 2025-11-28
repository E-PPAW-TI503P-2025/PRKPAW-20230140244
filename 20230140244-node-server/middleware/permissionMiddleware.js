const jwt = require("jsonwebtoken");
// Pastikan JWT_SECRET sesuai dengan yang ada di authController.js
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN'; 

// Middleware otentikasi: Memverifikasi JWT dari header Authorization
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 401 Unauthorized jika token tidak ada atau format salah
    return res.status(401).json({ message: 'Akses ditolak: Token tidak ditemukan atau format tidak valid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Data user dari JWT (id, nama, role) akan tersedia di req.user
    req.user = decoded; 
    console.log(`Middleware: Token berhasil diverifikasi untuk user ${req.user.nama} (${req.user.role}).`);
    next();
  } catch (err) {
    // 401 Unauthorized jika token tidak valid/kadaluarsa
    return res.status(401).json({ message: 'Akses ditolak: Token tidak valid atau kadaluarsa' });
  }
};


// Middleware otorisasi: Memeriksa apakah pengguna adalah admin
exports.isAdmin = (req, res, next) => {
  // Memeriksa req.user yang sudah diisi oleh verifyToken
  if (req.user && req.user.role === 'admin') {
    console.log('Middleware: Izin admin diberikan.');
    next(); 
  } else {
    // 403 Forbidden
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin'});
  }
};

// Catatan: exports.addUserData yang lama telah dihapus/diganti