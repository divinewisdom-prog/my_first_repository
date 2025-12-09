import React from 'react';
import { Bell, Calendar, Pill, Trophy, Sparkles, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Notification {
    _id: string; // MongoDB ID
    id?: string; // Fallback
    type: 'appointment' | 'wellness' | 'medication' | 'achievement' | 'insight' | 'system';
    title: string;
    message: string;
    createdAt: string; // Date string from backend
    isRead: boolean;
    link?: string;
}

interface NotificationDropdownProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
    onClearAll: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    notifications,
    onClose,
    onMarkAsRead,
    onClearAll
}) => {
    const navigate = useNavigate();

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'appointment': return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'medication': return <Pill className="w-5 h-5 text-red-500" />;
            case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 'insight': return <Sparkles className="w-5 h-5 text-purple-500" />;
            default: return <Bell className="w-5 h-5 text-slate-500" />;
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        onMarkAsRead(notification._id);
        if (notification.link) {
            navigate(notification.link);
            onClose();
        }
    };

    return (
        <div className="absolute right-0 top-14 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 animate-fade-in overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                        {notifications.filter(n => !n.isRead).length}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onClearAll}
                        className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                    >
                        Clear all
                    </button>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No new notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative group ${!notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 p-2 rounded-full bg-white dark:bg-slate-700 shadow-sm h-fit`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onMarkAsRead(notification._id);
                                                }}
                                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-400"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {!notification.isRead && (
                                    <span className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-full" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center">
                <button className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                    View all notifications
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
