import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import toast from "react-hot-toast";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      console.log(res.data)
      // store userId
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", res.data.email);
      // optional (safe if backend returns name)
      if(res.data.name){
        localStorage.setItem("userName", res.data.name);
      }

      toast.success("Login successful");

      // clear inputs
      setEmail("");
      setPassword("");

      // go to home page
      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (error) {

      toast.error("Invalid email or password");

    }

  };

  return (

  <div className="auth-page">
    <div className="auth-home">
  <button onClick={() => navigate("/")}>
    ← Home
  </button>
</div>

    <div className="auth-card">

      <h2 className="auth-title">Login</h2>

      <form onSubmit={handleLogin}>

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

        <button className="auth-btn" type="submit">
          Login
        </button>

        <p className="auth-switch">
          Don't have an account? <a href="/signup">Signup</a>
        </p>

      </form>

    </div>

  </div>

);

}

export default Login;