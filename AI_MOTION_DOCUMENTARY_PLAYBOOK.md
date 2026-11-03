# AI Motion-Graphics Documentary Master Playbook (After Effects Level in Next.js + Three.js)

> **HOW TO USE THIS FILE WITH ANY AI AGENT**  
> Tag or paste this file at the start of a new session:  
> `"Read @AI_MOTION_DOCUMENTARY_PLAYBOOK.md, @REQUIRED_3D_MODELS.md, and @REQUIRED_IMAGES.md. Create a long-form motion-graphics documentary on [TOPIC]. Follow every gatekeeper phase in exact order — start with Phase 1 (Live Internet Research + Script) and Phase 2 (ask me for the 3D models and clean background-free images before building the video)."`

---

## 0. Prime Directives (Non-Negotiable Rules for the AI)

1. **LIVE INTERNET RESEARCH IS EVERYTHING — ZERO STALE DATA**:
   - **NEVER** rely on your internal training-cutoff memory for valuations, revenue, market share, stock prices, CEOs, product lineups, or dates.
   - Always check the current date first and run live multi-query web searches (official investor relations, SEC 10-K/10-Q filings, earnings releases, authoritative journalism) before writing a single word of the script.
2. **HUMAN-IN-THE-LOOP ASSET PROTOCOL — NEVER IMPROVISE UGLY ASSETS**:
   - **NEVER** draw fake amateur SVG illustrations of products/people, and **NEVER** scrape messy, watermarked, or cluttered-background JPEGs off the web.
   - Right after researching and writing the script, you **MUST** generate two clean checklist files in the project root — `REQUIRED_3D_MODELS.md` and `REQUIRED_IMAGES.md` — containing exact copy-pasteable generation prompts (following the standards inside those two files), then **STOP AND ASK THE USER** to supply those `.glb` models and clean background-free `.png` images.
3. **PURE MATHEMATICAL ANIMATION — ZERO RANDOM GUESSING, ZERO WALL-CLOCK LAG**:
   - **NEVER** use wall-clock CSS transitions (`transition: all 0.5s`) or `framer-motion` real-time timers (`transition={{ duration: 0.4 }}`). During headless browser MP4 capture, real-time timers desynchronize from video time `t` and cause severe stutter.
   - Every position, scale, rotation, opacity, blur kernel, number counter, and SVG dashoffset MUST be a **pure deterministic mathematical function $f(t)$** of exact video timestamp `t` (in seconds), rendered synchronously via `ReactDOM.flushSync`.
4. **MINIMALIST MONOCHROME EDITORIAL AESTHETIC ("LESS COLOR = MORE AUTHORITY")**:
   - Use an architectural gallery palette: Alabaster studio paper (`#F3F3F5`), deep carbon ink (`#0A0A0D`), brushed platinum (`#D4D4D8`), and surgical **Inverted Obsidian Crisis Beats** (`#09090B` background / `#FAFAFA` chalk type) on existential turning points.
   - If the brand has a signature accent color, either stay **100% pure monochrome** (recommended for maximum authority) or restrict the accent to **at most 2% of pixels** (e.g., a single terminal data pulse).
   - **BANNED AI SLOP**: Zero persistent top chapter banners, zero glassmorphism paragraph cards, zero neon `shadowBlur` WordArt glows, zero floating confetti particles, zero cluttered multi-box dashboards.

---

## Workflow Gatekeeper Pipeline (Execute Strictly in Order)

```
[PHASE 1] Live Internet Research -> Verified Fact Sheet -> High-Retention Script (SCRIPT.md)
    │
    ▼
[PHASE 2] Generate REQUIRED_3D_MODELS.md + REQUIRED_IMAGES.md -> STOP & WAIT FOR USER ASSETS
    │
    ▼
[PHASE 3] ElevenLabs Narration + Sidechained Score -> 50ms RMS Acoustic Breath-Pause Map
    │
    ▼
[PHASE 4] Next.js + React + Three.js Mathematical Motion Engine (ODE + Bezier + PBR + 2.5D PNGs)
    │
    ▼
[PHASE 5] Pre-Render 12-Scene Contact Sheet Visual QA -> Fix Any Flaws -> Parallel 1080p/4K MP4 Render
```

