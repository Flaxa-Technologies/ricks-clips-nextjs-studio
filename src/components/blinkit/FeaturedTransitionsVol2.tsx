import React from "react";
import {
  AE_SNAP,
  buildArcLengthSpline,
  clamp,
  cubicBezier,
  lerp,
  Point2D,
  sampleArcLengthSpline,
  springODE,
  windowProgress,
} from "../../lib/kinematics";

/**
 * Quantizes time `t` to a target frame rate (e.g., 12 fps) to achieve the
 * signature Johnny Harris / Vox handmade stop-motion cutout feel while keeping
 * camera movement at native 30/60 fps.
 */
export function posterizeTime(t: number, fps = 12): number {
  return Math.floor(t * fps) / fps;
}

/* ============================================================================
 * 1. VOX RED-THREAD DETECTIVE BOARD + RED MARKER CIRCLE + MASKING TAPE
 *    (Learned from AEffecto Vox Tutorial `Ii3MVHwECys` Bottom Row)
 *    - Central polaroid portrait with masking tape strips & tilted black Dymo label
 *    - 4 corner archival photos connected by red pushpins & self-drawing red yarn
 *    - Hand-drawn red marker spiral loop circles the central subject
 * ============================================================================ */

const BOARD_THREADS: Point2D[][] = [
  [
    { x: 760, y: 340 },
    { x: 430, y: 260 },
  ],
  [
    { x: 1160, y: 340 },
    { x: 1490, y: 260 },
  ],
  [
    { x: 760, y: 740 },
    { x: 430, y: 820 },
  ],
  [
    { x: 1160, y: 740 },
    { x: 1490, y: 820 },
  ],
];

export const RedThreadEvidenceBoardRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const camZoom = cubicBezier(windowProgress(localT, 0.0, 3.8), 0.22, 1, 0.36, 1);
  const stringDraw = AE_SNAP(windowProgress(localT, 0.45, 1.1));
  const redCircleDraw = AE_SNAP(windowProgress(localT, 1.55, 0.85));
  const labelSlam = springODE(Math.max(0, localT - 2.1), 24, 0.65).value;

  const scale = lerp(0.92, 1.14, camZoom);

  const corners = [
    { x: 310, y: 230, rot: -4, title: "2013 GURUGRAM", img: "/images/scene_indian_kirana_store.jpg", at: 0.1 },
    { x: 1610, y: 230, rot: 4, title: "DARK STORE MESH", img: "/images/scene_blinkit_dark_store.jpg", at: 0.22 },
    { x: 310, y: 830, rot: 3, title: "ZOMATO LIFELINE", img: "/images/03_zomato_logo_color.png", at: 0.34 },
    { x: 1610, y: 830, rot: -3, title: "ETERNAL EMPIRE", img: "/images/09_eternal_logo_color.png", at: 0.46 },
  ];

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at 50% 50%, #d6d3d1 0%, #78716c 100%)",
      }}
    >
      {/* Volumetric Window Blind Shadow Bars (Vox lighting detail) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0px, transparent 220px, rgba(0,0,0,0.55) 220px, rgba(0,0,0,0.55) 340px)",
        }}
      />

      <div
        className="relative w-[1920px] h-[1080px]"
        style={{
          transform: `scale(${scale.toFixed(3)})`,
        }}
      >
        {/* 4 Corner Archival Evidence Photos with Masking Tape */}
        {corners.map((c, idx) => {
          const pop = springODE(Math.max(0, localT - c.at), 20, 0.72).value;
          return (
            <div
              key={idx}
              className="absolute w-[290px] bg-[#f5f5f4] p-3 pb-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)] border border-stone-400"
              style={{
                left: `${c.x - 145}px`,
                top: `${c.y - 115}px`,
                opacity: clamp(pop * 1.5, 0, 1),
                transform: `rotate(${c.rot}deg) scale(${lerp(0.75, 1, pop).toFixed(3)})`,
              }}
            >
              {/* Translucent Masking Tape Strip */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/80 rotate-2 shadow-sm border border-amber-200/60" />
              <div className={`w-full h-[165px] overflow-hidden flex items-center justify-center ${idx >= 2 ? "bg-white p-4" : "bg-zinc-900"}`}>
                <img
                  src={c.img}
                  alt={c.title}
                  className={`w-full h-full ${idx >= 2 ? "object-contain" : "object-cover"}`}
                  style={{ filter: "grayscale(85%) contrast(1.15)" }}
                />
              </div>
              <div className="mt-2 text-center font-mono text-[14px] font-bold tracking-widest text-zinc-800">
                {c.title}
              </div>
            </div>
          );
        })}

        {/* Red String Frame & Diagonal Yarn Web */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Outer Red Yarn Rectangle */}
          <rect
            x="760"
            y="300"
            width="400"
            height="480"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="6"
            strokeDasharray="1760"
            strokeDashoffset={(1760 * (1 - stringDraw)).toFixed(1)}
          />
          {/* Diagonal Spokes to Corner Evidence */}
          {BOARD_THREADS.map((pair, i) => (
            <line
              key={i}
              x1={pair[0].x}
              y1={pair[0].y}
              x2={lerp(pair[0].x, pair[1].x, stringDraw)}
              y2={lerp(pair[0].y, pair[1].y, stringDraw)}
              stroke="#dc2626"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          ))}
          {/* Red Pushpins */}
          {[
            { x: 760, y: 300 },
            { x: 1160, y: 300 },
            { x: 760, y: 780 },
            { x: 1160, y: 780 },
          ].map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="11"
              fill="#ef4444"
              stroke="#7f1d1d"
              strokeWidth="3"
            />
          ))}
        </svg>

        {/* Central Hero Polaroid Card */}
        <div
          className="absolute left-1/2 top-1/2 w-[360px] bg-[#fafaf9] p-5 pb-10 shadow-[0_32px_70px_rgba(0,0,0,0.55)] border border-stone-300"
          style={{
            transform: `translate(-50%, -50%) scale(${springODE(localT, 18, 0.74).value.toFixed(3)})`,
          }}
        >
          {/* Top Masking Tape */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-100/85 -rotate-2 shadow-sm" />

          <div className="w-full h-[330px] bg-stone-200 overflow-hidden relative">
            <img
              src="/images/person_albinder_dhindsa_mono.png"
              alt="Albinder Dhindsa"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-5 text-center font-mono text-[26px] font-bold tracking-[0.12em] text-zinc-900">
            ALBINDER DHINDSA
          </div>

          {/* Tilted Black Dymo Label Tape Stamp */}
          {labelSlam > 0.01 && (
            <div
              className="absolute -bottom-4 right-4 bg-zinc-950 text-white font-mono text-[18px] font-bold px-5 py-1.5 tracking-[0.2em] shadow-xl border border-white/20"
              style={{
                transform: `rotate(-12deg) scale(${labelSlam.toFixed(3)})`,
              }}
            >
              FOUNDER &amp; CEO
            </div>
          )}

          {/* Hand-Drawn Red Marker Spiral Loop Circling the Portrait */}
          <svg
            className="absolute -inset-6 w-[410px] h-[410px] pointer-events-none overflow-visible"
            viewBox="0 0 400 400"
          >
            <path
              d="M 75 180 C 65 75, 325 60, 335 185 C 345 305, 85 320, 68 205 C 58 125, 290 95, 315 165"
              fill="none"
              stroke="#dc2626"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="1100"
              strokeDashoffset={(1100 * (1 - redCircleDraw)).toFixed(1)}
              style={{ filter: "drop-shadow(0 6px 10px rgba(220,38,38,0.4))" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. VOX 3D SEARCH BAR AUTOCOMPLETE -> 3D ARTICLE MULTI-LINE HIGHLIGHT & RED PEN
 *    (Learned from Motion Nations `L-fVQ9cG2R8` Screen Recording Tutorial)
 *    - Phase A (0.0s - 1.75s): 3D tilted Google Search bar typing query + dropdown
 *    - Phase B (1.75s - 4.0s): 3D tilted Wikipedia/Filing page with multi-line
 *      yellow marker highlight AND hand-drawn red ink pen loop!
 * ============================================================================ */

export const VoxScreenRecording3DBrowser: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const query = "blinkit 10 minute delivery unit economics";
  const typedCount = Math.floor(
    clamp(windowProgress(localT, 0.1, 1.25), 0, 1) * query.length
  );
  const typedText = query.slice(0, typedCount);

  const flipToArticle = cubicBezier(
    windowProgress(localT, 1.65, 0.55),
    0.22,
    1,
    0.36,
    1
  );
  const line1Highlight = AE_SNAP(windowProgress(localT, 2.15, 0.55));
  const line2Highlight = AE_SNAP(windowProgress(localT, 2.55, 0.45));
  const redPenLoop = AE_SNAP(windowProgress(localT, 2.95, 0.75));

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden flex items-center justify-center select-none"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #f8fafc 0%, #cbd5e1 100%)",
      }}
    >
      {/* PHASE A: 3D TILTED GOOGLE SEARCH BAR AUTOCOMPLETE */}
      {flipToArticle < 0.99 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: 1 - flipToArticle,
            transform: `perspective(1100px) rotateX(14deg) rotateY(22deg) rotateZ(-4deg) scale(${lerp(
              0.92,
              1.18,
              windowProgress(localT, 0, 1.65)
            ).toFixed(3)})`,
          }}
        >
          <div className="w-[1060px] bg-white rounded-[32px] shadow-[0_40px_90px_rgba(15,23,42,0.22)] border border-slate-200 p-8">
            {/* Search Input Row */}
            <div className="flex items-center gap-5 border-b border-slate-200 pb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div className="text-[38px] font-medium text-slate-900 tracking-tight flex items-center">
                <span>{typedText}</span>
                <span className="inline-block w-[3px] h-[42px] bg-blue-600 ml-1" />
              </div>
            </div>

            {/* Autocomplete Dropdown Suggestions */}
            <div className="mt-5 space-y-4">
              {[
                "blinkit 10 minute delivery unit economics",
                "blinkit vs zepto market share 2026",
                "blinkit dark store picking algorithm 90 seconds",
                "zomato acquisition of blinkit case study",
              ].map((sugg, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-4 py-2.5 rounded-xl text-[26px] ${
                    i === 0 ? "bg-slate-100 font-bold text-slate-900" : "text-slate-500"
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>{sugg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHASE B: 3D TILTED ENCYCLOPEDIA / ARTICLE WITH MULTI-LINE HIGHLIGHT & RED PEN LOOP */}
      {flipToArticle > 0.01 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: flipToArticle,
            transform: `perspective(1200px) rotateX(${lerp(18, 8, flipToArticle).toFixed(
              1
            )}deg) rotateY(${lerp(-20, -8, flipToArticle).toFixed(
              1
            )}deg) scale(${lerp(0.88, 1.06, windowProgress(localT, 1.65, 2.3)).toFixed(3)})`,
          }}
        >
          <div className="w-[1380px] bg-white rounded-2xl shadow-[0_45px_100px_rgba(15,23,42,0.28)] border border-slate-300 p-16">
            <div className="text-[16px] font-mono uppercase tracking-[0.25em] text-slate-400 border-b border-slate-200 pb-4">
              FROM ENCYCLOPEDIA &amp; CORPORATE DISCLOSURES // VERIFIED ARCHIVE
            </div>

            <div className="mt-8 text-[44px] leading-[1.52] text-slate-800 font-sans">
              Founded in December 2013 by{" "}
              <span className="text-blue-600 hover:underline">Albinder Dhindsa</span> and{" "}
              <span className="text-blue-600 hover:underline">Saurabh Kumar</span>,{" "}
              <span className="relative inline-block font-bold text-slate-950">
                <span
                  className="absolute inset-y-1 left-0 bg-[#fef08a] -z-0"
                  style={{ width: `${(line1Highlight * 100).toFixed(1)}%` }}
                />
                <span className="relative z-10">
                  Blinkit (formerly Grofers) pivoted to 10-minute delivery
                </span>
              </span>{" "}
              in 2021.{" "}
              <span className="relative inline-block font-bold text-slate-950">
                <span
                  className="absolute inset-y-1 left-0 bg-[#fef08a] -z-0"
                  style={{ width: `${(line2Highlight * 100).toFixed(1)}%` }}
                />
                <span className="relative z-10">
                  Acquired by Zomato for ₹4,447 Crore in 2022,
                </span>
              </span>{" "}
              it now commands{" "}
              <span className="relative inline-block font-black text-slate-950 px-2">
                46% of India&apos;s quick-commerce market
                {/* Hand-Drawn Red Ink Loop around 46% market share */}
                <svg
                  className="absolute -inset-x-4 -inset-y-3 w-[108%] h-[145%] pointer-events-none overflow-visible"
                  viewBox="0 0 500 90"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 18 52 C 8 12, 485 6, 490 46 C 495 84, 24 88, 12 44 C 6 18, 420 14, 465 36"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray="1200"
                    strokeDashoffset={(1200 * (1 - redPenLoop)).toFixed(1)}
                  />
                </svg>
              </span>{" "}
              ahead of all rivals.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 3. MAGNATESMEDIA ORBITING TEXT BADGE + 90-DEGREE ORTHOGONAL FLOWCHART TREE
 *    (Learned from Vane Motion MagnatesMedia Tutorial `kuX_HBTjTmg`)
 *    - Circular SVG `<textPath>` spinning around a central golden emblem
 *    - 90-degree rounded-elbow flowchart connectors linking subsidiary nodes
 * ============================================================================ */

export const MagnatesFlowchartAndOrbitBadgeRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const badgePop = springODE(localT, 20, 0.7).value;
  const line1 = AE_SNAP(windowProgress(localT, 0.45, 0.75));
  const line2 = AE_SNAP(windowProgress(localT, 1.05, 0.75));
  const line3 = AE_SNAP(windowProgress(localT, 1.65, 0.75));

  const spinDeg = localT * 38;

  const nodes = [
    { x: 420, y: 780, title: "BLINKIT", sub: "Quick Commerce · ₹37,779 Cr", color: "#F8CB46", prog: line1, logo: "/images/01_blinkit_logo_color.png" },
    { x: 960, y: 780, title: "ZOMATO", sub: "Food Delivery · Cash Cow", color: "#E23744", prog: line2, logo: "/images/03_zomato_logo_color.png" },
    { x: 1500, y: 780, title: "HYPERPURE", sub: "B2B Kitchen Supply Chain", color: "#22c55e", prog: line3, logo: "/images/09_eternal_logo_color.png" },
  ];

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 50% 35%, #141418 0%, #050507 100%)",
      }}
    >
      {/* Orthogonal 90-Degree Rounded Flowchart Connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Left Elbow Connector */}
        <path
          d="M 960 360 L 960 540 Q 960 570 930 570 L 450 570 Q 420 570 420 600 L 420 710"
          fill="none"
          stroke="#F8CB46"
          strokeWidth="5"
          strokeDasharray="900"
          strokeDashoffset={(900 * (1 - line1)).toFixed(1)}
          strokeLinecap="round"
        />
        {/* Center Vertical Connector */}
        <path
          d="M 960 360 L 960 710"
          fill="none"
          stroke="#E23744"
          strokeWidth="5"
          strokeDasharray="400"
          strokeDashoffset={(400 * (1 - line2)).toFixed(1)}
          strokeLinecap="round"
        />
        {/* Right Elbow Connector */}
        <path
          d="M 960 360 L 960 540 Q 960 570 990 570 L 1470 570 Q 1500 570 1500 600 L 1500 710"
          fill="none"
          stroke="#22c55e"
          strokeWidth="5"
          strokeDasharray="900"
          strokeDashoffset={(900 * (1 - line3)).toFixed(1)}
          strokeLinecap="round"
        />
      </svg>

      {/* Top Central Medallion with Orbiting Circular SVG `<textPath>` */}
      <div
        className="absolute left-1/2 top-[240px] w-[280px] h-[280px] flex items-center justify-center"
        style={{
          transform: `translate(-50%, -50%) scale(${badgePop.toFixed(3)})`,
        }}
      >
        <svg
          viewBox="0 0 280 280"
          className="absolute inset-0 w-full h-full"
          style={{ transform: `rotate(${spinDeg.toFixed(1)}deg)` }}
        >
          <defs>
            <path
              id="orbitTextPath"
              d="M 140, 140 m -112, 0 a 112,112 0 1,1 224,0 a 112,112 0 1,1 -224,0"
            />
          </defs>
          <text
            fill="#F8CB46"
            fontSize="15"
            fontWeight="800"
            letterSpacing="4.5px"
            className="font-mono uppercase"
          >
            <textPath href="#orbitTextPath">
              ETERNAL CORPORATE EMPIRE • MARKET LEADER •
            </textPath>
          </text>
        </svg>

        <div className="w-[176px] h-[176px] rounded-full bg-zinc-900 border-4 border-[#F8CB46] shadow-[0_0_50px_rgba(248,203,70,0.35)] flex items-center justify-center">
          <img
            src="/images/09_eternal_logo_color.png"
            alt="Eternal"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>

      {/* Bottom Connected Flowchart Nodes */}
      {nodes.map((n, i) => (
        <div
          key={i}
          className="absolute w-[440px] bg-zinc-900/95 border-2 rounded-2xl p-6 flex items-center gap-5 shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
          style={{
            left: `${n.x - 220}px`,
            top: `${n.y - 60}px`,
            borderColor: n.color,
            opacity: n.prog,
            transform: `translate3d(0, ${lerp(28, 0, n.prog).toFixed(1)}px, 0) scale(${lerp(
              0.88,
              1,
              n.prog
            ).toFixed(3)})`,
          }}
        >
          <img src={n.logo} alt={n.title} className="w-20 h-20 rounded-2xl object-contain bg-white p-2" />
          <div>
            <div className="text-[32px] font-black text-white leading-none">{n.title}</div>
            <div className="mt-2 text-[17px] font-mono text-zinc-400">{n.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============================================================================
 * 4. 3D Z-SPACE CAMERA TIMELINE CORRIDOR (ColdFusion / MagnatesMedia Flythrough)
 *    - Historical milestone cards sit at true 3D Z-depths (-650px intervals)
 *    - Virtual camera flies straight down the Z corridor with depth-of-field blur
 * ============================================================================ */

export const ThreeDCameraTimelineCorridor: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const milestones = [
    { year: "2013", title: "ON-NUMBER LAUNCH", metric: "Gurugram Kirana Logistics", color: "#38bdf8", zPos: 150 },
    { year: "2018", title: "GROFERS SLOTTED ERA", metric: "$600M SoftBank & Tiger Capital", color: "#a855f7", zPos: 700 },
    { year: "2021", title: "10-MINUTE PIVOT", metric: "3.0x Customer Retention Unlock", color: "#F8CB46", zPos: 1250 },
    { year: "2026", title: "ETERNAL MARKET LEADER", metric: "2,243 Dark Stores · 46% Share", color: "#22c55e", zPos: 1800 },
  ];

  const camZ = lerp(
    -150,
    1750,
    cubicBezier(windowProgress(localT, 0.0, 3.65), 0.25, 1, 0.35, 1)
  );

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)",
        perspective: "900px",
      }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[540px] opacity-30"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 158px, rgba(56,189,248,0.28) 160px)",
          transform: "rotateX(75deg)",
          transformOrigin: "bottom center",
        }}
      />

      {milestones.map((m, i) => {
        const relZ = m.zPos - camZ;
        if (relZ < -260 || relZ > 1900) return null;

        const opacity =
          clamp((relZ + 240) / 240, 0, 1) * clamp((1850 - relZ) / 450, 0, 1);
        const dofBlur = clamp(Math.abs(relZ - 180) / 360, 0, 8);
        const xOffset = (i % 2 === 0 ? -1 : 1) * 340;
        const yOffset = (i % 2 === 0 ? -1 : 1) * 85;

        return (
          <div
            key={m.year}
            className="absolute w-[740px] p-10 rounded-3xl bg-slate-900/90 border-2 shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
            style={{
              borderColor: m.color,
              opacity: opacity.toFixed(3),
              transform: `translate3d(${xOffset}px, ${yOffset}px, ${(-relZ).toFixed(1)}px)`,
              filter: dofBlur > 0.6 ? `blur(${dofBlur.toFixed(1)}px)` : undefined,
            }}
          >
            <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
              <span
                className="text-[88px] font-black font-mono leading-none"
                style={{ color: m.color }}
              >
                {m.year}
              </span>
              <span className="text-[16px] font-mono uppercase tracking-[0.25em] text-slate-400">
                3D Z-CORRIDOR // Z={m.zPos}M
              </span>
            </div>
            <div className="mt-5 text-[42px] font-black text-white tracking-tight">
              {m.title}
            </div>
            <div className="mt-2 text-[24px] font-medium text-slate-300">
              {m.metric}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * 5. APPLE BENTO GRID SHOWCASE RIG (Apple Keynote / Cleo Abram Style)
 *    - Asymmetrical 5-card glassmorphic Bento layout
 *    - Staggered spring entrance + sequential Spotlight Focus Wave
 * ============================================================================ */

export const AppleBentoGridShowcaseRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const activeFocusIdx = Math.floor(clamp((localT - 0.8) / 0.65, 0, 4.99));

  const cells = [
    {
      colSpan: "col-span-5 row-span-2",
      eyebrow: "CORE ENGINE",
      title: "916.6M",
      sub: "Annualized Orders Processed Across India",
      accent: "#F8CB46",
      img: "/images/01_blinkit_logo_color.png",
    },
    {
      colSpan: "col-span-4 row-span-1",
      eyebrow: "PICKING VELOCITY",
      title: "85 Seconds",
      sub: "Algorithmic barcode scan-to-bag",
      accent: "#22c55e",
    },
    {
      colSpan: "col-span-3 row-span-1",
      eyebrow: "AOV SURGE",
      title: "₹660+",
      sub: "Electronics & beauty mix",
      accent: "#38bdf8",
    },
    {
      colSpan: "col-span-3 row-span-1",
      eyebrow: "DARK STORE MESH",
      title: "2,243",
      sub: "Active micro-warehouses",
      accent: "#a855f7",
    },
    {
      colSpan: "col-span-4 row-span-1",
      eyebrow: "MARKET SHARE",
      title: "46% Leader",
      sub: "Ahead of Zepto (32%) & Instamart (22%)",
      accent: "#f43f5e",
    },
  ];

  return (
    <div
      className="relative w-[1920px] h-[1080px] overflow-hidden p-20 flex flex-col justify-between select-none"
      style={{
        background: "radial-gradient(circle at 50% 20%, #18181b 0%, #09090b 100%)",
      }}
    >
      <div className="flex justify-between items-end">
        <div>
          <div className="text-[16px] font-mono font-bold uppercase tracking-[0.3em] text-[#F8CB46]">
            APPLE KEYNOTE BENTO ARCHITECTURE // MULTI-METRIC SYNTHESIS
          </div>
          <div className="mt-1 text-[54px] font-black text-white tracking-tight leading-none">
            THE 10-MINUTE OPERATING SYSTEM
          </div>
        </div>
        <div className="text-[18px] font-mono text-zinc-400">
          FY26 UNIT ECONOMICS BREAKDOWN
        </div>
      </div>

      <div className="grid grid-cols-12 grid-rows-2 gap-6 h-[740px] mt-8">
        {cells.map((cell, idx) => {
          const sp = springODE(Math.max(0, localT - idx * 0.1), 20, 0.74).value;
          const isFocused = localT > 0.8 && activeFocusIdx === idx;

          return (
            <div
              key={cell.title}
              className={`${cell.colSpan} relative rounded-[32px] p-9 flex flex-col justify-between overflow-hidden border`}
              style={{
                background: isFocused
                  ? "linear-gradient(145deg, rgba(39,39,42,0.95), rgba(24,24,27,0.95))"
                  : "rgba(24,24,27,0.72)",
                borderColor: isFocused ? cell.accent : "rgba(255,255,255,0.1)",
                opacity: clamp(sp * 1.4, 0, 1),
                transform: `scale(${(lerp(0.86, 1, sp) * (isFocused ? 1.025 : 1)).toFixed(3)})`,
                boxShadow: isFocused
                  ? `0 24px 60px -12px ${cell.accent}33, inset 0 1px 0 0 ${cell.accent}`
                  : "0 20px 40px rgba(0,0,0,0.45)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[15px] font-mono font-bold tracking-[0.22em] uppercase"
                  style={{ color: cell.accent }}
                >
                  {cell.eyebrow}
                </span>
                {isFocused && (
                  <span
                    className="px-3 py-1 rounded-full text-[12px] font-mono font-bold uppercase text-black"
                    style={{ backgroundColor: cell.accent }}
                  >
                    ACTIVE FOCUS
                  </span>
                )}
              </div>

              {cell.img && (
                <img
                  src={cell.img}
                  alt={cell.title}
                  className="w-[150px] h-[150px] object-contain my-auto rounded-3xl shadow-2xl"
                />
              )}

              <div>
                <div className="text-[76px] font-black text-white leading-none tracking-tight">
                  {cell.title}
                </div>
                <div className="mt-3 text-[22px] text-zinc-400 font-medium">
                  {cell.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
 * 6. DIAGONAL SPLIT-SCREEN VERSUS + LIQUID WAVE WIPE + 12FPS PAPER COLLAGE
 * ============================================================================ */

export const SplitScreenVersusAndCollageRig: React.FC<{ localT: number }> = ({
  localT,
}) => {
  const waveWipe = cubicBezier(windowProgress(localT, 1.85, 0.75), 0.22, 1, 0.36, 1);

  const leftSlide = AE_SNAP(windowProgress(localT, 0.0, 0.55));
  const rightSlide = AE_SNAP(windowProgress(localT, 0.1, 0.55));

  const yEdge = lerp(1080, 0, Math.pow(waveWipe, 1.3));
  const yBelly = lerp(1080, 0, Math.pow(waveWipe, 0.7));

  const stopMotionT = posterizeTime(localT, 12);
  const paperJitterRot = Math.sin(stopMotionT * 19) * 1.8;

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-zinc-950 select-none">
      {/* PART A: DIAGONAL SPLIT-SCREEN VERSUS BATTLE */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-[#F8CB46] flex items-center pl-[180px]"
          style={{
            clipPath: "polygon(0 0, 56% 0, 44% 100%, 0 100%)",
            transform: `translate3d(${lerp(-960, 0, leftSlide).toFixed(1)}px, 0, 0)`,
          }}
        >
          <div className="text-zinc-950">
            <img
              src="/images/01_blinkit_logo_color.png"
              alt="Blinkit"
              className="w-36 h-36 rounded-3xl shadow-2xl border-4 border-zinc-950"
            />
            <div className="mt-6 text-[76px] font-black leading-none">BLINKIT</div>
            <div className="mt-2 text-[44px] font-mono font-black">46% MARKET SHARE</div>
            <div className="mt-1 text-[20px] font-bold uppercase tracking-widest opacity-80">
              2,243 DARK STORES · ADJUSTED EBITDA POSITIVE
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-[#3b0764] flex items-center justify-end pr-[180px] text-right"
          style={{
            clipPath: "polygon(56% 0, 100% 0, 100% 100%, 44% 100%)",
            transform: `translate3d(${lerp(960, 0, rightSlide).toFixed(1)}px, 0, 0)`,
          }}
        >
          <div className="text-white flex flex-col items-end">
            <img
              src="/images/04_zepto_logo_color.png"
              alt="Zepto"
              className="w-36 h-36 rounded-3xl shadow-2xl border-4 border-purple-300"
            />
            <div className="mt-6 text-[76px] font-black leading-none">ZEPTO</div>
            <div className="mt-2 text-[44px] font-mono font-black text-purple-300">
              32% MARKET SHARE
            </div>
            <div className="mt-1 text-[20px] font-bold uppercase tracking-widest text-purple-200">
              19-YR-OLD STANFORD DROPOUT CHALLENGER
            </div>
          </div>
        </div>

        <div
          className="absolute left-1/2 top-1/2 w-32 h-32 rounded-full bg-zinc-950 border-4 border-white flex items-center justify-center text-white text-[42px] font-black shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          style={{
            transform: `translate(-50%, -50%) scale(${springODE(localT, 22, 0.65).value.toFixed(3)})`,
          }}
        >
          VS
        </div>
      </div>

      {/* PART B: LIQUID BEZIER WAVE WIPE INTO 12FPS TORN-PAPER COLLAGE */}
      {waveWipe > 0.001 && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <clipPath id="liquidWaveClipVol2">
                <path
                  d={`M 0 ${yEdge.toFixed(1)} Q 960 ${yBelly.toFixed(
                    1
                  )} 1920 ${yEdge.toFixed(1)} L 1920 1080 L 0 1080 Z`}
                />
              </clipPath>
            </defs>
          </svg>

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: "url(#liquidWaveClipVol2)",
              background:
                "radial-gradient(circle at 50% 50%, #f5f5f4 0%, #d6d3d1 100%)",
            }}
          >
            <div
              className="relative bg-white p-10 rounded-sm shadow-[18px_22px_0px_#1c1917] border-4 border-zinc-900 flex items-center gap-12 max-w-[1320px]"
              style={{
                transform: `rotate(${paperJitterRot.toFixed(2)}deg)`,
              }}
            >
              <img
                src="/images/person_aadit_palicha_color.png"
                alt="Founder Cutout"
                className="w-[260px] h-[260px] object-cover rounded border-4 border-zinc-900 shadow-lg"
              />
              <div>
                <div className="inline-block px-4 py-1 bg-red-600 text-white font-mono text-[15px] font-bold uppercase tracking-widest">
                  12 FPS STOP-MOTION PAPER COLLAGE RIG (posterizeTime)
                </div>
                <div className="mt-4 text-[58px] font-black text-zinc-900 leading-[1.06]">
                  THE TACTILE HANDMADE DOCUMENTARY LOOK
                </div>
                <div className="mt-4 text-[24px] text-zinc-700 font-serif italic">
                  Quantizing secondary animations to 12 fps while keeping the 3D camera at
                  30 fps creates the signature Johnny Harris &amp; Vox paper-cutout feel.
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
 * MASTER VOLUME 2 SHOWCASE REEL (24-Second 6-Scene Demo Reel)
 * ============================================================================ */

export const TransitionsVol2ShowcaseReel: React.FC<{ t: number }> = ({ t }) => {
  const sceneDur = 4.0;
  const sceneIdx = clamp(Math.floor(t / sceneDur), 0, 5);
  const localT = t - sceneIdx * sceneDur;

  const labels = [
    "VOL.2 - 01 // VOX RED-THREAD DETECTIVE BOARD + RED MARKER LOOP + MASKING TAPE",
    "VOL.2 - 02 // 3D SEARCH BAR AUTOCOMPLETE -> 3D ARTICLE MULTI-LINE HIGHLIGHT & RED PEN",
    "VOL.2 - 03 // MAGNATESMEDIA ORBITING TEXT BADGE + 90-DEG ORTHOGONAL FLOWCHART",
    "VOL.2 - 04 // 3D Z-SPACE CAMERA TIMELINE CORRIDOR (ColdFusion Historical Flythrough)",
    "VOL.2 - 05 // APPLE KEYNOTE BENTO GRID + SEQUENTIAL SPOTLIGHT FOCUS WAVE",
    "VOL.2 - 06 // DIAGONAL SPLIT-SCREEN VERSUS + LIQUID WAVE WIPE + 12FPS PAPER COLLAGE",
  ];

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-black">
      {sceneIdx === 0 && <RedThreadEvidenceBoardRig localT={localT} />}
      {sceneIdx === 1 && <VoxScreenRecording3DBrowser localT={localT} />}
      {sceneIdx === 2 && <MagnatesFlowchartAndOrbitBadgeRig localT={localT} />}
      {sceneIdx === 3 && <ThreeDCameraTimelineCorridor localT={localT} />}
      {sceneIdx === 4 && <AppleBentoGridShowcaseRig localT={localT} />}
      {sceneIdx === 5 && <SplitScreenVersusAndCollageRig localT={localT} />}

      <div className="absolute bottom-6 left-8 z-50 px-5 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white font-mono text-[14px] tracking-wider">
        {labels[sceneIdx]}
      </div>
    </div>
  );
};
