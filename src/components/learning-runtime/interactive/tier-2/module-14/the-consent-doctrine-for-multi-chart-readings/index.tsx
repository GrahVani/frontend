"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TierKey = "A" | "B" | "C";
type DoctrineKey = "consent" | "confidentiality" | "neither";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const VERMILION_TINT = "#FDEBE6";
const GREEN = "#2F7D55";
const GREEN_TINT = "#EAF4EE";
const BLUE = "#356CAB";
const BLUE_TINT = "#EAF0F8";
const GOLD = "#B88421";
const GOLD_TINT = "#FFF8E8";
const PURPLE = "#6B5AA8";
const PURPLE_TINT = "#F1EEFA";

const TIER_META: Record<TierKey, { label: string; color: string; depth: string; note: string }> = {
  A: {
    label: "Tier A — Consenting-present",
    color: GREEN,
    depth: "Full reading depth",
    note: "Subject is present, informed, and personally agrees.",
  },
  B: {
    label: "Tier B — Proxy-consent-via-client",
    color: GOLD,
    depth: "Compatibility-tendency only",
    note: "Absent person knows and has no objection; no separate personal-life claims.",
  },
  C: {
    label: "Tier C — No consent or unknown",
    color: VERMILION,
    depth: "Most restricted framing",
    note: "General tendency only, explicit limitation, active recommendation to obtain consent.",
  },
};

interface Scenario {
  id: string;
  subject: string;
  context: string;
  correct: TierKey;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "joint-couple",
    subject: "Both partners",
    context: "A couple sits together for a marriage-compatibility reading and both confirm they want the reading.",
    correct: "A",
    explanation: "Both subjects are present and personally consenting; full depth is available subject to the usual guardrails.",
  },
  {
    id: "fiancé-aware",
    subject: "Absent fiancé",
    context: "The client says her fiancé knows about the consultation and is comfortable with it, but he is not present.",
    correct: "B",
    explanation: "Proxy consent is reported, so reading proceeds at compatibility-tendency level only, without personal-life claims about the absent person.",
  },
  {
    id: "unreachable-partner",
    subject: "Absent proposed partner",
    context: "A client asks for compatibility against someone abroad whom she has not yet told about the consultation.",
    correct: "C",
    explanation: "Consent status is unknown. The reading stays at the most restricted level and the practitioner actively recommends obtaining consent before deeper work.",
  },
  {
    id: "minor-guardian",
    subject: "Minor child",
    context: "A parent brings a child's data for a family reading and gives consent as guardian; the child is not the one asking.",
    correct: "B",
    explanation: "Guardian consent stands in for a minor, but depth is still limited to the specific relational question the consultation addresses.",
  },
  {
    id: "priya-unstated",
    subject: "Priya",
    context: "In Lesson 14.6.3, Priya's chart was read at full depth on the strength of Ansh's client relationship alone; her own consent was not narrated.",
    correct: "C",
    explanation: "Without evidence that Priya knew or agreed, the honest tier is at least C for her own chart. A real practitioner should confirm Tier A or B explicitly before reading at full depth.",
  },
];

const DOCTRINE_STATEMENTS: { id: string; text: string; correct: DoctrineKey; explanation: string }[] = [
  {
    id: "conf-1",
    text: "I will not repeat anything discussed in this consultation to anyone outside the room.",
    correct: "confidentiality",
    explanation: "This governs disclosure of information already shared — the confidentiality question.",
  },
  {
    id: "cons-1",
    text: "May I read and interpret this person's chart at all, and if so, at what depth?",
    correct: "consent",
    explanation: "This asks whether reading a non-present person's chart is appropriate — the consent-to-be-read question.",
  },
  {
    id: "neither-1",
    text: "The client supplied the birth data, so the second person has effectively agreed to be read.",
    correct: "neither",
    explanation: "Supplying data is not the same as consenting to be read; this is neither confidentiality nor valid consent reasoning.",
  },
  {
    id: "conf-2",
    text: "I may share the results only with people the client explicitly approves.",
    correct: "confidentiality",
    explanation: "This is about onward disclosure of information, which is governed by confidentiality.",
  },
];

const SELF_AUDIT: { id: string; lesson: string; subject: string; correct: TierKey; explanation: string }[] = [
  {
    id: "audit-14-6-2",
    lesson: "Lesson 14.6.2",
    subject: "Ansh",
    correct: "A",
    explanation: "Ansh is the client in his own consultation; his own chart read for his own question needs no special multi-chart consent analysis.",
  },
  {
    id: "audit-14-6-3",
    lesson: "Lesson 14.6.3",
    subject: "Priya",
    correct: "C",
    explanation: "Priya's chart was read at full depth without narrated consent. Honest tier: at least C until her consent status is confirmed.",
  },
  {
    id: "audit-14-6-4",
    lesson: "Lesson 14.6.4",
    subject: "Both founders",
    correct: "C",
    explanation: "The same omission applies: Priya's consent tier was never explicitly stated, so the reading of her chart should be treated as Tier C until confirmed otherwise.",
  },
];

