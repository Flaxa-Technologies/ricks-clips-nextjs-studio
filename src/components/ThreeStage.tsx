import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type HeroModelId =
  | "phone"
  | "bag"
  | "crate"
  | "vault_coin"
  | "empire_monolith";

export interface ThreePose {
  model: HeroModelId;
  t: number;
  beatProgress: number;
  pixelX: number;
  pixelY: number;
  diameterPx: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  darkTheme: boolean;
  opacity: number;
  blurPx: number;
  shadowStrength?: number;
}

declare global {
  interface Window {
    __blinkitModelsReady?: boolean;
  }
}

/**
 * Builds a Dark Cinematic Studio Environment Map so dark obsidian, matte carbon,
 * and gunmetal 3D models retain deep, rich dark surfaces with sharp specular rim highlights
 * (never washed out by a white room reflection).
 */
function createDarkStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x050508);

  const stripGeo = new THREE.PlaneGeometry(10, 2.5);

  // Warm Gold Top-Left Key Strip
  const goldStrip = new THREE.Mesh(
    stripGeo,
    new THREE.MeshBasicMaterial({ color: 0xf8cb46, side: THREE.DoubleSide })
  );
  goldStrip.position.set(-6, 7, 5);
  goldStrip.lookAt(0, 0, 0);
  envScene.add(goldStrip);

  // Cool Slate Right Rim Strip
  const slateStrip = new THREE.Mesh(
    stripGeo,
    new THREE.MeshBasicMaterial({ color: 0x64748b, side: THREE.DoubleSide })
  );
  slateStrip.position.set(7, 3, 4);
  slateStrip.lookAt(0, 0, 0);
  envScene.add(slateStrip);

  // Subtle Emerald Back Rim Strip
  const emeraldStrip = new THREE.Mesh(
    stripGeo,
    new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
  );
  emeraldStrip.position.set(0, -5, -6);
  emeraldStrip.lookAt(0, 0, 0);
  envScene.add(emeraldStrip);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(envScene, 0.04).texture;
  pmrem.dispose();
  return envTex;
}

/**
 * Generates a high-contrast Dark-Mode OLED screen texture for the 3D Obsidian Smartphone
 */
function makePhoneScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d")!;

  // Deep Obsidian OLED Canvas
  ctx.fillStyle = "#07080C";
  ctx.fillRect(0, 0, 1024, 2048);

  // Dark Carbon Top Header Card with Gold Accent Border
  ctx.fillStyle = "#11131A";
  ctx.beginPath();
  ctx.roundRect(48, 44, 928, 460, 48);
  ctx.fill();
  ctx.strokeStyle = "#F8CB46";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Dynamic Island Pill
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.roundRect(332, 74, 360, 78, 39);
  ctx.fill();

  // Header Typography (Glowing Gold & Emerald on Dark Carbon)
  ctx.fillStyle = "#F8CB46";
  ctx.font = "900 40px sans-serif";
  ctx.fillText("BLINKIT INSTANT · DARK STORE #14", 96, 232);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 116px sans-serif";
  ctx.fillText("08 MINS", 92, 358);
  ctx.fillStyle = "#10B981";
  ctx.font = "800 36px monospace";
  ctx.fillText("● DLF PHASE 4 · LIVE TELEMETRY", 96, 435);

  // Dark Tactical Radar Map Card
  ctx.fillStyle = "#0B0F17";
  ctx.beginPath();
  ctx.roundRect(48, 540, 928, 620, 48);
  ctx.fill();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Radar Grid Lines
  ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
  ctx.lineWidth = 4;
  for (let x = 140; x < 920; x += 130) {
    ctx.beginPath();
    ctx.moveTo(x, 565);
    ctx.lineTo(x, 1135);
    ctx.stroke();
  }
  for (let y = 620; y < 1135; y += 120) {
    ctx.beginPath();
    ctx.moveTo(75, y);
    ctx.lineTo(950, y);
    ctx.stroke();
  }

  // Glowing Emerald Route Trajectory
  ctx.strokeStyle = "#10B981";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(180, 1030);
  ctx.bezierCurveTo(380, 1010, 520, 730, 820, 690);
  ctx.stroke();

  ctx.fillStyle = "#F8CB46";
  ctx.beginPath();
  ctx.arc(180, 1030, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#10B981";
  ctx.beginPath();
  ctx.arc(820, 690, 38, 0, Math.PI * 2);
  ctx.fill();

  // Dark Carbon Order Item Cards
  const items = [
    { title: "Amul Taaza Milk 1L", price: "₹68", col: "#10B981" },
    { title: "Duracell AA Ultra (4pk)", price: "₹190", col: "#3B82F6" },
    { title: "Apple iPhone 16 Pro", price: "₹1,19,900", col: "#F8CB46" },
  ];
  items.forEach((it, idx) => {
    const y = 1210 + idx * 188;
    ctx.fillStyle = "#12151E";
    ctx.beginPath();
    ctx.roundRect(48, y, 928, 160, 34);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = it.col;
    ctx.beginPath();
    ctx.roundRect(84, y + 30, 100, 100, 22);
    ctx.fill();

    ctx.fillStyle = "#F4F4F5";
    ctx.font = "800 42px sans-serif";
    ctx.fillText(it.title, 220, y + 95);

    ctx.fillStyle = "#F8CB46";
    ctx.font = "900 42px monospace";
    ctx.fillText(it.price, 735, y + 95);
  });

  // Bottom Emerald Confirmation Bar
  ctx.fillStyle = "#059669";
  ctx.beginPath();
  ctx.roundRect(48, 1815, 928, 155, 42);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 46px sans-serif";
  ctx.fillText("RIDER AT DOORSTEP · 08:42", 185, 1908);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates Stealth Matte Carbon-Black Kevlar weave + Blinkit Gold/Emerald branding for the 3D Bag
 */
function makeBagTextures(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Deep Matte Carbon-Black Base (Dark Stealth Bag)
  ctx.fillStyle = "#0B0C10";
  ctx.fillRect(0, 0, 1024, 1024);

  // Carbon-Fiber Diagonal & Orthogonal Weave Grid
  ctx.strokeStyle = "rgba(255,255,255,0.055)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 1024; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Front Recessed Armor Plate with Glowing Gold Border
  ctx.fillStyle = "#050608";
  ctx.beginPath();
  ctx.roundRect(120, 190, 784, 450, 44);
  ctx.fill();
  ctx.strokeStyle = "#F8CB46";
  ctx.lineWidth = 10;
  ctx.stroke();

  // Blinkit Logo inside Dark Armor Plate
  ctx.font = "900 168px sans-serif";
  ctx.fillStyle = "#F8CB46";
  ctx.fillText("blink", 205, 450);
  ctx.fillStyle = "#10B981";
  ctx.fillText("it", 630, 450);

  ctx.font = "800 38px monospace";
  ctx.fillStyle = "#E4E4E7";
  ctx.fillText("STEALTH EXPRESS FLEET · 10 MIN", 185, 555);

  // High-Contrast Black & Gold Hazard Chevron Strip at bottom
  ctx.fillStyle = "#18181B";
  ctx.fillRect(80, 710, 864, 96);
  ctx.fillStyle = "#F8CB46";
  for (let x = 100; x < 900; x += 88) {
    ctx.beginPath();
    ctx.moveTo(x, 710);
    ctx.lineTo(x + 44, 710);
    ctx.lineTo(x + 14, 806);
    ctx.lineTo(x - 30, 806);
    ctx.closePath();
    ctx.fill();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;

  // Bump map for heavy tactical weave
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bctx = bumpCanvas.getContext("2d")!;
  bctx.fillStyle = "#707070";
  bctx.fillRect(0, 0, 512, 512);
  bctx.strokeStyle = "#B8B8B8";
  bctx.lineWidth = 2;
  for (let i = 0; i < 512; i += 8) {
    bctx.beginPath();
    bctx.moveTo(i, 0);
    bctx.lineTo(i, 512);
    bctx.stroke();
    bctx.beginPath();
    bctx.moveTo(0, i);
    bctx.lineTo(512, i);
    bctx.stroke();
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);

  return { map, bumpMap };
}

/**
 * Generates a Dark Obsidian & Gold Engraved Dial Face for the ₹4,447 Crore Vault Coin
 */
function makeCoinFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Deep Obsidian-Gunmetal Radial Face
  const grad = ctx.createRadialGradient(512, 512, 40, 512, 512, 500);
  grad.addColorStop(0, "#14161F");
  grad.addColorStop(0.65, "#0B0C10");
  grad.addColorStop(1, "#050508");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Concentric Gold & Crimson Precision Rings
  ctx.strokeStyle = "#F8CB46";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(512, 512, 444, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#E23744";
  ctx.lineWidth = 8;
  ctx.setLineDash([18, 12]);
  ctx.beginPath();
  ctx.arc(512, 512, 402, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#A1A1AA";
  ctx.textAlign = "center";
  ctx.font = "900 58px monospace";
  ctx.fillText("ZOMATO × BLINKIT", 512, 335);

  ctx.fillStyle = "#F8CB46";
  ctx.font = "900 138px sans-serif";
  ctx.fillText("₹4,447 CR", 512, 535);

  ctx.fillStyle = "#EF4444";
  ctx.font = "900 52px monospace";
  ctx.fillText("$568M ALL-STOCK MERGER", 512, 675);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Generates a Midnight-Obsidian skyscraper facade texture with illuminated gold windows
 */
function makeSkyscraperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#040507";
  ctx.fillRect(0, 0, 512, 1024);

  for (let y = 32; y < 990; y += 28) {
    for (let x = 24; x < 488; x += 36) {
      const lit = (x * 7 + y * 13) % 5 !== 0;
      ctx.fillStyle = lit
        ? (x + y) % 7 === 0
          ? "#F8CB46"
          : "rgba(248, 203, 70, 0.35)"
        : "#0B0D13";
      ctx.fillRect(x, y, 22, 14);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 1. Dark Obsidian Titanium Smartphone + Dark OLED UI + Dual Holographic Radar Rings
 */
function createPhoneModel(): THREE.Group {
  const group = new THREE.Group();

  const obsidianTitaniumMat = new THREE.MeshStandardMaterial({
    color: 0x090a0f,
    metalness: 0.85,
    roughness: 0.26,
  });
  const darkGunmetalEdgeMat = new THREE.MeshStandardMaterial({
    color: 0x181a24,
    metalness: 0.92,
    roughness: 0.2,
  });
  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xf8cb46,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.25,
    metalness: 0.85,
    roughness: 0.2,
  });

  // Chamfered Dark Gunmetal Unibody
  const chassis = new THREE.Mesh(
    new RoundedBoxGeometry(1.18, 2.34, 0.15, 8, 0.16),
    darkGunmetalEdgeMat
  );
  group.add(chassis);

  // Recessed Matte Obsidian Body
  const innerBody = new THREE.Mesh(
    new RoundedBoxGeometry(1.13, 2.29, 0.156, 8, 0.14),
    obsidianTitaniumMat
  );
  group.add(innerBody);

  // Gold Rim Accent Line around front bezel
  const goldBezel = new THREE.Mesh(
    new RoundedBoxGeometry(1.15, 2.31, 0.04, 8, 0.14),
    goldAccentMat
  );
  goldBezel.position.z = 0.055;
  group.add(goldBezel);

  // Dark-Mode OLED Screen with Blinkit Live UI
  const screenTex = makePhoneScreenTexture();
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissiveMap: screenTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.38,
    roughness: 0.12,
    metalness: 0.08,
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 2.18), screenMat);
  screen.position.z = 0.082;
  group.add(screen);

  // Floating 3D Holographic Delivery Pin & Dual Radar Rings in front of screen
  const holoGroup = new THREE.Group();
  holoGroup.name = "holoPin";
  holoGroup.position.set(0, 0.04, 0.24);

  const ringOuter = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.018, 16, 48),
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    })
  );
  holoGroup.add(ringOuter);

  const ringInner = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.014, 16, 48),
    new THREE.MeshStandardMaterial({
      color: 0xf8cb46,
      emissive: 0xf8cb46,
      emissiveIntensity: 0.7,
      roughness: 0.2,
    })
  );
  ringInner.rotation.x = Math.PI / 3;
  holoGroup.add(ringInner);

  const pinHead = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.11, 1),
    new THREE.MeshStandardMaterial({
      color: 0xf8cb46,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.65,
      metalness: 0.7,
      roughness: 0.15,
    })
  );
  holoGroup.add(pinHead);
  group.add(holoGroup);

  // Rear Pro Camera Plateau & 3 Sapphire Lenses
  const plateau = new THREE.Mesh(
    new RoundedBoxGeometry(0.54, 0.56, 0.05, 6, 0.08),
    obsidianTitaniumMat
  );
  plateau.position.set(-0.24, 0.78, -0.09);
  group.add(plateau);

  const lensCoords = [
    [-0.36, 0.91],
    [-0.36, 0.65],
    [-0.12, 0.78],
  ];
  for (const [lx, ly] of lensCoords) {
    const outerRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.105, 0.045, 32),
      goldAccentMat
    );
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.set(lx, ly, -0.12);
    group.add(outerRing);

    const glassOptic = new THREE.Mesh(
      new THREE.CylinderGeometry(0.082, 0.082, 0.052, 32),
      obsidianTitaniumMat
    );
    glassOptic.rotation.x = Math.PI / 2;
    glassOptic.position.set(lx, ly, -0.124);
    group.add(glassOptic);
  }

  return group;
}

