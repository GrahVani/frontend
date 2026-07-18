"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
  MinusCircle,
  RotateCcw,
  Scale,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TriggerKey = "saturn" | "jupiter" | "nodes";
type MistakeKey = "undeterminedAsDefect" | "singleWinner" | "doubleTransitGuarantee";
type SaturnReading = "transit-only" | "natal-inclusive";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const MOON = "#5A6B8A";
const GREY = "#9A8E7D";

interface TriggerConfig {
  key: TriggerKey;
  label: string;
  short: string;
  planet: string;
  sign: string;
  color: string;
  t: string;
  d: string;
  hierarchy: { count: number; note: string };
  vedha: { kind: "clear" | "contested" | "unreachable"; note: string };
  ashtakavarga: string;
}

const TRIGGERS: TriggerConfig[] = [
  {
    key: "saturn",
    label: "Trigger 1: Saturn → Libra",
    short: "Saturn",
    planet: "Saturn",
    sign: "Libra",
    color: PURPLE,
    t: "Favourable, exalted transit (19.2.1)",
    d: "Moon MD / Jupiter AD window",
    hierarchy: { count: 2, note: "7th lord, twice" },
    vedha: { kind: "contested", note: "Stands under transit-only; obstructed under natal-inclusive" },
    ashtakavarga: "BAV(h4) ≈ 6 strong; SAV(h4) ≈ 27 strong",
  },
  {
    key: "jupiter",
    label: "Trigger 2: Jupiter → Gemini",
    short: "Jupiter",
    planet: "Jupiter",
    sign: "Gemini",
    color: GREEN,
    t: "Very favourable, complicated by natal Rāhu (19.2.2)",
    d: "Jupiter is the running AD lord itself",
    hierarchy: { count: 0, note: "Supplies aspect-hits outward; none on its own natal point" },
    vedha: { kind: "clear", note: "Unambiguous, both readings agree" },
    ashtakavarga: "BAV(h12) ≈ 5 strong; SAV(h12) ≈ 26 strong",
  },
  {
    key: "nodes",
    label: "Trigger 3: Nodal-axis reversal",
    short: "Nodes",
    planet: "Rāhu / Ketu",
    sign: "Sagittarius / Gemini",
    color: VERMILION,
    t: "Verified nodal-axis design (19.2.3)",
    d: "Same window; directly hits natal Moon, the MD lord",
    hierarchy: { count: 3, note: "Natal Moon, the maximum found" },
    vedha: { kind: "unreachable", note: "No applicable table; structurally different from unresolved" },
    ashtakavarga: "No BAV (structural); SAV mixed — h6≈24 moderate, h12≈26 strong",
  },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  undeterminedAsDefect: {
    label: "Do not treat T-D-[V undetermined] as Weak-with-a-defect",
    heldText: "Held: undetermined V is an absence of evidence either way, not evidence against the trigger.",
    releasedText: "Warning: collapsing the two categories overstates the case against Trigger 3.",
  },
  singleWinner: {
    label: "Do not pick a single 'winner' trigger",
    heldText: "Held: hierarchy ranking and T-D-V completeness answer different questions; both are kept.",
    releasedText: "Warning: a single ranking discards information that each measure carries separately.",
  },
  doubleTransitGuarantee: {
    label: "Do not assume the double-transit guarantees both legs are equally strong",
    heldText: "Held: the double-transit is about timing-strength; Saturn's vedha question remains open.",
    releasedText: "Warning: 'gold standard' does not mean every component leg resolves without remainder.",
  },
};

function statusFor(trigger: TriggerConfig, saturnReading: SaturnReading): { label: string; color: string; detail: string } {
  if (trigger.key === "jupiter") {
    return {
      label: "T-D-V-Strong",
      color: GREEN,
      detail: "The only unambiguous case: T yes, D yes and at the tightest connection, V clear, Ashtakavarga strong.",
    };
  }
  if (trigger.key === "saturn") {
    if (saturnReading === "transit-only") {
      return {
        label: "T-D-V-Strong (contingent)",
        color: GREEN,
        detail: "Under the transit-only vedha reading all three legs are present; this is a conditional Strong.",
      };
    }
    return {
      label: "T-D-Weak-with-vedha-defect",
      color: VERMILION,
      detail: "Under the natal-inclusive vedha reading T and D stand, but V fails — a named defect, not a full Strong.",
    };
  }
  return {
    label: "T-D-[V undetermined]",
    color: GOLD,
    detail: "T and D are unambiguous, but V could not be assessed at all from available classical sources.",
  };
}

function VedhaIcon({ kind }: { kind: TriggerConfig["vedha"]["kind"] }) {
  if (kind === "clear") return <CheckCircle2 size={16} aria-hidden="true" style={{ color: GREEN }} />;
  if (kind === "contested") return <AlertTriangle size={16} aria-hidden="true" style={{ color: GOLD }} />;
  return <MinusCircle size={16} aria-hidden="true" style={{ color: GREY }} />;
}

