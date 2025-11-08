import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL;

const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
    if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('adminToken');
};

const getToken = () => {
    return localStorage.getItem('adminToken');
};

const authService = {
    login,
    logout,
    getToken,
};

export default authService;