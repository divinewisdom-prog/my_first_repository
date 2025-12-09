import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, Moon, Droplets, Activity as ActivityIcon, Heart, Brain, Target, TrendingUp } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import EnergySlider from '../components/EnergySlider';
import MoodSelector from '../components/MoodSelector';
import AIInsightCardEnhanced from '../components/AIInsightCardEnhanced';
import WellnessHistoryTable from '../components/WellnessHistoryTable';
import ThisWeekSummary from '../components/ThisWeekSummary';
import WellnessCharts from '../components/WellnessCharts';
import { wellnessService } from '../services/api';

import { generateInsights, generateHealthTips, Mood, WellnessInsight, HealthTip, goals } from '../utils/aiInsights';

interface WellnessEntry {
    date: string;
    energy: number;
    mood: Mood;
    sleep: number;
    water: number;
    exercise: number;
}



const DailyWellness = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useAuth();

    // Form State
    const [energyLevel, setEnergyLevel] = useState(7);
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [sleepHours, setSleepHours] = useState(7.5);
    const [waterGlasses, setWaterGlasses] = useState(8);
    const [exerciseMinutes, setExerciseMinutes] = useState(45);
    const [heartRate, setHeartRate] = useState(72);
    const [bloodPressureSys, setBloodPressureSys] = useState(120);
    const [bloodPressureDia, setBloodPressureDia] = useState(80);
    const [spO2, setSpO2] = useState(98);
    const [dailyNotes, setDailyNotes] = useState('');
    const [dailyTasks, setDailyTasks] = useState([
        { id: 1, text: 'Drink 8 glasses of water', completed: false, points: 10 },
        { id: 2, text: 'Exercise for 30 minutes', completed: false, points: 15 },
        { id: 3, text: 'Get 8 hours of sleep', completed: false, points: 20 },
        { id: 4, text: 'Meditate for 10 minutes', completed: false, points: 10 },
        { id: 5, text: 'Eat 3 healthy meals', completed: false, points: 15 }
    ]);
    const [newTaskText, setNewTaskText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showInsights, setShowInsights] = useState(false);

    // AI Insights State
    const [insights, setInsights] = useState<WellnessInsight[]>([]);
    const [healthTips, setHealthTips] = useState<HealthTip[]>([]);

    // Auto-complete tasks based on metrics
    useEffect(() => {
        setDailyTasks(prevTasks => prevTasks.map(task => {
            // Task 1: Drink 8 glasses of water
            if (task.id === 1) {
                return { ...task, completed: waterGlasses >= 8 || task.completed };
            }
            // Task 2: Exercise for 30 minutes
            if (task.id === 2) {
                return { ...task, completed: exerciseMinutes >= 30 || task.completed };
            }
            // Task 3: Get 8 hours of sleep
            if (task.id === 3) {
                return { ...task, completed: sleepHours >= 8 || task.completed };
            }
            return task;
        }));
    }, [waterGlasses, exerciseMinutes, sleepHours]);

    // Goals


    // Wellness History
    const [history, setHistory] = useState<WellnessEntry[]>([]);

    // Fetch wellness history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await wellnessService.getHistory(30);
                // Transform API data to match WellnessEntry format
                const formattedHistory = data.map((entry: any) => ({
                    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    energy: entry.energyLevel,
                    mood: entry.mood,
                    sleep: entry.sleepHours,
                    water: entry.waterGlasses,
                    exercise: entry.exerciseMinutes
                }));
                setHistory(formattedHistory);
            } catch (error) {
                console.error('Error fetching wellness history:', error);
                showToast('Failed to load wellness history', 'error');
                if (axios.isAxiosError(error)) {
                    const fullUrl = (error.config?.baseURL || '') + (error.config?.url || '');
                    console.error("DEBUG: Full URL:", fullUrl);
                    showToast(`Debug: Failed at ${fullUrl}`, 'error');
                }
            }
        };
        fetchHistory();
    }, [showToast]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const toggleTask = (taskId: number) => {
        setDailyTasks(tasks =>
            tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const addTask = () => {
        if (!newTaskText.trim()) return;
        const newTask = {
            id: Date.now(),
            text: newTaskText,
            completed: false,
            points: 10
        };
        setDailyTasks([...dailyTasks, newTask]);
        setNewTaskText('');
    };

    const removeTask = (taskId: number) => {
        setDailyTasks(tasks => tasks.filter(task => task.id !== taskId));
    };

    const completedTasks = dailyTasks.filter(t => t.completed).length;
    const totalPoints = dailyTasks.reduce((sum, task) => sum + (task.completed ? task.points : 0), 0);
    const maxPoints = dailyTasks.reduce((sum, task) => sum + task.points, 0);

    // Logic moved to utils/aiInsights.ts

    const handleSubmit = async () => {
        if (!selectedMood) {
            showToast('Please select your mood', 'warning');
            return;
        }

        setIsAnalyzing(true);

        try {
            // Prepare wellness data
            const wellnessData = {
                energyLevel,
                mood: selectedMood,
                sleepHours,
                waterGlasses,
                exerciseMinutes,
                heartRate,
                bloodPressure: {
                    systolic: bloodPressureSys,
                    diastolic: bloodPressureDia
                },
                spO2,
                notes: dailyNotes,
                dailyTasks: dailyTasks.map(({ id, ...task }) => task) // Remove id for backend
            };

            // Save to backend
            await wellnessService.create(wellnessData);

            // Add to local history
            const newEntry: WellnessEntry = {
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                energy: energyLevel,
                mood: selectedMood,
                sleep: sleepHours,
                water: waterGlasses,
                exercise: exerciseMinutes
            };
            setHistory([newEntry, ...history]);

            // Generate Insights locally
            setInsights(generateInsights({
                sleep: sleepHours,
                water: waterGlasses,
                exercise: exerciseMinutes,
                energy: energyLevel,
                mood: selectedMood
            }));

            setHealthTips(generateHealthTips({
                sleep: sleepHours,
                energy: energyLevel,
                mood: selectedMood
            }));

            setShowInsights(true);
            console.log('Wellness data saved successfully');
            showToast('Wellness data saved successfully!', 'success');
        } catch (error: any) {
            console.error('Error saving wellness data:', error);
            console.error('Error saving wellness data:', error);
            // DEBUGGING: Probe the error object
            const debugMsg = `Type: ${typeof error}, String: ${String(error)}, Msg: ${error?.message}, Resp: ${!!error?.response}`;
            showToast(debugMsg, 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
            {/* Header */}
            <div className="max-w-[1600px] mx-auto mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="mt-6 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                            <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Daily Wellness Tracker</h1>
                            <p className="text-slate-600 dark:text-slate-400">Track your energy, sleep, mood, and vitals daily.</p>
                        </div>
                    </div>

                </div>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 mb-6">
                    <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-bold">{getGreeting()}, {user?.name || 'User'}!</span> 👋<br />
                        Let's track your wellness for today and unlock personalized AI insights.
                    </p>
                </div>

                {isAnalyzing && (
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl p-4 border-2 border-emerald-500 dark:border-emerald-700 mb-6 animate-pulse">
                        <div className="flex items-center gap-3">
                            <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                            <span className="text-emerald-800 dark:text-emerald-200 font-medium">
                                AI analyzing your latest entries...
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main 3-Column Layout */}
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Main Form */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Energy Level */}
                    <EnergySlider value={energyLevel} onChange={setEnergyLevel} />

                    {/* Mood */}
                    <MoodSelector selectedMood={selectedMood} onChange={setSelectedMood} />

                    {/* Sleep Hours */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white">Sleep Hours</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Last night</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{sleepHours}h</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Recommended: {goals.sleep}h</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSleepHours(Math.max(0, sleepHours - 0.5))}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 font-bold"
                            >
                                -
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="12"
                                step="0.5"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(sleepHours / 12) * 100}%, #e2e8f0 ${(sleepHours / 12) * 100}%, #e2e8f0 100%)`
                                }}
                            />
                            <button
                                onClick={() => setSleepHours(Math.min(12, sleepHours + 0.5))}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 font-bold"
                            >
                                +
                            </button>
                        </div>

                        {sleepHours >= goals.sleep - 0.5 && sleepHours <= goals.sleep + 0.5 && (
                            <div className="mt-4 px-3 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Optimal Range</span>
                            </div>
                        )}
                    </div>

                    {/* Water Intake */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white">Water Intake</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Glasses today</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{waterGlasses}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Goal: {goals.water} glasses</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 font-bold"
                            >
                                -
                            </button>
                            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-xl h-4 relative overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${Math.min((waterGlasses / goals.water) * 100, 100)}%` }}
                                />
                            </div>
                            <button
                                onClick={() => setWaterGlasses(waterGlasses + 1)}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 font-bold"
                            >
                                +
                            </button>
                        </div>

                        <div className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                            {Math.round((waterGlasses / goals.water) * 100)}% of daily goal
                        </div>
                    </div>

                    {/* Exercise Minutes */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                <ActivityIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white">Exercise Minutes</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Physical activity today</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{exerciseMinutes}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">minutes</div>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <button onClick={() => setExerciseMinutes(Math.max(0, exerciseMinutes - 5))} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">-5 min</button>
                            <button onClick={() => setExerciseMinutes(exerciseMinutes + 5)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">+5 min</button>
                            <button onClick={() => setExerciseMinutes(exerciseMinutes + 10)} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-lg text-sm hover:bg-orange-200 dark:hover:bg-orange-900/60">+10 min</button>
                        </div>

                        {exerciseMinutes >= goals.exercise && (
                            <div className="px-3 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Goal achieved! Keep it up!</span>
                            </div>
                        )}

                        <div className="mt-4 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm text-emerald-700 dark:text-emerald-300">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-semibold">AI Suggestion</span>
                            </div>
                            <p className="text-xs">Add 10 more minutes for optimal heart health and improved energy levels.</p>
                        </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Vital Signs</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Track your key health metrics</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Heart Rate */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Heart Rate (bpm)</label>
                                </div>
                                <input
                                    type="number"
                                    value={heartRate}
                                    onChange={(e) => setHeartRate(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-center text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="72"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">Normal: 60-100 bpm</p>
                            </div>

                            {/* Blood Pressure */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blood Pressure</label>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={bloodPressureSys}
                                            onChange={(e) => setBloodPressureSys(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-center text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="120"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">Systolic</p>
                                    </div>
                                    <div className="flex items-center text-2xl font-bold text-slate-400">/</div>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={bloodPressureDia}
                                            onChange={(e) => setBloodPressureDia(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-center text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="80"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">Diastolic</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">Normal: 120/80 mmHg</p>
                            </div>

                            {/* SpO2 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                    </svg>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blood Oxygen (%)</label>
                                </div>
                                <input
                                    type="number"
                                    value={spO2}
                                    onChange={(e) => setSpO2(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-center text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="98"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">Normal: 95-100%</p>
                            </div>
                        </div>
                    </div>

                    {/* Daily Notes */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Daily Notes</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Any thoughts or observations?</p>
                            </div>
                        </div>
                        <textarea
                            value={dailyNotes}
                            onChange={(e) => setDailyNotes(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            rows={4}
                            placeholder="Feeling stressed today? Write here... The AI will analyze your notes for patterns and insights."
                        />
                    </div>

                    {/* Daily Tasks (Gamified) */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Target className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Target className="w-6 h-6" />
                                        Daily Quests
                                    </h3>
                                    <p className="text-indigo-100 text-sm">Complete tasks to boost your wellness score</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{totalPoints} <span className="text-sm font-normal text-indigo-200">/ {maxPoints} XP</span></div>
                                    <div className="text-xs text-indigo-200">{completedTasks} of {dailyTasks.length} completed</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-black/20 rounded-full h-2 mb-6">
                                <div
                                    className="h-full bg-white/90 rounded-full transition-all duration-500"
                                    style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
                                />
                            </div>

                            <div className="space-y-3 mb-6">
                                {dailyTasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${task.completed
                                            ? 'bg-white/20 hover:bg-white/30'
                                            : 'bg-black/20 hover:bg-black/30'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-400 border-green-400' : 'border-indigo-200'
                                            }`}>
                                            {task.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className={`flex-1 font-medium ${task.completed ? 'line-through text-indigo-200' : 'text-white'}`}>
                                            {task.text}
                                        </span>
                                        <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-lg">
                                            +{task.points} XP
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}
                                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-indigo-200 hover:text-white"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Task */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                    placeholder="Add a personal goal..."
                                    className="flex-1 px-4 py-2 bg-black/20 border border-indigo-400/30 rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:bg-black/30 focus:border-indigo-300 transition-all"
                                />
                                <button
                                    onClick={addTask}
                                    disabled={!newTaskText.trim()}
                                    className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                            </div>

                            {completedTasks === dailyTasks.length && dailyTasks.length > 0 && (
                                <div className="mt-4 p-3 bg-yellow-400/20 border border-yellow-400/50 rounded-xl flex items-center gap-3 animate-pulse">
                                    <Sparkles className="w-5 h-5 text-yellow-300" />
                                    <span className="font-bold text-yellow-100">Perfect Day! Bonus unlocked!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        <Sparkles className="w-6 h-6" />
                        {isAnalyzing ? 'Analyzing...' : 'Submit & Generate AI Insights'}
                        <Sparkles className="w-6 h-6" />
                    </button>

                    {/* Wellness History */}
                    <WellnessHistoryTable history={history} />
                </div>

                {/* Middle Column - AI Insights */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500 rounded-full">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">AI Insights</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Personalized recommendations</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {showInsights ? (
                                <>
                                    {insights.map(insight => (
                                        <AIInsightCardEnhanced
                                            key={insight.id}
                                            icon={insight.icon}
                                            title={insight.title}
                                            description={insight.description}
                                            status={insight.status}
                                            confidence={insight.confidence}
                                            iconBg={insight.iconBg}
                                            badge={insight.badge}
                                        />
                                    ))}
                                </>
                            ) : (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Submit your data to generate AI insights</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - AI Health Assistant */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500 rounded-full">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">AI Health Assistant</h3>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">● Real-time Analysis</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Contextual insights for this section</p>

                        <div className="space-y-3">
                            {healthTips.length > 0 ? (
                                healthTips.map(tip => (
                                    <div key={tip.id} className={`bg-gradient-to-br ${tip.bgGradient} rounded-xl p-4 border-2 ${tip.borderColor}`}>
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`p-2 rounded-lg ${tip.iconBg}`}>
                                                {tip.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tip.title}</h4>
                                                    {tip.badge && (
                                                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">{tip.badge}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">{tip.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                                            <span>AI Confidence: {tip.confidence}</span>
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 text-center">Submit data to see active assistant suggestions.</p>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                <span className="text-xs">AI continuously analyzes your data to provide personalized insights and recommendations</span>
                            </div>
                        </div>
                    </div>

                    {/* This Week Summary */}
                    <ThisWeekSummary
                        goalsAchieved={12}
                        totalGoals={15}
                        aiInsightsGenerated={47}
                        healthScoreChange={5}
                    />
                </div>
            </div>

            {/* Wellness Trends Section */}
            <div className="max-w-[1600px] mx-auto mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                        <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Wellness Trends</h2>
                        <p className="text-slate-600 dark:text-slate-400">Visualizing your progress over time</p>
                    </div>
                </div>

                <WellnessCharts data={history} />
            </div>
        </div>
    );
};

export default DailyWellness;   