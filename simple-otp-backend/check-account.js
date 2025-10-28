import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const headers = {
  'api-key': process.env.ARKSEND,
  'Content-Type': 'application/json'
};

console.log('🔍 Checking Arkesel account status...');
console.log('🔑 API Key:', process.env.ARKSEND ? 'Set' : 'Not set');

// Check account balance/status
axios.get('https://sms.arkesel.com/api/balance', { headers })
  .then(response => {
    console.log('✅ Account Balance:', response.data);
  })
  .catch(error => {
    console.error('❌ Error checking balance:', error.response ? error.response.data : error.message);
  });

// Check account info
axios.get('https://sms.arkesel.com/api/account', { headers })
  .then(response => {
    console.log('✅ Account Info:', response.data);
  })
  .catch(error => {
    console.error('❌ Error checking account:', error.response ? error.response.data : error.message);
  });

// Check sender IDs
axios.get('https://sms.arkesel.com/api/sender-id', { headers })
  .then(response => {
    console.log('✅ Sender IDs:', response.data);
  })
  .catch(error => {
    console.error('❌ Error checking sender IDs:', error.response ? error.response.data : error.message);
  });
