import asyncio
import edge_tts
import os
import subprocess
import wave
import json
from synthesize_english_audio import CHAPTERS_EN

SAMPLE_RATE = 48000
OUT_DIR = "zomato_audio_en"
os.makedirs(OUT_DIR, exist_ok=True)

CHAPTER_GAPS = [
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

sem = asyncio.Semaphore(2)

async def synth_with_words(cid: str, text: str):
    async with sem:
        mp3_path = os.path.join(OUT_DIR, f"{cid}.mp3")
        wav_path = os.path.join(OUT_DIR, f"{cid}.wav")
        for attempt in range(4):
            try:
                comm = edge_tts.Communicate(text, voice="en-US-AndrewNeural", rate="+14%", pitch="+0Hz", boundary="WordBoundary")
                words = []
                with open(mp3_path, "wb") as f_audio:
                    async for chunk in comm.stream():
                        if chunk["type"] == "audio":
                            f_audio.write(chunk["data"])
                        elif chunk["type"] == "WordBoundary":
                            words.append({
                                "offset": round(chunk["offset"] / 1e7, 3),
                                "duration": round(chunk["duration"] / 1e7, 3),
                                "text": chunk["text"],
                            })
                break
            except Exception as e:
                print(f"Retry {attempt+1} for {cid}: {e}")
                await asyncio.sleep(1.2)

        subprocess.run(
            ["ffmpeg", "-y", "-i", mp3_path, "-ar", str(SAMPLE_RATE), "-ac", "1", wav_path, "-loglevel", "error"],
            check=True,
        )
        with wave.open(wav_path, "rb") as wf:
            dur = wf.getnframes() / wf.getframerate()
        return cid, dur, words

async def main():
    tasks = [synth_with_words(cid, txt) for cid, txt in CHAPTERS_EN]
    res = await asyncio.gather(*tasks)
    by_id = {cid: (dur, words) for cid, dur, words in res}

    cur = 0.40
    master_map = []
    for cid, gap in CHAPTER_GAPS:
        cur += gap
        dur, words = by_id[cid]
        ch_start = round(cur, 3)
        ch_end = round(cur + dur, 3)
        global_words = [
            {
                "g": round(ch_start + w["offset"], 3),
                "loc": w["offset"],
                "w": w["text"],
            }
            for w in words
        ]
        master_map.append({
            "cid": cid,
            "start": ch_start,
            "end": ch_end,
            "dur": round(dur, 3),
            "words": global_words,
        })
        cur += dur

    total_dur = round(cur + 1.80, 3)
    with open("zomato_word_map.json", "w", encoding="utf-8") as f:
        json.dump({"totalDuration": total_dur, "chapters": master_map}, f, indent=2)

    print(f"TOTAL DURATION: {total_dur}s")
    # Print sentence-level readable map (grouping whenever gap between words >= 0.25s)
    for ch in master_map:
        print(f"\n==================== {ch['cid']} [{ch['start']:.2f}s -> {ch['end']:.2f}s] ====================")
        ws = ch["words"]
        if not ws:
            continue
        phrase_start = ws[0]["g"]
        buf = [ws[0]["w"]]
        for i in range(1, len(ws)):
            if ws[i]["g"] - ws[i - 1]["g"] >= 0.42:
                print(f"  [{phrase_start:6.2f}s] {' '.join(buf)}")
                phrase_start = ws[i]["g"]
                buf = [ws[i]["w"]]
            else:
                buf.append(ws[i]["w"])
        if buf:
            print(f"  [{phrase_start:6.2f}s] {' '.join(buf)}")

if __name__ == "__main__":
    asyncio.run(main())
