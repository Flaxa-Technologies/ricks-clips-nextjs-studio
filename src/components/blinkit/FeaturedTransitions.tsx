import React from "react";
import {
  AE_DRAMATIC,
  AE_OVERSHOOT,
  AE_SNAP,
  buildArcLengthSpline,
  clamp,
  cubicBezier,
  cubicBezierVelocity,
  lerp,
  Point2D,
  sampleArcLengthSpline,
  springODE,
  windowProgress,
} from "../../lib/kinematics";

/* ============================================================================
 * 1. BALL & TAPERED LINE SPLINE ANIMATION (Ref: Motion Nations 7LW5mRTvNcY @ 00:10)
 *    - Pure arc-length cubic Bezier spline traversal
 *    - Staggered head/tail parameters create velocity-dependent tapered comet tail
 *    - Horizontal pass acts as a laser clip-path wipe revealing typography
 *    - Ends with a radial iris expansion transitioning Dark Mode -> Light Paper Mode
 * ============================================================================ */

const COMET_CURVE_DARK: Point2D[] = [
  { x: 960, y: 1120 },
  { x: 960, y: 680 },
  { x: 540, y: 540 },
  { x: 420, y: 540 },
];

const COMET_CURVE_SWEEP: Point2D[] = [
  { x: 420, y: 540 },
  { x: 780, y: 540 },
  { x: 1140, y: 540 },
  { x: 1520, y: 540 },
];

const COMET_CURVE_ARC_OUT: Point2D[] = [
  { x: 1520, y: 540 },
  { x: 1680, y: 400 },
  { x: 1320, y: 180 },
  { x: 960, y: 540 },
];

const COMET_CURVE_LIGHT: Point2D[] = [
  { x: 960, y: 540 },
  { x: 620, y: 220 },
  { x: 480, y: 820 },
  { x: 1460, y: 540 },
];

const SPLINE_DARK_IN = buildArcLengthSpline(COMET_CURVE_DARK, 120);
const SPLINE_SWEEP = buildArcLengthSpline(COMET_CURVE_SWEEP, 120);
const SPLINE_ARC_OUT = buildArcLengthSpline(COMET_CURVE_ARC_OUT, 120);
const SPLINE_LIGHT = buildArcLengthSpline(COMET_CURVE_LIGHT, 120);

export interface BallSplineCometProps {
  /** Local time within this transition/beat (0 to 4.0s) */
  localT: number;
  primaryText?: string;
  secondaryText?: string;
  accentColor?: string;
}

