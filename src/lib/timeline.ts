import {
  AE_SILK,
  AE_SNAP,
  AE_WHIP,
  AE_WHIP_VEL,
  clamp,
  interpolateBgRgb,
  lerp,
} from "./kinematics";

export type TransitionMode =
  | "none"
  | "whip-right"
  | "whip-left"
  | "whip-up"
  | "whip-down"
  | "dolly-through"
  | "iris-wipe";

export interface BeatWindow {
  id: string;
  title: string;
  chapter: number;
  start: number;
  end: number;
  transition: TransitionMode;
  theme: "light" | "dark";
}

export const TOTAL_DURATION = 232.2;
export const HALF_TRANS = 0.24; // 0.48s total transition window

export const SCENES: BeatWindow[] = [
  {
    id: "B01_HOOK_TAP",
    title: "01. Tap the Yellow Icon",
    chapter: 1,
    start: 0.0,
    end: 8.1,
    transition: "none",
    theme: "light",
  },
  {
    id: "B02_NINE_MIN_FLAT",
    title: "02. Nine Minutes Flat",
    chapter: 1,
    start: 8.1,
    end: 14.9,
    transition: "whip-right",
    theme: "light",
  },
  {
    id: "B03_SCALE_VS_SUICIDE",
    title: "03. ₹37,779 Cr vs Suicide Mission",
    chapter: 1,
    start: 14.9,
    end: 27.4,
    transition: "dolly-through",
    theme: "dark",
  },
  {
    id: "B04_GURUGRAM_ORIGIN",
    title: "04. Gurugram 2013: The Founders",
    chapter: 2,
    start: 27.4,
    end: 36.5,
    transition: "iris-wipe",
    theme: "light",
  },
  {
    id: "B05_KIRANA_TO_GROFERS",
    title: "05. Kirana Gap to Grofers",
    chapter: 2,
    start: 36.5,
    end: 47.75,
    transition: "whip-right",
    theme: "light",
  },
  {
    id: "B06_SLOTTED_DREAM",
    title: "06. The Scheduled $600M Dream",
    chapter: 3,
    start: 47.75,
    end: 59.75,
    transition: "whip-up",
    theme: "light",
  },
  {
    id: "B07_MATH_TRAP",
    title: "07. The Outskirts Math Trap",
    chapter: 3,
    start: 59.75,
    end: 68.95,
    transition: "whip-down",
    theme: "dark",
  },
  {
    id: "B08_BOXED_IN_CORNER",
    title: "08. Boxed In & NASDAQ Collapse",
    chapter: 4,
    start: 68.95,
    end: 76.35,
    transition: "whip-left",
    theme: "dark",
  },
  {
    id: "B09_RETENTION_DATA",
    title: "09. The <20 Min Retention Spike",
    chapter: 4,
    start: 76.35,
    end: 84.7,
    transition: "dolly-through",
    theme: "light",
  },
  {
    id: "B10_BLINKIT_REBRAND",
    title: "10. Dec 13, 2021: Grofers Becomes Blinkit",
    chapter: 4,
    start: 84.7,
    end: 94.75,
    transition: "iris-wipe",
    theme: "light",
  },
  {
    id: "B11_GOLD_RUSH_RIVALS",
    title: "11. The Quick-Commerce Stampede",
    chapter: 5,
    start: 94.75,
    end: 107.6,
    transition: "whip-right",
    theme: "dark",
  },
  {
    id: "B12_BURN_PER_BAG",
    title: "12. Losing ₹100+ On Every Bag",
    chapter: 5,
    start: 107.6,
    end: 114.65,
    transition: "whip-down",
    theme: "dark",
  },
  {
    id: "B13_RIVAL_SLAUGHTER",
    title: "13. 2022 Winter: Rivals Slaughtered",
    chapter: 6,
    start: 114.65,
    end: 126.1,
    transition: "dolly-through",
    theme: "dark",
  },
  {
    id: "B14_EMERGENCY_LIFELINE",
    title: "14. The $150M Zomato Lifeline",
    chapter: 6,
    start: 126.1,
    end: 134.65,
    transition: "whip-left",
    theme: "dark",
  },
  {
    id: "B15_DEAL_4447_CRORE",
    title: "15. The ₹4,447 Crore Acquisition",
    chapter: 7,
    start: 134.65,
    end: 150.35,
    transition: "iris-wipe",
    theme: "light",
  },
  {
    id: "B16_FALLING_KNIFE_CRASH",
    title: "16. Catching a Falling Knife (₹40 Crash)",
    chapter: 7,
    start: 150.35,
    end: 159.85,
    transition: "whip-down",
    theme: "dark",
  },
  {
    id: "B17_SHRINK_DISTANCE",
    title: "17. Shrinking Distance: 1.5 km Grid",
    chapter: 8,
    start: 159.85,
    end: 172.7,
    transition: "dolly-through",
    theme: "light",
  },
  {
    id: "B18_NINETY_SEC_PACK",
    title: "18. 90-Second Pick & 15 km/h Ride",
    chapter: 8,
    start: 172.7,
    end: 182.0,
    transition: "whip-right",
    theme: "light",
  },
  {
    id: "B19_AOV_SURGE",
    title: "19. Beyond Milk: ₹660+ AOV Engine",
    chapter: 9,
    start: 182.0,
    end: 195.1,
    transition: "whip-up",
    theme: "light",
  },
  {
    id: "B20_AD_ENGINE_EBITDA",
    title: "20. Search Ads & EBITDA Positive",
    chapter: 9,
    start: 195.1,
    end: 205.0,
    transition: "iris-wipe",
    theme: "dark",
  },
  {
    id: "B21_ETERNAL_HUB",
    title: "21. Eternal Empire & 2,243 Dark Stores",
    chapter: 10,
    start: 205.0,
    end: 214.4,
    transition: "dolly-through",
    theme: "light",
  },
  {
    id: "B22_MARKET_SHARE_RACE",
    title: "22. 46% Market Share Dominance",
    chapter: 10,
    start: 214.4,
    end: 220.8,
    transition: "whip-right",
    theme: "light",
  },
  {
    id: "B23_EPILOGUE_FINALE",
    title: "23. Epilogue: Cannibalize Yourself to Survive",
    chapter: 10,
    start: 220.8,
    end: 232.2,
    transition: "iris-wipe",
    theme: "dark",
  },
];

