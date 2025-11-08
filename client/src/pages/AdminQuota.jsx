import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import PopUp from '../components/PopUp';
import * as quotaService from '../services/quotaService';

const AdminQuota = () => {
    const [quotaLimit, setQuotaLimit] = useState('');
    const [currentQuota, setCurrentQuota] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    useEffect(() => {
        fetchQuota();
    }, []);

    const fetchQuota = async () => {
        try {
            const data = await quotaService.getQuota();
            setCurrentQuota(data);
            if (data) {
                setQuotaLimit(data.limit);
            }
        } catch (error) {
            console.error('Error fetching quota:', error);
            setPopupMessage('Gagal mengambil kuota antrian.');
            setPopupType('error');
            setShowPopup(true);
        }
    };

    const handleSubmitQuota = async (e) => {
        e.preventDefault();
        const limit = parseInt(quotaLimit, 10);
        if (isNaN(limit) || limit <= 0) {
            setPopupMessage('Masukkan angka limit yang valid (> 0).');
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        try {
            if (currentQuota) {
                // Edit existing quota
                const updatedQuota = await quotaService.updateQuota(currentQuota._id, { limit });
                setPopupMessage('Kuota antrian berhasil diperbarui!');
                setCurrentQuota(updatedQuota);
            } else {
                // Create new quota
                const newQuota = await quotaService.createQuota({ limit });
                setPopupMessage('Kuota antrian berhasil dibuat!');
                setCurrentQuota(newQuota);
            }
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
            console.error('Error setting quota:', error);
            setPopupMessage(error.response?.data?.msg || 'Gagal mengatur kuota antrian.');
            setPopupType('error');
            setShowPopup(true);
        }
    };

    return (
        <div>
            <AdminNavbar />
            <main style={{ padding: '2rem' }}>
                <h2>Kelola Kuota / Limit Antrian</h2>

                <div style={{ marginBottom: '2rem' }}>
                    <h3>Kuota Antrian Saat Ini: {currentQuota ? currentQuota.limit : 'Belum diatur'}</h3>
                </div>

                <form onSubmit={handleSubmitQuota} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <label>
                        Jumlah Kuota Antrian:
                        <input
                            type="number"
                            value={quotaLimit}
                            onChange={(e) => setQuotaLimit(e.target.value)}
                            placeholder="Masukkan jumlah kuota"
                            required
                            min="1"
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </label>
                    <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {currentQuota ? 'Update Kuota' : 'Atur Kuota'}
                    </button>
                </form>
            </main>
            {showPopup && (
                <PopUp
                    message={popupMessage}
                    type={popupType}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
};

export default AdminQuota;