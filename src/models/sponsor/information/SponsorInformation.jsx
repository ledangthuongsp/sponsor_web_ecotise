import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSponsorById, updateSponsor } from "../../../services/sponsor/SponsorService";
import "../../../styles/sponsor_information.css";

const SponsorInformationPage = () => {
  const navigate = useNavigate();
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    contactPhone: "",
    companyAddress: "",
    businessDescription: "",
    companyUsername: "",
    companyDirectorName: "",
    companyTaxNumber: "",
    companyPoints: "",
    avatarUrl: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch sponsor data
  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        const sponsorId = localStorage.getItem("sponsorId"); // Get ID from localStorage
        if (!sponsorId) {
          throw new Error("Sponsor ID not found");
        }
        const fetchedSponsor = await getSponsorById(sponsorId);
        setSponsor(fetchedSponsor);
        setFormData({
          companyName: fetchedSponsor.companyName,
          email: fetchedSponsor.companyEmailContact,
          contactPhone: fetchedSponsor.companyPhoneNumberContact,
          companyAddress: fetchedSponsor.companyAddress,
          businessDescription: fetchedSponsor.businessDescription,
          companyUsername: fetchedSponsor.companyUsername,
          companyDirectorName: fetchedSponsor.companyDirectorName,
          companyTaxNumber: fetchedSponsor.companyTaxNumber,
          companyPoints: fetchedSponsor.companyPoints,
          avatarUrl: fetchedSponsor.avatarUrl,
        });
      } catch (err) {
        setError("Failed to load sponsor information.");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsor();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const sponsorId = localStorage.getItem("sponsorId");
      if (!sponsorId) {
        throw new Error("Sponsor ID not found");
      }
      await updateSponsor(sponsorId, formData);
      setIsEditing(false); // Exit edit mode
      navigate("/sponsor-dashboard");
    } catch (err) {
      setError("Failed to update sponsor information.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      ...formData,
      avatarUrl: sponsor.avatarUrl,
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="sponsor-information-page">
      <h1>Sponsor Information</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="avatar-section">
        {/* Show Avatar Image */}
        {isEditing ? (
          <div>
            <input type="file" onChange={handleFileChange} />
            {formData.avatarUrl && <img src={formData.avatarUrl} alt="Preview Avatar" className="avatar-img" />}
          </div>
        ) : (
          <img src={formData.avatarUrl || "/default-avatar.png"} alt="Sponsor Avatar" className="avatar-img" />
        )}
      </div>

      <form onSubmit={handleUpdate} className="sponsor-form">
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactPhone">Contact Phone</label>
          <input
            type="text"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyAddress">Company Address</label>
          <input
            type="text"
            id="companyAddress"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="businessDescription">Business Description</label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            value={formData.businessDescription}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyPoints">Company Points</label>
          <input
            type="number"
            id="companyPoints"
            name="companyPoints"
            value={formData.companyPoints}
            disabled
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyUsername">Company Username</label>
          <input
            type="text"
            id="companyUsername"
            name="companyUsername"
            value={formData.companyUsername}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyDirectorName">Director Name</label>
          <input
            type="text"
            id="companyDirectorName"
            name="companyDirectorName"
            value={formData.companyDirectorName}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyTaxNumber">Tax Number</label>
          <input
            type="text"
            id="companyTaxNumber"
            name="companyTaxNumber"
            value={formData.companyTaxNumber}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="action-buttons">
          {isEditing ? (
            <>
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? "Updating..." : "Save Changes"}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="edit-button">
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SponsorInformationPage;
