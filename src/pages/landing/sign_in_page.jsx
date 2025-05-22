import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/icons/icon-logo.svg";
import background from "../../assets/images/background.svg";
import "../../styles/sign_in.css";

export default function SignIn() {
  const location = useLocation();
  const role = location.state?.role || "admin";

  return (
    <div className="signin-container">
      <div className="signin-left">
        <img src={logo} alt="Ecotise" className="signin-logo" />
        <h1 className="signin-logo">Ecotise</h1>
        <h2 className="signin-title">Welcome Back</h2>
        <p className="signin-role-text">You are signing in as: <b>{role}</b></p>

        <form className="signin-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Example@email.com"
            required
          />
          <label htmlFor="password" className="password-label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="at least 8 characters"
            required
          />
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
          <button type="submit" className="signin-button">
            Sign in
          </button>
        </form>
      </div>

      <div className="signin-right">
        <img src={background} alt="Background" />
      </div>
    </div>
  );
}
