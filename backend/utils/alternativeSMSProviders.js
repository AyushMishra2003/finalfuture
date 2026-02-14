// Alternative SMS Providers for India

// Option 1: Twilio (Most Reliable)
// Sign up: https://www.twilio.com
// Add to .env:
// TWILIO_ACCOUNT_SID=your_account_sid
// TWILIO_AUTH_TOKEN=your_auth_token
// TWILIO_PHONE_NUMBER=your_twilio_number

const sendSMSTwilio = async (options) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    try {
        const message = await client.messages.create({
            body: options.message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${options.phone}`
        });
        return { success: true, message: 'SMS sent via Twilio', sid: message.sid };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Option 2: MSG91 (Popular in India)
// Sign up: https://msg91.com
// Add to .env:
// MSG91_AUTH_KEY=your_auth_key
// MSG91_SENDER_ID=your_sender_id
// MSG91_ROUTE=4

const sendSMSMsg91 = async (options) => {
    const https = require('https');
    const querystring = require('querystring');

    const params = querystring.stringify({
        authkey: process.env.MSG91_AUTH_KEY,
        mobiles: options.phone,
        message: options.message,
        sender: process.env.MSG91_SENDER_ID,
        route: process.env.MSG91_ROUTE || '4',
        country: '91'
    });

    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'api.msg91.com',
            path: `/api/sendhttp.php?${params}`,
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ success: true, message: 'SMS sent via MSG91', response: data });
                } else {
                    resolve({ success: false, error: data });
                }
            });
        });
        req.on('error', (error) => resolve({ success: false, error: error.message }));
        req.end();
    });
};

// Option 3: Fast2SMS (Indian Provider)
// Sign up: https://www.fast2sms.com
// Add to .env:
// FAST2SMS_API_KEY=your_api_key

const sendSMSFast2SMS = async (options) => {
    const https = require('https');

    const postData = JSON.stringify({
        route: 'otp',
        sender_id: 'FSTSMS',
        message: options.message,
        language: 'english',
        flash: 0,
        numbers: options.phone
    });

    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'www.fast2sms.com',
            path: '/dev/bulkV2',
            method: 'POST',
            headers: {
                'authorization': process.env.FAST2SMS_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const response = JSON.parse(data);
                if (response.return) {
                    resolve({ success: true, message: 'SMS sent via Fast2SMS', response: data });
                } else {
                    resolve({ success: false, error: data });
                }
            });
        });
        req.on('error', (error) => resolve({ success: false, error: error.message }));
        req.write(postData);
        req.end();
    });
};

module.exports = {
    sendSMSTwilio,
    sendSMSMsg91,
    sendSMSFast2SMS
};
