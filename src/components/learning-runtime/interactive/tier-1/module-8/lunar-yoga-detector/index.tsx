"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A8412B";

type Pos = "twelfth" | "elsewhere" | "second";
// counts = whether the planet qualifies for lunar yogas (Sun and the nodes are excluded by most authorities).
const PLANETS: { name: string; glyph: string; counts: boolean }[] = [
  { name: "Sun", glyph: "☉", counts: false },
  { name: "Mars", glyph: "♂", counts: true },
  { name: "Mercury", glyph: "☿", counts: true },
  { name: "Jupiter", glyph: "♃", counts: true },
  { name: "Venus", glyph: "♀", counts: true },
  { name: "Saturn", glyph: "♄", counts: true },
  { name: "Rāhu", glyph: "☊", counts: false },
  { name: "Ketu", glyph: "☋", counts: false },
];

const YOGA_MEANING: Record<string, string> = {
  Sunaphā: "self-earned means, intelligence and earned status — wealth made by one's own effort.",
  Anaphā: "health, well-being, contentment and a refined, often spiritual, bent.",
  Durudharā: "blessings on both sides — wealth, enjoyment, generosity and bilateral support.",
  Kemadruma: "the Moon stands unflanked — a register of struggle or isolation. But detect, don't pronounce: cancellations (Kemadruma-bhaṅga) are common and are taken up in the next lesson.",
};

export function LunarYogaDetector() {
  const [pos, setPos] = useState<Record<string, Pos>>({ Jupiter: "second" });
  const getPos = (n: string): Pos => pos[n] ?? "elsewhere";
  const setPlanet = (n: string, p: Pos) => setPos((prev) => ({ ...prev, [n]: p }));

  const qualifying = PLANETS.filter((p) => p.counts);
  const secondOcc = qualifying.filter((p) => getPos(p.name) === "second");
  const twelfthOcc = qualifying.filter((p) => getPos(p.name) === "twelfth");
  const has2 = secondOcc.length > 0, has12 = twelfthOcc.length > 0;
  const yoga = has2 && has12 ? "Durudharā" : has2 ? "Sunaphā" : has12 ? "Anaphā" : "Kemadruma";
  const yogaColor = yoga === "Kemadruma" ? RED : GREEN;

  const Cell = ({ which, label }: { which: Pos; label: string }) => (
    <div style={{ flex: 1, border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.5rem", minHeight: "4.5rem" }}>
      <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", textAlign: "center" }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.2rem", justifyContent: "center", marginTop: "0.3rem" }}>
        {PLANETS.filter((p) => getPos(p.name) === which).map((p) => (
          <span key={p.name} title={p.name} style={{ fontSize: "1.05rem", color: p.counts ? INK_PRIMARY : INK_MUTED, opacity: p.counts ? 1 : 0.55 }}>{p.glyph}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div data-interactive="lunar-yoga-detector" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Lunar yoga detector</p>
        <h2 style={{ margin: "0.2rem 0 0.1rem", color: GOLD, fontSize: "1.3rem" }}>What flanks the Moon?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Place each planet in the 2nd-from-Moon, the 12th-from-Moon, or elsewhere. The Sun and the nodes (greyed) don&apos;t count. Which lunar yoga forms?</p>
        <div style={{ display: "grid", gap: "0.3rem", marginTop: "0.8rem" }}>
          {PLANETS.map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "5.5rem", color: p.counts ? INK_SECONDARY : INK_MUTED, fontWeight: 700, fontSize: "0.85rem" }}>{p.glyph} {p.name}{p.counts ? "" : " (excl.)"}</span>
              {(["twelfth", "elsewhere", "second"] as Pos[]).map((opt) => (
                <button key={opt} type="button" aria-pressed={getPos(p.name) === opt} onClick={() => setPlanet(p.name, opt)}
                  style={{ flex: 1, border: `1px solid ${getPos(p.name) === opt ? GOLD : HAIRLINE}`, borderRadius: 6, background: getPos(p.name) === opt ? `${GOLD}1A` : "transparent", color: getPos(p.name) === opt ? GOLD : INK_MUTED, padding: "0.2rem 0.3rem", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}>
                  {opt === "twelfth" ? "12th from Moon" : opt === "second" ? "2nd from Moon" : "elsewhere"}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section style={{ border: `1px solid ${yogaColor}`, borderRadius: 8, background: `${yogaColor}10`, padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "stretch" }}>
          <Cell which="twelfth" label="12th from Moon" />
          <div style={{ flex: 1, border: `2px solid ${GOLD}`, borderRadius: 8, background: `${GOLD}14`, padding: "0.5rem", minHeight: "4.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.4rem" }}>☽</span>
            <span style={{ color: GOLD, fontWeight: 900, fontSize: "0.72rem" }}>the Moon</span>
          </div>
          <Cell which="second" label="2nd from Moon" />
        </div>
        <p style={{ margin: "0.8rem 0 0", fontWeight: 900, fontSize: "1.1rem", color: yogaColor }}>{yoga}</p>
        <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>{YOGA_MEANING[yoga]}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
          2nd flank: {has2 ? secondOcc.map((p) => p.name).join(", ") : "empty"} · 12th flank: {has12 ? twelfthOcc.map((p) => p.name).join(", ") : "empty"}. {yoga === "Kemadruma" ? "Both empty of qualifying planets." : ""}
        </p>
      </section>
    </div>
  );
}
