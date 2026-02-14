const https = require('https');
const querystring = require('querystring');

// Test bhashsms with different sender IDs
const testBhashSMS = async (senderId) => {
    const queryParams = querystring.stringify({
        user: 'futurelabssms',
        pass: '123456',
        sender: senderId,
        phone: '8115544102',
        text: 'Test message from FutureLabs'
    });

    const url = `/api/sendmsg.php?${queryParams}`;

    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'bhashsms.com',
            path: url,
            method: 'GET',
            timeout: 10000
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`\nSender ID: ${senderId}`);
                console.log(`Response: ${data}`);
                console.log(`Status: ${res.statusCode}`);
                resolve({ senderId, response: data, status: res.statusCode });
            });
        });

        req.on('error', (error) => {
            console.log(`\nSender ID: ${senderId}`);
            console.log(`Error: ${error.message}`);
            resolve({ senderId, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ senderId, error: 'Timeout' });
        });

        req.end();
    });
};

// Test common sender IDs
const testAllSenderIds = async () => {
    console.log('🧪 Testing bhashsms with different Sender IDs...\n');
    console.log('Credentials: futurelabssms / 123456\n');
    console.log('='.repeat(50));

    const senderIds = [
        'FULABS',      // Current
        'FUTLAB',      // Alternative
        'FLABS',       // Short form
        'TXTIND',      // Default bhashsms
        'SMSINF',      // Another default
    ];

    for (const senderId of senderIds) {
        await testBhashSMS(senderId);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n📋 Instructions:');
    console.log('1. Login to https://bhashsms.com/loginlanding.php');
    console.log('2. Go to "Sender ID" or "Settings" section');
    console.log('3. Check which Sender IDs are approved');
    console.log('4. Update .env file with the approved Sender ID');
    console.log('\nIf no Sender ID works, you need to:');
    console.log('- Register a new Sender ID in bhashsms dashboard');
    console.log('- Wait for approval (usually 1-2 days)');
    console.log('- Or use the default Sender ID provided by bhashsms');
};

testAllSenderIds();
