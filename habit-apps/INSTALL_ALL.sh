#!/bin/bash

# Phase 3 - Install all 5 habit apps

echo "🌱 Installing Phase 3 Habit Apps..."
echo ""

APPS=("meditation-timer" "stories-player" "yoga-app" "hydrate-app" "read-timer")

for app in "${APPS[@]}"; do
  echo "📦 Installing $app..."
  cd "$app"
  npm install
  cd ..
  echo "✅ $app installed"
  echo ""
done

echo "🎉 All habit apps installed!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env.local if DDHG is not on http://localhost:3000"
echo "2. Start DDHG main app: npm run dev (port 3000)"
echo "3. Start each habit app in separate terminals:"
echo "   - meditation-timer: npm run dev (port 3001)"
echo "   - stories-player: npm run dev (port 3002)"
echo "   - yoga-app: npm run dev (port 3003)"
echo "   - hydrate-app: npm run dev (port 3004)"
echo "   - read-timer: npm run dev (port 3005)"
echo ""
echo "4. Test by visiting each app URL and clicking Complete buttons"
echo "5. Check dashboard at http://localhost:3000 for real-time updates"
