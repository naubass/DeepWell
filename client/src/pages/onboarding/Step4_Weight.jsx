import OnboardingStepShell from './OnboardingStepShell.jsx';

function Step4_Weight({ value, onChange, onNext, onBack, currentStep, totalSteps }) {
    const weight = parseFloat(value) || 60;

    const adjust = (delta) => {
        const next = Math.min(200, Math.max(20, parseFloat((weight + delta).toFixed(1))));
        onChange(next);
    };

    return (
        <OnboardingStepShell
            currentStep={currentStep}
            totalSteps={totalSteps}
            question="What's Your Weight?"
            subtitle="Used to calculate your BMI category for AI analysis."
            onBack={onBack}
            onNext={onNext}
            isNextDisabled={!value}
        >
            <div className="flex flex-col items-center gap-6 py-4">

                {/* Display besar */}
                <div className="flex items-end gap-1">
                    <span className="text-7xl font-extrabold text-gray-900 tabular-nums leading-none">
                        {Math.floor(weight)}
                    </span>
                    <div className="mb-2">
                        <span className="text-2xl font-semibold text-gray-400">.{
                            String(weight.toFixed(1)).split('.')[1]
                        }</span>
                        <p className="text-sm font-semibold text-teal-500 text-right">kg</p>
                    </div>
                </div>

                {/* Slider horizontal */}
                <div className="w-full">
                    <input
                        type="range"
                        min={20} max={200} step={0.5}
                        value={weight}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                        <span>20 kg</span>
                        <span>200 kg</span>
                    </div>
                </div>

                {/* Fine-tune buttons */}
                <div className="flex items-center gap-3">
                    {[-1, -0.5].map((d) => (
                        <button key={d} type="button" onClick={() => adjust(d)}
                            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200
                                       text-gray-600 text-sm font-semibold transition-all active:scale-95">
                            {d} kg
                        </button>
                    ))}
                    {[0.5, 1].map((d) => (
                        <button key={d} type="button" onClick={() => adjust(d)}
                            className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100
                                       text-teal-600 text-sm font-semibold transition-all active:scale-95">
                            +{d} kg
                        </button>
                    ))}
                </div>

            </div>
        </OnboardingStepShell>
    );
}

export default Step4_Weight;
