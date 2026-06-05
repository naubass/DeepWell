import { StepHeader, NextBtn } from '../../components/AssessmentPrimitives';

export default function AssessmentStepShell({
    step, total, onBack, onNext, isNextDisabled = false, isLoading = false, nextLabel = 'Continue',
    title, subtitle, children
}) {
    return (
        <div className="grid grid-rows-[auto_1fr_auto] h-full w-full">
            {/* Header Statis */}
            <div>
                <StepHeader step={step} total={total} onBack={onBack} />
            </div>

            {/* Konten Scrollable */}
            <div className="overflow-y-auto px-5 py-4 space-y-6">
                {(title || subtitle) && (
                    <div>
                        {title && <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>}
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                )}
                {children}
            </div>

            {/* Tombol Statis di Bawah */}
            <div className="px-5 pb-6 pt-3 bg-white">
                <NextBtn 
                    onClick={onNext} 
                    disabled={isNextDisabled} 
                    loading={isLoading} 
                    label={nextLabel} 
                />
            </div>
        </div>
    );
}