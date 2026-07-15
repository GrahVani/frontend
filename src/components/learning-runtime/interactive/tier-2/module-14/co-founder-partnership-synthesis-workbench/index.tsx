"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  MessageSquareText,
  RotateCcw,
  Scale,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type IndicatorKey = "green" | "mixed" | "caution";
type ToneKey = "favourable" | "complication" | "neutral";

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
const PURPLE = "#6B46C1";

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

interface InventoryRow {
  id: string;
  finding: string;
  technique: string;
  classification: IndicatorKey | "recorded";
  tier: "Moderate" | "—";
  tone: ToneKey;
}

const INVENTORY: InventoryRow[] = [
  {
    id: "mars-exchange",
    finding: "Mutual Mars house-overlay exchange (Ansh → Priya H10; Priya → Ansh H7)",
    technique: "House-overlay",
    classification: "green",
    tier: "Moderate",
    tone: "favourable",
  },
  {
    id: "aries-conjunction",
    finding: "Sun+Mercury / Mars conjunction in Aries",
    technique: "Cross-conjunction",
    classification: "mixed",
    tier: "Moderate",
    tone: "neutral",
  },
  {
    id: "capricorn-conjunction",
    finding: "Mars / Sun conjunction in Capricorn",
    technique: "Cross-conjunction",
    classification: "caution",
    tier: "Moderate",
    tone: "complication",
  },
  {
    id: "taurus-conjunction",
    finding: "Venus / Jupiter conjunction in Taurus",
    technique: "Cross-conjunction",
    classification: "caution",
    tier: "Moderate",
    tone: "complication",
  },
  {
    id: "recorded",
    finding: "Five further conjunctions (recorded, not featured)",
    technique: "Cross-conjunction",
    classification: "recorded",
    tier: "—",
    tone: "neutral",
  },
];

const DEFAULT_STATEMENT = `Across the business-relevant houses (7th, 10th, 11th), your charts show one clearly favourable, mutually-dignified exchange — each of your own strongest placements (Mars) activates the other's own most business-relevant house — alongside a genuinely mixed picture in the broader conjunction inventory: one further favourable-leaning finding, and two findings worth naming as areas of real complication. All of these findings are Moderate confidence — real and worth knowing, but each resting on a single technique, not multiply corroborated. None of this describes your compatibility as people in general, and none of it substitutes for a lawyer reviewing your partnership agreement, an accountant reviewing your financial structure, or your own independent judgement about this specific business.`;

const REFERRAL_PHRASES = [
  "lawyer reviewing",
  "accountant reviewing",
  "qualified professional",
  "independent judgement",
  "not a substitute",
];

const DIRECTIVE_WORDS = [
  { word: "you should proceed", label: "directive recommendation" },
  { word: "proceed", label: "directive recommendation" },
  { word: "sign the agreement", label: "directive recommendation" },
  { word: "go ahead", label: "directive recommendation" },
  { word: "strong-tier", label: "tier inflation" },
];

