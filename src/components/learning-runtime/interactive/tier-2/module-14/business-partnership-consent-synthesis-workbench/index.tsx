"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  RotateCcw,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type IndicatorKey = "green" | "mixed" | "caution";

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

const INDICATOR_COLORS: Record<IndicatorKey, string> = {
  green: GREEN,
  mixed: GOLD,
  caution: VERMILION,
};

const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  green: "Green",
  mixed: "Mixed",
  caution: "Caution",
};

interface FindingRow {
  id: string;
  finding: string;
  classification: IndicatorKey;
  tier: string;
}

const INVENTORY: FindingRow[] = [
  { id: "mars-exchange", finding: "Mutual Mars house-overlay exchange", classification: "green", tier: "Moderate" },
  { id: "sun-mercury-mars", finding: "Sun+Mercury / Mars conjunction", classification: "mixed", tier: "Moderate" },
  { id: "mars-sun", finding: "Mars / Sun conjunction", classification: "caution", tier: "Moderate" },
  { id: "venus-jupiter", finding: "Venus / Jupiter conjunction", classification: "caution", tier: "Moderate" },
];

const STATEMENT_PARTS: { id: string; text: string; required: boolean; category: "consent" | "finding" | "referral" | "scope" }[] = [
  {
    id: "tier-declaration",
    text: "With both of you present and engaged with this question — Tier A, both consenting — here is what your two charts show together.",
    required: true,
    category: "consent",
  },
  {
    id: "finding-summary",
    text: "Your charts show a favourable mutual Mars exchange, alongside two mixed findings and two caution-classified conjunctions.",
    required: true,
    category: "finding",
  },
  {
    id: "referral",
    text: "None of this substitutes for a lawyer reviewing your partnership agreement, an accountant reviewing your financial structure, or your own independent judgement about this specific business.",
    required: true,
    category: "referral",
  },
  {
    id: "scope",
    text: "This describes chart-level resonance only, not a verdict on either of you as people or professionals.",
    required: false,
    category: "scope",
  },
];

