import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import API_CONFIG from '../../constants/api_config';

interface User {
  username: string;
  password: string;
}

const Signin = () => {
  const [user, setUser] = useState<User>({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/sponsor/login`, null, {
        params: {
          username: user.username,
          password: user.password,
        },
      });
  
      console.log('Login successful:', response.data);
      // Lưu username vào localStorage
      localStorage.setItem('sponsorUsername', user.username);
  
      // Điều hướng tới Dashboard
      navigate(paths.dashboard);
    } catch (error: unknown) { // Sử dụng kiểu unknown
      if (axios.isAxiosError(error)) { // Kiểm tra nếu lỗi là từ Axios
        console.error('Login failed:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Invalid username or password.');
      } else {
        console.error('An unexpected error occurred:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Sign In
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Welcome back! Let's continue with,
      </Typography>

      <Stack component="form" mt={3} onSubmit={handleSubmit} direction="column" gap={2}>
        <TextField
          id="username"
          name="username"
          type="text"
          value={user.username}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Username"
          autoComplete="username"
          fullWidth
          required
          error={!!error}
          helperText={error && error.includes('username') ? error : ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:person" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Password"
          autoComplete="current-password"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:lock-key" />
              </InputAdornment>
            ),
          }}
        />

        <Stack mt={-2} alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox id="checkbox" name="checkbox" size="small" color="primary" />}
            label="Remember me"
          />
          <Link href={paths.forgotPassword} fontSize="body2.fontSize">
            Forgot password?
          </Link>
        </Stack>

        <Button type="submit" variant="contained" size="medium" fullWidth>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
        </Button>
      </Stack>

      {error && (
        <Typography mt={2} variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}

      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Don't have an account? <Link href={paths.signup}>Signup</Link>
      </Typography>
    </>
  );
};

export default Signin;
