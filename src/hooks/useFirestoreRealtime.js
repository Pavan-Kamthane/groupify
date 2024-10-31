import { useEffect, useState } from 'react';
import { db } from '../firebase/config'; // Adjust the import based on your Firebase config file
import { doc, onSnapshot } from 'firebase/firestore';

const useFirestoreRealtime = (documentId) => {
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const documentRef = doc(db, 'documents', documentId); // Adjust 'documents' to your Firestore collection name

        const unsubscribe = onSnapshot(documentRef, (doc) => {
            if (doc.exists()) {
                setDocumentData({ id: doc.id, ...doc.data() });
                setLoading(false);
            } else {
                setError('Document does not exist');
                setLoading(false);
            }
        }, (error) => {
            setError(error.message);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, [documentId]);

    return { documentData, loading, error };
};

export default useFirestoreRealtime;


