import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: string;
  content: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;