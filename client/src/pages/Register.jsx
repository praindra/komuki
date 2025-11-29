// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { username, email, password, confirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!username || !email || !password || !confirmPassword) {
            setError('Semua field harus diisi.');
            return false;
        }

        if (username.length > 50) {
            setError('Username maksimal 50 karakter.');
            return false;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok.');
            return false;
        }

        // Email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            setError('Format email tidak valid.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, {
                username,
                email,
                password
            });

            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('username', response.data.username);

            // Show success message and redirect
            alert('Registrasi berhasil! Anda akan diarahkan ke halaman utama.');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Gagal mendaftar. Silakan coba lagi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: '#f4f4f4' }}>
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%' }}>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>Daftar Akun Baru</h2>

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
                                Username <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={handleChange}
                                required
                                maxLength="50"
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
                                placeholder="Maksimal 50 karakter"
                            />
                            <small style={{ color: '#666', fontSize: '0.85rem' }}>
                                {username.length}/50 karakter
                            </small>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                                Email <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
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
                                placeholder="contoh@email.com"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                                Password <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
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
                                placeholder="Minimal 6 karakter"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                                Konfirmasi Password <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
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
                                placeholder="Masukkan password lagi"
                            />
                            {confirmPassword && password !== confirmPassword && (
                                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                                    Password tidak cocok
                                </small>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: loading ? '#ccc' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#218838')}
                            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#28a745')}
                        >
                            {loading ? 'Memproses...' : 'Daftar'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#666' }}>
                            Sudah punya akun?{' '}
                            <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '600' }}>
                                Login di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;