import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';

import { useAuth } from '../auth/AuthContext';
import { APP_NAME, APP_TAGLINE } from '../theme/brand';
import BrandMark from '../components/BrandMark';

const FEATURES = [
  { icon: PeopleAltIcon, text: 'Every employee record in one organized roster' },
  { icon: SearchIcon, text: 'Find anyone instantly by name or department' },
  { icon: InsightsIcon, text: 'Headcount and payroll insights at a glance' },
];

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both a username and a password.');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '44%',
          minWidth: 420,
          p: 6,
          background:
            'radial-gradient(circle at 15% 15%, rgba(232,163,61,0.16), transparent 45%), linear-gradient(160deg, #101828 0%, #14273a 100%)',
          color: '#ffffff',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <BrandMark size={40} />
          <Typography
            sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1.5rem' }}
          >
            {APP_NAME}
          </Typography>
        </Stack>

        <Box>
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600,
              fontSize: '2rem',
              lineHeight: 1.25,
              mb: 2,
              maxWidth: 380,
            }}
          >
            Your whole crew, organized in one place.
          </Typography>
          <Stack spacing={2} sx={{ mt: 4 }}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <Stack direction="row" spacing={1.5} alignItems="center" key={text}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 18, color: '#E8A33D' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                  {text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          {APP_TAGLINE} System
        </Typography>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Box sx={{ width: 360, maxWidth: '100%' }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
            <BrandMark size={34} />
            <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
              {APP_NAME}
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to manage your team's records.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, mb: 1, py: 1.1 }}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
            <Box
              sx={{
                mt: 2,
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: 'action.hover',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
