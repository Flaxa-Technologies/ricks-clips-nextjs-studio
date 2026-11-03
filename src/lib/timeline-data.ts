export interface SubtitleSegment {
  id: number;
  text: string;
  startFrame: number;
  endFrame: number;
  emphasis?: boolean;
}

export interface BeatDefinition {
  id: number;
  name: string;
  shortLabel: string;
  startFrame: number;
  endFrame: number;
  cameraTechnique: string;
  retentionPurpose: string;
  sceneDescription: string;
  shaderNotes: string;
}

export interface FrameCameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  roll: number;
  motionBlurStrength: number;
  crossfadeAlpha: number;
}

export interface CharacterRigState {
  characterId: 'engineer' | 'plank_worker' | 'tycoon';
  position: [number, number, number];
  rotationY: number;
  headPitch: number;
  headTilt: number;
  browAngle: number; // positive = angry/focused, negative = worried/sad
  eyeState: 'smug' | 'normal' | 'squint' | 'wide_down' | 'wink';
  mouthState: 'closed_smirk' | 'talk_open' | 'talk_wide' | 'o_gasp' | 'grin';
  sawStrokePhase: number; // -1 to 1
  walkCyclePhase: number;
  bodyLean: number;
  propType: 'hacksaw' | 'none' | 'mug' | 'cane_money';
}

export interface FrameTelemetry {
  frame: number;
  timeSeconds: number;
  beat: BeatDefinition;
  activeSubtitle: SubtitleSegment | null;
  subtitleScale: number;
  camera: FrameCameraState;
  character: CharacterRigState;
  trainZ: number;
  sparkIntensity: number;
  audioCues: string[];
  frameLesson: string;
}

export const FPS = 30;
export const TOTAL_FRAMES = 300; // 10.00 seconds @ 30fps

export const BEATS: BeatDefinition[] = [
  {
    id: 1,
    name: 'Beat 1: The Visual Paradox Hook',
    shortLabel: '1. Sawing Hook (0.0–2.0s)',
    startFrame: 0,
    endFrame: 59,
    cameraTechnique: 'Low-angle rail-level dolly push-in (Z: 4.2 → 2.4, Y: 0.42)',
    retentionPurpose:
      'Opens in media res with a visual contradiction: an engineer calmly sawing gaps into his own railroad track while a steam locomotive barrels toward him.',
    sceneDescription:
      'Red rock canyon tunnel entrance. 3D gravel ballast, wooden sleepers, steel rails with a physical gap at Z=1.2. 2.5D rigged Engineer sawing rail with metallic sparks.',
    shaderNotes:
      '3-band Toon shading on canyon walls + #231F20 inverted-hull/ink outlines on character + additive point light on locomotive headlamp.',
  },
  {
    id: 2,
    name: 'Beat 2: 180° Canyon Orbit & Locomotive Pass',
    shortLabel: '2. 180° Orbit & Train (2.0–4.0s)',
    startFrame: 60,
    endFrame: 119,
    cameraTechnique: 'Fast 180° orbital whip-pan around subject + foreground train wipe',
    retentionPurpose:
      'Prevents visual stagnation at the 2-second mark by rotating 180° from dark tunnel to bright canyon cliff, punctuated by the locomotive roaring past the lens.',
    sceneDescription:
      'Camera swings around the Engineer against bright orange-red stratified rock walls, revealing the blue canyon drop-off on the left just as the train rushes past.',
    shaderNotes:
      'Directional sun rim-light highlights the 2D character silhouette against the 3D cliff face; radial velocity blur during train pass (f100–112).',
  },
  {
    id: 3,
    name: 'Beat 3: The Abyss Crane Pullback',
    shortLabel: '3. Abyss Pullback (4.0–6.0s)',
    startFrame: 120,
    endFrame: 179,
    cameraTechnique: 'High-altitude exponential drone pullback over canyon void',
    retentionPurpose:
      'Establishes massive physical stakes ("racing to build a railroad") by dwarfing the characters against a bottomless cobalt-blue canyon with two rival bridges.',
    sceneDescription:
      'Two competing steel bridges jut out from stratified red canyon walls over a deep blue fogged abyss. Twin-arch bridge in distance; tall steel trestle in foreground.',
    shaderNotes:
      'Exponential height fog (#0c2d9e → #1d4ed8) creates infinite depth in the canyon chasm without expensive geometry.',
  },
  {
    id: 4,
    name: 'Beat 4: Precarious Plank & Vertigo Dive',
    shortLabel: '4. Plank Vertigo (6.0–8.3s)',
    startFrame: 180,
    endFrame: 249,
    cameraTechnique: 'Crane descent to wooden beam + 90° downward vertigo tilt',
    retentionPurpose:
      'Visualizes "so deep you can\'t see the bottom" literally—putting a tiny 2D worker on a narrow wooden beam peering straight down before diving into the abyss.',
    sceneDescription:
      'Foreground trestle wooden deck with rotating derrick crane. At f218, close-up on lone worker at tip of wooden plank looking straight down into the blue void.',
    shaderNotes:
      '6-frame cross-dissolve at f216–222 smooths the jump from wide crane shot to tight plank shot; vertical streak lines enhance downward camera dive at f240.',
  },
  {
    id: 5,
    name: 'Beat 5: Supersonic Desert Fly-In & Tycoon Payoff',
    shortLabel: '5. Desert Rush & Payoff (8.3–10.0s)',
    startFrame: 250,
    endFrame: 300,
    cameraTechnique: 'Vertical cliff cresting + high-FOV supersonic dolly zoom to Union Station',
    retentionPurpose:
      'Transitions from physical danger to financial reward ("whoever finishes first gets the whole country\'s business") with kinetic forward momentum.',
    sceneDescription:
      'Camera rockets up the canyon wall onto the orange desert mesa, hurtling down the tracks into the grand station where the Top-Hat Tycoon stands beside gold money bags.',
    shaderNotes:
      'FOV widens to 68° during desert rush (f265–285) for speed sensation, then snaps to 42° portrait framing on the Tycoon & "FIRST LINE IN GETS IT ALL!" banner.',
  },
];

