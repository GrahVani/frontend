"use client";

import { NAKSHATRAS, RULER_COLORS, GANA_STYLE } from "../nakshatra-data";
import { useLessonSlug } from "../rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];

// Lesson-slug prefix → nakṣatra number (1–27). Profile-lesson slugs begin with the
// (romanized, diacritic-free) nakṣatra name; multi-nakṣatra lessons match their lead.
const SLUG_NUM: Record<string, number> = {
  ashwini: 1, bharani: 2, krittika: 3, rohini: 4, mrigashira: 5, ardra: 6, punarvasu: 7,
  pushya: 8, ashlesha: 9, magha: 10, "purva-phalguni": 11, "uttara-phalguni": 12, hasta: 13,
  chitra: 14, swati: 15, vishakha: 16, anuradha: 17, jyeshtha: 18, mula: 19,
  "purva-ashadha": 20, "uttara-ashadha": 21, shravana: 22, dhanishtha: 23, shatabhishaj: 24,
  "purva-bhadrapada": 25, "uttara-bhadrapada": 26, revati: 27,
};

function numFromSlug(slug: string): number {
  // Longest prefix first, so "purva-phalguni" wins over any shorter collision.
  const keys = Object.keys(SLUG_NUM).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (slug.startsWith(k)) return SLUG_NUM[k];
  }
  return 1;
}

// Format arc-minutes-from-0°-Meṣa as "D°M′ Sign".
function fmtPos(totalMin: number): string {
  const totalDeg = totalMin / 60;
  const signIdx = Math.floor(totalDeg / 30) % 12;
  const degInSign = Math.floor(totalDeg % 30);
  const minPart = Math.round(totalMin % 60);
  return `${degInSign}°${minPart.toString().padStart(2, "0")}′ ${SIGNS[signIdx]}`;
}

function rashisSpanned(startMin: number, endMin: number): string {
  const startSign = Math.floor(startMin / 60 / 30) % 12;
  const endSign = Math.floor((endMin - 1) / 60 / 30) % 12; // just inside the end
  if (startSign === endSign) return SIGNS[startSign];
  return `${SIGNS[startSign]} → ${SIGNS[endSign]}`;
}

// The 4 pādas of nakṣatra N map to consecutive navāṁśa signs: pāda p (1-4) →
// SIGNS[((N-1)*4 + (p-1)) mod 12]. (Aśvinī → Meṣa/Vṛṣabha/Mithuna/Karka.)
function padaNavamshas(num: number): string {
  return [0, 1, 2, 3].map((p) => SIGNS[((num - 1) * 4 + p) % 12]).join(", ");
}

export function NakshatraProfile() {
  const slug = useLessonSlug();
  const num = numFromSlug(slug);
  const n = NAKSHATRAS[num - 1];
  const startMin = (num - 1) * 800; // 13°20′ = 800′
  const endMin = num * 800;
  const lordColor = RULER_COLORS[n.rulerKey];
  const ganaStyle = GANA_STYLE[n.gana];

  const rows: { k: string; v: string; highlight?: boolean }[] = [
    { k: "Number", v: `${num} of 27` },
    { k: "Degree span", v: `${fmtPos(startMin)} – ${fmtPos(endMin)} (13°20′)` },
    { k: "Rāśi", v: rashisSpanned(startMin, endMin) },
    { k: "Pādas → navāṁśa", v: padaNavamshas(num) },
    { k: "Ruling graha (Vimśottarī lord)", v: n.ruler, highlight: true },
    { k: "Devatā", v: n.deity },
    { k: "Symbol", v: n.symbol },
    { k: "Gaṇa", v: n.gana },
    { k: "Yoni", v: n.yoni },
    { k: "Tārā group", v: `${n.taraGroup} · ${n.taraName}` },
    { k: "Meaning", v: n.meaning },
    { k: "Naming syllables", v: n.syllables.join(", ") },
  ];

  return (
    <div data-interactive="nakshatra-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Nakṣatra profile</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
          <h2 style={{ margin: 0, color: GOLD, fontSize: "1.45rem" }}>{n.name}</h2>
          <span style={{ color: INK_SECONDARY, fontSize: "1.25rem", fontWeight: 700 }}>{n.devanagari}</span>
          <span
            style={{
              marginLeft: "auto",
              border: `1px solid ${lordColor?.border ?? HAIRLINE}`,
              background: lordColor?.bg ?? "transparent",
              color: lordColor?.text ?? INK_SECONDARY,
              borderRadius: 999,
              padding: "0.2rem 0.7rem",
              fontWeight: 900,
              fontSize: "0.82rem",
            }}
          >
            Lord: {n.ruler}
          </span>
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label={`Attribute card for ${n.name}`}>
        {rows.map((r, i) => (
          <div
            key={r.k}
            style={{
              display: "flex",
              gap: "0.7rem",
              alignItems: "baseline",
              borderBottom: i === rows.length - 1 ? "none" : `1px dashed ${HAIRLINE}`,
              padding: "0.4rem 0",
              background: r.highlight ? (lordColor ? `${lordColor.bg}` : "transparent") : "transparent",
              borderRadius: r.highlight ? 6 : 0,
            }}
          >
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.84rem", minWidth: "13rem" }}>{r.k}</span>
            <span
              style={{
                color: r.highlight ? (lordColor?.text ?? GOLD) : r.k === "Gaṇa" ? (ganaStyle?.text ?? INK_PRIMARY) : INK_PRIMARY,
                fontWeight: r.highlight ? 900 : 600,
                fontSize: "0.92rem",
                ...(r.k === "Gaṇa" && ganaStyle ? { background: ganaStyle.bg, borderRadius: 6, padding: "0.05rem 0.5rem", textTransform: "capitalize" } : {}),
              }}
            >
              {r.v}
            </span>
          </div>
        ))}
      </section>

      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.84rem", lineHeight: 1.55 }}>
        The lord ({n.ruler}) is the nakṣatra&apos;s Vimśottarī daśā ruler — a Moon placed here would open life with its {n.ruler} daśā. Body-part, nāḍī, and finer correspondences are detailed in the lesson body.
      </p>
    </div>
  );
}
