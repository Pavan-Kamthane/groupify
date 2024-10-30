import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Button, Grid, Typography, Container, Card, CardContent, CardActionArea } from '@mui/material';

const Home = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (currentUser) {
        const q = query(
          collection(db, 'documents'), 
          where('owner', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setDocuments(docs);
      }
    };

    fetchDocuments();
  }, [currentUser]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Documents
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mb: 3 }}
      >
        Create New Document
      </Button>
      <Grid container spacing={3}>
        {documents.map(doc => (
          <Grid item key={doc.id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {doc.name}
                  </Typography>
                  <Typography color="textSecondary">
                    {doc.type}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Last modified: {doc.lastModified?.toDate().toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
