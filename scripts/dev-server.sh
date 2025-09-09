#!/bin/bash

# Stafford.dev Development Server Script
# This script runs the server in development mode with auto-reload

echo "🔧 Starting Stafford.dev in development mode..."

# Change to the project root
cd "$(dirname "$0")/.."

# Check if nodemon is installed globally
if ! command -v nodemon &> /dev/null; then
    echo "📦 Installing nodemon globally for development..."
    npm install -g nodemon
fi

# Stop any existing server
echo "🛑 Stopping any existing servers..."
./scripts/stop-server.sh

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Using .env.example as template."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📋 Created .env from .env.example. Please update it with your actual values."
    fi
fi

echo "🔧 Starting development server with auto-reload..."
echo "📝 Server will restart automatically when files change"
echo "🌐 Access your site at: http://localhost:3000"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Start the server with nodemon for auto-reload
nodemon server.js --watch . --ignore client/dist --ignore node_modules --ignore .git