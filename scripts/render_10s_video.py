import os
import math
import struct
import wave
import subprocess
from PIL import Image, ImageDraw, ImageFont

W, H = 720, 1280
FPS = 30
TOTAL_FRAMES = 300

SUBTITLES = [
    (0, 11, "He sawed", False),
    (12, 26, "gaps", True),
    (27, 37, "into a", False),
    (38, 50, "railroad", True),
    (51, 76, "every 39", True),
    (77, 96, "feet.", False),
    (97, 102, "You", False),
    (103, 111, "see,", False),
    (112, 120, "two", False),
    (121, 132, "companies", True),
    (133, 140, "are", False),
    (141, 151, "racing", True),
    (152, 156, "to", False),
    (157, 164, "build", False),
    (165, 168, "a", False),
    (169, 181, "railroad", True),
    (182, 191, "along", False),
    (192, 204, "a canyon", True),
    (205, 219, "so deep", True),
    (220, 226, "you", False),
    (227, 233, "can't", False),
    (234, 241, "see the", False),
    (242, 253, "bottom.", True),
    (254, 261, "And", False),
    (262, 272, "whoever", False),
    (273, 283, "finishes", False),
    (284, 292, "first", True),
    (293, 300, "gets it all!", True),
]


def lerp(a, b, t):
    t = max(0.0, min(1.0, t))
    return a + (b - a) * t


def smoothstep(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)


def load_font(size):
    for font_name in ["arialbd.ttf", "impact.ttf", "calibrib.ttf", "segoeui.ttf"]:
        try:
            return ImageFont.truetype(font_name, size)
        except Exception:
            pass
    return ImageFont.load_default()


FONT_SUB_CACHE = {}


def get_sub_font(size):
    if size not in FONT_SUB_CACHE:
        FONT_SUB_CACHE[size] = load_font(size)
    return FONT_SUB_CACHE[size]


FONT_HUD = load_font(22)
FONT_HUD_SM = load_font(18)
FONT_BANNER = load_font(38)


