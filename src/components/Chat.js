import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Box, TextField, Button, Typography, Avatar, Grid, Paper, Divider } from '@mui/material';
import { deepPurple, grey, lightBlue } from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Send';

const Chat = ({ documentId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userEmails, setUserEmails] = useState({});
    const chatRef = useRef(null);

    useEffect(() => {
        const fetchUserEmails = async () => {
            const usersCollection = collection(db, 'users');
            const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
                const emails = {};
                snapshot.forEach((doc) => {
                    const userData = doc.data();
                    emails[doc.id] = userData.email;
                });
                setUserEmails(emails);
            });
            return () => unsubscribe();
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
            if (chatRef.current) {
                chatRef.current.scrollTo({
                    top: chatRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
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
        <Box
            sx={{
                mt: 4,
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '500px',
                overflowY: 'auto',
                bgcolor: '#fafafa',
            }}
        >
            {/* Chat Header */}
            <Typography
                variant="h6"
                sx={{
                    p: 2,
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'white',
                    zIndex: 1,
                    borderBottom: '1px solid #eee'
                }}
            >
                Chat
            </Typography>

            {/* Chat Messages */}
            <Box
                sx={{
                    p: 2,
                    flex: 1,
                    overflowY: 'auto',
                }}
                ref={chatRef}
            >
                {messages.map((msg) => (
                    <Paper
                        key={msg.id}
                        sx={{
                            p: 2,
                            mb: 1.5,
                            borderRadius: '8px',
                            maxWidth: '70%',
                            bgcolor: msg.userId === currentUser.uid ? lightBlue[50] : grey[100],
                            alignSelf: msg.userId === currentUser.uid ? 'flex-end' : 'flex-start',
                            boxShadow: msg.userId === currentUser.uid
                                ? '0px 4px 10px rgba(30, 136, 229, 0.2)'
                                : '0px 4px 10px rgba(100, 100, 100, 0.15)',
                        }}
                    >
                        <Grid container wrap="nowrap" spacing={2}>
                            <Grid item>
                                <Avatar sx={{ bgcolor: msg.userId === currentUser.uid ? deepPurple[500] : grey[500] }}>
                                    {msg.userId === currentUser.uid ? 'Y' : 'O'}
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body2" color="textPrimary">
                                    <strong>{msg.userId === currentUser.uid ? 'You' : userEmails[msg.userId] || msg.userId}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
                                    {msg.message}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {new Date(msg.timestamp?.toDate()).toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Message Input */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ flex: 1, mr: 1 }}
                />
                <Button onClick={handleSend} variant="contained" color="primary">
                    <SendIcon />
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;
