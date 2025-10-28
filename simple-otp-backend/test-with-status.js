import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
const otp = generateOtp();

const headers = {
  'api-key': process.env.ARKSEND,
  'Content-Type': 'application/json'
};

console.log('🔍 Testing OTP with detailed logging...');
console.log('🔑 API Key:', process.env.ARKSEND ? 'Set' : 'Not set');
console.log('📱 Phone:', '+233552977393');
console.log('📤 Sender ID:', 'Arkesel');
console.log('🔢 OTP:', otp);

const data = {
  expiry: 5,
  length: 6,
  medium: 'sms',
  message: `Your OTP is ${otp}. Valid for 5 minutes.`,
  number: '+233552977393',
  sender_id: 'Arkesel',
  type: 'numeric',
};

console.log('\n📤 Sending request...');
console.log('Data:', JSON.stringify(data, null, 2));

axios.post('https://sms.arkesel.com/api/otp/generate', data, { headers })
  .then(response => {
    console.log('\n✅ SUCCESS RESPONSE:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    console.log('\n📊 CHECK YOUR DASHBOARD:');
    console.log('1. Go to: https://sms.arkesel.com/');
    console.log('2. Login to your account');
    console.log('3. Check "SMS Reports" or "Message History"');
    console.log('4. Look for messages to +233552977393');
    console.log('5. Check the status: Sent/Delivered/Failed');
  })
  .catch(error => {
    console.log('\n❌ ERROR RESPONSE:');
    console.log('Status:', error.response ? error.response.status : 'No status');
    console.log('Data:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
  });
