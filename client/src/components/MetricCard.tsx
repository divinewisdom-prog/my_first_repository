import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: number;
    max: number;
    unit: string;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

const MetricCard = ({ title, value, max, unit, icon: Icon, color }: MetricCardProps) => {
    const percentage = (value / max) * 100;

    const colorClasses = {
        blue: {
            gradient: 'from-blue-400 to-cyan-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600'
        },
        green: {
            gradient: 'from-green-400 to-emerald-500',
            bg: 'bg-green-50',
            text: 'text-green-600'
        },
        purple: {
            gradient: 'from-purple-400 to-pink-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600'
        },
        orange: {
            gradient: 'from-orange-400 to-red-500',
            bg: 'bg-orange-50',
            text: 'text-orange-600'
        }
    };

    const colors = colorClasses[color];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${colors.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <span className={`text-2xl font-bold ${colors.text}`}>
                    {value}<span className="text-sm font-normal ml-1">{unit}</span>
                </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default MetricCard;
