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

export const getQueueByDate = async (date) => {
    const response = await axios.get(`${API_URL}/api/queues/${date}`, config());
    return response.data;
};

export const nextPatient = async (date) => {
    const response = await axios.post(`${API_URL}/api/queues/next-patient`, { date }, config());
    return response.data;
};

export const resetQueue = async (date) => {
    const response = await axios.post(`${API_URL}/api/queues/reset`, { date }, config());
    return response.data.msg;
};