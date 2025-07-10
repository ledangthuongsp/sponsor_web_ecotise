import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/icon-logo.svg";
import background from "../../assets/images/background.svg";
import "../../styles/sign_in.css";
import { useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../constants/APIConstants";
export default function SignIn() {
  const location = useLocation();
  const role = location.state?.role || "admin"; // Default role is admin
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let endpoint = "";
    let fetchOptions = {
      method: "POST",
      headers: {},
    };

    if (role === "admin") {
      // Admin login
      endpoint = `${BASE_API_URL}/auth/signin`;
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify({ username, password });
    } else if (role === "sponsor") {
      // Sponsor login
      try {
        const response = await axios.post(
          `${BASE_API_URL}/sponsor/login`,
          null,
          { params: { username, password } }
        );
        if (response.data.trim() === "Login successful") {
          localStorage.setItem("role", "SPONSOR");
          localStorage.setItem("username", username); // Store username
          const response = await axios.get(`${BASE_API_URL}/sponsor/get-by-username`, {
          params: { username }
        });
        const sponsorId = response.data.id;
        localStorage.setItem("sponsorId", sponsorId);
          navigate("/dashboard-sponsor"); // Redirect to sponsor dashboard
        } else {
          setError(response.data || "Login failed");
        }
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
      return;
    } else {
      setError("Invalid role");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(endpoint, fetchOptions);
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.role === "ADMIN") {
        // Admin login success
        localStorage.setItem("role", "ADMIN");
        localStorage.setItem("username", username);
        navigate("/dashboard-admin"); // Redirect to admin dashboard
      } else {
        setError("You do not have access with this account.");
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <img src={logo} alt="Ecotise" className="signin-logo"/>
        <h1 className="signin-logo">Ecotise</h1>
        <h2 className="signin-title">Welcome Back</h2>
        <p className="signin-role-text">You are signing in as: <b>{role}</b></p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Your username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password" className="password-label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="at least 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
          {error && <div className="signin-error">{error}</div>}
          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>

      <div className="signin-right">
        <img src={background} alt="Background" />
      </div>
    </div>
  );
}
