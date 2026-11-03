import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'C:/Users/Prasad/Documents/acad/yt-3/motion-reel/node_modules/sharp';

const OUT_DIR = path.resolve('public/images');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function downloadFile(url, destPath) {
  console.log(`Downloading ${url} -> ${destPath}`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf;
}

async function renderSvgToPng(svgBuffer, outColorPath, outMonoPath) {
  const resvg = new Resvg(svgBuffer, { fitTo: { mode: 'width', value: 512 } });
  const pngData = resvg.render().asPng();

  await sharp(pngData)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outColorPath);

  await sharp(outColorPath)
    .grayscale()
    .modulate({ brightness: 1.1, contrast: 1.2 })
    .png()
    .toFile(outMonoPath);

  console.log(`Rendered ${outColorPath} and ${outMonoPath}`);
}

async function main() {
  // 1. Amazon
  const amazonSvg = await downloadFile(
    'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    path.join(OUT_DIR, 'raw_amazon.svg')
  );
  await renderSvgToPng(
    amazonSvg,
    path.join(OUT_DIR, '10_amazon_logo_color.png'),
    path.join(OUT_DIR, '10_amazon_logo_mono.png')
  );

  // 2. Flipkart
  const flipkartSvg = await downloadFile(
    'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flipkart_logo_%282026%29.svg',
    path.join(OUT_DIR, 'raw_flipkart.svg')
  );
  await renderSvgToPng(
    flipkartSvg,
    path.join(OUT_DIR, '11_flipkart_logo_color.png'),
    path.join(OUT_DIR, '11_flipkart_logo_mono.png')
  );

  console.log('Amazon and Flipkart processed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
