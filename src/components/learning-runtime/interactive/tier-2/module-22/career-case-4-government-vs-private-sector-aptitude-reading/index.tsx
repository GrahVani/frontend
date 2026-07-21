"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Globe,
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
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt_compare" | "sector_grain" | "selection_boundary";

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

function GovernmentVsPrivateSectorSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Government vs Private Sector Aptitude Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Strength Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="170" height="130" rx="8" fill="#FFF" stroke={HAIRLINE} strokeWidth="1.5" />
        <text x="85" y="22" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600">10TH LORD STRENGTH (§6.1)</text>
        <text x="85" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Venus in Taurus 10th</text>
        <text x="85" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Own Sign in 10th House</text>
        <text x="85" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Career Succeeds Overall</text>
        <text x="85" y="96" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="500">✗ Strength != Sector</text>
        <text x="85" y="117" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Career Foundation Solid</text>
      </g>

      {/* Arrow */}
      <path d="M 200 90 L 220 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Sector Grain Box */}
      <g transform="translate(220, 25)">
        <rect x="0" y="0" width="230" height="130" rx="8" fill="#FFF8E1" stroke={GOLD} strokeWidth="1.5" />
        <text x="115" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">PLANETARY NATURES (SECTOR GRAIN)</text>
        <text x="115" y="44" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="600">Primary: Public / Administrative</text>
        <text x="115" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Sun in 10th Dig-Bala (Authority)</text>
        <text x="115" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Saturn 7th Aspect + AmK (Service)</text>
        <text x="115" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Mars 9th Own Sign (Discipline)</text>
        <text x="115" y="117" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Secondary: Mercury Commerce (11th)</text>
      </g>

      {/* Arrow */}
      <path d="M 455 90 L 475 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Selection Boundary Box */}
      <g transform="translate(475, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#EBF3FA" stroke={BLUE} strokeWidth="2" />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">ETHICAL BOUNDARY (§6.2)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Aptitude vs Selection</text>
        <text x="90" y="64" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">✓ Suitability: Path Fits Grain</text>
        <text x="90" y="84" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">✗ Selection: Cannot Predict Exam</text>
        <text x="90" y="110" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="500">Route prep to exam mentor</text>
      </g>
    </svg>
  );
}

export function GovernmentVsPrivateSectorWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt_compare");
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Student Attempt State
  const [studentStrength, setStudentStrength] = useState("");
  const [studentSector, setStudentSector] = useState("");
  const [studentBoundary, setStudentBoundary] = useState("");

  const resetAll = () => {
    setActiveView("attempt_compare");
    setIsUnsealed(false);
    setStudentStrength("");
    setStudentSector("");
    setStudentBoundary("");
  };

  return (
    <div data-interactive="career-case-4-government-vs-private-sector-aptitude-reading" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Case Study 4 Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Career Case 4: Government vs Private-Sector Aptitude Reading (Attempt-Then-Compare)
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating Sneha’s sector question — distinguishing 10th lord strength from planetary natures, reading public vs private sector grain, and holding the aptitude-vs-selection line.
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
          <p style={EYEBROW_STYLE}>Government vs Private Sector Aptitude Architecture (§4.1–§6.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Strength vs natures, public-service primary with commercial secondary, and selection boundary</span>
        </div>
        <GovernmentVsPrivateSectorSvg activeView={activeView} />
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
              onClick={() => setActiveView("sector_grain")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "sector_grain" ? GOLD : HAIRLINE}`,
                background: activeView === "sector_grain" ? "#FFF8E1" : "transparent",
                color: activeView === "sector_grain" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Planetary Natures & Sector Grain
            </button>
            <button
              type="button"
              onClick={() => setActiveView("selection_boundary")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "selection_boundary" ? BLUE : HAIRLINE}`,
                background: activeView === "selection_boundary" ? "#EBF3FA" : "transparent",
                color: activeView === "selection_boundary" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Aptitude vs Selection Boundary
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
                    Record your own sector findings for Sneha’s chart before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. 10th Lord Strength Check (Venus in Taurus):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Venus strong in own sign 10th = career succeeds, but strength != sector"
                        value={studentStrength}
                        onChange={(e) => setStudentStrength(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. Sector Grain from Natures (Public vs Private):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sun dig-bala 10th + Saturn aspect/AmK + Mars 9th = Public primary; Merc 11th = Private secondary"
                        value={studentSector}
                        onChange={(e) => setStudentSector(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        3. Aptitude vs Selection Boundary:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Reads suitability for public service; NEVER predicts clearing exam / getting post"
                        value={studentBoundary}
                        onChange={(e) => setStudentBoundary(e.target.value)}
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
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Strength:</strong> {studentStrength || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Sector:</strong> {studentSector || "Recorded"}</p>
                        <p style={{ margin: 0 }}>• <strong>Boundary:</strong> {studentBoundary || "Recorded"}</p>
                      </div>

                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${GREEN}` }}>
                        <strong style={{ color: GREEN, display: "block", marginBottom: "0.2rem" }}>Worked Solution:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Strength:</strong> Venus own sign 10th (career succeeds)</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Sector:</strong> Public primary (Sun/Saturn/Mars) + Private secondary (Merc)</p>
                        <p style={{ margin: 0 }}>• <strong>Boundary:</strong> Reads suitability; refuses exam outcome prediction</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 2: Planetary Natures & Sector Grain */}
          {activeView === "sector_grain" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  1. Public / Administrative Primary Natures
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>Sun in 10th (Dig-Bala):</strong> Natural kāraka of government, authority, and public standing.
                  <br />• <strong>Saturn 7th Aspect + AmK:</strong> Structured service to the collective; administration and systems.
                  <br />• <strong>Mars in 9th (Aries):</strong> Discipline and uniformed/authority grain.
                </p>
              </div>

              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. Private / Commercial Secondary Natures
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>Mercury in 11th (Gemini):</strong> Strong commerce & communication significator — genuine secondary commercial path.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Selection Boundary */}
          {activeView === "selection_boundary" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Aptitude vs Selection Ethical Boundary (§6.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <strong>Crucial Ethical Line:</strong> &quot;This path suits you&quot; (suitability) vs &quot;You will clear the exam & get the job&quot; (selection prediction).
                  <br /><br />
                  Astrology reads suitability and sector grain. Selection depends on exam preparation, competition, and effort. Route exam strategy to a coaching mentor, never to astrology!
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
                <strong>Strength != Sector:</strong> Strength says career succeeds; natures say which sector.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Public Natures:</strong> Sun, Saturn, Mars → Public/Administrative.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Private Natures:</strong> Mercury, Venus → Private/Commercial.
              </li>
              <li>
                <strong>Aptitude != Selection:</strong> Read suitability, never predict exam outcomes.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
