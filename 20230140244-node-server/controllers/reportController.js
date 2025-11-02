const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    let options = { where: {} };

    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    if (tanggalMulai && tanggalSelesai) {
      options.where.tanggal = {
        [Op.between]: [tanggalMulai, tanggalSelesai],
      };
    } else if (tanggalMulai) {
      options.where.tanggal = {
        [Op.gte]: tanggalMulai,
      };
    } else if (tanggalSelesai) {
      options.where.tanggal = {
        [Op.lte]: tanggalSelesai,
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      filter: {
        nama: nama || null,
        tanggalMulai: tanggalMulai || null,
        tanggalSelesai: tanggalSelesai || null,
      },
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
