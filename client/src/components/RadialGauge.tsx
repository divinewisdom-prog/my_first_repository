interface RadialGaugeProps {
    value: number;
    max: number;
    label: string;
    unit?: string;
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
    size?: 'sm' | 'md' | 'lg';
}

const RadialGauge = ({ value, max, label, unit = '', color = 'blue', size = 'md' }: RadialGaugeProps) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const sizeClasses = {
        sm: { container: 'w-20 h-20', text: 'text-sm', value: 'text-lg' },
        md: { container: 'w-24 h-24', text: 'text-xs', value: 'text-xl' },
        lg: { container: 'w-32 h-32', text: 'text-sm', value: 'text-2xl' }
    };

    const colorClasses = {
        blue: { stroke: '#1D9BF0', bg: '#E0F2FE' },
        green: { stroke: '#34C759', bg: '#DCFCE7' },
        orange: { stroke: '#FFCC00', bg: '#FEF3C7' },
        red: { stroke: '#FF3B30', bg: '#FEE2E2' },
        purple: { stroke: '#A855F7', bg: '#F3E8FF' }
    };

    const sizes = sizeClasses[size];
    const colors = colorClasses[color];

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${sizes.container}`}>
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke={colors.bg}
                        strokeWidth="8"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke={colors.stroke}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`${sizes.value} font-bold text-slate-800 dark:text-white`}>
                        {value}
                    </span>
                    {unit && <span className="text-xs text-slate-500 dark:text-slate-300">{unit}</span>}
                </div>
            </div>
            <span className={`${sizes.text} text-slate-600 dark:text-slate-300 font-medium mt-2 text-center`}>
                {label}
            </span>
        </div>
    );
};

export default RadialGauge;
