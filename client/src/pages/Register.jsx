// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, CheckCircle, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

            alert('Registrasi berhasil! Anda akan diarahkan ke halaman utama.');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Gagal mendaftar. Silakan coba lagi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const passwordMatch = password && confirmPassword && password === confirmPassword;
    const passwordMismatch = confirmPassword && password !== confirmPassword;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style>{`
                main {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
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

                .register-container {
                    background: white;
                    padding: 3rem;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-width: 500px;
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

                .required {
                    color: #ef4444;
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

                .helper-text {
                    font-size: 0.85rem;
                    color: #666;
                    margin-top: 0.5rem;
                    display: block;
                }

                .validation-text {
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-weight: 500;
                }

                .validation-text.success {
                    color: #10b981;
                }

                .validation-text.error {
                    color: #ef4444;
                }

                button[type="submit"] {
                    width: 100%;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #10b981, #059669);
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
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
                }

                button[type="submit"]:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
                }

                button[type="submit"]:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .login-link {
                    margin-top: 2rem;
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                }

                .login-link a {
                    color: #00d4ff;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.3s ease;
                }

                .login-link a:hover {
                    color: #0099ff;
                }

                @media (max-width: 768px) {
                    .register-container {
                        padding: 2rem;
                    }

                    h2 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
<Navbar />
            <main>
                <div className="register-container">
                    <h2>
                        <UserPlus size={28} />
                        Daftar
                    </h2>
                    <p className="subtitle">Buat akun baru untuk mulai melakukan reservasi</p>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                <User size={18} />
                                Username
                                <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={handleChange}
                                    required
                                    maxLength="50"
                                    placeholder="Pilih username unik"
                                />
                            </div>
                            <span className="helper-text">{username.length}/50 karakter</span>
                        </div>

                        <div className="form-group">
                            <label>
                                <Mail size={18} />
                                Email
                                <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    required
                                    placeholder="contoh@email.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                <Lock size={18} />
                                Password
                                <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    placeholder="Minimal 6 karakter"
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

                        <div className="form-group">
                            <label>
                                <Lock size={18} />
                                Konfirmasi Password
                                <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    placeholder="Ulangi password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {passwordMatch && (
                                <div className="validation-text success">
                                    <CheckCircle size={16} />
                                    Password cocok
                                </div>
                            )}
                            {passwordMismatch && (
                                <div className="validation-text error">
                                    <AlertCircle size={16} />
                                    Password tidak cocok
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Daftar
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-link">
                        Sudah punya akun?{' '}
                        <Link to="/login">Login di sini</Link>
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


export default Register;