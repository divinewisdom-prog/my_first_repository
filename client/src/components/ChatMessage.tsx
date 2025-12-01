import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    message: string;
    isBot: boolean;
    timestamp?: Date;
    isTyping?: boolean;
}

const ChatMessage = ({ message, isBot, timestamp, isTyping = false }: ChatMessageProps) => {
    return (
        <div className={`flex gap-3 mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
            {isBot && (
                <div className="w-10 h-10 rounded-full bg-gradient-ai flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                </div>
            )}

            <div className={`max-w-[70%] ${isBot ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-5 py-3 ${isBot
                        ? 'bg-white shadow-md border border-slate-100'
                        : 'bg-gradient-primary text-white'
                    }`}>
                    {isTyping ? (
                        <div className="flex gap-1 py-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    ) : (
                        <p className={`text-sm leading-relaxed ${isBot ? 'text-slate-700' : 'text-white'}`}>
                            {message}
                        </p>
                    )}
                </div>
                {timestamp && !isTyping && (
                    <p className="text-xs text-slate-400 mt-1 px-2">
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>

            {!isBot && (
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
