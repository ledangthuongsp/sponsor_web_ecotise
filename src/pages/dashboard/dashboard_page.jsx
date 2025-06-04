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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import API_CONFIG from '../../constants/api_config';
import Sidebar from '../../components/sidebar';
import Header from '../../components/Header';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [newsfeeds, setNewsfeeds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrStats, setQrStats] = useState(null); // QR code statistics
  const [openDialog, setOpenDialog] = useState(false); // Modal state
  const [selectedNewsfeed, setSelectedNewsfeed] = useState(null); // Selected newsfeed for editing

  // Fetch data
  useEffect(() => {
    const fetchNewsfeeds = async () => {
      setLoading(true);
      try {
        const sponsorId = localStorage.getItem('sponsorId');
        if (!sponsorId) throw new Error('Sponsor ID not found in localStorage');

        // Fetch newsfeeds
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
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsfeeds();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}/newsfeed/delete/${id}`);
      setNewsfeeds(newsfeeds.filter((newsfeed) => newsfeed.id !== id));
    } catch (err) {
      console.error('Failed to delete newsfeed:', err);
      alert('Failed to delete newsfeed.');
    }
  };

  // Open Edit modal
  const handleOpenDialog = (newsfeed) => {
    setSelectedNewsfeed(newsfeed);
    setOpenDialog(true);
  };

  // Close Edit modal
  const handleCloseDialog = () => {
    setSelectedNewsfeed(null);
    setOpenDialog(false);
  };

  // Save changes to newsfeed
  const handleSave = async () => {
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/newsfeed/update/${selectedNewsfeed.id}`, selectedNewsfeed);
      setNewsfeeds((prev) =>
        prev.map((feed) =>
          feed.id === selectedNewsfeed.id ? selectedNewsfeed : feed
        )
      );
      alert('Newsfeed updated successfully!');
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to update newsfeed:', err);
      alert('Failed to update newsfeed.');
    }
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
                            Start: {newsfeed.startedAt ? new Date(newsfeed.startedAt).toLocaleString() : 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            End: {newsfeed.endedAt ? new Date(newsfeed.endedAt).toLocaleString() : 'N/A'}
                          </Typography>
                        </CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            padding: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleOpenDialog(newsfeed)}
                          >
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

      {/* Modal for Editing Newsfeed */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Edit Activity</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Content"
            margin="normal"
            value={selectedNewsfeed?.content || ''}
            onChange={(e) =>
              setSelectedNewsfeed((prev) => ({ ...prev, content: e.target.value }))
            }
          />
          <TextField
            fullWidth
            label="Points"
            margin="normal"
            type="number"
            value={selectedNewsfeed?.pointForActivity || 0}
            onChange={(e) =>
              setSelectedNewsfeed((prev) => ({
                ...prev,
                pointForActivity: Number(e.target.value),
              }))
            }
          />
          <TextField
            fullWidth
            label="Start Date"
            margin="normal"
            type="datetime-local"
            value={
              selectedNewsfeed?.startedAt
                ? new Date(selectedNewsfeed.startedAt).toISOString().slice(0, -1)
                : ''
            }
            onChange={(e) =>
              setSelectedNewsfeed((prev) => ({
                ...prev,
                startedAt: new Date(e.target.value).toISOString(),
              }))
            }
          />
          <TextField
            fullWidth
            label="End Date"
            margin="normal"
            type="datetime-local"
            value={
              selectedNewsfeed?.endedAt
                ? new Date(selectedNewsfeed.endedAt).toISOString().slice(0, -1)
                : ''
            }
            onChange={(e) =>
              setSelectedNewsfeed((prev) => ({
                ...prev,
                endedAt: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