def draw_cartoon_character(
    draw,
    cx,
    cy,
    scale,
    role="engineer",
    brow_angle=0.25,
    eye_state="smug",
    mouth_state="talk_open",
    saw_phase=0.0,
    walk_phase=0.0,
    lean=0.0,
    spark_intensity=0.0,
):
    """
    Draws the signature @RicksClips3000 2.5D cartoon character:
    - Thick #231F20 ink outlines
    - White circular head with cel-shaded shadow crescent
    - Expressive animated eyebrows, eyes, and lip-synced mouth
    - Pill-shaped cel-shaded torso + role clothing (striped cap, teal vest, top hat)
    - Rubber-hose stick legs and arms with props (hacksaw + sparks, cane, etc.)
    """
    ink = (35, 31, 32)
    outline_w = max(3, int(6 * scale))
    limb_w = max(4, int(9 * scale))

    # Ground contact shadow
    sh_rx = int(68 * scale)
    sh_ry = int(18 * scale)
    draw.ellipse(
        [cx - sh_rx, cy - sh_ry, cx + sh_rx, cy + sh_ry],
        fill=(15, 18, 28, 120),
    )

    # Rubber-hose legs
    hip_y = int(cy - 105 * scale)
    leg_swing = math.sin(walk_phase) * 22 * scale
    l_foot_x = int(cx - 24 * scale + leg_swing)
    r_foot_x = int(cx + 24 * scale - leg_swing)

    draw.line([cx - int(20 * scale), hip_y, l_foot_x, cy], fill=ink, width=limb_w)
    draw.line([l_foot_x, cy, l_foot_x - int(18 * scale), cy], fill=ink, width=limb_w)

    draw.line([cx + int(20 * scale), hip_y, r_foot_x, cy], fill=ink, width=limb_w)
    draw.line([r_foot_x, cy, r_foot_x + int(18 * scale), cy], fill=ink, width=limb_w)

    # Pill Torso
    torso_cx = int(cx + lean * 42 * scale)
    torso_cy = int(cy - 168 * scale)
    tw = int(52 * scale)
    th = int(68 * scale)

    if role == "engineer":
        torso_color = (20, 184, 166)  # Teal vest
    elif role == "plank_worker":
        torso_color = (180, 83, 9)  # Rust shirt
    else:
        torso_color = (30, 27, 75)  # Tycoon coat

    draw.rounded_rectangle(
        [torso_cx - tw, torso_cy - th, torso_cx + tw, torso_cy + th],
        radius=int(36 * scale),
        fill=torso_color,
        outline=ink,
        width=outline_w,
    )

    # Clothing details on torso
    if role == "engineer":
        # Suspenders
        susp_w = max(2, int(10 * scale))
        draw.line(
            [torso_cx - int(22 * scale), torso_cy - th + 6, torso_cx - int(22 * scale), torso_cy + th - 6],
            fill=(15, 118, 110),
            width=susp_w,
        )
        draw.line(
            [torso_cx + int(22 * scale), torso_cy - th + 6, torso_cx + int(22 * scale), torso_cy + th - 6],
            fill=(15, 118, 110),
            width=susp_w,
        )
        # Red bandana triangle at collar
        draw.polygon(
            [
                (torso_cx - int(24 * scale), torso_cy - th + 4),
                (torso_cx + int(24 * scale), torso_cy - th + 4),
                (torso_cx, torso_cy - int(18 * scale)),
            ],
            fill=(220, 38, 38),
            outline=ink,
        )
    elif role == "tycoon":
        # Gold waistcoat & white tie
        draw.rounded_rectangle(
            [torso_cx - int(24 * scale), torso_cy - int(35 * scale), torso_cx + int(24 * scale), torso_cy + th - 6],
            radius=int(10 * scale),
            fill=(234, 179, 8),
            outline=ink,
            width=max(2, int(4 * scale)),
        )

    # Circular White Cartoon Head
    head_cx = int(torso_cx + lean * 28 * scale + saw_phase * 10 * scale)
    head_cy = int(torso_cy - 122 * scale)
    hrx = int(78 * scale)
    hry = int(70 * scale)

    # Base shadow tint
    draw.ellipse(
        [head_cx - hrx, head_cy - hry, head_cx + hrx, head_cy + hry],
        fill=(218, 224, 232),
        outline=ink,
        width=outline_w,
    )
    # Main bright white inner oval shifted slightly upper-right for cel-shaded rim
    draw.ellipse(
        [
            head_cx - hrx + int(10 * scale),
            head_cy - hry + int(4 * scale),
            head_cx + hrx - int(3 * scale),
            head_cy + hry - int(8 * scale),
        ],
        fill=(253, 253, 253),
    )
    # Re-stroke outer head outline cleanly
    draw.ellipse(
        [head_cx - hrx, head_cy - hry, head_cx + hrx, head_cy + hry],
        outline=ink,
        width=outline_w,
    )

    # Eyes & Eyebrows
    eye_y = int(head_cy - 4 * scale)
    lex = int(head_cx - 22 * scale)
    rex = int(head_cx + 24 * scale)
    er = max(3, int(8 * scale))

    # Eyebrows
    brow_tilt = int(brow_angle * 16 * scale)
    draw.line(
        [lex - int(14 * scale), eye_y - int(18 * scale) - brow_tilt, lex + int(12 * scale), eye_y - int(18 * scale) + brow_tilt],
        fill=ink,
        width=max(3, int(7 * scale)),
    )
    draw.line(
        [rex - int(12 * scale), eye_y - int(18 * scale) + brow_tilt, rex + int(14 * scale), eye_y - int(18 * scale) - brow_tilt],
        fill=ink,
        width=max(3, int(7 * scale)),
    )

    if eye_state == "squint":
        # >< squinting eyes
        draw.line([lex - er, eye_y - er, lex + er, eye_y], fill=ink, width=max(2, int(5 * scale)))
        draw.line([lex + er, eye_y, lex - er, eye_y + er], fill=ink, width=max(2, int(5 * scale)))
        draw.line([rex + er, eye_y - er, rex - er, eye_y], fill=ink, width=max(2, int(5 * scale)))
        draw.line([rex - er, eye_y, rex + er, eye_y + er], fill=ink, width=max(2, int(5 * scale)))
    elif eye_state == "wink":
        draw.ellipse([lex - er, eye_y - er, lex + er, eye_y + er], fill=ink)
        draw.arc([rex - er, eye_y - er, rex + er, eye_y + er], 190, 350, fill=ink, width=max(2, int(5 * scale)))
    else:
        for ex in (lex, rex):
            draw.ellipse([ex - er, eye_y - er, ex + er, eye_y + er], fill=ink)
            if eye_state == "smug":
                draw.line([ex - er - 2, eye_y - int(er * 0.6), ex + er + 2, eye_y - int(er * 0.6)], fill=ink, width=max(2, int(5 * scale)))

    # Mouth viseme
    my = int(head_cy + 26 * scale)
    if mouth_state == "talk_open":
        mw, mh = int(16 * scale), int(9 * scale)
        draw.ellipse([head_cx - mw, my - mh, head_cx + mw, my + mh], fill=ink)
        draw.rectangle([head_cx - mw + 3, my - mh + 2, head_cx + mw - 3, my], fill=(255, 255, 255))
    elif mouth_state == "o_gasp":
        r_m = int(9 * scale)
        draw.ellipse([head_cx - r_m, my - r_m, head_cx + r_m, my + r_m], fill=ink)
    else:
        draw.arc(
            [head_cx - int(18 * scale), my - int(10 * scale), head_cx + int(18 * scale), my + int(10 * scale)],
            10,
            165,
            fill=ink,
            width=max(2, int(5 * scale)),
        )

    # Role Hats
    hat_y = int(head_cy - hry + 8 * scale)
    if role == "engineer":
        # Blue & White Striped Engineer Cap
        hw = int(76 * scale)
        hh = int(34 * scale)
        draw.ellipse(
            [head_cx - hw, hat_y - hh, head_cx + hw, hat_y + int(14 * scale)],
            fill=(30, 58, 138),
            outline=ink,
            width=outline_w,
        )
        for sx in range(-hw + int(14 * scale), hw, max(6, int(14 * scale))):
            draw.line(
                [head_cx + sx, hat_y - hh + int(6 * scale), head_cx + sx, hat_y + int(6 * scale)],
                fill=(241, 245, 249),
                width=max(2, int(5 * scale)),
            )
        # Visor brim
        draw.ellipse(
            [head_cx - int(65 * scale), hat_y, head_cx + int(82 * scale), hat_y + int(18 * scale)],
            fill=(15, 23, 42),
            outline=ink,
            width=max(2, int(4 * scale)),
        )
    elif role == "plank_worker":
        hw = int(72 * scale)
        hh = int(32 * scale)
        draw.pieslice(
            [head_cx - hw, hat_y - hh, head_cx + hw, hat_y + hh],
            180,
            360,
            fill=(226, 213, 181),
            outline=ink,
            width=outline_w,
        )
    elif role == "tycoon":
        # Tall Black Top Hat with Gold Band
        tw_hat = int(56 * scale)
        th_hat = int(78 * scale)
        draw.rectangle(
            [head_cx - tw_hat, hat_y - th_hat, head_cx + tw_hat, hat_y],
            fill=(24, 24, 27),
            outline=ink,
            width=outline_w,
        )
        draw.rectangle(
            [head_cx - tw_hat, hat_y - int(18 * scale), head_cx + tw_hat, hat_y - int(4 * scale)],
            fill=(234, 179, 8),
            outline=ink,
            width=max(2, int(3 * scale)),
        )
        draw.ellipse(
            [head_cx - int(84 * scale), hat_y - int(8 * scale), head_cx + int(84 * scale), hat_y + int(10 * scale)],
            fill=(24, 24, 27),
            outline=ink,
            width=outline_w,
        )

    # Rubber-Hose Arms & Hacksaw Prop (when role == engineer and lean > 0.1)
    if role == "engineer" and lean > 0.15:
        saw_dx = int(saw_phase * 28 * scale)
        hand_x = int(torso_cx + 75 * scale + saw_dx)
        hand_y = int(cy - 52 * scale)
        # Arms
        draw.line([torso_cx + int(15 * scale), torso_cy - int(15 * scale), hand_x, hand_y], fill=ink, width=limb_w)
        draw.line([torso_cx - int(10 * scale), torso_cy, hand_x - int(18 * scale), hand_y + int(6 * scale)], fill=ink, width=limb_w)

        # Hacksaw frame straddling the rail
        saw_w = int(115 * scale)
        saw_h = int(42 * scale)
        draw.line([hand_x, hand_y, hand_x, hand_y - saw_h], fill=(234, 88, 12), width=max(3, int(8 * scale)))
        draw.line([hand_x, hand_y - saw_h, hand_x + saw_w, hand_y - saw_h + int(10 * scale)], fill=ink, width=max(3, int(7 * scale)))
        draw.line([hand_x + saw_w, hand_y - saw_h + int(10 * scale), hand_x + saw_w, hand_y + int(12 * scale)], fill=ink, width=max(3, int(7 * scale)))
        # Saw blade inside rail gap
        draw.line([hand_x, hand_y, hand_x + saw_w, hand_y + int(12 * scale)], fill=(251, 146, 60), width=max(2, int(4 * scale)))

        # Sparks at rail cut
        if spark_intensity > 0.1:
            sx = hand_x + int(saw_w * 0.48)
            sy = hand_y + int(6 * scale)
            for ang in range(0, 360, 45):
                rad = math.radians(ang + saw_phase * 40)
                r_len = int((14 + (ang % 3) * 8) * spark_intensity * scale)
                draw.line(
                    [sx, sy, sx + int(math.cos(rad) * r_len), sy + int(math.sin(rad) * r_len)],
                    fill=(254, 240, 138),
                    width=max(2, int(4 * scale)),
                )


