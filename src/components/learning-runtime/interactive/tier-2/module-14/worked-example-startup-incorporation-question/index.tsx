"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  CheckSquare,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Square,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FounderKey = "ansh" | "priya";
type IndicatorKey = "green" | "mixed" | "caution";
type CitationCategory = "classical" | "modern" | "fabrication";

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
  founder: FounderKey;
  finding: string;
  classification: IndicatorKey;
  tier: string;
  keywords: string[];
}

const INVENTORY: InventoryRow[] = [
  {
    id: "ansh-identity",
    founder: "ansh",
    finding: "Mutual identity exchange (Moon in company H1; company Saturn in Ansh H1)",
    classification: "green",
    tier: "Moderate",
    keywords: ["identity", "moon", "saturn"],
  },
  {
    id: "ansh-mars",
    founder: "ansh",
    finding: "Doubled Mars-Mars echo in Capricorn",
    classification: "green",
    tier: "Moderate",
    keywords: ["mars", "capricorn"],
  },
  {
    id: "ansh-venus",
    founder: "ansh",
    finding: "Venus / Sun+Mercury in Taurus",
    classification: "mixed",
    tier: "Moderate",
    keywords: ["venus", "taurus"],
  },
  {
    id: "priya-saturn-venus",
    founder: "priya",
    finding: "Saturn / Venus in Gemini (both friendly)",
    classification: "green",
    tier: "Moderate",
    keywords: ["saturn", "venus", "gemini"],
  },
  {
    id: "priya-sun-mars",
    founder: "priya",
    finding: "Sun / Mars in Capricorn",
    classification: "mixed",
    tier: "Moderate",
    keywords: ["sun", "mars", "capricorn"],
  },
  {
    id: "priya-moon-saturn",
    founder: "priya",
    finding: "Moon / Saturn in Libra",
    classification: "mixed",
    tier: "Moderate",
    keywords: ["moon", "saturn", "libra"],
  },
  {
    id: "priya-jupiter-sun",
    founder: "priya",
    finding: "Jupiter / Sun in Taurus (both enemy-sign)",
    classification: "caution",
    tier: "Moderate",
    keywords: ["jupiter", "sun", "taurus"],
  },
];

const CITATION_CLAIMS: { id: string; text: string; category: CitationCategory; explanation: string }[] = [
  {
    id: "classical-root",
    text: "A well-chosen beginning-moment chart is built and read like a natal chart.",
    category: "classical",
    explanation: "Classical precedent: muhurta and natal-chart construction apply to a business-launch moment.",
  },
  {
    id: "modern-extension",
    text: "The incorporation chart is read prospectively, year by year, as the company's ongoing natal-equivalent chart.",
    category: "modern",
    explanation: "This curriculum's own disclosed modern extension, not a classical claim.",
  },
];

const DEFAULT_STATEMENT = `This reading extends a genuine classical precedent — that a well-chosen beginning-moment's own chart is built and read like a natal chart, including specifically for business launches — into this curriculum's own disclosed modern application: reading Meridian Labs's own incorporation chart prospectively, as an ongoing company chart. Checking each founder independently against this company chart finds two different patterns, reported honestly and never blended into one score. Ansh's own chart shows two clean, dignified points of connection — a mutual core-identity exchange and a doubled-strength Mars echo — alongside one further, more mixed finding. Priya's own chart shows one comparably clean finding, two mixed findings, and one genuine caution finding where neither side is dignified. Every finding here is Moderate confidence. None of this is a verdict on either founder's own competence, judgement, or value to this company — it is a description of chart-level resonance only, and it is not a substitute for the business, legal, financial, and governance decisions that remain yours to make, informed by qualified professional advice, regardless of what any chart shows. This chapter raises, but does not resolve, the consent question of reading Priya's own chart alongside Ansh's; Chapter 7 takes that up directly.`;

