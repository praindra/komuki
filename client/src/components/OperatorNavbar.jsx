import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OperatorNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/operator/login');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#28a745', color: 'white' }}>
            <div className="operator-clinic-name" style={{ fontWeight: 'bold' }}>
                Klinik Sehat Operator
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
                <li><Link to="/operator/schedules" style={{ color: 'white', textDecoration: 'none' }}>Kelola Jadwal</Link></li>
                <li><Link to="/operator/queues" style={{ color: 'white', textDecoration: 'none' }}>Kelola Antrian</Link></li>
                <li><Link to="/operator/quota" style={{ color: 'white', textDecoration: 'none' }}>Kuota/Limit</Link></li>
                <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default OperatorNavbar;