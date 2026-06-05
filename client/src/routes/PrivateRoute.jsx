import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore.js';

// PrivateRoute — proteksi halaman yang butuh login DAN profile sudah diisi
// Belum login          → /login
// Login tapi belum onboarding → /onboarding
// Login + sudah onboarding    → render halaman
const PrivateRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isOnboarded     = useAuthStore((state) => state.isOnboarded);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isOnboarded)     return <Navigate to="/onboarding" replace />;

    return <Outlet />;
};

export default PrivateRoute;