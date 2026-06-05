import { create } from 'zustand';
import authService from '../services/authService.js';
import profileService from '../services/profileService.js';

const useAuthStore = create((set, get) => ({
    // State
    user:            null,
    profile:         null, 
    isAuthenticated: false,
    isOnboarded:     false,
    isInitialized:   false,
    isLoading:       false,
    error:           null,

    // Actions
    login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
            const result = await authService.login({ email, password });
            const { accessToken, refreshToken, user } = result.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            let isOnboarded = false;
            let profileData = null; // Siapkan wadah
            
            try {
                // Fetch profile dan simpan datanya
                const res = await profileService.getProfile();
                profileData = res.data;
                isOnboarded = true;
            } catch (_) {
                // 404 = profile belum ada
            }

            set({ 
                isAuthenticated: true, 
                isOnboarded, 
                user: user, 
                profile: profileData, // ✨ SIMPAN KE STATE
                error: null 
            });

            return { isOnboarded };
        } catch (error) {
            // ... (kode error handling yang sama)
            set({ error: error.response?.data?.message ?? 'Login gagal.', isAuthenticated: false, isLoading: false });
            throw error;
        }
    },

    initAuth: async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            set({ isAuthenticated: false, isOnboarded: false, isInitialized: true, user: null, profile: null });
            return;
        }

        let isOnboarded = false;
        let profileData = null;

        try {
            // Fetch profile 1x saja saat aplikasi pertama kali load
            const res = await profileService.getProfile();
            profileData = res.data;
            isOnboarded = true;
        } catch (_) {
            // 404 = profile belum ada
        }

        let userData = null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.id) {
                const userRes = await authService.getUserById(payload.id);
                userData = userRes.data;
            }
        } catch (err) {
            console.error("Gagal mengambil data user:", err);
        }

        set({ 
            isAuthenticated: true, 
            isOnboarded, 
            user: userData,
            profile: profileData, // ✨ SIMPAN KE STATE
            isInitialized: true 
        });
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            // ... (logika hapus token)
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({
                user:            null,
                profile:         null, // ✨ KOSONGKAN SAAT LOGOUT
                isAuthenticated: false,
                isOnboarded:     false,
                error:           null,
                isLoading:       false,
            });
        }
    },
    
    // ... sisa kode lainnya (setOnboarded, clearError, register)
}));

export default useAuthStore;