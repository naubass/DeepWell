import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { todayLabel, nowTime } from '../../components/AssessmentPrimitives';

export default function AStep1_Ready({ onNext }) {
    const [time] = useState(nowTime());
    const [date] = useState(todayLabel());

    return (
        <div className="flex flex-col items-center justify-between h-full px-5 py-6 sm:px-8 sm:py-8">
            
            {/* Bagian Atas: Tanggal, Waktu & Judul */}
            <div className="w-full space-y-5">
                <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-400 font-medium">{date}</span>
                    <span className="text-xs sm:text-sm font-bold text-teal-500">{time}</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl text-left font-bold text-gray-900 leading-tight">
                    Ready for <span className="text-teal-600">Today?</span>
                </h1>
            </div>

            {/* Bagian Tengah: Gambar & Deskripsi */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full my-8">
                <img 
                    src="./images/ready.png" 
                    alt="Ready Illustration" 
                    className="w-3/4 sm:w-1/2 max-w-[220px] sm:max-w-[260px] object-contain drop-shadow-sm" 
                />
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed text-center max-w-sm px-2">
                    Tracking mood dan tidurmu adalah langkah pertama untuk tetap tajam dan menghindari burnout.
                </p>
            </div>

            {/* Bagian Bawah: Tombol */}
            <div className="w-full mt-auto">
                <button
                    onClick={onNext}
                    className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-600 active:scale-[0.98]
                               text-white font-semibold text-sm sm:text-base shadow-lg shadow-teal-500/25
                               flex items-center justify-center gap-2 transition-all duration-200"
                >
                    Let's Start <FiArrowRight size={18} />
                </button>
            </div>

        </div>
    );
}