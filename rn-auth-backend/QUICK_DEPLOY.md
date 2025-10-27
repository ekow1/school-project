# 🚀 Quick Deployment Guide

Follow these steps to deploy the auth backend for the first time.

## Prerequisites

✅ A Linux server with SSH access  
✅ Domain `auth.ekowlabs.space` pointing to your server  
✅ MongoDB connection string  
✅ GitHub repository cloned  

## Step-by-Step Deployment

### 1️⃣ SSH into Your Server

```bash
ssh your-user@auth.ekowlabs.space
```

### 2️⃣ Clone the Repository (if not already done)

```bash
mkdir -p ~/school-project
cd ~/school-project
git clone https://github.com/YOUR_USERNAME/school-project.git .
```

### 3️⃣ Run Server Setup (First Time Only)

```bash
cd ~/school-project/backend/rn-auth-backend
chmod +x install.sh
./install.sh
```

This installs Node.js, Caddy, and PM2. Takes about 5-10 minutes.

### 4️⃣ Deploy the Application

```bash
# Still in ~/school-project/backend/rn-auth-backend

# Create environment file
nano .env
```

Add this content (replace with your actual MongoDB URI):

```env
PORT=5000
MONGO_URI=mongodb://user:password@host:27017/auth-db
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
```

Save and exit (Ctrl+X, Y, Enter)

### 5️⃣ Install and Start

```bash
# Install dependencies
npm install --production

# Start with PM2
pm2 start ecosystem.config.cjs

# Save PM2 config
pm2 save

# Enable PM2 startup
pm2 startup systemd
# Run the command it outputs (starts with 'sudo env PATH...')
```

### 6️⃣ Verify It's Working

```bash
# Check PM2 status
pm2 list

# Test local API
curl http://localhost:5000/api/health

# Test public API
curl https://auth.ekowlabs.space/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Auth backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## ✅ That's It!

Your auth backend is now running at:
- **API**: https://auth.ekowlabs.space/api
- **Docs**: https://auth.ekowlabs.space/api-docs

## 🔄 Future Deployments

After this initial setup, all future deployments happen automatically:

1. **Make changes** to code
2. **Push to GitHub**: `git push origin main`
3. **GitHub Actions** deploys automatically
4. Done! ✨

## 🐛 Troubleshooting

### PM2 Not Starting

```bash
pm2 logs auth-backend --lines 50
```

### MongoDB Connection Failed

Check your `MONGO_URI` in `.env`:
```bash
cat .env
```

### Port Already in Use

```bash
sudo lsof -i :5000
pm2 delete auth-backend
pm2 start ecosystem.config.cjs
```

### Caddy Not Working

```bash
sudo systemctl status caddy
sudo journalctl -u caddy -n 50
```

## 📞 Need Help?

- Check logs: `pm2 logs auth-backend`
- Restart app: `pm2 restart auth-backend`
- Check full guide: See `DEPLOYMENT.md`

