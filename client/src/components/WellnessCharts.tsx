import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type Mood = 'great' | 'good' | 'okay' | 'low' | 'bad';

interface WellnessData {
    date: string;
    energy: number;
    mood: Mood | string;
    sleep: number;
    water: number;
    exercise: number;
}

interface WellnessChartsProps {
    data: WellnessData[];
}

const WellnessCharts = ({ data }: WellnessChartsProps) => {
    // Reverse data to show oldest to newest if needed, but usually charts read left-to-right (old-to-new)
    // Assuming data passed is newest first (based on history table), so we reverse it for the chart.
    const chartData = [...data].reverse();
    const labels = chartData.map(d => d.date.split(',')[0]); // Extract date part

    const moodMap: Record<string, number> = {
        'great': 5,
        'good': 4,
        'okay': 3,
        'low': 2,
        'bad': 1
    };

    const commonOptions: ChartOptions<any> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    color: '#64748b' // slate-500
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8' // slate-400
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)', // slate-400 with opacity
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8' // slate-400
                }
            }
        },
    };

    const moodEnergyData: ChartData<'line'> = {
        labels,
        datasets: [
            {
                label: 'Mood (1-5)',
                data: chartData.map(d => moodMap[d.mood as string] || 3),
                borderColor: 'rgb(168, 85, 247)', // Purple
                backgroundColor: 'rgba(168, 85, 247, 0.5)',
                tension: 0.4,
                yAxisID: 'y',
            },
            {
                label: 'Energy (1-10)',
                data: chartData.map(d => d.energy),
                borderColor: 'rgb(234, 179, 8)', // Yellow
                backgroundColor: 'rgba(234, 179, 8, 0.5)',
                tension: 0.4,
                yAxisID: 'y1',
            }
        ]
    };

    const moodEnergyOptions = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            y: {
                ...commonOptions.scales?.y,
                min: 0,
                max: 6,
                title: { display: true, text: 'Mood' }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                min: 0,
                max: 10,
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Energy' },
                ticks: { color: '#94a3b8' }
            },
        }
    };

    const sleepData: ChartData<'line'> = {
        labels,
        datasets: [
            {
                label: 'Sleep (hrs)',
                data: chartData.map(d => d.sleep),
                borderColor: 'rgb(59, 130, 246)', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Goal (8h)',
                data: chartData.map(() => 8),
                borderColor: 'rgba(148, 163, 184, 0.5)', // Slate
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
            }
        ]
    };

    const adherenceData: ChartData<'bar'> = {
        labels,
        datasets: [
            {
                label: 'Water (Glasses)',
                data: chartData.map(d => d.water),
                backgroundColor: 'rgba(6, 182, 212, 0.7)', // Cyan
                borderRadius: 4,
            },
            {
                label: 'Exercise (Min)',
                data: chartData.map(d => d.exercise),
                backgroundColor: 'rgba(249, 115, 22, 0.7)', // Orange
                borderRadius: 4,
                yAxisID: 'y1',
            }
        ]
    };

    const adherenceOptions = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            y: {
                ...commonOptions.scales?.y,
                title: { display: true, text: 'Water' }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Exercise' },
                ticks: { color: '#94a3b8' }
            },
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Mood & Energy Trend */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Mood & Energy</h3>
                </div>
                <div className="h-64">
                    <Line options={moodEnergyOptions} data={moodEnergyData} />
                </div>
            </div>

            {/* Sleep Consistency */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Sleep Consistency</h3>
                </div>
                <div className="h-64">
                    <Line options={commonOptions} data={sleepData} />
                </div>
            </div>

            {/* Habit Adherence */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Habit Adherence</h3>
                </div>
                <div className="h-64">
                    <Bar options={adherenceOptions} data={adherenceData} />
                </div>
            </div>
        </div>
    );
};

export default WellnessCharts;
