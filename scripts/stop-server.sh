#!/bin/bash

# Stafford.dev Server Stop Script
# This script gracefully stops the running server

echo "🛑 Stopping Stafford.dev server..."

# Change to the project root
cd "$(dirname "$0")/.."

# Check if PID file exists
if [ -f .server.pid ]; then
    SERVER_PID=$(cat .server.pid)
    echo "📋 Found server PID: $SERVER_PID"
    
    # Check if process is still running
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "⏹️  Stopping server process..."
        kill $SERVER_PID
        
        # Wait for graceful shutdown
        sleep 3
        
        # Force kill if still running
        if kill -0 $SERVER_PID 2>/dev/null; then
            echo "🔨 Force stopping server..."
            kill -9 $SERVER_PID
        fi
        
        echo "✅ Server stopped successfully!"
    else
        echo "⚠️  Server process not found (may have already stopped)"
    fi
    
    # Remove PID file
    rm -f .server.pid
else
    echo "📋 No PID file found, attempting to find and stop server processes..."
    
    # Find and kill any node server.js processes
    PIDS=$(pgrep -f "node server.js")
    if [ ! -z "$PIDS" ]; then
        echo "🔍 Found server processes: $PIDS"
        pkill -f "node server.js"
        sleep 2
        echo "✅ Server processes stopped!"
    else
        echo "ℹ️  No running server processes found"
    fi
fi

# Check final status
if pgrep -f "node server.js" > /dev/null; then
    echo "⚠️  Warning: Some server processes may still be running"
    echo "🔍 Use 'ps aux | grep node' to check manually"
else
    echo "✅ All server processes stopped successfully!"
fi