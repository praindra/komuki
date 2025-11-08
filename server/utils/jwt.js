// server/utils/jwt.js

const jwt = require('jsonwebtoken');

/**
 * Menghasilkan JSON Web Token (JWT)
 * @param {string} id ID pengguna yang akan disertakan dalam payload token
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token akan kedaluwarsa dalam 1 jam
    });
};

/**
 * Memverifikasi JSON Web Token (JWT)
 * @param {string} token Token JWT yang akan diverifikasi
 * @returns {object} Payload token yang didekodekan
 * @throws {Error} Jika token tidak valid atau kedaluwarsa
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
};