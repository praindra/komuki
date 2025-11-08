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

export const sendWhatsappNotification = async (doctorId, vacationDate, message) => {
    const response = await axios.post(`${API_URL}/api/admin/whatsapp-notification`, { doctorId, vacationDate, message }, config());
    return response.data.msg;
};

export const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/api/admin/dashboard-stats`, config());
    return response.data;
};