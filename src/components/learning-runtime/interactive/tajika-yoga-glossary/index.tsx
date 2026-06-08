"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

// The sixteen Tājika yogas exactly as the lesson's §4.2 enumeration lists them (no added mechanics).
// `core` = the foundational four to internalise now; the rest are names to recognise (mechanics → M19).
const YOGAS: { n: number; name: string; gloss: string; core?: boolean; role?: string }[] = [
  { n: 1, name: "Itthaśāla", gloss: "applying aspect — light coming together (the core “yes, forming”)", core: true, role: "completes" },
  { n: 2, name: "Iśrāf", gloss: "separating aspect — light moving apart (fading)", core: true, role: "fades" },
  { n: 3, name: "Nakta", gloss: "“translation of light” — a fast graha carries light between two not in mutual aspect", core: true, role: "transfers" },
  { n: 4, name: "Yamayā", gloss: "“collection of light” — two grahas relate through a third they both aspect", core: true, role: "transfers" },
  { n: 5, name: "Mānau", gloss: "a prohibition/withholding register (the slower graha's role)", role: "blocks" },
  { n: 6, name: "Kambūla", gloss: "a reinforcing configuration (classically involving the Moon)" },
  { n: 7, name: "Gairi-Kambūla", gloss: "a variant/absence of Kambūla" },
  { n: 8, name: "Khallāsara", gloss: "loss of light — the aspect does not consummate (void)", role: "fails" },
  { n: 9, name: "Dutthottha", gloss: "“twice-risen” configuration" },
  { n: 10, name: "Tambīra", gloss: "a named relational state (“copper-coloured”)" },
  { n: 11, name: "Kuttha", gloss: "a favourable (“smiling”) state" },
  { n: 12, name: "Dhruva", gloss: "a “fixed” yoga" },
  { n: 13, name: "Duphāli-Kuttha", gloss: "an intensified favourable state" },
  { n: 14, name: "Dur-pha", gloss: "an unfavourable “bad-light” state" },
  { n: 15, name: "Iśarātha", gloss: "an equality/balance of aspect" },
  { n: 16, name: "Rūdha", gloss: "a “risen” yoga" },
];

export function TajikaYogaGlossary() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set([1, 2, 3, 4]));

  const toggle = (n: number) => setFlipped((prev) => {
    const next = new Set(prev);
    if (next.has(n)) next.delete(n); else next.add(n);
    return next;
  });

  return (
    <div data-interactive="tajika-yoga-glossary" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>The sixteen Tājika yogas (ṣoḍaśa-yoga)</p>
        <h2 style={{ margin: "0.2rem 0 0.1rem", color: GOLD, fontSize: "1.3rem" }}>A naming glossary</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
          Tap a card to flip it. The <strong style={{ color: GOLD }}>foundational four</strong> (Itthaśāla, Iśrāf, Nakta, Yamayā) are the ones to internalise now; the rest are names to recognise — full mechanics in Module 19. Names and order vary across sources.
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))", gap: "0.5rem" }}>
        {YOGAS.map((y) => {
          const open = flipped.has(y.n);
          return (
            <button
              key={y.n}
              type="button"
              onClick={() => toggle(y.n)}
              aria-pressed={open}
              style={{ textAlign: "left", border: `1px solid ${y.core ? GOLD : HAIRLINE}`, borderRadius: 8, background: y.core ? `${GOLD}10` : SURFACE, padding: "0.6rem 0.7rem", cursor: "pointer", minHeight: "5.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.3rem" }}>
                <span style={{ color: y.core ? GOLD : INK_PRIMARY, fontWeight: 900, fontSize: "0.95rem" }}>{y.n}. {y.name}</span>
                {y.core ? <span style={{ color: GREEN, fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase" }}>core</span> : <span style={{ color: INK_MUTED, fontSize: "0.58rem", fontWeight: 800 }}>→ M19</span>}
              </div>
              {open
                ? <span style={{ color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.4 }}>{y.gloss}{y.role ? <em style={{ color: GOLD }}> · {y.role}</em> : null}</span>
                : <span style={{ color: INK_MUTED, fontSize: "0.72rem", fontStyle: "italic" }}>tap to reveal gloss</span>}
            </button>
          );
        })}
      </section>

      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
        Roles (where the lesson assigns one): a promise that <em style={{ color: GOLD }}>completes</em> (Itthaśāla), <em style={{ color: GOLD }}>fails</em> (Khallāsara), is <em style={{ color: GOLD }}>carried</em> by a third graha (Nakta / Yamayā), or is <em style={{ color: GOLD }}>blocked</em> (Mānau). These are the interpretive units of the annual chart.
      </p>
    </div>
  );
}