export const SUBTITLES: SubtitleSegment[] = [
  { id: 1, text: 'He sawed', startFrame: 0, endFrame: 11 },
  { id: 2, text: 'gaps', startFrame: 12, endFrame: 26, emphasis: true },
  { id: 3, text: 'into a', startFrame: 27, endFrame: 37 },
  { id: 4, text: 'railroad', startFrame: 38, endFrame: 50, emphasis: true },
  { id: 5, text: 'every 39', startFrame: 51, endFrame: 76, emphasis: true },
  { id: 6, text: 'feet.', startFrame: 77, endFrame: 96 },
  { id: 7, text: 'You', startFrame: 97, endFrame: 102 },
  { id: 8, text: 'see,', startFrame: 103, endFrame: 111 },
  { id: 9, text: 'two', startFrame: 112, endFrame: 120 },
  { id: 10, text: 'companies', startFrame: 121, endFrame: 132, emphasis: true },
  { id: 11, text: 'are', startFrame: 133, endFrame: 140 },
  { id: 12, text: 'racing', startFrame: 141, endFrame: 151, emphasis: true },
  { id: 13, text: 'to', startFrame: 152, endFrame: 156 },
  { id: 14, text: 'build', startFrame: 157, endFrame: 164 },
  { id: 15, text: 'a', startFrame: 165, endFrame: 168 },
  { id: 16, text: 'railroad', startFrame: 169, endFrame: 181, emphasis: true },
  { id: 17, text: 'along', startFrame: 182, endFrame: 191 },
  { id: 18, text: 'a canyon', startFrame: 192, endFrame: 204, emphasis: true },
  { id: 19, text: 'so deep', startFrame: 205, endFrame: 219, emphasis: true },
  { id: 20, text: 'you', startFrame: 220, endFrame: 226 },
  { id: 21, text: "can't", startFrame: 227, endFrame: 233 },
  { id: 22, text: 'see the', startFrame: 234, endFrame: 241 },
  { id: 23, text: 'bottom.', startFrame: 242, endFrame: 253, emphasis: true },
  { id: 24, text: 'And', startFrame: 254, endFrame: 261 },
  { id: 25, text: 'whoever', startFrame: 262, endFrame: 272 },
  { id: 26, text: 'finishes', startFrame: 273, endFrame: 283 },
  { id: 27, text: 'first', startFrame: 284, endFrame: 292, emphasis: true },
  { id: 28, text: 'gets it all!', startFrame: 293, endFrame: 300, emphasis: true },
];

