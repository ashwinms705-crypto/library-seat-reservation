import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


function MyBooking() {

  const [booking, setBooking] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {

  const fetchBooking = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const res = await axios.get(
        `https://library-seat-backend-uvwy.onrender.com/api/seats/my-booking/${userId}`
      );

      setBooking(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  fetchBooking();

}, []);

  const cancelBooking = async () => {

    try {

      await axios.post(
        `https://library-seat-backend-uvwy.onrender.com/api/seats/cancel/${booking.seatId}`,
        {
          userId,
          bookingId: booking.bookingId
        }
      );

      setBooking(null);

    } catch (error) {
      alert("Cancel failed");
    }

  };

  return (
    <>
      <Navbar />
      <div className="back-nav" onClick={() => navigate("/dashboard")}>
  ← Back
</div>
      <div style={{ padding: "40px", color: "white", textAlign: "center" }}>

        <h2>My Reservation</h2>

        {!booking ? (

          <p>You have no active booking.</p>

        ) : (

          <div>

            <p>
              Seat: {["G","A","B","C"][booking.floor]}
              {booking.seatNumber}
            </p>

            <p>
              Start: {new Date(booking.startTime).toLocaleString()}
            </p>

            <p>
              End: {new Date(booking.endTime).toLocaleString()}
            </p>

            <button className="app-btn btn-danger" onClick={cancelBooking}>
                Cancel Booking
            </button>

          </div>

        )}

      </div>
    </>
  );
}

export default MyBooking;