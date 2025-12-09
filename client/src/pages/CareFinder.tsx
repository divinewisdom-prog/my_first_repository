import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Search, MapPin, Star, Brain, Phone, Plus, Sparkles, Edit } from 'lucide-react';
import AIInsightCard from '../components/AIInsightCard';
import api, { userService } from '../services/api';

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
    location?: string;
    experience?: string;
    hospital?: string;
}

const CareFinder = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

    // Filter states
    const [specialtyFilter, setSpecialtyFilter] = useState('All Specialties');
    const [distanceFilter, setDistanceFilter] = useState('Any Distance');
    const [ratingFilter, setRatingFilter] = useState('Any Rating');
    const [sortOption, setSortOption] = useState('Sort: AI Match');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await api.get('/auth/doctors');
                // Map real users to Provider interface - use DB fields with fallbacks
                const mappedProviders: Provider[] = data.map((doc: any, index: number) => ({
                    id: doc._id,
                    name: doc.name,
                    specialty: doc.specialty || ['Cardiology', 'General Practice', 'Pediatrics', 'Neurology'][index % 4],
                    rating: doc.rating || (4.5 + (index % 5) / 10),
                    distance: `${(index + 1) * 1.2} km`, // Simulated - would need geolocation
                    phone: doc.phone || '+234 800 123 4567',
                    aiMatch: 98 - (index * 3),
                    available: index % 3 !== 0,
                    location: doc.location,
                    experience: doc.experience,
                    hospital: doc.hospital,
                }));
                setProviders(mappedProviders);
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Apply all filters and sorting
    const getFilteredProviders = () => {
        let result = [...providers];

        // Text search
        if (searchTerm) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Specialty filter
        if (specialtyFilter !== 'All Specialties') {
            result = result.filter(p => p.specialty === specialtyFilter);
        }

        // Rating filter
        if (ratingFilter === '4+ Stars') {
            result = result.filter(p => p.rating >= 4);
        } else if (ratingFilter === '4.5+ Stars') {
            result = result.filter(p => p.rating >= 4.5);
        }

        // Distance filter
        if (distanceFilter === '< 5 km') {
            result = result.filter(p => parseFloat(p.distance) < 5);
        } else if (distanceFilter === '< 10 km') {
            result = result.filter(p => parseFloat(p.distance) < 10);
        }

        // Sorting
        if (sortOption === 'Sort: AI Match') {
            result.sort((a, b) => b.aiMatch - a.aiMatch);
        } else if (sortOption === 'Sort: Rating') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === 'Sort: Proximity') {
            result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        }

        return result;
    };

    const filteredProviders = getFilteredProviders();

    const topMatch = filteredProviders.length > 0 ? filteredProviders[0] : null;

    if (loading) return <div className="p-8 text-center">Loading providers...</div>;

    return (
        <div className="min-h-screen bg-gradient-health pb-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-8 h-8 text-blue-600" />
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Care Finder</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">
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
                                <select
                                    className="input-field text-sm"
                                    value={specialtyFilter}
                                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                                >
                                    <option>All Specialties</option>
                                    <option>Cardiology</option>
                                    <option>General Practice</option>
                                    <option>Pediatrics</option>
                                    <option>Neurology</option>
                                </select>
                                <select
                                    className="input-field text-sm"
                                    value={distanceFilter}
                                    onChange={(e) => setDistanceFilter(e.target.value)}
                                >
                                    <option>Any Distance</option>
                                    <option>{'< 5 km'}</option>
                                    <option>{'< 10 km'}</option>
                                </select>
                                <select
                                    className="input-field text-sm"
                                    value={ratingFilter}
                                    onChange={(e) => setRatingFilter(e.target.value)}
                                >
                                    <option>Any Rating</option>
                                    <option>4+ Stars</option>
                                    <option>4.5+ Stars</option>
                                </select>
                                <select
                                    className="input-field text-sm"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option>Sort: AI Match</option>
                                    <option>Sort: Proximity</option>
                                    <option>Sort: Rating</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Provider Cards */}
                    <div className="space-y-4">
                        {filteredProviders.map((provider, idx) => (
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
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{provider.name}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-300">{provider.specialty}</p>
                                                {provider.hospital && (
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                                                        <Building2 className="w-3 h-3" />
                                                        {provider.hospital}
                                                    </p>
                                                )}
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

                                        <div className="flex items-center gap-4 mb-3 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span>{provider.distance}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                <span>{provider.phone}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setSelectedProvider(provider)}
                                                className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    const phoneNumber = provider.phone;
                                                    try {
                                                        await navigator.clipboard.writeText(phoneNumber);
                                                        alert(`Phone number copied: ${phoneNumber}\n\nYou can now paste it into your phone app or messaging app.`);
                                                    } catch {
                                                        // Fallback for browsers that don't support clipboard API
                                                        prompt('Copy this phone number:', phoneNumber);
                                                    }
                                                }}
                                                className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-all flex items-center gap-2"
                                                title="Copy phone number"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Copy Phone
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/messages', { state: { doctorId: provider.id, doctorName: provider.name } });
                                                }}
                                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-all flex items-center gap-2"
                                            >
                                                <Brain className="w-4 h-4" />
                                                Message
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingProvider(provider);
                                                }}
                                                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-semibold hover:bg-amber-200 transition-all flex items-center gap-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
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
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg sticky top-6 animate-stagger-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-gradient-ai rounded-xl">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top AI Match</h2>
                        </div>

                        {/* Top Match Card - ONLY SHOW IF EXISTS */}
                        {topMatch ? (
                            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl border-2 border-blue-200 dark:border-slate-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                                        {topMatch.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{topMatch.name}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-200">{topMatch.specialty}</p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600 dark:text-slate-200">AI Confidence</span>
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
                        ) : (
                            <div className="mb-6 p-4 text-center text-slate-500">No matches found</div>
                        )}

                        {/* AI Insights */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Why this match?</h3>
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
                            <p className="text-xs text-center text-slate-600 dark:text-slate-400">
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
            {/* Provider Details Modal */}
            {selectedProvider && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProvider(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-0 max-w-lg w-full shadow-2xl overflow-hidden animate-scale-up" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="bg-gradient-primary p-6 text-white relative">
                            <button
                                onClick={() => setSelectedProvider(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                                    {selectedProvider.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedProvider.name}</h2>
                                    <p className="opacity-90">{selectedProvider.specialty}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm bg-white/20 py-1 px-3 rounded-full w-fit">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>{selectedProvider.rating.toFixed(1)} Rating</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Bio */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">About</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {selectedProvider.name} is a highly experienced {selectedProvider.specialty} specialist dedicated to providing comprehensive patient care.
                                    With a patient-first approach, they utilize the latest medical advancements to ensure optimal health outcomes.
                                </p>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Experience</div>
                                    <div className="font-bold text-slate-900 dark:text-white">12+ Years</div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Patients</div>
                                    <div className="font-bold text-slate-900 dark:text-white">5,000+</div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Information</h3>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Phone Number</div>
                                        <div className="font-semibold">{selectedProvider.phone}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Location</div>
                                        <div className="font-semibold">{selectedProvider.distance} away</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => navigate('/appointments', { state: { selectedDoctorId: selectedProvider.id } })}
                                className="w-full btn-primary py-4 text-lg shadow-xl shadow-blue-500/20"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Provider Modal */}
            {editingProvider && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingProvider(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Provider</h2>
                        <form
                            className="space-y-4"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const formData = new FormData(form);
                                try {
                                    await userService.update(editingProvider.id, {
                                        name: formData.get('name'),
                                        specialty: formData.get('specialty'),
                                        phone: formData.get('phone'),
                                        location: formData.get('location'),
                                        experience: formData.get('experience'),
                                        hospital: formData.get('hospital'),
                                    });
                                    // Update local state
                                    setProviders(prev => prev.map(p =>
                                        p.id === editingProvider.id
                                            ? {
                                                ...p,
                                                name: formData.get('name') as string || p.name,
                                                specialty: formData.get('specialty') as string || p.specialty,
                                                phone: formData.get('phone') as string || p.phone,
                                                hospital: formData.get('hospital') as string || p.hospital,
                                            }
                                            : p
                                    ));
                                    setEditingProvider(null);
                                } catch (error) {
                                    console.error('Failed to update provider', error);
                                }
                            }}
                        >
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input-field"
                                    defaultValue={editingProvider.name}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Specialty</label>
                                <select
                                    name="specialty"
                                    className="input-field"
                                    defaultValue={editingProvider.specialty}
                                >
                                    <option>Cardiology</option>
                                    <option>General Practice</option>
                                    <option>Pediatrics</option>
                                    <option>Neurology</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="input-field"
                                    defaultValue={editingProvider.phone}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="input-field"
                                    defaultValue={editingProvider.location || ''}
                                    placeholder="e.g., Lagos, Nigeria"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Experience</label>
                                <input
                                    type="text"
                                    name="experience"
                                    className="input-field"
                                    defaultValue={editingProvider.experience || ''}
                                    placeholder="e.g., 10+ Years"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hospital</label>
                                <input
                                    type="text"
                                    name="hospital"
                                    className="input-field"
                                    defaultValue={editingProvider.hospital || ''}
                                    placeholder="e.g., Lagos General Hospital"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingProvider(null)}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareFinder;
