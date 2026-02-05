const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('🧪 Testing Collector Login API...\n');

        const response = await axios.post('http://localhost:5000/api/v1/collector/login', {
            phone: '9876543210',
            password: 'collector123'
        });

        console.log('✅ Login Successful!');
        console.log('\n📋 Response:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Login Failed!');
        console.error('\n📋 Error Response:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

testLogin();
