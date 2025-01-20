import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { green } from '@mui/material/colors';
import axios from 'axios';
import API_CONFIG from '../../constants/api_config';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [newsfeeds, setNewsfeeds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrStats, setQrStats] = useState(null); // QR code statistics
  const [participants, setParticipants] = useState(0); // Participant statistics

  useEffect(() => {
    const fetchNewsfeeds = async () => {
      setLoading(true);
      try {
        const sponsorId = localStorage.getItem('sponsorId');
        if (!sponsorId) throw new Error('Sponsor ID not found in localStorage');

        // Fetch newsfeed
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/newsfeed/get-newsfeed-by-sponsor-id`,
          { params: { sponsorId } }
        );
        setNewsfeeds(response.data);

        // Fetch QR statistics
        const qrResponse = await axios.get(
          `${API_CONFIG.BASE_URL}/sponsor/qrcode/active/${sponsorId}`
        );
        setQrStats(qrResponse.data);

        // Calculate participants
        const participantCount = response.data.reduce(
          (total, feed) => total + (feed.pointForActivity || 0),
          0
        );
        setParticipants(participantCount);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsfeeds();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}/newsfeed/delete/${id}`);
      setNewsfeeds(newsfeeds.filter((newsfeed) => newsfeed.id !== id));
    } catch (err) {
      console.error('Failed to delete newsfeed:', err);
      alert('Failed to delete newsfeed.');
    }
  };

  const handleCreateActivity = () => {
    alert('Redirect to Create Activity form.');
    // Navigate to a Create Activity Form
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Activities
                </Typography>
                <Grid container spacing={2}>
                  {newsfeeds.map((newsfeed) => (
                    <Grid item xs={12} md={6} lg={4} key={newsfeed.id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={newsfeed.mediaUrls?.[0] || '/placeholder.png'}
                          alt="Newsfeed"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5">
                            {newsfeed.content}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Points: {newsfeed.pointForActivity || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Start: {new Date(newsfeed.startedAt).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            End: {new Date(newsfeed.endedAt).toLocaleString()}
                          </Typography>
                        </CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            padding: 2,
                          }}
                        >
                          <Button variant="outlined" color="primary">
                            Update
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleDelete(newsfeed.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Statistics</Typography>
                <Box sx={{ mb: 3 }}>
                  <Chart
                    options={{
                      labels: ['QR Scanned', 'Not Scanned'],
                    }}
                    series={[qrStats?.scanned || 0, qrStats?.notScanned || 0]}
                    type="donut"
                    width="100%"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
