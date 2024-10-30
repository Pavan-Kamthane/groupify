import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, CssBaseline } from '@mui/material'; // Import CssBaseline for Material UI
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Adjust import paths as necessary
import Login from './pages/Login';
import Signup from './pages/Signup';
import theme from './styles/theme'; // Adjust import if your theme is in a different location

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Add CssBaseline to apply the theme globally */}
      <AuthProvider>
        <Router>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          </Routes>

        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
