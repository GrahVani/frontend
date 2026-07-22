"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Eye,
  Lightbulb,
  RotateCcw,
  Scale,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type PillarKey = "transit" | "dasha" | "vedha";
type DraftKey = "A" | "B" | "C" | null;
type SubstituteChoice = "yes" | "no" | null;
type MistakeKey = "additive" | "substitute" | "exactDate";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const TEAL = "#2E7D7A";

const PILLARS: Record<PillarKey, { label: string; icon: ReactNode; color: string }> = {
  transit: { label: "Transit", icon: <Compass size={18} aria-hidden="true" />, color: BLUE },
  dasha: { label: "Daśā", icon: <Scale size={18} aria-hidden="true" />, color: AMBER },
  vedha: { label: "Vedha", icon: <Eye size={18} aria-hidden="true" />, color: TEAL },
};

const PILLAR_ORDER: PillarKey[] = ["transit", "dasha", "vedha"];

const COMBINATIONS: Record<string, { present: PillarKey[]; label: string; diagnosis: string; tier: string; tierColor: string }> = {
  transit_dasha_vedha: {
    present: ["transit", "dasha", "vedha"],
    label: "All three present",
    diagnosis: "Conjunction satisfied. A specific event-timing window can be stated with appropriate span.",
    tier: "Strong",
    tierColor: GREEN,
  },
  transit_dasha: {
    present: ["transit", "dasha"],
    label: "Transit + Daśā, no Vedha",
    diagnosis: "Ignoring-vedha case. A textbook-perfect trigger may still be cancelled because the obstruction check was not run.",
    tier: "Weak / specifically flawed",
    tierColor: VERMILION,
  },
  dasha_vedha: {
    present: ["dasha", "vedha"],
    label: "Daśā + Vedha, no Transit",
    diagnosis: "Mode 2 (daśā-without-transit). A ripe window is treated as if ripeness alone were the event.",
    tier: "Weak / specifically flawed",
    tierColor: VERMILION,
  },
  transit_vedha: {
    present: ["transit", "vedha"],
    label: "Transit + Vedha, no Daśā",
    diagnosis: "Mode 3 (transit-without-daśā). A real, unobstructed astronomical event is not automatically this client's event.",
    tier: "Weak / specifically flawed",
    tierColor: VERMILION,
  },
  transit: {
    present: ["transit"],
    label: "Transit only",
    diagnosis: "A single trigger with no window and no obstruction check is not a timing claim.",
    tier: "No-prediction",
    tierColor: INK_MUTED,
  },
  dasha: {
    present: ["dasha"],
    label: "Daśā only",
    diagnosis: "An open window with no current trigger is not a timing claim.",
    tier: "No-prediction",
    tierColor: INK_MUTED,
  },
  vedha: {
    present: ["vedha"],
    label: "Vedha only",
    diagnosis: "An obstruction-clear check without a transit or window has nothing to evaluate.",
    tier: "No-prediction",
    tierColor: INK_MUTED,
  },
  none: {
    present: [],
    label: "None present",
    diagnosis: "No timing evidence at all.",
    tier: "No-prediction",
    tierColor: INK_MUTED,
  },
};

const DRAFTS: Record<string, { text: string; missing: PillarKey; diagnosis: string }> = {
  A: {
    text: "Saturn enters Libra, favourable-from-Moon, unobstructed by anything in Aries.",
    missing: "dasha",
    diagnosis: "Transit + Vedha, no named Daśā. A real astronomical fact with no stated relevance to Kavya's specific window.",
  },
  B: {
    text: "Kavya's Moon/Jupiter antardaśā is favourable for [domain], and nothing currently obstructs that.",
    missing: "transit",
    diagnosis: "Daśā + Vedha, no Transit. Mode 2: ripeness mistaken for event.",
  },
  C: {
    text: "Saturn enters Libra during Kavya's Moon/Jupiter antardaśā — a strong trigger.",
    missing: "vedha",
    diagnosis: "Daśā + Transit, no Vedha. The classic ignoring-vedha case; Aries must be checked.",
  },
};

