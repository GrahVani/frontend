"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Combine,
  Filter,
  Layers,
  MessageSquareText,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FounderKey = "ansh" | "priya";
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
const PURPLE = "#6B5AA8";
const PURPLE_TINT = "#F1EEFA";

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

const INDICATOR_DESCRIPTIONS: Record<IndicatorKey, string> = {
  green: "Both sides dignified: own-sign, exalted, or friendly.",
  mixed: "Asymmetric dignity: one side stronger than the other.",
  caution: "Afflicted on at least one side, or double affliction.",
};

interface InventoryRow {
  id: string;
  type: RowType;
  finding: string;
  founderSide: string;
  companySide: string;
  classification: IndicatorKey;
  reading: string;
  keywords: string[];
}

interface FounderProfile {
  key: FounderKey;
  label: string;
  color: string;
  inventory: InventoryRow[];
}

const FOUNDERS: Record<FounderKey, FounderProfile> = {
  ansh: {
    key: "ansh",
    label: "Ansh",
    color: BLUE,
    inventory: [
      {
        id: "ansh-moon-h1",
        type: "overlay",
        finding: "Ansh's Moon activates Meridian Labs's H1",
        founderSide: "Moon own-sign in Cancer",
        companySide: "Cancer is company Lagna (H1)",
        classification: "green",
        reading: "Ansh's emotional core reaches the company's defining point.",
        keywords: ["moon", "lagna", "company"],
      },
      {
        id: "ansh-saturn-h1",
        type: "overlay",
        finding: "Meridian Labs's Saturn activates Ansh's H1",
        founderSide: "Libra is Ansh's Lagna (H1)",
        companySide: "Saturn exalted in Libra",
        classification: "green",
        reading: "The company's structural authority reaches Ansh's defining point.",
        keywords: ["saturn", "lagna", "ansh"],
      },
      {
        id: "ansh-mars-mars",
        type: "conjunction",
        finding: "Mars-Mars conjunction in Capricorn",
        founderSide: "Mars exalted",
        companySide: "Mars exalted",
        classification: "green",
        reading: "Doubled-dignity echo: identical graha at peak strength in both charts.",
        keywords: ["mars", "capricorn"],
      },
      {
        id: "ansh-venus-sun-mercury",
        type: "conjunction",
        finding: "Venus meets Sun+Mercury in Taurus",
        founderSide: "Venus own-sign",
        companySide: "Sun enemy-sign, Mercury friendly",
        classification: "mixed",
        reading: "Ansh's dignified Venus meets one afflicted and one modestly favourable company placement.",
        keywords: ["venus", "taurus"],
      },
    ],
  },
  priya: {
    key: "priya",
    label: "Priya",
    color: PURPLE,
    inventory: [
      {
        id: "priya-saturn-venus",
        type: "conjunction",
        finding: "Saturn meets Venus in Gemini",
        founderSide: "Saturn friendly-sign",
        companySide: "Venus friendly-sign",
        classification: "green",
        reading: "Both sides are dignified by friendly-sign status; a green finding.",
        keywords: ["saturn", "venus", "gemini"],
      },
      {
        id: "priya-sun-mars",
        type: "conjunction",
        finding: "Sun meets exalted Mars in Capricorn",
        founderSide: "Sun enemy-sign",
        companySide: "Mars exalted",
        classification: "mixed",
        reading: "Priya's afflicted Sun meets the company's peak-dignity Mars.",
        keywords: ["sun", "mars", "capricorn"],
      },
      {
        id: "priya-moon-saturn",
        type: "conjunction",
        finding: "Moon meets exalted Saturn in Libra",
        founderSide: "Moon neutral",
        companySide: "Saturn exalted",
        classification: "mixed",
        reading: "Priya's neutral Moon meets the company's strongest structural significator.",
        keywords: ["moon", "saturn", "libra"],
      },
      {
        id: "priya-jupiter-sun",
        type: "conjunction",
        finding: "Jupiter meets Sun in Taurus",
        founderSide: "Jupiter enemy-sign",
        companySide: "Sun enemy-sign",
        classification: "caution",
        reading: "Genuine double affliction: neither side is dignified.",
        keywords: ["jupiter", "sun", "taurus"],
      },
    ],
  },
};

const DEFAULT_STATEMENT = `Ansh's own chart and Priya's own chart each show a different pattern of resonance with Meridian Labs's own incorporation chart. Ansh's inventory has three green findings and one mixed finding; Priya's inventory has one green finding, two mixed findings, and one caution finding (Jupiter/Sun in Taurus, a genuine double affliction). This asymmetry is a fact about two separate chart computations, not a verdict on either founder's competence, leadership, or value as a co-founder. These findings are not a substitute for the founders' own business judgement and the professional advice of a lawyer and accountant.`;