function lerp(a: number, b: number, t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return a + (b - a) * clamped;
}

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export function getFrameTelemetry(rawFrame: number): FrameTelemetry {
  const frame = Math.max(0, Math.min(TOTAL_FRAMES, Math.round(rawFrame)));
  const timeSeconds = Number((frame / FPS).toFixed(3));

  const beat =
    BEATS.find((b) => frame >= b.startFrame && frame <= b.endFrame) || BEATS[BEATS.length - 1];

  const activeSubtitle =
    SUBTITLES.find((s) => frame >= s.startFrame && frame <= s.endFrame) || null;

  // Pop-in scale curve on every new subtitle word (1.0 -> 1.14 -> 1.0 over first 5 frames)
  let subtitleScale = 1.0;
  if (activeSubtitle) {
    const localF = frame - activeSubtitle.startFrame;
    if (localF <= 2) {
      subtitleScale = lerp(0.86, 1.12, localF / 2);
    } else if (localF <= 5) {
      subtitleScale = lerp(1.12, 1.0, (localF - 2) / 3);
    }
  }

  let camera: FrameCameraState = {
    position: [0.35, 0.48, 3.8],
    target: [-0.2, 0.65, -4.0],
    fov: 48,
    roll: 0,
    motionBlurStrength: 0,
    crossfadeAlpha: 0,
  };

  let character: CharacterRigState = {
    characterId: 'engineer',
    position: [-0.55, 0.0, 1.2],
    rotationY: 0.18,
    headPitch: 0.12,
    headTilt: -0.08,
    browAngle: 0.25,
    eyeState: 'smug',
    mouthState: frame % 6 < 3 ? 'talk_open' : 'closed_smirk',
    sawStrokePhase: Math.sin(frame * 0.55),
    walkCyclePhase: 0,
    bodyLean: 0.38,
    propType: 'hacksaw',
  };

  let trainZ = -18;
  let sparkIntensity = 0;
  const audioCues: string[] = [];
  let frameLesson = '';

  if (frame < 60) {
    // BEAT 1: Low-angle sawing hook (Frames 0-59)
    const t = smoothstep(frame / 59);
    camera = {
      position: [lerp(0.42, 0.28, t), lerp(0.42, 0.52, t), lerp(3.85, 2.35, t)],
      target: [lerp(-0.25, -0.38, t), lerp(0.62, 0.78, t), -6.0],
      fov: lerp(50, 44, t),
      roll: lerp(-0.02, 0.01, t),
      motionBlurStrength: 0.05,
      crossfadeAlpha: 0,
    };
    const sawWave = Math.sin(frame * 0.65);
    sparkIntensity = sawWave > 0.2 ? (sawWave - 0.2) * 1.25 : 0;
    trainZ = lerp(-19.0, -9.5, frame / 59);

    character = {
      characterId: 'engineer',
      position: [-0.52, 0.0, 1.2],
      rotationY: 0.22,
      headPitch: 0.15 + sawWave * 0.04,
      headTilt: -0.1,
      browAngle: 0.28,
      eyeState: frame > 42 ? 'smug' : 'normal',
      mouthState: frame % 5 < 3 ? 'talk_open' : 'closed_smirk',
      sawStrokePhase: sawWave,
      walkCyclePhase: 0,
      bodyLean: 0.42 + sawWave * 0.08,
      propType: 'hacksaw',
    };

    audioCues.push('VO: "He sawed gaps into a railroad every 39..."');
    if (sparkIntensity > 0.2) audioCues.push('SFX: Metallic hacksaw stroke (2.4kHz scrape)');
    audioCues.push('SFX: Distant steam locomotive chug + low rumble');
    frameLesson =
      'Low camera height (Y=0.45m) places the viewer directly on the steel rail. The 2.5D character leans over the 3D rail while the oncoming 3D train creates immediate depth tension.';
  } else if (frame < 120) {
    // BEAT 2: 180-degree orbit around Engineer + Train pass (Frames 60-119)
    const localF = frame - 60;
    const t = smoothstep(localF / 59);
    // Orbit angle swings from +0.2 rad (front) around to +3.05 rad (looking down canyon track)
    const orbitAngle = lerp(0.35, 2.95, smoothstep(Math.min(1, localF / 32)));
    const radius = lerp(2.2, 2.8, t);
    const charZ = lerp(1.2, 2.6, Math.max(0, (localF - 20) / 39));

    camera = {
      position: [
        -0.35 + Math.sin(orbitAngle) * radius,
        lerp(0.75, 1.15, t),
        charZ + Math.cos(orbitAngle) * radius,
      ],
      target: [-0.35, lerp(0.85, 0.95, t), charZ + lerp(0, 4.5, Math.max(0, (localF - 18) / 41))],
      fov: lerp(46, 54, t),
      roll: Math.sin(localF * 0.15) * 0.03,
      motionBlurStrength: localF > 38 ? 0.65 : 0.25,
      crossfadeAlpha: 0,
    };

    // Train rushes past between f90 and f118
    trainZ = localF < 30 ? lerp(-9.5, -2.0, localF / 30) : lerp(-2.0, 14.0, (localF - 30) / 29);

    character = {
      characterId: 'engineer',
      position: [-0.48, 0.0, charZ],
      rotationY: orbitAngle,
      headPitch: 0.0,
      headTilt: 0.04,
      browAngle: localF > 34 ? -0.2 : 0.15,
      eyeState: localF >= 32 && localF <= 48 ? 'squint' : 'smug',
      mouthState: localF % 6 < 3 ? 'talk_open' : 'closed_smirk',
      sawStrokePhase: 0,
      walkCyclePhase: localF * 0.35,
      bodyLean: 0.05,
      propType: 'hacksaw',
    };

    audioCues.push('VO: "...every 39 feet. You see, two..."');
    if (localF < 25) audioCues.push('SFX: Camera whip-pan whoosh');
    if (localF >= 30) audioCues.push('SFX: Steam locomotive Doppler roar + whistle blast');
    frameLesson =
      'At f60–90 the 3D camera orbits 180° around the character while the 2D character billboard counter-rotates to stay readable to the lens. At f98–112 the train wipes past the left edge with squinted >< eyes.';
  } else if (frame < 180) {
    // BEAT 3: High-altitude Canyon Abyss Crane Pullback (Frames 120-179)
    const localF = frame - 120;
    const t = smoothstep(localF / 59);
    camera = {
      position: [lerp(3.5, 11.0, t), lerp(4.5, 10.5, t), lerp(6.0, 18.5, t)],
      target: [lerp(0.0, -2.5, t), lerp(2.0, 3.5, t), lerp(-12.0, -22.0, t)],
      fov: 52,
      roll: 0,
      motionBlurStrength: 0.15,
      crossfadeAlpha: localF < 5 ? 1 - localF / 5 : 0,
    };

    character = {
      characterId: 'plank_worker',
      position: [1.8, 3.2, 6.5],
      rotationY: 0,
      headPitch: 0,
      headTilt: 0,
      browAngle: 0.1,
      eyeState: 'normal',
      mouthState: 'closed_smirk',
      sawStrokePhase: 0,
      walkCyclePhase: localF * 0.2,
      bodyLean: 0,
      propType: 'none',
    };

    audioCues.push('VO: "...companies are racing to build a railroad..."');
    audioCues.push('SFX: High-altitude canyon wind + metallic bridge creak');
    frameLesson =
      'Wide establishing crane pullback uses exponential blue depth fog (#0c2d9e) inside the canyon chasm. Two 3D bridges (arch bridge vs. foreground trestle) visualize the competition without needing text labels.';
  } else if (frame < 250) {
    // BEAT 4: Precarious Plank Over the Abyss & Vertigo Dive (Frames 180-249)
    const localF = frame - 180;
    if (localF < 38) {
      // Sub-beat 4A: Crane descending toward the wooden trestle deck (f180-217)
      const t = smoothstep(localF / 37);
      camera = {
        position: [lerp(8.5, 4.2, t), lerp(7.5, 4.8, t), lerp(14.0, 9.2, t)],
        target: [lerp(-1.0, 1.2, t), lerp(3.0, 3.2, t), lerp(-8.0, 5.5, t)],
        fov: 48,
        roll: 0,
        motionBlurStrength: 0.1,
        crossfadeAlpha: 0,
      };
    } else if (localF < 60) {
      // Sub-beat 4B: Close-up on lone worker on wooden plank peering down (f218-239)
      const t = smoothstep((localF - 38) / 21);
      camera = {
        position: [lerp(0.6, 1.4, t), lerp(4.2, 5.2, t), lerp(8.8, 7.6, t)],
        target: [1.8, lerp(3.3, 2.2, t), 6.5],
        fov: 44,
        roll: lerp(0.02, -0.04, t),
        motionBlurStrength: 0.15,
        crossfadeAlpha: localF < 43 ? 1 - (localF - 38) / 5 : 0,
      };
    } else {
      // Sub-beat 4C: Vertigo dive straight down into the canyon wall (f240-249)
      const t = smoothstep((localF - 60) / 9);
      camera = {
        position: [1.5, lerp(4.8, -6.0, t), 7.2],
        target: [1.8, lerp(1.0, -18.0, t), 4.0],
        fov: lerp(46, 64, t),
        roll: 0,
        motionBlurStrength: 0.85,
        crossfadeAlpha: 0,
      };
    }

    character = {
      characterId: 'plank_worker',
      position: [1.8, 3.25, 6.5],
      rotationY: -0.35,
      headPitch: localF >= 38 ? 0.55 : 0.15,
      headTilt: 0.12,
      browAngle: -0.3,
      eyeState: 'wide_down',
      mouthState: localF > 45 ? 'o_gasp' : 'closed_smirk',
      sawStrokePhase: 0,
      walkCyclePhase: 0,
      bodyLean: 0.48,
      propType: 'mug',
    };

    audioCues.push('VO: "...along a canyon so deep you can\'t see the bottom."');
    if (localF >= 58) audioCues.push('SFX: Steep downward wind dive whoosh');
    frameLesson =
      'Notice the 5-frame cross-dissolve at f218–222 into the lone worker standing at the end of the plank. His head tilts 32° downward and a tiny coffee mug sits on the beam—classic Ricks Clips micro-humor.';
  } else {
    // BEAT 5: Supersonic Desert Fly-In & Grand Station Tycoon Payoff (Frames 250-300)
    const localF = frame - 250;
    if (localF < 32) {
      // Sub-beat 5A: Supersonic desert flight toward Union Station (f250-281)
      const t = smoothstep(localF / 31);
      camera = {
        position: [0.0, lerp(2.6, 1.4, t), lerp(26.0, 7.5, t)],
        target: [0.0, lerp(1.5, 1.2, t), -12.0],
        fov: lerp(68, 52, t),
        roll: 0,
        motionBlurStrength: 0.9,
        crossfadeAlpha: localF < 4 ? 1 - localF / 4 : 0,
      };
    } else {
      // Sub-beat 5B: Snap-zoom into Top-Hat Tycoon & Money Bags at Grand Station (f282-300)
      const t = smoothstep((localF - 32) / 18);
      camera = {
        position: [0.0, lerp(1.35, 1.15, t), lerp(5.2, 3.4, t)],
        target: [0.0, 1.15, 0.0],
        fov: 42,
        roll: 0,
        motionBlurStrength: localF < 36 ? 0.5 : 0.05,
        crossfadeAlpha: 0,
      };
    }

    character = {
      characterId: 'tycoon',
      position: [0.0, 0.0, 0.0],
      rotationY: 0,
      headPitch: -0.05,
      headTilt: 0.06,
      browAngle: 0.2,
      eyeState: localF > 38 ? 'wink' : 'smug',
      mouthState: localF % 5 < 3 ? 'grin' : 'talk_wide',
      sawStrokePhase: 0,
      walkCyclePhase: 0,
      bodyLean: -0.05,
      propType: 'cane_money',
    };

    audioCues.push('VO: "And whoever finishes first gets it all!"');
    if (localF < 32) {
      audioCues.push('SFX: Supersonic desert zoom whoosh');
    } else {
      audioCues.push('SFX: Cash register cha-ching + brass fanfare chord');
    }
    frameLesson =
      'High-FOV (68°) camera rush across the desert floor compresses into a tight 42° portrait shot of the Top-Hat Tycoon flanked by 3D gold money bags and the "FIRST LINE IN GETS IT ALL!" station banner.';
  }

  return {
    frame,
    timeSeconds,
    beat,
    activeSubtitle,
    subtitleScale,
    camera,
    character,
    trainZ,
    sparkIntensity,
    audioCues,
    frameLesson,
  };
}

