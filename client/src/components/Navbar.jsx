// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#007bff', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div className="clinic-name" style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                Reservasi Klinik Sehat
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem', alignItems: 'center', margin: 0 }}>
                <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Beranda</Link></li>
                {token && (
                    <>
                        <li><Link to="/form" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Formulir</Link></li>
                        <li><Link to="/cancel" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Batalkan</Link></li>
                    </>
                )}
                
                {token ? (
                    <>
                        <li style={{ color: 'white', fontWeight: '500' }}>
                            Halo, {username}
                        </li>
                        <li>
                            <button 
                                onClick={handleLogout}
                                style={{ 
                                    background: '#dc3545', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px 16px', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Login</Link></li>
                        <li>
                            <Link 
                                to="/register" 
                                style={{ 
                                    background: '#28a745', 
                                    color: 'white', 
                                    padding: '8px 16px', 
                                    borderRadius: '6px', 
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    display: 'inline-block'
                                }}
                            >
                                Daftar
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;