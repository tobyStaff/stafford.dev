#!/bin/bash

# Stafford.dev Server Start Script
# This script starts the production server with proper logging

echo "🚀 Starting Stafford.dev server..."

# Change to the project root
cd "$(dirname "$0")/.."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Using .env.example as template."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📋 Created .env from .env.example. Please update it with your actual values."
    fi
fi

# Build the client if dist doesn't exist
if [ ! -d "client/dist" ]; then
    echo "📦 Building client application..."
    cd client && npm run build && cd ..
fi

# Kill any existing server process and free port 3000
echo "🔍 Checking for existing server processes..."
pkill -f "node server.js" 2>/dev/null
fuser -k 3000/tcp 2>/dev/null && echo "🔧 Freed port 3000" || echo "ℹ️  Port 3000 already free"
sleep 2

# Start the server in background
echo "▶️  Starting server on port 3000..."
nohup node server.js > server.log 2>&1 &
SERVER_PID=$!

# Wait a moment and check if server started successfully
sleep 3
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully!"
    echo "📋 Process ID: $SERVER_PID"
    echo "🌐 Access your site at: http://localhost:3000"
    echo "📝 Logs available in: server.log"
    
    # Save PID for stop script
    echo $SERVER_PID > .server.pid
else
    echo "❌ Failed to start server. Check server.log for details."
    exit 1
fi