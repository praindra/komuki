const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/:date', protect, admin, queueController.getQueueByDate);
router.post('/next-patient', protect, admin, queueController.nextPatient);
router.post('/reset', protect, admin, queueController.resetQueue); // Bisa dihapus jika hanya mengandalkan cron

module.exports = router;