export const BallSplineCometTransition: React.FC<BallSplineCometProps> = ({
  localT,
  primaryText = "DEMANDS CREATIVITY",
  secondaryText = "THE RABBIT FILES",
  accentColor = "#a3e635",
}) => {
  // Phase 1 (0.0s - 1.0s): Ball rises from bottom in an S-curve and snaps to left of text
  // Phase 2 (1.0s - 2.0s): Ball zips horizontally across center, laser-unmasking primaryText
  // Phase 3 (2.0s - 2.85s): Ball sweeps in a grand neon green arc back to center (960, 540)
  // Phase 4 (2.85s - 4.0s): Radial iris bursts into Light Studio Paper Mode with black ink ball & trail

  const irisProgress = AE_SNAP(windowProgress(localT, 2.75, 0.65));
  const irisRadius = lerp(0, 1280, irisProgress);

  const renderTaperedTrail = (
    spline: ReturnType<typeof buildArcLengthSpline>,
    sHead: number,
    sTail: number,
    colorStart: string,
    colorEnd: string,
    ballColor: string,
    glow: boolean
  ) => {
    const steps = 28;
    const span = Math.max(0.001, sHead - sTail);
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const u = clamp(sTail + (span * i) / steps, 0, 1);
      return { u, ...sampleArcLengthSpline(spline, u) };
    });

    const headPt = sampleArcLengthSpline(spline, clamp(sHead, 0, 1));

    return (
      <g>
        {pts.slice(0, -1).map((p, idx) => {
          const next = pts[idx + 1];
          const frac = (idx + 1) / steps; // 0 at tail, 1 at head
          const width = Math.pow(frac, 1.55) * 7.5;
          const alpha = Math.pow(frac, 1.25);
          return (
            <line
              key={idx}
              x1={p.x.toFixed(1)}
              y1={p.y.toFixed(1)}
              x2={next.x.toFixed(1)}
              y2={next.y.toFixed(1)}
              stroke={frac > 0.5 ? colorEnd : colorStart}
              strokeWidth={width.toFixed(2)}
              strokeLinecap="round"
              opacity={alpha.toFixed(3)}
            />
          );
        })}
        {glow && (
          <circle
            cx={headPt.x.toFixed(1)}
            cy={headPt.y.toFixed(1)}
            r={22}
            fill={colorEnd}
            opacity={0.28}
            style={{ filter: "blur(10px)" }}
          />
        )}
        <circle
          cx={headPt.x.toFixed(1)}
          cy={headPt.y.toFixed(1)}
          r={10.5}
          fill={ballColor}
        />
      </g>
    );
  };

  // Compute active dark-world spline state
  let activeSpline = SPLINE_DARK_IN;
  let sHead = 0;
  let sTail = 0;
  let cStart = "#a855f7";
  let cEnd = "#38bdf8";

  if (localT < 1.0) {
    const pHead = cubicBezier(windowProgress(localT, 0.05, 0.85), 0.16, 1, 0.3, 1);
    const pTail = cubicBezier(windowProgress(localT, 0.2, 0.78), 0.4, 0, 0.2, 1);
    activeSpline = SPLINE_DARK_IN;
    sHead = pHead;
    sTail = pTail;
    cStart = "#ec4899";
    cEnd = "#38bdf8";
  } else if (localT < 1.95) {
    const pHead = cubicBezier(windowProgress(localT, 1.0, 0.72), 0.16, 1, 0.3, 1);
    const pTail = cubicBezier(windowProgress(localT, 1.12, 0.75), 0.4, 0, 0.2, 1);
    activeSpline = SPLINE_SWEEP;
    sHead = pHead;
    sTail = pTail;
    cStart = "#38bdf8";
    cEnd = "#facc15";
  } else {
    const pHead = cubicBezier(windowProgress(localT, 1.95, 0.82), 0.16, 1, 0.3, 1);
    const pTail = cubicBezier(windowProgress(localT, 2.08, 0.75), 0.4, 0, 0.2, 1);
    activeSpline = SPLINE_ARC_OUT;
    sHead = pHead;
    sTail = pTail;
    cStart = "#facc15";
    cEnd = accentColor;
  }

  // Text laser reveal progress during Phase 2
  const textSweep = AE_SNAP(windowProgress(localT, 1.04, 0.65));
  const textClipRight = ((1 - textSweep) * 100).toFixed(1);

  // Light mode ball & tapered black ink trail (00:10s aesthetic)
  const lightHead = cubicBezier(windowProgress(localT, 2.88, 0.95), 0.16, 1, 0.3, 1);
  const lightTail = cubicBezier(windowProgress(localT, 3.02, 0.88), 0.4, 0, 0.2, 1);
  const lightTextRev = AE_SNAP(windowProgress(localT, 3.15, 0.55));

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden select-none">
      {/* DARK WORLD LAYER */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, #171923 0%, #090a0f 75%)",
        }}
      >
        {/* Subtle ambient glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 60% 35%, rgba(163,230,53,0.14), transparent 55%)",
          }}
        />

        {/* Laser-Unmasked Primary Headline */}
        {localT >= 1.0 && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: `inset(0 ${textClipRight}% 0 0)`,
              transform: `translate3d(${lerp(0, -140, AE_SNAP(windowProgress(localT, 1.95, 0.7))).toFixed(1)}px, 0, 0)`,
            }}
          >
            <div className="text-[46px] font-bold tracking-[0.28em] text-white uppercase font-mono">
              {primaryText}
            </div>
          </div>
        )}

        {/* Secondary caption revealed on arc sweep */}
        {localT >= 2.05 && (
          <div
            className="absolute left-[1120px] top-[320px]"
            style={{
              opacity: AE_SNAP(windowProgress(localT, 2.05, 0.45)),
              transform: `translate3d(0, ${lerp(24, 0, AE_SNAP(windowProgress(localT, 2.05, 0.45))).toFixed(1)}px, 0)`,
            }}
          >
            <div className="text-[28px] font-bold tracking-[0.24em] text-[#a3e635] uppercase">
              {secondaryText}
            </div>
          </div>
        )}

        <svg className="absolute inset-0 w-full h-full">
          {renderTaperedTrail(activeSpline, sHead, sTail, cStart, cEnd, "#ffffff", true)}
        </svg>
      </div>

      {/* LIGHT PAPER WORLD LAYER (Clipped by expanding Radial Iris at 00:10s) */}
      {irisProgress > 0.001 && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #f8fafc 0%, #e2e8f0 100%)",
            clipPath: `circle(${irisRadius.toFixed(1)}px at 960px 540px)`,
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: `inset(0 ${((1 - lightTextRev) * 100).toFixed(1)}% 0 0)`,
            }}
          >
            <div className="text-[52px] font-black tracking-[0.32em] text-zinc-900 uppercase">
              MINIMALISM IN MOTION
            </div>
          </div>

          <svg className="absolute inset-0 w-full h-full">
            {renderTaperedTrail(
              SPLINE_LIGHT,
              lightHead,
              lightTail,
              "#3f3f46",
              "#09090b",
              "#09090b",
              false
            )}
          </svg>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 2. FOUNDER EMPIRE ORBIT & 3D COIN DIAL RIG (Ref: Pooya Taher DLND-0I2FmM)
 *    - Staggered Kinetic Header + Morphing Subtitle ("isn't just a CEO" -> "he's an empire")
 *    - Monochrome Founder Cutout rising in front of parallax city silhouette
 *    - True 3D Depth-Sorted Elliptical Orbit Ring (Back Pass behind torso, Front Pass in front)
 *    - Transitions into 3D Extruded Coin Flip + Radial Perimeter Brand Dial
 * ============================================================================ */

export interface EmpireBrandItem {
  name: string;
  logoUrl?: string;
  accent: string;
  metric: string;
}

export interface FounderEmpireRigProps {
  localT: number;
  founderName?: string;
  founderImage?: string;
  brands?: EmpireBrandItem[];
}

