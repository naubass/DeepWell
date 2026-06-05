import OnboardingStepShell from './OnboardingStepShell.jsx';

const OCCUPATIONS = [
    'Accountant', 'Artist', 'Chef', 'Doctor', 'Engineer',
    'Lawyer', 'Manager', 'Nurse', 'Sales Representative',
    'Salesperson', 'Scientist', 'Software Engineer',
    'Student', 'Teacher', 'Writer',
];

function Step3_Occupation({ value, onChange, onNext, onBack, currentStep, totalSteps }) {
    return (
        <OnboardingStepShell
            currentStep={currentStep}
            totalSteps={totalSteps}
            question="What's Your Job?"
            subtitle="Your occupation affects stress analysis. Pick the closest match."
            onBack={onBack}
            onNext={onNext}
            isNextDisabled={!value}
        >
            {/* Grid chip-style — sesuai desain Figma */}
            <div className="flex flex-wrap gap-2">
                {OCCUPATIONS.map((occ) => {
                    const isSelected = value === occ;
                    return (
                        <button
                            key={occ}
                            type="button"
                            onClick={() => onChange(occ)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium
                                        border transition-all duration-150 active:scale-95
                                        ${isSelected
                                            ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-500/20'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600'
                                        }`}
                        >
                            {occ}
                        </button>
                    );
                })}
            </div>
        </OnboardingStepShell>
    );
}

export default Step3_Occupation;
