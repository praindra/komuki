import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';
import Cancel from './pages/Cancel';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminReservations from './pages/AdminReservations';
import AdminSchedules from './pages/AdminSchedules';
import AdminQueues from './pages/AdminQueues';
import AdminQuota from './pages/AdminQuota';
import OperatorLogin from './pages/OperatorLogin';
import OperatorSchedules from './pages/OperatorSchedules';
import OperatorQueues from './pages/OperatorQueues';
import OperatorQuota from './pages/OperatorQuota';
import PrivateRoute from './components/PrivateRoute';
import OperatorPrivateRoute from './components/OperatorPrivateRoute';
import UserPrivateRoute from './components/UserPrivateRoute';
import History from './pages/History';

function App() {
    return (
        <Router>
            <Routes>
                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/form" element={<UserPrivateRoute element={<Form />} />} />
                <Route path="/cancel" element={<UserPrivateRoute element={<Cancel />} />} />
                <Route path="/history" element={<UserPrivateRoute element={<History />} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} />} />
                <Route path="/admin/reservations" element={<PrivateRoute element={<AdminReservations />} />} />
                <Route path="/admin/schedules" element={<PrivateRoute element={<AdminSchedules />} />} />
                <Route path="/admin/queues" element={<PrivateRoute element={<AdminQueues />} />} />
                <Route path="/admin/quota" element={<PrivateRoute element={<AdminQuota />} />} />

                {/* Operator Routes */}
                <Route path="/operator/login" element={<OperatorLogin />} />
                <Route path="/operator/schedules" element={<OperatorPrivateRoute element={<OperatorSchedules />} />} />
                <Route path="/operator/queues" element={<OperatorPrivateRoute element={<OperatorQueues />} />} />
                <Route path="/operator/quota" element={<OperatorPrivateRoute element={<OperatorQuota />} />} />
            </Routes>
        </Router>
    );
}

export default App;
