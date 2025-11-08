const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard-stats', protect, admin, adminController.getDashboardStats);

module.exports = router;