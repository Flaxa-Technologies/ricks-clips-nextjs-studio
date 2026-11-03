import fs from 'fs';
import path from 'path';
import sharp from 'C:/Users/Prasad/Documents/acad/yt-3/motion-reel/node_modules/sharp';

const OUT_DIR = path.resolve('public/images');
const BRAIN_DIR = 'C:/Users/Prasad/.gemini/antigravity/brain/f560532f-ed21-4313-b2a4-a914435b8f6b';

async function processPortrait(srcPath, baseName) {
  const colorPath = path.join(OUT_DIR, `${baseName}_color.png`);
  const monoPath = path.join(OUT_DIR, `${baseName}_mono.png`);

  console.log(`Processing portrait: ${srcPath} -> ${colorPath}`);

  // Create high-res 512x512 rounded/oval cutout or clean square portrait
  await sharp(srcPath)
    .resize(512, 512, { fit: 'cover', position: 'top' })
    .png()
    .toFile(colorPath);

  await sharp(colorPath)
    .grayscale()
    .modulate({ brightness: 1.05, contrast: 1.25 })
    .png()
    .toFile(monoPath);

  console.log(`Saved: ${colorPath} & ${monoPath}`);
}

async function main() {
  // 1. Albinder Dhindsa
  await processPortrait(
    `${BRAIN_DIR}/albinder_dhindsa_portrait_1793686677465.jpg`,
    'person_albinder_dhindsa'
  );

  // 2. Saurabh Kumar
  await processPortrait(
    `${BRAIN_DIR}/saurabh_kumar_portrait_1793686694155.jpg`,
    'person_saurabh_kumar'
  );

  // 3. Aadit Palicha
  await processPortrait(
    `${BRAIN_DIR}/aadit_palicha_portrait_1793686737407.jpg`,
    'person_aadit_palicha'
  );

  // 4. Scenes
  fs.copyFileSync(
    `${BRAIN_DIR}/indian_kirana_store_1793686686568.jpg`,
    path.join(OUT_DIR, 'scene_indian_kirana_store.jpg')
  );
  fs.copyFileSync(
    `${BRAIN_DIR}/blinkit_micro_fulfillment_dark_store_1793686707252.jpg`,
    path.join(OUT_DIR, 'scene_blinkit_dark_store.jpg')
  );

  console.log('All person and scene assets processed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
