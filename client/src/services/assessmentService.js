import api from './api.js';

const assessmentService = {

    // POST checkin
    // checkInData = 12 field dari form (sleep_hours, stress_level, dst)
    submitCheckIn: async (checkInData) => {
        const { data } = await api.post('checkin', checkInData);
        return data; // { success, message, data: { assessmentId, assessmentDate, aiResult } }
    },

    // GET checkin/today
    getTodayStatus: async () => {
        const { data } = await api.get('checkin/today');
        return data; // { success, message, data: { has_checked_in, data: row | null } }
    },

    // GET checkin/history?limit=30
    getHistory: async (limit = 30) => {
        const { data } = await api.get('checkin/history', {
            params: { limit },
        });
        return data; // { success, message, data: [ ...rows ] }
    },
};

export default assessmentService;
