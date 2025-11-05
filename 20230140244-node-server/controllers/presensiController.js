'use strict';
const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require("express-validator");
const timeZone = "Asia/Jakarta";

function getUserNameFromRecord(record, req) {
  const userObj = record && (record.User || record.user);
  return (userObj && userObj.nama) || (req.user && req.user.nama) || 'User';
}

exports.CheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const waktuSekarang = new Date();

    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId,
      checkIn: waktuSekarang,
    });

    // ambil relasi User untuk nama
    const recordWithUser = await Presensi.findByPk(newRecord.id, {
      include: [{ model: User, attributes: ['nama'] }]
    });

    const userName = getUserNameFromRecord(recordWithUser, req);

    const formattedData = {
      id: recordWithUser.id,
      userId: recordWithUser.userId,
      checkIn: format(recordWithUser.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
      userName,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId, checkOut: null },
      include: [{ model: User, attributes: ['nama'] }]
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const userName = getUserNameFromRecord(recordToUpdate, req);

    const formattedData = {
      id: recordToUpdate.id,
      userId: recordToUpdate.userId,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      userName,
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const userId = req.user.id;
    const presensiId = req.params.id;

    const recordToDelete = await Presensi.findByPk(presensiId, {
      include: [{ model: User, attributes: ['nama'] }]
    });

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (recordToDelete.userId !== userId) {
      return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    const userName = getUserNameFromRecord(recordToDelete, req);

    await recordToDelete.destroy();

    res.status(200).json({
      message: "Catatan presensi berhasil dihapus.",
      deletedRecord: {
        id: presensiId,
        userId: recordToDelete.userId,
        checkIn: recordToDelete.checkIn,
        checkOut: recordToDelete.checkOut,
        userName,
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({
        message: "Request body harus berisi checkIn atau checkOut untuk diupdate.",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId, {
      include: [{ model: User, attributes: ['nama'] }]
    });

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    // pastikan pemilik jika perlu (opsional, tambahkan cek jika hanya owner boleh update)
    if (recordToUpdate.userId !== req.user.id) {
      return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    if (checkIn !== undefined) recordToUpdate.checkIn = checkIn;
    if (checkOut !== undefined) recordToUpdate.checkOut = checkOut;
    await recordToUpdate.save();

    const userName = getUserNameFromRecord(recordToUpdate, req);

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        checkIn: recordToUpdate.checkIn,
        checkOut: recordToUpdate.checkOut,
        userName,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};