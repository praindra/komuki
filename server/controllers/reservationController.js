const Reservation = require("../models/Reservation");
const Doctor = require("../models/Doctor");
const Quota = require("../models/Quota");
const Queue = require("../models/Queue"); // Import Queue model

// Helper function to generate a random 6-digit reservation ID
const generateReservationId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   POST api/reservations
// @desc    Create a new reservation (optionally linked to logged-in user)
// @access  Public (but can be authenticated)
exports.createReservation = async (req, res) => {
  const {
    patientName,
    parentName,
    parentKTP,
    address,
    phoneNumber,
    patientDOB,
    appointmentDate,
  } = req.body;

  try {
    // Find doctor for the selected appointment date
    const dayOfWeek = new Date(appointmentDate)
      .toLocaleDateString("id-ID", { weekday: "long" })
      .toLowerCase();
    const doctor = await Doctor.findOne({
      "schedule.day": dayOfWeek,
      "schedule.isActive": true, // Pastikan dokter aktif
    });

    if (!doctor) {
      return res
        .status(400)
        .json({ msg: `Dokter di hari ${dayOfWeek} tidak tersedia.` });
    }

    // Check overall quota
    const quota = await Quota.findOne();
    if (!quota) {
      return res
        .status(500)
        .json({ msg: "Kuota antrian belum diatur oleh admin." });
    }

    // Get today's queue count for the selected doctor
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyReservationsCount = await Reservation.countDocuments({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      doctor: doctor._id, // Filter by doctor for the selected date
    });

    if (dailyReservationsCount >= quota.limit) {
      return res.status(400).json({
        msg: `Antrian di tanggal ${appointmentDate.split("T")[0]} sudah penuh.`,
      });
    }

    // Generate unique reservation ID
    let reservationId = generateReservationId();
    let existingReservation = await Reservation.findOne({ reservationId });
    while (existingReservation) {
      reservationId = generateReservationId();
      existingReservation = await Reservation.findOne({ reservationId });
    }

    // Get current queue number for the day (atomic update)
    let currentQueue = await Queue.findOneAndUpdate(
      { date: startOfDay },
      { $inc: { lastNumber: 1 } },
      { new: true, upsert: true }
    );

    const queueNumber = `A${currentQueue.lastNumber}`;

    const newReservation = new Reservation({
      user: req.user?._id || null, // Save user ID if authenticated, otherwise null
      patientName,
      parentName,
      parentKTP,
      address,
      phoneNumber,
      patientDOB,
      appointmentDate,
      doctor: doctor._id,
      queueNumber,
      reservationId,
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/reservations/cancel
// @desc    Cancel a reservation
// @access  Public
exports.cancelReservation = async (req, res) => {
  const { reservationId, queueNumber } = req.body;

  try {
    const reservation = await Reservation.findOneAndUpdate(
      { reservationId, queueNumber, status: { $ne: "cancelled" } },
      { $set: { status: "cancelled" } },
      { new: true }
    );

    if (!reservation) {
      return res
        .status(404)
        .json({ msg: "Reservasi tidak ditemukan atau sudah dibatalkan." });
    }

    res.json({ msg: "Reservasi berhasil dibatalkan.", reservation });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/reservations/daily-stats
// @desc    Get daily reservation statistics
// @access  Public (for user homepage)
exports.getDailyStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const currentQueue = await Queue.findOne({ date: today });
    const currentQueueNumber = currentQueue ? currentQueue.lastNumber : 0;

    const quota = await Quota.findOne();
    const limit = quota ? quota.limit : 0;

    // Get all doctors and their schedules
    const doctors = await Doctor.find().select("name schedule");

    res.json({
      currentQueue: currentQueueNumber,
      queueLimit: limit,
      doctors: doctors.map((doc) => ({
        name: doc.name,
        schedule: doc.schedule.map((s) => ({
          day: s.day,
          time: s.time,
          isActive: s.isActive,
        })),
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/reservations
// @desc    Get all reservations (for admin)
// @access  Private (Admin)
exports.getReservations = async (req, res) => {
  try {
    let query = {};
    const { startDate, endDate, search } = req.query;

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: start, $lte: end };
    }

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { reservationId: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   DELETE api/reservations/delete-by-date
// @desc    Delete reservations by date range (for admin)
// @access  Private (Admin)
exports.deleteReservationsByDate = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    if (!startDate || !endDate) {
      return res.status(400).json({
        msg: "Harap sediakan tanggal mulai dan tanggal akhir untuk menghapus.",
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const result = await Reservation.deleteMany({
      appointmentDate: { $gte: start, $lte: end },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        msg: "Tidak ada reservasi yang ditemukan untuk tanggal yang dipilih.",
      });
    }

    res.json({ msg: `${result.deletedCount} reservasi berhasil dihapus.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/reservations/my-history
// @desc    Get reservation history for logged-in user
// @access  Private (Authenticated User)
exports.getMyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ msg: "Invalid user data." });
    }

    const query = { user: userId };
    const { status } = req.query;
    if (status && status !== "all") {
      query.status = status;
    }

    // Find reservations linked to the authenticated user
    const reservations = await Reservation.find(query)
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedReservations = reservations.slice(startIndex, endIndex);
    const total = reservations.length;

    res.json({
      reservations: paginatedReservations,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
