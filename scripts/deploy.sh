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

# Stop the server first
echo "1️⃣ Stopping existing server..."
./scripts/stop-server.sh

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

# Build the client application
echo "4️⃣ Building client application..."
cd client
npm run build
BUILD_EXIT_CODE=$?
cd ..

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