def draw_locomotive(draw, cx, cy, scale, frame):
    """Draws the oncoming 3D-styled steam locomotive with smoke plume and glowing headlamp"""
    ink = (24, 24, 27)
    r_boiler = int(68 * scale)

    # Volumetric smoke plume rising from stack
    for i in range(6):
        puff_age = ((frame * 0.08 + i * 0.4) % 2.2)
        px = cx + int(math.sin(frame * 0.07 + i) * 18 * scale)
        py = int(cy - (135 + puff_age * 110) * scale)
        pr = int((26 + puff_age * 28) * scale)
        c_val = max(20, min(65, int(25 + puff_age * 18)))
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=(c_val, c_val, c_val + 5))

    # Smokestack
    draw.polygon(
        [
            (cx - int(18 * scale), cy - int(65 * scale)),
            (cx + int(18 * scale), cy - int(65 * scale)),
            (cx + int(28 * scale), cy - int(135 * scale)),
            (cx - int(28 * scale), cy - int(135 * scale)),
        ],
        fill=(39, 39, 42),
        outline=ink,
        width=max(2, int(4 * scale)),
    )

    # Engineer Cab
    cab_w = int(92 * scale)
    cab_h = int(85 * scale)
    draw.rectangle(
        [cx - cab_w, cy - cab_h, cx + cab_w, cy + int(35 * scale)],
        fill=(31, 41, 55),
        outline=ink,
        width=max(2, int(4 * scale)),
    )

    # Cylindrical Boiler Front
    draw.ellipse(
        [cx - r_boiler, cy - r_boiler, cx + r_boiler, cy + r_boiler],
        fill=(24, 24, 27),
        outline=(63, 63, 70),
        width=max(2, int(5 * scale)),
    )

    # Red Cowcatcher at bottom
    draw.polygon(
        [
            (cx - int(82 * scale), cy + int(45 * scale)),
            (cx + int(82 * scale), cy + int(45 * scale)),
            (cx + int(105 * scale), cy + int(95 * scale)),
            (cx - int(105 * scale), cy + int(95 * scale)),
        ],
        fill=(220, 38, 38),
        outline=ink,
        width=max(2, int(4 * scale)),
    )
    # Grill bars on cowcatcher
    for gx in range(-75, 80, 18):
        draw.line(
            [cx + int(gx * scale), cy + int(48 * scale), cx + int(gx * 1.15 * scale), cy + int(92 * scale)],
            fill=(127, 29, 29),
            width=max(1, int(3 * scale)),
        )

    # Brass #7 Medallion
    r_med = max(4, int(16 * scale))
    draw.ellipse([cx - r_med, cy - r_med, cx + r_med, cy + r_med], fill=(234, 179, 8), outline=ink, width=2)

    # Glowing Headlamp
    hl_y = int(cy - 54 * scale)
    r_glow = max(8, int(34 * scale))
    draw.ellipse([cx - r_glow, hl_y - r_glow, cx + r_glow, hl_y + r_glow], fill=(253, 224, 71))
    r_core = max(4, int(18 * scale))
    draw.ellipse([cx - r_core, hl_y - r_core, cx + r_core, hl_y + r_core], fill=(255, 255, 240))


