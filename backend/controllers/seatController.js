const Seat = require("../models/Seat");
const mongoose = require("mongoose");


/* ---------- CREATE SEATS ---------- */

const createSeats = async (req, res) => {

  try {

    const existingSeats = await Seat.findOne();

    if (existingSeats) {
      return res.status(400).json({
        message: "Seats already exist in database. Creation skipped."
      });
    }

    const seats = [];

    /* Ground Floor */
    for (let i = 1; i <= 28; i++) {
      seats.push({
        seatNumber: i,
        floor: 0
      });
    }

    /* Floor 1 */
    for (let i = 1; i <= 130; i++) {
      seats.push({
        seatNumber: i,
        floor: 1
      });
    }

    /* Floor 2 */
    for (let i = 1; i <= 130; i++) {
      seats.push({
        seatNumber: i,
        floor: 2
      });
    }

    /* Floor 3 */
    for (let i = 1; i <= 130; i++) {
      seats.push({
        seatNumber: i,
        floor: 3
      });
    }

    await Seat.insertMany(seats, { ordered: false });

    res.json({
      message: "Seats created successfully",
      totalSeats: seats.length
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Seat creation failed",
      error: error.message
    });

  }

};



/* ---------- GET SEATS ---------- */

const getSeats = async (req, res) => {

  try {

    const floor = req.query.floor;
    const now = new Date();

    const seats = await Seat.find({ floor });

    const cleanedSeats = seats.map(seat => {

      seat.bookings = seat.bookings.filter(
        booking => new Date(booking.endTime) > now
      );

      return seat;

    });

    res.json(cleanedSeats);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch seats"
    });

  }

};



/* ---------- BOOK SEAT ---------- */

const bookSeat = async (req, res) => {

  try {

    const { seatId } = req.params;
    const { userId, startTime, endTime } = req.body;
    console.log("Incoming userId:", userId);
    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "Start and end times are required."
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start >= end) {
      return res.status(400).json({
        message: "End time must be after start time."
      });
    }

    /* ---------- CHECK IF USER ALREADY HAS A SEAT ---------- */

    const allSeats = await Seat.find();

    for (const s of allSeats) {

      for (const booking of s.bookings) {

        if (
          booking.bookedBy.toString() === userId &&
          new Date(booking.endTime) > now
        ) {
          return res.status(400).json({
            message: "You already have a seat booked. Cancel it before booking another."
          });
        }

      }

    }

    /* ---------- FIND SEAT ---------- */

    const seat = await Seat.findById(seatId);

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found"
      });
    }

    /* ---------- CHECK SEAT OVERLAP ---------- */

    const isOverlapping = seat.bookings.some(booking => {

      const bStart = new Date(booking.startTime);
      const bEnd = new Date(booking.endTime);

      return start < bEnd && end > bStart;

    });

    if (isOverlapping) {
      return res.status(400).json({
        message: "Seat is already booked during this time slot."
      });
    }

    /* ---------- BOOK SEAT ---------- */

    seat.bookings.push({
      bookedBy: new mongoose.Types.ObjectId(userId),
      startTime: start,
      endTime: end
    });

    await seat.save();

    res.json({
      message: "Seat booked successfully",
      seat
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Seat booking failed",
      error: error.message
    });

  }

};


/* ---------- CANCEL BOOKING ---------- */

const cancelSeat = async (req, res) => {

  try {

    const { seatId } = req.params;
    const { userId, bookingId } = req.body;

    const seat = await Seat.findById(seatId);

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found"
      });
    }

    const bookingIndex = seat.bookings.findIndex(b =>
      b._id.toString() === bookingId &&
      b.bookedBy.toString() === userId
    );

    if (bookingIndex === -1) {
      return res.status(403).json({
        message: "Booking not found or you don't have permission to cancel it."
      });
    }

    seat.bookings.splice(bookingIndex, 1);

    await seat.save();

    res.json({
      message: "Seat reservation cancelled",
      seat
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Cancel reservation failed"
    });

  }

};

/* ---------- GET MY BOOKING ---------- */

const getMyBooking = async (req, res) => {

  try {

    const { userId } = req.params;
    const now = new Date();

    const seats = await Seat.find();

    let myBooking = null;

    for (const seat of seats) {

      const booking = seat.bookings.find(b => {

        const start = new Date(b.startTime);
        const end = new Date(b.endTime);

        return (
          b.bookedBy?.toString() === userId &&
          end > now
        );

      });

      if (booking) {

        myBooking = {
          seatId: seat._id,
          seatNumber: seat.seatNumber,
          floor: seat.floor,
          bookingId: booking._id,
          startTime: booking.startTime,
          endTime: booking.endTime
        };

        break;

      }

    }

    res.json(myBooking);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch booking"
    });

  }

};



module.exports = {
  createSeats,
  getSeats,
  bookSeat,
  cancelSeat,
  getMyBooking
};