"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const RED = "#A8412B";
const AMBER = "#f59e0b";

interface Condition { label: string; iast?: string; icon: string; note?: string }
const CONDITIONS: Condition[] = [
  { label: "A planet (other than the Sun) in a kendra (1/4/7/10) from the Lagna", icon: "🏛️", note: "commonest cancellation" },
  { label: "A planet (other than the Sun) in a kendra from the Moon", icon: "🌙", note: "angular support to Moon" },
  { label: "The Moon conjunct a non-Sun planet", icon: "🤝", note: "Moon not alone" },
  { label: "The Moon aspected by a benefic (some sources: any non-Sun graha)", icon: "👁️", note: "benefic gaze" },
  { label: "The Moon in its own sign (Cancer) / exaltation (Taurus) / otherwise strong", iast: "Karka / Vṛṣabha", icon: "💪", note: "Moon dignity" },
];

const PROTOCOL = [
  { step: "1. Detect", text: "Confirm no planet (excl. Sun/nodes) in the 2nd or 12th from the Moon." },
  { step: "2. Check cancellations", text: "Run the bhaṅga list. If any applies, it is not a doṣa." },
  { step: "3. Frame constructively", text: "If rare uncancelled, read as mild emotional self-reliance — never poverty or ruin." },
  { step: "4. Weigh the whole chart", text: "Consider Moon dignity, daśā, and lagna lord before saying anything." },
];

export function KemadrumaChecker() {
  const [met, setMet] = useState<boolean[]>(CONDITIONS.map(() => false));
  const toggle = (i: number) => setMet(prev => prev.map((v, j) => (j === i ? !v : v)));
  const anyMet = met.some(Boolean);
  const metCount = met.filter(Boolean).length;

  return (
    <div data-interactive="kemadruma-checker" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Kemadruma-bhaṅga</IAST> Checker — Honest Handling
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Start from a structural <IAST>Kemadruma</IAST>. Tick any cancellation condition — even <strong>one</strong> breaks the doṣa. Lists vary by source; this is the common set.
        </p>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>
        
        {/* Left — checklist */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "6px" }}>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Cancellation conditions (<IAST>bhaṅga</IAST>)</h4>
          {CONDITIONS.map((c, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={met[i]}
              onClick={() => toggle(i)}
              style={{
                textAlign: "left",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                border: `1.2px solid ${met[i] ? GREEN : "rgba(156,122,47,0.12)"}`,
                borderRadius: "8px",
                background: met[i] ? `${GREEN}08` : "#ffffff",
                color: met[i] ? GREEN : INK_SECONDARY,
                padding: "8px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "11px",
                lineHeight: "1.4"
              }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{c.icon}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontWeight: 700, color: met[i] ? GREEN : INK_PRIMARY }}>
                  {c.iast ? <IAST>{c.label.replace("Cancer", "Karka").replace("Taurus", "Vṛṣabha")}</IAST> : c.label}
                </span>
                {c.note && <span style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 500 }}>{c.note}</span>}
              </span>
              <span style={{ fontWeight: 900, fontSize: "14px", flexShrink: 0 }}>{met[i] ? "☑" : "☐"}</span>
            </button>
          ))}
          <div style={{ marginTop: "4px", fontSize: "9px", color: INK_MUTED, fontStyle: "italic" }}>
            Note: Sun and nodes are excluded from the yoga's own definition and from most cancellation counts.
          </div>
        </div>

        {/* Right — verdict + protocol */}
        <div style={{ flex: "1 1 260px", minWidth: "240px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Verdict */}
          <div style={{ background: anyMet ? `${GREEN}10` : `${RED}08`, border: `1.2px solid ${anyMet ? GREEN : RED}`, borderRadius: "10px", padding: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "16px" }}>{anyMet ? "✓" : "○"}</span>
              <span style={{ fontSize: "13px", fontWeight: 800, color: anyMet ? GREEN : RED }}>
                {anyMet
                  ? <><IAST>Kemadruma-bhaṅga</IAST> — cancelled ({metCount} condition{metCount > 1 ? "s" : ""})</>
                  : "Uncancelled structural Kemadruma"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {anyMet
                ? "The cancellation conditions are broad; most charts satisfy at least one. A structural Kemadruma is usually cancelled — note it and move on."
                : "Even a genuine uncancelled Kemadruma is read as a mild register of self-reliance or emotional independence. Never frame it as poverty, ruin, or catastrophe."}
            </p>
          </div>

          {/* Honest-handling protocol */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Honest-handling protocol</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {PROTOCOL.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "6px", fontSize: "10px", lineHeight: "1.4" }}>
                  <span style={{ fontWeight: 900, color: GOLD, flexShrink: 0 }}>{p.step}</span>
                  <span style={{ color: INK_SECONDARY }}>{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Care-not-doom reminder */}
          <div style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}`, borderRadius: "8px", padding: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🕊️</span>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              <strong style={{ color: AMBER }}>Care, not doom.</strong> A doṣa is a factor to weigh in context, not a sentence to deliver. Name the sensitivity honestly; refuse catastrophism.
            </p>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST>; <IAST>Phaladīpikā</IAST> (Mantreśvara). Cancellation-condition lists vary by source; disclose which set you use. Cross-ref: Lesson 7.2.6 (no-fear discipline).
          </div>
        </div>
      </div>
    </div>
  );
}
