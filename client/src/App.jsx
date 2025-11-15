import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';
import Cancel from './pages/Cancel';
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

function App() {
    return (
        <Router>
            <Routes>
                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/form" element={<Form />} />
                <Route path="/cancel" element={<Cancel />} />

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