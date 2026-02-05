const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://futurelabsdesign:futurelab2025@futurelab-cluster.elb6u.mongodb.net/futurelabs?retryWrites=true&w=majority');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    isVerified: Boolean,
    createdAt: Date
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

const createCollector = async () => {
    try {
        await connectDB();

        // Delete existing collector if exists
        await User.deleteOne({ phone: '9876543210' });
        console.log('🗑️  Deleted old collector account (if existed)\n');

        // Create new collector with PLAIN TEXT password
        // The pre-save hook will hash it automatically
        const collector = new User({
            name: 'Test Collector',
            email: 'collector@futurelab.com',
            phone: '9876543210',
            password: 'collector123', // Plain text - will be hashed by pre-save hook
            role: 'collector',
            isVerified: true,
            createdAt: new Date()
        });

        await collector.save();
        console.log('✅ Collector account created successfully!');

        // Verify it was created
        const savedCollector = await User.findOne({ phone: '9876543210' }).select('+password');
        console.log('\n📋 Saved Collector Details:');
        console.log('   ID:', savedCollector._id);
        console.log('   Name:', savedCollector.name);
        console.log('   Phone:', savedCollector.phone);
        console.log('   Email:', savedCollector.email);
        console.log('   Role:', savedCollector.role);
        console.log('   Verified:', savedCollector.isVerified);

        // Test password match
        const testPassword = 'collector123';
        const isMatch = await savedCollector.matchPassword(testPassword);
        console.log('\n🧪 Password Test:');
        console.log('   Testing password:', testPassword);
        console.log('   Match result:', isMatch ? '✅ PASS' : '❌ FAIL');

        if (isMatch) {
            console.log('\n✅ SUCCESS! Password is correctly hashed and verified!');
        } else {
            console.log('\n❌ FAIL! Password verification failed!');
        }

        console.log('\n🔑 Login Credentials:');
        console.log('   Phone: 9876543210');
        console.log('   Password: collector123');
        console.log('\n🚀 Login at: http://localhost:3000/phlebotomist/login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createCollector();
