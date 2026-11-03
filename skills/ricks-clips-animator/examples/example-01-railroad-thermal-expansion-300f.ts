/**
 * EXAMPLE 01: "Why Perfect Railroads Don't Work" (@RicksClips3000 - 7xS87iActkU)
 * Complete 300-Frame (10.00s @ 30 FPS) Deterministic Mathematical Scene Specification
 *
 * Includes:
 * - Beat 1 (f000-059): Low-angle rail sawing hook + oncoming locomotive
 * - Beat 2 (f060-119): 180° cylindrical canyon orbit + Doppler train wipe
 * - Beat 3 (f120-179): High-altitude abyss crane pullback (two rival bridges)
 * - Beat 4 (f180-249): Precarious plank vertigo + Boss purple rage & thermal expansion gap math
 * - Beat 5 (f250-299): Thermal rail sinusoidal buckling ("kicks sideways like a snake")
 */

export const FPS = 30;
export const TOTAL_FRAMES = 300;

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * Math.max(0, Math.min(1, t));

export const smoothstep = (t: number): number => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

/**
 * Physical Thermal Linear Expansion & Sinusoidal Euler Buckling Equations:
 * - Linear thermal expansion of a 39-foot (11.887m) steel rail:
 *   Delta_L(T) = alpha_steel * L_0 * Delta_T
 *   where alpha_steel = 1.2e-5 / °C. For Delta_T = 45°C, Delta_L = 6.4 mm (finger/coin gap).
 * - When laid end-to-end with zero gap (Delta_gap = 0), compressive axial stress
 *   exceeds Euler critical buckling load P_cr = (pi^2 * E * I) / L_eff^2, causing
 *   transverse sinusoidal lateral kick x_buckle(z, f):
 */
export function evaluateRailBuckleOffset(z: number, frame: number): number {
  if (frame < 250) return 0;
  const u = smoothstep((frame - 250) / 35);
  const amplitude = 0.85 * u; // 0.85m sideways snake kick
  const wavelength = 6.0; // 6.0m S-curve wavelength
  const envelope = Math.exp(-0.04 * z * z);
  return amplitude * Math.sin((2 * Math.PI * z) / wavelength) * envelope;
}

/**
 * Evaluates thermal heat-map RGB color [0..255] along the steel rail near the expansion gap
 */
export function evaluateRailThermalColor(z: number, zGap: number, heatProgress: number): [number, number, number] {
  const distFactor = Math.exp(-0.65 * (z - zGap) * (z - zGap));
  const temp = Math.max(0, Math.min(1, heatProgress * distFactor));

  if (temp < 0.35) {
    const u = temp / 0.35;
    return [
      Math.round(lerp(113, 126, u)),
      Math.round(lerp(113, 34, u)),
      Math.round(lerp(122, 206, u)),
    ]; // Cold Steel #71717A -> Thermal Purple #7E22CE
  } else if (temp < 0.7) {
    const u = (temp - 0.35) / 0.35;
    return [
      Math.round(lerp(126, 236, u)),
      Math.round(lerp(34, 72, u)),
      Math.round(lerp(206, 153, u)),
    ]; // Thermal Purple -> Magenta Glow #EC4899
  } else {
    const u = (temp - 0.7) / 0.3;
    return [
      Math.round(lerp(236, 254, u)),
      Math.round(lerp(72, 240, u)),
      Math.round(lerp(153, 138, u)),
    ]; // Magenta Glow -> Incandescent Yellow #FEF08A
  }
}

export interface RailroadFrameState {
  frame: number;
  timeSec: number;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  fov: number;
  gapWidthMeters: number;
  thermalProgress: number;
  bossRagePurpleFactor: number;
}

export function evaluateRailroadSceneFrame(frame: number): RailroadFrameState {
  const f = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frame)));
  const timeSec = f / FPS;

  if (f < 60) {
    // Beat 1: Low-angle sawing hook
    const t = smoothstep(f / 59);
    return {
      frame: f,
      timeSec,
      camPos: [lerp(0.42, 0.28, t), lerp(0.42, 0.52, t), lerp(3.85, 2.35, t)],
      camTarget: [lerp(-0.25, -0.38, t), lerp(0.62, 0.78, t), -6.0],
      fov: lerp(50, 44, t),
      gapWidthMeters: 0.018, // Finger-wide 18mm winter gap
      thermalProgress: 0.0,
      bossRagePurpleFactor: 0.0,
    };
  } else if (f < 120) {
    // Beat 2: 180-degree cylindrical orbit + locomotive pass
    const lf = f - 60;
    const t = smoothstep(lf / 59);
    const orbit = lerp(0.35, 2.95, smoothstep(Math.min(1, lf / 32)));
    const r = lerp(2.2, 2.8, t);
    const cz = lerp(1.2, 2.6, Math.max(0, (lf - 20) / 39));
    return {
      frame: f,
      timeSec,
      camPos: [-0.35 + Math.sin(orbit) * r, lerp(0.75, 1.15, t), cz + Math.cos(orbit) * r],
      camTarget: [-0.35, lerp(0.85, 0.95, t), cz + lerp(0, 4.5, Math.max(0, (lf - 18) / 41))],
      fov: lerp(46, 54, t),
      gapWidthMeters: 0.018,
      thermalProgress: 0.0,
      bossRagePurpleFactor: 0.0,
    };
  } else if (f < 180) {
    // Beat 3: High-altitude abyss crane pullback
    const t = smoothstep((f - 120) / 59);
    return {
      frame: f,
      timeSec,
      camPos: [lerp(3.5, 11.0, t), lerp(4.5, 10.5, t), lerp(6.0, 18.5, t)],
      camTarget: [lerp(0.0, -2.5, t), lerp(2.0, 3.5, t), lerp(-12.0, -22.0, t)],
      fov: 52,
      gapWidthMeters: 0.018,
      thermalProgress: 0.15,
      bossRagePurpleFactor: 0.0,
    };
  } else if (f < 250) {
    // Beat 4: Boss Purple Rage & Summer Thermal Gap Shrinking (May coin -> July paper -> Closed)
    const lf = f - 180;
    const t = smoothstep(lf / 69);
    return {
      frame: f,
      timeSec,
      camPos: [lerp(-0.9, -0.45, t), lerp(0.65, 0.35, t), lerp(2.8, 1.45, t)],
      camTarget: [-0.56, lerp(0.75, 0.18, t), 1.2],
      fov: lerp(46, 38, t),
      gapWidthMeters: lerp(0.018, 0.0005, t), // Gap shrinks from 18mm to 0.5mm sheet of paper
      thermalProgress: lerp(0.25, 0.95, t),
      bossRagePurpleFactor: smoothstep(Math.min(1, lf / 18)),
    };
  } else {
    // Beat 5: Perfect Railroad Sinusoidal Snake Buckling on Canyon Bridge
    const lf = f - 250;
    const t = smoothstep(lf / 49);
    return {
      frame: f,
      timeSec,
      camPos: [0.0, lerp(2.4, 3.8, t), lerp(8.5, 12.0, t)],
      camTarget: [evaluateRailBuckleOffset(0, f), 1.1, -4.0],
      fov: lerp(48, 56, t),
      gapWidthMeters: 0.0, // Touching rail-to-rail
      thermalProgress: 1.0,
      bossRagePurpleFactor: 0.0,
    };
  }
}
