import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import axios from 'axios';
import * as adminService from '../services/adminService';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalReservationsToday: 0,
        limitReservationsToday: 0,
        totalActivePatients: 0,
        totalDoctors: 0,
        queueChartData: {},
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                // Anda perlu membuat endpoint API ini di server
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/dashboard-stats`, config);
                setStats(response.data);

                // Contoh data untuk grafik (Anda perlu data aktual dari backend)
                // setStats(prev => ({
                //     ...prev,
                //     queueChartData: {
                //         labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
                //         datasets: [
                //             {
                //                 label: 'Jumlah Antrian',
                //                 data: [12, 19, 3, 5, 2, 3, 7], // data dari backend
                //                 backgroundColor: 'rgba(75, 192, 192, 0.6)',
                //             },
                //         ],
                //     },
                // }));

            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                // Handle error, e.g., redirect to login if unauthorized
            }
        };
        fetchDashboardStats();
    }, []);

    return (
        <div>
            <AdminNavbar />
            <main style={{ padding: '2rem' }}>
                <h2>Dashboard Admin</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
                        <h3>Total Reservasi Hari Ini</h3>
                        <p style={{ fontSize: '2rem' }}>{stats.totalReservationsToday}</p>
                    </div>
                    <div className="card" style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
                        <h3>Limit Reservasi Hari Ini</h3>
                        <p style={{ fontSize: '2rem' }}>{stats.limitReservationsToday}</p>
                    </div>
                    <div className="card" style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
                        <h3>Total Pasien Aktif</h3>
                        <p style={{ fontSize: '2rem' }}>{stats.totalActivePatients}</p>
                    </div>
                    <div className="card" style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
                        <h3>Total Dokter</h3>
                        <p style={{ fontSize: '2rem' }}>{stats.totalDoctors}</p>
                    </div>
                </div>

                <section className="queue-chart">
                    <h3>Grafik Antrian (Harian/Mingguan)</h3>
                    {stats.queueChartData.labels && stats.queueChartData.labels.length > 0 ? (
                        <Bar data={stats.queueChartData} />
                    ) : (
                        <p>Data grafik belum tersedia.</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;