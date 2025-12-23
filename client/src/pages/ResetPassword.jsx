import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !id) {
      setError('Token tidak ditemukan');
    }
  }, [token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 6) return setError('Password minimal 6 karakter');
    if (password !== confirm) return setError('Password dan konfirmasi tidak cocok');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/reset-password`, { token, id, password });
      setMessage(res.data.message || 'Password berhasil direset');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: 480, width: '100%', padding: 24 }}>
          <h2>Reset Password</h2>
          {message && <div style={{ background: '#e6fffa', padding: 12, borderRadius: 8 }}>{message}</div>}
          {error && <div style={{ background: '#ffe6e6', padding: 12, borderRadius: 8 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 12 }}>
              <label>Password Baru</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Konfirmasi Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
                {loading ? 'Memproses...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
