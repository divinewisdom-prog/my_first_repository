import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HealthScoreBadgeProps {
    score: number;
    trend: 'up' | 'down' | 'stable';
}

const HealthScoreBadge = ({ score, trend }: HealthScoreBadgeProps) => {
    const [displayScore, setDisplayScore] = useState(0);
    const [showPop, setShowPop] = useState(false);

    // Animation constants
    const duration = 1500; // ms
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function (easeOutExpo) for snappy feel
            const easeOut = (x: number): number => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            };

            const currentScore = Math.floor(easeOut(percentage) * score);
            setDisplayScore(currentScore);

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setDisplayScore(score);
                setShowPop(true);
                setTimeout(() => setShowPop(false), 300);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [score]);

    const getGradientId = () => {
        if (score >= 80) return 'gradient-green';
        if (score >= 60) return 'gradient-blue';
        if (score >= 40) return 'gradient-yellow';
        return 'gradient-red';
    };

    const getGradientColors = () => {
        if (score >= 80) return ['#4ade80', '#10b981']; // green-400 to emerald-500
        if (score >= 60) return ['#60a5fa', '#06b6d4']; // blue-400 to cyan-500
        if (score >= 40) return ['#facc15', '#f97316']; // yellow-400 to orange-500
        return ['#f87171', '#ec4899']; // red-400 to pink-500
    };

    const [startColor, endColor] = getGradientColors();

    return (
        <div className="relative group w-28 h-28 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                <defs>
                    <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={startColor} />
                        <stop offset="100%" stopColor={endColor} />
                    </linearGradient>
                </defs>
                {/* Background Track */}
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-700"
                />
                {/* Progress Circle */}
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={`url(#${getGradientId()})`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        transition: 'stroke-dashoffset 0.1s linear'
                    }}
                />
            </svg>

            {/* Center Content */}
            <div className={`absolute flex flex-col items-center justify-center transition-transform duration-300 ${showPop ? 'scale-125' : 'scale-100'}`}>
                <span className="text-3xl font-bold text-slate-800 dark:text-white leading-none">
                    {displayScore}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                    Score
                </span>
            </div>

            {/* Trend Bubble */}
            <div className={`absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg border border-slate-100 dark:border-slate-700 transition-transform duration-500 delay-1000 ${displayScore === score ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                {trend === 'stable' && <div className="w-4 h-0.5 bg-blue-500" />}
            </div>
        </div>
    );
};

export default HealthScoreBadge;
