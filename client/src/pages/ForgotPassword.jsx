import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message || 'Jika email terdaftar, tautan reset sudah dikirim.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: 480, width: '100%', padding: 24 }}>
          <h2>Lupa Password</h2>
          <p>Masukkan email yang terdaftar untuk menerima tautan reset password.</p>
          {message && <div style={{ background: '#e6fffa', padding: 12, borderRadius: 8 }}>{message}</div>}
          {error && <div style={{ background: '#ffe6e6', padding: 12, borderRadius: 8 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 12 }}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
                Kirim
              </button>
              <button type="button" onClick={() => navigate(-1)} style={{ padding: '8px 16px' }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
