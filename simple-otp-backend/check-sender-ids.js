import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const headers = {
  'api-key': process.env.ARKSEND,
  'Content-Type': 'application/json'
};

console.log('🔍 Checking available sender IDs...');
console.log('🔑 API Key:', process.env.ARKSEND ? 'Set' : 'Not set');

// Check sender IDs endpoint
axios.get('https://sms.arkesel.com/api/sender-id', { headers })
  .then(response => {
    console.log('✅ Available Sender IDs:', response.data);
  })
  .catch(error => {
    console.error('❌ Error checking sender IDs:', error.response ? error.response.data : error.message);
    
    // If sender ID endpoint doesn't exist, try a different approach
    console.log('\n🔍 Trying alternative method...');
    
    // Test with different sender IDs
    const testSenderIds = ['Arkesel', 'GNFS', 'Fire', 'OTP', 'SMS'];
    
    testSenderIds.forEach(async (senderId) => {
      try {
        const testData = {
          expiry: 5,
          length: 6,
          medium: 'sms',
          message: 'Test message',
          number: '+233552977393',
          sender_id: senderId,
          type: 'numeric',
        };
        
        const response = await axios.post('https://sms.arkesel.com/api/otp/generate', testData, { headers });
        console.log(`✅ ${senderId}: Available`);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          console.log(`❌ ${senderId}: ${error.response.data.message}`);
        } else {
          console.log(`❌ ${senderId}: Unknown error`);
        }
      }
    });
  });
