import React from "react";
import {
  clamp,
  lerp,
  windowProgress,
  cubicBezier,
  springODE,
  AE_SNAP,
} from "../../lib/kinematics";

/* ============================================================================
 * FEATURED TRANSITIONS & MOTION GRAPHICS — VOLUME 3
 * (MINIMALIST + HEAVY MATHEMATICAL PHYSICS EDITION — MAIN THEME ALIGNED)
 * ----------------------------------------------------------------------------
 * Directly modeled frame-by-frame after Motion Nations & Ordinary Folk:
 *   1. `MinimalOrbitalLetterConvergenceRig` (Motion Nations `HPWzLpHdBJg`)
 *      - Concentric hairline orbits + 20-layer 45° volumetric long shadows
 *      - Scattered orbital letters spiraling inward into centered typography
 *   2. `MinimalDeformingWaveBallRig` (Motion Nations `pQXoGGpCYeg`)
 *      - Rolling sphere on a real-time Gaussian-deforming elastic wave horizon
 *      - Kinetic words popping along the travelling wave crest + Iris flip
 *   3. `MinimalCapsuleLongShadowScannerRig` (Motion Nations `BrYQhw8WmIM`)
 *      - Rounded capsule scanner with 45° volumetric long shadow unmasking text
 *      - Architectural CAD wireframe grid constructing each letter (`X` + circle)
 *   4. `MinimalPolygonWaveToLetterMorphRig` (Motion Nations `CDc1d-8x8lQ`)
 *      - Bouncing geometric primitives (Pentagon, Triangle, Square, Hexagon)
 *        travelling along a sine wave and morphing into letters at the apex
 *   5. `MinimalBauhausPendulumAndSeeSawRig` (Ordinary Folk `EFdAOiNXUKY`)
 *      - Coupled angular see-saw lever physics + split-hemisphere geometric tunnel
 *   6. `MinimalElasticPendulumWaveAndRibbonRig` (Harmonic Pendulum Wave & String)
 *      - 15-sphere harmonic phase wave snapping into a plucked elastic string
 *
 * STRICT PALETTE RULE:
 *   - ZERO BLACK BACKGROUNDS (#000000 / bg-black forbidden).
 *   - Uses our signature Minimalist Daylight Putty (#E5E3DF), Warm Studio Cream
 *     (#F6F3EC), Soft Graphite Slate (#26272B), and Deep Petrol-Sapphire (#092638),
 *     paired with Matte Ink Charcoal (#18181B), Blinkit Gold (#F8CB46), and
 *     Zomato Crimson (#E23744).
 * ============================================================================ */

// Helper to generate a smooth 45-degree volumetric long shadow (Motion Nations style)
function buildLongShadow(
  steps = 22,
  dx = -1.8,
  dy = 2.2,
  alphaStart = 0.14
): string {
  const layers: string[] = [];
  for (let i = 1; i <= steps; i++) {
    const f = 1 - i / (steps + 1);
    const a = (alphaStart * f * f).toFixed(3);
    layers.push(`${(i * dx).toFixed(1)}px ${(i * dy).toFixed(1)}px 0px rgba(24,24,27,${a})`);
  }
  return layers.join(", ");
}

const TEXT_LONG_SHADOW = buildLongShadow(24, -1.7, 2.1, 0.11);

/* ============================================================================
 * 1. MOTION NATIONS ORBITAL LETTER CONVERGENCE RIG (`HPWzLpHdBJg`)
 *    - Warm Matte Studio Putty background (#E4E2DD -> #D2CFC8)
 *    - 4 concentric hairline rings with orbiting black & gold satellite dots
 *    - Each letter of "BLINKIT" / "EMPIRE" starts scattered on a circular orbit
 *      at a tilted angle, casting a 45° volumetric long shadow, and spirals
 *      inward via a damped harmonic spring to lock into two centered rows!
 * ============================================================================ */

const ORBIT_ROW_1 = "BLINKIT".split("");
const ORBIT_ROW_2 = "EMPIRE".split("");

export const MinimalOrbitalLetterConvergenceRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const ringDraw = cubicBezier(windowProgress(localT, 0.0, 1.1), 0.16, 1, 0.3, 1);
  const OutIris = cubicBezier(windowProgress(localT, 3.25, 0.72), 0.7, 0, 0.2, 1);

  const rings = [145, 225, 310, 395];

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #ECEAE5 0%, #DFDCD5 58%, #CCC8BF 100%)",
      }}
    >
      {/* Concentric Hairline Orbit Rings + Orbiting Long-Shadow Dots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {rings.map((r, idx) => {
          const circum = 2 * Math.PI * r;
          const rot = localT * (idx % 2 === 0 ? 28 : -24) + idx * 45;
          const dotAngle = ((rot + idx * 70) * Math.PI) / 180;
          const dx = 960 + Math.cos(dotAngle) * r;
          const dy = 540 + Math.sin(dotAngle) * r;

          return (
            <g key={r}>
              <circle
                cx="960"
                cy="540"
                r={r}
                fill="none"
                stroke="#18181B"
                strokeWidth={idx === 1 ? "1.8" : "1.1"}
                strokeOpacity={0.22 - idx * 0.03}
                strokeDasharray={circum.toFixed(1)}
                strokeDashoffset={(circum * (1 - ringDraw)).toFixed(1)}
                transform={`rotate(${rot.toFixed(1)} 960 540)`}
              />

              {/* Orbiting Satellite Dot with 45-degree Long Shadow Trail */}
              {ringDraw > 0.15 && (
                <g>
                  {Array.from({ length: 14 }).map((_, s) => (
                    <circle
                      key={s}
                      cx={dx - (s + 1) * 2.4}
                      cy={dy + (s + 1) * 3.0}
                      r={idx % 2 === 0 ? 7.5 : 5.5}
                      fill={`rgba(24,24,27,${(0.11 * Math.pow(1 - s / 14, 1.8)).toFixed(3)})`}
                    />
                  ))}
                  <circle
                    cx={dx}
                    cy={dy}
                    r={idx % 2 === 0 ? 8 : 6}
                    fill={idx === 1 ? "#F8CB46" : idx === 2 ? "#E23744" : "#18181B"}
                    stroke="#18181B"
                    strokeWidth="2"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Spiraling Orbital Letters -> Horizontal Center Lock (`mn_circle1_grid.jpg`) */}
      <div className="relative w-full h-full pointer-events-none">
        {[...ORBIT_ROW_1.map((ch, i) => ({ ch, row: 0, i, count: ORBIT_ROW_1.length })),
          ...ORBIT_ROW_2.map((ch, i) => ({ ch, row: 1, i, count: ORBIT_ROW_2.length }))].map(
          (item, globalIdx) => {
            const delay = 0.18 + globalIdx * 0.055;
            const sp = springODE(Math.max(0, localT - delay), 15, 0.72).value;
            const settle = clamp(sp, 0, 1.15);

            // Initial scattered polar coordinates on the concentric rings
            const startRadius = 150 + ((globalIdx * 67) % 210);
            const startAngle =
              ((globalIdx * 137.5 + localT * 35) * Math.PI) / 180;
            const startX = 960 + Math.cos(startAngle) * startRadius;
            const startY = 540 + Math.sin(startAngle) * startRadius;
            const startRot = ((globalIdx % 2 === 0 ? 1 : -1) * 58);

            // Final locked horizontal grid coordinates at center (960, 540)
            const spacing = 74;
            const finalX =
              960 + (item.i - (item.count - 1) / 2) * spacing;
            const finalY = item.row === 0 ? 498 : 586;

            const currX = lerp(startX, finalX, settle);
            const currY = lerp(startY, finalY, settle);
            const currRot = lerp(startRot, 0, settle);
            const alpha = clamp((localT - delay * 0.5) * 4, 0, 1);

            return (
              <div
                key={`${item.row}-${item.i}`}
                className="absolute font-sans font-black text-[68px] leading-none text-[#18181B]"
                style={{
                  left: `${currX.toFixed(1)}px`,
                  top: `${currY.toFixed(1)}px`,
                  opacity: alpha.toFixed(3),
                  transform: `translate(-50%, -50%) rotate(${currRot.toFixed(
                    1
                  )}deg) scale(${lerp(0.55, 1, clamp(settle, 0, 1.2)).toFixed(3)})`,
                  textShadow: TEXT_LONG_SHADOW,
                }}
              >
                {item.ch}
              </div>
            );
          }
        )}
      </div>

      {/* Minimalist Expanding Circle Iris Wipe at End of Scene (`mn_circle1_grid.jpg` Panel 16) */}
      {OutIris > 0.001 && (
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{
            clipPath: `circle(${(OutIris * 1250).toFixed(1)}px at 960px 540px)`,
            background:
              "radial-gradient(circle at 50% 40%, #0E344D 0%, #071D2E 100%)",
          }}
        />
      )}
    </div>
  );
};

/* ============================================================================
 * 2. MOTION NATIONS DEFORMING WAVE HORIZON & ROLLING BALL RIG (`pQXoGGpCYeg`)
 *    - Deep Petrol-Sapphire Teal Canvas (#0E344D -> #071D2E — zero black!)
 *    - Single glowing horizon line that physically bends into a travelling
 *      Gaussian cosine hill & valley directly beneath the rolling sphere
 *    - Minimalist words pop up along the wave crest just ahead of the ball
 *    - Ends with a Radial Circle Iris flip into Warm Studio Alabaster!
 * ============================================================================ */

export const MinimalDeformingWaveBallRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const ballProgress = cubicBezier(
    windowProgress(localT, 0.05, 3.35),
    0.25,
    0.1,
    0.25,
    1.0
  );
  const ballX = lerp(140, 1780, ballProgress);

  // Wave deformation function y(x) driven by ballX
  const evalWaveY = (x: number): number => {
    const dx = x - ballX;
    const env = Math.exp(-(dx * dx) / (2 * 235 * 235));
    const wave = Math.sin(dx / 135 - localT * 2.2) * 86 * env;
    const dip = Math.cos(dx / 95) * 32 * Math.exp(-(dx * dx) / (2 * 120 * 120));
    return 615 + wave + dip;
  };

  // Sample 96 points across 0..1920 for the continuous SVG wave path
  const pts: string[] = [];
  for (let i = 0; i <= 96; i++) {
    const x = (i / 96) * 1920;
    const y = evalWaveY(x);
    pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const wavePathD = pts.join(" ");

  const ballR = 28;
  const ballY = evalWaveY(ballX) - ballR - 3;

  // Words that pop along the wave crest as the ball rolls past (`mn_line1_grid.jpg`)
  const words = [
    { text: "What", x: 380, at: 0.25 },
    { text: "matters", x: 565, at: 0.55 },
    { text: "most", x: 750, at: 0.85 },
    { text: "is", x: 930, at: 1.2 },
    { text: "10-minute", x: 1135, at: 1.55, gold: true },
    { text: "consistency", x: 1410, at: 1.95, gold: true },
    { text: "at scale.", x: 1665, at: 2.35 },
  ];

  const irisOut = cubicBezier(windowProgress(localT, 3.35, 0.62), 0.7, 0, 0.2, 1);

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #123E5C 0%, #0A2538 55%, #061826 100%)",
      }}
    >
      {/* Travelling Wave Line & Glowing Sphere */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="cyanWaveGlow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Secondary Echo Wave */}
        <path
          d={wavePathD}
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeOpacity="0.22"
          transform="translate(0, 18)"
        />

        {/* Main Glowing Cyan-Blue Elastic Horizon Line */}
        <path
          d={wavePathD}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#cyanWaveGlow)"
        />
        <path
          d={wavePathD}
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Minimalist Pure-White Rolling Sphere with Soft Glow */}
        <circle
          cx={ballX}
          cy={ballY}
          r={ballR + 10}
          fill="rgba(255,255,255,0.16)"
        />
        <circle
          cx={ballX}
          cy={ballY}
          r={ballR}
          fill="#FFFFFF"
        />
      </svg>

      {/* Kinetic Words Floating Along the Wave Crest (`mn_line1_grid.jpg`) */}
      {words.map((w, i) => {
        const pop = springODE(Math.max(0, localT - w.at), 18, 0.68).value;
        const wy = evalWaveY(w.x) - 115 - Math.sin(localT * 3 + i) * 6;
        return (
          <div
            key={w.text}
            className="absolute font-sans font-extrabold text-[42px] tracking-tight whitespace-nowrap"
            style={{
              left: `${w.x}px`,
              top: `${wy.toFixed(1)}px`,
              color: w.gold ? "#F8CB46" : "#FFFFFF",
              opacity: clamp(pop * 1.4, 0, 1),
              transform: `translate(-50%, -50%) translateY(${lerp(
                32,
                0,
                pop
              ).toFixed(1)}px) scale(${lerp(0.75, 1, pop).toFixed(3)})`,
              textShadow: "0 10px 25px rgba(6,24,38,0.65)",
            }}
          >
            {w.text}
          </div>
        );
      })}

      {/* Outgoing Circle Iris Wipe Into Warm Studio Alabaster */}
      {irisOut > 0.001 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: `circle(${(irisOut * 1280).toFixed(1)}px at ${ballX.toFixed(
              1
            )}px ${ballY.toFixed(1)}px)`,
            background:
              "radial-gradient(circle at 50% 45%, #EFECE6 0%, #DFDCD4 100%)",
          }}
        />
      )}
    </div>
  );
};

/* ============================================================================
 * 3. MOTION NATIONS CAPSULE LONG-SHADOW SCANNER & CAD WIREFRAME RIG (`BrYQhw8WmIM`)
 *    - Phase A (0.0s - 2.0s): Vertical rounded capsule ring (#E23744) with
 *      45° volumetric long shadow sweeps across center to laser-unmask "BLINKIT"
 *      with matching 45° volumetric letter shadows!
 *    - Phase B (2.0s - 4.0s): Motion Nations Architectural CAD Wireframe Grid
 *      (square + diagonal `X` + inscribed circle) constructs "ETERNAL" / "EMPIRE"
 *      before flood-filling solid ink typography!
 * ============================================================================ */

export const MinimalCapsuleLongShadowScannerRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const pillAppear = springODE(localT, 20, 0.68).value;
  const scanSweep = cubicBezier(
    windowProgress(localT, 0.45, 1.15),
    0.22,
    1,
    0.36,
    1
  );
  const phase2Progress = windowProgress(localT, 1.95, 1.85);
  const wireDraw = cubicBezier(
    windowProgress(localT, 1.95, 0.95),
    0.16,
    1,
    0.3,
    1
  );
  const solidFill = cubicBezier(
    windowProgress(localT, 2.15, 0.7),
    0.22,
    1,
    0.36,
    1
  );

  // Scanner capsule X moves from 580 to 1340
  const pillX = lerp(610, 1310, scanSweep);
  const textClipRight = clamp(((1310 - pillX) / 700) * 100, 0, 100);

  const row1 = "BLINKIT".split("");
  const row2 = "ETERNAL".split("");

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #EFECE6 0%, #E2DFD7 60%, #D2CEC4 100%)",
      }}
    >
      {/* PHASE A: CAPSULE LONG-SHADOW SCANNER (`mn_shape2_grid.jpg` Rows 1 & 2) */}
      {phase2Progress < 0.05 && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Unmasked Bold Condensed Word with 45° Volumetric Long Shadow */}
          <div
            className="text-[148px] font-black tracking-[0.06em] text-[#18181B] font-sans select-none"
            style={{
              clipPath: `inset(-120px ${textClipRight.toFixed(1)}% -120px 0)`,
              textShadow: buildLongShadow(32, -2.1, 2.6, 0.14),
            }}
          >
            BLINKIT
          </div>

          {/* Scanning Red/Gold Rounded Capsule Ring + 45° Volumetric Shadow Trail */}
          {scanSweep < 0.99 && (
            <div
              className="absolute top-1/2 pointer-events-none"
              style={{
                left: `${pillX.toFixed(1)}px`,
                transform: `translate(-50%, -50%) scaleY(${pillAppear.toFixed(3)})`,
              }}
            >
              {/* 26-Layer 45° Volumetric Red/Charcoal Shadow Trail */}
              {Array.from({ length: 26 }).map((_, s) => (
                <div
                  key={s}
                  className="absolute w-[62px] h-[230px] rounded-full border-[14px]"
                  style={{
                    left: `${(-31 - (s + 1) * 2.5).toFixed(1)}px`,
                    top: `${(-115 + (s + 1) * 3.0).toFixed(1)}px`,
                    borderColor: `rgba(226, 55, 68, ${(
                      0.11 * Math.pow(1 - s / 26, 1.85)
                    ).toFixed(3)})`,
                  }}
                />
              ))}
              {/* Active Capsule Ring */}
              <div className="relative -left-[31px] -top-[115px] w-[62px] h-[230px] rounded-full border-[15px] border-[#E23744] bg-transparent shadow-sm" />
            </div>
          )}
        </div>
      )}

      {/* PHASE B: MOTION NATIONS ARCHITECTURAL CAD WIREFRAME CONSTRUCT (`mn_shape2_grid.jpg` Row 3) */}
      {phase2Progress >= 0.05 && (
        <div className="relative flex flex-col items-center gap-6">
          {[row1, row2].map((chars, rIdx) => (
            <div key={rIdx} className="flex items-center gap-3">
              {chars.map((ch, cIdx) => {
                const cellDelay = (rIdx * 7 + cIdx) * 0.035;
                const cellWire = clamp((wireDraw - cellDelay * 0.5) * 1.6, 0, 1);
                const cellFill = clamp((solidFill - cellDelay * 0.5) * 1.8, 0, 1);

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="relative w-[112px] h-[126px] flex items-center justify-center"
                  >
                    {/* Architectural CAD Wireframe Box + Diagonal X + Inscribed Circle */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 112 126"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="108"
                        height="122"
                        fill="none"
                        stroke="#18181B"
                        strokeWidth="1.4"
                        strokeOpacity="0.55"
                        strokeDasharray="460"
                        strokeDashoffset={(460 * (1 - cellWire)).toFixed(1)}
                      />
                      <line
                        x1="2"
                        y1="2"
                        x2="110"
                        y2="124"
                        stroke="#18181B"
                        strokeWidth="1.1"
                        strokeOpacity="0.38"
                        strokeDasharray="165"
                        strokeDashoffset={(165 * (1 - cellWire)).toFixed(1)}
                      />
                      <line
                        x1="110"
                        y1="2"
                        x2="2"
                        y2="124"
                        stroke="#18181B"
                        strokeWidth="1.1"
                        strokeOpacity="0.38"
                        strokeDasharray="165"
                        strokeDashoffset={(165 * (1 - cellWire)).toFixed(1)}
                      />
                      <circle
                        cx="56"
                        cy="63"
                        r="48"
                        fill="none"
                        stroke="#18181B"
                        strokeWidth="1.1"
                        strokeOpacity="0.38"
                        strokeDasharray="305"
                        strokeDashoffset={(305 * (1 - cellWire)).toFixed(1)}
                      />
                    </svg>

                    {/* Solid Flood-Filled Geometric Letter Revealing via Diagonal Slice */}
                    <span
                      className="font-sans font-black text-[104px] leading-none text-[#18181B]"
                      style={{
                        clipPath: `inset(${((1 - cellFill) * 100).toFixed(
                          1
                        )}% 0 0 0)`,
                      }}
                    >
                      {ch}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          <div
            className="mt-3 font-mono text-[15px] font-bold tracking-[0.35em] text-stone-600 uppercase"
            style={{ opacity: solidFill }}
          >
            ARCHITECTURAL CAD WIREFRAME CONSTRUCT
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 4. MOTION NATIONS POLYGON-WAVE-TO-LETTER MORPH RIG (`CDc1d-8x8lQ`)
 *    - Each character starts as a colorful geometric polygon (Pentagon, Triangle,
 *      Square, Hexagon, Diamond, Circle) travelling along a damped sine wave!
 *    - At the crest of its wave, each polygon morphs with a harmonic spring pop
 *      directly into the corresponding letter of "BLINKIT" / "CREATIVE"
 *    - Split/Flip between Soft Matte Graphite (#242529) and Warm Ivory (#EAE8E3)
 * ============================================================================ */

const POLY_SHAPES = [
  { ch: "B", color: "#38BDF8", pts: "28,4 52,20 44,48 12,48 4,20" }, // Pentagon
  { ch: "L", color: "#F8CB46", pts: "28,4 54,50 2,50" }, // Triangle
  { ch: "I", color: "#10B981", pts: "8,8 48,8 48,48 8,48" }, // Square
  { ch: "N", color: "#A855F7", pts: "28,2 52,16 52,40 28,54 4,40 4,16" }, // Hexagon
  { ch: "K", color: "#FB923C", pts: "28,2 54,28 28,54 2,28" }, // Diamond
  { ch: "I", color: "#3B82F6", pts: "28,4 54,50 2,50" }, // Triangle
  { ch: "T", color: "#FACC15", pts: "28,2 52,16 52,40 28,54 4,40 4,16" }, // Circle/Hex
];

export const MinimalPolygonWaveToLetterMorphRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const worldFlip = cubicBezier(
    windowProgress(localT, 2.05, 0.65),
    0.22,
    1,
    0.36,
    1
  );

  const renderWaveMorphStage = (isLightWorld: boolean) => {
    const bg = isLightWorld
      ? "radial-gradient(circle at 50% 45%, #F4F2ED 0%, #E2DFD7 100%)"
      : "radial-gradient(circle at 50% 45%, #2B2D33 0%, #1F2025 100%)";
    const textColor = isLightWorld ? "#18181B" : "#FFFFFF";

    // Restart wave animation cleanly in the light world too so viewer sees both!
    const tStage = isLightWorld ? Math.max(0, localT - 1.95) : localT;

    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: bg }}
      >
        <div className="relative flex items-center gap-6">
          {POLY_SHAPES.map((item, idx) => {
            const charT = Math.max(0, tStage - idx * 0.09);
            const prog = clamp(charT / 1.15, 0, 1);

            // Damped sine-wave rollercoaster height (`mn_shape1_grid.jpg`)
            const waveY =
              -Math.sin(prog * Math.PI * 2) *
              135 *
              Math.pow(1 - prog, 1.35);

            // Morph threshold: polygon when prog < 0.44, letter when prog >= 0.44
            const isLetter = prog >= 0.42;
            const letterPop = isLetter
              ? springODE(Math.max(0, charT - 0.42 * 1.15), 24, 0.62).value
              : 0;
            const polyScale = isLetter
              ? clamp(1 - (prog - 0.42) * 8, 0, 1)
              : springODE(charT, 22, 0.65).value;

            return (
              <div
                key={idx}
                className="relative w-[96px] h-[120px] flex items-center justify-center"
                style={{
                  transform: `translate3d(0, ${waveY.toFixed(1)}px, 0)`,
                }}
              >
                {/* Bouncing Geometric Polygon Primitive */}
                {polyScale > 0.01 && (
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 56 56"
                    className="absolute"
                    style={{
                      transform: `scale(${polyScale.toFixed(3)}) rotate(${(
                        charT * 220
                      ).toFixed(1)}deg)`,
                    }}
                  >
                    {idx === 6 ? (
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill={isLightWorld ? "#18181B" : item.color}
                      />
                    ) : (
                      <polygon
                        points={item.pts}
                        fill={isLightWorld ? "#18181B" : item.color}
                      />
                    )}
                  </svg>
                )}

                {/* Morphed Bold Minimalist Letter */}
                {isLetter && (
                  <span
                    className="font-sans font-black text-[108px] leading-none select-none"
                    style={{
                      color: textColor,
                      transform: `scale(${letterPop.toFixed(3)}) rotate(${lerp(
                        -22,
                        0,
                        clamp(letterPop, 0, 1)
                      ).toFixed(1)}deg)`,
                      textShadow: isLightWorld ? TEXT_LONG_SHADOW : undefined,
                    }}
                  >
                    {item.ch}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden select-none">
      {renderWaveMorphStage(false)}

      {/* Horizontal Split Wipe into Warm Studio Ivory (`mn_shape1_grid.jpg` Right Half) */}
      {worldFlip > 0.001 && (
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 0 0 ${((1 - worldFlip) * 100).toFixed(1)}%)`,
          }}
        >
          {renderWaveMorphStage(true)}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 5. ORDINARY FOLK BAUHAUS SEE-SAW LEVER & SPLIT-HEMISPHERE TUNNEL (`EFdAOiNXUKY`)
 *    - Warm Bauhaus Putty & Cream Canvas (#EFECE6 -> #DCD8CE)
 *    - Coupled angular see-saw lever beam pivoting on a geometric fulcrum
 *    - Rolling matte-charcoal sphere triggers a Split-Hemisphere Circle Tunnel
 * ============================================================================ */

export const MinimalBauhausPendulumAndSeeSawRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const dropProg = cubicBezier(windowProgress(localT, 0.0, 0.55), 0.4, 0, 1, 1);
  const tiltProg = springODE(Math.max(0, localT - 0.52), 14, 0.62).value;
  const rollSlide = cubicBezier(
    windowProgress(localT, 0.55, 1.15),
    0.25,
    0.1,
    0.25,
    1
  );
  const tunnelOpen = cubicBezier(
    windowProgress(localT, 1.75, 1.35),
    0.22,
    1,
    0.36,
    1
  );

  // Beam tilts from -22deg to +22deg when ball impacts
  const beamAngle = lerp(-22, 22, clamp(tiltProg, 0, 1.15));
  // Ball rolls along the 680px beam from x = -260 to x = +260
  const ballBeamX = lerp(-250, 250, rollSlide);
  const dropY = localT < 0.55 ? lerp(-340, -36, dropProg) : -36;

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #F5F3EE 0%, #E5E1D8 65%, #D4CFC3 100%)",
      }}
    >
      {/* Bauhaus Geometric Background Split Planes (`ordinary_folk_grid.jpg`) */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-[#E8E4DB] pointer-events-none"
        style={{
          clipPath: "polygon(0 0, 100% 0, 68% 100%, 0 100%)",
        }}
      />

      {/* PHASE A: BAUHAUS SEE-SAW LEVER & ROLLING SPHERE */}
      <div
        className="relative w-[900px] h-[600px] flex items-center justify-center"
        style={{
          transform: `scale(${lerp(1, 1.45, tunnelOpen).toFixed(3)})`,
          opacity: clamp(1 - (tunnelOpen - 0.55) * 2.5, 0, 1),
        }}
      >
        {/* Central Architectural Fulcrum Block (Ordinary Folk Row 2 Col 4) */}
        <div className="absolute top-[330px] flex items-end">
          <div className="w-[110px] h-[140px] bg-[#D6D2C8] border-2 border-[#18181B]/20 flex items-center justify-center">
            {/* Split-Hemisphere Circle Window Inside Fulcrum */}
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#18181B]"
              style={{
                transform: `rotate(${(localT * 95).toFixed(1)}deg)`,
                background:
                  "linear-gradient(90deg, #18181B 50%, #F8CB46 50%)",
              }}
            />
          </div>
          {/* Right Cast Triangle Shadow */}
          <div
            className="w-[95px] h-[140px] bg-[#9E9B93]"
            style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
          />
        </div>

        {/* Pivoting See-Saw Plank + Rolling Heavy Sphere */}
        <div
          className="absolute top-[330px] w-[680px] h-[26px] bg-[#4A4946] rounded-xs"
          style={{
            transformOrigin: "center center",
            transform: `rotate(${beamAngle.toFixed(2)}deg)`,
            boxShadow: buildLongShadow(18, -1.5, 2.0, 0.12),
          }}
        >
          {/* Rolling Matte-Charcoal & Gold Split Sphere */}
          <div
            className="absolute left-1/2 w-[68px] h-[68px] rounded-full border-3 border-[#18181B]"
            style={{
              top: `${dropY - 34}px`,
              transform: `translate(-50%, 0) translateX(${ballBeamX.toFixed(
                1
              )}px) rotate(${(rollSlide * 540).toFixed(1)}deg)`,
              background:
                "linear-gradient(135deg, #18181B 55%, #F8CB46 55%)",
              boxShadow: "0 14px 28px rgba(24,24,27,0.28)",
            }}
          />
        </div>
      </div>

      {/* PHASE B: ORDINARY FOLK CONCENTRIC SPLIT-HEMISPHERE TUNNEL (`ordinary_folk_grid.jpg` Row 4) */}
      {tunnelOpen > 0.02 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[580, 440, 310, 190].map((size, idx) => {
            const ringScale = springODE(
              Math.max(0, localT - 1.65 - idx * 0.12),
              18,
              0.7
            ).value;
            const rot =
              (idx % 2 === 0 ? 1 : -1) * (localT * 36 + idx * 45);
            return (
              <div
                key={size}
                className="absolute rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: `scale(${ringScale.toFixed(3)}) rotate(${rot.toFixed(
                    1
                  )}deg)`,
                  background:
                    idx % 2 === 0
                      ? "linear-gradient(90deg, #DBD7CE 50%, #B8B3A8 50%)"
                      : "linear-gradient(90deg, #18181B 50%, #F8CB46 50%)",
                }}
              />
            );
          })}

          {/* Center Minimalist Brand Lockup */}
          {tunnelOpen > 0.45 && (
            <div
              className="relative z-20 px-10 py-5 rounded-full bg-[#F6F3EC] border-4 border-[#18181B] shadow-[0_16px_0_#18181B]"
              style={{
                transform: `scale(${springODE(Math.max(0, localT - 2.2), 22, 0.68).value.toFixed(
                  3
                )})`,
              }}
            >
              <span className="font-sans font-black text-[48px] tracking-tight text-[#18181B]">
                blink<span className="text-[#EAB308]">it</span> · 46%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 6. HARMONIC PENDULUM PHASE WAVE -> ELASTIC PLUCKED STRING REVEAL
 *    - Warm Studio Cream Canvas (#F7F4EC -> #E6DFD1)
 *    - 15 minimalist spheres on hairline vertical threads oscillating at
 *      linearly graded frequencies w_k = w_0 + k*dw (Pendulum Wave Helix)
 *    - At t = 1.95s, all 15 spheres snap into a horizontal elastic string that
 *      plucks & rebounds to laser-reveal our clean main-theme metric!
 * ============================================================================ */

export const MinimalElasticPendulumWaveAndRibbonRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const snapToLine = cubicBezier(
    windowProgress(localT, 1.85, 0.55),
    0.22,
    1,
    0.36,
    1
  );
  const pluckTime = Math.max(0, localT - 2.35);
  const textReveal = cubicBezier(
    windowProgress(localT, 2.35, 0.85),
    0.16,
    1,
    0.3,
    1
  );

  // Damped elastic guitar-string standing wave after t = 2.35s
  const pluckAmp =
    pluckTime > 0
      ? 110 * Math.exp(-3.8 * pluckTime) * Math.cos(22 * pluckTime)
      : 0;

  const numNodes = 17;
  const nodes = Array.from({ length: numNodes }).map((_, i) => {
    const frac = i / (numNodes - 1);
    const x = lerp(260, 1660, frac);

    // Phase 1: Harmonic Pendulum Wave y(i, t)
    const freq = 3.2 + i * 0.38;
    const pendulumY = 540 + Math.sin(localT * freq) * 210;

    // Phase 2: Plucked Elastic String standing mode sin(pi * frac)
    const stringY = 540 + Math.sin(frac * Math.PI) * pluckAmp;

    const y = lerp(pendulumY, stringY, snapToLine);
    return { x, y, frac, i };
  });

  const splinePath = nodes
    .map((n, i) => `${i === 0 ? "M" : "L"} ${n.x.toFixed(1)} ${n.y.toFixed(1)}`)
    .join(" ");

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #FAF8F2 0%, #ECE6DA 60%, #DCD4C4 100%)",
      }}
    >
      {/* Top & Bottom Masked Minimalist Typography Unmasked by the Elastic String */}
      {textReveal > 0.01 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="
            absolute left-1/2 top-[385px] -translate-x-1/2 -translate-y-1/2 overflow-hidden pb-6 px-8
          ">
            <div
              className="text-[104px] font-black tracking-tight text-[#18181B] leading-none whitespace-nowrap"
              style={{
                transform: `translate3d(0, ${lerp(125, 0, textReveal).toFixed(
                  1
                )}px, 0)`,
                textShadow: TEXT_LONG_SHADOW,
              }}
            >
              ₹37,779 CRORE
            </div>
          </div>

          <div className="
            absolute left-1/2 top-[675px] -translate-x-1/2 -translate-y-1/2 overflow-hidden py-4 px-6
          ">
            <div
              className="px-8 py-2.5 rounded-full bg-[#F8CB46] border-3 border-[#18181B] font-mono text-[26px] font-black tracking-[0.22em] text-[#18181B] uppercase shadow-[0_10px_0_#18181B] whitespace-nowrap"
              style={{
                transform: `translate3d(0, ${lerp(-110, 0, textReveal).toFixed(
                  1
                )}px, 0)`,
              }}
            >
              916.6M ORDERS · 10-MINUTE PRECISION
            </div>
          </div>
        </div>
      )}

      {/* Harmonic Pendulum Threads, Connecting Wave Ribbon & Spheres */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Vertical Pendulum Suspension Threads (Fade out as string snaps) */}
        {snapToLine < 0.98 &&
          nodes.map((n) => (
            <line
              key={`thread-${n.i}`}
              x1={n.x}
              y1={120}
              x2={n.x}
              y2={n.y}
              stroke="#18181B"
              strokeWidth="1.4"
              strokeOpacity={(1 - snapToLine) * 0.25}
            />
          ))}

        {/* Continuous Connecting Harmonic Wave / Elastic String */}
        <path
          d={splinePath}
          fill="none"
          stroke="#18181B"
          strokeWidth={lerp(3.5, 6.5, snapToLine)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 17 Harmonic Nodes with 45° Long Shadows */}
        {nodes.map((n) => {
          const r = lerp(15, n.i === 0 || n.i === numNodes - 1 ? 14 : 7, snapToLine);
          const isAccent = n.i % 3 === 0;
          return (
            <g key={`node-${n.i}`}>
              <circle
                cx={n.x - 10}
                cy={n.y + 12}
                r={r}
                fill="rgba(24,24,27,0.14)"
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={isAccent ? "#F8CB46" : "#18181B"}
                stroke="#18181B"
                strokeWidth="3"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ============================================================================
 * MASTER VOLUME 3 SHOWCASE REEL (24-Second 6-Scene Minimalist + Heavy Physics)
 * ============================================================================ */

export const TransitionsVol3HeavyShowcaseReel: React.FC<{ t: number }> = ({
  t,
}) => {
  const sceneDur = 4.0;
  const sceneIdx = clamp(Math.floor(t / sceneDur), 0, 5);
  const localT = t - sceneIdx * sceneDur;

  const labels = [
    "VOL.3 MINIMAL - 01 // MOTION NATIONS ORBITAL LETTER CONVERGENCE + 45° LONG SHADOWS",
    "VOL.3 MINIMAL - 02 // MOTION NATIONS DEFORMING GAUSSIAN WAVE HORIZON & ROLLING SPHERE",
    "VOL.3 MINIMAL - 03 // CAPSULE LONG-SHADOW SCANNER -> ARCHITECTURAL CAD WIREFRAME CONSTRUCT",
    "VOL.3 MINIMAL - 04 // MOTION NATIONS SINE-WAVE POLYGON-TO-LETTER MORPH + WORLD FLIP",
    "VOL.3 MINIMAL - 05 // ORDINARY FOLK BAUHAUS SEE-SAW LEVER PHYSICS & SPLIT-CIRCLE TUNNEL",
    "VOL.3 MINIMAL - 06 // HARMONIC 17-PENDULUM PHASE WAVE -> PLUCKED ELASTIC STRING REVEAL",
  ];

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-[#ECEAE5]">
      {sceneIdx === 0 && <MinimalOrbitalLetterConvergenceRig localT={localT} />}
      {sceneIdx === 1 && <MinimalDeformingWaveBallRig localT={localT} />}
      {sceneIdx === 2 && <MinimalCapsuleLongShadowScannerRig localT={localT} />}
      {sceneIdx === 3 && <MinimalPolygonWaveToLetterMorphRig localT={localT} />}
      {sceneIdx === 4 && <MinimalBauhausPendulumAndSeeSawRig localT={localT} />}
      {sceneIdx === 5 && <MinimalElasticPendulumWaveAndRibbonRig localT={localT} />}

      {/* Clean Minimalist Studio Pill Badge */}
      <div className="absolute bottom-5 left-8 z-50 px-5 py-2 rounded-full bg-white/85 backdrop-blur-md border border-zinc-900/20 text-zinc-900 font-mono text-[13px] font-bold tracking-wider shadow-sm">
        {labels[sceneIdx]}
      </div>
    </div>
  );
};
