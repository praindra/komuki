// client/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

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
    const [savedProfile, setSavedProfile] = useState({
        fullName: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: ''
    });

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

            // Update local state with the new data
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
            <div>
                <Navbar />
                <main style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Memuat profil...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Profil Saya</h2>

                {message.text && (
                    <div style={{
                        padding: '12px',
                        marginBottom: '1rem',
                        borderRadius: '6px',
                        background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={profile.username}
                            disabled
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                background: '#f5f5f5',
                                cursor: 'not-allowed'
                            }}
                        />
                        <small style={{ color: '#666' }}>Username tidak dapat diubah</small>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                background: '#f5f5f5',
                                cursor: 'not-allowed'
                            }}
                        />
                        <small style={{ color: '#666' }}>Email tidak dapat diubah</small>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                            placeholder="Masukkan nama lengkap"
                        />
                        {profile.fullName && (
                            <small style={{ color: '#28a745', marginTop: '0.25rem', display: 'block' }}>
                                ✓ Nama lengkap: {profile.fullName}
                            </small>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Nomor Telepon
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                            placeholder="Contoh: 081234567890"
                        />
                        {profile.phoneNumber && (
                            <small style={{ color: '#28a745', marginTop: '0.25rem', display: 'block' }}>
                                ✓ Nomor telepon: {profile.phoneNumber}
                            </small>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Jenis Kelamin
                        </label>
                        <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                        >
                            <option value="">Pilih jenis kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                        {profile.gender && (
                            <small style={{ color: '#28a745', marginTop: '0.25rem', display: 'block' }}>
                                ✓ Jenis kelamin: {profile.gender}
                            </small>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={profile.dateOfBirth}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                        />
                        {profile.dateOfBirth && (
                            <small style={{ color: '#28a745', marginTop: '0.25rem', display: 'block' }}>
                                ✓ Tanggal lahir: {new Date(profile.dateOfBirth).toLocaleDateString('id-ID')}
                            </small>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: saving ? '#ccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Kembali
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;