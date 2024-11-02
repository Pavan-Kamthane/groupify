import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Tooltip, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'primary', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" component={Link} to="/" sx={{ mr: 1 }}>
              <PeopleIcon fontSize="large" />
            </IconButton>
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', fontSize: 24 }}
            >
              GroupiFy
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {currentUser ? (
              <>
                <Tooltip title="Your profile">
                  <Avatar sx={{ bgcolor: 'orange', mr: 2 }}>{currentUser.email.charAt(0).toUpperCase()}</Avatar>
                </Tooltip>
                <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
                  {currentUser.email}
                </Typography>
                <Tooltip title="Logout">
                  <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" sx={{ mr: 1, fontWeight: 'bold' }}>
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/signup"
                  sx={{
                    fontWeight: 'bold',
                    border: '1px solid #fff',
                    borderRadius: 2,
                    padding: '4px 12px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Hamburger menu for smaller screens */}
          <IconButton color="inherit" sx={{ display: { xs: 'flex', md: 'none' } }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                <ListItem component={Link} to="/" button>
                  <ListItemText primary="Home" />
                </ListItem>
                <Divider />

                {currentUser ? (
                  <>
                    <ListItem>
                      <Tooltip title="Your profile">
                        <Avatar sx={{ bgcolor: 'orange', mr: 2 }}>{currentUser.email.charAt(0).toUpperCase()}</Avatar>
                      </Tooltip>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {currentUser.email}
                      </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem component={Link} to="/login" button>
                      <ListItemText primary="Login" />
                    </ListItem>
                    <ListItem component={Link} to="/signup" button>
                      <ListItemText primary="Sign Up" />
                    </ListItem>
                  </>
                )}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
