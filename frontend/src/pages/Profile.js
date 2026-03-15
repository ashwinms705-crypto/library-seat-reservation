import { useEffect, useState } from "react";
import axios from "axios";

function Profile(){

  const [booking,setBooking] = useState(null);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
   const userEmail = localStorage.getItem("userEmail");

   const floorPrefix = ["G","A","B","C"];
const floorName = ["Ground Floor","Floor 1","Floor 2","Floor 3"];
  useEffect(()=>{

    const fetchBooking = async()=>{

      try{

        const res = await axios.get(
          `http://localhost:5000/api/seats/my-booking/${userId}`
        );

        setBooking(res.data);

      }catch(error){
        console.log(error);
      }

    };

    fetchBooking();

  },[userId]);

  return(

    <div style={{padding:"40px",color:"white"}}>

      <h2>Profile</h2>

<p><strong>Name:</strong> {userName}</p>

<p><strong>Email:</strong> {userEmail}</p>

      {booking ? (

        <div>

          <h3>Your Booking</h3>

          {booking && (
  <div className="profile-booking">

    <p>
      <strong>Seat:</strong> {floorPrefix[booking.floor]}{booking.seatNumber}
    </p>

    <p>
      <strong>Floor:</strong> {floorName[booking.floor]}
    </p>

    <p>
      <strong>Date:</strong>{" "}
      {new Date(booking.startTime).toLocaleDateString()}
    </p>

    <p>
      <strong>Time Slot:</strong>{" "}
      {new Date(booking.startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
      {" - "}
      {new Date(booking.endTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
    </p>

  </div>
)}

        </div>

      ) : (

        <p>No active booking</p>

      )}

    </div>

  );

}

export default Profile;