---

## PHASE 1: Live Internet Research & Documentary Script Architecture

### 1.1 Mandatory Research Checklist
Before drafting any narration, run live web searches to verify and log into `RESEARCH_DOSSIER.md`:
1. **Current Snapshot (As of Current Month/Year)**: Exact market cap / valuation, latest full-year reported revenue, net income, gross margin, and primary revenue driver `%` breakdown.
2. **Origin & Founding Myth**: Exact founding date, location, founders, initial capital, and early cultural details (e.g., a diner booth, a garage, a rejected pitch).
3. **Existential Crisis #1 (Early Near-Death)**: Failed product, architectural mistake, or cash crunch (exact remaining runway / bailout amount / who saved them).
4. **Category-Defining Breakthrough #1**: The product or invention that created a new category (exact year, technical leap in plain visual terms).
5. **The Long Contrarian Bet + Crisis #2 (Wall Street Doubt / Crash)**: A multi-year expensive bet that outsiders mocked, paired with the exact `%` stock crash or financial pain endured.
6. **The Inflection Spark**: The external catalyst or scientific moment where the contrarian bet suddenly paid off.
7. **Modern Hyper-Scale Architecture & Epilogue**: Current flagship engineering metrics (transistor count, thrust, throughput, energy scale) and philosophical closing thesis.

*(Optional: If the user asks you for a Deep Research Prompt to run in an external research model first, give them the prompt in Appendix A.)*

### 1.2 Narrative Pacing & Contrast Formula
Structure `SCRIPT.md` into **6–7 Chapters (12–16 Visual Scenes, ~2:15–4:00 runtime)**:
- **Hook (`0:00–0:18`)**: Open on the staggering present-day reality (`$X.XX Trillion` / defining scale), then whip-pan back to the humble origin (`"Thirty-three years ago, this didn't start in an elite lab..."`).
- **Alternate Light & Dark Emotional Polarity**:
  - **Light Studio Paper (`#F3F3F5`)** (~78% of video): Growth, engineering breakthroughs, data clarity, milestones.
  - **Inverted Obsidian (`#09090B`)** (~22% of video, 2–3 scenes max): Near-bankruptcy, product disaster, `-70%` market crash, or industry shockwave. Flipping polarity on a frame-locked sub-bass hit creates visceral After Effects drama without adding clutter.
- **Spoken Cadence Rule**: Write short, cinematic declarative sentences (`8–18 words` each). Leave intentional punctuation breaks (`...` or `—`) where visual whip-pans and number slams will land.
- **Visual Text Economy Rule**: **Never put narration sentences on screen.** The voiceover carries the prose; the screen shows **at most 1 Hero Metric/Title + 1 Serif Lead-in + 1 Micro-Mono Spec Line** per beat, surrounded by `>= 60%` clean negative space.

---

## PHASE 2: Requesting 3D Models & Clean Cutout Images (STOP & ASK USER)

Once `SCRIPT.md` is ready, map every scene (`Scene 01` to `Scene N`) to its single visual hero anchor (either a **3D `.glb` CAD model** or a **clean background-free `.png` image**).

