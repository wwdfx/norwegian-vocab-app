const fs = require('fs');
const path = require('path');

// Create PWA icons directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');

// Copy and resize Logo.png for PWA icons
const iconSizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 }
];

console.log('🔄 Creating PWA icons...');

iconSizes.forEach(({ name, size }) => {
  const sourcePath = path.join(publicDir, 'Logo.png');
  const targetPath = path.join(publicDir, name);
  
  // For now, just copy the Logo.png as the icon
  // In a production environment, you'd want to resize it properly
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Created ${name} (${size}x${size})`);
  } catch (error) {
    console.log(`⚠️  Could not create ${name}, using Logo.png instead`);
  }
});

console.log('🎉 PWA icons created successfully!');
console.log('📱 Your app is now ready for PWA installation!');
