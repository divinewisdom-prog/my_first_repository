import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message';
import Conversation from './models/Conversation';

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userName?: string;
}

let io: Server;

export const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: ['https://welllink-health.vercel.app', 'http://localhost:5173'],
            credentials: true
        }
    });

    // Authentication middleware
    io.use((socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
        console.log(`User connected: ${socket.userId}`);

        // Join personal room for receiving messages
        if (socket.userId) {
            socket.join(socket.userId);
        }

        // Handle joining a conversation room
        socket.on('joinConversation', (conversationId: string) => {
            socket.join(`conversation:${conversationId}`);
            console.log(`User ${socket.userId} joined conversation ${conversationId}`);
        });

        // Handle leaving a conversation room
        socket.on('leaveConversation', (conversationId: string) => {
            socket.leave(`conversation:${conversationId}`);
        });

        // Handle sending a message
        socket.on('sendMessage', async (data: { receiverId: string; content: string; conversationId?: string }) => {
            try {
                const { receiverId, content, conversationId: existingConvId } = data;
                const senderId = socket.userId;

                if (!senderId || !receiverId || !content) return;

                // Find or create conversation
                let conversation;
                if (existingConvId) {
                    conversation = await Conversation.findById(existingConvId);
                }

                if (!conversation) {
                    conversation = await Conversation.findOne({
                        participants: { $all: [senderId, receiverId] }
                    });
                }

                if (!conversation) {
                    conversation = await Conversation.create({
                        participants: [senderId, receiverId]
                    });
                }

                // Create message
                const message = await Message.create({
                    sender: senderId,
                    receiver: receiverId,
                    conversation: conversation._id,
                    content
                });

                // Update conversation
                conversation.lastMessage = message._id;
                await conversation.save();

                // Populate message
                const populatedMessage = await Message.findById(message._id)
                    .populate('sender', 'name')
                    .populate('receiver', 'name');

                // Emit to conversation room
                io.to(`conversation:${conversation._id}`).emit('newMessage', populatedMessage);

                // Also emit to receiver's personal room (in case they're not in the conversation)
                io.to(receiverId).emit('messageNotification', {
                    message: populatedMessage,
                    conversationId: conversation._id
                });

            } catch (error) {
                console.error('Error sending message via socket:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle typing indicator
        socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
            socket.to(`conversation:${data.conversationId}`).emit('userTyping', {
                userId: socket.userId,
                isTyping: data.isTyping
            });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

export const getIO = () => io;
