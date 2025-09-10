#!/bin/bash

# Stafford.dev Deploy Script
# This script rebuilds and deploys the application in one go

echo "🚀 Starting deployment process..."

# Change to the project root
cd "$(dirname "$0")/.."

# Check if we're in a git repository and show current status
if [ -d .git ]; then
    echo "📋 Current git status:"
    git status --short
    echo ""
fi

# Stop the server first - force kill processes on port 3000
echo "1️⃣ Stopping existing server..."
./scripts/stop-server.sh

# Additional cleanup - force kill any processes using port 3000
echo "🔧 Ensuring port 3000 is free..."
fuser -k 3000/tcp 2>/dev/null && echo "✅ Freed port 3000" || echo "ℹ️  Port 3000 already free"
sleep 1

# Install/update dependencies if package.json has changed
if [ package.json -nt node_modules/.package-json.done ] 2>/dev/null || [ ! -d node_modules ]; then
    echo "2️⃣ Installing server dependencies..."
    npm install
    touch node_modules/.package-json.done
fi

# Check and install client dependencies
if [ client/package.json -nt client/node_modules/.package-json.done ] 2>/dev/null || [ ! -d client/node_modules ]; then
    echo "3️⃣ Installing client dependencies..."
    cd client && npm install && touch node_modules/.package-json.done && cd ..
fi

# Build the client application with extended timeout
echo "4️⃣ Building client application..."
cd client
timeout 180 npm run build
BUILD_EXIT_CODE=$?
cd ..

# Handle timeout specifically
if [ $BUILD_EXIT_CODE -eq 124 ]; then
    echo "⏰ Build timed out after 3 minutes. Trying to continue with existing build..."
    if [ -d "client/dist" ] && [ -f "client/dist/index.html" ]; then
        echo "✅ Found existing build, continuing deployment..."
        BUILD_EXIT_CODE=0
    else
        echo "❌ No valid build found and build timed out."
        exit 1
    fi
fi

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "❌ Client build failed! Deployment aborted."
    exit 1
fi

# Start the server
echo "5️⃣ Starting server..."
./scripts/start-server.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "🌐 Your site is now live at: http://localhost:3000"
    echo "📝 Monitor logs with: npm run logs"
else
    echo "❌ Deployment failed during server startup."
    exit 1
fi