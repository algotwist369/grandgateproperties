import apiClient from './apiClient';

// --- Public Routes ---
export const getAllAgents = async (page = 1, limit = 10) => {
    const { data } = await apiClient.get(`/agents?page=${page}&limit=${limit}`);
    return data;
};

export const getAgentBySlug = async (slug) => {
    const { data } = await apiClient.get(`/agents/${slug}`);
    return data;
};

// --- Protected Routes (Agent/Admin) ---
export const getAgentProfile = async (options = {}) => {
    const { data } = await apiClient.get('/agents/profile', options);
    return data;
};

export const updateAgentProfile = async (formData) => {
    // Use FormData for avatar upload
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    const { data } = await apiClient.put('/agents/profile', formData, config);
    return data;
};

// --- Admin Only Routes ---

export const updateAgentStatus = async (id, status) => {
    const { data } = await apiClient.put(`/agents/${id}/status`, { status });
    return data;
};

export const addAgent = async (agentData) => {
    const { data } = await apiClient.post('/agents', agentData);
    return data;
};

export const updateAgent = async (id, agentData) => {
    const { data } = await apiClient.put(`/agents/${id}`, agentData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};
