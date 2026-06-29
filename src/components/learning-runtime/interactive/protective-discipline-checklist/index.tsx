"use client";

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Award, RefreshCw, Eye, AlertOctagon, CheckSquare } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GREEN = "#4e7037";
const RED = "#ad4b37";

interface CaseScenario {
  id: string;
  title: string;
  type: "predatory" | "ethical";
  summary: string;
  transcript: string;
  expectedAnswers: Record<string, boolean>; // map rule key -> true (compliant) or false (violated)
}

const CASES: CaseScenario[] = [
  {
    id: "case_a",
    title: "Case A: The Commission Broker (Predatory)",
    type: "predatory",
    summary: "Astrologer recommends an expensive $2,500 natural Blue Sapphire to a vulnerable client who recently lost their job, warning of absolute ruin.",
    transcript: "Your Saturn is weak in transit, which is why you lost your job. You must wear a flawless 4-carat Blue Sapphire immediately. If you do not buy it, complete financial ruin and severe illness in the family will strike you before the month ends. Astrological remedies must be absolute cures; cheap substitute stones (uparatnas) like Amethyst are useless fakes that carry no power. Go to my brother's shop at Crown Jewelers, mention my name, and he will give you a 5% discount. (Note: The astrologer secretly pockets a 20% commission on the sale). No other remedies are offered.",
    expectedAnswers: {
      rule1: false, // violated
      rule2: false, // violated
      rule3: false, // violated
      rule4: false, // violated
      rule5: false  // violated
    }
  },
  {
    id: "case_b",
    title: "Case B: The Ethical Guide (Compliant)",
    type: "ethical",
    summary: "Astrologer explains the mitigation-not-cure ethic, suggests free/cheap charity and mantras first, and provides uparatna alternatives with fee transparency.",
    transcript: "Saturn's transit is bringing structural pressure. Remember the core ethic: a remedy is for mitigation, not an absolute cure. We cannot erase the karmic arrow, but we can cushion its impact. Before considering any stones, the traditional default is charity (dāna)—like feeding crows or donating black sesame seeds—and mantra chanting, which cost nothing. The client asks about stones. The astrologer replies: 'Gemstones are a secondary option. Blue Sapphire is highly potent and fast-acting, so we must be extremely cautious. A gentle substitute like Amethyst is much safer, less intense, and costs only $30. I do not sell gems, nor do I take commissions from any jeweler. You are free to purchase a stone from any dealer you prefer.'",
    expectedAnswers: {
      rule1: true, // compliant
      rule2: true, // compliant
      rule3: true, // compliant
      rule4: true, // compliant
      rule5: true  // compliant
    }
  }
];

