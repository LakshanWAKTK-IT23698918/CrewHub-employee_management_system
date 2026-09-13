import React from 'react';
import Box from '@mui/material/Box';

/**
 * The CrewHub monogram: a rounded-square badge with a teal-to-amber gradient
 * and a "C" mark. Used in the app bar and on the login screen so the brand
 * has one consistent visual anchor instead of a generic icon.
 */
function BrandMark({ size = 36 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0E7C7B 0%, #14A79A 55%, #E8A33D 100%)',
        boxShadow: '0 2px 8px rgba(14, 124, 123, 0.35)',
      }}
    >
      <Box
        component="span"
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: size * 0.52,
          color: '#ffffff',
          lineHeight: 1,
        }}
      >
        C
      </Box>
    </Box>
  );
}

export default BrandMark;
