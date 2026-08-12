#!/usr/bin/env bash

set -euo pipefail

echo "🔧 EAS Build Hook: Fixing splash screen logo after prebuild..."

# Wait a moment for prebuild to complete
sleep 2

# Check if we're building for Android
if [ "$EAS_BUILD_PLATFORM" = "android" ] || [ -z "${EAS_BUILD_PLATFORM:-}" ]; then
  SPLASH_SOURCE="assets/images/splash-icon.png"
  SPLASH_DEST="android/app/src/main/res/drawable/splashscreen_logo.png"
  
  # Check if android directory exists (meaning prebuild has run)
  if [ -d "android/app/src/main/res/drawable" ]; then
    # Check if source file exists
    if [ -f "$SPLASH_SOURCE" ]; then
      echo "✅ Found splash source: $SPLASH_SOURCE"
      
      # Copy the splash icon
      cp "$SPLASH_SOURCE" "$SPLASH_DEST"
      
      echo "✅ Copied splash logo to: $SPLASH_DEST"
      echo "📝 File size: $(ls -lh "$SPLASH_DEST" | awk '{print $5}')"
    else
      echo "⚠️  Warning: Splash source not found at $SPLASH_SOURCE"
      exit 1
    fi
  else
    echo "⚠️  Android directory not found yet, hook may have run too early"
    echo "ℹ️  This script should run after prebuild"
  fi
fi

echo "✅ Hook completed"
