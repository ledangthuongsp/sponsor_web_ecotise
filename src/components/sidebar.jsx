import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Task, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: 240, backgroundColor: '#F4F5F7' }}>
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
        <ListItem
          button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
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
