import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import PopUp from '../components/PopUp';
import * as reservationService from '../services/reservationService';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        filterReservations();
    }, [reservations, startDate, endDate, searchQuery]);

    const fetchReservations = async () => {
        try {
            const data = await reservationService.getAllReservations();
            setReservations(data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setPopupMessage('Gagal mengambil data reservasi.');
            setPopupType('error');
            setShowPopup(true);
        }
    };

    const filterReservations = () => {
        let tempReservations = [...reservations];

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            tempReservations = tempReservations.filter(res => {
                const resDate = new Date(res.appointmentDate);
                return resDate >= start && resDate <= end;
            });
        }

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            tempReservations = tempReservations.filter(res =>
                res.patientName.toLowerCase().includes(lowerCaseQuery) ||
                res.reservationId.includes(lowerCaseQuery) ||
                res.phoneNumber.includes(lowerCaseQuery)
            );
        }
        setFilteredReservations(tempReservations);
    };

    const handleDeleteByDate = async () => {
        if (!startDate || !endDate) {
            setPopupMessage('Pilih rentang tanggal untuk menghapus data.');
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        if (window.confirm(`Apakah Anda yakin ingin menghapus semua reservasi dari ${startDate} hingga ${endDate}?`)) {
            try {
                const msg = await reservationService.deleteReservationsByDate(startDate, endDate);
                setPopupMessage(msg);
                setPopupType('success');
                setShowPopup(true);
                fetchReservations(); // Refresh data setelah penghapusan
            } catch (error) {
                console.error('Error deleting reservations:', error);
                setPopupMessage(error.message || 'Gagal menghapus reservasi.');
                setPopupType('error');
                setShowPopup(true);
            }
        }
    };

    return (
        <div>
            <AdminNavbar />
            <main style={{ padding: '2rem' }}>
                <h2>Data Reservasi</h2>

                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div>
                        <label>Filter Tanggal Mulai:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div>
                        <label>Filter Tanggal Akhir:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <button onClick={handleDeleteByDate} style={{ padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Hapus Data Berdasarkan Filter Tanggal
                    </button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label>Cari (Nama/ID/No HP):</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari pasien, ID, atau No HP..."
                        style={{ width: '300px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ background: '#f2f2f2' }}>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>No Antrian</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>ID Antrian</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Nama Pasien</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Tgl Lahir</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Nama Wali</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Tgl Reservasi</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.length > 0 ? (
                                filteredReservations.map((res) => (
                                    <tr key={res._id}>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.queueNumber}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.reservationId}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.patientName}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{new Date(res.patientDOB).toLocaleDateString()}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.parentName}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{new Date(res.appointmentDate).toLocaleDateString()}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>Tidak ada data reservasi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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

export default AdminReservations;