import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import API_CONFIG from '../constants/api_config';
import logo from '../assets/logo.png';

const Header = () => {
  const [open, setOpen] = useState(false); // Trạng thái mở/đóng Dialog
  const [sponsorInfo, setSponsorInfo] = useState(null); // Lưu thông tin sponsor
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [success, setSuccess] = useState(''); // Thông báo thành công
  const [error, setError] = useState(''); // Thông báo lỗi

  const sponsorId = localStorage.getItem('sponsorId'); // Lấy sponsorId từ localStorage

  // Fetch thông tin sponsor khi mở Dialog
  useEffect(() => {
    if (open) {
      const fetchSponsorInfo = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_CONFIG.BASE_URL}/sponsor/${sponsorId}`);
          setSponsorInfo(response.data);
        } catch (err) {
          console.error('Failed to fetch sponsor info:', err);
          setError('Failed to fetch sponsor info. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchSponsorInfo();
    }
  }, [open, sponsorId]);

  // Xử lý khi bấm Save
  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/sponsor/update/${sponsorId}`, sponsorInfo);
      setSuccess('Information updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update sponsor info:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật thông tin khi người dùng nhập liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSponsorInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        backgroundColor: '#fff',
        boxShadow: 1,
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img src={logo} alt="Logo" style={{ height: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          DNX
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={sponsorInfo?.avatarUrl || '/placeholder-avatar.png'}
          alt="User Avatar"
          onClick={() => setOpen(true)} // Mở Dialog khi bấm vào Avatar
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      {/* Dialog for Editing Sponsor Info */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sponsor Information</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            sponsorInfo && (
              <>
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={sponsorInfo.companyName}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
                <TextField
                  label="Email"
                  name="companyEmailContact"
                  value={sponsorInfo.companyEmailContact}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
                <TextField
                  label="Phone Number"
                  name="companyPhoneNumberContact"
                  value={sponsorInfo.companyPhoneNumberContact}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
                <TextField
                  label="Address"
                  name="companyAddress"
                  value={sponsorInfo.companyAddress}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
                <TextField
                  label="Tax Number"
                  name="companyTaxNumber"
                  value={sponsorInfo.companyTaxNumber}
                  fullWidth
                  margin="normal"
                  disabled // Luôn khóa
                />
                <TextField
                  label="Business Description"
                  name="businessDescription"
                  value={sponsorInfo.businessDescription}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Save'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Header;
