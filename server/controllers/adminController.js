const Reservation = require('../models/Reservation');
const Doctor = require('../models/Doctor');
const Quota = require('../models/Quota');
const Queue = require('../models/Queue');

// @route   GET api/admin/dashboard-stats
// @desc    Get dashboard statistics for admin
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        const totalReservationsToday = await Reservation.countDocuments({
            createdAt: { $gte: today, $lte: endOfToday }
        });

        const quota = await Quota.findOne();
        const limitReservationsToday = quota ? quota.limit : 0;

        const totalActivePatients = await Reservation.countDocuments({
            status: 'pending', 
            appointmentDate: { $gte: today } 
        });

        const totalDoctors = await Doctor.countDocuments();

        
        const queueDataLast7Days = []; 

        res.json({
            totalReservationsToday,
            limitReservationsToday,
            totalActivePatients,
            totalDoctors,
            queueChartData: {
                labels: ['Hari-6', 'Hari-5', 'Hari-4', 'Hari-3', 'Hari-2', 'Kemarin', 'Hari Ini'],
                datasets: [
                    {
                        label: 'Jumlah Antrian',
                        data: [10, 15, 20, 12, 18, 25, (await Queue.findOne({ date: today }))?.lastNumber || 0], // Contoh data
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};