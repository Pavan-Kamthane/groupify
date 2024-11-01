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
  const [users, setUsers] = useState({});
  const [openDocumentForm, setOpenDocumentForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (currentUser) {
        const uniqueDocIds = new Set(); // Set to keep track of unique document IDs
        const combinedDocs = [];

        // Fetch documents owned by the user
        const ownedDocsQuery = query(
          collection(db, 'documents'),
          where('owner', '==', currentUser.uid)
        );

        const ownedDocsSnapshot = await getDocs(ownedDocsQuery);
        ownedDocsSnapshot.forEach(doc => {
          const docData = { id: doc.id, ...doc.data() };
          if (!uniqueDocIds.has(doc.id)) {
            uniqueDocIds.add(doc.id); // Add to set to ensure uniqueness
            combinedDocs.push(docData);
          }
        });

        // Fetch documents shared with the user
        const sharedDocsQuery = query(
          collection(db, 'documents'),
          where('sharedWith', 'array-contains', currentUser.email)
        );

        const sharedDocsSnapshot = await getDocs(sharedDocsQuery);
        sharedDocsSnapshot.forEach(doc => {
          const docData = { id: doc.id, ...doc.data() };
          if (!uniqueDocIds.has(doc.id)) {
            uniqueDocIds.add(doc.id); // Add to set to ensure uniqueness
            combinedDocs.push(docData);
          }
        });

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
      setUsers(userMap);
    };

    fetchDocuments();
    fetchUsers();
  }, [currentUser]);

  const handleDocumentClick = (id) => {
    navigate(`/document/${id}`);
  };

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
        My Documents
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
                    Owner: {users[doc.owner]?.name || users[doc.owner]?.email || 'Unknown'}
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

      {documents.length === 0 && (
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          You haven't created any documents yet. Click the button above to create your first document.
        </Typography>
      )}
    </Container>
  );
};

export default Home;
