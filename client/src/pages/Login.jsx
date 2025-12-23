// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = { usernameOrEmail, password };

        try {
            const tryPayloads = [
                { usernameOrEmail, password },
                { username: usernameOrEmail, password },
                { email: usernameOrEmail, password }
            ];

            let response = null;
            for (const p of tryPayloads) {
                try {
                    response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, p);
                    if (response?.status === 200) break;
                } catch (e) {
                    console.warn('Payload gagal:', p, e.response?.status);
                }
            }

            if (!response) throw new Error('Server menolak semua varian payload');

            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('username', response.data.username);

            if (response.data.role === 'admin') navigate('/admin');
            else if (response.data.role === 'operator') navigate('/operator/schedules');
            else navigate('/');
        } catch (err) {
            console.error('Login error:', err);
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
            <style>{`
                main {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                    
                    position: relative;
                    overflow: hidden;
                }

                main::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -10%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
                    border-radius: 50%;
                }

                main::after {
                    content: '';
                    position: absolute;
                    bottom: -20%;
                    left: -5%;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(0, 153, 255, 0.08) 0%, transparent 70%);
                    border-radius: 50%;
                }

                .login-container {
                    background: white;
                    padding: 3rem;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-width: 450px;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                    border: 1px solid rgba(0, 212, 255, 0.1);
                    animation: slideUp 0.6s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                h2 {
                    margin: 0 0 0.5rem 0;
                    text-align: center;
                    font-size: 1.8rem;
                    color: #0f2027;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                }

                .subtitle {
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    padding: 12px 16px;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 500;
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                    color: #0099ff;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                label svg {
                    color: #00d4ff;
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                input {
                    width: 100%;
                    padding: 12px 16px 12px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    font-family: inherit;
                    background: white;
                    color: #0f2027;
                }

                input:focus {
                    outline: none;
                    border-color: #00d4ff;
                    background: rgba(0, 212, 255, 0.05);
                    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
                }

                .toggle-password {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #999;
                    display: flex;
                    align-items: center;
                    padding: 4px;
                    transition: color 0.2s ease;
                }

                .toggle-password:hover {
                    color: #00d4ff;
                }

                button[type="submit"] {
                    width: 100%;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #00d4ff, #0099ff);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
                }

                button[type="submit"]:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(0, 212, 255, 0.4);
                }

                button[type="submit"]:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .register-link {
                    margin-top: 2rem;
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                }

                .register-link a {
                    color: #00d4ff;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.3s ease;
                }

                .register-link a:hover {
                    color: #0099ff;
                }

                @media (max-width: 768px) {
                    .login-container {
                        padding: 2rem;
                    }

                    h2 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
<Navbar />
            <main>
                <div className="login-container">
                    <h2>
                        <LogIn size={28} />
                        Login
                    </h2>
                    <p className="subtitle">Masuk ke akun Anda untuk melanjutkan</p>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                <Mail size={18} />
                                Username atau Email
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    required
                                    placeholder="Masukkan username atau email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                <Lock size={18} />
                                Password
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    placeholder="Masukkan password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    <div className="register-link">
                        Belum punya akun?{' '}
                        <Link to="/register">Daftar di sini</Link>
                    </div>
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                        <Link to="/forgot-password">Lupa password?</Link>
                    </div>
                </div>
            </main>
<Footer />
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Login;