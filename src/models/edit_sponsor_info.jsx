import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Box,
} from '@mui/material';
import axios from 'axios';
import API_CONFIG from '../constants/api_config';

const EditSponsorInfo = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    companyUsername: '',
    avatarUrl: '',
    companyName: '',
    companyPhoneNumberContact: '',
    companyEmailContact: '',
    companyAddress: '',
    businessDescription: '',
    companyDirectorName: '',
    companyTaxNumber: '',
    companyPoints: 0,
  });

  useEffect(() => {
    const fetchSponsorData = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/sponsor/get-by-username`, {
          params: { username },
        });
        setFormData(response.data);
      } catch (err) {
        console.error('Failed to fetch sponsor data:', err);
      }
    };

    if (open) fetchSponsorData();
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/sponsor/update/${formData.id}`, formData);
      alert('Sponsor information updated successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to update sponsor:', err);
      alert('Failed to update sponsor information.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Sponsor Information</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            name="companyUsername"
            value={formData.companyUsername}
            onChange={handleInputChange}
            disabled
          />
          <TextField
            label="Avatar URL"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleInputChange}
          />
          <TextField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone Number"
            name="companyPhoneNumberContact"
            value={formData.companyPhoneNumberContact}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="companyEmailContact"
            value={formData.companyEmailContact}
            onChange={handleInputChange}
          />
          <TextField
            label="Address"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleInputChange}
          />
          <TextField
            label="Business Description"
            name="businessDescription"
            value={formData.businessDescription}
            onChange={handleInputChange}
          />
          <TextField
            label="Director Name"
            name="companyDirectorName"
            value={formData.companyDirectorName}
            onChange={handleInputChange}
          />
          <TextField
            label="Tax Number"
            name="companyTaxNumber"
            value={formData.companyTaxNumber}
            disabled
          />
          <TextField
            label="Points"
            name="companyPoints"
            value={formData.companyPoints}
            onChange={handleInputChange}
            type="number"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSponsorInfo;
