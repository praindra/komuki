import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_SERVER_URL;

const config = () => {
    const token = authService.getToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const createReservation = async (reservationData) => {
    const response = await axios.post(`${API_URL}/api/reservations`, reservationData);
    return response.data;
};

export const cancelReservation = async (reservationId, queueNumber) => {
    const response = await axios.put(`${API_URL}/api/reservations/cancel`, { reservationId, queueNumber });
    return response.data.msg;
};

export const getDailyStats = async () => {
    const response = await axios.get(`${API_URL}/api/reservations/daily-stats`);
    return response.data;
};

// Admin functions
export const getAllReservations = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}/api/reservations?${params.toString()}`, config());
    return response.data;
};

export const getReservations = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}/api/reservations?${params.toString()}`, config());
    return response.data;
};

export const deleteReservationsByDate = async (startDate, endDate) => {
    const response = await axios.delete(`${API_URL}/api/reservations/delete-by-date`, { ...config(), data: { startDate, endDate } });
    return response.data.msg;
};