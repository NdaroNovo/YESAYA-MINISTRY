@echo off
REM APK Build Script for YESAYA MINISTRY (Windows)

echo 🚀 Building YESAYA MINISTRY APK...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Check if Capacitor is initialized
if not exist "capacitor.config.ts" (
    echo ❌ Capacitor not initialized. Run android-setup.bat first.
    pause
    exit /b 1
)

REM Check if Android platform exists
if not exist "android" (
    echo ❌ Android platform not found. Run android-setup.bat first.
    pause
    exit /b 1
)

REM Build the project
echo 🔨 Building React project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM Sync Capacitor
echo 🔄 Syncing Capacitor with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed
    pause
    exit /b 1
)

REM Build APK
echo 📱 Building APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ❌ APK build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ APK build completed successfully!
echo.
echo 📦 APK Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📲 Next steps:
echo 1. Transfer APK to your Android device
echo 2. Enable "Install from unknown sources" in device settings
echo 3. Install the APK
echo 4. Test the app
echo.

pause
