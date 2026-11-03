/**
 * Pure Mathematical Kinematics Engine for Deterministic Motion Graphics
 * Every output is a closed-form pure function of time `t`.
 * Zero CSS transitions, zero state drift, exact Newton-Raphson + Spring ODE solvers.
 */

export function clamp(x: number, lo = 0, hi = 1): number {
  return Math.min(Math.max(x, lo), hi);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function remap(
  x: number,
  inLow: number,
  inHigh: number,
  outLow = 0,
  outHigh = 1
): number {
  if (Math.abs(inHigh - inLow) < 1e-9) return outLow;
  const p = clamp((x - inLow) / (inHigh - inLow), 0, 1);
  return lerp(outLow, outHigh, p);
}

export function windowProgress(t: number, start: number, duration: number): number {
  if (duration <= 1e-9) return t >= start ? 1 : 0;
  return clamp((t - start) / duration, 0, 1);
}

// Cubic Bezier evaluation B(u) with P0=0, P3=1
function evalBezier(u: number, p1: number, p2: number): number {
  const inv = 1 - u;
  return 3 * inv * inv * u * p1 + 3 * inv * u * u * p2 + u * u * u;
}

// Derivative dB(u)/du
function evalBezierDerivative(u: number, p1: number, p2: number): number {
  const inv = 1 - u;
  return (
    3 * inv * inv * p1 +
    6 * inv * u * (p2 - p1) +
    3 * u * u * (1 - p2)
  );
}

/**
 * Solves Bx(u) = x for u in [0, 1] using 8 Newton-Raphson iterations
 * with a 14-step bisection fallback for steep/flat tangents.
 */
export function solveCubicBezierParameter(
  x: number,
  x1: number,
  x2: number
): number {
  const target = clamp(x, 0, 1);
  if (target <= 0) return 0;
  if (target >= 1) return 1;
  if (Math.abs(x1 - x2) < 1e-7 && Math.abs(x1) < 1e-7) return target;

  let u = target;
  for (let i = 0; i < 8; i++) {
    const err = evalBezier(u, x1, x2) - target;
    if (Math.abs(err) < 1e-7) return clamp(u, 0, 1);
    const d = evalBezierDerivative(u, x1, x2);
    if (Math.abs(d) < 1e-6) break;
    u -= err / d;
  }

  // 14-step bisection fallback
  let lo = 0;
  let hi = 1;
  u = clamp(u, 0, 1);
  for (let i = 0; i < 14; i++) {
    const val = evalBezier(u, x1, x2);
    if (Math.abs(val - target) < 1e-7) return u;
    if (target > val) {
      lo = u;
    } else {
      hi = u;
    }
    u = 0.5 * (lo + hi);
  }
  return clamp(u, 0, 1);
}

export function cubicBezier(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const clamped = clamp(t, 0, 1);
  if (clamped <= 0) return 0;
  if (clamped >= 1) return 1;
  const u = solveCubicBezierParameter(clamped, x1, x2);
  return evalBezier(u, y1, y2);
}

export function cubicBezierVelocity(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const clamped = clamp(t, 0.001, 0.999);
  const u = solveCubicBezierParameter(clamped, x1, x2);
  const dx = evalBezierDerivative(u, x1, x2);
  const dy = evalBezierDerivative(u, y1, y2);
  if (Math.abs(dx) < 1e-4) return 0;
  return Math.min(Math.abs(dy / dx), 6.0);
}

// Canonical After Effects Graph Editor curves
export function AE_SNAP(t: number): number {
  return cubicBezier(t, 0.16, 1.0, 0.3, 1.0);
}

export function AE_WHIP(t: number): number {
  return cubicBezier(t, 0.86, 0.0, 0.14, 1.0);
}

export function AE_WHIP_VEL(t: number): number {
  return cubicBezierVelocity(t, 0.86, 0.0, 0.14, 1.0);
}

export function AE_SILK(t: number): number {
  return cubicBezier(t, 0.33, 1.0, 0.68, 1.0);
}

/**
 * Closed-form solution of damped harmonic oscillator ODE:
 * x'' + 2 * zeta * omega0 * x' + omega0^2 * (x - 1) = 0
 * with x(0) = 0, x'(0) = v0
 */
export interface SpringSample {
  value: number;
  velocity: number;
}

export function springODE(
  dt: number,
  omega0 = 18.5,
  zeta = 0.8,
  v0 = 0
): SpringSample {
  if (dt <= 0) return { value: 0, velocity: v0 };
  if (dt > 6.0) return { value: 1, velocity: 0 };

  if (zeta < 1 - 1e-5) {
    // Underdamped
    const wd = omega0 * Math.sqrt(1 - zeta * zeta);
    const env = Math.exp(-zeta * omega0 * dt);
    const B = (zeta * omega0 - v0) / wd;
    const cos = Math.cos(wd * dt);
    const sin = Math.sin(wd * dt);
    const value = 1 - env * (cos + B * sin);
    const velocity =
      env *
      ((zeta * omega0 - B * wd) * cos + (wd + zeta * omega0 * B) * sin);
    return { value, velocity };
  } else if (Math.abs(zeta - 1) <= 1e-5) {
    // Critically damped
    const env = Math.exp(-omega0 * dt);
    const c2 = omega0 - v0;
    const value = 1 - env * (1 + c2 * dt);
    const velocity = env * (omega0 * (1 + c2 * dt) - c2);
    return { value, velocity };
  } else {
    // Overdamped
    const s = Math.sqrt(zeta * zeta - 1);
    const r1 = -omega0 * (zeta - s);
    const r2 = -omega0 * (zeta + s);
    const c2 = (v0 + r1) / (r1 - r2);
    const c1 = -1 - c2;
    const e1 = Math.exp(r1 * dt);
    const e2 = Math.exp(r2 * dt);
    const value = 1 + c1 * e1 + c2 * e2;
    const velocity = c1 * r1 * e1 + c2 * r2 * e2;
    return { value, velocity };
  }
}

export interface RevealOptions {
  dur?: number;
  distancePx?: number;
  scaleFrom?: number;
  maxBlur?: number;
  omega0?: number;
  zeta?: number;
}

export interface RevealState {
  opacity: number;
  yPx: number;
  scale: number;
  blurPx: number;
  springVal: number;
}

export function computeReveal(
  t: number,
  at: number,
  opts: RevealOptions = {}
): RevealState {
  const {
    dur = 0.58,
    distancePx = 38,
    scaleFrom = 0.94,
    maxBlur = 10,
    omega0 = 18.5,
    zeta = 0.8,
  } = opts;

  const dt = t - at;
  if (dt <= 0) {
    return {
      opacity: 0,
      yPx: distancePx,
      scale: scaleFrom,
      blurPx: maxBlur,
      springVal: 0,
    };
  }

  const spring = springODE(dt, omega0, zeta).value;
  const ease = AE_SNAP(clamp(dt / dur, 0, 1));
  const opacity = AE_SILK(clamp(dt / (0.55 * dur), 0, 1));
  const yPx = (1 - spring) * distancePx;
  const scale = lerp(scaleFrom, 1, spring);
  const blurPx = maxBlur * Math.pow(Math.max(0, 1 - ease), 2.2);

  return {
    opacity,
    yPx,
    scale,
    blurPx: blurPx < 0.15 ? 0 : blurPx,
    springVal: spring,
  };
}

/**
 * Impulse recoil for camera shake on heavy slams, gongs, and crashes
 */
export function impulseRecoil(
  dt: number,
  amplitude = 9.0,
  damping = 11.5,
  freq = 40.0
): number {
  if (dt <= 0 || dt >= 1.2) return 0;
  return amplitude * Math.exp(-damping * dt) * Math.sin(freq * dt);
}

/**
 * 2D Cubic Bezier & Multi-Segment Catmull-Rom / Bezier Spline with Arc-Length Parameterization
 */
export interface Point2D {
  x: number;
  y: number;
}

export interface ArcLengthSpline {
  points: Point2D[];
  tangents: Point2D[];
  cumLengths: number[];
  totalLength: number;
  svgPath: string;
}

function evalCatmullRomPoint(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  u: number
): Point2D {
  const u2 = u * u;
  const u3 = u2 * u;
  const x =
    0.5 *
    (2 * p1.x +
      (-p0.x + p2.x) * u +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3);
  const y =
    0.5 *
    (2 * p1.y +
      (-p0.y + p2.y) * u +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3);
  return { x, y };
}

function evalCatmullRomTangent(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  u: number
): Point2D {
  const u2 = u * u;
  const dx =
    0.5 *
    (-p0.x +
      p2.x +
      2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u +
      3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u2);
  const dy =
    0.5 *
    (-p0.y +
      p2.y +
      2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u +
      3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u2);
  return { x: dx, y: dy };
}

export function buildArcLengthSpline(
  Waypoints: Point2D[],
  numSamples = 160
): ArcLengthSpline {
  if (Waypoints.length < 2) {
    const p = Waypoints[0] || { x: 0, y: 0 };
    return {
      points: [p, p],
      tangents: [{ x: 1, y: 0 }, { x: 1, y: 0 }],
      cumLengths: [0, 0],
      totalLength: 0,
      svgPath: `M ${p.x} ${p.y}`,
    };
  }

  const segCount = Waypoints.length - 1;
  const pts: Point2D[] = [];
  const tans: Point2D[] = [];
  const cumLengths: number[] = [0];
  let total = 0;

  for (let i = 0; i <= numSamples; i++) {
    const globalU = (i / numSamples) * segCount;
    const segIdx = Math.min(Math.floor(globalU), segCount - 1);
    const localU = globalU - segIdx;

    const p0 = Waypoints[Math.max(0, segIdx - 1)];
    const p1 = Waypoints[segIdx];
    const p2 = Waypoints[Math.min(Waypoints.length - 1, segIdx + 1)];
    const p3 = Waypoints[Math.min(Waypoints.length - 1, segIdx + 2)];

    const pt = evalCatmullRomPoint(p0, p1, p2, p3, localU);
    const tan = evalCatmullRomTangent(p0, p1, p2, p3, localU);
    pts.push(pt);
    tans.push(tan);

    if (i > 0) {
      const prev = pts[i - 1];
      const ds = Math.hypot(pt.x - prev.x, pt.y - prev.y);
      total += ds;
      cumLengths.push(total);
    }
  }

  const svgPath = pts
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  return {
    points: pts,
    tangents: tans,
    cumLengths,
    totalLength: total,
    svgPath,
  };
}

export interface SplineSample {
  x: number;
  y: number;
  angleRad: number;
  angleDeg: number;
}

export function sampleArcLengthSpline(
  spline: ArcLengthSpline,
  fraction: number
): SplineSample {
  const f = clamp(fraction, 0, 1);
  const targetS = f * spline.totalLength;
  const arr = spline.cumLengths;
  const n = arr.length;

  if (n < 2 || spline.totalLength <= 1e-6) {
    const p = spline.points[0] || { x: 0, y: 0 };
    return { x: p.x, y: p.y, angleRad: 0, angleDeg: 0 };
  }

  let lo = 0;
  let hi = n - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= targetS) lo = mid;
    else hi = mid;
  }

  const s0 = arr[lo];
  const s1 = arr[hi];
  const alpha = s1 > s0 ? clamp((targetS - s0) / (s1 - s0), 0, 1) : 0;

  const p0 = spline.points[lo];
  const p1 = spline.points[hi];
  const t0 = spline.tangents[lo];
  const t1 = spline.tangents[hi];

  const x = lerp(p0.x, p1.x, alpha);
  const y = lerp(p0.y, p1.y, alpha);
  const tx = lerp(t0.x, t1.x, alpha);
  const ty = lerp(t0.y, t1.y, alpha);
  const angleRad = Math.atan2(ty, tx);

  return {
    x,
    y,
    angleRad,
    angleDeg: (angleRad * 180) / Math.PI,
  };
}

export function formatAnimatedNumber(
  t: number,
  start: number,
  dur: number,
  from: number,
  to: number,
  decimals = 0,
  locale: "en-IN" | "en-US" = "en-IN"
): string {
  const p = windowProgress(t, start, dur);
  const eased = AE_SNAP(p);
  const val = lerp(from, to, eased);
  if (decimals <= 0) {
    return Math.round(val).toLocaleString(locale);
  }
  return val.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function interpolateBgRgb(
  darkMix: number,
  lightRgb: [number, number, number] = [243, 243, 245],
  darkRgb: [number, number, number] = [9, 9, 11]
): string {
  const m = clamp(darkMix, 0, 1);
  const r = Math.round(lerp(lightRgb[0], darkRgb[0], m));
  const g = Math.round(lerp(lightRgb[1], darkRgb[1], m));
  const b = Math.round(lerp(lightRgb[2], darkRgb[2], m));
  return `rgb(${r}, ${g}, ${b})`;
}
