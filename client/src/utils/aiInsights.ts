import React from 'react';
import { Moon, Droplets, Activity as ActivityIcon, Target, Scale } from 'lucide-react';

export type Mood = 'great' | 'good' | 'okay' | 'low' | 'bad';

export interface WellnessInsight {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    status: 'success' | 'warning' | 'info';
    confidence: 'High' | 'Medium' | 'Low';
    iconBg: string; // Tailwind class
    badge?: string;
}

export interface HealthTip {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    bgGradient: string;
    borderColor: string;
    iconBg: string;
    confidence: string;
    badge?: string;
    action?: string;
}

export const goals = {
    sleep: 8,
    water: 8,
    exercise: 30
};

export const generateInsights = (data: { sleep: number; water: number; exercise: number; energy: number; mood: Mood }) => {
    const newInsights: WellnessInsight[] = [];

    // 1. Sleep Analysis
    if (data.sleep < goals.sleep - 1) {
        newInsights.push({
            id: 'sleep-deficit',
            icon: React.createElement(Moon, { className: "w-5 h-5 text-yellow-600" }),
            title: "Critical Sleep Deficit Detected",
            description: `You're getting ${data.sleep}h of sleep, which is below your ${goals.sleep}h goal. This deficit correlates with lower energy levels. ACTION NEEDED: Try to go to bed 45 minutes earlier tonight to restore baseline energy.`,
            status: 'warning',
            confidence: 'High',
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/40'
        });
    } else if (data.sleep >= goals.sleep) {
        newInsights.push({
            id: 'sleep-optimal',
            icon: React.createElement(Moon, { className: "w-5 h-5 text-purple-600" }),
            title: "Optimal Sleep Patterns",
            description: `Great job hitting your sleep goal of ${goals.sleep}h+! Consistent sleep is key to cognitive function and mood stability. Keep this streak alive!`,
            status: 'success',
            confidence: 'High',
            iconBg: 'bg-purple-100 dark:bg-purple-900/40',
            badge: 'Well Rested'
        });
    }

    // 2. Hydration Analysis
    if (data.water < goals.water - 2) {
        newInsights.push({
            id: 'water-low',
            icon: React.createElement(Droplets, { className: "w-5 h-5 text-blue-600" }),
            title: "Hydration Alert",
            description: `You've only had ${data.water} glasses of water. Dehydration causes fatigue and brain fog. Try drinking a large glass of water right now and another before your next meal.`,
            status: 'warning',
            confidence: 'High',
            iconBg: 'bg-blue-100 dark:bg-blue-900/40'
        });
    } else if (data.water >= goals.water) {
        newInsights.push({
            id: 'water-optimal',
            icon: React.createElement(Droplets, { className: "w-5 h-5 text-blue-600" }),
            title: "Optimal Hydration Strategy",
            description: `You're hitting your ${goals.water}-glass target consistently! Distribute intake evenly throughout the day to maximize energy and focus.`,
            status: 'success',
            confidence: 'High',
            iconBg: 'bg-blue-100 dark:bg-blue-900/40',
            badge: 'Hydrated'
        });
    }

    // 3. Exercise Analysis
    if (data.exercise < goals.exercise) {
        newInsights.push({
            id: 'exercise-low',
            icon: React.createElement(ActivityIcon, { className: "w-5 h-5 text-orange-600" }),
            title: "Movement Opportunity",
            description: `You're at ${data.exercise} min of activity. A quick 15-minute walk can boost your mood and metabolism significantly.`,
            status: 'info',
            confidence: 'Medium',
            iconBg: 'bg-orange-100 dark:bg-orange-900/40'
        });
    } else {
        newInsights.push({
            id: 'exercise-good',
            icon: React.createElement(ActivityIcon, { className: "w-5 h-5 text-green-600" }),
            title: "Exercise Progression Plan",
            description: `Impressive! You hit ${data.exercise} min today. Your heart rate data shows you're ready to level up. Consider adding 2 HIIT intervals to your next session.`,
            status: 'success',
            confidence: 'High',
            iconBg: 'bg-green-100 dark:bg-green-900/40',
            badge: 'Active'
        });
    }

    return newInsights;
};

export const generateHealthTips = (data: { sleep: number; energy: number; mood: Mood }) => {
    const tips: HealthTip[] = [];

    // Tip 1: Performance Window
    tips.push({
        id: 'perf-window',
        icon: React.createElement(Target, { className: "w-5 h-5 text-white" }),
        title: "Peak Performance Window",
        description: "Your cortisol and body temperature data models suggest peak physical capacity between 2:15-4:45 PM. Schedule your most demanding tasks during this window.",
        bgGradient: "from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20",
        borderColor: "border-orange-200 dark:border-orange-800",
        iconBg: "bg-orange-500",
        confidence: "High (94%)",
        badge: "Key"
    });

    // Tip 2: Stress/Recovery - dependent on mood/sleep
    if (data.mood === 'low' || data.mood === 'bad' || data.sleep < 6) {
        tips.push({
            id: 'recovery-protocol',
            icon: React.createElement(Moon, { className: "w-5 h-5 text-white" }),
            title: "Strategic Recovery Protocol",
            description: "You reported lower mood or sleep. Prioritize a 20-minute low-intensity yoga or meditation session tonight to lower cortisol and improve sleep quality.",
            bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
            borderColor: "border-purple-200 dark:border-purple-800",
            iconBg: "bg-purple-500",
            confidence: "High (91%)"
        });
    } else {
        tips.push({
            id: 'nutrition-protocol',
            icon: React.createElement(Scale, { className: "w-5 h-5 text-white" }),
            title: "Precision Nutrition Protocol",
            description: "Your stats look good. To optimize muscle gain, consume 35g protein within 30 mins post-workout and front-load calories at breakfast.",
            bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
            borderColor: "border-green-200 dark:border-green-800",
            iconBg: "bg-green-500",
            confidence: "High (89%)",
            badge: "Key"
        });
    }

    return tips;
};
