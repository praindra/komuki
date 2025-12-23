const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.get('/users', protect, superAdmin, superAdminController.listUsers);
router.post('/users', protect, superAdmin, superAdminController.createUser);
router.put('/users/:id', protect, superAdmin, superAdminController.updateUser);
router.delete('/users/:id', protect, superAdmin, superAdminController.deleteUser);

module.exports = router;
