import React from "react";
import {
  clamp,
  lerp,
  windowProgress,
  cubicBezier,
  springODE,
  AE_SNAP,
} from "../../lib/kinematics";

function posterizeTime(t: number, fps = 12): number {
  return Math.floor(t * fps) / fps;
}

/* ============================================================================
 * FEATURED TRANSITIONS & MOTION GRAPHICS — VOLUME 3 (HEAVY & COMPLEX EDITION)
 * ----------------------------------------------------------------------------
 * STRICT DESIGN MANDATE:
 *   1. ZERO BLACK BACKGROUNDS (#000000 / bg-black / bg-zinc-950 are FORBIDDEN).
 *      Every scene uses rich, tactile, sunlit editorial & engineering palettes:
 *      - Warm Sunlit Sandstone & Alabaster (#F4EFE6 -> #DFD5C5)
 *      - Engineering Cobalt-Cyan Blueprint (#1B4379 -> #102A52)
 *      - Vox Mustard-Gold Architectural Grid (#F5C518 -> #E2A800) & Silver Studio (#E2E8F0)
 *      - Financial Times Salmon-Cream Parchment (#F6E9D7 -> #E8D4B9)
 *      - Pastel Sky-Blue & Cloud Alabaster (#D8EEFE -> #B6DDFB)
 *      - Museum Sage-Limestone (#E6EBE4) -> Sunlit Terracotta Parchment (#FDF3E7)
 *   2. HEAVY, MULTI-LAYERED COMPLEXITY:
 *      - 5-Plane True 3D Multiplane Parallax Camera Rig with Bounding-Box Tracker
 *      - 4-Tier 3D Isometric Exploded-View CAD Supply-Chain Architecture
 *      - Vox Mustard Grid Dictionary Card + 12-Louver 3D Flip + Stacked Filing Cards
 *      - Quantitative Cubic-Bezier Sankey Flow + 6-Axis Polar Radar + Candlesticks
 *      - Real-Time 3D Orthographic Geodesic Globe + Dynamic City Leader Tether Lines
 *      - Swiss Kinetic Typography Matrix + Concentric Counter-Rotating Mechanical Iris
 * ============================================================================ */

/* ============================================================================
 * RIG 1: 5-LAYER TRUE 3D MULTIPLANE PARALLAX CAMERA RIG + OBJECT TRACKER
 *    (Learned from DeVisuals 2026 3D Parallax & Vox 2026 Reel `aCn_jxFuKc8`)
 *    - 5 distinct Z-planes (-520px, -260px, 0px, +170px, +310px)
 *    - 6-DOF virtual camera pan + tilt + Z-dolly + rack focus
 *    - Pink corner bounding-box object tracker `[+]` with live coordinate telemetry
 *    - 3D gradient spheres orbiting the corners of the hero frame
 *    - Warm Sunlit Sandstone & Architectural Drafting Paper background
 * ============================================================================ */

