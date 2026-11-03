---
name: math-motion-documentary
description: >-
  End-to-end workflow for producing a 6-10 minute, voice-synced, After-Effects-style motion
  graphics documentary on ANY topic (company story, product, person, event, concept) using
  pure math: closed-form spring ODEs, Newton-Raphson cubic-bezier easing, arc-length splines,
  180-degree shutter motion blur, word-timestamp audio sync, Next.js + React + Three.js PBR
  rendered deterministically frame-by-frame with Playwright and muxed to a 1080p30 MP4 with
  ffmpeg. Use when the user gives a topic and wants a "motion graphics video", "documentary",
  "explainer", "growth story", or says "make a video like the Zomato one".
---

# Math-Driven Motion Graphics Documentary

> **Input:** a topic (e.g. "Zomato's growth", "How Tesla survived 2018", "The rise of UPI").
> **Output:** `<topic>_documentary_masterpiece.mp4` (1920x1080, 30 fps, 6-10 min, narrated,
> scored, every visual locked to the spoken word) plus a live scrubbable studio player.

This skill was distilled from a real production (Zomato growth story, 433 s, 30 beats) that
went through several rejected versions. **Every rule below exists because a draft failed
without it.** Read the "Failure Museum" (section 3) before designing anything.

Reference implementation files live in `resources/` next to this file. Copy and adapt them;
do not rewrite the math from scratch.

| File in `resources/` | Role |
| :-- | :-- |
| `kinematics.ts` | All math: clamp/lerp, cubic-bezier solver, spring ODE, recoil, reveal, arc-length spline, counters |
| `Primitives.tsx` | `KineticBlock`, `RadarStencil`, `TrajectoryRibbon`, `ContactShadow`, `CornerDepthAccents`, `EditorialStamp`, `BrandMedallion` |
| `timeline.example.ts` | Beat table + camera/transition solver (`evaluateXCamera`) |
| `ThreeStage.tsx` | Three.js PBR stage (GLB models, RoomEnvironment, ACES tone mapping) |
| `render-page.tsx` | `/render-documentary` page exposing `window.__setDocTime(t)` and `__docReady` |
| `extract_word_timestamps.py` | edge-tts `WordBoundary` extraction -> `word_map.json` |
| `build_soundtrack.py` | Voice placement, ducked music, foley on cut times -> master WAV |
| `preview_contact_sheet.py` | Playwright stills at chosen timestamps -> 4x4 contact sheet |
| `render_mp4.py` | 6-worker Playwright frame render + ffmpeg mux |

---

## 0. The Prime Directives (memorize)

1. **Every frame is a pure function of time `t`.** No CSS `transition-*`, no `animate-*`, no
   `setTimeout`, no `Date.now()`, no `Math.random()`. The renderer sets `t` and screenshots.
   If a visual depends on anything but `t`, the MP4 will differ from the preview.
2. **Audio is the master clock.** Generate the narration first, extract word-level timestamps,
   and derive *every* cut and reveal from those timestamps. Never place cuts by guess or by
   silence detection alone.
3. **Center-horizon composition.** One focal point near (960, 540). Headline above or below
   it, never left-vs-right ping-pong. The viewer's eye should not travel.
4. **Something is always moving.** No static hold longer than ~1.5 s. Background evolves,
   numbers count, curves draw, camera drifts (subtle Z push every beat).
5. **Never repeat the same animation twice in a row.** Rotate the transition vocabulary and
   the infographic vocabulary (see sections 7 and 9).
6. **Real brand assets only.** Official logos and real photos supplied by the user or fetched
   from the web. Never draw fake SVG logos, never use AI-generated logos.
7. **Keep brand colors on key highlights.** Only *defeated / irrelevant* things turn
   monochrome. The hero keeps its color and gets extra glow.
8. **Music is whisper-quiet.** Voice dominates; music is -20 dB or lower under speech, never
   pumping.
9. **Research live, no stale data.** Numbers on screen must be real, current and consistent
   with the narration.
10. **Verify visually before the long render.** Contact sheet first, full render second.

---

## 1. Workflow Overview (the 8 phases)

```
Phase 1  Research            -> RESEARCH_DOSSIER.md
Phase 2  Script + beat map   -> SCRIPT.md (chapters) + beat plan table
Phase 3  Assets              -> logos/photos/GLB models in public/images, public/models
Phase 4  Voice + word map    -> chapter WAVs + word_map.json
Phase 5  Timeline from words -> timeline.ts with exact start/end per beat
Phase 6  Build beats (React) -> Beats*.tsx using kinematics + primitives
Phase 7  Soundtrack          -> master.wav (voice + ducked score + foley)
Phase 8  QA -> render -> verify -> deliver
```

Do the phases **in order**. Phase 5 depends on Phase 4; Phase 6 depends on Phase 5.
If the script changes later, redo Phases 4, 5, 7 (timestamps shift!).

### Ask the user only for what you truly cannot get
- Topic (given), language (default English, fast pace), approximate length (default 7 min).
- Ask for logos/photos/3D models only if web fetch cannot produce clean official versions.
  If the user supplies images, copy them to `public/images/NN_name_logo_color.png`.

---

## 2. Project Scaffold

Next.js (App Router) + React 19 + Tailwind 4 + three.

```
motion-reel/
  public/images/    NN_name_logo_color.png, NN_name_logo_mono.png, portraits
  public/models/    *.glb (optional, 3-5 hero props)
  public/audio/     master_v1.wav   (bump the suffix every rebuild: cache-busting!)
  src/lib/kinematics.ts
  src/lib/timeline.ts
  src/components/Documentary.tsx           master compositor
  src/components/ThreeStage.tsx            WebGL layer
  src/components/<topic>/Primitives.tsx
  src/components/<topic>/BeatsAct1To5.tsx
  src/components/<topic>/BeatsAct6To10.tsx
  src/app/page.tsx                         studio player (audio-driven)
  src/app/render-documentary/page.tsx      deterministic frame stepper for Playwright
```

`layout.tsx` fonts: `Geist` (sans), `Geist_Mono`, `Playfair_Display` (italic serif exposed as
`font-editorial` utility). The look = **Playfair italic whisper line + monumental Geist Black
headline**.

Tailwind helper (globals.css): `.font-editorial { font-family: var(--font-serif), serif; }`

Fixed stage size is **1920x1080**. The studio page scales it with `transform: scale(0.666667)`
into a 1280x720 viewport; the render page shows it at native 1:1.

---

## 3. Failure Museum (what the user rejected and why)

