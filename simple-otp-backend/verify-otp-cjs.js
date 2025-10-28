const axios = require('axios');
require('dotenv').config();

// OTP verification test
const data = {
  code: '173882',
  number: '+233544919953'
};

const headers = {
  'api-key': process.env.ARKSEND,
  'Content-Type': 'application/json'
};

console.log('🔍 Verifying OTP...');
console.log('📱 Phone:', data.number);
console.log('🔢 OTP Code:', data.code);
console.log('🔑 API Key:', process.env.ARKSEND ? 'Set' : 'Not set');

console.log('\n📤 Sending verification request...');
console.log('Data:', JSON.stringify(data, null, 2));

axios.post('https://sms.arkesel.com/api/otp/verify', data, { headers })
  .then(response => {
    console.log('\n✅ VERIFICATION SUCCESS:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.status === 'success') {
      console.log('🎉 OTP VERIFIED SUCCESSFULLY!');
    } else {
      console.log('❌ OTP verification failed');
    }
  })
  .catch(error => {
    console.log('\n❌ VERIFICATION ERROR:');
    console.log('Status:', error.response ? error.response.status : 'No status');
    console.log('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      if (errorData.message) {
        console.log('\n💡 Error Details:', errorData.message);
      }
    }
  });
