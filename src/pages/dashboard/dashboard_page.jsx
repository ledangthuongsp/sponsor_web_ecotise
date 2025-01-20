import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button, Grid } from '@mui/material';
import axios from 'axios';
import Sidebar from '../../components/sidebar'; // Import Sidebar Component
import Header from '../../components/header'; // Import Header Component
import API_CONFIG from '../../constants/api_config';

const Dashboard = () => {
  const [newsfeeds, setNewsfeeds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNewsfeeds = async () => {
      setLoading(true);
      try {
        const sponsorId = localStorage.getItem('sponsorId');
        if (!sponsorId) throw new Error('Sponsor ID not found in localStorage');

        const response = await axios.get(`${API_CONFIG.BASE_URL}/newsfeed/get-newsfeed-by-sponsor-id`, {
          params: { sponsorId },
        });

        setNewsfeeds(response.data);
      } catch (err) {
        console.error('Failed to fetch newsfeeds:', err);
        setError('Failed to fetch newsfeeds.');
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

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
        <Header />

        <Box sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container spacing={3}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: 2 }}>
                      <Button variant="outlined" color="primary" onClick={() => alert('Update feature not implemented')}>
                        Update
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => handleDelete(newsfeed.id)}>
                        Delete
                      </Button>
                      <Button variant="outlined" color="error">
                        End Activity
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
