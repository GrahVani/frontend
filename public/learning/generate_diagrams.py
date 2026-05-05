#!/usr/bin/env python3
"""
Grahvani Learning Module — Modern Educational Diagram Generator
===============================================================
Generates high-resolution, clean, modern educational diagrams for
interactive touch interfaces. Design language: card-based, soft shadows,
rounded corners, high contrast, touch-friendly spacing.

Style: ultra-sharp, 4K-ready, vector-style, UI/UX design, interactive infographic,
card-based layout, touch-friendly design.
"""

import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# =============================================================================
# DESIGN SYSTEM
# =============================================================================

BG_COLOR = "#FAF8F5"           # Warm cream background
BG_GRADIENT_TOP = "#FDFCFA"
BG_GRADIENT_BOTTOM = "#F5F2EE"
CARD_BG = "#FFFFFF"
CARD_SHADOW = (0, 0, 0, 25)    # RGBA
TEXT_PRIMARY = "#1F2937"       # Gray-900
TEXT_SECONDARY = "#6B7280"     # Gray-500
TEXT_TERTIARY = "#9CA3AF"      # Gray-400
ACCENT_AMBER = "#D97706"       # Amber-600
ACCENT_AMBER_LIGHT = "#FEF3C7" # Amber-100
BORDER_LIGHT = "#E5E7EB"       # Gray-200

# Element colors (matching React components)
ELEMENTS = {
    "Fire":  {"color": "#EA580C", "bg": "#FFF7ED", "border": "#FED7AA", "sanskrit": "Agni"},
    "Earth": {"color": "#16A34A", "bg": "#F0FDF4", "border": "#BBF7D0", "sanskrit": "Prithvi"},
    "Air":   {"color": "#2563EB", "bg": "#EFF6FF", "border": "#BFDBFE", "sanskrit": "Vayu"},
    "Water": {"color": "#0891B2", "bg": "#ECFEFF", "border": "#A5F3FC", "sanskrit": "Jala"},
}

# Modality colors
MODALITIES = {
    "Movable": {"color": "#DC2626", "bg": "#FEF2F2", "sanskrit": "Chara"},
    "Fixed":   {"color": "#2563EB", "bg": "#EFF6FF", "sanskrit": "Sthira"},
    "Dual":    {"color": "#16A34A", "bg": "#F0FDF4", "sanskrit": "Dwisvabhava"},
}

# House group colors
GROUPS = {
    "Kendra":   {"color": "#DC2626", "bg": "#FEF2F2", "label": "Kendras (Angular)"},
    "Trikona":  {"color": "#16A34A", "bg": "#F0FDF4", "label": "Trikonas (Trines)"},
    "Dusthana": {"color": "#7C3AED", "bg": "#F5F3FF", "label": "Dusthanas (Suffering)"},
    "Upachaya": {"color": "#EA580C", "bg": "#FFF7ED", "label": "Upachayas (Growth)"},
}

# Planet colors (matching React)
PLANET_COLORS = {
    "Sun": "#F59E0B", "Moon": "#94A3B8", "Mars": "#EF4444", "Mercury": "#10B981",
    "Jupiter": "#F97316", "Venus": "#EC4899", "Saturn": "#6366F1",
    "Rahu": "#64748B", "Ketu": "#71717A",
}

# Zodiac data
SIGNS = [
    {"name": "Aries", "sanskrit": "Mesha", "symbol": "♈", "element": "Fire", "modality": "Movable", "lord": "Mars", "startDeg": 0},
    {"name": "Taurus", "sanskrit": "Vrishabha", "symbol": "♉", "element": "Earth", "modality": "Fixed", "lord": "Venus", "startDeg": 30},
    {"name": "Gemini", "sanskrit": "Mithuna", "symbol": "♊", "element": "Air", "modality": "Dual", "lord": "Mercury", "startDeg": 60},
    {"name": "Cancer", "sanskrit": "Karka", "symbol": "♋", "element": "Water", "modality": "Movable", "lord": "Moon", "startDeg": 90},
    {"name": "Leo", "sanskrit": "Simha", "symbol": "♌", "element": "Fire", "modality": "Fixed", "lord": "Sun", "startDeg": 120},
    {"name": "Virgo", "sanskrit": "Kanya", "symbol": "♍", "element": "Earth", "modality": "Dual", "lord": "Mercury", "startDeg": 150},
    {"name": "Libra", "sanskrit": "Tula", "symbol": "♎", "element": "Air", "modality": "Movable", "lord": "Venus", "startDeg": 180},
    {"name": "Scorpio", "sanskrit": "Vrishchika", "symbol": "♏", "element": "Water", "modality": "Fixed", "lord": "Mars", "startDeg": 210},
    {"name": "Sagittarius", "sanskrit": "Dhanu", "symbol": "♐", "element": "Fire", "modality": "Dual", "lord": "Jupiter", "startDeg": 240},
    {"name": "Capricorn", "sanskrit": "Makara", "symbol": "♑", "element": "Earth", "modality": "Movable", "lord": "Saturn", "startDeg": 270},
    {"name": "Aquarius", "sanskrit": "Kumbha", "symbol": "♒", "element": "Air", "modality": "Fixed", "lord": "Saturn", "startDeg": 300},
    {"name": "Pisces", "sanskrit": "Meena", "symbol": "♓", "element": "Water", "modality": "Dual", "lord": "Jupiter", "startDeg": 330},
]

# Planets data
PLANETS = [
    {"name": "Sun", "sanskrit": "Surya", "role": "The King", "nature": "Malefic", "element": "Fire", "governs": "Soul, Authority, Father", "day": "Sunday", "color": "#F59E0B"},
    {"name": "Moon", "sanskrit": "Chandra", "role": "The Queen", "nature": "Benefic", "element": "Water", "governs": "Mind, Emotions, Mother", "day": "Monday", "color": "#94A3B8"},
    {"name": "Mars", "sanskrit": "Mangala", "role": "The Commander", "nature": "Malefic", "element": "Fire", "governs": "Courage, War, Siblings", "day": "Tuesday", "color": "#EF4444"},
    {"name": "Mercury", "sanskrit": "Budha", "role": "The Prince", "nature": "Neutral", "element": "Earth", "governs": "Intellect, Speech, Business", "day": "Wednesday", "color": "#10B981"},
    {"name": "Jupiter", "sanskrit": "Guru", "role": "The Teacher", "nature": "Benefic", "element": "Ether", "governs": "Wisdom, Wealth, Children", "day": "Thursday", "color": "#F97316"},
    {"name": "Venus", "sanskrit": "Shukra", "role": "The Counselor", "nature": "Benefic", "element": "Water", "governs": "Love, Luxury, Arts", "day": "Friday", "color": "#EC4899"},
    {"name": "Saturn", "sanskrit": "Shani", "role": "The Judge", "nature": "Malefic", "element": "Air", "governs": "Discipline, Delay, Karma", "day": "Saturday", "color": "#6366F1"},
    {"name": "Rahu", "sanskrit": "Rahu", "role": "The Rebel", "nature": "Malefic", "element": "Air", "governs": "Desire, Obsession, Foreign", "day": "—", "color": "#64748B"},
    {"name": "Ketu", "sanskrit": "Ketu", "role": "The Monk", "nature": "Malefic", "element": "Fire", "governs": "Liberation, Detachment, Spirituality", "day": "—", "color": "#71717A"},
]

