const Doctor = require('../models/Doctor');
const Reservation = require('../models/Reservation');
const { sendWhatsAppMessage } = require('../utils/whatsapp'); // Anda perlu mengimplementasikan ini

// @route   GET api/doctors
// @desc    Get all doctors and their schedules
// @access  Public (for user form) and Private (for admin)
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/doctors
// @desc    Create a new doctor
// @access  Private (Admin)
exports.createDoctor = async (req, res) => {
    const { name, schedule } = req.body;

    try {
        const newDoctor = new Doctor({ name, schedule });
        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/doctors/:id
// @desc    Update doctor schedule
// @access  Private (Admin)
exports.updateDoctor = async (req, res) => {
    const { id } = req.params;
    const { name, schedule } = req.body;

    try {
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ msg: 'Dokter tidak ditemukan.' });
        }

        doctor.name = name || doctor.name;
        doctor.schedule = schedule || doctor.schedule;

        await doctor.save();
        res.json(doctor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/doctors/:id
// @desc    Delete a doctor
// @access  Private (Admin)
exports.deleteDoctor = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ msg: 'Dokter tidak ditemukan.' });
        }

        await Doctor.deleteOne({ _id: id });
        res.json({ msg: 'Dokter berhasil dihapus.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.sendVacationNotification = async (req, res) => {
    const { doctorId, vacationDate, message } = req.body;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ msg: 'Dokter tidak ditemukan.' });
        }

        const dateForQuery = new Date(vacationDate);
        dateForQuery.setHours(0,0,0,0);
        const endOfDay = new Date(dateForQuery);
        endOfDay.setHours(23,59,59,999);

        // Cari semua reservasi pada tanggal cuti dokter
        const reservations = await Reservation.find({
            doctor: doctorId,
            appointmentDate: { $gte: dateForQuery, $lte: endOfDay },
            status: { $ne: 'cancelled' } // Hanya yang belum dibatalkan
        }).select('phoneNumber');

        if (reservations.length === 0) {
            return res.status(200).json({ msg: 'Tidak ada reservasi untuk dokter ini pada tanggal tersebut, tidak ada notifikasi yang dikirim.' });
        }

        const uniquePhoneNumbers = [...new Set(reservations.map(res => res.phoneNumber))];

        for (const phoneNumber of uniquePhoneNumbers) {
            try {
                // Pastikan format nomor telepon sesuai dengan API WhatsApp (misal: +6281234567890)
                await sendWhatsAppMessage(phoneNumber, message);
            } catch (innerError) {
                console.error(`Gagal mengirim WhatsApp ke ${phoneNumber}:`, innerError.message);
                // Lanjutkan ke nomor berikutnya meskipun ada yang gagal
            }
        }

        res.json({ msg: 'Pemberitahuan cuti berhasil dikirim ke pasien yang terkait.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};