# NEW PROJECT PROMPT — "HOW AI ACTUALLY WORKS" (MATH + MOTION GRAPHICS DOCUMENTARY)
## Google AI Studio / Node 2 Agent · The Rabbit Files (@rabbitfiles16)
## Narration language: English (documentary tone). Duration target: ~4:30. Canvas: 1920x1080, 30 FPS.

---

## 0. STEP ZERO — WIPE EVERYTHING FIRST

**Delete and ignore ALL previous work in this chat and repo**: the rental-building project, every dashboard layout, every card/box component, every "ACT 01 / 06" header, every bordered subtitle pill, every earlier script. Start from an empty `src/components/` folder. Do not reuse any earlier layout. This video is about **how AI works** and nothing else.

---

## 1. WHAT THIS VIDEO MUST FEEL LIKE

Exactly like our **Zomato / Blinkit documentaries**: one big cinematic scene at a time, driven by real mathematics, voice-synced, with physical motion-graphics rigs. NOT a slide deck, NOT a dashboard, NOT a web page.

### Hard bans (if you violate any, the video is rejected)
1. **No cards, no bordered containers, no multi-column box layouts.** Never put content inside `border-*` / `rounded-3xl` boxes. Each scene is ONE open 1920x1080 canvas with one focal object near `(960, 540)`.
2. **No persistent UI chrome**: no top header bar, no act counter, no telemetry text, no boxed subtitle. Subtitles = 3-5 borderless bold words floating at `Y = 980`.
3. **No pure black** (`#000000`, `bg-black`). Use only: Warm Studio Putty `#EFECE6 -> #CDC9BF`, Warm Cream `#FAF8F2 -> #D8D0C0`, Deep Petrol-Sapphire `#134263 -> #061826`, Soft Graphite `#2D3038 -> #1A1C22`. Accents: Ink `#18181B`, Gold `#F8CB46`, Crimson `#E23744`, Cyan `#38BDF8`.
4. **Every frame is a pure function of time**: `Frame(t) = f(t)` via `window.__setDocTime(t)` + `flushSync`. No CSS transitions/animations, no `setTimeout`, no `Math.random()` (use a seeded PRNG).
5. **Tailwind v4**: never combine `-translate-x-1/2 -translate-y-1/2` classes with `style={{ transform: 'translate(-50%,-50%)' }}`.
6. **Do not spam rigs.** One focal rig per scene, chosen because the concept demands it. Lots of negative space.
7. **Scene changes must wipe the whole canvas** (iris wipe, capsule long-shadow scanner, diagonal razor slice, split-world wipe, liquid curtain).

### Style references
Motion Nations + Ordinary Folk minimalism (geometric primitives, 45-degree volumetric long shadows, springs, pendulums, splines) combined with Vox-style explanatory diagrams. Reuse our repo: https://github.com/Flaxa-Technologies/ricks-clips-nextjs-studio (`src/lib/kinematics.ts`, `FeaturedTransitionsVol3Heavy.tsx`, `FeaturedTransitionsVol4Minimal.tsx`).

---

## 2. MATH ENGINE (use these exactly)

```ts
export const clamp = (v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const lerp = (a:number,b:number,t:number)=>a+(b-a)*t;

// Damped spring: x'' + 2*zeta*w0*x' + w0^2*(x-1) = 0
export function springODE(dt:number, w0=18, zeta=0.68, v0=0){
  if(dt<=0) return {value:0, velocity:v0};
  if(zeta<1){
    const wd=w0*Math.sqrt(1-zeta*zeta), env=Math.exp(-zeta*w0*dt), B=(zeta*w0-v0)/wd;
    const c=Math.cos(wd*dt), s=Math.sin(wd*dt);
    return {value:1-env*(c+B*s), velocity:env*((zeta*w0-B*wd)*c+(wd+zeta*w0*B)*s)};
  }
  const env=Math.exp(-w0*dt);
  return {value:1-env*(1+(w0-v0)*dt), velocity:env*w0*(w0-v0)*dt};
}

// Newton-Raphson cubic-bezier easing
export function cubicBezier(t:number,x1:number,y1:number,x2:number,y2:number){
  const x=clamp(t); if(x===0||x===1) return x; let u=x;
  for(let i=0;i<8;i++){const k=1-u;
    const bx=3*k*k*u*x1+3*k*u*u*x2+u*u*u-x; if(Math.abs(bx)<1e-6) break;
    const d=3*k*k*x1+6*k*u*(x2-x1)+3*u*u*(1-x2); if(Math.abs(d)<1e-6) break; u=clamp(u-bx/d);}
  const k=1-u; return 3*k*k*u*y1+3*k*u*u*y2+u*u*u;
}
export const AE_SNAP=(t:number)=>cubicBezier(t,.16,1,.3,1);
export const AE_DRAMATIC=(t:number)=>cubicBezier(t,.85,0,.15,1);

// Seeded PRNG (deterministic "randomness")
export const mulberry32=(a:number)=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};

export const LONG_SHADOW=Array.from({length:24},(_,i)=>
  `${i+1}px ${i+1}px 0 rgba(24,24,27,${(0.18*(1-i/24)).toFixed(3)})`).join(", ");
```

