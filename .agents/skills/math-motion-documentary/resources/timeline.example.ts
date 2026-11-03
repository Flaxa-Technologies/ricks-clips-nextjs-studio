import { AE_SNAP, AE_WHIP, AE_WHIP_VEL, clamp, lerp } from "./kinematics";

export type ZomatoTransitionMode =
  | "none"
  | "whip-right"
  | "whip-left"
  | "whip-up"
  | "whip-down"
  | "dolly-through"
  | "iris-wipe";

export interface ZomatoBeatWindow {
  id: string;
  chapter: number;
  start: number;
  end: number;
  transition: ZomatoTransitionMode;
  theme: "light" | "dark";
}

export const ZOMATO_TOTAL_DURATION = 433.27;

/**
 * 30 Contiguous, Millisecond Word-Locked Motion-Graphics Beats (0.00s -> 433.27s)
 * Every cut lands strictly inside a verified Edge-TTS WordBoundary breath pause
 * from zomato_word_map.json so narration and visuals stay 100% locked.
 */
export const ZOMATO_SCENES: ZomatoBeatWindow[] = [
  // ACT 01 — THE HOOK (0.00s – 34.26s)
  { id: "B01_20MIN_HOOK", chapter: 1, start: 0.00, end: 10.64, transition: "none", theme: "light" },
  { id: "B02_330K_CRORE_EMPIRE", chapter: 1, start: 10.64, end: 22.14, transition: "dolly-through", theme: "light" },
  { id: "B03_ONE_PAPER_MENU", chapter: 1, start: 22.14, end: 34.26, transition: "whip-down", theme: "dark" },

  // ACT 02 — BAIN & COMPANY CAFETERIA -> FOODIEBAY (34.26s – 76.50s)
  { id: "B04_BAIN_LUNCH_CHAOS", chapter: 2, start: 34.26, end: 51.65, transition: "whip-right", theme: "light" },
  { id: "B05_SCANNER_FOODIEBAY", chapter: 2, start: 51.65, end: 65.55, transition: "dolly-through", theme: "light" },
  { id: "B06_GURGAON_VIRAL_WAVE", chapter: 2, start: 65.55, end: 76.50, transition: "whip-up", theme: "light" },

  // ACT 03 — REBRAND TO ZOMATO & 80% AD DIRECTORY (76.50s – 121.10s)
  { id: "B07_REBRAND_TO_ZOMATO", chapter: 3, start: 76.50, end: 100.25, transition: "iris-wipe", theme: "light" },
  { id: "B08_ZERO_PLATES_AD_RANK", chapter: 3, start: 100.25, end: 112.10, transition: "whip-right", theme: "light" },
  { id: "B09_80PCT_MARGIN_MACHINE", chapter: 3, start: 112.10, end: 121.10, transition: "dolly-through", theme: "light" },

  // ACT 04 — THE WAR OF 100 STARTUPS (121.10s – 170.35s)
  { id: "B10_VC_CAPITAL_FLOOD", chapter: 4, start: 121.10, end: 133.00, transition: "whip-down", theme: "dark" },
  { id: "B11_FOUR_RIVAL_GIANTS", chapter: 4, start: 133.00, end: 147.00, transition: "whip-right", theme: "light" },
  { id: "B12_200_RUPEE_PIZZA_BURN", chapter: 4, start: 147.00, end: 160.60, transition: "dolly-through", theme: "light" },
  { id: "B13_EXISTENTIAL_DILEMMA", chapter: 4, start: 160.60, end: 170.35, transition: "whip-left", theme: "dark" },

  // ACT 05 — THE SLAUGHTER & MULTI-COMPANY GROWTH RACE (170.35s – 224.35s)
  { id: "B14_BRUTAL_UNIT_ECONOMICS", chapter: 5, start: 170.35, end: 186.20, transition: "whip-down", theme: "dark" },
  { id: "B15_COMPETITOR_SLAUGHTER", chapter: 5, start: 186.20, end: 211.15, transition: "dolly-through", theme: "dark" },
  { id: "B16_GROWTH_RACE_55PCT", chapter: 5, start: 211.15, end: 224.35, transition: "iris-wipe", theme: "light" },

  // ACT 06 — COVID SHOCK & DALAL STREET ₹76 IPO (224.35s – 270.11s)
  { id: "B17_COVID_70PCT_CRASH", chapter: 6, start: 224.35, end: 236.35, transition: "whip-down", theme: "dark" },
  { id: "B18_WARTIME_RECOVERY", chapter: 6, start: 236.35, end: 248.80, transition: "whip-right", theme: "dark" },
  { id: "B19_DALAL_STREET_GONG_IPO", chapter: 6, start: 248.80, end: 270.11, transition: "iris-wipe", theme: "light" },

  // ACT 07 — ₹169 -> ₹41 CRASH & BLINKIT GAMBLE (270.11s – 318.58s)
  { id: "B20_STOCK_CRASH_41", chapter: 7, start: 270.11, end: 292.65, transition: "whip-down", theme: "dark" },
  { id: "B21_4447CR_BLINKIT_BET", chapter: 7, start: 292.65, end: 306.15, transition: "dolly-through", theme: "dark" },
  { id: "B22_10MIN_CORIANDER_DOUBT", chapter: 7, start: 306.15, end: 318.58, transition: "whip-left", theme: "dark" },

  // ACT 08 — DARK STORE PHYSICS, DUNZO COLLAPSE & FIRST PROFIT (318.58s – 364.00s)
  { id: "B23_DARK_STORE_PHYSICS", chapter: 8, start: 318.58, end: 334.16, transition: "whip-right", theme: "light" },
  { id: "B24_DUNZO_FALL_BLINKIT_RISE", chapter: 8, start: 334.16, end: 351.85, transition: "dolly-through", theme: "light" },
  { id: "B25_Q1_FY24_FIRST_PROFIT", chapter: 8, start: 351.85, end: 364.00, transition: "iris-wipe", theme: "light" },

  // ACT 09 — ETERNAL LIMITED & ₹3.3 LAKH CRORE EMPIRE (364.00s – 405.54s)
  { id: "B26_FY25_20243CR_REVENUE", chapter: 9, start: 364.00, end: 376.62, transition: "whip-up", theme: "light" },
  { id: "B27_ETERNAL_FOUR_ENGINES", chapter: 9, start: 376.62, end: 394.40, transition: "dolly-through", theme: "light" },
  { id: "B28_41_TO_340_SUPER_RALLY", chapter: 9, start: 394.40, end: 405.54, transition: "whip-right", theme: "light" },

  // ACT 10 — EPILOGUE: HOW INDIA EATS (405.54s – 433.27s)
  { id: "B29_FOUNDER_PHILOSOPHY", chapter: 10, start: 405.54, end: 417.40, transition: "dolly-through", theme: "light" },
  { id: "B30_FINALE_HOW_INDIA_EATS", chapter: 10, start: 417.40, end: 433.27, transition: "iris-wipe", theme: "light" },
];

