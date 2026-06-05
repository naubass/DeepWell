import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore.js';

// OnboardingRoute — hanya untuk halaman /onboarding
// Belum login       → /login
// Sudah onboarding  → /dashboard (tidak perlu onboarding lagi)
// Login, belum onboarding → render OnboardingPage
const OnboardingRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isOnboarded     = useAuthStore((state) => state.isOnboarded);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (isOnboarded)      return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};

export default OnboardingRoute;
