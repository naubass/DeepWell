import api from './api.js';

const profileService = {

    // POST /profiles
    createProfile: async (payload) => {
        const { data } = await api.post('/profiles/me', payload);
        return data;
    },

    // GET /profiles
    getProfile: async () => {
        const { data } = await api.get('/profiles/me');
        return data; // { success, message, data: { id, user_id, height, weight, age, ... } }
    },

    // PATCH /profiles
    updateProfile: async (payload) => {
        const { data } = await api.patch('/profiles/me', payload);
        return data;
    },

    // DELETE /profiles
    deleteProfile: async () => {
        const { data } = await api.delete('/profiles/me');
        return data;
    },
};

export default profileService;
