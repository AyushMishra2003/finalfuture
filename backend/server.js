const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const bannerRoutes = require('./routes/banners');
const locationRoutes = require('./routes/locations');
const orderRoutes = require('./routes/orders');
const packageRoutes = require('./routes/packages');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');
const collectorFolderRoutes = require('./routes/collectorFolders');
const bookingRoutes = require('./routes/bookings');
const collectorRoutes = require('./routes/collector');
const adminOrderAssignmentRoutes = require('./routes/adminOrderAssignment');
const phlebotomistRoutes = require('./routes/phlebotomist');
const familyMemberRoutes = require('./routes/familyMembers');
const addressRoutes = require('./routes/addresses');


// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Database connection with better error handling
const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://futurelabsdesign:futurelab2025@futurelab-cluster.elb6u.mongodb.net/futurelabs?retryWrites=true&w=majority');
        console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.log('\n⚠️  MongoDB connection failed. The application will continue to run but without database functionality.');
        console.log('\nTroubleshooting tips:');
        console.log('1. Make sure MongoDB is installed and running on your system');
        console.log('2. Try starting MongoDB with one of these commands:');
        console.log('   - Windows: net start MongoDB');
        console.log('   - macOS: brew services start mongodb-community');
        console.log('   - Linux: sudo systemctl start mongod');
        console.log('3. If MongoDB is not installed, download it from: https://www.mongodb.com/try/download/community');
        console.log('4. As a temporary solution, you can use mock data in the frontend by setting USE_MOCK_DATA=true in frontend/src/utils/config.js');
    }
};

// Connect to database
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tests', testRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/admin/collector-folders', collectorFolderRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/collector', collectorRoutes);
app.use('/api/v1/admin/order-assignment', adminOrderAssignmentRoutes);
app.use('/api/v1/phlebotomist', phlebotomistRoutes);
app.use('/api/v1/family-members', familyMemberRoutes);
app.use('/api/v1/addresses', addressRoutes);


// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'success',
        message: 'FutureLabs API is running',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Catch-all handler: Send back React's index.html file for any non-API routes (production only)
app.get('*', (req, res) => {
    // Only serve build file in production
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    } else {
        // In development, return 404 for unknown routes
        res.status(404).json({
            status: 'error',
            message: `Route ${req.originalUrl} not found`
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`Health check endpoint: http://localhost:${PORT}/api/v1/health`);
});

module.exports = app;