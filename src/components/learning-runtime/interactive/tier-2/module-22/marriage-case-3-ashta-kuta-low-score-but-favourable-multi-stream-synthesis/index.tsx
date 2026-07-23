"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  CheckCircle2,
  Info,
  Lock,
  RotateCcw,
  Unlock,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt_compare" | "kuta_decomposition" | "social_communication";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

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

function AshtaKutaLowScoreSynthesisSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Aṣṭa-Kūṭa Low Score Synthesis Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Raw Score Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#FFF3E0" stroke={VERMILION} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">RAW SCORE (§4.2)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">16 / 36 Guṇa-Milan</text>
        <text x="90" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Below Conventional 18</text>
        <text x="90" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Drag = Bhakūṭa 0/7 (6-8)</text>
        <text x="90" y="96" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">• Nāḍī Clean (8/8)</text>
        <text x="90" y="117" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">Single-Number Alarm</text>
      </g>

      {/* Arrow */}
      <path d="M 210 90 L 230 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Cancellation Box */}
      <g transform="translate(230, 25)">
        <rect x="0" y="0" width="220" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.5" />
        <text x="110" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">BHAKŪṬA BHAṄGA (§6.1)</text>
        <text x="110" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Shared Rāśi Lord (Mars)</text>
        <text x="110" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Aries & Scorpio both ruled by Mars</text>
        <text x="110" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Classical Bhakūṭa Cancellation</text>
        <text x="110" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Graha Maitri Max (Same Mind Lord)</text>
        <text x="110" y="117" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Bhakūṭa Zero Nullified</text>
      </g>

      {/* Arrow */}
      <path d="M 455 90 L 475 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Synthesis Box */}
      <g transform="translate(475, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#EBF3FA" stroke={BLUE} strokeWidth="2" />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">FULLER SYNTHESIS (§6.2)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Favourable Match</text>
        <text x="90" y="64" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">✓ Sound 7th/Venus/D9</text>
        <text x="90" y="84" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">✓ KP 2-7-11 Fructification</text>
        <text x="90" y="110" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="500">Communicable Reason</text>
      </g>
    </svg>
  );
}

export function AshtaKutaLowScoreSynthesisWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt_compare");
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Student Attempt State
  const [studentDrag, setStudentDrag] = useState("");
  const [studentCancellation, setStudentCancellation] = useState("");
  const [studentVerdict, setStudentVerdict] = useState("");

  const resetAll = () => {
    setActiveView("attempt_compare");
    setIsUnsealed(false);
    setStudentDrag("");
    setStudentCancellation("");
    setStudentVerdict("");
  };

  return (
    <div data-interactive="marriage-case-3-ashta-kuta-low-score-but-favourable-multi-stream-synthesis" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Chapter 2 Case 3 Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Marriage Case 3: Low Aṣṭa-Kūṭa Score but Favourable Synthesis (Attempt-Then-Compare)
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating a 16/36 guṇa-milan score — decomposing the single-number drag (Bhakūṭa 0/7), applying classical cancellation (shared Mars lord), and validating fuller synthesis.
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
          <p style={EYEBROW_STYLE}>Aṣṭa-Kūṭa Score Decomposition Architecture (§4.1–§6.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Score drag isolation, Bhakūṭa cancellation, fuller multi-stream synthesis, and social communication</span>
        </div>
        <AshtaKutaLowScoreSynthesisSvg activeView={activeView} />
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
              onClick={() => setActiveView("kuta_decomposition")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "kuta_decomposition" ? GREEN : HAIRLINE}`,
                background: activeView === "kuta_decomposition" ? "#E8F5E9" : "transparent",
                color: activeView === "kuta_decomposition" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Score Decomposition & Cancellation
            </button>
            <button
              type="button"
              onClick={() => setActiveView("social_communication")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "social_communication" ? BLUE : HAIRLINE}`,
                background: activeView === "social_communication" ? "#EBF3FA" : "transparent",
                color: activeView === "social_communication" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Communicable Reason & Social Reality
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
                    Record your own analysis for the 16/36 guṇa-milan match before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. Driving Kūṭa Drag (Bhakūṭa 0/7 vs Nāḍī 8/8):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bhakūṭa 0/7 (Aries-Scorpio 6-8) is main drag; Nāḍī is clean (8/8)"
                        value={studentDrag}
                        onChange={(e) => setStudentDrag(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. Classical Cancellation Rule (Shared Rāśi Lord):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cancelled by shared Mars lord of Aries & Scorpio (Bhakūṭa bhaṅga)"
                        value={studentCancellation}
                        onChange={(e) => setStudentCancellation(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        3. Fuller Synthesis & Verdict (No Veto on 16/36):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Match favourable overall - sound 7th/Venus/D9, KP yes. Do NOT veto on 16."
                        value={studentVerdict}
                        onChange={(e) => setStudentVerdict(e.target.value)}
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
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Drag:</strong> {studentDrag || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Cancellation:</strong> {studentCancellation || "Recorded"}</p>
                        <p style={{ margin: 0 }}>• <strong>Verdict:</strong> {studentVerdict || "Recorded"}</p>
                      </div>

                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${GREEN}` }}>
                        <strong style={{ color: GREEN, display: "block", marginBottom: "0.2rem" }}>Worked Solution:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Drag:</strong> Bhakūṭa 0/7 (Aries-Scorpio 6-8); Nāḍī 8/8 clean</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Cancellation:</strong> Cancelled (Shared Mars lord of both rāśis)</p>
                        <p style={{ margin: 0 }}>• <strong>Verdict:</strong> Favourable overall (7th, Venus, D9, KP yes). No Veto!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 2: Score Decomposition */}
          {activeView === "kuta_decomposition" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  1. Score Breakdown & Cancellation
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>Total:</strong> 16/36 (below 18 threshold).
                  <br />• <strong>Driving Drag:</strong> Bhakūṭa Doṣa (0/7) due to Aries & Scorpio 6–8 placement.
                  <br />• <strong>Cancellation:</strong> Aries and Scorpio are both ruled by Mars → classical Bhakūṭa cancellation!
                  <br />• <strong>Nāḍī:</strong> 8/8 (clean, no Nāḍī doṣa).
                  <br />• <strong>Graha Maitri:</strong> Strong (both ruled by Mars).
                </p>
              </div>

              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. Multi-Stream Promise & Fructification
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>Parāśari Promise:</strong> Sound 7th house, 7th lord, Venus, and D9 Navāṁśa confirmation.
                  <br />• <strong>KP Fructification:</strong> 7th cuspal sub-lord signifies 2-7-11 granting houses → YES.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Social Communication */}
          {activeView === "social_communication" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Communicable Reason for Families (§6.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  • <strong>Respecting Social Reality:</strong> Do not scold the family for worrying about the score. Give them plain terms they can communicate to elders:
                  <br /><br />
                  • <strong>The Explanation:</strong> &quot;The score is 16 because of one factor, Bhakūṭa, which is cancelled because both Moon-signs share Mars as their lord. The serious factor, Nāḍī, is 100% clean, mental friendship is strong, and both charts support the marriage.&quot;
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
                <strong>Decompose Total:</strong> Find which kūṭa dragged the score down.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Bhakūṭa Bhaṅga:</strong> Shared rāśi lord nullifies Bhakūṭa zero.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Nāḍī & Maitri:</strong> Confirm Nāḍī is clean and mind-lords agree.
              </li>
              <li>
                <strong>Fuller Synthesis:</strong> Weight falls on multi-stream promise, not raw sum.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
