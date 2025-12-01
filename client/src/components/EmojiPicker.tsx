interface EmojiPickerProps {
    label: string;
    value: string;
    onChange: (emoji: string) => void;
}

const moods = [
    { emoji: '😄', label: 'Great', value: 'great' },
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Low', value: 'low' },
    { emoji: '😢', label: 'Bad', value: 'bad' }
];

const EmojiPicker = ({ label, value, onChange }: EmojiPickerProps) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">{label}</label>
            <div className="flex gap-3 justify-between">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        type="button"
                        onClick={() => onChange(mood.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-110 ${value === mood.value
                                ? 'border-primary bg-blue-50 shadow-lg'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                            }`}
                        title={mood.label}
                    >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className="text-xs font-medium text-slate-600">{mood.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmojiPicker;
