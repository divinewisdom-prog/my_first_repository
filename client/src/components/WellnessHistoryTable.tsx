import React from 'react';

interface WellnessHistoryEntry {
    date: string;
    energy: number;
    mood: string;
    sleep: number;
    water: number;
    exercise: number;
}

interface WellnessHistoryTableProps {
    history: WellnessHistoryEntry[];
}

const WellnessHistoryTable: React.FC<WellnessHistoryTableProps> = ({ history }) => {
    const getMoodEmoji = (mood: string) => {
        const moodMap: Record<string, string> = {
            great: '😄',
            good: '😊',
            okay: '😐',
            low: '😟',
            bad: '😢',
        };
        return moodMap[mood] || '😐';
    };

    const getEnergyColor = (energy: number) => {
        if (energy >= 8) return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300';
        if (energy >= 5) return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300';
        return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300';
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Wellness History</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Track your progress over time</p>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                Date
                                <svg className="w-3 h-3 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                                </svg>
                            </th>
                            <th className="text-center py-3 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                Energy
                                <svg className="w-3 h-3 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                                </svg>
                            </th>
                            <th className="text-center py-3 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">Mood</th>
                            <th className="text-center py-3 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                Sleep<br />(h)
                            </th>
                            <th className="text-center py-3 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">Water</th>
                            <th className="text-center py-3 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">Exercise</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry, index) => (
                            <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="py-3 px-2">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{entry.date.split(',')[0]}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{entry.date.split(',')[1]}</div>
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getEnergyColor(entry.energy)}`}>
                                        {entry.energy}/10
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-center text-2xl">{getMoodEmoji(entry.mood)}</td>
                                <td className="py-3 px-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">{entry.sleep}h</td>
                                <td className="py-3 px-2 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{entry.water}</span>
                                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">{entry.exercise} min</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {history.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm">No wellness history yet. Start tracking today!</p>
                </div>
            )}
        </div>
    );
};

export default WellnessHistoryTable;
