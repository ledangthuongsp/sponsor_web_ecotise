import React, { useState } from 'react';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../constants/api_config';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/sponsor/login`,
        null,
        { params: { username, password } }
      );

      console.log('Login successful:', response.data);
      localStorage.setItem('username', username); // Lưu username vào localStorage
      // Lưu sponsorId vào localStorage
    const sponsor = await axios.get(
      `${API_CONFIG.BASE_URL}/sponsor/get-by-username`,
      { params: { username } }
    );
    localStorage.setItem('sponsorId', sponsor.data.id);
      navigate('/dashboard'); // Điều hướng đến Dashboard
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: green[50],
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: 300,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            color: green[700],
            fontWeight: 'bold',
            marginBottom: 2,
          }}
        >
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" sx={{ fontSize: 14, marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: green[500],
              color: '#fff',
              '&:hover': { backgroundColor: green[700] },
              marginTop: 2,
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignIn;
