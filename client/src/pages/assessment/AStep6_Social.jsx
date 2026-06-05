import AssessmentStepShell from './AssessmentStepShell';

const SOCIAL_OPTS = [
    { value: 'low',    label: 'Low',    desc: 'Butuh me-time, overwhelmed',          img: './images/lowbat.png' },
    { value: 'medium', label: 'Medium', desc: 'Oke, bisa interaksi tapi agak capek', img: './images/medbat.png' },
    { value: 'high',   label: 'High',   desc: 'Energik, enjoy bersosialisasi',       img: './images/highbat.png' },
];

export default function AStep6_Social({ data, onChange, onNext, onBack, step, total }) {
    const isValid = !!data.social_interaction_level;

    return (
        <AssessmentStepShell
            step={step} total={total} onBack={onBack} onNext={onNext} isNextDisabled={!isValid}
            title="How was your social battery? 🔋"
            subtitle="Seberapa antusias kamu berinteraksi hari ini?"
        >
            <div className="flex flex-col gap-3">
                {SOCIAL_OPTS.map(o => (
                    <button
                        key={o.value}
                        onClick={() => onChange('social_interaction_level', o.value)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200
                                    ${data.social_interaction_level === o.value
                                        ? 'bg-teal-50 border-teal-400 shadow-sm'
                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                    }`}
                    >
                        <div className={`w-20 h-25 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                                        ${data.social_interaction_level === o.value ? 'bg-teal-100' : 'bg-gray-50'}`}>
                            <img src={o.img} className='w-full h-full' alt="" />
                        </div>
                        <div className="flex-1">
                            <p className={`font-semibold text-lg ${data.social_interaction_level === o.value ? 'text-teal-700' : 'text-gray-800'}`}>
                                {o.label}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">{o.desc}</p>
                        </div>
                        {data.social_interaction_level === o.value && (
                            <div className="ml-auto w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </AssessmentStepShell>
    );
}