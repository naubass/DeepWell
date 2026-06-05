import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const todayLabel = () => {
    const d = new Date();
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const nowTime = () => {
    const d = new Date();
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
};

// ─── Global slider thumb style ────────────────────────────────────────────────
export const SliderGlobalStyle = () => (
    <style>{`
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 22px; height: 22px;
            border-radius: 50%;
            background: #14b8a6;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(20,184,166,0.35);
            cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
            width: 22px; height: 22px;
            border-radius: 50%;
            background: #14b8a6;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(20,184,166,0.35);
            cursor: pointer;
        }
        input[type=range] { -webkit-appearance: none; appearance: none; }
        input[type=range]:focus { outline: none; }
    `}</style>
);

// ─── StepDots ─────────────────────────────────────────────────────────────────
export function StepDots({ current, total }) {
    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                        i < current - 1    ? 'w-2 h-2 bg-teal-500'
                        : i === current - 1 ? 'w-5 h-2 bg-teal-500'
                        : 'w-2 h-2 bg-gray-200'
                    }`}
                />
            ))}
        </div>
    );
}

// ─── StepHeader ──────────────────────────────────────────────────────────────
export function StepHeader({ step, total, onBack }) {
    return (
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <button
                onClick={onBack}
                className="flex items-center justify-center w-9 h-9 rounded-xl
                           border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
            >
                <FiArrowLeft size={16} />
            </button>
            <StepDots current={step} total={total} />
            <span className="text-xs font-medium text-gray-400">{step} of {total}</span>
        </div>
    );
}

// ─── NextBtn ─────────────────────────────────────────────────────────────────
export function NextBtn({ onClick, label = 'Continue', disabled = false, loading = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full py-4 rounded-2xl font-semibold text-sm
                        transition-all duration-200 flex items-center justify-center gap-2
                        ${disabled || loading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white shadow-lg shadow-teal-500/25'
                        }`}
        >
            {loading ? (
                <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Menyimpan...
                </>
            ) : (
                <>{label} <FiArrowRight size={15} /></>
            )}
        </button>
    );
}

// ─── HSlider ─────────────────────────────────────────────────────────────────
export function HSlider({ value, min, max, step = 0.5, onChange }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="relative w-full">
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={e => onChange(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #14b8a6 ${pct}%, #e5e7eb ${pct}%)`,
                }}
            />
        </div>
    );
}

// ─── NumStepper ──────────────────────────────────────────────────────────────
export function NumStepper({ value, min, max, step = 0.5, unit, onChange }) {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => onChange(clamp(value - step, min, max))}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center
                           text-gray-600 hover:bg-gray-50 text-xl font-medium transition"
            >−</button>
            <div className="flex items-end gap-1 min-w-[80px] justify-center">
                <span className="text-4xl font-bold text-gray-900 tabular-nums">{value}</span>
                <span className="text-sm text-gray-400 mb-1">{unit}</span>
            </div>
            <button
                onClick={() => onChange(clamp(value + step, min, max))}
                className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center
                           text-white text-xl font-medium hover:bg-teal-600 transition shadow-md shadow-teal-500/25"
            >+</button>
        </div>
    );
}

// ─── NumberPicker ─────────────────────────────────────────────────────────────
export function NumberPicker({ value, min, max, onChange }) {
    return (
        <div className="flex gap-2 flex-wrap">
            {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(n => (
                <button
                    key={n}
                    onClick={() => onChange(n)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-all duration-200
                                ${value === n
                                    ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/25'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
                                }`}
                >
                    {n}
                </button>
            ))}
        </div>
    );
}

// ─── VerticalSlider ───────────────────────────────────────────────────────────
export function VerticalSlider({ value, min, max, onChange }) {
    const pct = ((value - min) / (max - min)) * 100;
    const levels = [
        { label: '3+ Jam', val: 180, icon: '🏃' },
        { label: '1-2 Jam', val: 90,  icon: '🚶' },
        { label: '30 Mnt', val: 30,   icon: '🧘' },
        { label: 'Tidak',  val: 0,    icon: '😴' },
    ];
    return (
        <div className="flex gap-10 items-start">
            {/* Track */}
            <div className="relative flex flex-col items-center" style={{ height: 220 }}>
                <div className="absolute inset-0 w-5 mx-auto rounded-full bg-gray-100" />
                <div
                    className="absolute bottom-0 w-5 mx-auto rounded-full bg-teal-500 transition-all duration-200"
                    style={{ height: `${pct}%`, left: '50%', transform: 'translateX(-50%)' }}
                />
                <input
                    type="range"
                    min={min} max={max} step={10}
                    value={value}
                    onChange={e => onChange(parseInt(e.target.value))}
                    orient="vertical"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                {/* Thumb visual */}
                <div
                    className="absolute w-6 h-6 rounded-full bg-teal-500 border-2 border-white shadow-md shadow-teal-500/30 transition-all duration-200"
                    style={{ bottom: `calc(${pct}% - 12px)`, left: '50%', transform: 'translateX(-50%)' }}
                />
            </div>
            {/* Labels */}
            <div className="flex flex-col justify-between h-[220px] py-1">
                {levels.map(l => (
                    <button
                        key={l.val}
                        onClick={() => onChange(l.val)}
                        className={`flex items-center gap-2 text-lg transition-all duration-200 text-left
                                    ${value >= l.val ? 'text-teal-600 font-semibold' : 'text-gray-400'}`}
                    >
                        <span>{l.icon}</span>
                        <span>{l.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
