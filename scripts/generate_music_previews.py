import numpy as np
import scipy.signal as signal
import wave
import subprocess
import os

SR = 48000
DUR = 45.0  # 45 seconds preview
SAMPLES = int(DUR * SR)
OUT_DIR = r"C:\Users\Prasad\Documents\acad\yt-3\blinkit-reel\public\audio\music_previews"
os.makedirs(OUT_DIR, exist_ok=True)
BRAIN_DIR = r"C:\Users\Prasad\.gemini\antigravity\brain\f560532f-ed21-4313-b2a4-a914435b8f6b"

t = np.arange(SAMPLES) / SR

def save_mp3(left, right, filename, voice_sample=None):
    wav_path = os.path.join(OUT_DIR, filename.replace(".mp3", ".wav"))
    mp3_path = os.path.join(OUT_DIR, filename)
    brain_mp3 = os.path.join(BRAIN_DIR, filename)

    # Master limiter & normalize
    stereo = np.vstack([left, right])
    peak = np.max(np.abs(stereo))
    if peak > 0.95:
        stereo = stereo * (0.92 / peak)

    # Convert to 16-bit PCM
    pcm = (stereo * 32767).astype(np.int16)
    with wave.open(wav_path, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        interleaved = np.empty((2 * SAMPLES,), dtype=np.int16)
        interleaved[0::2] = pcm[0]
        interleaved[1::2] = pcm[1]
        wf.writeframes(interleaved.tobytes())

    # Encode to 320kbps MP3 via ffmpeg
    subprocess.run(["ffmpeg", "-y", "-i", wav_path, "-b:a", "320k", mp3_path], capture_output=True, check=True)
    subprocess.run(["ffmpeg", "-y", "-i", wav_path, "-b:a", "320k", brain_mp3], capture_output=True, check=True)
    os.remove(wav_path)
    print(f"Generated: {mp3_path}")
    return mp3_path

# ==============================================================================
# TRACK 1: "Investigative Felt Piano & Warm Sub-Bass" (MagnatesMedia / Think School)
# ==============================================================================
def generate_track_1():
    print("Generating Track 1: Felt Piano & Warm Sub-Bass...")
    left = np.zeros(SAMPLES, dtype=np.float32)
    right = np.zeros(SAMPLES, dtype=np.float32)

    bpm = 104
    beat_dur = 60.0 / bpm
    total_beats = int(DUR / beat_dur)

    # Chords: Am -> F -> C -> G
    chords = [
        [220.0, 261.63, 329.63, 440.0],  # Am
        [174.61, 220.0, 261.63, 349.23], # F
        [261.63, 329.63, 392.0, 523.25], # C
        [196.0, 246.94, 293.66, 392.0],  # G
    ]

    for b in range(total_beats):
        b_time = b * beat_dur
        bar_pos = b % 4
        chord_idx = (b // 8) % len(chords)
        chord = chords[chord_idx]

        # Warm deep sub-bass pulse on bar start
        if bar_pos == 0:
            c_len = int(4 * beat_dur * SR)
            idx0 = int(b_time * SR)
            idx1 = min(SAMPLES, idx0 + c_len)
            tc = np.arange(idx1 - idx0) / SR
            root_f = chord[0] * 0.5  # Sub octave
            env = np.sin(np.pi * np.clip(tc / (4 * beat_dur), 0, 1))**1.5
            sub = 0.22 * np.sin(2 * np.pi * root_f * tc) * env
            left[idx0:idx1] += sub
            right[idx0:idx1] += sub

            # Felt piano chord strike with gentle decay
            for f in chord:
                tone = 0.045 * (
                    np.sin(2 * np.pi * f * tc) * np.exp(-tc * 0.45) +
                    0.25 * np.sin(2 * np.pi * f * 2 * tc) * np.exp(-tc * 0.85)
                )
                left[idx0:idx1] += tone * 0.95
                right[idx0:idx1] += tone * 1.05

        # Delicate ticking clockwork / rim on beat 2 & 4
        if bar_pos in [1, 3]:
            tick_len = int(0.04 * SR)
            idx0 = int(b_time * SR)
            idx1 = min(SAMPLES, idx0 + tick_len)
            tt = np.arange(idx1 - idx0) / SR
            tick = 0.06 * np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 120)
            left[idx0:idx1] += tick * 0.7
            right[idx0:idx1] += tick * 1.2

        # Subtle acoustic felt arpeggios
        for arp_i in range(2):
            arp_time = b_time + arp_i * (beat_dur * 0.5)
            idx0 = int(arp_time * SR)
            arp_len = int(0.35 * SR)
            idx1 = min(SAMPLES, idx0 + arp_len)
            ta = np.arange(idx1 - idx0) / SR
            note_f = chord[(b + arp_i) % len(chord)] * 1.0
            note = 0.035 * np.sin(2 * np.pi * note_f * ta) * np.exp(-ta * 2.2)
            pan = 0.35 if arp_i == 0 else 0.65
            left[idx0:idx1] += note * (1 - pan)
            right[idx0:idx1] += note * pan

    # 2.2 kHz warmth filter
    b_filt, a_filt = signal.butter(2, 2200 / (0.5 * SR), btype='low')
    left = signal.lfilter(b_filt, a_filt, left)
    right = signal.lfilter(b_filt, a_filt, right)
    return save_mp3(left, right, "bgm_option1_felt_piano_investigative.mp3")

# ==============================================================================
# TRACK 2: "Dark Tech Suspense & Analog Pulse" (ColdFusion / Trent Reznor Style)
# ==============================================================================
def generate_track_2():
    print("Generating Track 2: Dark Tech Suspense...")
    left = np.zeros(SAMPLES, dtype=np.float32)
    right = np.zeros(SAMPLES, dtype=np.float32)

    bpm = 112
    beat_dur = 60.0 / bpm
    total_beats = int(DUR / beat_dur)

    # D minor / Bb / Gm / A
    roots = [73.42, 58.27, 49.0, 55.0]

    for b in range(total_beats):
        b_time = b * beat_dur
        root = roots[(b // 16) % len(roots)]

        # 16th-note analog clockwork synth sequence
        for sixteenth in range(4):
            note_time = b_time + sixteenth * (beat_dur * 0.25)
            idx0 = int(note_time * SR)
            note_len = int(0.12 * SR)
            idx1 = min(SAMPLES, idx0 + note_len)
            tn = np.arange(idx1 - idx0) / SR
            # Analog square/sawtooth pulse
            freq = root * (1.0 if sixteenth in [0, 2] else 1.5)
            pulse = 0.08 * (
                np.sin(2 * np.pi * freq * tn) +
                0.3 * np.sin(2 * np.pi * freq * 3 * tn)
            ) * np.exp(-tn * 28.0)
            pan = 0.4 if sixteenth % 2 == 0 else 0.6
            left[idx0:idx1] += pulse * (1 - pan)
            right[idx0:idx1] += pulse * pan

        # Heavy cinematic sub drone on bar start
        if b % 4 == 0:
            drone_len = int(4 * beat_dur * SR)
            idx0 = int(b_time * SR)
            idx1 = min(SAMPLES, idx0 + drone_len)
            td = np.arange(idx1 - idx0) / SR
            sub_drone = 0.26 * np.sin(2 * np.pi * (root * 0.5) * td) * np.sin(np.pi * np.clip(td / (4 * beat_dur), 0, 1))**1.2
            left[idx0:idx1] += sub_drone
            right[idx0:idx1] += sub_drone

        # Dark industrial tension sweep every 8 beats
        if b % 8 == 0:
            sweep_len = int(2.0 * SR)
            idx0 = int(b_time * SR)
            idx1 = min(SAMPLES, idx0 + sweep_len)
            ts = np.arange(idx1 - idx0) / SR
            sweep_f = 120.0 + 350.0 * np.exp(-ts * 1.5)
            sweep = 0.07 * np.sin(2 * np.pi * sweep_f * ts) * np.sin(np.pi * ts / 2.0)
            left[idx0:idx1] += sweep * 0.8
            right[idx0:idx1] += sweep * 1.2

    b_filt, a_filt = signal.butter(2, 1800 / (0.5 * SR), btype='low')
    left = signal.lfilter(b_filt, a_filt, left)
    right = signal.lfilter(b_filt, a_filt, right)
    return save_mp3(left, right, "bgm_option2_dark_tech_suspense.mp3")

# ==============================================================================
# TRACK 3: "Modern Ambient Momentum" (Vox / Johnny Harris Business Explainer)
# ==============================================================================
def generate_track_3():
    print("Generating Track 3: Modern Ambient Momentum...")
    left = np.zeros(SAMPLES, dtype=np.float32)
    right = np.zeros(SAMPLES, dtype=np.float32)

    bpm = 116
    beat_dur = 60.0 / bpm
    total_beats = int(DUR / beat_dur)

    # Chord progression: D -> A -> Bm -> G (Inspiring corporate momentum)
    chords = [
        [146.83, 220.0, 293.66, 369.99], # D
        [110.0, 220.0, 277.18, 329.63],  # A
        [123.47, 246.94, 293.66, 369.99],# Bm
        [98.00, 196.0, 246.94, 293.66],  # G
    ]

    for b in range(total_beats):
        b_time = b * beat_dur
        bar_pos = b % 4
        chord = chords[(b // 8) % len(chords)]

        # Warm acoustic kick on 0 and 2
        if bar_pos in [0, 2]:
            k_len = int(0.35 * SR)
            idx0 = int(b_time * SR)
            idx1 = min(SAMPLES, idx0 + k_len)
            tk = np.arange(idx1 - idx0) / SR
            k_f = 95 * np.exp(-22 * tk) + 48
            kick = 0.24 * np.sin(2 * np.pi * k_f * tk) * np.exp(-14 * tk)
            left[idx0:idx1] += kick
            right[idx0:idx1] += kick

        # Subtle hi-hat / shaker on every 8th note
        for eighth in range(2):
            shk_time = b_time + eighth * (beat_dur * 0.5)
            idx0 = int(shk_time * SR)
            shk_len = int(0.04 * SR)
            idx1 = min(SAMPLES, idx0 + shk_len)
            tshk = np.arange(idx1 - idx0) / SR
            shaker = 0.04 * (np.random.rand(len(tshk)) * 2 - 1) * np.exp(-tshk * 70)
            left[idx0:idx1] += shaker * 0.8
            right[idx0:idx1] += shaker * 1.1

        # Luminous Rhodes pad on chord changes
        if bar_pos == 0:
            pad_len = int(4 * beat_dur * SR)
            idx0 = int(b_time * SR)
            idx1 = min(SAMPLES, idx0 + pad_len)
            tp = np.arange(idx1 - idx0) / SR
            env = np.sin(np.pi * np.clip(tp / (4 * beat_dur), 0, 1))**1.3
            for f in chord:
                tone = 0.038 * (
                    np.sin(2 * np.pi * f * tp) +
                    0.2 * np.sin(2 * np.pi * f * 2 * tp)
                ) * env
                left[idx0:idx1] += tone * 0.95
                right[idx0:idx1] += tone * 1.05

    b_filt, a_filt = signal.butter(2, 2800 / (0.5 * SR), btype='low')
    left = signal.lfilter(b_filt, a_filt, left)
    right = signal.lfilter(b_filt, a_filt, right)
    return save_mp3(left, right, "bgm_option3_modern_ambient_momentum.mp3")

if __name__ == "__main__":
    p1 = generate_track_1()
    p2 = generate_track_2()
    p3 = generate_track_3()
    print("All 3 preview tracks generated successfully!")
