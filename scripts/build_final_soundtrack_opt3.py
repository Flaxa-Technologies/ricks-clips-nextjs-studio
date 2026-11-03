import numpy as np
import scipy.signal as signal
import json
import wave
import subprocess
import os

SR = 48000
AUDIO_DIR = r"C:\Users\Prasad\Documents\acad\yt-3\blinkit-reel\public\audio"
CHAPTER_DIR = os.path.join(AUDIO_DIR, "chapters")
WORD_MAP_PATH = os.path.join(AUDIO_DIR, "word_map.json")
OUT_MP3 = os.path.join(AUDIO_DIR, "master_v2.mp3")

with open(WORD_MAP_PATH, "r", encoding="utf-8") as f:
    word_map = json.load(f)

TOTAL_DUR = word_map["totalDuration"]  # 232.224
TOTAL_SAMPLES = int(TOTAL_DUR * SR)
print(f"Synthesizing Option 3 Full Master Soundtrack ({TOTAL_DUR:.2f}s, {TOTAL_SAMPLES} samples)...")

# 1. Assemble Voice Track & Speech Envelope
voice_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
speech_gate = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

CHAPTER_GAPS = {
    "ch01_hook": 0.50,
    "ch02_origin": 0.35,
    "ch03_slotted": 0.35,
    "ch04_pivot": 0.35,
    "ch05_invasion": 0.35,
    "ch06_slaughter": 0.35,
    "ch07_acquisition": 0.35,
    "ch08_physics": 0.35,
    "ch09_margins": 0.35,
    "ch10_empire": 0.40,
}

def load_wav(fp):
    with wave.open(fp, 'rb') as wf:
        n = wf.getnframes()
        raw = wf.readframes(n)
        return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0

cur = 0.40
for ch in word_map["chapters"]:
    cid = ch["cid"]
    gap = CHAPTER_GAPS.get(cid, 0.35)
    cur += gap
    start_sec = cur
    wav_path = os.path.join(CHAPTER_DIR, f"{cid}.wav")
    raw = load_wav(wav_path)
    
    # Normalize peak to 0.94
    peak = np.max(np.abs(raw))
    norm = raw * (0.94 / peak) if peak > 1e-4 else raw
    
    # 15ms fade in/out
    f_len = int(0.015 * SR)
    if len(norm) > 2 * f_len:
        norm[:f_len] *= np.linspace(0, 1, f_len)
        norm[-f_len:] *= np.linspace(1, 0, f_len)
        
    s_idx = int(start_sec * SR)
    e_idx = min(TOTAL_SAMPLES, s_idx + len(norm))
    voice_track[s_idx:e_idx] += norm[:e_idx - s_idx]
    
    end_sec = start_sec + len(raw) / SR
    cur = end_sec
    
    g0 = max(0, int((start_sec - 0.12) * SR))
    g1 = min(TOTAL_SAMPLES, int((end_sec + 0.18) * SR))
    speech_gate[g0:g1] = 1.0

# Low-pass speech gate at 1.0 Hz for smooth sidechain ducking envelope
b_gate, a_gate = signal.butter(2, 1.0 / (0.5 * SR), btype='low')
speech_env = signal.lfilter(b_gate, a_gate, speech_gate)
speech_env = np.clip(speech_env / (np.max(speech_env) + 1e-6), 0.0, 1.0)

# 2. Synthesize OPTION 3 Score: "Modern Ambient Momentum" (Vox / Johnny Harris)
print("Synthesizing Option 3 score: 116 BPM Ambient Momentum...")
score_l = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
score_r = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

bpm = 116.0
beat_dur = 60.0 / bpm
total_beats = int(TOTAL_DUR / beat_dur)

# Chord progression: D -> A -> Bm -> G
chords = [
    [146.83, 220.0, 293.66, 369.99], # D
    [110.0, 220.0, 277.18, 329.63],  # A
    [123.47, 246.94, 293.66, 369.99],# Bm
    [98.00, 196.0, 246.94, 293.66],  # G
]

