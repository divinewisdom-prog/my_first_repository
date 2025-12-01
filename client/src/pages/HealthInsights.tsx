import { useState } from 'react';
import { BarChart3, Brain, TrendingUp, Activity, Plus, Sparkles } from 'lucide-react';

import RadialGauge from '../components/RadialGauge';
import AIInsightCard from '../components/AIInsightCard';
import DataTable from '../components/DataTable';
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
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const HealthInsights = () => {

    const [showReportForm, setShowReportForm] = useState(false);

    // Mock data for wellness trends
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Predicted Wellness Score',
                data: [75, 78, 82, 80, 85, 87, 90],
                borderColor: '#1D9BF0',
                backgroundColor: 'rgba(29, 155, 240, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1D9BF0',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            },
            {
                label: 'Actual Wellness Score',
                data: [73, 76, 81, 79, 83, null, null],
                borderColor: '#34C759',
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#34C759',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    };

    // Mock community reports
    const communityReports = [
        { date: '2025-11-28', type: 'Air Quality Alert', urgency: 'High', status: 'Active' },
        { date: '2025-11-27', type: 'Flu Outbreak', urgency: 'Medium', status: 'Monitoring' },
        { date: '2025-11-26', type: 'Water Quality Issue', urgency: 'Low', status: 'Resolved' }
    ];

    const columns = [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'type', label: 'Report Type', sortable: true },
        { key: 'urgency', label: 'Urgency', sortable: true },
        { key: 'status', label: 'Status', sortable: false }
    ];

    return (
        <div className="min-h-screen bg-gradient-health pb-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <h1 className="text-4xl font-bold text-slate-900">Health Insights</h1>
                </div>
                <p className="text-slate-600 text-lg mb-4">
                    Your health, analyzed by AI
                </p>

                {/* AI Predictions Badge */}
                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-2xl p-4 inline-flex items-center gap-3 animate-slide-up">
                    <div className="animate-ai-pulse">
                        <Brain className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                        Generating predictions and trends…
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Top Metrics Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="card-premium text-center animate-stagger-1">
                            <RadialGauge
                                value={87}
                                max={100}
                                label="Wellness Trend"
                                unit="%"
                                color="blue"
                                size="md"
                            />
                            <p className="text-xs text-green-600 mt-3 flex items-center justify-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +8% this week
                            </p>
                        </div>
                        <div className="card-premium text-center animate-stagger-2">
                            <RadialGauge
                                value={92}
                                max={100}
                                label="Sleep Consistency"
                                unit="%"
                                color="purple"
                                size="md"
                            />
                            <p className="text-xs text-green-600 mt-3 flex items-center justify-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Excellent
                            </p>
                        </div>
                        <div className="card-premium text-center animate-stagger-3">
                            <RadialGauge
                                value={78}
                                max={100}
                                label="Activity Level"
                                unit="%"
                                color="orange"
                                size="md"
                            />
                            <p className="text-xs text-amber-600 mt-3 flex items-center justify-center gap-1">
                                <Activity className="w-3 h-3" />
                                Moderate variation
                            </p>
                        </div>
                    </div>

                    {/* Analytics Graph */}
                    <div className="card-premium animate-stagger-4">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">7-Day Wellness Forecast</h2>
                        <div className="h-80">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                        <p className="text-xs text-slate-600 mt-4 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            AI predicts your wellness score will improve by 12% this week
                        </p>
                    </div>

                    {/* Community Health Reporting Form */}
                    <div className="card-premium animate-stagger-5">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Community Health Reports</h2>
                                <p className="text-sm text-slate-600 mt-1">Help improve community health insights</p>
                            </div>
                            <button
                                onClick={() => setShowReportForm(true)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                New Report
                            </button>
                        </div>

                        {/* Community Data Table */}
                        <DataTable
                            columns={columns}
                            data={communityReports.map(report => ({
                                ...report,
                                urgency: (
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.urgency === 'High' ? 'bg-red-100 text-red-600' :
                                        report.urgency === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                        {report.urgency}
                                    </span>
                                ),
                                status: (
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.status === 'Active' ? 'bg-red-100 text-red-600' :
                                        report.status === 'Monitoring' ? 'bg-blue-100 text-blue-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                        {report.status}
                                    </span>
                                )
                            }))}
                        />
                    </div>
                </div>

                {/* AI Insights Panel */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-6 animate-stagger-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-gradient-ai rounded-xl">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">AI Predictions</h2>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            <AIInsightCard
                                message="Your wellness trend is improving. Keep up current habits for optimal health"
                                icon="📈"
                            />
                            <AIInsightCard
                                message="Sleep consistency is excellent. This correlates with 15% better focus"
                                icon="😴"
                            />
                            <AIInsightCard
                                message="Activity variability detected. Try maintaining consistent exercise schedule"
                                icon="🏃"
                            />
                            <AIInsightCard
                                message="Community air quality alert in your area. Consider indoor exercise today"
                                icon="🌫️"
                            />
                            <AIInsightCard
                                message="Based on your health profile, risk of seasonal illness is low"
                                icon="🛡️"
                            />
                        </div>

                        {/* Microcopy */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-xs text-center text-slate-600">
                                AI interprets your personal and community health data to provide actionable insights
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Report Modal */}
            {showReportForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReportForm(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Submit Community Health Report</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Report Type</label>
                                <select className="input-field">
                                    <option>Air Quality Issue</option>
                                    <option>Water Quality Issue</option>
                                    <option>Disease Outbreak</option>
                                    <option>Food Safety Concern</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea className="input-field" placeholder="Provide details about the health concern" rows={4} />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Location</label>
                                <input type="text" className="input-field" placeholder="Area or address" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Optional Images</label>
                                <input type="file" className="input-field" accept="image/*" multiple />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowReportForm(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    Submit Report
                                </button>
                            </div>
                            <p className="text-xs text-center text-emerald-600 flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Your report will help improve community health insights
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthInsights;
