import React from 'react';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'bad';

interface MoodSelectorProps {
    selectedMood: Mood | null;
    onChange: (mood: Mood) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onChange }) => {
    const moods: { value: Mood; emoji: string; label: string; color: string }[] = [
        { value: 'great', emoji: '😄', label: 'Great', color: 'bg-green-100 dark:bg-green-900/30 border-green-500' },
        { value: 'good', emoji: '😊', label: 'Good', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500' },
        { value: 'okay', emoji: '😐', label: 'Okay', color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500' },
        { value: 'low', emoji: '😟', label: 'Low', color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-500' },
        { value: 'bad', emoji: '😢', label: 'Bad', color: 'bg-red-100 dark:bg-red-900/30 border-red-500' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Mood</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">How are you feeling emotionally?</p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        onClick={() => onChange(mood.value)}
                        className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${selectedMood === mood.value
                                ? `${mood.color} scale-105`
                                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:scale-105'
                            }`}
                    >
                        <span className="text-3xl mb-2">{mood.emoji}</span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{mood.label}</span>
                        {selectedMood === mood.value && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;
