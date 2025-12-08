const { Presensi, User } = require("../models"); // Import User
const { Op } = require("sequelize");
// Pastikan date-fns-tz diimpor jika diperlukan untuk formatting waktu di sini. 
// Tapi untuk report ini, kita kirim data mentah dan biarkan frontend format.

exports.getDailyReport = async (req, res) => {
  try {
    // TanggalMulai dan TanggalSelesai dihilangkan sementara dari destructuring query, 
    // karena fokus kita ada di 'nama' dan 'buktiFoto'.
    const { nama, tanggalMulai, tanggalSelesai } = req.query; 
    
    const options = { 
        where: {},
        // Tambahkan JOIN (include) ke tabel User
        include: [{ 
            model: User, 
            as: 'user', 
            attributes: ['nama'] // Hanya ambil kolom nama dari User
        }],
        // Urutkan data berdasarkan checkIn terbaru
        order: [
            ['checkIn', 'DESC']
        ]
    };

    if (nama) {
        // Filter nama melalui kondisi di model User yang direlasikan
        options.include[0].where = { 
            nama: { [Op.like]: `%${nama}%` }
        };
    }
    
    // Menambahkan filter tanggal jika diperlukan (sesuai modul/tugas)
    if (tanggalMulai && tanggalSelesai) {
        options.where.checkIn = {
            [Op.between]: [tanggalMulai, tanggalSelesai],
        };
    }

    // Fetch data dengan relasi
    const records = await Presensi.findAll(options);
    
    // FIX KRITIS: Map the result to include the user's name and photo path directly 
    // (Ini yang membuat data tidak N/A di frontend)
    const formattedRecords = records.map(record => ({
        id: record.id,
        userId: record.userId,
        // Meratakan nama: diambil dari nested 'user'
        nama: record.user ? record.user.nama : 'User Dihapus', 
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        latitude: record.latitude, 
        longitude: record.longitude, 
        // Meratakan buktiFoto: diambil dari kolom root
        buktiFoto: record.buktiFoto, 
    }));

    res.json({
      reportDate: new Date().toLocaleDateString(),
      filter: { nama, tanggalMulai, tanggalSelesai },
      data: formattedRecords, // Mengirim data yang sudah diformat
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};