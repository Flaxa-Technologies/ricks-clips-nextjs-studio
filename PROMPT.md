# MASTER SYSTEM & FULL PRODUCTION PROMPT (NEW CHAT — GOOGLE AI STUDIO / NODE 2 AGENT)
## Project: "Rental Building Ka Asli Dhandha" (Indian Rental Apartment Builder Economics Documentary)
### Channel: The Rabbit Files (`@rabbitfiles16`) · Language: Hinglish / Hindi (`hi-IN`)

---

## 🚨 0. CRITICAL ANTI-DASHBOARD & ANTI-WIREFRAME LAW (READ FIRST!)

**DO NOT BUILD A WEB DASHBOARD, ADMIN PANEL, OR MULTI-BOX SLIDE DECK.**
In previous attempts, AI agents made the mistake of rendering a static top bar (`ACT 01 / 06`), a left bordered card, a right bordered card with mini stat boxes, and a bordered bottom subtitle bar across the entire video. **THAT IS STRICTLY FORBIDDEN.**

You must obey these **Inviolable Visual Laws**:
1. **ZERO Persistent UI Chrome**:
   - **NO top header bars** (never show `ACT 01 / 06`, `THE RABBIT FILES`, or telemetry badges at the top).
   - **NO multi-column dashboard cards** (never put a "Left Box" and "Right Box" wrapped in `border-4 border-black rounded-3xl`).
   - **NO boxed bottom subtitle pills**. If subtitles are shown, render only 3–5 large, borderless kinetic words floating cleanly at `Y = 980`.
2. **Every Beat (Every 8–12 Seconds) Must Be a Completely New Full-Screen `1920×1080` Scene**:
   - When the narrator moves from the *Morning Alarm* to the *4-Story Building Calculator*, the **entire 1920×1080 canvas wipes/morphs** into a brand-new full-screen visual rig (using Radial Iris Wipe, Capsule Long-Shadow Scanner, Liquid Bezier Curtain, or 3D Camera Whip-Pan).
3. **Two Visual Modes Working Together**:
   - **Mode A — *Paisa Decode / Think School* Open-Canvas Editorial Infographics (on Warm Sketchbook Paper `#FAF7F0`)**:
     - Clean left-to-right visual equations just like the reference image: `[Left Illustration] ───(Hand-Drawn Curved Arrow)───> [Right Scale Stack + Hand-Drawn Calculator + Calendar Badge]`, sitting directly on the open cream paper background with **zero container boxes**.
   - **Mode B — Full-Viewport Three.js 3D Architectural Cinema & Heavy Mathematical Physics (on Warm Studio Putty `#EFECE6` or Deep Petrol-Sapphire `#123E5C`)**:
     - A full-screen Three.js `<Canvas>` (`1920×1080`) where a detailed 3D 4-story Indian rental apartment building stands 800px tall in the center of the viewport, with real 3D camera orbits, floor-by-floor vertical explosion (`springODE`), 3D room cutaways, and 45° volumetric shadows.
4. **Zero Pure Black (`#000000` / `bg-black`)**:
   - Never use `#000000` backgrounds. Alternate between:
     - **Warm Sketchbook Cream**: `radial-gradient(circle at 50% 45%, #FAF7F0 0%, #EFECE4 65%, #DFDBD0 100%)`
     - **Warm Studio Putty**: `radial-gradient(circle at 50% 45%, #EFECE6 0%, #DFDCD4 58%, #CDC9BF 100%)`
     - **Deep Petrol-Sapphire**: `radial-gradient(circle at 50% 45%, #134263 0%, #0B283D 58%, #061826 100%)`
     - **Soft Matte Graphite**: `radial-gradient(circle at 50% 45%, #2D3038 0%, #22252C 62%, #1A1C22 100%)`

---

## 1. DETERMINISTIC MATHEMATICAL ENGINE (`src/lib/kinematics.ts`)

