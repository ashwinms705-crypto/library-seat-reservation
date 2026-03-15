const express = require("express");

const { createSeats, getSeats, bookSeat, cancelSeat, getMyBooking } = require("../controllers/seatController");

const router = express.Router();

router.post("/create", createSeats);

router.get("/", getSeats);

router.post("/book/:seatId", bookSeat);

router.post("/cancel/:seatId", cancelSeat);

router.get("/my-booking/:userId", getMyBooking);

module.exports = router;