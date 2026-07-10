"use client";

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const BLUE = "#3b82f6";
const RED = "#A8412B";
const AMBER = "#f59e0b";

const YOGAS: { n: number; name: string; iast?: string; gloss: string; core?: boolean; role?: string }[] = [
  { n: 1,  name: "Itthaśāla",     gloss: "applying aspect — light coming together", core: true, role: "completes" },
  { n: 2,  name: "Iśrāf",         gloss: "separating aspect — light moving apart", core: true, role: "fades" },
  { n: 3,  name: "Nakta",         gloss: "translation of light — a fast graha carries light between two not in mutual aspect", core: true, role: "transfers" },
  { n: 4,  name: "Yamayā",        gloss: "collection of light — two grahas relate through a third they both aspect", core: true, role: "transfers" },
  { n: 5,  name: "Mānau",         gloss: "prohibition / withholding register (slower graha's role)", role: "blocks" },
  { n: 6,  name: "Kambūla",       gloss: "reinforcing configuration (classically involving the Moon)" },
  { n: 7,  name: "Gairi-Kambūla", gloss: "variant / absence of Kambūla" },
  { n: 8,  name: "Khallāsara",    gloss: "loss of light — the aspect does not consummate", role: "fails" },
  { n: 9,  name: "Dutthottha",    gloss: "twice-risen configuration" },
  { n: 10, name: "Tambīra",       gloss: "named relational state (copper-coloured)" },
  { n: 11, name: "Kuttha",        gloss: "favourable / smiling state" },
  { n: 12, name: "Dhruva",        gloss: "fixed yoga" },
  { n: 13, name: "Duphāli-Kuttha", gloss: "intensified favourable state" },
  { n: 14, name: "Dur-pha",       gloss: "unfavourable bad-light state" },
  { n: 15, name: "Iśarātha",      gloss: "equality / balance of aspect" },
  { n: 16, name: "Rūdha",         gloss: "risen yoga" },
];

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  completes: { bg: `${GREEN}12`, color: GREEN },
  fades:     { bg: `${RED}10`,    color: RED },
  transfers: { bg: `${BLUE}10`,   color: BLUE },
  fails:     { bg: `${RED}10`,    color: RED },
  blocks:    { bg: `${AMBER}12`,  color: AMBER },
};

export function TajikaYogaGlossary() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  const [filter, setFilter] = useState<"all" | "core" | "m19">("all");

  const visible = useMemo(() => {
    if (filter === "core") return YOGAS.filter(y => y.core);
    if (filter === "m19") return YOGAS.filter(y => !y.core);
    return YOGAS;
  }, [filter]);

  const allVisibleFlipped = visible.every(y => flipped.has(y.n));

  const toggle = (n: number) => {
    setFlipped(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });
  };

  const toggleAll = () => {
    if (allVisibleFlipped) {
      setFlipped(prev => {
        const next = new Set(prev);
        visible.forEach(y => next.delete(y.n));
        return next;
      });
    } else {
      setFlipped(prev => {
        const next = new Set(prev);
        visible.forEach(y => next.add(y.n));
        return next;
      });
    }
  };

  return (
    <div data-interactive="tajika-yoga-glossary" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          The 16 Tājika Yogas (<IAST>Ṣoḍaśa-yoga</IAST>) — Naming Glossary
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Recognition-level tour: internalise the <strong>foundational four</strong>; the rest are names to recognise — full mechanics in Module 19. Names/order vary by source.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {(["all", "core", "m19"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ fontSize: "10px", fontWeight: 800, padding: "4px 10px", borderRadius: "5px", border: "1px solid rgba(156,122,47,0.2)", background: filter === f ? GOLD : "rgba(156,122,47,0.06)", color: filter === f ? "#fff" : GOLD_DEEP, cursor: "pointer", textTransform: "uppercase" }}>
              {f === "all" ? "All 16" : f === "core" ? "Foundational 4" : "Module 19"}
            </button>
          ))}
        </div>
        <button onClick={toggleAll} style={{ fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: "5px", border: "1px solid rgba(156,122,47,0.2)", background: "rgba(156,122,47,0.06)", color: GOLD_DEEP, cursor: "pointer" }}>
          {allVisibleFlipped ? "Hide glosses" : "Show all glosses"}
        </button>
      </div>

      {/* Card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
        {visible.map(y => {
          const open = flipped.has(y.n);
          const roleStyle = y.role ? ROLE_STYLES[y.role] : null;
          return (
            <button
              key={y.n}
              type="button"
              onClick={() => toggle(y.n)}
              aria-pressed={open}
              style={{
                textAlign: "left",
                border: `1.2px solid ${y.core ? GOLD : "rgba(156,122,47,0.12)"}`,
                borderRadius: "8px",
                background: y.core ? "rgba(156,122,47,0.06)" : "#ffffff",
                padding: "8px",
                cursor: "pointer",
                minHeight: "4.2rem",
                display: "flex",
                flexDirection: "column",
                gap: "3px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "4px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: INK_MUTED }}>{String(y.n).padStart(2, "0")}</span>
                {y.core ? (
                  <span style={{ fontSize: "7px", fontWeight: 900, color: GREEN, background: `${GREEN}12`, padding: "1px 4px", borderRadius: "3px", textTransform: "uppercase" }}>core</span>
                ) : (
                  <span style={{ fontSize: "7px", fontWeight: 800, color: INK_MUTED, background: "rgba(0,0,0,0.04)", padding: "1px 4px", borderRadius: "3px" }}>→ M19</span>
                )}
              </div>
              <span style={{ color: y.core ? GOLD_DEEP : INK_PRIMARY, fontWeight: 900, fontSize: "12px", lineHeight: "1.2" }}>
                <IAST>{y.name}</IAST>
              </span>
              {open ? (
                <>
                  <span style={{ color: INK_SECONDARY, fontSize: "10px", lineHeight: "1.35", marginTop: "2px" }}>{y.gloss}</span>
                  {roleStyle && (
                    <span style={{ fontSize: "8px", fontWeight: 800, color: roleStyle.color, background: roleStyle.bg, padding: "1px 5px", borderRadius: "3px", alignSelf: "flex-start", marginTop: "auto" }}>
                      {y.role}
                    </span>
                  )}
                </>
              ) : (
                <span style={{ color: INK_MUTED, fontSize: "9px", fontStyle: "italic", marginTop: "auto" }}>tap to reveal</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Role legend */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", fontSize: "10px", color: INK_SECONDARY, lineHeight: "1.5" }}>
        <strong style={{ color: GOLD_DEEP }}>Role legend:</strong>{" "}
        <span style={{ color: GREEN }}>completes</span> (Itthaśāla),{" "}
        <span style={{ color: RED }}>fades</span> (Iśrāf),{" "}
        <span style={{ color: BLUE }}>transfers</span> (Nakta / Yamayā),{" "}
        <span style={{ color: RED }}>fails</span> (Khallāsara),{" "}
        <span style={{ color: AMBER }}>blocks</span> (Mānau). These are the interpretive units of the annual chart.
      </div>

      {/* Source footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Tājika Nīlakaṇṭhī</IAST> (Nīlakaṇṭha) — the sixteen yogas. This is recognition-level only; precise mechanics and source-to-source variations are covered in Module 19.
      </div>
    </div>
  );
}