export const Heavy5Layer3DParallaxCameraRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const camProg = cubicBezier(windowProgress(localT, 0.0, 3.8), 0.22, 1, 0.36, 1);

  // 6-DOF Camera Trajectory
  const camX = lerp(-65, 35, camProg);
  const camY = lerp(40, -25, camProg);
  const camZ = lerp(-140, 135, camProg);
  const rotX = lerp(9, -4, camProg);
  const rotY = lerp(-14, 8, camProg);
  const rotZ = lerp(-2.5, 1.2, camProg);

  const trackerLock = AE_SNAP(windowProgress(localT, 0.45, 0.75));
  const highlightSweep = AE_SNAP(windowProgress(localT, 1.0, 0.8));
  const redStrike = AE_SNAP(windowProgress(localT, 1.65, 0.65));

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 45% 35%, #FAF6EE 0%, #EDE4D3 55%, #D8CBB5 100%)",
        perspective: "1100px",
      }}
    >
      {/* Architectural Millimeter Grid & Sunlit Caustic Rays on Paper Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(120,105,85,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,105,85,0.16) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "repeating-linear-gradient(125deg, rgba(255,255,255,0.65) 0px, rgba(255,255,255,0.65) 140px, transparent 140px, transparent 320px)",
        }}
      />

      {/* 3D MULTIPLANE STAGE CONTAINER */}
      <div
        className="relative w-[1920px] h-[1080px]"
        style={{
          transformStyle: "preserve-3d",
          transform: `translate3d(${camX.toFixed(1)}px, ${camY.toFixed(
            1
          )}px, ${camZ.toFixed(1)}px) rotateX(${rotX.toFixed(
            2
          )}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`,
        }}
      >
        {/* PLANE 1 (Z = -480px): Deep Background Architectural Skyline & Compass Ring */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{
            transform: "translate3d(0px, 0px, -480px) scale(1.38)",
            filter: "blur(2.5px)",
            opacity: 0.55,
          }}
        >
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <circle
              cx="960"
              cy="540"
              r="460"
              fill="none"
              stroke="#8C7A6B"
              strokeWidth="2"
              strokeDasharray="12 8"
              transform={`rotate(${(localT * 12).toFixed(1)} 960 540)`}
            />
            <circle
              cx="960"
              cy="540"
              r="370"
              fill="none"
              stroke="#A89888"
              strokeWidth="1.5"
            />
            {/* Rising Background Bar Columns */}
            {Array.from({ length: 16 }).map((_, i) => {
              const bh = 180 + Math.sin(i * 1.3 + localT * 1.5) * 110 + i * 18;
              const bx = 220 + i * 94;
              return (
                <rect
                  key={i}
                  x={bx}
                  y={920 - bh}
                  width="54"
                  height={bh}
                  rx="6"
                  fill="rgba(180, 155, 125, 0.28)"
                  stroke="rgba(140, 115, 85, 0.45)"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>

        {/* PLANE 2 (Z = -220px): Mid-Back Archival Typewriter Dossier & Filing Clippings */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: "translate3d(0px, 0px, -220px) scale(1.14)",
          }}
        >
          {/* Left Archival Typewriter Card (Vox "Democracy" Strike-Through Style) */}
          <div
            className="absolute left-[110px] top-[150px] w-[540px] bg-[#FBF8F1] p-8 rounded-xl border-2 border-[#C8B9A6] shadow-[0_28px_60px_rgba(90,72,50,0.22)]"
            style={{
              transform: `rotate(-5deg) scale(${springODE(localT, 18, 0.72).value.toFixed(3)})`,
            }}
          >
            <div className="text-[13px] font-mono tracking-[0.28em] text-stone-500 uppercase border-b border-stone-300 pb-2">
              EXHIBIT I // PRE-PIVOT WAREHOUSE AUDIT
            </div>
            <div className="mt-4 font-serif text-[26px] leading-[1.45] text-stone-800">
              The Original Model of{" "}
              <span className="relative inline-block font-bold px-1">
                <span
                  className="absolute inset-y-0.5 left-0 bg-amber-300/80"
                  style={{ width: `${(highlightSweep * 100).toFixed(1)}%` }}
                />
                <span className="relative z-10">Next-Day Slotted</span>
              </span>{" "}
              <span className="relative inline-block font-bold text-stone-900 px-1">
                Supermarket Delivery
                {/* Hand-drawn red loop + red X strike */}
                <svg
                  className="absolute -inset-2 w-[112%] h-[135%] overflow-visible pointer-events-none"
                  viewBox="0 0 260 60"
                >
                  <ellipse
                    cx="130"
                    cy="30"
                    rx="124"
                    ry="24"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="3.5"
                    strokeDasharray="600"
                    strokeDashoffset={(600 * (1 - redStrike)).toFixed(1)}
                  />
                  <path
                    d="M 95 10 L 165 50 M 165 10 L 95 50"
                    stroke="#DC2626"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset={(200 * (1 - redStrike)).toFixed(1)}
                  />
                </svg>
              </span>{" "}
              burned $600M across outskirts hubs.
            </div>
          </div>

          {/* Right Archival Balance Sheet Clipping */}
          <div
            className="absolute right-[95px] bottom-[155px] w-[500px] bg-[#FBF8F1] p-7 rounded-xl border-2 border-[#C8B9A6] shadow-[0_28px_60px_rgba(90,72,50,0.22)]"
            style={{
              transform: `rotate(4.5deg) scale(${springODE(Math.max(0, localT - 0.18), 18, 0.72).value.toFixed(3)})`,
            }}
          >
            <div className="flex justify-between text-[13px] font-mono text-stone-500 border-b border-stone-300 pb-2">
              <span>BSE FILING // JUNE 2022</span>
              <span className="text-emerald-700 font-bold">VERIFIED</span>
            </div>
            <div className="mt-3 text-[22px] font-bold text-stone-900">
              All-Stock Merger: ₹4,447 Crore ($568M)
            </div>
            <div className="mt-2 text-[16px] text-stone-600 leading-relaxed">
              10-minute dark-store density unlocked 3.0x cohort retention and ₹660+ AOV.
            </div>
          </div>
        </div>

        {/* PLANE 3 (Z = 0px, HERO FOCAL PLANE): Framed Documentary Cutout + Pink Object Tracker */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: "translate3d(0px, 0px, 0px)",
          }}
        >
          <div
            className="relative w-[720px] h-[480px] bg-[#FFFDF9] rounded-2xl border-4 border-stone-800 shadow-[0_40px_90px_rgba(60,45,25,0.32)] overflow-visible flex items-center p-8 gap-8"
            style={{
              transform: `scale(${springODE(localT, 20, 0.74).value.toFixed(3)})`,
            }}
          >
            {/* 3D Gradient Orbs at Opposite Corners (Vox 2026 Reel Panel 15 Detail) */}
            <div
              className="absolute -top-7 -left-7 w-14 h-14 rounded-full shadow-lg"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #60A5FA, #3B82F6 50%, #1D4ED8 100%)",
                transform: `translate3d(0, ${(Math.sin(localT * 3) * 6).toFixed(1)}px, 30px)`,
              }}
            />
            <div
              className="absolute -bottom-7 -right-7 w-16 h-16 rounded-full shadow-lg"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #F472B6, #E11D48 60%, #881337 100%)",
                transform: `translate3d(0, ${(Math.cos(localT * 3) * 6).toFixed(1)}px, 30px)`,
              }}
            />

            {/* Portrait Container with Pink Tracker Handles */}
            <div className="relative w-[265px] h-[360px] bg-stone-200 rounded-xl overflow-visible shrink-0 border-2 border-stone-700">
              <img
                src="/images/person_albinder_dhindsa_color.png"
                alt="Albinder Dhindsa"
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Pink Motion-Tracking Bounding Box Overlay (`vox_reel_2026_grid.jpg` Panel 14) */}
              <div
                className="absolute -inset-3 border-2 border-dashed border-pink-500 pointer-events-none"
                style={{
                  opacity: trackerLock,
                  transform: `scale(${lerp(1.25, 1.0, trackerLock).toFixed(3)})`,
                }}
              >
                {/* 4 Pink Corner Registration Squares */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-pink-500" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-500" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-pink-500" />
                <div className="absolute -top-7 left-0 bg-pink-500 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded-xs whitespace-nowrap">
                  TRK_ID: CEO_01 · Z=0.0m · {(98.4 + Math.sin(localT * 5) * 1.2).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Right Column Inside Hero Frame */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/30 border border-amber-600/40 text-amber-950 font-mono text-[13px] font-bold tracking-wider uppercase">
                MULTIPLANE 3D CAMERA RIG
              </div>
              <div className="mt-3 text-[44px] font-black text-stone-900 leading-[1.05] tracking-tight">
                THE 10-MINUTE ARCHITECT
              </div>
              <div className="mt-3 text-[19px] text-stone-600 font-medium leading-snug">
                5 independent Z-depth planes moving simultaneously under a 6-DOF virtual camera dolly.
              </div>

              {/* Mini Live Metric Row */}
              <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-stone-200">
                <div className="bg-stone-100 p-3 rounded-xl border border-stone-300">
                  <div className="text-[12px] font-mono text-stone-500">DARK STORES</div>
                  <div className="text-[28px] font-black text-stone-900">2,243</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-300">
                  <div className="text-[12px] font-mono text-amber-800">MARKET SHARE</div>
                  <div className="text-[28px] font-black text-amber-900">46.0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PLANE 4 (Z = +150px): Foreground Floating Glass Telemetry & Rolling Counter */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: "translate3d(0px, 0px, 150px) scale(0.86)",
          }}
        >
          {/* Top-Right Floating Glass Telemetry Card */}
          <div
            className="absolute right-[210px] top-[150px] w-[390px] bg-white/90 backdrop-blur-xl p-5 rounded-2xl border-2 border-stone-800/20 shadow-[0_30px_60px_rgba(60,45,25,0.28)]"
            style={{
              transform: `translate3d(0, ${(Math.sin(localT * 2.4) * 8).toFixed(1)}px, 0)`,
            }}
          >
            <div className="flex items-center justify-between text-[12px] font-mono font-bold text-stone-500">
              <span>FOREGROUND PLANE // Z = +150PX</span>
              <span className="text-emerald-600">● LIVE SYNC</span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-[40px] font-black text-stone-900 font-mono">
                ₹{Math.floor(lerp(12400, 37779, camProg)).toLocaleString()} Cr
              </span>
              <span className="text-[15px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                +124% YoY
              </span>
            </div>
            <svg className="mt-2 w-full h-12 overflow-visible" viewBox="0 0 360 45">
              <path
                d="M 0 40 Q 60 36, 110 28 T 220 16 T 355 4"
                fill="none"
                stroke="#D97706"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="420"
                strokeDashoffset={(420 * (1 - camProg)).toFixed(1)}
              />
            </svg>
          </div>

          {/* Bottom-Left Vox-Style Red Counter Badge (`vox_reel_2026_grid.jpg` Panel 1) */}
          <div
            className="absolute left-[210px] bottom-[155px] bg-white/90 backdrop-blur-xl px-7 py-5 rounded-2xl border-2 border-red-600/30 shadow-[0_30px_60px_rgba(180,30,30,0.18)]"
            style={{
              transform: `translate3d(0, ${(Math.cos(localT * 2.4) * 8).toFixed(1)}px, 0)`,
            }}
          >
            <div className="text-[38px] font-black text-red-600 font-mono leading-none tracking-tight">
              {Math.floor(lerp(240000000, 916600000, camProg)).toLocaleString()}+
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[22px] font-black tracking-wider text-stone-900 uppercase">
                ANNUAL ORDERS
              </span>
              <span className="px-2.5 py-0.5 bg-red-600 text-white font-mono text-[13px] font-bold rounded-md">
                FY26 SCALE
              </span>
            </div>
          </div>
        </div>

        {/* PLANE 5 (Z = +310px): Near-Camera Out-of-Focus Framing Brackets (DOF Bokeh) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: "translate3d(0px, 0px, 310px) scale(0.84)",
            filter: "blur(4px)",
            opacity: 0.42,
          }}
        >
          <div className="absolute left-12 top-12 w-28 h-28 border-t-8 border-l-8 border-stone-700 rounded-tl-xl" />
          <div className="absolute right-12 top-12 w-28 h-28 border-t-8 border-r-8 border-stone-700 rounded-tr-xl" />
          <div className="absolute left-12 bottom-12 w-28 h-28 border-b-8 border-l-8 border-stone-700 rounded-bl-xl" />
          <div className="absolute right-12 bottom-12 w-28 h-28 border-b-8 border-r-8 border-stone-700 rounded-br-xl" />
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * RIG 2: 4-TIER 3D ISOMETRIC EXPLODED-VIEW CAD ARCHITECTURE & SUPPLY CHAIN
 *    - Engineering Cobalt-Cyan Blueprint background (#1B4379 -> #102A52, NO BLACK)
 *    - 4 stacked isometric slabs that vertically separate in 3D Z-space
 *    - Pulsing vertical laser data conduits + orthographic callout leader lines
 * ============================================================================ */

export const HeavyIsometricExplodedArchitectureRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const explode = cubicBezier(
    windowProgress(localT, 0.15, 1.45),
    0.22,
    1,
    0.36,
    1
  );
  const rotZ = lerp(-46, -34, windowProgress(localT, 0, 4.0));
  const calloutDraw = AE_SNAP(windowProgress(localT, 0.85, 0.95));

  const tiers = [
    {
      idx: 0,
      zBase: 0,
      zExpanded: -195,
      title: "TIER 01 // HYPERLOCAL 1.5KM CATCHMENT MESH",
      metric: "15 km/h Calm Rider Dispatch · Zero Highway Transit",
      accent: "#38BDF8",
      bg: "rgba(14, 58, 118, 0.92)",
    },
    {
      idx: 1,
      zBase: 18,
      zExpanded: -55,
      title: "TIER 02 // 2,243 MICRO-WAREHOUSE FLOORPLANS",
      metric: "High-Frequency Velocity Shelves · 85s Barcode Pick",
      accent: "#F8CB46",
      bg: "rgba(20, 72, 142, 0.92)",
    },
    {
      idx: 2,
      zBase: 36,
      zExpanded: 85,
      title: "TIER 03 // AI DEMAND & INVENTORY PREDICTION",
      metric: "Real-Time Replenishment from Hyperpure Mother Hubs",
      accent: "#34D399",
      bg: "rgba(26, 88, 168, 0.92)",
    },
    {
      idx: 3,
      zBase: 54,
      zExpanded: 225,
      title: "TIER 04 // CONSUMER CHECKOUT & SEARCH AD ENGINE",
      metric: "₹660+ AOV · High-Margin Sponsored Search Slotting",
      accent: "#F472B6",
      bg: "rgba(32, 102, 190, 0.94)",
    },
  ];

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #235396 0%, #163768 60%, #0E2446 100%)",
      }}
    >
      {/* Engineering CAD Millimeter Grid & Blueprint Frame */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(147,197,253,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,197,253,0.22) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-8 border-2 border-sky-300/30 rounded-xl pointer-events-none" />

      {/* Top Blueprint Header */}
      <div className="absolute top-14 left-16 z-20">
        <div className="text-[14px] font-mono font-bold tracking-[0.3em] text-sky-300 uppercase">
          CAD SCHEMATIC // 4-TIER EXPLODED ISOMETRIC ARCHITECTURE
        </div>
        <div className="mt-1 text-[46px] font-black text-white tracking-tight">
          INSIDE THE 10-MINUTE STACK
        </div>
      </div>

      {/* 3D ISOMETRIC EXPLODED STACK */}
      <div
        className="relative w-[620px] h-[420px] mt-16"
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1300px) rotateX(60deg) rotateZ(${rotZ.toFixed(
            2
          )}deg)`,
        }}
      >
        {/* 4 Corner Vertical Laser Conduits Connecting All Slabs */}
        {[
          { left: "24px", top: "24px" },
          { left: "596px", top: "24px" },
          { left: "24px", top: "396px" },
          { left: "596px", top: "396px" },
        ].map((pos, cIdx) => (
          <div
            key={cIdx}
            className="absolute w-[4px] h-[440px] bg-gradient-to-b from-pink-400 via-amber-300 to-sky-400"
            style={{
              left: pos.left,
              top: pos.top,
              transformOrigin: "top center",
              transform: `rotateX(-90deg) translateY(-200px) scaleY(${explode.toFixed(
                3
              )})`,
              boxShadow: "0 0 18px rgba(56,189,248,0.8)",
            }}
          />
        ))}

        {tiers.map((tier) => {
          const zPos = lerp(tier.zBase, tier.zExpanded, explode);
          return (
            <div
              key={tier.idx}
              className="absolute inset-0 rounded-3xl border-[3px] p-7 flex flex-col justify-between"
              style={{
                backgroundColor: tier.bg,
                borderColor: tier.accent,
                transform: `translate3d(0px, 0px, ${zPos.toFixed(1)}px)`,
                boxShadow: `0 18px 0 rgba(9, 25, 52, 0.85), 0 0 35px ${tier.accent}44`,
              }}
            >
              {/* Top Row Inside Isometric Slab */}
              <div className="flex items-center justify-between">
                <span
                  className="px-3 py-1 rounded-md font-mono text-[14px] font-black text-slate-950"
                  style={{ backgroundColor: tier.accent }}
                >
                  LAYER 0{tier.idx + 1} · Z={Math.round(zPos)}MM
                </span>
                <span className="font-mono text-[13px] text-sky-200 font-bold">
                  CAD_REV_4.2
                </span>
              </div>

              {/* Custom Vector Schematic Graphic Inside Each Slab */}
              <svg className="w-full h-[180px]" viewBox="0 0 540 160">
                {tier.idx === 0 && (
                  <>
                    {/* Hexagonal Catchment Grid & Rider Route */}
                    <circle cx="160" cy="80" r="62" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="8 6" />
                    <circle cx="370" cy="80" r="62" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="8 6" />
                    <path
                      d="M 90 120 Q 210 20, 270 80 T 450 45"
                      fill="none"
                      stroke="#F8CB46"
                      strokeWidth="5"
                      strokeDasharray="480"
                      strokeDashoffset={(480 * (1 - calloutDraw)).toFixed(1)}
                    />
                    <circle cx="160" cy="80" r="9" fill="#F8CB46" />
                    <circle cx="370" cy="80" r="9" fill="#38BDF8" />
                  </>
                )}
                {tier.idx === 1 && (
                  <>
                    {/* Warehouse Picking Aisle Racks */}
                    {Array.from({ length: 8 }).map((_, r) => (
                      <rect
                        key={r}
                        x={35 + r * 62}
                        y="22"
                        width="38"
                        height="115"
                        rx="5"
                        fill={r % 2 === 0 ? "rgba(248,203,70,0.35)" : "rgba(56,189,248,0.22)"}
                        stroke="#F8CB46"
                        strokeWidth="2"
                      />
                    ))}
                    <path
                      d="M 54 130 L 54 35 L 178 35 L 178 130 L 302 130 L 302 35 L 426 35"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="4.5"
                      strokeDasharray="600"
                      strokeDashoffset={(600 * (1 - calloutDraw)).toFixed(1)}
                    />
                  </>
                )}
                {tier.idx === 2 && (
                  <>
                    {/* AI Neural Routing Graph */}
                    {[80, 190, 300, 410].map((nx, ni) => (
                      <g key={ni}>
                        <line x1={nx} y1="35" x2={nx + 55} y2="125" stroke="#34D399" strokeWidth="2.5" />
                        <line x1={nx} y1="125" x2={nx + 55} y2="35" stroke="#38BDF8" strokeWidth="2.5" />
                        <circle cx={nx} cy="35" r="11" fill="#34D399" />
                        <circle cx={nx} cy="125" r="11" fill="#F8CB46" />
                      </g>
                    ))}
                  </>
                )}
                {tier.idx === 3 && (
                  <>
                    {/* Consumer Checkout & Ad Conversion Bars */}
                    <rect x="30" y="25" width="210" height="110" rx="14" fill="rgba(244,114,182,0.25)" stroke="#F472B6" strokeWidth="2.5" />
                    <text x="55" y="75" fill="#ffffff" fontSize="28" fontWeight="900" fontFamily="monospace">09:42 MIN</text>
                    <text x="55" y="105" fill="#F472B6" fontSize="14" fontWeight="700" fontFamily="monospace">LIVE ETA LOCK</text>
                    <rect x="270" y="25" width="240" height="110" rx="14" fill="rgba(248,203,70,0.25)" stroke="#F8CB46" strokeWidth="2.5" />
                    <text x="295" y="75" fill="#F8CB46" fontSize="28" fontWeight="900" fontFamily="monospace">₹660+ AOV</text>
                    <text x="295" y="105" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily="monospace">+AD SLOTTING</text>
                  </>
                )}
              </svg>

              <div className="text-[18px] font-black text-white tracking-wide">
                {tier.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2D Orthographic Screen-Space Callout Cards on Left & Right Margins */}
      <div className="absolute inset-0 pointer-events-none">
        {tiers.map((tier, idx) => {
          const isLeft = idx % 2 === 0;
          const topY = 230 + idx * 185;
          const cardProg = springODE(Math.max(0, localT - 0.55 - idx * 0.14), 20, 0.75).value;
          return (
            <div
              key={tier.idx}
              className={`absolute w-[430px] rounded-2xl p-5 border-2 backdrop-blur-md shadow-2xl ${
                isLeft ? "left-16" : "right-16"
              }`}
              style={{
                top: `${topY}px`,
                backgroundColor: "rgba(16, 42, 82, 0.88)",
                borderColor: tier.accent,
                opacity: clamp(cardProg * 1.3, 0, 1),
                transform: `translate3d(${
                  isLeft ? lerp(-45, 0, cardProg) : lerp(45, 0, cardProg)
                }px, 0, 0)`,
              }}
            >
              <div
                className="text-[13px] font-mono font-bold uppercase tracking-widest"
                style={{ color: tier.accent }}
              >
                {tier.title}
              </div>
              <div className="mt-1.5 text-[19px] font-bold text-white leading-snug">
                {tier.metric}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
 * RIG 3: VOX MUSTARD GRID DICTIONARY RIG -> 12-LOUVER 3D FLIP -> STACKED PROOFS
 *    (Learned from Vox 2026 Reel `aCn_jxFuKc8` Panels 7, 8 & 11)
 *    - Phase A: Vibrant Mustard-Gold Architectural Grid (#F5C518) with Vox
 *      Dictionary Etymology Card + Halftone Cutout
 *    - Phase B: 12-Column Venetian Louver 3D Flip into Cool Silver-Alabaster
 *      Studio (#E2E8F0) with 3D Stacked Analyst/Press Proof Cards & Yellow Sweeps
 * ============================================================================ */

export const HeavyEditorialMustardGridStackedProofRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const louverWave = windowProgress(localT, 1.75, 0.75);
  const hl1 = AE_SNAP(windowProgress(localT, 2.35, 0.55));
  const hl2 = AE_SNAP(windowProgress(localT, 2.75, 0.55));
  const hl3 = AE_SNAP(windowProgress(localT, 3.15, 0.55));

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden select-none">
      {/* WORLD A: VOX MUSTARD-GOLD ARCHITECTURAL GRID + DICTIONARY CARD */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #FACC15 0%, #EAB308 65%, #CA8A04 100%)",
        }}
      >
        {/* Crisp White Millimeter Grid Lines (`vox_reel_2026_grid.jpg` Panel 7) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.55) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(255,255,255,0.55) 1.5px, transparent 1.5px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Central Floating Vox Dictionary & Etymology Card */}
        <div
          className="relative w-[1240px] bg-[#FFFDF7] rounded-3xl p-14 border-4 border-stone-900 shadow-[24px_28px_0px_rgba(28,25,23,0.9)] flex items-center gap-12"
          style={{
            transform: `scale(${springODE(localT, 20, 0.72).value.toFixed(3)})`,
          }}
        >
          <div className="flex-1">
            <div className="inline-block px-4 py-1 bg-stone-900 text-amber-300 font-mono text-[14px] font-bold tracking-[0.25em] uppercase rounded">
              LEXICON OF MODERN COMMERCE // VOX RIG
            </div>
            <div className="mt-5 flex items-baseline gap-5">
              <span className="text-[78px] font-black text-stone-900 tracking-tight leading-none font-serif">
                dark store
              </span>
              <span className="text-[28px] font-mono text-stone-500">
                /ˈdɑːrk ˌstɔːr/ · noun
              </span>
            </div>
            <div className="mt-5 text-[28px] text-stone-800 leading-relaxed font-serif">
              1. A neighborhood micro-fulfillment center closed to walk-in shoppers, engineered exclusively for{" "}
              <span className="bg-amber-300 px-2 font-bold text-stone-950">
                sub-90-second algorithmic barcode picking
              </span>{" "}
              and 10-minute radial dispatch.
            </div>
          </div>

          {/* Right Halftone Cutout Subject with Stamp */}
          <div className="w-[310px] h-[340px] bg-stone-100 rounded-2xl border-3 border-stone-900 p-4 flex flex-col justify-between shrink-0 relative overflow-hidden">
            <img
              src="/images/scene_blinkit_dark_store.jpg"
              alt="Dark Store Aisle"
              className="w-full h-[235px] object-cover rounded-xl"
              style={{ filter: "contrast(1.18) saturate(1.1)" }}
            />
            <div className="text-center font-mono text-[16px] font-black text-stone-900 tracking-wider">
              FIG 2.4 · 1.5KM DENSITY
            </div>
          </div>
        </div>
      </div>

      {/* WORLD B: 12-COLUMN VENETIAN LOUVER WIPE INTO SILVER-ALABASTER 3D STACKED PROOF CARDS */}
      {louverWave > 0.001 && (
        <div className="absolute inset-0">
          {/* 12 Vertical Louver Blades Clipping World B */}
          <svg className="absolute inset-0 w-0 h-0">
            <defs>
              <clipPath id="venetianLouverClip">
                {Array.from({ length: 12 }).map((_, c) => {
                  const colStart = c * 0.045;
                  const colProg = clamp((louverWave - colStart) / 0.5, 0, 1);
                  const w = cubicBezier(colProg, 0.22, 1, 0.36, 1) * 162;
                  return (
                    <rect
                      key={c}
                      x={c * 160}
                      y={0}
                      width={w}
                      height={1080}
                    />
                  );
                })}
              </clipPath>
            </defs>
          </svg>

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: "url(#venetianLouverClip)",
              background:
                "radial-gradient(circle at 50% 35%, #F8FAFC 0%, #E2E8F0 60%, #CBD5E1 100%)",
            }}
          >
            {/* 3D Tilted Stack of 3 Analyst & Press Verification Cards (`vox_reel_2026_grid.jpg` Panel 8) */}
            <div
              className="relative w-[1340px] h-[820px] flex flex-col justify-center gap-7"
              style={{
                transform: `perspective(1200px) rotateX(10deg) rotateY(-11deg) rotateZ(1.5deg) scale(${lerp(
                  0.9,
                  1.02,
                  louverWave
                ).toFixed(3)})`,
              }}
            >
              {/* Card 1 */}
              <div
                className="w-[1180px] self-start bg-white rounded-2xl p-8 border border-slate-300 shadow-[0_25px_60px_rgba(15,23,42,0.16)]"
                style={{
                  transform: `translate3d(0, ${lerp(40, 0, hl1).toFixed(1)}px, 40px)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/images/01_blinkit_logo_color.png"
                    alt="Blinkit"
                    className="w-14 h-14 rounded-xl object-contain bg-amber-300 p-1.5"
                  />
                  <div>
                    <div className="text-[22px] font-black text-slate-900">
                      Goldman Sachs &amp; Eternal Q4 Institutional Note
                    </div>
                    <div className="text-[14px] font-mono text-slate-500">
                      VERIFIED EQUITY RESEARCH · TARGET VALUATION EXCEEDS CORE FOOD DELIVERY
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-[25px] text-slate-800 leading-relaxed">
                  &ldquo;{" "}
                  <span className="relative inline-block font-bold text-slate-950">
                    <span
                      className="absolute inset-y-0.5 left-0 bg-[#FEF08A]"
                      style={{ width: `${(hl1 * 100).toFixed(1)}%` }}
                    />
                    <span className="relative z-10">
                      Blinkit achieved Adjusted EBITDA breakeven in March 2024
                    </span>
                  </span>{" "}
                  and now commands a dominant 46% share of Indian quick-commerce.&rdquo;
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="w-[1180px] self-center bg-white rounded-2xl p-8 border border-slate-300 shadow-[0_25px_60px_rgba(15,23,42,0.16)]"
                style={{
                  transform: `translate3d(0, ${lerp(40, 0, hl2).toFixed(1)}px, 80px)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/images/03_zomato_logo_color.png"
                    alt="Zomato"
                    className="w-14 h-14 rounded-xl object-contain bg-red-50 p-1.5"
                  />
                  <div>
                    <div className="text-[22px] font-black text-slate-900">
                      Eternal Shareholder Letter // FY26 Operating Telemetry
                    </div>
                    <div className="text-[14px] font-mono text-slate-500">
                      PUBLIC EXCHANGE DISCLOSURE · B2C QUICK COMMERCE ENGINE
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-[25px] text-slate-800 leading-relaxed">
                  &ldquo;Average Order Value surged past{" "}
                  <span className="relative inline-block font-bold text-slate-950">
                    <span
                      className="absolute inset-y-0.5 left-0 bg-[#BBF7D0]"
                      style={{ width: `${(hl2 * 100).toFixed(1)}%` }}
                    />
                    <span className="relative z-10">
                      ₹660+ driven by general merchandise, electronics, and high-margin search ads.
                    </span>
                  </span>
                  &rdquo;
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="w-[1180px] self-end bg-white rounded-2xl p-8 border border-slate-300 shadow-[0_25px_60px_rgba(15,23,42,0.16)]"
                style={{
                  transform: `translate3d(0, ${lerp(40, 0, hl3).toFixed(1)}px, 120px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[22px] font-black text-slate-900">
                    Sector Consolidation Verdict (2022–2026)
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[13px] font-bold">
                    3-PLAYER OLIGOPOLY
                  </span>
                </div>
                <div className="mt-3 text-[24px] text-slate-800">
                  While Ola Dash &amp; Dunzo Daily shuttered,{" "}
                  <span className="relative inline-block font-bold text-slate-950">
                    <span
                      className="absolute inset-y-0.5 left-0 bg-[#FDE68A]"
                      style={{ width: `${(hl3 * 100).toFixed(1)}%` }}
                    />
                    <span className="relative z-10">
                      Blinkit scaled to 2,243 dark stores and ₹37,779 Crore annualized revenue.
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * RIG 4: QUANTITATIVE SANKEY CAPITAL FLOW + 6-AXIS POLAR RADAR + CANDLESTICKS
 *    - Financial Times / Stripe Press Salmon-Cream Parchment (#F6E9D7 -> #E8D4B9)
 *    - Left: Multi-Stream Cubic-Bezier Sankey Diagram with flowing capital particles
 *    - Top-Right: 6-Axis Polar Spider/Radar Chart (Blinkit vs Zepto vs Slotted)
 *    - Bottom-Right: 16-Bar Animated Financial Waterfall & Moving Average Spline
 * ============================================================================ */

const SANKEY_PATHS: { d: string; color: string; width: number; label: string; val: string }[] = [
  {
    d: "M 160 340 C 440 340, 520 220, 820 220",
    color: "#D97706",
    width: 44,
    label: "DARK STORE FULFILLMENT & RIDER FLEET",
    val: "₹28,400 Cr",
  },
  {
    d: "M 160 385 C 440 385, 520 400, 820 400",
    color: "#059669",
    width: 28,
    label: "CONTRIBUTION & EBITDA MARGIN EXPANSION",
    val: "₹6,120 Cr",
  },
  {
    d: "M 160 420 C 440 420, 520 570, 820 570",
    color: "#2563EB",
    width: 22,
    label: "NEW DARK STORE CAPEX (2,243 HUBS)",
    val: "₹3,259 Cr",
  },
  {
    d: "M 160 660 C 440 660, 520 425, 820 425",
    color: "#7C3AED",
    width: 24,
    label: "HIGH-MARGIN SEARCH & BRAND AD REVENUE",
    val: "₹1,850 Cr Pure Margin",
  },
];

export const HeavyQuantitativeSankeyAndRadarRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const flowDraw = cubicBezier(windowProgress(localT, 0.1, 1.35), 0.22, 1, 0.36, 1);
  const radarMorph = springODE(Math.max(0, localT - 0.35), 16, 0.68).value;

  // 6-Axis Polar Radar Angles
  const axes = [
    "SPEED (10M)",
    "SKU DEPTH",
    "AOV (₹660+)",
    "RETENTION",
    "AD MARGIN",
    "STORE MESH",
  ];
  const blinkitScores = [0.96, 0.92, 0.9, 0.94, 0.92, 0.95];
  const zeptoScores = [0.92, 0.76, 0.74, 0.82, 0.75, 0.72];

  const buildRadarPoints = (scores: number[], progress: number) =>
    scores
      .map((s, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
        const r = s * 125 * clamp(progress, 0, 1.08);
        const x = 230 + Math.cos(angle) * r;
        const y = 175 + Math.sin(angle) * r;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none p-14 flex flex-col justify-between"
      style={{
        background:
          "radial-gradient(circle at 40% 30%, #FDF6EC 0%, #F4E4CE 60%, #E6CFAF 100%)",
      }}
    >
      {/* Editorial Financial Times Ruling Header */}
      <div className="flex items-end justify-between border-b-2 border-stone-800 pb-4">
        <div>
          <div className="text-[14px] font-mono font-bold tracking-[0.28em] text-amber-900 uppercase">
            QUANTITATIVE INSTITUTIONAL TELEMETRY // FT SALMON-PARCHMENT EDITION
          </div>
          <div className="mt-1 text-[48px] font-black text-stone-900 tracking-tight leading-none font-serif">
            UNIT ECONOMICS &amp; MULTI-STREAM CAPITAL FLOW
          </div>
        </div>
        <div className="text-right font-mono text-[15px] text-stone-700 font-bold">
          FY26 ANNUALIZED RUN-RATE · ZERO BLACK BG
        </div>
      </div>

      {/* Main 12-Column Quantitative Grid */}
      <div className="grid grid-cols-12 gap-8 h-[810px] mt-6">
        {/* LEFT 7 COLUMNS: MULTI-STREAM CUBIC-BEZIER SANKEY FLOW DIAGRAM */}
        <div className="col-span-7 bg-[#FFFDF9]/90 rounded-3xl border-2 border-stone-800/20 p-8 shadow-[0_24px_50px_rgba(120,85,40,0.14)] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[15px] font-black text-stone-800 uppercase tracking-wider">
              FIG 1.0 // CUBIC-BEZIER SANKEY REVENUE ALLOCATION
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-400 text-amber-900 font-mono text-[13px] font-bold">
              TOTAL FLOW: ₹39,629 CR
            </span>
          </div>

          <svg className="w-full h-[640px] overflow-visible" viewBox="0 0 1020 680">
            {/* Source Nodes on Left */}
            <rect x="20" y="260" width="140" height="210" rx="16" fill="#1C1917" />
            <text x="38" y="345" fill="#F8CB46" fontSize="15" fontWeight="800" fontFamily="monospace">
              CORE GOV
            </text>
            <text x="38" y="380" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="monospace">
              ₹37,779Cr
            </text>

            <rect x="20" y="595" width="140" height="115" rx="16" fill="#5B21B6" />
            <text x="38" y="645" fill="#DDD6FE" fontSize="14" fontWeight="800" fontFamily="monospace">
              SEARCH ADS
            </text>
            <text x="38" y="678" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="monospace">
              ₹1,850Cr
            </text>

            {/* Animated Sankey Ribbons */}
            {SANKEY_PATHS.map((sp, idx) => (
              <g key={idx}>
                <path
                  d={sp.d}
                  fill="none"
                  stroke={sp.color}
                  strokeWidth={sp.width}
                  strokeOpacity={0.22}
                />
                <path
                  d={sp.d}
                  fill="none"
                  stroke={sp.color}
                  strokeWidth={sp.width}
                  strokeOpacity={0.82}
                  strokeLinecap="round"
                  strokeDasharray="900"
                  strokeDashoffset={(900 * (1 - flowDraw)).toFixed(1)}
                />
                {/* Output Label Box */}
                <rect
                  x="830"
                  y={idx === 0 ? 185 : idx === 1 ? 375 : idx === 2 ? 535 : 435}
                  width="185"
                  height="68"
                  rx="10"
                  fill="#FFFBEB"
                  stroke={sp.color}
                  strokeWidth="2.5"
                  opacity={idx === 3 ? 0 : flowDraw}
                />
                {idx < 3 && (
                  <>
                    <text
                      x="844"
                      y={idx === 0 ? 212 : idx === 1 ? 402 : 562}
                      fill="#1C1917"
                      fontSize="12"
                      fontWeight="800"
                      fontFamily="monospace"
                    >
                      {sp.label.slice(0, 22)}
                    </text>
                    <text
                      x="844"
                      y={idx === 0 ? 238 : idx === 1 ? 428 : 588}
                      fill={sp.color}
                      fontSize="20"
                      fontWeight="900"
                      fontFamily="monospace"
                    >
                      {sp.val}
                    </text>
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* RIGHT 5 COLUMNS: 6-AXIS POLAR RADAR + CANDLESTICK WATERFALL */}
        <div className="col-span-5 flex flex-col gap-7">
          {/* Top-Right: 6-Axis Polar Spider/Radar Chart */}
          <div className="flex-1 bg-[#FFFDF9]/90 rounded-3xl border-2 border-stone-800/20 p-6 shadow-[0_24px_50px_rgba(120,85,40,0.14)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[14px] font-black text-stone-800 uppercase">
                FIG 1.1 // 6-AXIS COMPETITIVE POLAR RADAR
              </span>
              <div className="flex items-center gap-4 font-mono text-[12px] font-bold">
                <span className="text-amber-600">■ BLINKIT (46%)</span>
                <span className="text-purple-600">■ ZEPTO (32%)</span>
              </div>
            </div>

            <svg className="w-full h-[310px]" viewBox="0 0 460 340">
              {/* Concentric Hexagon Rings */}
              {[0.33, 0.66, 1.0].map((ring, rIdx) => (
                <polygon
                  key={rIdx}
                  points={buildRadarPoints([ring, ring, ring, ring, ring, ring], 1)}
                  fill="none"
                  stroke="#D6D3D1"
                  strokeWidth="1.5"
                />
              ))}
              {/* Axis Spokes & Labels */}
              {axes.map((label, i) => {
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
                const x2 = 230 + Math.cos(angle) * 128;
                const y2 = 175 + Math.sin(angle) * 128;
                const lx = 230 + Math.cos(angle) * 162;
                const ly = 175 + Math.sin(angle) * 150;
                return (
                  <g key={label}>
                    <line x1="230" y1="175" x2={x2} y2={y2} stroke="#A8A29E" strokeWidth="1.5" />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      fill="#292524"
                      fontSize="12"
                      fontWeight="800"
                      fontFamily="monospace"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
              {/* Zepto Polygon */}
              <polygon
                points={buildRadarPoints(zeptoScores, radarMorph)}
                fill="rgba(124, 58, 237, 0.22)"
                stroke="#7C3AED"
                strokeWidth="3"
              />
              {/* Blinkit Polygon */}
              <polygon
                points={buildRadarPoints(blinkitScores, radarMorph)}
                fill="rgba(217, 119, 6, 0.32)"
                stroke="#D97706"
                strokeWidth="4"
              />
            </svg>
          </div>

          {/* Bottom-Right: 16-Quarter EBITDA & GOV Waterfall Chart */}
          <div className="h-[340px] bg-[#FFFDF9]/90 rounded-3xl border-2 border-stone-800/20 p-6 shadow-[0_24px_50px_rgba(120,85,40,0.14)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[14px] font-black text-stone-800 uppercase">
                FIG 1.2 // QUARTERLY CONTRIBUTION WATERFALL
              </span>
              <span className="text-emerald-700 font-mono text-[13px] font-bold">
                +EBITDA BREAKEVEN LOCKED
              </span>
            </div>

            <svg className="w-full h-[230px]" viewBox="0 0 640 220">
              <line x1="20" y1="145" x2="620" y2="145" stroke="#78716C" strokeWidth="1.5" strokeDasharray="6 4" />
              {Array.from({ length: 14 }).map((_, i) => {
                const barProg = springODE(Math.max(0, localT - 0.15 - i * 0.06), 20, 0.72).value;
                const isPositive = i >= 6;
                const bh = isPositive ? (i - 5) * 15 * barProg : (6 - i) * 11 * barProg;
                const by = isPositive ? 145 - bh : 145;
                return (
                  <rect
                    key={i}
                    x={32 + i * 42}
                    y={by}
                    width="28"
                    height={Math.max(4, bh)}
                    rx="5"
                    fill={isPositive ? "#059669" : "#E11D48"}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * RIG 5: REAL-TIME 3D ORTHOGRAPHIC GEODESIC GLOBE + DYNAMIC CITY TETHERS
 *    (Learned from Abdy Studio / Vox Sky-Blue Rig `edit_like_vox_grid.jpg`)
 *    - Pastel Sky-Blue & Cloud Alabaster Studio background (#D8EEFE -> #B6DDFB)
 *    - True spherical-to-orthographic 3D projection computed per frame t
 *    - Great-circle parabolic supply arcs + dynamic screen-space city callouts
 *    - Bottom live oscilloscope waveform spine
 * ============================================================================ */

const INDIAN_HUBS = [
  { name: "DELHI NCR (HQ)", stores: "640 Hubs", lat: 28.6, lon: 77.2, cardX: 210, cardY: 220 },
  { name: "BENGALURU TECH", stores: "485 Hubs", lat: 12.9, lon: 77.6, cardX: 210, cardY: 640 },
  { name: "MUMBAI METRO", stores: "430 Hubs", lat: 19.0, lon: 72.8, cardX: 1420, cardY: 220 },
  { name: "HYDERABAD & PUNE", stores: "390 Hubs", lat: 17.4, lon: 78.5, cardX: 1420, cardY: 640 },
];

export const Heavy3DGlobeAndOrbitalNetworkRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const globeScale = springODE(localT, 18, 0.74).value;
  const centerLon = lerp(45, 78, cubicBezier(windowProgress(localT, 0, 3.8), 0.22, 1, 0.36, 1));
  const centerLat = lerp(12, 21, windowProgress(localT, 0, 3.8));

  const R = 320 * globeScale;
  const cx = 960;
  const cy = 510;

  // Orthographic Spherical Projection Helper
  const projectLatLon = (latDeg: number, lonDeg: number) => {
    const phi = (latDeg * Math.PI) / 180;
    const lam = (lonDeg * Math.PI) / 180;
    const phi0 = (centerLat * Math.PI) / 180;
    const lam0 = (centerLon * Math.PI) / 180;

    const x = R * Math.cos(phi) * Math.sin(lam - lam0);
    const y =
      R *
      (Math.cos(phi0) * Math.sin(phi) -
        Math.sin(phi0) * Math.cos(phi) * Math.cos(lam - lam0));
    const z =
      Math.sin(phi0) * Math.sin(phi) +
      Math.cos(phi0) * Math.cos(phi) * Math.cos(lam - lam0);

    return { x: cx + x, y: cy - y, z };
  };

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #F0F9FF 0%, #D8EEFE 55%, #B6DDFB 100%)",
      }}
    >
      {/* Top Studio Header */}
      <div className="absolute top-12 left-16 z-20">
        <div className="text-[14px] font-mono font-bold tracking-[0.28em] text-sky-800 uppercase">
          ORTHOGRAPHIC SPHERICAL PROJECTION // DAYLIGHT GEO-STUDIO
        </div>
        <div className="mt-1 text-[48px] font-black text-slate-900 tracking-tight leading-none">
          NATIONAL DARK-STORE TELEMETRY NETWORK
        </div>
      </div>

      {/* Central 3D Orthographic Globe + Dynamic Tethers SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <radialGradient id="globeDaylightGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </radialGradient>
        </defs>

        {/* Outer Orbital Telemetry Rings */}
        <circle
          cx={cx}
          cy={cy}
          r={R + 55}
          fill="none"
          stroke="#0284C7"
          strokeWidth="1.5"
          strokeDasharray="10 8"
          strokeOpacity="0.45"
        />
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="url(#globeDaylightGrad)"
          stroke="#0369A1"
          strokeWidth="4"
        />

        {/* Latitude Graticule Curves */}
        {[-45, -20, 0, 20, 45].map((lat) => {
          const pts: string[] = [];
          for (let lon = -180; lon <= 180; lon += 8) {
            const p = projectLatLon(lat, lon);
            if (p.z > 0) pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
          }
          if (pts.length < 2) return null;
          return (
            <polyline
              key={`lat-${lat}`}
              points={pts.join(" ")}
              fill="none"
              stroke="#0284C7"
              strokeWidth="1.4"
              strokeOpacity="0.32"
            />
          );
        })}

        {/* Longitude Graticule Curves */}
        {Array.from({ length: 12 }).map((_, i) => {
          const lon = -150 + i * 30;
          const pts: string[] = [];
          for (let lat = -75; lat <= 75; lat += 6) {
            const p = projectLatLon(lat, lon);
            if (p.z > 0) pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
          }
          if (pts.length < 2) return null;
          return (
            <polyline
              key={`lon-${lon}`}
              points={pts.join(" ")}
              fill="none"
              stroke="#0284C7"
              strokeWidth="1.4"
              strokeOpacity="0.32"
            />
          );
        })}

        {/* Projected City Nodes + Dynamic Elbow Leader Lines to Floating Cards */}
        {INDIAN_HUBS.map((hub, idx) => {
          const p = projectLatLon(hub.lat, hub.lon);
          const targetX = idx < 2 ? hub.cardX + 310 : hub.cardX;
          const targetY = hub.cardY + 55;
          return (
            <g key={hub.name}>
              {/* Pulsing City Shockwave */}
              <circle
                cx={p.x}
                cy={p.y}
                r={12 + ((localT * 18 + idx * 5) % 18)}
                fill="none"
                stroke="#EA580C"
                strokeWidth="2.5"
                opacity={0.6}
              />
              <circle cx={p.x} cy={p.y} r="8" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2.5" />

              {/* Dynamic Elbow Tether Line */}
              <polyline
                points={`${p.x.toFixed(1)},${p.y.toFixed(1)} ${((p.x + targetX) * 0.5).toFixed(
                  1
                )},${targetY} ${targetX},${targetY}`}
                fill="none"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            </g>
          );
        })}

        {/* Bottom Abdy-Studio Live Oscilloscope / Audio Waveform Spine (`edit_like_vox_grid.jpg`) */}
        <g transform="translate(0, 945)">
          <line x1="260" y1="0" x2="1660" y2="0" stroke="#0369A1" strokeWidth="2" strokeOpacity="0.4" />
          {Array.from({ length: 45 }).map((_, wIdx) => {
            const x = 520 + wIdx * 20;
            const distCenter = Math.abs(wIdx - 22) / 22;
            const amp =
              Math.max(4, (1 - distCenter) * 44 * Math.abs(Math.sin(localT * 9 + wIdx * 0.55)));
            return (
              <line
                key={wIdx}
                x1={x}
                y1={-amp}
                x2={x}
                y2={amp}
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </svg>

      {/* 4 Floating Frosted-Acrylic City Callout Cards */}
      {INDIAN_HUBS.map((hub, idx) => {
        const pop = springODE(Math.max(0, localT - 0.2 - idx * 0.12), 20, 0.74).value;
        return (
          <div
            key={hub.name}
            className="absolute w-[310px] bg-white/90 backdrop-blur-xl rounded-2xl p-5 border-2 border-slate-900 shadow-[12px_14px_0px_#0F172A]"
            style={{
              left: `${hub.cardX}px`,
              top: `${hub.cardY}px`,
              transform: `scale(${pop.toFixed(3)})`,
            }}
          >
            <div className="text-[12px] font-mono font-bold text-sky-700 uppercase">
              LAT {hub.lat}°N · LON {hub.lon}°E
            </div>
            <div className="mt-1 text-[24px] font-black text-slate-900">{hub.name}</div>
            <div className="mt-1 text-[20px] font-mono font-bold text-orange-600">
              {hub.stores} · 9.4m Avg ETA
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * RIG 6: SWISS KINETIC TYPOGRAPHY MATRIX + CONCENTRIC MECHANICAL IRIS FINALE
 *    - Part A: Museum Sage-Limestone Board (#E6EBE4 -> #CED8CA) with Swiss
 *      International Modular Grid & Counter-Rotating Vernier Rings
 *    - Part B: Concentric Mechanical Iris expansion into Warm Sunlit Terracotta
 *      Parchment (#FDF3E7 -> #F3DEC3) with 3D Beveled Brand Pedestals
 * ============================================================================ */

export const HeavyKineticTypographyAndMechanicalIrisRig: React.FC<{
  localT: number;
}> = ({ localT }) => {
  const irisExpand = cubicBezier(
    windowProgress(localT, 1.85, 0.85),
    0.22,
    1,
    0.36,
    1
  );
  const irisRadius = lerp(0, 1280, irisExpand);
  const stopT = posterizeTime(localT, 12);

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden select-none">
      {/* PART A: MUSEUM SAGE-LIMESTONE SWISS MODULAR POSTER GRID */}
      <div
        className="absolute inset-0 p-14 flex flex-col justify-between"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #F1F5EF 0%, #DFE7DC 60%, #C7D3C3 100%)",
        }}
      >
        <div className="grid grid-cols-12 grid-rows-6 gap-5 h-full">
          {/* Cell 1: Giant Kinetic Masked Typography */}
          <div className="col-span-8 row-span-4 bg-[#FAFBF9] rounded-3xl border-3 border-emerald-950 p-10 flex flex-col justify-between shadow-[14px_16px_0px_#064E3B] overflow-hidden relative">
            <div className="flex justify-between items-center font-mono text-[14px] font-bold text-emerald-900">
              <span>SWISS INTERNATIONAL KINETIC GRID // 06</span>
              <span>12FPS + 30FPS HYBRID</span>
            </div>

            <div className="space-y-2 my-auto">
              {["10 MINUTES.", "2,243 STORES.", "ZERO BLACK BG."].map((line, lIdx) => {
                const slide = springODE(Math.max(0, localT - lIdx * 0.14), 22, 0.72).value;
                return (
                  <div key={line} className="overflow-hidden">
                    <div
                      className="text-[82px] font-black tracking-tight leading-[0.98] text-emerald-950"
                      style={{
                        transform: `translate3d(0, ${lerp(95, 0, slide).toFixed(1)}px, 0)`,
                      }}
                    >
                      {line}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[20px] font-medium text-emerald-900">
              Deterministic closed-form ODEs + Newton-Raphson splines rendered at 1080p30.
            </div>
          </div>

          {/* Cell 2: Counter-Rotating Mechanical Vernier Compass */}
          <div className="col-span-4 row-span-4 bg-emerald-900 rounded-3xl border-3 border-emerald-950 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-[14px_16px_0px_#064E3B]">
            <svg className="w-[340px] h-[340px]" viewBox="0 0 300 300">
              <circle
                cx="150"
                cy="150"
                r="128"
                fill="none"
                stroke="#A7F3D0"
                strokeWidth="3"
                strokeDasharray="16 8"
                transform={`rotate(${(localT * 42).toFixed(1)} 150 150)`}
              />
              <circle
                cx="150"
                cy="150"
                r="96"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="4"
                strokeDasharray="32 14"
                transform={`rotate(${(-localT * 58).toFixed(1)} 150 150)`}
              />
              <circle cx="150" cy="150" r="54" fill="#F8CB46" />
              <text
                x="150"
                y="158"
                textAnchor="middle"
                fill="#064E3B"
                fontSize="26"
                fontWeight="900"
                fontFamily="monospace"
              >
                46.0%
              </text>
            </svg>
            <div className="mt-3 font-mono text-[14px] font-bold text-emerald-200 tracking-widest uppercase">
              COUNTER-ROTATING VERNIER RIG
            </div>
          </div>

          {/* Cell 3: Bottom 12-Column Tactile Cutout Strip */}
          <div className="col-span-12 row-span-2 bg-[#FAFBF9] rounded-3xl border-3 border-emerald-950 p-8 flex items-center justify-between shadow-[14px_16px_0px_#064E3B]">
            <div className="flex items-center gap-6">
              <img
                src="/images/person_deepinder_goyal_color.png"
                alt="Deepinder Goyal"
                className="w-28 h-28 rounded-2xl object-cover border-3 border-emerald-950"
                style={{
                  transform: `rotate(${(Math.sin(stopT * 15) * 2.5).toFixed(2)}deg)`,
                }}
              />
              <div>
                <div className="text-[14px] font-mono font-bold text-emerald-800 uppercase">
                  ETERNAL GROUP ARCHITECT // STOP-MOTION CADENCE
                </div>
                <div className="text-[40px] font-black text-emerald-950 leading-tight">
                  READY FOR NODE 2 AUTONOMOUS PRODUCTION
                </div>
              </div>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-amber-300 border-2 border-emerald-950 font-mono text-[24px] font-black text-emerald-950">
              19 RIGS TOTAL
            </div>
          </div>
        </div>
      </div>

      {/* PART B: CONCENTRIC MECHANICAL IRIS EXPANSION INTO SUNLIT TERRACOTTA PARCHMENT */}
      {irisExpand > 0.001 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-16"
          style={{
            clipPath: `circle(${irisRadius.toFixed(1)}px at 960px 540px)`,
            background:
              "radial-gradient(circle at 50% 45%, #FFFDF9 0%, #FDF2E2 55%, #F2D8B5 100%)",
          }}
        >
          {/* Counter-Rotating Golden Engineering Rings Around Finale */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <circle
              cx="960"
              cy="540"
              r="470"
              fill="none"
              stroke="#D97706"
              strokeWidth="2"
              strokeDasharray="18 10"
              strokeOpacity="0.4"
              transform={`rotate(${(localT * 25).toFixed(1)} 960 540)`}
            />
            <circle
              cx="960"
              cy="540"
              r="410"
              fill="none"
              stroke="#B45309"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
          </svg>

          <div className="relative z-10 text-center max-w-[1400px]">
            <div className="inline-block px-5 py-1.5 rounded-full bg-amber-900 text-amber-100 font-mono text-[15px] font-bold tracking-[0.28em] uppercase">
              VOLUME 3 HEAVY ENGINE // DAYLIGHT EDITORIAL PALETTE
            </div>
            <div className="mt-5 text-[76px] font-black text-stone-900 tracking-tight leading-none">
              THE COMPLETE DOCUMENTARY ARSENAL
            </div>

            {/* 3D-Edged Beveled Brand Pedestal Cards on Sunlit Parchment */}
            <div className="mt-12 flex items-center justify-center gap-10">
              {[
                { name: "BLINKIT", stat: "₹37,779 Cr GOV", logo: "/images/01_blinkit_logo_color.png", border: "#D97706" },
                { name: "ZOMATO", stat: "Food Cash Cow", logo: "/images/03_zomato_logo_color.png", border: "#DC2626" },
                { name: "ETERNAL", stat: "Parent Empire", logo: "/images/09_eternal_logo_color.png", border: "#059669" },
              ].map((card, i) => {
                const pop = springODE(Math.max(0, localT - 2.05 - i * 0.1), 22, 0.7).value;
                return (
                  <div
                    key={card.name}
                    className="w-[360px] bg-white rounded-3xl p-7 border-3 flex flex-col items-center"
                    style={{
                      borderColor: card.border,
                      transform: `scale(${pop.toFixed(3)})`,
                      boxShadow: "0 16px 0 #292524, 0 28px 50px rgba(120,75,20,0.22)",
                    }}
                  >
                    <div className="w-24 h-24 rounded-2xl bg-stone-50 border border-stone-200 p-3 flex items-center justify-center">
                      <img src={card.logo} alt={card.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="mt-4 text-[32px] font-black text-stone-900">{card.name}</div>
                    <div className="mt-1 font-mono text-[17px] font-bold text-stone-600">
                      {card.stat}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * MASTER VOLUME 3 HEAVY SHOWCASE REEL (24-Second 6-Scene Demo, ZERO BLACK BG)
 * ============================================================================ */

export const TransitionsVol3HeavyShowcaseReel: React.FC<{ t: number }> = ({
  t,
}) => {
  const sceneDur = 4.0;
  const sceneIdx = clamp(Math.floor(t / sceneDur), 0, 5);
  const localT = t - sceneIdx * sceneDur;

  const labels = [
    "VOL.3 HEAVY - 01 // 5-PLANE 3D MULTIPLANE CAMERA RIG + PINK OBJECT TRACKER (Warm Sandstone BG)",
    "VOL.3 HEAVY - 02 // 4-TIER 3D ISOMETRIC EXPLODED CAD ARCHITECTURE (Engineering Blueprint BG)",
    "VOL.3 HEAVY - 03 // VOX MUSTARD GRID DICTIONARY -> 12-LOUVER FLIP -> 3D STACKED PROOFS",
    "VOL.3 HEAVY - 04 // QUANTITATIVE SANKEY CAPITAL FLOW + 6-AXIS POLAR RADAR (FT Salmon Parchment)",
    "VOL.3 HEAVY - 05 // 3D ORTHOGRAPHIC GEODESIC GLOBE + CITY TETHERS + WAVEFORM (Sky-Blue Studio)",
    "VOL.3 HEAVY - 06 // SWISS KINETIC TYPOGRAPHY MATRIX + MECHANICAL IRIS -> SUNLIT TERRACOTTA",
  ];

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-[#F4EFE6]">
      {sceneIdx === 0 && <Heavy5Layer3DParallaxCameraRig localT={localT} />}
      {sceneIdx === 1 && <HeavyIsometricExplodedArchitectureRig localT={localT} />}
      {sceneIdx === 2 && <HeavyEditorialMustardGridStackedProofRig localT={localT} />}
      {sceneIdx === 3 && <HeavyQuantitativeSankeyAndRadarRig localT={localT} />}
      {sceneIdx === 4 && <Heavy3DGlobeAndOrbitalNetworkRig localT={localT} />}
      {sceneIdx === 5 && <HeavyKineticTypographyAndMechanicalIrisRig localT={localT} />}

      {/* Warm Editorial Pill Badge (No black pill!) */}
      <div className="absolute bottom-5 left-8 z-50 px-5 py-2 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border-2 border-stone-800/30 text-stone-900 font-mono text-[13px] font-bold tracking-wider shadow-lg">
        {labels[sceneIdx]}
      </div>
    </div>
  );
};
