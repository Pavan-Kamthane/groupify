// src/pages/Signup.js
import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase/config'; // Import Firestore
import { collection, doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { TextField, Button, Typography, Container, Box, Paper, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
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
        }
    };

    return (
        <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} />
            <Typography variant="h3" align="center" gutterBottom>GroupiFy</Typography>
            <Paper elevation={6} style={{ padding: '2rem', marginTop: '2rem', width: '100%', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <Typography variant="h4" align="center" gutterBottom>Sign Up</Typography>
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
                        autoComplete="new-password"
                        InputLabelProps={{ style: { color: 'var(--text-primary)' } }}
                        InputProps={{ style: { color: 'var(--text-primary)' } }}
                    />
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        error={password !== confirmPassword && confirmPassword !== ''}
                        helperText={password !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
                        autoComplete="new-password"
                        InputLabelProps={{ style: { color: 'var(--text-primary)' } }}
                        InputProps={{ style: { color: 'var(--text-primary)' } }}
                    />
                    {error && <Typography color="error" style={{ marginTop: '1rem' }}>{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1rem' }}>
                        Sign Up
                    </Button>
                </form>
                <Box mt={2} textAlign="center">
                    <Button variant="contained" color="secondary" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
                        <Link to="/login" style={{ color: 'black', textDecoration: 'none' }}>Already have an account? Login</Link>
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Signup;
