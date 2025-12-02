// client/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Users, ArrowLeft, CheckCircle, AlertCircle, Save, Loader } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';  
const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/users/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = response.data;
            setProfile({
                username: data.username || '',
                email: data.email || '',
                fullName: data.fullName || '',
                phoneNumber: data.phoneNumber || '',
                gender: data.gender || '',
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Gagal memuat profil' });
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.put(
                `${import.meta.env.VITE_SERVER_URL}/api/users/profile`,
                {
                    fullName: profile.fullName,
                    phoneNumber: profile.phoneNumber,
                    gender: profile.gender,
                    dateOfBirth: profile.dateOfBirth
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedUser = response.data;
            setProfile({
                username: updatedUser.username || '',
                email: updatedUser.email || '',
                fullName: updatedUser.fullName || '',
                phoneNumber: updatedUser.phoneNumber || '',
                gender: updatedUser.gender || '',
                dateOfBirth: updatedUser.dateOfBirth ? new Date(updatedUser.dateOfBirth).toISOString().split('T')[0] : ''
            });
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Gagal memperbarui profil' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <style>{`
                    .loading-container {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                        text-align: center;
                    }

                    .spinner {
                        animation: spin 1s linear infinite;
                        color: #00d4ff;
                        margin-bottom: 1rem;
                    }

                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                <main className="loading-container">
                    <Loader size={48} className="spinner" />
                    <p style={{ color: '#666', fontSize: '1rem' }}>Memuat profil Anda...</p>
                </main>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <style>{`
                main {
                    flex: 1;
                    padding: 4rem 2rem;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
                    max-width: 700px;
                    margin: 0 auto;
                    width: 100%;
                }

                h2 {
                    text-align: center;
                    font-size: clamp(1.8rem, 4vw, 2.5rem);
                    color: #0f2027;
                    margin-bottom: 2rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .message-alert {
                    padding: 1rem;
                    margin-bottom: 2rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    animation: slideDown 0.3s ease;
                }

                .message-alert.success {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #10b981;
                }

                .message-alert.error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                form {
                    background: white;
                    padding: 3rem;
                    border-radius: 16px;
                    box-shadow: 0 12px 40px rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                }

                .form-group {
                    margin-bottom: 2rem;
                }

                .form-group:last-of-type {
                    margin-bottom: 2.5rem;
                }

                label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                    color: #0099ff;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                label svg {
                    color: #00d4ff;
                }

                input, select {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    font-family: inherit;
                    background: white;
                    color: #0f2027;
                }

                input:focus, select:focus {
                    outline: none;
                    border-color: #00d4ff;
                    background: rgba(0, 212, 255, 0.05);
                    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
                }

                input:disabled {
                    background: #f5f5f5;
                    cursor: not-allowed;
                    color: #999;
                    border-color: #ddd;
                }

                .helper-text {
                    font-size: 0.85rem;
                    color: #999;
                    margin-top: 0.5rem;
                    display: block;
                }

                .validation-text {
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    color: #10b981;
                    font-weight: 500;
                }

                .validation-text svg {
                    width: 16px;
                    height: 16px;
                }

                .button-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                button {
                    padding: 14px 24px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .btn-save {
                    background: linear-gradient(135deg, #00d4ff, #0099ff);
                    color: white;
                    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
                }

                .btn-save:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(0, 212, 255, 0.4);
                }

                .btn-save:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-back {
                    background: linear-gradient(135deg, #6b7280, #4b5563);
                    color: white;
                    box-shadow: 0 8px 24px rgba(107, 114, 128, 0.2);
                }

                .btn-back:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(107, 114, 128, 0.3);
                }

                .section-divider {
                    margin: 2rem 0;
                    padding-top: 2rem;
                    border-top: 2px solid rgba(0, 212, 255, 0.1);
                }

                .section-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #0099ff;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .section-title::before {
                    content: '';
                    width: 4px;
                    height: 4px;
                    background: #00d4ff;
                    border-radius: 50%;
                }

                @media (max-width: 768px) {
                    main {
                        padding: 2rem 1rem;
                    }

                    form {
                        padding: 2rem;
                    }

                    .button-group {
                        grid-template-columns: 1fr;
                    }

                    h2 {
                        flex-direction: column;
                    }
                }
            `}</style>
<Navbar />
            <main>
                <h2>
                    <User size={32} />
                    Profil Saya
                </h2>

                {message.text && (
                    <div className={`message-alert ${message.type}`}>
                        {message.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Read-only Section */}
                    <div className="section-title">📋 Informasi Akun (Tidak Dapat Diubah)</div>

                    <div className="form-group">
                        <label>
                            <User size={18} />
                            Username
                        </label>
                        <input
                            type="text"
                            value={profile.username}
                            disabled
                        />
                        <span className="helper-text">Username tidak dapat diubah untuk keamanan akun</span>
                    </div>

                    <div className="form-group">
                        <label>
                            <Mail size={18} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                        />
                        <span className="helper-text">Email tidak dapat diubah. Hubungi admin jika perlu bantuan</span>
                    </div>

                    {/* Editable Section */}
                    <div className="section-divider">
                        <div className="section-title">✏️ Informasi Pribadi (Dapat Diubah)</div>
                    </div>

                    <div className="form-group">
                        <label>
                            <User size={18} />
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap Anda"
                        />
                        {profile.fullName && (
                            <div className="validation-text">
                                <CheckCircle size={16} />
                                {profile.fullName}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <Phone size={18} />
                            Nomor Telepon
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                            placeholder="Contoh: 08123456789"
                        />
                        {profile.phoneNumber && (
                            <div className="validation-text">
                                <CheckCircle size={16} />
                                {profile.phoneNumber}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <Users size={18} />
                            Jenis Kelamin
                        </label>
                        <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                        >
                            <option value="">Pilih jenis kelamin</option>
                            <option value="Laki-laki">🧑 Laki-laki</option>
                            <option value="Perempuan">👩 Perempuan</option>
                        </select>
                        {profile.gender && (
                            <div className="validation-text">
                                <CheckCircle size={16} />
                                {profile.gender}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <Calendar size={18} />
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={profile.dateOfBirth}
                            onChange={handleChange}
                        />
                        {profile.dateOfBirth && (
                            <div className="validation-text">
                                <CheckCircle size={16} />
                                {new Date(profile.dateOfBirth).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        )}
                    </div>

                    <div className="button-group">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-save"
                        >
                            {saving ? (
                                <>
                                    <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="btn-back"
                        >
                            <ArrowLeft size={18} />
                            Kembali
                        </button>
                    </div>
                </form>
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

export default Profile;