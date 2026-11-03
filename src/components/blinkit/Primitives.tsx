import React from "react";
import {
  AE_SNAP,
  ArcLengthSpline,
  clamp,
  computeReveal,
  lerp,
  RevealOptions,
  sampleArcLengthSpline,
  springODE,
  windowProgress,
} from "../../lib/kinematics";

export interface KineticBlockProps extends RevealOptions {
  t: number;
  at: number;
  floatAmp?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const KineticBlock: React.FC<KineticBlockProps> = ({
  t,
  at,
  dur = 0.58,
  distancePx = 48,
  scaleFrom = 0.88,
  maxBlur = 12,
  omega0 = 21.5,
  zeta = 0.7,
  floatAmp = 4.2,
  className = "",
  style,
  children,
}) => {
  const rev = computeReveal(t, at, {
    dur,
    distancePx,
    scaleFrom,
    maxBlur,
    omega0,
    zeta,
  });

  if (rev.opacity <= 0.002) {
    return null;
  }

  const dt = Math.max(0, t - at);
  // Instantaneous normalized velocity for elastic squash & stretch + chromatic split
  const velNorm = clamp(Math.abs(rev.velocity) * 0.08, 0, 0.22);
  const stretchY = 1 + velNorm * 0.55;
  const squashX = 1 - velNorm * 0.28;

  // 3D pitch & yaw entrance snap
  const tiltX = (1 - rev.springVal) * 26;
  const tiltY = Math.sin(dt * 8) * (1 - clamp(dt / 0.5, 0, 1)) * 8;

  // Continuous Lissajous figure-8 secondary motion after reveal so nothing ever sits static
  const settleMix = clamp((dt - 0.32) / 0.55, 0, 1);
  const floatX = Math.cos(t * 1.65 + at * 2.1) * (floatAmp * 0.55) * settleMix;
  const floatY = Math.sin(t * 2.35 + at * 1.9) * floatAmp * settleMix;
  const breatheScale = 1 + Math.cos(t * 2.05 + at * 1.3) * 0.006 * settleMix;
  const subtleYaw = Math.sin(t * 1.45 + at) * 1.4 * settleMix;

  const scaleX = (rev.scale * breatheScale * squashX).toFixed(4);
  const scaleY = (rev.scale * breatheScale * stretchY).toFixed(4);

  // Chromatic RGB split during high-velocity spring entrance
  const chromaOffset = velNorm > 0.03 ? (velNorm * 18).toFixed(1) : "0";
  const filterParts: string[] = [];
  if (rev.blurPx > 0.2) {
    filterParts.push(`blur(${rev.blurPx.toFixed(2)}px)`);
  }
  if (velNorm > 0.035) {
    filterParts.push(
      `drop-shadow(0px -${chromaOffset}px 0px rgba(248,203,70,0.45)) drop-shadow(0px ${chromaOffset}px 0px rgba(226,55,68,0.45))`
    );
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: rev.opacity,
        transform: `perspective(1100px) translate3d(${floatX.toFixed(
          2
        )}px, ${(rev.yPx + floatY).toFixed(
          2
        )}px, 0) scale3d(${scaleX}, ${scaleY}, 1) rotateX(${tiltX.toFixed(
          2
        )}deg) rotateY(${(tiltY + subtleYaw).toFixed(2)}deg)`,
        filter: filterParts.length > 0 ? filterParts.join(" ") : undefined,
        willChange: "transform, opacity, filter",
      }}
    >
      {children}
    </div>
  );
};

