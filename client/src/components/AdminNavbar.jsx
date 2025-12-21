import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#333', color: 'white' }}>
            <div className="admin-clinic-name" style={{ fontWeight: 'bold' }}>
                Admin
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
                <li><Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
                <li><Link to="/admin/reservations" style={{ color: 'white', textDecoration: 'none' }}>Data Reservasi</Link></li>
                <li><Link to="/admin/schedules" style={{ color: 'white', textDecoration: 'none' }}>Kelola Jadwal</Link></li>
                <li><Link to="/admin/queues" style={{ color: 'white', textDecoration: 'none' }}>Kelola Antrian</Link></li>
                <li><Link to="/admin/quota" style={{ color: 'white', textDecoration: 'none' }}>Kuota/Limit</Link></li>
                <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;