#!/bin/bash

# Quick Start Script for VectorShift Pipeline Builder

echo "🚀 VectorShift Pipeline Builder - Quick Start"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Start Backend
echo "📦 Starting Backend Server..."
cd backend

# Check if Python and uvicorn are available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed"
    exit 1
fi

# Install backend dependencies if needed
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "Installing backend dependencies..."
    pip3 install fastapi uvicorn pydantic python-multipart
fi

# Start backend in background
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:8000 (PID: $BACKEND_PID)"

cd ..

# Wait a moment for backend to start
sleep 2

# Start Frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "✅ Starting frontend on http://localhost:3000"
npm start

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Register cleanup function
trap cleanup EXIT INT TERM
