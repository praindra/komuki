const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");
const { protect, adminOrOperator } = require("../middleware/authMiddleware");

router.get("/:date", protect, adminOrOperator, queueController.getQueueByDate);
router.post(
  "/next-patient",
  protect,
  adminOrOperator,
  queueController.nextPatient
);
router.post("/reset", protect, adminOrOperator, queueController.resetQueue); // Bisa dihapus jika hanya mengandalkan cron

module.exports = router;
