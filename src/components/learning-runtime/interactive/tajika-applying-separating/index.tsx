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

// Daily-motion order (fastest → slowest) + dīptāṁśa orb (degrees).
const PLANETS: { name: string; glyph: string; deepta: number }[] = [
  { name: "Moon", glyph: "☽", deepta: 12 },
  { name: "Mercury", glyph: "☿", deepta: 7 },
  { name: "Venus", glyph: "♀", deepta: 7 },
  { name: "Sun", glyph: "☉", deepta: 15 },
  { name: "Mars", glyph: "♂", deepta: 8 },
  { name: "Jupiter", glyph: "♃", deepta: 9 },
  { name: "Saturn", glyph: "♄", deepta: 9 },
];

export function TajikaApplyingSeparating() {
  const [aIdx, setAIdx] = useState(0); // Moon (fast)
  const [bIdx, setBIdx] = useState(6); // Saturn (slow)
  const [offset, setOffset] = useState(-4); // faster graha's degrees from exact; <0 = before exact
  const [retro, setRetro] = useState(false);

  // The faster graha is the one earlier in PLANETS (lower index = faster motion).
  const fasterIdx = Math.min(aIdx, bIdx), slowerIdx = Math.max(aIdx, bIdx);
  const faster = PLANETS[fasterIdx], slower = PLANETS[slowerIdx];
  const orb = (PLANETS[aIdx].deepta + PLANETS[bIdx].deepta) / 2;

  const inOrb = Math.abs(offset) <= orb;
  // Direct: offset<0 (before exact, lower longitude) → moving up to exact = applying.
  // Retrograde inverts the sense (motion is backward).
  const exact = offset === 0;
  const applying = !exact && ((offset < 0) !== retro);
  const yoga = !inOrb ? null : exact ? "exact" : applying ? "Itthaśāla" : "Īsarāpha";

  const samePlanet = aIdx === bIdx;

  return (
    <div data-interactive="tajika-applying-separating" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Itthaśāla vs Īsarāpha</p>
        <h2 style={{ margin: "0.2rem 0 0.6rem", color: GOLD, fontSize: "1.3rem" }}>Applying or separating?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
          {[{ idx: aIdx, set: setAIdx, l: "Graha A" }, { idx: bIdx, set: setBIdx, l: "Graha B" }].map((s) => (
            <span key={s.l} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>{s.l}</span>
              <select value={s.idx} onChange={(e) => s.set(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.3rem 0.45rem", fontWeight: 700 }}>
                {PLANETS.map((p, i) => <option key={p.name} value={i}>{p.glyph} {p.name}</option>)}
              </select>
            </span>
          ))}
        </div>
        {samePlanet ? (
          <p style={{ margin: "0.6rem 0 0", color: RED, fontWeight: 700, fontSize: "0.85rem" }}>Pick two different grahas.</p>
        ) : (
          <p style={{ margin: "0.6rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
            <strong style={{ color: GOLD }}>{faster.name}</strong> is the faster graha — it applies or separates; {slower.name} waits. Combined orb (dīptāṁśa half-sum) = <strong>{orb}°</strong>.
          </p>
        )}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>{faster.name} from exact:</span>
          <input type="range" min={-20} max={20} value={offset} onChange={(e) => setOffset(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} aria-label="degrees from exact" />
          <strong style={{ color: GOLD }}>{offset > 0 ? `+${offset}` : offset}°</strong>
          <button type="button" aria-pressed={retro} onClick={() => setRetro((r) => !r)} style={{ border: `1px solid ${retro ? GOLD : HAIRLINE}`, borderRadius: 8, background: retro ? GOLD : "transparent", color: retro ? "#fff" : INK_SECONDARY, padding: "0.3rem 0.6rem", fontWeight: 850, cursor: "pointer" }}>
            {faster.name} retrograde {retro ? "ON" : "OFF"}
          </button>
        </div>
      </section>

      {!samePlanet && (
        <section style={{ border: `1px solid ${yoga === "Itthaśāla" ? GREEN : yoga === "Īsarāpha" ? RED : HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          {/* orb track with exact at center */}
          <div style={{ position: "relative", height: "2.2rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: `linear-gradient(90deg, transparent 0%, ${GOLD}14 ${50 - (orb / 20) * 50}%, ${GOLD}22 50%, ${GOLD}14 ${50 + (orb / 20) * 50}%, transparent 100%)` }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: GOLD }} />
            <div style={{ position: "absolute", left: `${50 + (offset / 20) * 50}%`, top: "50%", transform: "translate(-50%,-50%)", fontSize: "1.1rem" }}>{faster.glyph}</div>
            <span style={{ position: "absolute", left: "50%", bottom: 2, transform: "translateX(-50%)", color: INK_MUTED, fontSize: "0.6rem", fontWeight: 800 }}>exact</span>
          </div>
          <p style={{ margin: "0.7rem 0 0", fontWeight: 900, fontSize: "1.05rem", color: yoga === "Itthaśāla" ? GREEN : yoga === "Īsarāpha" ? RED : INK_SECONDARY }}>
            {!inOrb && `Out of orb — no Tājika connection (|${offset}°| > ${orb}° orb).`}
            {inOrb && exact && `Exact aspect — the union is at its peak.`}
            {yoga === "Itthaśāla" && `Itthaśāla (applying) — ${faster.name} is approaching exact${retro ? " (retrograde)" : ""}: a forming connection, a promise that comes together.`}
            {yoga === "Īsarāpha" && `Īsarāpha (separating) — ${faster.name} has passed exact${retro ? " (retrograde)" : ""}: a fading matter, already done or dissolving.`}
          </p>
          <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
            Both require the planets within orb first. The faster graha applies (before exact) → Itthaśāla; once it crosses exact it separates → Īsarāpha. Retrograde motion reverses which side is &ldquo;approaching.&rdquo; A promise/timing lens of the annual chart — not a fatalistic verdict.
          </p>
        </section>
      )}
    </div>
  );
}
