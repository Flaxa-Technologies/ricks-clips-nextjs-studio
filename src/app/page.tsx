'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Layers,
  Video,
  Code2,
  Sparkles,
  Camera,
  UserCheck,
  Type,
  Download,
  SplitSquareHorizontal,
  Eye,
} from 'lucide-react';
import {
  BEATS,
  FPS,
  TOTAL_FRAMES,
  SUBTITLES,
  RICKS_CLIPS_BLUEPRINT,
  getFrameTelemetry,
} from '@/lib/timeline-data';
import { CanyonRailroadScene3D } from '@/components/CanyonRailroadScene3D';
import { foleyEngine } from '@/lib/web-audio-sfx';

type ViewportMode = 'webgl_3d' | 'rendered_mp4' | 'side_by_side';
type InspectorTab = 'telemetry' | 'blueprint' | 'code';

export default function RicksClipsStudioPage() {
  const [frame, setFrame] = useState<number>(14);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('webgl_3d');
  const [activeTab, setActiveTab] = useState<InspectorTab>('telemetry');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [showHudOverlay, setShowHudOverlay] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mp4Ref = useRef<HTMLVideoElement | null>(null);
  const refVideoRef = useRef<HTMLVideoElement | null>(null);

  const telemetry = getFrameTelemetry(frame);

  // Deterministic 30fps playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (mp4Ref.current) mp4Ref.current.pause();
      if (refVideoRef.current) refVideoRef.current.pause();
      return;
    }

    const intervalMs = 1000 / (FPS * playbackSpeed);
    const timer = setInterval(() => {
      setFrame((prev) => {
        const next = prev >= TOTAL_FRAMES ? 0 : prev + 1;
        foleyEngine.triggerFrameSFX(next, muted);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, muted]);

  // Sync HTML5 video elements when scrubbing or switching modes
  useEffect(() => {
    const targetTime = frame / FPS;
    if (mp4Ref.current && Math.abs(mp4Ref.current.currentTime - targetTime) > 0.08) {
      mp4Ref.current.currentTime = targetTime;
    }
    if (refVideoRef.current && Math.abs(refVideoRef.current.currentTime - targetTime) > 0.08) {
      refVideoRef.current.currentTime = targetTime;
    }
    if (audioRef.current && isPlaying && !muted) {
      if (Math.abs(audioRef.current.currentTime - targetTime) > 0.18) {
        audioRef.current.currentTime = targetTime;
      }
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {});
    }
  }, [frame, isPlaying, muted, playbackSpeed, viewportMode]);

  const stepFrame = (delta: number) => {
    setIsPlaying(false);
    setFrame((prev) => {
      const next = Math.max(0, Math.min(TOTAL_FRAMES, prev + delta));
      foleyEngine.triggerFrameSFX(next, muted);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Hidden synced audio element using our rendered 10s voiceover+SFX track */}
      <audio ref={audioRef} src="/ricks-clips-10s-example.mp4" muted={muted} preload="auto" />

      {/* Top Navigation Header */}
      <header className="border-b border-slate-800/80 bg-[#0d1322]/90 backdrop-blur px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-orange-500/20">
            RC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight text-white">
                Ricks Clips (@RicksClips3000) — Next.js Shorts Engine
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                300 Frames @ 30 FPS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              2.5D Rigged Cartoon Billboards inside a Stylized 3D React Three Fiber World • Frame-by-Frame Analyzer
            </p>
          </div>
        </div>

        {/* Viewport Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewportMode('webgl_3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewportMode === 'webgl_3d'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Live 3D Next.js Canvas
          </button>
          <button
            onClick={() => setViewportMode('rendered_mp4')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewportMode === 'rendered_mp4'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            10s Rendered MP4
          </button>
          <button
            onClick={() => setViewportMode('side_by_side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewportMode === 'side_by_side'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            Side-by-Side vs. Original
          </button>
        </div>

        {/* Download Rendered 10s Example Video */}
        <div className="flex items-center gap-2">
          <a
            href="/ricks-clips-10s-example.mp4"
            download="ricks-clips-10s-example.mp4"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download 10s MP4
          </a>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] w-full mx-auto">
        {/* LEFT / CENTER COLUMN: 9:16 Vertical Shorts Stage + Frame Scrubber */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Beat Selector Bar */}
          <div className="grid grid-cols-5 gap-1.5">
            {BEATS.map((b) => {
              const isActive = telemetry.beat.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setFrame(b.startFrame + 8);
                  }}
                  className={`text-left p-2 rounded-xl border transition ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{b.shortLabel}</div>
                  <div className="text-[10px] opacity-75">
                    f{b.startFrame}–f{b.endFrame}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 9:16 Vertical Viewport Container */}
          <div className="relative flex items-center justify-center bg-[#060911] border border-slate-800/90 rounded-2xl p-4 shadow-2xl min-h-[620px]">
            {viewportMode === 'webgl_3d' && (
              <div className="relative w-[350px] h-[622px] rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-950">
                <Canvas
                  camera={{ position: [0.35, 0.48, 3.8], fov: 48, near: 0.1, far: 120 }}
                  gl={{ preserveDrawingBuffer: true, antialias: true }}
                >
                  <CanyonRailroadScene3D telemetry={telemetry} showWireframe={showWireframe} />
                </Canvas>

                {/* Cross-Dissolve Transition Flash when camera cuts between sub-beats */}
                {telemetry.camera.crossfadeAlpha > 0.02 && (
                  <div
                    className="absolute inset-0 bg-white pointer-events-none transition-opacity"
                    style={{ opacity: telemetry.camera.crossfadeAlpha * 0.45 }}
                  />
                )}

                {/* Top Telemetry HUD Overlay */}
                {showHudOverlay && (
                  <div className="absolute top-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md border border-sky-400/40 rounded-xl px-3 py-2 pointer-events-none">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-400">
                      <span>
                        FRAME {String(frame).padStart(3, '0')}/{TOTAL_FRAMES}
                      </span>
                      <span>{telemetry.timeSeconds.toFixed(2)}s</span>
                      <span>FOV {Math.round(telemetry.camera.fov)}°</span>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-200 truncate mt-0.5">
                      {telemetry.beat.name}
                    </div>
                  </div>
                )}

                {/* Word-by-Word Pop Subtitle Overlay at 71% Vertical Height */}
                {telemetry.activeSubtitle && (
                  <div
                    className="absolute left-0 right-0 flex justify-center pointer-events-none px-4"
                    style={{ top: '69%' }}
                  >
                    <span
                      className={`ricks-subtitle-stroke font-black tracking-tight text-center select-none ${
                        telemetry.activeSubtitle.emphasis ? 'text-yellow-300' : 'text-white'
                      }`}
                      style={{
                        fontSize: '2.25rem',
                        lineHeight: 1.05,
                        transform: `scale(${telemetry.subtitleScale})`,
                      }}
                    >
                      {telemetry.activeSubtitle.text}
                    </span>
                  </div>
                )}
              </div>
            )}

            {viewportMode === 'rendered_mp4' && (
              <div className="relative w-[350px] h-[622px] rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-black">
                <video
                  ref={mp4Ref}
                  src="/ricks-clips-10s-example.mp4"
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              </div>
            )}

            {viewportMode === 'side_by_side' && (
              <div className="grid grid-cols-2 gap-4 items-center">
                {/* Original @RicksClips3000 Reference */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Original @RicksClips3000 (Frame {frame})
                  </span>
                  <div className="relative w-[270px] h-[480px] rounded-xl overflow-hidden border border-slate-700 bg-black">
                    <video
                      ref={refVideoRef}
                      src="/reference-10s.mp4"
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  </div>
                </div>

                {/* Our Live Next.js 3D Engine */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Our Next.js 3D + 2.5D Engine (Frame {frame})
                  </span>
                  <div className="relative w-[270px] h-[480px] rounded-xl overflow-hidden border border-amber-500/50 bg-slate-950">
                    <Canvas
                      camera={{ position: [0.35, 0.48, 3.8], fov: 48, near: 0.1, far: 120 }}
                    >
                      <CanyonRailroadScene3D telemetry={telemetry} showWireframe={showWireframe} />
                    </Canvas>
                    {telemetry.activeSubtitle && (
                      <div
                        className="absolute left-0 right-0 flex justify-center pointer-events-none px-2"
                        style={{ top: '69%' }}
                      >
                        <span
                          className={`ricks-subtitle-stroke font-black tracking-tight text-center ${
                            telemetry.activeSubtitle.emphasis ? 'text-yellow-300' : 'text-white'
                          }`}
                          style={{
                            fontSize: '1.75rem',
                            transform: `scale(${telemetry.subtitleScale})`,
                          }}
                        >
                          {telemetry.activeSubtitle.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Viewport Controls (Wireframe & HUD toggles) */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setShowHudOverlay((v) => !v)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                  showHudOverlay
                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                HUD
              </button>
              <button
                onClick={() => setShowWireframe((v) => !v)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                  showWireframe
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                3D Wireframe
              </button>
            </div>
          </div>

          {/* Frame-by-Frame Scrubber & Transport Controls */}
          <div className="bg-[#0d1322] border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-3">
            {/* Timeline Slider with Beat Markers */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>
                  Frame <strong className="text-white">{frame}</strong> / {TOTAL_FRAMES}
                </span>
                <span className="text-amber-400 font-semibold">
                  Active Caption: &ldquo;{telemetry.activeSubtitle?.text || '—'}&rdquo;
                </span>
                <span>{telemetry.timeSeconds.toFixed(2)}s / 10.00s</span>
              </div>
              <input
                type="range"
                min={0}
                max={TOTAL_FRAMES}
                value={frame}
                onChange={(e) => {
                  setIsPlaying(false);
                  setFrame(Number(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              {/* Word-by-word timeline tick visualization */}
              <div className="relative h-5 w-full bg-slate-900/90 rounded overflow-hidden border border-slate-800/80 flex">
                {SUBTITLES.map((sub) => {
                  const widthPct = ((sub.endFrame - sub.startFrame + 1) / TOTAL_FRAMES) * 100;
                  const isCurrent =
                    frame >= sub.startFrame && frame <= sub.endFrame;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setIsPlaying(false);
                        setFrame(sub.startFrame);
                      }}
                      style={{ width: `${widthPct}%` }}
                      title={`${sub.text} (f${sub.startFrame}–f${sub.endFrame})`}
                      className={`h-full border-r border-slate-800/70 text-[9px] truncate flex items-center justify-center cursor-pointer transition ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {sub.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transport Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => stepFrame(-10)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-mono flex items-center gap-1"
                  title="Back 10 frames"
                >
                  <SkipBack className="w-3.5 h-3.5" /> -10f
                </button>
                <button
                  onClick={() => stepFrame(-1)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-mono flex items-center gap-1"
                  title="Previous Frame"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> -1f
                </button>
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play 30 FPS'}
                </button>
                <button
                  onClick={() => stepFrame(1)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-mono flex items-center gap-1"
                  title="Next Frame"
                >
                  +1f <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => stepFrame(10)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-mono flex items-center gap-1"
                  title="Forward 10 frames"
                >
                  +10f <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed & Audio Mute */}
              <div className="flex items-center gap-2">
                {[0.25, 0.5, 1.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded text-xs font-mono ${
                      playbackSpeed === spd
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  title={muted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Frame-by-Frame Inspector, Channel Blueprint & Next.js Code */}
        <div className="lg:col-span-5 flex flex-col bg-[#0d1322] border border-slate-800/90 rounded-2xl overflow-hidden">
          {/* Inspector Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-900/60">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === 'telemetry'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Frame Inspector (f{frame})
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === 'blueprint'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              @RicksClips3000 Formula
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === 'code'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Next.js Code Pipeline
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[760px]">
            {activeTab === 'telemetry' && (
              <>
                {/* Frame Retention Lesson Card */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Why Frame {frame} ({telemetry.timeSeconds.toFixed(2)}s) Works
                    </span>
                    <span className="text-[11px] font-mono text-amber-200/80">
                      {telemetry.beat.shortLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {telemetry.frameLesson}
                  </p>
                </div>

                {/* 3D Camera State Matrix */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <Camera className="w-4 h-4" />
                    3D Camera Choreography State
                  </div>
                  <p className="text-[11px] text-slate-400">{telemetry.beat.cameraTechnique}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Position [X, Y, Z]</span>
                      <span className="text-emerald-300">
                        [{telemetry.camera.position.map((n) => n.toFixed(2)).join(', ')}]
                      </span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">LookAt Target [X, Y, Z]</span>
                      <span className="text-sky-300">
                        [{telemetry.camera.target.map((n) => n.toFixed(2)).join(', ')}]
                      </span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Field of View (FOV)</span>
                      <span className="text-amber-300">{telemetry.camera.fov.toFixed(1)}°</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Train Z / Motion Blur</span>
                      <span className="text-purple-300">
                        Z={telemetry.trainZ.toFixed(1)}m | Blur={(telemetry.camera.motionBlurStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2.5D Rigged Character State */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <UserCheck className="w-4 h-4" />
                    2.5D Cartoon Character Rig State
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Active Rig</span>
                      <span className="text-white font-semibold">{telemetry.character.characterId}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Eye State</span>
                      <span className="text-amber-300">{telemetry.character.eyeState}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Mouth Viseme</span>
                      <span className="text-emerald-300">{telemetry.character.mouthState}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Brow Angle</span>
                      <span>{(telemetry.character.browAngle * 45).toFixed(1)}°</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Saw Stroke / Lean</span>
                      <span>
                        {telemetry.character.sawStrokePhase.toFixed(2)} / {telemetry.character.bodyLean.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Active 3D Prop</span>
                      <span className="text-sky-300">{telemetry.character.propType}</span>
                    </div>
                  </div>
                </div>

                {/* Typography & Audio Cues */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-purple-400">
                      <Type className="w-4 h-4" />
                      Caption & Diegetic Foley Layer
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Pop Scale: {telemetry.subtitleScale.toFixed(2)}x
                    </span>
                  </div>
                  <div className="space-y-1">
                    {telemetry.audioCues.map((cue, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-mono bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 text-slate-300"
                      >
                        • {cue}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'blueprint' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                    Channel Pacing & Quantitative Signatures
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Speaking Rate</span>
                      <strong className="text-white">
                        {RICKS_CLIPS_BLUEPRINT.pacingMetrics.wordsPerMinute} WPM (Zero Dead Air)
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Avg Camera Cut / Beat</span>
                      <strong className="text-white">
                        Every {RICKS_CLIPS_BLUEPRINT.pacingMetrics.averageShotLengthSeconds}s (~52 frames)
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Caption Chunk Size</span>
                      <strong className="text-white">
                        {RICKS_CLIPS_BLUEPRINT.pacingMetrics.subtitleWordsPerCard}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Caption Y-Anchor</span>
                      <strong className="text-white">
                        {RICKS_CLIPS_BLUEPRINT.pacingMetrics.subtitleVerticalPosition}
                      </strong>
                    </div>
                  </div>
                </div>

                {RICKS_CLIPS_BLUEPRINT.coreLayers.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1"
                  >
                    <div className="text-xs font-bold text-white">{item.layer}</div>
                    <div className="text-[11px] font-mono text-sky-400">{item.techStack}</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  Every frame in this project is driven by a pure deterministic function{' '}
                  <code className="text-amber-300">getFrameTelemetry(frame)</code> in{' '}
                  <code className="text-sky-300">src/lib/timeline-data.ts</code>:
                </p>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`// 1. Deterministic Camera + Rig evaluation per frame (0..300)
const telemetry = getFrameTelemetry(frame);

// 2. 2.5D Billboard Character inside 3D R3F Scene
useFrame(() => {
  const dx = camera.position.x - rootRef.current.position.x;
  const dz = camera.position.z - rootRef.current.position.z;
  rootRef.current.rotation.y = Math.atan2(dx, dz);
});

// 3. Word-by-word pop-scale bounce (5-frame spring)
const localF = frame - activeSubtitle.startFrame;
const scale = localF <= 2
  ? lerp(0.86, 1.12, localF / 2)
  : localF <= 5
  ? lerp(1.12, 1.0, (localF - 2) / 3)
  : 1.0;`}
                </pre>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-slate-200 space-y-2">
                  <div className="font-bold text-emerald-300">
                    Deterministic MP4 Rendering Command
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Run <code className="text-white">python scripts/render_10s_video.py</code> to
                    render all 300 PNG frames (`frame_000.png` – `frame_299.png`) and mux them with
                    FFmpeg into <code className="text-white">public/ricks-clips-10s-example.mp4</code>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
