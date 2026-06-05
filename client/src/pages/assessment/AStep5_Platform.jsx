import AssessmentStepShell from './AssessmentStepShell';
import { NumberPicker } from '../../components/AssessmentPrimitives';

const PLATFORMS = [
    { value: 'TikTok',    label: 'TikTok',    img: './images/icon/tiktok.png' },
    { value: 'Instagram', label: 'Instagram', img: './images/icon/ig.png' },
    { value: 'Both',      label: 'Keduanya',  img: './images/icon/both.png' },
];

export default function AStep5_Platform({ data, onChange, onNext, onBack, step, total }) {
    const isValid = data.platform_usage !== '' && data.addiction_level !== '';

    return (
        <AssessmentStepShell
            step={step} total={total} onBack={onBack} onNext={onNext} isNextDisabled={!isValid}
            title="Which app do you scroll most? 📲"
            subtitle="Platform favorit dan seberapa attached kamu?"
        >
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <p className="text-sm font-semibold text-gray-700">Platform Utama</p>
                <div className="grid grid-cols-3 gap-3">
                    {PLATFORMS.map(p => (
                        <button
                            key={p.value}
                            onClick={() => onChange('platform_usage', p.value)}
                            className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border text-sm font-medium transition-all
                                        ${data.platform_usage === p.value
                                            ? 'bg-teal-50 border-teal-400 text-teal-700'
                                            : 'bg-gray-50 border-transparent text-gray-600 hover:border-gray-200'
                                        }`}
                        >
                            <img src={p.img} className="w-20 h-20" alt="" />
                            <span className="text-xs">{p.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">Feeling glued to the screen?</p>
                    <span className="text-sm font-bold text-teal-500">{data.addiction_level}/10</span>
                </div>
                    <div className="border p-3 rounded-2xl border-gray-200 shadow-sm">
                        <NumberPicker value={data.addiction_level} min={1} max={5} onChange={v => onChange('addiction_level', v)} />
                    </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>1 = Tidak sama sekali</span>
                    <span>5 = Susah lepas</span>
                </div>
            </div>
        </AssessmentStepShell>
    );
}