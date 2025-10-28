const axios = require('axios');

// Function to generate a 6-digit numeric OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Generate OTP
const otp = generateOtp();

const data = {
  expiry: 5,
  length: 6,
  medium: 'sms',
  message: `Your OTP is ${otp}. Valid for 5 minutes.`,
  number: '+233544919953',
  sender_id: 'Arkesel',
  type: 'numeric',
};

const headers = {
  'api-key': 'cE9QRUkdjsjdfjkdsj9kdiieieififiw=',
  'Content-Type': 'application/json'
};

console.log('📱 Sending OTP to:', data.number);
console.log('🔢 Generated OTP:', otp);
console.log('📤 Data being sent:', data);

axios.post('https://sms.arkesel.com/api/otp/generate', data, { headers })
  .then(response => {
    console.log('✅ Success Response:', response.data);
  })
  .catch(error => {
    console.error('❌ Error Response:', error.response ? error.response.data : error.message);
  });
