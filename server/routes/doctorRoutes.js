const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(doctorController.getAllDoctors) // Bisa diakses publik untuk halaman user
    .post(protect, admin, doctorController.createDoctor); // Hanya admin

router.route('/:id')
    .put(protect, admin, doctorController.updateDoctor) // Hanya admin
    .delete(protect, admin, doctorController.deleteDoctor); // Hanya admin

router.post('/notify-vacation', protect, admin, doctorController.sendVacationNotification); // Hanya admin

module.exports = router;