"use client";

import React from "react";
import {
  AE_SNAP,
  ArcLengthSpline,
  clamp,
  computeReveal,
  lerp,
  sampleArcLengthSpline,
  springODE,
} from "@/lib/kinematics";

export const KineticBlock: React.FC<{
  t: number;
  at: number;
  className?: string;
  style?: React.CSSProperties;
  distancePx?: number;
  maxBlurPx?: number;
  omega0?: number;
  zeta?: number;
  scaleFrom?: number;
  originCenter?: boolean;
  children: React.ReactNode;
}> = ({
  t,
  at,
  className = "",
  style,
  distancePx = 32,
  maxBlurPx = 10,
  omega0 = 18.5,
  zeta = 0.80,
  scaleFrom = 0.95,
  originCenter = true,
  children,
}) => {
  const r = computeReveal(t, at, { distancePx, maxBlurPx, omega0, zeta, scaleFrom });
  if (r.opacity <= 0.004) return null;
  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: r.opacity,
        transform: `translate3d(0px, ${r.yPx.toFixed(2)}px, 0px) scale(${r.scale.toFixed(4)})`,
        filter: r.blurPx > 0.12 ? `blur(${r.blurPx.toFixed(2)}px)` : "none",
        transformOrigin: originCenter ? "center center" : "left center",
      }}
    >
      {children}
    </div>
  );
};

export const RadarStencil: React.FC<{
  cx: number;
  cy: number;
  radius: number;
  t: number;
  triggerAt: number;
  dark: boolean;
  accent?: string;
}> = ({ cx, cy, radius, t, triggerAt, dark, accent }) => {
  const dt = t - triggerAt;
  if (dt <= 0) return null;
  const sp = springODE(dt, 14.5, 0.8).value;
  const op = clamp(dt / 0.35, 0, 1);
  const r = radius * lerp(0.72, 1.0, sp);
  const rotDeg = t * 11.5;
  const strokeMain = accent || (dark ? "rgba(244, 244, 246, 0.48)" : "rgba(15, 15, 20, 0.52)");
  const strokeSub = dark ? "rgba(244, 244, 246, 0.15)" : "rgba(15, 15, 20, 0.13)";

  return (
    <g opacity={op}>
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.94}
        fill={dark ? "rgba(255,255,255,0.028)" : "rgba(0,0,0,0.024)"}
      />
      <g transform={`translate(${cx}, ${cy}) rotate(${(-rotDeg * 0.55).toFixed(2)})`}>
        <circle cx={0} cy={0} r={r + 26} fill="none" stroke={strokeSub} strokeWidth={1} />
        {[0, 90, 180, 270].map((ang) => (
          <line
            key={ang}
            x1={0}
            y1={-(r + 20)}
            x2={0}
            y2={-(r + 34)}
            stroke={strokeMain}
            strokeWidth={1.6}
            transform={`rotate(${ang})`}
          />
        ))}
      </g>
      <g transform={`translate(${cx}, ${cy}) rotate(${rotDeg.toFixed(2)})`}>
        <circle
          cx={0}
          cy={0}
          r={r}
          fill="none"
          stroke={strokeMain}
          strokeWidth={2.2}
          strokeDasharray="10 9"
        />
      </g>
    </g>
  );
};

export const TrajectoryRibbon: React.FC<{
  spline: ArcLengthSpline;
  progress: number;
  dark: boolean;
  color?: string;
  thick?: boolean;
}> = ({ spline, progress, dark, color, thick = false }) => {
  const p = clamp(progress, 0, 1);
  if (p <= 0.004) return null;
  const eased = AE_SNAP(p);
  const sample = sampleArcLengthSpline(spline, eased);
  const dashOffset = spline.totalLength * (1.0 - eased);

  const ribbonColor = color
    ? `${color}1C`
    : dark
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(12, 12, 16, 0.07)";
  const coreColor = color || (dark ? "#FAFAFA" : "#0A0A0D");

  return (
    <g>
      <path
        d={spline.svgPath}
        fill="none"
        stroke={ribbonColor}
        strokeWidth={thick ? 28 : 22}
        strokeLinecap="round"
        strokeDasharray={spline.totalLength}
        strokeDashoffset={dashOffset}
      />
      <path
        d={spline.svgPath}
        fill="none"
        stroke={coreColor}
        strokeWidth={thick ? 3.4 : 2.5}
        strokeLinecap="round"
        strokeDasharray={spline.totalLength}
        strokeDashoffset={dashOffset}
      />
      <g transform={`translate(${sample.x.toFixed(1)}, ${sample.y.toFixed(1)})`}>
        <circle cx={0} cy={0} r={12} fill="none" stroke={coreColor} strokeWidth={1.6} opacity={0.45} />
        <circle cx={0} cy={0} r={4.8} fill={coreColor} />
      </g>
    </g>
  );
};

