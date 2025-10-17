// Simple test script to POST a sample payload to /api/send-email
// Usage: node test-send.js

const http = require('http');

const payload = {
  formType: 'Automated Test',
  name: 'Integration Tester',
  email: 'tester@example.com',
  phone: '0000000000',
  message: 'This is a test from test-send.js',
  extra: { testNote: 'automated end-to-end test' }
};

const data = JSON.stringify(payload);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/send-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    try {
      const json = JSON.parse(body);
      console.log('Response JSON:', json);
    } catch (e) {
      console.log('Response body:', body);
    }
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
  process.exit(1);
});

req.write(data);
req.end();
