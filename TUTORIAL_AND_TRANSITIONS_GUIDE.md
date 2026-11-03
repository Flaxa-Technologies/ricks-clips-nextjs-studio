# Mathematical Motion Graphics, Transitions & "What to Show When" Master Guide (Node 2 Agent)

This guide explains the exact mathematics, React/SVG architecture, and **"What to Show When"** narrative choreography for all **13 Pre-Made Motion Graphics & Transitions** across:
- **Volume 1**: [`src/components/blinkit/FeaturedTransitions.tsx`](./src/components/blinkit/FeaturedTransitions.tsx) (`/?showcase=1`)
- **Volume 2**: [`src/components/blinkit/FeaturedTransitionsVol2.tsx`](./src/components/blinkit/FeaturedTransitionsVol2.tsx) (`/?showcase=2`)

---

## PART I: "WHAT TO SHOW WHEN" — THE DOCUMENTARY VISUAL CHOREOGRAPHY PLAYBOOK

Great documentary editors (*Vox*, *Johnny Harris*, *MagnatesMedia*, *ColdFusion*, *Pooya Taher*, *Motion Nations*) never pick animations randomly. Every sentence in a documentary script falls into one of **10 Narrative Beat Archetypes**.

Use this decision matrix to map every sentence in your script to the exact visual rig, camera physics, background polarity, and transition wipe:

| # | When the Script / Narrator Is Saying... | Show This Visual Rig | Why It Works Psychologically | Best Transition Out |
| :- | :--- | :--- | :--- | :--- |
| **1** | **The Hook Paradox / Bold Thesis**<br>*"How did a company losing ₹200 Cr a month suddenly conquer India?"* | **`BallSplineCometTransition`** (Vol 1, Rig 1) | The high-velocity spline ball with a stretching comet tail hooks the eye in `< 0.5s`, laser-wipes the thesis statement, and flips the entire world from Dark Mode to Warm Editorial Paper on the beat drop. | **Radial Iris Circle Wipe** (`clip-path: circle()`) |
| **2** | **Introducing a Founder, CEO, or Key Protagonist**<br>*"Deepinder Goyal wasn't just a CEO—he was building an empire."* | **`FounderEmpireOrbitRig`** (Vol 1, Rig 2) | Puts a human face at the center of the story while the 3D depth-sorted orbit ring (`z < 0` behind shoulders, `z >= 0` in front of chest) visually proves they command an entire ecosystem. | **Zoom-In Match Cut** into the chest emblem (`CoinFlipRadialDialRig`) |
| **3** | **Revealing a Crisis, Scandal, Secret Deal, or Conspiracy**<br>*"Behind closed doors, cash was running out—and a rescue deal was being wired."* | **`RedThreadEvidenceBoardRig`** (Vol 2, Rig 1 — *AEffecto Vox Style*) | The tactile corkboard, masking-taped monochrome Polaroids, red pushpins, self-drawing red yarn web, tilted Dymo label (`FOUNDER & CEO`), red marker loop, and window-blind shadows trigger an instant investigative detective atmosphere. | **5-Blade Mechanical Shutter Wipe** (`ShutterSliceWipeTransition`) |
| **4** | **Proving a Claim via Search Queries, Wikipedia, or SEC/BSE Filings**<br>*"Look at the official filing / If you search their unit economics..."* | **`VoxScreenRecording3DBrowser`** (Vol 2, Rig 2 — *Motion Nations Style*) OR **`NewspaperMicrofilmHighlighter`** (Vol 1, Rig 5) | Typing the exact query into a 3D-tilted Google Search bar with live autocomplete and flipping in 3D space into a yellow-highlighted + red-pen-circled article makes dry facts feel like undeniable forensic proof. | **3D Perspective Card Flip** (`rotateY`) |
| **5** | **Mapping a Parent Company & Its Subsidiaries / Cash Flows**<br>*"Eternal now operates four interlocking engines: Blinkit, Zomato, Hyperpure..."* | **`MagnatesFlowchartAndOrbitBadgeRig`** (Vol 2, Rig 3 — *Vane Motion Style*) OR **`CoinFlipRadialDialRig`** (Vol 1, Rig 3) | The continuously spinning circular `<textPath>` badge anchors the parent empire at the top while 90-degree rounded-elbow orthogonal pipes visually route capital and data into 3D beveled subsidiary cards below. | **Horizontal Whip-Pan** |
| **6** | **Walking Through a Multi-Year Historical Timeline**<br>*"From 2013 kirana delivery, to the 2018 SoftBank burn, to the 2021 pivot..."* | **`ThreeDCameraTimelineCorridor`** (Vol 2, Rig 4 — *ColdFusion Style*) | Instead of a flat 2D horizontal line, flying the camera straight down a 3D Z-axis corridor (`translate3d(x, y, -relZ)`) past glowing year portals (`2013 -> 2018 -> 2021 -> 2026`) makes history feel like physical time travel. | **Portal Fly-Through** (final year card fills frame) |
| **7** | **Explaining Geography, Dark Store Grids, or Supply Chains**<br>*"By placing micro-warehouses every 1.5 km across dense neighborhoods..."* | **`Isometric3DCameraMapFlyover`** (Vol 1, Rig 6 — *Johnny Harris Style*) | Tilting the map plane at `rotateX(58deg)` with vertical laser pins, concentric shockwave rings, and parabolic delivery arcs turns abstract logistics into a tactical war-room map. | **Geometric Match-Cut** (`MatchCutMorphTransition`) |
| **8** | **Synthesizing 4–5 Operating Metrics or Unit Economics at Once**<br>*"By FY26, all five levers—orders, picking speed, AOV, stores, and share—locked in."* | **`AppleBentoGridShowcaseRig`** (Vol 2, Rig 5 — *Apple Keynote Style*) | Prevents cognitive overload: all 5 glassmorphic cards spring into a clean architectural grid while an `ACTIVE FOCUS` spotlight wave (`scale(1.025)` + glowing border) tours each card one by one as the narrator names it. | **Liquid Bezier Curtain Wave** |
| **9** | **Head-to-Head Competitor Showdown / Market Share War**<br>*"It came down to a brutal two-way battle: Blinkit at 46% versus Zepto at 32%."* | **`SplitScreenVersusAndCollageRig`** (Vol 2, Rig 6) | Opposing diagonal polygons (`clipPath: polygon(0 0, 56% 0, 44% 100%, 0 100%)`) slamming together around a spring-loaded `VS` badge create visceral competitive tension. | **Liquid Bezier Wave Wipe** into **12fps Stop-Motion Collage** |
| **10** | **Climax Valuation, Revenue Surge, or Hyper-Growth Counter**<br>*"Annualized Gross Order Value rocketed past ₹37,779 Crore..."* | **`KineticSlotMachineOdometer`** (Vol 1, Rig 7) | Vertical rolling digit barrels with velocity-proportional Gaussian motion blur (`feGaussianBlur`) convey explosive financial momentum far better than a static number. | **5-Blade Shutter Wipe** or **Iris Close** |

