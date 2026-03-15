import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/auth.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      toast.success(res.data.message);

      // clear inputs
      setName("");
      setEmail("");
      setPassword("");

      // redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      toast.error("Signup failed");

    }

  };

  return (

  <div className="auth-page">

    <div className="auth-card">

      <h2 className="auth-title">Signup</h2>

      <form onSubmit={handleSignup}>

        <div className="input-group">
          <input
            type="text"
            value={name}
            placeholder=" "
            onChange={(e) => setName(e.target.value)}
          />
          <label>Name</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            value={email}
            placeholder=" "
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            value={password}
            placeholder=" "
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <button className="auth-btn" type="submit">Signup</button>

        <p className="auth-switch">
          Already have an account? <a href="/login">Login</a>
        </p>

      </form>

    </div>
  </div>

  );

}

export default Signup;