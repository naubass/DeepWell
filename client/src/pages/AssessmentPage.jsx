// src/pages/checkin/CheckInPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckInLayout from './assessment/CheckInLayout';
import assessmentService from '../services/assessmentService';

import AStep1_Ready from './assessment/AStep1_Ready';
import AStep2_Sleep from './assessment/AStep2_Sleep';
import AStep3_Health from './assessment/AStep3_Physical';
import AStep4_Digital from './assessment/AStep4_Digital';
import AStep5_Platform from './assessment/AStep5_Platform';
import AStep6_Social from './assessment/AStep6_Social';
import AStep7_Stress from './assessment/AStep7_Stress';
import AStep8_Performance from './assessment/AStep8_Performance';
import AStep9_Expression from './assessment/AStep9_Expression';
// Import step 3 hingga 9 sesuai nama file kamu...

const TOTAL_STEPS = 9;

const initialData = {
    sleep_hours: 7,
    sleep_quality: 7,
    sleep_disorder_level: '',
    physical_activity: 30,
    daily_social_media_hours: 2,
    screen_time_before_sleep: 1,
    platform_usage: '',
    addiction_level: '',
    social_interaction_level: '',
    stress_level: '',
    anxiety_level: 5,
    performance: 70,
    expression: '',
};

export default function CheckInPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const update = (field, value) => setData(p => ({ ...p, [field]: value }));
    const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
    const back = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const payloadToSubmit = {
                ...data,
                performance: data.performance / 10,
                
                physical_activity: data.physical_activity / 60,
            };

            // TODO: call assessmentService.submitCheckIn({ ...data })
            await assessmentService.submitCheckIn(payloadToSubmit);
            await new Promise(r => setTimeout(r, 1500)); 
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message ?? 'Gagal submit. Coba lagi.');
            setIsLoading(false);
        }
    };

    const commonProps = { data, onChange: update, onBack: back, step, total: TOTAL_STEPS };

    const renderStep = () => {
        switch (step) {
            case 1: return <AStep1_Ready onNext={next} />;
            case 2: return <AStep2_Sleep {...commonProps} onNext={next} />;
            case 3: return <AStep3_Health {...commonProps} onNext={next} />;
            case 4: return <AStep4_Digital {...commonProps} onNext={next} />;
            case 5: return <AStep5_Platform {...commonProps} onNext={next} />;
            case 6: return <AStep6_Social {...commonProps} onNext={next} />;
            case 7: return <AStep7_Stress {...commonProps} onNext={next} />;
            case 8: return <AStep8_Performance {...commonProps} onNext={next} />;
            case 9: return <AStep9_Expression {...commonProps} onNext={handleSubmit} isLoading={isLoading} />;
            default: return null;
        }
    };

    return (
        <CheckInLayout error={error} onErrorClose={() => setError(null)}>
            {renderStep()}
        </CheckInLayout>
    );
}