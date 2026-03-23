#!/bin/bash

# Phase 3 - Start all 5 habit apps in background

echo "🌱 Starting Phase 3 Habit Apps..."
echo ""

APPS=("meditation-timer" "stories-player" "yoga-app" "hydrate-app" "read-timer")
PORTS=(3001 3002 3003 3004 3005)

# Check if DDHG is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "⚠️  DDHG main app not detected on http://localhost:3000"
  echo "   Make sure to start it first: cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden && npm run dev"
  echo ""
fi

# Start each app
for i in "${!APPS[@]}"; do
  app="${APPS[$i]}"
  port="${PORTS[$i]}"
  
  echo "🚀 Starting $app on port $port..."
  cd "$app"
  npm run dev > "./.logs/dev.log" 2>&1 &
  echo "$!" > "./.pid"
  cd ..
  echo "   ✅ Running (PID: $(cat $app/.pid))"
  sleep 1
done

echo ""
echo "🎉 All habit apps started!"
echo ""
echo "📱 App URLs:"
echo "   - Meditation Timer: http://localhost:3001"
echo "   - Stories Player: http://localhost:3002"
echo "   - Yoga App: http://localhost:3003"
echo "   - Hydrate App: http://localhost:3004"
echo "   - Read Timer: http://localhost:3005"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo ""
echo "💡 To stop all apps, run: bash STOP_ALL.sh"