/**
 * 2. Stealth Matte-Carbon & Kevlar Blinkit Insulated Tactical Delivery Backpack
 */
function createBagModel(): THREE.Group {
  const group = new THREE.Group();
  const { map, bumpMap } = makeBagTextures();

  const stealthCarbonMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map,
    bumpMap,
    bumpScale: 0.022,
    roughness: 0.55,
    metalness: 0.25,
  });

  const matteObsidianArmor = new THREE.MeshStandardMaterial({
    color: 0x08090d,
    bumpMap,
    bumpScale: 0.025,
    roughness: 0.62,
    metalness: 0.35,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf8cb46,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.35,
    metalness: 0.8,
    roughness: 0.22,
  });

  const emeraldLedMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.9,
    roughness: 0.18,
  });

  // Main Sculpted Dark Carbon Insulated Compartment
  const mainBody = new THREE.Mesh(
    new RoundedBoxGeometry(1.58, 1.72, 1.28, 8, 0.16),
    stealthCarbonMat
  );
  group.add(mainBody);

  // Heavy-Duty Matte-Obsidian Weather Lid + Glowing LED Dispatch Strip
  const lidGroup = new THREE.Group();
  lidGroup.name = "bagLid";
  lidGroup.position.set(0, 0.82, -0.6);

  const lidMesh = new THREE.Mesh(
    new RoundedBoxGeometry(1.68, 0.3, 1.38, 8, 0.1),
    matteObsidianArmor
  );
  lidMesh.position.set(0, 0.06, 0.6);
  lidGroup.add(lidMesh);

  // Gold Rim Strip along Front of Lid
  const lidGoldStrip = new THREE.Mesh(
    new RoundedBoxGeometry(1.52, 0.07, 0.06, 4, 0.02),
    goldTrimMat
  );
  lidGoldStrip.position.set(0, 0.06, 1.28);
  lidGroup.add(lidGoldStrip);

  // Top Carry Handle Arch
  const handleArch = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.05, 16, 32, Math.PI),
    goldTrimMat
  );
  handleArch.position.set(0, 0.21, 0.6);
  lidGroup.add(handleArch);
  group.add(lidGroup);

  // Reinforced Vertical Exoskeleton Webbing Straps + Gold Anodized Buckles
  for (const sx of [-0.5, 0.5]) {
    const vStrap = new THREE.Mesh(
      new RoundedBoxGeometry(0.16, 1.76, 1.34, 4, 0.03),
      matteObsidianArmor
    );
    vStrap.position.x = sx;
    group.add(vStrap);

    const buckle = new THREE.Mesh(
      new RoundedBoxGeometry(0.24, 0.18, 0.09, 4, 0.02),
      goldTrimMat
    );
    buckle.position.set(sx, 0.35, 0.68);
    group.add(buckle);
  }

  // Side Dark Armor Pockets + Glowing Emerald Telemetry Bars
  for (const side of [-1, 1]) {
    const pocket = new THREE.Mesh(
      new RoundedBoxGeometry(0.16, 0.82, 0.98, 6, 0.06),
      matteObsidianArmor
    );
    pocket.position.set(side * 0.82, -0.3, 0);
    group.add(pocket);

    const trim = new THREE.Mesh(
      new RoundedBoxGeometry(0.18, 0.11, 1.0, 4, 0.02),
      emeraldLedMat
    );
    trim.position.set(side * 0.82, 0.18, 0);
    group.add(trim);
  }

  // Orbiting 3D Speed-Telemetry Ring around the Dark Bag
  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.022, 16, 64),
    goldTrimMat
  );
  haloRing.name = "bagHalo";
  haloRing.rotation.x = Math.PI / 2.3;
  group.add(haloRing);

  // Reinforced Bottom Armor Base
  const bottomBase = new THREE.Mesh(
    new RoundedBoxGeometry(1.64, 0.2, 1.34, 6, 0.06),
    matteObsidianArmor
  );
  bottomBase.position.y = -0.82;
  group.add(bottomBase);

  return group;
}