---

## PART II: VOLUME 1 RIGS (`src/components/blinkit/FeaturedTransitions.tsx`)

### 1. Ball & Tapered Line Spline Transition (`BallSplineCometTransition`)
**Reference**: *Motion Nations (`7LW5mRTvNcY` @ `00:10s` — Minimal Line & Ball Animation)*
- **Arc-Length Parameterization**: `buildArcLengthSpline(WAYPOINTS, 120)` builds a cumulative chord-length table so velocity depends purely on our Newton-Raphson easing curve.
- **Staggered Head & Tail Easing**:
  ```ts
  const sHead = cubicBezier(windowProgress(localT, t0, dur), 0.16, 1, 0.3, 1);
  const sTail = cubicBezier(windowProgress(localT, t0 + 0.12, dur), 0.4, 0, 0.2, 1);
  ```
- **Tapered Ribbon Subdivision**: Subdivide $[s_{\text{tail}}, s_{\text{head}}]$ into $M = 28$ segments where stroke width tapers as $w_k = (k/M)^{1.55} \cdot 7.5\text{ px}$ and opacity tapers as $\alpha_k = (k/M)^{1.25}$.
- **Laser Text Wipe & Radial Iris World Flip**: Unmasks headline via `clipPath: inset(0 ${(1 - textSweep) * 100}% 0 0)` and flips Dark $\to$ Light Paper Mode via `clipPath: circle(${irisRadius}px at 960px 540px)`.

### 2. Founder Empire 3D Depth-Sorted Orbit Rig (`FounderEmpireOrbitRig`)
**Reference**: *Pooya Taher (`DLND-0I2FmM` — Viral Reels Breakdown Part 1)*
- **Two-Pass Painter's Algorithm**:
  - For $N = 6$ nodes at angle $\theta_k(t) = \omega t + \frac{2\pi k}{N}$, compute $z_k = \sin(\theta_k) \in [-1, 1]$.
  - Render nodes with $z_k < 0$ in an SVG layer **behind** the monochrome founder cutout `<img>` (`blur(3px)`), and nodes with $z_k \ge 0$ in an SVG layer **in front of** the founder cutout at full sharpness.

