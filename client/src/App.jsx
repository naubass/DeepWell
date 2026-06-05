import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import useAuthStore from './stores/useAuthStore.js';
import PrivateRoute    from './routes/PrivateRoute.jsx';
import PublicRoute     from './routes/PublicRoute.jsx';
import OnboardingRoute from './routes/OnboardingRoute.jsx';
import AppLayout       from './routes/AppLayout.jsx';

const LoginPage      = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage   = lazy(() => import('./pages/RegisterPage.jsx'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage.jsx'));
const DashboardPage  = lazy(() => import('./pages/DashboardPage.jsx'));
const RecordsPage    = lazy(() => import('./pages/RecordsPage.jsx'));
const ProfilePage    = lazy(() => import('./pages/ProfilePage.jsx'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage.jsx'));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent
                        rounded-full animate-spin" />
    </div>
);

function App() {
    const { initAuth, isInitialized } = useAuthStore();

    useEffect(() => { initAuth(); }, [initAuth]);

    if (!isInitialized) return <PageLoader />;

    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Public */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login"    element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/*Onboarding (login tapi belum isi profil) */}
                    <Route element={<OnboardingRoute />}>
                        <Route path="/onboarding" element={<OnboardingPage />} />
                    </Route>

                    {/* Private — semua pakai AppLayout */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard"  element={<DashboardPage />} />
                            <Route path="/records"    element={<RecordsPage />} />
                            <Route path="/assessment" element={<AssessmentPage />} />
                            <Route path="/profile"    element={<ProfilePage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
