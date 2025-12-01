 	// 1. Ganti sumber data dari array ke model Sequelize
const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require("express-validator");
const timeZone = "Asia/Jakarta";
 	
exports.CheckIn = async (req, res) => {
  // 2. Gunakan try...catch untuk error handling
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body; // <-- Ambil data lokasi baru
    const waktuSekarang = new Date();

    // 3. Ubah cara mencari data menggunakan 'findOne' dari Sequelize
    // Mencari record yang belum check-out untuk user yang sama
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // 4. Ubah cara membuat data baru menggunakan 'create' dari Sequelize
    const newRecord = await Presensi.create({
      userId: userId,
      // Kolom 'nama' tidak lagi disimpan di tabel Presensi (diambil dari relasi User)
      checkIn: waktuSekarang,
      latitude: latitude, // <-- Simpan data lokasi
      longitude: longitude, // <-- Simpan data lokasi
    });
    
    // Format data untuk respons
    const formattedData = {
        id: newRecord.id,
        userId: newRecord.userId,
        // Nama bisa diambil dari req.user karena tidak ada di newRecord
        nama: userName, 
        checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: null,
        latitude: newRecord.latitude, // Sertakan lokasi
        longitude: newRecord.longitude, // Sertakan lokasi
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
 	
exports.CheckOut = async (req, res) => {
  // Gunakan try...catch
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari data di database yang belum check-out
    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    // 5. Update dan simpan perubahan ke database
    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        nama: userName,
        checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        latitude: recordToUpdate.latitude, // Sertakan lokasi
        longitude: recordToUpdate.longitude, // Sertakan lokasi
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};


exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;

    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await recordToDelete.destroy();

    res.status(200).json({
      message: "Catatan presensi berhasil dihapus.",
      deletedRecord: {
        id: presensiId,
        // Nama tidak tersedia di record lagi, tetapi bisa diabaikan dalam respons delete
        checkIn: recordToDelete.checkIn,
        checkOut: recordToDelete.checkOut,
        latitude: recordToDelete.latitude,
        longitude: recordToDelete.longitude,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};


exports.updatePresensi = async (req, res) => {
  try {
    // Cek hasil validasi dari express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const presensiId = req.params.id;
    // Tambahkan latitude dan longitude ke destructuring
    const { checkIn, checkOut, nama, latitude, longitude } = req.body; 

    // Perbarui validasi untuk memastikan setidaknya satu field yang valid dikirim (termasuk lat/lng)
    if (checkIn === undefined && checkOut === undefined && nama === undefined && latitude === undefined && longitude === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, latitude, atau longitude).",
      });
    }

    // Cari record berdasarkan ID
    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Update nilai yang dikirim
    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    // recordToUpdate.nama = nama || recordToUpdate.nama; // Baris ini HARUS DIHAPUS karena kolom 'nama' sudah dihapus.
    recordToUpdate.latitude = latitude || recordToUpdate.latitude; // Tambah
    recordToUpdate.longitude = longitude || recordToUpdate.longitude; // Tambah
    
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};