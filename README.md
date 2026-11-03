# Ricks Clips (`@RicksClips3000`) — Next.js 3D/2.5D Shorts Engine & Google AI Studio Mathematical Skill

A deterministic **Next.js + React Three Fiber (Three.js)** animation studio and **Google AI Studio mathematical skill package** that reverse-engineers and reproduces `@RicksClips3000`-style viral 9:16 YouTube Shorts frame by frame (`300 frames @ 30 FPS`).

---

## What's Included

1. **Interactive Next.js 3D + 2.5D Shorts Studio (`src/`)**:
   - [`src/lib/timeline-data.ts`](./src/lib/timeline-data.ts): Complete 300-frame (`10.00s @ 30 FPS`) deterministic keyframe & rig state evaluator (`getFrameTelemetry(frame)`).
   - [`src/components/RicksCharacter25D.tsx`](./src/components/RicksCharacter25D.tsx): 2.5D cylindrical-billboard cartoon character rig with procedural HTML5 Canvas head/torso textures (`#231F20` thick outlines, boolean cel-shading crescent, 8 eye states, 6 lip-sync visemes) and 3D rubber-hose limbs.
   - [`src/components/CanyonRailroadScene3D.tsx`](./src/components/CanyonRailroadScene3D.tsx): Full 3D stylized environment across all 5 camera beats.
   - [`src/lib/web-audio-sfx.ts`](./src/lib/web-audio-sfx.ts): Real-time Web Audio API procedural foley synthesizer.
   - [`src/app/page.tsx`](./src/app/page.tsx): Interactive frame-by-frame scrubber (`-1f` / `+1f`), live 3D WebGL viewport, rendered `.mp4` player, and side-by-side reference comparison.

2. **Google AI Studio Mathematical Animation Skill (`skills/ricks-clips-animator/`)**:
   - [`skills/ricks-clips-animator/SKILL.md`](./skills/ricks-clips-animator/SKILL.md): Core mathematical laws & runbook.
   - [`skills/ricks-clips-animator/GOOGLE_AI_STUDIO_SYSTEM_PROMPT.md`](./skills/ricks-clips-animator/GOOGLE_AI_STUDIO_SYSTEM_PROMPT.md): Ready-to-paste System Instruction for Google AI Studio.
   - [`skills/ricks-clips-animator/references/01-character-anatomy-and-ik-math.md`](./skills/ricks-clips-animator/references/01-character-anatomy-and-ik-math.md): Exact character proportions, facial vectors, and 2-bone analytical Inverse Kinematics (Law of Cosines).
   - [`skills/ricks-clips-animator/references/02-camera-choreography-and-projection-math.md`](./skills/ricks-clips-animator/references/02-camera-choreography-and-projection-math.md): The 6 signature camera trajectory equations & $4\times 4$ perspective projection matrix.
   - [`skills/ricks-clips-animator/references/03-typography-audio-and-shader-math.md`](./skills/ricks-clips-animator/references/03-typography-audio-and-shader-math.md): Underdamped spring caption bounce, 3-band Toon & thermal expansion shaders, and Doppler foley synthesis.
   - [`skills/ricks-clips-animator/examples/`](./skills/ricks-clips-animator/examples/): Complete 300-frame mathematical scripts for *Why Perfect Railroads Don't Work*, *Levels of Pirate Cannonballs*, and *The Ancient Jar That Warned an Empire*, plus a single-file Google AI Studio starter (`google-ai-studio-single-file-starter.html`).
   - [`skills/ricks-clips-animator/scripts/validate_scene_math.py`](./skills/ricks-clips-animator/scripts/validate_scene_math.py): Automated mathematical invariant verifier.

3. **Rendered 10-Second Example Videos (`public/`)**:
   - [`public/ricks-clips-10s-example.mp4`](./public/ricks-clips-10s-example.mp4): 300-frame (`10.00s @ 30 FPS`, `720x1280`) code-rendered example video.
   - [`public/side-by-side-10s-comparison.mp4`](./public/side-by-side-10s-comparison.mp4): Frame-locked comparison against `@RicksClips3000`.

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to launch the interactive Frame-by-Frame Studio.

To re-render the 300-frame MP4 video deterministically from Python + FFmpeg:

```bash
python scripts/render_10s_video.py
```

To run the mathematical scene auditor:

```bash
python skills/ricks-clips-animator/scripts/validate_scene_math.py
```
