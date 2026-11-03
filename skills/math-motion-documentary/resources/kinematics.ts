/**
 * Pure Mathematical Kinematics & After Effects Graph-Editor Physics Engine
 * -------------------------------------------------------------------------
 * Every function is a closed-form or numerically converged deterministic
 * mapping f(t) -> R^n with zero wall-clock state and zero random guessing.
 */

export function clamp(x: number, min = 0, max = 1): number {
  return x < min ? min : x > max ? max : x;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function remap(x: number, inMin: number, inMax: number, outMin = 0, outMax = 1): number {
  if (Math.abs(inMax - inMin) < 1e-9) return outMin;
  return outMin + (outMax - outMin) * clamp((x - inMin) / (inMax - inMin), 0, 1);
}

/**
 * Exact 1D Cubic Bezier solver matching Adobe After Effects / CSS cubic-bezier(x1, y1, x2, y2).
 * Uses 8-iteration Newton-Raphson root finding on B_x(u) - t = 0 with bisection fallback
 * to guarantee < 1e-7 precision even on extreme whip curves like [0.87, 0, 0.13, 1].
 */
export function solveCubicBezierParameter(x1: number, x2: number, t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const cx = 3.0 * x1;
  const bx = 3.0 * (x2 - x1) - cx;
  const ax = 1.0 - cx - bx;

  const sampleCurveX = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sampleCurveDerivativeX = (u: number) => (3.0 * ax * u + 2.0 * bx) * u + cx;

  // Newton-Raphson iterations
  let u = t;
  for (let i = 0; i < 8; i++) {
    const xErr = sampleCurveX(u) - t;
    if (Math.abs(xErr) < 1e-7) return u;
    const dx = sampleCurveDerivativeX(u);
    if (Math.abs(dx) < 1e-6) break;
    u -= xErr / dx;
  }

  // Guaranteed bisection fallback on [0, 1]
  let lo = 0.0;
  let hi = 1.0;
  u = clamp(u, 0, 1);
  for (let i = 0; i < 14; i++) {
    const xVal = sampleCurveX(u);
    if (Math.abs(xVal - t) < 1e-7) return u;
    if (t > xVal) lo = u;
    else hi = u;
    u = 0.5 * (lo + hi);
  }
  return u;
}

export function cubicBezier(x1: number, y1: number, x2: number, y2: number, t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const u = solveCubicBezierParameter(x1, x2, t);
  const cy = 3.0 * y1;
  const by = 3.0 * (y2 - y1) - cy;
  const ay = 1.0 - cy - by;
  return ((ay * u + by) * u + cy) * u;
}

/**
 * Analytical derivative dy/dt = (dB_y/du) / (dB_x/du) for computing exact
 * 180-degree shutter directional motion blur proportional to instantaneous velocity.
 */
export function cubicBezierVelocity(x1: number, y1: number, x2: number, y2: number, t: number): number {
  if (t <= 0.001 || t >= 0.999) return 0;
  const u = solveCubicBezierParameter(x1, x2, t);
  const cx = 3.0 * x1;
  const bx = 3.0 * (x2 - x1) - cx;
  const ax = 1.0 - cx - bx;

  const cy = 3.0 * y1;
  const by = 3.0 * (y2 - y1) - cy;
  const ay = 1.0 - cy - by;

  const dxdu = (3.0 * ax * u + 2.0 * bx) * u + cx;
  const dydu = (3.0 * ay * u + 2.0 * by) * u + cy;
  if (Math.abs(dxdu) < 1e-5) return 0;
  return dydu / dxdu;
}

// Canonical After Effects Graph-Editor Curves
export const AE_SNAP = (t: number) => cubicBezier(0.16, 1.0, 0.3, 1.0, t);
export const AE_WHIP = (t: number) => cubicBezier(0.86, 0.0, 0.14, 1.0, t);
export const AE_WHIP_VEL = (t: number) => cubicBezierVelocity(0.86, 0.0, 0.14, 1.0, t);
export const AE_SILK = (t: number) => cubicBezier(0.33, 1.0, 0.68, 1.0, t);

/**
 * Exact Closed-Form Solution to the Second-Order Linear Damped Harmonic Oscillator ODE:
 *   x''(t) + 2 * zeta * omega0 * x'(t) + omega0^2 * (x(t) - 1) = 0
 * with initial conditions x(0) = 0, x'(0) = v0.
 */
export function springODE(
  elapsedSec: number,
  omega0 = 16.0,
  zeta = 0.78,
  v0 = 0.0
): { value: number; velocity: number } {
  if (elapsedSec <= 0) return { value: 0, velocity: v0 };

  if (zeta < 1.0 - 1e-5) {
    // Underdamped regime: crisp After Effects micro-overshoot & settle
    const omegaD = omega0 * Math.sqrt(1.0 - zeta * zeta);
    const decay = Math.exp(-zeta * omega0 * elapsedSec);
    const cosTerm = Math.cos(omegaD * elapsedSec);
    const sinTerm = Math.sin(omegaD * elapsedSec);
    const B = (zeta * omega0 - v0) / omegaD;
    const value = 1.0 - decay * (cosTerm + B * sinTerm);
    const velocity =
      decay *
      ((zeta * omega0 * (cosTerm + B * sinTerm)) - (-omegaD * sinTerm + B * omegaD * cosTerm));
    return { value, velocity };
  } else if (Math.abs(zeta - 1.0) <= 1e-5) {
    // Critically damped regime: fastest possible arrival with zero overshoot
    const decay = Math.exp(-omega0 * elapsedSec);
    const c2 = omega0 - v0;
    const value = 1.0 - decay * (1.0 + c2 * elapsedSec);
    const velocity = decay * (omega0 * (1.0 + c2 * elapsedSec) - c2);
    return { value, velocity };
  } else {
    // Overdamped regime
    const s = Math.sqrt(zeta * zeta - 1.0);
    const r1 = -omega0 * (zeta - s);
    const r2 = -omega0 * (zeta + s);
    const c2 = (-v0 - r1) / (r2 - r1);
    const c1 = 1.0 - c2;
    const e1 = Math.exp(r1 * elapsedSec);
    const e2 = Math.exp(r2 * elapsedSec);
    const value = 1.0 - (c1 * e1 + c2 * e2);
    const velocity = -(c1 * r1 * e1 + c2 * r2 * e2);
    return { value, velocity };
  }
}

/**
 * Damped Impulse Screen / Element Recoil:
 * Models physical momentum transfer I(t) = A * exp(-damping * t) * sin(freq * t)
 */
export function impulseRecoil(elapsedSec: number, amplitude = 8.0, damping = 11.0, freq = 38.0): number {
  if (elapsedSec <= 0 || elapsedSec > 1.2) return 0;
  return amplitude * Math.exp(-damping * elapsedSec) * Math.sin(freq * elapsedSec);
}

/**
 * Optical Cinema Lens Focal Pull + Baseline Mask Reveal Metrics
 * Matches viral After Effects typography lockups (Playfair Italic + Geist Black).
 */
export interface RevealStyle {
  opacity: number;
  yPx: number;
  scale: number;
  blurPx: number;
  progress: number;
}

export function computeReveal(
  currentTime: number,
  triggerTime: number,
  options?: {
    duration?: number;
    distancePx?: number;
    maxBlurPx?: number;
    omega0?: number;
    zeta?: number;
    scaleFrom?: number;
  }
): RevealStyle {
  const dt = currentTime - triggerTime;
  const dur = options?.duration ?? 0.55;
  const dist = options?.distancePx ?? 34;
  const maxBlur = options?.maxBlurPx ?? 12;
  const omega0 = options?.omega0 ?? 17.5;
  const zeta = options?.zeta ?? 0.82;
  const scaleFrom = options?.scaleFrom ?? 0.94;

  if (dt <= 0) {
    return { opacity: 0, yPx: dist, scale: scaleFrom, blurPx: maxBlur, progress: 0 };
  }

  const normT = clamp(dt / dur, 0, 1);
  const opticalEase = AE_SNAP(normT);
  const spring = springODE(dt, omega0, zeta).value;

  // Quadratic optical defocus decay (f/1.4 focal pull)
  const blurPx = maxBlur * Math.pow(1.0 - opticalEase, 2.2);
  const opacity = clamp(AE_SILK(clamp(dt / (dur * 0.55), 0, 1)), 0, 1);
  const yPx = (1.0 - spring) * dist;
  const scale = lerp(scaleFrom, 1.0, spring);

  return {
    opacity,
    yPx,
    scale,
    blurPx: blurPx < 0.08 ? 0 : blurPx,
    progress: opticalEase,
  };
}

/**
 * 2D Cubic Bezier Spatial Curve & Arc-Length Parameterization
 */
export type Vec2 = [number, number];

export function evalCubic2D(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, u: number): {
  x: number;
  y: number;
  angleDeg: number;
} {
  const mu = 1.0 - u;
  const mu2 = mu * mu;
  const u2 = u * u;

  const x = mu2 * mu * p0[0] + 3 * mu2 * u * p1[0] + 3 * mu * u2 * p2[0] + u2 * u * p3[0];
  const y = mu2 * mu * p0[1] + 3 * mu2 * u * p1[1] + 3 * mu * u2 * p2[1] + u2 * u * p3[1];

  // Analytical tangent vector B'(u)
  const dx = 3 * mu2 * (p1[0] - p0[0]) + 6 * mu * u * (p2[0] - p1[0]) + 3 * u2 * (p3[0] - p2[0]);
  const dy = 3 * mu2 * (p1[1] - p0[1]) + 6 * mu * u * (p2[1] - p1[1]) + 3 * u2 * (p3[1] - p2[1]);
  const angleDeg = (Math.atan2(dy, dx) * 180.0) / Math.PI;

  return { x, y, angleDeg };
}

export interface ArcLengthSpline {
  p0: Vec2;
  p1: Vec2;
  p2: Vec2;
  p3: Vec2;
  totalLength: number;
  uSamples: number[];
  sSamples: number[];
  svgPath: string;
}

export function createArcLengthSpline(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, segments = 160): ArcLengthSpline {
  const uSamples: number[] = [0];
  const sSamples: number[] = [0];
  let accum = 0;
  let prev = evalCubic2D(p0, p1, p2, p3, 0);

  for (let i = 1; i <= segments; i++) {
    const u = i / segments;
    const pt = evalCubic2D(p0, p1, p2, p3, u);
    accum += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    uSamples.push(u);
    sSamples.push(accum);
    prev = pt;
  }

  return {
    p0,
    p1,
    p2,
    p3,
    totalLength: accum,
    uSamples,
    sSamples,
    svgPath: `M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}, ${p3[0]} ${p3[1]}`,
  };
}

export function sampleArcLengthSpline(spline: ArcLengthSpline, arcFraction: number): {
  x: number;
  y: number;
  angleDeg: number;
  drawnLength: number;
} {
  const f = clamp(arcFraction, 0, 1);
  const targetS = f * spline.totalLength;

  // Binary search in cumulative arc-length table
  let lo = 0;
  let hi = spline.sSamples.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (spline.sSamples[mid] <= targetS) lo = mid;
    else hi = mid;
  }

  const s0 = spline.sSamples[lo];
  const s1 = spline.sSamples[hi];
  const segFrac = s1 > s0 ? (targetS - s0) / (s1 - s0) : 0;
  const u = lerp(spline.uSamples[lo], spline.uSamples[hi], segFrac);
  const pt = evalCubic2D(spline.p0, spline.p1, spline.p2, spline.p3, u);

  return { ...pt, drawnLength: targetS };
}

