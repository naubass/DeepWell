import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore.js';

// PublicRoute — halaman yang hanya boleh diakses saat BELUM login
// Jika sudah login → redirect ke /dashboard
// Contoh: /login, /register
const PublicRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
