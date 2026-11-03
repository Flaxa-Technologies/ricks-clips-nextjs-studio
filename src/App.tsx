import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Download,
  FileText,
  Film,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Documentary } from "./components/Documentary";
import { TransitionsShowcaseReel } from "./components/blinkit/FeaturedTransitions";
import { TransitionsVol2ShowcaseReel } from "./components/blinkit/FeaturedTransitionsVol2";
import { TransitionsVol3HeavyShowcaseReel } from "./components/blinkit/FeaturedTransitionsVol3Heavy";
import { evaluateXCamera, SCENES, TOTAL_DURATION } from "./lib/timeline";
import wordMapData from "./lib/word_map.json";

declare global {
  interface Window {
    __setDocTime?: (t: number) => Promise<void>;
    __docReady?: boolean;
    __blinkitModelsReady?: boolean;
  }
}

interface WordEntry {
  g: number;
  loc: number;
  dur: number;
  w: string;
}

interface ChapterEntry {
  cid: string;
  start: number;
  end: number;
  dur: number;
  text: string;
  words: WordEntry[];
}

const CHAPTERS: ChapterEntry[] = (wordMapData as { chapters: ChapterEntry[] })
  .chapters;

const RESEARCH_CLAIMS = [
  {
    claim: "Founding & Original Model",
    metric: "Dec 2013 · On-Number → Grofers",
    source: "Albinder Dhindsa & Saurabh Kumar (Gurugram)",
    note: "Started as hyperlocal kirana logistics before pivoting to scheduled slotted supermarket delivery.",
  },
  {
    claim: "Pre-Pivot Institutional Capital",
    metric: "$600M+ Raised",
    source: "SoftBank Vision Fund, Tiger Global, Sequoia",
    note: "Slotted model suffered from outskirts warehouse fuel costs, 4–6% staple margins, and 2x/month frequency.",
  },
  {
    claim: "The 10-Minute Pivot & Rebrand",
    metric: "Dec 13, 2021 · Blinkit",
    source: "Official Grofers Rebrand Filing",
    note: "Internal cohort data revealed 3.0x customer retention whenever orders arrived under 20 minutes.",
  },
  {
    claim: "Zomato All-Stock Acquisition",
    metric: "₹4,447 Crore ($568M)",
    source: "BSE/NSE Exchange Filing (June 24, 2022)",
    note: "43% valuation haircut from $1B unicorn status; Zomato stock crashed to ₹40.55 trough in July 2022.",
  },
  {
    claim: "Quick-Commerce Casualties",
    metric: "Ola Dash & Dunzo Daily",
    source: "2022–2024 Sector Consolidation",
    note: "Ola Dash shuttered in 2022; Dunzo collapsed under dark-store burn and funding freeze.",
  },
  {
    claim: "Dark Store Fulfillment Physics",
    metric: "1.5 km Grid · 90s Pack",
    source: "Eternal Shareholder Letters",
    note: "High-velocity pick-frequency shelves allow 90s packing and calm 15 km/h rider speed over 1.8 km.",
  },
  {
    claim: "Adjusted EBITDA Breakeven",
    metric: "March 2024 (Q4 FY24)",
    source: "Zomato Q4 FY24 Financial Results",
    note: "Driven by ₹660+ AOV general merchandise mix and high-margin search bar advertising.",
  },
  {
    claim: "FY26 Scale & Market Share",
    metric: "₹37,779 Cr Rev · 46% Share",
    source: "Eternal FY26 Disclosures & Industry Reports",
    note: "2,243 dark stores (~916.6M annual orders), leading Zepto (~32%) and Swiggy Instamart (~22%).",
  },
];

