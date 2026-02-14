require('dotenv').config();

console.log('\n🔍 HDFC Payment Gateway Configuration Test\n');
console.log('=' .repeat(50));

const config = {
    API_KEY: process.env.HDFC_API_KEY,
    MERCHANT_ID: process.env.HDFC_MERCHANT_ID,
    CLIENT_ID: process.env.HDFC_CLIENT_ID,
    BASE_URL: process.env.HDFC_BASE_URL,
    RESPONSE_KEY: process.env.HDFC_RESPONSE_KEY,
    ENABLE_LOGGING: process.env.HDFC_ENABLE_LOGGING
};

console.log('\n✅ Configuration Loaded:');
console.log('  API Key:', config.API_KEY ? '✓ Set' : '✗ Missing');
console.log('  Merchant ID:', config.MERCHANT_ID || 'Not set');
console.log('  Client ID:', config.CLIENT_ID || 'Not set');
console.log('  Base URL:', config.BASE_URL || 'Not set');
console.log('  Response Key:', config.RESPONSE_KEY ? '✓ Set' : '✗ Missing');
console.log('  Logging:', config.ENABLE_LOGGING || 'false');

console.log('\n📋 Full Configuration:');
console.log(JSON.stringify(config, null, 2));

console.log('\n' + '='.repeat(50));
console.log('✅ HDFC Configuration is ready!\n');
