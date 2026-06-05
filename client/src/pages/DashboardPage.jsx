import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMoon, FiSmile, FiActivity, FiMonitor } from 'react-icons/fi';
import { BsFire, BsSun } from 'react-icons/bs';
import useAssessmentStore from '../stores/useAssessmentStore.js';
import useAuthStore from '../stores/useAuthStore.js';

function RadialScore({ score = 0, size = 120, stroke = 10 }) {
    const radius  = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const filled  = (score / 100) * circumference;
    const isEmpty = score === 0;

    const color = score >= 85 ? '#14b8a6'
                : score >= 50 ? '#f59e0b'
                :               '#ef4444';

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
             style={{ transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle cx={size/2} cy={size/2} r={radius}
                fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
            {/* Fill */}
            <circle cx={size/2} cy={size/2} r={radius}
                fill="none"
                stroke={isEmpty ? '#e2e8f0' : color}
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - filled}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
        </svg>
    );
}

// ── Stat card
function StatCard({ icon: Icon, label, value, iconBg = 'bg-teal-50', iconColor = 'text-teal-500' }) {
    return (
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 ${iconBg} ${iconColor} rounded-xl
                                 flex items-center justify-center flex-shrink-0`}>
                    <Icon size={15} />
                </div>
                <span className="text-xs font-semibold text-gray-500">{label}</span>
            </div>
            <p className="text-base font-bold text-gray-800 leading-tight">
                {value ?? <span className="text-gray-300 font-normal">--</span>}
            </p>
        </div>
    );
}

// Main dashboard
export default function DashboardPage() {
    const navigate = useNavigate();
    const { todayStatus, fetchTodayStatus, history, fetchHistory, isLoading } = useAssessmentStore();
    const { user, profile } = useAuthStore();
    
    useEffect(() => {
        fetchTodayStatus();
        if (fetchHistory) fetchHistory(30);
    }, [fetchTodayStatus, fetchHistory]);

    const hasCheckedIn = todayStatus?.has_checked_in;
    const result       = todayStatus?.data;

    // ── LOGIKA PERHITUNGAN STREAK ──
    const calculateStreak = (historyData) => {
        if (!historyData || historyData.length === 0) return 0;

        // 1. Kumpulkan tanggal unik (abaikan jam) dan urutkan dari terbaru
        const uniqueDates = [...new Set(historyData.map(item => {
            const d = new Date(item.assessment_date);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }))].sort((a, b) => b - a);

        if (uniqueDates.length === 0) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // 2. Jika check-in terakhir BUKAN hari ini dan BUKAN kemarin, streak putus (0)
        if (uniqueDates[0] !== today.getTime() && uniqueDates[0] !== yesterday.getTime()) {
            return 0;
        }

        let streak = 0;
        let expectedDate = uniqueDates[0]; 

        // 3. Hitung mundur rentetan harinya
        for (let i = 0; i < uniqueDates.length; i++) {
            if (uniqueDates[i] === expectedDate) {
                streak++;
                // Set ekspektasi tanggal ke H-1
                const nextExpected = new Date(expectedDate);
                nextExpected.setDate(nextExpected.getDate() - 1);
                expectedDate = nextExpected.getTime();
            } else {
                break; // Berhenti jika ada bolong
            }
        }
        return streak;
    };

    const currentStreak = calculateStreak(history);

    // Format tanggal hari ini
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
    });

    // Dynamic greeting berdasarkan waktu
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    console.log(user)
    // Ambil nama depan
    const firstName = user?.name?.split(' ')[0] ?? 'there';
    const score = result?.well_being_score ?? 0;

    return (
        <div className="w-full mx-auto p-4 md:p-8">

            {/* Header: avatar + nama + streak */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br
                                    from-teal-400 to-teal-600
                                    flex items-center justify-center
                                    text-white font-bold text-xl flex-shrink-0
                                    overflow-hidden shadow-lg shadow-teal-500/30 border-2 border-white">
                        {profile?.profile_image
                            ? <img src={profile.profile_image} alt="avatar"
                                   className="w-full h-full object-cover" />
                            : <span>{firstName[0]?.toUpperCase() ?? '?'}</span>
                        }
                    </div>

                    {/* Nama + tanggal */}
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-0.5">{greeting},</p>
                        <p className="text-xl font-bold text-gray-900 leading-tight">
                            {firstName}! 👋
                        </p>
                    </div>
                </div>

                {/* Streak badge */}
                <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl shadow-sm
                                    ${currentStreak > 0 ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-200'}`}>
                        <BsFire size={14} className={currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'} />
                        <span className={`text-xs font-bold ${currentStreak > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                            {currentStreak} Streak
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2 font-medium">
                        <FiCalendar size={10} />
                        <span>{today}</span>
                    </div>
                </div>
            </div>

            {/* Score + CTA / Hasil AI */}
            <div className={`rounded-3xl p-5 mb-8 border transition-all
                             ${hasCheckedIn
                                ? 'bg-gradient-to-br from-white to-teal-50/30 border-teal-100 shadow-sm'
                                : 'bg-white border-dashed border-gray-200'
                             }`}>
                <div className="flex items-center gap-6">

                    {/* Radial chart */}
                    <div className="relative flex-shrink-0 drop-shadow-sm">
                        <RadialScore score={score} size={100} stroke={9} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-2xl font-extrabold leading-none
                                ${score >= 85 ? 'text-teal-500'
                                  : score >= 50 ? 'text-amber-500'
                                  : score > 0  ? 'text-red-500'
                                  : 'text-gray-300'}`}>
                                {score > 0 ? score.toFixed(0) : '0'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-wide">/ 100</span>
                        </div>
                    </div>

                    {/* Kanan: CTA atau hasil */}
                    {!hasCheckedIn ? (
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                Complete your daily check-in now and let AI analyze your well-being today.
                            </p>
                            <button
                                onClick={() => navigate('/assessment')}
                                className="w-full py-3 bg-teal-500 hover:bg-teal-600
                                           text-white text-sm font-semibold rounded-xl
                                           transition-all active:scale-[0.98]
                                           shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
                            >
                                Check in <span className="text-lg leading-none">→</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{result?.emoji || '✨'}</span>
                                <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">
                                    AI Insight
                                </span>
                            </div>
                            <p className="text-base font-bold text-gray-800 mb-1 leading-tight">
                                {result?.category || 'Analyzing...'}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {result?.depression_label === 'Depression'
                                    ? '⚠️ Tanda stres/depresi terdeteksi. Jangan ragu untuk istirahat.'
                                    : '✓ Kondisi mental stabil.'}
                                {result?.sleep_disorder_class && result?.sleep_disorder_class !== 'No'
                                    ? ` · Pola tidur: ${result.sleep_disorder_class}`
                                    : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats grid */}
            <p className="text-sm font-bold text-gray-900 mb-4">
                Today's Overview
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <StatCard
                    icon={FiMoon}
                    label="Sleep"
                    value={result?.sleep_health_score != null
                        ? `${result.sleep_health_score.toFixed(1)} / 100`
                        : null}
                    iconBg="bg-indigo-50" iconColor="text-indigo-500"
                />
                <StatCard
                    icon={FiSmile}
                    label="Mood"
                    value={result?.mental_health_score != null
                        ? `${result.mental_health_score.toFixed(1)} / 100`
                        : null}
                    iconBg="bg-amber-50" iconColor="text-amber-500"
                />
                <StatCard
                    icon={BsFire}
                    label="Depression label"
                    value={result?.depression_label != null ? `${result.depression_label}` : null}
                    iconBg="bg-orange-50" iconColor="text-orange-500"
                />
                <StatCard
                    icon={BsSun}
                    label="Sleep Disorder"
                    value={result?.sleep_disorder_class != null ? `${result.sleep_disorder_class}` : null}
                    iconBg="bg-blue-50" iconColor="text-blue-500"
                />
            </div>

            {/* Tracker section */}
            <p className="text-sm font-bold text-gray-900 mb-4">
                Your Journey
            </p>
            <div className="flex flex-col gap-3">
                {/* Check-in streak card */}
                <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm
                                flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center
                                    justify-center flex-shrink-0 border border-gray-100">
                        <span className="text-2xl">🗓️</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Mindful Journal</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {currentStreak > 0 ? `${currentStreak} Day Streak 🔥` : 'Start your streak today'}
                        </p>
                    </div>
                    {/* Dot pattern dekoratif */}
                    <div className="grid grid-cols-3 gap-1.5 opacity-40 pr-2">
                        {Array.from({length: 9}).map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < currentStreak ? 'bg-teal-500' : 'bg-gray-300'}`} />
                        ))}
                    </div>
                </div>

                {/* CTA card jika belum check-in */}
                {!hasCheckedIn && (
                    <button
                        onClick={() => navigate('/assessment')}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white
                                   rounded-3xl p-5 text-left transition-all active:scale-[0.98]
                                   shadow-lg shadow-teal-500/20 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <p className="font-bold text-base mb-1">Start Today's Check-in</p>
                            <p className="text-teal-100 text-xs font-medium">
                                2–3 menit · Didukung AI
                            </p>
                        </div>
                        {/* Lingkaran dekoratif di background tombol */}
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                    </button>
                )}

                {/* History shortcut */}
                <button
                    onClick={() => navigate('/records')}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700
                               rounded-3xl p-4 text-left border border-gray-100 transition-all active:scale-[0.98]
                               flex items-center justify-between shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                            <FiActivity size={18} className="text-teal-500" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Lihat Riwayat</p>
                            <p className="text-xs text-gray-400 mt-0.5">Journey check-in kamu</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
}