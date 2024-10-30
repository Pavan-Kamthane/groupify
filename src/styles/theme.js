// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Changed to light mode
    primary: {
      main: '#9C27B0', // Purple
      light: '#D5006D', // Lighter purple for gradient
      dark: '#6A1B9A', // Darker purple for gradient
    },
    secondary: {
      main: '#FFA726', // Orange
      light: 'rgba(255, 167, 38, 0.7)', 
      dark: 'rgba(255, 167, 38, 0.5)',
    },
    background: {
      default: '#ffffff', // White background
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: '#263238', // Dark grey text
      secondary: 'rgba(38, 50, 56, 0.7)',
      disabled: 'rgba(38, 50, 56, 0.5)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    error: {
      main: '#f44336', // Error color
    },
    warning: {
      main: '#FFA726',
    },
    info: {
      main: '#9C27B0', // Purple
    },
    success: {
      main: '#66bb6a',
    }
  }
});

export default theme;
