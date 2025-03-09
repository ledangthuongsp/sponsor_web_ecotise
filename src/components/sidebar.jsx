import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Home, Task, ExitToApp, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../constants/api_config';

const Sidebar = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchSponsorPoints = async () => {
      try {
        const sponsorId = localStorage.getItem('sponsorId');
        if (!sponsorId) throw new Error('Sponsor ID not found');
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/sponsor/get-newsfeed-by-sponsor-id`,
          { params: { sponsorId } }
        );
        setPoints(response.data); // Cập nhật tổng điểm
      } catch (error) {
        console.error('Failed to fetch sponsor points:', error);
      }
    };

    fetchSponsorPoints();
  }, []);

  return (
    <Box sx={{ width: 240, backgroundColor: '#F4F5F7', height: '100vh', p: 2 }}>
      {/* Hiển thị tổng điểm */}
      <Typography variant="h6" align="center" gutterBottom>
        Total Points: {points}
      </Typography>

      {/* Menu */}
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>
        <ListItem button onClick={() => navigate('/activity')}>
          <ListItemIcon>
            <Task />
          </ListItemIcon>
          <ListItemText primary="Activity" />
        </ListItem>
        <ListItem button onClick={() => navigate('/donations')}>
          <ListItemIcon>
            <Favorite />
          </ListItemIcon>
          <ListItemText primary="Donations" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
