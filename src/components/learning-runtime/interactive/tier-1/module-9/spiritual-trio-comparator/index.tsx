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

// The lesson's §4.1 trio: D20 = practice (what you do), D27 = vehicle/life-force (what carries it),
// D60 = karmic substrate (the ground it works on). Abstract strong/weak toggles — no chart data.
const LAYERS = [
  { key: "D20", name: "Viṁśāṁśa", role: "practice — the sādhanā you actually do" },
  { key: "D27", name: "Saptaviṁśāṁśa", role: "vehicle / life-force — the stamina to sustain it" },
  { key: "D60", name: "Ṣaṣṭyāṁśa", role: "karmic substrate — the ground it works on" },
];

function synthesis(d20: boolean, d27: boolean, d60: boolean) {
  if (d20 && d27 && d60) return { color: GREEN, text: "Strong on all three: committed practice, the stamina to hold it, and deep karmic ground — a marked spiritual capacity (potential, not a guarantee)." };
  if (d20 && !d27) return { color: GOLD, text: "A willing spirit in a tiring vehicle: the practice is there (D20) but the life-force to sustain it (D27) is thin — pace the sādhanā to the body's stamina." };
  if (d60 && !d20) return { color: GOLD, text: "Good karmic ground not yet matched by practice: the substrate (D60) is rich but active sādhanā (D20) hasn't caught up — the potential awaits expression." };
  if (!d20 && !d27 && !d60) return { color: RED, text: "All three modest: spiritual capacity is quiet here. Not doom — practice still helps; it simply asks more deliberate effort. Read supportively." };
  return { color: GOLD, text: "A mixed picture — name which varga supports which point (practice / stamina / karmic ground) and read the three together, never one alone." };
}

export function SpiritualTrioComparator() {
  const [d20, setD20] = useState(true);
  const [d27, setD27] = useState(true);
  const [d60, setD60] = useState(true);
  const states = [d20, d27, d60];
  const setters = [setD20, setD27, setD60];
  const s = synthesis(d20, d27, d60);

  return (
    <div data-interactive="spiritual-trio-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>The spiritual trio</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>D20 · D27 · D60 read together</h2>
        <p style={{ margin: "0 0 0.7rem", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Three distinct layers: the practice (D20), the stamina that carries it (D27), and the karmic ground it works on (D60). Set each and read the synthesis — always alongside the D1.</p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {LAYERS.map((l, i) => (
            <div key={l.key} style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
              <div style={{ flex: "1 1 12rem" }}>
                <strong style={{ color: GOLD }}>{l.key} {l.name}</strong>
                <div style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{l.role}</div>
              </div>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                {[{ t: "Strong", b: true }, { t: "Weak", b: false }].map((o) => (
                  <button key={o.t} type="button" aria-pressed={states[i] === o.b} onClick={() => setters[i](o.b)}
                    style={{ border: `1px solid ${states[i] === o.b ? GOLD : HAIRLINE}`, borderRadius: 6, background: states[i] === o.b ? GOLD : "transparent", color: states[i] === o.b ? "#fff" : INK_SECONDARY, padding: "0.25rem 0.5rem", fontWeight: 800, fontSize: "0.76rem", cursor: "pointer" }}>
                    {o.t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ border: `1px solid ${s.color}`, borderRadius: 8, background: `${s.color}12`, padding: "1rem" }}>
        <p style={{ margin: 0, fontWeight: 900, color: s.color, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Synthesis</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{s.text}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Capacity, not a certificate — the trio shows potential, never a verdict on liberation. The full mokṣa method (with the D1 12th + Ketu, and D60 in depth) is a Tier-2 topic; Tier 1 installs the map.</p>
      </section>
    </div>
  );
}
