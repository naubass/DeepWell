import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import useAssessmentStore from '../stores/useAssessmentStore.js';
import { generateWeeklyInsight } from '../utils/aiInsight.js';

// ── Bar chart SVG murni 
function BarChart({ data, activeBar, onBarClick }) {
const maxScore = 100;
const chartH   = 50;
const barW     = 28;
const gap      = 12;
const totalW   = data.length * (barW + gap) - gap;

return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${chartH + 24}`}
         preserveAspectRatio="xMidYMid meet">
        {data.map((item, i) => {
            const x       = i * (barW + gap);
            const fillH   = (item.score / maxScore) * chartH;
            const y       = chartH - fillH;
            const isActive = activeBar === i;
            const color   = item.score >= 85 ? '#14b8a6'
                          : item.score >= 50 ? '#f59e0b'
                          :                    '#ef4444';

            return (
                <g key={i} onClick={() => onBarClick(i)} style={{ cursor: 'pointer' }}>
                    {/* Background bar */}
                    <rect x={x} y={0} width={barW} height={chartH}
                          rx={8} fill="#f1f5f9" />
                    {/* Fill bar */}
                    {item.score > 0 && (
                        <rect x={x} y={y} width={barW} height={fillH}
                              rx={8} fill={isActive ? color : `${color}99`}
                              style={{ transition: 'height 0.4s ease, y 0.4s ease' }}
                        />
                    )}
                    {/* Label hari di bawah */}
                    <text x={x + barW / 2} y={chartH + 16}
                          textAnchor="middle"
                          fontSize={10} fontWeight={isActive ? '700' : '500'}
                          fill={isActive ? '#0f172a' : '#94a3b8'}>
                        {item.label}
                    </text>
                </g>
            );
        })}
    </svg>
);
}

function HistoryCard({ item }) {
    const date = new Date(item.assessment_date);
    const dateStr = date.toLocaleDateString('id-ID', {
        weekday: 'short', day: 'numeric', month: 'short'
    });
    
    const score = item.well_being_score ?? 0;
    const colorClass = score >= 85 
        ? 'text-teal-600 bg-teal-50 border-teal-200/60 shadow-teal-500/10'
        : score >= 50 
        ? 'text-amber-600 bg-amber-50 border-amber-200/60 shadow-amber-500/10'
        : 'text-red-600 bg-red-50 border-red-200/60 shadow-red-500/10';

    return (
        <div className="group bg-white rounded-3xl p-4 border border-gray-100 
                        flex items-center gap-3 md:gap-4 hover:shadow-md hover:border-gray-200 
                        transition-all duration-300">
            
            {/* Score badge */}
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border flex flex-col
                             items-center justify-center flex-shrink-0 shadow-sm ${colorClass}`}>
                <span className="text-sm md:text-lg font-extrabold leading-none">
                    {score.toFixed(0)}
                </span>
                <span className="text-[9px] font-bold opacity-60">/100</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg md:text-xl leading-none">{item.emoji}</span>
                    <p className="text-sm font-bold text-gray-900 truncate">
                        {item.category}
                    </p>
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-gray-500 bg-gray-50 
                                 px-2 py-0.5 rounded-lg border border-gray-100 inline-block">
                    {dateStr}
                </span>
            </div>

            {/* Sub scores */}
            <div className="flex flex-col gap-1 md:gap-1.5 border-l border-gray-100 pl-3 md:pl-4 py-1 flex-shrink-0">
                <div className="flex items-center justify-end gap-2 md:gap-3">
                    <span className="hidden md:inline text-[9px] font-bold text-gray-400 tracking-widest uppercase">Mental</span>
                    <span className="text-sm font-extrabold text-gray-700">🧠 {item.mental_health_score?.toFixed(0) ?? '--'}</span>
                </div>
                <div className="flex items-center justify-end gap-2 md:gap-3">
                    <span className="hidden md:inline text-[9px] font-bold text-gray-400 tracking-widest uppercase">Sleep</span>
                    <span className="text-sm font-extrabold text-gray-700">😴 {item.sleep_health_score?.toFixed(0) ?? '--'}</span>
                </div>
            </div>
            
        </div>
    );
}

