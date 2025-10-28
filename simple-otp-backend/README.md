# Simple OTP Backend

A simple Node.js backend for sending OTP (One-Time Password) via SMS using the Arkesel SMS API.

## Features

- ✅ Send OTP via SMS using Arkesel API
- ✅ Verify OTP (optional)
- ✅ Phone number validation (Ghana format)
- ✅ CORS enabled for frontend integration
- ✅ Environment variable configuration
- ✅ Health check endpoints
- ✅ Error handling and logging

## Quick Start

### 1. Install Dependencies

```bash
cd simple-otp-backend
npm install
```

### 2. Environment Setup

Create a `.env` file:

```bash
# Arkesel SMS API Key
ARKSEND=your_arkesel_api_key_here

# Server Port (optional)
PORT=3000
```

### 3. Run the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Send OTP
```http
POST /send-otp
Content-Type: application/json

{
  "number": "+233123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "1234",
  "arkeselResponse": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Verify OTP
```http
POST /verify-otp
Content-Type: application/json

{
  "number": "+233123456789",
  "otp": "1234"
}
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "OTP service is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing

### Using curl

```bash
# Send OTP
curl -X POST http://localhost:3000/send-otp \
  -H "Content-Type: application/json" \
  -d '{"number": "+233123456789"}'

# Verify OTP
curl -X POST http://localhost:3000/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"number": "+233123456789", "otp": "1234"}'

# Health check
curl http://localhost:3000/health
```

### Using Postman

1. **Send OTP:**
   - Method: `POST`
   - URL: `http://localhost:3000/send-otp`
   - Headers: `Content-Type: application/json`
   - Body: `{"number": "+233123456789"}`

2. **Verify OTP:**
   - Method: `POST`
   - URL: `http://localhost:3000/verify-otp`
   - Headers: `Content-Type: application/json`
   - Body: `{"number": "+233123456789", "otp": "1234"}`

## Phone Number Format

The API accepts Ghana phone numbers in these formats:
- `+233123456789` (with country code)
- `0123456789` (local format)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error (API failure)

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ARKSEND` | Arkesel SMS API key | Yes | - |
| `PORT` | Server port | No | 3000 |

## Production Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "otp-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Using systemd

Create `/etc/systemd/system/otp-backend.service`:

```ini
[Unit]
Description=Simple OTP Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/path/to/simple-otp-backend
ExecStart=/usr/bin/node server.js
Restart=always
EnvironmentFile=/path/to/simple-otp-backend/.env

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable otp-backend
sudo systemctl start otp-backend
```

## Security Notes

⚠️ **Important:** 
- Remove the `otp` field from the response in production
- Use HTTPS in production
- Implement rate limiting
- Add authentication if needed
- Validate and sanitize all inputs

## License

ISC