export const AmbientMotionField: React.FC<{
  t: number;
  darkMix: number;
  accentColor?: string;
}> = ({ t, darkMix, accentColor = "#F8CB46" }) => {
  const strokeCol =
    darkMix > 0.5 ? "rgba(255,255,255,0.08)" : "rgba(24,24,27,0.075)";
  const nodes = [
    { bx: 220, by: 250, sx: 28, sy: 22, phase: 0.4 },
    { bx: 1700, by: 240, sx: -28, sy: 24, phase: 1.7 },
    { bx: 195, by: 790, sx: 24, sy: -26, phase: 3.1 },
    { bx: 1725, by: 810, sx: -24, sy: -22, phase: 4.5 },
    { bx: 500, by: 185, sx: 18, sy: 18, phase: 2.2 },
    { bx: 1420, by: 865, sx: -20, sy: 18, phase: 5.3 },
  ];

  // Dual moving telemetry scanlines
  const scanY1 = ((t * 78) % 1080).toFixed(1);
  const scanX1 = ((t * 110) % 1920).toFixed(1);

  // Kinetic diagonal velocity streams in background
  const streams = [
    { y: 160, speed: 240, len: 180, phase: 120 },
    { y: 380, speed: 310, len: 240, phase: 840 },
    { y: 710, speed: 280, len: 210, phase: 420 },
    { y: 920, speed: 220, len: 160, phase: 1350 },
  ];

  return (
    <svg
      viewBox="0 0 1920 1080"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 4 }}
    >
      {/* Horizontal & Vertical Drifting Telemetry Grid Lines */}
      <line
        x1={0}
        y1={scanY1}
        x2={1920}
        y2={scanY1}
        stroke={accentColor}
        strokeOpacity={darkMix > 0.5 ? 0.085 : 0.1}
        strokeWidth={1.5}
        strokeDasharray="16 24"
      />
      <line
        x1={scanX1}
        y1={0}
        x2={scanX1}
        y2={1080}
        stroke={accentColor}
        strokeOpacity={darkMix > 0.5 ? 0.06 : 0.07}
        strokeWidth={1.2}
        strokeDasharray="10 28"
      />

      {/* Kinetic Data Streams */}
      {streams.map((st, i) => {
        const xPos = ((t * st.speed + st.phase) % (1920 + st.len)) - st.len;
        return (
          <line
            key={`stream-${i}`}
            x1={xPos}
            y1={st.y}
            x2={xPos + st.len}
            y2={st.y}
            stroke={i % 2 === 0 ? accentColor : "#10B981"}
            strokeOpacity={darkMix > 0.5 ? 0.14 : 0.16}
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}

      {/* Parallax Floating Precision Crosshairs */}
      {nodes.map((n, idx) => {
        const x = n.bx + Math.sin(t * 0.95 + n.phase) * n.sx;
        const y = n.by + Math.cos(t * 0.82 + n.phase) * n.sy;
        const rot = (t * 18 * (idx % 2 === 0 ? 1 : -1) + idx * 45) % 360;
        return (
          <g
            key={idx}
            transform={`translate(${x.toFixed(1)} ${y.toFixed(
              1
            )}) rotate(${rot.toFixed(1)})`}
          >
            <line
              x1={-12}
              y1={0}
              x2={12}
              y2={0}
              stroke={strokeCol}
              strokeWidth={1.8}
            />
            <line
              x1={0}
              y1={-12}
              x2={0}
              y2={12}
              stroke={strokeCol}
              strokeWidth={1.8}
            />
            <circle
              cx={0}
              cy={0}
              r={20}
              fill="none"
              stroke={accentColor}
              strokeOpacity={0.18}
              strokeWidth={1.2}
              strokeDasharray="6 8"
            />
          </g>
        );
      })}
    </svg>
  );
};

/**
 * After Effects Directional Whip-Pan & Cut Speed-Lines Overlay
 * Fires deterministically during scene transitions
 */
export const WhipTransitionOverlay: React.FC<{
  t: number;
  transitionType: string;
  beatStart: number;
}> = ({ t, transitionType, beatStart }) => {
  const dt = t - beatStart;
  if (dt < -0.18 || dt > 0.34 || transitionType === "none") return null;

  const env = Math.sin(clamp((dt + 0.18) / 0.52, 0, 1) * Math.PI);
  if (env <= 0.02) return null;

  const isVertical =
    transitionType === "whip-up" || transitionType === "whip-down";

  return (
    <svg
      viewBox="0 0 1920 1080"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 42, opacity: env * 0.72 }}
    >
      {Array.from({ length: 10 }, (_, idx) => {
        const frac = (idx + 0.5) / 10;
        const col =
          idx % 3 === 0 ? "#F8CB46" : idx % 3 === 1 ? "#10B981" : "#E23744";
        if (isVertical) {
          const x = frac * 1920;
          const yOffset = ((dt * 2400 + idx * 190) % 1080);
          return (
            <line
              key={idx}
              x1={x}
              y1={yOffset - 220}
              x2={x}
              y2={yOffset + 220}
              stroke={col}
              strokeWidth={idx % 2 === 0 ? 5 : 2.5}
              strokeLinecap="round"
              strokeOpacity={0.65}
            />
          );
        }
        const y = frac * 1080;
        const xOffset = ((dt * 3200 + idx * 240) % 1920);
        return (
          <line
            key={idx}
            x1={xOffset - 320}
            y1={y}
            x2={xOffset + 320}
            y2={y}
            stroke={col}
            strokeWidth={idx % 2 === 0 ? 5 : 2.5}
            strokeLinecap="round"
            strokeOpacity={0.65}
          />
        );
      })}
    </svg>
  );
};