Every frame is a pure closed-form function of time `Frame(t) = f(t)` driven by `window.__setDocTime(t)` (`flushSync`). Never use CSS `transition-*`, `animate-*`, `setTimeout`, or `Math.random()`.

Embed and use these exact solvers:
```ts
export function clamp(v: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function posterizeTime(t: number, fps = 12): number {
  return Math.floor(t * fps) / fps;
}

// Second-Order Damped Harmonic Oscillator ODE: x'' + 2*zeta*w0*x' + w0^2*(x - 1) = 0
export function springODE(
  dt: number,
  omega0 = 18,
  zeta = 0.68,
  v0 = 0
): { value: number; velocity: number } {
  if (dt <= 0) return { value: 0, velocity: v0 };
  if (zeta < 1) {
    const wd = omega0 * Math.sqrt(1 - zeta * zeta);
    const env = Math.exp(-zeta * omega0 * dt);
    const B = (zeta * omega0 - v0) / wd;
    const cos = Math.cos(wd * dt);
    const sin = Math.sin(wd * dt);
    return {
      value: 1 - env * (cos + B * sin),
      velocity: env * ((zeta * omega0 - B * wd) * cos + (wd + zeta * omega0 * B) * sin),
    };
  }
  const env = Math.exp(-omega0 * dt);
  return {
    value: 1 - env * (1 + (omega0 - v0) * dt),
    velocity: env * omega0 * (omega0 - v0) * dt,
  };
}

// Newton-Raphson Cubic Bezier Solver
export function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number {
  const x = clamp(t, 0, 1);
  if (x === 0 || x === 1) return x;
  let u = x;
  for (let i = 0; i < 8; i++) {
    const inv = 1 - u;
    const bx = 3 * inv * inv * u * x1 + 3 * inv * u * u * x2 + u * u * u - x;
    if (Math.abs(bx) < 1e-6) break;
    const dbx = 3 * inv * inv * x1 + 6 * inv * u * (x2 - x1) + 3 * u * u * (1 - x2);
    if (Math.abs(dbx) < 1e-6) break;
    u = clamp(u - bx / dbx, 0, 1);
  }
  const inv = 1 - u;
  return 3 * inv * inv * u * y1 + 3 * inv * u * u * y2 + u * u * u;
}

export const AE_SNAP = (t: number) => cubicBezier(t, 0.16, 1.0, 0.3, 1.0);
export const AE_DRAMATIC = (t: number) => cubicBezier(t, 0.85, 0.0, 0.15, 1.0);
export const LONG_SHADOW = Array.from({ length: 24 }, (_, i) =>
  `${i + 1}px ${i + 1}px 0px rgba(24, 24, 27, ${(0.18 * (1 - i / 24)).toFixed(3)})`
).join(", ");
```

**Tailwind v4 Transform Rule**: Never combine Tailwind's `-translate-x-1/2 -translate-y-1/2` class with `style={{ transform: 'translate(-50%, -50%) ...' }}` on the same element (causes `-100%` double offset). Use only `style={{ transform: 'translate(-50%, -50%) ...' }}`.

---

## 2. SARVAM AI (`hi-IN`) TTS & AUDIO PIPELINE

1. **Sarvam AI TTS Generation**:
   - Accept the user's `SARVAM_API_KEY` (via `.env` or script config).
   - Call Sarvam AI TTS (`https://api.sarvam.ai/text-to-speech`, `target_language_code: "hi-IN"`, model `bulbul:v2` or `bulbul:v3`, natural male documentary narrator voice, pace `1.05`).
   - Synthesize audio for each of the **16 Scenes** below, concatenate into `public/audio/master_voice.wav`, and extract exact word-level timestamps (`word_map.json` with `g`, `loc`, `dur`).
