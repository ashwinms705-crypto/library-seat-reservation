const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  bookings: [bookingSchema]
});

// Prevent duplicate seats
seatSchema.index({ seatNumber: 1, floor: 1 }, { unique: true });

module.exports = mongoose.model("Seat", seatSchema);

module.exports = mongoose.model("Seat", seatSchema);