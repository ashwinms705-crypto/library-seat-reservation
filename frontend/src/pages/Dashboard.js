import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
import BookingModal from "../components/BookingModal";
import toast from "react-hot-toast";

function Dashboard() {

  const [seats, setSeats] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeatForBooking, setSelectedSeatForBooking] = useState(null);
  const userId = localStorage.getItem("userId");

  const floorPrefix = ["G", "A", "B", "C"];
  
  const [stats, setStats] = useState({
  available: 0,
  occupied: 0,
  reserved: 0
});
  const fetchSeats = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://library-seat-backend-uvwy.onrender.com/api/seats?floor=${selectedFloor}`
      );
      setSeats(res.data);
      const seatsData = res.data;

let available = 0;
let occupied = 0;
let reserved = 0;

const now = new Date();

seatsData.forEach(seat => {

  const activeBooking = seat.bookings?.find(b => {
    const start = new Date(b.startTime);
    const end = new Date(b.endTime);
    return now >= start && now <= end;
  });

  const futureBooking = seat.bookings?.find(b => {
    const start = new Date(b.startTime);
    return start > now;
  });

  if (activeBooking) occupied++;
  else if (futureBooking) reserved++;
  else available++;

});

setStats({
  available,
  occupied,
  reserved
});
    } catch (error) {
      console.log(error);
    }
  }, [selectedFloor]);

  useEffect(() => {
  fetchSeats();

  const interval = setInterval(() => {
    fetchSeats();
  }, 30000); // refresh every 30 seconds

  return () => clearInterval(interval);

}, [fetchSeats]);

  const handleSeatClick = async (seat) => {
    if (!userId) {
      toast.error("Please login first.");
      return;
    }

    const now = new Date();
    // Check if the current user has booked this seat *right now*
    const isCurrentlyBookedByMe = seat.bookings && seat.bookings.some(booking => {
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      return booking.bookedBy === userId && now >= start && now <= end;
    });

    if (isCurrentlyBookedByMe) {
      const activeBooking = seat.bookings.find(booking => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        return booking.bookedBy === userId && now >= start && now <= end;
      });

      if(window.confirm("Cancel your current reservation?")) {
        try {
          await axios.post(`https://library-seat-backend-uvwy.onrender.com/api/seats/cancel/${seat._id}`, {
            userId,
            bookingId: activeBooking._id
          });
          fetchSeats();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to cancel.");
        }
      }
    } else {
      setSelectedSeatForBooking(seat);
      setIsModalOpen(true);
    }
  };

  const handleConfirmBooking = async (seatId, startTime, endTime) => {
    try {
      await axios.post(`https://library-seat-backend-uvwy.onrender.com/api/seats/book/${seatId}`, {
         userId,
         startTime,
         endTime
      });
      toast.success("Seat booked successfully!");
      setIsModalOpen(false);
      setSelectedSeatForBooking(null);
      fetchSeats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed.");
    }
  };

    const renderSeat = (seat) => {

  const now = new Date();

  let seatClass = "available";

  if (seat.bookings && seat.bookings.length > 0) {

    const myBooking = seat.bookings.find(b => b.bookedBy === userId);

    const activeBooking = seat.bookings.find(b => {
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      return now >= start && now <= end;
    });

    const futureBooking = seat.bookings.find(b => {
      const start = new Date(b.startTime);
      return start > now;
    });

    if (myBooking) {
      seatClass = "mine";
    }
    else if (activeBooking) {
      seatClass = "booked";
    }
    else if (futureBooking) {
      seatClass = "reserved";
    }

  }
  const activeBooking = seat.bookings?.find(b => {
  const start = new Date(b.startTime);
  const end = new Date(b.endTime);
  return now >= start && now <= end;
});
  const futureBooking = seat.bookings?.filter(b => {
  const start = new Date(b.startTime);
  return start > now;
});

  return (
  <div
    key={seat._id}
    onClick={() => handleSeatClick(seat)}
    className={`seat ${seatClass}`}
  >

    <div className="seat-number">
      {`${floorPrefix[seat.floor]}${seat.seatNumber}`}
    </div>

    <div className="seat-tooltip">

  <div>
    <strong>Seat:</strong> {`${floorPrefix[seat.floor]}${seat.seatNumber}`}
  </div>

  {activeBooking && (
    <>
      <div><strong>Status:</strong> Booked</div>
      <div>
        {new Date(activeBooking.startTime).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
        {" - "}
        {new Date(activeBooking.endTime).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
      </div>
    </>
  )}

  {futureBooking?.length > 0 && (
    <>
      <div><strong>Reserved Slots:</strong></div>

      {futureBooking.map((b, index) => (
        <div key={index}>
          {new Date(b.startTime).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
          {" - "}
          {new Date(b.endTime).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
        </div>
      ))}

    </>
  )}

  {!activeBooking && futureBooking?.length === 0 && (
    <div><strong>Status:</strong> Available</div>
  )}

</div>
  </div>
);
};
  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        <h2 className="dashboard-title">Library Seat Reservation</h2>
        <div className="seat-stats">

  <div className="stat available">
    Available: {stats.available}
  </div>

  <div className="stat occupied">
    Occupied: {stats.occupied}
  </div>

  <div className="stat reserved">
    Reserved: {stats.reserved}
  </div>

</div>

        {/* Floor Selector */}

        <div className="floor-selector">

          <button 
            className={selectedFloor === 0 ? "active" : ""} 
            onClick={() => setSelectedFloor(0)}>Ground</button>
          <button 
            className={selectedFloor === 1 ? "active" : ""} 
            onClick={() => setSelectedFloor(1)}>Floor 1</button>
          <button 
            className={selectedFloor === 2 ? "active" : ""} 
            onClick={() => setSelectedFloor(2)}>Floor 2</button>
          <button 
            className={selectedFloor === 3 ? "active" : ""} 
            onClick={() => setSelectedFloor(3)}>Floor 3</button>

        </div>

        {/* Legend */}

        <div className="legend">

          <div className="legend-item">
            <div className="legend-box available"></div>
            Available
          </div>

          <div className="legend-item">
            <div className="legend-box booked"></div>
            Booked
          </div>

          <div className="legend-item">
            <div className="legend-box mine"></div>
            Your Seat
          </div>
          <div className="legend-item">
            <div className="legend-box reserved"></div>
            Reserved (Future)
          </div>

        </div>


        {/* -------- GROUND FLOOR LAYOUT (seats.length === 28) -------- */}
        {seats.length > 0 && seats.length <= 40 && (
          <div className="ground-floor-layout">
            
            {/* Top Window Row (10 seats) */}
            <div className="window-row" style={{ marginTop: "20px", marginBottom: "40px" }}>
              {seats.slice(0, 10).map(renderSeat)}
            </div>

            {/* Middle Section (Left Table + Void with Top Table + Right Table) */}
            <div className="middle-layout">
              {/* Left Table (Index 1: seats 16-22) - Aligned to center */}
              <div className="table-column" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                {(() => {
                  const leftTableSeats = seats.slice(16, 22);
                  if (leftTableSeats.length === 0) return null;
                  return (
                    <div className="table">
                      <div className="table-side">
                        {leftTableSeats.slice(0, 3).map(renderSeat)}
                      </div>
                      <div className="table-middle"></div>
                      <div className="table-side">
                        {leftTableSeats.slice(3, 6).map(renderSeat)}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Center Column: Top Table + Void */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                {/* Top Table (Index 0: seats 10-16) - Rotated Left One Time (Horizontal) */}
                <div className="table">
                  {(() => {
                    const topTableSeats = seats.slice(10, 16);
                    if (topTableSeats.length === 0) return null;
                    return (
                      <>
                        <div className="table-side">
                          {topTableSeats.slice(0, 3).map(renderSeat)}
                        </div>
                        <div className="table-middle"></div>
                        <div className="table-side">
                          {topTableSeats.slice(3, 6).map(renderSeat)}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Void Area */}
                <div className="void-area">
                  <div className="void-visual">
                  </div>
                </div>
              </div>

              {/* Right Table (Index 2: seats 22-28) - Aligned to center */}
              <div className="table-column" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                {(() => {
                  const rightTableSeats = seats.slice(22, 28);
                  if (rightTableSeats.length === 0) return null;
                  return (
                    <div className="table">
                      <div className="table-side">
                        {rightTableSeats.slice(0, 3).map(renderSeat)}
                      </div>
                      <div className="table-middle"></div>
                      <div className="table-side">
                        {rightTableSeats.slice(3, 6).map(renderSeat)}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        )}

        {/* -------- UPPER FLOORS LAYOUT (seats.length > 40) -------- */}
        {seats.length > 40 && (
          <div className="upper-floor-layout">

            {/* Top Window Seats */}
            <div className="window-row">
              {seats.slice(0, 10).map(renderSeat)}
            </div>

            {/* Top Tables */}
            <div className="table-row">
              {[0, 1, 2, 3, 4].map((i) => {
                const tableSeats = seats.slice(10 + i * 6, 16 + i * 6);
                if (tableSeats.length === 0) return null;

                return (
                  <div className="table" key={`top-table-${i}`}>
                    <div className="table-side">
                      {tableSeats.slice(0, 3).map(renderSeat)}
                    </div>
                    <div className="table-middle"></div>
                    <div className="table-side">
                      {tableSeats.slice(3, 6).map(renderSeat)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Middle Layout */}
            <div className="window-row" style={{ marginTop: "40px", marginBottom: "20px" }}>
              {seats.slice(40, 50).map(renderSeat)}
            </div>

            <div className="middle-layout" style={{ margin: "20px 0" }}>
              {/* Left Window Seats (2 columns of 10) */}
              <div className="window-column-pair">
                <div className="window-column">
                  {seats.slice(50, 60).map(renderSeat)}
                </div>
                <div className="window-column">
                  {seats.slice(60, 70).map(renderSeat)}
                </div>
              </div>

              <div className="void-area">
                <div className="void-visual">
                </div>
              </div>

              {/* Right Window Seats (2 columns of 10) */}
              <div className="window-column-pair">
                <div className="window-column">
                  {seats.slice(70, 80).map(renderSeat)}
                </div>
                <div className="window-column">
                  {seats.slice(80, 90).map(renderSeat)}
                </div>
              </div>
            </div>

            <div className="window-row" style={{ marginTop: "20px", marginBottom: "40px" }}>
              {seats.slice(90, 100).map(renderSeat)}
            </div>

            {/* Bottom Tables */}
            <div className="table-row">
              {[0, 1, 2, 3, 4].map((i) => {
                const tableSeats = seats.slice(100 + i * 6, 106 + i * 6);
                if (tableSeats.length === 0) return null;

                return (
                  <div className="table" key={`bottom-table-${i}`}>
                    <div className="table-side">
                      {tableSeats.slice(0, 3).map(renderSeat)}
                    </div>
                    <div className="table-middle"></div>
                    <div className="table-side">
                      {tableSeats.slice(3, 6).map(renderSeat)}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
      
      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSeatForBooking(null);
        }}
        seat={selectedSeatForBooking}
        onConfirm={handleConfirmBooking}
        userId={userId}
      />
    </>
  );
}

export default Dashboard;