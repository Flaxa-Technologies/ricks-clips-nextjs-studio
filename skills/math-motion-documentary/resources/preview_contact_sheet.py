import asyncio
from playwright.async_api import async_playwright
import os
from PIL import Image

OUT_DIR = "preview_zomato_v3"
os.makedirs(OUT_DIR, exist_ok=True)

CAPTURES = [
    ("01_hook_20min_phone", 8.8),
    ("02_330k_crore_empire", 19.8),
    ("03_one_paper_menu_dark", 33.2),
    ("04_scanner_foodiebay", 64.5),
    ("05_zomato_rebrand_hero", 98.4),
    ("06_80pct_margin_wheel", 118.6),
    ("07_four_rivals_color", 145.8),
    ("08_200_pizza_burn", 159.4),
    ("09_slaughter_before_color", 189.2),
    ("10_slaughter_after_bw", 209.6),
    ("11_growth_race_55pct_chart", 222.2),
    ("12_covid_70pct_plunge", 234.8),
    ("13_ipo_gong_bell", 264.0),
    ("14_candlestick_crash_41", 286.0),
    ("15_dunzo_bw_blinkit_42pct", 350.2),
    ("16_eternal_four_engines", 393.0),
]

async def main():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    url = "http://localhost:3000/render-documentary"

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=chrome_path,
            headless=True,
            args=[
                "--use-gl=angle",
                "--use-angle=d3d11",
                "--enable-webgl",
                "--ignore-gpu-blocklist",
            ],
        )
        page = await browser.new_page(viewport={"width": 1920, "height": 1080, "deviceScaleFactor": 1})
        print("Navigating to /render-documentary...")
        await page.goto(url, wait_until="networkidle")
        await page.evaluate("() => document.fonts.ready")

        for _ in range(80):
            ready = await page.evaluate("() => window.__docReady === true")
            if ready:
                break
            await page.wait_for_timeout(250)

        print("Stage Ready! Capturing 16 redesigned verification stills...")
        stills = []
        for name, t_sec in CAPTURES:
            await page.evaluate(f"window.__setDocTime({t_sec:.3f})")
            await page.wait_for_timeout(120)
            out_fp = os.path.join(OUT_DIR, f"{name}.jpg")
            await page.screenshot(path=out_fp, type="jpeg", quality=95)
            print(f"Captured {name} at t={t_sec:.1f}s")
            stills.append(out_fp)

        await browser.close()

    print("Generating 4x4 HD visual verification contact sheet...")
    sheet = Image.new("RGB", (1920, 1080), (14, 14, 17))
    cols, rows = 4, 4
    cw = (1920 - 50) // cols
    ch = (1080 - 50) // rows

    for idx, fp in enumerate(stills[:16]):
        c = idx % cols
        r = idx // cols
        x = 10 + c * (cw + 10)
        y = 10 + r * (ch + 10)
        im = Image.open(fp)
        im.thumbnail((cw, ch), Image.Resampling.LANCZOS)
        sheet.paste(im, (x, y))

    sheet_out = os.path.join(OUT_DIR, "contact_sheet_zomato_v3.jpg")
    sheet.save(sheet_out, quality=95)
    sheet.save(r"C:\Users\Prasad\.gemini\antigravity\brain\f560532f-ed21-4313-b2a4-a914435b8f6b\contact_sheet_zomato_documentary.jpg", quality=95)
    print(f"Contact sheet saved to {sheet_out}")

if __name__ == "__main__":
    asyncio.run(main())