export function TheConsentDoctrineForMultiChartReadings() {
  const [tierAnswers, setTierAnswers] = useState<Record<string, TierKey | null>>({});
  const [doctrineAnswers, setDoctrineAnswers] = useState<Record<string, DoctrineKey | null>>({});
  const [auditAnswers, setAuditAnswers] = useState<Record<string, TierKey | null>>({});

  const reset = () => {
    setTierAnswers({});
    setDoctrineAnswers({});
    setAuditAnswers({});
  };

  const allTierCorrect = SCENARIOS.every((s) => tierAnswers[s.id] === s.correct);
  const allAuditCorrect = SELF_AUDIT.every((s) => auditAnswers[s.id] === s.correct);

  return (
    <div data-interactive="the-consent-doctrine-for-multi-chart-readings" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Consent doctrine for multi-chart readings</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Distinguish consent-to-be-read from confidentiality
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Apply the three-tier framework to realistic cases, sort consent statements from confidentiality statements, and audit this module&apos;s own worked examples honestly.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Tier decision tree + scenario sorter */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Tier scenarios</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Select the correct tier and depth for each case
              </h3>
            </div>
          </div>

          <TierDecisionSvg />

          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.65rem" }}>
            {SCENARIOS.map((scenario) => {
              const selected = tierAnswers[scenario.id];
              return (
                <div key={scenario.id} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${selected ? TIER_META[selected].color : HAIRLINE}`, background: selected ? tintForColor(TIER_META[selected].color) : SURFACE }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start", flexWrap: "wrap" }}>
                    <div>
                      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700 }}>{scenario.subject}</p>
                      <p style={{ margin: "0.25rem 0 0", color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.55 }}>{scenario.context}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.55rem" }}>
                    {(Object.keys(TIER_META) as TierKey[]).map((tier) => (
                      <button key={tier} type="button" aria-pressed={selected === tier} onClick={() => setTierAnswers((prev) => ({ ...prev, [scenario.id]: tier }))} style={smallChipStyle(selected === tier, TIER_META[tier].color)}>
                        Tier {tier}
                      </button>
                    ))}
                  </div>
                  {selected && (
                    <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, background: selected === scenario.correct ? GREEN_TINT : VERMILION_TINT, border: `1px solid ${selected === scenario.correct ? GREEN : VERMILION}`, color: selected === scenario.correct ? GREEN : VERMILION, fontSize: "0.85rem" }}>
                      {selected === scenario.correct ? scenario.explanation : `This case belongs in ${TIER_META[scenario.correct].label}. ${scenario.explanation}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {SCENARIOS.every((s) => tierAnswers[s.id]) && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: allTierCorrect ? GREEN_TINT : VERMILION_TINT, border: `1px solid ${allTierCorrect ? GREEN : VERMILION}`, color: allTierCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {allTierCorrect ? <BadgeCheck size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span style={{ fontWeight: 600 }}>{allTierCorrect ? "All tiers matched correctly." : "Some tiers need correction — review the feedback above."}</span>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Consent vs confidentiality" icon={<BookOpen size={18} />} color={BLUE}>
            <p style={{ margin: "0 0 0.55rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
              Confidentiality governs what happens to information already shared. Consent-to-be-read governs whether reading a non-present person&apos;s chart is appropriate in the first place.
            </p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {DOCTRINE_STATEMENTS.map((statement) => {
                const selected = doctrineAnswers[statement.id];
                return (
                  <div key={statement.id} style={{ padding: "0.6rem", borderRadius: 8, border: `1px solid ${selected ? doctrineColor(selected) : HAIRLINE}`, background: selected ? tintForColor(doctrineColor(selected)) : SURFACE }}>
                    <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{statement.text}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.45rem" }}>
                      {(["consent", "confidentiality", "neither"] as DoctrineKey[]).map((doctrine) => (
                        <button key={doctrine} type="button" aria-pressed={selected === doctrine} onClick={() => setDoctrineAnswers((prev) => ({ ...prev, [statement.id]: doctrine }))} style={smallChipStyle(selected === doctrine, doctrineColor(doctrine))}>
                          {doctrine === "consent" ? "Consent" : doctrine === "confidentiality" ? "Confidentiality" : "Neither"}
                        </button>
                      ))}
                    </div>
                    {selected && (
                      <div style={{ marginTop: "0.45rem", padding: "0.45rem", borderRadius: 6, background: selected === statement.correct ? GREEN_TINT : VERMILION_TINT, border: `1px solid ${selected === statement.correct ? GREEN : VERMILION}`, color: selected === statement.correct ? GREEN : VERMILION, fontSize: "0.78rem" }}>
                        {selected === statement.correct ? statement.explanation : `This statement belongs under ${statement.correct === "consent" ? "Consent" : statement.correct === "confidentiality" ? "Confidentiality" : "Neither"}. ${statement.explanation}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Tier key" icon={<ShieldCheck size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {(Object.keys(TIER_META) as TierKey[]).map((tier) => (
                <div key={tier} style={{ padding: "0.55rem", borderRadius: 6, border: `1px solid ${TIER_META[tier].color}`, background: tintForColor(TIER_META[tier].color) }}>
                  <div style={{ color: TIER_META[tier].color, fontWeight: 600, fontSize: "0.85rem" }}>{TIER_META[tier].label}</div>
                  <div style={{ color: INK_SECONDARY, fontSize: "0.78rem", marginTop: "0.15rem" }}>{TIER_META[tier].depth}</div>
                  <div style={{ color: INK_MUTED, fontSize: "0.75rem", marginTop: "0.1rem" }}>{TIER_META[tier].note}</div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      {/* Self-audit */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Self-audit</p>
        <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
          Apply the framework to this module&apos;s own worked examples
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "0.65rem" }}>
          {SELF_AUDIT.map((item) => {
            const selected = auditAnswers[item.id];
            return (
              <div key={item.id} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${selected ? TIER_META[selected].color : HAIRLINE}`, background: selected ? tintForColor(TIER_META[selected].color) : SURFACE }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{item.lesson}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{item.subject}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.55rem" }}>
                  {(Object.keys(TIER_META) as TierKey[]).map((tier) => (
                    <button key={tier} type="button" aria-pressed={selected === tier} onClick={() => setAuditAnswers((prev) => ({ ...prev, [item.id]: tier }))} style={smallChipStyle(selected === tier, TIER_META[tier].color)}>
                      Tier {tier}
                    </button>
                  ))}
                </div>
                {selected && (
                  <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, background: selected === item.correct ? GREEN_TINT : VERMILION_TINT, border: `1px solid ${selected === item.correct ? GREEN : VERMILION}`, color: selected === item.correct ? GREEN : VERMILION, fontSize: "0.78rem" }}>
                    {selected === item.correct ? item.explanation : `This example belongs in ${TIER_META[item.correct].label}. ${item.explanation}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {SELF_AUDIT.every((s) => auditAnswers[s.id]) && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: allAuditCorrect ? GREEN_TINT : VERMILION_TINT, border: `1px solid ${allAuditCorrect ? GREEN : VERMILION}`, color: allAuditCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {allAuditCorrect ? <BadgeCheck size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
              <span style={{ fontWeight: 600 }}>{allAuditCorrect ? "Self-audit matches the framework." : "Some audit answers need correction — review the feedback above."}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function TierDecisionSvg() {
  return (
    <svg viewBox="0 0 560 180" role="img" aria-label="Consent tier decision flow" style={{ width: "100%", maxHeight: 260, margin: "0.4rem auto 0.75rem", display: "block" }}>
      <rect x="12" y="12" width="536" height="156" rx="8" fill={GOLD_TINT} stroke={HAIRLINE} />
      <text x="280" y="32" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>
        Consent tier flow
      </text>

      {/* Start */}
      <rect x="230" y="48" width="100" height="28" rx="6" fill={SURFACE} stroke={INK_MUTED} />
      <text x="280" y="67" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>
        Subject not the client
      </text>

      {/* Branches */}
      <line x1="280" y1="76" x2="280" y2="92" stroke={HAIRLINE} strokeWidth="2" />
      <line x1="280" y1="92" x2="110" y2="92" stroke={HAIRLINE} strokeWidth="2" />
      <line x1="280" y1="92" x2="450" y2="92" stroke={HAIRLINE} strokeWidth="2" />
      <line x1="110" y1="92" x2="110" y2="110" stroke={HAIRLINE} strokeWidth="2" />
      <line x1="450" y1="92" x2="450" y2="110" stroke={HAIRLINE} strokeWidth="2" />

      {/* Tier A */}
      <rect x="50" y="110" width="120" height="40" rx="6" fill={GREEN_TINT} stroke={GREEN} />
      <text x="110" y="128" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={700}>PRESENT + CONSENTING</text>
      <text x="110" y="142" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Tier A — full depth</text>

      {/* Tier B */}
      <rect x="220" y="110" width="120" height="40" rx="6" fill={GOLD_TINT} stroke={GOLD} />
      <text x="280" y="128" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={700}>PROXY CONSENT KNOWN</text>
      <text x="280" y="142" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Tier B — tendency only</text>

      {/* Tier C */}
      <rect x="390" y="110" width="120" height="40" rx="6" fill={VERMILION_TINT} stroke={VERMILION} />
      <text x="450" y="128" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight={700}>NO / UNKNOWN CONSENT</text>
      <text x="450" y="142" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Tier C — restricted</text>
    </svg>
  );
}

function doctrineColor(doctrine: DoctrineKey) {
  return doctrine === "consent" ? BLUE : doctrine === "confidentiality" ? PURPLE : VERMILION;
}

function tintForColor(color: string): string {
  if (color === VERMILION) return VERMILION_TINT;
  if (color === GREEN) return GREEN_TINT;
  if (color === BLUE) return BLUE_TINT;
  if (color === GOLD || color === ACCENT) return GOLD_TINT;
  if (color === PURPLE) return PURPLE_TINT;
  return SURFACE;
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, borderColor: color }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
        <span style={{ color }}>{icon}</span>
        <p style={{ margin: 0, color, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      </div>
      {children}
    </section>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? tintForColor(color) : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
