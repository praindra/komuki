import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FeedbackTable = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [kritikMessage, setKritikMessage] = useState('');
    const [saranMessage, setSaranMessage] = useState('');
    const [category, setCategory] = useState('kritik');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('/api/feedback');
            setFeedbacks(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setFeedbacks([]);
        }
    };

    const submitFeedback = async (category) => {
        const message = category === 'saran' ? saranMessage : kritikMessage;
        if (!message || !message.trim()) {
            setError('Pesan tidak boleh kosong');
            return;
        }
        if (message.length > 200) {
            setError('Pesan maksimal 200 karakter');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
            if (!token) {
                setError('Silakan login terlebih dahulu untuk mengirim feedback.');
                setLoading(false);
                return;
            }
            await axios.post('/api/feedback', { message, category }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (category === 'saran') setSaranMessage(''); else setKritikMessage('');
            fetchFeedbacks(); // Refresh the list
        } catch (err) {
            setError('Gagal mengirim pesan. Pastikan Anda sudah login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '2rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.5)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }}>
            <h4 style={{
                marginBottom: '1.5rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>Kritik dan Saran</h4>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* LEFT: Input Form */}
                <div>
                    <h5 style={{ margin: '0 0 0.75rem 0' }}>Kirim Kritik atau Saran</h5>
                    {(() => {
                        const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
                        if (!token) {
                            return (
                                <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                                    <p style={{ margin: 0, color: '#ccc' }}>Silakan <Link to="/login">login</Link> untuk mengirim kritik atau saran.</p>
                                </div>
                            );
                        }

                        return (
                            <div>
                                <textarea
                                    value={kritikMessage}
                                    onChange={(e) => setKritikMessage(e.target.value)}
                                    placeholder="Tulis kritik atau saran Anda (maks 200 karakter)..."
                                    maxLength={200}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', minHeight: '100px' }}
                                />
                                <p style={{ fontSize: '0.8rem', color: '#ccc', margin: '0.25rem 0' }}>{kritikMessage.length}/200 karakter</p>
                                {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}
                                <button onClick={() => submitFeedback('kritik')} disabled={loading} style={{ padding: '0.5rem 1rem', background: '#00d4ff', borderRadius: 6, border: 'none', color: '#0f2027', cursor: 'pointer', marginRight: '0.5rem' }}>
                                    {loading ? 'Mengirim...' : 'Kirim'}
                                </button>
                            </div>
                        );
                    })()}
                </div>

                {/* RIGHT: Display Messages */}
                <div>
                    <h5 style={{ margin: '0 0 0.75rem 0' }}>Kritik dan Saran</h5>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {feedbacks.length === 0 ? (
                            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Belum ada pesan.</p>
                        ) : (
                            feedbacks.map((fb, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem'
                                }}>
                                    <strong>{fb.user?.username || 'Anonim'}:</strong> {fb.message}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default FeedbackTable;
