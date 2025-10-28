# OTP Service Environment Variables

## Required Environment Variables

Add the following environment variable to your `.env` file:

```bash
# Arkesel SMS API Configuration
ARKSEND=your-arkesel-api-key-here
```

## Example Configuration

```bash
# Database Configuration
MONGO_URI=mongodb://localhost:27017/school-project

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000

# Arkesel SMS API Configuration
ARKSEND=cE9QRUkdjsjdfjkdsj9kdiieieififiw=
```

## Getting Your Arkesel API Key

1. Visit [Arkesel SMS Platform](https://sms.arkesel.com)
2. Sign up for an account
3. Go to your dashboard
4. Navigate to API settings
5. Copy your API key
6. Add it to your `.env` file as `ARKSEND`

## Security Notes

- Never commit your `.env` file to version control
- Keep your API key secure and don't share it publicly
- Use different API keys for development and production environments