export const RICKS_CLIPS_BLUEPRINT = {
  channelHandle: '@RicksClips3000',
  resolution: '1080x1920 (9:16 Vertical Shorts)',
  frameRate: 30,
  averageDuration: '60–65 seconds (~1,900 frames)',
  pacingMetrics: {
    wordsPerMinute: 182,
    averageShotLengthSeconds: 1.75,
    subtitleWordsPerCard: '1 to 2 words (max 14 characters)',
    subtitleVerticalPosition: '70% from top (safe above YouTube Shorts UI)',
  },
  coreLayers: [
    {
      layer: '1. 2.5D Rigged Cartoon Characters in 3D Space',
      techStack: 'React Three Fiber <Billboard> / Custom Canvas Texture + 3D Tube Limbs',
      details:
        'Characters combine a 2D illustrated white circle head (#FFFFFF fill, #231F20 6px outline, cel-shaded rim shadow) and pill-shaped torso with 3D/2.5D rubber-hose limbs that interact with 3D props (hacksaws, cannons, levers) and cast real shadow maps onto the 3D floor.',
    },
    {
      layer: '2. Stylized 3D Toon Environment',
      techStack: 'Three.js MeshToonMaterial + Inverted Hull Outlines + Exponential Depth Fog',
      details:
        'Environments use bold color contrast (terracotta red canyon cliffs vs. cobalt blue abyss, warm wooden ship decks vs. turquoise ocean) with 3-step gradient maps and directional sunlight.',
    },
    {
      layer: '3. Hyper-Kinetic Camera Choreography',
      techStack: 'Deterministic Frame Keyframe Evaluator (smoothstep + orbital math)',
      details:
        'The camera never sits still for a single frame. Every shot combines a primary move (dolly push, 180° orbit, crane pullback, vertigo tilt, or high-FOV rush) with 4-to-6 frame cross-dissolves or foreground object wipes.',
    },
    {
      layer: '4. Word-by-Word Pop Typography',
      techStack: 'HTML/Canvas Overlay synced to phoneme frame indices',
      details:
        'Extra-bold sans-serif (Montserrat/Inter Black), pure white fill with heavy black stroke and drop shadow. Every new word triggers a 5-frame spring scale bounce (0.86 → 1.12 → 1.00).',
    },
    {
      layer: '5. Zero-Dead-Air Voiceover + Diegetic Foley',
      techStack: 'TTS / Voice Track + Frame-Triggered Web Audio / FFmpeg SFX',
      details:
        'Silence > 150ms is stripped between sentences. Every visual action has a corresponding foley hit (hacksaw scrape, train Doppler pass, wind whoosh, coin chime) mixed at -12dB beneath the -1dB voiceover.',
    },
  ],
};
