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

export const getAllDoctors = async () => {
    const response = await axios.get(`${API_URL}/api/doctors`);
    return response.data;
};

export const createDoctor = async (doctorData) => {
    const response = await axios.post(`${API_URL}/api/doctors`, doctorData, config());
    return response.data;
};

export const updateDoctor = async (id, doctorData) => {
    const response = await axios.put(`${API_URL}/api/doctors/${id}`, doctorData, config());
    return response.data;
};

export const deleteDoctor = async (id) => {
    const response = await axios.delete(`${API_URL}/api/doctors/${id}`, config());
    return response.data.msg;
};