import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import AIInsightCardEnhanced from '../components/AIInsightCardEnhanced';
import { generateInsights, WellnessInsight, Mood } from '../utils/aiInsights';
import { wellnessService, notificationService } from '../services/api';
import NotificationDropdown, { Notification } from '../components/NotificationDropdown';
import MetricCard from '../components/MetricCard';
import EmergencySOSButton from '../components/EmergencySOSButton';

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
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // AI Insights State
    const [insights, setInsights] = useState<WellnessInsight[]>([]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

        // Fetch real notifications and wellness data
        const fetchData = async () => {
            try {
                const notifs = await notificationService.getAll();
                setNotifications(notifs);

                // Fetch latest wellness entry for insights
                const history = await wellnessService.getHistory();
                if (history && history.length > 0) {
                    const latest = history[0];
                    const generated = generateInsights({
                        sleep: latest.sleepHours,
                        water: latest.waterGlasses,
                        exercise: latest.exerciseMinutes,
                        energy: latest.energyLevel,
                        mood: latest.mood as Mood
                    });
                    setInsights(generated);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };

        fetchData();

        return () => clearInterval(timer);
    }, [location]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            )); // Optimistic update

            // Refetch to sync (optional, but good for lazy generation if marking read triggers something)
            // const data = await notificationService.getAll();
            // setNotifications(data);
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleClearAll = async () => {
        try {
            await notificationService.markRead('all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to clear all', error);
        }
    };


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
                                data-testid="notification-bell"
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-all"
                            >
                                <Bell className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                                {notifications.some(n => !n.isRead) && (
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
                                        onMarkAsRead={handleMarkAsRead}
                                        onClearAll={handleClearAll}
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
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Today's Metrics</h2>
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
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">1,234</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Total Patients</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-50 rounded-xl">
                                    <Calendar className="w-6 h-6 text-emerald-600" />
                                </div>
                                <span className="text-xs text-green-600 font-semibold">+8%</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">342</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Appointments</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <Activity className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-xs text-green-600 font-semibold">+24%</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">98.7%</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Health Score</p>
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
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Insights</h2>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {insights.length > 0 ? (
                                insights.map(insight => (
                                    <AIInsightCardEnhanced
                                        key={insight.id}
                                        {...insight}
                                    />
                                ))
                            ) : (
                                <div className="text-center p-6 text-slate-500">
                                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                    <p>No insights yet. Track your wellness to get AI recommendations!</p>
                                </div>
                            )}
                        </div>

                        {/* Motivational Footer */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-sm text-center text-slate-600 dark:text-slate-400 font-medium">
                                You're on track! 🌟 Keep it up!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Emergency SOS Button - Always Visible */}
            <EmergencySOSButton
                emergencyContacts={(() => {
                    try {
                        const saved = localStorage.getItem('emergencyContacts');
                        return saved ? JSON.parse(saved) : [];
                    } catch {
                        return [];
                    }
                })()}
            />
        </div>
    );
};

export default Dashboard;


