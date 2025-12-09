import mongoose, { Document } from 'mongoose';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    conversation: mongoose.Types.ObjectId;
    content: string;
    read: boolean;
    createdAt: Date;
}

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }
}, { timestamps: true });

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
