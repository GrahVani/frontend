"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  Eye,
  EyeOff,
  GitMerge,
  Layers,
  RotateCcw,
  ShieldCheck,
  Square,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type RegisterKey = "ansh-5th" | "bhavna-5th" | "chandra-9th" | "chandra-4th";
type ToneKey = "favourable" | "complex" | "clean";

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

const TONE_COLORS: Record<ToneKey, string> = {
  favourable: BLUE,
  complex: GOLD,
  clean: GREEN,
};

interface RegisterRow {
  key: RegisterKey;
  person: string;
  register: string;
  sourceLesson: string;
  finding: string;
  pointOfContact: string;
  tier: "Moderate";
  tone: ToneKey;
  grahas: string[];
  sentence: string;
}

const INVENTORY: RegisterRow[] = [
  {
    key: "ansh-5th",
    person: "Ansh",
    register: "Parent-side: own relationship to children",
    sourceLesson: "14.3.1",
    finding: "Own-sign Saturn in his own 5th house",
    pointOfContact: "Matches Chandra's own Lagna (Aquarius)",
    tier: "Moderate",
    tone: "favourable",
    grahas: ["Saturn"],
    sentence: "Ansh's own dignified Saturn in his own 5th house lands on Chandra's own Lagna sign.",
  },
  {
    key: "bhavna-5th",
    person: "Bhavna",
    register: "Parent-side: own relationship to children",
    sourceLesson: "14.3.1",
    finding: "Own-sign Mars in her own 5th house",
    pointOfContact: "Matches Chandra's own Mercury sign (Scorpio)",
    tier: "Moderate",
    tone: "favourable",
    grahas: ["Mars"],
    sentence: "Bhavna's own dignified Mars in her own 5th house lands on Chandra's own Mercury sign.",
  },
  {
    key: "chandra-9th",
    person: "Chandra",
    register: "Paternal register: 9th from child",
    sourceLesson: "14.3.2",
    finding: "Debilitated Sun in his own 9th house, doubly neecha-bhaṅga-redeemed",
    pointOfContact: "Matches Ansh's own Lagna (Libra)",
    tier: "Moderate",
    tone: "complex",
    grahas: ["Sun"],
    sentence: "Chandra's own paternal register carries a debilitated Sun in the 9th, structurally redeemed by two classical cancellation conditions, landing on Ansh's own Lagna sign.",
  },
  {
    key: "chandra-4th",
    person: "Chandra",
    register: "Maternal register: 4th from child",
    sourceLesson: "14.3.3",
    finding: "Own-sign Venus in his own 4th house",
    pointOfContact: "Matches Bhavna's own exalted Moon (Taurus)",
    tier: "Moderate",
    tone: "clean",
    grahas: ["Venus", "Moon"],
    sentence: "Chandra's own maternal register is clean: own-sign Venus in the 4th meets Bhavna's own exalted Moon at the same sign.",
  },
];

const DEFAULT_STATEMENT = `Across four independently-computed registers, this family's charts show a consistent, though not uniform, pattern of engagement. Both parents show dignified, own-sign placements in their own 5th houses. Chandra's own chart shows an honestly mixed paternal register and a comparatively clean maternal register. All four findings are Moderate-tier individually; their combined number broadens the picture rather than deepening any one claim.`;

const FORBIDDEN_WORDS = [
  { word: "guaranteed", label: "determinism" },
  { word: "destined", label: "determinism" },
  { word: "exceptionally strong", label: "tier inflation" },
  { word: "strong", label: "tier inflation" },
  { word: "proves", label: "overclaiming" },
  { word: "certain", label: "determinism" },
];