export const ContactShadow: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  dark: boolean;
}> = ({ cx, cy, rx, ry, dark }) => (
  <ellipse
    cx={cx}
    cy={cy}
    rx={rx}
    ry={ry}
    fill={dark ? "rgba(0,0,0,0.72)" : "rgba(12,12,18,0.18)"}
    style={{ filter: "blur(24px)" }}
  />
);

export const CornerDepthAccents: React.FC<{
  t: number;
  dark: boolean;
}> = ({ t, dark }) => {
  const stroke = dark ? "rgba(255,255,255,0.18)" : "rgba(10,10,14,0.17)";
  const subFill = dark ? "rgba(255,255,255,0.035)" : "rgba(10,10,14,0.04)";
  const driftX = Math.sin(t * 0.55) * 16;
  const driftY = Math.cos(t * 0.48) * 14;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="1920"
      height="1080"
      style={{ filter: "blur(5px)", zIndex: 30 }}
    >
      <g transform={`translate(${(-48 + driftX).toFixed(1)}, ${(-48 + driftY).toFixed(1)}) rotate(${(t * 7).toFixed(1)})`}>
        <circle cx={0} cy={0} r={150} fill={subFill} stroke={stroke} strokeWidth={1.8} />
        <circle cx={0} cy={0} r={122} fill="none" stroke={stroke} strokeWidth={1.1} strokeDasharray="8 6" />
        <line x1={-150} y1={0} x2={150} y2={0} stroke={stroke} strokeWidth={1} />
        <line x1={0} y1={-150} x2={0} y2={150} stroke={stroke} strokeWidth={1} />
      </g>
      <g transform={`translate(${(1950 - driftX).toFixed(1)}, ${(1108 - driftY).toFixed(1)}) rotate(${(-18 - t * 5.5).toFixed(1)})`}>
        <rect x={-135} y={-100} width={270} height={200} rx={18} fill={subFill} stroke={stroke} strokeWidth={1.8} />
        <rect x={-92} y={-65} width={184} height={130} rx={8} fill="none" stroke={stroke} strokeWidth={1.2} />
      </g>
    </svg>
  );
};

