import OnboardingStepShell from './OnboardingStepShell.jsx';

const OPTIONS = [
    {
        value: 'male',
        label: "I'm Male",
        symbol: '♂',
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        selectedBg: 'bg-teal-500',
        selectedBorder: 'border-teal-500',
        img: './images/gender/male.png',
    },
    {
        value: 'female',
        label: "I'm Female",
        symbol: '♀',
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        selectedBg: 'bg-pink-500',
        selectedBorder: 'border-pink-500',
        img: './images/gender/female.png',
    },
];

function Step1_Gender({ value, onChange, onNext, currentStep, totalSteps }) {
    return (
        <OnboardingStepShell
            currentStep={currentStep}
            totalSteps={totalSteps}
            question="What's your official gender?"
            subtitle="This helps our AI give you more accurate analysis."
            onBack={null}
            onNext={onNext}
            isNextDisabled={!value}
        >
            <div className="grid grid-cols-2 gap-4">
                {OPTIONS.map((opt) => {
                    const isSelected = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={`relative flex flex-col lg:h-100 items-start justify-between
                                        p-5 rounded-2xl border-2 transition-all duration-200
                                        aspect-square cursor-pointer text-left
                                        active:scale-[0.97]
                                        ${isSelected
                                            ? `${opt.selectedBg} ${opt.selectedBorder} shadow-lg`
                                            : `${opt.bg} ${opt.border} hover:shadow-md`
                                        }`}
                        >
                            {/* Emoji besar di tengah */}
                            <img src={opt.img} alt={opt.label} className="w-full h-full object-contain rounded"/>

                            {/* Label + simbol di bawah */}
                            <div className="w-full flex items-center justify-between">
                                <p className={`font-semibold text-sm
                                    ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                    {opt.label}
                                </p>
                                <span className={`text-xl ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                    {opt.symbol}
                                </span>
                            </div>

                            {/* Checkmark jika selected */}
                            {isSelected && (
                                <div className="absolute top-3 right-3
                                                w-5 h-5 bg-white/30 rounded-full
                                                flex items-center justify-center">
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </OnboardingStepShell>
    );
}

export default Step1_Gender;
