import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import API_CONFIG from '../../constants/api_config';
import AddNewsfeedModel from '../../models/add_new_newsfeed';

const ActivityPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [activities, setActivities] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const sponsorId = localStorage.getItem('sponsorId');
        if (!sponsorId) throw new Error('Sponsor ID not found');
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/newsfeed/get-newsfeed-by-sponsor-id`,
          { params: { sponsorId } }
        );
        setActivities(response.data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };

    fetchActivities();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEndActivity = async (id) => {
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/newsfeed/end/${id}`);
      setActivities(activities.map((act) =>
        act.id === id ? { ...act, status: 'ended' } : act
      ));
    } catch (error) {
      console.error('Failed to end activity:', error);
    }
  };

  const filterActivities = (status) =>
    activities.filter((activity) => activity.status === status);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Activities
      </Typography>
      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        Add New Activity
      </Button>
      <AddNewsfeedModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => window.location.reload()}
      />
      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label="Upcoming" />
        <Tab label="Started" />
        <Tab label="Ended" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 &&
          filterActivities('upcoming').map((activity) => (
            <Box key={activity.id}>
              <Typography>{activity.content}</Typography>
            </Box>
          ))}
        {tabValue === 1 &&
          filterActivities('started').map((activity) => (
            <Box key={activity.id}>
              <Typography>{activity.content}</Typography>
              <Button
                variant="contained"
                onClick={() => handleEndActivity(activity.id)}
              >
                End Activity
              </Button>
            </Box>
          ))}
        {tabValue === 2 &&
          filterActivities('ended').map((activity) => (
            <Box key={activity.id}>
              <Typography>{activity.content}</Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default ActivityPage;
