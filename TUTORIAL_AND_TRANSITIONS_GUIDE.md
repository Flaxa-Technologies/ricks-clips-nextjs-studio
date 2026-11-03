# Mathematical Motion Graphics & Transitions Tutorial (Node 2 Agent Guide)

This guide explains the exact mathematics, React/SVG architecture, and customization patterns for every pre-made transition and motion rig in [`src/components/blinkit/FeaturedTransitions.tsx`](./src/components/blinkit/FeaturedTransitions.tsx).

---

## 1. Ball & Tapered Line Spline Transition (`BallSplineCometTransition`)
**Reference**: *Motion Nations (`7LW5mRTvNcY` @ `00:10s` — Minimal Line & Ball Animation)*

### Mathematical Formulation
To animate a ball along a curved path with a comet tail that stretches during high acceleration and shrinks to zero when the ball stops:

1. **Arc-Length Parameterization**:
   Build a 120-sample lookup table of cumulative Euclidean chord lengths along waypoints $\mathbf{P}_0, \dots, \mathbf{P}_m$:
   ```ts
   const SPLINE = buildArcLengthSpline(WAYPOINTS, 120);
   ```
2. **Staggered Head & Tail Easing**:
   Evaluate the head position $s_{\text{head}}(t)$ with a fast-attack curve `(0.16, 1.0, 0.3, 1.0)` and the tail position $s_{\text{tail}}(t)$ with a delayed, slower-attack curve `(0.4, 0.0, 0.2, 1.0)`:
   ```ts
   const sHead = cubicBezier(windowProgress(localT, t0, dur), 0.16, 1, 0.3, 1);
   const sTail = cubicBezier(windowProgress(localT, t0 + 0.12, dur), 0.4, 0, 0.2, 1);
   ```
3. **Tapered Ribbon Subdivision**:
   Subdivide $[s_{\text{tail}}, s_{\text{head}}]$ into $M = 28$ micro-segments. For segment $k \in \{1\dots M\}$, compute fraction $f = k / M$ and set:
   - Stroke Width: $w_k = f^{1.55} \cdot 7.5\text{ px}$
   - Opacity: $\alpha_k = f^{1.25}$
4. **Laser Text Wipe & Radial Iris World Flip**:
   - As the ball sweeps horizontally from $x = 420$ to $x = 1520$, unmask the centered headline via `clipPath: inset(0 ${(1 - textSweep) * 100}% 0 0)`.
   - When the ball returns to $(960, 540)$, expand the light-mode layer via `clipPath: circle(${irisRadius}px at 960px 540px)`.

---

## 2. Founder Empire 3D Depth-Sorted Orbit Rig (`FounderEmpireOrbitRig`)
**Reference**: *Pooya Taher (`DLND-0I2FmM` — Viral Reels Breakdown)*

### Mathematical Formulation
To make glowing 3D spheres orbit **around** a 2D cutout person (passing behind their shoulders and in front of their chest) without WebGL z-fighting:

1. **Parametric 3D Ellipse**:
   For $N = 6$ nodes at angle $\theta_k(t) = \omega t + \frac{2\pi k}{N}$:
   ```ts
   const x = Math.cos(angle) * 310;
   const y = Math.sin(angle) * 82;
   const z = Math.sin(angle); // -1 = behind founder, +1 = in front of founder
   const scale = lerp(0.62, 1.28, (z + 1) * 0.5);
   ```
2. **Two-Pass Painter's Algorithm**:
   - **Pass 1 (Behind Cutout)**: Render the top half of the ellipse (`A 310 82 0 0 1`) and all nodes with `z < 0` with `filter: blur(3px)` and `opacity: 0.55`.
   - **Pass 2 (Middle Layer)**: Render the monochrome founder `<img>` rising via `springODE(dt, 18, 0.72).value`.
   - **Pass 3 (Front of Cutout)**: Render the bottom half of the ellipse (`A 310 82 0 0 0`) and all nodes with `z >= 0` at full sharpness and larger scale.

---

## 3. 3D Extruded Coin-Flip & Radial Perimeter Dial (`CoinFlipRadialDialRig`)
**Reference**: *Pooya Taher (`DLND-0I2FmM` Part 2)*

- A central circular medallion flips $180^\circ$ every $0.45\text{ s}$ using `perspective(1000px) rotateY(theta)` with multi-layer `box-shadow` simulating 3D coin thickness (`-14px 0 0 #e4e4e7`).
- Around the coin, a semi-circular SVG gauge (`M -320 40 A 320 320 0 1 1 320 40`) progressively draws its stroke via `strokeDashoffset` while perimeter brand labels placed at polar angles $\phi_i \in [-155^\circ, -25^\circ]$ scale up and turn ink-black as the active index reaches them.

---

## 4. Geometric Match-Cut Morph Transition (`MatchCutMorphTransition`)
**Reference**: *Vox / Johnny Harris Signature Transitions*

- Instead of a hard cut or generic fade, keep a **shared hero SVG circle** mounted at the exact center $(960, 540)$ across both scenes.
- As `morph = cubicBezier(windowProgress(localT, 1.5, 0.85), 0.22, 1, 0.36, 1)` progresses from $0 \to 1$:
  - Scene A's light background fades out while zooming in (`scale(1 -> 1.15)`).
  - Scene B's dark navy background fades in while zooming settle (`scale(0.88 -> 1.0)`).
  - The central ring's `strokeWidth` morphs from `36px` (Donut Chart) to `8px` (Radar Reticle), its `strokeDasharray` shifts from `"480 1040"` to `"80 40 80 40 80 40"`, and concentric radar pulse rings + crosshairs emerge inside it.

---

## 5. 3D Archival Newspaper & Multiply Highlighter (`NewspaperMicrofilmHighlighter`)
**Reference**: *MagnatesMedia / Vox Investigative Press Rigs*

- Tilt the broadsheet card in 3D space:
  ```ts
  transform: `perspective(1300px) rotateX(${lerp(28, 11, camIn)}deg) rotateY(${lerp(-22, -7, camIn)}deg) rotateZ(${lerp(-6, -1.5, camIn)}deg) scale(${lerp(0.84, 1.06, camIn)})`
  ```
- Rack focus from `blur(9px)` to `0px` over the first `0.65s`.
- Sweep a `<span className="bg-[#fde047]" style={{ width: `${highlightSweep * 100}%`, mixBlendMode: "multiply" }} />` across the key quote so the serif typography remains crisp underneath the translucent yellow ink.

---

## 6. Isometric 3D Camera Map Flyover (`Isometric3DCameraMapFlyover`)
**Reference**: *Johnny Harris / fern Geo-Telemetry Rigs*

- Tilt a $1920\times 1080$ coordinate grid plane at `perspective(1200px) rotateX(58deg) rotateZ(camRotZ)` and pan via `translate3d(camX, camY, 0)`.
- Draw parabolic supply-chain arcs (`M 480 620 Q 720 260 960 460 T 1390 340`) using `strokeDashoffset` and place pulsing radar rings + floating callout billboards at each hub coordinate.

---

## 7. Kinetic Slot-Machine Odometer & Diagonal Shutter Wipe
- **Odometer**: Each digit column renders a vertical strip of 20 digits (`0–9` twice) translated by `translate3d(0, -currentPos * 132px, 0)` with vertical motion blur $\sigma_y = \text{clamp}(|\dot{y}| \cdot 3.5, 0, 12\text{ px})$.
- **Shutter Wipe**: 5 vertical/diagonal blades (`width: 20.2%`, `left: b * 20%`) staggered by `b * 0.06s` slam shut to display a central chapter title card before slicing open into the next act.
