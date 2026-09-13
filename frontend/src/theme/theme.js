import { createTheme } from '@mui/material/styles';

/**
 * CrewHub theme.
 *
 * Palette: harbor teal (brand primary) + signal amber (single reserved
 * accent) on an ink-navy / soft-mist neutral scale — chosen instead of the
 * default MUI blue so the app has its own identity rather than looking like
 * every other admin dashboard.
 *
 * Type: Space Grotesk for headings/brand (a little personality on titles
 * and big numbers), Inter for everything else (body copy, form fields,
 * dense table data — it's built for small sizes and data-heavy UI).
 */

const TEAL = '#0E7C7B';
const TEAL_DARK = '#0B6362';
const AMBER = '#E8A33D';

export function getTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: TEAL,
        dark: TEAL_DARK,
        light: '#3FA09E',
        contrastText: '#ffffff',
      },
      secondary: {
        main: AMBER,
        contrastText: '#1F2A33',
      },
      background: {
        default: isDark ? '#0B0F17' : '#F3F5F4',
        paper: isDark ? '#161D2B' : '#ffffff',
      },
      text: {
        primary: isDark ? '#E7ECEF' : '#1F2A33',
        secondary: isDark ? '#93A0AC' : '#5B6B74',
      },
      divider: isDark ? 'rgba(231,236,239,0.10)' : 'rgba(16,24,40,0.08)',
    },
    typography: {
      fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
      h1: { fontFamily: '"Space Grotesk", sans-serif' },
      h2: { fontFamily: '"Space Grotesk", sans-serif' },
      h3: { fontFamily: '"Space Grotesk", sans-serif' },
      h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
      h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
      button: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 10,
            paddingLeft: 16,
            paddingRight: 16,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 14px rgba(14, 124, 123, 0.28)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 16,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'medium',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
          },
          columnHeaders: {
            backgroundColor: isDark ? 'rgba(14,124,123,0.12)' : 'rgba(14,124,123,0.06)',
            borderRadius: 0,
          },
          columnHeaderTitle: {
            fontWeight: 700,
          },
        },
      },
    },
  });
}

export default getTheme;