export const FounderEmpireOrbitRig: React.FC<FounderEmpireRigProps> = ({
  localT,
  founderName = "DEEPINDER GOYAL",
  founderImage = "/images/person_deepinder_goyal_mono.png",
  brands = [
    { name: "Zomato", logoUrl: "/images/03_zomato_logo_color.png", accent: "#E23744", metric: "Food Delivery" },
    { name: "Blinkit", logoUrl: "/images/01_blinkit_logo_color.png", accent: "#F8CB46", metric: "10-Min Quick Commerce" },
    { name: "Hyperpure", logoUrl: "/images/09_eternal_logo_color.png", accent: "#22c55e", metric: "B2B Supply Chain" },
    { name: "District", logoUrl: "/images/03_zomato_logo_color.png", accent: "#8b5cf6", metric: "Going-Out & Live" },
  ],
}) => {
  // Part A (0.0s - 2.1s): Founder Cutout + 3D Orbiting Green Nodes
  // Part B (2.1s - 4.0s): Camera zooms into 3D Flipping Coin Medallion + Radial Arc Dial
  const coinTransition = AE_SNAP(windowProgress(localT, 2.0, 0.55));

  // Header entrance
  const leftWord = AE_SNAP(windowProgress(localT, 0.05, 0.45));
  const rightWord = AE_SNAP(windowProgress(localT, 0.18, 0.45));
  const subSwap = windowProgress(localT, 0.95, 0.35);

  // Founder cutout rise
  const founderRise = springODE(Math.max(0, localT - 0.35), 18, 0.72).value;

  // 3D Orbit Nodes math: x = R_x * cos(theta), y = R_y * sin(theta), z = sin(theta)
  const orbitNodes = [0, 1, 2, 3, 4, 5].map((idx) => {
    const angle = localT * 2.6 + (idx * Math.PI * 2) / 6;
    const rx = 310;
    const ry = 82;
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    const z = Math.sin(angle); // -1 is behind torso, +1 is in front of torso
    const scale = lerp(0.62, 1.28, (z + 1) * 0.5);
    return { idx, x, y, z, scale };
  });

  // Coin Flip & Radial Dial Math (Part B: 2.0s -> 4.0s)
  const dialTime = Math.max(0, localT - 2.1);
  const activeBrandIdx = clamp(Math.floor(dialTime / 0.45), 0, brands.length - 1);
  const activeBrand = brands[activeBrandIdx];
  const flipPhase = (dialTime % 0.45) / 0.45;
  const coinRotY = cubicBezier(flipPhase, 0.22, 1, 0.36, 1) * 180;

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #ffffff 0%, #e4e4e7 68%, #d4d4d8 100%)",
      }}
    >
      {/* PART A: FOUNDER & 3D ORBITING RING */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 1 - coinTransition,
          transform: `scale(${lerp(1, 1.45, coinTransition).toFixed(3)})`,
          filter: coinTransition > 0.05 ? `blur(${(coinTransition * 14).toFixed(1)}px)` : undefined,
        }}
      >
        {/* Staggered Kinetic Header */}
        <div className="absolute top-[110px] inset-x-0 flex flex-col items-center">
          <div className="flex items-center gap-6 text-[84px] font-black tracking-tight text-zinc-800 leading-none">
            <span
              style={{
                opacity: leftWord,
                transform: `translate3d(${lerp(-90, 0, leftWord).toFixed(1)}px, 0, 0)`,
              }}
            >
              {founderName.split(" ")[0]}
            </span>
            <span
              style={{
                opacity: rightWord,
                transform: `translate3d(${lerp(90, 0, rightWord).toFixed(1)}px, ${lerp(28, 0, rightWord).toFixed(1)}px, 0)`,
              }}
            >
              {founderName.split(" ").slice(1).join(" ")}
            </span>
          </div>

          {/* Morphing Subtitle */}
          <div className="relative mt-4 h-[44px] w-[600px] flex items-center justify-center">
            <span
              className="absolute text-[32px] font-medium text-zinc-600"
              style={{
                opacity: clamp(1 - subSwap * 2, 0, 1) * rightWord,
                transform: `translate3d(0, ${lerp(0, -18, subSwap).toFixed(1)}px, 0)`,
              }}
            >
              isn&apos;t just a CEO
            </span>
            <span
              className="absolute text-[32px] font-bold text-zinc-900"
              style={{
                opacity: clamp((subSwap - 0.3) * 1.5, 0, 1),
                transform: `translate3d(0, ${lerp(18, 0, AE_SNAP(subSwap)).toFixed(1)}px, 0)`,
              }}
            >
              he&apos;s a <span className="text-emerald-600 underline decoration-4">business empire</span>
            </span>
          </div>
        </div>

        {/* Monochrome City Skyline Silhouette Behind Founder */}
        <div
          className="absolute inset-x-0 bottom-[180px] flex justify-center items-end gap-3 opacity-25"
          style={{
            transform: `translate3d(0, ${lerp(120, 0, founderRise).toFixed(1)}px, 0)`,
          }}
        >
          {[180, 290, 420, 340, 490, 380, 440, 310, 220].map((h, i) => (
            <div
              key={i}
              className="w-[68px] rounded-t-sm bg-gradient-to-b from-zinc-700 to-transparent"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* BACK HALF OF 3D ORBIT RING (z < 0, behind founder) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <g transform={`translate(960, ${lerp(950, 680, founderRise).toFixed(1)})`}>
            <path
              d="M -310 0 A 310 82 0 0 1 310 0"
              fill="none"
              stroke="#18181b"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              opacity={0.45}
            />
            {orbitNodes
              .filter((n) => n.z < 0)
              .map((n) => (
                <circle
                  key={n.idx}
                  cx={n.x.toFixed(1)}
                  cy={n.y.toFixed(1)}
                  r={(18 * n.scale).toFixed(1)}
                  fill="#84cc16"
                  opacity={0.55}
                  style={{ filter: "blur(3px)" }}
                />
              ))}
          </g>
        </svg>

        {/* FOUNDER MONOCHROME CUTOUT (Middle Layer) */}
        <div
          className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none"
          style={{
            transform: `translate3d(0, ${lerp(560, 40, founderRise).toFixed(1)}px, 0)`,
          }}
        >
          <img
            src={founderImage}
            alt={founderName}
            className="w-[540px] h-[680px] object-cover object-top drop-shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
            style={{ filter: "grayscale(100%) contrast(1.15)" }}
          />
        </div>

        {/* FRONT HALF OF 3D ORBIT RING (z >= 0, in front of founder!) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <g transform={`translate(960, ${lerp(950, 680, founderRise).toFixed(1)})`}>
            <path
              d="M -310 0 A 310 82 0 0 0 310 0"
              fill="none"
              stroke="#18181b"
              strokeWidth="3.5"
            />
            {orbitNodes
              .filter((n) => n.z >= 0)
              .map((n) => (
                <g key={n.idx} transform={`translate(${n.x.toFixed(1)}, ${n.y.toFixed(1)})`}>
                  <circle
                    r={(26 * n.scale).toFixed(1)}
                    fill="#a3e635"
                    opacity={0.35}
                    style={{ filter: "blur(8px)" }}
                  />
                  <circle
                    r={(18 * n.scale).toFixed(1)}
                    fill="#a3e635"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                </g>
              ))}
          </g>
        </svg>
      </div>

      {/* PART B: 3D EXTRUDED COIN FLIP & RADIAL PERIMETER BRAND DIAL */}
      {coinTransition > 0.01 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: coinTransition,
            transform: `scale(${lerp(0.72, 1, coinTransition).toFixed(3)})`,
          }}
        >
          {/* Radial Perimeter Arc Gauge & Brand Labels */}
          <svg className="absolute inset-0 w-full h-full">
            <g transform="translate(960, 560)">
              {/* Outer fine dial arc */}
              <path
                d="M -320 40 A 320 320 0 1 1 320 40"
                fill="none"
                stroke="#d4d4d8"
                strokeWidth="3"
              />
              {/* Active swept arc */}
              <path
                d="M -320 40 A 320 320 0 1 1 320 40"
                fill="none"
                stroke="#18181b"
                strokeWidth="4"
                strokeDasharray="1100"
                strokeDashoffset={(1100 * (1 - (activeBrandIdx + 1) / brands.length)).toFixed(1)}
              />

              {brands.map((b, i) => {
                const deg = lerp(-155, -25, i / Math.max(1, brands.length - 1));
                const rad = (deg * Math.PI) / 180;
                const lx = Math.cos(rad) * 410;
                const ly = Math.sin(rad) * 390;
                const tx = Math.cos(rad) * 320;
                const ty = Math.sin(rad) * 320;
                const isReached = i <= activeBrandIdx;
                const isCurrent = i === activeBrandIdx;

                return (
                  <g key={b.name}>
                    <circle
                      cx={tx.toFixed(1)}
                      cy={ty.toFixed(1)}
                      r={isCurrent ? 9 : 5}
                      fill={isReached ? "#18181b" : "#a1a1aa"}
                    />
                    <text
                      x={lx.toFixed(1)}
                      y={ly.toFixed(1)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isCurrent ? "#09090b" : isReached ? "#3f3f46" : "#a1a1aa"}
                      fontSize={isCurrent ? "32" : "24"}
                      fontWeight={isCurrent ? "900" : "600"}
                    >
                      {b.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* 3D Extruded Medallion Coin */}
          <div
            className="relative w-[360px] h-[360px] rounded-full bg-white flex flex-col items-center justify-center"
            style={{
              marginTop: "40px",
              transform: `perspective(1000px) rotateY(${(coinRotY % 180 > 90 ? coinRotY - 180 : coinRotY).toFixed(1)}deg)`,
              boxShadow:
                "0 28px 60px rgba(0,0,0,0.16), -14px 0 0 #e4e4e7, 0 0 0 12px rgba(255,255,255,0.65)",
              border: `4px solid ${activeBrand.accent}`,
            }}
          >
            {activeBrand.logoUrl ? (
              <img
                src={activeBrand.logoUrl}
                alt={activeBrand.name}
                className="w-[170px] h-[170px] object-contain"
              />
            ) : (
              <div className="text-[54px] font-black text-zinc-900">
                {activeBrand.name}
              </div>
            )}
            <div
              className="mt-4 px-5 py-1.5 rounded-full text-[16px] font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: activeBrand.accent }}
            >
              {activeBrand.metric}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 3. GEOMETRIC MATCH-CUT MORPH TRANSITION (Vox / Johnny Harris Signature)
 *    - Scene A: Financial Donut Ring Chart (46% Market Share)
 *    - Morphs continuously in position, radius, and stroke-dasharray into:
 *    - Scene B: Tactical Radar Target Reticle locking onto a Dark Store hub
 * ============================================================================ */

export const MatchCutMorphTransition: React.FC<{ localT: number }> = ({
  localT,
}) => {
  // 0.0s - 1.6s: Market Share Ring Chart on Light Grid
  // 1.6s - 2.4s: Match-Cut Morph! Ring stays centered while background cross-wipes & ring transforms into Radar Reticle
  // 2.4s - 4.0s: Tactical Dark Store Telemetry Lock-On
  const morph = cubicBezier(windowProgress(localT, 1.5, 0.85), 0.22, 1, 0.36, 1);
  const ringScale = lerp(1.0, 1.28, morph);
  const ringRot = lerp(-90, 135, morph);

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden select-none">
      {/* SCENE A BACKGROUND (Light Financial Editorial) */}
      <div
        className="absolute inset-0 flex items-center justify-between px-[180px]"
        style={{
          background: "#f8fafc",
          opacity: 1 - morph,
          transform: `scale(${lerp(1, 1.15, morph).toFixed(3)})`,
        }}
      >
        <div className="max-w-[520px]">
          <div className="text-[18px] font-mono font-bold uppercase tracking-[0.25em] text-amber-600">
            SCENE A // MARKET SHARE DOMINANCE
          </div>
          <div className="mt-3 text-[64px] font-black leading-[1.05] text-zinc-900">
            46% OF INDIA&apos;S QUICK COMMERCE
          </div>
          <div className="mt-4 text-[22px] text-zinc-600 font-medium">
            Notice how the central ring geometry anchors the viewer&apos;s eye across the scene cut.
          </div>
        </div>
        <div className="w-[420px] text-right">
          <div className="text-[84px] font-black text-zinc-900">₹37,779 Cr</div>
          <div className="text-[20px] font-mono uppercase tracking-widest text-zinc-500">
            ANNUALIZED GOV RUN-RATE
          </div>
        </div>
      </div>

      {/* SCENE B BACKGROUND (Dark Tactical Radar Lock-On) */}
      <div
        className="absolute inset-0 flex items-center justify-between px-[180px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)",
          opacity: morph,
          transform: `scale(${lerp(0.88, 1, morph).toFixed(3)})`,
        }}
      >
        <div className="max-w-[520px]">
          <div className="text-[18px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-400">
            SCENE B // GEOMETRIC MATCH-CUT LOCK
          </div>
          <div className="mt-3 text-[64px] font-black leading-[1.05] text-white">
            1.5 KM DARK STORE RADIUS
          </div>
          <div className="mt-4 text-[22px] text-zinc-400 font-medium">
            The exact same circle seamlessly becomes a geospatial radar perimeter without breaking visual flow.
          </div>
        </div>
        <div className="w-[420px] text-right">
          <div className="text-[84px] font-black text-emerald-400">85 SEC</div>
          <div className="text-[20px] font-mono uppercase tracking-widest text-zinc-400">
            ALGORITHMIC PICK &amp; PACK TIME
          </div>
        </div>
      </div>

      {/* PERSISTENT MATCH-CUT HERO RING (Shared across both scenes!) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          width="560"
          height="560"
          viewBox="-280 -280 560 560"
          style={{
            transform: `scale(${ringScale.toFixed(3)}) rotate(${ringRot.toFixed(1)}deg)`,
          }}
        >
          {/* Base Ring */}
          <circle
            r="165"
            fill="none"
            stroke={morph < 0.5 ? "#e2e8f0" : "rgba(16,185,129,0.22)"}
            strokeWidth={lerp(36, 4, morph).toFixed(1)}
          />
          {/* Morphing Primary Arc */}
          <circle
            r="165"
            fill="none"
            stroke={morph < 0.5 ? "#F8CB46" : "#10b981"}
            strokeWidth={lerp(36, 8, morph).toFixed(1)}
            strokeDasharray={morph < 0.5 ? "480 1040" : "80 40 80 40 80 40"}
            strokeLinecap="round"
          />
          {/* Radar Crosshairs & Pulse Rings that emerge during Scene B */}
          {morph > 0.1 && (
            <g opacity={morph.toFixed(2)}>
              <circle
                r={lerp(60, 220, (localT * 1.4) % 1).toFixed(1)}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                opacity={(1 - ((localT * 1.4) % 1)).toFixed(2)}
              />
              <line x1="-210" y1="0" x2="210" y2="0" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 6" />
              <line x1="0" y1="-210" x2="0" y2="210" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle r="14" fill="#10b981" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. 3D ARCHIVAL NEWSPAPER & NEON HIGHLIGHTER RIG (Vox / MagnatesMedia Style)
 *    - 3D perspective camera push onto an archival financial press clipping
 *    - Depth-of-field rack focus (blur -> sharp)
 *    - Multiply-blend neon marker sweeps across the key investigative quote
 * ============================================================================ */

export const NewspaperMicrofilmHighlighter: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const camIn = cubicBezier(windowProgress(localT, 0.0, 1.1), 0.16, 1, 0.3, 1);
  const highlightSweep = AE_SNAP(windowProgress(localT, 1.05, 0.85));
  const calloutPop = springODE(Math.max(0, localT - 1.85), 22, 0.68).value;

  const rotX = lerp(28, 11, camIn);
  const rotY = lerp(-22, -7, camIn);
  const rotZ = lerp(-6, -1.5, camIn);
  const scale = lerp(0.84, 1.06, camIn);
  const dofBlur = lerp(9, 0, AE_SNAP(windowProgress(localT, 0.0, 0.65)));

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden flex items-center justify-center select-none"
      style={{
        background: "radial-gradient(circle at 50% 50%, #1e2028 0%, #090a0f 100%)",
      }}
    >
      {/* 3D Tilted Financial Broadsheet Dossier */}
      <div
        className="relative w-[1260px] h-[760px] rounded-xl bg-[#f7f4eb] text-zinc-900 p-14 shadow-[0_40px_100px_rgba(0,0,0,0.75)] border border-stone-300"
        style={{
          transform: `perspective(1300px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
          filter: dofBlur > 0.2 ? `blur(${dofBlur.toFixed(1)}px)` : undefined,
        }}
      >
        {/* Broadsheet Masthead */}
        <div className="border-b-4 border-zinc-900 pb-4 flex justify-between items-end">
          <div>
            <div className="text-[15px] font-mono uppercase tracking-[0.25em] text-zinc-500">
              ARCHIVAL FINANCIAL DOSSIER // EQUITY RESEARCH REPORT
            </div>
            <div className="text-[48px] font-serif font-black tracking-tight leading-none mt-1">
              THE WALL STREET CHRONICLE
            </div>
          </div>
          <div className="text-right font-mono text-[16px] text-zinc-600">
            <div>JUNE 24, 2022 · VOL. CXIV</div>
            <div className="font-bold text-red-700">MARKET ALERT: DOWNGRADE</div>
          </div>
        </div>

        {/* Columns + Highlighted Headline */}
        <div className="mt-8 grid grid-cols-12 gap-8">
          <div className="col-span-8 pr-6 border-r border-stone-300">
            <div className="text-[42px] font-serif font-black leading-[1.12] text-zinc-900">
              Analysts Warn 10-Minute Grocery Delivery Is{" "}
              <span className="relative inline-block">
                <span
                  className="absolute inset-y-1 left-0 bg-[#fde047] -z-0 rounded-sm"
                  style={{
                    width: `${(highlightSweep * 100).toFixed(1)}%`,
                    mixBlendMode: "multiply",
                  }}
                />
                <span className="relative z-10 px-1">
                  &ldquo;An Unprofitable Suicide Mission&rdquo;
                </span>
              </span>{" "}
              As Cash Burn Tops ₹100 Per Bag
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6 text-[18px] leading-relaxed text-zinc-700 font-serif">
              <p>
                Institutional investors reacted sharply on Tuesday after internal
                unit-economics filings revealed heavy fulfillment losses across urban
                micro-warehouses in Gurugram, Bengaluru, and Mumbai.
              </p>
              <p>
                Without high-margin assortment expansion or advertising yield,
                brokerage desks project existing treasury reserves will deplete within
                fourteen weeks.
              </p>
            </div>
          </div>

          {/* Right Archival Sidebar Chart */}
          <div className="col-span-4 flex flex-col justify-between bg-stone-200/70 p-6 rounded-lg border border-stone-300">
            <div>
              <div className="text-[14px] font-mono font-bold uppercase tracking-widest text-zinc-600">
                EXHIBIT 4B · CONTRIBUTION MARGIN
              </div>
              <div className="mt-2 text-[52px] font-black text-red-600 font-mono">
                -₹105.40
              </div>
              <div className="text-[15px] font-medium text-zinc-600">
                Net loss per order prior to dark-store density optimization (FY22)
              </div>
            </div>
            <div className="h-[140px] flex items-end gap-3 pt-6 border-t border-stone-300">
              {[85, 72, 64, 48, 30, 92].map((v, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t ${i === 5 ? "bg-emerald-600" : "bg-zinc-800"}`}
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Magnifying Glass Evidence Callout Badge */}
      {calloutPop > 0.01 && (
        <div
          className="absolute right-[150px] bottom-[110px] bg-zinc-950/95 text-white px-8 py-6 rounded-2xl border-2 border-[#fde047] shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
          style={{
            transform: `scale(${calloutPop.toFixed(3)})`,
          }}
        >
          <div className="text-[14px] font-mono uppercase tracking-[0.25em] text-[#fde047]">
            PRIMARY SOURCE VERIFIED
          </div>
          <div className="mt-1 text-[32px] font-black">
            4 Years Later: +₹37,779 Cr Empire
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 5. ISOMETRIC 3D CAMERA MAP FLYOVER (Johnny Harris / fern Geo-Telemetry Rig)
 *    - 3D tilted tactical terrain grid with live camera pan & zoom
 *    - Glowing parabolic supply-chain arcs connecting fulfillment hubs
 * ============================================================================ */

export const Isometric3DCameraMapFlyover: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const flyProgress = cubicBezier(windowProgress(localT, 0.0, 3.2), 0.22, 1, 0.36, 1);
  const arcDraw = AE_SNAP(windowProgress(localT, 0.55, 1.4));

  const camX = lerp(180, -220, flyProgress);
  const camY = lerp(120, -90, flyProgress);
  const camRotZ = lerp(-28, -12, flyProgress);

  const hubs = [
    { x: 480, y: 620, name: "GURUGRAM HUB 01", orders: "4,200/day", color: "#F8CB46" },
    { x: 960, y: 460, name: "SOUTH DELHI NODE", orders: "5,840/day", color: "#38bdf8" },
    { x: 1390, y: 340, name: "NOIDA SECTOR 62", orders: "6,190/day", color: "#a3e635" },
  ];

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 50% 40%, #0f172a 0%, #020617 100%)",
      }}
    >
      {/* Top Geospatial Overlay Title */}
      <div className="absolute top-12 left-16 z-20">
        <div className="text-[16px] font-mono font-bold uppercase tracking-[0.28em] text-sky-400">
          3D GEOSPATIAL TELEMETRY // DARK STORE MESH
        </div>
        <div className="mt-1 text-[54px] font-black text-white tracking-tight">
          1.8 KM HYPERLOCAL FULFILLMENT GRID
        </div>
      </div>

      {/* 3D Isometric World Plane */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `perspective(1200px) rotateX(58deg) rotateZ(${camRotZ.toFixed(2)}deg) translate3d(${camX.toFixed(1)}px, ${camY.toFixed(1)}px, 0) scale(1.22)`,
        }}
      >
        <div
          className="relative w-[1920px] h-[1080px] rounded-3xl border border-sky-500/30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(56,189,248,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.12) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            backgroundColor: "rgba(15,23,42,0.75)",
          }}
        >
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Glowing Supply Chain Arcs */}
            <path
              d="M 480 620 Q 720 260 960 460 T 1390 340"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeDasharray="1200"
              strokeDashoffset={(1200 * (1 - arcDraw)).toFixed(1)}
              strokeLinecap="round"
            />

            {hubs.map((h, i) => {
              const pulse = ((localT * 1.6 + i * 0.35) % 1);
              return (
                <g key={h.name} transform={`translate(${h.x}, ${h.y})`}>
                  <circle
                    r={lerp(20, 130, pulse).toFixed(1)}
                    fill="none"
                    stroke={h.color}
                    strokeWidth="3"
                    opacity={(1 - pulse).toFixed(2)}
                  />
                  <circle r="18" fill={h.color} />
                  <line x1="0" y1="0" x2="0" y2="-110" stroke={h.color} strokeWidth="3" />
                </g>
              );
            })}
          </svg>

          {/* Floating Billboards at each Hub */}
          {hubs.map((h) => (
            <div
              key={h.name}
              className="absolute px-5 py-3 rounded-xl bg-slate-950/95 border border-sky-400/50 text-white shadow-2xl"
              style={{
                left: `${h.x - 110}px`,
                top: `${h.y - 165}px`,
              }}
            >
              <div className="text-[13px] font-mono font-bold text-sky-400">{h.name}</div>
              <div className="text-[24px] font-black">{h.orders}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 6. KINETIC SLOT-MACHINE ODOMETER & SPARKLINE (ColdFusion / Apple Keynote)
 *    - Vertical rolling digit barrels with velocity blur
 *    - Live synchronized area sparkline chart drawing underneath
 * ============================================================================ */

export const KineticSlotMachineOdometer: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const digits = [3, 7, 7, 7, 9];
  const chartProg = AE_SNAP(windowProgress(localT, 0.25, 2.2));

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden flex flex-col items-center justify-center select-none"
      style={{
        background: "radial-gradient(circle at 50% 35%, #18181b 0%, #09090b 100%)",
      }}
    >
      <div className="text-[18px] font-mono font-bold uppercase tracking-[0.3em] text-[#F8CB46]">
        KINETIC FINANCIAL ODOMETER // ROLLING BARREL MATH
      </div>

      {/* Slot Machine Digit Barrels */}
      <div className="mt-6 flex items-center bg-zinc-900/90 border-2 border-zinc-800 rounded-3xl px-12 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
        <span className="text-[118px] font-black text-[#F8CB46] mr-4 leading-none">₹</span>
        {digits.map((targetDigit, idx) => {
          const colProgress = cubicBezier(
            windowProgress(localT, 0.1 + idx * 0.16, 1.45),
            0.16,
            1,
            0.3,
            1
          );
          const colVel = cubicBezierVelocity(
            windowProgress(localT, 0.1 + idx * 0.16, 1.45),
            0.16,
            1,
            0.3,
            1
          );
          const totalSpins = 10 + targetDigit;
          const currentPos = colProgress * totalSpins;
          const blurY = clamp(colVel * 3.5, 0, 12);

          return (
            <React.Fragment key={idx}>
              {idx === 2 && (
                <span className="text-[104px] font-black text-zinc-500 mx-2 leading-none">
                  ,
                </span>
              )}
              <div className="relative w-[92px] h-[132px] overflow-hidden">
                <div
                  style={{
                    transform: `translate3d(0, ${(-currentPos * 132).toFixed(1)}px, 0)`,
                    filter: blurY > 0.4 ? `blur(${blurY.toFixed(1)}px)` : undefined,
                  }}
                >
                  {Array.from({ length: 20 }, (_, n) => (
                    <div
                      key={n}
                      className="h-[132px] flex items-center justify-center text-[118px] font-black text-white font-mono leading-none"
                    >
                      {n % 10}
                    </div>
                  ))}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <span className="text-[84px] font-black text-emerald-400 ml-6 leading-none">
          Cr
        </span>
      </div>

      {/* Synchronized Sparkline Growth Curve Underneath */}
      <div className="mt-10 w-[1080px] h-[220px] bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 160">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <g style={{ clipPath: `inset(0 ${((1 - chartProg) * 100).toFixed(1)}% 0 0)` }}>
            <path
              d="M 0 145 C 220 140, 380 125, 540 90 C 700 55, 840 25, 1000 8 L 1000 160 L 0 160 Z"
              fill="url(#sparkGrad)"
            />
            <path
              d="M 0 145 C 220 140, 380 125, 540 90 C 700 55, 840 25, 1000 8"
              fill="none"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

/* ============================================================================
 * 7. DIAGONAL SHUTTER-SLICE ACT TRANSITION (High-Energy Documentary Wipe)
 *    - 5 diagonal mechanical blades slam shut with staggered 45ms offsets
 *    - Flashes bold kinetic Chapter Title Card, then slices open into next scene
 * ============================================================================ */

export const ShutterSliceWipeTransition: React.FC<{
  localT: number;
  chapterNum?: string;
  chapterTitle?: string;
}> = ({
  localT,
  chapterNum = "CHAPTER IV",
  chapterTitle = "THE ANATOMY OF SPEED",
}) => {
  const blades = [0, 1, 2, 3, 4];

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-zinc-950 select-none">
      {/* Underlying Next Scene Preview */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-zinc-950 to-black">
        <div className="text-center">
          <div className="text-[20px] font-mono tracking-[0.35em] text-emerald-400 uppercase">
            NEXT SCENE REVEALED
          </div>
          <div className="mt-3 text-[76px] font-black text-white">
            SEAMLESS SHUTTER WIPE
          </div>
        </div>
      </div>

      {/* 5 Staggered Diagonal Blades */}
      {blades.map((b) => {
        const enter = AE_SNAP(windowProgress(localT, b * 0.06, 0.48));
        const exit = AE_SNAP(windowProgress(localT, 2.35 + b * 0.06, 0.52));
        const yPct = (1 - enter) * -105 + exit * 105;

        return (
          <div
            key={b}
            className="absolute top-0 bottom-0 bg-[#F8CB46] border-r-2 border-amber-500/40"
            style={{
              left: `${b * 20}%`,
              width: "20.2%",
              transform: `translate3d(0, ${yPct.toFixed(1)}%, 0)`,
            }}
          />
        );
      })}

      {/* Central Chapter Title Lockup while Shutter is Closed */}
      {localT > 0.35 && localT < 2.65 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-zinc-950"
          style={{
            opacity:
              AE_SNAP(windowProgress(localT, 0.38, 0.32)) *
              (1 - AE_SNAP(windowProgress(localT, 2.25, 0.32))),
            transform: `scale(${lerp(
              0.88,
              1.04,
              windowProgress(localT, 0.35, 2.2)
            ).toFixed(3)})`,
          }}
        >
          <div className="px-6 py-2 rounded-full bg-zinc-950 text-[#F8CB46] font-mono text-[18px] font-bold tracking-[0.3em]">
            {chapterNum}
          </div>
          <div className="mt-5 text-[92px] font-black tracking-tight leading-none">
            {chapterTitle}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * MASTER SHOWCASE REEL (24-Second 6-Scene Demo Reel for Preview & Testing)
 * ============================================================================ */

export const TransitionsShowcaseReel: React.FC<{ t: number }> = ({ t }) => {
  const sceneDur = 4.0;
  const sceneIdx = clamp(Math.floor(t / sceneDur), 0, 5);
  const localT = t - sceneIdx * sceneDur;

  const sceneLabels = [
    "01 // BALL & TAPERED SPLINE COMET + RADIAL IRIS WIPE (Motion Nations 00:10s)",
    "02 // FOUNDER 3D ORBIT RING + EXTRUDED COIN RADIAL DIAL (Pooya Taher Short)",
    "03 // GEOMETRIC MATCH-CUT MORPH TRANSITION (Chart Ring -> Radar Reticle)",
    "04 // 3D ARCHIVAL NEWSPAPER + MULTIPLY NEON HIGHLIGHTER SWEEP",
    "05 // ISOMETRIC 3D CAMERA MAP FLYOVER + PARABOLIC SUPPLY ARCS",
    "06 // KINETIC SLOT-MACHINE ODOMETER + DIAGONAL SHUTTER WIPE",
  ];

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-black">
      {sceneIdx === 0 && <BallSplineCometTransition localT={localT} />}
      {sceneIdx === 1 && <FounderEmpireOrbitRig localT={localT} />}
      {sceneIdx === 2 && <MatchCutMorphTransition localT={localT} />}
      {sceneIdx === 3 && <NewspaperMicrofilmHighlighter localT={localT} />}
      {sceneIdx === 4 && <Isometric3DCameraMapFlyover localT={localT} />}
      {sceneIdx === 5 &&
        (localT < 2.2 ? (
          <KineticSlotMachineOdometer localT={localT * 1.4} />
        ) : (
          <ShutterSliceWipeTransition localT={(localT - 2.2) * 1.65} />
        ))}

      {/* Subtle Bottom Showcase Badge */}
      <div className="absolute bottom-6 left-8 z-50 px-5 py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-[14px] tracking-wider">
        {sceneLabels[sceneIdx]}
      </div>
    </div>
  );
};