/**
 * 3. Stealth Carbon-Graphite Dark-Store Picking Crate + Groceries + Sweeping Laser Scanner
 */
function createCrateModel(): THREE.Group {
  const group = new THREE.Group();

  const stealthCrateMat = new THREE.MeshStandardMaterial({
    color: 0x0c0e14,
    metalness: 0.45,
    roughness: 0.38,
  });
  const blackRibMat = new THREE.MeshStandardMaterial({
    color: 0x050608,
    metalness: 0.65,
    roughness: 0.3,
  });
  const goldRailMat = new THREE.MeshStandardMaterial({
    color: 0xf8cb46,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.3,
    metalness: 0.85,
    roughness: 0.2,
  });

  // Outer Sculpted Dark Carbon Tote Walls
  const floor = new THREE.Mesh(
    new RoundedBoxGeometry(1.96, 0.16, 1.42, 6, 0.05),
    blackRibMat
  );
  floor.position.y = -0.52;
  group.add(floor);

  const frontWall = new THREE.Mesh(
    new RoundedBoxGeometry(1.96, 0.96, 0.13, 6, 0.05),
    stealthCrateMat
  );
  frontWall.position.set(0, -0.02, 0.65);
  group.add(frontWall);

  const backWall = frontWall.clone();
  backWall.position.set(0, -0.02, -0.65);
  group.add(backWall);

  const leftWall = new THREE.Mesh(
    new RoundedBoxGeometry(0.13, 0.96, 1.42, 6, 0.05),
    stealthCrateMat
  );
  leftWall.position.set(-0.92, -0.02, 0);
  group.add(leftWall);

  const rightWall = leftWall.clone();
  rightWall.position.set(0.92, -0.02, 0);
  group.add(rightWall);

  // Structural Vertical Ribs + Gold Corner Pillars
  for (let x = -0.72; x <= 0.72; x += 0.36) {
    const ribF = new THREE.Mesh(
      new RoundedBoxGeometry(0.06, 0.94, 0.17, 4, 0.02),
      Math.abs(x) > 0.6 ? goldRailMat : blackRibMat
    );
    ribF.position.set(x, -0.02, 0.66);
    group.add(ribF);
  }

  // Heavy Top Stacking Rim with Gold Trim Strip
  const rimF = new THREE.Mesh(
    new RoundedBoxGeometry(2.04, 0.15, 0.19, 6, 0.04),
    blackRibMat
  );
  rimF.position.set(0, 0.46, 0.65);
  group.add(rimF);

  const goldFrontRail = new THREE.Mesh(
    new RoundedBoxGeometry(1.98, 0.05, 0.21, 4, 0.01),
    goldRailMat
  );
  goldFrontRail.position.set(0, 0.46, 0.66);
  group.add(goldFrontRail);

  const rimB = rimF.clone();
  rimB.position.set(0, 0.46, -0.65);
  group.add(rimB);

  const rimL = new THREE.Mesh(
    new RoundedBoxGeometry(0.19, 0.15, 1.48, 6, 0.04),
    blackRibMat
  );
  rimL.position.set(-0.92, 0.46, 0);
  group.add(rimL);

  const rimR = rimL.clone();
  rimR.position.set(0.92, 0.46, 0);
  group.add(rimR);

  // High-Contrast Dark-Mode Groceries & Electronics Packed Inside ("crateItems")
  const itemsGroup = new THREE.Group();
  itemsGroup.name = "crateItems";

  // Item 1: Midnight-Blue Dairy Carton with Crimson Cap
  const milkGroup = new THREE.Group();
  const milkBody = new THREE.Mesh(
    new RoundedBoxGeometry(0.46, 0.78, 0.46, 6, 0.04),
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.3,
      roughness: 0.28,
    })
  );
  const milkBand = new THREE.Mesh(
    new RoundedBoxGeometry(0.48, 0.26, 0.48, 4, 0.02),
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      roughness: 0.25,
    })
  );
  const milkCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.08, 20),
    new THREE.MeshStandardMaterial({
      color: 0xf8cb46,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.35,
    })
  );
  milkCap.position.y = 0.43;
  milkGroup.add(milkBody, milkBand, milkCap);
  milkGroup.position.set(-0.54, 0.28, -0.18);
  itemsGroup.add(milkGroup);

  // Item 2: Crimson Metallic Beverage Can
  const canGroup = new THREE.Group();
  const canCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.72, 32),
    new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      metalness: 0.78,
      roughness: 0.2,
    })
  );
  const canTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.06, 32),
    goldRailMat
  );
  canTop.position.y = 0.38;
  canGroup.add(canCyl, canTop);
  canGroup.position.set(-0.04, 0.24, 0.22);
  itemsGroup.add(canGroup);

  // Item 3: Sealed Obsidian Flagship Tech Box
  const techBox = new THREE.Mesh(
    new RoundedBoxGeometry(0.48, 0.86, 0.28, 6, 0.04),
    new THREE.MeshPhysicalMaterial({
      color: 0x09090d,
      metalness: 0.75,
      roughness: 0.16,
      clearcoat: 1.0,
    })
  );
  techBox.position.set(0.48, 0.34, -0.15);
  itemsGroup.add(techBox);

  // Item 4: Deep Emerald Produce Pack
  const producePack = new THREE.Mesh(
    new RoundedBoxGeometry(0.44, 0.56, 0.42, 8, 0.1),
    new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x047857,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.2,
    })
  );
  producePack.position.set(0.44, 0.2, 0.26);
  itemsGroup.add(producePack);

  group.add(itemsGroup);

  // Overhead Volumetric Barcode Laser Scan Assembly (sweeps across crate with time `t`)
  const laserGroup = new THREE.Group();
  laserGroup.name = "scannerLaser";
  laserGroup.position.set(0, 0.8, 0);

  const laserBar = new THREE.Mesh(
    new RoundedBoxGeometry(2.14, 0.045, 0.07, 4, 0.01),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 1.6,
    })
  );
  laserGroup.add(laserBar);

  // Translucent Laser Light Sheet projecting downward into crate
  const laserSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 0.65),
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    })
  );
  laserSheet.position.y = -0.32;
  laserGroup.add(laserSheet);

  group.add(laserGroup);

  return group;
}