| Complaint | Root cause | Permanent fix |
| :-- | :-- | :-- |
| "After transitions the screen just stays there for ages" | 45 s slides, one reveal per slide | 25-35 beats of 8-18 s, each with 4+ staged reveals timed to the voice; constant Z-drift |
| "Same shitty animation repeated" | Single fade-up used everywhere | Vocabulary of 6 transitions + 10 infographic types; rotate |
| "Lots of eye movement, text left, image right" | Split-screen layouts, bootstrap cards | Center-locked stack: whisper line / headline / hero / footer strip |
| "This is not motion graphics" | Web-page cards, boxes, SaaS UI | No cards. Use big numbers, curves, rings, stamps, bars, radial hubs |
| "Background music is loud" | Music at -10 dB with pumping sidechain | Static ducking `gain = 0.165 - 0.100*speechEnvelope`, 2.4 kHz low-pass, quiet |
| "Voice is slow, I'll get bored" | Default TTS rate | `rate="+14%"` with a neutral male voice, short punchy sentences |
| "Voice doesn't match scenes, narrating something 6-7 s ago" | Beat boundaries from blind silence detection | Word-timestamp extraction; cuts from `word_map.json` (section 6) |
| Muddy gray frames mid-transition | CSS `transition-colors` captured mid-fade by Playwright | Interpolate background RGB mathematically |
| White square instead of logo | `brightness-0 invert` on a square icon | Pre-bake mono PNGs with Rec.709 luminance; swap/cross-fade `<img>` |
| Chrome plays old audio after rebuild | Browser cache on same filename | Version the audio filename (`master_v3.wav`) |
| `moov atom not found` MP4 | Render task cancelled mid-mux | Re-run full render; always `ffprobe` the result |
| `NoAudioReceived` from edge-tts | 10 parallel websocket streams | `asyncio.Semaphore(2)` + 4-attempt retry loop |

---

## 4. Phase 1 - Research (live, multi-query)

Use web search. For a topic, collect and cross-check **at least 3 sources per key number**.

Checklist for a company/product story:
- Founding date, founders, original idea (the "humble start" hook).
- Pivot moments (what changed, when, why).
- Competitors and their fates (who died, who was acquired, dates, amounts).
- Key financials: revenue, profit/loss quarter by quarter, valuation, IPO price and listing day,
  peak and trough share prices, current market cap.
- Existential crises and the contrarian bets that saved it.
- Latest news (filings, rebrands, new business lines) - **today's data, not 2 years old.**
- A resonant closing lesson (one sentence).

For a non-company topic (technology, event, person) use the same skeleton:
origin -> problem -> breakthrough -> rivals/obstacles -> crisis -> resolution -> present state -> lesson.

Write `RESEARCH_DOSSIER.md` with a table `claim | number | source URL | confidence`.
Flag disputed numbers and either pick the conservative one or word the narration
("over forty percent", "roughly").

Currency/units: say numbers the way the audience says them
(India: lakh crore; US: billion; keep digits in on-screen text and words in narration).

---

## 5. Phase 2 - Script and Beat Plan

### 5.1 Narration style
- English, conversational, intelligent, **fast**. Short sentences. Hook within 10 s.
- 130-165 words/minute after TTS speed-up. 7 min ≈ 1,100-1,300 words.
- Each chapter is one TTS file (8-12 chapters). Each chapter contains 2-4 *beats*.
- Every sentence should *name something visual*: a number, a logo, a place, an action. That
  is what the on-screen reveal will lock to.
- Use pauses ("..." or sentence breaks) before big reveals; the TTS leaves 0.4-0.7 s gaps there
  and those gaps are your cut points.

### 5.2 Story arc template (adapt per topic)
1. **Hook (0-35 s):** the product in the viewer's hand + the shocking scale + "but it started with ___".
2. **Origin (35-75 s):** time, place, the everyday frustration, the founders.
3. **First identity (75-120 s):** naming/rebrand, original business model, why it printed money.
4. **Invasion (120-170 s):** competitors flood in, show their logos, burn-rate absurdity, the dilemma.
5. **Slaughter (170-225 s):** unit economics pain -> hero attacks -> competitors die (logo color to B&W) -> growth race chart.
6. **Shock + milestone (225-270 s):** external crisis (-70% style number), recovery curve, IPO / big win.
7. **Crash + contrarian bet (270-320 s):** crash chart, critics, the bet, the doubt quote.
8. **Why the bet worked (320-365 s):** the physics/insight, rival collapse, first profit.
9. **Empire (365-405 s):** latest audited numbers, the new structure (hub diagram), super-rally.
10. **Epilogue (405-end):** the one-sentence lesson, finale lockup, fade to black.

### 5.3 Beat plan table (create before coding)

| Beat | Chapter | Approx time | Spoken cue words | Hero visual | Transition in | Theme |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| B01 | 1 | 0-10 | "when hunger strikes... twenty minutes" | 3D phone + route bar | none | light |

Rules for the plan:
- 25-35 beats, average 12-16 s, **max 20 s**.
- Alternate `light` and `dark` themes at emotional turns (dark = danger, war, crash).
- Each beat has exactly one *hero visual* in the center and 3-6 *timed reveals* (see 7.4).
- No two adjacent beats share the same hero-visual type or transition mode.

### 5.4 Chapter text constants
Put narration strings in `synthesize_english_audio.py` as `CHAPTERS_EN = [(cid, text), ...]`
(same structure as the Zomato run). The chapter ids must also appear in `CHAPTER_GAPS`
(lead-in gap per chapter: 0.50 s for first, 0.35 s middle, 0.40 s last).

---

## 6. Phase 4 - Voice and Word-Timestamp Map (THE sync system)

### 6.1 Synthesize with word boundaries
`resources/extract_word_timestamps.py` does this. Key facts:

- `edge_tts.Communicate(text, voice="en-US-AndrewNeural", rate="+14%", pitch="+0Hz", boundary="WordBoundary")`
- Stream chunks: write `audio` chunks to mp3; collect `WordBoundary` chunks
  (`offset` and `duration` are in 100-ns ticks -> divide by `1e7` for seconds).
- Convert mp3 -> 48 kHz mono WAV with ffmpeg.
- **Concurrency:** `asyncio.Semaphore(2)` and a 4-attempt retry loop - 10 simultaneous streams
  triggers `NoAudioReceived`.
- Compute **global time** of each word: `g = chapter_start + offset` where
  `chapter_start` accumulates `lead_gap + wav_duration` across chapters starting at `0.40 s`.
  Total duration = last chapter end + `1.80 s` outro.
- Save `word_map.json`:
  ```json
  {"totalDuration": 433.268,
   "chapters": [{"cid":"ch01_hook","start":0.9,"end":34.09,"dur":33.19,
                 "words":[{"g":0.99,"loc":0.09,"w":"In"}, ...]}]}
  ```
- Print a **phrase map**: group words into phrases wherever the gap between consecutive word
  starts is >= 0.42 s, print `[ 97.05s] to ZOMATO`. This human-readable printout is what
  you use to design every cue.

### 6.2 Cut rule
A beat boundary must sit at **a phrase boundary just before the first word the new beat talks
about** (cut 0.05-0.30 s before the word so the new visual is already arriving when it is
spoken). Never cut mid-phrase.

### 6.3 Reveal rule
Each on-screen reveal's trigger time `at = word.g - 0.0..0.25` (a visual should appear a
hair *before* or exactly on the word, never after). Numbers that count up should start on the
word that introduces them and end ~0.2 s after the word that finishes the idea.

