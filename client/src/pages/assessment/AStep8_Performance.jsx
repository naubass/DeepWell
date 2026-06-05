import AssessmentStepShell from './AssessmentStepShell';
import { HSlider } from '../../components/AssessmentPrimitives';

export default function AStep8_Performance({ data, onChange, onNext, onBack, step, total }) {
    const pct = data.performance;
    const label = 
        pct >= 80 ? '🚀 Luar Biasa' : 
        pct >= 60 ? '👍 Bagus' : 
        pct >= 40 ? '😐 Biasa' : '😓 Kurang';
    const isValid = data.performance !== '';

    return (
        <AssessmentStepShell
            step={step} total={total} onBack={onBack} onNext={onNext} isNextDisabled={!isValid}
            title="How would you rate your day's work? 💼"
            subtitle="Performa akademik / kerja kamu hari ini?"
        >
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-5xl font-bold text-gray-900">{pct}%</div>
                    <span className="text-sm text-gray-500 font-medium">{label}</span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                    />
                </div>

                <HSlider value={pct} min={0} max={100} step={5} onChange={v => onChange('performance', v)} />

                <div className="flex justify-between text-xs text-gray-400">
                    <span>0% — Difficulty concentrating</span>
                    <span>100% — Feel great!</span>
                </div>
            </div>
        </AssessmentStepShell>
    );
}