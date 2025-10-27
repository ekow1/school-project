#!/bin/bash
set -e

# Manual deployment script for auth backend
# Usage: ./deploy.sh [server-user@server-host]

echo "🚀 Auth Backend Manual Deployment Script"
echo "========================================"

# Check if server argument is provided
if [ -z "$1" ]; then
  echo "❌ Error: Server argument required"
  echo "Usage: ./deploy.sh [user@server-host]"
  echo "Example: ./deploy.sh root@auth.ekowlabs.space"
  exit 1
fi

SERVER=$1
echo "📡 Target server: $SERVER"

# Check if required files exist
if [ ! -f "server.js" ]; then
  echo "❌ Error: Must run from rn-auth-backend directory"
  exit 1
fi

echo ""
echo "📦 Step 1: Creating deployment package..."
rm -f auth-backend-deploy.tar.gz

tar -czf auth-backend-deploy.tar.gz \
  controllers/ \
  middleware/ \
  models/ \
  routes/ \
  server.js \
  swagger.js \
  package.json \
  package-lock.json \
  ecosystem.config.cjs \
  --exclude=node_modules \
  --exclude=logs/*.log

echo "✅ Package created: auth-backend-deploy.tar.gz"

echo ""
echo "📤 Step 2: Uploading to server..."
scp auth-backend-deploy.tar.gz $SERVER:~/

echo ""
echo "⚙️ Step 3: Deploying on server..."
ssh $SERVER << 'ENDSSH'
  set -e
  
  echo "📁 Creating application directory..."
  mkdir -p ~/school-project/backend/rn-auth-backend
  cd ~/school-project/backend/rn-auth-backend
  
  echo "📦 Extracting deployment package..."
  tar -xzf ~/auth-backend-deploy.tar.gz
  rm ~/auth-backend-deploy.tar.gz
  
  echo "📋 Files deployed:"
  ls -la
  
  echo ""
  echo "⚠️ Please set up environment variables manually:"
  echo "   Create .env file with:"
  echo "   - PORT=5000"
  echo "   - MONGO_URI=your-mongodb-uri"
  echo "   - JWT_SECRET=your-secret"
  echo "   - NODE_ENV=production"
  echo ""
  read -p "Press enter when .env is ready..."
  
  echo "📦 Installing dependencies..."
  npm install --production
  
  echo "🔄 Managing PM2 process..."
  if pm2 describe auth-backend > /dev/null 2>&1; then
    echo "♻️ Restarting existing PM2 process..."
    pm2 restart auth-backend
  else
    echo "✨ Starting new PM2 process..."
    pm2 start ecosystem.config.cjs
  fi
  
  pm2 save
  pm2 list
  
  echo ""
  echo "✅ Deployment complete!"
  echo "🔍 Testing health endpoint..."
  sleep 5
  curl -s http://localhost:5000/api/health | jq '.' || echo "⚠️ Health check failed"
ENDSSH

echo ""
echo "🎉 Deployment finished!"
echo ""
echo "🌐 Your API should be available at:"
echo "   https://auth.ekowlabs.space/api"
echo ""
echo "📚 API Documentation:"
echo "   https://auth.ekowlabs.space/api-docs"
echo ""
echo "🔍 Check logs with:"
echo "   ssh $SERVER 'pm2 logs auth-backend'"
echo ""
echo "🔄 Restart with:"
echo "   ssh $SERVER 'pm2 restart auth-backend'"

