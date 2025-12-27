import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sendingId, setSendingId] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            const params = {};
            if (from) params.from = from;
            if (to) params.to = to;
            const res = await axios.get('/api/feedback/admin', {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data feedback.');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (id) => {
        const text = messages[id];
        if (!text || !text.trim()) {
            setError('Pesan tidak boleh kosong.');
            return;
        }
        setSendingId(id);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`/api/feedback/${id}/message`, { message: text }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(prev => ({ ...prev, [id]: '' }));
            alert('Pesan berhasil dikirim.');
        } catch (err) {
            console.error(err);
            setError(((err.response || {}).data || {}).msg || 'Gagal mengirim pesan.');
        } finally {
            setSendingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus pesan ini? Tindakan ini tidak dapat dibatalkan.')) return;
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(prev => prev.filter(f => f._id !== id));
            alert('Pesan dihapus.');
        } catch (err) {
            console.error(err);
            setError('Gagal menghapus pesan.');
        }
    };

    return (
        <>
            <AdminNavbar />
            <div style={{ padding: '1.5rem' }}>
            <h2>Kelola Pesan (Kritik & Saran)</h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.9rem' }}>Dari:</label>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                <label style={{ fontSize: '0.9rem' }}>Sampai:</label>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                <button onClick={fetchFeedbacks} style={{ padding: '0.4rem 0.8rem' }}>Filter</button>
                <button onClick={() => { setFrom(''); setTo(''); fetchFeedbacks(); }} style={{ padding: '0.4rem 0.8rem' }}>Reset</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Memuat...</p>
            ) : (
                <div style={{ display: 'grid', gap: '0.75rem'}}>
                    {feedbacks.length === 0 && <p>Tidak ada feedback.</p>}
                    {feedbacks.map(fb => (
                        <div key={fb._id} style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: '6px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'}}>
                            <div className="card_parent" style={{ flex: 1}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                    <div>
                                        <strong>{fb.user?.username || 'Anonim'}</strong>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{fb.user?.phoneNumber }</div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(fb.createdAt).toLocaleString()}</div>
                                </div>
                                <p style={{ marginTop: '0.5rem' }}>{fb.message}</p>
                            </div>
                            <button onClick={() => handleDelete(fb._id)} style={{ padding: '0.4rem 0.8rem', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', marginLeft: '0.5rem', height: 'fit-content'}}>
                                Hapus
                            </button>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </>
    );
};

export default AdminFeedback;
