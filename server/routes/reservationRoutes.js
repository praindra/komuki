const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import middleware otentikasi dan otorisasi

// @route   POST api/reservations
// @desc    Create a new reservation
// @access  Public
router.post('/', reservationController.createReservation);

// @route   PUT api/reservations/cancel
// @desc    Cancel a reservation
// @access  Public
router.put('/cancel', reservationController.cancelReservation);

// @route   GET api/reservations/daily-stats
// @desc    Get daily reservation statistics for public homepage
// @access  Public
router.get('/daily-stats', reservationController.getDailyStats);

// @route   GET api/reservations/my-history
// @desc    Get reservation history for logged-in user
// @access  Private (Authenticated User)
router.get('/my-history', protect, reservationController.getMyHistory);

// ADMIN ROUTES (Protected by 'protect' and 'admin' middleware)

// @route   GET api/reservations
// @desc    Get all reservations (with filters)
// @access  Private (Admin)
router.get('/', protect, admin, reservationController.getReservations);

// @route   DELETE api/reservations/delete-by-date
// @desc    Delete reservations by date range
// @access  Private (Admin)
router.delete('/delete-by-date', protect, admin, reservationController.deleteReservationsByDate);

module.exports = router;
