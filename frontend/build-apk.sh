#!/bin/bash
# APK Build Script for YESAYA MINISTRY (Linux/Mac)

echo "🚀 Building YESAYA MINISTRY APK..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if Capacitor is initialized
if [ ! -f "capacitor.config.ts" ]; then
    echo "❌ Capacitor not initialized. Run android-setup.sh first."
    exit 1
fi

# Check if Android platform exists
if [ ! -d "android" ]; then
    echo "❌ Android platform not found. Run android-setup.sh first."
    exit 1
fi

# Build the project
echo "🔨 Building React project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Sync Capacitor
echo "🔄 Syncing Capacitor with Android..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed"
    exit 1
fi

# Build APK
echo "📱 Building APK..."
cd android
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo "❌ APK build failed"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "✅ APK build completed successfully!"
echo ""
echo "📦 APK Location: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📲 Next steps:"
echo "1. Transfer APK to your Android device"
echo "2. Enable 'Install from unknown sources' in device settings"
echo "3. Install the APK"
echo "4. Test the app"
echo ""
