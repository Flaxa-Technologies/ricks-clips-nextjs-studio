---
name: ricks-clips-animator
description: >-
  Deterministic mathematical animation engine and Google AI Studio skill for creating
  @RicksClips3000-style viral 9:16 YouTube Shorts using Next.js, React Three Fiber
  (Three.js), or HTML5 Canvas. Enforces exact 30-FPS frame equations, 2.5D billboard
  character anatomy, 2-bone analytical IK, 3-band toon shaders, kinetic camera
  trajectories, and damped spring word-by-word captions with zero random guessing.
---

# Ricks Clips (`@RicksClips3000`) Mathematical Animation Skill

Use this skill whenever generating, scripting, or rendering `@RicksClips3000`-style short-form animations (2.5D thick-outlined cartoon characters inside stylized 3D environments) in **Google AI Studio**, **Next.js + React Three Fiber**, or **deterministic Python/Canvas MP4 pipelines**.

---

## 1. Core Mathematical Laws (Zero Random Guessing)

1. **Pure Function of Frame Index ($f$)**:
   - Every visual and audio property MUST be a pure, deterministic function of the discrete frame index $f \in \{0, 1, \dots, N-1\}$ at fixed frame rate $\text{FPS} = 30$ ($\Delta t = \frac{1}{30}\text{ s} = 33.333\text{ ms}$).
   - Never use `Math.random()` at render time or frame-rate-dependent `delta` accumulation (`pos += vel * delta`). Instead, use deterministic trigonometric hashes:
     $$\text{hash}(i) = \operatorname{frac}\!\big(\sin(i \cdot 127.1 + 311.7) \cdot 43758.5453\big)$$
2. **The Zero-Static-Camera Law**:
   - For every frame $f \in [0, N-1]$, the camera state vector $\mathbf{C}(f) = [\mathbf{P}_{\text{cam}}(f),\; \mathbf{T}_{\text{cam}}(f),\; \text{FOV}(f),\; \phi_{\text{roll}}(f)]$ MUST satisfy:
     $$\left\|\mathbf{P}_{\text{cam}}(f+1) - \mathbf{P}_{\text{cam}}(f)\right\|_2 + \left\|\mathbf{T}_{\text{cam}}(f+1) - \mathbf{T}_{\text{cam}}(f)\right\|_2 + \left|\text{FOV}(f+1) - \text{FOV}(f)\right| \ge 0.005$$
   - Camera cuts/beats occur every $48 \le \Delta f_{\text{beat}} \le 70$ frames ($1.60\text{ s} - 2.33\text{ s}$).
3. **The 2.5D Cylindrical Billboarding Law**:
   - Characters are 2D illustrated planes (or layered planes) positioned at 3D world coordinates $\mathbf{P}_{\text{char}}(f) = (X_c, Y_c, Z_c)$ with 3D cylindrical rubber-hose limbs.
   - On every frame $f$, the character root group rotates around the world $Y$-axis to face the camera lens:
     $$\theta_Y(f) = \operatorname{atan2}\!\Big(X_{\text{cam}}(f) - X_c(f),\; Z_{\text{cam}}(f) - Z_c(f)\Big)$$
4. **Word-by-Word Pop Caption Law**:
   - Captions contain **1 to 2 words** (maximum 14 characters) anchored at vertical screen coordinate $Y_{\text{sub}} = 0.705 \cdot H$ (70.5% from top of the `9:16` frame, safely above YouTube Shorts UI overlays).
   - Every word onset triggers a 5-frame underdamped spring scale bounce:
     $$s(\Delta f) = \begin{cases} 0.86 + 0.14 \Delta f & \Delta f \in [0, 2] \\ 1.14 - 0.0467 (\Delta f - 2) & \Delta f \in (2, 5] \\ 1.00 & \Delta f > 5 \end{cases}$$

---

## 2. Progressive Reference Library in This Skill Folder

Read these reference files when building or verifying scenes:

1. **[`GOOGLE_AI_STUDIO_SYSTEM_PROMPT.md`](./GOOGLE_AI_STUDIO_SYSTEM_PROMPT.md)**
   - Self-contained master prompt ready to paste directly into **Google AI Studio System Instructions** so Gemini generates complete, mathematically locked `@RicksClips3000` scenes.