// ── Main page ────────
function RecordsPage() {
const navigate  = useNavigate();
const { history, fetchHistory, isLoading, todayStatus, fetchTodayStatus } = useAssessmentStore();
const [view, setView]         = useState('weekly'); // 'today' | 'weekly'
const [activeBar, setActiveBar] = useState(null);

    useEffect(() => {
        fetchTodayStatus();
        if (fetchHistory) fetchHistory(30); 
    }, [fetchTodayStatus, fetchHistory]);

    const result = todayStatus?.data;

    console.log(result);

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const weeklyChartData = (() => {
    // Ambil 7 hari terakhir mulai dari hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));

        const match = history.find((h) => {
            const hd = new Date(h.assessment_date);
            hd.setHours(0, 0, 0, 0);
            return hd.getTime() === d.getTime();
        });

        return {
            label: DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1],
            score: match?.well_being_score ?? 0,
            raw:   match ?? null,
            date:  d,
        };
    });
})();

// Data yang ditampilkan di bawah chart
const selectedBar = activeBar !== null ? weeklyChartData[activeBar] : null;

// Today data
const todayData = history.find((h) => {
    const d = new Date(h.assessment_date);
    const t = new Date();
    return d.toDateString() === t.toDateString();
});

console.log(history);

return (
    <div className="w-full max-w-6xl ms-auto px-4 pt-6 pb-24 lg:px-8 lg:pt-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-xl border border-gray-200
                           flex items-center justify-center text-gray-500
                           hover:bg-gray-50 transition-all lg:hidden">
                <FiArrowLeft size={16} />
            </button>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Mood Journey</h1>
                <p className="text-xs text-gray-400 mt-0.5">Riwayat well-being kamu</p>
            </div>
        </div>

        {/* Toggle Weekly / Today */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {[
                { key: 'weekly', label: 'Weekly' },
                { key: 'today',  label: 'Today'  },
            ].map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => { setView(tab.key); setActiveBar(null); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold
                                transition-all duration-200
                                ${view === tab.key
                                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/25'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* WEEKLY VIEW */}
        {view === 'weekly' && (
            <>
                {/* Chart */}
                <div className="bg-white rounded-3xl p-5 border border-gray-100 mb-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-bold text-gray-800">7 Hari Terakhir</p>
                        <p className="text-xs text-gray-400">
                            {weeklyChartData.filter(d => d.score > 0).length} check-ins
                        </p>
                    </div>
                    <BarChart
                        data={weeklyChartData}
                        activeBar={activeBar}
                        onBarClick={(i) => setActiveBar(activeBar === i ? null : i)}
                    />
                </div>

                {/* Detail bar yang dipilih */}
                {selectedBar?.raw ? (
                    <div className="bg-teal-500 rounded-3xl p-5 mb-4 text-white shadow-lg shadow-teal-500/20">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{selectedBar.raw.emoji}</span>
                                <p className="font-bold text-base">{selectedBar.raw.category}</p>
                            </div>
                            <span className="text-3xl font-extrabold">
                                {selectedBar.score.toFixed(0)}
                                <span className="text-sm font-normal text-teal-200">/100</span>
                            </span>
                        </div>
                        <p className="text-xs text-teal-100">
                            {new Date(selectedBar.raw.assessment_date)
                                .toLocaleDateString('id-ID', {
                                    weekday: 'long', day: 'numeric', month: 'long'
                                })}
                        </p>
                        <div className="flex gap-6 mt-4 pt-4 border-t border-teal-400/50">
                            <div>
                                <p className="text-lg text-teal-200 uppercase tracking-wider mb-0.5">Mental</p>
                                <p className="text-base font-bold">
                                    {selectedBar.raw.mental_health_score?.toFixed(1)}
                                </p>
                            </div>
                            <div>
                                <p className="text-lg text-teal-200 uppercase tracking-wider mb-0.5">Sleep</p>
                                <p className="text-base font-bold">
                                    {selectedBar.raw.sleep_health_score?.toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : selectedBar ? (
                    <div className="bg-gray-50 rounded-3xl p-5 mb-4 text-center border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400 font-medium">Tidak ada data untuk hari ini</p>
                    </div>
                ) : null}


                {history.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 border border-gray-100 mb-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🤖</span>
                            <p className="text-sm font-bold text-gray-800">Weekly AI Insight</p>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {generateWeeklyInsight(history)}
                        </p>
                    </div>
                )}
            </>
        )}



        {/* TODAY VIEW */}
        {view === 'today' && (
            <div>
                {todayData ? (
                    <div className="flex flex-col gap-4">
                        {/* Score besar */}
                        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 text-white text-center shadow-lg shadow-teal-500/20">
                            <p className="text-sm font-semibold text-teal-100 mb-2">
                                Well-being Score Hari Ini
                            </p>
                            <div className="flex items-end justify-center gap-1 mb-2">
                                <span className="text-7xl font-extrabold leading-none">
                                    {todayData.well_being_score.toFixed(0)}
                                </span>
                                <span className="text-xl text-teal-200 font-medium mb-1">/100</span>
                            </div>
                            <p className="text-xl font-bold mt-2 flex items-center justify-center gap-2">
                                <span>{todayData.emoji}</span>
                                {todayData.category}
                            </p>
                        </div>

                        {/* Sub scores */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mental Health</p>
                                <p className="text-3xl font-extrabold text-gray-800">
                                    {todayData.mental_health_score?.toFixed(1)}
                                    <span className="text-sm text-gray-400 font-medium ml-1">/100</span>
                                </p>
                            </div>
                            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sleep Health</p>
                                <p className="text-3xl font-extrabold text-gray-800">
                                    {todayData.sleep_health_score?.toFixed(1)}
                                    <span className="text-sm text-gray-400 font-medium ml-1">/100</span>
                                </p>
                            </div>
                        </div>

                        {/* AI detail */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mt-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                AI PREDICTION DETAIL
                            </p>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                                    <span className="text-sm text-gray-600 font-medium">Indikasi Depresi</span>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-xl
                                        ${result.depression_label === 'Depression'
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-green-50 text-green-500'
                                        }`}>
                                        {result.depression_label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-sm text-gray-600 font-medium">Gangguan Tidur</span>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-xl
                                        ${result.sleep_disorder_class === 'No'
                                            ? 'bg-green-50 text-green-500'
                                            : 'bg-amber-50 text-amber-500'
                                        }`}>
                                        {result.sleep_disorder_class}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-10 border border-dashed border-gray-200 text-center">
                        <p className="text-4xl mb-4">📋</p>
                        <p className="text-base font-bold text-gray-800 mb-2">
                            Belum ada data hari ini
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Lakukan check-in untuk melihat prediksi AI-mu
                        </p>
                        <button
                            onClick={() => navigate('/assessment')}
                            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white text-sm
                                       font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-teal-500/20"
                        >
                            Check in sekarang →
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* Daftar history (weekly view) */}
        {view === 'weekly' && history.length > 0 && (
            <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
                    Riwayat Check-In
                </p>
                <div className="flex flex-col gap-3">
                    {history.slice(0, 10).map((item) => (
                        <HistoryCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        )}

        {/* Empty state */}
        {history.length === 0 && !isLoading && (
            <div className="text-center py-16">
                <p className="text-4xl mb-4">🌱</p>
                <p className="text-base font-bold text-gray-800 mb-2">Belum ada riwayat</p>
                <p className="text-sm text-gray-500">
                    Mulai check-in pertamamu hari ini untuk melihat data di sini.
                </p>
            </div>
        )}

    </div>
);
}

export default RecordsPage;