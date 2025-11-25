// client/src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import html2canvas from 'html2canvas';

const History = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        fetchMyHistory();
    }, []);

    const fetchMyHistory = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/reservations/my-history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setReservations(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching history:', err);
            setError('Gagal mengambil riwayat reservasi.');
            setLoading(false);
        }
    };

    const handlePrintDownload = (reservation) => {
        setSelectedReservation(reservation);
        // Wait for state to update, then capture
        setTimeout(() => {
            const input = document.getElementById('reservation-details-modal');
            if (input) {
                html2canvas(input).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `reservasi_${reservation.patientName}_${reservation.reservationId}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setSelectedReservation(null);
                });
            }
        }, 100);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#ffc107';
            case 'completed':
                return '#28a745';
            case 'cancelled':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Menunggu';
            case 'completed':
                return 'Selesai';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <main style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Memuat riwayat reservasi...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '2rem' }}>Riwayat Reservasi Saya</h2>

                {error && (
                    <div style={{ 
                        background: '#f8d7da', 
                        color: '#721c24', 
                        padding: '1rem', 
                        borderRadius: '6px', 
                        marginBottom: '1rem' 
                    }}>
                        {error}
                    </div>
                )}

                {reservations.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '3rem', 
                        background: '#f8f9fa', 
                        borderRadius: '8px' 
                    }}>
                        <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>
                            Anda belum memiliki riwayat reservasi.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {reservations.map((reservation) => (
                            <div 
                                key={reservation._id} 
                                style={{ 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: '8px', 
                                    padding: '1.5rem', 
                                    background: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                                            {reservation.patientName}
                                        </h3>
                                        <p style={{ margin: '0.25rem 0', color: '#666' }}>
                                            <strong>No Antrian:</strong> {reservation.queueNumber}
                                        </p>
                                        <p style={{ margin: '0.25rem 0', color: '#666' }}>
                                            <strong>ID Reservasi:</strong> {reservation.reservationId}
                                        </p>
                                    </div>
                                    <div style={{ 
                                        background: getStatusColor(reservation.status), 
                                        color: 'white', 
                                        padding: '0.5rem 1rem', 
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {getStatusText(reservation.status)}
                                    </div>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: '#f8f9fa',
                                    borderRadius: '6px',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                                            <strong>Dokter:</strong> {reservation.doctor?.name || 'Menyesuaikan jadwal'}
                                        </p>
                                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                                            <strong>Tanggal Periksa:</strong> {new Date(reservation.appointmentDate).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                                            <strong>Tanggal Lahir:</strong> {new Date(reservation.patientDOB).toLocaleDateString('id-ID')}
                                        </p>
                                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                                            <strong>No HP:</strong> {reservation.phoneNumber}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                                            <strong>Wali:</strong> {reservation.parentName}
                                        </p>
                                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                                            <strong>Dibuat:</strong> {new Date(reservation.createdAt).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handlePrintDownload(reservation)}
                                    style={{ 
                                        padding: '0.75rem 1.5rem', 
                                        background: '#007bff', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                                >
                                    Download Bukti Reservasi
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hidden modal for printing */}
                {selectedReservation && (
                    <div 
                        id="reservation-details-modal" 
                        style={{ 
                            position: 'fixed',
                            top: '-9999px',
                            left: '-9999px',
                            border: '1px solid #ccc', 
                            padding: '2rem', 
                            width: '600px', 
                            textAlign: 'center',
                            background: 'white'
                        }}
                    >
                        <h3>Detail Reservasi Anda:</h3>
                        <p><strong>Poli Anak</strong></p>
                        <p>Nama Dokter: {selectedReservation.doctor?.name || 'Menyesuaikan jadwal'}</p>
                        <p>No Antrian: {selectedReservation.queueNumber}</p>
                        <p>ID Antrian: {selectedReservation.reservationId}</p>
                        <p>Nama Pasien: {selectedReservation.patientName}</p>
                        <p>Tanggal Lahir Pasien: {new Date(selectedReservation.patientDOB).toLocaleDateString()}</p>
                        <p>Status: {getStatusText(selectedReservation.status)}</p>
                        <p>Terima kasih telah menunggu!</p>
                        <p>Tanggal Pemeriksaan: {new Date(selectedReservation.appointmentDate).toLocaleDateString()}</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default History;
