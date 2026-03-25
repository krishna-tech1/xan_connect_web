import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.includes('/api') 
        ? `${import.meta.env.VITE_API_URL}/portal` 
        : `${import.meta.env.VITE_API_URL}/api/portal`)
    : 'http://127.0.0.1:5056/api/portal';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor for Auth
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const portalAPI = {
    login: (credentials) => apiClient.post('/login', credentials),
    getProfile: () => apiClient.get('/profile'),
    getNotifications: (userId) => apiClient.get(`/notifications/${userId}`),
    markNotificationRead: (id) => apiClient.patch(`/notifications/read/${id}`)
};

export default apiClient;
