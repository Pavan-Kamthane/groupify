// src/pages/Signup.js
import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase/config'; // Import Firestore
import { collection, doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { TextField, Button, Typography, Container, Box, Paper, Avatar, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import theme from '../styles/theme'; // Import theme for color usage
import PeopleIcon from '@mui/icons-material/People';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading indicator
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Start loading indicator

        // Validate email
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setError('Invalid email format');
            setLoading(false); // Stop loading indicator
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false); // Stop loading indicator
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false); // Stop loading indicator
            return;
        }

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user data to Firestore
            await setDoc(doc(collection(db, 'users'), user.uid), {
                email: email,
                createdAt: new Date(),
                // Add any additional fields you want here
            });

            // Redirect or show success
            navigate('/');
            console.log('User signed up:', email);
        } catch (error) {
            console.error('Error signing up:', error.message);
            setError(error.message);
            alert(`Error signing up: ${error.message}`);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    return (
        <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
                <PeopleIcon />
            </Avatar>
            <Typography variant="h3" align="center" gutterBottom style={{ color: theme.palette.primary.main, fontSize: '2rem' }}>GroupiFy</Typography>
            <Paper elevation={6} style={{ padding: '2rem', marginTop: '2rem', width: '100%', borderRadius: '10px', backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
                <Typography variant="h4" align="center" gutterBottom style={{ fontSize: '1.5rem' }}>Sign Up</Typography>
                <form onSubmit={handleSignup}>
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
                        autoComplete="new-password"
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
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        error={password !== confirmPassword && confirmPassword !== ''}
                        helperText={password !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
                        autoComplete="new-password"
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
                    {error && <Typography color="error" style={{ marginTop: '1rem', fontSize: '1rem' }}>{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1.25rem' }}>
                        {loading ? <CircularProgress sx={{color:'white'}} size={24} /> : 'Sign Up'}
                    </Button>
                </form>
                <Box mt={2} textAlign="center">
                    <Button variant="contained" color="secondary" style={{ padding: '0.5rem', fontSize: '1rem', backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                        <Link to="/login" style={{ color: theme.palette.text.primary, textDecoration: 'none', fontSize: '1rem' }}>Already have an account? Login</Link>
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Signup;
