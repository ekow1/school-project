# Migration from PM2 to Systemd

## ✅ Changes Made

We've migrated from PM2 process management to systemd for better reliability and integration with the system.

### What Changed

**Before (PM2):**
- Used `pm2 start ecosystem.config.cjs`
- Managed via PM2 commands
- Required PM2 to be installed globally

**After (Systemd):**
- Uses systemd service: `auth-backend.service`
- Managed via standard `systemctl` commands
- Better integration with system logging and monitoring

## 🔧 Service Management

### Start/Stop/Restart
```bash
sudo systemctl start auth-backend
sudo systemctl stop auth-backend
sudo systemctl restart auth-backend
```

### Check Status
```bash
sudo systemctl status auth-backend
```

### Enable Auto-start on Boot
```bash
sudo systemctl enable auth-backend
```

### View Logs
```bash
# Real-time logs
sudo journalctl -u auth-backend -f

# Last 50 lines
sudo journalctl -u auth-backend -n 50

# Application logs (also available)
tail -f ~/school-project/backend/rn-auth-backend/logs/out.log
tail -f ~/school-project/backend/rn-auth-backend/logs/err.log
```

## 📝 Service Configuration

The service file is automatically created during deployment at:
`/etc/systemd/system/auth-backend.service`

```ini
[Unit]
Description=Auth Backend Node.js Server
After=network.target

[Service]
ExecStart=/usr/bin/node /home/USER/school-project/backend/rn-auth-backend/server.js
Restart=always
User=USER
Environment=NODE_ENV=production
WorkingDirectory=/home/USER/school-project/backend/rn-auth-backend
StandardOutput=append:/home/USER/school-project/backend/rn-auth-backend/logs/out.log
StandardError=append:/home/USER/school-project/backend/rn-auth-backend/logs/err.log

[Install]
WantedBy=multi-user.target
```

## 🧹 Cleaning Up Old PM2 Setup

If you had PM2 installed before, the deployment will automatically clean up:

```bash
# This happens automatically in the workflow
pm2 delete auth-backend 2>/dev/null || true
pm2 save --force 2>/dev/null || true
```

### Manual Cleanup (if needed)
```bash
# Delete PM2 process
pm2 delete auth-backend

# Remove PM2 startup script
pm2 unstartup

# Optionally uninstall PM2
sudo npm uninstall -g pm2
```

## 🚀 Deployment Changes

### GitHub Actions Workflow
- Now creates systemd service instead of PM2 process
- Uses `systemctl` commands for management
- Logs via journalctl and log files

### Server Requirements
- Node.js (same as before)
- Caddy (same as before)
- systemd (comes with Ubuntu/Debian)
- No need for PM2 anymore

## 📊 Benefits

✅ **System Integration**: Better integration with Linux system services  
✅ **Auto-restart**: Automatic restart on crash or system reboot  
✅ **Logging**: Integrated with systemd journal for better log management  
✅ **Resource Control**: Can set memory/CPU limits via systemd  
✅ **Simpler**: No need to install additional process manager  
✅ **Standard**: Uses standard Linux service management  

## 🔍 Troubleshooting

### Service won't start
```bash
# Check service status
sudo systemctl status auth-backend

# Check logs
sudo journalctl -u auth-backend -n 50

# Check application logs
cat ~/school-project/backend/rn-auth-backend/logs/err.log
```

### Need to edit service file
```bash
# Edit the service
sudo nano /etc/systemd/system/auth-backend.service

# Reload systemd
sudo systemctl daemon-reload

# Restart service
sudo systemctl restart auth-backend
```

### Port already in use
```bash
# Check what's using port 5000
sudo lsof -i :5000

# Stop the service
sudo systemctl stop auth-backend

# Kill any remaining process
sudo kill -9 $(sudo lsof -t -i:5000)

# Start service again
sudo systemctl start auth-backend
```

## 📚 Additional Resources

- [Systemd Service Documentation](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [journalctl Manual](https://www.freedesktop.org/software/systemd/man/journalctl.html)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

