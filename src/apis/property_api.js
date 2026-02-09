import apiClient from './apiClient';

// --- Public Routes ---

export const getAllProperties = async (page = 1, limit = 10, params = {}) => {
    const queryParams = new URLSearchParams({ page, limit, ...params }).toString();
    const { data } = await apiClient.get(`/properties?${queryParams}`);
    return data;
};

export const getPropertyBySlug = async (slug) => {
    const { data } = await apiClient.get(`/properties/${slug}`);
    return data;
};

// --- Protected Routes (Admin/Agent) ---

export const createProperty = async (formData) => {
    // Use FormData for multiple image/file uploads
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    const { data } = await apiClient.post('/properties', formData, config);
    return data;
};

export const updateProperty = async (id, formData) => {
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    const { data } = await apiClient.put(`/properties/${id}`, formData, config);
    return data;
};

export const assignAgentsToProperty = async (id, agentIds) => {
    const { data } = await apiClient.put(`/properties/${id}/agents`, { agentIds });
    return data;
};

export const updatePropertyStatus = async (id, status) => {
    const { data } = await apiClient.put(`/properties/${id}/status`, { status });
    return data;
};

// --- Admin Only Routes ---

export const deleteProperty = async (id) => {
    const { data } = await apiClient.delete(`/properties/${id}`);
    return data;
};
