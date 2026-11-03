/**
 * EXAMPLE 02: "Levels of Pirate Cannonballs — Round Shot, Hot Shot & The Carcass"
 * (@RicksClips3000 - lnYLIWP2l-I)
 * Complete 300-Frame (10.00s @ 30 FPS) Deterministic Mathematical Scene Specification
 *
 * Mathematical Highlights:
 * 1. Parabolic Ballistic Projectile Trajectory with Gravity g = 9.81 m/s^2:
 *    P_ball(t) = [x0 + vx*t, y0 + vy*t - 0.5*g*t^2, z0 + vz*t]
 * 2. Hull Impact Wood Splinter Radial Cone Burst (32 deterministic Fibonacci sphere vectors)
 * 3. Blackbody Furnace Heating Ramp (Cold Cast Iron #18181B -> Glowing Cherry Red #EA580C -> #FEF08A)
 * 4. Ship Hull Internal Lantern Point-Light Transmission (hull planks glow from inside)
 */

export const FPS = 30;
export const TOTAL_FRAMES = 300;
const GRAVITY = 9.81;

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * Math.max(0, Math.min(1, t));

export const smoothstep = (t: number): number => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

export interface SplinterParticle {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
}

/**
 * Computes exact parabolic 3D position of a fired cannonball at time t (seconds since firing)
 */
export function evaluateCannonballParabola(
  muzzlePos: [number, number, number],
  targetPos: [number, number, number],
  flightDurationSec: number,
  elapsedSec: number
): [number, number, number] {
  const t = Math.max(0, Math.min(flightDurationSec, elapsedSec));
  const vx = (targetPos[0] - muzzlePos[0]) / flightDurationSec;
  const vz = (targetPos[2] - muzzlePos[2]) / flightDurationSec;
  const vy =
    (targetPos[1] - muzzlePos[1] + 0.5 * GRAVITY * flightDurationSec * flightDurationSec) /
    flightDurationSec;

  return [
    muzzlePos[0] + vx * t,
    muzzlePos[1] + vy * t - 0.5 * GRAVITY * t * t,
    muzzlePos[2] + vz * t,
  ];
}

/**
 * Computes 32 deterministic wood splinter trajectories bursting from a hull impact point
 * using the golden-angle Fibonacci cone distribution (ZERO Math.random).
 */
export function evaluateWoodSplinterStorm(
  impactOrigin: [number, number, number],
  framesSinceImpact: number,
  count = 32
): SplinterParticle[] {
  if (framesSinceImpact <= 0) return [];
  const tSec = framesSinceImpact / FPS;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const splinters: SplinterParticle[] = [];

  for (let i = 0; i < count; i++) {
    const rNorm = Math.sqrt((i + 0.5) / count);
    const theta = i * goldenAngle;
    const speed = 5.5 + (i % 5) * 1.4; // 5.5 to 11.1 m/s burst speed

    const vx = Math.cos(theta) * rNorm * speed;
    const vy = (0.35 + Math.sin(theta) * 0.5 * rNorm) * speed;
    const vz = Math.sqrt(Math.max(0.05, 1 - rNorm * rNorm)) * speed;

    splinters.push({
      id: i,
      position: [
        impactOrigin[0] + vx * tSec,
        impactOrigin[1] + vy * tSec - 0.5 * GRAVITY * tSec * tSec,
        impactOrigin[2] + vz * tSec,
      ],
      rotation: [tSec * (6 + (i % 4)), tSec * (4 - (i % 3)), theta],
      length: 0.28 + (i % 4) * 0.09,
    });
  }
  return splinters;
}

/**
 * Gerstner Ocean Swell Buoyancy Pitch & Roll for the 3D Pirate Ship
 */
export function evaluateShipOceanMotion(frame: number): {
  heaveY: number;
  rollZ: number;
  pitchX: number;
} {
  const t = frame / FPS;
  return {
    heaveY: 0.14 * Math.sin(2 * Math.PI * 0.45 * t),
    rollZ: 0.045 * Math.sin(2 * Math.PI * 0.38 * t + 0.7),
    pitchX: 0.028 * Math.cos(2 * Math.PI * 0.52 * t),
  };
}

export interface PirateSceneFrameState {
  frame: number;
  beatId: 1 | 2 | 3 | 4 | 5;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  fov: number;
  cannonballPos: [number, number, number] | null;
  cannonballTempNormalized: number; // 0 = cold black iron, 1 = glowing red-orange hot shot
  splinters: SplinterParticle[];
  shipInternalLanternGlow: number; // 0 -> 1 when hot shot ignites hull from inside
  captionText: string;
}