### 6.4 Re-sync discipline
Whenever the script or TTS settings change, re-run extraction. **All timestamps in the code
are then stale.** Update in this order: `timeline.ts` -> beat files -> `Documentary.tsx` 3D
poses/recoils -> `build_soundtrack.py` cut + impact lists -> preview capture timestamps.

---

## 7. The Math Engine (`kinematics.ts`)

Copy `resources/kinematics.ts` verbatim. This section explains each function so you can use
it correctly and extend it.

### 7.1 Basic operators
```
clamp(x, lo, hi) = min(max(x, lo), hi)
lerp(a, b, t)    = a + (b - a) t
remap(x, i0, i1, o0, o1) = o0 + (o1 - o0) * clamp((x - i0)/(i1 - i0))
```
Time-window pattern used everywhere: `p = clamp((t - start) / duration)`.

### 7.2 Cubic-Bezier easing (After Effects graph editor)
CSS/AE `cubic-bezier(x1, y1, x2, y2)` defines a Bezier with P0=(0,0), P3=(1,1):

```
Bx(u) = 3(1-u)^2 u x1 + 3(1-u) u^2 x2 + u^3
By(u) = 3(1-u)^2 u y1 + 3(1-u) u^2 y2 + u^3
```
To ease at time `t` you must **invert** `Bx(u) = t` for `u`, then return `By(u)`.
`solveCubicBezierParameter` does 8 Newton-Raphson iterations
`u <- u - (Bx(u)-t)/Bx'(u)` with a 14-step bisection fallback (needed for extreme curves like
`[0.86, 0, 0.14, 1]` where `Bx'` approaches 0). Precision < 1e-7.

Velocity (for motion blur): `dy/dt = (dBy/du) / (dBx/du)`.

Canonical curves:
| Name | Control points | Feel | Use |
| :-- | :-- | :-- | :-- |
| `AE_SNAP` | (0.16, 1, 0.30, 1) | instant start, long soft landing | reveals, counters, chart draws |
| `AE_WHIP` | (0.86, 0, 0.14, 1) | slow-fast-slow, violent middle | whip-pan / transitions |
| `AE_SILK` | (0.33, 1, 0.68, 1) | gentle ease-out | opacity fades, fade to black |

### 7.3 Damped spring (the "alive" feel)
Exact solution of `x'' + 2 zeta w0 x' + w0^2 (x - 1) = 0`, `x(0)=0`, `x'(0)=v0`:

- **Underdamped** (`zeta < 1`): `wd = w0 sqrt(1 - zeta^2)`,
  `x(t) = 1 - e^{-zeta w0 t} (cos(wd t) + B sin(wd t))`, `B = (zeta w0 - v0)/wd`.
- **Critical** (`zeta = 1`): `x = 1 - e^{-w0 t}(1 + (w0 - v0) t)`.
- **Over** (`zeta > 1`): two real roots `r1,2 = -w0 (zeta -/+ sqrt(zeta^2-1))`.

Presets that worked:
| Use | omega0 | zeta |
| :-- | :-- | :-- |
| standard text reveal | 18.5 | 0.80 |
| hero headline | 20 | 0.76 |
| big overshoot "slam" (stamps, alerts) | 24 | 0.62-0.72 |
| 3D model entrance | 14-15.5 | 0.76-0.82 |
| radar stencil | 14.5 | 0.80 |

### 7.4 `computeReveal(t, at, opts)` - the universal entrance
Returns `{opacity, yPx, scale, blurPx}`:
```
dt      = t - at           (<= 0 => opacity 0, fully offset, fully blurred)
spring  = springODE(dt, w0, zeta).value
ease    = AE_SNAP(clamp(dt / dur))
opacity = AE_SILK(clamp(dt / (0.55 dur)))
yPx     = (1 - spring) * distancePx
scale   = lerp(scaleFrom, 1, spring)
blurPx  = maxBlur * (1 - ease)^2.2      (f/1.4 focal pull)
```
`KineticBlock` wraps this. **Every text/graphic element enters through `KineticBlock t={t} at={cue}`.**

### 7.5 Impulse recoil (impact feel)
`impulseRecoil(dt, A, damping, freq) = A e^{-damping dt} sin(freq dt)` for `0 < dt < 1.2`.
Sum several, one per hero impact (rebrand, "slaughtered", crash, gong, acquisition), and apply
to the master camera container's `translateY`. Typical: `A 7.5-11, damping 11-12, freq 38-44`.

### 7.6 Spatial splines with arc-length parameterization
A cubic Bezier `B(u)` does **not** move at constant speed in `u`. For a drawing line or a rider
moving smoothly you need arc-length parameterization:

1. Sample `N=160` points; accumulate `s_i = sum |B(u_i) - B(u_{i-1})|`.
2. For fraction `f`, target `s = f * S_total`; binary-search the table; linearly interpolate `u`.
3. Evaluate `B(u)` and the analytic tangent `B'(u)`; `angle = atan2(dy, dx)`.

Drawing a line progressively: SVG `stroke-dasharray = totalLength`,
`stroke-dashoffset = totalLength * (1 - eased)`. A dot/logo rides at
`sampleArcLengthSpline(spline, eased)`.

### 7.7 Counters
`formatAnimatedNumber(t, start, dur, from, to, decimals)` = `lerp(from, to, AE_SNAP(p))`.
Fast climb then settle - reads as "authoritative". Use `toLocaleString("en-IN")` or
`en-US` for grouping. Count to the *spoken* number on the *spoken* word.

### 7.8 180-degree shutter motion blur
Real shutter blur is proportional to speed. During a whip:
```
offset = (1 - AE_WHIP(tau)) * dir * 1920        (or 1080 vertical)
blurX  = |dir.x| * AE_WHIP_VEL(tau) * 7.2       (stdDeviation, px)
blurY  = |dir.y| * AE_WHIP_VEL(tau) * 6.2
```
Apply with an SVG `feGaussianBlur stdDeviation="blurX blurY"` filter on the master world
container only while blur > 0.3 (cap X at 30 / Y at 24).

### 7.9 Background interpolation (no CSS transitions)
```
bg = lerp([243,243,245], [9,9,11], darkMix)   per channel, Math.round
```
`darkMix` is 0 (studio paper `#F3F3F5`) or 1 (obsidian `#09090B`) and is eased across the
transition window. Text color flips at `darkMix > 0.5`.

### 7.10 Rec.709 monochrome (for defeated brands)
Pre-bake mono logos with luminance `Y = 0.2126 R + 0.7152 G + 0.0722 B` (keep alpha):
```python
from PIL import Image
im = Image.open(src).convert("RGBA"); r,g,b,a = im.split()
y = Image.eval(Image.merge("RGB",(r,g,b)).convert("L"), lambda v: v)  # PIL "L" uses Rec.601; use numpy for 709
```
Prefer numpy: `Y = (0.2126*R + 0.7152*G + 0.0722*B).astype(uint8)`; save `name_logo_mono.png`.
Never use CSS `grayscale()`/`invert()` tricks on live elements (they break on square icons).

---

## 8. Transition Vocabulary (rotate, never repeat adjacent)

