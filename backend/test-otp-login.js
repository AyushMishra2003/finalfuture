const axios = require('axios');

const testOTPLogin = async () => {
    try {
        const phone = '9876543210';
        
        console.log('📱 Testing OTP Login Flow...\n');
        
        // Step 1: Generate OTP
        console.log('Step 1: Generating OTP for', phone);
        const generateResponse = await axios.post('http://localhost:5000/api/v1/auth/otp/generate', {
            phone: phone
        });

        console.log('✅ OTP Generation Response:');
        console.log(JSON.stringify(generateResponse.data, null, 2));
        
        if (!generateResponse.data.success) {
            console.error('❌ Failed to generate OTP');
            return;
        }

        const otp = generateResponse.data.otp;
        console.log('\n🔑 OTP to use:', otp);

        // Wait 2 seconds before verifying
        console.log('\n⏳ Waiting 2 seconds before verification...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 2: Verify OTP
        console.log('\nStep 2: Verifying OTP');
        const verifyResponse = await axios.post('http://localhost:5000/api/v1/auth/otp/verify', {
            phone: phone,
            otp: otp
        });

        console.log('✅ OTP Verification Response:');
        console.log(JSON.stringify(verifyResponse.data, null, 2));

        if (verifyResponse.data.success) {
            console.log('\n🎉 Login Successful!');
            console.log('Token:', verifyResponse.data.token);
            console.log('User:', verifyResponse.data.data);
        }

    } catch (error) {
        console.error('❌ Test Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

testOTPLogin();
