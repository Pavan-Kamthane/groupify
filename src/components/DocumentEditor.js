import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Box, Paper, Typography, CircularProgress, Alert, Toolbar, AppBar, IconButton, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import useFirestoreRealtime from '../hooks/useFirestoreRealtime'; // Import the custom hook
import ShareIcon from '@mui/icons-material/Share'; // Import ShareIcon
import ShareDocument from './ShareDocument'; // Import ShareDialog
import { auth } from '../firebase/config'; // Import auth from your Firebase config

const DocumentEditor = () => {
    const { id } = useParams();
    const { documentData, loading, error } = useFirestoreRealtime(id); // Use the custom hook
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);

    // Get the current user's email
    const currentUserEmail = auth.currentUser?.email; // Assumes you're using Firebase Authentication

    useEffect(() => {
        if (documentData) {
            setContent(documentData.content || '');
        }
    }, [documentData]);

    const handleContentChange = async (newContent) => {
        setContent(newContent);
        setSaving(true);

        try {
            const docRef = doc(db, 'documents', id);
            await updateDoc(docRef, {
                content: newContent,
                lastModified: serverTimestamp()
            });
        } catch (err) {
            console.error('Error saving document:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleShareClick = () => {
        setOpenShareDialog(true);
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
                        style={{ height: '60vh', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#333' }}
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
        <>
            <Box p={3} sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <AppBar position="static" color="primary" sx={{ mb: 2, borderRadius: '8px 8px 0 0' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                            {documentData?.name}
                        </Typography>
                        <Tooltip title="Share Document">
                            <IconButton onClick={handleShareClick} color="inherit" sx={{ mr: 2 }}>
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Save Document">
                            <IconButton onClick={() => handleContentChange(content)} color="inherit" sx={{ mr: 2 }}>
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                        {saving && <CircularProgress size={24} sx={{ color: 'white', ml: 2 }} />}
                    </Toolbar>
                </AppBar>

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: '8px', flex: 1, mr: 2 }}>
                        {renderEditor()}
                    </Paper>
                    <Box sx={{ flex: 0.3, p: 2, borderRadius: '8px', backgroundColor: '#f5f5f5', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Shared With:</Typography>
                        <ul>
                            {documentData.sharedWith && documentData.sharedWith.length > 0 && documentData.sharedWith
                                .filter(email => email !== currentUserEmail) // Filter out current user's email
                                .map((email, index) => (
                                    <li key={index} sx={{ listStyleType: 'none', mb: 1 }}>
                                        <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                            {email}
                                        </Typography>
                                    </li>
                                ))}
                        </ul>
                    </Box>
                </Box>
            </Box>
            <ShareDocument
                open={openShareDialog}
                onClose={() => setOpenShareDialog(false)}
                documentId={id}
            />
        </>
    );
};

export default DocumentEditor;