### 3. 3D Extruded Coin-Flip & Radial Perimeter Dial (`CoinFlipRadialDialRig`)
**Reference**: *Pooya Taher (`DLND-0I2FmM` — Part 2)*
- Central medallion flips $180^\circ$ every $0.45\text{ s}$ using `perspective(1000px) rotateY(theta)` with extruded edge shadows while a semi-circular perimeter dial lights up subsidiary brands (`Zomato`, `Blinkit`, `Hyperpure`, `District`).

### 4. Geometric Match-Cut Morph Transition (`MatchCutMorphTransition`)
**Reference**: *Vox / Johnny Harris Signature Transitions*
- A shared central SVG circle morphs continuously across a scene cut—transforming its `strokeWidth` (`36px -> 8px`), `strokeDasharray`, and background polarity from a **46% Market Share Donut Chart** on warm paper into a **1.5 km Tactical Dark Store Radar Reticle** on dark navy.

### 5. 3D Archival Newspaper & Multiply Highlighter (`NewspaperMicrofilmHighlighter`)
**Reference**: *MagnatesMedia / Vox Investigative Press Rigs*
- 3D tilted financial broadsheet (`perspective(1300px) rotateX/Y/Z`) racks focus from `blur(9px) -> 0px` while a translucent yellow marker (`mix-blend-mode: multiply`) sweeps across the critical quote.

### 6. Isometric 3D Camera Map Flyover (`Isometric3DCameraMapFlyover`)
**Reference**: *Johnny Harris / fern Geo-Telemetry Rigs*
- Tilted $1920\times 1080$ coordinate plane (`perspective(1200px) rotateX(58deg) rotateZ(camRotZ)`) with vertical laser pins, concentric radar shockwaves, and glowing parabolic supply-chain arcs.

### 7. Kinetic Slot-Machine Odometer & Diagonal Shutter Wipe (`KineticSlotMachineOdometer`)
- Vertical digit barrels (`0–9` twice) spinning with instantaneous vertical velocity blur $\sigma_y = \text{clamp}(|\dot{y}| \cdot 3.5, 0, 12\text{ px})$, wiped by a 5-blade staggered mechanical shutter (`b * 0.06s` delay).

---

## PART III: VOLUME 2 RIGS (`src/components/blinkit/FeaturedTransitionsVol2.tsx`)

### 8. Vox Red-Thread Detective Corkboard (`RedThreadEvidenceBoardRig`)
**Reference**: *AEffecto (`Ii3MVHwECys` — How To Edit Viral Documentaries Like VOX)*
- **Visual Elements**:
  - 4 corner monochrome archival Polaroids with translucent masking-tape strips (`bg-amber-100/80 rotate-2`) and white logo pedestals.
  - Self-drawing crimson yarn web (`strokeDashoffset`) anchored by red pushpins (`#ef4444`).
  - Central hero Polaroid (`ALBINDER DHINDSA`) stamped with a tilted black Dymo embossed label (`FOUNDER & CEO`, `rotate(-12deg)`) and circled by a self-drawing hand-drawn red marker spiral loop.
  - Diagonal volumetric window-blind shadow bars (`repeating-linear-gradient(115deg, ...)`).

### 9. Vox 3D Search Bar Autocomplete $\rightarrow$ 3D Article Highlight & Red Pen (`VoxScreenRecording3DBrowser`)
**Reference**: *Motion Nations (`L-fVQ9cG2R8` — Vox Style Screen Recording Animation)*
- **Phase A (`0.0s – 1.65s`)**: 3D tilted Google Search bar (`perspective(1100px) rotateX(14deg) rotateY(22deg)`) typing `"blinkit 10 minute delivery unit economics"` character-by-character with live autocomplete dropdown suggestions.
- **Phase B (`1.65s – 4.0s`)**: Smooth 3D perspective flip into an encyclopedia/filing browser card where two sequential yellow highlighter sweeps (`#fef08a`) and a hand-drawn red ink oval isolate `"46% of India's quick-commerce market"`.