2. **[`references/01-character-anatomy-and-ik-math.md`](./references/01-character-anatomy-and-ik-math.md)**
   - Exact pixel & world-space proportions of the 2.5D character head, cel-shaded rim crescent boolean clipping math, all 8 eye state vector formulas, 6 lip-sync viseme equations, 2-bone analytical Inverse Kinematics (Law of Cosines), and Fourier walk/action cycles.
3. **[`references/02-camera-choreography-and-projection-math.md`](./references/02-camera-choreography-and-projection-math.md)**
   - Exact equations for the 6 signature `@RicksClips3000` camera moves (Low-Angle Rail Dolly, 180° Cylindrical Orbit, Exponential Abyss Crane Pullback, 90° Vertigo Dive, Constant-Subject-Width Dolly Zoom, and Foreground Object Wipe), plus the full $4\times 4$ perspective projection matrix.
4. **[`references/03-typography-audio-and-shader-math.md`](./references/03-typography-audio-and-shader-math.md)**
   - Damped harmonic oscillator math for word-by-word captions, 3-band Toon/Cel shader & thermal expansion glow GLSL equations, Beer-Lambert depth fog, and procedural PCM/WebAudio foley synthesis equations (saw scrape, steam locomotive Doppler pass, canyon wind, cash register chime).
5. **Complete 300-Frame Scene Examples (`examples/`)**:
   - **[`examples/example-01-railroad-thermal-expansion-300f.ts`](./examples/example-01-railroad-thermal-expansion-300f.ts)**: *Why Perfect Railroads Don't Work* (Frames 0–300).
   - **[`examples/example-02-pirate-hotshot-cannon-300f.ts`](./examples/example-02-pirate-hotshot-cannon-300f.ts)**: *Levels of Pirate Cannonballs — Hot Shot Furnace* (Frames 0–300).
   - **[`examples/example-03-ancient-dragon-seismoscope-300f.ts`](./examples/example-03-ancient-dragon-seismoscope-300f.ts)**: *The Ancient Jar That Warned an Empire* (Frames 0–300).
   - **[`examples/google-ai-studio-single-file-starter.html`](./examples/google-ai-studio-single-file-starter.html)**: Single-file HTML + Three.js + Canvas + WebAudio starter that runs directly inside Google AI Studio's live preview.
6. **Mathematical Verification Script (`scripts/`)**:
   - **[`scripts/validate_scene_math.py`](./scripts/validate_scene_math.py)**: Audits any timeline specification for camera velocity, FOV bounds, subtitle cadence, and IK reachability.

---

## 3. Execution Workflow for Generating a New Short

When asked to animate a new story or topic in the `@RicksClips3000` style:

1. **Step 1 — Script & Word-Timestamp Decomposition (`180 WPM`, `3.0 words/sec`)**:
   - Partition the narrative into **5 Beats per 10 seconds (`300 frames`)**, with each beat lasting `50–70 frames` (`1.67s–2.33s`).
   - Slice the voiceover text into `1–2 word` tokens (`SUBTITLES`), assigning exact `[startFrame, endFrame]` intervals with zero gaps $> 2$ frames.
2. **Step 2 — Assign Distinct Camera Trajectory Equations per Beat**:
   - Select one of the 6 canonical camera moves from [`02-camera-choreography-and-projection-math.md`](./references/02-camera-choreography-and-projection-math.md) for each beat. Ensure consecutive beats contrast in scale (e.g., *Extreme Close-Up Dolly* $\to$ *180° Orbit* $\to$ *Exponential Wide Pullback* $\to$ *Tight Precarious Tilt* $\to$ *High-FOV Speed Rush*).
3. **Step 3 — Compute 2.5D Character Rig & Prop IK per Frame**:
   - Using [`01-character-anatomy-and-ik-math.md`](./references/01-character-anatomy-and-ik-math.md), bind facial states (`browAngle`, `eyeState`, `mouthState`) and limb IK targets (`sawStrokePhase`, `walkCyclePhase`, `bodyLean`) to deterministic sinusoidal or smoothstep functions of `frame`.
4. **Step 4 — Validate & Render**:
   - Run `python skills/ricks-clips-animator/scripts/validate_scene_math.py` to verify all mathematical invariants.
   - Render in the Next.js React Three Fiber studio (`src/app/page.tsx`) or export a deterministic `.mp4` via `scripts/render_10s_video.py`.
