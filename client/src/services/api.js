import axios from 'axios';

// ── Instance utama ────────────────────────────────────────────
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // contoh: http://localhost:3000/api
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request Interceptor ───────────────────────────────────────
// Setiap request keluar, tempelkan accessToken ke Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────
// Tangkap 401 → refresh token → retry request original
// Jika refresh gagal → paksa logout

let isRefreshing = false;

// Antrian request yang masuk saat proses refresh sedang berlangsung
// Semua di-resolve/reject sekaligus setelah refresh selesai
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const forceLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Redirect ke login tanpa React Router agar bisa dipanggil di luar komponen
    window.location.href = '/login';
};

api.interceptors.response.use(
    // Response sukses → langsung lewat
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Hanya tangani 401, dan jangan loop jika request refresh itu sendiri yang 401
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Jika sudah ada proses refresh yang berjalan, antri request ini
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            forceLogout();
            return Promise.reject(error);
        }

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`,
                { refreshToken }
            );

            const newAccessToken = data.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);

        } catch (refreshError) {
            processQueue(refreshError, null);
            forceLogout();
            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
