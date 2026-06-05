import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { FiHome, FiActivity, FiUser, FiLogOut } from 'react-icons/fi';
import useAuthStore from '../stores/useAuthStore'; 

const NAV_ITEMS = [
    { to: '/dashboard', icon: FiHome,      label: 'Home'    },
    { to: '/records',   icon: FiActivity,  label: 'Journey' },
    { to: '/profile',   icon: FiUser,      label: 'Profile' },
];

function SideNavItem({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                 transition-all duration-200 group
                 ${isActive
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                 }`
            }
        >
            <Icon size={18} />
            <span>{label}</span>
        </NavLink>
    );
}

function BottomNavItem({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center gap-1 flex-1 py-2 transition-all duration-200
                 ${isActive ? 'text-teal-500' : 'text-gray-400'}`
            }
        >
            {({ isActive }) => (
                <>
                    <div className={`p-1.5 rounded-xl transition-all duration-200
                        ${isActive ? 'bg-teal-50' : ''}`}>
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                    </div>
                    <span className="text-[10px] font-medium">{label}</span>
                </>
            )}
        </NavLink>
    );
}

function AppLayout({ children }) {
    const navigate  = useNavigate();
    const { logout, user, profile } = useAuthStore();

    const userName = user?.name || 'User';
    const userInitial = userName.charAt(0).toUpperCase();
    const profileImg = profile?.profile_image;
   
    const calculateBMICategory = (weightKg, heightCm) => {
        if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
            return "Normal";
        }
        const heightM = heightCm / 100.0;
        const bmi = weightKg / (heightM * heightM);

        if (bmi < 18.5) return "Underweight";
        if (bmi >= 18.5 && bmi < 25.0) return "Normal";
        if (bmi >= 25.0 && bmi < 30.0) return "Overweight";
        return "Obese";
    };

    const bmiCategory = calculateBMICategory(profile?.weight, profile?.height);

    const getBmiVariant = (category) => {
        switch(category) {
            case 'Underweight': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Normal':      return 'bg-green-50 text-green-600 border-green-100';
            case 'Overweight':  return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Obese':       return 'bg-red-50 text-red-600 border-red-100';
            default:            return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Sidebar desktop */}
            <aside className="hidden lg:flex flex-col w-80 min-h-screen
                              bg-white border-r border-teal-100 z-20 px-4 py-8 top-0 left-0 fixed">
                
                <div className="px-4 mb-10 flex items-center gap-3">
                    {profileImg ? (
                        <img 
                            src={profileImg} 
                            alt={userName} 
                            className="w-10 h-10 rounded-2xl object-cover flex-shrink-0 shadow-md shadow-teal-500/20"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br
                                        from-teal-400 to-teal-600
                                        flex items-center justify-center
                                        text-white font-bold text-base flex-shrink-0
                                        shadow-md shadow-teal-500/20">
                            {userInitial}
                        </div>
                    )}
                    
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                            {userName}
                        </p>
                        <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBmiVariant(bmiCategory)}`}>
                            <span className='text-black mr-1'>BMI:</span> {bmiCategory}
                        </div>
                    </div>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                    {NAV_ITEMS.map((item) => (
                        <SideNavItem key={item.to} {...item} />
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl
                               text-sm font-medium text-gray-400 mt-auto
                               hover:bg-red-50 hover:text-red-500 transition-all"
                >
                    <FiLogOut size={18} />
                    <span>Keluar</span>
                </button>
            </aside>

            {/* Content */}
            <main className="flex-1 min-h-screen lg:ml-80 pb-20 lg:pb-0 flex justify-center">
                <div className="w-full max-w-6xl p-4 lg:p-8">
                    { children || <Outlet /> }
                </div>
            </main> 
            
            {/* Bottom nav mobile */}
            <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20
                            bg-white/90 backdrop-blur-md
                            border-t border-gray-100
                            flex items-center px-2 pb-safe">
                {NAV_ITEMS.map((item) => (
                    <BottomNavItem key={item.to} {...item} />
                ))}
            </nav>

        </div>
    );
}

export default AppLayout;