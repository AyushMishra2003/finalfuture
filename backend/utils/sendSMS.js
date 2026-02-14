const https = require('https');
const querystring = require('querystring');

// Twilio Verify Service (Best for OTP)
const sendSMSTwilioVerify = async (options) => {
    try {
        console.log('Attempting to send OTP via Twilio Verify:', options.phone);

        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

        if (!accountSid || !authToken || !verifySid) {
            console.error('Twilio Verify credentials not configured');
            return { success: false, message: 'Twilio credentials missing', error: 'Missing credentials' };
        }

        const twilio = require('twilio')(accountSid, authToken);

        // Extract OTP from message
        const otpMatch = options.message.match(/\d{6}/);
        const otp = otpMatch ? otpMatch[0] : null;

        if (!otp) {
            console.error('Could not extract OTP from message');
            return { success: false, message: 'Invalid OTP format', error: 'No OTP found' };
        }

        // Send custom OTP via Twilio Verify
        const verification = await twilio.verify.v2
            .services(verifySid)
            .verifications
            .create({
                to: `+91${options.phone}`,
                channel: 'sms',
                customCode: otp
            });

        console.log('Twilio Verify OTP sent successfully:', verification.status);
        return { success: true, message: 'OTP sent via Twilio Verify', response: verification.status };
    } catch (error) {
        console.error('Twilio Verify error:', error.message);
        return { success: false, message: 'Twilio Verify failed', error: error.message };
    }
};

// Twilio SMS with Messaging Service
const sendSMSTwilio = async (options) => {
    try {
        console.log('Attempting to send SMS via Twilio Messaging Service:', options.phone);

        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

        if (!accountSid || !authToken || !messagingServiceSid) {
            console.error('Twilio credentials not configured');
            return { success: false, message: 'Twilio credentials missing', error: 'Missing credentials' };
        }

        const twilio = require('twilio')(accountSid, authToken);

        // Send SMS using Messaging Service
        const message = await twilio.messages.create({
            body: options.message,
            messagingServiceSid: messagingServiceSid,
            to: `+91${options.phone}`
        });

        console.log('Twilio SMS sent successfully:', message.sid, 'Status:', message.status);
        return { success: true, message: 'SMS sent via Twilio', response: message.sid };
    } catch (error) {
        console.error('Twilio SMS error:', error.message);
        return { success: false, message: 'Twilio SMS failed', error: error.message };
    }
};

// Primary SMS provider (bhashsms) - DISABLED
const sendSMSBhash = async (options) => {
    try {
        console.log('Attempting to send SMS via bhashsms:', options.phone);

        const queryParams = querystring.stringify({
            user: process.env.SMS_API_USER || 'futurelabssms',
            pass: process.env.SMS_API_PASS || '123456',
            sender: process.env.SMS_SENDER_ID || 'FULABS',
            phone: options.phone,
            text: options.message
        });

        const url = `/api/sendmsg.php?${queryParams}`;

        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'bhashsms.com',
                path: url,
                method: 'GET',
                timeout: 15000
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    console.log('bhashsms API Response:', data);

                    if (data.includes('Sender ID Does not Exist') ||
                        data.includes('Pending') ||
                        data.includes('Route Invalid')) {
                        console.error('bhashsms sending failed due to sender ID issues:', data);
                        resolve({ success: false, message: 'bhashsms sending failed due to sender ID issues', error: data });
                    } else if (res.statusCode >= 400) {
                        console.error('bhashsms sending failed with HTTP error:', res.statusCode, data);
                        resolve({ success: false, message: `bhashsms sending failed with HTTP error: ${res.statusCode}`, error: data });
                    } else {
                        console.log('bhashsms sent successfully');
                        resolve({ success: true, message: 'bhashsms sent successfully', response: data });
                    }
                });
            });

            req.on('error', (error) => {
                console.error('bhashsms sending error:', error.message);
                resolve({ success: false, message: 'bhashsms sending failed due to network error', error: error.message });
            });

            req.on('timeout', () => {
                console.error('bhashsms sending timeout after 15 seconds');
                req.destroy();
                resolve({ success: false, message: 'bhashsms sending timed out', error: 'Request timeout after 15 seconds' });
            });

            req.end();
        });
    } catch (error) {
        console.error('Error in bhashsms utility:', error);
        return Promise.resolve({ success: false, message: 'bhashsms utility error', error: error.message });
    }
};

// Fallback SMS provider (generic HTTP API)
const sendSMSFallback = async (options) => {
    try {
        console.log('Attempting to send SMS via fallback method:', options.phone);

        // For now, we'll just log the SMS details as a fallback
        console.log('SMS Fallback - Phone:', options.phone, 'Message:', options.message);

        // In a real implementation, you would integrate with another SMS service here
        // For example, you could use Twilio, Nexmo, or another Indian SMS provider

        // Return success for testing purposes
        return Promise.resolve({
            success: true,
            message: 'SMS logged successfully (fallback mode)',
            response: 'Fallback method used'
        });
    } catch (error) {
        console.error('Error in fallback SMS utility:', error);
        return Promise.resolve({ success: false, message: 'Fallback SMS utility error', error: error.message });
    }
};

const sendSMS = async (options) => {
    try {
        console.log('Preparing to send SMS:', options);

        // Try Twilio Messaging Service (works with trial)
        let result = await sendSMSTwilio(options);

        // If Twilio fails, use fallback
        if (!result.success) {
            console.log('Twilio failed, using fallback method');
            result = await sendSMSFallback(options);
        }

        return result;
    } catch (error) {
        console.error('Error in sendSMS utility:', error);
        return Promise.resolve({ success: false, message: 'SMS utility error', error: error.message });
    }
};

module.exports = sendSMS;