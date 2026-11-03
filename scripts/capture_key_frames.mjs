import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const puppeteer = require('../../motion-reel/node_modules/puppeteer-core');
const sharp = require('../../motion-reel/node_modules/sharp');

const OUT_DIR = 'C:/Users/Prasad/.gemini/antigravity/brain/f560532f-ed21-4313-b2a4-a914435b8f6b';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Starting Vite preview server on port 3005...');
  const server = spawn('cmd.exe', ['/c', 'bun', 'run', 'preview', '--port', '3005'], {
    cwd: 'C:/Users/Prasad/Documents/acad/yt-3/blinkit-reel',
    stdio: 'pipe'
  });

  server.stdout.on('data', data => console.log(`[Vite] ${data.toString().trim()}`));
  server.stderr.on('data', data => console.error(`[Vite ERR] ${data.toString().trim()}`));

  // Wait 3 seconds for server to start
  await sleep(3000);

  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:3005 ...');
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for doc ready
  await page.waitForFunction(() => window.__setDocTime !== undefined, { timeout: 15000 });
  console.log('Doc player ready!');

  const testFrames = [
    { t: 34.5, name: 'blinkit_frame_01_founders_kirana' },
    { t: 100.0, name: 'blinkit_frame_02_zepto_rivals' },
    { t: 142.0, name: 'blinkit_frame_03_acquisition_ceos' },
    { t: 176.0, name: 'blinkit_frame_04_dark_store_pack' },
    { t: 210.0, name: 'blinkit_frame_05_eternal_pillars' }
  ];

  const savedImages = [];

  for (const f of testFrames) {
    console.log(`Setting time to ${f.t}s (${f.name})...`);
    await page.evaluate(time => window.__setDocTime(time), f.t);
    await sleep(800); // Allow spring animations & WebGL frame to settle

    const outPath = path.join(OUT_DIR, `${f.name}.jpg`);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
    console.log(`Saved screenshot: ${outPath}`);
    savedImages.push(outPath);
  }

  await browser.close();
  server.kill();
  console.log('Browser closed and server stopped.');

  // Create a contact sheet of all 5 frames
  console.log('Creating contact sheet...');
  const sheetWidth = 1920;
  const sheetHeight = 1080;
  const thumbWidth = 580;
  const thumbHeight = 326;

  const composites = [];
  const coords = [
    { left: 40, top: 140 },
    { left: 670, top: 140 },
    { left: 1300, top: 140 },
    { left: 355, top: 560 },
    { left: 985, top: 560 }
  ];

  for (let i = 0; i < savedImages.length; i++) {
    const resized = await sharp(savedImages[i])
      .resize(thumbWidth, thumbHeight)
      .toBuffer();
    composites.push({
      input: resized,
      left: coords[i].left,
      top: coords[i].top
    });
  }

  const contactSheetPath = path.join(OUT_DIR, 'blinkit_verified_contact_sheet.jpg');
  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 3,
      background: { r: 15, g: 15, b: 20 }
    }
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(contactSheetPath);

  console.log(`Contact sheet generated at: ${contactSheetPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
