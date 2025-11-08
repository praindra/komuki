const User = require('../models/User');
const { generateToken } = require('../utils/jwt')
const jwt = require('jsonwebtoken');

// Generate JWT
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '1h',
//     });
// };

// @route   POST api/auth/login
// @desc    Admin Login
// @access  Public
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id), 
            });
        } else {
            res.status(401).json({ msg: 'Username atau password salah.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.createInitialAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME });
        if (!adminExists) {
            const adminUser = new User({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD, // Password akan di-hash oleh pre-save hook
                role: 'admin'
            });
            await adminUser.save();
            console.log('Initial admin user created.');
        }
    } catch (err) {
        console.error('Error creating initial admin:', err.message);
    }
};
// Panggil fungsi ini di server.js setelah koneksi DB
// createInitialAdmin();