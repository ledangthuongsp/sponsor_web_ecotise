import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { changePassword } from "../../services/sponsor/SponsorService"; // Ensure this is correct
import '../../styles/change_password.css'; // Import CSS styles for the page

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sponsorId = localStorage.getItem("sponsorId"); // Get sponsorId from localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    try {
      // Call the changePassword service
      const result = await changePassword(sponsorId, oldPassword, newPassword);

      if (result.success) {
        // Show a success message
        message.success("Your password has been updated successfully.", 3); // Message will show for 3 seconds

        // Clear sensitive data from localStorage or sessionStorage
        localStorage.removeItem("sponsorId");
        sessionStorage.clear();

        // Navigate to the sign-in page
        navigate("/signin", { replace: true });

        // Optionally disable back navigation after redirect
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
          window.history.pushState(null, "", window.location.href);
        };
      }
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <h1>Change Password</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="form-group">
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
