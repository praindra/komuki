import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Cancel = () => {
    const [reservationId, setReservationId] = useState('');
    const [queueNumber, setQueueNumber] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState(''); // 'success' or 'error'

    const handleCancel = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/reservations/cancel`, { reservationId, queueNumber });
            setPopupMessage('Reservasi berhasil dibatalkan!');
            setPopupType('success');
            setShowPopup(true);
            setReservationId('');
            setQueueNumber('');
        } catch (error) {
            console.error('Error canceling reservation:', error);
            const errorMessage = error.response?.data?.msg || 'Gagal membatalkan reservasi. Mohon periksa kembali ID dan nomor antrian.';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
    };

    return (
        <div>
            <Navbar />
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Batalkan Reservasi</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '2rem auto' }}>
                    <label>
                        No Antrian:
                        <input type="text" value={queueNumber} onChange={(e) => setQueueNumber(e.target.value)} />
                    </label>
                    <label>
                        ID Antrian:
                        <input type="text" value={reservationId} onChange={(e) => setReservationId(e.target.value)} />
                    </label>
                    <button onClick={handleCancel} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Batalkan Reservasi
                    </button>
                </div>
            </main>
            {showPopup && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: popupType === 'success' ? '#d4edda' : '#f8d7da',
                    color: popupType === 'success' ? '#155724' : '#721c24',
                    padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.3)', zIndex: 1000
                }}>
                    <p>{popupMessage}</p>
                    <button onClick={() => setShowPopup(false)} style={{ background: 'none', border: '1px solid #ccc', padding: '5px 10px', cursor: 'pointer' }}>Tutup</button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Cancel;