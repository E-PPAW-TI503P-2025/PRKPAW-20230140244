const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    const options = { where: {} };

    if (nama) {
      options.where.nama = { [Op.like]: `%${nama}%` };
    }

    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [tanggalMulai, tanggalSelesai],
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      filter: { nama, tanggalMulai, tanggalSelesai },
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