export function BusinessPartnershipConsentSynthesisWorkbench() {
  const [selectedParts, setSelectedParts] = useState<Record<string, boolean>>({});
  const [auditRun, setAuditRun] = useState(false);

  const togglePart = (id: string) => {
    setSelectedParts((prev) => ({ ...prev, [id]: !prev[id] }));
    setAuditRun(false);
  };

  const reset = () => {
    setSelectedParts({});
    setAuditRun(false);
  };

  const missingRequired = STATEMENT_PARTS.filter((p) => p.required && !selectedParts[p.id]);
  const allRequiredSelected = missingRequired.length === 0;

  const builtStatement = STATEMENT_PARTS.filter((p) => selectedParts[p.id])
    .map((p) => p.text)
    .join(" ");

  return (
    <div data-interactive="business-partnership-consent-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Business-partnership consent synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Combine referral language with an explicit consent-tier declaration
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Lesson 14.5.4 already supplied the inventory and referral language. This lesson adds Priya&apos;s own explicit Tier A consent declaration. A complete statement needs both.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Consent declaration + inventory */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Inventory</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Ansh and Priya — all findings Moderate tier
              </h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={16} style={{ color: GREEN }} />
              <span style={{ color: GREEN, fontSize: "0.85rem", fontWeight: 600 }}>Tier A — both consenting</span>
            </div>
          </div>

          <div style={{ marginTop: "0.75rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                  <th style={tableHeaderStyle}>Finding</th>
                  <th style={tableHeaderStyle}>Classification</th>
                  <th style={tableHeaderStyle}>Tier</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <td style={{ padding: "0.45rem", color: INK_PRIMARY, fontWeight: 500 }}>{row.finding}</td>
                    <td style={{ padding: "0.45rem" }}>
                      <ClassificationBadge classification={row.classification} />
                    </td>
                    <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.tier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
            Priya is Ansh&apos;s actual, engaged co-founder. A genuine partnership-suitability consultation would need her perspective as much as his. Tier A is confirmed explicitly rather than assumed silently.
          </p>
        </section>

        {/* Sidebar */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Two independent checks" icon={<Scale size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              <div style={{ padding: "0.55rem", borderRadius: 6, background: `${GREEN}08`, border: `1px solid ${GREEN}` }}>
                <span style={{ color: GREEN, fontWeight: 600, fontSize: "0.85rem" }}>Consent tier</span>
                <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>Was reading these charts at this depth appropriate?</p>
              </div>
              <div style={{ padding: "0.55rem", borderRadius: 6, background: `${BLUE}08`, border: `1px solid ${BLUE}` }}>
                <span style={{ color: BLUE, fontWeight: 600, fontSize: "0.85rem" }}>Referral language</span>
                <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>What can this reading never replace?</p>
              </div>
            </div>
          </Panel>

          <Panel title="What Lesson 14.5.4 added" icon={<BookOpen size={18} />} color={GOLD}>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.6 }}>
              <li>Classified inventory</li>
              <li>Moderate tiering</li>
              <li>Referral language</li>
            </ul>
          </Panel>

          <Panel title="What this lesson adds" icon={<Users size={18} />} color={GREEN}>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.6 }}>
              <li>Explicit Tier A declaration</li>
              <li>Reasoning for Priya&apos;s consent status</li>
              <li>Combined statement discipline</li>
            </ul>
          </Panel>
        </section>
      </div>

      {/* Statement builder */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Statement builder</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Select the parts that belong in a complete statement
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
            Required parts are marked with an asterisk. A statement can be perfect on one axis and still incomplete on the other.
          </p>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {STATEMENT_PARTS.map((part) => {
              const selected = selectedParts[part.id];
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => togglePart(part.id)}
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    padding: "0.65rem",
                    borderRadius: 8,
                    border: `1px solid ${selected === undefined ? HAIRLINE : selected ? GREEN : VERMILION}`,
                    background: selected === undefined ? SURFACE : selected ? `${GREEN}08` : `${VERMILION}08`,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: selected === undefined ? INK_MUTED : selected ? GREEN : VERMILION, fontWeight: 700, fontSize: "0.9rem" }}>
                    {selected === undefined ? "?" : selected ? "+" : "−"}
                  </span>
                  <span style={{ color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {part.text}
                    {part.required && <span style={{ color: ACCENT, marginLeft: "0.35rem" }}>*</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Built statement</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Your combined statement
          </h3>
          <div style={{ padding: "0.75rem", borderRadius: 8, background: SURFACE, border: `1px solid ${HAIRLINE}`, minHeight: 120 }}>
            <p style={{ margin: 0, color: builtStatement ? INK_PRIMARY : INK_MUTED, fontSize: "0.95rem", lineHeight: 1.6 }}>
              {builtStatement || "Select statement parts on the left to build the complete synthesis."}
            </p>
          </div>
          <button type="button" onClick={() => setAuditRun(true)} style={{ ...buttonStyle(false, GREEN), marginTop: "0.75rem" }}>
            <BriefcaseBusiness size={15} aria-hidden="true" />
            Check completeness
          </button>

          {auditRun && (
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {allRequiredSelected ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Statement is complete: consent tier, findings, and referral language are all present.</span>
                  </div>
                </div>
              ) : (
                missingRequired.map((part) => (
                  <div key={part.id} style={{ padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                      <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                      <span>Missing required {part.category} part: {part.text}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ClassificationBadge({ classification }: { classification: IndicatorKey }) {
  const color = INDICATOR_COLORS[classification];
  return (
    <span style={{ padding: "0.12rem 0.45rem", borderRadius: 999, background: `${color}12`, color, fontSize: "0.7rem", fontWeight: 600, border: `1px solid ${color}` }}>
      {INDICATOR_LABELS[classification]}
    </span>
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

const tableHeaderStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.45rem",
  color: INK_MUTED,
  fontWeight: 700,
  fontSize: "0.7rem",
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
