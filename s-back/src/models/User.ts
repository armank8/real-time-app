import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string; // hashed
  name: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;