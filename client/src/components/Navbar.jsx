import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, FileText, History, Home } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        navigate('/login');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { to: '/', label: 'Beranda', icon: Home, show: true },
        { to: '/form', label: 'Formulir', icon: FileText, show: !!token },
        { to: '/history', label: 'Riwayat', icon: History, show: !!token },
        { to: '/profile', label: 'Profil', icon: User, show: !!token },
    ];

    return (
        <>
            <nav style={{
                background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                color: 'white',
                padding: '1rem 2rem',
                boxShadow: '0 8px 32px rgba(0, 212, 255, 0.15)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                borderBottom: '2px solid rgba(0, 212, 255, 0.2)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    {/* Logo/Brand */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                        }}>
                            RS
                        </div>
                        <div>
                            <div style={{
                                fontWeight: '700',
                                fontSize: '1.2rem',
                                color: 'white',
                                letterSpacing: '0.05em'
                            }}>
                                Reservasi RS
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#00d4ff',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'
                            }}>
                                Bina Bhakti
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                    }} className="desktop-menu">
                        {/* Navigation Links */}
                        <ul style={{
                            listStyle: 'none',
                            display: 'flex',
                            gap: '2rem',
                            alignItems: 'center',
                            margin: 0,
                            padding: 0
                        }}>
                            {navLinks.map((link) => link.show && (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.3s ease',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            position: 'relative'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = '#00d4ff';
                                            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <link.icon size={18} />
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Auth Section */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            borderLeft: '2px solid rgba(0, 212, 255, 0.2)',
                            paddingLeft: '2rem'
                        }}>
                            {token ? (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#00d4ff',
                                        fontWeight: '500'
                                    }}>
                                        <User size={18} />
                                        <span>{username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 18px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                                        }}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                                            e.currentTarget.style.color = '#00d4ff';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        style={{
                                            background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                                            color: 'white',
                                            padding: '8px 18px',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)',
                                            display: 'inline-block'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 212, 255, 0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.2)';
                                        }}
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                        className="mobile-menu-btn"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div style={{
                    background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                    borderTop: '2px solid rgba(0, 212, 255, 0.2)',
                    padding: '1rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'sticky',
                    top: '70px',
                    zIndex: 999
                }}>
                    {navLinks.map((link) => link.show && (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                background: 'rgba(0, 212, 255, 0.05)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 212, 255, 0.15)';
                                e.currentTarget.style.color = '#00d4ff';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 212, 255, 0.05)';
                                e.currentTarget.style.color = 'white';
                            }}
                        >
                            <link.icon size={20} />
                            {link.label}
                        </Link>
                    ))}

                    <div style={{
                        borderTop: '1px solid rgba(0, 212, 255, 0.2)',
                        paddingTop: '1rem',
                        marginTop: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        {token ? (
                            <>
                                <div style={{
                                    color: '#00d4ff',
                                    fontWeight: '500',
                                    fontSize: '0.9rem'
                                }}>
                                    {username}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        background: 'rgba(0, 212, 255, 0.1)',
                                        border: '1px solid rgba(0, 212, 255, 0.3)'
                                    }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                                        color: 'white',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)'
                                    }}
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Styles for responsive behavior */}
            <style>{`
                @media (max-width: 768px) {
                    .desktop-menu {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: block !important;
                    }
                }
                @media (min-width: 769px) {
                    .mobile-menu-btn {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;