import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FileText, Activity, Settings, LogOut, Heart, AlertCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();

    // Role-based navigation
    const getNavItems = () => {
        const userRole = user?.role?.toLowerCase();

        // Common items for all users
        const commonItems = [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        ];

        // Patient-specific navigation
        if (userRole === 'patient') {
            return [
                ...commonItems,
                { icon: Heart, label: 'Wellness', path: '/wellness' },
                { icon: Users, label: 'Care Finder', path: '/care-finder' },
                { icon: MessageCircle, label: 'Messages', path: '/messages' },
                { icon: AlertCircle, label: 'Emergency', path: '/emergency' },
                { icon: Activity, label: 'Insights', path: '/insights' },
                { icon: Calendar, label: 'My Appointments', path: '/appointments' },
                { icon: FileText, label: 'My Records', path: '/records' },
            ];
        }

        // Doctor/Admin navigation
        if (userRole === 'doctor' || userRole === 'admin') {
            return [
                ...commonItems,
                { icon: Users, label: 'Patients', path: '/patients' },
                { icon: Calendar, label: 'Appointments', path: '/appointments' },
                { icon: MessageCircle, label: 'Messages', path: '/messages' },
                { icon: FileText, label: 'Records', path: '/records' },
                { icon: Activity, label: 'Insights', path: '/insights' },
                { icon: Heart, label: 'Wellness', path: '/wellness' },
                { icon: AlertCircle, label: 'Emergency', path: '/emergency' },
            ];
        }

        // Default navigation (fallback)
        return [
            ...commonItems,
            { icon: Heart, label: 'Wellness', path: '/wellness' },
            { icon: Users, label: 'Care Finder', path: '/care-finder' },
            { icon: AlertCircle, label: 'Emergency', path: '/emergency' },
            { icon: Activity, label: 'Insights', path: '/insights' },
            { icon: Calendar, label: 'Appointments', path: '/appointments' },
            { icon: FileText, label: 'Records', path: '/records' },
        ];
    };

    const navItems = getNavItems();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed left-0 top-0 z-30 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-700 flex items-center">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Activity className="w-8 h-8" />
                        Well-Link
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                    <NavLink
                        to="/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-primary text-white'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`
                        }
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </NavLink>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
