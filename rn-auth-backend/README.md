# Authentication Backend API

A secure authentication backend API built with Node.js, Express, and MongoDB for React Native applications.

## 🚀 Features

- **User Registration** with name, phone, email (optional), password, and address
- **User Login** with JWT token generation
- **Protected Routes** with JWT authentication
- **User Profile Management**
- **Swagger API Documentation**
- **Health Check Endpoint**
- **CORS enabled** for mobile app access
- **Production-ready** with PM2 process management
- **Auto-deployment** via GitHub Actions

## 📋 Prerequisites

- Node.js v22.x or higher
- MongoDB 4.4 or higher
- PM2 (for production)
- Git

## 🛠️ Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd backend/rn-auth-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Run the development server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Once the server is running, visit:
- **Local**: http://localhost:5000/api-docs
- **Production**: https://auth.ekowlabs.space/api-docs

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",  // optional
  "password": "password123",
  "address": "123 Main St"       // optional
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

### Profile (Protected)

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Health Check

#### Check Service Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Auth backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens are valid for 24 hours after login.

## 📦 Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# PM2 process management (production)
npm run pm2:start      # Start with PM2
npm run pm2:stop       # Stop PM2 process
npm run pm2:restart    # Restart PM2 process
npm run pm2:logs       # View logs
npm run pm2:monit      # Monitor process
```

## 🚀 Production Deployment

### 📖 Deployment Guides

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Step-by-step first-time deployment (⭐ Start here!)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with troubleshooting
- **[deploy.sh](./deploy.sh)** - Manual deployment script

### ⚡ Quick First Deployment

```bash
# 1. SSH to server
ssh user@auth.ekowlabs.space

# 2. Clone repository
mkdir -p ~/school-project && cd ~/school-project
git clone YOUR_REPO_URL .

# 3. Run setup script
cd backend/rn-auth-backend
chmod +x install.sh && ./install.sh

# 4. Create .env and deploy
# (See QUICK_DEPLOY.md for details)
```

### 🔄 Automated Deployments

After initial setup, deployments are automatic:

1. Set up GitHub Secrets (see DEPLOYMENT.md)
2. Push to main branch
3. GitHub Actions deploys automatically ✨

## 🏗️ Project Structure

```
rn-auth-backend/
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── profileController.js   # Profile management
├── middleware/
│   └── verifyToken.js         # JWT verification
├── models/
│   └── User.js                # User schema
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   └── profileRoutes.js       # Profile endpoints
├── logs/                      # PM2 logs directory
├── ecosystem.config.cjs       # PM2 configuration
├── install.sh                 # Server setup script
├── server.js                  # Main application file
├── swagger.js                 # API documentation config
├── package.json
├── DEPLOYMENT.md              # Deployment guide
└── README.md
```

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT | - | Yes |
| `NODE_ENV` | Environment (development/production) | development | No |

## 🧪 Testing with cURL

### Register
```bash
curl -X POST https://auth.ekowlabs.space/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "password": "password123",
    "address": "123 Main St"
  }'
```

### Login
```bash
curl -X POST https://auth.ekowlabs.space/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running and the connection string is correct.

### JWT Token Expired
```
{ "message": "Token is not valid" }
```
**Solution**: Login again to get a new token. Tokens expire after 24 hours.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process using port 5000 or change the PORT in `.env`.

```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

## 🔐 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- CORS configured for specific origins
- Security headers via Caddy reverse proxy
- HTTPS/SSL in production
- Environment variables for sensitive data

## 📝 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 🆘 Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For API questions, check the Swagger documentation at `/api-docs`

## 🌐 Production

- **Domain**: https://auth.ekowlabs.space
- **API Docs**: https://auth.ekowlabs.space/api-docs
- **Status**: https://auth.ekowlabs.space

