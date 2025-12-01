import { TrendingUp, TrendingDown } from 'lucide-react';

interface HealthScoreBadgeProps {
    score: number;
    trend: 'up' | 'down' | 'stable';
}

const HealthScoreBadge = ({ score, trend }: HealthScoreBadgeProps) => {
    const getGradient = () => {
        if (score >= 80) return 'from-green-400 to-emerald-500';
        if (score >= 60) return 'from-blue-400 to-cyan-500';
        if (score >= 40) return 'from-yellow-400 to-orange-500';
        return 'from-red-400 to-pink-500';
    };

    return (
        <div className="relative group">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getGradient()} p-1 animate-ai-pulse`}>
                <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{score}</span>
                    <span className="text-xs text-slate-500 font-medium">Health Score</span>
                </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg">
                {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                {trend === 'stable' && <div className="w-4 h-0.5 bg-blue-500" />}
            </div>
        </div>
    );
};

export default HealthScoreBadge;
