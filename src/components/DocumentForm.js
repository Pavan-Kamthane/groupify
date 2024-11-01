import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Alert, CircularProgress } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const DocumentForm = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const documentTypes = [
    { value: 'word', label: 'Word' },
    { value: 'excel', label: 'Excel' },
    { value: 'text', label: 'Text' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const docRef = await addDoc(collection(db, 'documents'), {
        name: data.name,
        type: data.type,
        description: data.description,
        owner: currentUser.uid,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        sharedWith: [] // Add this field to track shared users
      });

      setSuccess(true);
      reset();
      setTimeout(() => {
        onClose();
        setSuccess(false);
        navigate(`/document/${docRef.id}`); // Navigate to the newly created document
      }, 1500);
    } catch (err) {
      setError('Failed to create document. Please try again.');
      console.error('Error creating document:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Document</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Document created successfully!</Alert>}
          
          <TextField
            fullWidth
            label="Document Name"
            margin="normal"
            {...register('name', { required: 'Document name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            select
            fullWidth
            label="Document Type"
            margin="normal"
            defaultValue=""
            {...register('type', { required: 'Please select a document type' })}
            error={!!errors.type}
            helperText={errors.type?.message}
          >
            {documentTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={4}
            {...register('description')}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DocumentForm;
