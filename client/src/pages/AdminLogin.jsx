import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, { username, password });
            localStorage.setItem('adminToken', response.data.token); // Simpan token di localStorage
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.msg || 'Gagal login.');
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4' }}>
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h2>Admin Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </label>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </label>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;