// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Changed to light mode
    primary: {
      main: '#330960', // New primary color
      light: '#330960', // Lighter version of the primary color for accent
      dark: '#330960', // Darker version of the primary color for depth
    },
    secondary: {
      main: '#ffffff', // White for highlights
      light: '#ffffff', // Lighter white for hover effects
      dark: '#ffffff', // Darker white for disabled states
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
      primary: '#330960', // Dark blue for primary text
      secondary: 'rgba(51, 9, 96, 0.7)', // Slightly lighter dark blue for secondary text
      disabled: 'rgba(51, 9, 96, 0.5)', // Lighter dark blue for disabled text
    },
    divider: 'rgba(0, 0, 0, 0.12)', // Divider color
  },
});

export default theme;