Defined in `timeline.example.ts` via `evaluateXCamera(t)`. Half-window `HALF_TRANS = 0.24 s`
(0.48 s total). For every beat `i` the solver computes incoming motion around `start` and
outgoing motion around the *previous* `end`, then composites both beats simultaneously.

| Mode | Incoming motion | Outgoing motion |
| :-- | :-- | :-- |
| `whip-right/left/up/down` | offset `(1-AE_WHIP)*dir*1920/1080`, scale 0.94 -> 1, opacity `tau*3.2`, shutter blur | pushed opposite, scale 1 -> 0.94 |
| `dolly-through` | scale 0.64 -> 1 (AE_SNAP), blur 14 -> 0, opacity `tau*2.4` | scale 1 -> 1.48, blur 0 -> 14, opacity `(1-tau)*2.2` |
| `iris-wipe` | `clip-path: circle(r% at 50% 50%)`, r = `AE_SNAP * 115`, own bg color | scale 1 -> 0.96, hides at `tau > 0.96` |
| `none` | first beat only | |

Constant between transitions: **Z-drift** `scale = lerp(0.988, 1.032, progress)` across every
beat so nothing is ever perfectly still.

Choose by emotion: whip-down into crashes/danger, dolly-through into "zoom into detail" or
new era, iris-wipe for reveals/rebrands, whip-right for progression, whip-up for growth.

Render each beat inside its own absolutely positioned layer (`zIndex 25`, iris layers 27)
with its own bg color when iris clipping.

---

## 9. Layer Architecture (`Documentary.tsx`)

```
<div 1920x1080 style={{backgroundColor: bgCss}}>
  <svg defs>   shutter blur filter + dot-grid patterns
  vignette radial gradient (light/dark variants)
  dot-grid pattern overlay
  <div master camera: translateY(globalRecoilY), filter: shutter blur>
     Z5  : per-beat background SVG   (TrajectoryRibbon, RadarStencil, ContactShadow, reticle)
     Z15 : <ThreeStage pose={threePose}/>   real WebGL hero object
     Z25 : per-beat foreground layers (BeatsAct1To5 / BeatsAct6To10 by chapter)
     Z30 : CornerDepthAccents (blurred drifting corner shapes, depth cue)
  </div>
  Z50: master fade to black (last 1.5 s) using AE_SILK
</div>
```
`cam = evaluateXCamera(t)` -> `cam.activeBeats[]` (each with `offsetX/Y, scale, opacity, blurPx,
clipIrisRadiusPct, localTime`). Render **every active beat** (two during a transition).

### 9.1 3D hero choreography (`threePose`)
A `useMemo` switch on `beat.id` returns a pose
`{model, pixelX, pixelY, diameterPx, rotX, rotY, rotZ, darkTheme, opacity, blurPx, shadowStrength}`.
Pixel coordinates are mapped to the 3D camera by the stage. Patterns:
- Entrance: `diameterPx = lerp(355, 425, enterSp) * scale`, `enterSp = springODE(local,14.5,0.82).value`.
- Slow turntable: `rotY = lerp(-0.46, 0.46, beatFraction)`.
- Hover: `pixelY = 515 + sin(t*1.65)*7.5`.
- Rack focus on entry: `blurPx = 9*(1 - AE_SNAP(local/0.48))^2`.
- A model may appear only after its spoken word: `if (t < cue) return null` and use `t - cue` as local time.
- The 3D object sits at center (960, 515-520); **all text lives above Y~230 or below Y~800.**

### 9.2 ThreeStage essentials (`resources/ThreeStage.tsx`)
- `WebGLRenderer({alpha:true, antialias:true, preserveDrawingBuffer:true})`.
- `toneMapping = ACESFilmicToneMapping`, exposure 1.3-1.45; `sRGBEncoding` output.
- Image-based lighting: `PMREMGenerator.fromScene(new RoomEnvironment(), 0.04)`.
- Load GLBs via `GLTFLoader` (+ optional Draco), normalize each to unit size, center pivot.
- Set `window.__zomatoModelsReady = true` (rename per topic) when all models loaded
  **or failed** (never hang the render).
- Dark theme: slightly lower exposure; add rim light.
- If no GLB is available for a topic, skip 3D beats entirely rather than faking with CSS.
  Good props are a single isolated hero object, watertight, centered pivot, 3-tone PBR.

---

## 10. Beat Design Vocabulary (the infographic toolbox)

Use these building blocks; each beat should combine **one hero + 3-6 timed reveals**.

| # | Visual | When to use | Math |
| :-- | :-- | :-- | :-- |
| 1 | **Monumental number** (84-168 px) with counter | any headline stat | `formatAnimatedNumber`, spring reveal |
| 2 | **Route/progress bar with traveling dot** | process, timeline, delivery | linear `lerp` + `AE_SNAP` |
| 3 | **Spline chart that draws itself** | growth, crash, recovery | arc-length spline + dashoffset |
| 4 | **Logo riding the curve tip** | multi-company comparison | `sampleArcLengthSpline` for x,y |
| 5 | **Radar stencil ring** (rotating dashed circles) | frames a 3D hero, adds precision feel | `rotate(t*11.5)` + spring radius |
| 6 | **Dial / ring gauge** | percentage, margin | `strokeDashoffset = C*(1 - frac*pct)` |
| 7 | **Stacked/split bar** | cost vs revenue, mix | widths = `pct * AE_SNAP(p)` |
| 8 | **Waterfall list** | unit economics | staggered bars with signed values |
| 9 | **Candlestick crash** | stock fall | N bars revealed by `floor(p*N)`, red/gray |
| 10 | **Radial hub** (center node + 4 satellites + dashed spokes) | corporate structure | spokes `lerp(center,node,AE_SNAP)` |
| 11 | **Shockwave rings** | impact, IPO bell, launch | `r = r0 + p*R`, `opacity = (1-p)*0.65` |
| 12 | **Fork diagram** (two splines diverge) | dilemma, decision | two arc-length splines, staggered draw |
| 13 | **Brand medallion row** with B&W drain + stamp | competitors | `BrandMedallion` |
| 14 | **Typed text pill** (URL typing) | origin of a website/app | `slice(0, floor(p*len))` + blinking caret `sin(t*10)>0` |
| 15 | **Scan beam** | digitizing, scanning | `y = sin((t - t0)*3.4)*135` with glow |
| 16 | **Stopwatch** | speed claims | `lerp(600, 112, p)` -> `mm:ss` |
| 17 | **Quote card** (Playfair italic, curly quotes) | critic/investor line | KineticBlock |
| 18 | **Stamp slam** (rotated bordered label) | elimination, verdict | `EditorialStamp` spring 24/0.62 |
| 19 | **Concentric viral rings + adoption curve** | spread, virality | staggered ring progress |
| 20 | **P&L bars around a zero horizon** | first profit | negative gray down, positive green up |

