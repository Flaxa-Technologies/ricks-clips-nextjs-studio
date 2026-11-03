import fs from "fs";
import path from "path";

const SR = 48000;
const WORD_MAP_PATH = path.resolve("public/audio/word_map.json");
const CHAPTER_DIR = path.resolve("public/audio/chapters");

const CHAPTER_GAPS = {
  ch01_hook: 0.50,
  ch02_origin: 0.35,
  ch03_slotted: 0.35,
  ch04_pivot: 0.35,
  ch05_invasion: 0.35,
  ch06_slaughter: 0.35,
  ch07_acquisition: 0.35,
  ch08_physics: 0.35,
  ch09_margins: 0.35,
  ch10_empire: 0.40,
};

function readMonoWavFloat32(wavPath) {
  const buf = fs.readFileSync(wavPath);
  let offset = 12;
  while (offset < buf.length - 8) {
    const chunkId = buf.toString("ascii", offset, offset + 4);
    const chunkSize = buf.readUInt32LE(offset + 4);
    if (chunkId === "data") {
      const sampleCount = chunkSize >> 1;
      const out = new Float32Array(sampleCount);
      const dataStart = offset + 8;
      for (let i = 0; i < sampleCount; i++) {
        out[i] = buf.readInt16LE(dataStart + i * 2) / 32768.0;
      }
      return out;
    }
    offset += 8 + chunkSize;
  }
  throw new Error(`No data chunk in ${wavPath}`);
}

function normalizeAndFadeVoice(samples, targetPeak = 0.94) {
  let maxAbs = 0;
  for (let i = 0; i < samples.length; i++) {
    const a = Math.abs(samples[i]);
    if (a > maxAbs) maxAbs = a;
  }
  const scale = maxAbs > 1e-5 ? targetPeak / maxAbs : 1.0;
  const fadeSamples = Math.floor(0.015 * SR); // 15ms fade
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    let env = 1.0;
    if (i < fadeSamples) env = i / fadeSamples;
    else if (i > samples.length - fadeSamples)
      env = (samples.length - i) / fadeSamples;
    out[i] = samples[i] * scale * env;
  }
  return out;
}

// 2nd-order Butterworth Low-Pass Filter
function biquadLowPass(input, cutoffHz) {
  const out = new Float32Array(input.length);
  const omega = (2 * Math.PI * cutoffHz) / SR;
  const sinW = Math.sin(omega);
  const cosW = Math.cos(omega);
  const alpha = sinW / Math.sqrt(2); // Q = 0.7071

  const b0 = (1 - cosW) / 2;
  const b1 = 1 - cosW;
  const b2 = (1 - cosW) / 2;
  const a0 = 1 + alpha;
  const a1 = -2 * cosW;
  const a2 = 1 - alpha;

  const nb0 = b0 / a0;
  const nb1 = b1 / a0;
  const nb2 = b2 / a0;
  const na1 = a1 / a0;
  const na2 = a2 / a0;

  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  for (let i = 0; i < input.length; i++) {
    const x0 = input[i];
    const y0 = nb0 * x0 + nb1 * x1 + nb2 * x2 - na1 * y1 - na2 * y2;
    out[i] = y0;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
  }
  return out;
}

