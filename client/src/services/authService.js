import api from './api.js';

const authService = {

    // POST /auth/register
    register: async ({ name, email, password, role = 'user' }) => {
        const { data } = await api.post('/auth/register', { name, email, password, role });
        return data; // { success, message, data: { id, name } }
    },

    // POST /auth/login
    login: async ({ email, password }) => {
        const { data } = await api.post('/auth/login', { email, password });
        return data; // { success, message, data: { accessToken, refreshToken } }
    },

    // POST /auth/refresh-token
    refreshToken: async (refreshToken) => {
        const { data } = await api.post('/auth/refresh-token', { refreshToken });
        return data; // { success, message, data: { accessToken } }
    },

    // DELETE /auth/logout
    logout: async (refreshToken) => {
        const { data } = await api.delete('/auth/logout', { data: { refreshToken } });
        return data;
    },

    // GET /auth/:id
    getUserById: async (id) => {
        const { data } = await api.get(`/auth/${id}`);
        return data; // { success, message, data: { id, name, email, role } }
    },
};

export default authService;
