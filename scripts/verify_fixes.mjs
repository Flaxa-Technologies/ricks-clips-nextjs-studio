import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import puppeteer from 'file:///C:/Users/Prasad/Documents/acad/yt-3/motion-reel/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const OUT_DIR = 'C:/Users/Prasad/.gemini/antigravity/brain/f560532f-ed21-4313-b2a4-a914435b8f6b';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const server = spawn('cmd.exe', ['/c', 'bun', 'run', 'preview', '--port', '3005'], {
    cwd: 'C:/Users/Prasad/Documents/acad/yt-3/blinkit-reel',
    stdio: 'pipe'
  });
  await sleep(2500);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3005/?render=1', { waitUntil: 'networkidle0', timeout: 30000 });

  await page.waitForFunction(() => window.__docReady === true, { timeout: 15000 });

  // 1. Frame 22.2s (Verify top HUD text is removed)
  await page.evaluate(t => window.__setDocTime(t), 22.2);
  await sleep(600);
  const out1 = path.join(OUT_DIR, 'verify_no_top_text_22s.jpg');
  await page.screenshot({ path: out1, type: 'jpeg', quality: 90 });
  console.log(`Saved: ${out1}`);

  // 2. Frame 71.5s (Verify Amazon, Flipkart, BigBasket 3D edge cards)
  await page.evaluate(t => window.__setDocTime(t), 71.5);
  await sleep(600);
  const out2 = path.join(OUT_DIR, 'verify_3d_amazon_flipkart_71s.jpg');
  await page.screenshot({ path: out2, type: 'jpeg', quality: 90 });
  console.log(`Saved: ${out2}`);

  await browser.close();
  server.kill();
  console.log('Done!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
