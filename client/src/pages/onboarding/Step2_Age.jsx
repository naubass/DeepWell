import OnboardingStepShell from './OnboardingStepShell.jsx';

function Step2_Age({ value, onChange, onNext, onBack, currentStep, totalSteps }) {
    const age = parseInt(value) || 18;

    const adjust = (delta) => {
        const next = Math.min(80, Math.max(10, age + delta));
        onChange(next);
    };

    return (
        <OnboardingStepShell
            currentStep={currentStep}
            totalSteps={totalSteps}
            question="What's Your Age?"
            subtitle="Age affects how we analyze your sleep and stress patterns."
            onBack={onBack}
            onNext={onNext}
            isNextDisabled={!value}
        >
            {/* Drum-roller style age picker */}
            <div className="flex flex-col items-center gap-6 py-4">

                {/* Display angka usia */}
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => adjust(-1)}
                        className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200
                                   flex items-center justify-center text-gray-600
                                   text-xl font-bold transition-all active:scale-95"
                    >
                        −
                    </button>

                    <div className="flex flex-col items-center">
                        {/* Angka di atas (samar) */}
                        <span className="text-2xl font-bold text-gray-200 leading-none">
                            {age - 1 < 10 ? '—' : age - 1}
                        </span>

                        {/* Angka utama */}
                        <div className="my-2 px-8 py-3 bg-teal-500 rounded-2xl shadow-lg shadow-teal-500/30">
                            <span className="text-5xl font-extrabold text-white leading-none
                                             tabular-nums">
                                {age}
                            </span>
                        </div>

                        {/* Angka di bawah (samar) */}
                        <span className="text-2xl font-bold text-gray-200 leading-none">
                            {age + 1 > 80 ? '—' : age + 1}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => adjust(1)}
                        className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200
                                   flex items-center justify-center text-gray-600
                                   text-xl font-bold transition-all active:scale-95"
                    >
                        +
                    </button>
                </div>

                {/* Slider sebagai alternatif input */}
                <div className="w-full">
                    <input
                        type="range"
                        min={10} max={80}
                        value={age}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>10</span>
                        <span>80</span>
                    </div>
                </div>

            </div>
        </OnboardingStepShell>
    );
}

export default Step2_Age;
