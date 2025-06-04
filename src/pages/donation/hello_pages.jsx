import { useNavigate } from "react-router-dom";
import logo from "../../assets/icons/icon-logo.svg";
import background from "../../assets/images/background.svg";
import "../../styles/hello.css";

export default function HelloPage() {
  const navigate = useNavigate();

  return (
    <div className="hello-container">
      <div className="hello-left">
        <img src={logo} alt="Ecotise" className="hello-logo" />
        <h1 className="hello-logo">Ecotise</h1>
        <h2 className="hello-title">Hello!</h2>
        <p>Choose your login option</p>

        <button
          className="hello-btn admin-btn"
          onClick={() => navigate("/signin", { state: { role: "admin" } })}
        >
          Admin
          <p className="hello-text-white">Access the admin portal here.</p>
          <span className="arrow">➔</span>
        </button>

        <button
          className="hello-btn sponsor-btn"
          onClick={() => navigate("/signin", { state: { role: "sponsor" } })}
        >
          Sponsor
          <p className="hello-text-black">Exclusive to sponsor only.</p>
          <span className="arrow">➔</span>
        </button>
      </div>

      <div className="hello-right">
        <img src={background} alt="Background" />
      </div>
    </div>
  );
}