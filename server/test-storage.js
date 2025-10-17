// Test script to verify local data storage functionality
const http = require('http');

// Test storing some sample user data
const testData = {
  type: 'user-registration',
  data: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    userType: 'farmer',
    farmDetails: {
      farmSize: '5 acres',
      cropTypes: 'Rice, Wheat',
      location: 'Test Village'
    }
  }
};

const postData = JSON.stringify(testData);

const options = {
  hostname: '127.0.0.1',
  port: 5001,
  path: '/api/store-data',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing local data storage...');

const req = http.request(options, (res) => {
  console.log(`Response status: ${res.statusCode}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.write(postData);
req.end();