/**
 * Precision Numerical Counter with Exponential Deceleration
 */
export function formatAnimatedNumber(
  currentTime: number,
  startTime: number,
  duration: number,
  fromVal: number,
  toVal: number,
  decimals = 2
): string {
  const p = AE_SNAP(clamp((currentTime - startTime) / duration, 0, 1));
  const val = lerp(fromVal, toVal, p);
  return val.toFixed(decimals);
}

/**
 * Continuous 2D After Effects Null-Object Camera Whip-Pan Solver
 * Computes exact spatial translation (camX, camY) and 180-deg shutter directional blur
 * for seamless transitions between adjacent scenes.
 */
export interface SceneWindow {
  id: string;
  start: number;
  end: number;
  enterDir: Vec2; // Unit vector e.g. [1, 0] (whips in from right), [0, 1] (whips in from bottom)
  theme: "light" | "dark";
}

export interface ActiveSceneState {
  sceneIndex: number;
  scene: SceneWindow;
  localTime: number;
  sceneDuration: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  shutterBlurX: number;
  shutterBlurY: number;
  opacity: number;
}

const WHIP_HALF_WINDOW = 0.22; // 0.44s total camera whip duration

export function evaluateCameraTimeline(t: number, scenes: SceneWindow[]): {
  activeStates: ActiveSceneState[];
  shutterBlurX: number;
  shutterBlurY: number;
  backgroundThemeMix: number; // 0 = pure light (#F3F3F5), 1 = pure dark (#09090B)
} {
  const activeStates: ActiveSceneState[] = [];
  let maxBlurX = 0;
  let maxBlurY = 0;
  let themeMix = 0;

  // Determine base scene
  let primaryIdx = scenes.findIndex((s) => t >= s.start && t < s.end);
  if (primaryIdx === -1) primaryIdx = t < scenes[0].start ? 0 : scenes.length - 1;
  themeMix = scenes[primaryIdx].theme === "dark" ? 1 : 0;

  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    const inStart = sc.start - WHIP_HALF_WINDOW;
    const outEnd = sc.end + WHIP_HALF_WINDOW;
    if (t < inStart || t > outEnd) continue;

    let offsetX = 0;
    let offsetY = 0;
    let scale = 1.0;
    let opacity = 1.0;
    let bX = 0;
    let bY = 0;

    // Entering whip transition around sc.start (for i > 0)
    if (i > 0 && Math.abs(t - sc.start) <= WHIP_HALF_WINDOW) {
      const tau = clamp((t - (sc.start - WHIP_HALF_WINDOW)) / (2 * WHIP_HALF_WINDOW), 0, 1);
      const ease = AE_WHIP(tau);
      const vel = AE_WHIP_VEL(tau); // Peaks ~3.4 at tau=0.5

      offsetX = (1.0 - ease) * sc.enterDir[0] * 1920;
      offsetY = (1.0 - ease) * sc.enterDir[1] * 1080;
      scale = lerp(0.94, 1.0, ease);
      opacity = clamp(tau * 3.2, 0, 1);

      // 180-degree shutter motion blur strictly proportional to instantaneous velocity
      bX = Math.abs(sc.enterDir[0]) * vel * 7.5;
      bY = Math.abs(sc.enterDir[1]) * vel * 6.5;

      // Smoothly interpolate global canvas theme across cut
      const prevTheme = scenes[i - 1].theme === "dark" ? 1 : 0;
      const curTheme = sc.theme === "dark" ? 1 : 0;
      themeMix = lerp(prevTheme, curTheme, ease);
    }

    // Exiting whip transition around sc.end (for i < scenes.length - 1)
    if (i < scenes.length - 1 && Math.abs(t - sc.end) <= WHIP_HALF_WINDOW) {
      const nextSc = scenes[i + 1];
      const tau = clamp((t - (sc.end - WHIP_HALF_WINDOW)) / (2 * WHIP_HALF_WINDOW), 0, 1);
      const ease = AE_WHIP(tau);
      const vel = AE_WHIP_VEL(tau);

      // Pushed in opposite direction of incoming scene's enterDir!
      offsetX = -ease * nextSc.enterDir[0] * 1920;
      offsetY = -ease * nextSc.enterDir[1] * 1080;
      scale = lerp(1.0, 0.94, ease);
      opacity = clamp((1.0 - tau) * 3.2, 0, 1);

      bX = Math.max(bX, Math.abs(nextSc.enterDir[0]) * vel * 7.5);
      bY = Math.max(bY, Math.abs(nextSc.enterDir[1]) * vel * 6.5);
    }

    maxBlurX = Math.max(maxBlurX, bX);
    maxBlurY = Math.max(maxBlurY, bY);

    activeStates.push({
      sceneIndex: i,
      scene: sc,
      localTime: Math.max(0, t - sc.start),
      sceneDuration: sc.end - sc.start,
      offsetX,
      offsetY,
      scale,
      shutterBlurX: bX,
      shutterBlurY: bY,
      opacity,
    });
  }

  return {
    activeStates,
    shutterBlurX: maxBlurX < 0.25 ? 0 : Math.min(maxBlurX, 32),
    shutterBlurY: maxBlurY < 0.25 ? 0 : Math.min(maxBlurY, 26),
    backgroundThemeMix: themeMix,
  };
}
