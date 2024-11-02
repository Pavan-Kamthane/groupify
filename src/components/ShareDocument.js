import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, IconButton, Box, CircularProgress, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const ShareDocument = ({ open, onClose, documentId }) => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sharedUsers, setSharedUsers] = useState([]);

    // Fetch the shared users when the dialog opens
    useEffect(() => {
        if (open) {
            const fetchSharedUsers = async () => {
                try {
                    const docRef = doc(db, 'documents', documentId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setSharedUsers(docSnap.data().sharedWith || []);
                    }
                } catch (err) {
                    console.error("Error fetching shared users:", err);
                }
            };
            fetchSharedUsers();
        }
    }, [open, documentId]);

    const handleShare = async () => {
        if (!email || sharedUsers.includes(email)) {
            setError(email ? 'This email is already shared.' : 'Please enter an email.');
            return;
        }

        const docRef = doc(db, 'documents', documentId);
        setLoading(true);

        try {
            await updateDoc(docRef, {
                sharedWith: arrayUnion(email)
            });
            setSharedUsers((prev) => [...prev, email]); // Update UI without re-fetching
            setSuccess(true);
            setError('');
            setEmail(''); // Clear the input after success
        } catch (err) {
            setError('Failed to share document. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError('');
        setEmail('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <Box display="flex" alignItems="center" justifyContent="space-between" padding="16px">
                <DialogTitle>Share Document</DialogTitle>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <DialogContent sx={{ px: 3 }}>
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Invitation sent successfully!
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <TextField
                    label="User Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    sx={{ borderRadius: '8px' }}
                />
                {sharedUsers.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <DialogTitle variant="subtitle1">Already Shared With</DialogTitle>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            {sharedUsers.map((userEmail) => (
                                <Chip
                                    key={userEmail}
                                    label={userEmail}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
                <Button onClick={handleClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleShare}
                    color="primary"
                    variant="contained"
                    disabled={loading || !email}
                    startIcon={loading && <CircularProgress size={18} />}
                    sx={{ minWidth: 100 }}
                >
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDocument;