# Houses data
HOUSES = [
    {"num": 1, "sanskrit": "Tanu", "meaning": "Body / Self", "group": "Kendra", "keywords": ["Personality", "Physical body", "Lagna", "Life path"]},
    {"num": 2, "sanskrit": "Dhana", "meaning": "Wealth", "group": "", "keywords": ["Money", "Family", "Speech", "Food"]},
    {"num": 3, "sanskrit": "Sahaja", "meaning": "Siblings", "group": "Upachaya", "keywords": ["Courage", "Younger siblings", "Communication", "Skills"]},
    {"num": 4, "sanskrit": "Bandhu", "meaning": "Home / Mother", "group": "Kendra", "keywords": ["Mother", "Property", "Vehicle", "Happiness"]},
    {"num": 5, "sanskrit": "Putra", "meaning": "Children", "group": "Trikona", "keywords": ["Children", "Intelligence", "Speculation", "Mantra"]},
    {"num": 6, "sanskrit": "Ari", "meaning": "Enemies / Disease", "group": "Dusthana", "keywords": ["Disease", "Debt", "Enemies", "Service"]},
    {"num": 7, "sanskrit": "Yuvati", "meaning": "Spouse", "group": "Kendra", "keywords": ["Marriage", "Partnership", "Business", "Foreign lands"]},
    {"num": 8, "sanskrit": "Randhra", "meaning": "Death / Occult", "group": "Dusthana", "keywords": ["Longevity", "Occult", "Sudden events", "Inheritance"]},
    {"num": 9, "sanskrit": "Dharma", "meaning": "Fortune / Father", "group": "Trikona", "keywords": ["Father", "Higher learning", "Luck", "Religion"]},
    {"num": 10, "sanskrit": "Karma", "meaning": "Career", "group": "Kendra", "keywords": ["Career", "Status", "Power", "Government"]},
    {"num": 11, "sanskrit": "Labha", "meaning": "Gains", "group": "Upachaya", "keywords": ["Income", "Elder siblings", "Friends", "Ambition"]},
    {"num": 12, "sanskrit": "Vyaya", "meaning": "Loss / Liberation", "group": "Dusthana", "keywords": ["Expenses", "Foreign settlement", "Liberation", "Sleep"]},
]

# Nakshatras (first 9 for the wheel)
NAKSHATRAS = [
    {"name": "Ashwini", "ruler": "Ketu", "start": 0},
    {"name": "Bharani", "ruler": "Venus", "start": 13.33},
    {"name": "Krittika", "ruler": "Sun", "start": 26.66},
    {"name": "Rohini", "ruler": "Moon", "start": 40},
    {"name": "Mrigashira", "ruler": "Mars", "start": 53.33},
    {"name": "Ardra", "ruler": "Rahu", "start": 66.66},
    {"name": "Punarvasu", "ruler": "Jupiter", "start": 80},
    {"name": "Pushya", "ruler": "Saturn", "start": 93.33},
    {"name": "Ashlesha", "ruler": "Mercury", "start": 106.66},
]

# =============================================================================
# FONT LOADING
# =============================================================================

def load_fonts():
    """Try to load modern system fonts, fall back to defaults."""
    font_paths = {
        "regular": [
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/calibri.ttf",
        ],
        "bold": [
            "C:/Windows/Fonts/segoeuib.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/calibrib.ttf",
        ],
        "semibold": [
            "C:/Windows/Fonts/segoeuiz.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/calibrib.ttf",
        ],
        "light": [
            "C:/Windows/Fonts/segoeuil.ttf",
            "C:/Windows/Fonts/calibril.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ],
        "unicode": [
            "C:/Windows/Fonts/ARIALUNI.TTF",
            "C:/Windows/Fonts/segoeui.ttf",
        ],
    }
    
    fonts = {}
    for style, paths in font_paths.items():
        for p in paths:
            if os.path.exists(p):
                fonts[style] = p
                break
        else:
            fonts[style] = None
    return fonts


def get_unicode_font(size):
    path = FONTS.get("unicode")
    if path:
        try:
            return ImageFont.truetype(path, size)
        except:
            pass
    return get_font("regular", size)

FONTS = load_fonts()

def get_font(style, size):
    path = FONTS.get(style)
    if path:
        try:
            return ImageFont.truetype(path, size)
        except:
            pass
    return ImageFont.load_default()

# =============================================================================
# DRAWING UTILITIES
# =============================================================================

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def hex_to_rgba(hex_color, alpha=255):
    r, g, b = hex_to_rgb(hex_color)
    return (r, g, b, alpha)

def draw_rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = xy
    r = radius
    # Draw main rectangle
    draw.rectangle([x1 + r, y1, x2 - r, y2], fill=fill)
    draw.rectangle([x1, y1 + r, x2, y2 - r], fill=fill)
    # Draw four corners
    draw.pieslice([x1, y1, x1 + 2*r, y1 + 2*r], 180, 270, fill=fill)
    draw.pieslice([x2 - 2*r, y1, x2, y1 + 2*r], 270, 360, fill=fill)
    draw.pieslice([x1, y2 - 2*r, x1 + 2*r, y2], 90, 180, fill=fill)
    draw.pieslice([x2 - 2*r, y2 - 2*r, x2, y2], 0, 90, fill=fill)
    
    if outline:
        # Draw outline arcs and lines
        draw.arc([x1, y1, x1 + 2*r, y1 + 2*r], 180, 270, fill=outline, width=width)
        draw.arc([x2 - 2*r, y1, x2, y1 + 2*r], 270, 360, fill=outline, width=width)
        draw.arc([x1, y2 - 2*r, x1 + 2*r, y2], 90, 180, fill=outline, width=width)
        draw.arc([x2 - 2*r, y2 - 2*r, x2, y2], 0, 90, fill=outline, width=width)
        draw.line([x1 + r, y1, x2 - r, y1], fill=outline, width=width)
        draw.line([x1 + r, y2, x2 - r, y2], fill=outline, width=width)
        draw.line([x1, y1 + r, x1, y2 - r], fill=outline, width=width)
        draw.line([x2, y1 + r, x2, y2 - r], fill=outline, width=width)

def draw_soft_shadow(img, xy, radius, blur=20, strength=25):
    """Draw a soft drop shadow behind a rounded rectangle area."""
    x1, y1, x2, y2 = xy
    shadow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)
    # Expand shadow area slightly
    pad = blur // 2
    sx1, sy1, sx2, sy2 = x1 - pad + 4, y1 - pad + 4, x2 + pad + 4, y2 + pad + 4
    draw_rounded_rect(shadow_draw, [sx1, sy1, sx2, sy2], radius, fill=(0, 0, 0, strength))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=blur // 2))
    img.paste(shadow_layer, (0, 0), shadow_layer)

def draw_card(img, draw, xy, radius=24, fill=CARD_BG, shadow=True, outline=None, outline_width=1):
    """Draw a modern card with soft shadow and rounded corners."""
    if shadow:
        draw_soft_shadow(img, xy, radius, blur=24, strength=20)
    draw_rounded_rect(draw, xy, radius, fill=fill, outline=outline, width=outline_width)

def draw_gradient_bg(img, color_top=BG_GRADIENT_TOP, color_bottom=BG_GRADIENT_BOTTOM):
    """Draw a subtle vertical gradient background."""
    width, height = img.size
    c1 = hex_to_rgb(color_top)
    c2 = hex_to_rgb(color_bottom)
    for y in range(height):
        ratio = y / height
        r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
        g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
        b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
        ImageDraw.Draw(img).line([(0, y), (width, y)], fill=(r, g, b))

def text_size(draw, text, font):
    """Get text bounding box size."""
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]

def draw_centered_text(draw, x, y, text, font, fill, anchor="mm"):
    """Draw text centered at x, y."""
    draw.text((x, y), text, font=font, fill=fill, anchor=anchor)

# =============================================================================
# DIAGRAM 1: BHA-CHAKRA (ZODIAC WHEEL)
# =============================================================================