2. **Loudness & Background Score**:
   - Synthesize the **116 BPM Option 3 "Modern Ambient Momentum" score** (warm Rhodes chords `D -> A -> Bm -> G`, soft acoustic kick on beats 0 & 2, subtle shaker, and stereo transition whooshes at every scene cut), ducked by `-18 dB` under active voiceover.
   - Normalize the final master audio with `ffmpeg -af "loudnorm=I=-14:TP=-1.0:LRA=7"` so the Hindi voiceover is loud, crisp, and punchy on mobile and desktop speakers.

---

## 3. THREE.JS 3D MODELS & `image-rq.md` ILLUSTRATION PROTOCOL

### A. Real-Time Procedural Three.js 3D Architectural Models (`<Canvas>` Full-Screen 1920×1080)
Build a dedicated Three.js PBR component (`RentalBuilding3DStage.tsx`) that renders a **true 3D architectural model** (NOT a 2D SVG box!) with:
- **30×40 ft (1,200 sq.ft) 3D Plot Base**: Extruded concrete foundation slab, road frontage with streetlamps, boundary wall, and parked scooter/car meshes.
- **G+3 (4-Story) Reinforced Concrete Frame**:
  - 12 vertical RCC pillars (`BoxGeometry`), 4 floor slabs that physically animate their vertical separation `floorY[i] = baseFloorY[i] + explodeProgress * i * 1.8` using `springODE`.
  - Exterior balconies with glass/iron railings, brick/plaster walls that can fade their `opacity` (`0.15 -> 1.0`) to reveal the interior room layout!
  - **Interior Room Cutaways**:
    - In `mode="2BHK"`: 1 large living room + 2 bedrooms per floor (fewer tenants, low yield).
    - In `mode="1RK"`: 4 compact Micro-Studio 1RK units per floor, each with a 3D bed mesh, study desk, kitchenette counter, and bathroom partition, glowing emerald green (`#10B981`).
  - **Rooftop Details**: Overhead cylindrical water tank, staircase mumty room, and solar panels.

### B. 2D Editorial Illustrations (`image-rq.md` + Full-Stage SVG Vectors)
1. Generate a complete **`image-rq.md`** file in the root directory containing copy-pasteable **Gemini / Imagen 3 prompts** for all 10 *Paisa Decode* style monoline ink illustrations (with exact filename targets in `public/assets/illustrations/`).
2. In your React scene components, create an `<EditorialIllustration src="/assets/illustrations/..." fallbackSvg={...} />` component that automatically renders the image if present in `public/assets/illustrations/` AND includes a **rich, hand-crafted multi-path monoline SVG character/prop illustration** (matching the *Paisa Decode* black-ink + tangerine `#FF7A29` + cream `#FAF7F0` style) so every scene looks 100% finished even before external PNGs are dropped in!

---

## 4. COMPLETE 16-BEAT SCRIPT & FULL-SCREEN VISUAL CHOREOGRAPHY

Do **NOT** merge these 16 beats into a single template. Build **16 distinct full-screen visual scenes** that switch on the exact narration timestamps:

---

### ACT 1: THE RELATABLE DREAM (Ek Din Aap So Kar Uthte Ho...)

#### Beat 1 (`0:00 – 0:14`) — The 8:00 AM Corporate Rat-Race Wakeup
- **Hinglish Voiceover**:
  > *"Ek din aap subah aath baje so kar uthte ho. Bahar traffic ka shor hai, office ke liye late ho rahe ho, aur dimag me wahi purana sawaal aata hai—'Aakhir main kab tak is corporate chuha-daud me ghista rahunga?'"*
- **Full-Screen Visual (`Warm Sketchbook Cream #FAF7F0`)**:
  - **Paisa Decode Style Split Illustration (Zero Boxes!)**:
    - Left half: Monoline ink illustration of a tired Indian office worker waking up to an `8:00 AM` ringing analog clock, surrounded by floating laptop/traffic icons.
    - Center: A hand-drawn curved black ink arrow (`strokeDashoffset` animated) pointing right toward a glowing window view.
    - Top Title Banner (Ribbon style like *Paisa Decode*): `MONDAY 8:00 AM · THE CORPORATE RAT RACE`.

