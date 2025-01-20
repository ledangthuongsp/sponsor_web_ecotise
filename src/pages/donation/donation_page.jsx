import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import axios from 'axios';
import API_CONFIG from '../../constants/api_config';

const DonationsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [donations, setDonations] = useState({
    ongoing: [],
    upcoming: [],
    ended: [],
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const ongoing = await axios.get(`${API_CONFIG.BASE_URL}/donate/ongoing`);
        const upcoming = await axios.get(`${API_CONFIG.BASE_URL}/donate/upcoming`);
        const ended = await axios.get(`${API_CONFIG.BASE_URL}/donate/ended`);
        setDonations({
          ongoing: ongoing.data,
          upcoming: upcoming.data,
          ended: ended.data,
        });
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      }
    };

    fetchDonations();
  }, []);

  const handleRequestJoin = async (donationId) => {
    try {
      // TODO: Replace this with actual API call to request joining donation
      alert(`Requested to join donation ID: ${donationId}`);
    } catch (error) {
      console.error('Failed to request joining donation:', error);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterDonations = (status) => {
    if (status === 'ongoing') return donations.ongoing;
    if (status === 'upcoming') return donations.upcoming;
    if (status === 'ended') return donations.ended;
    return [];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Donations
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Ongoing" />
        <Tab label="Upcoming" />
        <Tab label="Ended" />
      </Tabs>

      {/* Donation List */}
      <Box>
        {filterDonations(
          tabValue === 0 ? 'ongoing' : tabValue === 1 ? 'upcoming' : 'ended'
        ).length > 0 ? (
          filterDonations(
            tabValue === 0 ? 'ongoing' : tabValue === 1 ? 'upcoming' : 'ended'
          ).map((donation) => (
            <Card key={donation.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{donation.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {donation.description}
                </Typography>
              </CardContent>
              <CardActions>
                {tabValue === 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRequestJoin(donation.id)}
                  >
                    Request to Join
                  </Button>
                )}
              </CardActions>
              <Divider />
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No donations to show.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DonationsPage;
