#!/bin/bash

echo "🚀 Starting BlogCommits..."
echo ""
echo "📝 Make sure you have set up your .env file in the backend directory with:"
echo "   - GITHUB_TOKEN"
echo "   - OPENAI_API_KEY"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found!"
    echo "   Creating from env.example..."
    cp backend/env.example backend/.env
    echo "   Please edit backend/.env with your API keys before continuing."
    exit 1
fi

echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

cd ..

echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ Both servers are starting!"
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
