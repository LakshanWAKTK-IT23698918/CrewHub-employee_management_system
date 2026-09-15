import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  const [showPassword, setShowPassword] = useState(false);

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
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#0B1220' }}>
      {/* ==================== LEFT BRAND PANEL ==================== */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '46%',
          minWidth: 440,
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #0F172A 0%, #14273a 50%, #0B1220 100%)',
          color: '#ffffff',
          // Decorative background circles
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(232,163,61,0.18) 0%, transparent 70%)',
            top: -150,
            left: -150,
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
            bottom: -100,
            right: -100,
            pointerEvents: 'none',
          },
        }}
      >
        {/* Logo */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <BrandMark size={42} />
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: '1.55rem',
              letterSpacing: '-0.02em',
            }}
          >
            {APP_NAME}
          </Typography>
        </Stack>

        {/* Hero Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: 10,
              bgcolor: 'rgba(232,163,61,0.12)',
              border: '1px solid rgba(232,163,61,0.25)',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: '#E8A33D',
                boxShadow: '0 0 8px #E8A33D',
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: '#E8A33D', fontWeight: 600, letterSpacing: '0.05em' }}
            >
              EMPLOYEE MANAGEMENT
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: '2.4rem',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              mb: 2,
              maxWidth: 440,
              background: 'linear-gradient(135deg, #ffffff 0%, #B8C4D9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Your whole crew, organized in one place.
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '1rem',
              maxWidth: 400,
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Streamline your workforce management with a single, powerful
            dashboard built for modern teams.
          </Typography>

          {/* Feature List */}
          <Stack spacing={2.25} sx={{ mt: 4 }}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <Stack direction="row" spacing={2} alignItems="center" key={text}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: 'rgba(232,163,61,0.1)',
                    border: '1px solid rgba(232,163,61,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(232,163,61,0.2)',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 20, color: '#E8A33D' }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.925rem' }}
                >
                  {text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Footer */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 14, color: '#10B981' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>
            {APP_TAGLINE} System · Secure access
          </Typography>
        </Stack>
      </Box>

      {/* ==================== RIGHT FORM PANEL ==================== */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          background:
            'radial-gradient(circle at 50% 0%, rgba(232,163,61,0.06), transparent 60%), #0B1220',
        }}
      >
        <Box
          sx={{
            width: 400,
            maxWidth: '100%',
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Mobile Logo */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1.5,
              mb: 4,
              justifyContent: 'center',
            }}
          >
            <BrandMark size={36} />
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '1.3rem',
                color: '#ffffff',
              }}
            >
              {APP_NAME}
            </Typography>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '1.85rem',
                letterSpacing: '-0.02em',
                color: '#ffffff',
                mb: 1,
              }}
            >
              Welcome back
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              Sign in to manage your team's records.
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                bgcolor: 'rgba(239,68,68,0.1)',
                color: '#FCA5A5',
                border: '1px solid rgba(239,68,68,0.2)',
                '& .MuiAlert-icon': { color: '#FCA5A5' },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                mb: 0.75,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Username
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.1)',
                    transition: 'all 0.2s ease',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(232,163,61,0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#E8A33D',
                    borderWidth: '1.5px',
                    boxShadow: '0 0 0 3px rgba(232,163,61,0.1)',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255,255,255,0.3)',
                  opacity: 1,
                },
              }}
            />

            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                mb: 0.75,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.1)',
                    transition: 'all 0.2s ease',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(232,163,61,0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#E8A33D',
                    borderWidth: '1.5px',
                    boxShadow: '0 0 0 3px rgba(232,163,61,0.1)',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255,255,255,0.3)',
                  opacity: 1,
                },
              }}
            />

            {/* Sign In Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                py: 1.4,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #E8A33D 0%, #D97706 100%)',
                color: '#0B1220',
                boxShadow: '0 8px 24px rgba(232,163,61,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #F0B454 0%, #E8A33D 100%)',
                  boxShadow: '0 12px 32px rgba(232,163,61,0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(232,163,61,0.3)',
                  color: 'rgba(11,18,32,0.5)',
                },
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;