### 10. MagnatesMedia Orbiting Circular Text Badge + Orthogonal Flowchart (`MagnatesFlowchartAndOrbitBadgeRig`)
**Reference**: *Vane Motion (`kuX_HBTjTmg` — How to Edit Documentary Style Videos Like MagnatesMedia)*
- **Circular `<textPath>` Badge**: An SVG `<path id="orbitTextPath" d="M 140,140 m -112,0 a 112,112 0 1,1 224,0 a 112,112 0 1,1 -224,0" />` rotates continuously at $\omega = 38^\circ/\text{s}$ around the central Eternal emblem.
- **90-Degree Rounded-Elbow Flowchart**: Orthogonal SVG paths (`M 960 360 L 960 540 Q 960 570 930 570 L 450 570 Q 420 570 420 600 L 420 710`) draw downward into 3D subsidiary cards (`BLINKIT`, `ZOMATO`, `HYPERPURE`).

### 11. 3D Z-Space Camera Timeline Corridor (`ThreeDCameraTimelineCorridor`)
**Reference**: *ColdFusion / MagnatesMedia 3D Historical Fly-Throughs*
- Milestone portals (`2013`, `2018`, `2021`, `2026`) are placed at true 3D Z-depths (`zPos = 150, 700, 1250, 1800`) alternating left and right (`xOffset = ±340px`, `yOffset = ±85px`) inside a `perspective: 900px` viewport.
- As `camZ` advances from `-150` to `1750`, each portal's relative depth `relZ = m.zPos - camZ` drives `translate3d(xOffset, yOffset, -relZ)` and realistic depth-of-field blur $\sigma_{\text{DOF}} = \text{clamp}(|\text{relZ} - 180| / 360, 0, 8\text{ px})$.

### 12. Apple Keynote Modular Bento Grid + Spotlight Wave (`AppleBentoGridShowcaseRig`)
**Reference**: *Apple Keynote / Cleo Abram Multi-Metric Bento Layouts*
- A 12-column, 2-row CSS Grid of 5 asymmetrical glassmorphic cards springs into view with staggered harmonic delays (`idx * 0.10s`).
- Starting at `localT = 0.8s`, `activeFocusIdx = Math.floor((localT - 0.8) / 0.65)` sequentially highlights each card with an `ACTIVE FOCUS` pill, `scale(1.025)`, and a brand-colored neon border + glow.

### 13. Diagonal Split-Screen Versus $\rightarrow$ Liquid Bezier Wave Wipe $\rightarrow$ 12fps Stop-Motion Collage (`SplitScreenVersusAndCollageRig`)
**Reference**: *Vox / Johnny Harris Mixed-Media Stop-Motion & Liquid Wipes*
- **Part A (`0.0s – 1.85s`)**: Opposing diagonal polygons (`polygon(0 0, 56% 0, 44% 100%, 0 100%)` vs. `polygon(56% 0, 100% 0, 100% 100%, 44% 100%)`) clash with a spring-loaded central `VS` badge.
- **Part B (`1.85s – 4.0s`)**: A **Liquid Bezier Curtain Wave** (`M 0 yEdge Q 960 yBelly 1920 yEdge L 1920 1080 L 0 1080 Z` where `yBelly` leads `yEdge` via `pow(w, 0.7)` vs. `pow(w, 1.3)`) wipes upward to reveal a **12 fps `posterizeTime(localT, 12)` Stop-Motion Torn-Paper Cutout Card**.

---

## PART IV: VOLUME 3 MINIMALIST + HEAVY MATHEMATICAL PHYSICS EDITION — ZERO BLACK BACKGROUNDS (`src/components/blinkit/FeaturedTransitionsVol3Heavy.tsx`)

### Strict Minimalist Main-Theme & Non-Black Palette Mandate
Never use flat `#000000` (`bg-black`) or cluttered multi-box dashboards. True minimalist sophistication comes from **one hero mathematical rig at `(960, 540)`** with **24-layer 45° volumetric shadows**, **orbital spiral convergence**, **Gaussian wave deformation**, **CAD wireframe letter construction**, and **coupled Bauhaus lever physics** across our signature studio canvases:
1. **Warm Matte Studio Putty**: `radial-gradient(circle at 50% 45%, #ECEAE5 0%, #DFDCD5 58%, #CCC8BF 100%)`
2. **Deep Petrol-Sapphire Horizon**: `radial-gradient(circle at 50% 35%, #123E5C 0%, #0A2538 55%, #061826 100%)` (rich midnight teal, zero black!)
3. **Warm Studio Alabaster & Cream**: `radial-gradient(circle at 50% 45%, #FAF8F2 0%, #ECE6DA 60%, #DCD4C4 100%)`
4. **Soft Matte Graphite Slate**: `radial-gradient(circle at 50% 45%, #2B2D33 0%, #1F2025 100%)`

