# APK Build Guide - YESAYA MINISTRY

## 🎯 Overview
Hii ni guide kamili ya kujenga APK (Android application package) kwa ajili ya YESAYA MINISTRY app kwa kutumia Capacitor.

## 📋 Prerequisites

### Required Software:
1. **Node.js** 18+ - https://nodejs.org/
2. **Java JDK** 17+ - https://www.oracle.com/java/technologies/downloads/
3. **Android Studio** - https://developer.android.com/studio
4. **Android SDK** - Inakuja na Android Studio

### Environment Variables:
- `JAVA_HOME` - Point kwenye JDK installation directory
- `ANDROID_HOME` - Point kwenye Android SDK directory
- Add Android SDK tools kwenye PATH

## 🚀 Step-by-Step Build Process

### Step 1: Initial Setup (Run Once)

#### Windows:
```bash
cd frontend
android-setup.bat
```

#### Linux/Mac:
```bash
cd frontend
chmod +x android-setup.sh
./android-setup.sh
```

This script will:
- Install dependencies
- Initialize Capacitor
- Add Android platform
- Build the project
- Sync with Android

### Step 2: Build APK

#### Windows:
```bash
cd frontend
build-apk.bat
```

#### Linux/Mac:
```bash
cd frontend
chmod +x build-apk.sh
./build-apk.sh
```

This script will:
- Build React project
- Sync Capacitor with Android
- Build APK using Gradle
- Output APK location

### Step 3: Alternative Manual Build

If scripts fail, you can build manually:

```bash
cd frontend

# Install dependencies
npm install

# Initialize Capacitor (first time only)
npx cap init "YESAYA MINISTRY" "com.yesayaministry.app"

# Add Android platform (first time only)
npx cap add android

# Build React project
npm run build

# Sync with Android
npx cap sync android

# Open Android Studio (optional)
npx cap open android

# Build APK using Gradle
cd android
./gradlew assembleDebug  # Linux/Mac
gradlew.bat assembleDebug  # Windows
```

## 📱 APK Location

After successful build, APK itakuwa:
- **Windows:** `frontend\android\app\build\outputs\apk\debug\app-debug.apk`
- **Linux/Mac:** `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

## 🔧 Configuration Files

### 1. Capacitor Config
**File:** `frontend/capacitor.config.ts`
- App ID: `com.yesayaministry.app`
- App Name: `YESAYA MINISTRY`
- Web Directory: `dist`
- Android configuration included

### 2. Android Manifest
**File:** `frontend/android-manifest.xml`
- Permissions configured
- App settings
- Theme configuration

### 3. Build Configuration
**File:** `frontend/build.gradle`
- SDK versions
- Build configurations
- Dependencies

### 4. Permissions
Configured permissions:
- Internet access
- Network state
- Location (fine/coarse)
- Storage (read/write)
- Camera

## 🎨 Customization

### App Icons
1. Generate icons kwa kutumia online tools:
   - https://makeappicon.com/
   - https://www.appicon.co/

2. Replace default icons kwenye:
   - `android/app/src/main/res/mipmap-*/ic_launcher.png`

### Splash Screen
1. Create splash image (1284x2778 recommended)
2. Place kwenye: `android/app/src/main/res/drawable/splash.png`
3. Update kwenye `capacitor.config.ts`

### App Name & ID
Edit `capacitor.config.ts`:
```typescript
appId: 'com.yesayaministry.app',
appName: 'YESAYA MINISTRY',
```

## 📦 Installing APK

### On Android Device:
1. Transfer APK kwenye device
2. Enable "Install from unknown sources"
3. Open APK file
4. Follow installation prompts
5. Open app na login

### Using ADB (Android Debug Bridge):
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔍 Troubleshooting

### Issue: "JAVA_HOME not set"
**Solution:**
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

### Issue: "ANDROID_HOME not set"
**Solution:**
```bash
# Windows
set ANDROID_HOME=C:\Users\YourUser\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%PATH%

# Linux/Mac
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

### Issue: Gradle build fails
**Solution:**
1. Check internet connection
2. Open Android Studio na let it download dependencies
3. Try `./gradlew clean` before build
4. Increase Gradle memory kwenye `gradle.properties`

### Issue: Capacitor sync fails
**Solution:**
1. Remove android folder: `npx cap remove android`
2. Add again: `npx cap add android`
3. Sync again: `npx cap sync android`

### Issue: Build succeeds but app crashes
**Solution:**
1. Check `android/app/src/main/res/values/strings.xml`
2. Verify permissions kwenye `AndroidManifest.xml`
3. Check API URL kwenye `.env` file
4. Test web version first: `npm run dev`

## 🚀 Production Build (Release APK)

For production-ready APK:

### 1. Update build.gradle
```gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}
```

### 2. Create signing configuration
- Generate keystore kwa kutumia Android Studio
- Configure signing kwenye `build.gradle`

### 3. Build release APK
```bash
cd android
./gradlew assembleRelease
```

### 4. Release APK location
`android/app/build/outputs/apk/release/app-release.apk`

## 📊 Testing

### Testing Checklist:
- [ ] App installs successfully
- [ ] Login functionality works
- [ ] Data loads from backend
- [ ] Forms submit correctly
- [ ] Navigation works
- [ ] Permissions requested properly
- [ ] No crashes during usage
- [ ] Responsive design works

### Testing on Device:
1. Install APK
2. Test all major features
3. Check network connectivity
4. Test offline behavior
5. Verify data persistence

## 🔄 Updating APK

When you make changes to the app:

1. **Update code:** Make changes kwenye React project
2. **Rebuild:** Run `build-apk.bat` / `build-apk.sh`
3. **Install:** Uninstall old version, install new APK
4. **Test:** Verify changes work correctly

## 📈 Performance Optimization

### Reduce APK Size:
- Enable code splitting
- Optimize images
- Remove unused dependencies
- Use ProGuard/R8

### Improve Performance:
- Lazy loading
- Code splitting
- Optimize network requests
- Use caching

## 🔒 Security

### Security Best Practices:
- ✅ Use HTTPS for API calls
- ✅ Validate user input
- ✅ Secure storage for sensitive data
- ✅ Proper authentication
- ✅ Code obfuscation (ProGuard)

### Signing:
- Use proper keystore for production
- Protect keystore password
- Use different signing keys for debug/release

## 📝 Notes

- **Debug APK:** Kwa testing na development
- **Release APK:** Kwa production distribution
- **App ID:** Unique identifier kwa Google Play Store
- **Version Code:** Internal version number
- **Version Name:** User-facing version string

## 🆘 Support

Kama una tatizo:
1. Check error messages carefully
2. Review Android Studio logs
3. Check Capacitor documentation
4. Verify all prerequisites are installed
5. Test web version first

---

**Summary:** Run `build-apk.bat` (Windows) au `build-apk.sh` (Linux/Mac) kujenga APK kwa YESAYA MINISTRY app. APK itakuwa kwenye `android/app/build/outputs/apk/debug/` directory.