function CompletenessGauge({ trigger, saturnReading }: { trigger: TriggerConfig; saturnReading: SaturnReading }) {
  const vColor =
    trigger.vedha.kind === "clear"
      ? GREEN
      : trigger.vedha.kind === "unreachable"
        ? GREY
        : saturnReading === "transit-only"
          ? GREEN
          : VERMILION;

  return (
    <svg width="120" height="20" viewBox="0 0 120 20" aria-label={`T-D-V gauge for ${trigger.short}`}>
      <rect x="0" y="2" width="36" height="16" rx="4" fill={GREEN} />
      <rect x="40" y="2" width="36" height="16" rx="4" fill={GREEN} />
      {trigger.vedha.kind === "contested" ? (
        <>
          <rect x="80" y="2" width="18" height="16" rx="4" fill={saturnReading === "transit-only" ? GREEN : VERMILION} />
          <rect x="80" y="2" width="18" height="16" rx="4" fill={saturnReading === "transit-only" ? GREEN : VERMILION} opacity={0} />
          <path d="M80 2 h18 v16 h-18 Z" fill={saturnReading === "transit-only" ? GREEN : VERMILION} />
          <text x="98" y="14" fontSize="9" fill="#fff" fontWeight={600} textAnchor="middle">
            ?
          </text>
        </>
      ) : (
        <rect x="80" y="2" width="36" height="16" rx="4" fill={vColor} />
      )}
      <text x="18" y="14" fontSize="9" fill="#fff" fontWeight={600} textAnchor="middle">T</text>
      <text x="58" y="14" fontSize="9" fill="#fff" fontWeight={600} textAnchor="middle">D</text>
      <text x="98" y="14" fontSize="9" fill="#fff" fontWeight={600} textAnchor="middle">V</text>
    </svg>
  );
}