export function CoFounderPartnershipSynthesisWorkbench() {
  const [upgradeAttempted, setUpgradeAttempted] = useState(false);
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [auditRun, setAuditRun] = useState(false);

  const audit = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    const missingFindings = INVENTORY.filter((row) => {
      if (row.id === "recorded") return false;
      const search = row.finding.toLowerCase().slice(0, 35);
      return !draftLower.includes(search);
    });
    const missingGreen = !draftLower.includes("green");
    const missingMixed = !draftLower.includes("mixed");
    const missingCaution = !draftLower.includes("caution");
    const strongClaim = draftLower.includes("strong");
    const hasReferral = REFERRAL_PHRASES.some((p) => draftLower.includes(p.toLowerCase()));
    const directives = DIRECTIVE_WORDS.filter((d) => draftLower.includes(d.word));
    return { missingFindings, missingGreen, missingMixed, missingCaution, strongClaim, hasReferral, directives };
  }, [draftStatement]);

  const auditPassed =
    audit.missingFindings.length === 0 &&
    !audit.missingGreen &&
    !audit.missingMixed &&
    !audit.missingCaution &&
    !audit.strongClaim &&
    audit.hasReferral &&
    audit.directives.length === 0;

  const reset = () => {
    setUpgradeAttempted(false);
    setDraftStatement(DEFAULT_STATEMENT);
    setAuditRun(false);
  };

  return (
    <div data-interactive="co-founder-partnership-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Referral banner */}
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
            <strong style={{ fontWeight: 600 }}>Mandatory referral discipline:</strong>{" "}
            Every partnership-suitability statement must close with language directing founders to qualified legal, financial, and business professionals — regardless of how favourable the findings look.
          </span>
        </div>
      </div>

      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Co-founder partnership synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Assemble classification, tier, and referral into one answer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The Ansh-Priya inventory is classified and tiered. Classification and tier are independent axes, and the statement must close with referral language.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Inventory + matrix */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Assembled inventory</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Classification and tier are separate columns
          </h3>

          <div className="hidden md:block" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                  <th style={tableHeaderStyle}>Finding</th>
                  <th style={tableHeaderStyle}>Technique</th>
                  <th style={tableHeaderStyle}>Classification</th>
                  <th style={tableHeaderStyle}>Tier</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <td style={{ padding: "0.45rem", color: INK_PRIMARY, fontWeight: 500 }}>{row.finding}</td>
                    <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.technique}</td>
                    <td style={{ padding: "0.45rem" }}>
                      <ClassificationBadge classification={row.classification} />
                    </td>
                    <td style={{ padding: "0.45rem" }}>
                      <TierBadge tier={row.tier} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden" style={{ marginTop: "0.55rem", display: "grid", gap: "0.55rem" }}>
            {INVENTORY.map((row) => (
              <div key={row.id} style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <div style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{row.finding}</div>
                <div style={{ marginTop: "0.35rem", display: "flex", gap: "0.5rem" }}>
                  <ClassificationBadge classification={row.classification} />
                  <TierBadge tier={row.tier} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Classification vs Tier" icon={<Scale size={18} />} color={PURPLE}>
            <ClassificationTierMatrix />
            <p style={bodyTextStyle}>
              The green Mars exchange is dignity-clean but still <strong style={{ color: BLUE, fontWeight: 600 }}>Moderate</strong> tier — single technique, not multiply corroborated.
            </p>
          </Panel>

          <Panel title="Try to upgrade" icon={<TrendingUp size={18} />} color={GOLD}>
            <p style={bodyTextStyle}>
              A clean-looking finding can tempt an informal tier upgrade. Click below to see why the tool blocks it.
            </p>
            <button
              type="button"
              onClick={() => setUpgradeAttempted(true)}
              style={{ ...buttonStyle(false, GOLD), width: "100%", marginTop: "0.55rem" }}
            >
              <Star size={15} aria-hidden="true" />
              Upgrade Mars exchange to Strong
            </button>
            {upgradeAttempted && (
              <div style={{ marginTop: "0.65rem", padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                  <span>
                    Blocked. The Mars exchange rests on one technique (house-overlay) applied once. Strong tier requires multiple independent techniques converging on the identical claim — which this finding does not have.
                  </span>
                </div>
              </div>
            )}
          </Panel>
        </section>
      </div>

      {/* Draft statement + audit */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Draft synthesis statement</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Describe, do not direct
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
            rows={8}
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
              The audit checks that every featured finding and classification is named, that tiers are not inflated to Strong, that referral language is present, and that the statement does not issue a directive recommendation.
            </p>
          )}

          {auditRun && (
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {auditPassed ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Statement is complete: findings named, tiers honest, referral included, no directive recommendation.</span>
                  </div>
                </div>
              ) : (
                <>
                  {audit.missingFindings.map((row) => (
                    <AuditIssue key={row.id} text={`Missing featured finding: ${row.finding}`} />
                  ))}
                  {audit.missingGreen && <AuditIssue text='The &quot;green&quot; classification is not named.' />}
                  {audit.missingMixed && <AuditIssue text='The &quot;mixed&quot; classification is not named.' />}
                  {audit.missingCaution && <AuditIssue text='The &quot;caution&quot; classification is not named.' />}
                  {audit.strongClaim && <AuditIssue text='Tier inflation detected: a featured finding is described as Strong rather than Moderate.' />}
                  {!audit.hasReferral && <AuditIssue text='Referral language is missing. Direct founders to legal/financial/business professionals.' />}
                  {audit.directives.map((d) => (
                    <AuditIssue key={d.word} text={`&quot;${d.word}&quot; — ${d.label}. The statement should describe, not direct.`} />
                  ))}
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ClassificationTierMatrix() {
  return (
    <svg viewBox="0 0 220 120" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      {/* Axes */}
      <line x1="30" y1="100" x2="200" y2="100" stroke={INK_MUTED} strokeWidth={1} />
      <line x1="30" y1="100" x2="30" y2="15" stroke={INK_MUTED} strokeWidth={1} />

      {/* Axis labels */}
      <text x="115" y="115" textAnchor="middle" fontSize="9" fill={INK_SECONDARY} fontWeight={600}>Classification (dignity)</text>
      <text x="12" y="60" textAnchor="middle" fontSize="9" fill={INK_SECONDARY} fontWeight={600} transform="rotate(-90 12 60)">Tier (evidence)</text>

      {/* Mars exchange dot */}
      <circle cx="160" cy="35" r="6" fill={GREEN} />
      <text x="160" y="28" textAnchor="middle" fontSize="8" fill={INK_PRIMARY} fontWeight={600}>Mars exchange</text>
      <text x="160" y="48" textAnchor="middle" fontSize="7" fill={INK_MUTED}>Green · Moderate</text>

      {/* Aries conjunction dot */}
      <circle cx="100" cy="35" r="5" fill={GOLD} />
      <text x="100" y="28" textAnchor="middle" fontSize="8" fill={INK_PRIMARY} fontWeight={600}>Aries conj.</text>

      {/* Capricorn/Taurus dots */}
      <circle cx="70" cy="35" r="5" fill={VERMILION} />
      <text x="70" y="28" textAnchor="middle" fontSize="8" fill={INK_PRIMARY} fontWeight={600}>Caution rows</text>

      {/* Strong tier line */}
      <line x1="25" y1="20" x2="205" y2="20" stroke={INK_MUTED} strokeWidth={1} strokeDasharray="3 3" />
      <text x="190" y="16" textAnchor="end" fontSize="7" fill={INK_MUTED}>Strong tier threshold</text>
    </svg>
  );
}

function ClassificationBadge({ classification }: { classification: IndicatorKey | "recorded" }) {
  if (classification === "recorded") {
    return (
      <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: `${INK_MUTED}12`, color: INK_MUTED, fontSize: "0.75rem", fontWeight: 600, border: `1px solid ${INK_MUTED}` }}>
        Recorded
      </span>
    );
  }
  const color = INDICATOR_COLORS[classification];
  return (
    <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: `${color}12`, color, fontSize: "0.75rem", fontWeight: 600, border: `1px solid ${color}` }}>
      {INDICATOR_LABELS[classification]}
    </span>
  );
}

function TierBadge({ tier }: { tier: "Moderate" | "—" }) {
  const color = tier === "Moderate" ? ACCENT : INK_MUTED;
  return (
    <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: `${color}12`, color, fontSize: "0.75rem", fontWeight: 600, border: `1px solid ${color}` }}>
      {tier}
    </span>
  );
}

function AuditIssue({ text }: { text: string }) {
  return (
    <div style={{ padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
        <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
        <span dangerouslySetInnerHTML={{ __html: text }} />
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


