import React from 'react';

interface EnergySliderProps {
    value: number;
    onChange: (value: number) => void;
}

const EnergySlider: React.FC<EnergySliderProps> = ({ value, onChange }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">Energy Level</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">How energetic do you feel today?</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">out of 10</div>
                </div>
            </div>

            <div className="relative">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${((value - 1) / 9) * 100}%, #e2e8f0 ${((value - 1) / 9) * 100}%, #e2e8f0 100%)`
                    }}
                />
                <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Low Energy</span>
                    <span>Moderate</span>
                    <span>High Energy</span>
                </div>
            </div>
        </div>
    );
};

export default EnergySlider;
