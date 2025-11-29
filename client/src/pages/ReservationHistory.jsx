import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import html2canvas from 'html2canvas';

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
    const [statusFilter, setStatusFilter] = useState('all');

    const handleCancel = async (reservationId) => {
        if (!window.confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) {
            return;
        }
        try {
            const token = localStorage.getItem('userToken');
            await axios.put(
                `${import.meta.env.VITE_SERVER_URL}/api/users/reservations/cancel`,
                { reservationId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Refresh the reservations list
            window.location.reload();
        } catch (err) {
            console.error('Error canceling reservation:', err);
            alert('Gagal membatalkan reservasi. Silakan coba lagi.');
        }
    };

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('userToken');
                const params = {
                    page,
                    limit,
                };
                if (statusFilter !== 'all') params.status = statusFilter;
                const response = await axios.get(
                    import.meta.env.VITE_SERVER_URL + '/api/reservations/my-history',
                    {
                        headers: {
                            Authorization: 'Bearer ' + token,
                        },
                        params,
                    }
                );
                setReservations(response.data?.reservations || []);
                setTotal(response.data?.total || 0);
            } catch (err) {
                console.error('Error fetching reservation history:', err);
                setError('Gagal memuat riwayat reservasi. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [page, statusFilter]);

    const totalPages = Math.ceil(total / limit);

    const safeReservations = reservations || [];

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
                        <label>Status: </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Semua</option>
                            <option value="pending">Pending</option>
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
                ) : safeReservations.length === 0 ? (
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
                            {safeReservations.map((reservation) => {
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
                                        <div style={{ fontWeight: '700', fontSize: '1.3rem' }}>
                                            {reservation.patientName || 'Tidak diketahui'}
                                        </div>
                                        <div>No Antrian: {reservation.queueNumber || 'Tidak tersedia'}</div>
                                        <div>ID Reservasi: {reservation.reservationId || 'Tidak tersedia'}</div>
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
                                        <div>Dokter: {reservation.doctor?.name || 'Tidak diketahui'}</div>
                                        <div>
                                            Tanggal Periksa:{' '}
                                            {new Date(
                                                reservation.appointmentDate || reservation.date
                                            ).toLocaleDateString()}
                                        </div>
                                        <div>
                                            Tanggal Lahir:{' '}
                                            {reservation.patientDOB ? new Date(reservation.patientDOB).toLocaleDateString() : 'Tidak tersedia'}
                                        </div>
                                        <div>No HP: {reservation.phoneNumber || 'Tidak tersedia'}</div>
                                        <div>Wali: {reservation.parentName || 'Tidak tersedia'}</div>
                                        <div>
                                            Dibuat:{' '}
                                            {new Date(reservation.createdAt).toLocaleDateString()}
                                        </div>
                                        <div id={`reservation-details-${reservation._id}`} style={{ border: '1px solid #ccc', padding: '2rem', maxWidth: '600px', margin: '2rem auto', textAlign: 'center', display: 'none' }}>
                                            <h3>Detail Reservasi Anda:</h3>
                                            <p><strong>Poli Anak</strong></p>
                                            <p>Nama Dokter: {reservation.doctor?.name || 'Menyesuaikan jadwal'}</p>
                                            <p>No Antrian: {reservation.queueNumber}</p>
                                            <p>ID Antrian: {reservation.reservationId}</p>
                                            <p>Nama Pasien: {reservation.patientName}</p>
                                            <p>Tanggal Lahir Pasien: {reservation.patientDOB ? new Date(reservation.patientDOB).toLocaleDateString() : 'Tidak tersedia'}</p>
                                            <p>Status: {reservation.status || 'Tidak diketahui'}</p>
                                            <p>Terima kasih telah menunggu!</p>
                                            <p>Tanggal Pemeriksaan: {new Date(reservation.appointmentDate || reservation.date).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <button
                                                onClick={() => {
                                                    const input = document.getElementById(`reservation-details-${reservation._id}`);
                                                    const clone = input.cloneNode(true);
                                                    clone.style.display = 'block';
                                                    clone.style.position = 'absolute';
                                                    clone.style.left = '-9999px';
                                                    clone.style.top = '-9999px';
                                                    document.body.appendChild(clone);
                                                    html2canvas(clone).then((canvas) => {
                                                        const imgData = canvas.toDataURL('image/png');
                                                        const link = document.createElement('a');
                                                        link.href = imgData;
                                                        link.download = `reservasi_${reservation.patientName}.png`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                        document.body.removeChild(clone);
                                                    });
                                                }}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#28a745',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Download Bukti Reservasi
                                            </button>
                                            {status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(reservation._id)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#dc3545',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Batalkan
                                                </button>
                                            )}
                                        </div>
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