const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true, maxlength: 200 },
  category: { type: String, enum: ['kritik', 'saran'], default: 'kritik' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
