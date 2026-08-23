#!/bin/bash
# Android APK Build Script for YESAYA MINISTRY

echo "🚀 Setting up Android APK build for YESAYA MINISTRY..."

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install Capacitor CLI globally if not installed
if ! command -v cap &> /dev/null; then
    echo "📦 Installing Capacitor CLI globally..."
    npm install -g @capacitor/cli
fi

# Initialize Capacitor if not already initialized
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️  Initializing Capacitor..."
    npx cap init "YESAYA MINISTRY" "com.yesayaministry.app"
fi

# Add Android platform if not added
if [ ! -d "android" ]; then
    echo "🤖 Adding Android platform..."
    npx cap add android
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

echo "✅ Setup complete!"
echo ""
echo "📱 Next steps:"
echo "1. Open Android Studio: npx cap open android"
echo "2. Build APK in Android Studio or run: cd android && ./gradlew assembleDebug"
echo "3. APK will be in: android/app/build/outputs/apk/debug/"