def render_beat_1(img, draw, frame):
    """Beat 1 (f0-59): Low-angle rail-level dolly push-in on Engineer sawing rail gap with oncoming train"""
    t = smoothstep(frame / 59.0)

    # Canyon tunnel background
    draw.rectangle([0, 0, W, H], fill=(124, 45, 18))
    # Stratified canyon rock bands on left wall
    for i, col in enumerate([(185, 28, 28), (234, 88, 12), (153, 27, 27), (217, 119, 6)]):
        y0 = 80 + i * 145
        draw.polygon([(0, y0), (340, y0 + 95), (340, y0 + 210), (0, y0 + 165)], fill=col)

    # Dark tunnel portal in center-right background
    vanish_x = int(lerp(525, 545, t))
    vanish_y = int(lerp(560, 535, t))
    portal_w = int(lerp(135, 175, t))
    portal_h = int(lerp(185, 235, t))
    draw.rounded_rectangle(
        [vanish_x - portal_w, vanish_y - portal_h, vanish_x + portal_w, vanish_y + 20],
        radius=45,
        fill=(18, 20, 28),
        outline=(68, 32, 24),
        width=8,
    )

    # Roadbed gravel ballast trapezoid
    draw.polygon(
        [
            (vanish_x - 95, vanish_y),
            (vanish_x + 95, vanish_y),
            (W + 220, H),
            (-260, H),
        ],
        fill=(120, 102, 92),
    )

    # Perspective wooden sleepers/ties
    for i in range(1, 20):
        depth = (i / 19.0) ** 1.85
        ty = int(lerp(vanish_y + 10, H - 15, depth))
        half_w = int(lerp(65, 430, depth))
        center_x = int(lerp(vanish_x, W * 0.44, depth))
        th = max(3, int(lerp(3, 24, depth)))
        draw.rectangle(
            [center_x - half_w, ty - th // 2, center_x + half_w, ty + th // 2],
            fill=(108, 84, 70),
            outline=(58, 42, 34),
            width=2,
        )

    # Right rail
    draw.polygon(
        [
            (vanish_x + 38, vanish_y),
            (vanish_x + 46, vanish_y),
            (W + 65, H),
            (W + 25, H),
        ],
        fill=(148, 163, 184),
    )

    # Left rail (with physical sawed gap at y ~ 880)
    rail_top_x = vanish_x - 38
    rail_bot_x = 65
    gap_t = lerp(0.58, 0.66, t)
    gap_x = int(lerp(rail_top_x, rail_bot_x, gap_t))
    gap_y = int(lerp(vanish_y, H, gap_t))

    # Upper segment of left rail
    draw.line([rail_top_x, vanish_y, gap_x + 8, gap_y - 10], fill=(217, 119, 6), width=16)
    draw.line([rail_top_x + 4, vanish_y, gap_x + 12, gap_y - 10], fill=(241, 245, 249), width=5)

    # Lower foreground segment of left rail
    draw.line([gap_x - 8, gap_y + 12, rail_bot_x, H], fill=(217, 119, 6), width=26)
    draw.line([gap_x - 2, gap_y + 12, rail_bot_x + 8, H], fill=(241, 245, 249), width=8)

    # Dark physical gap cut
    draw.ellipse([gap_x - 14, gap_y - 10, gap_x + 14, gap_y + 10], fill=(15, 23, 42))

    # Oncoming Steam Locomotive growing larger in tunnel
    train_scale = lerp(0.52, 0.82, frame / 59.0)
    draw_locomotive(draw, vanish_x, vanish_y - int(55 * train_scale), train_scale, frame)

    # 2.5D Rigged Cartoon Engineer sawing the rail gap
    saw_wave = math.sin(frame * 0.65)
    spark_int = max(0.0, (saw_wave - 0.15) * 1.3)
    char_scale = lerp(1.02, 1.24, t)
    draw_cartoon_character(
        draw,
        cx=gap_x - int(105 * char_scale),
        cy=gap_y + int(35 * char_scale),
        scale=char_scale,
        role="engineer",
        brow_angle=0.28,
        eye_state="smug",
        mouth_state="talk_open" if (frame % 6 < 3) else "closed_smirk",
        saw_phase=saw_wave,
        lean=0.45,
        spark_intensity=spark_int,
    )


def render_beat_2(img, draw, frame):
    """Beat 2 (f60-119): 180° Canyon Orbit & Locomotive Doppler Pass"""
    local_f = frame - 60
    t = smoothstep(local_f / 59.0)

    # Sky and deep blue canyon abyss on left as camera orbits
    draw.rectangle([0, 0, W, H], fill=(56, 189, 248))
    # Deep blue canyon chasm on left side
    cliff_split_x = int(lerp(W + 80, 250, smoothstep(min(1.0, local_f / 26.0))))
    draw.polygon([(0, 520), (cliff_split_x, 540), (140, H), (0, H)], fill=(29, 78, 216))

    # Terracotta canyon ledge & track bed
    draw.polygon(
        [(cliff_split_x - 30, 540), (W, 520), (W, H), (80, H)],
        fill=(234, 88, 12),
    )

    # Stratified bright orange-red cliff wall on right
    wall_x = int(lerp(80, 440, smoothstep(min(1.0, local_f / 24.0))))
    draw.polygon([(wall_x, 0), (W, 0), (W, 820), (wall_x, 560)], fill=(249, 115, 22))
    draw.polygon([(wall_x, 180), (W, 80), (W, 340), (wall_x, 360)], fill=(220, 38, 38))

    # Perspective railroad tracks receding into distance
    if local_f >= 14:
        vx, vy = 355, 545
        for i in range(1, 16):
            d = (i / 15.0) ** 1.7
            ty = int(lerp(vy, H, d))
            tx = int(lerp(vx, 190, d))
            hw = int(lerp(20, 210, d))
            draw.line([tx - hw, ty, tx + hw, ty], fill=(108, 84, 70), width=max(2, int(12 * d)))
        draw.line([vx - 10, vy, 40, H], fill=(203, 213, 225), width=10)
        draw.line([vx + 10, vy, 310, H], fill=(203, 213, 225), width=10)

    # Cartoon Engineer standing proudly then squinting as train roars past
    char_x = int(lerp(360, 430, t))
    char_y = int(lerp(840, 880, t))
    squinting = 32 <= local_f <= 50
    draw_cartoon_character(
        draw,
        cx=char_x,
        cy=char_y,
        scale=1.05,
        role="engineer",
        brow_angle=-0.2 if squinting else 0.2,
        eye_state="squint" if squinting else "smug",
        mouth_state="talk_open" if (local_f % 5 < 3) else "closed_smirk",
        walk_phase=local_f * 0.35,
        lean=0.0,
    )

    # Foreground Locomotive roaring past left side of frame at f92-115
    if 28 <= local_f <= 54:
        lt = (local_f - 28) / 26.0
        train_x = int(lerp(-120, 210, math.sin(lt * math.pi)))
        train_y = int(lerp(980, 560, lt))
        draw_locomotive(draw, train_x, train_y, 1.55, frame)


def render_beat_3(img, draw, frame):
    """Beat 3 (f120-179): High-Altitude Abyss Crane Pullback ('two companies are racing to build a railroad')"""
    local_f = frame - 120
    t = smoothstep(local_f / 59.0)

    # Sky + Cobalt Blue Canyon Abyss
    draw.rectangle([0, 0, W, 430], fill=(96, 165, 250))
    draw.rectangle([0, 430, W, H], fill=(29, 78, 216))

    # Left and Right Towering Stratified Canyon Cliffs
    left_edge = int(lerp(220, 165, t))
    right_edge = int(lerp(540, 585, t))

    draw.polygon([(0, 390), (left_edge, 420), (left_edge - 40, H), (0, H)], fill=(153, 27, 27))
    draw.polygon([(W, 380), (right_edge, 420), (right_edge + 35, H), (W, H)], fill=(234, 88, 12))

    # Horizontal strata lines on canyon walls
    for sy in range(450, H, 45):
        draw.line([0, sy, left_edge - 15, sy + 12], fill=(180, 53, 95), width=4)
        draw.line([right_edge + 10, sy, W, sy - 18], fill=(251, 146, 60), width=5)

    # Rival Bridge #1: Background Steel Arch Bridge (two halves racing to meet)
    arch_y = int(lerp(455, 485, t))
    gap_half = int(lerp(48, 35, t))
    # Left span
    draw.line([left_edge - 20, arch_y, W // 2 - gap_half, arch_y], fill=(30, 41, 59), width=8)
    draw.arc([left_edge - 40, arch_y, W // 2 + 40, arch_y + 220], 180, 255, fill=(30, 41, 59), width=6)
    # Right span
    draw.line([W // 2 + gap_half, arch_y, right_edge + 20, arch_y], fill=(30, 41, 59), width=8)
    draw.arc([W // 2 - 40, arch_y, right_edge + 40, arch_y + 220], 285, 360, fill=(30, 41, 59), width=6)

    # Vertical truss struts on arch bridge
    for sx in range(left_edge, W // 2 - gap_half, 18):
        draw.line([sx, arch_y, sx, arch_y + 42], fill=(51, 65, 85), width=2)
    for sx in range(W // 2 + gap_half, right_edge, 18):
        draw.line([sx, arch_y, sx, arch_y + 42], fill=(51, 65, 85), width=2)

    # Rival Bridge #2: Foreground Tall Steel Trestle Tower & Derrick Crane
    trestle_y = int(lerp(760, 680, t))
    trestle_x = int(lerp(440, 410, t))
    draw.line([trestle_x - 55, trestle_y, trestle_x - 85, H], fill=(51, 65, 85), width=7)
    draw.line([trestle_x + 55, trestle_y, trestle_x + 85, H], fill=(51, 65, 85), width=7)
    for ty in range(trestle_y + 30, H, 55):
        draw.line([trestle_x - 70, ty, trestle_x + 70, ty + 35], fill=(71, 85, 105), width=3)
        draw.line([trestle_x + 70, ty, trestle_x - 70, ty + 35], fill=(71, 85, 105), width=3)

    # Wooden construction deck + crane boom
    draw.rectangle([trestle_x - 110, trestle_y - 12, right_edge + 30, trestle_y + 8], fill=(146, 64, 14), outline=(35, 31, 32), width=3)
    draw.line([trestle_x, trestle_y - 12, trestle_x - 75, trestle_y - 175], fill=(30, 41, 59), width=6)


def render_beat_4(img, draw, frame):
    """Beat 4 (f180-249): Precarious Wooden Plank Over the Void & Vertigo Dive ('along a canyon so deep you can't see the bottom')"""
    local_f = frame - 180

    # Deep blue canyon void background
    draw.rectangle([0, 0, W, 320], fill=(96, 165, 250))
    draw.rectangle([0, 320, W, H], fill=(23, 58, 178))

    # Stratified purple-red canyon wall on left
    wall_top = int(lerp(310, 80 if local_f > 58 else 290, max(0.0, (local_f - 55) / 14.0)))
    draw.polygon([(0, wall_top), (W, wall_top + 60), (W, H), (0, H)], fill=(30, 58, 138))
    for sy in range(wall_top + 20, H - 220, 28):
        draw.line([0, sy, W, sy + 35], fill=(126, 34, 83), width=6)

    if local_f < 60:
        # Wooden plank jutting diagonally from bottom-right out into the canyon abyss
        plank_tip_x, plank_tip_y = 415, 735
        draw.polygon(
            [
                (plank_tip_x - 24, plank_tip_y),
                (plank_tip_x + 28, plank_tip_y - 12),
                (W + 60, 960),
                (W + 10, 1015),
            ],
            fill=(217, 119, 6),
            outline=(35, 31, 32),
            width=5,
        )

        # Tiny coffee mug sitting on the plank
        draw.rectangle([535, 812, 558, 840], fill=(120, 53, 15), outline=(35, 31, 32), width=3)

        # Lone cartoon worker perched at the very tip peering straight down into the abyss
        draw_cartoon_character(
            draw,
            cx=plank_tip_x + 12,
            cy=plank_tip_y - 4,
            scale=0.68,
            role="plank_worker",
            brow_angle=-0.3,
            eye_state="wide_down",
            mouth_state="o_gasp",
            lean=-0.52,
        )


def render_beat_5(img, draw, frame):
    """Beat 5 (f250-299): Supersonic Desert Rush & Union Station Top-Hat Tycoon Payoff"""
    local_f = frame - 250

    if local_f < 26:
        # Sub-beat 5A: Supersonic flight across orange desert floor toward Union Station
        t = smoothstep(local_f / 25.0)
        draw.rectangle([0, 0, W, 620], fill=(96, 165, 250))
        draw.rectangle([0, 620, W, H], fill=(249, 115, 22))

        # Distant mesas & station silhouette growing rapidly
        st_scale = lerp(0.4, 1.35, t)
        sw = int(220 * st_scale)
        sh = int(95 * st_scale)
        draw.rectangle([W // 2 - sw, 620 - sh, W // 2 + sw, 620], fill=(30, 41, 59))

        # Speed blur lines across desert floor
        for i in range(-5, 6):
            draw.line([W // 2 + i * 22, 620, W // 2 + i * 165, H], fill=(251, 146, 60), width=6)
    else:
        # Sub-beat 5B: Union Station Finale — Top-Hat Tycoon, Gold Money Bags & Banner
        draw.rectangle([0, 0, W, H], fill=(30, 41, 59))

        # Golden pyramid stairs
        for step in range(6):
            sy = 680 + step * 85
            draw.rectangle([40, sy, W - 40, sy + 80], fill=(234, 179, 8), outline=(161, 98, 7), width=4)

        # Red carpet down center
        draw.polygon([(260, 680), (460, 680), (560, H), (160, H)], fill=(185, 28, 28))

        # Station Banner: "FIRST LINE IN GETS IT ALL!"
        draw.rectangle([35, 230, W - 35, 420], fill=(254, 243, 199), outline=(185, 28, 28), width=8)
        draw.text((W // 2, 285), "FIRST LINE IN", font=FONT_BANNER, fill=(30, 58, 138), anchor="mm")
        draw.text((W // 2, 360), "GETS IT ALL!", font=FONT_BANNER, fill=(185, 28, 28), anchor="mm")

        # 3D Gold Money Bags on left pedestals
        for bx, by in [(165, 790), (245, 710)]:
            draw.ellipse([bx - 52, by - 55, bx + 52, by + 45], fill=(202, 138, 4), outline=(35, 31, 32), width=5)
            draw.text((bx, by - 5), "$", font=FONT_BANNER, fill=(35, 31, 32), anchor="mm")

        # Winking Top-Hat Tycoon
        draw_cartoon_character(
            draw,
            cx=465,
            cy=965,
            scale=1.18,
            role="tycoon",
            brow_angle=0.2,
            eye_state="wink" if local_f > 34 else "smug",
            mouth_state="talk_open" if (local_f % 5 < 3) else "closed_smirk",
            lean=-0.05,
        )


def draw_subtitle_and_hud(draw, frame):
    """Draws the @RicksClips3000 word-by-word pop subtitle at 70% height + top telemetry HUD"""
    active_sub = None
    for s_start, s_end, text, emp in SUBTITLES:
        if s_start <= frame <= s_end:
            active_sub = (s_start, s_end, text, emp)
            break

    if active_sub:
        s_start, s_end, text, emp = active_sub
        local_f = frame - s_start
        scale = 1.0
        if local_f <= 2:
            scale = lerp(0.86, 1.14, local_f / 2.0)
        elif local_f <= 5:
            scale = lerp(1.14, 1.0, (local_f - 2.0) / 3.0)

        font_sz = max(36, int(68 * scale))
        font = get_sub_font(font_sz)
        sub_y = int(H * 0.71)

        # Heavy black stroke + drop shadow
        draw.text(
            (W // 2 + 4, sub_y + 5),
            text,
            font=font,
            fill=(0, 0, 0),
            anchor="mm",
            stroke_width=12,
            stroke_fill=(0, 0, 0),
        )
        fill_col = (254, 240, 138) if emp else (255, 255, 255)
        draw.text(
            (W // 2, sub_y),
            text,
            font=font,
            fill=fill_col,
            anchor="mm",
            stroke_width=10,
            stroke_fill=(20, 20, 24),
        )

    # Top Telemetry Bar for Frame-by-Frame Learning
    beat_num = 1 if frame < 60 else 2 if frame < 120 else 3 if frame < 180 else 4 if frame < 250 else 5
    beat_names = {
        1: "BEAT 1: SAWING HOOK (2.5D + 3D RAIL)",
        2: "BEAT 2: 180° ORBIT & TRAIN PASS",
        3: "BEAT 3: ABYSS CRANE PULLBACK",
        4: "BEAT 4: PLANK VERTIGO DIVE",
        5: "BEAT 5: DESERT RUSH & TYCOON",
    }
    draw.rounded_rectangle([24, 24, W - 24, 108], radius=14, fill=(15, 23, 42), outline=(56, 189, 248), width=2)
    draw.text(
        (44, 48),
        f"FRAME {frame:03d}/300  |  {frame / FPS:05.2f}s  |  30 FPS",
        font=FONT_HUD,
        fill=(56, 189, 248),
        anchor="lm",
    )
    draw.text(
        (44, 82),
        beat_names[beat_num],
        font=FONT_HUD_SM,
        fill=(226, 232, 240),
        anchor="lm",
    )


def generate_synthesized_audio(wav_path):
    """Generates a 10.0s procedural foley + rhythmic bed WAV track synced to the 300 frames"""
    sample_rate = 44100
    duration = 10.0
    total_samples = int(sample_rate * duration)

    with wave.open(wav_path, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)

        frames_bytes = bytearray()
        for i in range(total_samples):
            t = i / sample_rate
            f_idx = int(t * FPS)

            # Driving narrative bass pulse (128 BPM)
            beat_env = max(0.0, 1.0 - ((t * 2.133) % 1.0) * 2.5)
            val = math.sin(2.0 * math.pi * 65.4 * t) * 0.18 * beat_env

            # Beat 1 (0.0 - 2.0s): Metallic hacksaw strokes + approaching train chug
            if f_idx < 60:
                saw_mod = math.sin(f_idx * 0.65)
                if saw_mod > 0.2:
                    val += math.sin(2.0 * math.pi * (1650 + 450 * saw_mod) * t) * 0.12
                chug = max(0.0, math.sin(2.0 * math.pi * 6.0 * t))
                val += math.sin(2.0 * math.pi * 110.0 * t) * 0.1 * chug

            # Beat 2 (2.0 - 4.0s): Orbit whoosh + Steam whistle Doppler pass
            elif f_idx < 120:
                if 92 <= f_idx <= 114:
                    doppler = 1.0 - (f_idx - 92) / 35.0
                    val += (
                        math.sin(2.0 * math.pi * 587.3 * doppler * t) * 0.14
                        + math.sin(2.0 * math.pi * 740.0 * doppler * t) * 0.12
                    )

            # Beat 3 & 4 (4.0 - 8.3s): High-altitude canyon wind resonance
            elif f_idx < 250:
                val += math.sin(2.0 * math.pi * (180 + 40 * math.sin(t * 2.0)) * t) * 0.1

            # Beat 5 (8.3 - 10.0s): Supersonic rush + Cash register chime at f282
            else:
                if f_idx >= 280:
                    val += math.sin(2.0 * math.pi * 1760.0 * t) * 0.18 * max(0.0, 1.0 - (t - 9.33) * 2.5)

            sample_int = max(-32767, min(32767, int(val * 32767)))
            frames_bytes.extend(struct.pack("<h", sample_int))

        wf.writeframes(frames_bytes)


def main():
    scratch_dir = r"C:\Users\Prasad\.gemini\antigravity\brain\6aef93bc-f9a3-4973-9137-868fc1fd0f9a\scratch"
    frames_out = os.path.join(scratch_dir, "rendered_300_frames")
    os.makedirs(frames_out, exist_ok=True)

    public_dir = r"c:\Users\Prasad\Documents\acad\yt-4A\public"
    os.makedirs(public_dir, exist_ok=True)

    print("Rendering 300 frames (10.00s @ 30fps)...")
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGB", (W, H), (15, 23, 42))
        draw = ImageDraw.Draw(img)

        if f < 60:
            render_beat_1(img, draw, f)
        elif f < 120:
            render_beat_2(img, draw, f)
        elif f < 180:
            render_beat_3(img, draw, f)
        elif f < 250:
            render_beat_4(img, draw, f)
        else:
            render_beat_5(img, draw, f)

        draw_subtitle_and_hud(draw, f)
        img.save(os.path.join(frames_out, f"frame_{f:03d}.png"))

    wav_path = os.path.join(scratch_dir, "synth_foley.wav")
    generate_synthesized_audio(wav_path)

    ref_video = os.path.join(scratch_dir, "7xS87iActkU.mp4")
    out_video = os.path.join(public_dir, "ricks-clips-10s-example.mp4")
    ref_10s_video = os.path.join(public_dir, "reference-10s.mp4")

    # 1. Trim reference 10s video for side-by-side frame comparison
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            ref_video,
            "-t",
            "10",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            ref_10s_video,
        ],
        check=True,
    )

    # 2. Encode our 300 code-generated frames with the synced voiceover+foley audio
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-framerate",
            "30",
            "-i",
            os.path.join(frames_out, "frame_%03d.png"),
            "-i",
            ref_10s_video,
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-t",
            "10",
            "-c:v",
            "libx264",
            "-crf",
            "18",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            out_video,
        ],
        check=True,
    )

    print("Successfully created:", out_video)


if __name__ == "__main__":
    main()
