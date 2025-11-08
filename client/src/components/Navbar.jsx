import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f0f0f0' }}>
            <div className="clinic-name" style={{ fontWeight: 'bold' }}>
                Reservasi
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
                <li><Link to="/">Beranda</Link></li>
                <li><Link to="/form">Formulir</Link></li>
                <li><Link to="/cancel">Batalkan</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;