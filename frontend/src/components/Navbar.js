import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useLocation } from "react-router-dom";
function Navbar() {

  const navigate = useNavigate();
  const location=useLocation();
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToMyBooking = () => {
    navigate("/my-booking");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (

    <div className="navbar">

      <div className="navbar-title">
        Library Seat Reservation
      </div>

      <div className="navbar-actions">

        {location.pathname !== "/my-booking" && (
  <>
    <button className="nav-btn" onClick={() => navigate("/my-booking")}>My Booking</button>
  </>
)}
        <button
  className="nav-btn"
  onClick={() => navigate("/")}
>
Home
</button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

    </div>

  );
}

export default Navbar;