// src/pages/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Typography, Container, Box, Paper, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Remove this import as it is causing an error

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect or show success
            navigate('/');
            console.log('User logged in:', email);
        } catch (error) {
            console.error('Error logging in:', error.message);
            alert(`Error logging in: ${error.message}`);
        }
    };

    return (
        <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                {/* <LockOutlinedIcon /> Remove this component as it is causing an error */}
            </Avatar>
            <Typography variant="h3" align="center" gutterBottom>GroupiFy</Typography>
            <Paper elevation={6} style={{ padding: '2rem', marginTop: '2rem', width: '100%', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <Typography variant="h4" align="center" gutterBottom>Login</Typography>
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
                        InputLabelProps={{ style: { color: 'var(--text-primary)' } }}
                        InputProps={{ style: { color: 'var(--text-primary)' } }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        InputLabelProps={{ style: { color: 'var(--text-primary)' } }}
                        InputProps={{ style: { color: 'var(--text-primary)' } }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1rem' }}>
                        Login
                    </Button>
                </form>
                <Box mt={2} textAlign="center">
                    <Button variant="contained" color="secondary" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
                        <Link to="/signup" style={{ color: 'black', textDecoration: 'none' }}>Don't have an account? Sign up</Link>
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
