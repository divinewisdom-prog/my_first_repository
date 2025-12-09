import { useNavigate } from 'react-router-dom';
import { User, Calendar, FileText, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SearchResult {
    id: string;
    type: 'patient' | 'doctor' | 'appointment' | 'record';
    title: string;
    subtitle: string;
    path: string;
}

interface SearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
    onClose: () => void;
    searchQuery: string;
}

const SearchResults = ({ results, isLoading, onClose, searchQuery }: SearchResultsProps) => {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleResultClick = (path: string) => {
        navigate(path);
        onClose();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'patient':
                return <User className="w-4 h-4" />;
            case 'appointment':
                return <Calendar className="w-4 h-4" />;
            case 'record':
                return <FileText className="w-4 h-4" />;
            default:
                return <User className="w-4 h-4" />;
        }
    };

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.type]) acc[result.type] = [];
        acc[result.type].push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    if (!searchQuery || searchQuery.length < 2) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50"
        >
            {isLoading ? (
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Searching...</p>
                </div>
            ) : results.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400">No results found for "{searchQuery}"</p>
                </div>
            ) : (
                <div className="py-2">
                    {Object.entries(groupedResults).map(([type, items]) => (
                        <div key={type} className="mb-2 last:mb-0">
                            <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {type}s
                            </div>
                            {items.slice(0, 5).map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleResultClick(result.path)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        {getIcon(type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                            {result.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {result.subtitle}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500"
                title="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default SearchResults;
