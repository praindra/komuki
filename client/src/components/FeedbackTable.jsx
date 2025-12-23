import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FeedbackTable = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isHovered, setIsHovered] = useState(false);

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

    const validateMessage = (msg) => {
        if (!msg || !msg.trim()) {
            return 'Pesan tidak boleh kosong';
        }
        if (msg.length > 200) {
            return 'Pesan maksimal 200 karakter';
        }
        return null;
    };

    const submitFeedback = async () => {
        const validationError = validateMessage(message);
        if (validationError) {
            setError(validationError);
            return;
        }

        const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
        if (!token) {
            setError('Silakan login terlebih dahulu untuk mengirim feedback.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('/api/feedback', 
                { message, category: 'kritik' }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('');
            fetchFeedbacks();
        } catch (err) {
            setError('Gagal mengirim pesan. Pastikan Anda sudah login.');
        } finally {
            setLoading(false);
        }
    };

    const isLoggedIn = localStorage.getItem('userToken') || localStorage.getItem('adminToken');

    const containerStyle = {
        padding: '2rem',
        borderRadius: '12px',
        background: isHovered ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isHovered ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.3s ease'
    };

    const titleStyle = {
        marginBottom: '1.5rem',
        fontSize: '1.1rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    };

    const textareaStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '6px',
        minHeight: '100px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: 'inherit',
        fontSize: '0.9rem',
        resize: 'vertical',
        fontFamily: 'inherit'
    };

    const buttonStyle = {
        padding: '0.6rem 1.5rem',
        background: loading ? '#888' : '#00d4ff',
        borderRadius: '6px',
        border: 'none',
        color: '#0f2027',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        transition: 'all 0.2s ease'
    };

    const feedbackItemStyle = {
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '0.75rem',
        borderRadius: '6px',
        marginBottom: '0.75rem',
        fontSize: '0.9rem',
        borderLeft: '3px solid #00d4ff'
    };

    return (
        <div 
            style={containerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h4 style={titleStyle}>Kritik dan Saran</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Form Input */}
                <div>
                    <h5 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
                        Kirim Kritik atau Saran
                    </h5>
                    
                    {!isLoggedIn ? (
                        <div style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <p style={{ margin: 0, color: '#ccc' }}>
                                Silakan <Link to="/login" style={{ color: '#00d4ff' }}>login</Link> untuk mengirim kritik atau saran.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <textarea
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    setError('');
                                }}
                                placeholder="Tulis kritik atau saran Anda (maksimal 200 karakter)..."
                                maxLength={200}
                                style={textareaStyle}
                            />
                            <p style={{ 
                                fontSize: '0.8rem', 
                                color: '#999', 
                                margin: '0.5rem 0' 
                            }}>
                                {message.length}/200 karakter
                            </p>
                            
                            {error && (
                                <p style={{ 
                                    color: '#ff4444', 
                                    fontSize: '0.85rem',
                                    margin: '0.5rem 0' 
                                }}>
                                    {error}
                                </p>
                            )}
                            
                            <button 
                                onClick={submitFeedback} 
                                disabled={loading}
                                style={buttonStyle}
                                onMouseEnter={(e) => {
                                    if (!loading) e.target.style.background = '#00b8e6';
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) e.target.style.background = '#00d4ff';
                                }}
                            >
                                {loading ? 'Mengirim...' : 'Kirim Pesan'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Display Messages */}
                <div>
                    <h5 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
                        Pesan Terbaru
                    </h5>
                    <div style={{ 
                        maxHeight: '300px', 
                        overflowY: 'auto',
                        paddingRight: '0.5rem'
                    }}>
                        {feedbacks.length === 0 ? (
                            <p style={{ 
                                fontSize: '0.9rem', 
                                color: '#888',
                                textAlign: 'center',
                                padding: '2rem 0'
                            }}>
                                Belum ada pesan.
                            </p>
                        ) : (
                            feedbacks.map((fb, i) => (
                                <div key={i} style={feedbackItemStyle}>
                                    <strong style={{ color: '#00d4ff' }}>
                                        {fb.user?.username || 'Anonim'}:
                                    </strong>{' '}
                                    <span style={{ color: '#000000ff' }}>
                                        {fb.message}
                                    </span>
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