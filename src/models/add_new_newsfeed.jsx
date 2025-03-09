import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { Close } from '@mui/icons-material';
import API_CONFIG from '../constants/api_config';
import dayjs from 'dayjs'; // Sử dụng dayjs để định dạng thời gian

const AddNewsfeedModel = ({ open, onClose, onSuccess }) => {
  const [content, setContent] = useState('');
  const [pointForActivity, setPointForActivity] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [endedAt, setEndedAt] = useState('');
  const [pollOptions, setPollOptions] = useState(['']); // Mặc định một poll option
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // Previews for images

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handleSubmit = async () => {
    try {
      const sponsorId = localStorage.getItem('sponsorId'); // Lấy sponsorId từ localStorage
      if (!sponsorId) throw new Error('Sponsor ID not found');
  
      const formData = new FormData();
      images.forEach((image) => formData.append('files', image)); // Chỉ gửi `files` trong FormData
  
      // Định dạng thời gian theo `yyyy-MM-dd HH:mm:ss`
      const formattedStartedAt = dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss');
      const formattedEndedAt = dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss');
  
      // Gửi params
      const params = {
        content,
        sponsorId,
        pointForActivity: pointForActivity || 0,
        startedAt: formattedStartedAt,
        endedAt: formattedEndedAt,
      };
  
      pollOptions.forEach((option) => {
        params[`pollOptions`] = option;
      });
  
      // Gửi request
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/newsfeed/create`,
        formData,
        {
          params, // Gửi params ngoài FormData
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      alert('Newsfeed added successfully!');
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Failed to add newsfeed:', error);
      alert('Failed to add newsfeed.');
    }
  };
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button variant="h6">Add Newsfeed</Button>
          <IconButton onClick={open}>
            <Close />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          type="number"
          variant="outlined"
          label="Points for Activity"
          value={pointForActivity}
          onChange={(e) => setPointForActivity(e.target.value)}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          type="datetime-local"
          variant="outlined"
          label="Start Time"
          value={startedAt}
          onChange={(e) => setStartedAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          type="datetime-local"
          variant="outlined"
          label="End Time"
          value={endedAt}
          onChange={(e) => setEndedAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Poll Options
        </Typography>
        {pollOptions.map((option, index) => (
          <TextField
            key={index}
            fullWidth
            variant="outlined"
            label={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handlePollOptionChange(index, e.target.value)}
            sx={{ mb: 2 }}
          />
        ))}
        <Button
          variant="contained"
          onClick={addPollOption}
          sx={{ mb: 3 }}
        >
          Add Poll Option
        </Button>
        <Button variant="contained" component="label" sx={{ mb: 3 }}>
          Upload Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {imagePreviews.map((preview, index) => (
            <Grid item xs={4} key={index}>
              <Box
                sx={{
                  width: '100%',
                  height: 100,
                  backgroundImage: `url(${preview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                  border: '1px solid #ddd',
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddNewsfeedModel;
