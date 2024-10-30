// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#233142',
      light: '#455d7a',
      dark: '#f95959',
    },
    secondary: {
      main: '#e3e3e3',
      light: 'rgba(227, 227, 227, 0.7)', 
      dark: 'rgba(227, 227, 227, 0.5)',
    },
    background: {
      default: '#233142',
      paper: '#455d7a',
    },
    text: {
      primary: '#e3e3e3',
      secondary: 'rgba(227, 227, 227, 0.7)',
      disabled: 'rgba(227, 227, 227, 0.5)',
    },
    divider: 'rgba(227, 227, 227, 0.12)',
    error: {
      main: '#f95959',
    },
    warning: {
      main: '#ffa726',
    },
    info: {
      main: '#29b6f6',
    },
    success: {
      main: '#66bb6a',
    }
  }
});

export default theme;
