import React, { useState, useEffect } from 'react';
import OperatorNavbar from '../components/OperatorNavbar';
import PopUp from '../components/PopUp';
import * as doctorService from '../services/doctorService';

const OperatorSchedules = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoctorName, setNewDoctorName] = useState('');
    const [newDoctorDay, setNewDoctorDay] = useState('senin');
    const [newDoctorTime, setNewDoctorTime] = useState('');
    const [editingDoctor, setEditingDoctor] = useState(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    const [vacationDoctor, setVacationDoctor] = useState('');
    const [vacationDate, setVacationDate] = useState('');

    const daysOfWeek = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await doctorService.getAllDoctors();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setPopupMessage('Gagal mengambil data dokter.');
            setPopupType('error');
            setShowPopup(true);
        }
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        try {
            const newDoctor = await doctorService.createDoctor({
                name: newDoctorName,
                schedule: [{ day: newDoctorDay, time: newDoctorTime }]
            });
            setPopupMessage('Dokter berhasil ditambahkan.');
            setPopupType('success');
            setShowPopup(true);
            setNewDoctorName('');
            setNewDoctorTime('');
            fetchDoctors();
        } catch (error) {
            console.error('Error creating doctor:', error);
            setPopupMessage(error.response?.data?.msg || 'Gagal menambahkan dokter.');
            setPopupType('error');
            setShowPopup(true);
        }
    };

    const handleEditDoctor = (doctor) => {
        setEditingDoctor({ ...doctor });
    };

    const handleUpdateDoctor = async (e) => {
        e.preventDefault();
        if (!editingDoctor) return;

        try {
            const updatedDoctor = await doctorService.updateDoctor(editingDoctor._id, {
                name: editingDoctor.name,
                schedule: editingDoctor.schedule
            });
            setPopupMessage('Jadwal dokter berhasil diperbarui.');
            setPopupType('success');
            setShowPopup(true);
            setEditingDoctor(null);
            fetchDoctors();
        } catch (error) {
            console.error('Error updating doctor:', error);
            setPopupMessage(error.response?.data?.msg || 'Gagal memperbarui jadwal dokter.');
            setPopupType('error');
            setShowPopup(true);
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus dokter ini?')) {
            try {
                const msg = await doctorService.deleteDoctor(id);
                setPopupMessage(msg);
                setPopupType('success');
                setShowPopup(true);
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
                setPopupMessage(error.message || 'Gagal menghapus dokter.');
                setPopupType('error');
                setShowPopup(true);
            }
        }
    };

    const handleAddScheduleToEditingDoctor = () => {
        setEditingDoctor(prev => ({
            ...prev,
            schedule: [...prev.schedule, { day: 'senin', time: '', isActive: true }]
        }));
    };

    const handleUpdateScheduleChange = (index, field, value) => {
        setEditingDoctor(prev => {
            const newSchedule = [...prev.schedule];
            newSchedule[index] = { ...newSchedule[index], [field]: value };
            return { ...prev, schedule: newSchedule };
        });
    };

    const handleRemoveSchedule = (index) => {
        setEditingDoctor(prev => {
            const newSchedule = prev.schedule.filter((_, i) => i !== index);
            return { ...prev, schedule: newSchedule };
        });
    };

    return (
        <div>
            <OperatorNavbar />
            <main style={{ padding: '2rem' }}>
                <h2>Kelola Jadwal Dokter</h2>

                <section style={{ marginBottom: '3rem', border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h3>Tambah Dokter Baru</h3>
                    <form onSubmit={handleCreateDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                        <label>
                            Nama Dokter:
                            <input type="text" value={newDoctorName} onChange={(e) => setNewDoctorName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </label>
                        <label>
                            Hari Praktik:
                            <select value={newDoctorDay} onChange={(e) => setNewDoctorDay(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                {daysOfWeek.map(day => <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>)}
                            </select>
                        </label>
                        <label>
                            Jam Praktik:
                            <input type="time" value={newDoctorTime} onChange={(e) => setNewDoctorTime(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </label>
                        <button type="submit" style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Tambah Dokter
                        </button>
                    </form>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h3>Daftar Dokter</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {doctors.map(doctor => (
                            <div key={doctor._id} style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <h4>{doctor.name}</h4>
                                <h5>Jadwal:</h5>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {doctor.schedule.map((s, index) => (
                                        <li key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: s.isActive ? '#e6ffe6' : '#ffe6e6', borderRadius: '4px' }}>
                                            {s.day.charAt(0).toUpperCase() + s.day.slice(1)} - {s.time} ({s.isActive ? 'Aktif' : 'Tidak Aktif'})
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEditDoctor(doctor)} style={{ padding: '8px 12px', background: '#ffc107', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteDoctor(doctor._id)} style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {editingDoctor && (
                    <section style={{ marginBottom: '3rem', border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <h3>Edit Jadwal Dokter: {editingDoctor.name}</h3>
                        <form onSubmit={handleUpdateDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                            <label>
                                Nama Dokter:
                                <input type="text" value={editingDoctor.name} onChange={(e) => setEditingDoctor(prev => ({ ...prev, name: e.target.value }))} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                            </label>
                            {editingDoctor.schedule.map((s, index) => (
                                <div key={index} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label>
                                        Hari:
                                        <select value={s.day} onChange={(e) => handleUpdateScheduleChange(index, 'day', e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                            {daysOfWeek.map(day => <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>)}
                                        </select>
                                    </label>
                                    <label>
                                        Jam:
                                        <input type="time" value={s.time} onChange={(e) => handleUpdateScheduleChange(index, 'time', e.target.value)} required style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </label>
                                    <label>
                                        Aktif:
                                        <input type="checkbox" checked={s.isActive} onChange={(e) => handleUpdateScheduleChange(index, 'isActive', e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                                    </label>
                                    <button type="button" onClick={() => handleRemoveSchedule(index)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                                        Hapus Jadwal
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddScheduleToEditingDoctor} style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Tambah Jadwal
                            </button>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Simpan Perubahan
                                </button>
                                <button type="button" onClick={() => setEditingDoctor(null)} style={{ padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Batal
                                </button>
                            </div>
                        </form>
                    </section>
                )}
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

export default OperatorSchedules;