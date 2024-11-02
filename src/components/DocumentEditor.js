import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, serverTimestamp, onSnapshot, collection, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Box, Paper, Typography, CircularProgress, Alert, Toolbar, AppBar, IconButton, Tooltip, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import useFirestoreRealtime from '../hooks/useFirestoreRealtime'; // Import the custom hook
import ShareIcon from '@mui/icons-material/Share'; // Import ShareIcon
import ShareDocument from './ShareDocument'; // Import ShareDialog
import { auth } from '../firebase/config'; // Import auth from your Firebase config
import Chat from './Chat'; // Import Chat component
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

const DocumentEditor = () => {
    const { id } = useParams();
    const { documentData, loading, error } = useFirestoreRealtime(id); // Use the custom hook
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]); // State to manage typing users
    const chatRef = useRef(null); // Create a ref for the chat box

    // Get the current user's email
    const currentUserEmail = auth.currentUser?.email; // Assumes you're using Firebase Authentication

    useEffect(() => {
        if (documentData) {
            setContent(documentData.content || '');
        }
    }, [documentData]);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'documents', id), (doc) => {
            const typingUsers = doc.data().typingUsers || [];
            setTypingUsers(typingUsers);
        });

        return () => unsubscribe();
    }, [id]);

    const handleContentChange = async (newContent) => {
        setContent(newContent);
        setSaving(true);

        try {
            const docRef = doc(db, 'documents', id);
            await updateDoc(docRef, {
                content: newContent,
                lastModified: serverTimestamp(),
                typingUsers: arrayUnion(currentUserEmail) // Add current user to typingUsers
            });

            // Set a timeout to remove the typing status after a specific period of inactivity
            setTimeout(() => {
                updateDoc(docRef, {
                    typingUsers: arrayRemove(currentUserEmail)
                });
            }, 5000); // 5 seconds
        } catch (err) {
            console.error('Error saving document:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleShareClick = () => {
        setOpenShareDialog(true);
    };

    const downloadAsPdf = () => {
        const doc = new jsPDF();
        doc.text(content, 10, 10);
        doc.save('document.pdf');
    };

    const downloadAsWord = () => {
        const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        saveAs(blob, 'document.docx');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box m={2}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const renderEditor = () => {
        switch (documentData?.type) {
            case 'word':
            case 'text':
                return (
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={handleContentChange}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'size': [] }],
                                [{ 'align': [] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'color': [] }, { 'background': [] }],
                                ['link', 'image', 'video']
                            ]
                        }}
                        formats={[
                            'header', 'font', 'size', 'align',
                            'bold', 'italic', 'underline', 'strike',
                            'list', 'bullet', 'color', 'background',
                            'link', 'image', 'video'
                        ]}
                        style={{ height: '60vh', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#333', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                );
            case 'excel':
                return (
                    <HotTable
                        data={content || [[]]}
                        colHeaders={true}
                        rowHeaders={true}
                        height="400"
                        licenseKey="non-commercial-and-evaluation"
                        afterChange={(changes) => {
                            if (changes) {
                                handleContentChange(content); // Update to handle content correctly
                            }
                        }}
                        contextMenu={true}
                        manualColumnResize={true}
                        manualRowResize={true}
                        filters={true}
                        dropdownMenu={true}
                        allowInsertRow={true}
                        allowInsertColumn={true}
                        allowRemoveRow={true}
                        allowRemoveColumn={true}
                        allowCopyPaste={true}
                        allowComments={true}
                    />
                );
            default:
                return <Typography>Unsupported document type</Typography>;
        }
    };

    return (
        <Box p={3} sx={{ backgroundColor: '#f0f4f8', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' } }}>
            {/* Top AppBar */}
            <AppBar position="static" color="primary" sx={{ mb: 2, borderRadius: '8px 8px 0 0' }}>
                <Toolbar sx={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        {documentData?.name}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            mb: { xs: 1, sm: 0 }
                        }}
                    >
                        {typingUsers.length > 0 ? (
                            typingUsers.map((email, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 1,
                                        borderRadius: '4px',
                                        mr: 1,
                                        mb: { xs: 1, sm: 0 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <Typography variant="body2">{email} is typing</Typography>
                                </Box>
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                <Typography variant="body2">No one is typing</Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Share Document">
                            <IconButton onClick={handleShareClick} color="inherit" sx={{ p: { xs: 1, sm: 2 } }}>
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Save Document">
                            <IconButton onClick={() => handleContentChange(content)} color="inherit" sx={{ p: { xs: 1, sm: 2 } }}>
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download as PDF">
                            <IconButton onClick={downloadAsPdf} color="inherit" sx={{ p: { xs: 1, sm: 2 } }}>
                                <PictureAsPdfIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download as Word">
                            <IconButton onClick={downloadAsWord} color="inherit" sx={{ p: { xs: 1, sm: 2 } }}>
                                <DescriptionIcon />
                            </IconButton>
                        </Tooltip>
                        {saving && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'white',
                                    ml: { xs: 0, sm: 2 }
                                }}
                            />
                        )}
                    </Box>
                </Toolbar>
            </AppBar>


            {/* Main Content */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between' }}>
                {/* Document Editor */}
                <Paper elevation={4} sx={{ p: 3, borderRadius: '8px', flex: 1, mb: { xs: 2, md: 0 }, mr: { md: 2 }, backgroundColor: '#fff' }}>
                    {renderEditor()}
                </Paper>

                {/* Chat and User Info */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: { xs: '1', md: '0.3' },
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    {/* Users with Access */}
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Working With:</Typography>
                        <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
                            {documentData?.sharedWith && documentData.sharedWith.length > 0 ? (
                                documentData.sharedWith.map((email, index) => (
                                    <Box key={index} sx={{
                                        p: 1,
                                        borderRadius: '4px',
                                        backgroundColor: '#e3f2fd',
                                        mb: 0.5,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        transition: 'background-color 0.3s',
                                        '&:hover': { backgroundColor: '#bbdefb' }
                                    }}>
                                        <Typography variant="body1" sx={{ color: 'text.primary' }}>{email}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                    <Typography variant="body2">No users have access to this document.</Typography>
                                    <img src="empty-state-icon.png" alt="No Access" style={{ width: '50px', marginTop: '10px' }} />
                                </Box>
                            )}
                        </Box>
                    </Box>
                    {/* Chat Component */}
                    {documentData?.sharedWith && documentData.sharedWith.length > 0 && (
                        <Chat documentId={id} currentUser={auth.currentUser} chatRef={chatRef} />
                    )}
                </Box>
            </Box>

            {/* Share Document Dialog */}
            <ShareDocument
                open={openShareDialog}
                onClose={() => setOpenShareDialog(false)}
                documentId={id}
            />
        </Box>
    );
};

export default DocumentEditor;