1. Create/update `REQUIRED_3D_MODELS.md` in the project directory following its 7 Studio Geometry Rules & Prompt Formulas (typically **4 to 6 `.glb` models** reused thoughtfully across hero angles and exploded/detail views).
2. Create/update `REQUIRED_IMAGES.md` in the project directory following its 6 Clean-Image Laws & Prompt Formulas (founders' studio portraits, historical hardware cutouts, clean architectural/product PNGs — **strictly zero backgrounds, zero clutter, zero text overlays**).
3. **STOP EXECUTION HERE.** Present `SCRIPT.md`, `REQUIRED_3D_MODELS.md`, and `REQUIRED_IMAGES.md` to the user and wait until the user provides the `.glb` and `.png` files!

### Clean Image Hygiene Check (Once User Supplies Images)
When the user provides images:
- Visually inspect **every single image** before coding (`read_file` / image viewer).
- Verify true RGBA alpha transparency (`mode == "RGBA"` and corner alpha `== 0`). If an image has a solid white `#FFFFFF` studio background instead of alpha, cleanly strip the background using `rembg` (`pip install rembg`) + `1.5px` alpha feathering + bounding-box auto-crop (`Image.getbbox()`) so every cutout sits centered with zero ragged halo pixels.

---

## PHASE 3: Voiceover Synthesis, Ambient Score & Acoustic Cut-Point Math

### 3.1 Narration & Master Audio Mix (`48,000 Hz` True Stereo `.wav`)
1. **Voiceover**: Generate chapter `.wav` files via ElevenLabs (`eleven_multilingual_v2`, e.g., Voice ID `J17lijyP1BHYcM7ld0Rg` or calm documentary baritone, `stability: 0.58`, `similarity_boost: 0.78`, `style: 0.15`). Leave `1.2s–1.8s` breathing room between chapters.
2. **Minimalist Calm Background Score + Sidechain Ducking**:
   - Layer warm sub-bass drones + soft felt-piano fifths/ninths (`A minor -> F major -> C major -> G`).
   - Compute a smooth speech envelope $E(t)$ from the narration RMS and apply **automatic sidechain ducking** (`gain = 1.0 - 0.68 * E(t)`) so the music breathes up during pauses and ducks cleanly `-9 dB` underneath spoken words.
3. **Frame-Locked Motion Foley**:
   - **Whip-Pan Air Whoosh**: Bandpass-filtered stereo pink-noise sweep (`220 Hz -> 1400 Hz -> 300 Hz`, `0.38s` duration, stereo pan matching camera `enterDir`) triggered at every scene transition timestamp $t_{\text{cut}}$.
   - **Obsidian Crisis Sub-Drop**: Sine pitch-drop (`78 Hz -> 31 Hz`, `0.65s` exponential decay) on every Light-to-Dark polarity flip.
   - **Mechanical Shutter Tick**: `4ms` damped high-passed impulse (`3.2 kHz`) on micro-spec reveals and counter locks.
   - Normalize master peak to `-1.5 dBFS` (`int16` max `~27,500`) with zero clipping or `NaN`s.

### 3.2 Waveform-Measured Scene Cuts (Zero Guessed Timestamps!)
**NEVER place scene cuts at arbitrary round numbers (`10.0s`, `20.0s`) — they will slice straight through spoken syllables!**

Run a **50ms RMS Energy Window Scanner** across every narration `.wav` file before finalizing `SCENES`:
```python
import wave, numpy as np

def find_breath_pauses(wav_path: str, chapter_offset_s: float, min_pause_s: float = 0.15):
    with wave.open(wav_path, "rb") as wf:
        sr = wf.getframerate()
        raw = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32)
        if wf.getnchannels() == 2:
            raw = raw.reshape(-1, 2).mean(axis=1)
    raw /= (np.max(np.abs(raw)) + 1e-6)
    win = int(0.05 * sr)  # 50ms window
    rms = np.array([np.sqrt(np.mean(raw[i:i+win]**2)) for i in range(0, len(raw) - win, win)])
    silent = rms < 0.035
    # Extract contiguous silent spans >= min_pause_s and place scene cuts at pause midpoints!
```
Every `SceneWindow.start` and `SceneWindow.end` MUST land at the exact midpoint of a verified `>= 150ms` breath pause.

---

## PHASE 4: Next.js + React + Three.js Mathematical Motion Engine

### 4.1 Project Stack & Config Rules
- **Framework**: Next.js (App Router) + React 19 + TypeScript + Tailwind CSS + `three` (`@types/three`).
- **Tailwind v4 Scope Rule** (Prevents Turbopack OOM when frame folders exist):
  - In `src/app/globals.css`: `@import "tailwindcss" source("../../src");`
  - In `next.config.ts`: set `turbopack: { root: path.resolve(__dirname) }`.
- **Dual Routes**:
  - `/` (`src/app/page.tsx`): Live 60fps interactive 16:9 studio player synced to `<audio>`, with timeline scrubber, scene jump pills, and MP4 download button.
  - `/render-documentary` (`src/app/render-documentary/page.tsx`): Pure `1920×1080` (`overflow: hidden`) deterministic frame stage exposing `window.__setDocTime(t)` via `ReactDOM.flushSync` and `window.__docReady = true` only after `document.fonts.ready` AND all `.glb` + `.png` assets finish loading.

### 4.2 Core Mathematical Kinematics (`src/lib/kinematics.ts`)

#### A. Closed-Form Second-Order Damped Harmonic Oscillator (`springODE`)
Solves $\ddot{x} + 2\zeta\omega_0\dot{x} + \omega_0^2(x - 1) = 0$ with $x(0)=0, \dot{x}(0)=v_0$ analytically in $O(1)$ time:
- **Hero Typography Settle**: $\omega_0 = 18.0$, $\zeta = 0.82$ (crisp snap with `~1.2%` organic micro-overshoot).
- **3D Hardware Scale-In**: $\omega_0 = 13.5$, $\zeta = 0.84$ (weighty physical inertia).
- **Tactile Pill / Badge Pop**: $\omega_0 = 24.0$, $\zeta = 0.68$ (lively `~5%` bounce).

```ts
export function springODE(dt: number, omega0 = 18.0, zeta = 0.82, v0 = 0.0) {
  if (dt <= 0) return { value: 0, velocity: v0 };
  if (zeta < 1.0 - 1e-5) {
    const omegaD = omega0 * Math.sqrt(1.0 - zeta * zeta);
    const env = Math.exp(-zeta * omega0 * dt);
    const c1 = -1.0;
    const c2 = (v0 + zeta * omega0 * c1) / omegaD;
    const cosT = Math.cos(omegaD * dt);
    const sinT = Math.sin(omegaD * dt);
    return {
      value: 1.0 + env * (c1 * cosT + c2 * sinT),
      velocity: env * (c1 * (-zeta * omega0 * cosT - omegaD * sinT) + c2 * (-zeta * omega0 * sinT + omegaD * cosT)),
    };
  }
  const env = Math.exp(-omega0 * dt);
  return { value: 1.0 + env * (-1.0 + (v0 - omega0) * dt), velocity: env * (v0 - omega0 * (v0 - omega0) * dt) };
}
```

#### B. Newton-Raphson Cubic-Bezier Speed Graph + 180°-Shutter Directional Motion Blur
In After Effects, whip-pans look cinematic because of two coupled math properties:
1. Steep ease-out speed graph (`AE_SNAP = cubicBezier(0.16, 1.0, 0.30, 1.0)`), solved via 6 iterations of Newton-Raphson $s_{k+1} = s_k - \frac{B_x(s_k) - u}{B'_x(s_k)}$.
2. **180°-Shutter Directional Motion Blur**: Instantaneous blur standard deviation $(\sigma_x, \sigma_y)$ is strictly proportional to instantaneous pixel velocity:
   $$\sigma_x(t) = \min\!\left(42,\; \frac{|v_x(t)| \cdot \Delta t_{\text{shutter}}}{2.355}\right), \qquad \Delta t_{\text{shutter}} = \frac{180^\circ}{360^\circ \cdot \text{FPS}} = \frac{1}{60}\text{ s}$$
   Feed $(\sigma_x, \sigma_y)$ into an SVG `<filter id="whip-blur"><feGaussianBlur stdDeviation={`${bx} ${by}`} /></filter>` wrapping the sliding world stage! Static frames have $v=0 \implies \sigma = 0$ (razor sharp); mid-whip frames streak optically along the exact vector of travel.

#### C. Gauss-Chord Arc-Length Parameterized Bezier Splines
Cubic Beziers $B(u)$ do NOT move at uniform speed in $u$. Pre-sample $N = 160$ chord segments into a cumulative arc-length LUT $L[i]$ and invert $s \in [0, L_{\text{total}}]$ via binary search so `strokeDashoffset = totalLength * (1 - eased)` and the leading tangent node $(x(s), y(s), \text{atan2}(B'_y, B'_x))$ glide at mathematically exact tangential speed.

#### D. Optical Focal-Pull + Baseline Mask Typography Reveals
Combine three simultaneous optical cues on text/stat entrances (`computeReveal(t, triggerAt)`):
1. Vertical baseline rise (`y: +32px -> 0px` via `springODE`).
2. Lens rack-focus (`blur: 10px -> 0px` via exponential decay).
3. Subtle scale lock (`0.96 -> 1.00`).
For hero headlines, wrap lines in `<div className="overflow-hidden py-1">` so words slice cleanly upward out of an invisible architectural baseline mask!

---

### 4.3 Strict 5-Layer Z-Depth Composition Rules (`1920×1080`)

Never allow visual layers to collide! Enforce this exact Z-stack in every scene:

| Z-Layer | Role | Rules |
| :--- | :--- | :--- |
| **`z-0`** | **Studio Cyclorama & Grid** | `#F3F3F5` (or `#09090B` dark), soft radial studio vignette, `60px` `+` registration crosshairs (`opacity: 0.08`). |
| **`z-5`** | **Vector Drafting & Splines** | Rotating dashed radar stencils (`strokeDasharray="10 9"`), coordinate leader lines, and Bezier trajectory ribbons. **MUST sit BEHIND 3D hardware (`z-15`) and NEVER cross over text (`z-25`)!** |
| **`z-15`** | **3D PBR Stage & Clean 2D Cutouts** | Single hero `.glb` model or clean transparent `.png` cutout occupying its dedicated Left, Center, or Right studio zone, with angled studio drop-shadow (`22px 36px 26px`). |
| **`z-25`** | **Editorial Kinetic Typography** | Paired `Playfair Display Italic` lead-in (`34–40px`) + `Geist Black` hero stat/title (`96–148px`, tracking `-0.045em`) + `Geist Mono` micro-spec (`12px`, tracking `+0.22em`). |
| **`z-32`** | **Corner-Only Optical Bokeh** | Optional subtle blurred foreground framing elements (`blur(6px)`, `opacity: 0.18`) strictly outside `[0..1920]` safe-text margins (top-left / bottom-right corners only — NEVER in central whitespace). |

---

### 4.4 Three.js Monochrome PBR Studio Rules (`MonochromeThreeStage.tsx`)

Every beginner Three.js video fails on 4 traps. Follow all 4 mathematical fixes below:

1. **Mandatory `RoomEnvironment` IBL**: Metallic CAD materials (`metalness >= 0.7`) reflect `scene.environment`. Without an environment map, metallic chips render pitch black! Always initialize:
   ```ts
   const pmrem = new THREE.PMREMGenerator(renderer);
   scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
   ```
2. **Nested `pivotGroup -> centeringGroup` Normalization**:
   - Compute `box = new THREE.Box3().setFromObject(rawModel)`, `center = box.getCenter(...)`, `maxDim = Math.max(size.x, size.y, size.z)`.
   - Offset `rawModel.position.set(-center.x, -center.y, -center.z)` inside `centeringGroup` (`scale = 1 / maxDim`), then place `centeringGroup` inside `pivotGroup`.
   - Animate ONLY `pivotGroup.position`, `pivotGroup.rotation`, and `pivotGroup.scale`! That way translating the object across the screen NEVER shifts its center of rotation.
3. **Exact Projective Frustum Pixel-to-3D Mapping**:
   Given camera at $(0, 0, z_{\text{cam}})$ with vertical field-of-view $\text{FOV}$ on a $1920\times 1080$ canvas:
   $$\text{HALF\_H} = z_{\text{cam}} \tan\!\left(\frac{\text{FOV}\cdot \pi}{360}\right), \qquad \text{HALF\_W} = \text{HALF\_H} \cdot \frac{16}{9}$$
   $$X_{\text{world}} = \left(\frac{x_{\text{px}}}{960} - 1\right)\text{HALF\_W}, \qquad Y_{\text{world}} = \left(1 - \frac{y_{\text{px}}}{540}\right)\text{HALF\_H}, \qquad S_{\text{world}} = \frac{D_{\text{px}}}{1080}\cdot 2\,\text{HALF\_H}$$
   Now placing a 3D model at `(pixelX: 1365, pixelY: 535, diameterPx: 540)` lands at that **exact pixel coordinate** with zero guesswork!
4. **Rec.709 Pixel Luminance Monochromator + Beauty-Arc Rotation**:
   - Convert all baked `.glb` textures (`map`, `emissiveMap`) pixel-by-pixel via $Y = 0.2126R + 0.7152G + 0.0722B$, set `material.iridescence = 0` (prevents rainbow thin-film tint on silicon dies), and remap pure-white CAD meshes (`hsl.l > 0.85`) into anodized dark titanium (`0.09 + 0.36 * l`, `metalness = 0.72`, `roughness = 0.32`) so they contrast crisply against `#F3F3F5` studio paper.
   - **Beauty-Arc Rule**: Never spin a hardware model continuously $360^\circ$ (`rotY = t * 0.5`), or it will turn paper-thin edge-on or expose an unmodeled backside. Always sweep `rotY = lerp(-0.52, +0.52, sceneFraction)` across its most photogenic isometric front arc!

---

### 4.5 Next-Generation Upgrades (How to Make Videos Even Better Than V1)

To push quality **even higher** on future videos, layer in these 4 advanced mathematical techniques:

1. **Exploded-View 3D CAD Choreography**:
   - On Load, record each child mesh's local centroid $\vec{c}_i$ relative to the model origin.
   - During an engineering breakdown beat, displace child sub-meshes outward along their normalized radial/axial vector $\hat{n}_i = \vec{c}_i / \|\vec{c}_i\|$ by $d_i(t) = A \cdot \text{springODE}(t - t_{\text{explode}}) - A \cdot \text{springODE}(t - t_{\text{reassemble}})$, with thin SVG callout leader lines dynamically tracking the projected 2D screen coordinates (`vec3.project(camera)`) of specific sub-components!
2. **3D Match-Cut Dolly-Through Transitions**:
   - Instead of only 2D whip-pans, animate `camera.position.z` from `7.5` straight through the center aperture of a 3D object (`z -> 0.35`, `AE_SNAP`) on the final `0.35s` of a scene while match-cutting to the next 3D model emerging from `scale: 0.25 -> 1.0`.
3. **2.5D Multi-Plane Clean Cutout Rig (For User-Supplied `.png` Images)**:
   - Render user-supplied transparent `.png` portraits/products with:
     - **Monochrome Editorial Grade**: `filter: grayscale(100%) contrast(112%) brightness(102%) drop-shadow(18px 28px 24px rgba(10,10,14,0.22))`
     - **Differential Depth Parallax**: Background radar stencil moves at `0.85×` camera offset, subject PNG moves at `1.00×` with subtle `scale(1.00 -> 1.04)` Ken Burns drift, and micro-caption moves at `1.12×`.
4. **Dynamic SVG Path Morphing & Split-Flap Odometer Counters**:
   - Animate hero digits (`$0.00T -> $4.94T`) using per-digit vertical ribbon columns (`translateY(-digit * 1em)`) driven by `AE_SILK` so individual place-values roll like a precision mechanical Leica / Braun instrument!

---

## PHASE 5: Mandatory Pre-Render Visual QA & Parallel MP4 Capture

### 5.1 Pre-Render Contact Sheet Gate (NEVER Skip!)
Before rendering thousands of frames:
1. Build and start the production Next.js server (`npm run build && npm run start -- -p 3000`).
2. Run a 10-second Playwright preview script (`preview_scenes.py`) that calls `window.__setDocTime(t)` at the peak timestamp of **every single scene** + 1 mid-transition whip-blur frame, saving individual `1920×1080` JPEGs and a stitched `3×4` contact sheet.
3. **Visually inspect the contact sheet and individual stills** using your vision tool (`read_file`):
   - Check 1: Does ANY spline or stencil line cross over text? (Move spline coordinates or lower z-index).
   - Check 2: Is any 3D model turned edge-on, clipped, too small, or blending white-on-white into `#F3F3F5`? (Adjust `rotX/rotY` beauty arc or anodized titanium luminance).
   - Check 3: Is any text truncated, wrapping awkwardly, or crowding the margins (`< 110px` from edges)?
4. Fix any visual imperfection, rebuild Next.js, and re-verify the still before launching the full render!

### 5.2 Parallel Deterministic WebGL MP4 Render (`1920×1080` or `3840×2160`)
Use `3–4` parallel Playwright headless Chrome workers with hardware ANGLE D3D11 WebGL enabled:
- Chrome flags: `["--use-gl=angle", "--use-angle=d3d11", "--enable-webgl", "--ignore-gpu-blocklist", "--disable-gpu-vsync"]`
- Per-frame deterministic step:
  ```js
  // Inside /render-documentary/page.tsx
  window.__setDocTime = (t) => new Promise((resolve) => {
    flushSync(() => setTime(t));
    requestAnimationFrame(() => resolve());
  });
  ```
- Verify zero missing frames (`frame_00001.jpg` .. `frame_NNNNN.jpg`), then mux with FFmpeg:
  ```bash
  ffmpeg -y -framerate 30 -i frames/frame_%05d.jpg -i master_audio.wav \
    -c:v libx264 -preset slow -crf 15 -pix_fmt yuv420p -movflags +faststart \
    -c:a aac -b:a 320k -shortest final_masterpiece.mp4
  ```
- Run `ffprobe` + extract 4 decoded verification frames directly from `final_masterpiece.mp4` to confirm exact duration, `1920×1080` resolution, `48000 Hz` stereo AAC, and crisp visual quality before presenting to the user.

---

## Appendix A: Ready-to-Use Deep Internet Research Prompt
*(Give this prompt to the user ONLY if they want an external Deep Research model to compile the raw facts; otherwise perform this research yourself via web search tools!)*

```text
Compile an exhaustive, fact-checked, up-to-the-minute documentary research dossier on [COMPANY / TOPIC] as of [CURRENT MONTH & YEAR]. Do NOT use outdated figures — verify every number against the latest annual/quarterly financial filings and current market data:

1. Present-Day Snapshot (Exact date of market data, market capitalization, latest full fiscal year revenue, net income, operating margin, YoY growth %, and exact revenue breakdown by business segment).
2. Founding Story (Exact date, city/venue, co-founders, initial capital, and early concrete anecdotes).
3. Existential Crises & Failures (Every near-bankruptcy, failed flagship product, architectural mistake, or >50% stock crash — include exact dates, dollar figures, and how they survived).
4. Defining Engineering & Product Breakthroughs (Chronological list of the 4–5 pivotal inventions/products, exact launch dates, core technical specs, and why competitors failed to match them).
5. Iconic Quotes & Cultural Artifacts (Verbatim documented quotes, famous keynotes, or physical milestones).
6. Visual Hardware & Iconic Objects List (List the 5 most iconic physical 3D objects/machines/chips and 6 iconic people/historical photos that visually tell this story).
```
