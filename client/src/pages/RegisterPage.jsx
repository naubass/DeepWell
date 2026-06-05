import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore.js';
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (clearError) clearError();
    }, [clearError]);

    const handleChange = (e) => {
        if (clearError) clearError();
        setLocalError(null);
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi client-side
        if (form.password !== form.confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }

        if (form.password.length < 8) {
            setLocalError('Password must be at least 8 characters long.');
            return;
        }

        try {
            await register({ 
                name: form.name, 
                email: form.email, 
                password: form.password 
            });
            navigate('/login', { replace: true, state: { registered: true } });
        } catch (_) {
            // Error ditangani oleh store
        }
    };

    const displayError = localError || error;

    return (
        <div className="flex min-h-screen w-full bg-white font-sans text-gray-900">
            <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-16 md:px-24 lg:w-1/2 xl:px-32 relative">
                <div className="absolute top-0 w-full left-0 flex bg-[#E1ECED] rounded-b-full py-2 text-center items-center justify-center gap-2">
                    <img src="./fav-logo.png" className='h-15 w-15' alt="Logo" />
                </div>

                <div className="mx-auto w-full max-w-md mt-8">
                    <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
                    <p className="text-gray-500 mb-8">Join DeepWell and start tracking your well-being today.</p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Full Lengkap</label>
                            <input
                                name="name" type="text" value={form.name} onChange={handleChange}
                                placeholder="Nama kamu" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Email</label>
                            <input
                                name="email" type="email" value={form.email} onChange={handleChange}
                                placeholder="email@example.com" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-600 focus:outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Password</label>
                            <div className="relative">
                                <input
                                    name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                                    placeholder="Minimal 8 karakter" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-600 focus:outline-none"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                                    {showPassword ? <IoIosEye size={20} /> : <IoIosEyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
                            <div className="relative">
                                <input
                                    name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange}
                                    placeholder="Ulangi password" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-600 focus:outline-none"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400">
                                    {showConfirmPassword ? <IoIosEye size={20} /> : <IoIosEyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        {displayError && <p className="text-red-500 text-sm">{displayError}</p>}

                        <button
                            disabled={isLoading} type="submit"
                            className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-70"
                        >
                            {isLoading ? 'Loading...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Have an account? <Link to="/login" className="font-semibold text-teal-600 hover:underline">Login</Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:block lg:w-1/2 h-screen">
                <img src="./bg-auth.jpg" alt="Illustration" className="h-full w-full object-cover" />
            </div>
        </div>
    );
}

export default RegisterPage;