/**
 * Broadcast Acoustic Waveform & Frame Telemetry HUD along the top/bottom frame edges
 */
export const BroadcastTelemetryHUD: React.FC<{
  t: number;
  darkMix: number;
  beatId: string;
  chapter: number;
}> = ({ t, darkMix, beatId, chapter }) => {
  const fgCol = darkMix > 0.5 ? "rgba(244,244,245,0.48)" : "rgba(24,24,27,0.45)";
  const accent = "#F8CB46";
  const frameNum = Math.floor(t * 30);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between px-12 py-4"
      style={{ zIndex: 35 }}
    >
      {/* Top Micro Broadcast Strip */}
      <div
        className="flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.22em] uppercase"
        style={{ color: fgCol }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: "#10B981",
              transform: `scale(${(0.85 + Math.sin(t * 8) * 0.25).toFixed(2)})`,
            }}
          />
          <span>CH.{String(chapter).padStart(2, "0")} // {beatId}</span>
        </div>

        {/* Deterministic 18-Bar Voice Activity Equalizer */}
        <div className="flex items-center gap-1 h-4">
          {Array.from({ length: 18 }, (_, i) => {
            const wave =
              0.25 +
              0.45 * Math.abs(Math.sin(t * 9.5 + i * 0.65)) +
              0.3 * Math.abs(Math.cos(t * 14.2 - i * 0.4));
            const hPx = Math.round(clamp(wave * 15, 3, 15));
            return (
              <div
                key={i}
                style={{
                  width: 2.5,
                  height: hPx,
                  borderRadius: 2,
                  backgroundColor: i % 4 === 0 ? accent : fgCol,
                }}
              />
            );
          })}
        </div>

        <div className="tabular-nums">
          FRM {String(frameNum).padStart(5, "0")} · T+{t.toFixed(2)}S
        </div>
      </div>
    </div>
  );
};

export interface RadarStencilProps {
  t: number;
  enterAt: number;
  cx?: number;
  cy?: number;
  baseRadius?: number;
  accentColor?: string;
  darkTheme?: boolean;
}

