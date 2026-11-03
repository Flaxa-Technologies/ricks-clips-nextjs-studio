import wave
import numpy as np
import os
import shutil
import json
from scipy.signal import butter, lfilter

SAMPLE_RATE = 48000
AUDIO_DIR = "zomato_audio_en"
OUT_WAV = "zomato_master_audio.wav"
PUB_WAV = os.path.join("motion-reel", "public", "audio", "zomato_master_audio.wav")
PUB_WAV_V3 = os.path.join("motion-reel", "public", "audio", "zomato_master_v3.wav")

CHAPTER_FILES = [
    ("ch01_hook", 0.50),
    ("ch02_origin", 0.35),
    ("ch03_zomato", 0.35),
    ("ch04_invasion", 0.35),
    ("ch05_slaughter", 0.35),
    ("ch06_covid_ipo", 0.35),
    ("ch07_crash_blinkit", 0.35),
    ("ch08_quick_commerce", 0.35),
    ("ch09_eternal_empire", 0.35),
    ("ch10_epilogue", 0.40),
]

def load_wav_mono(filepath):
    with wave.open(filepath, "rb") as wf:
        sr = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)
        samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        if wf.getnchannels() == 2:
            samples = samples.reshape(-1, 2).mean(axis=1)
        if sr != SAMPLE_RATE:
            idx = np.linspace(0, len(samples) - 1, int(len(samples) * SAMPLE_RATE / sr))
            samples = np.interp(idx, np.arange(len(samples)), samples)
        return samples

print("1. Calculating exact English documentary timeline...")
timeline = []
cur_time = 0.40
scene_windows = []

for cid, lead_gap in CHAPTER_FILES:
    fp = os.path.join(AUDIO_DIR, f"{cid}.wav")
    s = load_wav_mono(fp)
    cur_time += lead_gap
    start_t = cur_time
    end_t = cur_time + len(s) / SAMPLE_RATE
    timeline.append((cid, start_t, end_t, s))
    scene_windows.append((cid, start_t, end_t))
    cur_time = end_t

total_dur = cur_time + 1.80
total_samples = int(total_dur * SAMPLE_RATE)
print(f"Total Documentary Duration: {total_dur:.2f}s ({total_dur/60.0:.2f} min)")

master_left = np.zeros(total_samples, dtype=np.float32)
master_right = np.zeros(total_samples, dtype=np.float32)
speech_gate = np.zeros(total_samples, dtype=np.float32)

# Place crisp, foreground-normalized voiceover
for cid, start_t, end_t, s in timeline:
    idx0 = int(start_t * SAMPLE_RATE)
    idx1 = idx0 + len(s)
    f_len = int(0.015 * SAMPLE_RATE)
    s_faded = s.copy()
    if len(s_faded) > 2 * f_len:
        s_faded[:f_len] *= np.linspace(0, 1, f_len)
        s_faded[-f_len:] *= np.linspace(1, 0, f_len)

    s_peak = np.max(np.abs(s_faded))
    if s_peak > 0:
        s_faded = (s_faded / s_peak) * 0.94

    master_left[idx0:idx1] += s_faded
    master_right[idx0:idx1] += s_faded

    # Hold speech gate active across entire chapter + 0.25s tail so music NEVER pumps between sentences!
    g0 = max(0, idx0 - int(0.12 * SAMPLE_RATE))
    g1 = min(total_samples, idx1 + int(0.18 * SAMPLE_RATE))
    speech_gate[g0:g1] = 1.0

# Smooth asymmetric envelope (0.8 Hz lowpass -> silky non-pumping sidechain)
b_env, a_env = butter(2, 0.9 / (0.5 * SAMPLE_RATE), btype="low")
smooth_speech = np.clip(lfilter(b_env, a_env, speech_gate), 0.0, 1.0)

