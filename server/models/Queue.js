const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true }, // Tanggal untuk antrian ini (dibuat di awal hari)
    lastNumber: { type: Number, default: 0 }, // Nomor antrian terakhir yang diberikan (A1, A2, dst.)
    currentNumber: { type: Number, default: 0 }, // Nomor antrian yang sedang berjalan (yang sedang dipanggil)
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Queue', QueueSchema);