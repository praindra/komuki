const User = require('../models/User');
const { generateToken } = require('../utils/jwt')
const jwt = require('jsonwebtoken');

// @route   POST api/auth/login
// @desc    Admin/Operator Login
// @access  Public
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
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
        // Create admin user
        const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME });
        if (!adminExists) {
            const adminUser = new User({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Initial admin user created.');
        }

        // Create operator user
        const operatorExists = await User.findOne({ username: process.env.OPERATOR_USERNAME });
        if (!operatorExists) {
            const operatorUser = new User({
                username: process.env.OPERATOR_USERNAME,
                password: process.env.OPERATOR_PASSWORD,
                role: 'operator'
            });
            await operatorUser.save();
            console.log('Initial operator user created.');
        }
    } catch (err) {
        console.error('Error creating initial users:', err.message);
    }
};