**The visuals must compute the REAL math live, from `t`** (not pre-baked fake numbers): actual forward passes, actual gradient-descent steps, actual softmax values. Whatever number is on screen must be what the code computes.

---

## 3. THE SCRIPT (LOCKED, ENGLISH) AND SCENE-BY-SCENE VISUALS

Generate voiceover with Sarvam AI TTS (`en-IN`, natural documentary male voice, pace ~1.0) using the user's `SARVAM_API_KEY`, one WAV per beat, concatenate, extract word timestamps into `public/audio/word_map.json` (`g`, `loc`, `dur`). Every scene change and every number reveal locks to the spoken word. Mix a 116 BPM ambient-momentum bed ducked -18 dB under the voice, then `loudnorm=I=-14:TP=-1.0:LRA=7` so the voice is loud.

### Beat 1 — Hook (0:00-0:20) · Putty -> iris to Sapphire
**VO:** "You type a question. Two seconds later, a machine writes an answer that sounds like a person. Nobody programmed that answer. So what is actually happening inside? It turns out the whole thing is just arithmetic, repeated billions of times."
**Visual:** A single gold sphere drops along a spline, laser-unmasks giant type `NOBODY PROGRAMMED THE ANSWER`, then an iris wipe into the next scene. Final word `ARITHMETIC` slams in with a 24-layer long shadow.

### Beat 2 — Old programming vs learning (0:20-0:45) · Cream
**VO:** "Traditional software is a list of rules written by humans. If this, then that. But nobody can write the rules for recognising a cat, or understanding a joke. So we flipped the idea. Instead of writing the rules, we show the machine examples and let it find the rules itself."
**Visual:** Left a hand-drawn rulebook of if/else lines; it crumples and a Newton's-Cradle-style chain of example dots (cat photos as simple geometric glyphs) swings in and "teaches" a central function box. Bauhaus see-saw tips from `RULES` to `EXAMPLES`.

### Beat 3 — A number is all a computer sees (0:45-1:10) · Sapphire
**VO:** "A computer cannot see a picture. It sees numbers. Every pixel is a brightness value between zero and one. A tiny handwritten digit is just a grid of numbers. Every input to an AI, a photo, a sound, a sentence, must first become a list of numbers."
**Visual:** A 12x12 pixel digit "7" built as a magnetic pill grid (like `MinimalMagneticGridRepulsionRig`); the pills' brightness values flip to numbers (0.00-1.00), then flatten into a vertical vector that slides to center.

### Beat 4 — The artificial neuron (1:10-1:45) · Putty
**VO:** "Here is the smallest building block, the neuron. It takes inputs, multiplies each by a weight, adds them up, adds a bias, then squashes the result through a function so the output is a smooth number between zero and one. That is it. Weights decide what matters. Learning means finding the right weights."
**Visual:** Full-screen single neuron. Inputs x1..x3 as spheres on the left, weighted lines whose thickness = |w| (positive gold, negative crimson), sum node, sigmoid curve drawn live with a dot riding it. Show live math: `y = sigmoid( w1*x1 + w2*x2 + w3*x3 + b )` with the real computed numbers updating as weights oscillate via springs. No boxes, just floating typography.

### Beat 5 — Layers and the network (1:45-2:15) · Sapphire
**VO:** "One neuron is weak. But stack thousands in layers, and feed each layer's output into the next, and something remarkable appears. Early layers detect edges. Middle layers combine edges into shapes. Later layers recognise whole objects. Nobody told them to specialise. They found it themselves."
**Visual:** A full-screen layered network (4 layers, ~40 nodes) with pulses travelling along weighted edges (real forward pass on the digit vector). Camera dollies in 3D; edge/shape/object glyphs fade in above layers 1/2/3 as the pulse reaches them. Use depth-sorted 3D (z<0 behind, z>=0 in front).

### Beat 6 — Loss: measuring how wrong (2:15-2:40) · Cream
**VO:** "At the start, the weights are random, so the answers are garbage. To improve, the machine needs a score for how wrong it is. We call it the loss. Predict seven when the answer is one, big loss. Get it right, loss near zero. Learning is simply the quest to push this number down."
**Visual:** A weighing scale with PREDICTION vs TRUTH; the tilt angle equals the real computed loss `L = (y - y_true)^2`. A large live number `LOSS 0.81` that will later fall.