export const RadarStencil: React.FC<RadarStencilProps> = ({
  t,
  enterAt,
  cx = 960,
  cy = 515,
  baseRadius = 265,
  accentColor = "#F8CB46",
  darkTheme = false,
}) => {
  const dt = t - enterAt;
  if (dt <= 0) return null;

  const sp = springODE(dt, 15.5, 0.76).value;
  const r1 = Math.max(10, baseRadius * sp);
  const r2 = Math.max(10, baseRadius * 1.28 * sp);
  const r3 = Math.max(10, baseRadius * 0.76 * sp);
  const rot1 = (t * 18.5) % 360;
  const rot2 = (-t * 14.2) % 360;
  const sweepAngle = (t * 64) % 360;
  const baseStroke = darkTheme
    ? "rgba(255,255,255,0.18)"
    : "rgba(24,24,27,0.16)";
  const opacity = clamp(dt / 0.4, 0, 1);

  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <g style={{ opacity }}>
      <circle
        cx={cx}
        cy={cy}
        r={r2 + Math.sin(t * 4.2) * 9}
        fill="none"
        stroke={accentColor}
        strokeOpacity={darkTheme ? 0.18 : 0.24}
        strokeWidth={1.8}
      />

      <circle
        cx={cx}
        cy={cy}
        r={r2}
        fill="none"
        stroke={baseStroke}
        strokeWidth={1.8}
        strokeDasharray="8 14"
        transform={`rotate(${rot1.toFixed(2)} ${cx} ${cy})`}
      />

      <g transform={`rotate(${(rot1 * 0.5).toFixed(2)} ${cx} ${cy})`}>
        {ticks.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * (r1 - 6);
          const y1 = cy + Math.sin(rad) * (r1 - 6);
          const x2 = cx + Math.cos(rad) * (r1 + (deg % 45 === 0 ? 14 : 6));
          const y2 = cy + Math.sin(rad) * (r1 + (deg % 45 === 0 ? 14 : 6));
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={deg % 45 === 0 ? accentColor : baseStroke}
              strokeWidth={deg % 45 === 0 ? 2.4 : 1.3}
              strokeOpacity={deg % 45 === 0 ? 0.75 : 0.45}
            />
          );
        })}
      </g>

      <circle
        cx={cx}
        cy={cy}
        r={r1}
        fill="none"
        stroke={accentColor}
        strokeOpacity={darkTheme ? 0.5 : 0.6}
        strokeWidth={2.6}
        strokeDasharray="28 18 6 18"
        transform={`rotate(${rot2.toFixed(2)} ${cx} ${cy})`}
      />

      <g transform={`rotate(${sweepAngle.toFixed(1)} ${cx} ${cy})`}>
        <line
          x1={cx}
          y1={cy}
          x2={cx + r2}
          y2={cy}
          stroke={accentColor}
          strokeOpacity={0.42}
          strokeWidth={2.2}
        />
        <circle cx={cx + r1} cy={cy} r={5} fill={accentColor} />
      </g>

      <circle
        cx={cx}
        cy={cy}
        r={r3}
        fill="none"
        stroke={baseStroke}
        strokeWidth={1.5}
      />
    </g>
  );
};

export interface TrajectoryRibbonProps {
  spline: ArcLengthSpline;
  t: number;
  startAt: number;
  duration: number;
  color?: string;
  strokeWidth?: number;
  glow?: boolean;
  dashed?: boolean;
  opacity?: number;
}

export const TrajectoryRibbon: React.FC<TrajectoryRibbonProps> = ({
  spline,
  t,
  startAt,
  duration,
  color = "#F8CB46",
  strokeWidth = 6,
  glow = true,
  dashed = false,
  opacity = 1,
}) => {
  const p = windowProgress(t, startAt, duration);
  if (p <= 0) return null;
  const eased = AE_SNAP(p);
  const offset = spline.totalLength * (1 - eased);
  const tip = sampleArcLengthSpline(spline, eased);
  const pulseR = strokeWidth * 1.5 + Math.sin(t * 7.2) * 3.5;

  return (
    <g style={{ opacity }}>
      {glow && (
        <path
          d={spline.svgPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 3.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.25}
          strokeDasharray={spline.totalLength}
          strokeDashoffset={offset}
        />
      )}
      <path
        d={spline.svgPath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "12 12" : spline.totalLength}
        strokeDashoffset={dashed ? -t * 54 : offset}
      />
      {!dashed && eased > 0.12 && (
        <path
          d={spline.svgPath}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={Math.max(2.2, strokeWidth * 0.38)}
          strokeLinecap="round"
          strokeOpacity={0.62}
          strokeDasharray="18 58"
          strokeDashoffset={-t * 165}
        />
      )}
      {!dashed && eased > 0.02 && eased < 0.99 && (
        <g>
          <circle
            cx={tip.x}
            cy={tip.y}
            r={pulseR * 2.0}
            fill={color}
            fillOpacity={0.32}
          />
          <circle
            cx={tip.x}
            cy={tip.y}
            r={pulseR}
            fill="#FFFFFF"
            stroke={color}
            strokeWidth={3.5}
          />
        </g>
      )}
    </g>
  );
};

export interface ContactShadowProps {
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  strength?: number;
  darkTheme?: boolean;
}

