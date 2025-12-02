const express = require("express");
const router = express.Router();
const quotaController = require("../controllers/quotaController");
const {
  protect,
  admin,
  adminOrOperator,
} = require("../middleware/authMiddleware");

router
  .route("/")
  .get(quotaController.getQuota) // Bisa diakses publik untuk user menampilkan limit
  .post(protect, admin, quotaController.createQuota) // Hanya admin
  .put(protect, adminOrOperator, quotaController.updateQuota); // Admin atau Operator (menggunakan ID jika lebih dari 1 dokumen, atau tanpa ID jika single document)

// Jika Anda ingin mengupdate quota tanpa ID (asumsi hanya ada satu dokumen quota)
router.put("/:id", protect, adminOrOperator, quotaController.updateQuota); // Opsi dengan ID jika perlu spesifik

module.exports = router;