def generate_bha_chakra(output_path, size=1800):
    """Generate the modern Bha-Chakra zodiac wheel diagram."""
    img = Image.new("RGB", (size, size), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    cx, cy = size // 2, size // 2
    outer_r = int(size * 0.36)
    mid_r = int(size * 0.24)
    inner_r = int(size * 0.13)
    label_r = int(size * 0.44)
    
    # Title at top
    title_font = get_font("bold", 52)
    subtitle_font = get_font("light", 28)
    draw_centered_text(draw, cx, 50, "Bha-Chakra", title_font, hex_to_rgb(ACCENT_AMBER))
    draw_centered_text(draw, cx, 100, "The 12 Rashis arranged in 360° with their elemental classifications", subtitle_font, hex_to_rgb(TEXT_SECONDARY))
    
    # Outer ring background
    draw.ellipse([cx - outer_r - 4, cy - outer_r - 4, cx + outer_r + 4, cy + outer_r + 4], outline=hex_to_rgb(ACCENT_AMBER), width=3)
    draw.ellipse([cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r], fill=hex_to_rgb("#FFFBEB"), outline=hex_to_rgb("#D4A373"), width=2)
    draw.ellipse([cx - mid_r, cy - mid_r, cx + mid_r, cy + mid_r], outline=hex_to_rgb("#D4A373"), width=1)
    
    # 12 segments
    for i, sign in enumerate(SIGNS):
        meta = ELEMENTS[sign["element"]]
        start_angle = i * 30
        end_angle = (i + 1) * 30
        mid_angle = start_angle + 15
        
        # Draw wedge (subtle fill)
        wedge_points = []
        for a in range(start_angle * 10, end_angle * 10 + 1, 1):
            rad = math.radians(a / 10 - 90)
            wedge_points.append((cx + outer_r * math.cos(rad), cy + outer_r * math.sin(rad)))
        wedge_points.append((cx, cy))
        # Convert to int tuples
        wedge_points = [(int(p[0]), int(p[1])) for p in wedge_points]
        draw.polygon(wedge_points, fill=hex_to_rgb(meta["bg"]))
        
        # Symbol chip position (between outer and mid ring)
        chip_r = (outer_r + mid_r) // 2
        chip_rad = math.radians(mid_angle - 90)
        chip_x = int(cx + chip_r * math.cos(chip_rad))
        chip_y = int(cy + chip_r * math.sin(chip_rad))
        
        # Draw symbol chip (rounded square)
        chip_size = int(size * 0.038)
        chip_rect = [chip_x - chip_size, chip_y - chip_size, chip_x + chip_size, chip_y + chip_size]
        draw_soft_shadow(img, chip_rect, 8, blur=12, strength=15)
        draw_rounded_rect(draw, chip_rect, 8, fill=hex_to_rgb(meta["bg"]), outline=hex_to_rgb(meta["border"]), width=2)
        
        # Symbol text
        sym_font = get_unicode_font(int(size * 0.045))
        draw_centered_text(draw, chip_x, chip_y, sign["symbol"], sym_font, hex_to_rgb(meta["color"]))
        
        # Degree text (between mid and inner ring)
        deg_r = (mid_r + inner_r) // 2
        deg_rad = math.radians(mid_angle - 90)
        deg_x = int(cx + deg_r * math.cos(deg_rad))
        deg_y = int(cy + deg_r * math.sin(deg_rad))
        deg_font = get_font("regular", int(size * 0.022))
        draw_centered_text(draw, deg_x, deg_y, f"{sign['startDeg']}°", deg_font, hex_to_rgb("#A16207"))
        
        # Sanskrit label outside
        label_rad = math.radians(mid_angle - 90)
        lx = int(cx + label_r * math.cos(label_rad))
        ly = int(cy + label_r * math.sin(label_rad))
        label_font = get_font("semibold", int(size * 0.028))
        draw_centered_text(draw, lx, ly, sign["sanskrit"], label_font, hex_to_rgb(meta["color"]))
        
        # Divider lines
        for angle in [start_angle, end_angle]:
            rad = math.radians(angle - 90)
            x1 = int(cx + mid_r * math.cos(rad))
            y1 = int(cy + mid_r * math.sin(rad))
            x2 = int(cx + outer_r * math.cos(rad))
            y2 = int(cy + outer_r * math.sin(rad))
            draw.line([(x1, y1), (x2, y2)], fill=hex_to_rgb("#D4A373"), width=1)
    
    # Draw inner circle on top of wedges
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=hex_to_rgb(CARD_BG), outline=hex_to_rgb("#D4A373"), width=2)
    
    # Center content
    center_font = get_font("bold", int(size * 0.04))
    center_sub = get_font("light", int(size * 0.024))
    draw_centered_text(draw, cx, cy - 8, "Bha-Chakra", center_font, hex_to_rgb("#78350F"))
    draw_centered_text(draw, cx, cy + 18, "360° · 12 Rashis", center_sub, hex_to_rgb("#A16207"))
    
    # Cardinal direction markers
    markers = [
        {"angle": 0, "label": "Ascendant", "sub": "East"},
        {"angle": 90, "label": "IC", "sub": "North"},
        {"angle": 180, "label": "Descendant", "sub": "West"},
        {"angle": 270, "label": "MC", "sub": "South"},
    ]
    for m in markers:
        rad = math.radians(m["angle"] - 90)
        px = int(cx + (outer_r + 20) * math.cos(rad))
        py = int(cy + (outer_r + 20) * math.sin(rad))
        # Small dot
        draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=hex_to_rgb("#D4A373"))
        # Label
        label_f = get_font("semibold", int(size * 0.020))
        sub_f = get_font("light", int(size * 0.018))
        # Adjust text position based on angle
        if m["angle"] == 0:
            draw.text((px, py - 14), m["label"], font=label_f, fill=hex_to_rgb("#92400E"), anchor="mm")
            draw.text((px, py + 6), m["sub"], font=sub_f, fill=hex_to_rgb("#B45309"), anchor="mm")
        elif m["angle"] == 180:
            draw.text((px, py - 14), m["label"], font=label_f, fill=hex_to_rgb("#92400E"), anchor="mm")
            draw.text((px, py + 6), m["sub"], font=sub_f, fill=hex_to_rgb("#B45309"), anchor="mm")
        elif m["angle"] == 90:
            draw.text((px + 4, py), m["label"], font=label_f, fill=hex_to_rgb("#92400E"), anchor="lm")
            draw.text((px + 4, py + 16), m["sub"], font=sub_f, fill=hex_to_rgb("#B45309"), anchor="lm")
        else:
            draw.text((px - 4, py), m["label"], font=label_f, fill=hex_to_rgb("#92400E"), anchor="rm")
            draw.text((px - 4, py + 16), m["sub"], font=sub_f, fill=hex_to_rgb("#B45309"), anchor="rm")
    
    # Legend card at bottom
    legend_w, legend_h = 520, 80
    legend_x = cx - legend_w // 2
    legend_y = size - 110
    draw_card(img, draw, [legend_x, legend_y, legend_x + legend_w, legend_y + legend_h], radius=16, fill=CARD_BG, shadow=True)
    
    legend_font = get_font("regular", 20)
    item_w = legend_w // 4
    for i, (key, meta) in enumerate(ELEMENTS.items()):
        ix = legend_x + i * item_w + item_w // 2
        iy = legend_y + legend_h // 2
        # Color dot
        draw.ellipse([ix - 70, iy - 6, ix - 54, iy + 10], fill=hex_to_rgb(meta["color"]))
        draw.text((ix - 40, iy), f"{key} ({meta['sanskrit']})", font=legend_font, fill=hex_to_rgb(TEXT_PRIMARY), anchor="lm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# DIAGRAM 2: RASHI TATTVAS (ELEMENTS OVERLAY)
# =============================================================================

def generate_rashi_tattvas(output_path, size=1800):
    """Generate the Rashi Tattvas (Elements) overlay diagram."""
    img = Image.new("RGB", (size, size), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    cx, cy = size // 2, size // 2
    outer_r = int(size * 0.36)
    inner_r = int(size * 0.13)
    
    # Title
    title_font = get_font("bold", 52)
    subtitle_font = get_font("light", 28)
    draw_centered_text(draw, cx, 50, "The Four Tattvas", title_font, hex_to_rgb(ACCENT_AMBER))
    draw_centered_text(draw, cx, 100, "Elemental Classification of the 12 Rashis", subtitle_font, hex_to_rgb(TEXT_SECONDARY))
    
    # Draw wheel segments colored by element
    for i, sign in enumerate(SIGNS):
        meta = ELEMENTS[sign["element"]]
        start_angle = i * 30
        end_angle = (i + 1) * 30
        
        wedge_points = []
        for a in range(start_angle * 10, end_angle * 10 + 1, 1):
            rad = math.radians(a / 10 - 90)
            wedge_points.append((cx + outer_r * math.cos(rad), cy + outer_r * math.sin(rad)))
        for a in range(end_angle * 10, start_angle * 10 - 1, -1):
            rad = math.radians(a / 10 - 90)
            wedge_points.append((cx + inner_r * math.cos(rad), cy + inner_r * math.sin(rad)))
        wedge_points = [(int(p[0]), int(p[1])) for p in wedge_points]
        draw.polygon(wedge_points, fill=hex_to_rgb(meta["bg"]), outline=hex_to_rgb(meta["border"]), width=2)
    
    # Outer ring
    draw.ellipse([cx - outer_r - 2, cy - outer_r - 2, cx + outer_r + 2, cy + outer_r + 2], outline=hex_to_rgb("#D4A373"), width=3)
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=hex_to_rgb(CARD_BG), outline=hex_to_rgb("#D4A373"), width=2)
    
    # Element labels as floating cards
    element_angles = {"Fire": 30, "Earth": 120, "Air": 210, "Water": 300}
    for elem, angle in element_angles.items():
        meta = ELEMENTS[elem]
        rad = math.radians(angle - 90)
        lx = int(cx + (outer_r * 0.55) * math.cos(rad))
        ly = int(cy + (outer_r * 0.55) * math.sin(rad))
        
        # Card
        card_w, card_h = 180, 90
        card_rect = [lx - card_w // 2, ly - card_h // 2, lx + card_w // 2, ly + card_h // 2]
        draw_card(img, draw, card_rect, radius=14, fill=CARD_BG, shadow=True, outline=meta["border"], outline_width=2)
        
        label_font = get_font("bold", 32)
        sub_font = get_font("regular", 22)
        draw.text((lx, ly - 12), elem, font=label_font, fill=hex_to_rgb(meta["color"]), anchor="mm")
        draw.text((lx, ly + 16), meta["sanskrit"], font=sub_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Center title
    center_font = get_font("bold", 40)
    draw.text((cx, cy), "4 Tattvas", font=center_font, fill=hex_to_rgb("#78350F"), anchor="mm")
    
    # Legend cards at corners showing which signs belong to which element
    y_start = 160
    card_w, card_h = 340, 320
    gap = 20
    positions = [
        (40, y_start),
        (size - 40 - card_w, y_start),
        (40, size - y_start - card_h + 60),
        (size - 40 - card_w, size - y_start - card_h + 60),
    ]
    for idx, (elem, meta) in enumerate(ELEMENTS.items()):
        x, y = positions[idx]
        signs_for = [s for s in SIGNS if s["element"] == elem]
        draw_card(img, draw, [x, y, x + card_w, y + card_h], radius=18, fill=meta["bg"], shadow=True, outline=meta["border"], outline_width=2)
        
        t_font = get_font("bold", 26)
        s_font = get_font("regular", 20)
        draw.text((x + card_w // 2, y + 24), f"{elem} ({meta['sanskrit']})", font=t_font, fill=hex_to_rgb(meta["color"]), anchor="mm")
        
        for j, s in enumerate(signs_for):
            sy = y + 60 + j * 38
            # Small chip
            chip = [x + 20, sy - 14, x + 52, sy + 14]
            draw_rounded_rect(draw, chip, 6, fill=hex_to_rgb(meta["bg"]), outline=hex_to_rgb(meta["border"]), width=1)
            draw.text((x + 36, sy), s["symbol"], font=get_unicode_font(18), fill=hex_to_rgb(meta["color"]), anchor="mm")
            draw.text((x + 64, sy), f"{s['sanskrit']} — {s['name']}", font=s_font, fill=hex_to_rgb(TEXT_PRIMARY), anchor="lm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# DIAGRAM 3: RASHI MODALITIES
# =============================================================================

def generate_rashi_modalities(output_path, size=1800):
    """Generate the Rashi Modalities diagram."""
    img = Image.new("RGB", (size, size), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    cx, cy = size // 2, size // 2
    outer_r = int(size * 0.36)
    inner_r = int(size * 0.13)
    
    title_font = get_font("bold", 52)
    subtitle_font = get_font("light", 28)
    draw_centered_text(draw, cx, 50, "The Three Modalities", title_font, hex_to_rgb(ACCENT_AMBER))
    draw_centered_text(draw, cx, 100, "How Rashi Energy Moves — Chara, Sthira, Dwisvabhava", subtitle_font, hex_to_rgb(TEXT_SECONDARY))
    
    for i, sign in enumerate(SIGNS):
        meta = MODALITIES[sign["modality"]]
        start_angle = i * 30
        end_angle = (i + 1) * 30
        
        wedge_points = []
        for a in range(start_angle * 10, end_angle * 10 + 1, 1):
            rad = math.radians(a / 10 - 90)
            wedge_points.append((cx + outer_r * math.cos(rad), cy + outer_r * math.sin(rad)))
        for a in range(end_angle * 10, start_angle * 10 - 1, -1):
            rad = math.radians(a / 10 - 90)
            wedge_points.append((cx + inner_r * math.cos(rad), cy + inner_r * math.sin(rad)))
        wedge_points = [(int(p[0]), int(p[1])) for p in wedge_points]
        draw.polygon(wedge_points, fill=hex_to_rgb(meta["bg"]), outline=hex_to_rgb(meta["color"]), width=2)
    
    draw.ellipse([cx - outer_r - 2, cy - outer_r - 2, cx + outer_r + 2, cy + outer_r + 2], outline=hex_to_rgb("#D4A373"), width=3)
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=hex_to_rgb(CARD_BG), outline=hex_to_rgb("#D4A373"), width=2)
    
    # Modality labels
    modality_angles = {"Movable": 45, "Fixed": 165, "Dual": 285}
    for mod, angle in modality_angles.items():
        meta = MODALITIES[mod]
        rad = math.radians(angle - 90)
        lx = int(cx + (outer_r * 0.55) * math.cos(rad))
        ly = int(cy + (outer_r * 0.55) * math.sin(rad))
        
        card_w, card_h = 220, 100
        card_rect = [lx - card_w // 2, ly - card_h // 2, lx + card_w // 2, ly + card_h // 2]
        draw_card(img, draw, card_rect, radius=14, fill=CARD_BG, shadow=True, outline=meta["color"], outline_width=2)
        
        label_font = get_font("bold", 30)
        sub_font = get_font("regular", 20)
        draw.text((lx, ly - 12), mod, font=label_font, fill=hex_to_rgb(meta["color"]), anchor="mm")
        draw.text((lx, ly + 18), meta["sanskrit"], font=sub_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    draw.text((cx, cy), "3 Modalities", font=get_font("bold", 40), fill=hex_to_rgb("#78350F"), anchor="mm")
    
    # Side cards
    card_w, card_h = 360, 360
    y_start = 180
    positions = [
        (40, y_start, "Movable (Chara)", "Initiates change. Dynamic forward motion.\n\nAries, Cancer, Libra, Capricorn", MODALITIES["Movable"]),
        (size - 40 - card_w, y_start, "Fixed (Sthira)", "Maintains & stabilizes. Resists change.\n\nTaurus, Leo, Scorpio, Aquarius", MODALITIES["Fixed"]),
        ((size - card_w) // 2, size - card_h - 40, "Dual (Dwisvabhava)", "Adaptable & flexible. Bridges fixed & moving.\n\nGemini, Virgo, Sagittarius, Pisces", MODALITIES["Dual"]),
    ]
    for x, y, title, body, meta in positions:
        draw_card(img, draw, [x, y, x + card_w, y + card_h], radius=18, fill=meta["bg"], shadow=True, outline=meta["color"], outline_width=2)
        t_font = get_font("bold", 24)
        b_font = get_font("regular", 18)
        draw.text((x + card_w // 2, y + 24), title, font=t_font, fill=hex_to_rgb(meta["color"]), anchor="mm")
        # Draw body lines
        lines = body.split("\n")
        for i, line in enumerate(lines):
            draw.text((x + card_w // 2, y + 60 + i * 26), line, font=b_font, fill=hex_to_rgb(TEXT_PRIMARY), anchor="mm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# DIAGRAM 4: NAVAGRAHA PANTHEON
# =============================================================================

def generate_navagraha_pantheon(output_path, width=1920, height=1080):
    """Generate the Navagraha pantheon as a modern card-based horizontal layout."""
    img = Image.new("RGB", (width, height), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    # Title
    title_font = get_font("bold", 56)
    subtitle_font = get_font("light", 30)
    draw.text((width // 2, 60), "The Navagraha", font=title_font, fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    draw.text((width // 2, 110), "Nine Cosmic Governors — Seven Physical Bodies + Two Shadow Planets (Chhaya Grahas)", font=subtitle_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # 9 cards in a row
    card_w, card_h = 190, 380
    gap = 24
    total_w = 9 * card_w + 8 * gap
    start_x = (width - total_w) // 2
    y = 180
    
    for i, planet in enumerate(PLANETS):
        x = start_x + i * (card_w + gap)
        color = planet["color"]
        bg = color + "15"  # Very light version
        
        # Draw card with shadow
        draw_card(img, draw, [x, y, x + card_w, y + card_h], radius=20, fill=CARD_BG, shadow=True)
        
        # Top color bar
        draw.rounded_rectangle([x, y, x + card_w, y + 6], radius=20, fill=hex_to_rgb(color))
        
        # Planet circle
        circle_y = y + 70
        draw.ellipse([x + card_w // 2 - 40, circle_y - 40, x + card_w // 2 + 40, circle_y + 40], fill=hex_to_rgb(color))
        initial_font = get_font("bold", 36)
        draw.text((x + card_w // 2, circle_y), planet["name"][0], font=initial_font, fill=(255, 255, 255), anchor="mm")
        
        # Sanskrit name
        sans_font = get_font("semibold", 22)
        draw.text((x + card_w // 2, circle_y + 60), planet["sanskrit"], font=sans_font, fill=hex_to_rgb(color), anchor="mm")
        
        # English name
        name_font = get_font("regular", 18)
        draw.text((x + card_w // 2, circle_y + 86), planet["name"], font=name_font, fill=hex_to_rgb(TEXT_PRIMARY), anchor="mm")
        
        # Role badge
        role_y = circle_y + 120
        role_w = text_size(draw, planet["role"], get_font("regular", 14))[0] + 20
        role_rect = [x + (card_w - role_w) // 2, role_y - 12, x + (card_w + role_w) // 2, role_y + 12]
        draw_rounded_rect(draw, role_rect, 10, fill=hex_to_rgb(color + "18"), outline=hex_to_rgb(color + "40"), width=1)
        draw.text((x + card_w // 2, role_y), planet["role"], font=get_font("regular", 14), fill=hex_to_rgb(color), anchor="mm")
        
        # Nature badge
        nature_colors = {"Benefic": "#16A34A", "Malefic": "#DC2626", "Neutral": "#6B7280"}
        nat_color = nature_colors.get(planet["nature"], "#6B7280")
        nat_y = role_y + 30
        nat_w = text_size(draw, planet["nature"], get_font("regular", 14))[0] + 20
        nat_rect = [x + (card_w - nat_w) // 2, nat_y - 12, x + (card_w + nat_w) // 2, nat_y + 12]
        draw_rounded_rect(draw, nat_rect, 10, fill=hex_to_rgb(nat_color + "15"), outline=hex_to_rgb(nat_color + "40"), width=1)
        draw.text((x + card_w // 2, nat_y), planet["nature"], font=get_font("regular", 14), fill=hex_to_rgb(nat_color), anchor="mm")
        
        # Governs
        gov_y = nat_y + 40
        gov_font = get_font("regular", 13)
        draw.text((x + card_w // 2, gov_y), "Governs", font=get_font("semibold", 12), fill=hex_to_rgb(TEXT_TERTIARY), anchor="mm")
        
        # Wrap governs text
        gov_text = planet["governs"]
        words = gov_text.split(", ")
        lines = []
        current = ""
        for w in words:
            test = current + ", " + w if current else w
            if text_size(draw, test, gov_font)[0] > card_w - 20:
                if current:
                    lines.append(current)
                current = w
            else:
                current = test
        if current:
            lines.append(current)
        for li, line in enumerate(lines[:3]):
            draw.text((x + card_w // 2, gov_y + 18 + li * 18), line, font=gov_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
        
        # Day
        day_y = y + card_h - 30
        draw.text((x + card_w // 2, day_y), planet["day"], font=get_font("regular", 14), fill=hex_to_rgb(TEXT_TERTIARY), anchor="mm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# DIAGRAM 5: BHAVA STRUCTURAL GROUPS
# =============================================================================

def generate_bhava_structural(output_path, size=1200):
    """Generate the 12 Bhavas structural architecture diagram."""
    img = Image.new("RGB", (size, size), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    cx, cy = size // 2, size // 2 + 20
    r = int(size * 0.32)
    
    title_font = get_font("bold", 48)
    subtitle_font = get_font("light", 24)
    draw.text((cx, 40), "The 12 Bhavas — Structural Architecture", font=title_font, fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    draw.text((cx, 80), "Kendra · Trikona · Dusthana · Upachaya", font=subtitle_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Diamond points
    def polar_to_cartesian(angle, radius):
        rad = math.radians(angle - 90)
        return (cx + radius * math.cos(rad), cy + radius * math.sin(rad))
    
    diamond = [polar_to_cartesian(a, r) for a in [0, 90, 180, 270]]
    diamond = [(int(p[0]), int(p[1])) for p in diamond]
    
    # Draw diamond background with subtle fill
    draw.polygon(diamond, fill=hex_to_rgb("#FFFBEB"), outline=hex_to_rgb("#D4A373"), width=3)
    
    # Internal cross lines
    draw.line([diamond[0], diamond[2]], fill=hex_to_rgb("#D4A373"), width=1)
    draw.line([diamond[1], diamond[3]], fill=hex_to_rgb("#D4A373"), width=1)
    
    # House positions (diamond layout)
    house_positions = {
        1: (0, r * 0.5), 2: (45, r * 0.75), 3: (75, r * 0.85),
        4: (90, r * 0.5), 5: (105, r * 0.85), 6: (135, r * 0.75),
        7: (180, r * 0.5), 8: (225, r * 0.75), 9: (255, r * 0.85),
        10: (270, r * 0.5), 11: (285, r * 0.85), 12: (315, r * 0.75),
    }
    
    for h in HOUSES:
        angle, dist = house_positions[h["num"]]
        px, py = polar_to_cartesian(angle, dist)
        px, py = int(px), int(py)
        
        # Determine group color
        gc = None
        for gname, gdata in GROUPS.items():
            if gname in h["group"]:
                gc = gdata
                break
        if not gc:
            gc = {"color": "#D97706", "bg": "#FFFBEB"}
        
        # House number chip
        chip_r = 32
        draw.ellipse([px - chip_r, py - chip_r, px + chip_r, py + chip_r], fill=hex_to_rgb(CARD_BG), outline=hex_to_rgb(gc["color"]), width=3)
        num_font = get_font("bold", 28)
        draw.text((px, py), str(h["num"]), font=num_font, fill=hex_to_rgb(gc["color"]), anchor="mm")
        
        # Sanskrit name below
        sans_font = get_font("semibold", 16)
        draw.text((px, py + 44), h["sanskrit"], font=sans_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Corner labels
    corner_font = get_font("semibold", 18)
    draw.text((cx, cy - r - 20), "1st House · Lagna", font=corner_font, fill=hex_to_rgb("#92400E"), anchor="mm")
    draw.text((cx, cy + r + 20), "7th House · Yuvati", font=corner_font, fill=hex_to_rgb("#92400E"), anchor="mm")
    draw.text((cx - r - 20, cy), "4th House", font=corner_font, fill=hex_to_rgb("#92400E"), anchor="rm")
    draw.text((cx + r + 20, cy), "10th House", font=corner_font, fill=hex_to_rgb("#92400E"), anchor="lm")
    
    # Center circle
    center_r = 60
    draw.ellipse([cx - center_r, cy - center_r, cx + center_r, cy + center_r], fill=hex_to_rgb(CARD_BG), outline=hex_to_rgb("#D4A373"), width=2)
    draw.text((cx, cy - 8), "12 Bhavas", font=get_font("bold", 22), fill=hex_to_rgb("#78350F"), anchor="mm")
    draw.text((cx, cy + 14), "House Chart", font=get_font("regular", 16), fill=hex_to_rgb("#A16207"), anchor="mm")
    
    # Legend at bottom
    legend_y = size - 100
    legend_items = list(GROUPS.items())
    item_w = 280
    total_legend = len(legend_items) * item_w
    lx_start = (size - total_legend) // 2
    for i, (gname, gdata) in enumerate(legend_items):
        lx = lx_start + i * item_w
        # Color swatch
        draw.ellipse([lx + 10, legend_y + 10, lx + 30, legend_y + 30], fill=hex_to_rgb(gdata["color"]))
        draw.text((lx + 40, legend_y + 20), gdata["label"], font=get_font("regular", 18), fill=hex_to_rgb(TEXT_PRIMARY), anchor="lm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# DIAGRAM 6: NAKSHATRA PADAS
# =============================================================================

def generate_nakshatra_padas(output_path, size=1400):
    """Generate the Nakshatra Padas 108 diagram."""
    img = Image.new("RGB", (size, size), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    cx, cy = size // 2, size // 2
    outer_r = int(size * 0.38)
    mid_r = int(size * 0.24)
    inner_r = int(size * 0.12)
    
    title_font = get_font("bold", 48)
    subtitle_font = get_font("light", 24)
    draw.text((cx, 40), "Nakshatras & The 108 Padas", font=title_font, fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    draw.text((cx, 80), "27 Nakshatras × 4 Padas = 108 Micro-Divisions", font=subtitle_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Draw rings
    draw.ellipse([cx - outer_r - 2, cy - outer_r - 2, cx + outer_r + 2, cy + outer_r + 2], outline=hex_to_rgb("#D4A373"), width=3)
    draw.ellipse([cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r], fill=hex_to_rgb("#FFFBEB"), outline=hex_to_rgb("#D4A373"), width=1)
    draw.ellipse([cx - mid_r, cy - mid_r, cx + mid_r, cy + mid_r], outline=hex_to_rgb("#D4A373"), width=1)
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=hex_to_rgb(CARD_BG), outline=hex_to_rgb("#D4A373"), width=2)
    
    # 27 segments
    for i in range(27):
        start_angle = (i * 360) / 27
        end_angle = ((i + 1) * 360) / 27
        mid_angle = start_angle + 180 / 27
        
        # Subtle alternating fill
        if i % 2 == 0:
            wedge_points = []
            for a in range(int(start_angle * 10), int(end_angle * 10) + 1, 1):
                rad = math.radians(a / 10 - 90)
                wedge_points.append((cx + outer_r * math.cos(rad), cy + outer_r * math.sin(rad)))
            for a in range(int(end_angle * 10), int(start_angle * 10) - 1, -1):
                rad = math.radians(a / 10 - 90)
                wedge_points.append((cx + mid_r * math.cos(rad), cy + mid_r * math.sin(rad)))
            wedge_points = [(int(p[0]), int(p[1])) for p in wedge_points]
            draw.polygon(wedge_points, fill=hex_to_rgb("#FEF3C7"), outline=hex_to_rgb("#E5E7EB"), width=1)
        
        # Label
        label_r = (outer_r + mid_r) // 2
        rad = math.radians(mid_angle - 90)
        lx = int(cx + label_r * math.cos(rad))
        ly = int(cy + label_r * math.sin(rad))
        
        if i < 9:  # Only label first 9 for clarity
            nak_name = NAKSHATRAS[i]["name"]
            label_font = get_font("semibold", 14)
            draw.text((lx, ly), nak_name, font=label_font, fill=hex_to_rgb("#78350F"), anchor="mm")
    
    # Center
    draw.text((cx, cy - 10), "27 × 4 = 108", font=get_font("bold", 32), fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    draw.text((cx, cy + 20), "Padas", font=get_font("regular", 20), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Degree markers
    for deg in [0, 90, 180, 270]:
        rad = math.radians(deg - 90)
        x = int(cx + (outer_r + 15) * math.cos(rad))
        y = int(cy + (outer_r + 15) * math.sin(rad))
        draw.text((x, y), f"{deg}°", font=get_font("regular", 16), fill=hex_to_rgb("#92400E"), anchor="mm")
    
    # Info cards around the wheel
    card_w, card_h = 320, 160
    info_cards = [
        (40, 140, "The 2.25 Rule", "27 Nakshatras fit into 12 Rashis.\nEach Rashi contains exactly\n2.25 Nakshatras (2 full + 1 quarter)."),
        (size - 40 - card_w, 140, "The Padas", "Each Nakshatra has 4 Padas.\nEach Pada = 3°20'.\nTotal: 108 Padas across the zodiac."),
        (40, size - 180, "Rulership Loop", "Nakshatras are ruled by 9 Grahas\nin repeating sequence:\nKetu → Venus → Sun → Moon → Mars → ..."),
        (size - 40 - card_w, size - 180, "Navamsha Link", "108 Padas = 108 Navamshas.\nEach Pada maps to exactly\none D-9 division sign."),
    ]
    for x, y, title, body in info_cards:
        draw_card(img, draw, [x, y, x + card_w, y + card_h], radius=16, fill=CARD_BG, shadow=True)
        draw.text((x + card_w // 2, y + 24), title, font=get_font("bold", 20), fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
        lines = body.split("\n")
        for i, line in enumerate(lines):
            draw.text((x + card_w // 2, y + 55 + i * 22), line, font=get_font("regular", 16), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# DIAGRAM 7: AYANAMSA DRIFT
# =============================================================================

def generate_ayanamsa(output_path, width=1920, height=1080):
    """Generate the Ayanamsa drift diagram."""
    img = Image.new("RGB", (width, height), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    title_font = get_font("bold", 48)
    subtitle_font = get_font("light", 24)
    draw.text((width // 2, 50), "Ayanamsa: The Drift Between Tropical & Sidereal Zodiacs", font=title_font, fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    draw.text((width // 2, 95), "Precession of the Equinoxes causes a ~24° separation between Western & Vedic starting points", font=subtitle_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Two large cards side by side
    card_w, card_h = 520, 600
    gap = 120
    left_x = (width - 2 * card_w - gap) // 2
    right_x = left_x + card_w + gap
    y = 160
    
    # Left card: Tropical
    draw_card(img, draw, [left_x, y, left_x + card_w, y + card_h], radius=24, fill=CARD_BG, shadow=True)
    draw.rounded_rectangle([left_x, y, left_x + card_w, y + 8], radius=24, fill=hex_to_rgb("#DC2626"))
    draw.text((left_x + card_w // 2, y + 40), "Tropical (Sayana)", font=get_font("bold", 28), fill=hex_to_rgb("#DC2626"), anchor="mm")
    draw.text((left_x + card_w // 2, y + 75), "Tied to Seasons / Vernal Equinox", font=get_font("regular", 18), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Tropical circle
    t_cx = left_x + card_w // 2
    t_cy = y + 280
    t_r = 140
    draw.ellipse([t_cx - t_r, t_cy - t_r, t_cx + t_r, t_cy + t_r], outline=hex_to_rgb("#DC2626"), width=3)
    draw.ellipse([t_cx - t_r + 20, t_cy - t_r + 20, t_cx + t_r - 20, t_cy + t_r - 20], outline=hex_to_rgb("#DC2626"), width=1)
    # 0° Aries marker at top
    draw.polygon([(t_cx, t_cy - t_r - 15), (t_cx - 10, t_cy - t_r - 5), (t_cx + 10, t_cy - t_r - 5)], fill=hex_to_rgb("#DC2626"))
    draw.text((t_cx, t_cy - t_r - 28), "0° Aries", font=get_font("bold", 16), fill=hex_to_rgb("#DC2626"), anchor="mm")
    draw.text((t_cx, t_cy + 10), "Season-based", font=get_font("regular", 16), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Right card: Sidereal
    draw_card(img, draw, [right_x, y, right_x + card_w, y + card_h], radius=24, fill=CARD_BG, shadow=True)
    draw.rounded_rectangle([right_x, y, right_x + card_w, y + 8], radius=24, fill=hex_to_rgb("#2563EB"))
    draw.text((right_x + card_w // 2, y + 40), "Sidereal (Nirayana)", font=get_font("bold", 28), fill=hex_to_rgb("#2563EB"), anchor="mm")
    draw.text((right_x + card_w // 2, y + 75), "Tied to Fixed Stars / Actual Constellations", font=get_font("regular", 18), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    s_cx = right_x + card_w // 2
    s_cy = y + 280
    s_r = 140
    draw.ellipse([s_cx - s_r, s_cy - s_r, s_cx + s_r, s_cy + s_r], outline=hex_to_rgb("#2563EB"), width=3)
    draw.ellipse([s_cx - s_r + 20, s_cy - s_r + 20, s_cx + s_r - 20, s_cy + s_r - 20], outline=hex_to_rgb("#2563EB"), width=1)
    # 0° Aries shifted
    shift_deg = 24
    shift_rad = math.radians(-shift_deg - 90)
    sx = int(s_cx + (s_r + 15) * math.cos(shift_rad))
    sy = int(s_cy + (s_r + 15) * math.sin(shift_rad))
    draw.polygon([(sx, sy), (int(sx - 8 * math.cos(shift_rad - 1.2)), int(sy - 8 * math.sin(shift_rad - 1.2))), 
                  (int(sx - 8 * math.cos(shift_rad + 1.2)), int(sy - 8 * math.sin(shift_rad + 1.2)))], fill=hex_to_rgb("#2563EB"))
    draw.text((sx, sy - 15), "0° Aries", font=get_font("bold", 16), fill=hex_to_rgb("#2563EB"), anchor="mm")
    draw.text((s_cx, s_cy + 10), "Star-based", font=get_font("regular", 16), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Center arrow showing drift
    arrow_y = y + 280
    arrow_x1 = left_x + card_w + 20
    arrow_x2 = right_x - 20
    draw.line([(arrow_x1, arrow_y), (arrow_x2, arrow_y)], fill=hex_to_rgb(ACCENT_AMBER), width=4)
    # Arrow heads
    draw.polygon([(arrow_x2, arrow_y), (arrow_x2 - 12, arrow_y - 8), (arrow_x2 - 12, arrow_y + 8)], fill=hex_to_rgb(ACCENT_AMBER))
    draw.polygon([(arrow_x1, arrow_y), (arrow_x1 + 12, arrow_y - 8), (arrow_x1 + 12, arrow_y + 8)], fill=hex_to_rgb(ACCENT_AMBER))
    draw.text((width // 2, arrow_y - 18), "AYANAMSA ≈ 24°", font=get_font("bold", 22), fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    draw.text((width // 2, arrow_y + 18), "(Drift since ~285 AD)", font=get_font("regular", 16), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Formula card at bottom
    formula_w, formula_h = 700, 70
    fx = (width - formula_w) // 2
    fy = height - 160
    draw_card(img, draw, [fx, fy, fx + formula_w, fy + formula_h], radius=16, fill=CARD_BG, shadow=True, outline=ACCENT_AMBER, outline_width=2)
    draw.text((width // 2, fy + formula_h // 2), "Vedic Longitude = Tropical Longitude − Ayanamsa", font=get_font("bold", 22), fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    
    draw.text((width // 2, height - 50), "Precession rate: ~50.3 arc-seconds/year (≈1° every 72 years)", font=get_font("regular", 16), fill=hex_to_rgb(TEXT_TERTIARY), anchor="mm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# DIAGRAM 8: PANCHANG FIVE LIMBS
# =============================================================================

def generate_panchang(output_path, width=1920, height=1080):
    """Generate the Panchang Five Limbs diagram."""
    img = Image.new("RGB", (width, height), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    title_font = get_font("bold", 52)
    subtitle_font = get_font("light", 28)
    draw.text((width // 2, 60), "The Panchanga — Five Limbs of Time", font=title_font, fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    draw.text((width // 2, 110), "Tithi · Vara · Nakshatra · Yoga · Karana", font=subtitle_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    limbs = [
        {"name": "Tithi", "sanskrit": "तिथि", "desc": "Lunar Day", "detail": "30 phases per lunar month.\nMoon-Sun angular distance.", "color": "#EA580C"},
        {"name": "Vara", "sanskrit": "वार", "desc": "Weekday", "detail": "7 days ruled by 7 Grahas.\nSunrise-to-sunrise cycle.", "color": "#2563EB"},
        {"name": "Nakshatra", "sanskrit": "नक्षत्र", "desc": "Lunar Mansion", "detail": "27 star segments of 13°20'.\nMoon's daily residence.", "color": "#7C3AED"},
        {"name": "Yoga", "sanskrit": "योग", "desc": "Luni-Solar Union", "detail": "27 combinations of Sun+Moon.\nIndicates day's auspiciousness.", "color": "#16A34A"},
        {"name": "Karana", "sanskrit": "करण", "desc": "Half-Tithi", "detail": "11 types (7 movable + 4 fixed).\nFinest temporal division.", "color": "#0891B2"},
    ]
    
    card_w, card_h = 320, 400
    gap = 28
    total_w = 5 * card_w + 4 * gap
    start_x = (width - total_w) // 2
    y = 180
    
    for i, limb in enumerate(limbs):
        x = start_x + i * (card_w + gap)
        color = limb["color"]
        bg = color + "12"
        
        draw_card(img, draw, [x, y, x + card_w, y + card_h], radius=24, fill=CARD_BG, shadow=True)
        draw.rounded_rectangle([x, y, x + card_w, y + 8], radius=24, fill=hex_to_rgb(color))
        
        # Number badge
        badge_r = 28
        draw.ellipse([x + card_w // 2 - badge_r, y + 50 - badge_r, x + card_w // 2 + badge_r, y + 50 + badge_r], fill=hex_to_rgb(color))
        draw.text((x + card_w // 2, y + 50), str(i + 1), font=get_font("bold", 24), fill=(255, 255, 255), anchor="mm")
        
        # Names
        draw.text((x + card_w // 2, y + 110), limb["name"], font=get_font("bold", 28), fill=hex_to_rgb(color), anchor="mm")
        draw.text((x + card_w // 2, y + 145), limb["sanskrit"], font=get_unicode_font(22), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
        
        # Divider
        draw.line([(x + 30, y + 185), (x + card_w - 30, y + 185)], fill=hex_to_rgb(BORDER_LIGHT), width=1)
        
        # Description
        draw.text((x + card_w // 2, y + 215), limb["desc"], font=get_font("semibold", 18), fill=hex_to_rgb(TEXT_PRIMARY), anchor="mm")
        
        lines = limb["detail"].split("\n")
        for li, line in enumerate(lines):
            draw.text((x + card_w // 2, y + 250 + li * 24), line, font=get_font("regular", 15), fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
        
        # Bottom accent
        draw.rounded_rectangle([x + 20, y + card_h - 40, x + card_w - 20, y + card_h - 20], radius=8, fill=hex_to_rgb(bg), outline=hex_to_rgb(color + "30"), width=1)
        draw.text((x + card_w // 2, y + card_h - 30), f"Limb {i+1} of 5", font=get_font("regular", 13), fill=hex_to_rgb(color), anchor="mm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# DIAGRAM 9: DRISHTI ASPECT CHART
# =============================================================================

def generate_drishti(output_path, width=1920, height=1080):
    """Generate the Drishti (Aspect) Chart diagram."""
    img = Image.new("RGB", (width, height), hex_to_rgb(BG_COLOR))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(img)
    
    title_font = get_font("bold", 48)
    subtitle_font = get_font("light", 24)
    draw.text((width // 2, 50), "Graha Drishti — Planetary Aspects", font=title_font, fill=hex_to_rgb(ACCENT_AMBER), anchor="mm")
    draw.text((width // 2, 90), "How planets cast their gaze across the zodiac", font=subtitle_font, fill=hex_to_rgb(TEXT_SECONDARY), anchor="mm")
    
    # Left side: aspect table
    table_x = 60
    table_y = 160
    row_h = 72
    col_w = 220
    
    aspects = [
        {"planet": "Sun", "aspects": "7th", "special": "—", "color": "#F59E0B"},
        {"planet": "Moon", "aspects": "7th", "special": "—", "color": "#94A3B8"},
        {"planet": "Mars", "aspects": "4, 7, 8", "special": "Extra: 4th & 8th", "color": "#EF4444"},
        {"planet": "Mercury", "aspects": "7th", "special": "—", "color": "#10B981"},
        {"planet": "Jupiter", "aspects": "5, 7, 9", "special": "Extra: 5th & 9th", "color": "#F97316"},
        {"planet": "Venus", "aspects": "7th", "special": "—", "color": "#EC4899"},
        {"planet": "Saturn", "aspects": "3, 7, 10", "special": "Extra: 3rd & 10th", "color": "#6366F1"},
        {"planet": "Rahu", "aspects": "5, 7, 9", "special": "Like Jupiter", "color": "#64748B"},
        {"planet": "Ketu", "aspects": "5, 7, 9", "special": "Like Jupiter", "color": "#71717A"},
    ]
    
    # Table header card
    draw_card(img, draw, [table_x, table_y, table_x + col_w * 3 + 40, table_y + row_h], radius=12, fill=ACCENT_AMBER, shadow=True)
    draw.text((table_x + 20, table_y + row_h // 2), "Planet", font=get_font("bold", 18), fill=(255, 255, 255), anchor="lm")
    draw.text((table_x + col_w + 20, table_y + row_h // 2), "Aspects Houses", font=get_font("bold", 18), fill=(255, 255, 255), anchor="lm")
    draw.text((table_x + col_w * 2 + 20, table_y + row_h // 2), "Special Notes", font=get_font("bold", 18), fill=(255, 255, 255), anchor="lm")
    
    for i, a in enumerate(aspects):
        y = table_y + row_h + i * row_h
        bg = CARD_BG if i % 2 == 0 else "#FAFAF9"
        draw_card(img, draw, [table_x, y, table_x + col_w * 3 + 40, y + row_h - 2], radius=8, fill=bg, shadow=False, outline=BORDER_LIGHT, outline_width=1)
        
        # Color dot
        draw.ellipse([table_x + 16, y + row_h // 2 - 8, table_x + 32, y + row_h // 2 + 8], fill=hex_to_rgb(a["color"]))
        draw.text((table_x + 44, y + row_h // 2), a["planet"], font=get_font("semibold", 17), fill=hex_to_rgb(TEXT_PRIMARY), anchor="lm")
        draw.text((table_x + col_w + 20, y + row_h // 2), a["aspects"], font=get_font("regular", 17), fill=hex_to_rgb(TEXT_PRIMARY), anchor="lm")
        draw.text((table_x + col_w * 2 + 20, y + row_h // 2), a["special"], font=get_font("regular", 16), fill=hex_to_rgb(TEXT_SECONDARY), anchor="lm")
    
    # Right side: aspect wheel illustration
    wheel_cx = width - 420
    wheel_cy = height // 2 + 20
    wheel_r = 280
    
    draw.ellipse([wheel_cx - wheel_r - 2, wheel_cy - wheel_r - 2, wheel_cx + wheel_r + 2, wheel_cy + wheel_r + 2], outline=hex_to_rgb("#D4A373"), width=3)
    draw.ellipse([wheel_cx - wheel_r, wheel_cy - wheel_r, wheel_cx + wheel_r, wheel_cy + wheel_r], fill=hex_to_rgb("#FFFBEB"), outline=hex_to_rgb("#D4A373"), width=1)
    
    # 12 house segments
    for i in range(12):
        start_angle = i * 30
        end_angle = (i + 1) * 30
        wedge_points = []
        for a in range(start_angle * 10, end_angle * 10 + 1, 1):
            rad = math.radians(a / 10 - 90)
            wedge_points.append((wheel_cx + wheel_r * math.cos(rad), wheel_cy + wheel_r * math.sin(rad)))
        wedge_points.append((wheel_cx, wheel_cy))
        wedge_points = [(int(p[0]), int(p[1])) for p in wedge_points]
        draw.polygon(wedge_points, fill=hex_to_rgb("#FFF7ED" if i % 2 == 0 else "#FFFBEB"))
    
    # Draw aspect lines example
    # Mars aspects 4, 7, 8 from Aries
    from_angle = 0  # Aries at top
    for offset in [3 * 30, 6 * 30, 7 * 30]:
        to_angle = from_angle + offset
        rad1 = math.radians(from_angle - 90)
        rad2 = math.radians(to_angle - 90)
        x1 = int(wheel_cx + (wheel_r - 20) * math.cos(rad1))
        y1 = int(wheel_cy + (wheel_r - 20) * math.sin(rad1))
        x2 = int(wheel_cx + (wheel_r - 20) * math.cos(rad2))
        y2 = int(wheel_cy + (wheel_r - 20) * math.sin(rad2))
        draw.line([(x1, y1), (x2, y2)], fill=hex_to_rgb("#EF444480"), width=2)
    
    # Jupiter aspects 5, 7, 9
    from_angle = 240  # Sagittarius
    for offset in [4 * 30, 6 * 30, 8 * 30]:
        to_angle = from_angle + offset
        rad1 = math.radians(from_angle - 90)
        rad2 = math.radians(to_angle - 90)
        x1 = int(wheel_cx + (wheel_r - 20) * math.cos(rad1))
        y1 = int(wheel_cy + (wheel_r - 20) * math.sin(rad1))
        x2 = int(wheel_cx + (wheel_r - 20) * math.cos(rad2))
        y2 = int(wheel_cy + (wheel_r - 20) * math.sin(rad2))
        draw.line([(x1, y1), (x2, y2)], fill=hex_to_rgb("#F9731680"), width=2)
    
    # House numbers
    for i in range(12):
        angle = i * 30 + 15
        rad = math.radians(angle - 90)
        hx = int(wheel_cx + (wheel_r * 0.65) * math.cos(rad))
        hy = int(wheel_cy + (wheel_r * 0.65) * math.sin(rad))
        draw.text((hx, hy), str(i + 1), font=get_font("bold", 18), fill=hex_to_rgb("#92400E"), anchor="mm")
    
    # Center
    draw.ellipse([wheel_cx - 50, wheel_cy - 50, wheel_cx + 50, wheel_cy + 50], fill=hex_to_rgb(CARD_BG), outline=hex_to_rgb("#D4A373"), width=2)
    draw.text((wheel_cx, wheel_cy), "Drishti", font=get_font("bold", 18), fill=hex_to_rgb("#78350F"), anchor="mm")
    
    # Legend for aspect lines
    legend_x = width - 360
    legend_y = 160
    legend_items = [
        ("Mars (4,7,8)", "#EF4444"),
        ("Jupiter (5,7,9)", "#F97316"),
        ("Saturn (3,7,10)", "#6366F1"),
    ]
    for i, (label, color) in enumerate(legend_items):
        ly = legend_y + i * 30
        draw.line([(legend_x, ly), (legend_x + 30, ly)], fill=hex_to_rgb(color), width=3)
        draw.text((legend_x + 40, ly), label, font=get_font("regular", 15), fill=hex_to_rgb(TEXT_PRIMARY), anchor="lm")
    
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# =============================================================================
# MAIN
# =============================================================================

def main():
    base = "C:/CorpoAstroOfficial_grahavani/Grahvani/frontend-grahvani-software/public/learning"
    
    generate_bha_chakra(f"{base}/module1/lesson1/rashi-wheel-base.png", size=1800)
    generate_rashi_tattvas(f"{base}/module1/lesson1/rashi-tattvas-overlay.png", size=1800)
    generate_rashi_modalities(f"{base}/module1/lesson1/rashi-modalities-overlay.png", size=1800)
    generate_navagraha_pantheon(f"{base}/module1/lesson2/navagraha-pantheon.png", width=1920, height=1080)
    generate_bhava_structural(f"{base}/module1/lesson3/bhava-structural-groups.png", size=1200)
    generate_nakshatra_padas(f"{base}/module1/lesson4/nakshatra-padas-108.png", size=1400)
    generate_ayanamsa(f"{base}/module2/lesson1/ayanamsa-drift-diagram.png", width=1920, height=1080)
    generate_panchang(f"{base}/module2/lesson2/panchang-five-limbs.png", width=1920, height=1080)
    generate_drishti(f"{base}/module2/lesson3/drishti-aspect-chart.png", width=1920, height=1080)
    
    print("\n[OK] All diagrams generated successfully!")

if __name__ == "__main__":
    main()
