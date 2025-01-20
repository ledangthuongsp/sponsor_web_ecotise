import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Home, Task, Message, Settings, ExitToApp } from '@mui/icons-material';

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: '#F4F5F7',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >

      {/* Menu Items */}
      <List>
        <ListItem button>
          <ListItemIcon>
            <Home sx={{ color: '#4263EB' }} />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Task sx={{ color: '#4263EB' }} />
          </ListItemIcon>
          <ListItemText primary="Task" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Message sx={{ color: '#4263EB' }} />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Settings sx={{ color: '#4263EB' }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>

      {/* Logout */}
      <List>
        <ListItem button>
          <ListItemIcon>
            <ExitToApp sx={{ color: '#FF6B6B' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: '#FF6B6B' }} />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
