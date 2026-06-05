// src/pages/checkin/CheckInLayout.jsx
export default function CheckInLayout({ children, error, onErrorClose }) {
    return (
        <>
            {/* Slider thumb global style */}
            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 22px; height: 22px;
                    border-radius: 50%;
                    background: #14b8a6;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(20,184,166,0.35);
                    cursor: pointer;
                }
                input[type=range]::-moz-range-thumb {
                    width: 22px; height: 22px;
                    border-radius: 50%;
                    background: #14b8a6;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(20,184,166,0.35);
                    cursor: pointer;
                }
                input[type=range] { -webkit-appearance: none; appearance: none; }
                input[type=range]:focus { outline: none; }
            `}</style>

            <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-10 w-full max-w-6xl ms-auto">
                {/* Card container */}
                <div
                    className="bg-white flex flex-col overflow-hidden w-full h-[90vh]"
                >

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>

            {/* Error toast */}
            {error && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2
                                bg-red-50 border border-red-200 rounded-2xl
                                px-5 py-3 flex items-center gap-3 shadow-lg z-50
                                max-w-sm w-full mx-4">
                    <span className="text-red-500 text-sm flex-1">{error}</span>
                    <button onClick={onErrorClose}
                        className="text-red-400 hover:text-red-600 flex-shrink-0 text-lg leading-none">×</button>
                </div>
            )}
        </>
    );
}