const DETERMINISM_WORDS = [
  { word: "destined", label: "determinism" },
  { word: "meant to", label: "determinism" },
  { word: "guaranteed", label: "determinism" },
  { word: "inevitable", label: "determinism" },
  { word: "greatness", label: "overclaiming" },
];

const LEADERSHIP_OVERREACH = [
  { phrase: "should lead", label: "leadership conclusion" },
  { phrase: "final calls", label: "authority claim" },
  { phrase: "final decisions", label: "authority claim" },
  { phrase: "who leads", label: "leadership conclusion" },
  { phrase: "better leader", label: "personal verdict" },
  { phrase: "worse leader", label: "personal verdict" },
  { phrase: "more suited", label: "ranking founders" },
  { phrase: "less suited", label: "ranking founders" },
  { phrase: "decision-making authority", label: "governance claim" },
  { phrase: "overrule", label: "governance claim" },
];

const REFERRAL_PHRASES = [
  "not a substitute",
  "business judgement",
  "professional advice",
  "lawyer",
  "accountant",
];

export function MultiFounderIncorporationChartIntegration() {
  const [selectedFounders, setSelectedFounders] = useState<FounderKey[]>(["ansh", "priya"]);
  const [activeTypes, setActiveTypes] = useState<RowType[]>(["overlay", "conjunction"]);
  const [activeClassifications, setActiveClassifications] = useState<IndicatorKey[]>(["green", "mixed", "caution"]);
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [auditRun, setAuditRun] = useState(false);
  const [blendedAttempted, setBlendedAttempted] = useState(false);

  const visibleFounders = useMemo(
    () => selectedFounders.map((key) => FOUNDERS[key]),
    [selectedFounders]
  );

  const filteredInventories = useMemo(() => {
    return visibleFounders.map((founder) => ({
      ...founder,
      inventory: founder.inventory.filter(
        (row) => activeTypes.includes(row.type) && activeClassifications.includes(row.classification)
      ),
    }));
  }, [visibleFounders, activeTypes, activeClassifications]);

  const countsByFounder = useMemo(() => {
    const record: Record<FounderKey, Record<IndicatorKey, number>> = {
      ansh: { green: 0, mixed: 0, caution: 0 },
      priya: { green: 0, mixed: 0, caution: 0 },
    };
    (Object.keys(FOUNDERS) as FounderKey[]).forEach((key) => {
      FOUNDERS[key].inventory.forEach((row) => {
        record[key][row.classification] += 1;
      });
    });
    return record;
  }, []);

  const audit = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    const determinism = DETERMINISM_WORDS.filter((d) => draftLower.includes(d.word));
    const leadership = LEADERSHIP_OVERREACH.filter((l) => draftLower.includes(l.phrase));
    const hasReferral = REFERRAL_PHRASES.some((p) => draftLower.includes(p.toLowerCase()));
    const hasAsymmetry = ["asymmetry", "asymmetric", "different pattern", "cleaner", "more mixed"].some((w) =>
      draftLower.includes(w)
    );
    const hasBothFounders = selectedFounders.length < 2 || (draftLower.includes("ansh") && draftLower.includes("priya"));

    const missingRows: InventoryRow[] = [];
    selectedFounders.forEach((founderKey) => {
      FOUNDERS[founderKey].inventory.forEach((row) => {
        if (!row.keywords.every((kw) => draftLower.includes(kw))) {
          missingRows.push(row);
        }
      });
    });

    const priyaSelected = selectedFounders.includes("priya");
    const missingMixedCaution =
      priyaSelected && !(draftLower.includes("mixed") && (draftLower.includes("caution") || draftLower.includes("double affliction")));

    return { determinism, leadership, hasReferral, hasAsymmetry, hasBothFounders, missingRows, missingMixedCaution };
  }, [draftStatement, selectedFounders]);

  const auditPassed =
    audit.determinism.length === 0 &&
    audit.leadership.length === 0 &&
    audit.hasReferral &&
    audit.hasAsymmetry &&
    audit.hasBothFounders &&
    audit.missingRows.length === 0 &&
    !audit.missingMixedCaution;

  const toggleFounder = (key: FounderKey) => {
    setSelectedFounders((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      return next.length === 0 ? [key] : next;
    });
    setAuditRun(false);
    setBlendedAttempted(false);
  };

  const toggleType = (type: RowType) => {
    setActiveTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const toggleClassification = (classification: IndicatorKey) => {
    setActiveClassifications((prev) =>
      prev.includes(classification) ? prev.filter((c) => c !== classification) : [...prev, classification]
    );
  };

  const reset = () => {
    setSelectedFounders(["ansh", "priya"]);
    setActiveTypes(["overlay", "conjunction"]);
    setActiveClassifications(["green", "mixed", "caution"]);
    setDraftStatement(DEFAULT_STATEMENT);
    setAuditRun(false);
    setBlendedAttempted(false);
  };

  return (
    <div data-interactive="multi-founder-incorporation-chart-integration" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Multi-founder incorporation integration</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Compare each founder&apos;s inventory side by side, never blended
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compute Ansh&apos;s and Priya&apos;s own findings independently. The no-blending guard blocks a combined score; the scope check blocks turning asymmetry into a leadership verdict.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Founder selector */}
      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
          <Users size={16} style={{ color: ACCENT }} />
          <p style={{ margin: 0, color: ACCENT, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Selected founders
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          {(Object.keys(FOUNDERS) as FounderKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={selectedFounders.includes(key)}
              onClick={() => toggleFounder(key)}
              style={smallChipStyle(selectedFounders.includes(key), FOUNDERS[key].color)}
            >
              {FOUNDERS[key].label}
            </button>
          ))}
          <span style={{ color: INK_MUTED, fontSize: "0.8rem", marginLeft: "0.5rem" }}>Multiple panels render side by side, never merged.</span>
        </div>
      </section>

      {/* Diagram + sidebar */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Resonance comparison</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Classification tally by founder
              </h3>
            </div>
          </div>
          <ClassificationTallySvg countsByFounder={countsByFounder} selectedFounders={selectedFounders} />

          <div style={{ marginTop: "0.85rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "0.75rem" }}>
            {filteredInventories.map((founder) => (
              <FounderInventoryPanel key={founder.key} founder={founder} />
            ))}
          </div>
        </section>

        {/* Sidebar */}
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

          <Panel title="Disclosed rule" icon={<Scale size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {(Object.keys(INDICATOR_COLORS) as IndicatorKey[]).map((c) => (
                <div key={c} style={{ display: "flex", alignItems: "start", gap: "0.45rem" }}>
                  <ClassificationDot classification={c} />
                  <div>
                    <span style={{ color: INDICATOR_COLORS[c], fontSize: "0.85rem", fontWeight: 600 }}>{INDICATOR_LABELS[c]}</span>
                    <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45 }}>{INDICATOR_DESCRIPTIONS[c]}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="No-blending guardrail" icon={<Combine size={18} />} color={VERMILION}>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
              The tool never produces a single founder-fit score. Try the button below to see why.
            </p>
            <button
              type="button"
              onClick={() => setBlendedAttempted(true)}
              style={{ ...buttonStyle(false, VERMILION), marginTop: "0.55rem", width: "100%", justifyContent: "center" }}
            >
              Try compute combined score
            </button>
            {blendedAttempted && (
              <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, background: VERMILION_TINT, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "0.45rem" }}>
                  <ShieldAlert size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                  <span>Blending two founders into one score hides the asymmetry this lesson exists to protect.</span>
                </div>
              </div>
            )}
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
                Report asymmetry, not a verdict
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
              <p style={eyebrowStyle}>Statement checks</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Determinism, completeness, scope
              </h3>
            </div>
            <button type="button" onClick={() => setAuditRun(true)} style={buttonStyle(false, GREEN)}>
              <ShieldCheck size={15} aria-hidden="true" />
              Check
            </button>
          </div>

          {!auditRun && (
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              The checks enforce: no destiny-language, every selected founder&apos;s findings represented, the mixed/caution rows named, and no leadership conclusion drawn from asymmetry.
            </p>
          )}

          {auditRun && (
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {auditPassed ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: GREEN_TINT, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Statement passes: no determinism, no leadership overreach, all findings represented, referral included.</span>
                  </div>
                </div>
              ) : (
                <>
                  {audit.determinism.map((d) => (
                    <AuditIssue key={d.word}>
                      &quot;{d.word}&quot; &mdash; {d.label}. Replace with descriptive language.
                    </AuditIssue>
                  ))}
                  {audit.leadership.map((l) => (
                    <AuditIssue key={l.phrase}>
                      &quot;{l.phrase}&quot; &mdash; {l.label}. Chart resonance cannot decide governance or leadership.
                    </AuditIssue>
                  ))}
                  {audit.missingRows.map((row) => (
                    <AuditIssue key={row.id}>Missing finding: {row.finding}</AuditIssue>
                  ))}
                  {audit.missingMixedCaution && <AuditIssue>Priya&apos;s mixed and caution findings must both be named.</AuditIssue>}
                  {!audit.hasAsymmetry && selectedFounders.length > 1 && <AuditIssue>Name the asymmetry between the two founders&apos; inventories.</AuditIssue>}
                  {!audit.hasBothFounders && selectedFounders.length > 1 && <AuditIssue>Both founders must be named in the statement.</AuditIssue>}
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

function FounderInventoryPanel({ founder }: { founder: FounderProfile }) {
  return (
    <div style={{ border: `1px solid ${founder.color}`, borderRadius: 8, background: tintForColor(founder.color), padding: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: founder.color }} />
        <h4 style={{ margin: 0, color: founder.color, fontSize: "1rem", fontWeight: 600 }}>{founder.label}&apos;s inventory</h4>
        <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>({founder.inventory.length})</span>
      </div>
      <div style={{ display: "grid", gap: "0.45rem" }}>
        {founder.inventory.map((row) => (
          <div key={row.id} style={{ padding: "0.55rem", borderRadius: 6, background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start" }}>
              <span style={{ color: INK_PRIMARY, fontSize: "0.85rem", fontWeight: 500 }}>{row.finding}</span>
              <ClassificationBadge classification={row.classification} />
            </div>
            <div style={{ marginTop: "0.25rem", color: INK_SECONDARY, fontSize: "0.78rem" }}>
              {row.founderSide} &middot; {row.companySide}
            </div>
            <div style={{ marginTop: "0.15rem", color: INK_SECONDARY, fontSize: "0.78rem" }}>{row.reading}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassificationBadge({ classification }: { classification: IndicatorKey }) {
  const color = INDICATOR_COLORS[classification];
  return (
    <span style={{ padding: "0.12rem 0.45rem", borderRadius: 999, background: tintForColor(color), color, fontSize: "0.7rem", fontWeight: 600, border: `1px solid ${color}` }}>
      {INDICATOR_LABELS[classification]}
    </span>
  );
}

function ClassificationDot({ classification }: { classification: IndicatorKey }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: INDICATOR_COLORS[classification],
        color: "#fff",
        fontSize: "0.7rem",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {classification === "green" ? "G" : classification === "mixed" ? "M" : "C"}
    </span>
  );
}

function ClassificationTallySvg({
  countsByFounder,
  selectedFounders,
}: {
  countsByFounder: Record<FounderKey, Record<IndicatorKey, number>>;
  selectedFounders: FounderKey[];
}) {
  const maxCount = 4;
  const barWidth = 34;
  const barGap = 6;
  const groupGap = 80;
  const chartHeight = 140;
  const baseY = 170;
  const startX = 80;

  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="Classification tally comparing Ansh and Priya" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0", display: "block" }}>
      <rect x="24" y="24" width="512" height="172" rx="8" fill={GOLD_TINT} stroke={HAIRLINE} />
      <text x="280" y="50" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight={600}>
        Green / Mixed / Caution counts
      </text>

      {selectedFounders.map((founderKey, groupIndex) => {
        const founder = FOUNDERS[founderKey];
        const groupX = startX + groupIndex * (groupGap + 3 * (barWidth + barGap));
        return (
          <g key={founderKey}>
            <text x={groupX + 45} y={baseY + 28} textAnchor="middle" fill={founder.color} fontSize="13" fontWeight={600}>
              {founder.label}
            </text>
            {(Object.keys(INDICATOR_COLORS) as IndicatorKey[]).map((indicator, index) => {
              const count = countsByFounder[founderKey][indicator];
              const height = (count / maxCount) * chartHeight;
              const x = groupX + index * (barWidth + barGap);
              const y = baseY - height;
              return (
                <g key={indicator}>
                  <rect x={x} y={y} width={barWidth} height={height} rx={4} fill={count === 0 ? tintForColor(INDICATOR_COLORS[indicator]) : INDICATOR_COLORS[indicator]} stroke={INDICATOR_COLORS[indicator]} strokeWidth={1} />
                  <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill={count === 0 ? INK_MUTED : INK_PRIMARY} fontSize="12" fontWeight={600}>
                    {count}
                  </text>
                  <text x={x + barWidth / 2} y={baseY + 14} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>
                    {INDICATOR_LABELS[indicator][0]}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
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

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
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
  if (color === PURPLE) return PURPLE_TINT;
  return SURFACE;
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
