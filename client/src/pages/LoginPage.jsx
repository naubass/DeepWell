import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore.js';
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

function LoginPage() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { login, isLoading, error, clearError } = useAuthStore();

    const justRegistered = location.state?.registered === true;
    const [form, setForm] = useState({ email: '', password: '' });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        // clearError();
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // login() mengembalikan { isOnboarded }
            const { isOnboarded } = await login({ email: form.email, password: form.password });

            // Arahkan berdasarkan status profil
            navigate(isOnboarded ? '/dashboard' : '/onboarding', { replace: true });
        } catch (_) {
            // Error sudah di store.error
        }
    };
    
    return (
        <div className="flex min-h-screen w-full bg-white font-sans text-gray-900">
        {/* Kiri: Form Login */}
        <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-16 md:px-24 lg:w-1/2 xl:px-32 relative">
            
            {/* Header Logo (Absolut di atas kiri) */}
            <div className="absolute top-0 w-full  left-0 flex bg-[#E1ECED] rounded-b-full py-2 text-center items-center justify-center gap-2">
                <img src="./fav-logo.png" className='h-15 w-15' alt="" />
            </div>

            <div className="mx-auto w-full max-w-md">
        {justRegistered && (
            <p className="text-sm font-semibold text-teal-500">Akun berhasil dibuat! Silakan masuk.</p>
        )}
            <h1 className="text-3xl font-bold mb-2">Sign In to DeepWell</h1>
            <p className="text-gray-500 mb-8">Welcome back! Please sign in to continue.</p>

            {/* Divider */}
            <div className="relative mb-8 flex items-center justify-center">
                <div className="w-full border-t border-gray-300"></div>
                <span className="absolute bg-white px-4 text-sm text-gray-500">or</span>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email} onChange={handleChange}
                    placeholder="example@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    required autoComplete="email"
                    />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    required autoComplete="current-password"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                    {showPassword ? <IoIosEye size={20} /> : <IoIosEyeOff size={20} />}
                    </button>
                </div>
                </div>

                <div className="flex items-center justify-end">
                {/* ongoing yas */}
                {/* <a href="#" className="text-sm font-medium text-teal-600 hover:underline">
                    Forgot password?
                </a> */}
                </div>

                {error && (
                <p className="text-red-500 text-sm mt-2">
                    {typeof error === 'string' ? error : (error.message || 'Terjadi kesalahan pada sistem')}
                </p>
                )}

                <button
                disabled={isLoading}
                type="submit"
                className="w-full cursor-pointer rounded-lg bg-teal-600 py-3 font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                {isLoading ? 'Loading...' : 'Sign In'}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-teal-600 hover:underline">
                Sign up
                </Link>
            </p>
            </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 h-screen object-cover">
            <img
            src="./bg-auth.jpg"
            alt="DeepWell Illustration"
            className="h-full w-full object-cover"
            />
        </div>
        </div>
    );
}

export default LoginPage;