import React from 'react';
import { Navigate } from 'react-router-dom';

const OperatorPrivateRoute = ({ element }) => {
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('userRole');
    
    // Allow both admin and operator to access operator routes
    if (token && (role === 'operator' || role === 'admin')) {
        return element;
    }
    
    return <Navigate to="/operator/login" />;
};

export default OperatorPrivateRoute;