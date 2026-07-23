"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Filter,
  Layers,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type RowType = "overlay" | "conjunction";
type IndicatorKey = "green" | "mixed" | "caution";

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
  type: RowType;
  finding: string;
  ansh: string;
  company: string;
  classification: IndicatorKey;
  reading: string;
  keywords: string[];
}

const INVENTORY: InventoryRow[] = [
  {
    id: "ansh-moon-h1",
    type: "overlay",
    finding: "Ansh's Moon activates Meridian Labs's H1",
    ansh: "Moon own-sign in Cancer",
    company: "Cancer is company Lagna (H1)",
    classification: "green",
    reading: "Ansh's emotional core reaches the company's defining point.",
    keywords: ["moon", "lagna", "company"],
  },
  {
    id: "company-saturn-h1",
    type: "overlay",
    finding: "Meridian Labs's Saturn activates Ansh's H1",
    ansh: "Libra is Ansh's Lagna (H1)",
    company: "Saturn exalted in Libra",
    classification: "green",
    reading: "The company's structural authority reaches Ansh's defining point.",
    keywords: ["saturn", "lagna", "ansh"],
  },
  {
    id: "mars-mars-capricorn",
    type: "conjunction",
    finding: "Mars-Mars conjunction in Capricorn",
    ansh: "Mars exalted",
    company: "Mars exalted",
    classification: "green",
    reading: "Doubled-dignity echo: identical graha at peak strength in both charts.",
    keywords: ["mars", "capricorn"],
  },
  {
    id: "venus-sun-mercury-taurus",
    type: "conjunction",
    finding: "Venus meets Sun+Mercury in Taurus",
    ansh: "Venus own-sign",
    company: "Sun enemy-sign, Mercury friendly",
    classification: "mixed",
    reading: "Ansh's dignified Venus meets one afflicted and one modestly favourable company placement.",
    keywords: ["venus", "taurus"],
  },
];

const DEFAULT_STATEMENT = `Ansh's own chart and Meridian Labs's own incorporation chart show a genuine mutual core-identity exchange: Ansh's own-sign Moon activates the company's own Lagna, and the company's own exalted Saturn activates Ansh's own Lagna. They also share a doubled-dignity Mars-Mars echo in Capricorn, and one mixed finding in Taurus where Ansh's own Venus meets the company's own afflicted Sun alongside its friendly Mercury. These are real, Moderate-tier structural connections — not a verdict about destiny or inevitable success, and not a substitute for the business judgement and professional advice any real venture requires.`;

const DETERMINISM_WORDS = [
  { word: "destined", label: "determinism" },
  { word: "meant to", label: "determinism" },
  { word: "guaranteed", label: "determinism" },
  { word: "inevitable", label: "determinism" },
  { word: "greatness", label: "overclaiming" },
];

const REFERRAL_PHRASES = [
  "not a substitute",
  "business judgement",
  "professional advice",
  "lawyer",
  "accountant",
];

