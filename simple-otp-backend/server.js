import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Your Arkesel API key from environment variable
const API_KEY = process.env.ARKSEND;

// Check if API key is provided
if (!API_KEY) {
  console.error('❌ ARKSEND environment variable is not set!');
  console.error('Please set your Arkesel API key in the .env file');
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
      'POST /send-otp': 'Send OTP to phone number',
      'GET /health': 'Health check'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'OTP service is healthy',
    timestamp: new Date().toISOString()
  });
});

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  try {
    const { number } = req.body;

    // Validate API key
    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured. Please set ARKSEND environment variable.',
        message: 'Service configuration error'
      });
    }

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

    // Generate OTP
    const otp = generateOtp();
    
    // Prepare data for Arkesel API
    const data = {
      expiry: 5, // in minutes
      length: 6,
      medium: 'sms',
      message: `Your OTP is ${otp}. Valid for 5 minutes.`,
      number,
      sender_id: 'Fire',
      type: 'numeric',
    };

    const headers = {
      'api-key': API_KEY,
      'Content-Type': 'application/json'
    };

    console.log(`📱 Sending OTP to: ${number}`);
    console.log(`🔢 Generated OTP: ${otp}`);

    // Send OTP via Arkesel API
    const response = await axios.post('https://sms.arkesel.com/api/otp/generate', data, { headers });
    
    console.log('✅ OTP sent successfully:', response.data);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp, // include OTP for testing purposes (remove in production)
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

// Verify OTP endpoint (optional - for testing)
app.post('/verify-otp', async (req, res) => {
  try {
    const { number, otp } = req.body;

    if (!number || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and OTP are required'
      });
    }

    const data = {
      number,
      code: otp
    };

    const headers = {
      'api-key': API_KEY,
      'Content-Type': 'application/json'
    };

    const response = await axios.post('https://sms.arkesel.com/api/otp/verify', data, { headers });
    
    res.json({
      success: true,
      message: 'OTP verification completed',
      arkeselResponse: response.data
    });

  } catch (error) {
    console.error('❌ Error verifying OTP:', error.response ? error.response.data : error.message);
    
    res.status(500).json({
      success: false,
      error: error.response ? error.response.data : error.message,
      message: 'Failed to verify OTP'
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple OTP Backend running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
  console.log(`📱 API Base: http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  • GET  / - Service info');
  console.log('  • GET  /health - Health check');
  console.log('  • POST /send-otp - Send OTP');
  console.log('  • POST /verify-otp - Verify OTP');
  console.log('');
  console.log('📝 Example usage:');
  console.log('  curl -X POST http://localhost:3000/send-otp \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"number": "+233123456789"}\'');
});
