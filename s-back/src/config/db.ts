import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://armank:armank12@cluster0.y0bza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      dbName: 'real-time-chat',
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;