for b in range(total_beats):
    b_time = b * beat_dur
    bar_pos = b % 4
    chord_idx = (b // 8) % len(chords)
    chord = chords[chord_idx]
    
    # Dramatic silence window around competitor collapse (119.0s -> 125.8s)
    in_silence = (b_time >= 119.0 and b_time <= 125.8)
    if in_silence:
        continue
        
    # Warm acoustic kick on 0 and 2
    if bar_pos in [0, 2]:
        k_len = int(0.35 * SR)
        idx0 = int(b_time * SR)
        idx1 = min(TOTAL_SAMPLES, idx0 + k_len)
        tk = np.arange(idx1 - idx0) / SR
        k_f = 95 * np.exp(-22 * tk) + 48
        kick = 0.22 * np.sin(2 * np.pi * k_f * tk) * np.exp(-14 * tk)
        score_l[idx0:idx1] += kick
        score_r[idx0:idx1] += kick

    # Subtle hi-hat / shaker on every 8th note
    for eighth in range(2):
        shk_time = b_time + eighth * (beat_dur * 0.5)
        idx0 = int(shk_time * SR)
        shk_len = int(0.04 * SR)
        idx1 = min(TOTAL_SAMPLES, idx0 + shk_len)
        tshk = np.arange(idx1 - idx0) / SR
        shaker = 0.035 * (np.random.rand(len(tshk)) * 2 - 1) * np.exp(-tshk * 70)
        score_l[idx0:idx1] += shaker * 0.8
        score_r[idx0:idx1] += shaker * 1.1

    # Luminous Rhodes pad on chord changes
    if bar_pos == 0:
        pad_len = int(4 * beat_dur * SR)
        idx0 = int(b_time * SR)
        idx1 = min(TOTAL_SAMPLES, idx0 + pad_len)
        tp = np.arange(idx1 - idx0) / SR
        env = np.sin(np.pi * np.clip(tp / (4 * beat_dur), 0, 1))**1.3
        for f in chord:
            tone = 0.038 * (
                np.sin(2 * np.pi * f * tp) +
                0.2 * np.sin(2 * np.pi * f * 2 * tp)
            ) * env
            score_l[idx0:idx1] += tone * 0.95
            score_r[idx0:idx1] += tone * 1.05

# Filter score at 2800 Hz for warm analog documentary tone
b_score, a_score = signal.butter(2, 2800 / (0.5 * SR), btype='low')
score_l = signal.lfilter(b_score, a_score, score_l)
score_r = signal.lfilter(b_score, a_score, score_r)

# 3. Add Foley (Whooshes, Sub-drops, Shutter ticks)
foley_l = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
foley_r = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

def add_whoosh(ct, pan=0.5):
    idx0 = max(0, int((ct - 0.18) * SR))
    w_len = int(0.38 * SR)
    idx1 = min(TOTAL_SAMPLES, idx0 + w_len)
    tw = np.arange(idx1 - idx0) / SR
    noise = (np.random.rand(len(tw)) * 2 - 1)
    env = np.sin(np.pi * np.clip(tw / 0.38, 0, 1))**2.4
    b_w, a_w = signal.butter(1, 1200 / (0.5 * SR), btype='low')
    filt_noise = signal.lfilter(b_w, a_w, noise)
    val = filt_noise * env * 0.14
    foley_l[idx0:idx1] += val * (1 - pan * 0.5)
    foley_r[idx0:idx1] += val * (0.5 + pan * 0.5)

cut_times = [
    8.10, 14.90, 27.40, 36.50, 47.75, 59.75, 68.95, 76.35, 84.70, 94.75,
    107.60, 114.65, 126.10, 134.65, 150.35, 159.85, 172.70, 182.00, 195.10,
    205.00, 214.40, 220.80,
]
for idx, ct in enumerate(cut_times):
    add_whoosh(ct, 0.25 if idx % 2 == 0 else 0.75)

# 4. Mix Master with Sidechain Ducking
# Music gain: 0.18 during pauses, ducks down to 0.065 during active narration (-18 dB)
music_gain = 0.18 - 0.115 * speech_env

master_l = voice_track + score_l * music_gain + foley_l
master_r = voice_track + score_r * music_gain + foley_r

# Tail fade out (last 1.6s)
tail_samples = int(1.6 * SR)
master_l[-tail_samples:] *= np.linspace(1, 0, tail_samples)
master_r[-tail_samples:] *= np.linspace(1, 0, tail_samples)

# Normalize
peak = max(np.max(np.abs(master_l)), np.max(np.abs(master_r)))
if peak > 0.95:
    scale = 0.93 / peak
    master_l *= scale
    master_r *= scale

# Write temporary WAV and encode to 320k MP3
temp_wav = os.path.join(AUDIO_DIR, "temp_master_opt3.wav")
pcm_l = (master_l * 32767).astype(np.int16)
pcm_r = (master_r * 32767).astype(np.int16)

with wave.open(temp_wav, 'wb') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    interleaved = np.empty((2 * TOTAL_SAMPLES,), dtype=np.int16)
    interleaved[0::2] = pcm_l
    interleaved[1::2] = pcm_r
    wf.writeframes(interleaved.tobytes())

subprocess.run(["ffmpeg", "-y", "-i", temp_wav, "-c:a", "libmp3lame", "-b:a", "320k", OUT_MP3], check=True)
os.remove(temp_wav)
print(f"SUCCESS: Master audio generated with Option 3 at {OUT_MP3} ({os.path.getsize(OUT_MP3)/1024:.1f} KB)")