export function FounderIncorporationChartOverlay() {
  const [activeTypes, setActiveTypes] = useState<RowType[]>(["overlay", "conjunction"]);
  const [activeClassifications, setActiveClassifications] = useState<IndicatorKey[]>(["green", "mixed", "caution"]);
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [auditRun, setAuditRun] = useState(false);

  const filteredInventory = useMemo(() => {
    return INVENTORY.filter((row) => activeTypes.includes(row.type) && activeClassifications.includes(row.classification));
  }, [activeTypes, activeClassifications]);

  const audit = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    const missing = INVENTORY.filter((row) => {
      return !row.keywords.every((kw) => draftLower.includes(kw));
    });
    const determinism = DETERMINISM_WORDS.filter((d) => draftLower.includes(d.word));
    const hasReferral = REFERRAL_PHRASES.some((p) => draftLower.includes(p.toLowerCase()));
    const missingMixed = !draftLower.includes("mixed") && !draftLower.includes("taurus");
    return { missing, determinism, hasReferral, missingMixed };
  }, [draftStatement]);

  const auditPassed = audit.missing.length === 0 && audit.determinism.length === 0 && audit.hasReferral && !audit.missingMixed;

  const toggleType = (type: RowType) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleClassification = (classification: IndicatorKey) => {
    setActiveClassifications((prev) =>
      prev.includes(classification) ? prev.filter((c) => c !== classification) : [...prev, classification]
    );
  };

  const reset = () => {
    setActiveTypes(["overlay", "conjunction"]);
    setActiveClassifications(["green", "mixed", "caution"]);
    setDraftStatement(DEFAULT_STATEMENT);
    setAuditRun(false);
  };

  return (
    <div data-interactive="founder-incorporation-chart-overlay" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Founder-incorporation chart overlay</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Ansh + Meridian Labs: mutual identity and honest limits
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Review the house-overlay and cross-conjunction inventory. The determinism guard blocks destiny-language; the completeness check blocks dropping the mixed finding.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Inventory + filters */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Ansh · Meridian Labs inventory</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                {filteredInventory.length} of {INVENTORY.length} rows visible
              </h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={16} style={{ color: INK_MUTED }} />
              <span style={{ color: INK_MUTED, fontSize: "0.85rem", fontWeight: 600 }}>Founder: Ansh</span>
            </div>
          </div>

          <div className="hidden md:block" style={{ marginTop: "0.75rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                  <th style={tableHeaderStyle}>Finding</th>
                  <th style={tableHeaderStyle}>Ansh</th>
                  <th style={tableHeaderStyle}>Company</th>
                  <th style={tableHeaderStyle}>Class</th>
                  <th style={tableHeaderStyle}>Reading</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <td style={{ padding: "0.45rem", color: INK_PRIMARY, fontWeight: 500 }}>{row.finding}</td>
                    <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.ansh}</td>
                    <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.company}</td>
                    <td style={{ padding: "0.45rem" }}>
                      <ClassificationBadge classification={row.classification} />
                    </td>
                    <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.reading}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden" style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
            {filteredInventory.map((row) => (
              <div key={row.id} style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{row.finding}</span>
                  <ClassificationBadge classification={row.classification} />
                </div>
                <div style={{ marginTop: "0.35rem", color: INK_SECONDARY, fontSize: "0.85rem" }}>Ansh: {row.ansh}</div>
                <div style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>Company: {row.company}</div>
                <div style={{ marginTop: "0.35rem", color: INK_SECONDARY, fontSize: "0.85rem" }}>{row.reading}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar filters + headline */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Filters" icon={<Filter size={18} />} color={ACCENT}>
            <div style={{ marginBottom: "0.55rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.35rem" }}>FINDING TYPE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                <button type="button" onClick={() => toggleType("overlay")} style={smallChipStyle(activeTypes.includes("overlay"), BLUE)}>
                  <Layers size={13} aria-hidden="true" />
                  Overlay
                </button>
                <button type="button" onClick={() => toggleType("conjunction")} style={smallChipStyle(activeTypes.includes("conjunction"), GREEN)}>
                  <Users size={13} aria-hidden="true" />
                  Conjunction
                </button>
              </div>
            </div>
            <div>
              <div style={{ color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.35rem" }}>CLASSIFICATION</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {(Object.keys(INDICATOR_COLORS) as IndicatorKey[]).map((c) => (
                  <button key={c} type="button" onClick={() => toggleClassification(c)} style={smallChipStyle(activeClassifications.includes(c), INDICATOR_COLORS[c])}>
                    {INDICATOR_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Headline finding" icon={<Building2 size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
              <strong style={{ color: BLUE, fontWeight: 600 }}>Mutual H1 activation</strong> &mdash; each chart&apos;s own core-identity house is activated by the other&apos;s dignified graha.
            </p>
            <div style={{ marginTop: "0.55rem", display: "grid", gap: "0.35rem" }}>
              <MiniFact label="Ansh &rarr; Company" value="Moon (own-sign) in company&apos;s H1" color={GREEN} />
              <MiniFact label="Company &rarr; Ansh" value="Saturn (exalted) in Ansh&apos;s H1" color={GREEN} />
            </div>
          </Panel>
        </section>
      </div>

      {/* Draft + audit */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Draft synthesis statement</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Describe resonance, not destiny
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
              <p style={eyebrowStyle}>Statement checks</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Determinism + completeness
              </h3>
            </div>
            <button type="button" onClick={() => setAuditRun(true)} style={buttonStyle(false, GREEN)}>
              <ShieldCheck size={15} aria-hidden="true" />
              Check
            </button>
          </div>

          {!auditRun && (
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              The determinism guard blocks destiny-language; the completeness check blocks dropping the mixed Taurus finding.
            </p>
          )}

          {auditRun && (
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {auditPassed ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: GREEN_TINT, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Statement passes: no determinism, all rows represented, referral language included.</span>
                  </div>
                </div>
              ) : (
                <>
                  {audit.determinism.map((d) => (
                    <AuditIssue key={d.word}>
                      &quot;{d.word}&quot; &mdash; {d.label}. Replace with descriptive language.
                    </AuditIssue>
                  ))}
                  {audit.missing.map((row) => (
                    <AuditIssue key={row.id}>Missing finding: {row.finding}</AuditIssue>
                  ))}
                  {audit.missingMixed && <AuditIssue>The mixed Taurus finding is not represented. Do not smooth over complication.</AuditIssue>}
                  {!audit.hasReferral && <AuditIssue>Referral language is missing. Remind founders that chart resonance is not business advice.</AuditIssue>}
                </>
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
    <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: tintForColor(color), color, fontSize: "0.75rem", fontWeight: 600, border: `1px solid ${color}` }}>
      {INDICATOR_LABELS[classification]}
    </span>
  );
}

function MiniFact({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem", borderRadius: 6, background: tintForColor(color), border: `1px solid ${color}` }}>
      <span style={{ color, fontWeight: 700, fontSize: "0.75rem" }}>{label}</span>
      <span style={{ color: INK_SECONDARY, fontSize: "0.8rem" }}>{value}</span>
    </div>
  );
}

function AuditIssue({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: "0.65rem", borderRadius: 8, background: VERMILION_TINT, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
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

function tintForColor(color: string): string {
  if (color === VERMILION) return VERMILION_TINT;
  if (color === GREEN) return GREEN_TINT;
  if (color === BLUE) return BLUE_TINT;
  if (color === GOLD || color === ACCENT) return GOLD_TINT;
  return `${color}12`;
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
