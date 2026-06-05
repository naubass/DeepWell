import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore.js';

function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [localError, setLocalError] = useState(null);

    const handleChange = (e) => {
        clearError();
        setLocalError(null);
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi client-side sederhana sebelum hit API
        if (form.password !== form.confirmPassword) {
            setLocalError('Password dan konfirmasi password tidak sama.');
            return;
        }

        if (form.password.length < 8) {
            setLocalError('Password minimal 8 karakter.');
            return;
        }

        try {
            await register({ name: form.name, email: form.email, password: form.password });
            // Register sukses → arahkan ke login, jangan auto-login
            // (backend tidak return token saat register, hanya id & name)
            navigate('/login', { replace: true, state: { registered: true } });
        } catch (_) {
            // Error dari backend sudah di store.error
        }
    };

    const displayError = localError || error;

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>DeepWell</h1>
                <p style={styles.subtitle}>Buat akun baru</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label htmlFor="name" style={styles.label}>Nama Lengkap</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nama kamu"
                            required
                            autoComplete="name"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                            autoComplete="email"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Minimal 8 karakter"
                            required
                            autoComplete="new-password"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label htmlFor="confirmPassword" style={styles.label}>Konfirmasi Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Ulangi password"
                            required
                            autoComplete="new-password"
                            style={styles.input}
                        />
                    </div>

                    {displayError && <p style={styles.errorMsg}>{displayError}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}
                    >
                        {isLoading ? 'Mendaftar...' : 'Daftar'}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Sudah punya akun?{' '}
                    <Link to="/login" style={styles.link}>Masuk di sini</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '1rem',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
    title: {
        margin: '0 0 0.25rem',
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#111827',
    },
    subtitle: {
        margin: '0 0 1.5rem',
        fontSize: '0.875rem',
        color: '#6b7280',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151',
    },
    input: {
        padding: '0.5rem 0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.875rem',
        outline: 'none',
    },
    errorMsg: {
        margin: 0,
        padding: '0.5rem 0.75rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        color: '#dc2626',
        fontSize: '0.875rem',
    },
    button: {
        padding: '0.625rem',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.875rem',
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: '0.25rem',
    },
    footerText: {
        marginTop: '1.25rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#6b7280',
    },
    link: {
        color: '#4f46e5',
        textDecoration: 'none',
        fontWeight: 500,
    },
};

export default RegisterPage;