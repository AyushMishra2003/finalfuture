const mongoose = require('mongoose');
const User = require('./models/User');
const CollectorFolder = require('./models/CollectorFolder');
const TimeSlot = require('./models/TimeSlot');
const Order = require('./models/Order'); // Optional, but good if we want to fake an order ID
require('dotenv').config();

const createDemoBooking = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Find the Collector
        const collectorPhone = '9876543210';
        const collector = await User.findOne({ phone: collectorPhone });

        if (!collector) {
            console.error('❌ Collector not found! Please run create-collector.js first.');
            process.exit(1);
        }

        // Ensure role is collector
        if (collector.role !== 'collector') {
            console.log('⚠️ User is not a collector. Updating role...');
            collector.role = 'collector';
            await collector.save();
        }

        console.log(`👨‍⚕️ Collector: ${collector.name} (${collector._id})`);

        // 2. Find or Create CollectorFolder
        let folder = await CollectorFolder.findOne({ phlebotomistId: collector._id });

        if (!folder) {
            console.log('📁 Creating Collector Folder...');
            folder = await CollectorFolder.create({
                name: 'Demo South Pune Team',
                phlebotomistId: collector._id,
                pincodes: ['411001', '411002', '411048'], // Added typical Pune pincodes
                maxOrdersPerHour: 5,
                workingHours: { start: 8, end: 20 },
                isActive: true
            });
            console.log('✅ Created Collector Folder');
        } else {
            console.log(`📁 Found Collector Folder: ${folder.name}`);
        }

        // 3. Create TimeSlot and Booking
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Use next hour for the booking
        const currentHour = new Date().getHours();
        const bookingHour = (currentHour + 1) > 23 ? 23 : currentHour + 1;

        console.log(`📅 Scheduling for today (${today.toISOString().split('T')[0]}) at ${bookingHour}:00`);

        let timeSlot = await TimeSlot.findOne({
            collectorFolderId: folder._id,
            date: today,
            hour: bookingHour
        });

        if (!timeSlot) {
            console.log('Creating new TimeSlot...');
            timeSlot = new TimeSlot({
                collectorFolderId: folder._id,
                date: today,
                hour: bookingHour,
                maxBookings: 5,
                currentBookings: 0,
                bookings: []
            });
        }

        // Create a Fake Booking
        const demoBooking = {
            orderId: new mongoose.Types.ObjectId(), // Fake Order ID
            patientName: "Rahul Sharma",
            patientPhone: "9876500001",
            status: "pending",
            bookedAt: new Date(),
            // Address isn't in the schema directly here? 
            // Wait, the GUIDE said: "patient: { name, phone, address... }" in the API response.
            // But the SCHEMA for TimeSlot `bookings` array only has patientName, patientPhone.
            // Let me check TimeSlot schema again.
            // Result of view_file backend/models/TimeSlot.js shows:
            // bookings: [{ orderId, patientName, patientPhone, status, ... }]
            // It does NOT have address directly in the booking object.

            // However, the dashboard needs an address.
            // Typically address comes from the Order.
            // If I don't have a real Order, the dashboard might fail to show address.
            // Let's check PHLEBOTOMIST_DASHBOARD_GUIDE.md again.
            // It says: "Get My Bookings" response includes "patient: { name, phone, address: {...} }"

            // This implies the API is probably populating the Order and pulling address from there.
            // So I should arguably create a real Order too.
        };

        // Create a real Order to ensure address works
        console.log('📝 Creating Demo Order...');
        const demoOrder = await Order.create({
            user: collector._id, // Just assign to collector for now, or random user
            orderItems: [{
                test: new mongoose.Types.ObjectId(), // Fake Test ID (required by schema)
                name: "Full Body Checkup",
                quantity: 1, // User provided qty, schema expects quantity
                price: 1500
            }],
            shippingAddress: {
                address: "Flat 402, Sunshine Towers",
                city: "Pune",
                postalCode: "411048",
                country: "India"
            },
            paymentMethod: "Cash",
            paymentResult: {
                id: "generated_id",
                status: "pending",
                update_time: String(Date.now()),
                email_address: "rahul@example.com"
            },
            itemsPrice: 1500,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: 1500,
            isPaid: false,
            isDelivered: false,
            createdAt: new Date()
        });

        demoBooking.orderId = demoOrder._id;

        timeSlot.bookings.push(demoBooking);
        timeSlot.currentBookings += 1;

        await timeSlot.save();

        console.log('✅ Demo Booking Added Successfully!');
        console.log(`   Patient: ${demoBooking.patientName}`);
        console.log(`   Address: ${demoOrder.shippingAddress.address}, ${demoOrder.shippingAddress.city}`);
        console.log(`   Status: pending`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createDemoBooking();
