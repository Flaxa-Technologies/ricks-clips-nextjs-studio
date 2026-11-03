import fs from 'fs';
import path from 'path';
import sharp from 'C:/Users/Prasad/Documents/acad/yt-3/motion-reel/node_modules/sharp';

const OUT_DIR = path.resolve('public/images');
fs.mkdirSync(OUT_DIR, { recursive: true });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadFile(url, destPath) {
  console.log(`Downloading: ${url} -> ${destPath}`);
  await sleep(1500); // Respect Wikimedia rate limit
  const res = await fetch(url, {
    headers: { 'User-Agent': 'MotionDocumentaryResearchBot/1.0 (https://github.com/documentary; documentary@example.com)' }
  });
  if (!res.ok) {
    console.warn(`Warning: HTTP ${res.status} on ${url}`);
    return null;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer;
}

async function main() {
  console.log('--- Step 1: Copying verified assets from motion-reel ---');
  const motionImagesDir = 'C:/Users/Prasad/Documents/acad/yt-3/motion-reel/public/images';
  
  // Zomato
  fs.copyFileSync(`${motionImagesDir}/02_zomato_logo_color.png`, `${OUT_DIR}/03_zomato_logo_color.png`);
  fs.copyFileSync(`${motionImagesDir}/02_zomato_logo_mono.png`, `${OUT_DIR}/03_zomato_logo_mono.png`);

  // Swiggy / Instamart
  fs.copyFileSync(`${motionImagesDir}/03_swiggy_logo_color.png`, `${OUT_DIR}/05_instamart_logo_color.png`);
  fs.copyFileSync(`${motionImagesDir}/03_swiggy_logo_mono.png`, `${OUT_DIR}/05_instamart_logo_mono.png`);

  // Dunzo
  fs.copyFileSync(`${motionImagesDir}/07_dunzo_logo_color.png`, `${OUT_DIR}/06_dunzo_logo_color.png`);
  fs.copyFileSync(`${motionImagesDir}/07_dunzo_logo_mono.png`, `${OUT_DIR}/06_dunzo_logo_mono.png`);

  // Eternal
  fs.copyFileSync(`${motionImagesDir}/09_eternal_logo_color.png`, `${OUT_DIR}/09_eternal_logo_color.png`);
  fs.copyFileSync(`${motionImagesDir}/09_eternal_logo_mono.png`, `${OUT_DIR}/09_eternal_logo_mono.png`);

  // Deepinder Goyal
  fs.copyFileSync(`${motionImagesDir}/01_deepinder_goyal_color.png`, `${OUT_DIR}/person_deepinder_goyal_color.png`);
  fs.copyFileSync(`${motionImagesDir}/01_deepinder_goyal_mono.png`, `${OUT_DIR}/person_deepinder_goyal_mono.png`);
  console.log('Copied Zomato, Swiggy, Dunzo, Eternal, and Deepinder Goyal images!');

  console.log('--- Step 2: Downloading real-world documentary photographs ---');
  
  // Real Blinkit Dark Store Warehouse
  await downloadFile(
    'https://upload.wikimedia.org/wikipedia/commons/0/0b/Blinkit_warehouse_in_Hyderabad_Hitech_City.jpg',
    `${OUT_DIR}/scene_blinkit_warehouse.jpg`
  );

  // Real Blinkit Delivery Bike
  await downloadFile(
    'https://upload.wikimedia.org/wikipedia/commons/3/3e/Blinkit_delivery_bike_in_Hitech_City.jpg',
    `${OUT_DIR}/scene_blinkit_delivery_bike.jpg`
  );

  // Real Swiggy Delivery Partner
  await downloadFile(
    'https://upload.wikimedia.org/wikipedia/commons/1/18/Swiggy_delivery_partner.jpg',
    `${OUT_DIR}/scene_swiggy_delivery_partner.jpg`
  );

  console.log('Finished downloading photos!');
}

main().catch(err => {
  console.error('Error in asset processing:', err);
  process.exit(1);
});
