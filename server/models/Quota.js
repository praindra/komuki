const mongoose = require('mongoose');

const QuotaSchema = new mongoose.Schema({
    limit: { type: Number, required: true, default: 20 }, // Contoh limit 20 antrian per hari
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quota', QuotaSchema);