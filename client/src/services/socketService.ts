import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;
    private connected = false;

    connect(token: string): Socket {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.connected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        return this.connected && this.socket?.connected === true;
    }

    // Join a conversation room
    joinConversation(conversationId: string): void {
        this.socket?.emit('joinConversation', conversationId);
    }

    // Leave a conversation room
    leaveConversation(conversationId: string): void {
        this.socket?.emit('leaveConversation', conversationId);
    }

    // Send a message
    sendMessage(receiverId: string, content: string, conversationId?: string): void {
        this.socket?.emit('sendMessage', { receiverId, content, conversationId });
    }

    // Send typing indicator
    sendTyping(conversationId: string, isTyping: boolean): void {
        this.socket?.emit('typing', { conversationId, isTyping });
    }

    // Listen for new messages
    onNewMessage(callback: (message: any) => void): void {
        this.socket?.on('newMessage', callback);
    }

    // Listen for message notifications
    onMessageNotification(callback: (data: { message: any; conversationId: string }) => void): void {
        this.socket?.on('messageNotification', callback);
    }

    // Listen for typing indicator
    onUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void): void {
        this.socket?.on('userTyping', callback);
    }

    // Remove listeners
    offNewMessage(): void {
        this.socket?.off('newMessage');
    }

    offMessageNotification(): void {
        this.socket?.off('messageNotification');
    }

    offUserTyping(): void {
        this.socket?.off('userTyping');
    }
}

export const socketService = new SocketService();
export default socketService;
