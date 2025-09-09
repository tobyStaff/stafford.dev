#!/bin/bash

# Stafford.dev Server Restart Script
# This script stops and starts the server with a fresh build

echo "🔄 Restarting Stafford.dev server..."

# Change to the project root
cd "$(dirname "$0")/.."

# Stop the server first
echo "1️⃣ Stopping existing server..."
./scripts/stop-server.sh

# Build the client application
echo "2️⃣ Building client application..."
cd client
npm run build
BUILD_EXIT_CODE=$?
cd ..

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "❌ Client build failed! Server not started."
    exit 1
fi

echo "3️⃣ Starting server..."
./scripts/start-server.sh

echo "🎉 Server restart complete!"