// Test script for Kodbank API
const testUsername = 'testuser' + Date.now();
const testPassword = 'Test123!';
const testEmail = `test${Date.now()}@example.com`;
let authToken = '';

async function testRegister() {
  console.log('\n=== Testing Registration ===');
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: testPassword,
        email: testEmail,
        phone: '1234567890'
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    return response.ok;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n=== Testing Login ===');
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: testPassword
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    if (data.token) {
      authToken = data.token;
      console.log('Token received and saved');
    }
    return response.ok;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function testBalance() {
  console.log('\n=== Testing Balance Check ===');
  try {
    const response = await fetch('http://localhost:3000/api/balance', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    return response.ok;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('Starting Kodbank API Tests...');
  
  const registerResult = await testRegister();
  if (!registerResult) {
    console.log('\n❌ Registration test failed');
    return;
  }
  console.log('✅ Registration test passed');
  
  const loginResult = await testLogin();
  if (!loginResult) {
    console.log('\n❌ Login test failed');
    return;
  }
  console.log('✅ Login test passed');
  
  const balanceResult = await testBalance();
  if (!balanceResult) {
    console.log('\n❌ Balance check test failed');
    return;
  }
  console.log('✅ Balance check test passed');
  
  console.log('\n🎉 All tests passed successfully!');
}

runTests();
