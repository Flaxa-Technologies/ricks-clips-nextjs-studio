/**
 * EXAMPLE 03: "The Ancient Jar That Warned an Empire" — Zhang Heng's Seismoscope (132 AD)
 * (@RicksClips3000 - VS1Z_Q-Klt8)
 * Complete 300-Frame (10.00s @ 30 FPS) Deterministic Mathematical Scene Specification
 *
 * Mathematical Highlights:
 * 1. 8-Fold Cylindrical Symmetry of Dragons & Open-Mouthed Toads:
 *    theta_k = k * (2 * Math.PI / 8), k in {0..7}
 *    Dragon_k = [R_jar * sin(theta_k), Y_dragon, R_jar * cos(theta_k)]
 *    Toad_k   = [R_toad * sin(theta_k), 0.0, R_toad * cos(theta_k)]
 * 2. Internal Heavy Pendulum Damped Harmonic Oscillation after Seismic P-Wave Impulse:
 *    phi_pend(t) = phi_max * exp(-zeta * omega_n * t) * sin(omega_d * t)
 * 3. Lever Linkage Jaw Angle & Free-Fall Bronze Ball Kinematics:
 *    y_ball(dt) = Math.max(y_toad_mouth, y_dragon_jaw - 0.5 * 9.81 * dt^2)
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

export interface DragonHeadNode {
  index: number;
  azimuthRad: number;
  dragonWorldPos: [number, number, number];
  toadWorldPos: [number, number, number];
  jawOpenAngleRad: number;
  ballWorldPos: [number, number, number];
  hasDropped: boolean;
}

/**
 * Computes the exact 3D coordinates of all 8 dragons, 8 bronze balls, and 8 frogs
 * arranged at 45-degree (PI/4) intervals around the bronze seismoscope jar.
 */
export function evaluateOctagonalSeismoscope(
  jarRadius = 0.88,
  dragonHeightY = 1.42,
  toadRadius = 1.08,
  toadMouthY = 0.24,
  dropStartFrames: (number | null)[],
  currentFrame: number
): DragonHeadNode[] {
  const nodes: DragonHeadNode[] = [];

  for (let k = 0; k < 8; k++) {
    const azimuthRad = (k * Math.PI) / 4; // 0, 45°, 90°, ..., 315°
    const sinA = Math.sin(azimuthRad);
    const cosA = Math.cos(azimuthRad);

    const dx = jarRadius * sinA;
    const dz = jarRadius * cosA;
    const tx = toadRadius * sinA;
    const tz = toadRadius * cosA;

    const dropFrame = dropStartFrames[k];
    let jawOpenAngleRad = 0.08;
    let ballY = dragonHeightY - 0.06;
    let ballX = (jarRadius + 0.14) * sinA;
    let ballZ = (jarRadius + 0.14) * cosA;
    let hasDropped = false;

    if (dropFrame !== null && currentFrame >= dropFrame) {
      hasDropped = true;
      const dt = (currentFrame - dropFrame) / FPS;
      jawOpenAngleRad = lerp(0.08, 0.58, smoothstep(dt * 8.0));

      const rawFallY = dragonHeightY - 0.06 - 0.5 * GRAVITY * dt * dt;
      if (rawFallY <= toadMouthY) {
        // Ball has landed inside the bronze toad's open mouth with a tiny damped bounce
        const bounceTime = Math.max(0, dt - Math.sqrt((2 * (dragonHeightY - 0.06 - toadMouthY)) / GRAVITY));
        ballY = toadMouthY + 0.08 * Math.exp(-9.0 * bounceTime) * Math.abs(Math.sin(22.0 * bounceTime));
        ballX = tx;
        ballZ = tz;
      } else {
        const fallFraction = (dragonHeightY - 0.06 - rawFallY) / (dragonHeightY - 0.06 - toadMouthY);
        ballY = rawFallY;
        ballX = lerp(ballX, tx, fallFraction);
        ballZ = lerp(ballZ, tz, fallFraction);
      }
    }

    nodes.push({
      index: k,
      azimuthRad,
      dragonWorldPos: [dx, dragonHeightY, dz],
      toadWorldPos: [tx, 0.0, tz],
      jawOpenAngleRad,
      ballWorldPos: [ballX, ballY, ballZ],
      hasDropped,
    });
  }

  return nodes;
}

/**
 * Evaluates the internal inverted-pendulum swing angle inside the cutaway jar (Frames 180-240)
 */
export function evaluatePendulumSwingRad(frame: number, impulseFrame = 188): number {
  if (frame < impulseFrame) return 0.0;
  const dt = (frame - impulseFrame) / FPS;
  const omegaD = 9.5; // rad/s
  const damping = 1.8;
  return 0.24 * Math.exp(-damping * dt) * Math.sin(omegaD * dt);
}
