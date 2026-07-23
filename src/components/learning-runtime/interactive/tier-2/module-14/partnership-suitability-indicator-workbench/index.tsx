"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type IndicatorKey = "green" | "mixed" | "caution";
type FindingKey = "mars-exchange" | "aries-conjunction" | "capricorn-conjunction";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const PURPLE = "#6B5AA8";

const INDICATOR_META: Record<IndicatorKey, { label: string; color: string; description: string }> = {
  green: { label: "Green", color: GREEN, description: "Both sides dignified — own-sign, exalted, or friendly." },
  mixed: { label: "Mixed", color: GOLD, description: "Asymmetric dignity — one side strong, the other weaker." },
  caution: { label: "Caution", color: VERMILION, description: "Afflicted placement on a business-critical house, or shadow-graha pairing." },
};

interface Finding {
  key: FindingKey;
  title: string;
  ansh: string;
  priya: string;
  businessHouse?: string;
  symmetry: "mutuality" | "dignity";
  correct: IndicatorKey;
  explanation: string;
}

const FINDINGS: Finding[] = [
  {
    key: "mars-exchange",
    title: "Mutual Mars house-overlay exchange",
    ansh: "Ansh's exalted Mars in Priya's 10th",
    priya: "Priya's own-sign Lagna-lord Mars in Ansh's 7th",
    businessHouse: "7th and 10th",
    symmetry: "mutuality",
    correct: "green",
    explanation: "Both Mars placements are each chart's own strongest, and the exchange is confirmed in both directions.",
  },
  {
    key: "aries-conjunction",
    title: "Sun+Mercury / Mars in Aries",
    ansh: "Sun exalted, Mercury neutral",
    priya: "Mars own-sign (Lagna-lord)",
    symmetry: "dignity",
    correct: "mixed",
    explanation: "Priya's side is strongly dignified, but Ansh's Mercury is only neutral — asymmetric dignity.",
  },
  {
    key: "capricorn-conjunction",
    title: "Mars / Sun in Capricorn",
    ansh: "Mars exalted",
    priya: "Sun enemy-sign",
    businessHouse: "Priya's 10th",
    symmetry: "dignity",
    correct: "caution",
    explanation: "One side is exalted, but the other is in an enemy sign on a business-critical house. Both sides must be checked.",
  },
];

const DEFAULT_STATEMENT = `The Ansh-Priya partnership-suitability reading classifies as follows: the mutual Mars exchange is a green indicator (both sides dignified, directionally mutual); the Sun+Mercury/Mars conjunction is a mixed indicator (asymmetric dignity); and the Mars/Sun conjunction is a caution indicator (afflicted placement on a business-critical house). These findings describe chart-level resonance only. They are not a substitute for a lawyer reviewing the partnership agreement, an accountant reviewing the financial structure, or the founders' own independent business judgement.`;

const REFERRAL_PHRASES = [
  "not a substitute for a lawyer",
  "lawyer reviewing",
  "accountant reviewing",
  "qualified professional",
  "independent judgement",
  "business judgement",
];

