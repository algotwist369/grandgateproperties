import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `https://api.grandgatepropertiesllc.com/api
` || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        // Fallback for manual tokens if any, but primary auth is via Cookies
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't intercept if it's a cancellation
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

        // Handle specific status codes
        if (error.response?.status === 401) {
            localStorage.removeItem('userInfo');
        }

        return Promise.reject(message);
    }
);

export default apiClient;
