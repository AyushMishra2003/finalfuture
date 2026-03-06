const axios = require('axios');

const baseUrl = 'http://localhost:5000/api/v1';

async function testPhlebotomistDashboard() {
  console.log('🧪 Testing Phlebotomist Dashboard Backend...\n');

  // You need to replace this with an actual collector token
  // To get a token, first login as a collector user
  const token = 'YOUR_COLLECTOR_TOKEN_HERE';

  try {
    // Test 1: Get Dashboard
    console.log('1️⃣ Testing GET /phlebotomist/dashboard');
    const dashboardRes = await axios.get(`${baseUrl}/phlebotomist/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dashboard loaded successfully');
    console.log('Stats:', dashboardRes.data.stats);
    console.log('Orders count:', dashboardRes.data.orders?.length || 0);
    console.log('');

    // Test 2: Update Location
    console.log('2️⃣ Testing PUT /phlebotomist/location');
    const locationRes = await axios.put(
      `${baseUrl}/phlebotomist/location`,
      { latitude: 12.9716, longitude: 77.5946 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Location updated successfully');
    console.log('');

    // Test 3: Get Order Details (if orders exist)
    if (dashboardRes.data.orders && dashboardRes.data.orders.length > 0) {
      const orderId = dashboardRes.data.orders[0]._id;
      console.log('3️⃣ Testing GET /phlebotomist/orders/:orderId');
      const orderRes = await axios.get(`${baseUrl}/phlebotomist/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Order details loaded successfully');
      console.log('Order ID:', orderRes.data.data._id);
      console.log('');

      // Test 4: Update Order Status
      console.log('4️⃣ Testing PUT /phlebotomist/orders/:orderId/status');
      const statusRes = await axios.put(
        `${baseUrl}/phlebotomist/orders/${orderId}/status`,
        { status: 'processing' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Order status updated successfully');
      console.log('');
    }

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n📝 Note: Make sure to:');
    console.log('1. Replace YOUR_COLLECTOR_TOKEN_HERE with an actual collector token');
    console.log('2. Have MongoDB running');
    console.log('3. Have the backend server running on port 5000');
    console.log('4. Have a collector folder assigned to the phlebotomist');
  }
}

testPhlebotomistDashboard();
