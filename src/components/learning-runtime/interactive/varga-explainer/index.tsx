"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

// The sixteen ṣoḍaśa-varga: D-number, name, part-count n, and the life-domain each magnifies.
const VARGAS = [
  { d: 1, name: "Rāśi", n: 1, domain: "the whole life / body — the master chart" },
  { d: 2, name: "Horā", n: 2, domain: "wealth & resources" },
  { d: 3, name: "Drekkāṇa", n: 3, domain: "siblings, courage, initiative" },
  { d: 4, name: "Chaturthāṁśa", n: 4, domain: "property, home, fixed assets" },
  { d: 7, name: "Saptāṁśa", n: 7, domain: "children & progeny" },
  { d: 9, name: "Navāṁśa", n: 9, domain: "marriage, dharma, inner strength" },
  { d: 10, name: "Daśāṁśa", n: 10, domain: "career, status, action in the world" },
  { d: 12, name: "Dvādaśāṁśa", n: 12, domain: "parents & ancestry" },
  { d: 16, name: "Ṣoḍaśāṁśa", n: 16, domain: "vehicles, luxuries, comforts" },
  { d: 20, name: "Viṁśāṁśa", n: 20, domain: "spiritual practice & devotion" },
  { d: 24, name: "Chaturviṁśāṁśa", n: 24, domain: "education & learning" },
  { d: 27, name: "Saptaviṁśāṁśa", n: 27, domain: "strengths & weaknesses (bhāṁśa)" },
  { d: 30, name: "Triṁśāṁśa", n: 5, domain: "misfortunes & evils", unequal: [5, 5, 8, 7, 5] },
  { d: 40, name: "Khavedāṁśa", n: 40, domain: "maternal lineage & auspiciousness" },
  { d: 45, name: "Akṣavedāṁśa", n: 45, domain: "paternal lineage & conduct" },
  { d: 60, name: "Ṣaṣṭyāṁśa", n: 60, domain: "the karmic substrate (all matters)" },
] as const;

export function VargaExplainer() {
  const [idx, setIdx] = useState(5); // D9
  const [deg, setDeg] = useState(8); // degree within the rāśi
  const v = VARGAS[idx];

  // Part boundaries: equal width 30/n for most; D30 uses the unequal 5/5/8/7/5 segments.
  const widths: number[] = "unequal" in v && v.unequal ? [...v.unequal] : Array.from({ length: v.n }, () => 30 / v.n);
  let acc = 0, activePart = 1;
  const bounds = widths.map((w) => (acc += w)); // cumulative upper bounds
  for (let i = 0; i < bounds.length; i++) { if (deg < bounds[i]) { activePart = i + 1; break; } activePart = i + 1; }

  return (
    <div data-interactive="varga-explainer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Varga explainer</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>One rāśi, cut into a varga</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>A divisional chart (Dn) cuts each 30° rāśi into parts; a planet&apos;s degree lands in one part, which maps to a sign by the varga&apos;s own rule (built per-varga in later lessons). Pick a Dn and a degree.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.8rem" }}>
          {VARGAS.map((vv, i) => (
            <button key={vv.d} type="button" aria-pressed={idx === i} onClick={() => setIdx(i)}
              style={{ border: `1px solid ${idx === i ? GOLD : HAIRLINE}`, borderRadius: 6, background: idx === i ? GOLD : "transparent", color: idx === i ? "#fff" : INK_SECONDARY, padding: "0.2rem 0.45rem", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer" }}>
              D{vv.d}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Degree in rāśi</span>
          <input type="range" min={0} max={29.9} step={0.1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} />
          <strong style={{ color: GOLD }}>{deg.toFixed(1)}°</strong>
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "baseline" }}>
          <strong style={{ color: GOLD, fontSize: "1.05rem" }}>D{v.d} · {v.name}</strong>
          <span style={{ color: INK_SECONDARY, fontWeight: 700, fontSize: "0.82rem" }}>{v.n} part{v.n === 1 ? "" : "s"}{"unequal" in v && v.unequal ? " (unequal: 5°/5°/8°/7°/5°)" : ` of ${(30 / v.n).toFixed(2).replace(/\.00$/, "")}°`}</span>
        </div>
        {/* the 30° bar split into parts */}
        <div style={{ display: "flex", height: "2rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, overflow: "hidden", marginTop: "0.6rem" }}>
          {widths.map((w, i) => (
            <div key={i} style={{ width: `${(w / 30) * 100}%`, borderRight: i < widths.length - 1 ? `1px solid ${HAIRLINE}` : "none", background: i + 1 === activePart ? GOLD : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800, color: i + 1 === activePart ? "#fff" : INK_MUTED }}>
              {v.n <= 12 ? i + 1 : ""}
            </div>
          ))}
        </div>
        <p style={{ margin: "0.7rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          At {deg.toFixed(1)}°, the planet is in <strong style={{ color: GOLD }}>part {activePart} of {v.n}</strong>. {v.d === 1 ? "D1 makes no cut — the varga-sign is just the rāśi itself." : `That part maps to a D${v.d} sign by the ${v.name} rule.`}
        </p>
        <p style={{ margin: "0.4rem 0 0", color: GREEN, fontWeight: 800, fontSize: "0.88rem" }}>D{v.d} magnifies: {v.domain}.</p>
        {"unequal" in v && v.unequal ? <p style={{ margin: "0.3rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Note: D30 is the exception — five UNEQUAL parts (5°/5°/8°/7°/5°), not thirty equal ones.</p> : null}
        <p style={{ margin: "0.4rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>A varga is a zoom-lens on the one birth chart — never a separate horoscope. Read D1 first, then the domain&apos;s varga.</p>
      </section>
    </div>
  );
}