### 10.1 Typography system
- Whisper line: `font-editorial italic text-[44-50px] text-zinc-700 leading-none` (dark: `text-zinc-300`).
- Headline: `text-[76-96px] font-black uppercase tracking-[-0.048em] leading-none` (`whitespace-nowrap` if one line).
- Monumental stat: `text-[148-168px] font-black tracking-[-0.055em] leading-[0.9]`.
- Mono caption: `font-mono text-[13-16px] tracking-[0.18-0.24em] uppercase font-bold text-zinc-500`.
- Hero color from brand (e.g. `#E23744`). Positive = emerald `#059669`/`#10B981`; warning/yellow `#F8CB46`.
- Always inspect: any text wider than ~1500 px must be `whitespace-nowrap` or shortened.

### 10.2 Layout grid (1920x1080, center-locked)
```
Y 60-230   whisper line + headline (top block)           [centered]
Y 230-800  hero visual / chart / 3D model                [center 960,515]
Y 800-1000 footer strip: caption, pill, domain, takeaway [centered]
```
Alternative: a single vertically centered flex column (`absolute inset-0 flex flex-col
items-center justify-center`) with width 1000-1300 px. **Never** place text left and image
right. If two things must be side by side, they form one tight centered pair (<= 700 px apart).

### 10.3 Competitor-slaughter pattern (colored -> B&W)
1. Show 4-5 official logos in full color (`BrandMedallion`, `enterAt` each on the spoken name).
2. On the kill word, set `drainAt` for each victim: over 0.55 s `AE_SNAP`
   - color emblem opacity `1 -> 0`, mono emblem cross-fades in (opacity `drainFrac*0.46`),
   - tile sags 18 px and shrinks to 0.90, diagonal crimson slash draws,
   - after 0.12 s a rotated `EditorialStamp` ("COLLAPSED", "SHUTTERED", "ACQUIRED") slams in.
3. Hero logo stays in full color with `highlightColor` ring, 42 px glow and bigger size.
4. Dramatic silence: drop the music kick pattern for ~3-4 s around the kill word.

### 10.4 Multi-company growth race on ONE chart
- 1 spline per company; hero's is thickest with a wide translucent glow ribbon.
- Each company's **actual logo rides its curve tip**; hero gets a white disc, 4 px brand ring,
  pulsing halo (`r = 28 + 8 sin(6t) + 22`), larger logo (64 px vs 38-44) and a pill label
  `"55% ZOMATO #1"`.
- Dying competitors: curve color -> gray (`#A1A1AA`) and logo swaps to mono past ~65-72% progress.
- Race progress `raceP = clamp((t - tStart)/duration)` starts on the first spoken company name
  and ends on the final share figure.

---

## 11. Phase 3 - Assets

