// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = { usernameOrEmail, password };
        console.log('Login payload dikirim:', payload);

        try {
            // Coba beberapa bentuk payload (backend mungkin mengharapkan 'username' atau 'email')
            const tryPayloads = [
                { usernameOrEmail, password },                       // original
                { username: usernameOrEmail, password },             // if backend expects username
                { email: usernameOrEmail, password }                 // if backend expects email
            ];

            let response = null;
            for (const p of tryPayloads) {
                try {
                    response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, p);
                    if (response?.status === 200) break;
                } catch (e) {
                    // simpan detail untuk debugging (tidak menghentikan loop)
                    console.warn('Payload gagal:', p, e.response?.status, e.response?.data);
                }
            }

            if (!response) throw new Error('Server menolak semua varian payload (cek credential atau backend)');

            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('username', response.data.username);

            if (response.data.role === 'admin') navigate('/admin');
            else if (response.data.role === 'operator') navigate('/operator/schedules');
            else navigate('/');
        } catch (err) {
            console.error('Login error full:', err);
            console.error('Server response (if ada):', err.response);
            setError(
                err.response?.data?.msg ||
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Gagal login. Silakan periksa username/email dan password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: '#f4f4f4' }}>
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%' }}>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>Login</h2>
                    
                    {error && (
                        <div style={{ 
                            background: '#f8d7da', 
                            color: '#721c24', 
                            padding: '12px', 
                            borderRadius: '6px', 
                            marginBottom: '1.5rem',
                            border: '1px solid #f5c6cb'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                                Username atau Email
                            </label>
                            <input 
                                type="text" 
                                value={usernameOrEmail} 
                                onChange={(e) => setUsernameOrEmail(e.target.value)} 
                                required 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.3s'
                                }} 
                                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                placeholder="Masukkan username atau email"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                                Password
                            </label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                minLength="6"
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.3s'
                                }} 
                                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                placeholder="Masukkan password"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                background: loading ? '#ccc' : '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
                            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
                        >
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#666' }}>
                            Belum punya akun?{' '}
                            <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '600' }}>
                                Daftar di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;