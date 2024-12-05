import mongoose from 'mongoose';
import { config } from './config';

async function connectDB() {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        });

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        await mongoose.connect(config.MONGODB_URI as string);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectDB;
