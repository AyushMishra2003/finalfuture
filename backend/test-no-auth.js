const axios = require('axios');

const testNoAuth = async () => {
    console.log('\n🧪 Testing Orders Without Authentication\n');
    console.log('='.repeat(50));

    const baseURL = 'http://localhost:5000/api/v1';

    try {
        // 1. Test Get Orders (No Auth)
        console.log('\n1️⃣ Testing GET /orders (No Auth)...');
        const getResponse = await axios.get(`${baseURL}/orders`);
        console.log('   ✅ Success! Got', getResponse.data.data?.length || 0, 'orders');

        // 2. Test Create Order (No Auth)
        console.log('\n2️⃣ Testing POST /orders (No Auth)...');
        const orderData = {
            orderItems: [
                {
                    name: 'Test Order - No Auth',
                    price: 500,
                    quantity: 1
                }
            ],
            shippingAddress: {
                address: '123 Test Street',
                city: 'Bangalore',
                postalCode: '560001',
                location: {
                    latitude: 12.9716,
                    longitude: 77.5946
                }
            },
            paymentMethod: 'Cash on Collection',
            itemsPrice: 500,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: 500
        };

        const createResponse = await axios.post(`${baseURL}/orders`, orderData);
        console.log('   ✅ Success! Order created:', createResponse.data.data._id);

        const orderId = createResponse.data.data._id;

        // 3. Test Get Single Order (No Auth)
        console.log('\n3️⃣ Testing GET /orders/:id (No Auth)...');
        const getSingleResponse = await axios.get(`${baseURL}/orders/${orderId}`);
        console.log('   ✅ Success! Got order:', getSingleResponse.data.data._id);

        // 4. Test Update Status (No Auth)
        console.log('\n4️⃣ Testing PUT /orders/:id/status (No Auth)...');
        const updateResponse = await axios.put(`${baseURL}/orders/${orderId}/status`, {
            status: 'confirmed'
        });
        console.log('   ✅ Success! Status updated to:', updateResponse.data.data.orderStatus);

        console.log('\n' + '='.repeat(50));
        console.log('✅ All Tests Passed!');
        console.log('\n📋 Summary:');
        console.log('   ✓ Get all orders - No auth required');
        console.log('   ✓ Create order - No auth required');
        console.log('   ✓ Get single order - No auth required');
        console.log('   ✓ Update status - No auth required');
        console.log('\n🎉 Orders work without authentication!\n');

    } catch (error) {
        console.error('\n❌ Test Failed!');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Error:', error.response.data.error || error.response.data);
        } else {
            console.error('   Error:', error.message);
        }
        console.log('\n💡 Make sure backend server is running: npm run dev\n');
    }
};

testNoAuth();
