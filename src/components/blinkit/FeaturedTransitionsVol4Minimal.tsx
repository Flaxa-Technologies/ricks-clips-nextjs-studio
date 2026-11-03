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
 * FEATURED TRANSITIONS & MOTION GRAPHICS — VOLUME 4
 * (6 MORE FAST, ULTRA-CLEAN MINIMALIST + HEAVY PHYSICS MOTIONS)
 * ----------------------------------------------------------------------------
 * 100% Main-Theme Aligned (Matte Ink Charcoal #18181B, Blinkit Gold #F8CB46,
 * Zomato Crimson #E23744) on Non-Black Daylight Putty, Cream & Petrol-Sapphire:
 *   1. `MinimalNewtonCradleMomentumRig` (5-Sphere Newton's Cradle Momentum Transfer)
 *   2. `Minimal3DRibbonHelixCorkscrewRig` (3D Depth-Sorted Double-Helix Sine Ribbon)
 *   3. `MinimalMagneticGridRepulsionRig` (105-Pill Magnetic Vector Field Repulsion)
 *   4. `MinimalOrigamiGeometricUnfoldRig` (Multi-Step Hinged Bauhaus Origami Portal)
 *   5. `MinimalElasticBowstringLaunchRig` (Tensioned Parabolic Bowstring Slingshot)
 *   6. `MinimalConcentricDialVaultLockRig` (3-Ring Combination Vault Lock & Split)
 * ============================================================================ */

function buildLongShadow(
  steps = 22,
  dx = -1.8,
  dy = 2.2,
  alphaStart = 0.13
): string {
  const layers: string[] = [];
  for (let i = 1; i <= steps; i++) {
    const f = 1 - i / (steps + 1);
    const a = (alphaStart * f * f).toFixed(3);
    layers.push(
      `${(i * dx).toFixed(1)}px ${(i * dy).toFixed(1)}px 0px rgba(24,24,27,${a})`
    );
  }
  return layers.join(", ");
}

const LONG_SHADOW = buildLongShadow(24, -1.7, 2.1, 0.12);

/* ============================================================================
 * 1. MINIMAL NEWTON'S CRADLE CONSERVATION OF MOMENTUM RIG
 *    - 5 heavy minimalist spheres suspended on hairline vertical rods
 *    - Left sphere swings down, transfers impulse through the center pack with
 *      a radial shockwave ring, and launches the right sphere
 *    - Each collision beat pops a kinetic word below with 45° long shadows
 * ============================================================================ */

export const MinimalNewtonCradleMomentumRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const omega = 5.4;
  const phase = Math.sin(localT * omega);
  const leftAngle = phase < 0 ? phase * 46 : 0;
  const rightAngle = phase > 0 ? phase * 46 : 0;

  // Impact pulses occur whenever sin(localT * omega) crosses 0
  const impactWave = Math.abs(Math.cos(localT * omega));
  const pivotY = 210;
  const rodLen = 285;
  const r = 38;
  const spacing = r * 2;

  const words = [
    { text: "ZERO", at: 0.25, color: "#18181B" },
    { text: "FRICTION", at: 0.85, color: "#E23744" },
    { text: "MOMENTUM.", at: 1.45, color: "#18181B" },
  ];

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #EFECE6 0%, #DFDCD4 60%, #CCC8BE 100%)",
      }}
    >
      {/* Top Minimalist Support Bar & 5 Pendulum Spheres */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Top Horizontal Anchor Beam */}
        <line
          x1="620"
          y1={pivotY}
          x2="1300"
          y2={pivotY}
          stroke="#18181B"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Impact Shockwave Ring at the Center Contact Point */}
        {impactWave > 0.82 && (
          <circle
            cx={960 + (phase >= 0 ? spacing * 1.5 : -spacing * 1.5)}
            cy={pivotY + rodLen}
            r={lerp(18, 95, (impactWave - 0.82) / 0.18)}
            fill="none"
            stroke="#F8CB46"
            strokeWidth="4"
            opacity={clamp((1 - impactWave) * 5, 0, 0.85)}
          />
        )}

        {[-2, -1, 0, 1, 2].map((idx) => {
          const anchorX = 960 + idx * spacing;
          const deg = idx === -2 ? leftAngle : idx === 2 ? rightAngle : 0;
          const rad = (deg * Math.PI) / 180;
          const bx = anchorX + Math.sin(rad) * rodLen;
          const by = pivotY + Math.cos(rad) * rodLen;

          const isOuter = Math.abs(idx) === 2;
          return (
            <g key={idx}>
              {/* 45-Degree Long Shadow of Sphere */}
              {Array.from({ length: 14 }).map((_, s) => (
                <circle
                  key={s}
                  cx={bx - (s + 1) * 2.5}
                  cy={by + (s + 1) * 3.1}
                  r={r}
                  fill={`rgba(24,24,27,${(0.09 * Math.pow(1 - s / 14, 1.8)).toFixed(
                    3
                  )})`}
                />
              ))}

              {/* Suspension Rod */}
              <line
                x1={anchorX}
                y1={pivotY}
                x2={bx}
                y2={by}
                stroke="#18181B"
                strokeWidth="2.5"
              />
              {/* Anchor Pin */}
              <circle cx={anchorX} cy={pivotY} r="5" fill="#18181B" />

              {/* Heavy Minimalist Sphere */}
              <circle
                cx={bx}
                cy={by}
                r={r}
                fill={isOuter ? "#F8CB46" : "#18181B"}
                stroke="#18181B"
                strokeWidth="4"
              />
              {/* Specular Highlight */}
              <circle
                cx={bx - 12}
                cy={by - 12}
                r="7"
                fill="rgba(255,255,255,0.45)"
              />
            </g>
          );
        })}
      </svg>

      {/* Bottom Impact-Synced Minimalist Typography */}
      <div className="absolute bottom-[190px] flex items-center gap-7">
        {words.map((w) => {
          const sp = springODE(Math.max(0, localT - w.at), 22, 0.65).value;
          return (
            <span
              key={w.text}
              className="font-sans font-black text-[84px] tracking-tight leading-none"
              style={{
                color: w.color,
                opacity: clamp(sp * 1.5, 0, 1),
                transform: `translateY(${lerp(45, 0, sp).toFixed(
                  1
                )}px) scale(${lerp(0.75, 1, sp).toFixed(3)})`,
                textShadow: LONG_SHADOW,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. MINIMAL 3D DOUBLE-HELIX CORKSCREW RIBBON RIG
 *    - Deep Petrol-Sapphire Teal Canvas (#103952 -> #061A28 — zero black!)
 *    - Two intertwined parametric 3D sine/cosine ribbons (Blinkit Gold #F8CB46
 *      and Crisp White #FFFFFF) that spiral around the central typography!
 *    - True Z-depth sorting: segments with z < 0 pass BEHIND the text, while
 *      segments with z >= 0 pass IN FRONT OF the text!
 * ============================================================================ */

export const Minimal3DRibbonHelixCorkscrewRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const drawProg = cubicBezier(
    windowProgress(localT, 0.0, 1.45),
    0.16,
    1,
    0.3,
    1
  );
  const textPop = springODE(Math.max(0, localT - 0.35), 18, 0.72).value;

  const numSegs = 68;
  const maxSeg = Math.floor(numSegs * drawProg);

  const renderHelixPass = (frontPass: boolean) => {
    const elements: React.ReactNode[] = [];
    for (let i = 0; i < maxSeg; i++) {
      const f0 = i / numSegs;
      const f1 = (i + 1) / numSegs;
      const x0 = lerp(140, 1780, f0);
      const x1 = lerp(140, 1780, f1);

      const theta0 = f0 * Math.PI * 4.5 - localT * 4.2;
      const theta1 = f1 * Math.PI * 4.5 - localT * 4.2;
      const amp = 165;

      // Strand A (Blinkit Gold)
      const yA0 = 540 + Math.sin(theta0) * amp;
      const yA1 = 540 + Math.sin(theta1) * amp;
      const zA = Math.cos(theta0);

      if ((frontPass && zA >= 0) || (!frontPass && zA < 0)) {
        const w = lerp(5, 16, (zA + 1) * 0.5);
        elements.push(
          <line
            key={`A-${i}`}
            x1={x0}
            y1={yA0}
            x2={x1}
            y2={yA1}
            stroke="#F8CB46"
            strokeWidth={w}
            strokeLinecap="round"
            opacity={frontPass ? 1 : 0.42}
          />
        );
      }

      // Strand B (Crisp Ivory, phase shifted by PI)
      const yB0 = 540 + Math.sin(theta0 + Math.PI) * amp;
      const yB1 = 540 + Math.sin(theta1 + Math.PI) * amp;
      const zB = Math.cos(theta0 + Math.PI);

      if ((frontPass && zB >= 0) || (!frontPass && zB < 0)) {
        const w = lerp(5, 15, (zB + 1) * 0.5);
        elements.push(
          <line
            key={`B-${i}`}
            x1={x0}
            y1={yB0}
            x2={x1}
            y2={yB1}
            stroke="#38BDF8"
            strokeWidth={w}
            strokeLinecap="round"
            opacity={frontPass ? 0.95 : 0.38}
          />
        );
      }
    }
    return elements;
  };

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, #134263 0%, #0A263B 60%, #061826 100%)",
      }}
    >
      {/* PASS 1: Back-Hemisphere Helix Segments (z < 0, behind typography) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {renderHelixPass(false)}
      </svg>

      {/* PASS 2: Central Minimalist Hero Typography Wrapped Inside the 3D Helix */}
      <div
        className="relative z-10 text-center px-10"
        style={{
          transform: `scale(${lerp(0.84, 1, textPop).toFixed(3)})`,
          opacity: clamp(textPop * 1.4, 0, 1),
        }}
      >
        <div className="text-[128px] font-black tracking-[0.08em] text-white leading-none drop-shadow-[0_18px_35px_rgba(0,0,0,0.55)]">
          HYPERPURE DNA
        </div>
      </div>

      {/* PASS 3: Front-Hemisphere Helix Segments (z >= 0, crossing in front of typography) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {renderHelixPass(true)}
      </svg>
    </div>
  );
};

/* ============================================================================
 * 3. MINIMAL MAGNETIC VECTOR FIELD REPULSION MATRIX RIG
 *    - Warm Studio Cream Canvas (#F8F6F0 -> #E5DFD2)
 *    - 15 x 7 matrix of minimalist rounded pills (#18181B)
 *    - A heavy Blinkit-Gold sphere slices across the matrix; every pill within
 *      radius 260px experiences Coulomb repulsion + tangent rotation, parting
 *      the sea to unmask "2,243 DARK STORES" at the center!
 * ============================================================================ */

export const MinimalMagneticGridRepulsionRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const sphereSweep = cubicBezier(
    windowProgress(localT, 0.15, 2.25),
    0.25,
    0.1,
    0.25,
    1
  );
  const sphereX = lerp(120, 1800, sphereSweep);
  const sphereY = 540 + Math.sin(sphereSweep * Math.PI * 2) * 55;

  const textUnmask = clamp((sphereX - 420) / 980, 0, 1);

  const cols = 15;
  const rows = 7;

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #FAF8F2 0%, #EAE4D7 60%, #D8D0C0 100%)",
      }}
    >
      {/* Center Masked Minimalist Headline Revealed in the Sphere's Wake */}
      <div
        className="relative z-10 px-12 py-5 rounded-3xl bg-[#FAF8F2]/95 border-4 border-[#18181B] shadow-[0_16px_0_#18181B]"
        style={{
          clipPath: `inset(-30px ${((1 - textUnmask) * 100).toFixed(
            1
          )}% -30px -30px)`,
        }}
      >
        <div className="text-[76px] font-black tracking-tight text-[#18181B] leading-none">
          2,243 DARK STORES
        </div>
      </div>

      {/* 15 x 7 Magnetic Vector Pill Field + Repelling Gold Sphere */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const gx = 260 + (c / (cols - 1)) * 1400;
            const gy = 220 + (r / (rows - 1)) * 640;

            const dx = gx - sphereX;
            const dy = gy - sphereY;
            const dist = Math.hypot(dx, dy);
            const maxR = 290;

            let pushX = 0;
            let pushY = 0;
            let angleDeg = 0;
            let scale = 1;

            if (dist < maxR && dist > 1) {
              const force = Math.pow(1 - dist / maxR, 1.6) * 115;
              pushX = (dx / dist) * force;
              pushY = (dy / dist) * force;
              angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
              scale = lerp(1, 1.45, 1 - dist / maxR);
            }

            const finalX = gx + pushX;
            const finalY = gy + pushY;
            const isNear = dist < maxR * 0.75;

            return (
              <g
                key={`${r}-${c}`}
                transform={`translate(${finalX.toFixed(1)}, ${finalY.toFixed(
                  1
                )}) rotate(${angleDeg.toFixed(1)}) scale(${scale.toFixed(2)})`}
              >
                <rect
                  x="-16"
                  y="-5"
                  width="32"
                  height="10"
                  rx="5"
                  fill={isNear ? "#E23744" : "#18181B"}
                  opacity={isNear ? 0.95 : 0.28}
                />
              </g>
            );
          })
        )}

        {/* Travelling Heavy Magnetic Gold Sphere with 45° Long Shadow */}
        {Array.from({ length: 16 }).map((_, s) => (
          <circle
            key={s}
            cx={sphereX - (s + 1) * 2.5}
            cy={sphereY + (s + 1) * 3.1}
            r="46"
            fill={`rgba(24,24,27,${(0.11 * Math.pow(1 - s / 16, 1.8)).toFixed(
              3
            )})`}
          />
        ))}
        <circle
          cx={sphereX}
          cy={sphereY}
          r="46"
          fill="#F8CB46"
          stroke="#18181B"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
};

/* ============================================================================
 * 4. MINIMAL BAUHAUS ORIGAMI 4-STEP GEOMETRIC UNFOLD RIG
 *    - Warm Bauhaus Putty Canvas (#EFECE6 -> #DCD8CE)
 *    - Starts as a single central square at (960, 540), then unfolds 4 hinged
 *      3D geometric flaps (Top, Right, Bottom, Left) into a Bauhaus Swiss Cross
 *      and rotating octagonal frame around "90s PICK TIME"
 * ============================================================================ */

export const MinimalOrigamiGeometricUnfoldRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const centerPop = springODE(localT, 20, 0.7).value;
  const flapTop = springODE(Math.max(0, localT - 0.3), 18, 0.68).value;
  const flapRight = springODE(Math.max(0, localT - 0.55), 18, 0.68).value;
  const flapBottom = springODE(Math.max(0, localT - 0.8), 18, 0.68).value;
  const flapLeft = springODE(Math.max(0, localT - 1.05), 18, 0.68).value;
  const badgePop = springODE(Math.max(0, localT - 1.45), 22, 0.65).value;

  const size = 168;

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #F4F2EC 0%, #E3DFD5 60%, #D1CCC0 100%)",
        perspective: "1100px",
      }}
    >
      {/* Outer Rotating Bauhaus Octagonal Ring */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <circle
          cx="960"
          cy="540"
          r="380"
          fill="none"
          stroke="#18181B"
          strokeWidth="2"
          strokeDasharray="16 12"
          strokeOpacity="0.28"
          transform={`rotate(${(localT * 24).toFixed(1)} 960 540)`}
        />
      </svg>

      {/* 3D Unfolding Origami Swiss Cross Container */}
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: "preserve-3d",
          transform: `scale(${centerPop.toFixed(3)}) rotateZ(${lerp(
            -45,
            0,
            clamp(flapLeft, 0, 1)
          ).toFixed(1)}deg)`,
        }}
      >
        {/* Center Core Square */}
        <div
          className="absolute inset-0 bg-[#18181B] border-4 border-[#18181B]"
          style={{ boxShadow: LONG_SHADOW }}
        />

        {/* Top Hinged Flap */}
        <div
          className="absolute left-0 -top-[168px] w-[168px] h-[168px] bg-[#F8CB46] border-4 border-[#18181B] flex items-center justify-center font-mono text-[22px] font-black text-[#18181B]"
          style={{
            transformOrigin: "bottom center",
            transform: `rotateX(${lerp(-180, 0, clamp(flapTop, 0, 1.1)).toFixed(
              1
            )}deg)`,
          }}
        >
          SCAN
        </div>

        {/* Right Hinged Flap */}
        <div
          className="absolute left-[168px] top-0 w-[168px] h-[168px] bg-[#E23744] border-4 border-[#18181B] flex items-center justify-center font-mono text-[22px] font-black text-white"
          style={{
            transformOrigin: "left center",
            transform: `rotateY(${lerp(
              -180,
              0,
              clamp(flapRight, 0, 1.1)
            ).toFixed(1)}deg)`,
          }}
        >
          PACK
        </div>

        {/* Bottom Hinged Flap */}
        <div
          className="absolute left-0 top-[168px] w-[168px] h-[168px] bg-[#F8CB46] border-4 border-[#18181B] flex items-center justify-center font-mono text-[22px] font-black text-[#18181B]"
          style={{
            transformOrigin: "top center",
            transform: `rotateX(${lerp(
              180,
              0,
              clamp(flapBottom, 0, 1.1)
            ).toFixed(1)}deg)`,
          }}
        >
          SEAL
        </div>

        {/* Left Hinged Flap */}
        <div
          className="absolute -left-[168px] top-0 w-[168px] h-[168px] bg-[#18181B] border-4 border-[#18181B] flex items-center justify-center font-mono text-[22px] font-black text-[#F8CB46]"
          style={{
            transformOrigin: "right center",
            transform: `rotateY(${lerp(180, 0, clamp(flapLeft, 0, 1.1)).toFixed(
              1
            )}deg)`,
          }}
        >
          SHIP
        </div>

        {/* Central Pop-Out Minimalist Metric Pill */}
        {badgePop > 0.01 && (
          <div
            className="absolute left-1/2 top-1/2 w-[420px] py-5 rounded-2xl bg-[#FFFDF9] border-4 border-[#18181B] text-center shadow-[0_18px_0_#18181B]"
            style={{
              transform: `translate(-50%, -50%) translateZ(45px) scale(${badgePop.toFixed(
                3
              )})`,
            }}
          >
            <div className="text-[54px] font-black text-[#18181B] leading-none">
              85 SECONDS
            </div>
            <div className="mt-1 font-mono text-[14px] font-bold tracking-[0.25em] text-stone-600 uppercase">
              BARCODE TO RIDER BAG
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
 * 5. MINIMAL ELASTIC BOWSTRING SLINGSHOT & DIAGONAL RAZOR SPLIT RIG
 *    - Soft Matte Graphite Canvas (#272930) sliced open by a high-velocity
 *      launched Blinkit-Gold sphere into Warm Studio Cream (#F6F3EC)
 *    - Vertical bowstring at x = 520 pulls back to x = 220 (0.0s - 1.15s),
 *      releases with high-frequency damped string vibration, and fires the
 *      sphere across the screen!
 * ============================================================================ */

export const MinimalElasticBowstringLaunchRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const pullProg = cubicBezier(
    windowProgress(localT, 0.05, 1.05),
    0.4,
    0,
    0.2,
    1
  );
  const isReleased = localT >= 1.12;
  const relT = Math.max(0, localT - 1.12);

  const launchProg = cubicBezier(
    windowProgress(localT, 1.12, 0.65),
    0.16,
    1,
    0.3,
    1
  );
  const worldSlice = cubicBezier(
    windowProgress(localT, 1.35, 0.75),
    0.22,
    1,
    0.36,
    1
  );

  // Bowstring apex X coordinate
  const anchorX = 480;
  const stringApexX = !isReleased
    ? lerp(anchorX, 210, pullProg)
    : anchorX + 190 * Math.exp(-5.5 * relT) * Math.cos(34 * relT);

  // Launched sphere X coordinate
  const ballX = !isReleased
    ? stringApexX + 34
    : lerp(244, 2080, launchProg);

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #2D3038 0%, #202228 100%)",
      }}
    >
      {/* Bowstring & Slingshot Sphere */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Top & Bottom Bowstring Anchor Pins */}
        <circle cx={anchorX} cy="160" r="9" fill="#F8CB46" />
        <circle cx={anchorX} cy="920" r="9" fill="#F8CB46" />

        {/* Elastic Quadratic Bezier Bowstring */}
        <path
          d={`M ${anchorX} 160 Q ${stringApexX.toFixed(
            1
          )} 540 ${anchorX} 920`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Velocity Trail Behind Fired Sphere */}
        {isReleased && launchProg < 0.98 && (
          <line
            x1={Math.max(anchorX, ballX - 420)}
            y1="540"
            x2={ballX}
            y2="540"
            stroke="#F8CB46"
            strokeWidth="18"
            strokeLinecap="round"
            opacity={1 - launchProg * 0.6}
          />
        )}

        {/* Fired Minimalist Gold Sphere */}
        <circle
          cx={ballX}
          cy="540"
          r="36"
          fill="#F8CB46"
          stroke="#FFFFFF"
          strokeWidth="5"
        />
      </svg>

      {/* Center Unmasked Text in Graphite World */}
      {isReleased && (
        <div
          className="text-[112px] font-black tracking-tight text-white select-none"
          style={{
            clipPath: `inset(0 ${clamp(
              ((1750 - ballX) / 1250) * 100,
              0,
              100
            ).toFixed(1)}% 0 0)`,
          }}
        >
          HYPERVELOCITY
        </div>
      )}

      {/* Diagonal Razor Slice Into Warm Studio Cream (`worldSlice`) */}
      {worldSlice > 0.001 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath: `polygon(0 0, ${(worldSlice * 125).toFixed(
              1
            )}% 0, ${(worldSlice * 125 - 25).toFixed(1)}% 100%, 0 100%)`,
            background:
              "radial-gradient(circle at 50% 45%, #FAF8F2 0%, #E5DFD2 100%)",
          }}
        >
          <div
            className="text-[112px] font-black tracking-tight text-[#18181B]"
            style={{ textShadow: LONG_SHADOW }}
          >
            HYPERVELOCITY
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 6. MINIMAL 3-RING COMBINATION VAULT LOCK & LASER SPLIT RIG
 *    - Warm Studio Putty Canvas (#ECEAE5 -> #D4D0C8)
 *    - 3 concentric notched rings rotating in opposite directions
 *    - At t = 1.75s, all 3 gold notches lock at 12 o'clock and the circular
 *      vault splits cleanly in half (top & bottom halves part) to reveal
 *      "46% MARKET LEADER"
 * ============================================================================ */

export const MinimalConcentricDialVaultLockRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const lockProg = cubicBezier(
    windowProgress(localT, 0.1, 1.55),
    0.22,
    1,
    0.36,
    1
  );
  const splitProg = springODE(Math.max(0, localT - 1.85), 18, 0.72).value;
  const splitOffset = clamp(splitProg, 0, 1.15) * 145;

  const rot1 = lerp(210, 0, lockProg);
  const rot2 = lerp(-165, 0, lockProg);
  const rot3 = lerp(120, 0, lockProg);

  const renderVaultHalf = (isTop: boolean) => (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        clipPath: isTop
          ? "inset(0 0 50% 0)"
          : "inset(50% 0 0 0)",
        transform: `translateY(${(isTop ? -splitOffset : splitOffset).toFixed(
          1
        )}px)`,
      }}
    >
      <svg width="700" height="700" viewBox="0 0 700 700">
        {[
          { r: 265, rot: rot1, color: "#18181B" },
          { r: 195, rot: rot2, color: "#E23744" },
          { r: 125, rot: rot3, color: "#18181B" },
        ].map((ring, idx) => (
          <g
            key={idx}
            transform={`rotate(${ring.rot.toFixed(1)} 350 350)`}
          >
            <circle
              cx="350"
              cy="350"
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth="22"
              strokeDasharray="95 18"
            />
            {/* Top Alignment Notch at 12 O'Clock */}
            <rect
              x="338"
              y={350 - ring.r - 16}
              width="24"
              height="32"
              rx="6"
              fill="#F8CB46"
              stroke="#18181B"
              strokeWidth="3"
            />
          </g>
        ))}
      </svg>
    </div>
  );

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #F2F0EB 0%, #DFDCD3 60%, #CBC7BC 100%)",
      }}
    >
      {/* Revealed Minimalist Core Inside Split Vault */}
      {splitProg > 0.02 && (
        <div
          className="relative z-10 px-14 py-6 rounded-3xl bg-[#F8CB46] border-4 border-[#18181B] shadow-[0_16px_0_#18181B] text-center"
          style={{
            transform: `scale(${clamp(splitProg, 0, 1.05).toFixed(3)})`,
          }}
        >
          <div className="text-[78px] font-black tracking-tight text-[#18181B] leading-none">
            46% MARKET LEADER
          </div>
          <div className="mt-1 font-mono text-[16px] font-bold tracking-[0.28em] text-[#18181B] uppercase">
            ETERNAL QUICK-COMMERCE LOCK
          </div>
        </div>
      )}

      {/* Top & Bottom Halves of the 3-Ring Vault */}
      {renderVaultHalf(true)}
      {renderVaultHalf(false)}
    </div>
  );
};

