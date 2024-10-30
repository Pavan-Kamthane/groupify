import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Box, Paper, Typography, CircularProgress, Alert, Toolbar, AppBar, IconButton, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

const DocumentEditor = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const docRef = doc(db, 'documents', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setDocument({ id: docSnap.id, ...docSnap.data() });
                    setContent(docSnap.data().content || '');
                } else {
                    setError('Document not found');
                }
            } catch (err) {
                setError('Error loading document');
                console.error('Error fetching document:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

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
            setError('Failed to save changes');
            console.error('Error saving document:', err);
        } finally {
            setSaving(false);
        }
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
        switch (document?.type) {
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
                        // Adding Google Sheets-like features
                        allowInsertRow={true} // Allow inserting rows
                        allowInsertColumn={true} // Allow inserting columns
                        allowRemoveRow={true} // Allow removing rows
                        allowRemoveColumn={true} // Allow removing columns
                        allowCopyPaste={true} // Allow copy-pasting
                        allowComments={true} // Allow comments on cells
                    />
                );
            default:
                return <Typography>Unsupported document type</Typography>;
        }
    };

    return (
        <Box p={3} sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <AppBar position="static" color="primary" sx={{ mb: 2 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {document?.name}
                    </Typography>
                    <Tooltip title="Save Document">
                        <IconButton onClick={() => handleContentChange(content)} color="inherit">
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>
                    {saving && <CircularProgress size={24} sx={{ color: 'white', ml: 2 }} />}
                </Toolbar>
            </AppBar>

            <Paper elevation={4} sx={{ p: 3 }}>
                {renderEditor()}
            </Paper>
        </Box>
    );
};

export default DocumentEditor;
