import { useState } from 'react';
import AssessmentStepShell from './AssessmentStepShell';

export default function AStep9_Expression({ data, onChange, onNext, onBack, step, total, isLoading }) {
    const maxChars = 350;
    const [count, setCount] = useState((data.expression || '').length);
    const isValid = (data.expression || '').trim().length > 0;

    return (
        <AssessmentStepShell
            step={step} total={total} onBack={onBack} onNext={onNext} 
            isNextDisabled={!isValid} isLoading={isLoading} nextLabel="Submit Check-in"
            title="Expression Analysis ✍️"
            subtitle={
                <>
                    Tulis apa yang ada di pikiranmu. Bisa apa saja perasaan, keluhan, atau rasa syukur.
                    <span className="text-teal-500"> Ini hanya untukmu.</span>
                </>
            }
        >
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
                <textarea
                    value={data.expression || ''}
                    onChange={e => {
                        const v = e.target.value.slice(0, maxChars);
                        onChange('expression', v);
                        setCount(v.length);
                    }}
                    placeholder="Tulis apa saja yang ada di pikiranmu hari ini..."
                    rows={6}
                    className="w-full text-lg ms:text-sm text-gray-700 placeholder-gray-300 resize-none outline-none leading-relaxed"
                />
                <div className="flex justify-end">
                    <span className="text-xs text-gray-300">{count}/{maxChars}</span>
                </div>
            </div>

            <div className="bg-teal-50 rounded-2xl p-3 border border-teal-100">
                <p className="text-xs text-teal-600 leading-relaxed">
                    💡 Teks ini tidak dikirim ke AI untuk prediksi, hanya sebagai catatan refleksi dirimu.
                </p>
            </div>
        </AssessmentStepShell>
    );
}