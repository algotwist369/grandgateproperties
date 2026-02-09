import apiClient from './apiClient';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('blob:')) return path;
    // Prepend server URL and ensure no double slashes
    return `${SERVER_URL}/${path.replace(/^\//, '')}`;
};

// --- Auth & Profile Routes ---

export const signupUser = async (formData) => {
    // Use FormData for profile picture upload
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    const { data } = await apiClient.post('/users/signup', formData, config);
    return data;
};

export const loginUser = async (credentials) => {
    const { data } = await apiClient.post('/users/login', credentials);
    return data;
};

export const logoutUser = async () => {
    const { data } = await apiClient.post('/users/logout');
    return data;
};

export const getAdminStats = async (options = {}) => {
    const { data } = await apiClient.get('/users/stats', options);
    return data;
};

export const getProfile = async (options = {}) => {
    const { data } = await apiClient.get('/users/profile', options);
    return data;
};

export const updateProfile = async (formData) => {
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    const { data } = await apiClient.put('/users/profile', formData, config);
    return data;
};

// --- Admin Only Routes ---

export const getAllUsers = async (role, page = 1, limit = 10) => {
    let url = `/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    const { data } = await apiClient.get(url);
    return data;
};

export const deleteUser = async (id) => {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
};

export const updateUserStatus = async (id, status) => {
    const { data } = await apiClient.put(`/users/${id}/status`, { status });
    return data;
};

export const updateUserRole = async (id, role) => {
    const { data } = await apiClient.put(`/users/${id}/role`, { role });
    return data;
};