print("2. Synthesizing warm, low-profile Apple/Vox-style minimalist score (felt piano + deep pulse)...")
BPM = 108.0
BEAT_DUR = 60.0 / BPM
EIGHTH = BEAT_DUR / 2.0

music_left = np.zeros(total_samples, dtype=np.float32)
music_right = np.zeros(total_samples, dtype=np.float32)

# Soft, warm heartbeat sub-kick (zero harsh click, pure 52Hz warmth)
kick_len = int(0.26 * SAMPLE_RATE)
t_k = np.arange(kick_len) / SAMPLE_RATE
f_k = 88.0 * np.exp(-t_k * 20.0) + 46.0
soft_kick = 0.28 * np.sin(2 * np.pi * f_k * t_k) * np.exp(-t_k * 12.0)

# Subtle muted wooden rim/tick on beat 3 only
rim_len = int(0.06 * SAMPLE_RATE)
t_r = np.arange(rim_len) / SAMPLE_RATE
soft_rim = 0.10 * np.sin(2 * np.pi * 380.0 * t_r) * np.exp(-t_r * 55.0)

total_beats = int(total_dur / BEAT_DUR)
ch05_st = [st for cid, st, et in scene_windows if cid == "ch05_slaughter"][0]

for b_idx in range(total_beats):
    t_beat = b_idx * BEAT_DUR
    i_beat = int(t_beat * SAMPLE_RATE)
    if i_beat >= total_samples - kick_len:
        break
    # Dramatic silence window right before & during slaughter cue (189.8s -> 193.5s)
    if 189.8 <= t_beat <= 193.5:
        continue

    bar_pos = b_idx % 4
    if bar_pos == 0 or bar_pos == 2:
        music_left[i_beat:i_beat + kick_len] += soft_kick
        music_right[i_beat:i_beat + kick_len] += soft_kick
    elif bar_pos == 2:
        pass
    if bar_pos == 2 and i_beat + rim_len < total_samples:
        music_left[i_beat:i_beat + rim_len] += soft_rim * 0.85
        music_right[i_beat:i_beat + rim_len] += soft_rim * 1.15

# Warm Felt Piano + Gentle Marimba Ostinato (A minor -> F -> C -> G)
CHORD_DUR = 16 * BEAT_DUR
chords = [
    (110.00, [220.00, 261.63, 329.63, 392.00]),  # Am7
    (87.31,  [174.61, 220.00, 261.63, 329.63]),  # Fmaj7
    (130.81, [196.00, 261.63, 329.63, 392.00]),  # C
    (98.00,  [196.00, 246.94, 293.66, 392.00]),  # G
]

n_chord_blocks = int(total_dur / CHORD_DUR) + 2
for c_idx in range(n_chord_blocks):
    c_start = c_idx * CHORD_DUR
    root, freqs = chords[c_idx % len(chords)]
    i0 = int(c_start * SAMPLE_RATE)
    i1 = min(total_samples, int((c_start + CHORD_DUR + 1.2) * SAMPLE_RATE))
    if i1 <= i0:
        continue
    tc = np.arange(i1 - i0) / SAMPLE_RATE

    # Warm sub pad
    sub_wave = 0.18 * np.sin(2 * np.pi * (root * 0.5) * tc) * np.exp(-tc * 0.08)

    # Felt piano chord (low-passed warm harmonics)
    piano_l = np.zeros_like(tc)
    piano_r = np.zeros_like(tc)
    env_p = (1.0 - np.exp(-tc * 18.0)) * np.exp(-tc * 0.32)
    for fi, f in enumerate(freqs):
        tone = (0.14 * np.sin(2 * np.pi * f * tc) + 0.04 * np.sin(2 * np.pi * (2 * f) * tc)) * env_p
        pan = 0.38 + 0.08 * fi
        piano_l += tone * (1.0 - pan)
        piano_r += tone * pan

    # Gentle 8th-note muted marimba pulse (low-mid register so it never clashes with speech)
    mar_l = np.zeros_like(tc)
    mar_r = np.zeros_like(tc)
    n_steps = int(((i1 - i0) / SAMPLE_RATE) / EIGHTH)
    for st_i in range(n_steps):
        st_t0 = st_i * EIGHTH
        s0 = int(st_t0 * SAMPLE_RATE)
        s1 = min(len(tc), int((st_t0 + EIGHTH * 0.9) * SAMPLE_RATE))
        if s1 <= s0:
            continue
        dt_m = tc[s0:s1] - st_t0
        mf = freqs[st_i % len(freqs)]
        m_wave = 0.075 * np.sin(2 * np.pi * mf * dt_m) * np.exp(-dt_m * 16.0)
        pan_m = 0.5 + 0.22 * np.sin(st_i * 0.9)
        mar_l[s0:s1] += m_wave * (1.0 - pan_m)
        mar_r[s0:s1] += m_wave * pan_m

    music_left[i0:i1] += sub_wave + piano_l + mar_l
    music_right[i0:i1] += sub_wave + piano_r + mar_r

