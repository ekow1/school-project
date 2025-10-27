# Auth Backend Deployment Guide

## 🚀 Automated Deployment with GitHub Actions

This project uses GitHub Actions for automated deployment to the production server.

### Prerequisites

Before deploying, ensure you have the following GitHub Secrets configured:

1. **SP_SSH_KEY** - SSH private key for server access
2. **AUTH_HOST** - Server hostname/IP (e.g., your-server.com)
3. **AI_BACKEND_USER** - SSH username for server access
4. **MONGODB_URI** - MongoDB connection string (e.g., mongodb://localhost:27017/auth-db)

### Setting Up GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

```
Name: SP_SSH_KEY
Value: [Your SSH private key]

Name: AUTH_HOST
Value: [Your server IP or domain]

Name: AI_BACKEND_USER
Value: [Your server username]

Name: MONGODB_URI
Value: mongodb://[user]:[password]@[host]:[port]/[database]
```

### Deployment Trigger

The deployment workflow automatically triggers when:
- Code is pushed to the `main` branch in the `rn-auth-backend/` directory
- The workflow file is modified
- Manually triggered via GitHub Actions UI

### Manual Deployment

To manually trigger a deployment:
1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy Auth Backend** workflow
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## 🔧 Server Setup

### Initial Server Setup

Run the installation script on your server:

```bash
cd ~/school-project/backend/rn-auth-backend
chmod +x install.sh
./install.sh
```

This will:
- Install Node.js v22
- Install Caddy web server
- Configure reverse proxy for auth.ekowlabs.space
- Set up PM2 for process management
- Configure SSL certificates automatically

### Environment Variables

The deployment script automatically creates a `.env` file with:

```env
PORT=5000
MONGO_URI=[from GitHub Secret]
JWT_SECRET=[auto-generated]
NODE_ENV=production
```

### PM2 Process Management

The application runs under PM2 with the following commands:

```bash
# View all PM2 processes
pm2 list

# View logs
pm2 logs auth-backend

# Restart application
pm2 restart auth-backend

# Stop application
pm2 stop auth-backend

# Monitor application
pm2 monit
```

## 🌐 Production URLs

Once deployed, the application is accessible at:

- **Base URL**: https://auth.ekowlabs.space
- **API Base**: https://auth.ekowlabs.space/api
- **API Documentation**: https://auth.ekowlabs.space/api-docs
- **Health Check**: https://auth.ekowlabs.space/api/health

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/profile` | Get user profile | Yes |
| GET | `/api/health` | Health check | No |

## 🔍 Monitoring

### Check Service Status

```bash
# Check PM2 status
pm2 status auth-backend

# Check Caddy status
sudo systemctl status caddy

# View application logs
pm2 logs auth-backend --lines 100

# View Caddy logs
sudo journalctl -u caddy -f
```

### Health Check

```bash
curl https://auth.ekowlabs.space/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Auth backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🐛 Troubleshooting

### Deployment Failed

1. Check GitHub Actions logs
2. Verify all secrets are correctly set
3. Ensure SSH key has proper permissions on the server

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs auth-backend --err

# Check if port is in use
sudo netstat -tulpn | grep 5000

# Restart the application
pm2 restart auth-backend
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongosh $MONGODB_URI

# Check environment variables
pm2 env auth-backend
```

### SSL/HTTPS Issues

```bash
# Check Caddy configuration
sudo caddy validate --config /etc/caddy/Caddyfile

# Reload Caddy
sudo systemctl reload caddy

# Check Caddy logs
sudo journalctl -u caddy -n 50
```

## 📦 Manual Deployment (Without GitHub Actions)

If you need to deploy manually:

```bash
# SSH into server
ssh $USER@$HOST

# Navigate to project directory
cd ~/school-project/backend/rn-auth-backend

# Pull latest changes
git pull origin main

# Install dependencies
npm install --production

# Restart application
pm2 restart auth-backend

# Or start if not running
pm2 start ecosystem.config.cjs
```

## 🔒 Security Notes

- JWT_SECRET is auto-generated on deployment
- All traffic is encrypted with SSL
- MongoDB credentials are stored in GitHub Secrets
- SSH keys should have proper permissions (600)
- CORS is configured for production use

## 📝 Additional Configuration

### Update Domain

To change the domain, edit:
1. `install.sh` - Update `DOMAIN` variable
2. Run `./install.sh` to reconfigure Caddy

### Update Port

To change the port:
1. Update `PORT` in environment variables
2. Update `BACKEND_PORT` in `install.sh`
3. Reconfigure Caddy
4. Restart the application

## 🆘 Support

If you encounter issues:
1. Check the logs: `pm2 logs auth-backend`
2. Verify server status: `pm2 status`
3. Check Caddy: `sudo systemctl status caddy`
4. Review GitHub Actions logs for deployment errors

