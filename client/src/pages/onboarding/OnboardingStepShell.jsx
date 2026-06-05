import { FiArrowLeft } from 'react-icons/fi';

// ── Shell untuk setiap step ───────────────────────────────────
// Berisi: header (back + progress), pertanyaan, konten, tombol lanjut
function OnboardingStepShell({
    currentStep,
    totalSteps,
    question,
    subtitle,
    onBack,
    onNext,
    nextLabel = 'Continue',
    isNextDisabled = false,
    isLoading = false,
    children,
}) {
    return (
        <div className="grid grid-rows-[auto_auto_1fr_auto] h-[calc(100vh-4rem)] w-full max-h-screen">

            {/* 1. Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    disabled={!onBack}
                    className={`flex items-center justify-center w-9 h-9 rounded-xl
                                border border-gray-200 transition-all
                                ${onBack
                                    ? 'hover:bg-gray-50 text-gray-600 cursor-pointer'
                                    : 'opacity-0 pointer-events-none'
                                }`}
                >
                    <FiArrowLeft size={16} />
                </button>

                {/* Step dot */}
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${
                                i < currentStep - 1
                                    ? 'w-2 h-2 bg-teal-500'           // selesai
                                    : i === currentStep - 1
                                    ? 'w-5 h-2 bg-teal-500'           // aktif
                                    : 'w-2 h-2 bg-gray-200'           // belum
                            }`}
                        />
                    ))}
                </div>

                {/* Label step kanan */}
                <span className="text-xs font-medium text-gray-400">
                    {currentStep} of {totalSteps}
                </span>
            </div>

            {/* 2. Pertanyaan */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    {question}
                </h2>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* 3. Konten */}
            <div className="overflow-y-auto min-h-0 mb-6 pr-2">
                {children}
            </div>

            {/* 4. next */}
            <div className="pb-4">
                <button
                    onClick={onNext}
                    disabled={isNextDisabled || isLoading}
                    className={`w-full py-4 rounded-2xl font-semibold text-sm
                                transition-all duration-200 flex items-center justify-center gap-2
                                ${isNextDisabled || isLoading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25 active:scale-[0.98]'
                                }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            {nextLabel}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}

export default OnboardingStepShell;
