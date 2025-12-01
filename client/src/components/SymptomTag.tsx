import { X } from 'lucide-react';

interface SymptomTagProps {
    symptom: string;
    onRemove?: () => void;
}

const SymptomTag = ({ symptom, onRemove }: SymptomTagProps) => {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-full text-sm font-medium text-slate-700">
            <span>{symptom}</span>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="w-4 h-4 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center transition-colors"
                >
                    <X className="w-3 h-3 text-emerald-700" />
                </button>
            )}
        </div>
    );
};

export default SymptomTag;