function buildMasterSoundtrack() {
  const wordMap = JSON.parse(fs.readFileSync(WORD_MAP_PATH, "utf8"));
  const totalDur = wordMap.totalDuration;
  const totalSamples = Math.round(totalDur * SR);

  const voiceTrack = new Float32Array(totalSamples);
  const speechGate = new Float32Array(totalSamples);

  let cur = 0.40;
  for (const ch of wordMap.chapters) {
    const gap = CHAPTER_GAPS[ch.cid] ?? 0.35;
    cur += gap;
    const startSec = cur;
    const wavPath = path.join(CHAPTER_DIR, `${ch.cid}.wav`);
    const raw = readMonoWavFloat32(wavPath);
    const norm = normalizeAndFadeVoice(raw, 0.94);

    const startIdx = Math.round(startSec * SR);
    for (let i = 0; i < norm.length && startIdx + i < totalSamples; i++) {
      voiceTrack[startIdx + i] += norm[i];
    }

    const endSec = startSec + raw.length / SR;
    cur = endSec;

    const gateStart = Math.max(0, Math.round((startSec - 0.12) * SR));
    const gateEnd = Math.min(totalSamples - 1, Math.round((endSec + 0.18) * SR));
    for (let i = gateStart; i <= gateEnd; i++) {
      speechGate[i] = 1.0;
    }
  }

  const calcTotal = Number((cur + 1.80).toFixed(3));
  if (Math.abs(calcTotal - totalDur) > 0.05) {
    throw new Error(
      `Duration mismatch: calcTotal=${calcTotal} vs wordMap=${totalDur}`
    );
  }

  // Smooth speech envelope at 0.9 Hz
  const speechEnvelope = biquadLowPass(speechGate, 0.9);

  // Synthesize 108 BPM score (Am7 -> Fmaj7 -> C -> G)
  const scoreL = new Float32Array(totalSamples);
  const scoreR = new Float32Array(totalSamples);
  const bpm = 108;
  const beatDur = 60 / bpm;

  // Chord progressions in Hz: [root, 3rd, 5th, 7th]
  const chords = [
    [220.0, 261.63, 329.63, 392.0], // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [196.0, 246.94, 293.66, 392.0], // G
  ];

  // Dramatic silence window around rival collapse (119.0s -> 125.8s)
  const totalBeats = Math.floor(totalDur / beatDur);
  for (let b = 0; b < totalBeats; b++) {
    const bTime = b * beatDur;
    const barPos = b % 4;
    const chordIdx = Math.floor(b / 16) % chords.length;
    const chord = chords[chordIdx];
    const inSilenceWindow = bTime >= 119.0 && bTime <= 125.8;

    // Heartbeat kick on bar positions 0 and 2
    if (!inSilenceWindow && (barPos === 0 || barPos === 2)) {
      const kickLen = Math.floor(0.42 * SR);
      const startSample = Math.round(bTime * SR);
      for (let i = 0; i < kickLen && startSample + i < totalSamples; i++) {
        const dt = i / SR;
        const f = 88 * Math.exp(-20 * dt) + 46;
        const val = 0.28 * Math.sin(2 * Math.PI * f * dt) * Math.exp(-12 * dt);
        scoreL[startSample + i] += val;
        scoreR[startSample + i] += val;
      }
    }

    // Muted rim tick on beat 3
    if (!inSilenceWindow && barPos === 3) {
      const rimLen = Math.floor(0.06 * SR);
      const startSample = Math.round(bTime * SR);
      for (let i = 0; i < rimLen && startSample + i < totalSamples; i++) {
        const dt = i / SR;
        const val = 0.08 * Math.sin(2 * Math.PI * 380 * dt) * Math.exp(-55 * dt);
        scoreL[startSample + i] += val * 0.8;
        scoreR[startSample + i] += val * 1.1;
      }
    }

    // Felt piano & sub pad on bar start (barPos === 0)
    if (barPos === 0) {
      const padDur = beatDur * 4;
      const padSamples = Math.floor(padDur * SR);
      const startSample = Math.round(bTime * SR);
      const subFreq = chord[0] * 0.5;
      for (let i = 0; i < padSamples && startSample + i < totalSamples; i++) {
        const dt = i / SR;
        const env = Math.min(1, dt / 0.12) * Math.exp(-0.32 * dt);
        const sub = 0.14 * Math.sin(2 * Math.PI * subFreq * dt) * env;
        let piano = 0;
        for (let n = 0; n < chord.length; n++) {
          const f = chord[n];
          piano +=
            0.045 *
            (Math.sin(2 * Math.PI * f * dt) +
              0.25 * Math.sin(4 * Math.PI * f * dt)) *
            env;
        }
        scoreL[startSample + i] += sub + piano * 0.95;
        scoreR[startSample + i] += sub + piano * 1.05;
      }
    }

    // 8th-note muted marimba arpeggio
    for (let eighth = 0; eighth < 2; eighth++) {
      const arpTime = bTime + eighth * (beatDur * 0.5);
      const noteFreq = chord[(b * 2 + eighth) % chord.length] * 2;
      const arpSamples = Math.floor(0.24 * SR);
      const startSample = Math.round(arpTime * SR);
      const pan = (b * 2 + eighth) % 2 === 0 ? 0.35 : 0.65;
      for (let i = 0; i < arpSamples && startSample + i < totalSamples; i++) {
        const dt = i / SR;
        const val =
          0.06 * Math.sin(2 * Math.PI * noteFreq * dt) * Math.exp(-16 * dt);
        scoreL[startSample + i] += val * (1 - pan);
        scoreR[startSample + i] += val * pan;
      }
    }
  }

  // Low-pass score at 2400 Hz
  const filtScoreL = biquadLowPass(scoreL, 2400);
  const filtScoreR = biquadLowPass(scoreR, 2400);

  // Foley buffers
  const foleyL = new Float32Array(totalSamples);
  const foleyR = new Float32Array(totalSamples);

  function addSilkWhoosh(cutSec, pan = 0.5, intensity = 0.13) {
    const dur = 0.38;
    const startSec = Math.max(0, cutSec - 0.18);
    const startSample = Math.round(startSec * SR);
    const len = Math.floor(dur * SR);
    let lp = 0;
    for (let i = 0; i < len && startSample + i < totalSamples; i++) {
      const p = i / len;
      const env = Math.pow(Math.sin(Math.PI * p), 2.4);
      const white = Math.random() * 2 - 1;
      lp = lp + 0.18 * (white - lp);
      const val = lp * env * intensity;
      foleyL[startSample + i] += val * (1 - pan * 0.5);
      foleyR[startSample + i] += val * (0.5 + pan * 0.5);
    }
  }

  function addSubImpact(atSec, amp = 0.26) {
    const dur = 0.85;
    const startSample = Math.round(atSec * SR);
    const len = Math.floor(dur * SR);
    for (let i = 0; i < len && startSample + i < totalSamples; i++) {
      const dt = i / SR;
      const f = 90 * Math.exp(-3.5 * dt) + 34;
      const val = amp * Math.sin(2 * Math.PI * f * dt) * Math.exp(-4.2 * dt);
      foleyL[startSample + i] += val;
      foleyR[startSample + i] += val;
    }
  }

  function addStampSlam(atSec) {
    const dur = 0.22;
    const startSample = Math.round(atSec * SR);
    const len = Math.floor(dur * SR);
    for (let i = 0; i < len && startSample + i < totalSamples; i++) {
      const dt = i / SR;
      const f = 140 * Math.exp(-18 * dt) + 48;
      const transient = (Math.random() * 2 - 1) * Math.exp(-45 * dt) * 0.18;
      const body = 0.28 * Math.sin(2 * Math.PI * f * dt) * Math.exp(-14 * dt);
      const val = transient + body;
      foleyL[startSample + i] += val;
      foleyR[startSample + i] += val;
    }
  }

  function addGongChime(atSec) {
    const dur = 4.2;
    const startSample = Math.round(atSec * SR);
    const len = Math.floor(dur * SR);
    const partials = [174.6, 349.2, 523.25, 880.0];
    const weights = [0.11, 0.08, 0.05, 0.03];
    for (let i = 0; i < len && startSample + i < totalSamples; i++) {
      const dt = i / SR;
      const attack = Math.min(1, dt / 0.015);
      let sum = 0;
      for (let k = 0; k < partials.length; k++) {
        sum +=
          weights[k] *
          Math.sin(2 * Math.PI * partials[k] * dt) *
          Math.exp(-(0.8 + k * 0.45) * dt);
      }
      const val = sum * attack;
      foleyL[startSample + i] += val * 0.95;
      foleyR[startSample + i] += val * 1.05;
    }
  }

  // Exact Beat Cut Times from Word Map
  const cutTimes = [
    8.10, 14.90, 27.40, 36.50, 47.75, 59.75, 68.95, 76.35, 84.70, 94.75,
    107.60, 114.65, 126.10, 134.65, 150.35, 159.85, 172.70, 182.00, 195.10,
    205.00, 214.40, 220.80,
  ];
  cutTimes.forEach((ct, idx) => addSilkWhoosh(ct, idx % 2 === 0 ? 0.25 : 0.75));

  // Sub Impacts on key narrative turns
  [13.57, 59.92, 93.13, 134.92, 152.41, 168.00, 210.28].forEach((t) =>
    addSubImpact(t, 0.26)
  );

  // Stamp Slams on eliminations & verdicts
  [75.33, 87.07, 119.90, 125.19, 147.65, 203.66].forEach((t) =>
    addStampSlam(t)
  );

  // Gong Chimes on historic milestones
  [93.13, 145.38, 203.66, 214.54].forEach((t) => addGongChime(t));

  // Final Mix with Ducking: gain = 0.165 - 0.100 * E(t)
  const masterL = new Float32Array(totalSamples);
  const masterR = new Float32Array(totalSamples);
  const fadeOutSamples = Math.floor(1.6 * SR);
  let maxPeak = 0;

  for (let i = 0; i < totalSamples; i++) {
    const env = Math.max(0, Math.min(1, speechEnvelope[i]));
    const musicGain = 0.165 - 0.100 * env;
    let fade = 1.0;
    if (i > totalSamples - fadeOutSamples) {
      fade = (totalSamples - i) / fadeOutSamples;
    }

    const v = voiceTrack[i];
    const l = (v + filtScoreL[i] * musicGain + foleyL[i]) * fade;
    const r = (v + filtScoreR[i] * musicGain + foleyR[i]) * fade;
    masterL[i] = l;
    masterR[i] = r;

    const absL = Math.abs(l);
    const absR = Math.abs(r);
    if (absL > maxPeak) maxPeak = absL;
    if (absR > maxPeak) maxPeak = absR;
  }

  const normScale = maxPeak > 0.96 ? 0.95 / maxPeak : 1.0;

  // Write 16-bit Stereo 48kHz WAV
  const dataBytes = totalSamples * 4;
  const wavBuf = Buffer.alloc(44 + dataBytes);
  wavBuf.write("RIFF", 0);
  wavBuf.writeUInt32LE(36 + dataBytes, 4);
  wavBuf.write("WAVE", 8);
  wavBuf.write("fmt ", 12);
  wavBuf.writeUInt32LE(16, 16); // PCM
  wavBuf.writeUInt16LE(1, 20); // Linear PCM
  wavBuf.writeUInt16LE(2, 22); // 2 channels (Stereo)
  wavBuf.writeUInt32LE(SR, 24);
  wavBuf.writeUInt32LE(SR * 4, 28); // Byte rate
  wavBuf.writeUInt16LE(4, 32); // Block align
  wavBuf.writeUInt16LE(16, 34); // 16 bits
  wavBuf.write("data", 36);
  wavBuf.writeUInt32LE(dataBytes, 40);

  let pos = 44;
  for (let i = 0; i < totalSamples; i++) {
    const sL = Math.max(
      -32768,
      Math.min(32767, Math.round(masterL[i] * normScale * 32767))
    );
    const sR = Math.max(
      -32768,
      Math.min(32767, Math.round(masterR[i] * normScale * 32767))
    );
    wavBuf.writeInt16LE(sL, pos);
    wavBuf.writeInt16LE(sR, pos + 2);
    pos += 4;
  }

  const publicWav = path.resolve("public/audio/master_v1.wav");
  const rootWav = path.resolve("master_audio.wav");
  fs.writeFileSync(publicWav, wavBuf);
  fs.writeFileSync(rootWav, wavBuf);
  console.log(
    `Built master soundtrack: ${publicWav} (${(
      wavBuf.length /
      (1024 * 1024)
    ).toFixed(2)} MB, ${totalDur.toFixed(3)}s, peak=${(
      maxPeak * normScale
    ).toFixed(3)})`
  );
}

buildMasterSoundtrack();