const SUBSTITUTION = {
  question: "A colleague has Daśā + Transit but has not checked Vedha. They also have a favourable independent Jaimini Cara Daśā period. Does that third favourable indicator make the claim Strong?",
  options: [
    { id: "yes", label: "Yes — more independent evidence raises confidence", ok: false, feedback: "No. The Jaimini finding is an independent line for a general conclusion, not a substitute for a jointly necessary leg of a specific timing mechanism." },
    { id: "no", label: "No — a general indicator cannot replace a specific missing T-D-V leg", ok: true, feedback: "Correct. The two kinds of evidence answer different questions." },
  ],
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  additive: {
    label: "T-D-V is a conjunction, not an additive score",
    heldText: "Held: 2 of 3 is weak and specifically flawed, not Moderate.",
    releasedText: "Warning: reporting a fraction hides the named failure mode of the missing leg.",
  },
  substitute: {
    label: "A strong unrelated indicator cannot substitute for a missing T-D-V leg",
    heldText: "Held: general evidence and specific timing legs answer different questions.",
    releasedText: "Warning: piling favourable findings does not repair a broken conjunction.",
  },
  exactDate: {
    label: "Strong still means a window, not an exact date",
    heldText: "Held: even all three legs earn a dated-enough window with appropriate span.",
    releasedText: "Warning: Strong is not a licence for clock-time precision the model does not provide.",
  },
};

