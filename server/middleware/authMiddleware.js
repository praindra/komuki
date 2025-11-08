const { verifyToken } = require('../utils/jwt'); // Import dari jwt.js
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = verifyToken(token); // Panggil verifyToken dari utils/jwt.js

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ msg: 'Tidak terotorisasi, token gagal.' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Tidak terotorisasi, tidak ada token.' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Tidak terotorisasi sebagai admin.' });
    }
};

module.exports = { protect, admin };