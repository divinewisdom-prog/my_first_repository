import React from 'react';

interface ProgressBarProps {
    label: string;
    value: number;
    goal: number;
    color: string; // Tailwind color class e.g., 'bg-green-500'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, goal, color }) => (
    <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-medium text-slate-600 w-20">{label}</span>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(100, (value / goal) * 100)}%` }} />
        </div>
        <span className="text-sm font-medium text-slate-900">{value}/{goal}</span>
    </div>
);
