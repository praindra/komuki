// server/controllers/userController.js
const User = require('../models/User');
const Reservation = require('../models/Reservation');

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const { fullName, phoneNumber, gender, dateOfBirth } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        // Update fields
        if (fullName !== undefined) user.fullName = fullName;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (gender !== undefined) user.gender = gender;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;

        await user.save();

        const updatedUser = await User.findById(req.user._id).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const mongoose = require('mongoose');

// @route   GET api/users/reservations
// @desc    Get user's reservation history with pagination and filters
// @access  Private
exports.getUserReservations = async (req, res) => {
    try {
        const { page = 1, limit = 10, startDate, endDate, status } = req.query;
        const query = { user: req.user._id };

        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.appointmentDate = { $gte: start, $lte: end };
        }

        if (status) {
            query.status = status.toLowerCase();
        }

        const total = await Reservation.countDocuments(query);

        const reservations = await Reservation.find(query)
            .populate('doctor', 'name')
            .sort({ createdAt: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .exec();

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            reservations
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/users/reservations/cancel
// @desc    Cancel reservation by the user
// @access  Private
exports.cancelUserReservation = async (req, res) => {
    try {
        const { reservationId } = req.body;

        if (!reservationId) {
            return res.status(400).json({ msg: 'Reservation ID is required.' });
        }

        const reservation = await Reservation.findOne({
            _id: mongoose.Types.ObjectId(reservationId),
            user: req.user._id, // ensure the user owns the reservation
            status: { $ne: 'cancelled' }
        });

        if (!reservation) {
            return res.status(404).json({ msg: 'Reservasi tidak ditemukan atau sudah dibatalkan.' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        res.json({ msg: 'Reservasi berhasil dibatalkan.', reservation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