# Lowpass filter music at 2,400 Hz so vocal presence band (2.5kHz - 6kHz) is 100% crystal clear!
b_lp, a_lp = butter(2, 2400.0 / (0.5 * SAMPLE_RATE), btype="low")
music_left = lfilter(b_lp, a_lp, music_left)
music_right = lfilter(b_lp, a_lp, music_right)

# Deep Whisper-Quiet Broadcast Ducking:
# Speech active: gain = 0.065 (-23.7 dB below full scale, ~22 dB below narrator!)
# Intro / Outro / Chapter Pauses: gain = 0.165 (-15.6 dB)
duck_gain = 0.165 - 0.100 * smooth_speech
music_left *= duck_gain
music_right *= duck_gain

master_left += music_left
master_right += music_right

print("3. Layering precision motion-graphics foley at all 30 beat cuts & hero impacts...")

def add_silk_whoosh(t_sec, pan_dir=1.0, intensity=0.14):
    i0 = int(max(0, (t_sec - 0.18)) * SAMPLE_RATE)
    dur = int(0.36 * SAMPLE_RATE)
    i1 = min(total_samples, i0 + dur)
    if i1 <= i0:
        return
    tw = np.arange(i1 - i0) / SAMPLE_RATE
    # Filtered airy swoosh
    rng = np.random.default_rng(int(t_sec * 100))
    noise = rng.normal(0, 1, len(tw)).astype(np.float32)
    b_w, a_w = butter(2, [280.0 / (0.5 * SAMPLE_RATE), 1800.0 / (0.5 * SAMPLE_RATE)], btype="band")
    shaped = lfilter(b_w, a_w, noise)
    env = np.sin(np.pi * np.clip(tw / 0.36, 0, 1)) ** 2.4
    sig = shaped * env * intensity
    master_left[i0:i1] += sig * (0.5 - 0.35 * pan_dir)
    master_right[i0:i1] += sig * (0.5 + 0.35 * pan_dir)

def add_sub_impact(t_sec, amp=0.30):
    i0 = int(t_sec * SAMPLE_RATE)
    dur = int(0.85 * SAMPLE_RATE)
    i1 = min(total_samples, i0 + dur)
    if i1 <= i0:
        return
    tw = np.arange(i1 - i0) / SAMPLE_RATE
    f_d = 90.0 * np.exp(-tw * 3.5) + 34.0
    sig = amp * np.sin(2 * np.pi * f_d * tw) * np.exp(-tw * 3.4)
    master_left[i0:i1] += sig
    master_right[i0:i1] += sig

def add_stamp_slam(t_sec):
    i0 = int(t_sec * SAMPLE_RATE)
    dur = int(0.22 * SAMPLE_RATE)
    i1 = min(total_samples, i0 + dur)
    if i1 <= i0:
        return
    tw = np.arange(i1 - i0) / SAMPLE_RATE
    thud = 0.22 * np.sin(2 * np.pi * (140.0 * np.exp(-tw * 18.0) + 48.0) * tw) * np.exp(-tw * 14.0)
    master_left[i0:i1] += thud
    master_right[i0:i1] += thud

