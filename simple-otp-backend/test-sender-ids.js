import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
const otp = generateOtp();

const headers = {
  'api-key': process.env.ARKSEND,
  'Content-Type': 'application/json'
};

// Test different sender IDs
const senderIds = ['Arkesel', 'GNFS', 'Fire', 'OTP', 'SMS', 'Test'];

console.log('🔍 Testing different sender IDs...');
console.log('🔢 Generated OTP:', otp);

async function testSenderId(senderId) {
  try {
    const data = {
      expiry: 5,
      length: 6,
      medium: 'sms',
      message: `Your OTP is ${otp}. Valid for 5 minutes.`,
      number: '+233552977393',
      sender_id: senderId,
      type: 'numeric',
    };

    console.log(`\n📤 Testing sender ID: ${senderId}`);
    
    const response = await axios.post('https://sms.arkesel.com/api/otp/generate', data, { headers });
    console.log(`✅ ${senderId}: SUCCESS - ${response.data.message || 'OTP sent'}`);
    return true;
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    console.log(`❌ ${senderId}: FAILED - ${errorMsg}`);
    return false;
  }
}

// Test all sender IDs
async function testAllSenderIds() {
  for (const senderId of senderIds) {
    await testSenderId(senderId);
    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testAllSenderIds();
