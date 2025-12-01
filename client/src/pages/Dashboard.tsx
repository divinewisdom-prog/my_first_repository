import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    Calendar,
    Activity,
    Heart,
    AlertCircle,
    BarChart3,
    Sparkles,
    Bell,
    ChevronRight,
    Brain,
    Bed,
    Smile,
    Zap,
    Wind
} from 'lucide-react';
import HealthScoreBadge from '../components/HealthScoreBadge';
import AIInsightCard from '../components/AIInsightCard';
import NotificationDropdown, { Notification } from '../components/NotificationDropdown';
import MetricCard from '../components/MetricCard';

// Smart Navigation Card Component
const NavigationCard = ({ icon: Icon, title, description, badge, onClick, delay }: any) => (
    <div
        onClick={onClick}
        className={`card-premium cursor-pointer group animate-stagger-${delay}`}
    >
        <div className="flex items-start gap-4">
            <div className="p-4 bg-gradient-primary rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
                    {badge && (
                        <span className="px-2 py-0.5 bg-gradient-ai text-white text-xs font-semibold rounded-full">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{description}</p>
                <button className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'appointment',
            title: 'Dr. Sarah Wilson',
            message: 'Annual check-up tomorrow at 10:00 AM',
            time: 'Tomorrow, 10:00 AM',
            read: false,
            link: '/appointments'
        },
        {
            id: '2',
            type: 'medication',
            title: 'Vitamin D',
            message: 'Time to take your daily supplement',
            time: '2 hours ago',
            read: false,
            link: '/wellness'
        },
        {
            id: '3',
            type: 'achievement',
            title: 'Hydration Hero',
            message: 'You hit your water goal 3 days in a row!',
            time: 'Yesterday',
            read: true,
            link: '/wellness'
        },
        {
            id: '4',
            type: 'insight',
            title: 'Sleep Analysis',
            message: 'Your sleep quality has improved by 15% this week.',
            time: '2 days ago',
            read: true,
            link: '/insights'
        }
    ]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);


    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="min-h-screen bg-gradient-health dark:bg-slate-900">
            {/* Header Section */}
            <div className="mb-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Welcome Text */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            {getGreeting()}, {user?.name || 'User'}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">Welcome to Health Central 🏥</p>
                    </div>

                    {/* Right Header - Dark Mode, Health Score & Notifications */}
                    <div className="flex items-center gap-4">

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-all"
                            >
                                <Bell className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </button>

                            {showNotifications && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <NotificationDropdown
                                        notifications={notifications}
                                        onClose={() => setShowNotifications(false)}
                                        onMarkAsRead={(id) => {
                                            setNotifications(prev => prev.map(n =>
                                                n.id === id ? { ...n, read: true } : n
                                            ));
                                        }}
                                        onClearAll={() => setNotifications([])}
                                    />
                                </>
                            )}
                        </div>
                        <HealthScoreBadge score={87} trend="up" />
                    </div>
                </div>

                {/* AI Status Bar */}
                <div className="mt-6 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-2 border-emerald-200 dark:border-emerald-700 rounded-2xl p-4 animate-slide-up">
                    <div className="flex items-center gap-3">
                        <div className="animate-ai-pulse">
                            <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            AI analyzing your health data... 🧠
                        </p>
                        <div className="ml-auto flex gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left/Center */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Smart Navigation Cards */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Quick Access
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <NavigationCard
                                icon={Heart}
                                title="Daily Wellness"
                                description="Track your daily health metrics and wellness goals"
                                badge="New"
                                delay={1}
                                onClick={() => navigate('/wellness')}
                            />
                            <NavigationCard
                                icon={Users}
                                title="Care Finder"
                                description="Find and connect with healthcare providers"
                                badge="AI Recommended"
                                delay={2}
                                onClick={() => navigate('/care-finder')}
                            />
                            <NavigationCard
                                icon={AlertCircle}
                                title="Emergency Ready"
                                description="Quick access to emergency contacts and alerts"
                                delay={3}
                                onClick={() => navigate('/emergency')}
                            />
                            <NavigationCard
                                icon={BarChart3}
                                title="Health Insights"
                                description="View community health trends and statistics"
                                delay={4}
                                onClick={() => navigate('/insights')}
                            />
                        </div>
                    </div>

                    {/* Health Metrics */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Today's Metrics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                title="Sleep Quality"
                                value={7.5}
                                max={10}
                                unit="hrs"
                                icon={Bed}
                                color="blue"
                            />
                            <MetricCard
                                title="Mood Score"
                                value={85}
                                max={100}
                                unit="%"
                                icon={Smile}
                                color="green"
                            />
                            <MetricCard
                                title="Energy Level"
                                value={72}
                                max={100}
                                unit="%"
                                icon={Zap}
                                color="orange"
                            />
                            <MetricCard
                                title="Stress Level"
                                value={32}
                                max={100}
                                unit="%"
                                icon={Wind}
                                color="purple"
                            />
                        </div>
                    </div>

                    {/* Quick Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-sky-50 rounded-xl">
                                    <Users className="w-6 h-6 text-sky-600" />
                                </div>
                                <span className="text-xs text-green-600 font-semibold">+12%</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">1,234</h3>
                            <p className="text-sm text-slate-600 mt-1">Total Patients</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-50 rounded-xl">
                                    <Calendar className="w-6 h-6 text-emerald-600" />
                                </div>
                                <span className="text-xs text-green-600 font-semibold">+8%</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">342</h3>
                            <p className="text-sm text-slate-600 mt-1">Appointments</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <Activity className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-xs text-green-600 font-semibold">+24%</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">98.7%</h3>
                            <p className="text-sm text-slate-600 mt-1">Health Score</p>
                        </div>
                    </div>
                </div>

                {/* AI Insights Panel - Right Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-gradient-ai rounded-xl">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">AI Insights</h2>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            <AIInsightCard
                                message="Your hydration is trending down — try drinking 200ml more water today"
                                icon="💧"
                            />
                            <AIInsightCard
                                message="AI predicts energy peak at 3pm, schedule workouts then for best results"
                                icon="⚡"
                            />
                            <AIInsightCard
                                message="Sleep pattern analysis shows improved deep sleep cycles this week"
                                icon="😴"
                            />
                            <AIInsightCard
                                message="Your stress levels are optimal. Keep up the meditation routine!"
                                icon="🧘"
                            />
                        </div>

                        {/* Motivational Footer */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-sm text-center text-slate-600 font-medium">
                                You're on track! 🌟 Keep it up!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
