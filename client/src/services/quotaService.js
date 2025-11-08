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

export const getQuota = async () => {
    const response = await axios.get(`${API_URL}/api/quota`, config());
    return response.data;
};

export const createQuota = async (quotaData) => {
    const response = await axios.post(`${API_URL}/api/quota`, quotaData, config());
    return response.data;
};

export const updateQuota = async (id, quotaData) => {
    const response = await axios.put(`${API_URL}/api/quota/${id}`, quotaData, config());
    return response.data;
};