export function MultiTriggerConvergenceWorkbench() {
  const [selected, setSelected] = useState<TriggerKey>("jupiter");
  const [saturnReading, setSaturnReading] = useState<SaturnReading>("transit-only");
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    undeterminedAsDefect: true,
    singleWinner: true,
    doubleTransitGuarantee: true,
  });

  const trigger = TRIGGERS.find((t) => t.key === selected)!;
  const status = useMemo(() => statusFor(trigger, saturnReading), [trigger, saturnReading]);
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setSelected("jupiter");
    setSaturnReading("transit-only");
    setMistakes({ undeterminedAsDefect: true, singleWinner: true, doubleTransitGuarantee: true });
  }

  return (
    <div data-interactive="multi-trigger-convergence-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 4</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Multi-trigger convergence workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Assemble hierarchy, vedha, and Ashtakavarga into one table, then extend the T-D-V-completeness framework to contested and unreachable V cases.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Consolidated convergence table</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          All three triggers across all three layers
        </h3>
        <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
          <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", fontSize: "0.92rem" }}>
            <thead>
              <tr>
                <th style={thStyle}>Trigger</th>
                <th style={thStyle}>T</th>
                <th style={thStyle}>D</th>
                <th style={thStyle}>Hierarchy</th>
                <th style={thStyle}>Vedha</th>
                <th style={thStyle}>Ashtakavarga</th>
                <th style={thStyle}>T-D-V status</th>
                <th style={thStyle}>Gauge</th>
              </tr>
            </thead>
            <tbody>
              {TRIGGERS.map((t) => {
                const s = statusFor(t, saturnReading);
                const isSelected = selected === t.key;
                return (
                  <tr
                    key={t.key}
                    onClick={() => setSelected(t.key)}
                    style={{
                      cursor: "pointer",
                      background: isSelected ? `${t.color}08` : "transparent",
                      borderLeft: `4px solid ${isSelected ? t.color : "transparent"}`,
                    }}
                  >
                    <td style={{ ...tdStyle, color: t.color, fontWeight: 600 }}>{t.label}</td>
                    <td style={tdStyle}>{t.t}</td>
                    <td style={tdStyle}>{t.d}</td>
                    <td style={tdStyle}>{t.hierarchy.count} — {t.hierarchy.note}</td>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: t.vedha.kind === "clear" ? GREEN : t.vedha.kind === "contested" ? GOLD : GREY }}>
                        <VedhaIcon kind={t.vedha.kind} /> {t.vedha.note}
                      </span>
                    </td>
                    <td style={tdStyle}>{t.ashtakavarga}</td>
                    <td style={{ ...tdStyle, color: s.color, fontWeight: 600 }}>{s.label}</td>
                    <td style={tdStyle}><CompletenessGauge trigger={t} saturnReading={saturnReading} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
          <Info size={13} style={{ display: "inline", marginRight: "0.25rem" }} aria-hidden="true" />
          Click a row to inspect its extended status. Trigger 1&apos;s status depends on the vedha reading selected below.
        </p>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Extended status detail</p>
          <h3 style={{ margin: "0.15rem 0 0", color: trigger.color, fontSize: "1.15rem", fontWeight: 600 }}>
            {trigger.label}
          </h3>

          {trigger.key === "saturn" && (
            <div style={{ marginTop: "0.55rem" }}>
              <p style={{ color: INK_SECONDARY, margin: "0 0 0.45rem" }}>Vedha reading for Trigger 1:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                <button
                  type="button"
                  aria-pressed={saturnReading === "transit-only"}
                  onClick={() => setSaturnReading("transit-only")}
                  style={buttonStyle(saturnReading === "transit-only", GREEN)}
                >
                  Transit-only
                </button>
                <button
                  type="button"
                  aria-pressed={saturnReading === "natal-inclusive"}
                  onClick={() => setSaturnReading("natal-inclusive")}
                  style={buttonStyle(saturnReading === "natal-inclusive", VERMILION)}
                >
                  Natal-inclusive
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.85rem",
              borderRadius: 8,
              background: `${status.color}12`,
              border: `1px solid ${status.color}55`,
            }}
          >
            <div style={{ color: status.color, fontSize: "1.2rem", fontWeight: 600 }}>{status.label}</div>
            <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{status.detail}</p>
          </div>

          <div style={{ marginTop: "0.85rem", display: "grid", gap: "0.55rem" }}>
            <MiniRow label="Transit" value={trigger.t} color={GREEN} />
            <MiniRow label="Daśā" value={trigger.d} color={GREEN} />
            <MiniRow label="Hierarchy touch" value={`${trigger.hierarchy.count} mechanism${trigger.hierarchy.count === 1 ? "" : "s"} — ${trigger.hierarchy.note}`} color={MOON} />
            <MiniRow label="Vedha" value={trigger.vedha.note} color={trigger.vedha.kind === "clear" ? GREEN : trigger.vedha.kind === "contested" ? GOLD : GREY} />
            <MiniRow label="Ashtakavarga" value={trigger.ashtakavarga} color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Hierarchy vs completeness" icon={<Scale size={18} />} color={MOON}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <div style={{ padding: "0.55rem", borderRadius: 8, background: `${MOON}10`, border: `1px solid ${MOON}44` }}>
                <div style={{ color: MOON, fontWeight: 600 }}>Chapter 2 hierarchy ranking</div>
                <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                  1. Nodes (3 touches) — 2. Saturn (2) — 3. Jupiter (0 own-point)
                </div>
              </div>
              <div style={{ padding: "0.55rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}44` }}>
                <div style={{ color: GREEN, fontWeight: 600 }}>This lesson&apos;s T-D-V completeness</div>
                <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                  1. Jupiter (unambiguous Strong) — 2. Saturn (conditional) — 3. Nodes (V undetermined)
                </div>
              </div>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
              These measure different things. Neither ranking replaces the other.
            </p>
          </Panel>

          <Panel title="Double-transit status" icon={<Lightbulb size={18} />} color={GOLD}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              The Saturn-Jupiter double-transit is a genuine T2-01 gold-standard timing pattern, but only one leg (Jupiter) is unconditionally Strong on its own.
            </p>
            <div style={{ marginTop: "0.55rem", display: "grid", gap: "0.35rem", fontSize: "0.9rem" }}>
              <div style={{ color: GREEN }}>Jupiter leg — T-D-V-Strong</div>
              <div style={{ color: saturnReading === "transit-only" ? GREEN : VERMILION }}>
                Saturn leg — {saturnReading === "transit-only" ? "T-D-V-Strong (contingent)" : "T-D-Weak-with-vedha-defect"}
              </div>
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Four-sentence summary</p>
          <h3 style={{ margin: "0.15rem 0 0.55rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Write the convergence verdict precisely
          </h3>
          <div style={{ padding: "0.85rem", borderRadius: 8, background: `${GOLD}0A`, border: `1px solid ${GOLD}44`, color: INK_SECONDARY, lineHeight: 1.6 }}>
            Trigger 2 (Jupiter/Gemini): T-D-V-Strong, unambiguous. Trigger 1 (Saturn/Libra): T-D-V-Strong under the transit-only vedha reading, T-D-Weak-with-vedha-defect under the natal-inclusive reading — both reported, neither silently chosen. Trigger 3 (nodal-axis-reversal): T-D-[V undetermined] — the highest hierarchy-convergence of the three, but its vedha leg cannot be completed from available sources. The Saturn-Jupiter double-transit is confirmed as a genuine gold-standard pattern, though only one of its two legs is unconditionally Strong on its own.
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Extension note</p>
          <h3 style={{ margin: "0.15rem 0 0.55rem", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
            Two honest extensions to 19.1.2
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
            <li>
              <span style={{ color: PURPLE, fontWeight: 600 }}>Contested V:</span> Trigger 1 holds two conditional tiers simultaneously.
            </li>
            <li>
              <span style={{ color: VERMILION, fontWeight: 600 }}>Unreachable V:</span> Trigger 3 introduces a fourth category, neither confirmed nor denied.
            </li>
          </ul>
        </section>
      </div>

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
                  <span style={{ fontWeight: 600 }}>{MISTAKES[key].label}</span>
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
            ? "All discipline commitments are held. The full, uneven picture is reported honestly."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function MiniRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
      <span style={{ color, fontWeight: 600, minWidth: 110 }}>{label}</span>
      <span style={{ color: INK_SECONDARY }}>{value}</span>
    </div>
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

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.55rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontWeight: 700,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_SECONDARY,
  verticalAlign: "top",
};