export interface ActiveBeatLayer {
  beat: BeatWindow;
  localTime: number;
  beatProgress: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  opacity: number;
  blurPx: number;
  clipIrisRadiusPct: number | null;
  bgCss: string;
}

export interface CameraEvaluation {
  primaryBeat: BeatWindow;
  activeBeats: ActiveBeatLayer[];
  darkMix: number;
  bgCss: string;
  shutterBlurX: number;
  shutterBlurY: number;
}

function getWhipDir(mode: TransitionMode): { x: number; y: number } {
  switch (mode) {
    case "whip-right":
      return { x: 1, y: 0 };
    case "whip-left":
      return { x: -1, y: 0 };
    case "whip-down":
      return { x: 0, y: 1 };
    case "whip-up":
      return { x: 0, y: -1 };
    default:
      return { x: 0, y: 0 };
  }
}

export function evaluateXCamera(rawT: number): CameraEvaluation {
  const t = clamp(rawT, 0, TOTAL_DURATION);

  // Locate primary beat
  let primaryIdx = SCENES.findIndex((s) => t >= s.start && t < s.end);
  if (primaryIdx === -1) primaryIdx = SCENES.length - 1;
  const primaryBeat = SCENES[primaryIdx];

  const activeBeats: ActiveBeatLayer[] = [];
  let shutterBlurX = 0;
  let shutterBlurY = 0;
  let darkMix = primaryBeat.theme === "dark" ? 1 : 0;

  for (let i = 0; i < SCENES.length; i++) {
    const beat = SCENES[i];
    const inStart = i === 0 ? 0 : beat.start - HALF_TRANS;
    const outEnd = i === SCENES.length - 1 ? beat.end : beat.end + HALF_TRANS;

    if (t < inStart || t > outEnd) continue;

    const localTime = Math.max(0, t - beat.start);
    const beatDur = Math.max(0.1, beat.end - beat.start);
    const beatProgress = clamp((t - beat.start) / beatDur, 0, 1);

    // Subtle constant Z-drift across every beat
    let scale = lerp(0.988, 1.032, beatProgress);
    let offsetX = 0;
    let offsetY = 0;
    let opacity = 1;
    let blurPx = 0;
    let clipIrisRadiusPct: number | null = null;

    // 1. Incoming transition around beat.start
    if (i > 0 && t < beat.start + HALF_TRANS) {
      const tau = clamp((t - (beat.start - HALF_TRANS)) / (2 * HALF_TRANS), 0, 1);
      const mode = beat.transition;
      const prevBeat = SCENES[i - 1];
      const prevDark = prevBeat.theme === "dark" ? 1 : 0;
      const currDark = beat.theme === "dark" ? 1 : 0;
      darkMix = lerp(prevDark, currDark, AE_SILK(tau));

      if (
        mode === "whip-right" ||
        mode === "whip-left" ||
        mode === "whip-up" ||
        mode === "whip-down"
      ) {
        const dir = getWhipDir(mode);
        const w = AE_WHIP(tau);
        const vel = AE_WHIP_VEL(tau);
        offsetX = (1 - w) * dir.x * 1920;
        offsetY = (1 - w) * dir.y * 1080;
        scale *= lerp(0.94, 1.0, w);
        opacity = clamp(tau * 3.2, 0, 1);
        shutterBlurX = Math.max(shutterBlurX, Math.abs(dir.x) * vel * 7.2);
        shutterBlurY = Math.max(shutterBlurY, Math.abs(dir.y) * vel * 6.2);
      } else if (mode === "dolly-through") {
        const s = AE_SNAP(tau);
        scale *= lerp(0.64, 1.0, s);
        blurPx = (1 - s) * 14;
        opacity = clamp(tau * 2.4, 0, 1);
      } else if (mode === "iris-wipe") {
        clipIrisRadiusPct = AE_SNAP(tau) * 115;
      }
    }

    // 2. Outgoing transition around beat.end
    if (i < SCENES.length - 1 && t > beat.end - HALF_TRANS) {
      const nextBeat = SCENES[i + 1];
      const tau = clamp((t - (beat.end - HALF_TRANS)) / (2 * HALF_TRANS), 0, 1);
      const mode = nextBeat.transition;

      if (
        mode === "whip-right" ||
        mode === "whip-left" ||
        mode === "whip-up" ||
        mode === "whip-down"
      ) {
        const dir = getWhipDir(mode);
        const w = AE_WHIP(tau);
        offsetX = -w * dir.x * 1920;
        offsetY = -w * dir.y * 1080;
        scale *= lerp(1.0, 0.94, w);
        opacity = clamp((1 - tau) * 2.6, 0, 1);
      } else if (mode === "dolly-through") {
        const s = AE_SNAP(tau);
        scale *= lerp(1.0, 1.48, s);
        blurPx = s * 14;
        opacity = clamp((1 - tau) * 2.2, 0, 1);
      } else if (mode === "iris-wipe") {
        scale *= lerp(1.0, 0.96, tau);
        if (tau > 0.96) opacity = 0;
      }
    }

    if (opacity > 0.002) {
      activeBeats.push({
        beat,
        localTime,
        beatProgress,
        offsetX,
        offsetY,
        scale,
        opacity,
        blurPx,
        clipIrisRadiusPct,
        bgCss: interpolateBgRgb(beat.theme === "dark" ? 1 : 0),
      });
    }
  }

  return {
    primaryBeat,
    activeBeats,
    darkMix,
    bgCss: interpolateBgRgb(darkMix),
    shutterBlurX: Math.min(30, shutterBlurX),
    shutterBlurY: Math.min(24, shutterBlurY),
  };
}
