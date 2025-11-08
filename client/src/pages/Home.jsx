import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        currentQueue: 0,
        queueLimit: 0,
        doctors: [],
    });

    useEffect(() => {
        const fetchDailyStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/reservations/daily-stats`);
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching daily stats:', error);
            }
        };
        fetchDailyStats();
    }, []);

    const handleFormButtonClick = () => {
        navigate('/form');
    };

    return (
        <div>
            <Navbar />
            <header style={{ padding: '2rem', textAlign: 'center', background: '#e9e9e9' }}>
                <h1>Selamat Datang di Sistem Reservasi Poli Anak Rumah Sakit Bina Bhakti Husada</h1>
            </header>
            <main style={{ padding: '2rem' }}>
                <section className="statistics" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
                        <h3>Antrian Hari Ini</h3>
                        <p style={{ fontSize: '2rem' }}>{stats.currentQueue}</p>
                    </div>
                    <div className="card" style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
                        <h3>Limit Antrian Hari Ini</h3>
                        <p style={{ fontSize: '2rem' }}>{stats.queueLimit}</p>
                    </div>
                </section>

                <section className="doctor-schedules">
                    <h2>Jadwal Dokter</h2>
                    {stats.doctors.length > 0 ? (
                        stats.doctors.map((doctor, index) => (
                            <div key={index} style={{ marginBottom: '1rem' }}>
                                <h3>{doctor.name}</h3>
                                <ul>
                                    {doctor.schedule.map((s, idx) => (
                                        <li key={idx}>Hari: {s.day}, Jam: {s.time}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>Tidak ada jadwal dokter yang tersedia saat ini.</p>
                    )}
                    <button onClick={handleFormButtonClick} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
                        Isi Formulir
                    </button>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;