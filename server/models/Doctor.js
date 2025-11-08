const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    schedule: [
        {
            day: { type: String, enum: ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'], required: true },
            time: { type: String, required: true }, // Format HH:MM
            isActive: { type: Boolean, default: true }, // Untuk menandai cuti atau tidak aktif
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doctor', DoctorSchema);