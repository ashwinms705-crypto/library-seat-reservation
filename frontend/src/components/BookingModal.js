import React, { useState, useEffect } from 'react';
import '../styles/bookingmodal.css';

const BookingModal = ({ isOpen, onClose, seat, onConfirm, userId }) => {

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const now = new Date();
  const myActiveBooking = seat?.bookings?.find(
  b => b.bookedBy?.toString() === userId?.toString()
);

  useEffect(() => {
    if (isOpen) {
      setStartTime('');
      setEndTime('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !seat) return null;

  const handleConfirm = () => {

    setError('');

    if (!startTime || !endTime) {
      setError('Please select both start and end times.');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      setError('End time must be after the start time.');
      return;
    }

    if (start < now) {
      setError('Cannot book a time in the past.');
      return;
    }

    onConfirm(seat._id, start.toISOString(), end.toISOString());

  };

  return (

    <div className="modal-overlay">

      <div className="modal-content">

        <h2>
          Book Seat {["G","A","B","C"][seat.floor]}{seat.seatNumber}
        </h2>

        {/* EXISTING BOOKINGS */}

        {seat.bookings && seat.bookings.length > 0 && (

          <div className="existing-bookings">

            <h4>Already Booked</h4>

            <ul className="booking-list">

              {seat.bookings.map((booking) => {

                const start = new Date(booking.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                const end = new Date(booking.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <li key={booking._id} className="booking-slot">
                    Time Slot: {start} - {end}
                  </li>
                );

              })}

            </ul>

          </div>

        )}

        {/* IF USER ALREADY BOOKED THIS SEAT */}

        {myActiveBooking ? (

  <div className="booking-success">

    <h3>Slot Booked</h3>

    <p>
      {new Date(myActiveBooking.startTime).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
      })}
      {"  -  "}
      {new Date(myActiveBooking.endTime).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
      })}
    </p>

    <p className="study-msg">
      Have a great study session 📚
    </p>

    <div className="modal-actions-center">
  <button className="confirm-btn" onClick={onClose}>
    Close
  </button>
</div>

  </div>

) : (

          <>
            <div className="form-group">

              <label>Start Time:</label>

              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />

            </div>

            <div className="form-group">

              <label>End Time:</label>

              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />

            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">

              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>

              <button className="confirm-btn" onClick={handleConfirm}>
                Set Time
              </button>

            </div>
          </>

        )}

      </div>

    </div>

  );

};

export default BookingModal;