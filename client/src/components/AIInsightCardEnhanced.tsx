import React from 'react';

interface AIInsightCardEnhancedProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    status?: 'success' | 'warning' | 'info';
    confidence?: 'High' | 'Medium' | 'Low';
    iconBg: string;
    badge?: string;
}

const AIInsightCardEnhanced: React.FC<AIInsightCardEnhancedProps> = ({
    icon,
    title,
    description,
    status = 'info',
    confidence,
    iconBg,
    badge
}) => {
    const statusColors = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    };

    const statusBadgeColors = {
        success: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
        warning: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
        info: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    };

    return (
        <div className={`rounded-2xl p-4 border-2 ${statusColors[status]} transition-all hover:shadow-md`}>
            <div className="flex items-start gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${iconBg} flex-shrink-0`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
                        {badge && (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
                </div>
            </div>

            {status === 'warning' && (
                <div className={`mt-3 px-3 py-1.5 rounded-lg flex items-center gap-2 ${statusBadgeColors.warning}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium">Action needed</span>
                </div>
            )}

            {status === 'success' && (
                <div className={`mt-3 px-3 py-1.5 rounded-lg flex items-center gap-2 ${statusBadgeColors.success}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium">Great job!</span>
                </div>
            )}

            {confidence && (
                <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">AI Confidence: {confidence}</span>
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default AIInsightCardEnhanced;
