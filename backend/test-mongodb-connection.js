const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://futurelabsdesign:futurelab2025@futurelab-cluster.elb6u.mongodb.net/futurelabs?retryWrites=true&w=majority';
    const dbName = 'futurelabs';

    console.log('Testing MongoDB connection...');
    console.log('URI:', uri);

    const client = new MongoClient(uri);

    try {
        console.log('\nAttempting to connect to MongoDB...');
        await client.connect();
        console.log('✅ Connected successfully to MongoDB server');

        const db = client.db(dbName);
        console.log(`✅ Database "${dbName}" is accessible`);

        // Try to list collections
        const collections = await db.listCollections().toArray();
        console.log(`✅ Found ${collections.length} collections:`);
        collections.forEach(collection => {
            console.log(`  - ${collection.name}`);
        });

        await client.close();
        console.log('\n✅ MongoDB connection test completed successfully');
        return true;
    } catch (error) {
        console.log('❌ Failed to connect to MongoDB:', error.message);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('\nTroubleshooting tips:');
            console.log('1. Make sure MongoDB is installed and running');
            console.log('2. Check if MongoDB is running on the default port (27017)');
            console.log('3. Verify your MONGODB_URI in the backend .env file');
            console.log('4. On Windows, you can start MongoDB with: net start MongoDB');
            console.log('5. On macOS/Linux, you can start MongoDB with: sudo systemctl start mongod');
        }

        return false;
    }
}

// Run the test
testMongoDBConnection().then(() => {
    console.log('\nMongoDB connection test completed.');
});