const DETERMINISM_WORDS = [
  { word: "destined", label: "determinism" },
  { word: "meant to", label: "determinism" },
  { word: "guaranteed", label: "determinism" },
  { word: "inevitable", label: "determinism" },
  { word: "greatness", label: "overclaiming" },
];

const COMPANY_OVERCLAIMS = [
  { phrase: "strong company", label: "company strength overclaim" },
  { phrase: "company is strong", label: "company strength overclaim" },
  { phrase: "successful company", label: "success overclaim" },
  { phrase: "will succeed", label: "predictive overclaim" },
];

const REFERRAL_PHRASES = [
  "not a substitute",
  "business",
  "legal",
  "financial",
  "professional advice",
];

export function WorkedExampleStartupIncorporationQuestion() {
  const [citations, setCitations] = useState<Record<string, CitationCategory | null>>({});
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [auditRun, setAuditRun] = useState(false);
  const [compressedAttempted, setCompressedAttempted] = useState(false);
  const [checklist, setChecklist] = useState({ inventory: false, tier: false, citation: false, referral: false, scope: false, consent: false });

  const audit = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    const determinism = DETERMINISM_WORDS.filter((d) => draftLower.includes(d.word));
    const companyOverclaims = COMPANY_OVERCLAIMS.filter((c) => draftLower.includes(c.phrase));
    const hasReferral = REFERRAL_PHRASES.every((p) => draftLower.includes(p.toLowerCase()));
    const hasBothFounders = draftLower.includes("ansh") && draftLower.includes("priya");
    const hasModerate = draftLower.includes("moderate");
    const hasCitation = draftLower.includes("classical") && draftLower.includes("modern");
    const hasScope = draftLower.includes("business") && draftLower.includes("governance");
    const hasConsent = draftLower.includes("consent") || draftLower.includes("chapter 7");

    const missingRows = INVENTORY.filter((row) => !row.keywords.every((kw) => draftLower.includes(kw)));
    const isCompressed = draftStatement.length < 220;

    return { determinism, companyOverclaims, hasReferral, hasBothFounders, hasModerate, hasCitation, hasScope, hasConsent, missingRows, isCompressed };
  }, [draftStatement]);

  const auditPassed =
    audit.determinism.length === 0 &&
    audit.companyOverclaims.length === 0 &&
    audit.hasReferral &&
    audit.hasBothFounders &&
    audit.hasModerate &&
    audit.hasCitation &&
    audit.hasScope &&
    audit.hasConsent &&
    audit.missingRows.length === 0 &&
    !audit.isCompressed;

  const setCitation = (id: string, category: CitationCategory) => {
    setCitations((prev) => ({ ...prev, [id]: category }));
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tryCompressed = () => {
    setDraftStatement("The astrology says Meridian Labs is a strong company.");
    setCompressedAttempted(true);
    setAuditRun(true);
  };

  const reset = () => {
    setCitations({});
    setDraftStatement(DEFAULT_STATEMENT);
    setAuditRun(false);
    setCompressedAttempted(false);
    setChecklist({ inventory: false, tier: false, citation: false, referral: false, scope: false, consent: false });
  };

  return (
    <div data-interactive="worked-example-startup-incorporation-question" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked example: startup incorporation question</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Assemble both inventories into one complete, tiered statement
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Confirm every row, classification, and tier; name the classical root and the modern extension; then close with referral, scope, and consent disclosures.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Diagram + sidebar */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Assembled inventory</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Seven rows, two founders, all Moderate tier
              </h3>
            </div>
          </div>

          <SynthesisFlowSvg />

          <div style={{ marginTop: "0.75rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                  <th style={tableHeaderStyle}>Founder</th>
                  <th style={tableHeaderStyle}>Finding</th>
                  <th style={tableHeaderStyle}>Classification</th>
                  <th style={tableHeaderStyle}>Tier</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <td style={{ padding: "0.45rem", color: row.founder === "ansh" ? BLUE : PURPLE, fontWeight: 600 }}>
                      {row.founder === "ansh" ? "Ansh" : "Priya"}
                    </td>
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
        </section>

        {/* Sidebar */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Citation honesty" icon={<BookOpen size={18} />} color={BLUE}>
            <p style={{ margin: "0 0 0.55rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
              Sort each part of the reading frame. A genuine classical root plus a disclosed modern extension is more defensible than a fabricated ancient lineage.
            </p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {CITATION_CLAIMS.map((claim) => {
                const selected = citations[claim.id];
                return (
                  <div key={claim.id} style={{ padding: "0.6rem", borderRadius: 8, border: `1px solid ${selected ? categoryColor(selected) : HAIRLINE}`, background: selected ? `${categoryColor(selected)}08` : SURFACE }}>
                    <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{claim.text}</p>
                    <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.45rem", flexWrap: "wrap" }}>
                      {(["classical", "modern", "fabrication"] as CitationCategory[]).map((cat) => (
                        <button key={cat} type="button" aria-pressed={selected === cat} onClick={() => setCitation(claim.id, cat)} style={smallChipStyle(selected === cat, categoryColor(cat))}>
                          {cat === "classical" ? "Classical" : cat === "modern" ? "Modern" : "Fabrication"}
                        </button>
                      ))}
                    </div>
                    {selected && (
                      <div style={{ marginTop: "0.45rem", padding: "0.45rem", borderRadius: 6, background: selected === claim.category ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${selected === claim.category ? GREEN : VERMILION}`, color: selected === claim.category ? GREEN : VERMILION, fontSize: "0.78rem" }}>
                        {selected === claim.category ? claim.explanation : `This claim belongs under ${claim.category === "classical" ? "Classical" : claim.category === "modern" ? "Modern" : "Fabrication"}. ${claim.explanation}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Synthesis checklist" icon={<CheckSquare size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              <CheckItem checked={checklist.inventory} onToggle={() => toggleChecklist("inventory")} label="Both founders' inventories included" />
              <CheckItem checked={checklist.tier} onToggle={() => toggleChecklist("tier")} label="Every finding tiered Moderate" />
              <CheckItem checked={checklist.citation} onToggle={() => toggleChecklist("citation")} label="Classical and modern frame named" />
              <CheckItem checked={checklist.referral} onToggle={() => toggleChecklist("referral")} label="Referral language included" />
              <CheckItem checked={checklist.scope} onToggle={() => toggleChecklist("scope")} label="Scope limits stated" />
              <CheckItem checked={checklist.consent} onToggle={() => toggleChecklist("consent")} label="Consent question previewed" />
            </div>
          </Panel>
        </section>
      </div>

      {/* Draft + audit */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Draft complete statement</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Compression under pressure drops the guardrails
              </h3>
            </div>
            <button type="button" onClick={() => { setDraftStatement(DEFAULT_STATEMENT); setAuditRun(false); setCompressedAttempted(false); }} style={buttonStyle(false, BLUE)}>
              <MessageSquareText size={15} aria-hidden="true" />
              Reset statement
            </button>
          </div>
          <textarea
            value={draftStatement}
            onChange={(e) => { setDraftStatement(e.target.value); setAuditRun(false); setCompressedAttempted(false); }}
            rows={10}
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
          <button type="button" onClick={tryCompressed} style={{ ...buttonStyle(false, VERMILION), marginTop: "0.55rem" }}>
            Try one-sentence summary
          </button>
          {compressedAttempted && (
            <div style={{ marginTop: "0.55rem", padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                <span>A one-sentence summary loses classification, tiering, both founders, citation honesty, scope limits, and referral language.</span>
              </div>
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Statement checks</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Completeness, citation, scope
              </h3>
            </div>
            <button type="button" onClick={() => setAuditRun(true)} style={buttonStyle(false, GREEN)}>
              <ShieldCheck size={15} aria-hidden="true" />
              Check
            </button>
          </div>

          {!auditRun && (
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              The checks enforce: no destiny-language, no company-strength overclaim, every row represented, Moderate tier named, citation frame split, referral/scope/consent included, and no compressed summary.
            </p>
          )}

          {auditRun && (
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {auditPassed ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Statement passes: complete, correctly tiered, citation-honest, scoped, and referred.</span>
                  </div>
                </div>
              ) : (
                <>
                  {audit.determinism.map((d) => (
                    <AuditIssue key={d.word}>&quot;{d.word}&quot; &mdash; {d.label}. Replace with descriptive language.</AuditIssue>
                  ))}
                  {audit.companyOverclaims.map((c) => (
                    <AuditIssue key={c.phrase}>&quot;{c.phrase}&quot; &mdash; {c.label}. The technique assesses chart resonance, not company strength or success.</AuditIssue>
                  ))}
                  {audit.isCompressed && <AuditIssue>The statement is too compressed. A complete synthesis needs multiple sentences.</AuditIssue>}
                  {audit.missingRows.map((row) => (
                    <AuditIssue key={row.id}>Missing finding: {row.finding}</AuditIssue>
                  ))}
                  {!audit.hasModerate && <AuditIssue>Every finding must be named as Moderate confidence.</AuditIssue>}
                  {!audit.hasBothFounders && <AuditIssue>Both Ansh and Priya must be represented.</AuditIssue>}
                  {!audit.hasCitation && <AuditIssue>The citation frame must name both the classical root and the modern extension.</AuditIssue>}
                  {!audit.hasScope && <AuditIssue>Scope limits must include business/legal/financial and governance dimensions.</AuditIssue>}
                  {!audit.hasConsent && <AuditIssue>The consent question or Chapter 7 preview must be included.</AuditIssue>}
                  {!audit.hasReferral && <AuditIssue>Referral language is missing. Remind founders that chart resonance is not professional advice.</AuditIssue>}
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SynthesisFlowSvg() {
  const steps = [
    { label: "Inventory", x: 50, color: BLUE },
    { label: "Classify", x: 150, color: GREEN },
    { label: "Tier", x: 250, color: GOLD },
    { label: "Cite", x: 350, color: PURPLE },
    { label: "Refer", x: 450, color: GREEN },
    { label: "Scope", x: 550, color: VERMILION },
  ];

  return (
    <svg viewBox="0 0 600 90" role="img" aria-label="Synthesis assembly flow from inventory to scope" style={{ width: "100%", maxHeight: 160, margin: "0.4rem auto 0.75rem", display: "block" }}>
      <rect x="12" y="12" width="576" height="66" rx="8" fill={`${ACCENT}08`} stroke={HAIRLINE} />
      {steps.map((step, index) => (
        <g key={step.label}>
          <circle cx={step.x} cy="45" r="18" fill={`${step.color}18`} stroke={step.color} strokeWidth="2" />
          <text x={step.x} y="50" textAnchor="middle" fill={step.color} fontSize="12" fontWeight={600}>
            {index + 1}
          </text>
          <text x={step.x} y="78" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>
            {step.label}
          </text>
          {index < steps.length - 1 && (
            <line x1={step.x + 18} y1="45" x2={steps[index + 1].x - 18} y2="45" stroke={HAIRLINE} strokeWidth="2" />
          )}
        </g>
      ))}
    </svg>
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

function categoryColor(category: CitationCategory) {
  return category === "classical" ? BLUE : category === "modern" ? GOLD : VERMILION;
}

function CheckItem({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.35rem 0", background: "transparent", border: "none", color: INK_PRIMARY, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", textAlign: "left" }}
    >
      {checked ? <CheckSquare size={16} style={{ color: GREEN }} /> : <Square size={16} style={{ color: INK_MUTED }} />}
      <span style={{ color: checked ? INK_PRIMARY : INK_SECONDARY }}>{label}</span>
    </button>
  );
}

function AuditIssue({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
        <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
        <span>{children}</span>
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
