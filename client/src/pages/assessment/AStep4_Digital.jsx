import AssessmentStepShell from './AssessmentStepShell';
import { HSlider } from '../../components/AssessmentPrimitives';

export default function AStep4_Digital({ data, onChange, onNext, onBack, step, total }) {
    const isValid = data.daily_social_media_hours >= 0 && data.screen_time_before_sleep >= 0;

    return (
        <AssessmentStepShell
            step={step} total={total} onBack={onBack} onNext={onNext} isNextDisabled={!isValid}
            title="Let's check your digital habits 📱"
            subtitle="Berapa jam kamu scrolling hari ini?"
        >
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-5">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-base">📲</span>
                            <p className="text-sm font-semibold text-gray-700">Social Media</p>
                        </div>
                        <span className="text-sm font-bold text-teal-500">
                            {data.daily_social_media_hours} <span className="text-xs font-normal text-gray-400">jam</span>
                        </span>
                    </div>
                    <HSlider value={data.daily_social_media_hours} min={0} max={12} step={0.5} onChange={v => onChange('daily_social_media_hours', v)} />
                </div>

                <div className="border-t border-gray-50 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-base">🌙</span>
                            <p className="text-sm font-semibold text-gray-700">Sebelum Tidur</p>
                        </div>
                        <span className="text-sm font-bold text-teal-500">
                            {data.screen_time_before_sleep} <span className="text-xs font-normal text-gray-400">jam</span>
                        </span>
                    </div>
                    <HSlider value={data.screen_time_before_sleep} min={0} max={6} step={0.5} onChange={v => onChange('screen_time_before_sleep', v)} />
                </div>
            </div>
        </AssessmentStepShell>
    );
}