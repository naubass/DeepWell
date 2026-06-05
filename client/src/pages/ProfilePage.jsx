import { useState, useEffect } from 'react';
import { FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import useAuthStore from '../stores/useAuthStore.js';
import profileService from '../services/profileService.js';

// ── Daftar Pekerjaan Valid (Sesuai Training Data Model) ──
const OCCUPATIONS = [
    'Accountant', 'Artist', 'Chef', 'Doctor', 'Engineer',
    'Lawyer', 'Manager', 'Nurse', 'Sales Representative',
    'Salesperson', 'Scientist', 'Software Engineer',
    'Student', 'Teacher', 'Writer',
];

export default function ProfilePage() {
    const { user, profile, initAuth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // State untuk form
    const [formData, setFormData] = useState({
        gender: '',
        age: '',
        occupation: '',
        weight: '',
        height: ''
    });

    // Isi nilai default saat profile berhasil di-load dari Zustand
    useEffect(() => {
        if (profile) {
            setFormData({
                gender: profile.gender || '',
                age: profile.age || '',
                occupation: profile.occupation || '',
                weight: profile.weight || '',
                height: profile.height || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setToast(null);

        try {
            const payload = {
                gender: formData.gender,
                age: Number(formData.age),
                occupation: formData.occupation,
                weight: Number(formData.weight),
                height: Number(formData.height),
                profile_image: formData.gender === 'male' ? './images/gender/male.png' : './images/gender/female.png'
            };

            // Hit API Update Profile
            await profileService.updateProfile(payload);
            
            // Refresh state global agar Sidebar (Avatar, BMI) langsung update!
            if (initAuth) await initAuth();

            setToast({ type: 'success', message: 'Profil berhasil diperbarui!' });
            
            // Hilangkan notifikasi setelah 3 detik
            setTimeout(() => setToast(null), 3000);
        } catch (error) {
            setToast({ 
                type: 'error', 
                message: error.response?.data?.message || 'Gagal memperbarui profil.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const userName = user?.name || 'User';
    const userEmail = user?.email || 'user@example.com';
    const profileImg = profile?.profile_image;
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="w-full max-w-5xl mx-auto pt-6">

            <div className="bg-teal-100 rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600
                                flex items-center justify-center text-white font-bold text-3xl flex-shrink-0
                                overflow-hidden shadow-lg shadow-teal-500/20 border-4 border-teal-50">
                    {profileImg ? (
                        <img src={profileImg} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                        <span>{userInitial}</span>
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">{userName}</h2>
                    <p className="text-sm text-gray-500 mb-2">{userEmail}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">
                        Foto mengikuti Gender
                    </span>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider">
                    Data Fisik & Pekerjaan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    {/* Gender */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600">Gender</label>
                        <select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange}
                            required
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                                       focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 
                                       outline-none transition-all text-gray-800"
                        >
                            <option value="" disabled>Pilih gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* Age */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600">Umur (Tahun)</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.age} 
                            onChange={handleChange}
                            min="10" max="100" required
                            placeholder="Contoh: 21"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                                       focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 
                                       outline-none transition-all text-gray-800"
                        />
                    </div>

                    {/* Weight */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600">Berat Badan (Kg)</label>
                        <input 
                            type="number" 
                            name="weight" 
                            value={formData.weight} 
                            onChange={handleChange}
                            min="20" max="300" required
                            placeholder="Contoh: 65"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                                       focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 
                                       outline-none transition-all text-gray-800"
                        />
                    </div>

                    {/* Height */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600">Tinggi Badan (Cm)</label>
                        <input 
                            type="number" 
                            name="height" 
                            value={formData.height} 
                            onChange={handleChange}
                            min="100" max="250" required
                            placeholder="Contoh: 170"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                                       focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 
                                       outline-none transition-all text-gray-800"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-gray-600">Pekerjaan / Status</label>
                        <select 
                            name="occupation" 
                            value={formData.occupation} 
                            onChange={handleChange}
                            required
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                                       focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 
                                       outline-none transition-all text-gray-800"
                        >
                            <option value="" disabled>Pilih Pekerjaan / Status</option>
                            {OCCUPATIONS.map((job) => (
                                <option key={job} value={job}>
                                    {job}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-5 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                                    ${isLoading 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25 active:scale-95'
                                    }`}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <FiSave size={16} />
                        )}
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl z-50 animate-bounce-short
                                 ${toast.type === 'success' ? 'bg-teal-50 border border-teal-200 text-teal-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {toast.type === 'success' ? <FiCheckCircle size={18} className="text-teal-500"/> : <FiAlertCircle size={18} className="text-red-500"/>}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}

        </div>
    );
}