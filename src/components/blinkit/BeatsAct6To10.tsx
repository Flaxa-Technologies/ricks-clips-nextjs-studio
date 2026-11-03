import React, { useMemo } from "react";
import {
  AE_SNAP,
  buildArcLengthSpline,
  clamp,
  formatAnimatedNumber,
  lerp,
  sampleArcLengthSpline,
  windowProgress,
} from "../../lib/kinematics";
import {
  BrandMedallion,
  EditorialStamp,
  KineticBlock,
  TrajectoryRibbon,
} from "./Primitives";

export const BeatsAct6To10: React.FC<{
  beatId: string;
  t: number;
  localTime: number;
}> = ({ beatId, t }) => {
  // Hoist splines for fork diagram & multi-company growth race
  const lifelineSplineUp = useMemo(
    () =>
      buildArcLengthSpline([
        { x: 420, y: 580 },
        { x: 820, y: 580 },
        { x: 1140, y: 410 },
        { x: 1500, y: 340 },
      ]),
    []
  );

  const lifelineSplineDown = useMemo(
    () =>
      buildArcLengthSpline([
        { x: 420, y: 580 },
        { x: 820, y: 580 },
        { x: 1140, y: 710 },
        { x: 1500, y: 780 },
      ]),
    []
  );

  const blinkitRaceSpline = useMemo(
    () =>
      buildArcLengthSpline([
        { x: 380, y: 690 },
        { x: 680, y: 610 },
        { x: 980, y: 470 },
        { x: 1260, y: 335 },
        { x: 1480, y: 270 },
      ]),
    []
  );

  const zeptoRaceSpline = useMemo(
    () =>
      buildArcLengthSpline([
        { x: 380, y: 710 },
        { x: 680, y: 650 },
        { x: 980, y: 555 },
        { x: 1260, y: 465 },
        { x: 1480, y: 425 },
      ]),
    []
  );

  const instamartRaceSpline = useMemo(
    () =>
      buildArcLengthSpline([
        { x: 380, y: 680 },
        { x: 680, y: 640 },
        { x: 980, y: 590 },
        { x: 1260, y: 555 },
        { x: 1480, y: 540 },
      ]),
    []
  );

  switch (beatId) {
    // =========================================================================
    // B13: 114.65 -> 126.10 | 2022 Tech Winter: Ola Dash & Dunzo Slaughtered
    // =========================================================================
    case "B13_RIVAL_SLAUGHTER": {
      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px] text-white">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={114.85}
              className="font-editorial italic text-[46px] text-zinc-300 leading-none"
            >
              2022 Global Tech Winter · Venture funding freezes overnight
            </KineticBlock>
            <KineticBlock
              t={t}
              at={117.4}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-red-500 leading-none whitespace-nowrap"
            >
              THE QUICK-COMMERCE SLAUGHTER
            </KineticBlock>
          </div>

          {/* Competitor Slaughter Row (Color -> Rec.709 B&W Drain + Stamp Slam) */}
          <div className="my-auto flex items-center gap-10">
            <BrandMedallion
              t={t}
              name="OLA DASH"
              sublabel="SHUT DOWN IN MONTHS"
              colorSrc="/images/07_oladash_logo_color.png"
              monoSrc="/images/07_oladash_logo_mono.png"
              enterAt={115.1}
              drainAt={119.85}
              stampText="SHUTTERED"
              sizePx={164}
              darkTheme
            />

            <BrandMedallion
              t={t}
              name="DUNZO DAILY"
              sublabel="TREASURY EXHAUSTED"
              colorSrc="/images/06_dunzo_logo_color.png"
              monoSrc="/images/06_dunzo_logo_mono.png"
              enterAt={115.25}
              drainAt={124.5}
              stampText="COLLAPSED"
              sizePx={164}
              darkTheme
            />

            <BrandMedallion
              t={t}
              name="BLINKIT"
              sublabel="FIGHTING FOR SURVIVAL"
              colorSrc="/images/01_blinkit_logo_color.png"
              monoSrc="/images/01_blinkit_logo_mono.png"
              enterAt={115.4}
              isHero
              highlightColor="#F8CB46"
              sizePx={182}
              darkTheme
            />

            <BrandMedallion
              t={t}
              name="ZEPTO"
              sublabel="SURVIVOR"
              colorSrc="/images/04_zepto_logo_color.png"
              monoSrc="/images/04_zepto_logo_mono.png"
              enterAt={115.55}
              sizePx={156}
              darkTheme
            />

            <BrandMedallion
              t={t}
              name="INSTAMART"
              sublabel="SURVIVOR"
              colorSrc="/images/05_instamart_logo_color.png"
              monoSrc="/images/05_instamart_logo_mono.png"
              enterAt={115.7}
              sizePx={156}
              darkTheme
            />
          </div>

          <KineticBlock
            t={t}
            at={121.4}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-red-400"
          >
            CASUALTIES MOUNT · DELAYED SALARIES, CLOSED DARK STORES & FROZEN CAPITAL
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B14: 126.10 -> 134.65 | Blinkit bleeding -> $150M emergency lifeline from Zomato
    // =========================================================================
    case "B14_EMERGENCY_LIFELINE": {
      const loanStr = formatAnimatedNumber(t, 130.6, 1.5, 0, 150, 0);

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px] text-white">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={126.2}
              className="font-editorial italic text-[46px] text-zinc-300 leading-none"
            >
              Spring 2022 · Shutting dark stores to survive the week
            </KineticBlock>
            <KineticBlock
              t={t}
              at={130.6}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-amber-400 leading-none whitespace-nowrap"
            >
              THE ${loanStr}M EMERGENCY LIFELINE
            </KineticBlock>
          </div>

          {/* Center Fork Diagram: Insolvency vs Zomato Bridge Loan */}
          <div className="relative my-auto h-[460px] w-[1320px] rounded-[36px] border border-white/15 bg-zinc-900/80 overflow-hidden">
            <svg
              viewBox="300 220 1320 640"
              className="absolute inset-0 h-full w-full"
            >
              <TrajectoryRibbon
                spline={lifelineSplineDown}
                t={t}
                startAt={127.0}
                duration={2.2}
                color="#71717A"
                strokeWidth={6}
                glow={false}
                dashed
              />
              <TrajectoryRibbon
                spline={lifelineSplineUp}
                t={t}
                startAt={130.5}
                duration={2.0}
                color="#F8CB46"
                strokeWidth={10}
              />
            </svg>

            <KineticBlock
              t={t}
              at={127.0}
              className="absolute left-[84px] top-[200px] rounded-2xl border border-red-500/40 bg-red-950/80 px-6 py-4 font-mono text-[16px] font-bold text-red-300"
            >
              BLINKIT CASH BURN CRISIS
            </KineticBlock>

            <KineticBlock
              t={t}
              at={128.3}
              className="absolute right-[96px] bottom-[56px] rounded-2xl border border-zinc-700 bg-zinc-950 px-6 py-3 font-mono text-[15px] font-bold text-zinc-500"
            >
              INSOLVENCY & SHUTDOWN
            </KineticBlock>

            <KineticBlock
              t={t}
              at={131.8}
              className="absolute right-[84px] top-[56px] flex items-center gap-5 rounded-3xl border-2 border-amber-400 bg-zinc-950 px-8 py-5 shadow-2xl"
            >
              <img
                src="/images/03_zomato_logo_color.png"
                alt="Zomato"
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-xl object-contain"
              />
              <div>
                <div className="font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  ZOMATO BRIDGE FACILITY
                </div>
                <div className="text-[32px] font-black text-white">
                  $150,000,000 LIFELINE
                </div>
              </div>
            </KineticBlock>
          </div>

          <KineticBlock
            t={t}
            at={132.4}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-400"
          >
            DEBT FACILITY EXTENDED · PRELUDE TO THE BIGGEST GAMBLE IN INDIAN TECH
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B15: 134.65 -> 150.35 | June 2022: Zomato buys Blinkit for ₹4,447 Crore (-43%)
    // 3D Vault Coin at center (960, 515)
    // =========================================================================
    case "B15_DEAL_4447_CRORE": {
      const dealCrore = formatAnimatedNumber(t, 144.2, 2.4, 0, 4447, 0);

      return (
        <div className="relative h-full w-full select-none">
          <div className="absolute top-[64px] inset-x-0 flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={134.85}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              June 24, 2022 · Deepinder Goyal makes a contrarian bet
            </KineticBlock>
            <KineticBlock
              t={t}
              at={142.4}
              omega0={22}
              zeta={0.72}
              className="mt-3 text-[92px] font-black uppercase tracking-[-0.05em] text-zinc-950 leading-none whitespace-nowrap"
            >
              ACQUIRED FOR{" "}
              <span
                className="inline-block rounded-2xl px-5 py-1 text-white"
                style={{ backgroundColor: "#E23744" }}
              >
                ₹{dealCrore} CRORE
              </span>
            </KineticBlock>
          </div>

          {/* Left & Right Medallions flanking the 3D Vault Coin */}
          <div className="absolute left-[170px] top-[345px] flex flex-col items-center">
            {t >= 136.2 && (
              <div className="mb-4 flex items-center gap-3 rounded-full border border-red-500/40 bg-white px-4 py-2 shadow-lg">
                <img
                  src="/images/person_deepinder_goyal_color.png"
                  alt="Deepinder Goyal"
                  className="h-11 w-11 rounded-full object-cover border-2 border-red-500 shadow-sm"
                />
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                    ZOMATO CEO
                  </span>
                  <span className="font-mono text-[14px] font-black text-zinc-950">
                    DEEPINDER GOYAL
                  </span>
                </div>
              </div>
            )}
            <BrandMedallion
              t={t}
              name="ZOMATO"
              sublabel="ACQUIRER (ALL-STOCK)"
              colorSrc="/images/03_zomato_logo_color.png"
              monoSrc="/images/03_zomato_logo_mono.png"
              enterAt={136.2}
              isHero
              highlightColor="#E23744"
              sizePx={185}
            />
          </div>

          <div className="absolute right-[170px] top-[345px] flex flex-col items-center">
            {t >= 140.1 && (
              <div className="mb-4 flex items-center gap-3 rounded-full border border-amber-500/40 bg-white px-4 py-2 shadow-lg">
                <img
                  src="/images/person_albinder_dhindsa_color.png"
                  alt="Albinder Dhindsa"
                  className="h-11 w-11 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                />
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                    BLINKIT CEO
                  </span>
                  <span className="font-mono text-[14px] font-black text-zinc-950">
                    ALBINDER DHINDSA
                  </span>
                </div>
              </div>
            )}
            <BrandMedallion
              t={t}
              name="BLINKIT"
              sublabel="$568 MILLION DEAL"
              colorSrc="/images/01_blinkit_logo_color.png"
              monoSrc="/images/01_blinkit_logo_mono.png"
              enterAt={140.1}
              isHero
              highlightColor="#F8CB46"
              sizePx={185}
            />
          </div>

          {/* Haircut Stamp & Footer */}
          <div className="absolute bottom-[82px] inset-x-0 flex flex-col items-center gap-4">
            {t >= 147.6 && (
              <EditorialStamp
                t={t}
                at={147.6}
                label="43% HAIRCUT FROM $1B UNICORN PEAK"
                color="#E23744"
                rotateDeg={-3}
              />
            )}
            <KineticBlock
              t={t}
              at={137.3}
              className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-600"
            >
              ALL-STOCK TRANSACTION · THE MOST CONTROVERSIAL DEAL IN INDIAN STARTUP HISTORY
            </KineticBlock>
          </div>
        </div>
      );
    }

    // =========================================================================
    // B16: 150.35 -> 159.85 | Zomato stock crashes toward ₹40 + Falling Knife quote
    // =========================================================================
    case "B16_FALLING_KNIFE_CRASH": {
      const candleP = AE_SNAP(windowProgress(t, 151.9, 3.2));
      const candles = [
        { h: 169, l: 152, red: true },
        { h: 154, l: 138, red: true },
        { h: 140, l: 125, red: true },
        { h: 128, l: 134, red: false },
        { h: 132, l: 112, red: true },
        { h: 114, l: 96, red: true },
        { h: 98, l: 82, red: true },
        { h: 85, l: 74, red: true },
        { h: 76, l: 65, red: true },
        { h: 66, l: 54, red: true },
        { h: 55, l: 46, red: true },
        { h: 47, l: 40.5, red: true },
      ];
      const visibleCount = Math.max(1, Math.floor(candleP * candles.length));
      const priceVal = formatAnimatedNumber(t, 151.9, 3.0, 169, 40.55, 2);

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px] text-white">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={150.45}
              className="font-editorial italic text-[46px] text-zinc-400 leading-none"
            >
              Wall Street punishes the acquisition ruthlessly
            </KineticBlock>
            <KineticBlock
              t={t}
              at={151.9}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-red-500 leading-none whitespace-nowrap"
            >
              ZOMATO STOCK CRASHES TO ₹{priceVal}
            </KineticBlock>
          </div>

          {/* Center Candlestick Crash Chart + Critic Quote */}
          <div className="my-auto flex flex-col items-center">
            <div className="flex h-[320px] w-[1140px] items-end justify-between rounded-3xl border border-white/10 bg-zinc-900/80 px-12 py-8">
              {candles.map((c, idx) => {
                const shown = idx < visibleCount;
                const topY = ((175 - c.h) / 145) * 230;
                const botY = ((175 - c.l) / 145) * 230;
                const barH = Math.max(14, Math.abs(botY - topY));
                return (
                  <div
                    key={idx}
                    className="relative h-full w-12"
                    style={{ opacity: shown ? 1 : 0.08 }}
                  >
                    <div
                      className="w-full rounded-md"
                      style={{
                        position: "absolute",
                        top: Math.min(topY, botY),
                        height: barH,
                        backgroundColor: c.red ? "#E23744" : "#52525B",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <KineticBlock
              t={t}
              at={157.0}
              className="mt-8 rounded-2xl border border-red-500/40 bg-zinc-900 px-10 py-5 text-center"
            >
              <div className="font-editorial italic text-[38px] text-zinc-100">
                “Zomato is catching a falling knife in a cash-burning furnace.”
              </div>
              <div className="mt-1 font-mono text-[13px] font-bold uppercase tracking-[0.22em] text-red-400">
                BROKERAGE CONSENSUS · JULY 2022
              </div>
            </KineticBlock>
          </div>

          <KineticBlock
            t={t}
            at={154.8}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-400"
          >
            -76% FROM POST-IPO PEAK · BILLIONS IN MARKET CAP ERASED
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B17: 159.85 -> 172.70 | Did not speed up the bike; it shrank the distance (1.5km)
    // =========================================================================
    case "B17_SHRINK_DISTANCE": {
      const shrinkP = AE_SNAP(windowProgress(t, 167.9, 3.2));
      const kmVal = lerp(12.0, 1.5, shrinkP).toFixed(1);
      const circleR = lerp(240, 88, shrinkP);

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px]">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={160.1}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              Critics assumed riders were speeding through traffic
            </KineticBlock>
            <KineticBlock
              t={t}
              at={166.15}
              className="mt-3 text-[68px] font-black uppercase tracking-[-0.045em] text-zinc-950 leading-none whitespace-nowrap"
            >
              IT DID NOT SPEED UP THE BIKE.{" "}
              <span style={{ color: "#059669" }}>IT SHRANK THE DISTANCE.</span>
            </KineticBlock>
          </div>

          {/* Center Concentric Radius Compression */}
          <div className="my-auto flex items-center gap-16">
            <div className="relative flex h-[480px] w-[540px] items-center justify-center rounded-[36px] border-2 border-zinc-200 bg-white shadow-xl">
              <svg viewBox="0 0 540 480" className="h-full w-full">
                {/* Outer old radius */}
                <circle
                  cx={270}
                  cy={240}
                  r={210}
                  fill="none"
                  stroke="#D4D4D8"
                  strokeWidth={2}
                  strokeDasharray="8 8"
                />
                {/* Shrinking dark store catchment */}
                <circle
                  cx={270}
                  cy={240}
                  r={circleR}
                  fill="#F8CB46"
                  fillOpacity={0.22}
                  stroke="#059669"
                  strokeWidth={5}
                />
                <circle cx={270} cy={240} r={14} fill="#18181B" />
              </svg>
            </div>

            <KineticBlock
              t={t}
              at={168.0}
              className="flex flex-col items-start"
            >
              <div className="font-mono text-[15px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                DARK STORE CATCHMENT RADIUS
              </div>
              <div
                className="mt-1 text-[152px] font-black tracking-[-0.055em] leading-[0.9] tabular-nums"
                style={{ color: "#09090B" }}
              >
                {kmVal} KM
              </div>
              <div className="mt-4 rounded-2xl bg-zinc-900 px-6 py-3 font-mono text-[16px] font-bold text-amber-400">
                HYPER-DENSE NEIGHBORHOOD MICRO-WAREHOUSES
              </div>
            </KineticBlock>
          </div>

          <KineticBlock
            t={t}
            at={170.3}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-600"
          >
            GEOMETRY OVER VELOCITY · DENSITY SOLVES THE 10-MINUTE EQUATION
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B18: 172.70 -> 182.00 | High-velocity shelves: 90s pack + 1.8km @ 15 km/h
    // 3D Crate at center (960, 515)
    // =========================================================================
    case "B18_NINETY_SEC_PACK": {
      const packSec = formatAnimatedNumber(t, 175.4, 1.5, 0, 90, 0);
      const speedKmh = formatAnimatedNumber(t, 179.9, 1.3, 0, 15, 0);

      return (
        <div className="relative h-full w-full select-none">
          <div className="absolute top-[64px] inset-x-0 flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={172.85}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              Algorithmic shelf layout mapped by pick frequency
            </KineticBlock>
            <KineticBlock
              t={t}
              at={175.45}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              PACKED IN{" "}
              <span
                className="inline-block rounded-2xl px-5 py-1"
                style={{ backgroundColor: "#F8CB46", color: "#111111" }}
              >
                {packSec} SECONDS
              </span>
            </KineticBlock>
          </div>

          {/* Left & Right Telemetry Cards around 3D Picking Crate */}
          <KineticBlock
            t={t}
            at={173.8}
            className="absolute left-[140px] top-[395px] w-[400px] rounded-3xl border-2 border-zinc-900 bg-white p-6 shadow-xl"
          >
            <div className="relative mb-3 h-28 w-full overflow-hidden rounded-2xl border border-zinc-200">
              <img
                src="/images/scene_blinkit_dark_store.jpg"
                alt="Blinkit Dark Store"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 left-2 rounded bg-zinc-950/80 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                LIVE FULFILLMENT CENTER
              </div>
            </div>
            <div className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              STAGE 1 · IN-STORE PICKING
            </div>
            <div className="mt-1 text-[64px] font-black leading-none text-zinc-950 tabular-nums">
              {packSec}s
            </div>
            <div className="mt-1 font-mono text-[13px] font-bold text-emerald-700">
              BARCODE SCAN-TO-BAG WORKFLOW
            </div>
          </KineticBlock>

          <KineticBlock
            t={t}
            at={177.6}
            className="absolute right-[140px] top-[425px] w-[390px] rounded-3xl border-2 border-emerald-600 bg-emerald-950 p-7 text-white shadow-xl"
          >
            <div className="font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              STAGE 2 · 1.8 KM LAST MILE
            </div>
            <div className="mt-1 text-[68px] font-black leading-none text-white tabular-nums">
              {speedKmh} KM/H
            </div>
            <div className="mt-2 font-mono text-[14px] font-bold text-amber-300">
              CALM BICYCLE PACE · ZERO SPEEDING
            </div>
          </KineticBlock>

          <KineticBlock
            t={t}
            at={178.7}
            className="absolute bottom-[78px] inset-x-0 text-center font-mono text-[16px] font-bold uppercase tracking-[0.24em] text-zinc-600"
          >
            90 SEC PICKING + 7 MIN RIDE = SUB-9 MINUTE DELIVERY WITH ZERO TRAFFIC RISK
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B19: 182.00 -> 195.10 | Beyond milk & onions -> Electronics, Cosmetics -> ₹660+ AOV
    // =========================================================================
    case "B19_AOV_SURGE": {
      const aovNum = formatAnimatedNumber(t, 192.4, 1.8, 320, 665, 0);
      const cats = [
        { name: "ELECTRONICS & CABLES", margin: "28% MARGIN", at: 187.0 },
        { name: "BEAUTY & COSMETICS", margin: "34% MARGIN", at: 187.9 },
        { name: "FESTIVE & POOJA KITS", margin: "30% MARGIN", at: 189.8 },
        { name: "EMERGENCY GIFTS & TOYS", margin: "32% MARGIN", at: 190.7 },
      ];

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px]">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={182.2}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              Unlocking the profit engine through category expansion
            </KineticBlock>
            <KineticBlock
              t={t}
              at={183.7}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              NOT JUST A MILK-AND-ONION APP
            </KineticBlock>
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="grid grid-cols-2 gap-6 w-[1120px]">
              {cats.map((c) => (
                <KineticBlock
                  key={c.name}
                  t={t}
                  at={c.at}
                  className="flex items-center justify-between rounded-3xl border-2 border-zinc-900/15 bg-white px-8 py-6 shadow-lg"
                >
                  <span className="text-[26px] font-black text-zinc-950">
                    {c.name}
                  </span>
                  <span className="rounded-xl bg-emerald-100 px-4 py-1.5 font-mono text-[15px] font-extrabold text-emerald-800">
                    {c.margin}
                  </span>
                </KineticBlock>
              ))}
            </div>

            <KineticBlock
              t={t}
              at={191.5}
              omega0={22}
              zeta={0.7}
              className="mt-10 flex items-baseline gap-6 rounded-[36px] bg-zinc-950 px-14 py-6 text-white shadow-2xl"
            >
              <span className="font-mono text-[18px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                AVERAGE ORDER VALUE (AOV)
              </span>
              <span
                className="text-[112px] font-black leading-none tracking-[-0.05em] tabular-nums"
                style={{ color: "#F8CB46" }}
              >
                ₹{aovNum}+
              </span>
            </KineticBlock>
          </div>

          <KineticBlock
            t={t}
            at={186.2}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-600"
          >
            HIGH-MARGIN GENERAL MERCHANDISE TRANSFORMS DARK STORE ECONOMICS
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B20: 195.10 -> 205.00 | Search Bar Ads + March 2024 Adjusted EBITDA Positive
    // =========================================================================
    case "B20_AD_ENGINE_EBITDA": {
      const ebitdaHit = t >= 201.4;
      const quarters = [
        { q: "Q1 FY23", val: -326 },
        { q: "Q3 FY23", val: -227 },
        { q: "Q1 FY24", val: -133 },
        { q: "Q3 FY24", val: -89 },
        { q: "MAR 2024", val: +48 },
        { q: "FY26 RUN", val: +185 },
      ];

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px] text-white">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={195.25}
              className="font-editorial italic text-[46px] text-zinc-300 leading-none"
            >
              High-margin retail media + operating leverage
            </KineticBlock>
            <KineticBlock
              t={t}
              at={199.8}
              className="mt-3 text-[74px] font-black uppercase tracking-[-0.045em] leading-none whitespace-nowrap"
              style={{ color: ebitdaHit ? "#10B981" : "#F8CB46" }}
            >
              {ebitdaHit
                ? "MARCH 2024: ADJUSTED EBITDA POSITIVE"
                : "HUNDREDS OF CRORES IN SEARCH AD REVENUE"}
            </KineticBlock>
          </div>

          {/* Center P&L Bars around Zero Horizon */}
          <div className="my-auto flex flex-col items-center">
            <KineticBlock
              t={t}
              at={196.8}
              className="mb-8 flex items-center gap-4 rounded-full border border-amber-400/50 bg-zinc-900 px-8 py-3 font-mono text-[17px] font-bold text-amber-300"
            >
              <span>SPONSORED SEARCH SLOT:</span>
              <span className="text-white">
                70%+ GROSS MARGIN AD ENGINE INSIDE APP
              </span>
            </KineticBlock>

            <div className="relative flex h-[340px] w-[1120px] items-center justify-around rounded-3xl border border-white/15 bg-zinc-900/80 px-10">
              {/* Zero Horizon Line */}
              <div className="absolute inset-x-8 top-1/2 h-0.5 bg-zinc-500" />
              {quarters.map((item, idx) => {
                const pos = item.val > 0;
                const p = AE_SNAP(windowProgress(t, 195.6 + idx * 0.85, 0.9));
                const hPx = Math.min(130, (Math.abs(item.val) / 330) * 130 * p);
                return (
                  <div
                    key={item.q}
                    className="relative flex h-full w-28 flex-col items-center justify-center"
                  >
                    <div
                      className="w-16 rounded-lg"
                      style={{
                        position: "absolute",
                        bottom: pos ? "50%" : undefined,
                        top: pos ? undefined : "50%",
                        height: hPx,
                        backgroundColor: pos ? "#10B981" : "#52525B",
                      }}
                    />
                    <div className="absolute bottom-3 font-mono text-[13px] font-bold text-zinc-400">
                      {item.q}
                    </div>
                  </div>
                );
              })}

              {t >= 203.2 && (
                <div className="absolute right-12 top-8">
                  <EditorialStamp
                    t={t}
                    at={203.2}
                    label="ADJUSTED EBITDA POSITIVE"
                    color="#10B981"
                    rotateDeg={-6}
                  />
                </div>
              )}
            </div>
          </div>

          <KineticBlock
            t={t}
            at={201.4}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-emerald-400"
          >
            WALL STREET SILENCED · QUICK COMMERCE PROVEN PROFITABLE AT SCALE
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B21: 205.00 -> 214.40 | Eternal Corporate Hub + 2,243 Dark Stores
    // 3D Empire Monolith at center (960, 515)
    // =========================================================================
    case "B21_ETERNAL_HUB": {
      const storeCount = formatAnimatedNumber(t, 211.2, 2.2, 400, 2243, 0);

      return (
        <div className="relative h-full w-full select-none">
          <div className="absolute top-[64px] inset-x-0 flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={205.2}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              2026 · The ugly duckling overtakes its parent
            </KineticBlock>
            <KineticBlock
              t={t}
              at={209.8}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              CROWN JEWEL OF{" "}
              <span className="rounded-2xl bg-zinc-950 px-6 py-1 text-amber-400">
                ETERNAL
              </span>
            </KineticBlock>
          </div>

          {/* 4 Radial Pillars around the 3D Empire Monolith */}
          <KineticBlock
            t={t}
            at={208.8}
            className="absolute left-[140px] top-[320px] w-[370px] rounded-3xl border-2 border-amber-400 bg-zinc-950 p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-amber-400">
                PILLAR 01 · QUICK COMMERCE
              </div>
              <img
                src="/images/person_albinder_dhindsa_color.png"
                alt="Albinder Dhindsa"
                className="h-9 w-9 rounded-full object-cover border border-amber-400"
              />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <img
                src="/images/01_blinkit_logo_color.png"
                alt="Blinkit"
                className="h-10 object-contain"
              />
            </div>
            <div className="mt-2 font-mono text-[13px] text-zinc-400">
              FASTEST GROWING GOV ENGINE · 46% SHARE
            </div>
          </KineticBlock>

          <KineticBlock
            t={t}
            at={209.4}
            className="absolute left-[140px] top-[540px] w-[370px] rounded-3xl border border-zinc-300 bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-red-600">
                PILLAR 02 · FOOD DELIVERY
              </div>
              <img
                src="/images/person_deepinder_goyal_color.png"
                alt="Deepinder Goyal"
                className="h-9 w-9 rounded-full object-cover border border-red-500"
              />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <img
                src="/images/03_zomato_logo_color.png"
                alt="Zomato"
                className="h-10 object-contain"
              />
            </div>
            <div className="mt-2 font-mono text-[13px] text-zinc-500">
              CASH-FLOW COMPOUNDER · 55% DUOPOLY
            </div>
          </KineticBlock>

          <KineticBlock
            t={t}
            at={211.2}
            omega0={22}
            zeta={0.7}
            className="absolute right-[140px] top-[385px] w-[410px] rounded-[36px] border-4 border-zinc-900 bg-amber-300 p-8 text-center shadow-2xl"
          >
            <div className="font-mono text-[14px] font-extrabold uppercase tracking-[0.2em] text-zinc-900">
              NATIONAL DARK STORE FOOTPRINT
            </div>
            <div className="mt-2 text-[96px] font-black leading-none tracking-[-0.05em] text-zinc-950 tabular-nums">
              {storeCount}
            </div>
            <div className="mt-2 font-mono text-[15px] font-extrabold text-emerald-900">
              DARK STORES LIVE (TARGET: 3,000)
            </div>
          </KineticBlock>

          <KineticBlock
            t={t}
            at={208.0}
            className="absolute bottom-[78px] inset-x-0 text-center font-mono text-[16px] font-bold uppercase tracking-[0.24em] text-zinc-600"
          >
            ETERNAL LIMITED (NSE: ETERNAL) · BLINKIT · ZOMATO · HYPERPURE · DISTRICT
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B22: 214.40 -> 220.80 | 46% Market Share Race (Blinkit #1 vs Zepto vs Instamart)
    // =========================================================================
    case "B22_MARKET_SHARE_RACE": {
      const raceP = AE_SNAP(windowProgress(t, 214.5, 4.8));
      const blinkitTip = sampleArcLengthSpline(blinkitRaceSpline, raceP);
      const zeptoTip = sampleArcLengthSpline(zeptoRaceSpline, raceP);
      const instamartTip = sampleArcLengthSpline(instamartRaceSpline, raceP);
      const shareNum = formatAnimatedNumber(t, 215.4, 2.2, 20, 46, 0);

      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[68px]">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={214.45}
              className="font-editorial italic text-[46px] text-zinc-700 leading-none"
            >
              India's $11 Billion (₹92,000 Cr) Quick-Commerce Battleground
            </KineticBlock>
            <KineticBlock
              t={t}
              at={215.4}
              className="mt-3 text-[88px] font-black uppercase tracking-[-0.048em] text-zinc-950 leading-none whitespace-nowrap"
            >
              COMMANDING{" "}
              <span
                className="inline-block rounded-2xl px-5 py-1"
                style={{ backgroundColor: "#F8CB46", color: "#111111" }}
              >
                {shareNum}% MARKET SHARE
              </span>
            </KineticBlock>
          </div>

          {/* Multi-Company Growth Race on ONE Chart with Logos Riding Curve Tips */}
          <div className="relative my-auto h-[510px] w-[1420px] rounded-[36px] border-2 border-zinc-200 bg-white shadow-xl overflow-hidden">
            <svg
              viewBox="250 180 1420 600"
              className="absolute inset-0 h-full w-full"
            >
              {/* Instamart Curve (22%) */}
              <TrajectoryRibbon
                spline={instamartRaceSpline}
                t={t}
                startAt={214.5}
                duration={4.8}
                color="#FC8019"
                strokeWidth={6}
                glow={false}
              />
              {/* Zepto Curve (32%) */}
              <TrajectoryRibbon
                spline={zeptoRaceSpline}
                t={t}
                startAt={214.5}
                duration={4.8}
                color="#7C3AED"
                strokeWidth={8}
                glow={false}
              />
              {/* Blinkit Hero Curve (46%) */}
              <TrajectoryRibbon
                spline={blinkitRaceSpline}
                t={t}
                startAt={214.5}
                duration={4.8}
                color="#F8CB46"
                strokeWidth={14}
                glow
              />
            </svg>

            {/* Blinkit Logo Riding Tip (#1 Hero) */}
            {raceP > 0.05 && (
              <div
                className="absolute flex items-center gap-3 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((blinkitTip.x - 250) / 1420) * 100}%`,
                  top: `${((blinkitTip.y - 180) / 600) * 100}%`,
                }}
              >
                <img
                  src="/images/01_blinkit_logo_color.png"
                  alt="Blinkit"
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 object-contain drop-shadow-xl"
                />
                <div className="rounded-full bg-zinc-950 px-4 py-1.5 font-mono text-[15px] font-black text-amber-400 whitespace-nowrap shadow-lg">
                  46% BLINKIT #1
                </div>
              </div>
            )}

            {/* Zepto Logo Riding Tip */}
            {raceP > 0.05 && (
              <div
                className="absolute flex items-center gap-2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((zeptoTip.x - 250) / 1420) * 100}%`,
                  top: `${((zeptoTip.y - 180) / 600) * 100}%`,
                }}
              >
                <img
                  src="/images/04_zepto_logo_color.png"
                  alt="Zepto"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 object-contain drop-shadow-lg"
                />
                <span className="rounded-full bg-purple-950 px-3 py-1 font-mono text-[13px] font-bold text-white whitespace-nowrap">
                  32% ZEPTO
                </span>
              </div>
            )}

            {/* Instamart Logo Riding Tip */}
            {raceP > 0.05 && (
              <div
                className="absolute flex items-center gap-2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((instamartTip.x - 250) / 1420) * 100}%`,
                  top: `${((instamartTip.y - 180) / 600) * 100}%`,
                }}
              >
                <img
                  src="/images/05_instamart_logo_color.png"
                  alt="Instamart"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 object-contain drop-shadow-lg"
                />
                <span className="rounded-full bg-orange-950 px-3 py-1 font-mono text-[13px] font-bold text-white whitespace-nowrap">
                  22% INSTAMART
                </span>
              </div>
            )}
          </div>

          <KineticBlock
            t={t}
            at={218.7}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.24em] text-zinc-600"
          >
            UNDISPUTED NATIONAL LEADER · AHEAD OF ZEPTO AND SWIGGY INSTAMART
          </KineticBlock>
        </div>
      );
    }

    // =========================================================================
    // B23: 220.80 -> 232.20 | Epilogue: Cannibalize yourself to survive
    // =========================================================================
    case "B23_EPILOGUE_FINALE": {
      return (
        <div className="relative h-full w-full select-none flex flex-col items-center justify-between py-[76px] text-white">
          <div className="flex flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={220.9}
              className="font-editorial italic text-[48px] text-zinc-300 leading-none"
            >
              From weeks of cash left to a ₹37,779 Crore empire
            </KineticBlock>
            <KineticBlock
              t={t}
              at={224.6}
              className="mt-4 font-mono text-[16px] font-bold uppercase tracking-[0.28em] text-amber-400"
            >
              ONE TIMELESS RULE OF BUSINESS
            </KineticBlock>
          </div>

          {/* Center Philosophical Climax + Brand Finale Lockup */}
          <div className="my-auto flex max-w-[1440px] flex-col items-center text-center">
            <KineticBlock
              t={t}
              at={225.8}
              className="font-editorial italic text-[56px] text-zinc-300"
            >
              “When your old model is dying...”
            </KineticBlock>

            <KineticBlock
              t={t}
              at={227.45}
              omega0={21}
              zeta={0.74}
              className="mt-4 text-[78px] font-black uppercase tracking-[-0.045em] leading-[1.02] text-white"
            >
              ONLY THE BOLD ENOUGH TO{" "}
              <span style={{ color: "#F8CB46" }}>CANNIBALIZE THEMSELVES</span>{" "}
              SURVIVE.
            </KineticBlock>

            <KineticBlock
              t={t}
              at={221.2}
              className="mt-12 flex items-center gap-10"
            >
              <BrandMedallion
                t={t}
                name="BLINKIT"
                sublabel="10-MINUTE EMPIRE"
                colorSrc="/images/01_blinkit_logo_color.png"
                monoSrc="/images/01_blinkit_logo_mono.png"
                enterAt={221.2}
                isHero
                highlightColor="#F8CB46"
                sizePx={160}
                darkTheme
              />
              <BrandMedallion
                t={t}
                name="ETERNAL"
                sublabel="PARENT POWERHOUSE"
                colorSrc="/images/09_eternal_logo_color.png"
                monoSrc="/images/09_eternal_logo_mono.png"
                enterAt={221.6}
                sizePx={160}
                darkTheme
              />
            </KineticBlock>
          </div>

          <KineticBlock
            t={t}
            at={223.5}
            className="font-mono text-[15px] font-bold uppercase tracking-[0.26em] text-zinc-500"
          >
            A DETERMINISTIC MOTION GRAPHICS DOCUMENTARY · 1920×1080 · 30 FPS
          </KineticBlock>
        </div>
      );
    }

    default:
      return null;
  }
};
