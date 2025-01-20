import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import axios from 'axios';
import API_CONFIG from '../../constants/api_config';
import Sidebar from '../../components/sidebar'; // Import Sidebar

const ActivityPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [activities, setActivities] = useState({ started: [], upcoming: [], ended: [] });
  const [qrCodes, setQrCodes] = useState({}); // State lưu trữ mã QR đã generate

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const sponsorId = localStorage.getItem('sponsorId');
        if (!sponsorId) throw new Error('Sponsor ID not found');

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/sponsor/get-newsfeed-by-sponsor-id-with-status`,
          { params: { sponsorId } }
        );

        setActivities(response.data); // Set fetched data into state
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };

    fetchActivities();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGenerateCode = async (sponsorId, points, newsfeedId) => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/sponsor/qrcode/generate`, null, {
        params: {
          sponsorId,
          points,
          newsfeedId,
        },
      });

      // Lưu mã QR vào state
      setQrCodes((prevQrCodes) => ({
        ...prevQrCodes,
        [newsfeedId]: response.data.qrCodeUrl, // Lưu URL QR code theo newsfeedId
      }));

      alert('QR Code Generated!');
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  const handleRefreshCode = async (sponsorId, qrCodeId) => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/sponsor/qrcode/refresh`, null, {
        params: {
          sponsorId,
          qrCodeId,
        },
      });

      // Cập nhật mã QR đã được làm mới
      setQrCodes((prevQrCodes) => ({
        ...prevQrCodes,
        [qrCodeId]: response.data.qrCodeUrl, // Lưu URL QR code theo qrCodeId
      }));

      alert('QR Code Refreshed!');
    } catch (error) {
      console.error('Failed to refresh QR code:', error);
      alert('Failed to refresh QR code');
    }
  };

  const filterActivities = (status) => {
    if (status === 'upcoming') return activities.upcoming;
    if (status === 'started') return activities.started;
    if (status === 'ended') return activities.ended;
    return [];
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Activities
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
          <Tab label="Upcoming" />
          <Tab label="Started" />
          <Tab label="Ended" />
        </Tabs>

        {/* Activity List */}
        <Box>
          {filterActivities(
            tabValue === 0 ? 'upcoming' : tabValue === 1 ? 'started' : 'ended'
          ).length > 0 ? (
            filterActivities(
              tabValue === 0 ? 'upcoming' : tabValue === 1 ? 'started' : 'ended'
            ).map((activity) => (
              <Card key={activity.id} sx={{ mb: 2 }}>
                {/* Hiển thị hình ảnh */}
                {activity.mediaUrls && activity.mediaUrls.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={activity.mediaUrls[0]} // Hiển thị ảnh đầu tiên
                    alt="Activity Image"
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{activity.content}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Starts at: {new Date(activity.startedAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ends at: {new Date(activity.endedAt).toLocaleString()}
                  </Typography>
                </CardContent>

                {/* Nút hành động cho tab Ended */}
                {tabValue === 2 && (
                  <>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleGenerateCode(
                            activity.sponsorId,
                            activity.pointForActivity,
                            activity.id
                          )
                        }
                      >
                        Generate Code
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          handleRefreshCode(activity.sponsorId, activity.id)
                        }
                      >
                        Refresh Code
                      </Button>
                    </CardActions>

                    {/* Hiển thị mã QR code đã được generate */}
                    {qrCodes[activity.id] && (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <img
                          src={qrCodes[activity.id]}
                          alt="Generated QR Code"
                          style={{ maxWidth: '200px', marginTop: '10px' }}
                        />
                      </Box>
                    )}
                  </>
                )}
                <Divider />
              </Card>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No activities to show.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ActivityPage;
