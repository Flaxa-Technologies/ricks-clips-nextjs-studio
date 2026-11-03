# Mathematical Motion-Graphics Documentary & Transitions Studio (Node 2 Agent Kit)

![Transitions Showcase Contact Sheet](./public/transitions_showcase_grid.jpg)

A deterministic, pure-math **After Effects-grade Documentary & Motion-Graphics Engine** built for **Node 2 Agent (Google AI Studio Gemini)** and autonomous documentary production pipelines.

Every frame is a closed-form mathematical function of time $\text{Frame}(t) = f(t)$ — zero CSS transitions, zero `requestAnimationFrame` state drift, Newton-Raphson cubic-bezier inversion, second-order damped harmonic oscillator ODEs, 2D arc-length Catmull-Rom/Bezier splines, 3D depth-sorted orbital rigs, and multi-worker headless Playwright 1080p30 MP4 rendering.

---

## Quick Navigation for Node 2 Agent (Google AI Studio)

| Resource | Path | Purpose |
| :--- | :--- | :--- |
| **Google AI Studio System Prompt** | [`GOOGLE_AI_STUDIO_SYSTEM_PROMPT.md`](./GOOGLE_AI_STUDIO_SYSTEM_PROMPT.md) | Copy-paste directly into Google AI Studio System Instructions for generating complete documentaries. |
| **End-to-End Skill Specification** | [`.agents/skills/math-motion-documentary/SKILL.md`](./.agents/skills/math-motion-documentary/SKILL.md) | 23-section master skill manual covering research, scripting, word-level TTS sync, math, and MP4 rendering. |
| **Transitions & Motion Tutorial** | [`TUTORIAL_AND_TRANSITIONS_GUIDE.md`](./TUTORIAL_AND_TRANSITIONS_GUIDE.md) | Mathematical breakdown and code examples for all 7 pre-made transition & motion rigs. |
| **Pre-Made Transitions Library** | [`src/components/blinkit/FeaturedTransitions.tsx`](./src/components/blinkit/FeaturedTransitions.tsx) | Drop-in React components for Ball-Line Spline Comets, 3D Founder Orbit Rigs, 3D Coin Flip Dials, Match-Cuts, 3D Newspapers, Isometric Maps, and Odometers. |
| **Pure-Math Kinematics Engine** | [`src/lib/kinematics.ts`](./src/lib/kinematics.ts) | Closed-form Spring ODE solver, Newton-Raphson `cubicBezier`, velocity derivatives, and Arc-Length Splines. |
| **Option 3 Soundtrack Synthesizer** | [`scripts/build_final_soundtrack_opt3.py`](./scripts/build_final_soundtrack_opt3.py) | 116 BPM *Vox / Johnny Harris* "Modern Ambient Momentum" score generator with -18 dB voice sidechain ducking and stereo transition whooshes. |
| **Rendered 24s Showcase Video** | [`public/motion_transitions_showcase.mp4`](./public/motion_transitions_showcase.mp4) | 1080p30 MP4 showcase demonstrating all 7 pre-made transitions and motion graphics rigs. |

---

## Pre-Made Transitions & Motion Graphics Rigs (`FeaturedTransitions.tsx`)

1. **`BallSplineCometTransition` (Motion Nations `00:10s` Minimal Line & Ball Style)**
   - Arc-length parameterized spline $\mathbf{B}(s)$ where $s_{\text{tail}}(t)$ lags $s_{\text{head}}(t)$, creating a velocity-stretching tapered comet ribbon ($w_k = (k/M)^{1.55} \cdot 7.5\,\text{px}$).
   - Horizontal pass acts as a laser clip-path wipe unmasking typography (`DEMANDS CREATIVITY`), followed by a **radial iris circle wipe** (`clip-path: circle(r(t) at 960px 540px)`) from Dark Mode (`#090a0f`) to Studio Light Paper Mode (`#f8fafc`).
2. **`FounderEmpireOrbitRig` (Pooya Taher Viral Reel Style — Part 1)**
   - Staggered kinetic header + morphing subtitle (`"isn't just a CEO"` $\rightarrow$ `"he's a business empire"`), monochrome founder portrait rising in front of a parallax city skyline, wrapped by a **true 3D depth-sorted elliptical orbit ring** ($z = \sin\theta < 0$ rendered behind the torso, $z \ge 0$ rendered in front of the torso with glowing neon-green spheres).
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

---

## Mandatory Production Rules for Node 2 Agent

1. **NO Top Debug HUD Text**: Never render diagnostic telemetry bars (e.g., `• CH.01 // B03 ... FRM 00666`) in final documentary frames. Keep the top of the frame 100% clean.
2. **3D-Edged Beveled Cards with White Inner Pedestals**: For competitor/brand cards (Amazon, Flipkart, BigBasket, etc.), always use 3D isometric extrusion (`box-shadow: 0 14px 0 #09090b`) and place logos inside a crisp white inner pedestal so dark logos never blend into dark backgrounds.
3. **Real Founder Cutouts & Documentary Scene Photos**: Always integrate real executive portrait cutouts (with `CEO` / `CO-FOUNDER` badges) and authentic documentary photography alongside 3D WebGL props.
4. **Option 3 Soundtrack ("Modern Ambient Momentum")**: Use `scripts/build_final_soundtrack_opt3.py` (116 BPM warm Rhodes pads + soft acoustic kick + shaker + -18 dB voice sidechain ducking + stereo transition whooshes).
5. **Synchronous Frame Stepping**: In `App.tsx`, `window.__setDocTime(t)` must call `flushSync(() => setCurrentTime(t))` and resolve synchronously (`resolve()`) so headless Chromium workers never wait on `requestAnimationFrame` vsync swaps.

---

## Running & Rendering Locally

```bash
# 1. Install dependencies
bun install

# 2. Build production bundle
bun run build

# 3. Render the 24-second Pre-Made Transitions Showcase (1080p30 MP4)
python render_transitions_showcase.py

# 4. Synthesize Option 3 Master Soundtrack & Render Full Documentary (1080p30 MP4)
python scripts/build_final_soundtrack_opt3.py
python render_blinkit_mp4.py
```
