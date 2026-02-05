const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('🧪 Testing Collector Login API...');

        // Use 127.0.0.1 instead of localhost to avoid IPv6 issues
        const response = await axios.post('http://127.0.0.1:5000/api/v1/collector/login', {
            phone: '9876543210',
            password: 'WRONG_PASSWORD'
        });

        console.log('✅ Login Successful!');
        console.log(response.data);

    } catch (error) {
        console.error('❌ Login Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data.error);
            console.error('Details:', error.response.data.details); // This will show the real error
            console.error('Stack:', error.response.data.stack?.split('\n')[0]); // First line of stack
        } else {
            console.error('Connection Error:', error.message);
        }
    }
};

testLogin();
