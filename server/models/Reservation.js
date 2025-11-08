const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    parentName: { type: String, required: true },
    parentKTP: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    patientDOB: { type: Date, required: true },
    appointmentDate: { type: Date, required: true },
    queueNumber: { type: String }, // e.g., A1, A2
    reservationId: { type: String, unique: true }, // 6 digits random number
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Dokter yang ditunjuk
    status: { type: String, default: 'pending' }, // pending, completed, cancelled
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', ReservationSchema);