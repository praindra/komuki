const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/authMiddleware');

router.get('/', feedbackController.getAllFeedback);
router.post('/', protect, feedbackController.submitFeedback);

// Admin routes
router.get('/admin', protect, admin, feedbackController.getFeedbackForAdmin);
router.post('/:id/message', protect, admin, feedbackController.sendMessageToUser);
router.delete('/:id', protect, admin, feedbackController.deleteFeedback);

module.exports = router;
