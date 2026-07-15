"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  Lock,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TierKey = "A" | "C";
type ConfidenceKey = "strong" | "moderate-strong" | "moderate" | "weak-moderate";

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

const CONFIDENCE_COLORS: Record<ConfidenceKey, string> = {
  strong: GREEN,
  "moderate-strong": `${GREEN}88`,
  moderate: GOLD,
  "weak-moderate": VERMILION,
};

const CONFIDENCE_LABELS: Record<ConfidenceKey, string> = {
  strong: "Strong",
  "moderate-strong": "Moderate-Strong",
  moderate: "Moderate",
  "weak-moderate": "Weak-Moderate",
};

interface FindingRow {
  id: string;
  technique: string;
  finding: string;
  confidence: ConfidenceKey;
}

const ANSH_BHAVNA_INVENTORY: FindingRow[] = [
  { id: "comp-h11", technique: "Composite", finding: "Sun-Moon-Venus in H11", confidence: "moderate" },
  { id: "comp-h7", technique: "Composite", finding: "Jupiter-Saturn in H7, both dignified", confidence: "moderate" },
  { id: "h1-exchange", technique: "House overlay", finding: "Reciprocal Moon/Mercury on H1", confidence: "moderate-strong" },
  { id: "h6-exchange", technique: "House overlay", finding: "Reciprocal Jupiter-on-H6, mixed", confidence: "weak-moderate" },
  { id: "mars-saturn", technique: "Cross-aspect", finding: "Mutual own-sign Saturn-Mars special aspect", confidence: "strong" },
  { id: "mars-venus", technique: "Cross-aspect", finding: "Mutual asymmetric-dignity Mars-Venus", confidence: "weak-moderate" },
  { id: "ul-exchange", technique: "Jaimini", finding: "Double Upapada Lagna exchange", confidence: "strong" },
  { id: "darakaraka", technique: "Jaimini", finding: "Both Dārākārakas own-sign dignified", confidence: "strong" },
  { id: "kp-enmity", technique: "KP", finding: "One-directional Moon-sub-lord enmity", confidence: "weak-moderate" },
];

const TIER_A_STATEMENT = `With both of you present and this consultation's own subject — Tier A, both consenting — here is what your two charts show together. The strongest axis is the Mars-Saturn connection, corroborated three independent ways: a mutual own-sign special aspect in Parāśarī terms, a double Upapada Lagna exchange in Jaimini terms, and both Dārākārakas standing in own-sign dignity. That convergence earns Strong confidence. A second, real but distinct pattern bundles Moon and Venus — composite H11 and a direct cross-chart same-sign exchange — which is thematic convergence, not mechanical, and is named as such. Alongside these, three findings are honestly mixed: the reciprocal Jupiter-on-H6 overlay, the asymmetric Mars-Venus cross-aspect, and the one-directional KP sub-lord enmity. Nothing here is a verdict on either partner's worth; it is a description of chart-level resonance only, not a substitute for the communication, commitment, and practical judgement that make a marriage work.`;

const TIER_C_STATEMENT = `Based on what you've shared about the relationship and the general astrological principles for this kind of question, here is the tendency-level picture: this question involves the interplay of identity, emotional responsiveness, and structural discipline between two charts, and the general pattern language suggests both resonant and friction-bearing themes are possible. Because your partner's own consent hasn't yet been established, this is as far as a responsible reading goes today. I'd recommend the two of you discuss the consultation together, after which a fuller joint reading becomes available.`;

