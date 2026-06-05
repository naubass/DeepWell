import { FiHome, FiActivity, FiUser, FiLock, FiHelpCircle } from 'react-icons/fi';

function LockedNavItem({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl
                        text-gray-300 cursor-not-allowed select-none">
            <div className="relative">
                <Icon size={18} />
                <FiLock size={8} className="absolute -top-1 -right-1 text-gray-400" />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}

function OnboardingLayout({ children, currentStep, totalSteps, userName, userInitial }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
           <aside className="hidden lg:flex flex-col w-80 min-h-screen
                              bg-white border-r border-teal-100 z-20 px-4 py-8 fixed top-0 left-0">

                {/* Avatar + nama user */}
                <div className="px-4 mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br
                                    from-teal-400 to-teal-600
                                    flex items-center justify-center
                                    text-white font-bold text-base flex-shrink-0
                                    shadow-md shadow-teal-500/20">
                        {userInitial ?? '?'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                            {userName ?? 'User'}
                        </p>
                        <p className="text-xs text-gray-400">Setting up profile...</p>
                    </div>
                </div>

                {/* Progress bar setup */}
                <div className="px-4 mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Setup Profile
                        </span>
                        <span className="text-xs font-bold text-teal-500">
                            {currentStep}/{totalSteps}
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Menu dikunci */}
                <nav className="flex flex-col gap-1">
                    <p className="px-4 text-xs text-gray-300 mb-2">
                        Tersedia setelah setup selesai
                    </p>
                    <LockedNavItem icon={FiHome}     label="Dashboard" />
                    <LockedNavItem icon={FiActivity} label="Journey"   />
                    <LockedNavItem icon={FiUser}     label="Profile"   />
                    {/* <LockedNavItem icon={FiHelpCircle} label="FAQ" /> */}
                </nav>

                {/* Info */}
                <div className="mt-auto px-4">
                    <div className="bg-teal-50 rounded-2xl p-3 border border-teal-100">
                        <p className="text-xs text-teal-600 leading-relaxed">
                            🔒 Lengkapi profil untuk mulai tracking well-being kamu.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Konten utama */}
            <main className="flex-1 flex items-center justify-center
                             min-h-screen lg:ml-80 p-8">
                <div className="w-full max-w-5xl mx-auto">
                    {children}
                </div>
            </main> 
        </div>
    );
}

export default OnboardingLayout;