/**
 * 4. Dark Obsidian & Gunmetal ₹4,447 Crore Mechanical Tourbillon Acquisition Vault
 */
function createVaultCoinModel(): THREE.Group {
  const group = new THREE.Group();

  const obsidianSteel = new THREE.MeshPhysicalMaterial({
    color: 0x090a0f,
    metalness: 0.88,
    roughness: 0.22,
    clearcoat: 0.8,
  });
  const crimsonAnodized = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.35,
    metalness: 0.82,
    roughness: 0.2,
  });
  const goldBullion = new THREE.MeshPhysicalMaterial({
    color: 0xf8cb46,
    emissive: 0xb45309,
    emissiveIntensity: 0.22,
    metalness: 0.9,
    roughness: 0.2,
  });
  const darkGunmetal = new THREE.MeshStandardMaterial({
    color: 0x181a24,
    metalness: 0.92,
    roughness: 0.2,
  });

  // Outer Obsidian Ring with 24 Crimson-Anodized Notched Gear Teeth
  const outerGear = new THREE.Group();
  outerGear.name = "outerGear";
  const mainTorus = new THREE.Mesh(
    new THREE.TorusGeometry(1.06, 0.12, 28, 72),
    obsidianSteel
  );
  outerGear.add(mainTorus);

  const toothGeo = new RoundedBoxGeometry(0.085, 0.17, 0.24, 4, 0.02);
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const tooth = new THREE.Mesh(
      toothGeo,
      i % 2 === 0 ? crimsonAnodized : goldBullion
    );
    tooth.position.set(Math.cos(angle) * 1.17, Math.sin(angle) * 1.17, 0);
    tooth.rotation.z = angle + Math.PI / 2;
    outerGear.add(tooth);
  }
  group.add(outerGear);

  // Middle Counter-Rotating Dark Gunmetal Gimbal Ring
  const midGimbal = new THREE.Group();
  midGimbal.name = "midGimbal";
  const midTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.86, 0.07, 24, 64),
    darkGunmetal
  );
  midGimbal.add(midTorus);

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.3, 16),
      goldBullion
    );
    pin.position.set(Math.cos(a) * 0.86, Math.sin(a) * 0.86, 0);
    pin.rotation.z = a;
    midGimbal.add(pin);
  }
  group.add(midGimbal);

  // Inner Dark Obsidian Engraved Vault Core
  const coinFaceTex = makeCoinFaceTexture();
  const faceMat = new THREE.MeshStandardMaterial({
    map: coinFaceTex,
    emissiveMap: coinFaceTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.28,
    metalness: 0.65,
    roughness: 0.28,
  });

  const coreGroup = new THREE.Group();
  coreGroup.name = "coinCore";
  const coreRim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.24, 64),
    obsidianSteel
  );
  coreRim.rotation.x = Math.PI / 2;
  coreGroup.add(coreRim);

  const frontDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.69, 64),
    faceMat
  );
  frontDisc.position.z = 0.122;
  coreGroup.add(frontDisc);

  const backDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.69, 64),
    faceMat
  );
  backDisc.rotation.y = Math.PI;
  backDisc.position.z = -0.122;
  coreGroup.add(backDisc);

  group.add(coreGroup);

  return group;
}