export function PartnershipSuitabilityIndicatorWorkbench() {
  const [classifications, setClassifications] = useState<Record<FindingKey, IndicatorKey | null>>({
    "mars-exchange": null,
    "aries-conjunction": null,
    "capricorn-conjunction": null,
  });
  const [symmetryMode, setSymmetryMode] = useState<"mutuality" | "dignity">("mutuality");
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [auditRun, setAuditRun] = useState(false);

  const setClassification = (finding: FindingKey, indicator: IndicatorKey) => {
    setClassifications((prev) => ({ ...prev, [finding]: indicator }));
  };

  const autoClassify = () => {
    setClassifications({
      "mars-exchange": "green",
      "aries-conjunction": "mixed",
      "capricorn-conjunction": "caution",
    });
  };

  const reset = () => {
    setClassifications({
      "mars-exchange": null,
      "aries-conjunction": null,
      "capricorn-conjunction": null,
    });
    setSymmetryMode("mutuality");
    setDraftStatement(DEFAULT_STATEMENT);
    setAuditRun(false);
  };

  const allClassified = Object.values(classifications).every((v) => v !== null);
  const allCorrect = FINDINGS.every((f) => classifications[f.key] === f.correct);

  const audit = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    const hasReferral = REFERRAL_PHRASES.some((p) => draftLower.includes(p.toLowerCase()));
    const mentionsGreen = draftLower.includes("green");
    const mentionsMixed = draftLower.includes("mixed");
    const mentionsCaution = draftLower.includes("caution");
    return { hasReferral, mentionsGreen, mentionsMixed, mentionsCaution };
  }, [draftStatement]);

  const auditPassed = audit.hasReferral && audit.mentionsGreen && audit.mentionsMixed && audit.mentionsCaution;

  return (
    <div data-interactive="partnership-suitability-indicator-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Due-diligence banner */}
      <div
        role="alert"
        style={{
          padding: "0.85rem",
          borderRadius: 8,
          background: `${BLUE}10`,
          border: `1px solid ${BLUE}`,
          color: BLUE,
          fontSize: "0.9rem",
          lineHeight: 1.55,
        }}
      >
        <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
          <BriefcaseBusiness size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
          <span>
            <strong style={{ fontWeight: 600 }}>Competence boundary:</strong>{" "}
            A green, mixed, or caution classification describes chart-level resonance only. It does not assess equity, contracts, capital, market conditions, or legal liability — those require qualified legal, financial, and business professionals.
          </span>
        </div>
      </div>

      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Partnership-suitability indicators</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Classify findings honestly and close with referral
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Apply the disclosed green/mixed/caution rule to Ansh and Priya&apos;s three featured findings, keep directional mutuality separate from dignity symmetry, and include the referral statement every time.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Disclosed rule */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Disclosed classification rule</p>
        <div style={workbenchTwoColumnStyle as CSSProperties}>
          {(Object.keys(INDICATOR_META) as IndicatorKey[]).map((key) => {
            const meta = INDICATOR_META[key];
            return (
              <div
                key={key}
                style={{
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: `1px solid ${meta.color}`,
                  background: `${meta.color}08`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: meta.color,
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {key === "green" ? "G" : key === "mixed" ? "M" : "C"}
                  </span>
                  <span style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</span>
                </div>
                <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  {meta.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Classification exercise */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Classify each finding</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Apply the disclosed rule
              </h3>
            </div>
            <button type="button" onClick={autoClassify} style={buttonStyle(false, BLUE)}>
              <CheckCircle2 size={15} aria-hidden="true" />
              Auto-classify
            </button>
          </div>

          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            {FINDINGS.map((finding) => {
              const selected = classifications[finding.key];
              const isCorrect = selected === finding.correct;
              return (
                <div
                  key={finding.key}
                  style={{
                    padding: "0.85rem",
                    borderRadius: 8,
                    border: `1px solid ${selected ? INDICATOR_META[selected].color : HAIRLINE}`,
                    background: selected ? `${INDICATOR_META[selected].color}06` : SURFACE,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ color: INK_PRIMARY, fontWeight: 600 }}>{finding.title}</div>
                      {finding.businessHouse && (
                        <div style={{ color: INK_MUTED, fontSize: "0.8rem" }}>Business house: {finding.businessHouse}</div>
                      )}
                    </div>
                    {selected && (
                      <span
                        style={{
                          padding: "0.15rem 0.5rem",
                          borderRadius: 999,
                          background: INDICATOR_META[selected].color,
                          color: "#fff",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {INDICATOR_META[selected].label}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.55rem" }}>
                    <div style={{ padding: "0.45rem", borderRadius: 6, background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                      <div style={{ color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700 }}>ANSH</div>
                      <div style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>{finding.ansh}</div>
                    </div>
                    <div style={{ padding: "0.45rem", borderRadius: 6, background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                      <div style={{ color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700 }}>PRIYA</div>
                      <div style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>{finding.priya}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.65rem", flexWrap: "wrap" }}>
                    {(Object.keys(INDICATOR_META) as IndicatorKey[]).map((indicator) => (
                      <button
                        key={indicator}
                        type="button"
                        onClick={() => setClassification(finding.key, indicator)}
                        aria-pressed={selected === indicator}
                        style={smallChipStyle(selected === indicator, INDICATOR_META[indicator].color)}
                      >
                        {INDICATOR_META[indicator].label}
                      </button>
                    ))}
                  </div>

                  {selected && (
                    <div
                      style={{
                        marginTop: "0.65rem",
                        padding: "0.55rem",
                        borderRadius: 6,
                        background: isCorrect ? `${GREEN}10` : `${VERMILION}10`,
                        border: `1px solid ${isCorrect ? GREEN : VERMILION}`,
                        color: isCorrect ? GREEN : VERMILION,
                        fontSize: "0.85rem",
                      }}
                    >
                      {isCorrect ? (
                        <span>{finding.explanation}</span>
                      ) : (
                        <span>
                          Not quite. The disclosed rule gives this finding a <strong style={{ fontWeight: 600 }}>{INDICATOR_META[finding.correct].label}</strong> classification. {finding.explanation}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allClassified && allCorrect && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BadgeCheck size={18} aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>All three classifications are correct.</span>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar: symmetry + guidance */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Two symmetries, kept separate" icon={<ArrowLeftRight size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.65rem" }}>
              <button
                type="button"
                onClick={() => setSymmetryMode("mutuality")}
                aria-pressed={symmetryMode === "mutuality"}
                style={smallChipStyle(symmetryMode === "mutuality", BLUE)}
              >
                Directional mutuality
              </button>
              <button
                type="button"
                onClick={() => setSymmetryMode("dignity")}
                aria-pressed={symmetryMode === "dignity"}
                style={smallChipStyle(symmetryMode === "dignity", PURPLE)}
              >
                Dignity symmetry
              </button>
            </div>
            {symmetryMode === "mutuality" ? (
              <div>
                <p style={bodyTextStyle}>Relevant for <strong style={{ color: BLUE, fontWeight: 600 }}>aspects</strong>: does the aspect hold in both directions?</p>
                <p style={{ ...bodyTextStyle, marginTop: "0.35rem" }}>The Mars house-overlay exchange is confirmed both ways — genuinely mutual.</p>
              </div>
            ) : (
              <div>
                <p style={bodyTextStyle}>Relevant for <strong style={{ color: PURPLE, fontWeight: 600 }}>conjunctions</strong>: do both grahas carry comparable dignity?</p>
                <p style={{ ...bodyTextStyle, marginTop: "0.35rem" }}>Conjunctions are automatically bidirectional, so dignity symmetry is the only useful question.</p>
              </div>
            )}
          </Panel>

          <Panel title="Why disclose the rule?" icon={<BookOpen size={18} />} color={ACCENT}>
            <p style={bodyTextStyle}>
              An undisclosed classification lets mood or bias steer what gets called &quot;good.&quot; A disclosed rule can be checked and applied consistently — protecting both practitioner and founder.
            </p>
          </Panel>
        </section>
      </div>

      {/* Statement builder + audit */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Draft suitability statement</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Include the referral language
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setDraftStatement(DEFAULT_STATEMENT);
                setAuditRun(false);
              }}
              style={buttonStyle(false, BLUE)}
            >
              <MessageSquareText size={15} aria-hidden="true" />
              Reset statement
            </button>
          </div>
          <textarea
            value={draftStatement}
            onChange={(e) => {
              setDraftStatement(e.target.value);
              setAuditRun(false);
            }}
            rows={7}
            style={{
              width: "100%",
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${HAIRLINE}`,
              background: SURFACE,
              color: INK_PRIMARY,
              fontSize: "0.95rem",
              lineHeight: 1.55,
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Statement audit</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Check completeness
              </h3>
            </div>
            <button type="button" onClick={() => setAuditRun(true)} style={buttonStyle(false, GREEN)}>
              <ShieldCheck size={15} aria-hidden="true" />
              Audit
            </button>
          </div>

          {!auditRun && (
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              The audit checks that all three indicator labels appear and that the statement closes with referral language directing founders to qualified professionals.
            </p>
          )}

          {auditRun && (
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {auditPassed ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Statement is complete: all three classifications are named and referral language is present.</span>
                  </div>
                </div>
              ) : (
                <>
                  {!audit.mentionsGreen && (
                    <AuditIssue text="The green indicator is not named in the statement." />
                  )}
                  {!audit.mentionsMixed && (
                    <AuditIssue text="The mixed indicator is not named in the statement." />
                  )}
                  {!audit.mentionsCaution && (
                    <AuditIssue text="The caution indicator is not named in the statement." />
                  )}
                  {!audit.hasReferral && (
                    <AuditIssue text="Referral language is missing. Every partnership-suitability statement must direct founders to qualified legal/financial/business professionals." />
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AuditIssue({ text }: { text: string }) {
  return (
    <div style={{ padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
        <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
        <span>{text}</span>
      </div>
    </div>
  );
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

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.85rem",
  lineHeight: 1.55,
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
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
