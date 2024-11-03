import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Button,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Box,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import DocumentForm from '../components/DocumentForm';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const Home = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState({});
  const [openDocumentForm, setOpenDocumentForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to track the active tab
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (currentUser) {
        const uniqueDocIds = new Set();
        const combinedDocs = [];

        const ownedDocsQuery = query(
          collection(db, 'documents'),
          where('owner', '==', currentUser.uid)
        );
        const ownedDocsSnapshot = await getDocs(ownedDocsQuery);
        ownedDocsSnapshot.forEach((doc) => {
          const docData = { id: doc.id, ...doc.data() };
          if (!uniqueDocIds.has(doc.id)) {
            uniqueDocIds.add(doc.id);
            combinedDocs.push(docData);
          }
        });

        const sharedDocsQuery = query(
          collection(db, 'documents'),
          where('sharedWith', 'array-contains', currentUser.email)
        );
        const sharedDocsSnapshot = await getDocs(sharedDocsQuery);
        sharedDocsSnapshot.forEach((doc) => {
          const docData = { id: doc.id, ...doc.data() };
          if (!uniqueDocIds.has(doc.id)) {
            uniqueDocIds.add(doc.id);
            combinedDocs.push(docData);
          }
        });

        combinedDocs.sort((a, b) => b.lastModified?.toMillis() - a.lastModified?.toMillis());
        setDocuments(combinedDocs);
      }
    };

    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userMap = {};
      usersSnapshot.forEach((userDoc) => {
        userMap[userDoc.id] = userDoc.data();
      });
      setUsers(userMap);
    };

    fetchDocuments();
    fetchUsers();
  }, [currentUser]);

  const handleDocumentClick = (id) => {
    navigate(`/document/${id}`);
  };

  const ownedDocuments = documents.filter((doc) => doc.owner === currentUser.uid);
  const sharedDocuments = documents.filter(
    (doc) => doc.sharedWith && doc.sharedWith.includes(currentUser.email)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative', height: '81.5vh' }}>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        aria-label="Document Tabs"
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="My Documents" />
        <Tab label="Shared Documents" />
      </Tabs>

      <Box
        sx={{
          height: 'calc(90vh - 64px)', // Adjust height based on tabs and margins
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* My Documents Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              My Documents
            </Typography>
            <Grid container spacing={3}>
              {ownedDocuments.map((doc) => (
                <Grid item key={doc.id} xs={12} sm={6} md={4}>
                  <Card onClick={() => handleDocumentClick(doc.id)} style={{ cursor: 'pointer' }}>
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="h6" component="h2">
                          {doc.name}
                        </Typography>
                        <Typography color="textSecondary">{doc.type}</Typography>
                        <Typography variant="body2" component="p">
                          Last modified: {doc.lastModified?.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} at {doc.lastModified?.toDate().toLocaleTimeString()}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {ownedDocuments.length === 0 && (
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Get started by creating your first document. Click the '+' button to begin.
              </Typography>
            )}
          </Box>
        )}

        {/* Shared Documents Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Shared Documents
            </Typography>
            <Grid container spacing={3}>
              {sharedDocuments.map((doc) => (
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
                        <Typography color="textSecondary">{doc.type}</Typography>
                        <Typography variant="body2" component="p">
                          Last modified: {doc.lastModified?.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} at {doc.lastModified?.toDate().toLocaleTimeString()}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Create New Document Button */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
      >
        <IconButton
          color="primary"
          onClick={() => setOpenDocumentForm(true)}
          aria-label="Create New Document"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            width: 56,
            height: 56,
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <DocumentForm open={openDocumentForm} onClose={() => setOpenDocumentForm(false)} />
    </Container>
  );
};

export default Home;
