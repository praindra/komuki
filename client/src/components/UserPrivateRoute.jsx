import React from 'react';
import { Navigate } from 'react-router-dom';

const UserPrivateRoute = ({ element }) => {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');

    // Only users with 'user' role can access user routes like form
    if (token && role === 'user') {
        return element;
    }

    return <Navigate to="/login" />;
};

export default UserPrivateRoute;
