# Reference 02 — Deterministic 3D Camera Choreography & Perspective Projection Math

This document provides the exact equations for `@RicksClips3000` camera movement, perspective projection from 3D world space $(X, Y, Z)$ to 2D vertical screen coordinates $(u_{\text{px}}, v_{\text{px}})$, and transition math.

---

## 1. The 6 Canonical `@RicksClips3000` Camera Trajectories

Let $f \in [f_0, f_1]$ be the frame index within a beat of duration $\Delta F = f_1 - f_0$, and let $u = \operatorname{clamp}\!\left(\frac{f - f_0}{\Delta F}, 0, 1\right)$ be the normalized beat time.

### Move 1: Low-Angle Rail/Floor Dolly Push-In (The Paradox Hook)
Places the camera lens $0.38\text{ m} - 0.52\text{ m}$ above the floor, pushing forward along $-Z$ while narrowing FOV slightly to intensify focus on the foreground action:

$$t = S_3(u) = 3u^2 - 2u^3$$

$$\mathbf{P}_{\text{cam}}(f) = \begin{bmatrix} X_0 + (X_1 - X_0)\,t \\ Y_0 + (Y_1 - Y_0)\,t \\ Z_0 + (Z_1 - Z_0)\,t \end{bmatrix} = \begin{bmatrix} \operatorname{lerp}(0.42,\; 0.28,\; t) \\ \operatorname{lerp}(0.42,\; 0.52,\; t) \\ \operatorname{lerp}(3.85,\; 2.35,\; t) \end{bmatrix}$$

$$\mathbf{T}_{\text{cam}}(f) = \begin{bmatrix} \operatorname{lerp}(-0.25,\; -0.38,\; t) \\ \operatorname{lerp}(0.62,\; 0.78,\; t) \\ -6.00 \end{bmatrix}, \qquad \text{FOV}(f) = \operatorname{lerp}(50^\circ,\; 44^\circ,\; t)$$

---

### Move 2: $180^\circ$ Cylindrical Orbit Around Character + Foreground Wipe
Swings the camera around a character at $\mathbf{P}_c = (X_c, Y_c, Z_c)$ from front-facing angle $\phi_0 = 0.35\text{ rad}$ ($20^\circ$) to rear-facing angle $\phi_1 = 2.95\text{ rad}$ ($169^\circ$), completely reversing the background environment:

$$\phi(u) = \phi_0 + (\phi_1 - \phi_0) \cdot S_3\!\big(\min(1.0,\; 1.85 u)\big), \qquad R(u) = \operatorname{lerp}(2.20,\; 2.80,\; S_3(u))$$

$$\mathbf{P}_{\text{cam}}(f) = \begin{bmatrix} X_c + R(u) \sin\phi(u) \\ \operatorname{lerp}(0.75,\; 1.15,\; S_3(u)) \\ Z_c(u) + R(u) \cos\phi(u) \end{bmatrix}$$

- **Camera Dutch Roll Induced by Angular Velocity**:
  $$\phi_{\text{roll}}(f) = 0.03 \cdot \sin\!\left(\pi \cdot \min(1.0,\; 1.85 u)\right)\text{ rad}$$
- **Foreground Wipe Object Trajectory** (e.g., locomotive or cannonball passing lens at $u \in [0.50, 0.92]$):
  $$Z_{\text{wipe}}(u) = \operatorname{lerp}\!\left(-2.0,\; +14.0,\; \frac{u - 0.50}{0.42}\right)$$

---

### Move 3: Exponential High-Altitude Abyss Crane Pullback
Reveals massive world scale by pulling the camera upward and backward using an exponential growth curve $E_k(u) = \frac{e^{k u} - 1}{e^k - 1}$ (with $k = 1.6$) or smoothstep:

$$\mathbf{P}_{\text{cam}}(f) = \mathbf{P}_{\text{start}} + (\mathbf{P}_{\text{end}} - \mathbf{P}_{\text{start}}) \cdot E_{1.6}(u) = \begin{bmatrix} \operatorname{lerp}(3.5,\; 11.0,\; E_{1.6}(u)) \\ \operatorname{lerp}(4.5,\; 10.5,\; E_{1.6}(u)) \\ \operatorname{lerp}(6.0,\; 18.5,\; E_{1.6}(u)) \end{bmatrix}$$

$$\mathbf{T}_{\text{cam}}(f) = \begin{bmatrix} \operatorname{lerp}(0.0,\; -2.5,\; u) \\ \operatorname{lerp}(2.0,\; 3.5,\; u) \\ \operatorname{lerp}(-12.0,\; -22.0,\; u) \end{bmatrix}, \qquad \text{FOV}(f) = 52^\circ$$

---

### Move 4: Constant-Subject-Width Dolly Zoom (The "Vertigo / Trombone" Shock Effect)
Used when a character realizes a terrifying truth (e.g., all 8 dragon balls dropping at `00:35` in *The Ancient Jar That Warned an Empire*). The camera pulls backward while zooming in (or pushes in while widening FOV) so the character's apparent width $W_{\text{apparent}}$ in screen space stays constant while the background violently expands or compresses:

