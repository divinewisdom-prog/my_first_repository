interface QuickReplyProps {
    options: string[];
    onSelect: (option: string) => void;
}

const QuickReply = ({ options, onSelect }: QuickReplyProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 justify-end animate-fade-in">
            {options.map((option, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(option)}
                    className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 shadow-sm"
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default QuickReply;
