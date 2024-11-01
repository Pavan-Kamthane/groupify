// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Changed to light mode
    primary: {
      main: '#9C27B0', // Purple
      light: '#D5006D', // Lighter purple for accent
      dark: '#6A1B9A', // Darker purple for depth
    },
    secondary: {
      main: '#FFA726', // Orange for highlights
      light: 'rgba(255, 167, 38, 0.7)', // Lighter orange for hover effects
      dark: 'rgba(255, 167, 38, 0.5)', // Darker orange for disabled states
    },
    error: {
      main: '#f44336', // Red for errors
    },
    warning: {
      main: '#FFA726', // Orange for warnings
    },
    info: {
      main: '#1976D2', // Blue for informational messages
    },
    success: {
      main: '#66bb6a', // Green for success messages
    },
    background: {
      default: '#ffffff', // White background
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: '#263238', // Dark grey for primary text
      secondary: 'rgba(38, 50, 56, 0.7)', // Slightly lighter grey for secondary text
      disabled: 'rgba(38, 50, 56, 0.5)', // Lighter grey for disabled text
    },
    divider: 'rgba(0, 0, 0, 0.12)', // Divider color
  },
});

export default theme;
