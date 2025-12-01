import React from 'react';

interface ThisWeekSummaryProps {
    goalsAchieved: number;
    totalGoals: number;
    aiInsightsGenerated: number;
    healthScoreChange: number;
}

const ThisWeekSummary: React.FC<ThisWeekSummaryProps> = ({
    goalsAchieved,
    totalGoals,
    aiInsightsGenerated,
    healthScoreChange
}) => {
    return (
        <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">This Week</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Goals Achieved</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {goalsAchieved}/{totalGoals}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">AI Insights Generated</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {aiInsightsGenerated}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Health Score Change</span>
                    <span className={`text-2xl font-bold flex items-center gap-1 ${healthScoreChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {healthScoreChange >= 0 ? '+' : ''}{healthScoreChange}
                        <svg className={`w-5 h-5 ${healthScoreChange >= 0 ? 'rotate-0' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            </div>

            {goalsAchieved >= totalGoals * 0.8 && (
                <div className="mt-4 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                        <span>✨</span>
                        <span className="font-medium">Keep up your wellness streak! You're building healthy habits!</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ThisWeekSummary;