export const EditorialStamp: React.FC<{
  label: string;
  color: string;
  angleDeg: number;
  t: number;
  triggerAt: number;
}> = ({ label, color, angleDeg, t, triggerAt }) => {
  const dt = t - triggerAt;
  if (dt <= 0) return null;
  const sp = springODE(dt, 24.0, 0.62).value;
  const scale = lerp(2.1, 1.0, clamp(sp, 0, 1.25));
  const op = clamp(dt / 0.07, 0, 1);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
      style={{
        opacity: op,
        transform: `rotate(${angleDeg}deg) scale(${scale.toFixed(3)})`,
      }}
    >
      <div
        className="px-4 py-1.5 border-[3px] font-mono font-black text-[15px] tracking-[0.18em] uppercase whitespace-nowrap"
        style={{
          borderColor: color,
          color: color,
          backgroundColor: "rgba(9, 9, 11, 0.92)",
          boxShadow: `0 8px 28px rgba(0,0,0,0.65)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const BrandMedallion: React.FC<{
  name: string;
  sublabel: string;
  colorSrc: string;
  monoSrc: string;
  t: number;
  enterAt: number;
  drainAt?: number; // undefined = stays full color forever
  stampLabel?: string;
  stampColor?: string;
  stampAngle?: number;
  sizePx?: number;
  darkStage?: boolean;
  lightTileBehind?: boolean;
  highlightColor?: string;
}> = ({
  name,
  sublabel,
  colorSrc,
  monoSrc,
  t,
  enterAt,
  drainAt,
  stampLabel,
  stampColor = "#E23744",
  stampAngle = -11,
  sizePx = 118,
  darkStage = false,
  lightTileBehind = false,
  highlightColor,
}) => {
  const rev = computeReveal(t, enterAt, { distancePx: 30, maxBlurPx: 9, omega0: 19, zeta: 0.78, scaleFrom: 0.88 });
  if (rev.opacity <= 0.004) return null;

  const drainFrac =
    drainAt !== undefined && t >= drainAt
      ? AE_SNAP(clamp((t - drainAt) / 0.55, 0, 1))
      : 0;

  const sagY = drainFrac * 18.0;
  const shrink = lerp(1.0, 0.90, drainFrac);
  const floatY = (1.0 - drainFrac) * Math.sin(t * 1.9 + enterAt) * 4.5;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        opacity: rev.opacity,
        transform: `translate3d(0px, ${(rev.yPx + sagY + floatY).toFixed(2)}px, 0px) scale(${(rev.scale * shrink).toFixed(4)})`,
        filter: rev.blurPx > 0.12 ? `blur(${rev.blurPx.toFixed(2)}px)` : "none",
      }}
    >
      <div
        className="relative flex items-center justify-center rounded-[28px]"
        style={{
          width: `${sizePx}px`,
          height: `${sizePx}px`,
          backgroundColor: lightTileBehind
            ? drainFrac > 0.5
              ? "rgba(39,39,42,0.55)"
              : "#FFFFFF"
            : highlightColor
              ? `${highlightColor}15`
              : darkStage
                ? "rgba(255,255,255,0.05)"
                : "rgba(9,9,11,0.03)",
          border: highlightColor
            ? `2.5px solid ${highlightColor}`
            : darkStage
              ? `1px solid rgba(255,255,255,${lerp(0.18, 0.07, drainFrac).toFixed(2)})`
              : "1px solid rgba(9,9,11,0.10)",
          boxShadow: highlightColor
            ? `0 0 42px ${highlightColor}44, 0 18px 36px rgba(0,0,0,0.22)`
            : darkStage
              ? "0 18px 36px rgba(0,0,0,0.45)"
              : "0 16px 34px rgba(9,9,11,0.10)",
        }}
      >
        {/* Full-color official brand emblem */}
        <img
          src={colorSrc}
          alt={name}
          className="object-contain rounded-[20px]"
          style={{
            width: `${Math.round(sizePx * 0.78)}px`,
            height: `${Math.round(sizePx * 0.78)}px`,
            opacity: 1.0 - drainFrac,
          }}
        />
        {/* Rec.709 Desaturated B&W emblem crossfading in smoothly */}
        {drainFrac > 0.005 && (
          <img
            src={monoSrc}
            alt={`${name} monochrome`}
            className="absolute object-contain rounded-[20px]"
            style={{
              width: `${Math.round(sizePx * 0.78)}px`,
              height: `${Math.round(sizePx * 0.78)}px`,
              opacity: drainFrac * 0.46,
            }}
          />
        )}

        {/* Diagonal crimson elimination slash */}
        {drainFrac > 0.05 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <line
              x1={14}
              y1={86}
              x2={14 + 72 * drainFrac}
              y2={86 - 72 * drainFrac}
              stroke={stampColor}
              strokeWidth={3.2}
              strokeLinecap="round"
            />
          </svg>
        )}

        {stampLabel && drainAt !== undefined && (
          <EditorialStamp
            label={stampLabel}
            color={stampColor}
            angleDeg={stampAngle}
            t={t}
            triggerAt={drainAt + 0.12}
          />
        )}
      </div>

      <div
        className="mt-4 text-[22px] font-black tracking-[-0.03em] uppercase"
        style={{
          color: darkStage
            ? drainFrac > 0.5
              ? "#71717A"
              : "#FAFAFA"
            : drainFrac > 0.5
              ? "#A1A1AA"
              : "#09090B",
        }}
      >
        {name}
      </div>
      <div
        className="font-mono text-[13px] tracking-[0.16em] uppercase mt-0.5 font-semibold"
        style={{
          color: highlightColor
            ? highlightColor
            : darkStage
              ? drainFrac > 0.5
                ? "#52525B"
                : "#A1A1AA"
              : "#52525B",
        }}
      >
        {sublabel}
      </div>
    </div>
  );
};

export function formatIndianCrore(val: number): string {
  const n = Math.round(val);
  return n.toLocaleString("en-IN");
}
