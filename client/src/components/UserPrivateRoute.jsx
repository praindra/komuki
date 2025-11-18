import React from 'react';
import { Navigate } from 'react-router-dom';

const UserPrivateRoute = ({ element }) => {
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('userRole');

    // Only logged-in users (admin, operator, or user) can access user routes like form
    if (token && (role === 'admin' || role === 'operator' || role === 'user')) {
        return element;
    }

    return <Navigate to="/login" />;
};

export default UserPrivateRoute;
