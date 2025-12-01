const { Presensi, User } = require("../models"); // <-- Import User
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    const options = { 
        where: {},
        // Tambahkan JOIN (include) ke tabel User
        include: [{ 
            model: User, 
            as: 'user', 
            attributes: ['nama'] // Hanya ambil kolom nama dari User
        }]
    };

    if (nama) {
        // Filter nama melalui kondisi di model User yang direlasikan
        options.include[0].where = { 
            nama: { [Op.like]: `%${nama}%` }
        };
    }

    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [tanggalMulai, tanggalSelesai],
      };
    }
    
    // Fetch data with relations
    const records = await Presensi.findAll(options);
    
    // Map the result to include the user's name directly in the report structure
    const formattedRecords = records.map(record => ({
        id: record.id,
        userId: record.userId,
        nama: record.user.nama, // <-- Ambil nama dari relasi User
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        latitude: record.latitude, 
        longitude: record.longitude, 
    }));

    res.json({
      reportDate: new Date().toLocaleDateString(),
      filter: { nama, tanggalMulai, tanggalSelesai },
      data: formattedRecords, // Gunakan data yang telah diformat
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};