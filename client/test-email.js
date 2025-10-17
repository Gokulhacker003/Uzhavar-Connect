// Test email functionality
const testEmailSubmission = async () => {
  const testData = {
    formType: 'Test Form Submission',
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    message: 'This is a test submission to verify email functionality',
    extra: {
      'Test Field 1': 'Test Value 1',
      'Test Field 2': 'Test Value 2'
    }
  };

  try {
    const response = await fetch('http://localhost:4000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log('Email test result:', result);
    
    if (result.success) {
      console.log('✅ Email functionality is working!');
      console.log('📧 Email will be sent to: uzhavarconnect2025@gmail.com');
      console.log('📝 Form data is stored locally for backup');
    } else {
      console.log('❌ Email test failed');
    }
  } catch (error) {
    console.error('❌ Error testing email:', error);
  }
};

// Run the test
testEmailSubmission();