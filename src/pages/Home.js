import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Button, Grid, Typography, Container, Card, CardContent, CardActionArea } from '@mui/material';
import DocumentForm from '../components/DocumentForm';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState({}); // State to store user information
  const [openDocumentForm, setOpenDocumentForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (currentUser) {
        // Fetch documents owned by the user
        const ownedDocsQuery = query(
          collection(db, 'documents'),
          where('owner', '==', currentUser.uid)
        );

        const ownedDocsSnapshot = await getDocs(ownedDocsQuery);
        const ownedDocs = ownedDocsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch documents shared with the user
        const sharedDocsQuery = query(
          collection(db, 'documents'),
          where('sharedWith', 'array-contains', currentUser.email)
        );

        const sharedDocsSnapshot = await getDocs(sharedDocsQuery);
        const sharedDocs = sharedDocsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Combine both owned and shared documents
        const combinedDocs = [...ownedDocs, ...sharedDocs];

        // Sort combined documents by lastModified date in descending order
        combinedDocs.sort((a, b) => b.lastModified?.toMillis() - a.lastModified?.toMillis());
        setDocuments(combinedDocs);
      }
    };

    const fetchUsers = async () => {
      // Fetch users from Firestore
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userMap = {};
      usersSnapshot.forEach(userDoc => {
        userMap[userDoc.id] = userDoc.data(); // Assuming userDoc.id is the user ID
      });
      setUsers(userMap); // Store user information keyed by user ID
    };

    fetchDocuments();
    fetchUsers();
  }, [currentUser]);

  const handleDocumentClick = (id) => {
    navigate(`/document/${id}`);
  };

  // Separate owned and shared documents for rendering
  const ownedDocuments = documents.filter(doc => doc.owner === currentUser.uid);
  const sharedDocuments = documents.filter(doc => doc.sharedWith && doc.sharedWith.includes(currentUser.email));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Documents
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => setOpenDocumentForm(true)}
      >
        Create New Document
      </Button>
      <DocumentForm
        open={openDocumentForm}
        onClose={() => setOpenDocumentForm(false)}
      />

      {/* Owned Documents Section */}
      <Typography variant="h5" gutterBottom>
        Owned Documents
      </Typography>
      <Grid container spacing={3}>
        {ownedDocuments.map(doc => (
          <Grid item key={doc.id} xs={12} sm={6} md={4}>
            <Card onClick={() => handleDocumentClick(doc.id)} style={{ cursor: 'pointer' }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {doc.name}
                  </Typography>
                  <Typography color="textSecondary">
                    {doc.type}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Last modified: {doc.lastModified?.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} at {doc.lastModified?.toDate().toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Shared Documents Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Shared Documents
      </Typography>
      <Grid container spacing={3}>
        {sharedDocuments.map(doc => (
          <Grid item key={doc.id} xs={12} sm={6} md={4}>
            <Card onClick={() => handleDocumentClick(doc.id)} style={{ cursor: 'pointer' }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {doc.name}
                  </Typography>
                  <Typography color="textSecondary">
                    Owner: {users[doc.owner]?.name || users[doc.owner]?.email || 'Unknown'} {/* Display owner's name or email */}
                  </Typography>
                  <Typography color="textSecondary">
                    {doc.type}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Last modified: {doc.lastModified?.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} at {doc.lastModified?.toDate().toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* If no documents are found, show a message to create the first document */}
      {documents.length === 0 && (
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          You haven't created any documents yet. Click the button above to create your first document.
        </Typography>
      )}
    </Container>
  );
};

export default Home;
