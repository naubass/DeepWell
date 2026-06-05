import { create } from 'zustand';
import assessmentService from '../services/assessmentService.js';

// useAssessmentStore — menampung jawaban multi-step form (Layar 1–8)
// dan menyimpan hasil AI setelah submit

// Struktur formData mengikuti 12 field yang dibutuhkan backend
const initialFormData = {
    // Sleep (Layar tidur)
    sleep_hours:            '',
    sleep_quality:          '',
    sleep_disorder_level:   '',

    // Mental health & lifestyle
    stress_level:           '',
    anxiety_level:          '',
    physical_activity:      '',
    performance:            '',
    addiction_level:        '',

    // Digital & social
    daily_social_media_hours:   '',
    platform_usage:             '',
    screen_time_before_sleep:   '',
    social_interaction_level:   '',
};

const useAssessmentStore = create((set, get) => ({
    // ── State ─────────────────────────────────────────────────
    formData:       { ...initialFormData },
    currentStep:    1,          // Step 1–8 di multi-step form
    totalSteps:     8,

    // Hasil dari backend setelah submit
    result:         null,

    // Status hari ini (dari GET /assessments/today)
    todayStatus:    null,

    // Riwayat assessment
    history:        [],

    isLoading:      false,
    isSubmitting:   false,
    error:          null,

    // ── Form Actions ──────────────────────────────────────────

    // Update satu atau beberapa field sekaligus
    // Contoh: setFormData({ sleep_hours: 7, sleep_quality: 8 })
    setFormData: (fields) => {
        set((state) => ({
            formData: { ...state.formData, ...fields },
        }));
    },

    nextStep: () => {
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        }));
    },

    prevStep: () => {
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 1),
        }));
    },

    goToStep: (step) => set({ currentStep: step }),

    resetForm: () => {
        set({ formData: { ...initialFormData }, currentStep: 1, result: null, error: null });
    },

    // ── API Actions ───────────────────────────────────────────

    submitCheckIn: async () => {
        set({ isSubmitting: true, error: null });
        try {
            const { formData } = get();
            const result = await assessmentService.submitCheckIn(formData);

            // Simpan hasil AI ke store agar halaman result bisa langsung render
            set({ result: result.data, error: null });
            return result;
        } catch (error) {
            const message = error.response?.data?.message ?? 'Gagal mengirim check-in.';
            set({ error: message });
            throw error;
        } finally {
            set({ isSubmitting: false });
        }
    },

    fetchTodayStatus: async () => {
        set({ isLoading: true, error: null });
        try {
            const result = await assessmentService.getTodayStatus();
            set({ todayStatus: result.data });
        } catch (error) {
            const message = error.response?.data?.message ?? 'Gagal mengambil status hari ini.';
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchHistory: async (limit = 30) => {
        set({ isLoading: true, error: null });
        try {
            const result = await assessmentService.getHistory(limit);
            set({ history: result.data });
        } catch (error) {
            const message = error.response?.data?.message ?? 'Gagal mengambil riwayat.';
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));

export default useAssessmentStore;
