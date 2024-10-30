import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import DocumentEditor from './components/DocumentEditor'; // Import DocumentEditor
import theme from './styles/theme';

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

  if (loading) return <div>Loading...</div>; // Show loading indicator while auth state is being resolved

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <Signup />} />
      <Route path="/" element={<ProtectedRoute element={<><Header /><Home /></>} />} />
      <Route path="/document/:id" element={<ProtectedRoute element={<><Header /><DocumentEditor /></>} />} /> {/* Add route for DocumentEditor */}
    </Routes>
  );
}

export default App;
