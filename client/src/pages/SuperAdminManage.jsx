import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const SuperAdminManage = () => {
    const [roleFilter, setRoleFilter] = useState('all');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ username: '', password: '', role: 'admin' });
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('adminToken');
            const params = {};
            if (roleFilter === 'admin' || roleFilter === 'operator') params.role = roleFilter;
            const res = await axios.get('/api/superadmin/users', { params, headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data || []);
        } catch (err) { console.error(err); setError('Gagal memuat pengguna.'); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault(); setError('');
        if (!form.username || !form.password) { setError('Username dan password harus diisi.'); return; }
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/superadmin/users', form, { headers: { Authorization: `Bearer ${token}` } });
            setForm({ username: '', password: '', role: 'admin' });
            setShowForm(false);
            fetchUsers();
            alert('Pengguna berhasil dibuat.');
        } catch (err) { console.error(err); setError(err.response?.data?.msg || 'Gagal membuat pengguna.'); }
    };

    const startEdit = (u) => { setEditing(u._id); setForm({ username: u.username, password: '', role: u.role }); setShowForm(true); };

    const handleUpdate = async (e) => {
        e.preventDefault(); setError('');
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`/api/superadmin/users/${editing}`, form, { headers: { Authorization: `Bearer ${token}` } });
            setEditing(null); setForm({ username: '', password: '', role: 'admin' });
            setShowForm(false);
            fetchUsers();
            alert('Pengguna berhasil diperbarui.');
        } catch (err) { console.error(err); setError(err.response?.data?.msg || 'Gagal memperbarui pengguna.'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/superadmin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(prev => prev.filter(u => u._id !== id));
            alert('Pengguna berhasil dihapus.');
        } catch (err) { console.error(err); setError('Gagal menghapus pengguna.'); }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditing(null);
        setForm({ username: '', password: '', role: 'admin' });
        setError('');
    };

    return (
        <>
            <AdminNavbar />
            <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Kelola Admin & Operator</h2>

            {/* Filter Section */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '6px' }}>
                <label style={{ marginRight: '1rem' }}>Filter per role: </label>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ marginRight: '1rem', padding: '0.5rem' }}>
                    <option value="all">Semua (admin & operator)</option>
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                </select>
                <button onClick={fetchUsers} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Refresh</button>
                <button onClick={() => { setShowForm(true); setEditing(null); setForm({ username: '', password: '', role: 'admin' }); }} style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Tambah Admin/Operator</button>
            </div>

            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

            {/* Users List Section */}
            <h3>Daftar Pengguna</h3>
            {loading ? (
                <p>Memuat...</p>
            ) : users.length === 0 ? (
                <p style={{ color: '#666' }}>Tidak ada pengguna.</p>
            ) : (
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
                    {users.map(u => (
                        <div key={u._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                            <div>
                                <strong style={{ fontSize: '1.1rem' }}>{u.username}</strong>
                                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Role: <span style={{ fontWeight: 'bold', color: u.role === 'admin' ? '#007bff' : '#17a2b8' }}>{u.role}</span></div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => startEdit(u)} style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(u._id)} style={{ padding: '0.5rem 1rem', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Modal/Section */}
            {showForm && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', border: '2px solid #007bff', borderRadius: '6px' }}>
                    <h3>{editing ? 'Edit Pengguna' : 'Buat Pengguna Baru'}</h3>
                    <form onSubmit={editing ? handleUpdate : handleCreate} style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Username</label>
                            <input 
                                placeholder="Masukkan username" 
                                value={form.username} 
                                onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))} 
                                required 
                                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                            <input 
                                placeholder={editing ? "Biarkan kosong jika tidak ingin mengubah" : "Masukkan password"} 
                                value={form.password} 
                                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} 
                                type="password" 
                                required={!editing}
                                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Role</label>
                            <select 
                                value={form.role} 
                                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                            >
                                <option value="admin">Admin</option>
                                <option value="operator">Operator</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" style={{ flex: 1, padding: '0.6rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {editing ? 'Simpan Perubahan' : 'Buat Pengguna'}
                            </button>
                            <button type="button" onClick={cancelForm} style={{ flex: 1, padding: '0.6rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}
            </div>
        </>
    );
};

export default SuperAdminManage;
