import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService.js';
import useAuthStore from '../stores/useAuthStore.js';

import authService from '../services/authService.js';
import OnboardingLayout      from './onboarding/OnboardingLayout.jsx';
import Step1_Gender          from './onboarding/Step1_Gender.jsx';
import Step2_Age             from './onboarding/Step2_Age.jsx';
import Step3_Occupation      from './onboarding/Step3_Occupation.jsx';
import Step4_Weight          from './onboarding/Step4_Weight.jsx';
import Step5_Height          from './onboarding/Step5_Height.jsx';
import Step6_Goal            from './onboarding/Step6_Goal.jsx';

const TOTAL_STEPS = 6;

const initialForm = {
    gender:     '',
    age:        '',
    occupation: '',
    weight:     '',
    height:     '',
    goal:       '',
};

function OnboardingPage() {
    const navigate     = useNavigate();
    const setOnboarded = useAuthStore((state) => state.setOnboarded);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Ambil nama user untuk ditampilkan di sidebar onboarding
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.id) {
                    authService.getUserById(payload.id)
                        .then((res) => setUserName(res.data?.name ?? ''))
                        .catch(() => {});
                }
            } catch (_) {}
        }
    }, []);

    const [step, setStep]       = useState(1);
    const [form, setForm]       = useState(initialForm);
    const [isLoading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    const back = () => setStep((s) => Math.max(s - 1, 1));

    // Submit di step terakhir
    const handleFinish = async () => {
        setLoading(true);
        setError(null);
        try {
            await profileService.createProfile({
                gender:             form.gender,
                age:                parseInt(form.age),
                occupation:         form.occupation,
                weight:             parseFloat(form.weight),
                height:             parseFloat(form.height),
                goal:               form.goal,
                activity_level:     'moderate', 
                profile_image:      form.gender === 'male' ? './images/gender/male.png' : './images/gender/female.png' 
            });
            setOnboarded();
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message ?? 'Gagal menyimpan profil. Coba lagi.');
            setLoading(false);
        }
    };

    // Props umum yang dikirim ke semua step
    const commonProps = { currentStep: step, totalSteps: TOTAL_STEPS };

    const renderStep = () => {
        switch (step) {
            case 1: return (
                <Step1_Gender
                    {...commonProps}
                    value={form.gender}
                    onChange={(v) => updateField('gender', v)}
                    onBack={null}
                    onNext={next}
                />
            );
            case 2: return (
                <Step2_Age
                    {...commonProps}
                    value={form.age}
                    onChange={(v) => updateField('age', v)}
                    onBack={back}
                    onNext={next}
                />
            );
            case 3: return (
                <Step3_Occupation
                    {...commonProps}
                    value={form.occupation}
                    onChange={(v) => updateField('occupation', v)}
                    onBack={back}
                    onNext={next}
                />
            );
            case 4: return (
                <Step4_Weight
                    {...commonProps}
                    value={form.weight}
                    onChange={(v) => updateField('weight', v)}
                    onBack={back}
                    onNext={next}
                />
            );
            case 5: return (
                <Step5_Height
                    {...commonProps}
                    value={form.height}
                    onChange={(v) => updateField('height', v)}
                    onBack={back}
                    onNext={next}
                />
            );
            case 6: return (
                <Step6_Goal
                    {...commonProps}
                    value={form.goal}
                    onChange={(v) => updateField('goal', v)}
                    onBack={back}
                    onNext={handleFinish}
                    isLoading={isLoading}
                />
            );
            default: return null;
        }
    };

    return (
        <OnboardingLayout
            currentStep={step}
            totalSteps={TOTAL_STEPS}
            userName={userName}
            userInitial={userName?.[0]?.toUpperCase() ?? '?'}
        >
            {renderStep()}

            {/* Error toast */}
            {error && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2
                                bg-red-50 border border-red-200 rounded-2xl
                                px-5 py-3 flex items-center gap-3 shadow-lg z-50
                                max-w-sm w-full mx-4">
                    <span className="text-red-500 text-sm flex-1">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-400 hover:text-red-600 flex-shrink-0 text-lg leading-none"
                    >
                        ×
                    </button>
                </div>
            )}
        </OnboardingLayout>
    );
}

export default OnboardingPage;
