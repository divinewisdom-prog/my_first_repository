import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { patientService, appointmentService, userService } from '../services/api';
import SearchResults from './SearchResults';

interface NavbarProps {
    onMenuClick: () => void;
}

interface SearchResult {
    id: string;
    type: 'patient' | 'doctor' | 'appointment' | 'record';
    title: string;
    subtitle: string;
    path: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Load theme preference on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Apply dark mode class when toggled
    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Debounced search function
    const performSearch = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        setShowResults(true);

        try {
            const promises = [];
            // Only fetch patients if user is doctor or admin
            if (['doctor', 'admin'].includes(user?.role?.toLowerCase() || '')) {
                promises.push(patientService.getAll().catch(() => []));
            } else {
                promises.push(Promise.resolve([]));
            }

            // Fetch appointments (everyone can search their own appointments)
            promises.push(appointmentService.getAll().catch(() => []));

            // Fetch doctors (everyone can search for doctors)
            promises.push(userService.getDoctors().catch(() => []));

            const [patients, appointments, doctors] = await Promise.all(promises);

            const results: SearchResult[] = [];
            const lowerQuery = query.toLowerCase();

            // Search patients
            if (Array.isArray(patients)) {
                patients.forEach((patient: any) => {
                    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
                    const email = patient.email?.toLowerCase() || '';

                    if (fullName.includes(lowerQuery) || email.includes(lowerQuery)) {
                        results.push({
                            id: patient._id,
                            type: 'patient',
                            title: `${patient.firstName} ${patient.lastName}`,
                            subtitle: patient.email || 'No email',
                            path: `/patients/${patient._id}`,
                        });
                    }
                });
            }

            // Search appointments
            if (Array.isArray(appointments)) {
                appointments.forEach((apt: any) => {
                    const patientName = apt.patient
                        ? `${apt.patient.firstName} ${apt.patient.lastName}`.toLowerCase()
                        : '';
                    const doctorName = apt.doctor?.name?.toLowerCase() || '';
                    const date = new Date(apt.date).toLocaleDateString();

                    // Search by patient name, doctor name, or date
                    if (patientName.includes(lowerQuery) || doctorName.includes(lowerQuery)) {
                        results.push({
                            id: apt._id,
                            type: 'appointment',
                            title: patientName ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown Patient',
                            subtitle: `${apt.doctor?.name || 'Unknown Doctor'} - ${date}`,
                            path: '/appointments',
                        });
                    }
                });
            }

            // Search doctors
            if (Array.isArray(doctors)) {
                doctors.forEach((doctor: any) => {
                    const name = doctor.name?.toLowerCase() || '';
                    const specialty = doctor.role?.toLowerCase() || '';

                    if (name.includes(lowerQuery) || specialty.includes(lowerQuery)) {
                        results.push({
                            id: doctor._id,
                            type: 'doctor',
                            title: doctor.name,
                            subtitle: 'Doctor',
                            path: `/care-finder?search=${encodeURIComponent(doctor.name)}`,
                        });
                    }
                });
            }

            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [user]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCloseResults = () => {
        setShowResults(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowResults(false);
            setSearchQuery('');
        }
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 fixed top-0 right-0 left-0 md:left-64 z-10 transition-colors">
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="relative w-64 hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search patients, doctors, records..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    {showResults && (
                        <SearchResults
                            results={searchResults}
                            isLoading={isSearching}
                            onClose={handleCloseResults}
                            searchQuery={searchQuery}
                        />
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    title="Toggle Dark Mode"
                >
                    {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
                </button>



                <Link
                    to="/settings"
                    className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors cursor-pointer"
                    title="View Profile"
                >
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'Dr. Smith'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role || 'Cardiologist'}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0) || 'D'}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