export function TdvConjunctionExplorer() {
  const [active, setActive] = useState<Record<PillarKey, boolean>>({ transit: true, dasha: true, vedha: true });
  const [selectedDraft, setSelectedDraft] = useState<DraftKey>(null);
  const [substitute, setSubstitute] = useState<SubstituteChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    additive: true, substitute: true, exactDate: true,
  });

  const activeKey = PILLAR_ORDER.filter((k) => active[k]).sort().join("_") || "none";
  const combo = COMBINATIONS[activeKey] ?? COMBINATIONS.none;
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setActive({ transit: true, dasha: true, vedha: true });
    setSelectedDraft(null);
    setSubstitute(null);
    setMistakes({ additive: true, substitute: true, exactDate: true });
  }

  function togglePillar(key: PillarKey) {
    setActive((a) => ({ ...a, [key]: !a[key] }));
  }

  return (
    <div data-interactive="tdv-conjunction-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · T-D-V logic</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Why all three must align
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              T-D-V is a conjunction (AND), not a score. Missing any one leg produces a specifically flawed claim, not a merely less-confident one.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Conjunction diagram</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Toggle each leg and watch the centre light only when all three hold
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
            {PILLAR_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={active[key]}
                onClick={() => togglePillar(key)}
                style={buttonStyle(active[key], PILLARS[key].color)}
              >
                {active[key] ? <CheckCircle2 size={15} aria-hidden="true" /> : null} {PILLARS[key].label}
              </button>
            ))}
          </div>
          <ConjunctionSvg active={active} />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${combo.tierColor}55`,
              background: `${combo.tierColor}10`,
              color: combo.tierColor,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: "0.35rem" }}>{combo.label} — {combo.tier}</div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{combo.diagnosis}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Confidence mapping" icon={<Lightbulb size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              This lesson&apos;s own synthesis of T-D-V onto T2-01 tiers:
            </p>
            <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.65rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <span style={{ color: INK_SECONDARY }}>All 3 present</span>
                <strong style={{ color: GREEN, fontWeight: 600 }}>Strong</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <span style={{ color: INK_SECONDARY }}>2 of 3 present</span>
                <strong style={{ color: VERMILION, fontWeight: 600 }}>Weak / flawed</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0.75rem", borderRadius: 8, border: `1px solid ${INK_MUTED}55`, background: "transparent" }}>
                <span style={{ color: INK_SECONDARY }}>1 of 3 present</span>
                <strong style={{ color: INK_MUTED, fontWeight: 600 }}>No-prediction</strong>
              </div>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              The 2-of-3 row deliberately departs from a naive reading: elsewhere 2 independent indicators earn Moderate, but here the missing leg makes the claim structurally broken.
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Draft-claim diagnosis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Which leg is missing in each draft claim?
        </h3>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(DRAFTS) as Array<"A" | "B" | "C">).map((key) => {
            const d = DRAFTS[key];
            const chosen = selectedDraft === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={chosen}
                onClick={() => setSelectedDraft(key)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${chosen ? PILLARS[d.missing].color : HAIRLINE}`,
                  borderRadius: 8,
                  background: chosen ? `${PILLARS[d.missing].color}10` : "transparent",
                  color: chosen ? PILLARS[d.missing].color : INK_SECONDARY,
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <strong style={{ fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>Draft {key}</strong>
                <span style={{ color: chosen ? INK_PRIMARY : INK_SECONDARY }}>{d.text}</span>
                {chosen && <span style={{ display: "block", marginTop: "0.45rem", color: INK_SECONDARY }}>{d.diagnosis}</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Substitution scenario</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Can a favourable independent indicator replace a missing T-D-V leg?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{SUBSTITUTION.question}</p>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
          {SUBSTITUTION.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={substitute === opt.id}
              onClick={() => setSubstitute(opt.id as SubstituteChoice)}
              style={scenarioButtonStyle(substitute === opt.id, opt.ok ? GREEN : VERMILION)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {substitute && (
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              background: SUBSTITUTION.options.find((o) => o.id === substitute)?.ok ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${SUBSTITUTION.options.find((o) => o.id === substitute)?.ok ? GREEN : VERMILION}55`,
              color: SUBSTITUTION.options.find((o) => o.id === substitute)?.ok ? GREEN : VERMILION,
            }}
          >
            {SUBSTITUTION.options.find((o) => o.id === substitute)?.feedback}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 600 }}>{MISTAKES[key].label}</strong>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allMistakesHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}55`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. T-D-V is treated as a conjunction with appropriate precision."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function ConjunctionSvg({ active }: { active: Record<PillarKey, boolean> }) {
  // Triangle vertices
  const v = {
    transit: { x: 280, y: 40 },
    dasha: { x: 60, y: 340 },
    vedha: { x: 500, y: 340 },
  };
  const centre = { x: 280, y: 240 };

  const all = active.transit && active.dasha && active.vedha;
  const pairs: Array<[PillarKey, PillarKey]> = [
    ["transit", "dasha"],
    ["dasha", "vedha"],
    ["vedha", "transit"],
  ];

  return (
    <svg viewBox="0 0 560 380" role="img" aria-label="T-D-V conjunction triangle" style={{ width: "100%", maxHeight: 360, margin: "0.65rem auto 0.25rem", display: "block" }}>
      {/* connecting lines, lit if both endpoints active */}
      {pairs.map(([a, b]) => {
        const lit = active[a] && active[b];
        return (
          <line
            key={`${a}-${b}`}
            x1={v[a].x}
            y1={v[a].y}
            x2={v[b].x}
            y2={v[b].y}
            stroke={lit ? GOLD : HAIRLINE}
            strokeWidth={lit ? 4 : 2}
            strokeLinecap="round"
          />
        );
      })}

      {/* central intersection glow */}
      {all && <circle cx={centre.x} cy={centre.y} r={58} fill={`${GREEN}20`} stroke={GREEN} strokeWidth="3" />}

      {/* vertices */}
      {PILLAR_ORDER.map((key) => {
        const p = v[key];
        const isActive = active[key];
        return (
          <g key={key}>
            <circle cx={p.x} cy={p.y} r={isActive ? 44 : 38} fill={isActive ? `${PILLARS[key].color}20` : `${PILLARS[key].color}10`} stroke={PILLARS[key].color} strokeWidth={isActive ? 3 : 2} />
            <text x={p.x} y={p.y - 4} textAnchor="middle" fill={PILLARS[key].color} fontSize={isActive ? 13 : 12} fontWeight={600}>{PILLARS[key].label}</text>
            <text x={p.x} y={p.y + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>{isActive ? "ON" : "OFF"}</text>
          </g>
        );
      })}

      {all && (
        <>
          <text x={centre.x} y={centre.y + 5} textAnchor="middle" fill={GREEN} fontSize="13" fontWeight={600}>AND</text>
          <text x={centre.x} y={centre.y + 80} textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={600}>Conjunction satisfied</text>
        </>
      )}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function scenarioButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