$$\text{FOV}(u) = \operatorname{lerp}(\text{FOV}_0,\; \text{FOV}_1,\; S_3(u))$$

$$d(u) = \left\|\mathbf{P}_{\text{cam}}(u) - \mathbf{P}_{\text{char}}\right\|_2 = \frac{W_{\text{apparent}}}{2 \tan\!\left(\frac{\text{FOV}(u) \cdot \pi}{360}\right)}$$

---

### Move 5: $90^\circ$ Downward Vertigo Pitch Dive
Tilts the look-at target straight down into a chasm/furnace/earthquake fault while accelerating downward along $-Y$ and expanding FOV for speed sensation:

$$\mathbf{P}_{\text{cam}}(u) = \begin{bmatrix} X_0 \\ \operatorname{lerp}(+4.80,\; -6.00,\; u^2) \\ Z_0 \end{bmatrix}, \quad \mathbf{T}_{\text{cam}}(u) = \begin{bmatrix} X_0 + 0.3 \\ \operatorname{lerp}(+1.00,\; -18.00,\; u) \\ Z_0 - 3.2 \end{bmatrix}, \quad \text{FOV}(u) = \operatorname{lerp}(46^\circ,\; 64^\circ,\; u)$$

---

### Move 6: High-FOV Supersonic Rush $\to$ Snap Portrait Payoff
1. **Rush Phase ($u \in [0, 0.64]$)**: Wide $\text{FOV} = 68^\circ \to 52^\circ$, high forward velocity $\frac{dZ}{dt}$ across the terrain:
   $$Z_{\text{cam}}(u) = \operatorname{lerp}\!\big(26.0,\; 7.5,\; S_3(u / 0.64)\big)$$
2. **Portrait Payoff Phase ($u \in (0.64, 1.0]$)**: Snaps to a flattering portrait telephoto $\text{FOV} = 42^\circ$ centered on the payoff character and banner:
   $$Z_{\text{cam}}(u) = \operatorname{lerp}\!\big(5.2,\; 3.4,\; S_3((u - 0.64) / 0.36)\big)$$

---

## 2. Exact 3D-to-2D Pinhole Perspective Projection Matrix

When rendering in a 2D Canvas or Python Pillow script (such as [`scripts/render_10s_video.py`](../../scripts/render_10s_video.py)) without WebGL, compute exact 2D screen coordinates $(u_{\text{px}}, v_{\text{px}})$ from any 3D world point $\mathbf{X}_w = (X, Y, Z)$ as follows:

1. **Camera Orthonormal Basis Vectors $(\mathbf{r}, \mathbf{u}, \mathbf{f})$**:
   $$\mathbf{f} = \frac{\mathbf{T}_{\text{cam}} - \mathbf{P}_{\text{cam}}}{\|\mathbf{T}_{\text{cam}} - \mathbf{P}_{\text{cam}}\|_2}, \qquad \mathbf{r}_0 = \frac{\mathbf{f} \times [0, 1, 0]^T}{\|\mathbf{f} \times [0, 1, 0]^T\|_2}, \qquad \mathbf{u}_0 = \mathbf{r}_0 \times \mathbf{f}$$
   Applying camera roll angle $\phi_{\text{roll}}$:
   $$\mathbf{r} = \mathbf{r}_0 \cos\phi_{\text{roll}} + \mathbf{u}_0 \sin\phi_{\text{roll}}, \qquad \mathbf{u} = -\mathbf{r}_0 \sin\phi_{\text{roll}} + \mathbf{u}_0 \cos\phi_{\text{roll}}$$

2. **Camera-Space Coordinates $(x_c, y_c, z_c)$**:
   $$\mathbf{d} = \mathbf{X}_w - \mathbf{P}_{\text{cam}}, \qquad x_c = \mathbf{d} \cdot \mathbf{r}, \qquad y_c = \mathbf{d} \cdot \mathbf{u}, \qquad z_c = \mathbf{d} \cdot \mathbf{f}$$
   *(Reject any point behind the near plane $z_c \le 0.10\text{ m}$.)*

3. **Normalized Device Coordinates (NDC) & Pixel Coordinates $(u_{\text{px}}, v_{\text{px}})$**:
   Let vertical focal length be $f_y = \frac{1}{\tan(\text{FOV}_{\text{rad}} / 2)}$ and aspect ratio $A = \frac{W}{H} = \frac{9}{16} = 0.5625$:
   $$x_{\text{ndc}} = \frac{x_c \cdot (f_y / A)}{z_c}, \qquad y_{\text{ndc}} = \frac{y_c \cdot f_y}{z_c}$$
   $$u_{\text{px}} = \frac{W}{2} \big(1 + x_{\text{ndc}}\big), \qquad v_{\text{px}} = \frac{H}{2} \big(1 - y_{\text{ndc}}\big)$$
   And the perspective scale factor of a 2.5D billboard of world height $H_{\text{obj}}$ at depth $z_c$ is:
   $$\text{scale}_{\text{px}}(z_c) = \frac{H_{\text{obj}} \cdot f_y \cdot (H / 2)}{z_c}$$
