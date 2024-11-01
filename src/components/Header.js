import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PeopleIcon from '@mui/icons-material/People';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" component={Link} to="/">
            <PeopleIcon />
          </IconButton>
          <Button color="inherit" component={Link} sx={{fontWeight:"bold", fontSize:20}} to="/">GroupiFy</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {currentUser ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {currentUser.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
