import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Moon,
    Sun,
    Bell,
    Shield,
    Key,
    Mail,
    Smartphone,
    LogOut,
    ChevronRight
} from 'lucide-react';

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false
    });

    useEffect(() => {
        // Check local storage or system preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    };

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and application settings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile & Account */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <div className="card-premium">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{user?.email}</p>
                            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                                {user?.role || 'Patient'}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card space-y-2">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Sign Out</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                </div>

                {/* Right Column - Settings Sections */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Appearance */}
                    <div className="card">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                            Appearance
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-white text-yellow-500 shadow-sm'}`}>
                                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Theme Mode</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="card">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            Notifications
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates via email</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={notifications.email} onChange={() => toggleNotification('email')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts on your device</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={notifications.push} onChange={() => toggleNotification('push')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="card">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Security
                        </h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-slate-900 dark:text-white">Change Password</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
