import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import API_CONFIG from '../../constants/api_config';

const DonationsPage = () => {
  const [donations, setDonations] = useState({
    ongoing: [],
    upcoming: [],
    ended: [],
  });
  const [tabValue, setTabValue] = useState(0);

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

  const handleRequest = (donationId) => {
    alert(`Request thành công cho donation ID: ${donationId}`);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderDonations = (donationsList) => (
    <Grid container spacing={2}>
      {donationsList.map((donation) => (
        <Grid item xs={12} sm={6} md={4} key={donation.id}>
          <Card>
            {/* Hiển thị ảnh donation */}
            {donation.coverImageUrl && donation.coverImageUrl.length > 0 && (
              <CardMedia
                component="img"
                height="200"
                image={donation.coverImageUrl[0]}
                alt="Donation Cover"
                style={{ objectFit: 'cover' }}
              />
            )}
            <CardContent>
              <Typography variant="h6">{donation.title}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {donation.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleRequest(donation.id)}
              >
                Request to Join
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
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

        {/* Hiển thị donation theo tab */}
        {tabValue === 0 && renderDonations(donations.ongoing)}
        {tabValue === 1 && renderDonations(donations.upcoming)}
        {tabValue === 2 && renderDonations(donations.ended)}
      </Box>
    </Box>
  );
};

export default DonationsPage;
