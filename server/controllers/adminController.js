const Reservation = require("../models/Reservation");
const Doctor = require("../models/Doctor");
const Quota = require("../models/Quota");
const Queue = require("../models/Queue");

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
      createdAt: { $gte: today, $lte: endOfToday },
    });

    const quota = await Quota.findOne();
    const limitReservationsToday = quota ? quota.limit : 0;

    const totalActivePatients = await Reservation.countDocuments({
      status: "pending",
      appointmentDate: { $gte: today },
    });

    const totalDoctors = await Doctor.countDocuments();

    // Get reservation data for the last 7 days
    const reservationDataLast7Days = [];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      const count = await Reservation.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
      reservationDataLast7Days.push(count);
      labels.push(
        date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" })
      ); // Format: DD/MM
    }

    res.json({
      totalReservationsToday,
      limitReservationsToday,
      totalActivePatients,
      totalDoctors,
      queueChartData: {
        labels,
        datasets: [
          {
            label: "Jumlah Antrian",
            data: reservationDataLast7Days,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
