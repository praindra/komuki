const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, admin, adminOrOperator } = require('../middleware/authMiddleware');

router.route('/')
    .get(doctorController.getAllDoctors) // Public
    .post(protect, adminOrOperator, doctorController.createDoctor);

router.route('/:id')
    .put(protect, adminOrOperator, doctorController.updateDoctor)
    .delete(protect, adminOrOperator, doctorController.deleteDoctor);

router.post('/notify-vacation', protect, adminOrOperator, doctorController.sendVacationNotification);

module.exports = router;