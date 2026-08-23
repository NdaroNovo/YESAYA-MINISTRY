@echo off
REM Android APK Build Script for YESAYA MINISTRY (Windows)

echo 🚀 Setting up Android APK build for YESAYA MINISTRY...

REM Navigate to frontend directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Install Capacitor CLI globally if not installed
where cap >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Capacitor CLI globally...
    call npm install -g @capacitor/cli
)

REM Initialize Capacitor if not already initialized
if not exist "capacitor.config.ts" (
    echo ⚙️  Initializing Capacitor...
    call npx cap init "YESAYA MINISTRY" "com.yesayaministry.app"
)

REM Add Android platform if not added
if not exist "android" (
    echo 🤖 Adding Android platform...
    call npx cap add android
)

REM Build the project
echo 🔨 Building project...
call npm run build

REM Sync Capacitor
echo 🔄 Syncing Capacitor...
call npx cap sync android

echo ✅ Setup complete!
echo.
echo 📱 Next steps:
echo 1. Open Android Studio: npx cap open android
echo 2. Build APK in Android Studio or run: cd android && gradlew.bat assembleDebug
echo 3. APK will be in: android\app\build\outputs\apk\debug\

pause
