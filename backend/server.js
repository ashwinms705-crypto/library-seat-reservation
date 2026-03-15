const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const seatRoutes = require("./routes/seatRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: "https://library-seat-reservation.vercel.app",
    credentials: true
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);

app.get("/", (req, res) => {
  res.send("Library Seat Reservation API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});