/**
 * 5. Midnight-Obsidian Eternal Corporate Skyscraper Complex + Dual Orbital Rings
 */
function createEmpireMonolithModel(): THREE.Group {
  const group = new THREE.Group();
  const windowTex = makeSkyscraperTexture();

  const towerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: windowTex,
    emissiveMap: windowTex,
    emissive: new THREE.Color(0xf8cb46),
    emissiveIntensity: 0.45,
    metalness: 0.85,
    roughness: 0.2,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf8cb46,
    emissive: 0xb45309,
    emissiveIntensity: 0.28,
    metalness: 0.9,
    roughness: 0.18,
  });

  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x07080c,
    metalness: 0.85,
    roughness: 0.22,
  });

  // Stepped Dark Obsidian Plaza Base
  const base1 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.18, 1.28, 0.18, 48),
    obsidianMat
  );
  base1.position.y = -0.88;
  group.add(base1);

  const base2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.04, 0.14, 48),
    obsidianMat
  );
  base2.position.y = -0.73;
  group.add(base2);

  const baseGoldRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.02, 0.025, 16, 64),
    goldMat
  );
  baseGoldRing.rotation.x = Math.PI / 2;
  baseGoldRing.position.y = -0.66;
  group.add(baseGoldRing);

  // Central Obsidian Flagship Spire + Gold Crown + 3 Flanking Stepped Towers
  const mainTower = new THREE.Mesh(
    new RoundedBoxGeometry(0.56, 1.78, 0.56, 6, 0.05),
    towerMat
  );
  mainTower.position.y = 0.12;
  group.add(mainTower);

  const crown = new THREE.Mesh(
    new RoundedBoxGeometry(0.42, 0.28, 0.42, 6, 0.04),
    goldMat
  );
  crown.position.y = 1.05;
  group.add(crown);

  const subTowers = [
    { x: -0.44, z: 0.28, h: 1.18 },
    { x: 0.44, z: 0.28, h: 1.32 },
    { x: 0, z: -0.46, h: 1.42 },
  ];
  for (const st of subTowers) {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(0.38, st.h, 0.38, 6, 0.04),
      towerMat
    );
    mesh.position.set(st.x, -0.7 + st.h / 2, st.z);
    group.add(mesh);
  }

  // Outer Orbiting Ring + 4 Business Pillar Spheres (Blinkit, Zomato, Hyperpure, District)
  const orbitGroup = new THREE.Group();
  orbitGroup.name = "empireOrbit";

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.24, 0.026, 16, 64),
    goldMat
  );
  ring1.rotation.x = Math.PI / 2.2;
  orbitGroup.add(ring1);

  const pillarColors = [0xf8cb46, 0xe23744, 0x10b981, 0x8b5cf6];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const sat = new THREE.Mesh(
      new THREE.SphereGeometry(0.115, 24, 24),
      new THREE.MeshStandardMaterial({
        color: pillarColors[i],
        emissive: pillarColors[i],
        emissiveIntensity: 0.55,
        metalness: 0.75,
        roughness: 0.15,
      })
    );
    sat.position.set(
      Math.cos(a) * 1.24,
      Math.sin(a) * 0.22,
      Math.sin(a) * 1.24
    );
    orbitGroup.add(sat);
  }
  group.add(orbitGroup);

  return group;
}

