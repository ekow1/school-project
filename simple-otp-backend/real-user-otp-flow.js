import axios from 'axios';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

const headers = {
  'api-key': process.env.ARKSEND,
  'Content-Type': 'application/json'
};

const phoneNumber = '+233552977393';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask user for input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function realUserOTPFlow() {
  console.log('🚀 Starting Real User OTP Flow...');
  console.log('📱 Phone Number:', phoneNumber);
  console.log('🔑 API Key:', process.env.ARKSEND ? 'Set' : 'Not set');
  console.log('');

  try {
    // Step 1: Generate and Send OTP
    console.log('📤 Step 1: Sending OTP...');
    const otp = generateOtp();
    
    const sendData = {
      expiry: 5,
      length: 6,
      medium: 'sms',
      message: `Your OTP is ${otp}. Valid for 5 minutes.`,
      number: phoneNumber,
      sender_id: process.env.SENDER_ID,
      type: 'numeric',
    };

    console.log('🔢 Generated OTP:', otp);
    console.log('📤 Sending request...');

    const sendResponse = await axios.post('https://sms.arkesel.com/api/otp/generate', sendData, { headers });
    
    console.log('✅ OTP Sent Successfully!');
    console.log('📊 Send Response:', JSON.stringify(sendResponse.data, null, 2));
    console.log('');

    // Step 2: Wait for user to receive SMS
    console.log('📱 Please check your phone for the SMS with OTP code...');
    console.log('⏳ Waiting for you to receive the SMS...');
    
    // Wait 5 seconds for SMS to arrive
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 3: Ask user to enter OTP
    console.log('');
    console.log('🔍 Step 2: Enter OTP Verification');
    console.log('💡 For testing: The OTP sent is', otp);
    
    const userOTP = await askQuestion('Enter the OTP code you received: ');
    
    // Step 4: Verify OTP
    console.log('🔍 Step 3: Verifying OTP...');
    
    const verifyData = {
      code: userOTP.trim(),
      number: phoneNumber
    };

    console.log('🔢 Verifying OTP:', userOTP.trim());
    console.log('📤 Sending verification request...');

    const verifyResponse = await axios.post('https://sms.arkesel.com/api/otp/verify', verifyData, { headers });
    
    console.log('✅ OTP Verification Complete!');
    console.log('📊 Verify Response:', JSON.stringify(verifyResponse.data, null, 2));
    console.log('');

    // Step 5: Summary
    console.log('🎉 REAL USER OTP FLOW COMPLETED!');
    console.log('📋 Summary:');
    console.log('  • OTP Generated:', otp);
    console.log('  • SMS Sent:', sendResponse.data.status === 'success' ? '✅' : '❌');
    console.log('  • OTP Verified:', verifyResponse.data.status === 'success' ? '✅' : '❌');
    console.log('  • Phone Number:', phoneNumber);
    console.log('  • Sender ID:', process.env.SENDER_ID);

  } catch (error) {
    console.log('❌ REAL USER OTP FLOW FAILED!');
    console.log('📊 Error Details:');
    
    if (error.response) {
      console.log('  • Status:', error.response.status);
      console.log('  • Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('  • Error:', error.message);
    }
  } finally {
    rl.close();
  }
}

// Run the real user flow
realUserOTPFlow();
