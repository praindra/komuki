import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Download, ArrowRight, Loader } from 'lucide-react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    const [popupType, setPopupType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Validation functions
    const validateDateOfBirth = (value) => {
        if (!value) return 'Tanggal lahir harus diisi';
        if (value > today) {
            return 'Tanggal lahir tidak boleh melebihi hari ini';
        }
        return '';
    };

    const validateKTP = (value) => {
        if (!value) return 'No. KTP harus diisi';
        if (value.length > 20) {
            return 'No. KTP tidak boleh melebihi 20 angka';
        }
        if (!/^\d+$/.test(value)) {
            return 'No. KTP harus berupa angka';
        }
        return '';
    };

    const validatePhoneNumber = (value) => {
        if (!value) return 'No. HP harus diisi';
        if (value.length > 15) {
            return 'No. HP tidak boleh melebihi 15 angka';
        }
        if (!/^\d+$/.test(value)) {
            return 'No. HP harus berupa angka';
        }
        return '';
    };

    const validateAppointmentDate = (value) => {
        if (!value) return 'Tanggal pemeriksaan harus diisi';
        if (value < today) {
            return 'Tanggal pemeriksaan tidak boleh di hari yang sudah dilewati';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        let error = '';

        // Real-time validation
        if (name === 'patientDOB') {
            error = validateDateOfBirth(value);
        } else if (name === 'parentKTP') {
            // Limit to 20 digits
            newValue = value.slice(0, 20);
            error = validateKTP(newValue);
        } else if (name === 'phoneNumber') {
            // Limit to 15 digits
            newValue = value.slice(0, 15);
            error = validatePhoneNumber(newValue);
        } else if (name === 'appointmentDate') {
            error = validateAppointmentDate(value);
        }

        setFormData({ ...formData, [name]: newValue });
        
        // Update errors
        if (error) {
            setErrors({ ...errors, [name]: error });
        } else {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate all fields
        if (!formData.patientName.trim()) {
            newErrors.patientName = 'Nama pasien harus diisi';
        }
        if (!formData.parentName.trim()) {
            newErrors.parentName = 'Nama orang tua/wali harus diisi';
        }
        if (!formData.address.trim()) {
            newErrors.address = 'Alamat harus diisi';
        }

        const ktpError = validateKTP(formData.parentKTP);
        if (ktpError) newErrors.parentKTP = ktpError;

        const phoneError = validatePhoneNumber(formData.phoneNumber);
        if (phoneError) newErrors.phoneNumber = phoneError;

        const dobError = validateDateOfBirth(formData.patientDOB);
        if (dobError) newErrors.patientDOB = dobError;

        const appointmentError = validateAppointmentDate(formData.appointmentDate);
        if (appointmentError) newErrors.appointmentDate = appointmentError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setPopupMessage('Silakan perbaiki error yang ada di form');
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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

    const handleReset = () => {
        setSubmissionResult(null);
        setFormData({
            patientName: '',
            parentName: '',
            parentKTP: '',
            address: '',
            phoneNumber: '',
            patientDOB: '',
            appointmentDate: '',
        });
        setErrors({});
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <style>{`
                * {
                    box-sizing: border-box;
                }
                
                main {
                    flex: 1;
                    padding: 4rem 2rem;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
                    max-width: 1000px;
                    margin: 0 auto;
                    width: 100%;
                }

                h1 {
                    text-align: center;
                    font-size: clamp(1.8rem, 4vw, 2.5rem);
                    color: #0f2027;
                    margin-bottom: 2rem;
                    font-weight: 700;
                }

                h2 {
                    font-size: 1.3rem;
                    color: #0099ff;
                    margin: 2rem 0 1.5rem 0;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid rgba(0, 212, 255, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                }

                form {
                    background: white;
                    padding: 3rem;
                    border-radius: 16px;
                    box-shadow: 0 12px 40px rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                }

                .form-group {
                    margin-bottom: 2rem;
                }

                label {
                    display: block;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                    color: #0f2027;
                    font-size: 0.95rem;
                }

                input, textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    font-family: inherit;
                    background: white;
                }

                input:focus, textarea:focus {
                    outline: none;
                    border-color: #00d4ff;
                    background: rgba(0, 212, 255, 0.05);
                    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
                }

                input.error, textarea.error {
                    border-color: #ef4444;
                }

                input.error:focus, textarea.error:focus {
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
                }

                textarea {
                    resize: vertical;
                    min-height: 100px;
                }

                .error-message {
                    color: #ef4444;
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .helper-text {
                    color: #666;
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #00d4ff, #0099ff);
                    color: white;
                    border: none;
                    padding: 14px 36px;
                    font-size: 1rem;
                    font-weight: 600;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
                    width: 100%;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 2rem;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(0, 212, 255, 0.4);
                }

                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-success {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    padding: 14px 36px;
                    font-size: 1rem;
                    font-weight: 600;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-success:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
                }

                .popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 2.5rem;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                    z-index: 2000;
                    max-width: 450px;
                    width: 90%;
                    border-top: 4px solid;
                    animation: slideUp 0.3s ease;
                }

                .popup.success {
                    border-top-color: #10b981;
                }

                .popup.error {
                    border-top-color: #ef4444;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -40%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }

                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    z-index: 1999;
                }

                #reservation-details {
                    background: white;
                    padding: 3rem;
                    border-radius: 16px;
                    box-shadow: 0 12px 40px rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                }

                #reservation-details h3 {
                    font-size: 1.8rem;
                    color: #10b981;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .result-section {
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border-left: 4px solid;
                }

                .result-section.primary {
                    background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(0, 153, 255, 0.05));
                    border-left-color: #00d4ff;
                }

                .result-section.secondary {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05));
                    border-left-color: #10b981;
                }

                .result-section p {
                    margin: 0.75rem 0;
                    color: #0f2027;
                    font-size: 0.95rem;
                }

                .result-section strong {
                    color: #0099ff;
                }

                .queue-number {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #00d4ff;
                    text-shadow: 0 2px 8px rgba(0, 212, 255, 0.2);
                }

                .success-message {
                    font-style: italic;
                    color: #10b981;
                    margin: 2rem 0;
                    padding: 1.5rem;
                    background: rgba(16, 185, 129, 0.1);
                    border-radius: 10px;
                    border-left: 4px solid #10b981;
                }

                .button-group {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                    flex-wrap: wrap;
                }

                .button-group button {
                    flex: 1;
                    min-width: 200px;
                }

                @media (max-width: 768px) {
                    form {
                        padding: 2rem;
                    }

                    #reservation-details {
                        padding: 2rem;
                    }

                    h2 {
                        font-size: 1.1rem;
                    }

                    .button-group {
                        flex-direction: column;
                    }

                    .button-group button {
                        width: 100%;
                    }
                }
            `}</style>

            <Navbar />
            <main>
                <h1>📋 Formulir Reservasi Poli Anak</h1>

                {!submissionResult ? (
                    <form onSubmit={handleSubmit}>
                        <h2>👤 Informasi Pasien</h2>
                        <div className="form-group">
                            <label>Nama Pasien:</label>
                            <input
                                type="text"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan nama lengkap pasien"
                                className={errors.patientName ? 'error' : ''}
                            />
                            {errors.patientName && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.patientName}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Tanggal Lahir Pasien:</label>
                            <input
                                type="date"
                                name="patientDOB"
                                value={formData.patientDOB}
                                onChange={handleChange}
                                max={today}
                                required
                                className={errors.patientDOB ? 'error' : ''}
                            />
                            <div className="helper-text">⚠️ Tanggal lahir tidak boleh melebihi hari ini</div>
                            {errors.patientDOB && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.patientDOB}
                                </div>
                            )}
                        </div>

                        <h2>👨‍👩‍👧 Informasi Orang Tua/Wali</h2>
                        <div className="form-group">
                            <label>Nama Orang Tua/Wali:</label>
                            <input
                                type="text"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan nama orang tua atau wali"
                                className={errors.parentName ? 'error' : ''}
                            />
                            {errors.parentName && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.parentName}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>No. KTP Orang Tua/Wali:</label>
                            <input
                                type="number"
                                name="parentKTP"
                                value={formData.parentKTP}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan nomor KTP (max 20 angka)"
                                className={errors.parentKTP ? 'error' : ''}
                            />
                            <div className="helper-text">📌 Maksimal 20 angka</div>
                            {errors.parentKTP && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.parentKTP}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Alamat Lengkap:</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan alamat lengkap"
                                className={errors.address ? 'error' : ''}
                            ></textarea>
                            {errors.address && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.address}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>No. HP:</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan nomor HP aktif (max 15 angka)"
                                className={errors.phoneNumber ? 'error' : ''}
                            />
                            <div className="helper-text">📱 Maksimal 15 angka</div>
                            {errors.phoneNumber && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.phoneNumber}
                                </div>
                            )}
                        </div>

                        <h2>📅 Jadwal Pemeriksaan</h2>
                        <div className="form-group">
                            <label>Tanggal Pemeriksaan:</label>
                            <input
                                type="date"
                                name="appointmentDate"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                min={today}
                                required
                                className={errors.appointmentDate ? 'error' : ''}
                            />
                            <div className="helper-text">📅 Bisa memilih dari hari ini atau lebih maju</div>
                            {errors.appointmentDate && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.appointmentDate}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Buat Reservasi
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div id="reservation-details">
                        <h3>
                            <CheckCircle size={32} style={{ color: '#10b981' }} />
                            Reservasi Berhasil Dibuat!
                        </h3>

                        <div className="result-section primary">
                            <p><strong>🏥 Poli:</strong> Poli Anak</p>
                            <p><strong>👨‍⚕️ Nama Dokter:</strong> {submissionResult.doctor?.name || 'Menyesuaikan jadwal'}</p>
                            <p>
                                <strong>🔢 No Antrian:</strong>
                                <div className="queue-number">{submissionResult.queueNumber}</div>
                            </p>
                            <p><strong>📌 ID Reservasi:</strong> {submissionResult.reservationId}</p>
                        </div>

                        <div className="result-section secondary">
                            <p><strong>🧒 Nama Pasien:</strong> {submissionResult.patientName}</p>
                            <p><strong>🎂 Tanggal Lahir:</strong> {new Date(submissionResult.patientDOB).toLocaleDateString('id-ID')}</p>
                            <p><strong>📆 Tanggal Pemeriksaan:</strong> {new Date(submissionResult.appointmentDate).toLocaleDateString('id-ID')}</p>
                        </div>

                        <div className="success-message">
                            ✅ Terima kasih telah melakukan reservasi. Silakan datang tepat waktu sesuai jadwal yang telah ditentukan.
                        </div>

                        <div className="button-group">
                            <button onClick={handlePrintDownload} className="btn-success">
                                <Download size={20} />
                                Cetak / Download Bukti
                            </button>
                            <button onClick={handleReset} style={{
                                background: 'linear-gradient(135deg, #0099ff, #0066cc)',
                                color: 'white',
                                border: 'none',
                                padding: '14px 36px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 8px 24px rgba(0, 153, 255, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 153, 255, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 153, 255, 0.3)';
                            }}>
                                Buat Reservasi Baru
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {showPopup && (
                <>
                    <div className="popup-overlay" onClick={() => setShowPopup(false)}></div>
                    <div className={`popup ${popupType}`}>
                        <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            margin: 0,
                            marginBottom: '1rem',
                            color: popupType === 'success' ? '#10b981' : '#ef4444',
                            fontSize: '1.3rem'
                        }}>
                            {popupType === 'success' ? (
                                <>
                                    <CheckCircle size={24} />
                                    Berhasil!
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={24} />
                                    Error
                                </>
                            )}
                        </h3>
                        <p style={{ margin: '1rem 0', color: '#0f2027', fontSize: '0.95rem' }}>
                            {popupMessage}
                        </p>
                        <button
                            onClick={() => setShowPopup(false)}
                            style={{
                                width: '100%',
                                marginTop: '1.5rem',
                                background: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#7f8c8d'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#95a5a6'}
                        >
                            Tutup
                        </button>
                    </div>
                </>
            )}
            <Footer />
        </div>
    );
};

export default Form;