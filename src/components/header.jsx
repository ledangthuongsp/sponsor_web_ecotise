import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import axios from 'axios';
import API_CONFIG from '../constants/api_config';
import logo from '../assets/logo.png';

const Header = ({ onAvatarClick }) => {
  const [avatarUrl, setAvatarUrl] = useState('/path/to/default-avatar.png'); // Avatar mặc định
  const username = localStorage.getItem('username'); // Lấy username từ localStorage

  useEffect(() => {
    const fetchSponsorData = async () => {
      if (!username) return; // Nếu không có username, giữ avatar mặc định

      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/sponsor/get-by-username`, {
          params: { username },
        });

        const sponsorData = response.data;
        if (sponsorData.avatarUrl) {
          setAvatarUrl(sponsorData.avatarUrl); // Cập nhật avatar từ API
        }
      } catch (err) {
        console.error('Failed to fetch sponsor data:', err);
      }
    };

    fetchSponsorData();
  }, [username]);

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
        <IconButton>
          <Notifications />
        </IconButton>
        <Avatar
          src={avatarUrl} // Hiển thị avatar từ state
          alt="User Avatar"
          onClick={onAvatarClick} // Gọi hàm mở modal chỉnh sửa thông tin
          sx={{ cursor: 'pointer' }}
        />
      </Box>
    </Box>
  );
};

export default Header;
