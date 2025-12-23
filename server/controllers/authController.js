const User = require('../models/User');
const { generateToken } = require('../utils/jwt')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');

// @route   POST api/auth/login
// @desc    Admin/Operator/SuperAdmin Login
// @access  Public
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.adminLogin = async (req, res) => {
    const { username, password, usernameOrEmail } = req.body;
    const loginField = username || usernameOrEmail;

    try {
        // Build a case-insensitive search for username, exact match for email
        const orClause = [];
        if (loginField) {
            // treat as email if contains @
            if (loginField.includes('@')) {
                orClause.push({ email: loginField.toLowerCase() });
            } else {
                orClause.push({ username: new RegExp('^' + escapeRegex(loginField) + '$', 'i') });
            }
            // also try matching email in case user entered email without @ detection
            orClause.push({ email: loginField.toLowerCase() });
        }

        const user = await User.findOne({ $or: orClause });

        if (!user) {
            console.warn('Login failed - user not found for:', loginField);
            return res.status(401).json({ msg: 'Username atau password salah.' });
        }

        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.warn('Login failed - bad password for user:', user.username);
            return res.status(401).json({ msg: 'Username atau password salah.' });
        }
    } catch (err) {
        console.error('adminLogin error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/auth/forgot-password
// @desc    Forgot password - send reset email
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ msg: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'If that email exists, a reset link was sent.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}&id=${user._id}`;
        const html = `<p>Anda menerima email ini karena ada permintaan reset password.</p>
        <p>Silakan klik tautan berikut untuk mengganti password (berlaku 1 jam):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>`;

        try {
            await sendEmail({ to: user.email, subject: 'Reset Password', html });
        } catch (err) {
            console.error('sendEmail error:', err.message);
        }

        res.json({ message: 'If that email exists, a reset link was sent.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/auth/reset-password
// @desc    Reset password
// @access  Public
exports.resetPassword = async (req, res) => {
    const { token, id, password } = req.body;
    if (!token || !id || !password) {
        return res.status(400).json({ msg: 'Token, id and new password are required' });
    }

    try {
        const user = await User.findOne({ _id: id, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/auth/register
// @desc    User Registration
// @access  Public
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ msg: 'Username atau email sudah terdaftar.' });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            role: 'user' // Default role for registered users
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



exports.createInitialAdmin = async () => {
    try {
        console.log('Creating initial users...');
        console.log('SUPERADMIN_USERNAME:', process.env.SUPERADMIN_USERNAME);
        console.log('SUPERADMIN_PASSWORD:', process.env.SUPERADMIN_PASSWORD);
        
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
        } else {
            console.log('Admin user already exists.');
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
        } else {
            console.log('Operator user already exists.');
        }

        // Create superadmin user
        const superadminExists = await User.findOne({ username: process.env.SUPERADMIN_USERNAME });
        if (!superadminExists) {
            const superadminUser = new User({
                username: process.env.SUPERADMIN_USERNAME,
                password: process.env.SUPERADMIN_PASSWORD,
                role: 'superadmin'
            });
            await superadminUser.save();
            console.log('Initial superadmin user created.');
        } else {
            console.log('Superadmin user already exists.');
        }
    } catch (err) {
        console.error('Error creating initial users:', err.message);
    }
};
