import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('userRole');
    
    // Allow admin and superadmin to access admin routes
    if (token && (role === 'admin' || role === 'superadmin')) {
        return element;
    }
    
    return <Navigate to="/admin/login" />;
};

export default PrivateRoute;