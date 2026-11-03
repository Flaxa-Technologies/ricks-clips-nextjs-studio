# Reference 01 — 2.5D Character Anatomy, Facial Vector Math & Analytical Inverse Kinematics

This document defines the exact geometric, trigonometric, and kinematic equations used to construct and animate `@RicksClips3000`-style 2.5D cartoon characters inside a 3D world without guesswork.

---

## 1. Canonical World-Space Coordinate System & Proportions

Each character is rooted at a 3D ground contact point $\mathbf{P}_{\text{root}}(f) = (X_c, Y_c, Z_c)$ with total standing height $H_{\text{char}} = 1.60\text{ m}$:

| Anatomical Part | Local Pivot $(x, y, z)$ (m) | Geometry Dimensions (m) | Canvas Texture Resolution | Ink Stroke Ratio |
| :--- | :--- | :--- | :--- | :--- |
| **Contact Blob Shadow** | $(0.00,\; 0.01,\; 0.00)$ | Circle $R = 0.38\text{ m}$ | N/A (`#090A0F`, $\alpha = 0.42$) | $0$ |
| **Left Hip / Leg** | $(-0.11,\; 0.42,\; 0.00)$ | Cylinder $r = 0.024,\; L = 0.42$ | Solid `#231F20` | $100\%$ fill |
| **Right Hip / Leg** | $(+0.11,\; 0.42,\; 0.00)$ | Cylinder $r = 0.024,\; L = 0.42$ | Solid `#231F20` | $100\%$ fill |
| **Left / Right Foot** | $(\pm 0.15,\; 0.02,\; +0.05)$ | Box $0.11 \times 0.04 \times 0.14$ | Solid `#231F20` | $100\%$ fill |
| **Torso Pill Plane** | $(0.00,\; 0.76,\; 0.00)$ | Plane $0.52 \times 0.65$ | $256 \times 320\text{ px}$ | $14\text{ px}$ ($5.47\%$) |
| **Head Plane** | $(0.00,\; 1.36,\; +0.03)$ | Plane $0.92 \times 0.92$ | $512 \times 512\text{ px}$ | $14\text{ px}$ ($2.73\%$) |
| **Shoulder Pivots** | $(\pm 0.22,\; 0.92,\; +0.04)$ | 2-Bone IK ($L_1=0.22,\; L_2=0.22$) | Solid `#231F20` ($r=0.022$) | $100\%$ fill |

---

## 2. Cylindrical Y-Axis Billboarding & Depth Sorting

Unlike full 3D meshes that distort when viewed from extreme angles, `@RicksClips3000` characters use **Cylindrical Y-Axis Billboarding**:

$$\theta_Y(f) = \operatorname{atan2}\!\Big(X_{\text{cam}}(f) - X_c(f),\; Z_{\text{cam}}(f) - Z_c(f)\Big)$$

The character's local transform matrix $\mathbf{M}_{\text{char}}(f)$ is:

$$\mathbf{M}_{\text{char}}(f) = \begin{bmatrix} \cos\theta_Y & 0 & \sin\theta_Y & X_c(f) \\ 0 & 1 & 0 & Y_c(f) \\ -\sin\theta_Y & 0 & \cos\theta_Y & Z_c(f) \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

- **Why Cylindrical (Y-only) instead of Spherical Billboarding?**
  When the camera pitches down from high altitude (e.g., Beat 3 Abyss Pullback or Beat 4 Vertigo Dive), spherical billboarding would lay the character flat on their back. Cylindrical billboarding keeps the character standing vertically upright along the world $+Y$ axis while always turning their face toward the lens horizontally.
- **Z-Fighting Prevention**:
  The Head plane is offset forward along local $+Z$ by $\Delta z_{\text{head}} = +0.03\text{ m}$, and the Arms/Props group is offset by $\Delta z_{\text{arms}} = +0.08\text{ m}$ so the head always overlaps the top of the torso collar cleanly, and held props overlap the torso without depth buffer flickering.

---

## 3. Exact 2D Head Canvas Construction ($512 \times 512\text{ px}$)

### 3.1 Base Ellipse & Boolean Cel-Shaded Rim Crescent
Let canvas dimensions be $W = 512,\; H = 512$, with head center $(c_x, c_y) = (256, 285)$ and semi-axes $(R_x, R_y) = (138, 126)$:

$$\frac{(x - 256)^2}{138^2} + \frac{(y - 285)^2}{126^2} \le 1$$

To compute the signature lower-left cel-shaded shadow crescent without gradients:
1. Define the **outer head domain** $\Omega_{\text{head}}$ centered at $(c_x, c_y) = (256, 285)$ with radii $(138, 126)$.
2. Define the **shifted lit-region ellipse** $\Omega_{\text{lit}}$ shifted toward the upper-right key light by $(\Delta x_{\text{cel}}, \Delta y_{\text{cel}}) = (+0.159 R_x,\; -0.143 R_y) = (+22\text{ px},\; -18\text{ px})$:
   $$\Omega_{\text{lit}} = \left\{(x, y) \;\middle|\; \frac{(x - 278)^2}{138^2} + \frac{(y - 267)^2}{126^2} \le 1\right\}$$
