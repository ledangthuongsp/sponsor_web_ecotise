import "../../styles/sponsor_register.css";
import { useState } from "react";
import axios from 'axios';
import { BASE_API_URL } from '../../constants/APIConstants';
import { useNavigate } from 'react-router-dom';

export default function SponsorRegister() {
  const [formData, setFormData] = useState({
    companyName: '',
    natureOfBusiness: '',
    address: '',
    postcode: '',
    contactName: '',
    contactPhone: '',
    email: '',
    taxNumber: '',
    idea: '',
    file: null,
  });

  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      file: file,
    }));
  };

  const handleEmailValidation = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/sponsor/check-email`, {
        params: { email: formData.email }
      });

      if (response.data.exists) {
        setEmailError('Email is already registered. Please use a different one.');
        return false;
      } else {
        setEmailError('');
        return true;
      }
    } catch (error) {
      console.error('Error validating email:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.natureOfBusiness || !formData.email) {
      setFormError('All required fields must be filled out');
      return;
    }

    const isEmailValid = await handleEmailValidation();
    if (!isEmailValid) return;

    const formDataWithFile = new FormData();
    formDataWithFile.append('companyName', formData.companyName);
    formDataWithFile.append('natureOfBusiness', formData.natureOfBusiness);
    formDataWithFile.append('address', formData.address);
    formDataWithFile.append('postcode', formData.postcode);
    formDataWithFile.append('contactName', formData.contactName);
    formDataWithFile.append('contactPhone', formData.contactPhone);
    formDataWithFile.append('email', formData.email);
    formDataWithFile.append('taxNumber', formData.taxNumber);
    formDataWithFile.append('idea', formData.idea);

    if (formData.file) {
      formDataWithFile.append('file', formData.file);
    }

    try {
      const response = await axios.post(`${BASE_API_URL}/sponsor/create`, formDataWithFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        alert("Registration successful. Your status is pending.");
        navigate('/landingpage');
      }
    } catch (error) {
      console.error('Error submitting sponsor registration', error);
      alert('Registration failed. Please try again later.');
    }
  };

  return (
    <section className="sponsor-register-section">
      <h2 className="title">Sponsor Register</h2>
      <p className="subtitle">
        If you want to donate or support us, let's fill the application below.
      </p>

      {formError && <div className="error-message">{formError}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Your Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="natureOfBusiness"
          placeholder="Nature of Business"
          value={formData.natureOfBusiness}
          onChange={handleChange}
          required
        />
        <div className="input-group">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="postcode"
            placeholder="Postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          name="contactName"
          placeholder="Contact Name"
          value={formData.contactName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contactPhone"
          placeholder="Contact Phone"
          value={formData.contactPhone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {emailError && <div className="error-message">{emailError}</div>}
        <input
          type="text"
          name="taxNumber"
          placeholder="Tax Number"
          value={formData.taxNumber}
          onChange={handleChange}
        />
        <textarea
          name="idea"
          placeholder="Let's talk about your idea"
          rows={4}
          value={formData.idea}
          onChange={handleChange}
        />

        {/* File input */}
        <label className="upload-label">
          Upload Additional file
          <input type="file" style={{ display: "none" }} onChange={handleFileChange} />
        </label>

        {/* Display the uploaded file name */}
        {formData.file && (
          <div className="file-info">
            <span>File Selected: {formData.file.name}</span>
          </div>
        )}

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>
    </section>
  );
}
