import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const ShareDocument = ({ open, onClose, documentId }) => {
    const { currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleShare = async () => {
        if (!email) return;

        const docRef = doc(db, 'documents', documentId);

        try {
            await updateDoc(docRef, {
                sharedWith: [email] // You can also use an array for multiple emails
            });
            setSuccess(true);
            setError('');
        } catch (err) {
            setError('Failed to share document.');
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Share Document</DialogTitle>
            <DialogContent>
                {success && <Alert severity="success">Invitation sent successfully!</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="User Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleShare} color="primary">Share</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDocument;
