// Script to create app icons from Logo.png
const fs = require('fs');
const path = require('path');

console.log('Creating app icons from Logo.png...');

// Check if Logo.png exists
const logoPath = path.join(__dirname, 'public', 'Logo.png');
if (!fs.existsSync(logoPath)) {
  console.error('Error: Logo.png not found in public directory!');
  console.error('Please make sure Logo.png exists in the public folder.');
  process.exit(1);
}

// Create directories if they don't exist
const androidDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
const iconDirs = [
  'mipmap-hdpi',
  'mipmap-mdpi', 
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi'
];

// Create the main icon directories
iconDirs.forEach(dir => {
  const fullPath = path.join(androidDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Copy Logo.png to each density folder with appropriate names
iconDirs.forEach(dir => {
  const fullPath = path.join(androidDir, dir);
  
  // Copy Logo.png as the main launcher icon
  const mainIconPath = path.join(fullPath, 'ic_launcher.png');
  fs.copyFileSync(logoPath, mainIconPath);
  
  // Copy Logo.png as the foreground icon for adaptive icons
  const foregroundIconPath = path.join(fullPath, 'ic_launcher_foreground.png');
  fs.copyFileSync(logoPath, foregroundIconPath);
  
  // Copy Logo.png as the round launcher icon
  const roundIconPath = path.join(fullPath, 'ic_launcher_round.png');
  fs.copyFileSync(logoPath, roundIconPath);
  
  console.log(`✓ Created icons in ${dir}`);
});

// Create the main icon.svg file in public directory (for web)
const publicIconSvg = `<svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern id="publicLogoPattern" patternUnits="userSpaceOnUse" width="192" height="192">
<image href="Logo.png" width="192" height="192" preserveAspectRatio="xMidYMid slice"/>
</pattern>
</defs>
<circle cx="96" cy="96" r="96" fill="url(#publicLogoPattern)"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'icon.svg'), publicIconSvg);

console.log('✓ App icons created successfully using Logo.png!');
console.log('✓ Icons copied to all Android density folders');
console.log('✓ Main icon.svg created for web');
console.log('');
console.log('Next steps:');
console.log('1. Run: npm run build');
console.log('2. Run: npx cap sync');
console.log('3. Open Android Studio and build your APK');
console.log('');
console.log('Note: The icons will use your Logo.png file directly.');
console.log('For better Android compatibility, you may want to manually');
console.log('resize the Logo.png to different dimensions in Android Studio.');
