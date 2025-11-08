import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('adminToken'); // Asumsi token disimpan di localStorage
    return token ? element : <Navigate to="/admin/login" />;
};

export default PrivateRoute;