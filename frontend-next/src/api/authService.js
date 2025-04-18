import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/evaluation-service'; 

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        console.log('Registration successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Registration failed');
    }
};

const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth`, loginData);
        console.log('Login successful:', response.data);
    
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

export default {
    registerUser,
    loginUser,
}; 