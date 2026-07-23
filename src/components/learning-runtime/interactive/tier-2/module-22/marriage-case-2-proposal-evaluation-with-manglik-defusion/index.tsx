"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Unlock,
  Users,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt_compare" | "cancellation_synthesis" | "no_veto_ethics";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const CARD_STYLE: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "0.75rem",
  padding: "1.25rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const EYEBROW_STYLE: CSSProperties = {
  fontSize: "0.725rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: INK_MUTED,
  margin: 0,
};

function ProposalEvaluationManglikDefusionSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Proposal Evaluation with Manglik Defusion Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Raw Flag Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#FFF3E0" stroke={VERMILION} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">RAW FLAG (§4.1)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Kavya (Aries Lagna)</text>
        <text x="90" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Mars in 7th House (Libra)</text>
        <text x="90" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Raw Kuja Doṣa Present</text>
        <text x="90" y="96" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="500">Family Alarm Raised</text>
        <text x="90" y="117" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">Doṣa Flag Exists</text>
      </g>

      {/* Arrow */}
      <path d="M 210 90 L 230 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Cancellations Box */}
      <g transform="translate(230, 25)">
        <rect x="0" y="0" width="220" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.5" />
        <text x="110" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">MANGLIK BHAṄGA (§6.1)</text>
        <text x="110" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Classical Defusion</text>
        <text x="110" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Jupiter 9th Aspect on 7th/Mars</text>
        <text x="110" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Partner is Also Manglik (Mutual)</text>
        <text x="110" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Venus Own Sign in 2nd (Taurus)</text>
        <text x="110" y="117" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Classically Mitigated</text>
      </g>

      {/* Arrow */}
      <path d="M 455 90 L 475 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Ethical Verdict Box */}
      <g transform="translate(475, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#EBF3FA" stroke={BLUE} strokeWidth="2" />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">NO VETO DOCTRINE (§6.2)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Match Favourable</text>
        <text x="90" y="64" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">✓ Do NOT Veto on Raw Flag</text>
        <text x="90" y="84" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">✓ KP 2-7-11 Fructification</text>
        <text x="90" y="110" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="500">Defuse fear with rigour</text>
      </g>
    </svg>
  );
}

export function ProposalEvaluationManglikDefusionWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt_compare");
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Student Attempt State
  const [studentPresence, setStudentPresence] = useState("");
  const [studentCancellation, setStudentCancellation] = useState("");
  const [studentSynthesis, setStudentSynthesis] = useState("");

  const resetAll = () => {
    setActiveView("attempt_compare");
    setIsUnsealed(false);
    setStudentPresence("");
    setStudentCancellation("");
    setStudentSynthesis("");
  };

  return (
    <div data-interactive="marriage-case-2-proposal-evaluation-with-manglik-defusion" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Chapter 2 Case 2 Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Marriage Case 2: Proposal Evaluation with Manglik Defusion (Attempt-Then-Compare)
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating Kavya’s proposal — acknowledging the raw Manglik flag, applying classical cancellations (Jupiter aspect & mutual status), and refusing to veto a good match on fear.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAll}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "0.5rem",
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              color: GOLD,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset Workbench
          </button>
        </div>
      </section>

      {/* Vector Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Proposal Evaluation & Manglik Defusion Architecture (§4.1–§6.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Raw flag presence, classical cancellation rules, fuller marriage synthesis, and no-veto doctrine</span>
        </div>
        <ProposalEvaluationManglikDefusionSvg activeView={activeView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("attempt_compare")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "attempt_compare" ? GOLD : HAIRLINE}`,
                background: activeView === "attempt_compare" ? "#FDFAF2" : "transparent",
                color: activeView === "attempt_compare" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Sealed Attempt Protocol
            </button>
            <button
              type="button"
              onClick={() => setActiveView("cancellation_synthesis")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "cancellation_synthesis" ? GREEN : HAIRLINE}`,
                background: activeView === "cancellation_synthesis" ? "#E8F5E9" : "transparent",
                color: activeView === "cancellation_synthesis" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Cancellations & Synthesis
            </button>
            <button
              type="button"
              onClick={() => setActiveView("no_veto_ethics")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "no_veto_ethics" ? BLUE : HAIRLINE}`,
                background: activeView === "no_veto_ethics" ? "#EBF3FA" : "transparent",
                color: activeView === "no_veto_ethics" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. No-Veto Rule & Ethical Defusion
            </button>
          </div>

          {/* View 1: Attempt-Then-Compare Protocol */}
          {activeView === "attempt_compare" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {!isUnsealed ? (
                <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.5rem" }}>
                    <Lock size={18} />
                    <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Sealed Attempt Workspace (§4.3)</strong>
                  </div>
                  <p style={{ margin: "0 0 0.8rem", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                    Record your own proposal findings for Kavya’s chart before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. Raw Doṣa Presence (Mars in 7th from Lagna):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Raw Manglik flag present from Lagna (Mars in 7th Libra)"
                        value={studentPresence}
                        onChange={(e) => setStudentPresence(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. Classical Cancellations (Jupiter aspect, Mutual status):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cancelled by Jupiter 9th aspect on 7th/Mars + partner is also Manglik"
                        value={studentCancellation}
                        onChange={(e) => setStudentCancellation(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        3. Fuller Synthesis & Verdict (No Veto on Raw Flag):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Favourable match - Venus in 2nd own sign, D9 clear, KP 2-7-11 yes. Do NOT veto."
                        value={studentSynthesis}
                        onChange={(e) => setStudentSynthesis(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsUnsealed(true)}
                    style={{
                      marginTop: "1rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: GREEN,
                      color: "#FFF",
                      border: "none",
                      borderRadius: "0.4rem",
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Unlock size={16} />
                    Unseal & Compare Solution
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                      <CheckCircle2 size={18} />
                      <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Solution Side-by-Side Comparison (§6.1)</strong>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${HAIRLINE}` }}>
                        <strong style={{ color: GOLD, display: "block", marginBottom: "0.2rem" }}>Your Attempt:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Presence:</strong> {studentPresence || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Cancellation:</strong> {studentCancellation || "Recorded"}</p>
                        <p style={{ margin: 0 }}>• <strong>Synthesis:</strong> {studentSynthesis || "Recorded"}</p>
                      </div>

                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${GREEN}` }}>
                        <strong style={{ color: GREEN, display: "block", marginBottom: "0.2rem" }}>Worked Solution:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Presence:</strong> Flag exists (Mars in 7th from Lagna)</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Cancellation:</strong> Mitigated (Jupiter aspect + Mutual Manglik)</p>
                        <p style={{ margin: 0 }}>• <strong>Synthesis:</strong> Favourable overall (Venus 2nd, KP yes). No Veto!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 2: Cancellations & Synthesis */}
          {activeView === "cancellation_synthesis" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  1. Raw Doṣa vs Two Classical Cancellations
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>Presence:</strong> Mars in 7th (Libra) = raw Manglik flag from Lagna.
                  <br />• <strong>Cancellation 1:</strong> Exalted Jupiter in 11th casts 9th aspect on 7th/Mars.
                  <br />• <strong>Cancellation 2:</strong> Proposed partner is also Manglik (mutual cancellation).
                </p>
              </div>

              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. Fuller Marriage Promise & KP Fructification
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>Venus in 2nd (Taurus):</strong> 7th lord strong in own sign in 2nd house of family & domestic stability.
                  <br />• <strong>KP 7th Sub-Lord:</strong> Signifies 2-7-11 granting houses → Marriage fructification YES.
                </p>
              </div>
            </div>
          )}

          {/* View 3: No-Veto Ethics */}
          {activeView === "no_veto_ethics" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  The No-Veto Doctrine & Fear Defusion (§6.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  • <strong>Never Veto on Raw Flag:</strong> A raw Manglik doṣa is a prompt for cancellation analysis, NEVER an automatic veto on a proposal!
                  <br /><br />
                  • <strong>Gentle Fear Defusion:</strong> Honour the family&apos;s concern, explain the cancellations they were never shown, state doctrinal variation honestly (&quot;present but cancelled&quot;), and remind them that no chart guarantees a trouble-free marriage.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar Summary Card */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Info size={16} color={GOLD} />
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Key Takeaways (§9)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>No Raw Veto:</strong> Doṣa flag is a prompt for analysis, not a veto.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Check 3 References:</strong> Lagna, Moon, and Venus.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Cancellations Work:</strong> Jupiter aspect & mutual status defuse doṣa.
              </li>
              <li>
                <strong>Defuse Fear:</strong> Respect family concern, explain cancellation rules.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