export interface EvaluatedBeatState {
  beatIndex: number;
  beat: ZomatoBeatWindow;
  localTime: number;
  beatDuration: number;
  progress: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  blurPx: number;
  opacity: number;
  clipIrisRadiusPct: number | null; // non-null during iris-wipe reveal
}

const HALF_TRANS = 0.24; // 0.48s crisp cinematic transition window

function dirForMode(m: ZomatoTransitionMode): [number, number] {
  switch (m) {
    case "whip-right":
      return [1, 0];
    case "whip-left":
      return [-1, 0];
    case "whip-up":
      return [0, 1];
    case "whip-down":
      return [0, -1];
    default:
      return [0, 0];
  }
}

export function evaluateZomatoCamera(t: number): {
  activeBeats: EvaluatedBeatState[];
  primaryBeat: EvaluatedBeatState;
  shutterBlurX: number;
  shutterBlurY: number;
  darkMix: number; // 0 = studio paper (#F3F3F5), 1 = obsidian (#09090B)
} {
  const scenes = ZOMATO_SCENES;
  let primaryIdx = scenes.findIndex((s) => t >= s.start && t < s.end);
  if (primaryIdx === -1) primaryIdx = t < scenes[0].start ? 0 : scenes.length - 1;

  let darkMix = scenes[primaryIdx].theme === "dark" ? 1 : 0;
  let maxBlurX = 0;
  let maxBlurY = 0;
  const activeBeats: EvaluatedBeatState[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    const inStart = i === 0 ? 0 : sc.start - HALF_TRANS;
    const outEnd = i === scenes.length - 1 ? ZOMATO_TOTAL_DURATION : sc.end + HALF_TRANS;
    if (t < inStart || t > outEnd) continue;

    const dur = Math.max(0.1, sc.end - sc.start);
    const localTime = Math.max(0, t - sc.start);
    const progress = clamp(localTime / dur, 0, 1);

    // Continuous subtle Z-space push across 100% of every beat so screen NEVER freezes!
    let scale = lerp(0.988, 1.032, progress);
    let offsetX = 0;
    let offsetY = 0;
    let opacity = 1.0;
    let blurPx = 0;
    let clipIrisRadiusPct: number | null = null;
    let bX = 0;
    let bY = 0;

    // 1. Incoming transition around sc.start
    if (i > 0 && Math.abs(t - sc.start) <= HALF_TRANS) {
      const tau = clamp((t - (sc.start - HALF_TRANS)) / (2 * HALF_TRANS), 0, 1);
      const prevTheme = scenes[i - 1].theme === "dark" ? 1 : 0;
      const curTheme = sc.theme === "dark" ? 1 : 0;

      if (sc.transition === "dolly-through") {
        const ease = AE_SNAP(tau);
        scale *= lerp(0.64, 1.0, ease);
        blurPx = (1.0 - ease) * 14.0;
        opacity = clamp(tau * 2.4, 0, 1);
        darkMix = lerp(prevTheme, curTheme, ease);
      } else if (sc.transition === "iris-wipe") {
        const ease = AE_SNAP(tau);
        clipIrisRadiusPct = ease * 115.0;
        scale *= lerp(0.95, 1.0, ease);
        opacity = 1.0;
        darkMix = lerp(prevTheme, curTheme, ease);
      } else {
        const [dx, dy] = dirForMode(sc.transition);
        const ease = AE_WHIP(tau);
        const vel = AE_WHIP_VEL(tau);
        offsetX = (1.0 - ease) * dx * 1920;
        offsetY = (1.0 - ease) * dy * 1080;
        scale *= lerp(0.94, 1.0, ease);
        opacity = clamp(tau * 3.2, 0, 1);
        bX = Math.abs(dx) * vel * 7.2;
        bY = Math.abs(dy) * vel * 6.2;
        darkMix = lerp(prevTheme, curTheme, ease);
      }
    }

    // 2. Outgoing transition around sc.end
    if (i < scenes.length - 1 && Math.abs(t - sc.end) <= HALF_TRANS) {
      const nextSc = scenes[i + 1];
      const tau = clamp((t - (sc.end - HALF_TRANS)) / (2 * HALF_TRANS), 0, 1);

      if (nextSc.transition === "dolly-through") {
        const ease = AE_SNAP(tau);
        scale *= lerp(1.0, 1.48, ease);
        blurPx = Math.max(blurPx, ease * 14.0);
        opacity = clamp((1.0 - tau) * 2.2, 0, 1);
      } else if (nextSc.transition === "iris-wipe") {
        // Outgoing stays smoothly underneath while incoming iris expands over it!
        const ease = AE_SNAP(tau);
        scale *= lerp(1.0, 0.96, ease);
        opacity = tau > 0.96 ? 0 : 1.0;
      } else {
        const [dx, dy] = dirForMode(nextSc.transition);
        const ease = AE_WHIP(tau);
        const vel = AE_WHIP_VEL(tau);
        offsetX = -ease * dx * 1920;
        offsetY = -ease * dy * 1080;
        scale *= lerp(1.0, 0.94, ease);
        opacity = clamp((1.0 - tau) * 3.2, 0, 1);
        bX = Math.max(bX, Math.abs(dx) * vel * 7.2);
        bY = Math.max(bY, Math.abs(dy) * vel * 6.2);
      }
    }

    maxBlurX = Math.max(maxBlurX, bX);
    maxBlurY = Math.max(maxBlurY, bY);

    activeBeats.push({
      beatIndex: i,
      beat: sc,
      localTime,
      beatDuration: dur,
      progress,
      offsetX,
      offsetY,
      scale,
      blurPx,
      opacity,
      clipIrisRadiusPct,
    });
  }

  const primaryBeat =
    activeBeats.find((b) => b.beatIndex === primaryIdx) || activeBeats[0];

  return {
    activeBeats,
    primaryBeat,
    shutterBlurX: maxBlurX < 0.25 ? 0 : Math.min(maxBlurX, 30),
    shutterBlurY: maxBlurY < 0.25 ? 0 : Math.min(maxBlurY, 24),
    darkMix,
  };
}
