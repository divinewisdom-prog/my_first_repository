import { useState } from 'react';
import { Building2, Search, MapPin, Star, Brain, Phone, Plus, Sparkles } from 'lucide-react';
import AIInsightCard from '../components/AIInsightCard';

interface Provider {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    distance: string;
    phone: string;
    aiMatch: number;
    available: boolean;
    photo?: string;
}

const CareFinder = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // Mock data
    const providers: Provider[] = [
        {
            id: '1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            rating: 4.9,
            distance: '2.5 km',
            phone: '+234 800 123 4567',
            aiMatch: 95,
            available: true
        },
        {
            id: '2',
            name: 'Dr. Michael Chen',
            specialty: 'General Practice',
            rating: 4.7,
            distance: '1.2 km',
            phone: '+234 800 987 6543',
            aiMatch: 88,
            available: true
        },
        {
            id: '3',
            name: 'Dr. Emily Williams',
            specialty: 'Pediatrics',
            rating: 4.8,
            distance: '3.8 km',
            phone: '+234 800 555 1234',
            aiMatch: 82,
            available: false
        }
    ];

    const topMatch = providers[0];

    return (
        <div className="min-h-screen bg-gradient-health pb-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-8 h-8 text-blue-600" />
                    <h1 className="text-4xl font-bold text-slate-900">Care Finder</h1>
                </div>
                <p className="text-slate-600 text-lg mb-4">
                    Find the right provider for your health needs
                </p>

                {/* AI Matching Badge */}
                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-2xl p-4 inline-flex items-center gap-3 animate-slide-up">
                    <div className="animate-ai-pulse">
                        <Brain className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                        AI matching your needs in real-time…
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Search & Filter Panel */}
                    <div className="card-premium animate-stagger-1">
                        <div className="space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name, specialty, or location"
                                    className="input-field pl-12"
                                />
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <select className="input-field text-sm">
                                    <option>All Specialties</option>
                                    <option>Cardiology</option>
                                    <option>General Practice</option>
                                    <option>Pediatrics</option>
                                </select>
                                <select className="input-field text-sm">
                                    <option>Any Distance</option>
                                    <option>{'< 5 km'}</option>
                                    <option>{'< 10 km'}</option>
                                </select>
                                <select className="input-field text-sm">
                                    <option>Any Rating</option>
                                    <option>4+ Stars</option>
                                    <option>4.5+ Stars</option>
                                </select>
                                <select className="input-field text-sm">
                                    <option>Sort: AI Match</option>
                                    <option>Sort: Proximity</option>
                                    <option>Sort: Rating</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Provider Cards */}
                    <div className="space-y-4">
                        {providers.map((provider, idx) => (
                            <div
                                key={provider.id}
                                className={`card-premium hover:scale-[1.02] transition-all cursor-pointer animate-stagger-${idx + 2}`}
                            >
                                <div className="flex items-start gap-6">
                                    {/* Provider Photo */}
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                        {provider.name.split(' ').map(n => n[0]).join('')}
                                    </div>

                                    {/* Provider Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{provider.name}</h3>
                                                <p className="text-sm text-slate-600">{provider.specialty}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="px-3 py-1 bg-gradient-ai text-white text-xs font-bold rounded-full">
                                                    {provider.aiMatch}% Match
                                                </div>
                                                {provider.available && (
                                                    <span className="text-xs text-green-600 font-semibold">Available</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                <span className="font-semibold">{provider.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span>{provider.distance}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                                                View Profile
                                            </button>
                                            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Provider Button */}
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full card-premium border-2 border-dashed border-slate-300 hover:border-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2 py-6"
                    >
                        <Plus className="w-6 h-6 text-primary" />
                        <span className="text-primary font-semibold">Add New Provider</span>
                    </button>
                </div>

                {/* AI Recommendation Panel */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-6 animate-stagger-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-gradient-ai rounded-xl">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Top AI Match</h2>
                        </div>

                        {/* Top Match Card */}
                        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                                    {topMatch.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{topMatch.name}</h3>
                                    <p className="text-sm text-slate-600">{topMatch.specialty}</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600">AI Confidence</span>
                                    <span className="font-bold text-emerald-600">{topMatch.aiMatch}%</span>
                                </div>
                                <div className="h-2 bg-white rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-ai transition-all duration-700"
                                        style={{ width: `${topMatch.aiMatch}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* AI Insights */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 mb-3">Why this match?</h3>
                            <AIInsightCard
                                message="Specialty aligns with your recent health concerns and wellness goals"
                                icon="🎯"
                            />
                            <AIInsightCard
                                message="High patient satisfaction ratings and excellent availability"
                                icon="⭐"
                            />
                            <AIInsightCard
                                message="Closest provider with expertise in your health profile"
                                icon="📍"
                            />
                        </div>

                        {/* Microcopy */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-xs text-center text-slate-600">
                                Top providers based on your wellness needs
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Provider Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Provider</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Name</label>
                                <input type="text" className="input-field" placeholder="Dr. John Doe" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Specialty</label>
                                <input type="text" className="input-field" placeholder="Cardiology" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Phone</label>
                                <input type="tel" className="input-field" placeholder="+234 800 000 0000" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Address</label>
                                <textarea className="input-field" placeholder="123 Medical St, Lagos" rows={3} />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Notes</label>
                                <textarea className="input-field" placeholder="Additional information" rows={2} />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    Add Provider
                                </button>
                            </div>
                            <p className="text-xs text-center text-emerald-600 flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Provider added and analyzed by AI
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareFinder;
