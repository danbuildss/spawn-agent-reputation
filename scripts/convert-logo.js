const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertLogo() {
  const svgPath = path.join(__dirname, '../public/logo.svg');
  const pngPath = path.join(__dirname, '../public/logo.png');
  const faviconPath = path.join(__dirname, '../public/favicon.png');
  const iconPath = path.join(__dirname, '../app/icon.png');
  const appleIconPath = path.join(__dirname, '../app/apple-icon.png');
  
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Create main logo (200x200)
  await sharp(svgBuffer)
    .resize(200, 200)
    .png()
    .toFile(pngPath);
  console.log('Created logo.png (200x200)');
  
  // Create favicon (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconPath);
  console.log('Created favicon.png (32x32)');
  
  // Create app icon (180x180 for apple)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(iconPath);
  console.log('Created app/icon.png (180x180)');
  
  // Create apple icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleIconPath);
  console.log('Created app/apple-icon.png (180x180)');
  
  console.log('All logos generated successfully!');
}

convertLogo().catch(console.error);
