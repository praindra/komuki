const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = verifyToken(token);
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

const adminOrOperator = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'operator')) {
        next();
    } else {
        res.status(403).json({ msg: 'Tidak terotorisasi.' });
    }
};

module.exports = { protect, admin, adminOrOperator };