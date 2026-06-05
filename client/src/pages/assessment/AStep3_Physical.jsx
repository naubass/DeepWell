import AssessmentStepShell from './AssessmentStepShell';
import { VerticalSlider } from '../../components/AssessmentPrimitives';

export default function AStep3_Physical({ data, onChange, onNext, onBack, step, total }) {
    const isValid = data.physical_activity !== '';

    return (
        <AssessmentStepShell
            step={step} total={total} onBack={onBack} onNext={onNext} isNextDisabled={!isValid}
            title="Did you get moving today? 🏃"
            subtitle="Olahraga, jalan santai, atau sekadar peregangan?"
        >
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <VerticalSlider
                    value={data.physical_activity}
                    min={0} max={180}
                    onChange={v => onChange('physical_activity', v)}
                />
                <div className="mt-4 text-center">
                    <span className="text-3xl font-bold text-teal-500">{data.physical_activity}</span>
                    <span className="text-lg text-gray-400 ml-1">menit</span>
                </div>
            </div>
        </AssessmentStepShell>
    );
}