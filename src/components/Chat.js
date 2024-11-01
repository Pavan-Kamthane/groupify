import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Box, TextField, Button, Typography, Avatar, Grid, Paper } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const Chat = ({ documentId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userEmails, setUserEmails] = useState({}); // Store user emails

    useEffect(() => {
        const fetchUserEmails = async () => {
            const usersSnapshot = await collection(db, 'users'); // Assuming 'users' is your users collection
            const users = {};
            onSnapshot(usersSnapshot, (snapshot) => {
                snapshot.forEach((doc) => {
                    const userData = doc.data();
                    users[doc.id] = userData.email; // Map userId to email
                });
                setUserEmails(users);
            });
        };

        fetchUserEmails();
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, 'documents', documentId, 'chats'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [documentId]);

    const handleSend = async () => {
        if (newMessage.trim() === '') return;

        await addDoc(collection(db, 'documents', documentId, 'chats'), {
            userId: currentUser.uid,
            message: newMessage,
            timestamp: new Date(),
        });

        setNewMessage('');
    };

    return (
        <Box sx={{ mt: 4, border: '1px solid #ccc', p: 2, borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Chat</Typography>
            <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
                {messages.map((msg) => (
                    <Paper key={msg.id} sx={{ p: 2, mb: 2, borderRadius: '8px', backgroundColor: msg.userId === currentUser.uid ? '#e3e3e3' : '#fff' }}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Avatar sx={{ bgcolor: deepPurple[500] }}>{msg.userId === currentUser.uid ? 'Y' : 'O'}</Avatar>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid container direction="column" spacing={2}>
                                    <Grid item>
                                        <Typography variant="body2" color="textPrimary">
                                            <strong>{msg.userId === currentUser.uid ? 'You' : userEmails[msg.userId] || msg.userId}:</strong> {msg.message}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                label="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button onClick={handleSend} variant="contained" color="primary" sx={{ mt: 1, mb: 2 }}>
                Send
            </Button>
        </Box>
    );
};

export default Chat;
