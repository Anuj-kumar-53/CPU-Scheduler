import './loadEnv.js';
import mongoose from 'mongoose';
import User from './models/User.js';

async function test() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected');

        const testEmail = `test_${Date.now()}@example.com`;
        console.log(`Creating user with email: ${testEmail}`);

        const user = new User({
            name: 'Test User',
            email: testEmail,
            password: 'password123',
            authProvider: 'local'
        });

        await user.save();
        console.log('✅ User saved successfully');

        const foundUser = await User.findOne({ email: testEmail });
        console.log('✅ Found user:', foundUser.email);

    } catch (error) {
        console.error('❌ Test failed:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

test();