export const PIRATE_SUBTITLES: [number, number, string][] = [
  [0, 14, 'If your ship'],
  [15, 29, 'got hit by'],
  [30, 48, 'a cannonball,'],
  [49, 64, "you'd be"],
  [65, 84, 'the lucky ones.'],
  [85, 102, "Navy's round shot"],
  [103, 122, 'smashed walls'],
  [123, 142, 'into a storm'],
  [143, 165, 'of splinters.'],
  [166, 185, 'Then came'],
  [186, 206, 'HOT SHOT:'],
  [207, 228, 'heated red-hot'],
  [229, 250, 'in a furnace'],
  [251, 274, 'until the ship'],
  [275, 299, 'lit up like a lantern!'],
];

export function evaluatePirateSceneFrame(frame: number): PirateSceneFrameState {
  const f = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frame)));
  const activeSub =
    PIRATE_SUBTITLES.find(([s, e]) => f >= s && f <= e)?.[2] ?? '';

  if (f < 60) {
    // Beat 1 (f000-059): Cannon deck standoff + muzzle blast recoil
    const t = smoothstep(f / 59);
    const fired = f >= 24;
    const ballPos = fired
      ? evaluateCannonballParabola([0, 1.1, 1.5], [0, 1.4, -22.0], 1.2, (f - 24) / FPS)
      : null;

    return {
      frame: f,
      beatId: 1,
      camPos: [lerp(-1.2, 0.4, t), lerp(1.35, 1.65, t), lerp(3.4, 4.2, t)],
      camTarget: [0.0, 1.2, lerp(0.5, -12.0, t)],
      fov: lerp(46, 52, t),
      cannonballPos: ballPos,
      cannonballTempNormalized: 0.0,
      splinters: [],
      shipInternalLanternGlow: 0.0,
      captionText: activeSub,
    };
  } else if (f < 120) {
    // Beat 2 (f060-119): Broadside ocean tracking shot as round shot smashes hull
    const lf = f - 60;
    const t = smoothstep(lf / 59);
    return {
      frame: f,
      beatId: 2,
      camPos: [lerp(0.0, 2.5, t), lerp(2.2, 1.8, t), lerp(14.0, 8.5, t)],
      camTarget: [0.0, 1.5, 0.0],
      fov: 48,
      cannonballPos: lf < 22 ? evaluateCannonballParabola([-12, 2.2, 4], [0, 1.5, 0], 0.73, lf / FPS) : null,
      cannonballTempNormalized: 0.0,
      splinters: [],
      shipInternalLanternGlow: 0.0,
      captionText: activeSub,
    };
  } else if (f < 180) {
    // Beat 3 (f120-179): Interior deck splinter storm tearing past squinting pirates
    const lf = f - 120;
    const t = smoothstep(lf / 59);
    return {
      frame: f,
      beatId: 3,
      camPos: [lerp(-1.8, 1.4, t), 1.25, lerp(2.8, 3.6, t)],
      camTarget: [0.0, 1.15, 0.0],
      fov: 50,
      cannonballPos: null,
      cannonballTempNormalized: 0.0,
      splinters: evaluateWoodSplinterStorm([-1.2, 1.2, 0.0], lf + 2, 32),
      shipInternalLanternGlow: 0.0,
      captionText: activeSub,
    };
  } else if (f < 245) {
    // Beat 4 (f180-244): Island brick furnace zoom-in — cannonballs heating to cherry red
    const lf = f - 180;
    const t = smoothstep(lf / 64);
    return {
      frame: f,
      beatId: 4,
      camPos: [0.0, lerp(1.6, 0.85, t), lerp(5.5, 1.65, t)],
      camTarget: [0.0, 0.75, -1.5],
      fov: lerp(48, 40, t),
      cannonballPos: [0.0, 0.65, -0.5],
      cannonballTempNormalized: smoothstep(lf / 45), // Heats from 0.0 to 1.0 glowing orange-yellow
      splinters: [],
      shipInternalLanternGlow: 0.0,
      captionText: activeSub,
    };
  } else {
    // Beat 5 (f245-299): Nightfall ocean wide shot — Hot Shot embeds in hull & ship glows like a giant lantern
    const lf = f - 245;
    const t = smoothstep(lf / 54);
    return {
      frame: f,
      beatId: 5,
      camPos: [lerp(-2.0, 0.5, t), lerp(2.0, 2.8, t), lerp(11.0, 15.5, t)],
      camTarget: [0.0, 1.8, 0.0],
      fov: 46,
      cannonballPos: [0.8, 1.1, 0.6],
      cannonballTempNormalized: 1.0,
      splinters: [],
      shipInternalLanternGlow: smoothstep(Math.max(0, (lf - 10) / 35)),
      captionText: activeSub,
    };
  }
}