function formatTimecode(sec: number): string {
  const clamped = Math.max(0, Math.min(sec, TOTAL_DURATION));
  const mins = Math.floor(clamped / 60);
  const secs = Math.floor(clamped % 60);
  const frames = Math.floor((clamped - Math.floor(clamped)) * 30);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}:${String(frames).padStart(2, "0")}`;
}

export default function App() {
  const isShowcaseRoute = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("showcase") === "1";
  }, []);

  const isShowcaseVol2Route = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("showcase") === "2";
  }, []);

  const isShowcaseVol3Route = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("showcase") === "3";
  }, []);

  const isRenderRoute = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return (
      window.location.pathname.startsWith("/render-documentary") ||
      params.get("render") === "1" ||
      params.get("showcase") === "1" ||
      params.get("showcase") === "2" ||
      params.get("showcase") === "3"
    );
  }, []);

  const [currentTime, setCurrentTime] = useState<number>(() =>
    isRenderRoute ? 0 : 2.45
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "beats" | "wordmap" | "dossier" | "contactsheet"
  >("beats");
  const [stageScale, setStageScale] = useState<number>(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stageWrapperRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<number>(isRenderRoute ? 0 : 2.45);
  const isPlayingRef = useRef<boolean>(false);
  const hasPlayedOnceRef = useRef<boolean>(false);

  useEffect(() => {
    timeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Deterministic Frame Stepper for Playwright (/render-documentary)
  useEffect(() => {
    window.__setDocTime = (t: number) =>
      new Promise<void>((resolve) => {
        const clamped = Math.max(0, Math.min(t, TOTAL_DURATION));
        timeRef.current = clamped;
        flushSync(() => {
          setCurrentTime(clamped);
        });
        resolve();
      });

    let cancelled = false;
    async function markReady() {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const start = performance.now();
      while (
        !window.__blinkitModelsReady &&
        performance.now() - start < 2000
      ) {
        await new Promise((r) => setTimeout(r, 30));
      }
      if (!cancelled) {
        window.__docReady = true;
      }
    }
    markReady();

    return () => {
      cancelled = true;
    };
  }, []);

  // Responsive scale calculation for Studio Player
  useEffect(() => {
    if (isRenderRoute) return;
    function updateScale() {
      const el = stageWrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width > 100) {
        setStageScale(rect.width / 1920);
      }
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isRenderRoute]);

  // Hybrid Master Clock Loop: advances immediately at 60fps via performance.now()
  // AND locks cleanly to <audio> whenever buffered and playing
  useEffect(() => {
    if (isRenderRoute) return;
    let rafId = 0;
    let lastNow = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, Math.max(0, (now - lastNow) / 1000));
      lastNow = now;

      if (isPlayingRef.current) {
        const audio = audioRef.current;
        let nextT = timeRef.current + dt;

        if (
          audio &&
          !audio.paused &&
          !audio.seeking &&
          audio.readyState >= 2
        ) {
          const audioT = audio.currentTime;
          if (Math.abs(audioT - nextT) < 0.35) {
            nextT = audioT;
          } else {
            audio.currentTime = nextT;
          }
        }

        if (nextT >= TOTAL_DURATION) {
          nextT = TOTAL_DURATION;
          isPlayingRef.current = false;
          setIsPlaying(false);
          if (audio && !audio.paused) {
            audio.pause();
          }
        }

        timeRef.current = nextT;
        setCurrentTime(nextT);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isRenderRoute]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!isPlayingRef.current) {
      let startT = timeRef.current;
      if (!hasPlayedOnceRef.current && Math.abs(startT - 2.45) < 0.05) {
        startT = 0.85;
      } else if (startT >= TOTAL_DURATION - 0.25) {
        startT = 0;
      }
      hasPlayedOnceRef.current = true;
      timeRef.current = startT;
      setCurrentTime(startT);
      isPlayingRef.current = true;
      setIsPlaying(true);

      if (audio) {
        try {
          audio.currentTime = startT;
          const playPromise = audio.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
              // If unmuted autoplay is blocked by browser policy, fallback to muted audio play
              // while keeping visual hybrid clock running uninterrupted
              audio.muted = true;
              setIsMuted(true);
              audio.play().catch(() => {});
            });
          }
        } catch {
          // Visual clock continues smoothly via RAF
        }
      }
    } else {
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (audio && !audio.paused) {
        audio.pause();
      }
    }
  }, []);

  // Spacebar shortcut for Play/Pause
  useEffect(() => {
    if (isRenderRoute) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "BUTTON" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isRenderRoute, togglePlay]);

  // If in deterministic Playwright render mode, return native 1920x1080 stage only
  if (isRenderRoute) {
    return (
      <main
        className={`relative h-[1080px] w-[1920px] overflow-hidden ${
          isShowcaseVol3Route ? "bg-[#F4EFE6]" : "bg-black"
        }`}
      >
        {isShowcaseRoute ? (
          <TransitionsShowcaseReel t={currentTime} />
        ) : isShowcaseVol2Route ? (
          <TransitionsVol2ShowcaseReel t={currentTime} />
        ) : isShowcaseVol3Route ? (
          <TransitionsVol3HeavyShowcaseReel t={currentTime} />
        ) : (
          <Documentary t={currentTime} />
        )}
      </main>
    );
  }

  const cam = evaluateXCamera(currentTime);
  const activeChapter =
    CHAPTERS.find(
      (c) => currentTime >= c.start - 0.35 && currentTime <= c.end + 0.35
    ) || CHAPTERS[0];

  const activeWordIdx = activeChapter
    ? activeChapter.words.findIndex(
        (w, idx) =>
          currentTime >= w.g - 0.05 &&
          (idx === activeChapter.words.length - 1 ||
            currentTime < activeChapter.words[idx + 1].g)
      )
    : -1;

  const seekTo = (targetSec: number) => {
    hasPlayedOnceRef.current = true;
    const clamped = Math.max(0, Math.min(targetSec, TOTAL_DURATION));
    timeRef.current = clamped;
    setCurrentTime(clamped);
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = clamped;
      } catch {
        // Ignore if audio metadata not yet loaded
      }
    }
  };

  const resetPlayer = () => {
    hasPlayedOnceRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      try {
        audioRef.current.currentTime = 0;
      } catch {}
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    timeRef.current = 0;
    setCurrentTime(0);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted && isPlayingRef.current && audioRef.current.paused) {
        audioRef.current.currentTime = timeRef.current;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col">
      {/* Fast-Streaming Master Audio Element (v2 MP3 + WAV fallback) */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={() => {
          isPlayingRef.current = false;
          setIsPlaying(false);
        }}
      >
        <source src="/audio/master_v2.mp3" type="audio/mpeg" />
        <source src="/audio/master_v2.wav" type="audio/wav" />
      </audio>

      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 border-b border-zinc-800/90 bg-zinc-950/90 px-8 py-3.5">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#stage"
          onClick={(e) => {
            e.preventDefault();
            seekTo(0);
          }}
          className="text-lg font-extrabold tracking-tight text-amber-400 whitespace-nowrap shrink-0"
        >
          BLINKIT DOCUMENTARY STUDIO
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => setActiveTab("beats")}
            className={`hover:text-white whitespace-nowrap shrink-0 ${
              activeTab === "beats"
                ? "text-white underline underline-offset-8 decoration-amber-400"
                : ""
            }`}
          >
            23-Beat Timeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wordmap")}
            className={`hover:text-white whitespace-nowrap shrink-0 ${
              activeTab === "wordmap"
                ? "text-white underline underline-offset-8 decoration-amber-400"
                : ""
            }`}
          >
            Word Sync Map
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("dossier")}
            className={`hover:text-white whitespace-nowrap shrink-0 ${
              activeTab === "dossier"
                ? "text-white underline underline-offset-8 decoration-amber-400"
                : ""
            }`}
          >
            Research Dossier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contactsheet")}
            className={`hover:text-white whitespace-nowrap shrink-0 ${
              activeTab === "contactsheet"
                ? "text-white underline underline-offset-8 decoration-amber-400"
                : ""
            }`}
          >
            QA Contact Sheet
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <a
            href="/blinkit_documentary_masterpiece.mp4"
            download="blinkit_documentary_masterpiece.mp4"
            className="inline-flex items-center gap-2 rounded-lg bg-[#F8CB46] px-4 py-2 text-xs font-extrabold text-zinc-950 hover:bg-amber-300 whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Download 1080p MP4
          </a>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-4">
        {/* Stage Viewport Wrapper (16:9 scaled 1920x1080 canvas, 960x540 desktop so controls stay above fold) */}
        <div className="flex flex-col items-center">
          <div
            ref={stageWrapperRef}
            id="stage"
            onClick={togglePlay}
            role="button"
            tabIndex={0}
            aria-label={
              isPlaying
                ? "Documentary stage playing — click to pause"
                : "Documentary stage paused — click to play"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                togglePlay();
              }
            }}
            className="group relative w-full max-w-[960px] cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl"
            style={{
              aspectRatio: "16 / 9",
            }}
          >
            <div
              style={{
                width: 1920,
                height: 1080,
                transform: `scale(${stageScale})`,
                transformOrigin: "top left",
              }}
            >
              <Documentary t={currentTime} />
            </div>

            {/* Subtle corner playback badge on hover or when paused */}
            <div
              className={`pointer-events-none absolute right-4 bottom-4 flex items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-950/85 px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider uppercase text-zinc-200 backdrop-blur-md ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-95"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isPlaying ? "bg-emerald-400" : "bg-[#F8CB46]"
                }`}
              />
              <span>{isPlaying ? "LIVE 60FPS · CLICK TO PAUSE" : "CLICK STAGE OR PLAY"}</span>
            </div>
          </div>

          {/* Live Word-Synced Closed Caption Strip */}
          <div className="mt-2.5 flex w-full max-w-[960px] items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/70 px-4 py-2">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 shrink-0">
              <span>{cam.primaryBeat.id}</span>
              <span aria-hidden="true">·</span>
              <span>{cam.primaryBeat.transition.toUpperCase()}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1 text-xs font-medium text-zinc-300 line-clamp-1">
              {activeChapter?.words.slice(0, 28).map((w, idx) => {
                const isSpoken = idx === activeWordIdx;
                const isPast = idx < activeWordIdx;
                return (
                  <button
                    key={`${w.g}-${idx}`}
                    type="button"
                    onClick={() => seekTo(w.g)}
                    className={`rounded px-1 py-0.5 ${
                      isSpoken
                        ? "bg-amber-400 font-bold text-zinc-950"
                        : isPast
                        ? "text-zinc-200 hover:text-amber-300"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {w.w}
                  </button>
                );
              })}
            </div>

            <div className="font-mono text-xs text-zinc-400 shrink-0 tabular-nums">
              {formatTimecode(currentTime)} / {formatTimecode(TOTAL_DURATION)}
            </div>
          </div>

          {/* Transport & Scrubber Deck */}
          <div className="mt-2.5 flex w-full max-w-[960px] flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 p-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause documentary" : "Play documentary"}
                className="flex h-11 w-28 items-center justify-center gap-2 rounded-lg bg-[#F8CB46] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-zinc-950 hover:bg-amber-300 whitespace-nowrap shrink-0"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetPlayer}
                aria-label="Reset to start"
                className="flex h-11 items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="flex h-11 items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 whitespace-nowrap shrink-0"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-red-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-amber-400" />
                )}
              </button>

              <div className="flex flex-1 flex-col">
                <label htmlFor="timeline-scrubber" className="sr-only">
                  Documentary Timeline Scrubber
                </label>
                <input
                  id="timeline-scrubber"
                  type="range"
                  min={0}
                  max={TOTAL_DURATION}
                  step={0.05}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="h-2.5 w-full cursor-pointer accent-[#F8CB46]"
                />
              </div>

              <div className="font-mono text-sm font-bold text-amber-400 tabular-nums shrink-0">
                {currentTime.toFixed(2)}s
              </div>
            </div>
          </div>
        </div>

        {/* Lower Studio Inspector Tabs */}
        <section className="mt-8 w-full max-w-[1280px] mx-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("beats")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold whitespace-nowrap ${
                  activeTab === "beats"
                    ? "bg-amber-400 text-zinc-950"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                23-Beat Scene Map
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("wordmap")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold whitespace-nowrap ${
                  activeTab === "wordmap"
                    ? "bg-amber-400 text-zinc-950"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <Film className="h-3.5 w-3.5" />
                Word-Level Timestamp Map (626 Words)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("dossier")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold whitespace-nowrap ${
                  activeTab === "dossier"
                    ? "bg-amber-400 text-zinc-950"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Verified Research Dossier
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("contactsheet")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold whitespace-nowrap ${
                  activeTab === "contactsheet"
                    ? "bg-amber-400 text-zinc-950"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <Film className="h-3.5 w-3.5" />
                4×4 QA Contact Sheet
              </button>
            </div>

            <div className="font-mono text-xs text-zinc-400">
              1920×1080 · 30 FPS · Newton-Raphson + Spring ODE Engine
            </div>
          </div>

          {/* TAB 1: 23-Beat Scene Jump Grid */}
          {activeTab === "beats" && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SCENES.map((beat) => {
                const isActive = cam.primaryBeat.id === beat.id;
                return (
                  <button
                    key={beat.id}
                    type="button"
                    onClick={() => seekTo(beat.start + 0.35)}
                    className={`flex flex-col items-start justify-between rounded-xl border p-4 text-left ${
                      isActive
                        ? "border-amber-400 bg-zinc-900"
                        : "border-zinc-800/90 bg-zinc-950 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between font-mono text-[11px] text-zinc-400">
                      <span>CH {beat.chapter}</span>
                      <span>
                        {beat.start.toFixed(1)}s – {beat.end.toFixed(1)}s
                      </span>
                    </div>
                    <div className="mt-1.5 text-sm font-bold text-zinc-100">
                      {beat.title}
                    </div>
                    <div className="mt-2 font-mono text-[11px] text-amber-400/90">
                      {beat.transition} · {beat.theme}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: Word-Timestamp Map */}
          {activeTab === "wordmap" && (
            <div className="mt-5 space-y-4">
              {CHAPTERS.map((ch) => (
                <div
                  key={ch.cid}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-amber-400">
                    <span>{ch.cid.toUpperCase()}</span>
                    <span>
                      {ch.start.toFixed(2)}s → {ch.end.toFixed(2)}s ({ch.dur.toFixed(2)}s)
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ch.words.map((w, i) => (
                      <button
                        key={`${ch.cid}-${i}`}
                        type="button"
                        onClick={() => seekTo(w.g)}
                        className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 hover:border-amber-400 hover:text-white"
                      >
                        <span className="font-semibold">{w.w}</span>{" "}
                        <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
                          {w.g.toFixed(2)}s
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Verified Research Dossier */}
          {activeTab === "dossier" && (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {RESEARCH_CLAIMS.map((item) => (
                <div
                  key={item.claim}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <div className="font-mono text-xs text-zinc-400">
                    {item.claim} · {item.source}
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-amber-400 tabular-nums">
                    {item.metric}
                  </div>
                  <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: 4x4 QA Contact Sheet */}
          {activeTab === "contactsheet" && (
            <div className="mt-5 flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="mb-4 flex w-full items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    16-Beat Deterministic QA Contact Sheet
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Captured via headless Chromium at native 1920×1080 across key spoken word cues
                  </p>
                </div>
                <a
                  href="/images/blinkit_contact_sheet.jpg"
                  download="blinkit_contact_sheet.jpg"
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-zinc-800"
                >
                  Download Contact Sheet
                </a>
              </div>
              <img
                src="/images/blinkit_contact_sheet.jpg"
                alt="Blinkit 4x4 QA Contact Sheet"
                referrerPolicy="no-referrer"
                className="w-full max-w-[1160px] rounded-lg border border-zinc-800 object-contain"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