export function ParentChildRegisterMapper() {
  const [includedKeys, setIncludedKeys] = useState<Set<RegisterKey>>(new Set(INVENTORY.map((r) => r.key)));
  const [showTiers, setShowTiers] = useState(true);
  const [selectedForStack, setSelectedForStack] = useState<Set<RegisterKey>>(new Set());
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [stackWarning, setStackWarning] = useState<string | null>(null);
  const [auditRun, setAuditRun] = useState(false);

  const includedRows = useMemo(
    () => INVENTORY.filter((row) => includedKeys.has(row.key)),
    [includedKeys]
  );

  const toggleIncluded = (key: RegisterKey) => {
    setIncludedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setAuditRun(false);
  };

  const toggleStackSelection = (key: RegisterKey) => {
    setSelectedForStack((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setStackWarning(null);
  };

  const resetAll = () => {
    setIncludedKeys(new Set(INVENTORY.map((r) => r.key)));
    setShowTiers(true);
    setSelectedForStack(new Set());
    setDraftStatement(DEFAULT_STATEMENT);
    setStackWarning(null);
    setAuditRun(false);
  };

  const composeStatement = () => {
    if (includedRows.length === 0) {
      setDraftStatement("");
      return;
    }
    const parts = includedRows.map((row) => row.sentence);
    const joined = parts.join(" ");
    const close = includedRows.length === INVENTORY.length
      ? " All four findings are Moderate-tier individually; their combined number broadens the picture rather than deepening any one claim."
      : " These selected registers are each Moderate-tier; register-breadth is not evidentiary depth.";
    setDraftStatement(`${joined}${close}`);
    setAuditRun(false);
  };

  const attemptStack = () => {
    if (selectedForStack.size < 2) {
      setStackWarning("Select at least two registers before attempting to combine them into a higher tier.");
      return;
    }
    const selectedRows = INVENTORY.filter((row) => selectedForStack.has(row.key));
    const registers = selectedRows.map((r) => r.register);
    const allDifferent = new Set(registers).size === selectedRows.length;
    if (allDifferent) {
      setStackWarning(
        "Blocked: these registers answer different questions (parent-side, paternal, maternal). Combining different-register findings into one inflated tier mistakes register-breadth for evidentiary depth. Strong tier requires multiple independent techniques on the same claim."
      );
    } else {
      setStackWarning(
        "Blocked: even similar registers rest on a single technique plus one point of contact. That reaches Moderate tier, not Strong."
      );
    }
  };

  const audit = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    const missing = includedRows.filter((row) => !draftLower.includes(row.finding.toLowerCase().slice(0, 35)));
    const forbidden = FORBIDDEN_WORDS.filter((fw) => draftLower.includes(fw.word));
    const paternalSelected = includedKeys.has("chandra-9th");
    const paternalMentioned = draftLower.includes("paternal") || draftLower.includes("sun") || draftLower.includes("neecha");
    const omittedComplexity = paternalSelected && !paternalMentioned;
    return { missing, forbidden, omittedComplexity };
  }, [draftStatement, includedKeys, includedRows]);

  const auditHasIssues = audit.missing.length > 0 || audit.forbidden.length > 0 || audit.omittedComplexity;

  return (
    <div data-interactive="parent-child-register-mapper" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Parent-child register mapper</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Assemble four registers into one honest, audited reading
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Inventory-first, narrative-second. This tool blocks the register-breadth-as-depth error: four Moderate findings about four different questions do not add up to one Strong finding.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAll}
            style={buttonStyle(false, ACCENT)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Family diagram + inventory */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Four-register inventory</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Ansh + Bhavna + Chandra
              </h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowTiers((v) => !v)}
                style={buttonStyle(false, INK_MUTED)}
                aria-pressed={showTiers}
              >
                {showTiers ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
                {showTiers ? "Hide tiers" : "Show tiers"}
              </button>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block" style={{ marginTop: "0.75rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                  <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Include</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Register</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Finding</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</th>
                  {showTiers && (
                    <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tier</th>
                  )}
                  <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Stack</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY.map((row) => {
                  const included = includedKeys.has(row.key);
                  return (
                    <tr
                      key={row.key}
                      style={{
                        borderBottom: `1px solid ${HAIRLINE}`,
                        opacity: included ? 1 : 0.45,
                        background: selectedForStack.has(row.key) ? `${TONE_COLORS[row.tone]}08` : "transparent",
                      }}
                    >
                      <td style={{ padding: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => toggleIncluded(row.key)}
                          aria-pressed={included}
                          style={iconButtonStyle(included, TONE_COLORS[row.tone])}
                        >
                          {included ? <BadgeCheck size={16} aria-hidden="true" /> : <Square size={16} aria-hidden="true" />}
                        </button>
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        <div style={{ fontWeight: 600, color: INK_PRIMARY }}>{row.register}</div>
                        <div style={{ fontSize: "0.8rem", color: INK_MUTED }}>Lesson {row.sourceLesson} • {row.person}</div>
                      </td>
                      <td style={{ padding: "0.5rem", color: INK_SECONDARY }}>{row.finding}</td>
                      <td style={{ padding: "0.5rem", color: INK_SECONDARY }}>{row.pointOfContact}</td>
                      {showTiers && (
                        <td style={{ padding: "0.5rem" }}>
                          <TierBadge tier={row.tier} />
                        </td>
                      )}
                      <td style={{ padding: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => toggleStackSelection(row.key)}
                          aria-pressed={selectedForStack.has(row.key)}
                          disabled={!included}
                          style={smallChipStyle(selectedForStack.has(row.key), TONE_COLORS[row.tone], !included)}
                        >
                          {selectedForStack.has(row.key) ? "Selected" : "Select"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card stack */}
          <div className="md:hidden" style={{ marginTop: "0.75rem", display: "grid", gap: "0.65rem" }}>
            {INVENTORY.map((row) => {
              const included = includedKeys.has(row.key);
              return (
                <div
                  key={row.key}
                  style={{
                    border: `1px solid ${selectedForStack.has(row.key) ? TONE_COLORS[row.tone] : HAIRLINE}`,
                    borderRadius: 8,
                    padding: "0.75rem",
                    background: included ? (selectedForStack.has(row.key) ? `${TONE_COLORS[row.tone]}08` : SURFACE) : `${SURFACE}80`,
                    opacity: included ? 1 : 0.5,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.5rem" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: INK_PRIMARY }}>{row.register}</div>
                      <div style={{ fontSize: "0.8rem", color: INK_MUTED }}>Lesson {row.sourceLesson} • {row.person}</div>
                    </div>
                    {showTiers && <TierBadge tier={row.tier} />}
                  </div>
                  <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>{row.finding}</p>
                  <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>{row.pointOfContact}</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.65rem" }}>
                    <button
                      type="button"
                      onClick={() => toggleIncluded(row.key)}
                      style={smallChipStyle(included, TONE_COLORS[row.tone])}
                    >
                      {included ? "Included" : "Include"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStackSelection(row.key)}
                      disabled={!included}
                      style={smallChipStyle(selectedForStack.has(row.key), TONE_COLORS[row.tone], !included)}
                    >
                      {selectedForStack.has(row.key) ? "Selected" : "Select for stack"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sidebar: controls + diagram */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Family register map" icon={<Users size={18} />} color={ACCENT}>
            <FamilyRegisterSvg />
            <p style={bodyTextStyle}>
              Each arrow is a different register. Breadth across four registers is not depth for any single claim.
            </p>
          </Panel>

          <Panel title="Stacking guardrail" icon={<GitMerge size={18} />} color={selectedForStack.size >= 2 ? VERMILION : INK_MUTED}>
            <p style={bodyTextStyle}>
              Try to &quot;boost&quot; a tier by combining registers. The tool blocks the register-breadth-as-depth error.
            </p>
            <button
              type="button"
              onClick={attemptStack}
              disabled={selectedForStack.size < 2}
              style={{ ...buttonStyle(true, VERMILION), width: "100%", marginTop: "0.65rem", opacity: selectedForStack.size < 2 ? 0.5 : 1 }}
            >
              <Ban size={15} aria-hidden="true" />
              Attempt to boost tier
            </button>
            {stackWarning && (
              <div role="alert" style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  <AlertTriangle size={16} aria-hidden="true" style={{ marginTop: "0.15rem", flexShrink: 0 }} />
                  <span>{stackWarning}</span>
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
                Compose from the inventory
              </h3>
            </div>
            <button
              type="button"
              onClick={composeStatement}
              style={buttonStyle(false, BLUE)}
            >
              <Layers size={15} aria-hidden="true" />
              Compose from rows
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
          <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>
            Edit directly, or use &quot;Compose from rows&quot; to rebuild from the included registers.
          </p>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Inventory audit</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Check the statement against the rows
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setAuditRun(true)}
              style={buttonStyle(false, GREEN)}
            >
              <ShieldCheck size={15} aria-hidden="true" />
              Run audit
            </button>
          </div>

          {!auditRun && (
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              The audit checks that every included register appears in the draft, that no forbidden overclaiming words are used, and that Chandra&apos;s paternal complexity is not hidden.
            </p>
          )}

          {auditRun && (
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.65rem" }}>
              {!auditHasIssues ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Audit passed: every included register is represented, no overclaiming language detected, and complexity is not hidden.</span>
                  </div>
                </div>
              ) : (
                <>
                  {audit.missing.length > 0 && (
                    <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.9rem" }}>
                      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                        <AlertTriangle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontWeight: 700 }}>Missing from statement:</strong>
                          <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.1rem" }}>
                            {audit.missing.map((row) => (
                              <li key={row.key}>{row.register} — {row.finding}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {audit.forbidden.length > 0 && (
                    <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.9rem" }}>
                      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                        <AlertTriangle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontWeight: 700 }}>Overclaiming language detected:</strong>
                          <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.1rem" }}>
                            {audit.forbidden.map((fw) => (
                              <li key={fw.word}>&quot;{fw.word}&quot; — {fw.label}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {audit.omittedComplexity && (
                    <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GOLD}10`, border: `1px solid ${GOLD}`, color: GOLD, fontSize: "0.9rem" }}>
                      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                        <AlertTriangle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                        <span>Chandra&apos;s paternal register is included but not clearly named in the statement. Do not smooth over honest complexity.</span>
                      </div>
                    </div>
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

function TierBadge({ tier }: { tier: "Moderate" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.55rem",
        borderRadius: 999,
        background: `${ACCENT}15`,
        color: ACCENT,
        fontSize: "0.75rem",
        fontWeight: 600,
        border: `1px solid ${ACCENT}`,
      }}
    >
      {tier}
    </span>
  );
}

function FamilyRegisterSvg() {
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "auto", maxWidth: 320 }}>
      {/* Background panel */}
      <rect x="10" y="10" width="300" height="180" rx="8" fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />

      {/* Ansh */}
      <g transform="translate(70, 50)">
        <circle r="22" fill={`${BLUE}15`} stroke={BLUE} strokeWidth={2} />
        <text textAnchor="middle" dy="0.35em" fontSize="13" fontWeight={600} fill={INK_PRIMARY}>Ansh</text>
        <text textAnchor="middle" y="34" fontSize="9" fill={INK_MUTED}>Saturn H5</text>
      </g>

      {/* Bhavna */}
      <g transform="translate(250, 50)">
        <circle r="22" fill={`${BLUE}15`} stroke={BLUE} strokeWidth={2} />
        <text textAnchor="middle" dy="0.35em" fontSize="13" fontWeight={600} fill={INK_PRIMARY}>Bhavna</text>
        <text textAnchor="middle" y="34" fontSize="9" fill={INK_MUTED}>Mars H5</text>
      </g>

      {/* Chandra */}
      <g transform="translate(160, 140)">
        <circle r="26" fill={`${GREEN}10`} stroke={GREEN} strokeWidth={2} />
        <text textAnchor="middle" dy="0.35em" fontSize="13" fontWeight={600} fill={INK_PRIMARY}>Chandra</text>
        <text textAnchor="middle" y="38" fontSize="9" fill={INK_MUTED}>Sun H9 • Venus H4</text>
      </g>

      {/* Arrows */}
      <g strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrowhead)">
        <line x1="86" y1="75" x2="142" y2="120" stroke={BLUE} strokeWidth={2} />
        <line x1="234" y1="75" x2="178" y2="120" stroke={BLUE} strokeWidth={2} />
        <line x1="150" y1="120" x2="92" y2="70" stroke={GOLD} strokeWidth={2} strokeDasharray="4 3" />
        <line x1="170" y1="120" x2="242" y2="70" stroke={GREEN} strokeWidth={2} strokeDasharray="4 3" />
      </g>

      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={INK_MUTED} />
        </marker>
      </defs>

      {/* Legend */}
      <g transform="translate(20, 165)">
        <circle r="4" fill={BLUE} />
        <text x="10" y="1" fontSize="9" fill={INK_SECONDARY}>Parent-side 5th</text>
        <circle cx="90" r="4" fill={GOLD} />
        <text x="100" y="1" fontSize="9" fill={INK_SECONDARY}>Paternal 9th</text>
        <circle cx="170" r="4" fill={GREEN} />
        <text x="180" y="1" fontSize="9" fill={INK_SECONDARY}>Maternal 4th</text>
      </g>
    </svg>
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

function smallChipStyle(active: boolean, color: string, disabled?: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.35rem 0.65rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: disabled ? INK_MUTED : active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };
}

function iconButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_MUTED,
    cursor: "pointer",
  };
}
