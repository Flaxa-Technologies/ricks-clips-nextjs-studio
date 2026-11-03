import asyncio
from playwright.async_api import async_playwright
import subprocess
import shutil
import time
import os

W, H = 1920, 1080
FPS = 30
TOTAL_DUR = 433.27
TOTAL_FRAMES = int(TOTAL_DUR * FPS)  # 12998 frames
NUM_WORKERS = 6

FRAMES_DIR = "frames_zomato_documentary_en"
OUT_MP4 = "zomato_documentary_masterpiece.mp4"
AUDIO_WAV = "zomato_master_audio.wav"

async def worker_task(wid: int, start_idx: int, end_idx: int, chrome_path: str, url: str):
    count_total = end_idx - start_idx
    print(f"[Worker {wid}] Assigned frames {start_idx}..{end_idx - 1} ({count_total} frames)", flush=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=chrome_path,
            headless=True,
            args=[
                "--use-gl=angle",
                "--use-angle=d3d11",
                "--enable-webgl",
                "--ignore-gpu-blocklist",
                "--disable-gpu-vsync",
            ],
        )
        page = await browser.new_page(viewport={"width": W, "height": H, "deviceScaleFactor": 1})
        await page.goto(url, wait_until="networkidle")
        await page.evaluate("() => document.fonts.ready")

        for _ in range(80):
            if await page.evaluate("() => window.__docReady === true"):
                break
            await page.wait_for_timeout(250)

        print(f"[Worker {wid}] Next.js + Three.js PBR stage ready.", flush=True)
        t0 = time.time()
        done = 0

        for f_idx in range(start_idx, end_idx):
            out_fp = os.path.join(FRAMES_DIR, f"frame_{f_idx + 1:05d}.jpg")
            if os.path.exists(out_fp) and os.path.getsize(out_fp) > 8000:
                continue

            t_sec = f_idx / FPS
            await page.evaluate(f"window.__setDocTime({t_sec:.6f})")
            await page.screenshot(path=out_fp, type="jpeg", quality=92)
            done += 1

            if done % 200 == 0:
                el = time.time() - t0
                fps_rate = done / el if el > 0 else 0
                pct = int(((f_idx - start_idx + 1) / count_total) * 100)
                print(
                    f"[Worker {wid}] {f_idx - start_idx + 1}/{count_total} ({pct}%) | t={t_sec:.1f}s | {fps_rate:.1f} fps",
                    flush=True,
                )

        await browser.close()
        print(f"[Worker {wid}] Complete in {time.time() - t0:.1f}s.", flush=True)

async def main():
    if os.path.exists(FRAMES_DIR):
        shutil.rmtree(FRAMES_DIR)
    os.makedirs(FRAMES_DIR, exist_ok=True)

    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    url = "http://localhost:3000/render-documentary"

    print("==================================================================", flush=True)
    print("   ZOMATO GROWTH DOCUMENTARY: FAST-PACED ENGLISH MASTER RENDER    ", flush=True)
    print(f"  1920x1080 @ {FPS}fps | {TOTAL_FRAMES} Frames ({TOTAL_DUR}s) | {NUM_WORKERS} Workers", flush=True)
    print("==================================================================", flush=True)

    t_start = time.time()
    chunk = TOTAL_FRAMES // NUM_WORKERS
    tasks = []
    for w in range(NUM_WORKERS):
        s = w * chunk
        e = TOTAL_FRAMES if w == NUM_WORKERS - 1 else (w + 1) * chunk
        tasks.append(worker_task(w, s, e, chrome_path, url))

    await asyncio.gather(*tasks)
    print(f"All workers finished in {time.time() - t_start:.1f}s!", flush=True)

    # Missing frame recovery loop
    missing = [
        f for f in range(1, TOTAL_FRAMES + 1)
        if not os.path.exists(os.path.join(FRAMES_DIR, f"frame_{f:05d}.jpg"))
        or os.path.getsize(os.path.join(FRAMES_DIR, f"frame_{f:05d}.jpg")) < 5000
    ]
    if missing:
        print(f"Recovering {len(missing)} missing frames...", flush=True)
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                executable_path=chrome_path,
                headless=True,
                args=["--use-gl=angle", "--use-angle=d3d11", "--enable-webgl", "--ignore-gpu-blocklist"],
            )
            page = await browser.new_page(viewport={"width": W, "height": H, "deviceScaleFactor": 1})
            await page.goto(url, wait_until="networkidle")
            await page.evaluate("() => document.fonts.ready")
            for _ in range(80):
                if await page.evaluate("() => window.__docReady === true"):
                    break
                await page.wait_for_timeout(250)
            for f in missing:
                await page.evaluate(f"window.__setDocTime({(f - 1) / FPS:.6f})")
                await page.screenshot(path=os.path.join(FRAMES_DIR, f"frame_{f:05d}.jpg"), type="jpeg", quality=92)
            await browser.close()
        print("Missing frame recovery complete!", flush=True)

    print("Muxing H.264 High Profile + 320kbps Stereo AAC via FFmpeg...", flush=True)
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", f"{FRAMES_DIR}/frame_%05d.jpg",
        "-i", AUDIO_WAV,
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "16",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "320k",
        "-shortest",
        OUT_MP4,
    ]
    subprocess.run(cmd, check=True)
    size_mb = os.path.getsize(OUT_MP4) / (1024 * 1024)
    print(f"SUCCESS: Rendered {OUT_MP4} ({size_mb:.2f} MB)", flush=True)

    pub_dest = os.path.join("motion-reel", "public", OUT_MP4)
    shutil.copy2(OUT_MP4, pub_dest)
    print(f"Copied to Next.js public: {pub_dest}", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
