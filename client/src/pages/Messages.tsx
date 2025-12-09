import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Send, ArrowLeft, Search } from 'lucide-react';
import api from '../services/api';
import socketService from '../services/socketService';

interface Message {
    _id: string;
    sender: { _id: string; name: string };
    receiver: { _id: string; name: string };
    content: string;
    read: boolean;
    createdAt: string;
}

interface Participant {
    _id: string;
    name: string;
    email: string;
    role: string;
    specialty?: string;
}

interface Conversation {
    _id: string;
    participants: Participant[];
    lastMessage?: Message;
    updatedAt: string;
}

const Messages = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [otherTyping, setOtherTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Initialize Socket.io connection
    useEffect(() => {
        if (token) {
            socketService.connect(token);

            // Listen for new messages
            socketService.onNewMessage((message) => {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            });

            // Listen for message notifications
            socketService.onMessageNotification(() => {
                fetchConversations();
            });

            // Listen for typing indicator
            socketService.onUserTyping((data) => {
                if (data.userId !== currentUser._id) {
                    setOtherTyping(data.isTyping);
                }
            });
        }

        return () => {
            socketService.offNewMessage();
            socketService.offMessageNotification();
            socketService.offUserTyping();
            socketService.disconnect();
        };
    }, [token]);

    // Fetch conversations on mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Check if navigated with a doctorId
    useEffect(() => {
        const state = location.state as { doctorId?: string; doctorName?: string };
        if (state?.doctorId) {
            startConversation(state.doctorId);
        }
    }, [location.state]);

    // Join/leave conversation room when selected
    useEffect(() => {
        if (selectedConversation) {
            socketService.joinConversation(selectedConversation._id);
        }
        return () => {
            if (selectedConversation) {
                socketService.leaveConversation(selectedConversation._id);
            }
        };
    }, [selectedConversation]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/messages/conversations');
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId: string) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/messages/${conversationId}`);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const startConversation = async (doctorId: string) => {
        try {
            const { data } = await api.get(`/messages/conversation/${doctorId}`);
            setSelectedConversation(data);
            fetchMessages(data._id);
            navigate(location.pathname, { replace: true });
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    const selectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation._id);
        setOtherTyping(false);
    };

    const handleTyping = () => {
        if (!isTyping && selectedConversation) {
            setIsTyping(true);
            socketService.sendTyping(selectedConversation._id, true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            if (selectedConversation) {
                socketService.sendTyping(selectedConversation._id, false);
            }
        }, 2000);
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const otherParticipant = selectedConversation.participants.find(
            p => p._id !== currentUser._id
        );

        if (!otherParticipant) return;

        // Send via Socket.io
        socketService.sendMessage(
            otherParticipant._id,
            newMessage.trim(),
            selectedConversation._id
        );

        // Clear input and typing
        setNewMessage('');
        setIsTyping(false);
        socketService.sendTyping(selectedConversation._id, false);

        // Refresh conversations
        fetchConversations();
    };

    const getOtherParticipant = (conversation: Conversation): Participant | undefined => {
        return conversation.participants.find(p => p._id !== currentUser._id);
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (d.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const other = getOtherParticipant(conv);
        return other?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gradient-health">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Messages</h1>
                    <p className="text-slate-600 dark:text-slate-400">Real-time chat with your healthcare providers</p>
                </div>
                {socketService.isConnected() && (
                    <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Live
                    </span>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                <div className="flex h-full">
                    {/* Conversation List */}
                    <div className={`w-full md:w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                        {/* Search */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Conversations */}
                        <div className="flex-1 overflow-y-auto">
                            {loading && conversations.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">Loading...</div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <MessageCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                    <p className="text-slate-500">No conversations yet</p>
                                    <p className="text-sm text-slate-400 mt-1">Start chatting with a doctor from Care Finder</p>
                                </div>
                            ) : (
                                filteredConversations.map(conv => {
                                    const other = getOtherParticipant(conv);
                                    return (
                                        <div
                                            key={conv._id}
                                            onClick={() => selectConversation(conv)}
                                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedConversation?._id === conv._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {other?.name.split(' ').map(n => n[0]).join('') || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="font-semibold truncate">{other?.name || 'Unknown'}</h3>
                                                    <span className="text-xs text-slate-500">{formatDate(conv.updatedAt)}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 truncate">
                                                    {other?.specialty && (
                                                        <span className="text-blue-600 dark:text-blue-400">{other.specialty} • </span>
                                                    )}
                                                    {conv.lastMessage?.content || 'No messages yet'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Message Thread */}
                    <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedConversation(null)}
                                        className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                                        {getOtherParticipant(selectedConversation)?.name.split(' ').map(n => n[0]).join('') || '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{getOtherParticipant(selectedConversation)?.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            {otherTyping ? (
                                                <span className="text-blue-600 animate-pulse">typing...</span>
                                            ) : (
                                                getOtherParticipant(selectedConversation)?.specialty || getOtherParticipant(selectedConversation)?.role
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map(msg => (
                                            <div
                                                key={msg._id}
                                                className={`flex ${msg.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] p-3 rounded-2xl ${msg.sender._id === currentUser._id
                                                            ? 'bg-gradient-primary text-white rounded-br-md'
                                                            : 'bg-slate-100 dark:bg-slate-700 rounded-bl-md'
                                                        }`}
                                                >
                                                    <p className="break-words">{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${msg.sender._id === currentUser._id ? 'text-white/70' : 'text-slate-500'
                                                        }`}>
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => {
                                                setNewMessage(e.target.value);
                                                handleTyping();
                                            }}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim()}
                                            className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <Send className="w-5 h-5" />
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageCircle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300">Select a conversation</h3>
                                    <p className="text-slate-500 mt-2">Choose a conversation from the list or start a new one</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
