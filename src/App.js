import { ThemeProvider, CssBaseline, Box, IconButton, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import DocumentEditor from './components/DocumentEditor'; // Import DocumentEditor
import theme from './styles/theme';
import PeopleIcon from '@mui/icons-material/People';
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/react"


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton color="inherit" sx={{ mr: 1 }}>
          <PeopleIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', fontSize: 24 }}
        >
          GroupiFy
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 18 }}>
        Loading...
      </Typography>
    </Box>
  );
// Show loading indicator while auth state is being resolved

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <><Login /><Footer /></>} />
      <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <><Signup /><Footer /></>} />
      <Route path="/" element={<ProtectedRoute element={<><Header /><Home /><Footer /></>} />} />
      <Route path="/document/:id" element={<ProtectedRoute element={<><Header /><DocumentEditor /><Footer /></>} />} /> {/* Add route for DocumentEditor */}
    </Routes>
  );
}

export default App;
