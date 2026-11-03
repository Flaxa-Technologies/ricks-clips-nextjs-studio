import React, { useMemo } from "react";
import {
  AE_SNAP,
  buildArcLengthSpline,
  clamp,
  formatAnimatedNumber,
  lerp,
  sampleArcLengthSpline,
  springODE,
  windowProgress,
} from "../../lib/kinematics";
import {
  BrandMedallion,
  EditorialStamp,
  KineticBlock,
  TrajectoryRibbon,
} from "./Primitives";

export const BeatsAct1To5: React.FC<{
  beatId: string;
  t: number;
  localTime: number;
}> = ({ beatId, t }) => {
  // Precomputed splines hoisted at top of component
  const retentionSpline = useMemo(
    () =>
      buildArcLengthSpline([
        { x: 460, y: 650 },
        { x: 740, y: 615 },
        { x: 1020, y: 500 },
        { x: 1320, y: 310 },
        { x: 1460, y: 260 },
      ]),
    []
  );

  const nasdaqCrashSpline = useMemo(
    () =>
      buildArcLengthSpline([
        { x: 480, y: 580 },
        { x: 760, y: 420 },
        { x: 960, y: 380 },
        { x: 1140, y: 640 },
        { x: 1440, y: 690 },
      ]),
    []
  );

  switch (beatId) {
    // =========================================================================
    // B01: 0.00 -> 8.10 | Hook: Tap a yellow icon -> boiling tea -> doorbell
    // 3D Phone is at center (960, 515)
    // =========================================================================
    case "B01_HOOK_TAP": {
      const routeP = AE_SNAP(windowProgress(t, 2.0, 5.2));
      const teaBoilP = AE_SNAP(windowProgress(t, 4.15, 2.2));
      const doorbellHit = t >= 6.45;

      return (
        <div className="relative h-full w-full select-none">
          {/* Top Stack (Y 60-220) */}
          <div className="absolute top-[64px] inset-x-0 flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={0.85}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              In urban India today, commerce happens at lightning speed
            </KineticBlock>
            <KineticBlock
              t={t}
              at={1.95}
              omega0={20}
              zeta={0.76}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              ONE TAP ON A{" "}
              <span
                className="inline-block px-4 py-1 rounded-2xl"
                style={{ backgroundColor: "#F8CB46", color: "#111111" }}
              >
                YELLOW ICON
              </span>
            </KineticBlock>
          </div>

          {/* Left & Right Flanking Callouts around 3D Phone (center 960, 515 kept clear) */}
          <KineticBlock
            t={t}
            at={4.1}
            className="absolute left-[150px] top-[445px] w-[360px] rounded-3xl border border-zinc-300 bg-white/90 p-6 shadow-xl"
          >
            <div className="font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              KETTLE BENCHMARK
            </div>
            <div className="mt-1 text-[34px] font-black tracking-tight text-zinc-900">
              BOILING WATER FOR TEA
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(teaBoilP * 68).toFixed(1)}%`,
                  backgroundColor: "#F59E0B",
                }}
              />
            </div>
            <div className="mt-2 font-mono text-[14px] font-bold text-amber-600 tabular-nums">
              TEMP: {Math.round(lerp(26, 84, teaBoilP))}°C (STILL HEATING...)
            </div>
          </KineticBlock>

          <KineticBlock
            t={t}
            at={6.35}
            omega0={22}
            zeta={0.68}
            className="absolute right-[150px] top-[445px] w-[360px] rounded-3xl border-2 border-emerald-500 bg-emerald-950 p-6 text-white shadow-2xl"
          >
            <div className="font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              ARRIVAL CONFIRMED · 00:09:00
            </div>
            <div className="mt-1 text-[34px] font-black tracking-tight text-white">
              DOORBELL RINGING
            </div>
            <div className="mt-2 font-mono text-[15px] font-bold text-emerald-300">
              RIDER AT YOUR DOORSTEP
            </div>
          </KineticBlock>

          {/* Footer Route Progress Strip (Y 825-980) */}
          <KineticBlock
            t={t}
            at={2.05}
            className="absolute bottom-[78px] inset-x-0 mx-auto flex w-[1240px] flex-col items-center"
          >
            <div className="flex w-full justify-between font-mono text-[14px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              <span>00:00 · ORDER TAPPED</span>
              <span>01:30 · DARK STORE PACKED</span>
              <span
                style={{
                  color: doorbellHit ? "#059669" : "#52525B",
                }}
              >
                09:00 · RIDER RINGS DOORBELL
              </span>
            </div>
            <div className="relative mt-4 h-4 w-full rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(routeP * 100).toFixed(2)}%`,
                  backgroundColor: doorbellHit ? "#059669" : "#18181B",
                }}
              />
              {/* Traveling Rider Dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-zinc-900 shadow-lg"
                style={{
                  left: `${(routeP * 100).toFixed(2)}%`,
                  backgroundColor: "#F8CB46",
                }}
              >
                <div className="h-3 w-3 rounded-full bg-zinc-950" />
              </div>
            </div>
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B02: 8.10 -> 14.90 | Milk, batteries, charger, iPhone -> 9 mins -> BLINKIT
    // =========================================================================
    case "B02_NINE_MIN_FLAT": {
      const stopwatchP = AE_SNAP(windowProgress(t, 8.2, 4.1));
      const totalSec = Math.round(lerp(600, 540, stopwatchP)); // 10:00 -> 09:00
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      const isBlinkitRevealed = t >= 13.45;

      const skus = [
        { label: "FRESH MILK", tag: "DAIRY · 1L", at: 8.2, col: "#059669" },
        { label: "AA BATTERIES", tag: "INSTANT POWER", at: 8.75, col: "#2563EB" },
        { label: "USB-C CHARGER", tag: "65W FAST", at: 9.45, col: "#7C3AED" },
        { label: "IPHONE 16 PRO", tag: "SEALED BOX", at: 10.85, col: "#E23744" },
      ];

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px]">
          {/* Top Block */}
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={8.15}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              {isBlinkitRevealed
                ? "India's Instant Commerce Engine"
                : "From daily staples to flagship electronics"}
            </KineticBlock>
            <KineticBlock
              t={t}
              at={8.25}
              omega0={21}
              zeta={0.74}
              className="mt-3 text-[92px] font-black uppercase tracking-[-0.05em] leading-none whitespace-nowrap"
              style={{ color: "#09090B" }}
            >
              {isBlinkitRevealed ? (
                <span>
                  THAT YELLOW APP IS{" "}
                  <span
                    className="inline-block rounded-2xl px-6 py-1"
                    style={{ backgroundColor: "#F8CB46", color: "#111111" }}
                  >
                    BLINK<span style={{ color: "#0C831F" }}>IT</span>
                  </span>
                </span>
              ) : (
                "DELIVERED IN NINE MINUTES FLAT"
              )}
            </KineticBlock>
          </div>

          {/* Center Hero: Giant Stopwatch + 4 SKU Staggered Modules */}
          <div className="flex flex-col items-center my-auto">
            {!isBlinkitRevealed ? (
              <>
                <KineticBlock
                  t={t}
                  at={8.2}
                  className="flex items-baseline gap-6 rounded-[40px] border-4 border-zinc-900 bg-zinc-950 px-14 py-7 text-white shadow-2xl"
                >
                  <span className="font-mono text-[20px] font-bold uppercase tracking-[0.22em] text-amber-400">
                    STOPWATCH
                  </span>
                  <span
                    className="font-mono text-[142px] font-extrabold tracking-[-0.05em] leading-none tabular-nums"
                    style={{ color: "#F8CB46" }}
                  >
                    0{mins}:0{secs}.00
                  </span>
                  <span className="font-mono text-[22px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    FLAT
                  </span>
                </KineticBlock>

                <div className="mt-10 flex items-center gap-6">
                  {skus.map((sku) => (
                    <KineticBlock
                      key={sku.label}
                      t={t}
                      at={sku.at}
                      omega0={22}
                      zeta={0.7}
                      className="flex w-[285px] flex-col items-center rounded-3xl border-2 border-zinc-900/15 bg-white px-6 py-6 shadow-xl"
                    >
                      <div
                        className="font-mono text-[13px] font-extrabold uppercase tracking-[0.2em]"
                        style={{ color: sku.col }}
                      >
                        {sku.tag}
                      </div>
                      <div className="mt-2 text-[28px] font-black tracking-tight text-zinc-950 whitespace-nowrap">
                        {sku.label}
                      </div>
                    </KineticBlock>
                  ))}
                </div>
              </>
            ) : (
              <KineticBlock
                t={t}
                at={13.45}
                omega0={24}
                zeta={0.66}
                className="flex flex-col items-center"
              >
                <BrandMedallion
                  t={t}
                  name="BLINKIT"
                  sublabel="COMMERCE IN A BLINK"
                  colorSrc="/images/01_blinkit_logo_color.png"
                  monoSrc="/images/01_blinkit_logo_mono.png"
                  enterAt={13.45}
                  isHero
                  highlightColor="#F8CB46"
                  sizePx={230}
                />
              </KineticBlock>
            )}
          </div>

          {/* Footer Strip */}
          <KineticBlock
            t={t}
            at={11.75}
            className="font-mono text-[16px] font-bold uppercase tracking-[0.24em] text-zinc-600"
          >
            6,000+ SKUS · AVERAGE DELIVERY TIME UNDER 600 SECONDS
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B03: 14.90 -> 27.40 | 916M orders + ₹37,779 Cr vs Wall Street Suicide Mission
    // =========================================================================
    case "B03_SCALE_VS_SUICIDE": {
      const ordersStr = formatAnimatedNumber(t, 15.95, 1.6, 0, 916.6, 1);
      const revStr = formatAnimatedNumber(t, 18.75, 1.8, 0, 37779, 0);
      const flashbackMode = t >= 21.3;
      const cashDrainP = AE_SNAP(windowProgress(t, 24.3, 2.3));
      const cashPct = Math.round(lerp(64, 4, cashDrainP));

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px] text-white">
          {/* Top Header */}
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={15.0}
              className="font-editorial italic text-[46px] text-zinc-300 leading-none"
            >
              {flashbackMode
                ? "Rewind four years to the brink of insolvency"
                : "Audited national scale across India"}
            </KineticBlock>
            <KineticBlock
              t={t}
              at={15.15}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] leading-none whitespace-nowrap"
              style={{ color: flashbackMode ? "#E23744" : "#F8CB46" }}
            >
              {flashbackMode
                ? "WALL STREET CALLED IT A SUICIDE MISSION"
                : "THE ₹37,779 CRORE JUGGERNAUT"}
            </KineticBlock>
          </div>

          {/* Center Monumental Metrics */}
          <div className="my-auto flex flex-col items-center">
            <div className="flex items-center gap-16">
              <KineticBlock
                t={t}
                at={15.95}
                className="flex flex-col items-center rounded-[36px] border border-white/15 bg-zinc-900/90 px-12 py-9"
              >
                <div className="font-mono text-[15px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  ANNUALIZED ORDERS (FY26)
                </div>
                <div
                  className="mt-2 text-[124px] font-black tracking-[-0.055em] leading-[0.92] tabular-nums"
                  style={{ color: flashbackMode ? "#71717A" : "#FFFFFF" }}
                >
                  {ordersStr}M
                </div>
              </KineticBlock>

              <KineticBlock
                t={t}
                at={18.75}
                className="flex flex-col items-center rounded-[36px] border border-amber-400/40 bg-zinc-900/90 px-12 py-9"
              >
                <div className="font-mono text-[15px] font-bold uppercase tracking-[0.22em] text-amber-400">
                  ANNUAL REVENUE RUN-RATE
                </div>
                <div
                  className="mt-2 text-[124px] font-black tracking-[-0.055em] leading-[0.92] tabular-nums"
                  style={{ color: flashbackMode ? "#71717A" : "#F8CB46" }}
                >
                  ₹{revStr} Cr
                </div>
              </KineticBlock>
            </div>

            {/* Flashback Overlay & Cash Runway Depletion */}
            {flashbackMode && (
              <div className="mt-10 flex flex-col items-center">
                <EditorialStamp
                  t={t}
                  at={22.85}
                  label="ANALYST VERDICT: SUICIDE MISSION"
                  color="#E23744"
                  rotateDeg={-4}
                />

                <KineticBlock
                  t={t}
                  at={24.35}
                  className="mt-7 flex w-[880px] flex-col items-center"
                >
                  <div className="flex w-full justify-between font-mono text-[15px] font-bold uppercase tracking-[0.2em]">
                    <span className="text-zinc-400">2022 TREASURY RUNWAY</span>
                    <span className="text-red-500 tabular-nums">
                      CRITICAL: {cashPct}% CASH REMAINING (WEEKS LEFT)
                    </span>
                  </div>
                  <div className="mt-2.5 h-5 w-full overflow-hidden rounded-full bg-zinc-800 p-1">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cashPct}%`,
                        backgroundColor: "#E23744",
                      }}
                    />
                  </div>
                </KineticBlock>
              </div>
            )}
          </div>

          {/* Footer */}
          <KineticBlock
            t={t}
            at={16.2}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-400"
          >
            CHAPTER I · FROM ALMOST BANKRUPT TO MARKET LEADER
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B04: 27.40 -> 36.50 | Dec 2013 Gurugram: Albinder Dhindsa & Saurabh Kumar
    // =========================================================================
    case "B04_GURUGRAM_ORIGIN": {
      const linkBreakP = AE_SNAP(windowProgress(t, 34.25, 0.9));
      const gapPx = lerp(16, 150, linkBreakP);

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px]">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={27.6}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              December 2013 · Gurugram, Haryana
            </KineticBlock>
            <KineticBlock
              t={t}
              at={28.6}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              TWO IIT GRADUATES & A BROKEN LINK
            </KineticBlock>
          </div>

          {/* Center Founder Lockup + Broken Kirana Link Diagram */}
          <div className="my-auto flex flex-col items-center">
            <div className="flex items-center gap-12">
              <KineticBlock
                t={t}
                at={31.95}
                className="flex w-[440px] flex-col items-center rounded-[32px] border-2 border-zinc-900 bg-white px-8 py-7 shadow-xl"
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-amber-400 shadow-md">
                  <img
                    src="/images/person_albinder_dhindsa_color.png"
                    alt="Albinder Dhindsa"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 rounded-md bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-400">
                    CEO
                  </div>
                </div>
                <div className="mt-4 text-[34px] font-black tracking-tight text-zinc-950">
                  ALBINDER DHINDSA
                </div>
                <div className="mt-1 font-mono text-[14px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  IIT DELHI · COLUMBIA MBA · EX-ZOMATO
                </div>
              </KineticBlock>

              <KineticBlock
                t={t}
                at={33.0}
                className="flex w-[440px] flex-col items-center rounded-[32px] border-2 border-zinc-900 bg-white px-8 py-7 shadow-xl"
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-zinc-800 shadow-md">
                  <img
                    src="/images/person_saurabh_kumar_color.png"
                    alt="Saurabh Kumar"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 rounded-md bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-300">
                    CO-FOUNDER
                  </div>
                </div>
                <div className="mt-4 text-[34px] font-black tracking-tight text-zinc-950">
                  SAURABH KUMAR
                </div>
                <div className="mt-1 font-mono text-[14px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  IIT BOMBAY · LOGISTICS ARCHITECT
                </div>
              </KineticBlock>
            </div>

            {/* Broken Link Diagram at 34.3s with Authentic Kirana Photo */}
            <KineticBlock
              t={t}
              at={34.2}
              className="mt-10 flex items-center justify-center gap-6"
            >
              <div className="flex items-center gap-4 rounded-2xl border border-zinc-300 bg-zinc-900 p-3 pr-6 text-white shadow-lg">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-zinc-700">
                  <img
                    src="/images/scene_indian_kirana_store.jpg"
                    alt="Indian Kirana Store"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                    OFFLINE INVENTORY
                  </span>
                  <span className="font-mono text-[17px] font-bold uppercase tracking-[0.16em]">
                    LOCAL KIRANA SHELVES
                  </span>
                </div>
              </div>

              <div
                className="flex items-center justify-center font-mono text-[16px] font-extrabold uppercase tracking-[0.2em] text-red-600"
                style={{ width: 220 + gapPx }}
              >
                <span className="border-b-4 border-dashed border-red-500 px-4 py-1">
                  BROKEN LAST-MILE LINK
                </span>
              </div>

              <div className="rounded-2xl bg-zinc-900 px-7 py-5 font-mono text-[18px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
                URBAN HOUSEHOLDS
              </div>
            </KineticBlock>
          </div>

          <KineticBlock
            t={t}
            at={30.6}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-500"
          >
            28.4595° N, 77.0266° E · GURUGRAM HYPERLOCAL EXPERIMENT
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B05: 36.50 -> 47.75 | Kirana shelves -> On-Number -> Rebrand to GROFERS
    // 3D Bag is at center (960, 515)
    // =========================================================================
    case "B05_KIRANA_TO_GROFERS": {
      const typeP = clamp((t - 42.9) / 1.4, 0, 1);
      const urlFull = "www.on-number.in";
      const typedUrl = urlFull.slice(0, Math.floor(typeP * urlFull.length));
      const isGrofers = t >= 46.15;

      return (
        <div className="relative h-full w-full select-none">
          {/* Top Block */}
          <div className="absolute top-[64px] inset-x-0 flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={36.65}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              Full shelves, zero delivery fleet
            </KineticBlock>
            <KineticBlock
              t={t}
              at={39.4}
              className="mt-3 text-[86px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              {isGrofers ? (
                <span>
                  REBRANDED TO{" "}
                  <span
                    className="inline-block rounded-2xl px-6 py-1 text-white"
                    style={{ backgroundColor: "#E96125" }}
                  >
                    GROFERS
                  </span>
                </span>
              ) : (
                "BUILDING THE KIRANA RIDER NETWORK"
              )}
            </KineticBlock>
          </div>

          {/* Left & Right Flanking Cards around 3D Bag */}
          <KineticBlock
            t={t}
            at={36.8}
            className="absolute left-[140px] top-[400px] w-[380px] rounded-3xl border border-zinc-300 bg-white p-6 shadow-xl"
          >
            <div className="relative mb-3 h-28 w-full overflow-hidden rounded-2xl border border-zinc-200">
              <img
                src="/images/scene_indian_kirana_store.jpg"
                alt="Indian Kirana Store"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded bg-zinc-950/80 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                GURUGRAM PILOT
              </div>
            </div>
            <div className="font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              INVENTORY DENSITY
            </div>
            <div className="mt-1 text-[32px] font-black tracking-tight text-zinc-950">
              10,000+ KIRANAS
            </div>
            <div className="mt-1 font-mono text-[14px] font-semibold text-zinc-600">
              MILLIONS OF SKUS SITTING UNCONNECTED
            </div>
          </KineticBlock>

          {isGrofers && (
            <div className="absolute right-[150px] top-[400px]">
              <BrandMedallion
                t={t}
                name="GROFERS (2014)"
                sublabel="GOPHERS OF GROCERY"
                colorSrc="/images/02_grofers_logo_color.png"
                monoSrc="/images/02_grofers_logo_mono.png"
                enterAt={46.15}
                isHero
                highlightColor="#E96125"
                sizePx={185}
              />
            </div>
          )}

          {/* Bottom URL Pill */}
          <KineticBlock
            t={t}
            at={42.85}
            className="absolute bottom-[78px] inset-x-0 flex flex-col items-center"
          >
            <div className="flex items-center gap-4 rounded-full border-2 border-zinc-900 bg-zinc-950 px-10 py-4 font-mono text-[26px] font-bold text-white shadow-xl">
              <span className="text-zinc-500">2013 LAUNCH:</span>
              <span style={{ color: isGrofers ? "#E96125" : "#F8CB46" }}>
                {isGrofers ? "grofers.com" : typedUrl}
              </span>
              <span
                className="inline-block h-7 w-1.5 bg-amber-400"
                style={{ opacity: Math.sin(t * 10) > 0 ? 1 : 0 }}
              />
            </div>
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B06: 47.75 -> 59.75 | 7 years of scheduled delivery + $600M SoftBank/Tiger
    // =========================================================================
    case "B06_SLOTTED_DREAM": {
      const fundStr = formatAnimatedNumber(t, 55.4, 2.2, 0, 600, 0);
      const vanProgress = AE_SNAP(windowProgress(t, 51.7, 3.2));

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px]">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={47.95}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              2014 to 2020 · Seven years chasing the scheduled supermarket
            </KineticBlock>
            <KineticBlock
              t={t}
              at={48.9}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              ORDER TODAY. DELIVERED TOMORROW.
            </KineticBlock>
          </div>

          {/* Center: 28-Hour Slotted Wait Bar + $600M Funding Monument */}
          <div className="my-auto flex w-[1220px] flex-col items-center">
            <KineticBlock
              t={t}
              at={51.7}
              className="w-full rounded-[36px] border-2 border-zinc-300 bg-white p-9 shadow-xl"
            >
              <div className="flex justify-between font-mono text-[16px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                <span>DAY 1 · 10:00 AM ORDER</span>
                <span className="text-orange-600">
                  +28 HOURS SCHEDULED SLOT WAIT
                </span>
                <span>DAY 2 · 02:00 PM VAN DELIVERY</span>
              </div>
              <div className="relative mt-5 h-6 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(vanProgress * 100).toFixed(1)}%`,
                    backgroundColor: "#E96125",
                  }}
                />
              </div>
            </KineticBlock>

            <KineticBlock
              t={t}
              at={55.4}
              omega0={21}
              zeta={0.72}
              className="mt-10 flex flex-col items-center"
            >
              <div className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                INSTITUTIONAL CAPITAL RAISED
              </div>
              <div
                className="mt-1 text-[148px] font-black tracking-[-0.055em] leading-[0.9] tabular-nums"
                style={{ color: "#09090B" }}
              >
                ${fundStr}M+
              </div>
              <div className="mt-4 flex items-center gap-6 font-mono text-[18px] font-extrabold uppercase tracking-[0.2em]">
                <span className="rounded-xl bg-zinc-900 px-5 py-2 text-white">
                  SOFTBANK VISION FUND
                </span>
                <span className="text-zinc-400">·</span>
                <span className="rounded-xl bg-zinc-900 px-5 py-2 text-amber-400">
                  TIGER GLOBAL
                </span>
              </div>
            </KineticBlock>
          </div>

          <KineticBlock
            t={t}
            at={52.5}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-500"
          >
            SLOTTED E-GROCERY MODEL · HIGH CAPITAL, SLOW VELOCITY
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B07: 59.75 -> 68.95 | Yet the math was a trap: outskirts warehouses, 2x/mo
    // =========================================================================
    case "B07_MATH_TRAP": {
      const bars = [
        {
          label: "OUTSKIRTS MEGA-WAREHOUSES",
          val: "35 KM AWAY",
          pct: 88,
          at: 61.25,
          col: "#E23744",
        },
        {
          label: "LONG-HAUL VAN FUEL & FLEET",
          val: "-₹180 / ORDER",
          pct: 76,
          at: 62.95,
          col: "#E23744",
        },
        {
          label: "STAPLE COMMODITY GROSS MARGIN",
          val: "ONLY 4–6%",
          pct: 22,
          at: 64.65,
          col: "#F59E0B",
        },
        {
          label: "CUSTOMER APP OPEN FREQUENCY",
          val: "2X PER MONTH",
          pct: 14,
          at: 66.35,
          col: "#71717A",
        },
      ];

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px] text-white">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={59.85}
              className="font-editorial italic text-[46px] text-zinc-400 leading-none"
            >
              Why scheduled e-grocery bled cash for a decade
            </KineticBlock>
            <KineticBlock
              t={t}
              at={59.95}
              className="mt-3 text-[92px] font-black uppercase tracking-[-0.048em] text-red-500 leading-none whitespace-nowrap"
            >
              YET THE MATH WAS A TRAP
            </KineticBlock>
          </div>

          {/* Center Waterfall Diagnostic Bars */}
          <div className="my-auto flex w-[1180px] flex-col gap-5">
            {bars.map((b) => {
              const p = AE_SNAP(windowProgress(t, b.at, 0.75));
              return (
                <KineticBlock
                  key={b.label}
                  t={t}
                  at={b.at}
                  className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/90 px-8 py-5"
                >
                  <div className="flex justify-between font-mono text-[16px] font-bold uppercase tracking-[0.18em]">
                    <span className="text-zinc-200">{b.label}</span>
                    <span style={{ color: b.col }}>{b.val}</span>
                  </div>
                  <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(b.pct * p).toFixed(1)}%`,
                        backgroundColor: b.col,
                      }}
                    />
                  </div>
                </KineticBlock>
              );
            })}
          </div>

          <KineticBlock
            t={t}
            at={66.4}
            className="font-mono text-[16px] font-bold uppercase tracking-[0.24em] text-red-400"
          >
            STRUCTURAL DEFICIT · LOW FREQUENCY + LONG DISTANCE = NEGATIVE UNIT ECONOMICS
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B08: 68.95 -> 76.35 | Amazon, Flipkart, BigBasket boxed Grofers + NASDAQ collapse
    // =========================================================================
    case "B08_BOXED_IN_CORNER": {
      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px] text-white">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={69.1}
              className="font-editorial italic text-[46px] text-zinc-400 leading-none"
            >
              Early 2021 · Trapped between trillion-dollar giants
            </KineticBlock>
            <KineticBlock
              t={t}
              at={70.25}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-white leading-none whitespace-nowrap"
            >
              BOXED INTO A CORNER
            </KineticBlock>
          </div>

          {/* Center: Siege Row + NASDAQ Collapse Chart */}
          <div className="my-auto flex flex-col items-center">
            <div className="flex items-center gap-10">
              {/* Amazon 3D Edge Card */}
              <KineticBlock
                t={t}
                at={69.8}
                omega0={22}
                zeta={0.7}
                className="relative flex w-[360px] flex-col items-center rounded-[28px] border-2 border-amber-500/40 bg-gradient-to-b from-zinc-850 to-zinc-950 p-6 text-center"
                style={{
                  transform: `perspective(900px) rotateX(10deg) rotateY(-6deg) translateY(${Math.sin(t * 2.8) * 4}px)`,
                  boxShadow: "0 14px 0 #09090b, 0 16px 3px rgba(245, 158, 11, 0.35), 0 28px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.25)"
                }}
              >
                <div className="relative flex h-16 w-[240px] items-center justify-center rounded-2xl bg-white px-5 py-2 shadow-md">
                  <img
                    src="/images/10_amazon_logo_color.png"
                    alt="Amazon"
                    className="max-h-10 max-w-[190px] object-contain"
                  />
                </div>
                <div className="mt-4 text-[24px] font-black tracking-tight text-white">
                  AMAZON PANTRY
                </div>
                <div className="mt-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  $1.8T TECH TITAN
                </div>
              </KineticBlock>

              {/* Flipkart 3D Edge Card */}
              <KineticBlock
                t={t}
                at={70.4}
                omega0={22}
                zeta={0.7}
                className="relative flex w-[360px] flex-col items-center rounded-[28px] border-2 border-sky-500/40 bg-gradient-to-b from-zinc-850 to-zinc-950 p-6 text-center"
                style={{
                  transform: `perspective(900px) rotateX(10deg) translateY(${Math.sin(t * 2.8 + 1) * 4}px)`,
                  boxShadow: "0 14px 0 #09090b, 0 16px 3px rgba(14, 165, 233, 0.35), 0 28px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.25)"
                }}
              >
                <div className="relative flex h-16 w-[240px] items-center justify-center rounded-2xl bg-white px-5 py-2 shadow-md">
                  <img
                    src="/images/11_flipkart_logo_color.png"
                    alt="Flipkart"
                    className="max-h-10 max-w-[190px] object-contain"
                  />
                </div>
                <div className="mt-4 text-[24px] font-black tracking-tight text-white">
                  FLIPKART SUPERMART
                </div>
                <div className="mt-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 px-3.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400">
                  WALMART BACKED
                </div>
              </KineticBlock>

              {/* BigBasket 3D Edge Card */}
              <KineticBlock
                t={t}
                at={71.0}
                omega0={22}
                zeta={0.7}
                className="relative flex w-[360px] flex-col items-center rounded-[28px] border-2 border-emerald-500/40 bg-gradient-to-b from-zinc-850 to-zinc-950 p-6 text-center"
                style={{
                  transform: `perspective(900px) rotateX(10deg) rotateY(6deg) translateY(${Math.sin(t * 2.8 + 2) * 4}px)`,
                  boxShadow: "0 14px 0 #09090b, 0 16px 3px rgba(16, 185, 129, 0.35), 0 28px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.25)"
                }}
              >
                <div className="relative flex h-16 w-[240px] items-center justify-center rounded-2xl bg-white px-5 py-2 shadow-md">
                  <img
                    src="/images/08_bigbasket_logo_color.png"
                    alt="BigBasket"
                    className="max-h-10 max-w-[190px] object-contain"
                  />
                </div>
                <div className="mt-4 text-[24px] font-black tracking-tight text-white">
                  TATA BIGBASKET
                </div>
                <div className="mt-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  TATA CONGLOMERATE
                </div>
              </KineticBlock>
            </div>

            <div className="relative mt-8 h-[310px] w-[1100px] rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
              <svg viewBox="0 0 1920 1080" className="absolute inset-0 h-full w-full">
                <TrajectoryRibbon
                  spline={nasdaqCrashSpline}
                  t={t}
                  startAt={72.4}
                  duration={2.6}
                  color="#E23744"
                  strokeWidth={12}
                />
              </svg>
              <div className="relative z-10 flex justify-between font-mono text-[15px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                <span>2021 SPAC IPO PLAN (NASDAQ)</span>
                <span className="text-red-500">DEAL TERMINATED</span>
              </div>

              {t >= 74.5 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <EditorialStamp
                    t={t}
                    at={74.5}
                    label="NASDAQ LISTING COLLAPSED"
                    color="#E23744"
                    rotateDeg={-6}
                  />
                </div>
              )}
            </div>
          </div>

          <KineticBlock
            t={t}
            at={73.4}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-400"
          >
            EXISTENTIAL DEAD END · GROW OR DIE
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B09: 76.35 -> 84.70 | Internal data: <20 minutes -> Retention Tripled (3X)
    // =========================================================================
    case "B09_RETENTION_DATA": {
      const curveP = AE_SNAP(windowProgress(t, 79.3, 3.0));
      const tip = sampleArcLengthSpline(retentionSpline, curveP);
      const multStr = formatAnimatedNumber(t, 81.8, 1.4, 1.0, 3.0, 1);

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px]">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={76.5}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              Albinder inspects a hidden anomaly in the cohort logs
            </KineticBlock>
            <KineticBlock
              t={t}
              at={79.3}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              UNDER 20 MINUTES:{" "}
              <span style={{ color: "#059669" }}>RETENTION TRIPLED</span>
            </KineticBlock>
          </div>

          {/* Center Chart + 3.0X Monument */}
          <div className="relative my-auto h-[460px] w-[1280px] rounded-[36px] border-2 border-zinc-200 bg-white shadow-xl overflow-hidden">
            <svg
              viewBox="360 180 1200 560"
              className="absolute inset-0 h-full w-full"
            >
              <line
                x1="460"
                y1="650"
                x2="1460"
                y2="650"
                stroke="#E4E4E7"
                strokeWidth="3"
              />
              <TrajectoryRibbon
                spline={retentionSpline}
                t={t}
                startAt={79.3}
                duration={3.0}
                color="#059669"
                strokeWidth={10}
              />
              {curveP > 0.05 && (
                <circle
                  cx={tip.x}
                  cy={tip.y}
                  r={16}
                  fill="#059669"
                  stroke="#FFFFFF"
                  strokeWidth={5}
                />
              )}
            </svg>

            <KineticBlock
              t={t}
              at={81.8}
              omega0={22}
              zeta={0.68}
              className="absolute left-[88px] top-[64px] flex flex-col"
            >
              <div className="font-mono text-[14px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                CUSTOMER COHORT RETENTION
              </div>
              <div
                className="text-[138px] font-black tracking-[-0.055em] leading-none tabular-nums"
                style={{ color: "#059669" }}
              >
                {multStr}X
              </div>
              <div className="mt-1 font-mono text-[15px] font-bold text-zinc-600">
                WHEN DELIVERED IN &lt; 20 MINUTES
              </div>
            </KineticBlock>
          </div>

          <KineticBlock
            t={t}
            at={80.0}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-600"
          >
            SPEED IS NOT A LUXURY · SPEED IS THE PRODUCT
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B10: 84.70 -> 94.75 | Shut down next-day slots -> Dec 13, 2021: GROFERS -> BLINKIT
    // =========================================================================
    case "B10_BLINKIT_REBRAND": {
      const rebranded = t >= 92.95;
      const shockP = clamp((t - 92.95) / 1.4, 0, 1);

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px]">
          {/* Shockwave rings on rebrand moment */}
          {rebranded && (
            <svg
              viewBox="0 0 1920 1080"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <circle
                cx={960}
                cy={540}
                r={120 + shockP * 640}
                fill="none"
                stroke="#F8CB46"
                strokeWidth={8}
                strokeOpacity={(1 - shockP) * 0.65}
              />
              <circle
                cx={960}
                cy={540}
                r={80 + shockP * 420}
                fill="none"
                stroke="#059669"
                strokeWidth={4}
                strokeOpacity={(1 - shockP) * 0.5}
              />
            </svg>
          )}

          <div className="flex flex-col items-center text-center z-10">
            <KineticBlock
              t={t}
              at={84.8}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              {rebranded
                ? "December 13, 2021 · Burning the boats"
                : "Mid-2021 · An all-or-nothing self-cannibalization"}
            </KineticBlock>
            <KineticBlock
              t={t}
              at={85.3}
              className="mt-3 text-[90px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              {rebranded ? (
                <span>
                  GROFERS BECAME{" "}
                  <span
                    className="inline-block rounded-2xl px-6 py-1"
                    style={{ backgroundColor: "#F8CB46", color: "#111111" }}
                  >
                    BLINK<span style={{ color: "#0C831F" }}>IT</span>
                  </span>
                </span>
              ) : (
                "10-MINUTE GROCERIES OR NOTHING"
              )}
            </KineticBlock>
          </div>

          {/* Center: Grofers drained to Rec.709 B&W -> Blinkit Hero Color */}
          <div className="my-auto flex items-center gap-20 z-10">
            <BrandMedallion
              t={t}
              name="GROFERS"
              sublabel="NEXT-DAY SLOTS KILLED"
              colorSrc="/images/02_grofers_logo_color.png"
              monoSrc="/images/02_grofers_logo_mono.png"
              enterAt={85.0}
              drainAt={87.05}
              stampText="SLOTS SHUT"
              sizePx={190}
            />

            <KineticBlock
              t={t}
              at={89.5}
              className="flex flex-col items-center font-mono text-[22px] font-black uppercase tracking-[0.2em] text-zinc-800"
            >
              <span className="rounded-xl bg-amber-300 px-5 py-2 text-zinc-950">
                10 MIN PROMISE
              </span>
              <span className="mt-2 text-[42px]">→</span>
            </KineticBlock>

            <BrandMedallion
              t={t}
              name="BLINKIT"
              sublabel="DEC 13, 2021 REBRAND"
              colorSrc="/images/01_blinkit_logo_color.png"
              monoSrc="/images/01_blinkit_logo_mono.png"
              enterAt={92.95}
              isHero
              highlightColor="#F8CB46"
              sizePx={220}
            />
          </div>

          <KineticBlock
            t={t}
            at={88.6}
            className="font-mono text-[16px] font-bold uppercase tracking-[0.24em] text-zinc-600 z-10"
          >
            100% DARK-STORE MICRO-FULFILLMENT · ZERO SCHEDULED SLOTS
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B11: 94.75 -> 107.60 | Gold rush: Zepto, Swiggy Instamart, Dunzo Daily, Ola Dash
    // =========================================================================
    case "B11_GOLD_RUSH_RIVALS": {
      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px] text-white">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={94.95}
              className="font-editorial italic text-[46px] text-zinc-300 leading-none"
            >
              Late 2021 · Billions in venture capital flood the streets
            </KineticBlock>
            <KineticBlock
              t={t}
              at={95.6}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-amber-400 leading-none whitespace-nowrap"
            >
              THE QUICK-COMMERCE STAMPEDE
            </KineticBlock>
          </div>

          {/* Center 5-Competitor Medallion Row timed to spoken names */}
          <div className="my-auto flex items-center gap-10">
            <BrandMedallion
              t={t}
              name="BLINKIT"
              sublabel="PIONEER PIVOT"
              colorSrc="/images/01_blinkit_logo_color.png"
              monoSrc="/images/01_blinkit_logo_mono.png"
              enterAt={95.2}
              isHero
              highlightColor="#F8CB46"
              sizePx={168}
              darkTheme
            />
            <div className="relative flex flex-col items-center">
              {t >= 99.2 && (
                <div className="absolute -top-16 z-20 flex items-center gap-2 rounded-full border border-purple-500/40 bg-zinc-950/90 px-3 py-1 text-white shadow-md">
                  <img
                    src="/images/person_aadit_palicha_color.png"
                    alt="Aadit Palicha"
                    className="h-7 w-7 rounded-full object-cover border border-purple-400"
                  />
                  <span className="font-mono text-[11px] font-bold text-purple-300">
                    AADIT PALICHA (19)
                  </span>
                </div>
              )}
              <BrandMedallion
                t={t}
                name="ZEPTO"
                sublabel="19-YR FOUNDERS"
                colorSrc="/images/04_zepto_logo_color.png"
                monoSrc="/images/04_zepto_logo_mono.png"
                enterAt={99.2}
                sizePx={160}
                darkTheme
              />
            </div>
            <BrandMedallion
              t={t}
              name="INSTAMART"
              sublabel="SWIGGY GIANT"
              colorSrc="/images/05_instamart_logo_color.png"
              monoSrc="/images/05_instamart_logo_mono.png"
              enterAt={102.0}
              sizePx={160}
              darkTheme
            />
            <BrandMedallion
              t={t}
              name="DUNZO DAILY"
              sublabel="RELIANCE BACKED"
              colorSrc="/images/06_dunzo_logo_color.png"
              monoSrc="/images/06_dunzo_logo_mono.png"
              enterAt={104.4}
              sizePx={160}
              darkTheme
            />
            <BrandMedallion
              t={t}
              name="OLA DASH"
              sublabel="SUPER-APP PUSH"
              colorSrc="/images/07_oladash_logo_color.png"
              monoSrc="/images/07_oladash_logo_mono.png"
              enterAt={106.5}
              sizePx={160}
              darkTheme
            />
          </div>

          <KineticBlock
            t={t}
            at={98.2}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-400"
          >
            FIVE WELL-FUNDED CONTENDERS · ONE BRUTAL DARK-STORE WAR
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B12: 107.60 -> 114.65 | War zone of dark stores -> Losing ₹100+ per bag
    // 3D Bag at center (960, 515)
    // =========================================================================
    case "B12_BURN_PER_BAG": {
      const lossNum = formatAnimatedNumber(t, 111.5, 1.5, 0, 108, 0);

      return (
        <div className="relative h-full w-full select-none text-white">
          <div className="absolute top-[64px] inset-x-0 flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={107.75}
              className="font-editorial italic text-[46px] text-zinc-300 leading-none"
            >
              Every neighborhood turned into a subsidy battlefield
            </KineticBlock>
            <KineticBlock
              t={t}
              at={108.2}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-red-500 leading-none whitespace-nowrap"
            >
              LOSING OVER ₹100 ON EVERY BAG
            </KineticBlock>
          </div>

          {/* Left & Right Flanking Cards around 3D Bag */}
          <KineticBlock
            t={t}
            at={110.3}
            className="absolute left-[140px] top-[430px] w-[390px] rounded-3xl border border-white/15 bg-zinc-900/95 p-7"
          >
            <div className="font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              2021 CAPEX FRENZY
            </div>
            <div className="mt-2 text-[34px] font-black text-white">
              FREE DELIVERY + RENT
            </div>
            <div className="mt-2 font-mono text-[15px] text-amber-400">
              DARK STORES COMPETING NEXT DOOR
            </div>
          </KineticBlock>

          <KineticBlock
            t={t}
            at={111.5}
            omega0={23}
            zeta={0.68}
            className="absolute right-[140px] top-[415px] w-[390px] rounded-3xl border-2 border-red-500 bg-red-950/90 p-7 text-center"
          >
            <div className="font-mono text-[14px] font-bold uppercase tracking-[0.2em] text-red-300">
              NET CONTRIBUTION PER ORDER
            </div>
            <div className="mt-1 text-[86px] font-black leading-none text-red-400 tabular-nums">
              -₹{lossNum}
            </div>
            <div className="mt-2 font-mono text-[14px] font-bold uppercase tracking-[0.18em] text-white">
              BURNED ON EVERY SINGLE BAG
            </div>
          </KineticBlock>

          <KineticBlock
            t={t}
            at={110.5}
            className="absolute bottom-[78px] inset-x-0 text-center font-mono text-[16px] font-bold uppercase tracking-[0.24em] text-zinc-400"
          >
            UNSUSTAINABLE CASH FURNACE · WHO BLINKS FIRST?
          </KineticBlock>
        </div>
      );
    }

    default:
      return null;
  }
};