export const ContactShadow: React.FC<ContactShadowProps> = ({
  cx = 960,
  cy = 720,
  rx = 185,
  ry = 28,
  strength = 0.28,
  darkTheme = false,
}) => {
  if (strength <= 0.01) return null;
  const gradId = `contact-shadow-${Math.round(cx)}-${Math.round(cy)}-${
    darkTheme ? "d" : "l"
  }`;
  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor={darkTheme ? "#000000" : "#18181B"}
            stopOpacity={strength}
          />
          <stop
            offset="65%"
            stopColor={darkTheme ? "#000000" : "#18181B"}
            stopOpacity={strength * 0.35}
          />
          <stop
            offset="100%"
            stopColor={darkTheme ? "#000000" : "#18181B"}
            stopOpacity={0}
          />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${gradId})`} />
    </g>
  );
};

export const CornerDepthAccents: React.FC<{
  t: number;
  darkMix: number;
  accentColor?: string;
}> = ({ t, darkMix, accentColor = "#F8CB46" }) => {
  const driftX = Math.sin(t * 0.75) * 32;
  const driftY = Math.cos(t * 0.62) * 26;
  const borderCol =
    darkMix > 0.5 ? "rgba(255,255,255,0.08)" : "rgba(24,24,27,0.08)";

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 30 }}
    >
      <div
        style={{
          position: "absolute",
          top: -65 + driftY,
          left: -65 + driftX,
          width: 250,
          height: 250,
          borderRadius: 52,
          border: `3px solid ${borderCol}`,
          filter: "blur(5px)",
          transform: `rotate(${(t * 5.2) % 360}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80 - driftY,
          right: -80 - driftX,
          width: 290,
          height: 290,
          borderRadius: "9999px",
          border: `4px solid ${accentColor}`,
          opacity: darkMix > 0.5 ? 0.16 : 0.2,
          filter: "blur(7px)",
        }}
      />
    </div>
  );
};

export interface EditorialStampProps {
  t: number;
  at: number;
  label: string;
  color?: string;
  rotateDeg?: number;
  className?: string;
}

export const EditorialStamp: React.FC<EditorialStampProps> = ({
  t,
  at,
  label,
  color = "#E23744",
  rotateDeg = -8,
  className = "",
}) => {
  const dt = t - at;
  if (dt <= 0) return null;

  const sp = springODE(dt, 25, 0.58).value;
  const scale = lerp(2.05, 1.0, sp);
  const opacity = clamp(dt / 0.12, 0, 1);
  const blur = Math.max(0, (1 - clamp(dt / 0.16, 0, 1)) * 7);

  return (
    <div
      className={`inline-flex items-center justify-center border-[4px] px-5 py-1.5 font-mono text-[20px] font-extrabold uppercase tracking-[0.22em] select-none ${className}`}
      style={{
        borderColor: color,
        color,
        backgroundColor: "rgba(9, 9, 11, 0.92)",
        opacity,
        transform: `rotate(${rotateDeg}deg) scale(${scale.toFixed(4)})`,
        filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined,
        boxShadow: `0 12px 32px -6px rgba(0,0,0,0.55), 0 0 24px ${color}44`,
      }}
    >
      {label}
    </div>
  );
};

export interface BrandMedallionProps {
  t: number;
  name: string;
  sublabel?: string;
  colorSrc: string;
  monoSrc: string;
  enterAt: number;
  drainAt?: number;
  stampText?: string;
  isHero?: boolean;
  highlightColor?: string;
  sizePx?: number;
  darkTheme?: boolean;
}

/**
 * Transparent Floating Cut-Out Brand Logo Medallion:
 * Zero boxy card background! The die-cut PNG logo floats directly in space with an
 * alpha-contour drop-shadow and an orbiting SVG telemetry reticle ring.
 */
