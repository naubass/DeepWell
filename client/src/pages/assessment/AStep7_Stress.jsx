import AssessmentStepShell from './AssessmentStepShell';
import { NumberPicker, HSlider } from '../../components/AssessmentPrimitives';

const ANX_EMOJIS = ['😌', '😐', '😟', '😣', '😰', '🤯'];

export default function AStep7_Stress({ data, onChange, onNext, onBack, step, total }) {
    const anxIdx = Math.round(((data.anxiety_level - 1) / 9) * (ANX_EMOJIS.length - 1)) || 0;
    const isValid = data.stress_level !== '' && data.anxiety_level !== '';

    return (
        <AssessmentStepShell
            step={step} total={total} onBack={onBack} onNext={onNext} isNextDisabled={!isValid}
            title="How would you rate your stress level? 🧠"
            subtitle="Jujur ya, tidak ada jawaban yang salah."
        >
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-700">Stress Level</p>
                    <span className="text-sm font-bold text-teal-500">{data.stress_level}/10</span>
                </div>
                <div className="border border-gray-200 rounded-2xl">
                    <NumberPicker value={data.stress_level} min={1} max={10} onChange={v => onChange('stress_level', v)} />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-700">How calm is your mind?</p>
                    <span className="text-2xl">{ANX_EMOJIS[anxIdx]}</span>
                </div>
                <HSlider value={data.anxiety_level} min={1} max={10} step={1} onChange={v => onChange('anxiety_level', v)} />
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Super tenang</span>
                    <span>Sangat cemas</span>
                </div>
            </div>
        </AssessmentStepShell>
    );
}