export function ProtectiveDisciplineChecklist() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case_a");
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({
    rule1: false,
    rule2: false,
    rule3: false,
    rule4: false,
    rule5: false
  });
  const [isAudited, setIsAudited] = useState<boolean>(false);

  const currentCase = CASES.find(c => c.id === selectedCaseId) || CASES[0];

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setIsAudited(false);
    setUserAnswers({
      rule1: false,
      rule2: false,
      rule3: false,
      rule4: false,
      rule5: false
    });
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleToggleRule = (ruleKey: string) => {
    if (isAudited) return; // locked when audited
    setUserAnswers(prev => ({ ...prev, [ruleKey]: !prev[ruleKey] }));
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
  };

  const handleRunAudit = () => {
    setIsAudited(true);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  const resetAudit = () => {
    setIsAudited(false);
    setUserAnswers({
      rule1: false,
      rule2: false,
      rule3: false,
      rule4: false,
      rule5: false
    });
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const getAuditResult = () => {
    let correctAudits = 0;
    const ruleKeys = ["rule1", "rule2", "rule3", "rule4", "rule5"];
    
    ruleKeys.forEach(k => {
      if (userAnswers[k] === currentCase.expectedAnswers[k]) {
        correctAudits++;
      }
    });

    return {
      score: correctAudits,
      passed: correctAudits === 5
    };
  };

  const auditResult = getAuditResult();

  // Dynamic Gauge angle
  // 0 is vertical, -60 is predatory red, +60 is ethical green
  const getGaugeAngle = () => {
    if (!isAudited) return 0;
    return currentCase.type === "predatory" ? -60 : 60;
  };

  return (
    <div style={{
      padding: "16px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      <style>{`
        .case-tab {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(156,122,47,0.25);
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          font-size: 11.5px;
          font-weight: 700;
          color: ${INK_SECONDARY};
          transition: all 0.2s ease;
        }
        .case-tab.active-predatory {
          background: rgba(173, 75, 55, 0.1);
          border-color: #ad4b37;
          color: #762e21;
        }
        .case-tab.active-ethical {
          background: rgba(78, 112, 55, 0.1);
          border-color: #4e7037;
          color: #344e24;
        }
        .audit-check-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px;
          background: rgba(255,255,255,0.4);
          border: 1px solid rgba(156,122,47,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .audit-check-row:hover:not(.disabled) {
          background: rgba(255, 253, 248, 0.9);
          border-color: ${GOLD};
        }
        .audit-check-row.disabled {
          cursor: not-allowed;
        }
        .audit-check-row.correct-checked {
          border-color: rgba(78, 112, 55, 0.35);
          background: rgba(78, 112, 55, 0.04);
        }
        .audit-check-row.incorrect-checked {
          border-color: rgba(173, 75, 55, 0.35);
          background: rgba(173, 75, 55, 0.04);
        }
        .highlight-red {
          background: rgba(173, 75, 55, 0.12);
          border-bottom: 2px dashed ${RED};
          border-radius: 2px;
          padding: 0 2px;
          font-weight: 600;
        }
        .highlight-green {
          background: rgba(78, 112, 55, 0.1);
          border-bottom: 2px dashed ${GREEN};
          border-radius: 2px;
          padding: 0 2px;
          font-weight: 600;
        }
        button:focus-visible, .audit-check-row:focus-visible {
          outline: 2px solid ${GOLD_DEEP};
          outline-offset: 2px;
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(156, 122, 47, 0.1)",
        paddingBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Protective Discipline & Ethics Auditor
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Audit client counseling transcripts against the five protective rules of ethical gemstone advice.
        </p>
      </div>

      {/* CASE SELECTOR */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
          Select Consultation Case Study
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => handleSelectCase("case_a")}
            aria-pressed={selectedCaseId === "case_a"}
            className={`case-tab ${selectedCaseId === "case_a" ? "active-predatory" : ""}`}
            style={{ flex: 1 }}
          >
            Case A: The Commission Broker (Predatory)
          </button>
          <button
            onClick={() => handleSelectCase("case_b")}
            aria-pressed={selectedCaseId === "case_b"}
            className={`case-tab ${selectedCaseId === "case_b" ? "active-ethical" : ""}`}
            style={{ flex: 1 }}
          >
            Case B: The Ethical Guide (Compliant)
          </button>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {/* LEFT COLUMN: TRANSCRIPT VIEW */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "rgba(255,255,255,0.45)",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "12px",
          padding: "14px"
        }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Eye size={12} /> Counselor Transcript
          </span>
          
          <div>
            <div style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic", marginBottom: "6px" }}>
              {currentCase.summary}
            </div>
            
            {/* RICH TRANSCRIPT BOX */}
            <div style={{
              background: "var(--gl-cream-light, #fdfcf7)",
              borderLeft: `4px solid ${currentCase.type === "predatory" ? "#ad4b37" : "#4e7037"}`,
              padding: "10px 14px",
              borderRadius: "0 8px 8px 0",
              fontSize: "11.5px",
              lineHeight: "1.5",
              color: INK_PRIMARY,
              transition: "all 0.3s ease"
            }}>
              {isAudited ? (
                currentCase.id === "case_a" ? (
                  <>
                    "Your Saturn is weak in transit, which is why you lost your job.{" "}
                    <span className="highlight-red" title="Breaches Rule 1: gemstone recommended directly as default & Rule 2: no cheaper alternatives suggested first">
                      You must wear a flawless 4-carat Blue Sapphire immediately.
                    </span>{" "}
                    If you do not buy it,{" "}
                    <span className="highlight-red" title="Breaches Rule 4: uses fear-selling of absolute ruin & family sickness">
                      complete financial ruin and severe illness in the family will strike you before the month ends. Astrological remedies must be absolute cures;
                    </span>{" "}
                    <span className="highlight-red" title="Breaches Rule 5: refused cheaper substitutes (uparatnas) like Amethyst">
                      cheap substitute stones (uparatnas) like Amethyst are useless fakes that carry no power.
                    </span>{" "}
                    Go to{" "}
                    <span className="highlight-red" title="Breaches Rule 3: commercial conflict of interest, undisclosed family kickbacks/commissions">
                      my brother's shop at Crown Jewelers, mention my name, and he will give you a 5% discount. (Note: The astrologer secretly pockets a 20% commission on the sale).
                    </span>{" "}
                    No other remedies are offered."
                  </>
                ) : (
                  <>
                    "Saturn's transit is bringing structural pressure.{" "}
                    <span className="highlight-green" title="Complies with Rule 1: gemstone is not default & Rule 2: free mantra and charity suggested first">
                      Remember the core ethic: a remedy is for mitigation, not an absolute cure. We cannot erase the karmic arrow, but we can cushion its impact. Before considering any stones, the traditional default is charity (dāna)—like feeding crows or donating black sesame seeds—and mantra chanting, which cost nothing.
                    </span>{" "}
                    The client asks about stones. The astrologer replies: 'Gemstones are a secondary option. Blue Sapphire is highly potent and fast-acting, so we must be extremely cautious.{" "}
                    <span className="highlight-green" title="Complies with Rule 5: affordable uparatna alternatives suggested to respect client budget limits">
                      A gentle substitute like Amethyst is much safer, less intense, and costs only $30.
                    </span>{" "}
                    <span className="highlight-green" title="Complies with Rule 3: conflict of interest declared and avoided, no commission links">
                      I do not sell gems, nor do I take commissions from any jeweler. You are free to purchase a stone from any dealer you prefer.
                    </span>{" "}
                    {" "}<span className="highlight-green" title="Complies with Rule 4: calm, neutral speech, no fear-selling or ruin threats">['No fear-selling used']</span>'"
                  </>
                )
              ) : (
                `"${currentCase.transcript}"`
              )}
            </div>
            
            {isAudited && (
              <div style={{ marginTop: "8px", fontSize: "9.5px", color: INK_MUTED, fontStyle: "italic" }}>
                * Hover highlighted segments to read pedagogical audit notes.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GAUGE + CHECKLIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* GAUGE CONTAINER */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
            background: "rgba(255,255,255,0.45)",
            border: "1px solid rgba(156, 122, 47, 0.12)",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, marginBottom: "4px" }}>
              Consultation Ethical Rating
            </span>

            {/* SVG GAUGE */}
            <svg viewBox="0 0 200 110" style={{ width: "160px", height: "90px" }} aria-hidden="true">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ad4b37" />
                  <stop offset="50%" stopColor="#ffe082" />
                  <stop offset="100%" stopColor="#4e7037" />
                </linearGradient>
              </defs>
              
              {/* Gauge Arc */}
              <path
                d="M 25 95 A 75 75 0 0 1 175 95"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Gauge ticks */}
              <line x1="25" y1="95" x2="15" y2="95" stroke={INK_MUTED} strokeWidth="1" />
              <line x1="100" y1="20" x2="100" y2="10" stroke={INK_MUTED} strokeWidth="1" />
              <line x1="175" y1="95" x2="185" y2="95" stroke={INK_MUTED} strokeWidth="1" />
              
              {/* Labels */}
              <text x="25" y="106" fontSize="8" fontWeight="bold" fill="#ad4b37" textAnchor="middle">Predatory</text>
              <text x="100" y="32" fontSize="8" fontWeight="bold" fill={INK_MUTED} textAnchor="middle">Neutral</text>
              <text x="175" y="106" fontSize="8" fontWeight="bold" fill="#4e7037" textAnchor="middle">Sattvic</text>

              {/* Needle pivot center point */}
              <circle cx="100" cy="95" r="5" fill={INK_PRIMARY} />
              
              {/* Dynamic Needle */}
              <line
                x1="100"
                y1="95"
                x2="100"
                y2="35"
                stroke={INK_PRIMARY}
                strokeWidth="3.5"
                strokeLinecap="round"
                transform={`rotate(${getGaugeAngle()}, 100, 95)`}
                style={{
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformOrigin: "100px 95px"
                }}
              />
            </svg>

            {isAudited && (
              <span style={{
                fontSize: "11px",
                fontWeight: 800,
                color: currentCase.type === "predatory" ? "#ad4b37" : "#4e7037",
                marginTop: "-4px"
              }}>
                {currentCase.type === "predatory" ? "⚠️ Exploitative / Predatory" : "✦ Sattvic / Protective"}
              </span>
            )}
          </div>

          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Audit Rule Status: Check only if the Counselor COMPLIED
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} role="group" aria-label="Ethics Rules Compliance">
            {/* RULE 1 */}
            <div
              onClick={() => handleToggleRule("rule1")}
              className={`audit-check-row ${isAudited ? "disabled" : ""} ${
                isAudited 
                  ? userAnswers.rule1 === currentCase.expectedAnswers.rule1 
                    ? "correct-checked" 
                    : "incorrect-checked"
                  : ""
              }`}
              role="checkbox"
              aria-checked={userAnswers.rule1}
              tabIndex={isAudited ? -1 : 0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleRule("rule1"); } }}
            >
              <input
                type="checkbox"
                checked={userAnswers.rule1}
                disabled={isAudited}
                style={{ pointerEvents: "none" }}
                tabIndex={-1}
              />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Rule 1: Gemstone is NOT the default</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: INK_SECONDARY }}>
                  Astrologer considered non-stone categories (mantra, dāna, worship, fasts) instead of pushing gems first.
                </p>
              </div>
            </div>

            {/* RULE 2 */}
            <div
              onClick={() => handleToggleRule("rule2")}
              className={`audit-check-row ${isAudited ? "disabled" : ""} ${
                isAudited 
                  ? userAnswers.rule2 === currentCase.expectedAnswers.rule2 
                    ? "correct-checked" 
                    : "incorrect-checked"
                  : ""
              }`}
              role="checkbox"
              aria-checked={userAnswers.rule2}
              tabIndex={isAudited ? -1 : 0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleRule("rule2"); } }}
            >
              <input
                type="checkbox"
                checked={userAnswers.rule2}
                disabled={isAudited}
                style={{ pointerEvents: "none" }}
                tabIndex={-1}
              />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Rule 2: Cheaper remedies offered first</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: INK_SECONDARY }}>
                  Cheaper or free options (charities, basic mantras) were suggested before recommending expensive stones.
                </p>
              </div>
            </div>

            {/* RULE 3 */}
            <div
              onClick={() => handleToggleRule("rule3")}
              className={`audit-check-row ${isAudited ? "disabled" : ""} ${
                isAudited 
                  ? userAnswers.rule3 === currentCase.expectedAnswers.rule3 
                    ? "correct-checked" 
                    : "incorrect-checked"
                  : ""
              }`}
              role="checkbox"
              aria-checked={userAnswers.rule3}
              tabIndex={isAudited ? -1 : 0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleRule("rule3"); } }}
            >
              <input
                type="checkbox"
                checked={userAnswers.rule3}
                disabled={isAudited}
                style={{ pointerEvents: "none" }}
                tabIndex={-1}
              />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Rule 3: Conflict of interest avoided</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: INK_SECONDARY }}>
                  Astrologer disclosed store partnerships, or avoided seller-commission and referral kickback conflicts.
                </p>
              </div>
            </div>

            {/* RULE 4 */}
            <div
              onClick={() => handleToggleRule("rule4")}
              className={`audit-check-row ${isAudited ? "disabled" : ""} ${
                isAudited 
                  ? userAnswers.rule4 === currentCase.expectedAnswers.rule4 
                    ? "correct-checked" 
                    : "incorrect-checked"
                  : ""
              }`}
              role="checkbox"
              aria-checked={userAnswers.rule4}
              tabIndex={isAudited ? -1 : 0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleRule("rule4"); } }}
            >
              <input
                type="checkbox"
                checked={userAnswers.rule4}
                disabled={isAudited}
                style={{ pointerEvents: "none" }}
                tabIndex={-1}
              />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Rule 4: NO fear-based selling</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: INK_SECONDARY }}>
                  Astrologer avoided using threats of ruin, disaster, or illness to pressure the client into a purchase.
                </p>
              </div>
            </div>

            {/* RULE 5 */}
            <div
              onClick={() => handleToggleRule("rule5")}
              className={`audit-check-row ${isAudited ? "disabled" : ""} ${
                isAudited 
                  ? userAnswers.rule5 === currentCase.expectedAnswers.rule5 
                    ? "correct-checked" 
                    : "incorrect-checked"
                  : ""
              }`}
              role="checkbox"
              aria-checked={userAnswers.rule5}
              tabIndex={isAudited ? -1 : 0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleRule("rule5"); } }}
            >
              <input
                type="checkbox"
                checked={userAnswers.rule5}
                disabled={isAudited}
                style={{ pointerEvents: "none" }}
                tabIndex={-1}
              />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Rule 5: Substitutes (Uparatna) offered</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: INK_SECONDARY }}>
                  Offered affordable uparatnas (e.g. Amethyst, Garnet) rather than insisting only high-cost gems work.
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          {!isAudited ? (
            <button
              onClick={handleRunAudit}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: GOLD_DEEP,
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 750,
                cursor: "pointer",
                marginTop: "4px"
              }}
            >
              <CheckSquare size={14} /> Submit Audit Report
            </button>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "4px"
            }}>
              {/* SCOREBOARD CARD */}
              <div style={{
                background: auditResult.passed ? "rgba(78, 112, 55, 0.04)" : "rgba(173, 75, 55, 0.04)",
                border: `1.5px solid ${auditResult.passed ? "#4e7037" : "#ad4b37"}`,
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                textAlign: "center"
              }}>
                {auditResult.passed ? (
                  <ShieldCheck size={28} style={{ color: "#4e7037" }} />
                ) : (
                  <ShieldAlert size={28} style={{ color: "#ad4b37" }} />
                )}
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 850, color: auditResult.passed ? "#4e7037" : "#ad4b37" }}>
                    Audit Score: {auditResult.score} / 5 Correct
                  </span>
                  <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
                    {auditResult.passed 
                      ? "Perfect! You correctly audited the consultation and identified all compliances/violations."
                      : "Some audit points were missed or misclassified. Reset and review the guidelines."
                    }
                  </p>
                </div>
              </div>

              {/* POST-AUDIT EDUCATIONAL NOTES */}
              <div style={{
                background: "rgba(156, 122, 47, 0.04)",
                border: "1px solid rgba(156, 122, 47, 0.15)",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "10px",
                lineHeight: "1.4",
                color: INK_SECONDARY
              }}>
                {currentCase.type === "predatory" ? (
                  <p style={{ margin: 0 }}>
                    <strong>Pedagogical Analysis:</strong> Counselor breached every rule of protective discipline. They pushed a gemstone as default (Rule 1), offered no free remedies (Rule 2), hid a seller commission (Rule 3), used severe fear threats of ruin and family illness (Rule 4), and falsely claimed uparatnas are useless fakes (Rule 5).
                  </p>
                ) : (
                  <p style={{ margin: 0 }}>
                    <strong>Pedagogical Analysis:</strong> Counselor followed the discipline perfectly. They emphasized 'mitigation, not cure' (Chapter 1), suggested dāna and mantras first (Rules 1 & 2), explicitly declared no commissions or commercial links (Rule 3), used calm educational speech (Rule 4), and offered Amethyst uparatna as a safe alternative (Rule 5).
                  </p>
                )}
              </div>

              <button
                onClick={resetAudit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: GOLD_DEEP,
                  color: "#ffffff",
                  fontSize: "10.5px",
                  fontWeight: 750,
                  cursor: "pointer"
                }}
              >
                <RefreshCw size={10} /> Reset Audit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TIER-1 ETHICAL BOUNDARY REMINDER */}
      <div style={{
        background: "rgba(173, 75, 55, 0.05)",
        border: "1.5px solid rgba(173, 75, 55, 0.25)",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px"
      }}>
        <AlertOctagon size={16} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ad4b37", textTransform: "uppercase" }}>
            Prescription Gate & Ethics Reminder
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            Tier-1 graduates **never prescribe** remedies. You practice this audit to identify predatory recommendations from commercial practitioners and protect consultees from financial and energetic exploitation.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Grahvani Learning Runtime (Chapter 4)</span>
        <span>Protective Discipline & Ethics Auditor</span>
      </div>
    </div>
  );
}
