const mongoose = require('mongoose');
const User = require('./models/User');
const CollectorFolder = require('./models/CollectorFolder');
require('dotenv').config();

const setupPhlebotomist = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://futurelabsdesign:futurelab2025@futurelab-cluster.elb6u.mongodb.net/futurelabs?retryWrites=true&w=majority');
    
    console.log('🔍 Finding phlebotomist user...');
    
    // Find or create phlebotomist user
    let phlebotomist = await User.findOne({ role: 'collector' });
    
    if (!phlebotomist) {
      console.log('📝 Creating phlebotomist user...');
      phlebotomist = await User.create({
        name: 'John Collector',
        email: 'collector@futurelabs.com',
        phone: '9876543210',
        password: 'collector123',
        role: 'collector',
        isVerified: true
      });
      console.log('✅ Phlebotomist user created:', phlebotomist.name);
    } else {
      console.log('✅ Found phlebotomist:', phlebotomist.name);
    }

    // Check if collector folder exists
    let folder = await CollectorFolder.findOne({ phlebotomistId: phlebotomist._id });
    
    if (!folder) {
      console.log('📁 Creating collector folder...');
      folder = await CollectorFolder.create({
        name: 'Main Collection Team',
        phlebotomistId: phlebotomist._id,
        pincodes: ['560001', '560002', '560003', '560004', '560005'],
        maxOrdersPerHour: 5,
        workingHours: { start: 8, end: 18 },
        isActive: true
      });
      console.log('✅ Collector folder created:', folder.name);
    } else {
      console.log('✅ Collector folder exists:', folder.name);
    }

    console.log('\n🎉 Setup Complete!');
    console.log('\n📋 Login Credentials:');
    console.log('Phone: 9876543210');
    console.log('Password: collector123');
    console.log('\n🌐 Dashboard: http://localhost:3000/#/phlebotomist/dashboard');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

setupPhlebotomist();
