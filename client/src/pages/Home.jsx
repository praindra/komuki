import React, { useState, useEffect } from 'react';
import { Users, Clock, ChevronRight, Activity } from 'lucide-react';
import profilImage from '../assets/profil-2048x660.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const [stats, setStats] = useState({
        currentQueue: 0,
        queueLimit: 0,
        doctors: [],
    });

    useEffect(() => {
        const fetchDailyStats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/reservations/daily-stats`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching daily stats:', error);
            }
        };
        fetchDailyStats();
    }, []);

    const handleFormButtonClick = () => {
        window.location.href = '/form';
    };

    const queuePercentage = stats.queueLimit > 0 ? (stats.currentQueue / stats.queueLimit) * 100 : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            {/* Header with Hero Section */}
            <header style={{
                backgroundImage: `linear-gradient(135deg, rgba(15, 32, 39, 0.8) 0%, rgba(32, 58, 67, 0.8) 50%, rgba(44, 83, 100, 0.8) 100%), url(${profilImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                color: '#fff',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated background elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'float 6s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(0, 153, 255, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'float 8s ease-in-out infinite reverse'
                }}></div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(30px); }
                    }
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', animation: 'slideInUp 0.8s ease-out' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <Activity size={48} style={{ color: '#00d4ff', marginBottom: '1rem' }} />
                    </div>
                    <h1 style={{
                        color: 'white',
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2',
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                    }}>
                        SELAMAT DATANG DI SISTEM RESERVASI POLI ANAK
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                        marginBottom: '2rem',
                        opacity: 0.95,
                        color: '#e0e0e0'
                    }}>
                        Rumah Sakit Bina Bhakti Husada
                    </p>
                    <button
                        onClick={handleFormButtonClick}
                        style={{
                            padding: '14px 40px',
                            background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1.05rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 8px 30px rgba(0, 212, 255, 0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.3)';
                        }}
                    >
                        Buat Reservasi
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '4rem 2rem', background: '#f8f9fa' }}>
                {/* Statistics Section */}
                <section style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '4rem' }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        color: '#0f2027',
                        textAlign: 'center'
                    }}>
                        Status Antrian Hari Ini
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        {/* Current Queue Card */}
                        <div style={{
                            padding: '2.5rem',
                            background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                            borderRadius: '16px',
                            color: 'white',
                            boxShadow: '0 10px 40px rgba(0, 212, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 212, 255, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 212, 255, 0.2)';
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50px',
                                right: '-50px',
                                width: '150px',
                                height: '150px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%'
                            }}></div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <Users size={28} />
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Antrian Saat Ini</h3>
                                </div>
                                <p style={{
                                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                                    fontWeight: 'bold',
                                    margin: '0.5rem 0',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                }}>
                                    {stats.currentQueue}
                                </p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>Pasien sedang menunggu</p>
                            </div>
                        </div>

                        {/* Queue Limit Card */}
                        <div style={{
                            padding: '2.5rem',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '16px',
                            color: 'white',
                            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.2)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 15px 50px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(16, 185, 129, 0.2)';
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50px',
                                right: '-50px',
                                width: '150px',
                                height: '150px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%'
                            }}></div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <Clock size={28} />
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Kapasitas Harian</h3>
                                </div>
                                <p style={{
                                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                                    fontWeight: 'bold',
                                    margin: '0.5rem 0',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                }}>
                                    {stats.queueLimit}
                                </p>
                                <div style={{ marginTop: '1rem' }}>
                                    <div style={{
                                        height: '6px',
                                        background: 'rgba(255, 255, 255, 0.3)',
                                        borderRadius: '3px',
                                        overflow: 'hidden',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${queuePercentage}%`,
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: '3px',
                                            transition: 'width 0.3s ease'
                                        }}></div>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.9 }}>
                                        {Math.round(queuePercentage)}% Terisi
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Doctor Schedules Section */}
                <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        color: '#0f2027',
                        textAlign: 'center'
                    }}>
                        Jadwal Dokter Tersedia
                    </h2>
                    {stats.doctors.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '2rem',
                            marginBottom: '3rem'
                        }}>
                            {stats.doctors.map((doctor, index) => (
                                <div key={index} style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(0, 212, 255, 0.1)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 212, 255, 0.15)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.1)';
                                }}>
                                    <h4 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        color: '#0f2027',
                                        marginBottom: '1.5rem',
                                        paddingBottom: '1rem',
                                        borderBottom: '2px solid rgba(0, 212, 255, 0.2)'
                                    }}>
                                        {doctor.name}
                                    </h4>
                                    <h5 style={{
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        color: '#0099ff',
                                        marginBottom: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Jadwal Praktik
                                    </h5>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {doctor.schedule.map((s, idx) => (
                                            <li key={idx} style={{
                                                padding: '0.75rem 1rem',
                                                marginBottom: '0.75rem',
                                                background: s.isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                                                borderLeft: `4px solid ${s.isActive ? '#10b981' : '#ef4444'}`,
                                                borderRadius: '6px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                fontSize: '0.9rem'
                                            }}>
                                                <span style={{ color: '#0f2027', fontWeight: '500' }}>
                                                    {s.day.charAt(0).toUpperCase() + s.day.slice(1)}
                                                </span>
                                                <span style={{ color: '#666' }}>
                                                    {s.time}
                                                </span>
                                                <span style={{
                                                    padding: '2px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    background: s.isActive ? '#10b981' : '#ef4444',
                                                    color: 'white'
                                                }}>
                                                    {s.isActive ? 'Aktif' : 'Tutup'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
                        }}>
                            <p style={{ fontSize: '1.1rem', color: '#666', margin: 0 }}>
                                Tidak ada jadwal dokter yang tersedia saat ini.
                            </p>
                        </div>
                    )}
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <button
                            onClick={handleFormButtonClick}
                            style={{
                                padding: '14px 40px',
                                background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '1.05rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 8px 30px rgba(0, 212, 255, 0.3)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.3)';
                            }}
                        >
                            Isi Formulir Reservasi
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;