// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const queueRoutes = require("./routes/queueRoutes");
const quotaRoutes = require("./routes/quotaRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

// Import Utilities & Middleware
const connectDB = require("./config/db");
const { createInitialAdmin } = require("./controllers/authController");
const { notFound, errorHandler } = require("./utils/errorHandler");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Create initial admin user if not exists (call after DB connection)
createInitialAdmin();

// Middleware
app.use(express.json()); // Body parser
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Mengizinkan akses dari client URL
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/quota", quotaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Cron job to reset daily queue at midnight
cron.schedule("0 0 * * *", async () => {
  // Runs every day at 00:00 (midnight)
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await mongoose
      .model("Queue")
      .findOneAndUpdate(
        { date: today },
        { $set: { lastNumber: 0, currentNumber: 0 } },
        { new: true, upsert: true }
      );
    console.log("Daily queue reset successfully!");
  } catch (error) {
    console.error("Error resetting daily queue:", error);
  }
});

// Error Handling Middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
