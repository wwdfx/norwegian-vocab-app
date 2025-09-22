# NorLearn App Icon Setup

## Overview
Your NorLearn app now uses the same `Logo.png` file for both the web app and the Android APK icon. This ensures consistent branding across all platforms.

## How It Works

### 1. Logo File
- **Location**: `public/Logo.png`
- **Usage**: This single file is used for all app icons
- **Format**: PNG with transparent background recommended

### 2. Icon Generation
The `create-icons.js` script automatically:
- Copies your `Logo.png` to all Android density folders
- Creates the necessary icon files for Android Studio
- Generates a web-compatible `icon.svg`

### 3. Android Icon Files Created
For each density folder (`mipmap-hdpi`, `mipmap-mdpi`, etc.), the script creates:
- `ic_launcher.png` - Main app icon
- `ic_launcher_foreground.png` - Foreground for adaptive icons
- `ic_launcher_round.png` - Round launcher icon

## Customization

### Changing the Logo
1. Replace `public/Logo.png` with your new logo
2. Run `node create-icons.js` to regenerate icons
3. Run `npm run build` and `npx cap sync`

### Logo Requirements
- **Format**: PNG (recommended) or JPG
- **Size**: At least 192x192 pixels (larger is better)
- **Background**: Transparent or solid color
- **Shape**: Square recommended (will be automatically rounded)

### Color Scheme
The app uses a purple-to-blue gradient theme:
- Primary: `#847EFF` (purple)
- Secondary: `#6347F7` (darker purple)
- Accent: `#7c3aed` (theme color)

## Build Process

### Automatic (Recommended)
1. Run `build-apk.bat` (Windows) or follow the manual steps below
2. The script automatically handles icon generation

### Manual Steps
1. Generate icons: `node create-icons.js`
2. Build React app: `npm run build`
3. Sync with Capacitor: `npx cap sync`
4. Open Android Studio: `npx cap open android`
5. Build APK in Android Studio

## Troubleshooting

### Icons Not Appearing
- Ensure `Logo.png` exists in the `public` folder
- Check that the file is a valid PNG image
- Verify the `create-icons.js` script ran successfully

### Android Studio Issues
- Icons are automatically copied to the correct folders
- If you need different sizes, manually resize `Logo.png` in Android Studio
- Use Android Studio's built-in icon generator for additional customization

### Web Icon Issues
- The `icon.svg` file is automatically generated
- Check that `Logo.png` is accessible in the public folder

## File Structure
```
norwegian-vocab-app/
├── public/
│   ├── Logo.png          # Your main logo file
│   └── icon.svg          # Auto-generated web icon
├── android/app/src/main/res/
│   ├── mipmap-hdpi/      # 72x72 icons
│   ├── mipmap-mdpi/      # 48x48 icons
│   ├── mipmap-xhdpi/     # 96x96 icons
│   ├── mipmap-xxhdpi/    # 144x144 icons
│   └── mipmap-xxxhdpi/   # 192x192 icons
├── create-icons.js        # Icon generation script
└── build-apk.bat         # Build script (Windows)
```

## Notes
- Your `Logo.png` will be automatically resized for different Android densities
- The same logo appears in the web app header, login screen, and all components
- For best results, use a high-resolution PNG with a transparent background
- The Norwegian flag design in your logo perfectly complements the app's purpose! 🇳🇴
