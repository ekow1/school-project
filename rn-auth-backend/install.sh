#!/bin/bash

echo "🚀 Setting up React Native Auth Backend..."

if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
else
  echo "✅ node_modules already exists."
fi

if [ ! -f .env ]; then
  echo "📝 Creating .env..."
  cat <<EOT >> .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rn-auth
JWT_SECRET=supersecret123
EOT
fi

echo "💡 Starting MongoDB (you may need to run 'mongod' manually)..."

echo "🚀 Launching server..."
node server.js
