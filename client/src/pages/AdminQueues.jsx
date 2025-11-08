import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import PopUp from '../components/PopUp';
import * as queueService from '../services/queueService';
import * as reservationService from '../services/reservationService'; // Untuk mengambil data reservasi detail

const AdminQueues = () => {
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentQueueData, setCurrentQueueData] = useState(null); // { lastNumber, currentPatientIndex }
    const [activeReservations, setActiveReservations] = useState([]); // Reservasi aktif untuk tanggal ini
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    useEffect(() => {
        fetchQueueDataAndReservations();
    }, [currentDate]);

    const fetchQueueDataAndReservations = async () => {
        try {
            const queueData = await queueService.getQueueByDate(currentDate);
            setCurrentQueueData(queueData); // { date, lastNumber, currentNumber }

            const reservationsData = await reservationService.getReservations({
                startDate: currentDate,
                endDate: currentDate,
                status: 'pending' // Asumsi hanya menampilkan yang pending
            });
            // Urutkan reservasi berdasarkan queueNumber (A1, A2, dst.)
            const sortedReservations = reservationsData.sort((a, b) => {
                const numA = parseInt(a.queueNumber.substring(1));
                const numB = parseInt(b.queueNumber.substring(1));
                return numA - numB;
            });
            setActiveReservations(sortedReservations);

        } catch (error) {
            console.error('Error fetching queue data or reservations:', error);
            setPopupMessage('Gagal mengambil data antrian atau reservasi.');
            setPopupType('error');
            setShowPopup(true);
            setCurrentQueueData(null);
            setActiveReservations([]);
        }
    };

    const handleNextPatient = async () => {
        try {
            const updatedQueue = await queueService.nextPatient(currentDate);
            setPopupMessage('Pasien selanjutnya dipanggil.');
            setPopupType('success');
            setShowPopup(true);
            setCurrentQueueData(updatedQueue);
            // Anda mungkin juga ingin memperbarui status reservasi menjadi 'completed' di sini
            // Namun, itu akan melibatkan logic tambahan untuk mengidentifikasi pasien yang baru saja dipanggil
            fetchQueueDataAndReservations(); // Refresh data
        } catch (error) {
            console.error('Error advancing queue:', error);
            setPopupMessage(error.response?.data?.msg || 'Gagal memanggil pasien selanjutnya.');
            setPopupType('error');
            setShowPopup(true);
        }
    };

    // Ini akan di-handle oleh server (cron job)
    const handleResetQueue = async () => {
        if (window.confirm('Apakah Anda yakin ingin mereset antrian untuk hari ini? Ini hanya untuk pengujian, reset otomatis terjadi setiap hari.')) {
            try {
                await queueService.resetQueue(currentDate);
                setPopupMessage('Antrian hari ini berhasil direset.');
                setPopupType('success');
                setShowPopup(true);
                fetchQueueDataAndReservations();
            } catch (error) {
                console.error('Error resetting queue:', error);
                setPopupMessage(error.response?.data?.msg || 'Gagal mereset antrian.');
                setPopupType('error');
                setShowPopup(true);
            }
        }
    };

    // Helper untuk menandai pasien saat ini (opsional, bisa lebih kompleks)
    const currentPatientIndex = currentQueueData ? currentQueueData.currentNumber - 1 : -1;
    const currentPatient = activeReservations[currentPatientIndex];


    return (
        <div>
            <AdminNavbar />
            <main style={{ padding: '2rem' }}>
                <h2>Kelola Antrian</h2>

                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label>
                        Tanggal Antrian:
                        <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </label>
                    <button onClick={handleNextPatient} style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Next Pasien
                    </button>
                    {/* <button onClick={handleResetQueue} style={{ padding: '10px 15px', background: '#ffc107', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Reset Antrian Hari Ini (Manual)
                    </button> */}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3>Antrian Saat Ini ({new Date(currentDate).toLocaleDateString()})</h3>
                    {currentQueueData ? (
                        <>
                            <p>Antrian Terakhir Diberikan: **A{currentQueueData.lastNumber}**</p>
                            <p>Antrian Berjalan: **A{currentQueueData.currentNumber}**</p>
                            {currentPatient && (
                                <div style={{ border: '1px solid #007bff', padding: '1rem', borderRadius: '8px', background: '#e0f7fa', marginTop: '1rem' }}>
                                    <h4>Pasien Selanjutnya:</h4>
                                    <p>No Antrian: <strong>{currentPatient.queueNumber}</strong></p>
                                    <p>Nama Pasien: <strong>{currentPatient.patientName}</strong></p>
                                    <p>ID Antrian: <strong>{currentPatient.reservationId}</strong></p>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Belum ada data antrian untuk tanggal ini atau antrian kosong.</p>
                    )}
                </div>

                <h3>Daftar Antrian Aktif</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ background: '#f2f2f2' }}>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>No Antrian</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>ID Antrian</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Nama Pasien</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Tgl Lahir</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeReservations.length > 0 ? (
                                activeReservations.map((res, index) => (
                                    <tr key={res._id} style={{ background: index === currentPatientIndex ? '#ffeccc' : 'white' }}>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.queueNumber}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.reservationId}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.patientName}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{new Date(res.patientDOB).toLocaleDateString()}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{res.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>Tidak ada antrian aktif untuk tanggal ini.</td>
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

export default AdminQueues;