// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust the path based on your structure

const ProtectedRoute = ({ element }) => {
    const { currentUser } = useAuth(); // Use your Auth context to get the current user

    // If there's no user, redirect to the login page
    return currentUser ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
