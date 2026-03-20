const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../assets/images/logo.png');
const iosOutputPath = path.join(__dirname, '../assets/images/icon-ios.png');
const androidOutputPath = path.join(__dirname, '../assets/images/icon-android-foreground.png');

async function main() {
  try {
    if (!fs.existsSync(inputPath)) {
      console.error('Logo file not found at:', inputPath);
      return;
    }

    const metadata = await sharp(inputPath).metadata();
    console.log(`Original size: ${metadata.width}x${metadata.height}`);

    // iOS Icon: 1024x1024, white background, no alpha
    await sharp(inputPath)
      .resize({
        width: 1024,
        height: 1024,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .flatten({ background: '#ffffff' }) // Ensure no transparency
      .toFile(iosOutputPath);
    
    // Android Foreground Icon: 1024x1024, transparent background
    await sharp(inputPath)
      .resize({
        width: 1024,
        height: 1024,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(androidOutputPath);
      
    console.log('Images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
  }
}

main();
