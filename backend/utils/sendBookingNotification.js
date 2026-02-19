const sendSMS = require('./sendSMS');
const { sendEmail } = require('./sendEmail');

/**
 * Send booking confirmation notification
 */
const sendBookingConfirmation = async (order, otp) => {
    const user = order.user;
    const bookingDetails = order.bookingDetails;

    // SMS notification
    try {
        await sendSMS({
            phone: user.phone,
            message: `Your booking is confirmed! Order ID: ${order._id}. Scheduled: ${bookingDetails.timeRange} on ${new Date(bookingDetails.scheduledDate).toLocaleDateString()}. Verification OTP: ${otp}. Share this OTP with the collector. -FutureLab`
        });
    } catch (error) {
        console.error('SMS sending failed:', error);
    }

    // Email notification
    try {
        if (user.email) {
            await sendEmail({
                email: user.email,
                subject: 'Booking Confirmed - FutureLab',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: #3498db; color: white; padding: 20px; text-align: center; }
                            .content { padding: 30px; background: #f9f9f9; }
                            .otp-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
                            .otp { font-size: 32px; font-weight: bold; color: #3498db; letter-spacing: 5px; }
                            .details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🏥 FutureLab</h1>
                                <p>Booking Confirmed</p>
                            </div>
                            <div class="content">
                                <h2>Your Sample Collection is Scheduled!</h2>
                                <p>Dear ${user.name},</p>
                                <p>Your booking has been confirmed successfully.</p>
                                
                                <div class="details">
                                    <h3>Booking Details</h3>
                                    <p><strong>Order ID:</strong> ${order._id}</p>
                                    <p><strong>Date:</strong> ${new Date(bookingDetails.scheduledDate).toLocaleDateString()}</p>
                                    <p><strong>Time:</strong> ${bookingDetails.timeRange}</p>
                                    <p><strong>Collector:</strong> ${bookingDetails.collectorName}</p>
                                </div>

                                <div class="otp-box">
                                    <h3>Verification OTP</h3>
                                    <div class="otp">${otp}</div>
                                    <p style="color: #e74c3c; margin-top: 10px;">
                                        ⚠️ Please share this OTP with the phlebotomist when they arrive
                                    </p>
                                </div>

                                <h3>What to Expect:</h3>
                                <ul>
                                    <li>Our phlebotomist will arrive at your scheduled time</li>
                                    <li>They will verify the OTP before sample collection</li>
                                    <li>You'll receive updates via SMS at each step</li>
                                    <li>Results will be available in 24-48 hours</li>
                                </ul>

                                <p>If you have any questions, please contact our support team.</p>
                            </div>
                            <div class="footer">
                                <p>© 2025 FutureLab Healthcare Platform. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });
        }
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

/**
 * Send status update notification
 */
const sendStatusUpdate = async (order, status, notes = '', otp = '') => {
    const user = order.user;

    const statusMessages = {
        'on_way': {
            sms: `Your phlebotomist is on the way for Order ${order._id}. OTP: ${otp}. -FutureLab`,
            subject: 'Phlebotomist On The Way',
            title: 'Phlebotomist is Coming!'
        },
        'reached': {
            sms: `Phlebotomist has reached your location for Order ${order._id}. OTP: ${otp}. -FutureLab`,
            subject: 'Phlebotomist Has Arrived',
            title: 'Phlebotomist Has Arrived!'
        },
        'collected': {
            sms: `Sample collected successfully for Order ${order._id}. OTP: ${otp}. Results will be available soon. -FutureLab`,
            subject: 'Sample Collected Successfully',
            title: 'Sample Collection Complete!'
        },
        'completed': {
            sms: `Your test results for Order ${order._id} are ready! OTP: ${otp}. Check your account. -FutureLab`,
            subject: 'Test Results Ready',
            title: 'Your Results Are Ready!'
        }
    };

    const messageData = statusMessages[status];
    if (!messageData) return;

    // Send SMS
    try {
        await sendSMS({
            phone: user.phone,
            message: messageData.sms
        });
    } catch (error) {
        console.error('SMS sending failed:', error);
    }

    // Send Email
    try {
        if (user.email) {
            await sendEmail({
                email: user.email,
                subject: `${messageData.subject} - Order ${order._id}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: #3498db; color: white; padding: 20px; text-align: center; }
                            .content { padding: 30px; background: #f9f9f9; }
                            .status-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #3498db; }
                            .otp { font-size: 32px; font-weight: bold; color: #3498db; letter-spacing: 5px; text-align: center; margin: 20px 0; }
                            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🏥 FutureLab</h1>
                                <p>Booking Update</p>
                            </div>
                            <div class="content">
                                <h2>${messageData.title}</h2>
                                <p>Dear ${user.name},</p>
                                
                                <div class="status-box">
                                    <p><strong>Order ID:</strong> ${order._id}</p>
                                    <p><strong>Status:</strong> ${status.replace('_', ' ').toUpperCase()}</p>
                                    <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
                                    ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                                </div>

                                ${otp ? `
                                <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
                                    <h3>Verification OTP</h3>
                                    <div class="otp">${otp}</div>
                                    <p style="color: #e74c3c;">⚠️ Share this OTP with the phlebotomist</p>
                                </div>
                                ` : ''}

                                <p>Thank you for choosing FutureLab Healthcare!</p>
                            </div>
                            <div class="footer">
                                <p>© 2025 FutureLab Healthcare Platform. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });
        }
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = {
    sendBookingConfirmation,
    sendStatusUpdate
};
