const Feedback = require('../models/Feedback');
const { sendWhatsAppMessage } = require('../utils/whatsapp');
const User = require('../models/User');

// @route   GET api/feedback
// @desc    Get all feedback
// @access  Public (for footer display)
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('user', 'username').sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/feedback
// @desc    Submit new feedback (category: 'kritik' or 'saran')
// @access  Private (user must be logged in)
exports.submitFeedback = async (req, res) => {
    const { message, category } = req.body;
    const cat = category === 'saran' ? 'saran' : 'kritik';

    try {
        const feedback = new Feedback({
            user: req.user.id,
            message,
            category: cat,
        });

        await feedback.save();

        const populatedFeedback = await Feedback.findById(feedback._id).populate('user', 'username');

        res.status(201).json(populatedFeedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: get feedbacks with optional date range filter
exports.getFeedbackForAdmin = async (req, res) => {
    try {
        const { from, to } = req.query;
        const query = {};
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) {
                const toDate = new Date(to);
                // include the whole 'to' day
                toDate.setHours(23,59,59,999);
                query.createdAt.$lte = toDate;
            }
        }
        const feedback = await Feedback.find(query).populate('user', 'username phoneNumber').sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: send a message (WhatsApp) to the user who submitted the feedback
exports.sendMessageToUser = async (req, res) => {
    const feedbackId = req.params.id;
    const { message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ msg: 'Message is required.' });
    }
    try {
        const feedback = await Feedback.findById(feedbackId).populate('user', 'username phoneNumber');
        if (!feedback) return res.status(404).json({ msg: 'Feedback not found.' });
        const phone = feedback.user?.phoneNumber;
        if (!phone) return res.status(400).json({ msg: 'User has no phone number.' });

        await sendWhatsAppMessage(phone, message);

        res.json({ msg: 'Message sent.' });
    } catch (err) {
        console.error('Error sending message:', err.message);
        res.status(500).json({ msg: 'Failed to send message.' });
    }
};

// Admin: delete feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);
        if (!feedback) return res.status(404).json({ msg: 'Feedback not found.' });
        await Feedback.findByIdAndDelete(id);
        res.json({ msg: 'Feedback deleted.' });
    } catch (err) {
        console.error('Error deleting feedback:', err.message);
        res.status(500).json({ msg: 'Failed to delete feedback.' });
    }
};
