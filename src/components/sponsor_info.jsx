import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import API_CONFIG from '../constants/api_config';

const SponsorInfo = () => {
  const [sponsorInfo, setSponsorInfo] = useState(null); // Lưu thông tin sponsor
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(''); // Thông báo lỗi
  const [success, setSuccess] = useState(''); // Thông báo thành công

  const sponsorId = localStorage.getItem('sponsorId'); // Lấy sponsorId từ localStorage

  // Fetch thông tin sponsor khi trang được tải
  useEffect(() => {
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
  }, [sponsorId]);

  // Xử lý khi bấm nút "Save"
  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/sponsor/update/${sponsorId}`, sponsorInfo);
      setSuccess('Information updated successfully!');
      setIsEditing(false); // Tắt chế độ chỉnh sửa
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

  if (loading && !sponsorInfo) {
    return <CircularProgress />; // Hiển thị vòng xoay khi đang tải dữ liệu
  }

  if (error && !sponsorInfo) {
    return <Typography color="error">{error}</Typography>; // Hiển thị lỗi nếu không tải được dữ liệu
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Sponsor Information
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {sponsorInfo && (
        <>
          <TextField
            label="Company Name"
            name="companyName"
            value={sponsorInfo.companyName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi bật chế độ chỉnh sửa
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
            disabled // Luôn bị khóa
          />
          <TextField
            label="Director Name"
            name="companyDirectorName"
            value={sponsorInfo.companyDirectorName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
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
                  onClick={() => setIsEditing(false)} // Hủy chỉnh sửa
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
                onClick={() => setIsEditing(true)} // Bật chế độ chỉnh sửa
              >
                Edit
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default SponsorInfo;
