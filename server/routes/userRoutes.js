// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.get('/reservations', protect, userController.getUserReservations);
router.put('/reservations/cancel', protect, userController.cancelUserReservation);

module.exports = router;