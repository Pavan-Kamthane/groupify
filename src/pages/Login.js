// src/pages/Login.js

import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Typography, Container, Box, Paper, Avatar, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import theme from '../styles/theme'; // Import theme for color usage
import PeopleIcon from '@mui/icons-material/People';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
    const [loading, setLoading] = useState(false); // State to manage loading indicator
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading indicator
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect or show success
            navigate('/');
            console.log('User logged in:', email);
        } catch (error) {
            console.error('Error logging in:', error.message);
            alert(`Error logging in: ${error.message}`);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    return (
        <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
                <PeopleIcon/>
            </Avatar>
            <Typography variant="h2" align="center" gutterBottom style={{ color: theme.palette.primary.main, fontSize: '2rem' }}>GroupiFy</Typography>
            <Paper elevation={6} style={{ padding: '2rem', marginTop: '2rem', width: '100%', borderRadius: '10px', backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
                <Typography variant="h4" align="center" gutterBottom style={{ fontSize: '1.5rem' }}>Login</Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        InputLabelProps={{ style: { color: theme.palette.text.primary, fontSize: '1.25rem' } }}
                        InputProps={{ style: { color: theme.palette.text.primary, fontSize: '1.25rem' } }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        InputLabelProps={{ style: { color: theme.palette.text.primary, fontSize: '1.25rem' } }}
                        InputProps={{
                            style: { color: theme.palette.text.primary, fontSize: '1.25rem' },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(prevState => !prevState)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1.25rem' }}>
                        {loading ? <CircularProgress sx={{color:'white'}} size={24} /> : 'Login'}
                    </Button>
                </form>
                <Box mt={2} textAlign="center">
                    <Button variant="contained" color="secondary" style={{ padding: '0.5rem', fontSize: '1rem', backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                        <Link to="/signup" style={{ color: theme.palette.text.primary, textDecoration: 'none', fontSize: '1rem' }}>Don't have an account? Sign up</Link>
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
