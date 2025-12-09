import { Request, Response } from 'express';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import User from '../models/User';

// Get all conversations for the logged-in user
export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'name email role specialty')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get messages for a specific conversation
export const getMessages = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const userId = (req as any).user._id;

        // Verify user is part of this conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }

        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'name')
            .populate('receiver', 'name')
            .sort({ createdAt: 1 });

        // Mark unread messages as read
        await Message.updateMany(
            { conversation: conversationId, receiver: userId, read: false },
            { read: true }
        );

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Send a new message
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = (req as any).user._id;

        if (!receiverId || !content) {
            res.status(400).json({ message: 'Receiver and content are required' });
            return;
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

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

        // Update conversation's last message
        conversation.lastMessage = message._id;
        await conversation.save();

        // Populate and return
        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name')
            .populate('receiver', 'name');

        res.status(201).json({
            message: populatedMessage,
            conversationId: conversation._id
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Mark message as read
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user._id;

        const message = await Message.findOneAndUpdate(
            { _id: id, receiver: userId },
            { read: true },
            { new: true }
        );

        if (!message) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get or create conversation with a specific user
export const getOrCreateConversation = async (req: Request, res: Response) => {
    try {
        const { userId: otherUserId } = req.params;
        const currentUserId = (req as any).user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, otherUserId] }
        }).populate('participants', 'name email role specialty');

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [currentUserId, otherUserId]
            });
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'name email role specialty');
        }

        res.json(conversation);
    } catch (error) {
        console.error('Error getting/creating conversation:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
