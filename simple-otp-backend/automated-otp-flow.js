import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

const headers = {
  'api-key': process.env.ARKSEND,
  'Content-Type': 'application/json'
};

const phoneNumber = '+233552977393';

async function automatedOTPFlow() {
  console.log('🚀 Starting Automated OTP Flow...');
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
      sender_id: 'Arkesel',
      type: 'numeric',
    };

    console.log('🔢 Generated OTP:', otp);
    console.log('📤 Sending request...');

    const sendResponse = await axios.post('https://sms.arkesel.com/api/otp/generate', sendData, { headers });
    
    console.log('✅ OTP Sent Successfully!');
    console.log('📊 Send Response:', JSON.stringify(sendResponse.data, null, 2));
    console.log('');

    // Step 2: Wait a moment for SMS to be processed
    console.log('⏳ Waiting 3 seconds for SMS to be processed...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 3: Verify OTP
    console.log('🔍 Step 2: Verifying OTP...');
    
    const verifyData = {
      code: otp.toString(),
      number: phoneNumber
    };

    console.log('🔢 Verifying OTP:', otp);
    console.log('📤 Sending verification request...');

    const verifyResponse = await axios.post('https://sms.arkesel.com/api/otp/verify', verifyData, { headers });
    
    console.log('✅ OTP Verification Complete!');
    console.log('📊 Verify Response:', JSON.stringify(verifyResponse.data, null, 2));
    console.log('');

    // Step 4: Summary
    console.log('🎉 AUTOMATED OTP FLOW COMPLETED SUCCESSFULLY!');
    console.log('📋 Summary:');
    console.log('  • OTP Generated:', otp);
    console.log('  • SMS Sent:', sendResponse.data.status === 'success' ? '✅' : '❌');
    console.log('  • OTP Verified:', verifyResponse.data.status === 'success' ? '✅' : '❌');
    console.log('  • Phone Number:', phoneNumber);
    console.log('  • Sender ID:', 'Arkesel');

  } catch (error) {
    console.log('❌ AUTOMATED OTP FLOW FAILED!');
    console.log('📊 Error Details:');
    
    if (error.response) {
      console.log('  • Status:', error.response.status);
      console.log('  • Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('  • Error:', error.message);
    }
    
    console.log('');
    console.log('🔍 Troubleshooting:');
    console.log('  1. Check if API key is correct');
    console.log('  2. Check if phone number format is correct');
    console.log('  3. Check if sender ID is approved');
    console.log('  4. Check Arkesel dashboard for detailed logs');
  }
}

// Run the automated flow
automatedOTPFlow();
