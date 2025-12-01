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
            const token = localStorage.getItem('userToken');
            const config = {};
            if (token) {
                config.headers = { Authorization: `Bearer ${token}` };
            }
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/reservations`, formData, config);
            setSubmissionResult(response.data);
            setPopupMessage('Reservasi berhasil dibuat!');
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.msg || 'Terjadi kesalahan saat membuat reservasi.';
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
        <div className="fade-in">
            <Navbar />
            <main>
                <h1>Formulir Reservasi Poli Anak</h1>
                {!submissionResult ? (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center mb-3">Informasi Pasien</h2>
                        <label>
                            Nama Pasien:
                            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required placeholder="Masukkan nama lengkap pasien" />
                        </label>
                        <label>
                            Tanggal Lahir Pasien:
                            <input type="date" name="patientDOB" value={formData.patientDOB} onChange={handleChange} required />
                        </label>

                        <h2 className="text-center mb-3 mt-3">Informasi Orang Tua/Wali</h2>
                        <label>
                            Nama Orang Tua/Wali:
                            <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} required placeholder="Masukkan nama orang tua atau wali" />
                        </label>
                        <label>
                            No. KTP Orang Tua/Wali:
                            <input type="number" name="parentKTP" value={formData.parentKTP} onChange={handleChange} required placeholder="Masukkan nomor KTP" />
                        </label>
                        <label>
                            Alamat Lengkap:
                            <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" placeholder="Masukkan alamat lengkap"></textarea>
                        </label>
                        <label>
                            No. HP:
                            <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="Masukkan nomor HP aktif" />
                        </label>

                        <h2 className="text-center mb-3 mt-3">Jadwal Pemeriksaan</h2>
                        <label>
                            Tanggal Pemeriksaan:
                            <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
                        </label>

                        <button type="submit" className="btn-primary mt-3">
                            Buat Reservasi
                        </button>
                    </form>
                ) : (
                    <div id="reservation-details">
                        <h3>✅ Reservasi Berhasil Dibuat!</h3>
                        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                            <p><strong>Poli Anak</strong></p>
                            <p><strong>Nama Dokter:</strong> {submissionResult.doctor?.name || 'Menyesuaikan jadwal'}</p>
                            <p><strong>No Antrian:</strong> <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>{submissionResult.queueNumber}</span></p>
                            <p><strong>ID Reservasi:</strong> {submissionResult.reservationId}</p>
                        </div>
                        <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                            <p><strong>Nama Pasien:</strong> {submissionResult.patientName}</p>
                            <p><strong>Tanggal Lahir:</strong> {new Date(submissionResult.patientDOB).toLocaleDateString('id-ID')}</p>
                            <p><strong>Tanggal Pemeriksaan:</strong> {new Date(submissionResult.appointmentDate).toLocaleDateString('id-ID')}</p>
                        </div>
                        <p style={{ fontStyle: 'italic', color: '#27ae60' }}>Terima kasih telah melakukan reservasi. Silakan datang tepat waktu sesuai jadwal yang telah ditentukan.</p>
                        <button onClick={handlePrintDownload} className="btn-success mt-2">
                            📄 Cetak / Download Bukti Reservasi
                        </button>
                    </div>
                )}
            </main>
            {showPopup && (
                <div className="popup">
                    <h3 style={{ color: popupType === 'success' ? '#27ae60' : '#e74c3c', marginTop: 0 }}>
                        {popupType === 'success' ? '✅ Berhasil!' : '❌ Error'}
                    </h3>
                    <p>{popupMessage}</p>
                    <button onClick={() => setShowPopup(false)} style={{ marginTop: '1rem', background: '#95a5a6', color: 'white' }}>
                        Tutup
                    </button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Form;