def add_gong_chime(t_sec):
    i0 = int(t_sec * SAMPLE_RATE)
    dur = int(4.2 * SAMPLE_RATE)
    i1 = min(total_samples, i0 + dur)
    if i1 <= i0:
        return
    tw = np.arange(i1 - i0) / SAMPLE_RATE
    gong = (
        0.24 * np.sin(2 * np.pi * 174.6 * tw) * np.exp(-tw * 0.65) +
        0.16 * np.sin(2 * np.pi * 349.2 * tw) * np.exp(-tw * 0.95) +
        0.11 * np.sin(2 * np.pi * 523.25 * tw) * np.exp(-tw * 1.45) +
        0.07 * np.sin(2 * np.pi * 880.0 * tw) * np.exp(-tw * 2.10)
    )
    master_left[i0:i1] += gong * 0.85
    master_right[i0:i1] += gong * 0.92

# Exact 29 Word-Locked Beat Cut Timestamps (from zomato_word_map.json!)
BEAT_CUTS = [
    10.64, 22.14, 34.26, 51.65, 65.55, 76.50, 100.25, 112.10, 121.10,
    133.00, 147.00, 160.60, 170.35, 186.20, 211.15, 224.35, 236.35, 248.80,
    270.11, 292.65, 306.15, 318.58, 334.16, 351.85, 364.00, 376.62, 394.40,
    405.54, 417.40
]

for idx, cut_t in enumerate(BEAT_CUTS):
    add_silk_whoosh(cut_t, pan_dir=(1.0 if idx % 2 == 0 else -1.0), intensity=0.13)

# Key narrative impacts locked to exact spoken word timestamps!
add_sub_impact(0.95, amp=0.22)
add_sub_impact(96.85, amp=0.24)   # "rebranded to ZOMATO" (97.05s)
add_sub_impact(190.85, amp=0.32)  # "systematically slaughtered" (190.93s)
add_stamp_slam(194.70)            # "TinyOwl ... and collapsed" (194.76s)
add_stamp_slam(198.90)            # "Foodpanda ... shuttered for good" (198.90s)
add_stamp_slam(206.85)            # "Uber surrendered" (206.89s)
add_sub_impact(231.20, amp=0.26)  # "plunged seventy percent" (231.26s)
add_gong_chime(257.20)            # "the stock popped to 115 rupees" (257.24s)
add_sub_impact(283.05, amp=0.26)  # "down to 41 rupees" (283.08s)
add_stamp_slam(298.50)            # "In August 2022, Zomato acquired Blinkit" (298.49s)
add_stamp_slam(345.95)            # "Dunzo burned out and collapsed" (345.97s)

# Final smooth 1.6s outro fade
fade_samples = int(1.6 * SAMPLE_RATE)
master_left[-fade_samples:] *= np.linspace(1.0, 0.0, fade_samples)
master_right[-fade_samples:] *= np.linspace(1.0, 0.0, fade_samples)

peak = max(np.max(np.abs(master_left)), np.max(np.abs(master_right)))
if peak > 0.96:
    master_left = (master_left / peak) * 0.95
    master_right = (master_right / peak) * 0.95

master_stereo = np.column_stack((master_left, master_right))
master_int16 = np.clip(master_stereo * 32767.0, -32768, 32767).astype(np.int16)

with wave.open(OUT_WAV, "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    wf.writeframes(master_int16.tobytes())

shutil.copy2(OUT_WAV, PUB_WAV)
shutil.copy2(OUT_WAV, PUB_WAV_V3)
print(f"Mastered clean stereo audio -> {OUT_WAV}, {PUB_WAV} & {PUB_WAV_V3} (peak={peak:.3f})")
