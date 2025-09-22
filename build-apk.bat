@echo off
echo Building NorLearn APK...
echo.

echo Step 1: Creating app icons from Logo.png...
call node create-icons.js
if %errorlevel% neq 0 (
    echo Icon creation failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Syncing with Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo Sync failed!
    pause
    exit /b 1
)

echo.
echo Step 4: Opening Android Studio...
echo Please build the APK in Android Studio:
echo 1. Wait for Android Studio to load
echo 2. Go to Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo 3. Wait for the build to complete
echo 4. The APK will be in: android\app\build\outputs\apk\debug\app-debug.apk
echo.
call npx cap open android

echo.
echo Build process completed!
echo Check the android\app\build\outputs\apk\debug\ folder for your APK file.
pause
