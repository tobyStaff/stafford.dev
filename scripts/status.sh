#!/bin/bash

# Stafford.dev Server Status Script
# This script checks the current status of the server

echo "📊 Stafford.dev Server Status"
echo "=============================="

# Change to the project root
cd "$(dirname "$0")/.."

# Check if PID file exists
if [ -f .server.pid ]; then
    SERVER_PID=$(cat .server.pid)
    echo "📋 PID File: Found (PID: $SERVER_PID)"
    
    # Check if process is actually running
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "✅ Server Status: Running"
        echo "🔗 Process ID: $SERVER_PID"
    else
        echo "❌ Server Status: Not Running (stale PID file)"
        rm -f .server.pid
    fi
else
    echo "📋 PID File: Not found"
fi

# Check for any node server.js processes
RUNNING_PIDS=$(pgrep -f "node server.js")
if [ ! -z "$RUNNING_PIDS" ]; then
    echo "🔍 Running Processes: $RUNNING_PIDS"
    echo "✅ Server Status: Active"
else
    echo "❌ Server Status: Not Running"
fi

# Check if port 3000 is in use
if command -v lsof &> /dev/null; then
    PORT_CHECK=$(lsof -i :3000 2>/dev/null)
    if [ ! -z "$PORT_CHECK" ]; then
        echo "🌐 Port 3000: In use"
        echo "$PORT_CHECK"
    else
        echo "🌐 Port 3000: Available"
    fi
fi

# Check log file
if [ -f server.log ]; then
    echo "📝 Log File: Available ($(wc -l < server.log) lines)"
    echo "🕐 Last 3 log entries:"
    tail -n 3 server.log | sed 's/^/   /'
else
    echo "📝 Log File: Not found"
fi

# Check if client is built
if [ -d "client/dist" ]; then
    echo "📦 Client Build: Available"
else
    echo "📦 Client Build: Not found (run 'npm run build')"
fi

echo ""
echo "🎯 Quick Actions:"
echo "   npm start     - Start the server"
echo "   npm stop      - Stop the server"
echo "   npm restart   - Restart the server"
echo "   npm run dev   - Start in development mode"
echo "   npm run logs  - View live logs"