export const BrandMedallion: React.FC<BrandMedallionProps> = ({
  t,
  name,
  sublabel,
  colorSrc,
  monoSrc,
  enterAt,
  drainAt,
  stampText = "COLLAPSED",
  isHero = false,
  highlightColor = "#F8CB46",
  sizePx = 164,
  darkTheme = false,
}) => {
  const rev = computeReveal(t, enterAt, {
    dur: 0.55,
    distancePx: 48,
    scaleFrom: 0.82,
    omega0: 21.5,
    zeta: 0.68,
  });

  if (rev.opacity <= 0.002) return null;

  const drainFrac =
    drainAt !== undefined ? AE_SNAP(windowProgress(t, drainAt, 0.55)) : 0;
  const sagY = drainFrac * 22;
  const drainScale = lerp(1.0, 0.86, drainFrac);
  const colorOpacity = 1 - drainFrac;
  const monoOpacity = drainFrac * 0.58;

  const effectiveSize = isHero ? Math.round(sizePx * 1.18) : sizePx;
  const hoverFloat =
    drainFrac < 0.1
      ? Math.sin(t * 2.6 + enterAt * 1.7) * (isHero ? 6.5 : 4.2)
      : 0;
  const hoverRotY =
    drainFrac < 0.1 ? Math.cos(t * 2.1 + enterAt) * (isHero ? 7.5 : 4.5) : 0;
  const ringRot = (t * (isHero ? 26 : 16) + enterAt * 20) % 360;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        opacity: rev.opacity,
        transform: `perspective(900px) translate3d(0, ${(
          rev.yPx +
          sagY +
          hoverFloat
        ).toFixed(1)}px, 0) scale(${(rev.scale * drainScale).toFixed(
          4
        )}) rotateY(${hoverRotY.toFixed(2)}deg)`,
        filter: rev.blurPx > 0.2 ? `blur(${rev.blurPx.toFixed(1)}px)` : undefined,
      }}
    >
      {/* Transparent Floating Cut-Out Logo Container (No solid background!) */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: effectiveSize,
          height: effectiveSize,
        }}
      >
        {/* Orbiting SVG Reticle Ring (No fill, purely transparent!) */}
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <circle
            cx={100}
            cy={100}
            r={92}
            fill="none"
            stroke={isHero ? highlightColor : darkTheme ? "#52525B" : "#A1A1AA"}
            strokeOpacity={isHero ? 0.65 : 0.32}
            strokeWidth={isHero ? 3 : 1.8}
            strokeDasharray={isHero ? "26 14 8 14" : "10 14"}
            transform={`rotate(${ringRot.toFixed(1)} 100 100)`}
          />
          {isHero && (
            <circle
              cx={100}
              cy={100}
              r={82}
              fill="none"
              stroke={highlightColor}
              strokeOpacity={0.28}
              strokeWidth={1.5}
              strokeDasharray="6 10"
              transform={`rotate(${(-ringRot * 1.3).toFixed(1)} 100 100)`}
            />
          )}
        </svg>

        <img
          src={colorSrc}
          alt={name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-contain p-2"
          style={{
            opacity: colorOpacity,
            filter: isHero
              ? `drop-shadow(0 14px 24px rgba(0,0,0,0.45)) drop-shadow(0 0 18px ${highlightColor}66)`
              : "drop-shadow(0 12px 20px rgba(0,0,0,0.38))",
          }}
        />
        <img
          src={monoSrc}
          alt={`${name} monochrome`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-contain p-2"
          style={{
            opacity: monoOpacity,
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.45))",
          }}
        />

        {/* Diagonal crimson elimination X-slash */}
        {drainFrac > 0.02 && (
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <line
              x1="14"
              y1="14"
              x2={14 + 72 * drainFrac}
              y2={14 + 72 * drainFrac}
              stroke="#E23744"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            {drainFrac > 0.35 && (
              <line
                x1="86"
                y1="14"
                x2={86 - 72 * clamp((drainFrac - 0.35) / 0.65, 0, 1)}
                y2={14 + 72 * clamp((drainFrac - 0.35) / 0.65, 0, 1)}
                stroke="#E23744"
                strokeWidth="4.5"
                strokeOpacity="0.65"
                strokeLinecap="round"
              />
            )}
          </svg>
        )}
      </div>

      {/* Stamp Slam 0.12s after drainAt */}
      {drainAt !== undefined && t >= drainAt + 0.12 && (
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2">
          <EditorialStamp
            t={t}
            at={drainAt + 0.12}
            label={stampText}
            color="#E23744"
            rotateDeg={-11}
          />
        </div>
      )}

      <div
        className="mt-2.5 text-center font-mono text-[15px] font-bold uppercase tracking-[0.18em]"
        style={{
          color: isHero
            ? highlightColor
            : drainFrac > 0.5
            ? "#71717A"
            : darkTheme
            ? "#E4E4E7"
            : "#27272A",
        }}
      >
        {name}
      </div>
      {sublabel && (
        <div
          className="mt-0.5 text-center font-mono text-[12px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: darkTheme ? "#A1A1AA" : "#71717A" }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};
