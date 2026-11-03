# Reference 03 — Word-by-Word Pop Typography, Toon Shaders & Procedural Foley Audio Math

This document specifies the exact mathematical equations for `@RicksClips3000` subtitle spring animations, 3-band Cel/Toon & thermal expansion shaders, and procedural PCM/WebAudio sound effects.

---

## 1. Word-by-Word Pop Typography Physics

### 1.1 Placement & Safe-Zone Geometry (`9:16` Vertical Frame)
- **Horizontal Center**: $X_{\text{sub}} = 0.500 \cdot W$ (`360px` at `720x1280`, `540px` at `1080x1920`).
- **Vertical Anchor**: $Y_{\text{sub}} = 0.705 \cdot H$ (`902px` at `720x1280`, `1354px` at `1080x1920`).
  - *Why $0.705 \cdot H$?* In YouTube Shorts, the bottom $22\%$ of the screen ($0.78 H \to 1.00 H$) is occluded by the channel handle, title, and audio marquee, while the center ($0.35 H \to 0.65 H$) contains the character's face and hands. Anchoring captions at $70.5\%$ places the text directly below the character's hands/props and safely above the YouTube UI.
- **Stroke & Drop Shadow Ratios**:
  - Font Size: $S_{\text{font}} = 0.053125 \cdot H$ (`68px` at `1280p`, `102px` at `1920p`).
  - Outer Ink Stroke: $W_{\text{stroke}} = 0.0139 \cdot W$ (`10px` at `720p`, `15px` at `1080p`), color `#141418`, `paint-order: stroke fill`.
  - Hard Drop Shadow: $(\Delta x_{\text{sh}}, \Delta y_{\text{sh}}) = (0,\; +0.004 \cdot H)$, color `#000000`.

### 1.2 Underdamped Spring Scale Bounce Equation
When a new subtitle token becomes active at frame $f_{\text{start}}$, let $\Delta f = f - f_{\text{start}}$ be the local frame age. The continuous underdamped harmonic oscillator response is:

$$s(\Delta f) = 1.0 - 0.14 \, e^{-\zeta \omega_n \Delta f} \cos(\omega_d \Delta f) + 0.18 \, e^{-\zeta \omega_n \Delta f} \sin(\omega_d \Delta f)$$

with natural frequency $\omega_n = 0.95\text{ rad/frame}$ and damping ratio $\zeta = 0.42$ ($\omega_d = \omega_n \sqrt{1 - \zeta^2} = 0.862\text{ rad/frame}$).
For fast real-time evaluation at $30\text{ FPS}$, this evaluates to the exact 6-frame lookup curve:

| Local Frame $\Delta f = f - f_{\text{start}}$ | Elapsed Time (ms) | Scale Factor $s(\Delta f)$ | Visual Effect |
| :---: | :---: | :---: | :--- |
| `0` | `0.0 ms` | **`0.860`** | Crisp slightly-compressed entry frame |
| `1` | `33.3 ms` | **`1.000`** | Crosses nominal size at high velocity |
| `2` | `66.7 ms` | **`1.140`** | Peak spring overshoot (+14% pop) |
| `3` | `100.0 ms` | **`1.093`** | Begins damped recoil |
| `4` | `133.3 ms` | **`1.047`** | Settling toward rest |
| $\ge 5$ | $\ge 166.7\text{ ms}$ | **`1.000`** | Locked at rest scale until `endFrame` |

---

## 2. Stylized 3D Shaders (3-Band Toon, Thermal Heat-Map & Depth Fog)

### 2.1 Three-Band Quantized Cel/Toon Diffuse Lighting
Given surface unit normal $\mathbf{N}$ and directional sun vector $\mathbf{L} = \operatorname{normalize}([8, 16, 10]^T)$:

$$N_L = \max(0.0,\; \mathbf{N} \cdot \mathbf{L})$$

$$I_{\text{toon}}(N_L) = \begin{cases} 1.00 & N_L \ge 0.65 \quad (\text{Lit Highlight Band}) \\ 0.68 & 0.22 \le N_L < 0.65 \quad (\text{Midtone Band}) \\ 0.38 & N_L < 0.22 \quad (\text{Warm Shadow Band}) \end{cases}$$

### 2.2 Thermal Expansion / Heated Metal Shader (`7xS87iActkU` & `lnYLIWP2l-I`)
Used when steel rails expand in the summer sun (`7xS87iActkU` at `00:38–00:58`) or cannonballs glow inside a furnace (`lnYLIWP2l-I` at `00:22`). Let $T(z, f) \in [0, 1]$ be normalized temperature along the object coordinate $z$:

$$T(z, f) = \operatorname{clamp}\!\left(\sin\!\big(\pi \cdot S_3(u_{\text{heat}}(f))\big) \cdot e^{-0.4 (z - z_{\text{gap}})^2},\; 0,\; 1\right)$$

Map $T \in [0, 1]$ through a 4-stop piecewise linear color ramp:
- $T = 0.00 \to \text{Cold Steel } \#71717A\;(113, 113, 122)$
- $T = 0.35 \to \text{Thermal Purple } \#7E22CE\;(126, 34, 206)$
- $T = 0.70 \to \text{Magenta Glow } \#EC4899\;(236, 72, 153)$
- $T = 1.00 \to \text{Incandescent Yellow-White } \#FEF08A\;(254, 240, 138)$

### 2.3 Beer-Lambert Exponential Canyon/Ocean Depth Fog
Given camera-to-fragment Euclidean distance $d = \|\mathbf{X}_{\text{frag}} - \mathbf{P}_{\text{cam}}\|_2$ with near start $d_{\text{near}} = 14.0\text{ m}$ and far limit $d_{\text{far}} = 48.0\text{ m}$:

$$f_{\text{fog}}(d) = \operatorname{clamp}\!\left(\frac{d - d_{\text{near}}}{d_{\text{far}} - d_{\text{near}}},\; 0.0,\; 1.0\right)$$

$$\mathbf{C}_{\text{final}} = (1 - f_{\text{fog}}) \mathbf{C}_{\text{toon}} + f_{\text{fog}} \mathbf{C}_{\text{abyss}}$$

where $\mathbf{C}_{\text{abyss}} = \#1D4ED8$ $(29, 78, 216)$ for deep canyons or `#0E7490` for ocean horizons.

---

## 3. Procedural Foley & Audio Synthesis Equations (Sample Rate $F_s = 44100\text{ Hz}$)

Every visual action in `@RicksClips3000` is paired with a synthesized or mixed diegetic foley cue at time $t = \frac{i}{F_s}\text{ s}$ (frame $f = \lfloor 30 t \rfloor$):

1. **Metallic Hacksaw Stroke (`saw_scrape`)**:
   Triggered whenever $\sin(0.65 f) > 0.20$:
   $$y_{\text{saw}}(t) = 0.12 \cdot \operatorname{sawtooth}\!\Big(2\pi \big(1650 + 450 \sin(0.65 f)\big) t\Big) \cdot e^{-8.0 \, (t \bmod 0.30)}$$
2. **Steam Locomotive Chug & Doppler Whistle Pass (`train_doppler`)**:
   As the train passes camera position $Z_{\text{cam}}$ with velocity $v_{\text{train}} = \frac{dZ_{\text{train}}}{dt}$, the observed whistle chord frequencies $f_k \in \{587.33, 739.99, 880.0\}\text{ Hz}$ shift via the classical acoustic Doppler equation ($c_{\text{sound}} = 343\text{ m/s}$):
   $$f_{\text{obs}, k}(t) = f_k \cdot \frac{c_{\text{sound}}}{c_{\text{sound}} + v_{\text{train}}(t) \cdot \frac{Z_{\text{train}}(t) - Z_{\text{cam}}(t)}{\|\mathbf{P}_{\text{train}}(t) - \mathbf{P}_{\text{cam}}(t)\|_2}}$$
3. **High-Altitude Canyon Wind / Camera Whip-Pan Whoosh (`whoosh`)**:
   Frequency-swept triangle/noise burst over duration $D_w = 0.35\text{ s}$ from onset $t_0$:
   $$\tau = \frac{t - t_0}{D_w} \in [0, 1], \qquad f_{\text{sweep}}(\tau) = 220 \cdot (65 / 220)^\tau, \qquad y_{\text{whoosh}}(t) = 0.09 \sin\!\big(2\pi f_{\text{sweep}}(\tau) (t - t_0)\big) (1 - \tau)^2$$
4. **Payoff Cash Register Chime (`cash_chime`)**:
   Three staggered high-Q sine partials at $f_0 = 1318.5\text{ Hz}$ ($\text{E}_6$), $f_1 = 1760.0\text{ Hz}$ ($\text{A}_6$), $f_2 = 2637.0\text{ Hz}$ ($\text{E}_7$) spaced by $\Delta t = 60\text{ ms}$:
   $$y_{\text{chime}}(t) = \sum_{k=0}^{2} 0.06 \, \Theta(t - k\Delta t) \, \sin\!\big(2\pi f_k (t - k\Delta t)\big) \, e^{-6.5 (t - k\Delta t)}$$