### Beat 7 — Gradient descent (2:40-3:20) · Sapphire
**VO:** "How do we reduce the loss? Imagine standing on a foggy mountain, wanting to reach the valley. You cannot see the bottom, but you can feel which way the ground slopes under your feet. So you take a small step downhill. Then again. In maths, the slope is the gradient, and the rule is: new weight equals old weight minus a small learning rate times the gradient."
**Visual (hero scene):** Deforming-Gaussian-wave-style loss landscape (`MinimalDeformingWaveBallRig`) drawn as a real 2D loss curve `L(w)`; a white sphere does ACTUAL gradient descent `w <- w - eta * dL/dw` step by step (eta visible), leaving a trail. Show too-big eta overshooting (sphere bounces wildly) then a good eta converging, then the live formula `w_new = w_old - eta * dL/dw` with real numbers. Loss counter falls.

### Beat 8 — Backpropagation (3:20-3:45) · Putty
**VO:** "But a network has millions of weights. Which one deserves the blame? Backpropagation answers that using the chain rule from calculus. The error flows backward through the network, and each weight learns how much it contributed. Then every weight nudges itself in the right direction, all at once."
**Visual:** Reuse the Beat 5 network; now a crimson error pulse travels RIGHT-to-LEFT along the same edges (edge colour/thickness updates to the real gradient magnitudes), then all weights spring-adjust simultaneously. Show `dL/dw = dL/dy * dy/dz * dz/dw` writing itself on.

### Beat 9 — Scale: show it a billion examples (3:45-4:00) · Graphite -> Cream
**VO:** "Repeat this loop, guess, measure the error, nudge the weights, not ten times, but trillions of times, across a mountain of text. The loss slowly melts away."
**Visual:** Concentric vault-ring dial spins faster and faster; a long loss-vs-steps curve draws left to right across the full screen, dropping and flattening. A giant counter ticks `STEPS: 1,000 ... 1,000,000 ... 1,000,000,000`.

### Beat 10 — How ChatGPT-style models read: tokens & embeddings (4:00-4:25) · Sapphire
**VO:** "Language models do not read words. They cut text into pieces called tokens, and turn each token into a long list of numbers called an embedding. And here is the magic: words with similar meanings land near each other in this space. King sits near queen. Paris sits near France."
**Visual:** A sentence shatters into token chips that fly into a full-screen 3D point cloud (PCA-style 3D scatter, camera orbit). Clusters light up; an arrow `king - man + woman` lands on `queen` (precomputed 3D coordinates chosen so the vector arithmetic is geometrically true on screen).

### Beat 11 — Attention and next-word prediction (4:25-5:05) · Putty
**VO:** "Now the key trick: attention. For every word, the model asks, which other words matter for understanding me? In the sentence 'The animal did not cross the street because it was tired,' attention links 'it' to 'animal', not 'street'. Finally, the model does one simple thing: it predicts a probability for every possible next word, picks one, adds it to the text, and repeats. That is all a chatbot is doing, one word at a time."
**Visual:** The sentence floats center; thick spline arcs connect "it" to every word with thickness = real softmax attention weights, "animal" glowing brightest (`softmax(QK^T/sqrt(d))`). Then a vertical bar chart of next-word probabilities (`tired 61%, hungry 14% ...`) built from a real softmax; a temperature slider spring-animates and the bars flatten/sharpen live; the chosen word flies into the sentence.

### Beat 12 — Honest limits and outro (5:05-5:30) · Sapphire -> Putty
**VO:** "So does it understand? It does not think like you. It finds patterns in numbers, and sometimes the pattern sounds confident and is simply wrong. That is why checking facts still matters. AI is not magic and it is not a mind. It is mathematics, scaled up beyond anything we have built before. If you want the next topic broken down like this, tell us in the comments, and subscribe to The Rabbit Files."
**Visual:** Elastic bowstring launch of the gold sphere reveals the closing line `NOT MAGIC. NOT A MIND. MATHEMATICS AT SCALE.` with 45-degree long shadow, then a centered subscribe card (`@rabbitfiles16`).

---

## 4. TECHNICAL ACCURACY RULES
- Every equation shown must match what is computed on screen. No decorative fake numbers.
- Do not state invented statistics. Use general phrasing ("billions", "trillions of steps"). Do not claim exact parameter counts, costs, or dates.
- Keep explanations correct: neurons use weighted sum + bias + nonlinearity; training minimises loss with gradient descent via backpropagation; LLMs predict the next token from a softmax over the vocabulary.

---

## 5. ILLUSTRATIONS, 3D, AND FILES
- Draw everything with code (SVG + Three.js primitives). If any illustration needs an external image, write `image-rq.md` with detailed prompts instead of faking it with CSS boxes.
- Three.js is required for Beats 5, 8 and 10 (3D network and 3D embedding cloud). Procedural geometry only.
- Deliverables: `src/lib/kinematics.ts`, `src/components/ai/Beats01To12.tsx` (12 distinct full-screen scenes), `src/components/ai/Network3D.tsx`, `scripts/generate_tts.py`, `render_ai_documentary.py` (6 parallel Playwright workers, 1080p30, ffmpeg `-crf 16`, AAC 256k) producing `how_ai_works_documentary.mp4`.
- After rendering, extract a 4x4 contact sheet and verify: no boxes, no header bars, no black backgrounds, every scene fills the canvas. Fix before delivering.
