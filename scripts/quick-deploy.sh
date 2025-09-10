#!/bin/bash

# Ultra-fast deployment script for Stafford.dev
echo "⚡ Quick Deploy Started..."

# Kill everything on port 3000 immediately
fuser -k 3000/tcp 2>/dev/null
pkill -9 -f "node server.js" 2>/dev/null
sleep 1

# Use existing build if it exists and is recent (less than 1 hour old)
if [ -f "client/dist/index.html" ] && [ $(find client/dist/index.html -mmin -60 2>/dev/null | wc -l) -gt 0 ]; then
    echo "✅ Using recent build (skipping rebuild)"
else
    echo "🔨 Quick build..."
    cd client && timeout 60 npm run build && cd .. || echo "⚠️  Build failed, using existing files"
fi

# Start server
echo "🚀 Starting server..."
nohup node server.js > server.log 2>&1 &
SERVER_PID=$!

# Quick check
sleep 2
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Deployed successfully on http://localhost:3000"
    echo $SERVER_PID > .server.pid
else
    echo "❌ Deployment failed - check server.log"
    exit 1
fi