import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import html2canvas from 'html2canvas';

const Form = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        parentName: '',
        parentKTP: '',
        address: '',
        phoneNumber: '',
        patientDOB: '',
        appointmentDate: '',
    });
    const [submissionResult, setSubmissionResult] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState(''); // 'success' or 'error'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/reservations`, formData);
            setSubmissionResult(response.data);
            setPopupMessage('Reservasi berhasil!');
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.msg || 'Terjadi kesalahan saat submit formulir.';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
    };

    const handlePrintDownload = () => {
        if (submissionResult) {
            const input = document.getElementById('reservation-details');
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `reservasi_${submissionResult.patientName}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    };

    return (
        <div>
            <Navbar />
            <main style={{ padding: '2rem' }}>
                <h2>Formulir Reservasi</h2>
                {!submissionResult ? (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                        <label>
                            Nama Pasien:
                            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required />
                        </label>
                        <label>
                            Nama Orang Tua/Wali:
                            <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} required />
                        </label>
                        <label>
                            No. KTP Orang Tua/Wali:
                            <input type="number" name="parentKTP" value={formData.parentKTP} onChange={handleChange} required />
                        </label>
                        <label>
                            Alamat:
                            <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>
                        </label>
                        <label>
                            No HP:
                            <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </label>
                        <label>
                            Tanggal Lahir Pasien:
                            <input type="date" name="patientDOB" value={formData.patientDOB} onChange={handleChange} required />
                        </label>
                        <label>
                            Tanggal Pemeriksaan:
                            <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
                        </label>
                        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                            Submit Reservasi
                        </button>
                    </form>
                ) : (
                    <div id="reservation-details" style={{ border: '1px solid #ccc', padding: '2rem', maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
                        <h3>Detail Reservasi Anda:</h3>
                        <p><strong>Poli Anak</strong></p>
                        <p>Nama Dokter: {submissionResult.doctor?.name || 'Menyesuaikan jadwal'}</p> {/* Anda perlu populasi dokter di server */}
                        <p>No Antrian: {submissionResult.queueNumber}</p>
                        <p>ID Antrian: {submissionResult.reservationId}</p>
                        <p>Nama Pasien: {submissionResult.patientName}</p>
                        <p>Tanggal Lahir Pasien: {new Date(submissionResult.patientDOB).toLocaleDateString()}</p>
                        <p>Terima kasih telah menunggu!</p>
                        <p>Tanggal Pemeriksaan: {new Date(submissionResult.appointmentDate).toLocaleDateString()}</p>
                        <button onClick={handlePrintDownload} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
                            Cetak / Download Gambar
                        </button>
                    </div>
                )}
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

export default Form;