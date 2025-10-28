import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

const headers = {
  'api-key': process.env.ARKSEND,
  'Content-Type': 'application/json'
};

// Test different phone numbers
const phoneNumbers = [
  '+233552977393',  // Your current number
  '+233544919953',  // Another number you mentioned
  '+233123456789'   // Test number
];

console.log('🔍 Testing OTP with different phone numbers...');
console.log('🔑 API Key:', process.env.ARKSEND ? 'Set' : 'Not set');

async function testPhoneNumber(phoneNumber) {
  try {
    const otp = generateOtp();
    const data = {
      expiry: 5,
      length: 6,
      medium: 'sms',
      message: `Your OTP is ${otp}. Valid for 5 minutes.`,
      number: phoneNumber,
      sender_id: 'GNFS',
      type: 'numeric',
    };

    console.log(`\n📱 Testing phone number: ${phoneNumber}`);
    console.log(`🔢 Generated OTP: ${otp}`);
    
    const response = await axios.post('https://sms.arkesel.com/api/otp/generate', data, { headers });
    console.log(`✅ SUCCESS: ${response.data.message || 'OTP sent'}`);
    console.log(`📊 Response:`, response.data);
    return true;
  } catch (error) {
    const errorMsg = error.response ? error.response.data : error.message;
    console.log(`❌ FAILED: ${errorMsg}`);
    return false;
  }
}

// Test all phone numbers
async function testAllPhoneNumbers() {
  for (const phoneNumber of phoneNumbers) {
    await testPhoneNumber(phoneNumber);
    // Wait 2 seconds between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

testAllPhoneNumbers();