3. The **shadow crescent region** is the boolean difference $\Omega_{\text{shadow}} = \Omega_{\text{head}} \setminus \Omega_{\text{lit}}$, rendered in Canvas via `ctx.clip()` + `ctx.fill('evenodd')` with color `#D9DFE6` over base fill `#FDFDFD`.

### 3.2 Emotional Skin Color Lerp ("Purple Boss Rage" Effect)
In shots where a character boils over with rage (e.g., *Why Perfect Railroads Don't Work* at `00:17`), the base skin RGB color $\mathbf{C}_{\text{skin}}(f)$ interpolates linearly from `#FDFDFD` $(253, 253, 253)$ to Deep Royal Purple `#7E22CE` $(126, 34, 206)$ over 15 frames ($0.50\text{ s}$):

$$\alpha_{\text{rage}}(f) = S_3\!\left(\frac{f - f_{\text{rage,start}}}{15}\right)$$

$$\mathbf{C}_{\text{skin}}(f) = (1 - \alpha_{\text{rage}}) \begin{bmatrix} 253 \\ 253 \\ 253 \end{bmatrix} + \alpha_{\text{rage}} \begin{bmatrix} 126 \\ 34 \\ 206 \end{bmatrix}$$

Simultaneously, two symmetric steam jets spawn at ear coordinates $(c_x \pm 142,\; c_y - 12)$ along angles $\theta_{\text{steam}} = \pm 28^\circ$ with puff radius $r_{\text{puff}}(k) = 14 + 28 \cdot \operatorname{frac}(0.08 f + 0.33 k)\text{ px}$.

---

## 4. Parametric Facial Feature Vector Equations

Let $\theta_{\text{pitch}} \in [-0.6, +0.6]\text{ rad}$ be head vertical pitch and $\psi_{\text{yaw}} \in [-0.5, +0.5]\text{ rad}$ be pseudo-3D head turn on the 2D plane:

$$\Delta x_{\text{face}} = 52.0 \cdot \sin(\psi_{\text{yaw}}), \qquad \Delta y_{\text{face}} = 55.0 \cdot \sin(\theta_{\text{pitch}})$$

- **Left & Right Eye Anchor Coordinates**:
  $$x_{\text{eye,L}} = c_x - 36 + \Delta x_{\text{face}}, \qquad x_{\text{eye,R}} = c_x + 38 + \Delta x_{\text{face}}, \qquad y_{\text{eye}} = c_y - 8 + \Delta y_{\text{face}}$$
- **Eyebrow Vector Endpoints** (parameterized by $\beta_{\text{brow}} \in [-0.45, +0.45]$, where $\beta > 0$ = angry/focused inward tilt, $\beta < 0$ = worried/sad outward tilt):
  $$\mathbf{B}_{L,\text{outer}} = \big(x_{\text{eye,L}} - 26,\; y_{\text{eye}} - 32 - 18 \beta_{\text{brow}}\big), \quad \mathbf{B}_{L,\text{inner}} = \big(x_{\text{eye,L}} + 22,\; y_{\text{eye}} - 30 + 22 \beta_{\text{brow}}\big)$$
  $$\mathbf{B}_{R,\text{inner}} = \big(x_{\text{eye,R}} - 22,\; y_{\text{eye}} - 30 + 22 \beta_{\text{brow}}\big), \quad \mathbf{B}_{R,\text{outer}} = \big(x_{\text{eye,R}} + 26,\; y_{\text{eye}} - 32 - 18 \beta_{\text{brow}}\big)$$

### Complete 8-State Eye Geometry Table

| `eyeState` | Vector Drawing Specification (at each eye center $(e_x, y_{\text{eye}})$) |
| :--- | :--- |
| `'normal'` | Solid `#231F20` ellipse with radii $(r_x = 13\text{ px},\; r_y = 15\text{ px})$. |
| `'smug'` | Solid `#231F20` ellipse $(r_x = 13,\; r_y = 11)$ + flat upper eyelid line $(e_x - 20,\; y_{\text{eye}} - 8) \to (e_x + 20,\; y_{\text{eye}} - 8)$, width $9\text{ px}$. |
| `'squint'` | `><` chevrons: Left $(e_{x,L}-18, y_{\text{eye}}-12) \to (e_{x,L}+8, y_{\text{eye}}) \to (e_{x,L}-18, y_{\text{eye}}+12)$; Right mirrored, stroke $10\text{ px}$. |
| `'wide_down'` | White sclera ellipse $(r_x = 20,\; r_y = 22)$, stroke $7\text{ px}$ `#231F20` + pupil circle $r = 8\text{ px}$ shifted down to $(e_x,\; y_{\text{eye}} + 12)$. |
| `'wide_shock'` | White sclera ellipse $(r_x = 22,\; r_y = 24)$, stroke $7\text{ px}$ + tiny pinpoint pupil $r = 5\text{ px}$ at $(e_x,\; y_{\text{eye}}) + 2$ sweat droplet arcs. |
| `'wink'` | Left eye `'normal'`; Right eye upward arc centered at $(e_{x,R},\; y_{\text{eye}} + 4)$, radius $r = 16\text{ px}$, angles $[1.1\pi,\; 1.9\pi]$. |
| `'angry_slit'` | Solid `#231F20` ellipse $(r_x = 14,\; r_y = 13)$ clipped on top by angled brow line. |
| `'dead_x'` | Two crossed lines $(e_x - 12, y_{\text{eye}} - 12) \to (e_x + 12, y_{\text{eye}} + 12)$ and $(e_x + 12, y_{\text{eye}} - 12) \to (e_x - 12, y_{\text{eye}} + 12)$, width $9\text{ px}$. |

### Complete 6-State Mouth Viseme Geometry Table
Centered at $(m_x, m_y) = (c_x + \Delta x_{\text{face}},\; c_y + 42 + \Delta y_{\text{face}})$:

| `mouthState` | Vector Drawing Specification |
| :--- | :--- |
| `'closed_smirk'` | Quadratic Bézier from $(m_x - 22,\; m_y + 2)$ with control $(m_x + 4,\; m_y + 10)$ to $(m_x + 26,\; m_y - 8)$, stroke $9\text{ px}$. |
| `'talk_open'` | Dark oval $(m_x + 4,\; m_y + 2,\; r_x = 26,\; r_y = 15,\; \text{rot} = -0.08\text{ rad})$ + white teeth bar $[m_x - 16,\; m_y - 10,\; 40 \times 9\text{ px}]$. |
| `'talk_wide'` | White semicircle `arc(m_x, m_y - 4, r = 34, 0, PI)` closed on top, stroke $9\text{ px}$ `#231F20`. |
| `'o_gasp'` | Dark vertical ellipse $(m_x,\; m_y + 6,\; r_x = 14,\; r_y = 18)$. |
| `'gritted_teeth'` | White rounded rectangle $[m_x - 28,\; m_y - 12,\; 56 \times 24\text{ px},\; r=8]$ with horizontal midline and 3 vertical tooth dividers. |
| `'frown'` | Quadratic Bézier from $(m_x - 24,\; m_y + 10)$ with control $(m_x,\; m_y - 12)$ to $(m_x + 24,\; m_y + 10)$, stroke $9\text{ px}$. |

---

## 5. Two-Bone Analytical Inverse Kinematics & Rubber-Hose Bézier Limbs

Given shoulder/hip origin $\mathbf{P}_0 = (x_0, y_0)$ and hand/foot target $\mathbf{P}_2 = (x_2, y_2)$ with upper limb length $L_1$ and lower limb length $L_2$:

1. **Clamped Reach Distance**:
   $$\Delta x = x_2 - x_0, \qquad \Delta y = y_2 - y_0, \qquad D = \min\!\Big(\sqrt{\Delta x^2 + \Delta y^2},\; 0.999(L_1 + L_2)\Big)$$
2. **Law of Cosines Joint Angles**:
   $$\theta_{\text{base}} = \operatorname{atan2}(\Delta y, \Delta x)$$
   $$\alpha = \arccos\!\left(\operatorname{clamp}\!\left(\frac{L_1^2 + D^2 - L_2^2}{2 L_1 D},\; -1,\; 1\right)\right)$$
   $$\theta_1 = \theta_{\text{base}} + s_{\text{bend}} \cdot \alpha$$
   where $s_{\text{bend}} \in \{-1, +1\}$ selects elbow/knee bend direction ($-1$ for arms reaching right, $+1$ for legs).
3. **Mid-Joint (Elbow / Knee) Coordinate $\mathbf{P}_1$**:
   $$\mathbf{P}_1 = \big(x_0 + L_1 \cos\theta_1,\; y_0 + L_1 \sin\theta_1\big)$$
4. **Rubber-Hose Smooth Quadratic Bézier Evaluation**:
   Instead of a sharp polygonal bend at $\mathbf{P}_1$, evaluate a smooth quadratic Bézier curve using $\mathbf{P}_1$ as the control point for $t \in [0, 1]$:
   $$\mathbf{B}_{\text{limb}}(t) = (1 - t)^2 \mathbf{P}_0 + 2(1 - t)t\,\mathbf{P}_1 + t^2 \mathbf{P}_2$$
5. **Fourier Walk Cycle Equations** (at walking cadence $f_w = 2.8\text{ Hz}$, $\omega_w = \frac{2\pi \cdot 2.8}{30} = 0.5864\text{ rad/frame}$):
   $$x_{\text{foot}}(f, \phi_0) = x_{\text{hip}} + A_{\text{stride}} \sin(\omega_w f + \phi_0)$$
   $$y_{\text{foot}}(f, \phi_0) = \max\!\big(0,\; H_{\text{lift}} \cos(\omega_w f + \phi_0)\big)$$
   $$y_{\text{torso,bob}}(f) = y_{\text{torso,0}} + 0.035 \cdot \left|\sin(\omega_w f)\right|$$
   where left foot has phase $\phi_0 = 0$ and right foot has phase $\phi_0 = \pi$.