#### Beat 2 (`0:14 – 0:30`) — The 4-Story Rental Building Math (Momo-Cart-to-200-Plates Layout!)
- **Hinglish Voiceover**:
  > *"Tabhi aapki nazar samne wali gali me ban rahi ek chamchamati chaar-manzila building pe padti hai. Aap calculator nikalte ho: chaar floors... har floor pe teen rooms... total baarah rooms. Agar har room se baarah hazaar rent aaye, toh mahine ka seedha ek lakh chawalis hazaar!"*
- **Full-Screen Visual (`Warm Sketchbook Cream #FAF7F0` — Exact Layout of the User's Momo Reference Image!)**:
  - Top Hand-Drawn Header Box: `MONTHLY SCALE: 12 RENTAL ROOMS`.
  - **Left Side (`X = 420`)**: Clean 2D monoline ink illustration of a 4-story apartment building with a proud landlord standing in front (`1 ROOM = ₹12,000` sign at the bottom left).
  - **Center (`X = 920`)**: Hand-drawn curved black ink arrow (`──>`) drawing across the paper.
  - **Right Side (`X = 1420`)**:
    - Three towering stacks of **12 isometric room/key blocks** topped with an orange badge: `12 ROOMS RENTED`.
    - Bottom-left of stack: Hand-drawn flip calendar with orange spiral binding: `TOTAL RENT: EVERY 1ST` (circled in orange ink).
    - Bottom-right of stack: Tilted gray pocket calculator displaying: `12 × 12,000 = ₹1.44 LAKH`.

#### Beat 3 (`0:30 – 0:46`) — The Passive Income Fantasy vs. The Chakravyuh
- **Hinglish Voiceover**:
  > *"Saal ka lagbhag satrah lakh rupaye! Na koi boss ki chik-chik, na appraisal ka natak. Bas ek tareekh ko bed pe soye-soye phone pe 'Rent Credited' ka notification aayega! Par kya rental building ka dhandha sach me itna aasan hai? Ya fir ye ek aisa chakravyuh hai jisme aapki saari savings phas sakti hain?"*
- **Full-Screen Visual (`Warm Studio Putty #EFECE6` -> Radial Iris Wipe to `Deep Petrol-Sapphire #123E5C`)**:
  - First half (`0:30–0:38`): Giant smartphone in the center of the screen receiving 12 cascading green UPI/Bank notifications (`+₹12,000 RENT CREDITED`) ticking up to `₹17.28 LAKH / YEAR`.
  - Second half (`0:38–0:46`): At the word *"chakravyuh"*, a **Concentric Spinning Labyrinth / Vault Ring** (`MinimalConcentricDialVaultLockRig` style) slams shut around the money stack on Deep Petrol-Sapphire with bold kinetic typography: **`PASSIVE INCOME YA CHAKRAVYUH?`**

---

### ACT 2: THE CAPITAL & LAND HUSTLE (Paisa Kahan Se Aayega?)

#### Beat 4 (`0:46 – 1:04`) — Step 1: The 1,200 Sq.Ft Land Price Shock
- **Hinglish Voiceover**:
  > *"Sabse pehla jhatka lagta hai step number one pe: Zameen. Kisi bhi Tier-1 ya Tier-2 shehar ke IT hub ya college ke paas ek chhota sa baarah-sau square feet ka plot bhi pachaas se sattar lakh se kam ka nahi milta."*
- **Full-Screen Visual (`Full-Viewport 3D Isometric Map Flyover` on `#0B283D`)**:
  - A full-screen 3D tilted city grid (`rotateX(58deg)`) showing an **IT Tech Park / University Hub** at the center with concentric radius rings (`1.5 KM PRIME ZONE`).
  - A `30 ft × 40 ft (1,200 SQ.FT)` glowing golden plot rises out of the map with a massive 3D price pillar: **`₹60,00,000 PLOT COST`**.

#### Beat 5 (`1:04 – 1:22`) — The Home Loan Myth (Weighing Scale Balance Diagram)
- **Hinglish Voiceover**:
  > *"Aur yahan aati hai aam aadmi ki sabse badi galatfehmi. Log sochte hain: 'Home loan le lenge!' Reality ye hai ki banks commercial rental PG ya multi-tenant building ke liye aasaani se home loan nahi dete. Khali plot par aapko tees se chaalis percent down payment apni jeb se dena padta hai."*
- **Full-Screen Visual (`Warm Sketchbook Cream #FAF7F0` — *Paisa Decode* Weighing Scale Diagram!)**:
  - Top Title: `THE BANK LOAN MYTH vs GROUND REALITY`.
  - Center (`960, 580`): A giant monoline ink **Brass Weighing Scale** tipping heavily to the right (`rotate(+18deg)` via `springODE`):
    - Left Pan (High/Light): A tiny paper document stamped in red **`100% HOME LOAN MYTH`**.
    - Right Pan (Heavy/Slammed Down): Giant heavy iron weights labeled **`40% DOWN PAYMENT`**, **`COMMERCIAL INTEREST 11%`**, and **`LAND REGISTRY & STAMP DUTY`**.

#### Beat 6 (`1:22 – 1:35`) — Arranging the First ₹30 Lakh Cash
- **Hinglish Voiceover**:
  > *"Matlab pehle din hi aapko pachis se tees lakh rupaye cash arrange karna padta hai—chahe apni saari FD todo, purani zameen becho, ya rishtedaaron ke aage haath jodo."*
- **Full-Screen Visual (`Warm Studio Cream #FAF8F2`)**:
  - Three large illustrated monoline funding buckets pouring into a central **`₹30,00,000 DAY-1 CASH`** reservoir:
    1. Broken Piggy Bank / FD Certificate (`FD BROKEN: ₹12L`)
    2. Gold / Ancestral Plot Deed (`ASSET SOLD: ₹10L`)
    3. Family / Informal Debt (`FAMILY BORROWING: ₹8L`)

---

### ACT 3: CONSTRUCTION ECONOMICS (Cement, Sariya Aur Thekedaar)

#### Beat 7 (`1:35 – 1:56`) — Full-Screen Three.js 3D G+3 Building Rising (`₹1,800 / Sq.Ft`)
- **Hinglish Voiceover**:
  > *"Ab shuru hota hai asli headache: Construction. Baarah-sau square feet plot par agar aap Ground plus teen floors banate ho, toh lagbhag chaar hazaar square feet ka built-up area banta hai. India me ek decent rental-grade construction ki cost aati hai solah-sau se unnis-sau rupaye per square feet. Yani seedha-seedha pachattar lakh rupaye!"*
- **Full-Screen Visual (`Full-Screen 1920×1080 Three.js 3D Canvas` on `Warm Studio Putty #EFECE6`)**:
  - The **Three.js 3D G+3 Building** stands 800px tall in the center of the screen, rotating smoothly as Foundations $\rightarrow$ Ground Floor $\rightarrow$ Floor 1 $\rightarrow$ Floor 2 $\rightarrow$ Floor 3 extrude upward floor-by-floor!
  - Floating clean kinetic typography (NO border boxes!) beside the 3D floors:
    - **`4,000 SQ.FT BUILT-UP × ₹1,875 / SQ.FT = ₹75,00,000`**

#### Beat 8 (`1:56 – 2:18`) — Giant Cement Bag, Steel Rebars & Municipal Hustle (*Paisa Decode* Giant Props Style!)
- **Hinglish Voiceover**:
  > *"Aur ye tab hai jab thekedaar imaandar ho! Steel ka bhaav pachpan se pachattar rupaye kilo bhaagta hai, cement teen-sau-pachaas se chaar-sau-bees rupaye bori ho jata hai. Upar se municipal approval, borewell, aur commercial transformer ka alag kharcha. Plot aur construction mila ke total investment khadi ho jati hai dedh crore rupaye!"*
- **Full-Screen Visual (`Warm Sketchbook Cream #FAF7F0` — *Paisa Decode* Giant Scaled Props Scene!)**:
  - Just like the giant Milk Bottle & ₹20 Chai Cup frame in *Paisa Decode*:
  - Center: A **giant 600px-tall illustrated Cement Sack (`₹420 / BAG`)** and a **giant bundle of TMT Steel Bars (`₹75 / KG`)** towering over a stressed builder & contractor holding a blueprint.
  - Around them, clean monoline callout arrows point to:
    - `MUNICIPAL & FAR APPROVALS`
    - `BOREWELL & SUBMERSIBLE PUMP`
    - `COMMERCIAL ELECTRIC TRANSFORMER`
  - Bottom bold kinetic slam: **`TOTAL CAPEX: ₹1.50 CRORE`** (with 24-layer 45° volumetric shadow).

---

### ACT 4: THE FLOOR-PLAN SECRET (2BHK vs. 1RK Studio Engineering)

#### Beat 9 (`2:18 – 2:38`) — The Traditional 2BHK Trap (Low 5% Yield)
- **Hinglish Voiceover**:
  > *"Lekin yahan aate hain smart builders ka sabse bada dimaag: Layout Engineering. Agar aap traditional 2BHK flats banate ho, toh chaar floors pe sirf paanch ya chhe families rahengi. Rent milega mushkil se pandrah hazaar per flat—total sirf assi hazaar mahina."*
- **Full-Screen Visual (`Full-Screen Three.js 3D Floor Cutaway — Mode A: 2BHK`)**:
  - Camera pitches up to a top-down 60° isometric view of a single floor slab in Three.js, divided into just **2 large 2BHK flats**.
  - Only 2 rent tags pop up (`₹15,000` + `₹15,000`), and a Newton Balance Lever tips down to a dull slate badge: **`TOTAL: ₹80,000 / MO (LOW 6% YIELD)`**.

#### Beat 10 (`2:38 – 3:02`) — The 1RK Micro-Studio Hack (Double Rental Yield!)
- **Hinglish Voiceover**:
  > *"Par smart builders banate hain Micro-Studios aur 1RK Units! Ek hi floor par chaar compact 1RK rooms—attached bathroom aur kitchen slab ke saath. IT professionals aur students akele rehne ke liye gyarah hazaar khushi-khushi dete hain. Total chaudah units into gyarah hazaar—seedha ek lakh chauvan hazaar mahina! Same building, par rental yield double!"*
- **Full-Screen Visual (`Full-Screen Three.js 3D Exploded 4-Floor Stack — Mode B: 14 × 1RK Studios`)**:
  - A crimson **Capsule Long-Shadow Scanner** sweeps across the 3D floor slab, subdividing it into **4 glowing emerald 1RK Micro-Studios per floor** (complete with 3D mini beds, desks, and washrooms)!
  - All 4 floors explode vertically in 3D space as **14 emerald rent tags (`+₹11,000`)** pop in sequentially with harmonic spring physics, summing to a giant golden banner:
    - **`14 STUDIO UNITS × ₹11,000 = ₹1,54,000 / MONTH!`**

---

### ACT 5: THE GROUND REALITY (EMI, Vacancy Aur Kirayedaar)

#### Beat 11 (`3:02 – 3:24`) — The ₹76,000 Bank EMI Guillotine
- **Hinglish Voiceover**:
  > *"Par rukiye! Ek lakh chauvan hazaar aapka munafa nahi hai. Agar aapne pachattar lakh ka construction loan nau percent interest pe pandrah saal ke liye liya hai, toh har mahine chhihattar hazaar rupaye seedha bank ki EMI me kat jata hai! Bacha sirf athattar hazaar."*
- **Full-Screen Visual (`Soft Matte Graphite #2D3038`)**:
  - A massive full-width horizontal emerald bar representing **`₹1,54,000 GROSS RENT`** stretches across the center of the 1920×1080 screen.
  - A giant crimson mechanical blade (`MinimalElasticBowstringLaunchRig` / diagonal slice physics) slices right through the middle of the bar, dropping **`-₹76,000 BANK LOAN EMI (49%)`** down into a bank vault icon, leaving **`₹78,000 REMAINING`**.

#### Beat 12 (`3:24 – 3:48`) — Vacancy, Plumbing Leaks & Landlord Headaches
- **Hinglish Voiceover**:
  > *"Ab isme se minus kijiye: ten percent Vacancy Loss—kyunki har do mahine me koi kirayedaar room chhod ke jayega aur bees din room khali rahega. Upar se plumbing leak, har saal whitewash painting, lift maintenance, aur municipal property tax! Saare kharche kaatne ke baad aapke haath me bachta hai sirf pachaas hazaar rupaye cash in hand!"*
- **Full-Screen Visual (`Warm Sketchbook Cream #FAF7F0` — *Paisa Decode* Operational Deductions Scene)**:
  - Three animated monoline illustration vignettes pop across the canvas, each biting a chunk out of the remaining bar:
    1. **Vacancy Calendar (`-₹15,000`)**: Room door with `"TO-LET / VACANT 20 DAYS"` sign hanging on it.
    2. **Maintenance & Repairs (`-₹10,000`)**: Leaking pipe wrench + paint roller + lift gear.
    3. **Property Tax & Common Electricity (`-₹3,000`)**: Municipal bill receipt.
  - Final glowing emerald pillar at center: **`NET IN-HAND CASH: ₹50,000 / MONTH`**.

---

### ACT 6: THE 12-YEAR WEALTH VERDICT (Tenants Buy Your Building!)

#### Beat 13 (`3:48 – 4:12`) — The 12-Year Debt-Free Compounding Secret
- **Hinglish Voiceover**:
  > *"Toh kya rental building ka dhandha bekaar hai? Bilkul nahi! Pehle das saal ye aapko ameer nahi banata, lekin is dhandhe ka asli jaadu ye hai ki aapki dedh crore ki building ki saari EMI aapke kirayedaar bhar rahe hote hain! Aur baarah saal baad jab loan khatam hota hai, toh aapke paas teen crore ki debt-free property hoti hai, aur har mahine do lakh se zyada ka pure profit!"*
- **Full-Screen Visual (`Deep Petrol-Sapphire #123E5C -> #061826`)**:
  - A full-screen dual-curve mathematical trajectory graph (`Year 1` to `Year 12`) with a glowing 3D gold sphere rolling along the spline:
    - **Red Curve (Bank Loan Debt)**: Starts at `₹75 Lakh` in Year 1 and plunges to **`₹0 DEBT`** in Year 12 (paid off by tenants!).
    - **Gold Curve (Property Value + Net Rent)**: Compounding upward with 6% annual rent escalation and land appreciation to **`₹3.00 CRORE ASSET + ₹2.2 LAKH/MO PURE PROFIT`**.

#### Beat 14 (`4:12 – 4:28`) — Final Summary & Channel Outro CTA
- **Hinglish Voiceover**:
  > *"Ye koi raato-raat ameer banne wali scheme nahi, balki patience aur ground-level hustle ka das-saal ka game hai. Agli baar aap kounse business ki unit economics decode karwana chahte hain? Comment karke zaroor batayein, aur The Rabbit Files ko subscribe karein!"*
- **Full-Screen Visual (`Warm Studio Putty #EFECE6`)**:
  - Centered 3D isometric golden apartment building trophy rotating gently at `(960, 440)`.
  - Bold 45° volumetric long-shadow headline:
    - **`THE 10-YEAR PATIENCE GAME`**
    - **`SUBSCRIBE TO THE RABBIT FILES · @rabbitfiles16`**
  - Prompt pill at bottom: **`COMMENT THE NEXT BUSINESS TO DECODE ↓`**.

---

## 5. REQUIRED `image-rq.md` FILE (AUTO-GENERATE THIS FILE IN REPO ROOT)

Write a complete `image-rq.md` file containing these exact *Paisa Decode* style prompts so any external image generator (or Gemini Imagen 3) can produce the transparent/cream-paper illustrations:

1. `public/assets/illustrations/beat1_morning_alarm.png` — *"2D editorial monoline vector illustration in Paisa Decode style on flat warm cream paper (#FAF7F0). A tired young Indian office worker waking up in bed at 8:00 AM with a ringing alarm clock and traffic jam outside the window. Clean 2.5px black ink outlines, flat cel-shaded tangerine orange (#FF7A29) and slate gray."*
2. `public/assets/illustrations/beat2_building_scale_stack.png` — *"2D editorial business infographic in Paisa Decode / Think School style on flat warm cream paper (#FAF7F0). Left side: An Indian landlord standing beside a 4-story apartment building with a sign '1 ROOM = ₹12,000'. Middle: A curved black hand-drawn arrow pointing right. Right side: Three tall stacked columns of 12 apartment room blocks topped with an orange banner '12 ROOMS', a spiral desk calendar showing 'EVERY 1ST', and a tilted calculator showing '12 x 12,000 = 1.44L'."*
3. `public/assets/illustrations/beat5_loan_weighing_scale.png` — *"2D editorial vector illustration on warm cream paper (#FAF7F0). A large brass weighing scale in the center tipping heavily to the right. Left pan holds a light paper labeled 'HOME LOAN MYTH'. Right pan is weighed down by heavy iron blocks labeled '40% DOWN PAYMENT', 'COMMERCIAL RATE', and 'LAND REGISTRY'. Clean black monoline ink."*
4. `public/assets/illustrations/beat8_giant_cement_steel.png` — *"2D editorial business illustration in Paisa Decode style on warm cream paper (#FAF7F0). A giant oversized cement bag labeled '₹420/BAG' and a giant bundle of TMT steel rebars labeled '₹75/KG' towering in the center beside a stressed Indian builder and contractor holding a blueprint. Clean black ink outlines, flat tangerine and slate colors."*
5. `public/assets/illustrations/beat12_landlord_headaches.png` — *"2D editorial vector illustration on warm cream paper (#FAF7F0). Three clean vignettes showing landlord expenses: (1) an empty room door with a 'TO-LET / VACANT' board, (2) a leaking bathroom pipe with a wrench and paint roller, (3) a municipal property tax bill. Crisp black monoline ink."*

---

## 6. END-TO-END DELIVERABLES CHECKLIST

1. `image-rq.md`: Complete prompt specification file for all 2D illustrations.
2. `scripts/generate_hindi_tts.py`: Script that uses `SARVAM_API_KEY` to generate the 14 Hinglish audio chapters, builds `public/audio/word_map.json`, mixes the Option 3 116 BPM ambient score (`-18 dB` voice sidechain ducking), and normalizes loudness to `-14 LUFS`.
3. `src/components/rental/RentalBuilding3DStage.tsx`: Full-screen `1920×1080` Three.js PBR procedural 4-story building with animated floor construction, 2BHK vs 1RK interior room cutaways, and exploding floor slabs.
4. `src/components/rental/RentalBeats1To14.tsx`: All 14 full-screen narrative scenes (zero dashboard card clutter, zero top/bottom HUD bars, full-stage SVG + Three.js + mathematical physics).
5. `render_rental_documentary.py`: 6-worker headless Playwright 1080p30 frame renderer muxing to `rental_building_documentary_masterpiece.mp4`.
