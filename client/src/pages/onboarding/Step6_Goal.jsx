import OnboardingStepShell from './OnboardingStepShell.jsx';

const GOALS = [
    { value: 'reduce_stress',     label: 'Manage Stress',     icon: '🧘', desc: 'Kurangi stres harian' },
    { value: 'improve_sleep',     label: 'Better Sleep',      icon: '😴', desc: 'Perbaiki kualitas tidur' },
    { value: 'improve_mood',      label: 'Better Mood',       icon: '😊', desc: 'Tingkatkan suasana hati' },
    { value: 'general_wellbeing', label: 'More Active',       icon: '⚡', desc: 'Hidup lebih aktif & sehat' },
    { value: 'prevent_burnout',   label: 'Prevent Burnout',   icon: '🛡️', desc: 'Cegah kelelahan ekstrem' },
    { value: 'mental_clarity',    label: 'Mental Clarity',    icon: '🎯', desc: 'Fokus dan kejernihan pikiran' },
];

function Step6_Goal({ value, onChange, onNext, onBack, isLoading, currentStep, totalSteps }) {
    return (
        <OnboardingStepShell
            currentStep={currentStep}
            totalSteps={totalSteps}
            question="What's your health goal for long term?"
            subtitle="We'll personalize your experience based on this."
            onBack={onBack}
            onNext={onNext}
            nextLabel="Let's Start →"
            isNextDisabled={!value}
            isLoading={isLoading}
        >
            <div className="grid grid-cols-2 gap-3">
                {GOALS.map((goal) => {
                    const isSelected = value === goal.value;
                    return (
                        <button
                            key={goal.value}
                            type="button"
                            onClick={() => onChange(goal.value)}
                            className={`flex flex-col items-start gap-2 p-4 rounded-2xl
                                        border-2 text-left transition-all duration-150
                                        active:scale-[0.97] cursor-pointer
                                        ${isSelected
                                            ? 'bg-teal-500 border-teal-500 shadow-lg shadow-teal-500/25'
                                            : 'bg-white border-gray-100 hover:border-teal-200 hover:shadow-sm'
                                        }`}
                        >
                            <span className="text-2xl">{goal.icon}</span>
                            <div>
                                <p className={`font-semibold text-sm leading-tight
                                    ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                    {goal.label}
                                </p>
                                <p className={`text-xs mt-0.5 leading-tight
                                    ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                                    {goal.desc}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </OnboardingStepShell>
    );
}

export default Step6_Goal;
