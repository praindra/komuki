import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const statusColors = {
    confirmed: '#28a745',
    pending: '#ffc107',
    cancelled: '#dc3545',
    completed: '#17a2b8',
};

const ReservationHistory = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(5);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('adminToken');
                const params = {
                    page,
                    limit,
                };
                if (startDate) params.startDate = startDate;
                if (endDate) params.endDate = endDate;
                if (statusFilter) params.status = statusFilter;

                const response = await axios.get(
                    import.meta.env.VITE_SERVER_URL + '/api/users/reservations',
                    {
                        headers: {
                            Authorization: 'Bearer ' + token,
                        },
                        params,
                    }
                );

                setReservations(response.data.reservations);
                setTotal(response.data.total);
            } catch (err) {
                console.error('Error fetching reservation history:', err);
                setError('Gagal memuat riwayat reservasi. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [page, startDate, endDate, statusFilter]);

    const totalPages = Math.ceil(total / limit);

    const handleCancel = async (reservationId) => {
        if (!window.confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) return;

        setCancellingId(reservationId);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(
                import.meta.env.VITE_SERVER_URL + '/api/users/reservations/cancel',
                { reservationId: reservationId },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                }
            );
            fetchReservations();
        } catch (err) {
            console.error('Error cancelling reservation:', err);
            setError('Gagal membatalkan reservasi. Silakan coba lagi.');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div>
            <Navbar />
            <main
                style={{
                    maxWidth: '900px',
                    margin: '2rem auto',
                    padding: '0 1rem',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    Riwayat Reservasi Anda
                </h2>

                {/* Filter Section */}
                <div
                    style={{
                        marginBottom: '1rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        justifyContent: 'center',
                    }}
                >
                    <div>
                        <label>Tanggal Mulai: </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Tanggal Akhir: </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Status: </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Semua</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ margin: 'auto', background: 'none', display: 'block' }}
                            width="50px"
                            height="50px"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="xMidYMid"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                fill="none"
                                stroke="#007bff"
                                strokeWidth="10"
                                r="35"
                                strokeDasharray="164.93361431346415 56.97787143782138"
                            >
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    repeatCount="indefinite"
                                    dur="1s"
                                    values="0 50 50;360 50 50"
                                    keyTimes="0;1"
                                />
                            </circle>
                        </svg>
                        <p>Memuat riwayat reservasi...</p>
                    </div>
                ) : error ? (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                ) : reservations.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '2rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            color: '#6c757d',
                            fontStyle: 'italic',
                        }}
                    >
                        Anda belum memiliki riwayat reservasi.
                    </div>
                ) : (
                    <>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {reservations.map((reservation) => {
                                const status = (reservation.status || '').toLowerCase();
                                return (
                                    <li
                                        key={reservation._id}
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                            marginBottom: '1rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                                            Dokter: {reservation.doctor?.name || 'Tidak diketahui'}
                                        </div>
                                        <div>
                                            Tanggal:{' '}
                                            {new Date(
                                                reservation.appointmentDate || reservation.date
                                            ).toLocaleDateString()}
                                        </div>
                                        <div>
                                            Waktu: {reservation.time || 'Tidak tersedia'}
                                        </div>
                                        <div>
                                            Status:{' '}
                                            <span
                                                style={{
                                                    color: statusColors[status] || '#000',
                                                    fontWeight: '600',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {reservation.status || 'Tidak diketahui'}
                                            </span>
                                        </div>
                                        {reservation.notes && (
                                            <div>Catatan: {reservation.notes}</div>
                                        )}
                                        {status !== 'cancelled' && (
                                            <button
                                                disabled={cancellingId === reservation._id}
                                                onClick={() => handleCancel(reservation._id)}
                                                style={{
                                                    marginTop: '0.5rem',
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#dc3545',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {cancellingId === reservation._id
                                                    ? 'Membatalkan...'
                                                    : 'Batalkan'}
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Pagination Controls */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                marginBottom: '1rem',
                            }}
                        >
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            >
                                Sebelumnya
                            </button>
                            <span>
                                Halaman {page} dari {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                Berikutnya
                            </button>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ReservationHistory;
