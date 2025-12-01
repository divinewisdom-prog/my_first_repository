import { Sparkles } from 'lucide-react';

interface AIInsightCardProps {
    message: string;
    icon?: string;
}

const AIInsightCard = ({ message, icon = '💡' }: AIInsightCardProps) => {
    return (
        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-4 border-2 border-emerald-200/50 animate-fade-in hover:border-emerald-300 transition-all duration-300">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-ai rounded-full flex items-center justify-center animate-ai-pulse">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-slate-700 leading-relaxed">{message}</p>
                </div>
                <span className="text-xl flex-shrink-0">{icon}</span>
            </div>
        </div>
    );
};

export default AIInsightCard;
