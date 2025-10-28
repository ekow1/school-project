import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const { API_KEY, SENDER_ID } = process.env;

// Validate environment variables
if (!API_KEY) {
  console.error('❌ API_KEY environment variable is required!');
  process.exit(1);
}

if (!SENDER_ID) {
  console.error('❌ SENDER_ID environment variable is required!');
  process.exit(1);
}

// Function to generate a 6-digit numeric OTP (Arkesel minimum requirement)
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Simple OTP Backend is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /send-otp': 'Send OTP to phone number'
    }
  });
});

app.post('/send-otp', async (req, res) => {
  try {
    const { number, expiry = 5 } = req.body;

    // Validate input
    if (!number) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }

    // Basic phone number validation (Ghana format)
    const phoneRegex = /^(\+233|0)[0-9]{9}$/;
    if (!phoneRegex.test(number)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Use Ghana format: +233XXXXXXXXX or 0XXXXXXXXX'
      });
    }

    const otp = generateOtp();
    const data = {
      expiry,         // in minutes
      length: 6,      // length of OTP (Arkesel requirement: 6-15)
      medium: 'sms',  // can also be 'voice'
      message: `Your OTP is ${otp}. Code will expire in ${expiry} minutes.`,
      number,
      sender_id: SENDER_ID,
      type: 'numeric', // numeric OTP
    };

    const headers = {
      'api-key': API_KEY,
      'Content-Type': 'application/json'
    };

    console.log(`📱 Sending OTP to: ${number}`);
    console.log(`🔢 Generated OTP: ${otp}`);

    const response = await axios.post('https://sms.arkesel.com/api/otp/generate', data, { headers });
    
    console.log('✅ OTP sent successfully:', response.data);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp, // for testing, remove in production
      arkeselResponse: response.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error sending OTP:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      error: error.response ? error.response.data : error.message,
      message: 'Failed to send OTP'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple OTP Backend running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`📤 Sender ID: ${SENDER_ID}`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  • GET  / - Service info');
  console.log('  • POST /send-otp - Send OTP');
  console.log('');
  console.log('📝 Example usage:');
  console.log('  curl -X POST http://localhost:3000/send-otp \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"number": "+233123456789"}\'');
});
