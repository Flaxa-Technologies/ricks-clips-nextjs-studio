import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { Resvg } from "@resvg/resvg-js";

const OUT_DIR = path.resolve("public/images");
fs.mkdirSync(OUT_DIR, { recursive: true });

/**
 * All 9 brand logos are authored on a 100% transparent 512x512 canvas (no background <rect>!)
 * with bold die-cut vector emblems and high-contrast strokes so they float cleanly on both
 * light and dark documentary scenes.
 */
const BRAND_SVGS = [
  {
    id: "01_blinkit",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <!-- Die-cut Lightning Bolt Emblem -->
      <path d="M284 44 L172 204 L254 204 L216 320 L348 148 L262 148 Z" fill="#F8CB46" stroke="#09090B" stroke-width="16" stroke-linejoin="round"/>
      <!-- Bold Cut-Out Wordmark -->
      <text x="256" y="424" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="124" letter-spacing="-5" stroke="#09090B" stroke-width="22" paint-order="stroke fill" stroke-linejoin="round">
        <tspan fill="#F8CB46">blink</tspan><tspan fill="#10B981">it</tspan>
      </text>
      <path d="M126 466 L386 466" stroke="#F8CB46" stroke-width="14" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "02_grofers",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <!-- Die-cut Express Basket Emblem -->
      <path d="M176 168 L336 168 L312 264 L200 264 Z" fill="#E96125" stroke="#09090B" stroke-width="16" stroke-linejoin="round"/>
      <path d="M212 168 C212 118, 300 118, 300 168" fill="none" stroke="#84CC16" stroke-width="16" stroke-linecap="round"/>
      <circle cx="216" cy="292" r="16" fill="#84CC16" stroke="#09090B" stroke-width="8"/>
      <circle cx="296" cy="292" r="16" fill="#84CC16" stroke="#09090B" stroke-width="8"/>
      <text x="256" y="416" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="112" letter-spacing="-3" fill="#E96125" stroke="#09090B" stroke-width="20" paint-order="stroke fill" stroke-linejoin="round">grofers</text>
      <path d="M144 456 L368 456" stroke="#84CC16" stroke-width="14" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "03_zomato",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <!-- Die-cut Crimson Location Crest -->
      <path d="M256 64 C202 64, 160 106, 160 160 C160 226, 256 300, 256 300 C256 300, 352 226, 352 160 C352 106, 310 64, 256 64 Z" fill="#E23744" stroke="#09090B" stroke-width="16" stroke-linejoin="round"/>
      <circle cx="256" cy="156" r="34" fill="#FFFFFF"/>
      <text x="256" y="424" text-anchor="middle" font-family="DejaVu Sans" font-style="italic" font-weight="900" font-size="118" letter-spacing="-4" fill="#E23744" stroke="#09090B" stroke-width="22" paint-order="stroke fill" stroke-linejoin="round">zomato</text>
      <path d="M138 462 L374 462" stroke="#E23744" stroke-width="12" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "04_zepto",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <!-- Die-cut Speed Flash Emblem -->
      <path d="M204 88 L336 88 L252 192 L344 192 L188 308 L232 204 L164 204 Z" fill="#FF3269" stroke="#1E0038" stroke-width="16" stroke-linejoin="round"/>
      <text x="256" y="424" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="120" letter-spacing="-4" fill="#FF3269" stroke="#1E0038" stroke-width="22" paint-order="stroke fill" stroke-linejoin="round">zepto</text>
      <path d="M136 464 L376 464" stroke="#A855F7" stroke-width="14" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "05_instamart",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <!-- Die-cut Swiggy Pin Emblem -->
      <path d="M256 62 C204 62, 164 102, 164 154 C164 218, 256 292, 256 292 C256 292, 348 218, 348 154 C348 102, 308 62, 256 62 Z" fill="#FC8019" stroke="#09090B" stroke-width="16" stroke-linejoin="round"/>
      <circle cx="256" cy="150" r="32" fill="#09090B"/>
      <text x="256" y="366" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="56" letter-spacing="4" fill="#FC8019" stroke="#09090B" stroke-width="16" paint-order="stroke fill">SWIGGY</text>
      <text x="256" y="446" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="86" letter-spacing="-2" fill="#FFFFFF" stroke="#09090B" stroke-width="20" paint-order="stroke fill">Instamart</text>
    </svg>`,
  },
  {
    id: "06_dunzo",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <path d="M268 64 L164 204 L252 204 L204 328 L348 172 L256 172 Z" fill="#00D290" stroke="#09090B" stroke-width="16" stroke-linejoin="round"/>
      <text x="256" y="434" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="104" letter-spacing="2" fill="#00D290" stroke="#09090B" stroke-width="22" paint-order="stroke fill">DUNZO</text>
    </svg>`,
  },
  {
    id: "07_oladash",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <circle cx="256" cy="176" r="78" fill="none" stroke="#09090B" stroke-width="44"/>
      <circle cx="256" cy="176" r="78" fill="none" stroke="#D4E157" stroke-width="26"/>
      <circle cx="256" cy="176" r="24" fill="#D4E157" stroke="#09090B" stroke-width="10"/>
      <text x="256" y="372" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="92" fill="#FFFFFF" stroke="#09090B" stroke-width="20" paint-order="stroke fill">OLA</text>
      <text x="256" y="454" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="68" letter-spacing="8" fill="#D4E157" stroke="#09090B" stroke-width="18" paint-order="stroke fill">DASH</text>
    </svg>`,
  },
  {
    id: "08_bigbasket",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <path d="M168 156 L344 156 L320 268 L192 268 Z" fill="#84C225" stroke="#09090B" stroke-width="16" stroke-linejoin="round"/>
      <text x="256" y="412" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="86" letter-spacing="-2" stroke="#09090B" stroke-width="20" paint-order="stroke fill">
        <tspan fill="#E21E26">big</tspan><tspan fill="#84C225">basket</tspan>
      </text>
    </svg>`,
  },
  {
    id: "09_eternal",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <circle cx="256" cy="172" r="76" fill="none" stroke="#09090B" stroke-width="28"/>
      <circle cx="256" cy="172" r="76" fill="none" stroke="#F8CB46" stroke-width="14"/>
      <circle cx="256" cy="172" r="28" fill="#E23744" stroke="#09090B" stroke-width="10"/>
      <text x="256" y="376" text-anchor="middle" font-family="DejaVu Sans" font-weight="900" font-size="88" letter-spacing="6" fill="#FFFFFF" stroke="#09090B" stroke-width="20" paint-order="stroke fill">ETERNAL</text>
      <text x="256" y="442" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="32" letter-spacing="4" fill="#F8CB46" stroke="#09090B" stroke-width="12" paint-order="stroke fill">EMPIRE</text>
    </svg>`,
  },
];

for (const item of BRAND_SVGS) {
  const colorPath = path.join(OUT_DIR, `${item.id}_logo_color.png`);
  const monoPath = path.join(OUT_DIR, `${item.id}_logo_mono.png`);

  const resvg = new Resvg(item.svg, {
    fitTo: { mode: "width", value: 512 },
    font: {
      fontFiles: [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-ExtraBold.ttf",
      ],
      loadSystemFonts: true,
      defaultFontFamily: "DejaVu Sans",
    },
  });
  const pngBuffer = resvg.render().asPng();
  fs.writeFileSync(colorPath, pngBuffer);

  // Pre-bake exact Rec.709 luminance monochrome PNG preserving 100% transparent alpha channel
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      colorPath,
      "-vf",
      "format=rgba,colorchannelmixer=.2126:.7152:.0722:0:.2126:.7152:.0722:0:.2126:.7152:.0722:0:0:0:0:1",
      monoPath,
    ],
    { stdio: "ignore" }
  );

  console.log(`Generated transparent ${item.id}_logo_color.png + ${item.id}_logo_mono.png`);
}