/* ============================================================================
 * MASTER VOLUME 4 SHOWCASE REEL (24-Second 6-Scene Minimalist + Heavy Physics)
 * ============================================================================ */

export const TransitionsVol4MinimalShowcaseReel: React.FC<{ t: number }> = ({
  t,
}) => {
  const sceneDur = 4.0;
  const sceneIdx = clamp(Math.floor(t / sceneDur), 0, 5);
  const localT = t - sceneIdx * sceneDur;

  const labels = [
    "VOL.4 MINIMAL - 01 // NEWTON'S CRADLE MOMENTUM TRANSFER + 45° LONG SHADOWS",
    "VOL.4 MINIMAL - 02 // 3D DEPTH-SORTED DOUBLE-HELIX CORKSCREW RIBBON",
    "VOL.4 MINIMAL - 03 // MAGNETIC VECTOR FIELD PILL MATRIX REPULSION",
    "VOL.4 MINIMAL - 04 // BAUHAUS 4-STEP HINGED ORIGAMI UNFOLDING PORTAL",
    "VOL.4 MINIMAL - 05 // PARABOLIC ELASTIC BOWSTRING SLINGSHOT & DIAGONAL SLICE",
    "VOL.4 MINIMAL - 06 // 3-RING COMBINATION VAULT ALIGNMENT & LASER SPLIT",
  ];

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-[#EFECE6]">
      {sceneIdx === 0 && <MinimalNewtonCradleMomentumRig localT={localT} />}
      {sceneIdx === 1 && <Minimal3DRibbonHelixCorkscrewRig localT={localT} />}
      {sceneIdx === 2 && <MinimalMagneticGridRepulsionRig localT={localT} />}
      {sceneIdx === 3 && <MinimalOrigamiGeometricUnfoldRig localT={localT} />}
      {sceneIdx === 4 && <MinimalElasticBowstringLaunchRig localT={localT} />}
      {sceneIdx === 5 && <MinimalConcentricDialVaultLockRig localT={localT} />}

      <div className="absolute bottom-5 left-8 z-50 px-5 py-2 rounded-full bg-white/85 backdrop-blur-md border border-zinc-900/20 text-zinc-900 font-mono text-[13px] font-bold tracking-wider shadow-sm">
        {labels[sceneIdx]}
      </div>
    </div>
  );
};
