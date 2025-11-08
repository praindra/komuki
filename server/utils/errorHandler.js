// server/utils/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Tentukan kode status HTTP, default ke 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Kirim respons JSON dengan pesan kesalahan dan stack trace (hanya di mode pengembangan)
    res.json({
        message: err.message,
        // Stack trace hanya disertakan jika aplikasi dalam mode pengembangan
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Meneruskan kesalahan ke middleware errorHandler
};

module.exports = {
    errorHandler,
    notFound,
};