export function MarriageQuestionConsentSynthesisWorkbench() {
  const [tier, setTier] = useState<TierKey>("A");
  const [blockedAttempt, setBlockedAttempt] = useState(false);

  const reset = () => {
    setTier("A");
    setBlockedAttempt(false);
  };

  return (
    <div data-interactive="marriage-question-consent-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Marriage-question synthesis with consent framing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Same technique, different consent, different depth
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare the full Ansh-Bhavna Tier A synthesis with a Tier C illustrative scenario. The mechanical technique does not change; only the reporting depth changes.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Tier selector */}
      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
          <ShieldCheck size={16} style={{ color: ACCENT }} />
          <p style={{ margin: 0, color: ACCENT, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Consent tier</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button type="button" aria-pressed={tier === "A"} onClick={() => { setTier("A"); setBlockedAttempt(false); }} style={toggleRowStyle(tier === "A", GREEN)}>
            <Unlock size={16} aria-hidden="true" />
            <span>Tier A — Ansh &amp; Bhavna, both present and consenting</span>
          </button>
          <button type="button" aria-pressed={tier === "C"} onClick={() => { setTier("C"); setBlockedAttempt(false); }} style={toggleRowStyle(tier === "C", VERMILION)}>
            <Lock size={16} aria-hidden="true" />
            <span>Tier C — partner does not yet know about the consultation</span>
          </button>
        </div>
      </section>

      {/* Main content */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>{tier === "A" ? "Tier A inventory" : "Tier C scope"}</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tier === "A" ? GREEN : VERMILION, fontSize: "1.2rem" }}>
                {tier === "A" ? "Ansh and Bhavna — full assembled findings" : "Illustrative scenario — tendency level only"}
              </h3>
            </div>
          </div>

          {tier === "A" ? (
            <>
              <DepthComparisonSvg tier={tier} />
              <div style={{ marginTop: "0.75rem", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                      <th style={tableHeaderStyle}>Technique</th>
                      <th style={tableHeaderStyle}>Finding</th>
                      <th style={tableHeaderStyle}>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ANSH_BHAVNA_INVENTORY.map((row) => (
                      <tr key={row.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                        <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.technique}</td>
                        <td style={{ padding: "0.45rem", color: INK_PRIMARY, fontWeight: 500 }}>{row.finding}</td>
                        <td style={{ padding: "0.45rem" }}>
                          <ConfidenceBadge confidence={row.confidence} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <DepthComparisonSvg tier={tier} />
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}08`, border: `1px solid ${VERMILION}` }}>
                <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  <Lock size={18} style={{ color: VERMILION, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, color: VERMILION, fontWeight: 600, fontSize: "0.9rem" }}>Tier C field lock</p>
                    <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                      Specific houses, signs, degrees, and dignities for the absent partner are not reported. The statement stays at general compatibility-tendency level.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBlockedAttempt(true)}
                style={{ ...buttonStyle(false, VERMILION), marginTop: "0.55rem" }}
              >
                Try to add a degree-specific claim
              </button>
              {blockedAttempt && (
                <div style={{ marginTop: "0.55rem", padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Blocked: Tier C does not support degree-specific claims about a non-consenting subject.</span>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Sidebar */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Synthesis statement" icon={<MessageSquareText size={18} />} color={tier === "A" ? GREEN : VERMILION}>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.6 }}>
              {tier === "A" ? TIER_A_STATEMENT : TIER_C_STATEMENT}
            </p>
          </Panel>

          <Panel title="What changes, what does not" icon={<BookOpen size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              <div style={{ padding: "0.5rem", borderRadius: 6, background: `${GREEN}08`, border: `1px solid ${GREEN}` }}>
                <span style={{ color: GREEN, fontWeight: 600, fontSize: "0.85rem" }}>Does not change</span>
                <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>The mechanical technique: composite, house-overlay, Jaimini, and KP thinking all proceed the same way.</p>
              </div>
              <div style={{ padding: "0.5rem", borderRadius: 6, background: `${VERMILION}08`, border: `1px solid ${VERMILION}` }}>
                <span style={{ color: VERMILION, fontWeight: 600, fontSize: "0.85rem" }}>Changes</span>
                <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>Reporting depth. Tier C stays at tendency level; no specific houses, signs, or degrees for the absent partner.</p>
              </div>
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}

function DepthComparisonSvg({ tier }: { tier: TierKey }) {
  const deepColor = tier === "A" ? GREEN : `${INK_MUTED}55`;
  const shallowColor = tier === "C" ? VERMILION : `${INK_MUTED}55`;

  return (
    <svg viewBox="0 0 560 140" role="img" aria-label={`Consent tier ${tier} reading depth`} style={{ width: "100%", maxHeight: 220, margin: "0.4rem auto 0.75rem", display: "block" }}>
      <rect x="12" y="12" width="536" height="116" rx="8" fill={`${ACCENT}08`} stroke={HAIRLINE} />
      <text x="280" y="34" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>
        Reporting depth by tier
      </text>

      {/* Tier A funnel */}
      <polygon points="80,50 180,50 160,110 100,110" fill={`${GREEN}10`} stroke={deepColor} strokeWidth="2" />
      <text x="130" y="80" textAnchor="middle" fill={deepColor} fontSize="11" fontWeight={600}>Tier A</text>
      <text x="130" y="126" textAnchor="middle" fill={tier === "A" ? GREEN : INK_MUTED} fontSize="10" fontWeight={600}>specific houses / signs / degrees</text>

      {/* Tier C funnel */}
      <polygon points="380,70 480,70 460,110 400,110" fill={`${VERMILION}10`} stroke={shallowColor} strokeWidth="2" />
      <text x="430" y="90" textAnchor="middle" fill={shallowColor} fontSize="11" fontWeight={600}>Tier C</text>
      <text x="430" y="126" textAnchor="middle" fill={tier === "C" ? VERMILION : INK_MUTED} fontSize="10" fontWeight={600}>tendency-level pattern only</text>

      {/* Equality note */}
      <text x="280" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>same technique, same quality, different scope</text>
    </svg>
  );
}

function ConfidenceBadge({ confidence }: { confidence: ConfidenceKey }) {
  const color = CONFIDENCE_COLORS[confidence];
  return (
    <span style={{ padding: "0.12rem 0.45rem", borderRadius: 999, background: `${color}12`, color, fontSize: "0.7rem", fontWeight: 600, border: `1px solid ${color}` }}>
      {CONFIDENCE_LABELS[confidence]}
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

function toggleRowStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}10` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
