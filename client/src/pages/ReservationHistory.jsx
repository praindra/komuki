import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, Trash2, Calendar, User, Phone, Clock, CheckCircle, AlertCircle, XCircle, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const statusConfig = {
    confirmed: { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: CheckCircle, label: 'Dikonfirmasi' },
    pending: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', icon: Clock, label: 'Menunggu' },
    cancelled: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: XCircle, label: 'Dibatalkan' },
    completed: { color: '#00d4ff', bgColor: 'rgba(0, 212, 255, 0.1)', icon: CheckCircle, label: 'Selesai' },
};

const ReservationHistory = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(5);
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);

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

    const handleDownload = (reservation) => {
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
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <style>{`
                main {
                    flex: 1;
                    maxWidth: 1100px;
                    margin: 0 auto;
                    padding: 4rem 2rem;
                    width: 100%;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
                }

                h2 {
                    text-align: center;
                    font-size: clamp(1.8rem, 4vw, 2.5rem);
                    color: #0f2027;
                    margin-bottom: 3rem;
                    font-weight: 700;
                    
                }

                .filter-section {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    padding: 1.5rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.08);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .filter-group label {
                    font-weight: 600;
                    color: #0f2027;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .filter-group select {
                    padding: 10px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    background: white;
                    color: #0f2027;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                }

                .filter-group select:hover,
                .filter-group select:focus {
                    border-color: #00d4ff;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                    text-align: center;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                    color: #00d4ff;
                    margin-bottom: 1rem;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .error-message {
                    color: #ef4444;
                    text-align: center;
                    padding: 2rem;
                    background: rgba(239, 68, 68, 0.05);
                    border-radius: 12px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    font-weight: 500;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                }

                .empty-state p {
                    color: #999;
                    font-style: italic;
                    margin: 0;
                }

                .reservations-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 2rem 0;
                    display: grid;
                    gap: 1.5rem;
                }

                .reservation-card {
                    background: white;
                    border-radius: 12px;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .reservation-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0, 212, 255, 0.15);
                    border-color: rgba(0, 212, 255, 0.3);
                }

                .card-header {
                    padding: 1.5rem;
                    background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(0, 153, 255, 0.05));
                    border-bottom: 2px solid rgba(0, 212, 255, 0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .card-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #0f2027;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .status-badge {
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-transform: capitalize;
                }

                .card-body {
                    padding: 1.5rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                }

                .card-body.expanded {
                    display: block;
                }

                .info-group {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .info-group svg {
                    flex-shrink: 0;
                    color: #00d4ff;
                    margin-top: 2px;
                }

                .info-content {
                    flex: 1;
                }

                .info-label {
                    font-weight: 600;
                    color: #0099ff;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.25rem;
                }

                .info-value {
                    color: #0f2027;
                    font-size: 0.95rem;
                }

                .card-footer {
                    padding: 1.5rem;
                    background: linear-gradient(135deg, rgba(0, 212, 255, 0.02), rgba(0, 153, 255, 0.02));
                    border-top: 1px solid rgba(0, 212, 255, 0.1);
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .btn {
                    padding: 10px 18px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .btn-download {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                }

                .btn-download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
                }

                .btn-cancel {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
                }

                .btn-cancel:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .pagination button {
                    padding: 10px 18px;
                    border: 2px solid #00d4ff;
                    background: white;
                    color: #00d4ff;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .pagination button:hover:not(:disabled) {
                    background: linear-gradient(135deg, #00d4ff, #0099ff);
                    color: white;
                    transform: translateY(-2px);
                }

                .pagination button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination span {
                    font-weight: 600;
                    color: #0f2027;
                    min-width: 150px;
                    text-align: center;
                }

                .hidden-details {
                    display: none;
                    padding: 2rem;
                    background: white;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid #ddd;
                }

                .hidden-details h3 {
                    color: #0099ff;
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                }

                .hidden-details p {
                    margin: 0.5rem 0;
                    color: #0f2027;
                }

                @media (max-width: 768px) {
                    main {
                        padding: 2rem 1rem;
                    }

                    .card-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .card-body {
                        grid-template-columns: 1fr;
                    }

                    .filter-section {
                        flex-direction: column;
                    }

                    .pagination {
                        gap: 0.5rem;
                    }

                    .btn {
                        flex: 1;
                        justify-content: center;
                    }
                }
            `}</style>
<Navbar />
            <main>
                <h2>📋 Riwayat Reservasi Anda</h2>

                {/* Filter Section */}
                <div className="filter-section">
                    <div className="filter-group">
                        <label>Filter Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="confirmed">Dikonfirmasi</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="loading-container">
                        <Loader size={48} className="spinner" />
                        <p style={{ color: '#666', fontSize: '1rem' }}>Memuat riwayat reservasi...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <AlertCircle size={20} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                        {error}
                    </div>
                ) : safeReservations.length === 0 ? (
                    <div className="empty-state">
                        <p>📭 Anda belum memiliki riwayat reservasi.</p>
                    </div>
                ) : (
                    <>
                        <ul className="reservations-list">
                            {safeReservations.map((reservation) => {
                                const status = (reservation.status || '').toLowerCase();
                                const config = statusConfig[status] || statusConfig.pending;
                                const isExpanded = expandedId === reservation._id;

                                return (
                                    <li key={reservation._id} className="reservation-card">
                                        <div
                                            className="card-header"
                                            onClick={() => setExpandedId(isExpanded ? null : reservation._id)}
                                        >
                                            <h3 className="card-title">
                                                <User size={20} />
                                                {reservation.patientName || 'Tidak diketahui'}
                                            </h3>
                                            <div
                                                className="status-badge"
                                                style={{
                                                    background: config.bgColor,
                                                    color: config.color,
                                                }}
                                            >
                                                <config.icon size={16} />
                                                {config.label}
                                            </div>
                                        </div>

                                        <div className={`card-body ${isExpanded ? 'expanded' : ''}`}>
                                            <div className="info-group">
                                                <Clock size={20} />
                                                <div className="info-content">
                                                    <div className="info-label">No Antrian</div>
                                                    <div className="info-value" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                                        #{reservation.queueNumber || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="info-group">
                                                <Calendar size={20} />
                                                <div className="info-content">
                                                    <div className="info-label">Tanggal Periksa</div>
                                                    <div className="info-value">
                                                        {new Date(
                                                            reservation.appointmentDate || reservation.date
                                                        ).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="info-group">
                                                <User size={20} />
                                                <div className="info-content">
                                                    <div className="info-label">Dokter</div>
                                                    <div className="info-value">
                                                        {reservation.doctor?.name || 'Belum ditentukan'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="info-group">
                                                <Phone size={20} />
                                                <div className="info-content">
                                                    <div className="info-label">No HP</div>
                                                    <div className="info-value">
                                                        {reservation.phoneNumber || 'Tidak tersedia'}
                                                    </div>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <>
                                                    <div className="info-group">
                                                        <User size={20} />
                                                        <div className="info-content">
                                                            <div className="info-label">ID Reservasi</div>
                                                            <div className="info-value">
                                                                {reservation.reservationId || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="info-group">
                                                        <Calendar size={20} />
                                                        <div className="info-content">
                                                            <div className="info-label">Tanggal Lahir</div>
                                                            <div className="info-value">
                                                                {reservation.patientDOB
                                                                    ? new Date(reservation.patientDOB).toLocaleDateString('id-ID')
                                                                    : 'Tidak tersedia'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="info-group">
                                                        <User size={20} />
                                                        <div className="info-content">
                                                            <div className="info-label">Wali/Orang Tua</div>
                                                            <div className="info-value">
                                                                {reservation.parentName || 'Tidak tersedia'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="info-group">
                                                        <Calendar size={20} />
                                                        <div className="info-content">
                                                            <div className="info-label">Dibuat Pada</div>
                                                            <div className="info-value">
                                                                {new Date(reservation.createdAt).toLocaleDateString('id-ID')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="card-footer">
                                            <button
                                                onClick={() => handleDownload(reservation)}
                                                className="btn btn-download"
                                            >
                                                <Download size={18} />
                                                Unduh Bukti
                                            </button>
                                            {status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(reservation._id)}
                                                    className="btn btn-cancel"
                                                >
                                                    <Trash2 size={18} />
                                                    Batalkan
                                                </button>
                                            )}
                                        </div>

                                        <div
                                            id={`reservation-details-${reservation._id}`}
                                            className="hidden-details"
                                        >
                                            <h3>Detail Reservasi Anda</h3>
                                            <p><strong>🏥 Poli:</strong> Poli Anak</p>
                                            <p><strong>👨‍⚕️ Nama Dokter:</strong> {reservation.doctor?.name || 'Menyesuaikan jadwal'}</p>
                                            <p><strong>🔢 No Antrian:</strong> {reservation.queueNumber}</p>
                                            <p><strong>📌 ID Antrian:</strong> {reservation.reservationId}</p>
                                            <p><strong>🧒 Nama Pasien:</strong> {reservation.patientName}</p>
                                            <p><strong>🎂 Tanggal Lahir Pasien:</strong> {reservation.patientDOB ? new Date(reservation.patientDOB).toLocaleDateString() : 'Tidak tersedia'}</p>
                                            <p><strong>📊 Status:</strong> {reservation.status || 'Tidak diketahui'}</p>
                                            <p><strong>📆 Tanggal Pemeriksaan:</strong> {new Date(reservation.appointmentDate || reservation.date).toLocaleDateString()}</p>
                                            <p style={{ marginTop: '2rem', color: '#10b981', fontWeight: 'bold' }}>✅ Terima kasih telah menunggu!</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Pagination */}
                        <div className="pagination">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            >
                                ← Sebelumnya
                            </button>
                            <span>
                                Halaman {page} dari {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                Berikutnya →
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