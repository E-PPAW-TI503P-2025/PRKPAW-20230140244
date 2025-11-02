const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
router.use(addUserData);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

router.delete('/:id', presensiController.deletePresensi);
router.put(
  "/:id",
  [
    body("checkIn")
      .optional() // validasi hanya jika dikirim
      .isISO8601()
      .withMessage("checkIn harus berupa format tanggal yang valid (ISO 8601)"),
    body("checkOut")
      .optional()
      .isISO8601()
      .withMessage("checkOut harus berupa format tanggal yang valid (ISO 8601)"),
  ],
  presensiController.updatePresensi
);

module.exports = router;
