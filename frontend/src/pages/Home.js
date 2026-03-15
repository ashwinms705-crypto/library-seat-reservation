import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { useState } from "react";

function Home() {

  const navigate = useNavigate();
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const [openMenu, setOpenMenu] = useState(false);
    return (

    <div className="home">

      {/* Navbar */}

      <nav className="home-navbar">

  <div className="logo-area">

    <div className="logo">
      Library Seat Reservation
    </div>

    {userName && (
      <div className="welcome-inline">
        Hi {userName} 👋
      </div>
    )}

  </div>

  <div className="nav-links">

  {!userName && (
    <>
      <button onClick={() => navigate("/login")}>
        Login
      </button>

      <button onClick={() => navigate("/signup")}>
        Signup
      </button>
    </>
  )}

  {userName && (

  <div className="profile-menu">

    <div
      className="profile-name"
      onClick={() => setOpenMenu(!openMenu)}
    >
      👤 {userName} ▼
    </div>

    {openMenu && (

      <div className="dropdown">

        <div
          className="dropdown-item"
          onClick={() => navigate("/profile")}
        >
          Profile
        </div>

        <div
          className="dropdown-item"
          onClick={() => navigate("/dashboard")}
        >
          Reserve Seat
        </div>

        <div
          className="dropdown-item"
          onClick={() => {
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            navigate("/");
          }}
        >
          Logout
        </div>

      </div>

    )}

  </div>

)}

</div>

      </nav>


      {/* HERO SECTION */}

      <div className="hero">

        <div className="hero-text">

          <h1>
            Find Your Perfect Study Spot
          </h1>

          <p>
            Reserve library seats in real-time and focus on what truly matters — learning.
          </p>

          <button
            className="cta-btn"
            onClick={() => {

  const userId = localStorage.getItem("userId");

  if(userId){
    navigate("/dashboard");
  } else {
    navigate("/signup");
  }

}}
          >
            Start Reserving
          </button>

        </div>


        <div className="hero-illustration">

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="study illustration"
          />

        </div>

      </div>


      {/* INSPIRATIONAL QUOTE */}

            <div className="quote-section">

        <p className="quote">
            "A room without books is like a body without a soul."
        </p>

        <span className="quote-author">
            — Marcus Tullius Cicero
        </span>

        <p className="library-humor">
            🤫 People come to the library to study…  
            but somehow the syllabus gets ignored and the gossip gets completed.
        </p>

        </div>


      {/* FEATURES */}

      <div className="features">

        <div className="feature-card">
          <h3>Real-Time Seat Availability</h3>
          <p>Instantly see which seats are available or booked.</p>
        </div>

        <div className="feature-card">
          <h3>Flexible Time Slot Booking</h3>
          <p>Reserve seats for specific study sessions.</p>
        </div>

        <div className="feature-card">
          <h3>Manage Reservations</h3>
          <p>View and cancel your bookings anytime.</p>
        </div>

      </div>

    </div>

  );

}

export default Home;