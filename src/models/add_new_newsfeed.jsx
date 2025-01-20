import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import API_CONFIG from '../constants/api_config';

const AddNewsfeedModel = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    content: '',
    pointForActivity: '',
    startedAt: '',
    endedAt: '',
    files: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files : value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const sponsorId = localStorage.getItem('sponsorId');
      if (!sponsorId) throw new Error('Sponsor ID not found');

      const data = new FormData();
      data.append('content', formData.content);
      data.append('pointForActivity', formData.pointForActivity);
      data.append('startedAt', formData.startedAt);
      data.append('endedAt', formData.endedAt);
      data.append('sponsorId', sponsorId);
      if (formData.files) {
        for (let i = 0; i < formData.files.length; i++) {
          data.append('files', formData.files[i]);
        }
      }

      await axios.post(`${API_CONFIG.BASE_URL}/newsfeed/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create newsfeed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 4, bgcolor: 'white', margin: 'auto', maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Add New Newsfeed
        </Typography>
        <TextField
          label="Content"
          name="content"
          fullWidth
          margin="normal"
          value={formData.content}
          onChange={handleChange}
        />
        <TextField
          label="Points"
          name="pointForActivity"
          type="number"
          fullWidth
          margin="normal"
          value={formData.pointForActivity}
          onChange={handleChange}
        />
        <TextField
          label="Start Date"
          name="startedAt"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={formData.startedAt}
          onChange={handleChange}
        />
        <TextField
          label="End Date"
          name="endedAt"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={formData.endedAt}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2 }}
        >
          Upload Files
          <input
            type="file"
            name="files"
            multiple
            hidden
            onChange={handleChange}
          />
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddNewsfeedModel;