### Logos
- Fetch official brand logos from the web (company press kits, Wikimedia, app-store icons).
  Show the user a contact sheet and get approval before building ("get it from internet,
  AI-generated is not the same as original").
- Normalize to square PNG with transparent or brand-color tile; crop/upscale as needed.
- Naming: `NN_brand_logo_color.png` + `NN_brand_logo_mono.png` (Rec.709).
- Wordmarks (e.g. "eternal") go in a white tile with `h-[46px] object-contain`.
- Double-check relevance (e.g. Amazon was removed because it does not do food delivery).
  Use only companies the narration actually mentions.

### Portraits
- Clean cutout (transparent PNG). Make a mono version for editorial look; keep full color only
  if it is a highlight.

### 3D models (optional)
Spec: 1 isolated hero object, zero floor/background, watertight, centered pivot,
45-degree bevels, 3-tone PBR (metal/matte/silicone). 3-5 models per film is plenty
(phone, menu, bag, crate, gong style). Ask the user to generate if none exist.

### User-uploaded images
Copy into `public/images` with the numbered naming scheme, wire them in, rebuild.

---

## 12. Phase 5 - Timeline File (`timeline.ts`)

```ts
export interface BeatWindow {
  id: string; chapter: number; start: number; end: number;
  transition: "none"|"whip-right"|"whip-left"|"whip-up"|"whip-down"|"dolly-through"|"iris-wipe";
  theme: "light"|"dark";
}
export const TOTAL_DURATION = <word_map.totalDuration rounded to 2 dp>;
export const SCENES: BeatWindow[] = [ ... ];
```
Validation checklist (write a quick script):
- `SCENES[0].start === 0`, `SCENES[i].start === SCENES[i-1].end` (contiguous), last end = total.
- No beat > 20 s, none < 6 s.
- No two adjacent beats have the same `transition` (except `none`).
- Each `start` is within 0.30 s before a phrase start in the phrase map.
- Dark beats cluster at danger/war/crash segments.

---

## 13. Phase 6 - Building Beats

### 13.1 Component contract
```tsx
export const BeatsActX: React.FC<{beatId:string; t:number; localTime:number}> = ({beatId,t,localTime}) => {
  switch (beatId) {
    case "B01_...": { /* compute derived values from t */ return <div>...</div>; }
    ...
  }
};
```
- `t` = global time, `localTime = t - beat.start`. Use **global `t`** for cue triggers
  (matches the word map directly) and `localTime` only for relative animation.
- Hoist expensive objects (splines) with `useMemo` at component top, outside the switch.
- Compute booleans like `const rebranded = t >= 96.85;` for state swaps (headline text, color,
  banner content) so the screen *changes* on the word.

### 13.2 Per-beat recipe
1. Whisper line (Playfair) at `beatStart + 0.2`.
2. Headline slams in on the spoken key phrase.
3. Hero visual builds progressively across the beat (never fully visible at the start).
4. 2-4 secondary reveals on subsequent spoken words (labels, stamps, bars).
5. A **state change** at the beat's emotional peak (color flip, new banner, stamp).
6. Footer strip/caption lands in the last third.

### 13.3 Hook density
Every 3-5 s something new must appear or change. Count the reveal times in each beat; if a gap
exceeds 5 s, add a counter, ring, stamp, or caption swap. This directly answers "viewer just
stares at one screen".

### 13.4 Content truthfulness
Illustrative numbers (e.g. "+Rs 45,000/MO sponsored slot", fake restaurant names) are allowed
only as obvious illustrations and must not be presented as facts; prefer real numbers.

### 13.5 `Documentary.tsx` extras
- Background-layer map per beat (which ribbon/stencil/shadow to draw, with `triggerAt` on the
  spoken word).
- Reticle circle (r 380, dashed, 4% opacity) on pure-graphic beats for subtle structure.
- Recoil sum of 5-6 `impulseRecoil` terms at hero impact times (usually the same times as
  the `add_sub_impact` / `add_stamp_slam` foley).
- `masterFadeBlack = AE_SILK(clamp((t - (TOTAL-1.6)) / 1.55))` -> black overlay at Z50.

---

## 14. Phase 7 - Soundtrack (`build_soundtrack.py`)

### 14.1 Timeline
Load each `chapter.wav` mono 48 kHz. `cur = 0.40`; for each chapter `cur += lead_gap`,
`start = cur`, `end = cur + len/SR`, `cur = end`. Total = `cur + 1.80`. **Must equal
`word_map.totalDuration`** (assert).

### 14.2 Voice
- Normalize each chapter to peak 0.94 with 15 ms fades.
- Speech gate = 1 across `[start - 0.12 s, end + 0.18 s]` for each chapter; smooth with a
  2nd-order Butterworth low-pass at 0.9 Hz -> envelope `E(t)` in [0,1] (silky, non-pumping).

### 14.3 Score (synthesized, no copyright issues)
- 108 BPM. Soft heartbeat kick on bar positions 0 and 2: `0.28 sin(2π f t) e^{-12t}` with
  `f = 88 e^{-20 t} + 46`; muted rim tick on beat 3 at 380 Hz.
- 16-beat chord blocks cycling Am7 -> Fmaj7 -> C -> G: sub pad (root/2), felt-piano chord
  (fundamental + 2nd harmonic, slow decay 0.32), 8th-note muted marimba arpeggio (decay 16).
- **Low-pass at 2,400 Hz** to leave the 2.5-6 kHz vocal-presence band clear.
- **Ducking:** `gain = 0.165 - 0.100 * E(t)` (≈ -15.6 dB in gaps, ≈ -23.7 dB under voice).
- Dramatic silence window (skip kicks) for ~3-4 s around the kill-word beat.

### 14.4 Foley (all timestamps from the word map)
| Event | Function | Notes |
| :-- | :-- | :-- |
| every beat cut | `add_silk_whoosh(cut, pan alternating)` | band-pass noise 280-1800 Hz, `sin^2.4` envelope, starts 0.18 s before the cut, intensity 0.13 |
| hero impact | `add_sub_impact(t, amp 0.22-0.32)` | `f = 90 e^{-3.5 t} + 34`, 0.85 s |
| stamp / elimination | `add_stamp_slam(t)` | `f = 140 e^{-18 t} + 48`, 0.22 s |
| IPO / launch bell | `add_gong_chime(t)` | partials 174.6/349.2/523.25/880 Hz, 4.2 s |

### 14.5 Master
Final 1.6 s linear fade; if peak > 0.96 normalize to 0.95; 16-bit stereo 48 kHz.
Copy to **both** `master_audio.wav` (for ffmpeg) and `public/audio/master_vN.wav` (player),
**bumping N every rebuild** to defeat browser caching, and update `<audio src>` in `page.tsx`.

---

## 15. Studio Player (`page.tsx`)

- `<audio ref src="/audio/master_vN.wav">` is the **only** clock source.
- `requestAnimationFrame` loop: if audio not paused -> `setCurrentTime(audio.currentTime)`.
- Controls: play/pause, scrubber `input[type=range] step=0.05`, beat jump pills,
  reset, download MP4 link.
- Stage: 1280x720 container, inner 1920x1080 with `transform: scale(0.666667)`.
- Hard-refresh instruction to user after any rebuild (Ctrl+F5).

## 16. Render Page (`/render-documentary`)

```tsx
window.__setDocTime = (t) => new Promise(res => {
  flushSync(() => setDocTime(Math.min(t, TOTAL)));
  requestAnimationFrame(() => res());
});
```
- `flushSync` guarantees DOM + WebGL are committed before the screenshot.
- Set `window.__docReady = true` after `document.fonts.ready` **and** `__modelsReady`.
- Page root: `<main class="relative w-[1920px] h-[1080px] overflow-hidden">`.

---

## 17. Phase 8 - QA, Render, Verify

### 17.1 Build and serve
```powershell
cd motion-reel
npm run build            # fix every TS error; unused/narrowed types often break after edits
npx next start -p 3000   # daemon; kill + restart after each rebuild
```

### 17.2 Contact-sheet QA (before the long render)
`preview_contact_sheet.py`: Playwright (system Chrome, ANGLE d3d11 flags for WebGL),
viewport 1920x1080, wait for `__docReady`, call `__setDocTime(t)` for ~16 timestamps chosen at
**the visual peak of each key beat** (just *after* the spoken cue), screenshot JPEG q95, tile
to a 4x4 sheet. Inspect it for:
- collisions/overlaps, clipped text, off-center layout,
- brand colors present on highlights, B&W drain correct,
- 3D object not overlapping text,
- correct state at the cue time (e.g. ZOMATO wordmark visible at 98 s, not 88 s),
- no muddy mid-transition frames.
Fix, rebuild, recapture until clean.

### 17.3 Full render
`render_mp4.py`:
- `TOTAL_FRAMES = int(TOTAL_DUR * 30)`, `NUM_WORKERS = 6`, contiguous chunks per worker.
- Each worker: own Chromium page, `goto(url, networkidle)`, wait `__docReady`, loop frames:
  `__setDocTime(i/30)` then `screenshot(type="jpeg", quality=92)` -> `frame_%05d.jpg`.
- Skip existing frames > 8 KB (resume support); recover any missing frames serially.
- ffmpeg mux:
  `-framerate 30 -i frame_%05d.jpg -i master_audio.wav -c:v libx264 -preset slow -crf 16
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 320k -shortest out.mp4`
- Typical: ~5 min for 13k frames with 6 workers (7-10 fps each), ~1.4-3.5x realtime mux.
- Run as a **background daemon task** and wait for the completion message; do not poll.
- Copy MP4 to `public/` for the player download button.
- **Do not cancel mid-run** - cancelling during mux leaves a file with no `moov` atom.

### 17.4 Verification
```powershell
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of default=nw=1 out.mp4
ffmpeg -ss <cueTime> -i out.mp4 -frames:v 1 verify.jpg     # decode stills at 3-6 key cues
```
Expect h264 1920x1080 30/1, aac, duration = `TOTAL` ± 0.05 s. View the stills.

### 17.5 Deliver
Give clickable `file:///` links to the MP4 and contact sheet, state the duration/size, and
say honestly what was and was not verified (e.g. "did not play it back with sound").

---

## 18. Editing an Existing Film (change requests)

| Request | Do this |
| :-- | :-- |
| "Add logo X to scene at 6:27" | 6:27 = 387 s -> find beat via timeline; copy image to `public/images`; edit that beat's node `img`; remove fallbacks that no longer type-check; rebuild; capture still; re-render |
| "Voice doesn't match" | re-extract word map; update timeline, all `at=` cues, recoil/foley times; bump audio version |
| "Too slow / boring" | raise TTS rate, shorten sentences, split long beats, add reveals every 3-5 s |
| "Music too loud" | lower `0.165`/`0.100` ducking constants or add more low-pass; keep voice peak 0.94 |
| "Same animation repeated" | audit adjacent beats' transition + hero-visual types; swap from sections 8/10 |
| "Everything not centered" | refactor to the center stack in 10.2; remove split layouts |
| "Colors removed" | restore brand colors on highlights; only defeated entities get mono |

Always re-run: build -> restart server -> contact sheet -> full render -> ffprobe.

---

## 19. Troubleshooting

| Symptom | Likely cause | Fix |
| :-- | :-- | :-- |
| Preview good, MP4 mid-transition blotchy | CSS transitions anywhere | search `transition-`/`animate-`; replace with math |
| Text shifts between preview and render | font not loaded | wait `document.fonts.ready` |
| 3D model missing in render | models not ready / path wrong | check `__modelsReady`, GLB path, 404s in server log |
| WebGL black in headless | GPU flags | launch with `--use-gl=angle --use-angle=d3d11 --enable-webgl --ignore-gpu-blocklist` |
| Frames identical across time | `__setDocTime` not using `flushSync` | wrap state set in `flushSync` |
| TS error after replacing placeholder badge with `img` | union type narrowed | remove dead `badge` branch |
| edge-tts `NoAudioReceived` | too many parallel streams | semaphore 2 + retry |
| Audio ends before video | master WAV shorter than frames | assert durations equal; `-shortest` hides it, so check ffprobe |
| Old audio plays | browser cache | rename to `master_vN+1.wav` |
| Logo shows white square | CSS filter on icon | pre-baked mono PNG swap |
| ffprobe `moov atom not found` | render cancelled | re-run `render_mp4.py` |
| Window titles/ports busy | old `next start` still running | kill background task before restart |

---

## 20. End-to-End Execution Script (what to do when the user gives a topic)

1. **Restate the plan in 3 lines** (topic, target length, language). Do not ask many questions.
2. **Research** (section 4) -> `<TOPIC>_RESEARCH_DOSSIER.md`.
3. **Write script** (section 5) -> `<TOPIC>_SCRIPT.md` + chapters list in `synthesize_english_audio.py`.
4. **Gather assets** (section 11). If logos/models cannot be sourced cleanly, ask the user
   with a precise checklist (filenames + specs) and wait.
5. **Scaffold or reuse** `motion-reel/`; copy `resources/` files, rename `Zomato*` symbols,
   change `window.__zomatoModelsReady` etc. to topic-neutral names.
6. **Run** `extract_word_timestamps.py` -> `word_map.json` + phrase map.
7. **Plan beats** (5.3) from the phrase map -> write `timeline.ts` (section 12) and validate.
8. **Implement beats** (sections 10 and 13) with cues from the phrase map.
9. **Build soundtrack** (section 14) with cut/impact lists from the word map.
10. **Build + serve + contact sheet** (17.1-17.2); iterate until clean.
11. **Full render + ffprobe + stills** (17.3-17.4).
12. **Deliver** (17.5), offer the studio player URL, and invite timestamp-specific fixes.

### Definition of done
- [ ] Duration 6-10 min, audio length = video length.
- [ ] Every cut sits in a spoken pause; every reveal within ~0.25 s of its word.
- [ ] No static hold > 1.5 s; reveal gap <= 5 s.
- [ ] No adjacent identical transitions or hero types.
- [ ] Real logos with correct colors; defeated brands mono; hero highlighted.
- [ ] Center-locked layout, zero collisions in contact sheet.
- [ ] Music inaudible *under* speech but present in gaps; no pumping.
- [ ] Zero CSS transitions/animations in source.
- [ ] MP4 verified with ffprobe + decoded stills.

---

## 21. Quick Formula Sheet

```
lerp(a,b,t)=a+(b-a)t                          p=clamp((t-t0)/d)
Bezier ease:  solve Bx(u)=t (Newton, 8 it) -> By(u)
Spring (under): x=1-e^{-ζωt}(cos ω_d t + ((ζω-v0)/ω_d) sin ω_d t), ω_d=ω√(1-ζ²)
Recoil: A e^{-k t} sin(f t)
Arc-length: S_i=Σ|B(u_i)-B(u_{i-1})|, u(f)=interp over S table
Draw: dashoffset = L(1-ease)
Motion blur σ = |dir| · v(τ) · 7.2   (v = dy/dt of the easing)
Dial: dashoffset = 2πr (1 - frac·pct)
Counter: lerp(from,to,AE_SNAP(p))
BG: rgb = lerp(light,dark,darkMix)
Mono: Y=0.2126R+0.7152G+0.0722B
Duck: g = 0.165 - 0.100·E(t),  E = LPF_0.9Hz(speechGate)
Cut time = phrase_start(word_map) - (0.05..0.30)s
```

## 22. Style Guardrails (what "good" looks like)

- **Do:** monumental type, one hero, whisper serif, thin mono captions, dot-grid paper
  background, soft contact shadows, brand color accents, restrained palette (black/white +
  one hero color + one positive green + one warning yellow).
- **Don't:** drop shadows on text, gradients on text, emoji, stock icons, bootstrap cards,
  more than ~6 text elements on screen, text under 13 px, anything that isn't a function of `t`.
- **Pace:** Hook in 10 s; first logo/hero in 25 s; first "wow number" by 20 s; first
  state-change stamp by 3 min; closing lesson in the last 30 s.

---

## 23. Pre-Made Transitions & Motion Graphics Library (`resources/FeaturedTransitions.tsx`)

Import and weave these **7 reusable, deterministic transition and motion rigs** across feature documentaries and shorts:

1. **`BallSplineCometTransition` (Motion Nations `00:10s` Minimal Line & Ball Style)**
   - Arc-length parameterized spline $\mathbf{B}(s)$ where the tail parameter $s_{\text{tail}}(t)$ lags $s_{\text{head}}(t)$ via staggered cubic-bezier easing, producing a velocity-stretching tapered comet tail ($w_k = (k/M)^{1.55} \cdot 7.5\,\text{px}$).
   - Sweeps horizontally across the center to laser-unmask kinetic typography (`clip-path: inset(0 R% 0 0)`), then triggers a **radial iris wipe** (`clip-path: circle(r(t) at 960px 540px)`) transitioning from Dark Mode to Studio Paper Light Mode.
2. **`FounderEmpireOrbitRig` (Pooya Taher Viral Reel Style — Part 1)**
   - Staggered kinetic header + morphing subtitle (`"isn't just a CEO"` $\rightarrow$ `"he's a business empire"`), monochrome founder portrait cutout rising in front of a parallax city skyline, and a **true 3D depth-sorted elliptical orbit ring** ($x = R_x\cos\theta, y = R_y\sin\theta, z = \sin\theta$) split into two SVG passes (Back Pass $z < 0$ behind portrait, Front Pass $z \ge 0$ in front of portrait).
3. **`CoinFlipRadialDialRig` (Pooya Taher Viral Reel Style — Part 2)**
   - Central **3D-extruded white medallion coin** that flips $180^\circ$ in 3D (`perspective(1000px) rotateY`) on each beat while a semi-circular perimeter dial gauge (`strokeDashoffset`) lights up subsidiary/competitor brand labels around the arc.
4. **`MatchCutMorphTransition` (Vox / Johnny Harris Signature Match-Cut)**
   - Shared central SVG ring geometry that anchors the viewer's eye across a scene cut—morphing smoothly from a **Market Share Donut Chart** in Scene A into a **Tactical Radar Target Reticle** in Scene B while the background cross-wipes.
5. **`NewspaperMicrofilmHighlighter` (Vox / MagnatesMedia Archival Press Rig)**
   - 3D tilted financial broadsheet (`perspective(1300px) rotateX rotateY rotateZ`) pushing in with depth-of-field rack focus (`blur(9px) -> 0px`) and a translucent neon-yellow marker sweep (`mix-blend-mode: multiply`).
6. **`Isometric3DCameraMapFlyover` (Johnny Harris / fern Geo-Telemetry Rig)**
   - 3D tilted geospatial map grid (`perspective(1200px) rotateX(58deg) rotateZ`) with camera pan, pulsing vertical radar pins, floating hub callout cards, and glowing parabolic supply-chain arcs.
7. **`KineticSlotMachineOdometer` & `ShutterSliceWipeTransition`**
   - Vertical rolling digit barrels (`0–9`) with velocity-proportional motion blur ($\sigma_y = \text{clamp}(|\dot{y}| \cdot 3.5, 0, 12)$) + synchronized area sparkline, followed by a 5-blade staggered mechanical shutter wipe for chapter transitions.

### Mandatory Production Upgrades (Lessons from Zomato & Blinkit Master Renders)
- **NEVER render top diagnostic HUD telemetry text** (e.g., `• CH.01 // B03 ... FRM 00666`) in final documentary frames. Keep the top of the frame 100% clean.
- **3D-Edged Beveled Cards with White Inner Pedestals** (`box-shadow: 0 14px 0 #09090b`) for competitor/brand cards (Amazon, Flipkart, BigBasket, etc.) so dark logos never blend into dark backgrounds.
- **Real Founder Portraits & Documentary Scene Photos**: Always integrate real executive portrait cutouts (with `CEO` / `CO-FOUNDER` pills) and authentic documentary photography (e.g., kirana storefronts, dark store fulfillment aisles).
- **Option 3 Soundtrack (`resources/build_soundtrack_opt3.py`)**: Synthesize a **116 BPM Modern Ambient Momentum** score (Vox / Johnny Harris warm Rhodes pads + soft acoustic kick + 8th-note shaker, low-pass filtered at 2,800 Hz, ducked -18 dB under speech) with stereo transition whooshes.

---

## 24. Volume 2 Motion Rigs (`resources/FeaturedTransitionsVol2.tsx`) & "What to Show When" Matrix

### Volume 2 Pre-Made Rigs (`FeaturedTransitionsVol2.tsx`)
8. **`RedThreadEvidenceBoardRig` (Vox / AEffecto Investigative Detective Corkboard)**
   - Polaroid frames taped at the top with translucent masking tape (`bg-amber-100/80 rotate-2`), 4 monochrome archival evidence photos around a central founder Polaroid, red pushpins (`#ef4444`), self-drawing crimson yarn web (`strokeDashoffset`), tilted black Dymo embossed tape stamp (`FOUNDER & CEO`), hand-drawn red marker spiral loop around the portrait, and diagonal volumetric window-blind shadow bars.
9. **`VoxScreenRecording3DBrowser` (Motion Nations 3D Search-to-Article Flip)**
   - Phase A: 3D tilted Google Search bar typing query character-by-character with live autocomplete dropdown suggestions.
   - Phase B: 3D perspective card flip into an encyclopedia/filing browser card where multi-line yellow highlighter sweeps (`#fef08a`) and a hand-drawn red ink oval isolate the key market-share disclosure.
10. **`MagnatesFlowchartAndOrbitBadgeRig` (Vane Motion Spinning Circular Text Badge + Orthogonal Flowchart)**
    - Central parent emblem encircled by a continuously rotating circular `<textPath>` SVG badge (`ETERNAL CORPORATE EMPIRE • MARKET LEADER •`), feeding 90-degree rounded-elbow orthogonal flowchart pipes into 3D subsidiary cards (`BLINKIT`, `ZOMATO`, `HYPERPURE`).
11. **`ThreeDCameraTimelineCorridor` (ColdFusion / MagnatesMedia Z-Space Time-Travel Fly-Through)**
    - True 3D camera dolly (`camZ` advancing from `-150` to `1750` inside `perspective: 900px`) flying past historical year portals (`2013 -> 2018 -> 2021 -> 2026`) positioned in Z-space (`translate3d(xOffset, yOffset, -relZ)`), with distance-based depth-of-field blur $\sigma_{\text{DOF}} = \text{clamp}(|\text{relZ} - 180| / 360, 0, 8\text{ px})$.
12. **`AppleBentoGridShowcaseRig` (Apple Keynote Modular Bento Grid + Sequential Focus Wave)**
    - 5 asymmetrical glassmorphic Bento cards springing in via staggered harmonic oscillators (`idx * 0.10s`) with a sequential `ACTIVE FOCUS` spotlight wave (`scale(1.025)` + glowing border) touring each card.
13. **`SplitScreenVersusAndCollageRig` (Diagonal Clash + Liquid Bezier Curtain Wipe + 12fps Stop-Motion Cutout)**
    - Opposing diagonal split-screen showdown (`polygon(0 0, 56% 0, 44% 100%, 0 100%)` vs. right half) with central `VS` medallion, wiped upward by a **Liquid Bezier Curtain Wave** (`M 0 yEdge Q 960 yBelly 1920 yEdge L 1920 1080 L 0 1080 Z`) into a **12 fps `posterizeTime(localT, 12)` Stop-Motion Torn-Paper Cutout Card**.

### "What to Show When" — Documentary Visual Choreography Matrix

| Narrative Trigger in Script | Visual Rig to Deploy | Best Transition Out |
| :--- | :--- | :--- |
| **1. Hook Paradox / Thesis Statement** | `BallSplineCometTransition` (Vol. 1) | Radial Iris Circle Wipe (`clip-path: circle()`) |
| **2. Introducing a Founder / CEO Empire** | `FounderEmpireOrbitRig` (Vol. 1) | Zoom-In Match Cut into chest emblem (`CoinFlipRadialDialRig`) |
| **3. Crisis, Scandal, or Secret Deal** | `RedThreadEvidenceBoardRig` (Vol. 2) | 5-Blade Mechanical Shutter Wipe (`ShutterSliceWipeTransition`) |
| **4. Proving a Fact via Search / Filing / Press** | `VoxScreenRecording3DBrowser` (Vol. 2) or `NewspaperMicrofilmHighlighter` (Vol. 1) | 3D Perspective Card Flip (`rotateY`) |
| **5. Parent Company & Subsidiary Ecosystem** | `MagnatesFlowchartAndOrbitBadgeRig` (Vol. 2) or `CoinFlipRadialDialRig` (Vol. 1) | Horizontal Whip-Pan |
| **6. Multi-Year Historical Evolution** | `ThreeDCameraTimelineCorridor` (Vol. 2) | Portal Fly-Through (final year card fills frame) |
| **7. Geographic Grid / Supply Chain / Dark Stores** | `Isometric3DCameraMapFlyover` (Vol. 1) | Geometric Match-Cut (`MatchCutMorphTransition`) |
| **8. Multi-Metric Operating System Breakdown** | `AppleBentoGridShowcaseRig` (Vol. 2) | Liquid Bezier Curtain Wave |
| **9. Head-to-Head Competitor Showdown** | `SplitScreenVersusAndCollageRig` (Vol. 2) | Liquid Bezier Wave Wipe into 12fps Stop-Motion Collage |
| **10. Climax Financial / Revenue Counter** | `KineticSlotMachineOdometer` (Vol. 1) | 5-Blade Shutter Wipe or Iris Close |
