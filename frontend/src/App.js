import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';

import { getTheme } from './theme/theme';
import { APP_NAME, APP_TAGLINE } from './theme/brand';
import BrandMark from './components/BrandMark';
import EmployeesPage from './pages/EmployeesPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

const THEME_STORAGE_KEY = 'ems-theme';

function getInitialMode() {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'dark' || stored === 'light' ? stored : 'light';
}

// Bonus: JWT auth — shows the signed-in username and a logout button once
// authenticated; renders nothing on the login screen.
function AccountControls() {
  const { isAuthenticated, username, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <Box
        sx={{
          px: 1.25,
          py: 0.5,
          borderRadius: 5,
          bgcolor: 'rgba(255,255,255,0.08)',
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.92)', fontWeight: 500 }}>
          {username}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={logout}
        aria-label="Log out"
        title="Log out"
        sx={{ color: 'rgba(255,255,255,0.85)' }}
      >
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

function App() {
  const [mode, setMode] = useState(getInitialMode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
      return nextMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppBar
            position="static"
            elevation={0}
            sx={{
              background: 'linear-gradient(90deg, #101828 0%, #142235 100%)',
            }}
          >
            <Toolbar sx={{ gap: 1.5, py: 1 }}>
              <BrandMark size={34} />

              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                <Typography
                  component="div"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: '#ffffff',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {APP_NAME}
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: 'rgba(255,255,255,0.18)', my: 0.75, display: { xs: 'none', sm: 'block' } }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.62)', display: { xs: 'none', sm: 'block' } }}
                >
                  {APP_TAGLINE}
                </Typography>
              </Box>

              <AccountControls />
              <IconButton
                onClick={toggleMode}
                aria-label="Toggle light/dark theme"
                size="small"
                sx={{ color: 'rgba(255,255,255,0.85)' }}
              >
                {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Container maxWidth="lg">
                      <EmployeesPage />
                    </Container>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
