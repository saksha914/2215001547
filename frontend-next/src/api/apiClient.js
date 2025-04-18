import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://20.244.56.144/evaluation-service';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const tokenType = localStorage.getItem('tokenType') || 'Bearer';
            if (token) {
                config.headers['Authorization'] = `${tokenType} ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access - redirecting to login');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('tokenType');
            }
        }
        if (error.message === 'Network Error' && !error.response) {
            console.error('Network Error - Could not connect to API:', API_BASE_URL);
        }
        return Promise.reject(error);
    }
);

export default apiClient; 