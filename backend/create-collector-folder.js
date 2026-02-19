const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const CollectorFolder = require('./models/CollectorFolder');
const User = require('./models/User');

const createCollectorFolder = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://futurelabsdesign:futurelab2025@futurelab-cluster.elb6u.mongodb.net/futurelabs?retryWrites=true&w=majority');
        console.log('✅ Connected to MongoDB');

        // Find phlebotomist user
        const phlebotomist = await User.findOne({ phone: '9876543210' });
        
        if (!phlebotomist) {
            console.log('❌ Phlebotomist not found. Creating one...');
            const newPhlebotomist = await User.create({
                name: 'Test Collector',
                phone: '9876543210',
                email: 'collector@test.com',
                password: 'collector123',
                role: 'phlebotomist'
            });
            console.log('✅ Phlebotomist created:', newPhlebotomist.name);
        } else {
            console.log('✅ Found phlebotomist:', phlebotomist.name);
        }

        // Check if collector folder already exists
        const existingFolder = await CollectorFolder.findOne({ name: 'Main Collection Team' });
        
        if (existingFolder) {
            console.log('✅ Collector folder already exists:', existingFolder.name);
            console.log('   Pincodes:', existingFolder.pincodes.join(', '));
            process.exit(0);
        }

        // Create collector folder
        const collectorFolder = await CollectorFolder.create({
            name: 'Main Collection Team',
            phlebotomistId: phlebotomist ? phlebotomist._id : null,
            pincodes: ['560001', '560002', '560003', '560004', '560005'],
            maxOrdersPerHour: 5,
            workingHours: {
                start: 8,
                end: 18
            },
            isActive: true
        });

        console.log('\n🎉 Collector Folder Created Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Name:', collectorFolder.name);
        console.log('Phlebotomist:', phlebotomist ? phlebotomist.name : 'Not assigned');
        console.log('Pincodes:', collectorFolder.pincodes.join(', '));
        console.log('Max Orders/Hour:', collectorFolder.maxOrdersPerHour);
        console.log('Working Hours:', `${collectorFolder.workingHours.start}:00 - ${collectorFolder.workingHours.end}:00`);
        console.log('Status:', collectorFolder.isActive ? 'Active' : 'Inactive');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('✅ Setup complete! You can now assign collectors to orders.');
        console.log('🌐 Test API: http://localhost:5000/api/v1/admin/collector-folders');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createCollectorFolder();