export const ThreeStage: React.FC<{ pose: ThreePose | null }> = ({ pose }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    models: Record<HeroModelId, THREE.Group>;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    hemiLight: THREE.HemisphereLight;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });
    } catch {
      window.__blinkitModelsReady = true;
      return;
    }

    renderer.setSize(1920, 1080, false);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;

    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1920 / 1080, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const envTex = createDarkStudioEnvMap(renderer);
    scene.environment = envTex;

    const hemiLight = new THREE.HemisphereLight(0x94a3b8, 0x09090b, 0.55);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.65);
    keyLight.position.set(4.8, 6.8, 6.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf8cb46, 1.85);
    rimLight.position.set(-5.2, -2.2, -3.8);
    scene.add(rimLight);

    const models: Record<HeroModelId, THREE.Group> = {
      phone: createPhoneModel(),
      bag: createBagModel(),
      crate: createCrateModel(),
      vault_coin: createVaultCoinModel(),
      empire_monolith: createEmpireMonolithModel(),
    };

    Object.values(models).forEach((m) => {
      m.visible = false;
      scene.add(m);
    });

    engineRef.current = {
      renderer,
      scene,
      camera,
      models,
      keyLight,
      rimLight,
      hemiLight,
    };

    window.__blinkitModelsReady = true;

    return () => {
      envTex.dispose();
      renderer.dispose();
      engineRef.current = null;
    };
  }, []);

  // Deterministic on-demand render with sub-assembly articulation driven purely by `pose.t`
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    const { renderer, scene, camera, models, rimLight } = eng;
    Object.values(models).forEach((m) => {
      m.visible = false;
    });

    if (!pose || pose.opacity <= 0.005) {
      renderer.clear();
      return;
    }

    const active = models[pose.model];
    if (!active) return;

    active.visible = true;
    const t = pose.t;
    renderer.toneMappingExposure = pose.darkTheme ? 1.02 : 0.96;
    rimLight.intensity = pose.darkTheme ? 2.2 : 1.65;

    // Articulated sub-animations per model (pure function of `t`)
    if (pose.model === "phone") {
      const holo = active.getObjectByName("holoPin");
      if (holo) {
        holo.rotation.y = t * 2.8;
        holo.rotation.z = Math.sin(t * 2.1) * 0.25;
        holo.position.z = 0.24 + Math.sin(t * 3.8) * 0.045;
      }
    } else if (pose.model === "bag") {
      const lid = active.getObjectByName("bagLid");
      if (lid) {
        lid.rotation.x = -0.22 + Math.sin(t * 2.6) * 0.14;
      }
      const halo = active.getObjectByName("bagHalo");
      if (halo) {
        halo.rotation.z = t * 1.8;
        halo.position.y = Math.sin(t * 2.4) * 0.18;
      }
    } else if (pose.model === "crate") {
      const laser = active.getObjectByName("scannerLaser");
      if (laser) {
        laser.position.z = Math.sin(t * 4.6) * 0.56;
      }
      const items = active.getObjectByName("crateItems");
      if (items) {
        items.children.forEach((child, idx) => {
          child.position.y =
            0.28 + Math.sin(t * 3.4 + idx * 1.4) * 0.075;
        });
      }
    } else if (pose.model === "vault_coin") {
      const outer = active.getObjectByName("outerGear");
      const mid = active.getObjectByName("midGimbal");
      const core = active.getObjectByName("coinCore");
      if (outer) outer.rotation.z = t * 0.55;
      if (mid) {
        mid.rotation.x = Math.sin(t * 1.6) * 0.42;
        mid.rotation.y = Math.cos(t * 1.3) * 0.42;
      }
      if (core) core.rotation.z = Math.sin(t * 1.5) * 0.16;
    } else if (pose.model === "empire_monolith") {
      const orbit = active.getObjectByName("empireOrbit");
      if (orbit) {
        orbit.rotation.y = t * 0.95;
        orbit.rotation.z = Math.sin(t * 1.1) * 0.18;
      }
    }

    // Convert 1920x1080 pixel coordinates to camera plane at Z=0
    const vFovRad = (camera.fov * Math.PI) / 180;
    const planeHeight = 2 * Math.tan(vFovRad / 2) * camera.position.z;
    const planeWidth = planeHeight * camera.aspect;

    const worldX = ((pose.pixelX - 960) / 1920) * planeWidth;
    const worldY = ((540 - pose.pixelY) / 1080) * planeHeight;
    const worldScale = (pose.diameterPx / 1080) * (planeHeight / 2.25);

    active.position.set(worldX, worldY, 0);
    active.scale.setScalar(Math.max(0.01, worldScale));
    active.rotation.set(pose.rotX, pose.rotY, pose.rotZ);

    renderer.render(scene, camera);
  }, [pose]);

  return (
    <div
      ref={mountRef}
      data-testid="three-stage"
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: 15,
        opacity: pose ? pose.opacity : 0,
        filter:
          pose && pose.blurPx > 0.25
            ? `blur(${pose.blurPx.toFixed(2)}px)`
            : undefined,
      }}
    />
  );
};
