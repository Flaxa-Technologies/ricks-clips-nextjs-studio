import numpy as np
import wave
import subprocess
import os

OUT_DIR = r"C:\Users\Prasad\Documents\acad\yt-3\blinkit-reel\public\audio\music_previews"
BRAIN_DIR = r"C:\Users\Prasad\.gemini\antigravity\brain\f560532f-ed21-4313-b2a4-a914435b8f6b"
HOOK_WAV = r"C:\Users\Prasad\Documents\acad\yt-3\blinkit-reel\public\audio\chapters\ch01_hook.wav"

def mix_demo(bgm_filename, out_filename):
    bgm_path = os.path.join(OUT_DIR, bgm_filename)
    out_mp3 = os.path.join(OUT_DIR, out_filename)
    brain_mp3 = os.path.join(BRAIN_DIR, out_filename)
    
    # Mix using FFmpeg with amix / volume filters
    # Duck BGM to -18 dB (0.12 volume) under narration (1.0 volume)
    cmd = [
        "ffmpeg", "-y",
        "-i", HOOK_WAV,
        "-i", bgm_path,
        "-filter_complex",
        "[1:a]volume=0.15[bgm];[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[out]",
        "-map", "[out]",
        "-c:a", "mp3",
        "-b:a", "320k",
        out_mp3
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    subprocess.run(["ffmpeg", "-y", "-i", out_mp3, "-c:a", "mp3", "-b:a", "320k", brain_mp3], capture_output=True, check=True)
    print(f"Generated voice mix: {out_mp3}")

mix_demo("bgm_option1_felt_piano_investigative.mp3", "bgm_test_with_voice_option1.mp3")
mix_demo("bgm_option2_dark_tech_suspense.mp3", "bgm_test_with_voice_option2.mp3")
mix_demo("bgm_option3_modern_ambient_momentum.mp3", "bgm_test_with_voice_option3.mp3")
print("All 3 voice+music demos mixed successfully!")