### 14. Orbital Letter Convergence + 45° Volumetric Long Shadows (`MinimalOrbitalLetterConvergenceRig`)
**Reference**: *Motion Nations (`HPWzLpHdBJg` — Minimal Circle Motion Graphics Text Animation)*
- 4 concentric hairline rings (`r = 145, 225, 310, 395`) draw in via `strokeDashoffset` with orbiting black, Blinkit-gold (`#F8CB46`), and Zomato-crimson (`#E23744`) satellite dots casting 14-step 45° volumetric long shadows.
- Each character of `BLINKIT` / `EMPIRE` starts scattered on a circular orbit at angle $\theta_i(0)$ and spirals inward via `springODE(dt, 15, 0.72)` to lock into two centered rows at `(960, 498)` and `(960, 586)` with 24-layer 45° volumetric `textShadow`.

### 15. Deforming Gaussian Wave Horizon & Rolling Sphere (`MinimalDeformingWaveBallRig`)
**Reference**: *Motion Nations (`pQXoGGpCYeg` — Minimal Line Motion Graphics Text Animation)*
- A continuous horizontal spline across $x \in [0, 1920]$ dynamically deforms beneath the rolling sphere at $x_{\text{ball}}(t)$:
  \[
  y(x, t) = 615 + 86 \cdot e^{-\frac{(x - x_{\text{ball}})^2}{2 \cdot 235^2}} \sin\!\left(\frac{x - x_{\text{ball}}}{135} - 2.2t\right)
  \]
- Kinetic words (`"What matters most is 10-minute consistency at scale."`) pop along the travelling wave crest ahead of the rolling sphere before a radial circle iris flips into Warm Studio Alabaster.

### 16. Capsule Long-Shadow Scanner $\rightarrow$ Architectural CAD Wireframe Construct (`MinimalCapsuleLongShadowScannerRig`)
**Reference**: *Motion Nations (`BrYQhw8WmIM` — Minimal Shape Text Animation #2)*
- **Phase A (`0.0s – 1.95s`)**: A vertical rounded capsule ring (`#E23744`, `62x230px`) with a 26-layer 45° volumetric shadow trail sweeps horizontally from `x = 610` to `1310`, acting as a spatial clip-mask (`clipPath: inset(...)`) that unmasks `BLINKIT` with 32-layer 45° volumetric letter shadows.
- **Phase B (`1.95s – 4.0s`)**: Each character of `BLINKIT` / `ETERNAL` is constructed inside a geometric CAD wireframe box (outer square + diagonal `X` construction lines + inscribed circle via `strokeDashoffset`) before solid ink typography flood-fills inside.

### 17. Sine-Wave Bouncing Polygons Morphing Into Letters (`MinimalPolygonWaveToLetterMorphRig`)
**Reference**: *Motion Nations (`CDc1d-8x8lQ` — Minimal Shape Text Animation #1)*
- Each character travels along a damped sine-wave rollercoaster $y_k(p) = -\sin(2\pi p) \cdot 135 \cdot (1 - p)^{1.35}$ starting as a rotating geometric primitive (Pentagon, Triangle, Square, Hexagon, Diamond, Circle) and morphing at the wave apex ($p = 0.42$) directly into the corresponding letter, followed by a horizontal split wipe from Soft Graphite (`#2B2D33`) to Warm Studio Ivory (`#F4F2ED`).

### 18. Coupled Bauhaus See-Saw Lever Physics & Split-Hemisphere Tunnel (`MinimalBauhausPendulumAndSeeSawRig`)
**Reference**: *Ordinary Folk (`EFdAOiNXUKY` — Showreel Breakdown)*
- A falling split-hemisphere sphere impacts a pivoting balance beam (`rotate(-22deg -> +22deg)`), rolling down the incline and triggering a concentric counter-rotating Split-Hemisphere Circle Tunnel (`#18181B` / `#F8CB46`) that reveals the central `blinkit · 46%` lockup.

### 19. 17-Sphere Harmonic Pendulum Phase Wave $\rightarrow$ Plucked Elastic Guitar String (`MinimalElasticPendulumWaveAndRibbonRig`)
- 17 minimalist spheres suspended on hairline vertical threads oscillate at linearly graded frequencies $\omega_k = 3.2 + 0.38k$ (forming a travelling pendulum wave helix) before snapping into a horizontal elastic string at $y = 540\text{ px}$ that plucks ($110 e^{-3.8t}\cos(22t)\sin(\pi x/L)$) to unmask `₹37,779 CRORE` above and `916.6M ORDERS · 10-MINUTE PRECISION` below.
