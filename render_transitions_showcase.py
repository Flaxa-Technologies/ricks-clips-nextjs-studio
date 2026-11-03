import asyncio
from playwright.async_api import async_playwright
import subprocess
import shutil
import time
import os

W, H = 1920, 1080
FPS = 30
TOTAL_DUR = 24.0
TOTAL_FRAMES = int(TOTAL_DUR * FPS)  # 720 frames

FRAMES_DIR = "frames_showcase"
OUT_MP4 = r"C:\Users\Prasad\Documents\acad\yt-3\motion_transitions_showcase.mp4"
DOWNLOADS_MP4 = r"C:\Users\Prasad\Downloads\motion_transitions_showcase.mp4"
ARTIFACT_MP4 = r"C:\Users\Prasad\.gemini\antigravity\brain\f560532f-ed21-4313-b2a4-a914435b8f6b\motion_transitions_showcase.mp4"
CONTACT_SHEET = r"C:\Users\Prasad\.gemini\antigravity\brain\f560532f-ed21-4313-b2a4-a914435b8f6b\transitions_showcase_grid.jpg"
AUDIO_SRC = r"C:\Users\Prasad\.gemini\antigravity\brain\f560532f-ed21-4313-b2a4-a914435b8f6b\bgm_option3_modern_ambient_momentum.mp3"


async def worker_task(wid: int, start_idx: int, end_idx: int, chrome_path: str, url: str):
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

        for _ in range(60):
            if await page.evaluate("() => typeof window.__setDocTime === 'function'"):
                break
            await page.wait_for_timeout(100)

        for f_idx in range(start_idx, end_idx):
            out_fp = os.path.join(FRAMES_DIR, f"frame_{f_idx + 1:05d}.jpg")
            t_sec = f_idx / FPS
            await page.evaluate(f"window.__setDocTime({t_sec:.6f})")
            await page.screenshot(path=out_fp, type="jpeg", quality=92)

        await browser.close()


async def main():
    os.makedirs(FRAMES_DIR, exist_ok=True)

    server = subprocess.Popen(
        "bun run preview --port 3007",
        cwd=r"C:\Users\Prasad\Documents\acad\yt-3\blinkit-reel",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        shell=True,
    )
    time.sleep(2.0)

    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    url = "http://localhost:3007/?showcase=1"

    try:
        # Re-render only the two scenes where springODE.value was updated (120..240 and 360..480)
        await asyncio.gather(
            worker_task(1, 120, 240, chrome_path, url),
            worker_task(3, 360, 480, chrome_path, url),
        )

        cmd = [
            "ffmpeg", "-y",
            "-framerate", str(FPS),
            "-i", f"{FRAMES_DIR}/frame_%05d.jpg",
            "-i", AUDIO_SRC,
            "-t", str(TOTAL_DUR),
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "16",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            "-c:a", "aac",
            "-b:a", "256k",
            OUT_MP4,
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        shutil.copy2(OUT_MP4, DOWNLOADS_MP4)
        shutil.copy2(OUT_MP4, ARTIFACT_MP4)

        # Generate 8-panel high-res contact sheet across all key scenes
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", OUT_MP4,
                "-vf", "fps=1/2.8,scale=640:360,tile=2x4",
                "-q:v", "2",
                CONTACT_SHEET,
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        print(f"SUCCESS: Updated {OUT_MP4} and {CONTACT_SHEET}", flush=True)
    finally:
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(server.pid)], capture_output=True)


if __name__ == "__main__":
    asyncio.run(main())
