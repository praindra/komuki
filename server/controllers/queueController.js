const Queue = require('../models/Queue');
const Reservation = require('../models/Reservation'); // Digunakan untuk update status reservasi

// @route   GET api/queues/:date
// @desc    Get queue data for a specific date
// @access  Private (Admin)
exports.getQueueByDate = async (req, res) => {
    const { date } = req.params;
    try {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);

        let queue = await Queue.findOne({ date: queryDate });

        if (!queue) {
            // Jika belum ada antrian untuk hari ini, buat yang baru
            queue = new Queue({ date: queryDate, lastNumber: 0, currentNumber: 0 });
            await queue.save();
        }
        res.json(queue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/queues/next-patient
// @desc    Advance to the next patient in the queue
// @access  Private (Admin)
exports.nextPatient = async (req, res) => {
    const { date } = req.body;

    try {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);

        let queue = await Queue.findOne({ date: queryDate });

        if (!queue) {
            return res.status(404).json({ msg: 'Antrian untuk tanggal ini belum dimulai.' });
        }

        // Increment currentNumber if it's less than or equal to lastNumber
        if (queue.currentNumber < queue.lastNumber) {
            queue.currentNumber += 1;
            await queue.save();

            // Opsional: Perbarui status reservasi yang sedang dipanggil menjadi 'completed'
            // Ini akan membutuhkan query yang lebih spesifik untuk menemukan reservasi berdasarkan queueNumber dan tanggal
            const today = new Date(date);
            today.setHours(0,0,0,0);
            const endOfToday = new Date(date);
            endOfToday.setHours(23,59,59,999);

            await Reservation.findOneAndUpdate(
                {
                    appointmentDate: { $gte: today, $lte: endOfToday },
                    queueNumber: `A${queue.currentNumber}`,
                    status: 'pending'
                },
                { $set: { status: 'completed' } }
            );

            res.json(queue);
        } else {
            res.status(400).json({ msg: 'Tidak ada pasien selanjutnya dalam antrian.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/queues/reset
// @desc    Reset daily queue (for admin manual or cron job)
// @access  Private (Admin)
exports.resetQueue = async (req, res) => {
    const { date } = req.body;
    try {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);

        let queue = await Queue.findOneAndUpdate(
            { date: queryDate },
            { $set: { lastNumber: 0, currentNumber: 0 } },
            { new: true, upsert: true } // Buat jika belum ada
        );

        // Opsional: set semua reservasi pada tanggal ini ke status 'pending' jika Anda ingin reset total
        // Atau biarkan statusnya seperti sebelumnya jika reset hanya untuk counter.
        // await Reservation.updateMany({ appointmentDate: queryDate }, { $set: { status: 'pending' } });

        res.json({ msg: 'Antrian berhasil direset.', queue });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};