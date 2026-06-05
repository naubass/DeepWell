import AssessmentStepShell from './AssessmentStepShell';
import { NumStepper, HSlider } from '../../components/AssessmentPrimitives';

const QUAL_LABELS = ['', 'Sangat Buruk', 'Buruk', 'Kurang', 'Cukup', 'Lumayan', 'Oke', 'Baik', 'Sangat Baik', 'Luar Biasa', 'Sempurna'];

const DISORDER_OPTS = [
    { value: 0, label: 'Aman 😴' },
    { value: 1, label: 'Agak Terganggu 😟' },
    { value: 2, label: 'Sangat Terganggu 😰' },
];

export default function AStep2_Sleep({ data, onChange, onNext, onBack, step, total }) {
    const isValid = data.sleep_hours > 0 && data.sleep_quality > 0 && data.sleep_disorder_level !== '';

    return (
        <AssessmentStepShell
            step={step}
            total={total}
            onBack={onBack}
            onNext={onNext}
            isNextDisabled={!isValid}
            title="How was your rest last night? 🌙"
            subtitle="Berapa lama kamu tidur dan seberapa nyenyak?"
        >
            {/* Jam Tidur */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <p className="text-sm font-semibold text-gray-700">Jam Tidur</p>
                <div className="flex justify-center">
                    <NumStepper
                        value={data.sleep_hours} min={0} max={12} step={0.5} unit="hours"
                        onChange={v => onChange('sleep_hours', v)}
                    />
                </div>
            </div>

            {/* Quality */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">Kualitas Tidur</p>
                    <span className="text-xs text-teal-500 font-semibold">{QUAL_LABELS[data.sleep_quality] || ''}</span>
                </div>
                <div className="flex gap-2 justify-between text-xs text-gray-400 px-1">
                    <span>😩 Buruk</span><span>😴 Nyenyak 😊</span>
                </div>
                <HSlider 
                    value={data.sleep_quality} min={1} max={10} step={1}
                    onChange={v => onChange('sleep_quality', v)}
                />
            </div>

            {/* Gangguan */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <p className="text-lg font-semibold text-gray-700">Ada gangguan tidur?</p>
                <div className="flex flex-col gap-2">
                    {DISORDER_OPTS.map(o => (
                        <button
                            key={o.value}
                            onClick={() => onChange('sleep_disorder_level', o.value)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all
                                        ${data.sleep_disorder_level === o.value
                                            ? 'bg-teal-50 border-teal-400 text-teal-700'
                                            : 'bg-gray-50 border-transparent text-gray-600 hover:border-gray-200'
                                        }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>
        </AssessmentStepShell>
    );
}