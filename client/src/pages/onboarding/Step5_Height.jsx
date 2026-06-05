import OnboardingStepShell from './OnboardingStepShell.jsx';

function Step5_Height({ value, onChange, onNext, onBack, currentStep, totalSteps }) {
    const height = parseInt(value) || 165;

    const adjust = (delta) => {
        const next = Math.min(250, Math.max(50, height + delta));
        onChange(next);
    };

    // Hitung posisi marker pada "ruler" visual (50–250 cm range)
    const markerPercent = ((height - 50) / (250 - 50)) * 100;

    return (
        <OnboardingStepShell
            currentStep={currentStep}
            totalSteps={totalSteps}
            question="What's Your Height?"
            subtitle="Paired with weight to determine your BMI category."
            onBack={onBack}
            onNext={onNext}
            isNextDisabled={!value}
        >
            <div className="flex items-center gap-6 py-4">

                {/* Ruler visual vertikal */}
                <div className="relative w-10 h-56 flex-shrink-0">
                    {/* Track */}
                    <div className="absolute inset-x-0 top-0 bottom-0 mx-auto w-1
                                    bg-gray-100 rounded-full" />
                    {/* Tick marks */}
                    {[0, 25, 50, 75, 100].map((pct) => (
                        <div key={pct}
                             className="absolute left-0 right-0 flex items-center"
                             style={{ top: `${pct}%` }}>
                            <div className="w-3 h-px bg-gray-300 ml-1" />
                        </div>
                    ))}
                    {/* Marker aktif */}
                    <div
                        className="absolute left-0 right-0 flex items-center transition-all duration-200"
                        style={{ top: `${100 - markerPercent}%` }}
                    >
                        <div className="w-full h-0.5 bg-teal-500" />
                        <div className="absolute -right-1 w-3 h-3 bg-teal-500 rounded-full
                                        shadow-md shadow-teal-500/40" />
                    </div>
                </div>

                {/* Konten kanan */}
                <div className="flex-1 flex flex-col gap-5">
                    {/* Display angka besar */}
                    <div className="flex items-end gap-1">
                        <span className="text-6xl font-extrabold text-gray-900 tabular-nums leading-none">
                            {height}
                        </span>
                        <span className="text-xl font-semibold text-teal-500 mb-1">cm</span>
                    </div>

                    {/* Slider */}
                    <input
                        type="range"
                        min={50} max={250} step={1}
                        value={height}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 -mt-3">
                        <span>50 cm</span>
                        <span>250 cm</span>
                    </div>

                    {/* Fine-tune */}
                    <div className="flex gap-2">
                        <button type="button" onClick={() => adjust(-1)}
                            className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200
                                       text-gray-600 text-sm font-semibold transition-all active:scale-95">
                            − 1 cm
                        </button>
                        <button type="button" onClick={() => adjust(1)}
                            className="flex-1 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100
                                       text-teal-600 text-sm font-semibold transition-all active:scale-95">
                            + 1 cm
                        </button>
                    </div>
                </div>

            </div>
        </OnboardingStepShell>
    );
}

export default Step5_Height;
