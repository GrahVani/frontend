"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Sliders,
  RefreshCw,
  Volume2
} from "lucide-react";
import { useLessonSlug } from "@/components/learning-runtime/interactive/tier-1/module-4/rashi-attribute-wheel";

// Curated colors for parchment theme
const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

// The 8 failure modes definition
interface FailureModeDef {
  id: number;
  name: string;
  principle: string;
  corrective: string;
}

const FAILURE_MODES: FailureModeDef[] = [
  {
    id: 1,
    name: "Single-Indicator Over-Reliance",
    principle: "Two-Yes Principle",
    corrective: "Seek a second independent line of evidence; never count a single thing twice."
  },
  {
    id: 2,
    name: "Daśā-Without-Transit",
    principle: "Promise-Timing-Trigger Funnel",
    corrective: "Verify a current transit trigger aspect to confirm the dasha window's timing."
  },
  {
    id: 3,
    name: "Transit-Without-Daśā",
    principle: "Promise-Timing-Trigger Funnel",
    corrective: "Verify an active dasha/bhukti window; do not read a transit trigger in isolation."
  },
  {
    id: 4,
    name: "Kāraka-Bhāva Conflation",
    principle: "Promise Tripod (House/Lord/Kāraka)",
    corrective: "Evaluate all three legs of the tripod separately in their distinct roles."
  },
  {
    id: 5,
    name: "Fatalism-Leak",
    principle: "Calibrated Phrasing & Agency Tiers",
    corrective: "Phrase as a tendency or indication of likelihood; avoid deterministic decrees (will/must)."
  },
  {
    id: 6,
    name: "Confirmation-Bias",
    principle: "Multi-Stream Concordance & Divergence Check",
    corrective: "Search for and report disconfirming evidence; disclose internal chart tensions."
  },
  {
    id: 7,
    name: "Scope-Creep",
    principle: "Competence Boundaries & Ethical Routing",
    corrective: "Refuse predictions outside astrology's domain (e.g. medical diagnosis, exact death-dates)."
  },
  {
    id: 8,
    name: "Premature-Prescription",
    principle: "Recognition-Only Limit & Safety Screening",
    corrective: "Defer remedies to specific modules; never prescribe before a full diagnosis is complete."
  }
];

// Curated bank of draft predictions for Diagnosis Mode (Lesson 1 & 4)
interface CuratedDraft {
  id: string;
  title: string;
  text: string;
  expectedModes: number[];
  rationale: string;
}

const CURATED_DRAFTS: CuratedDraft[] = [
  {
    id: "draft-1",
    title: "1. The Tempting Marriage Decree",
    text: "Venus Mahadasha is active. Venus is your Lagna lord and the natural karaka of marriage, so you will definitely get married on October 14, 2026, when transiting Jupiter enters Gemini.",
    expectedModes: [1, 5],
    rationale: "Rests the claim primarily on Venus MD (violates Two-Yes) and uses fatalistic phrasing ('will definitely' and an exact date, violates Calibrated Phrasing)."
  },
  {
    id: "draft-2",
    title: "2. The Lonely Transit Promotion",
    text: "Jupiter is transiting your natal 10th house of career this month, which will trigger a major job promotion. You should immediately resign from your current job to make room for this.",
    expectedModes: [3, 8],
    rationale: "Reads a career trigger in a vacuum without stating if there is an active dasha window (violates Transit-Without-Daśā) and immediately prescribes a high-stakes life decision (violates Premature-Prescription)."
  },
  {
    id: "draft-3",
    title: "3. The Defiant Infertility Gemstone",
    text: "Since your 5th lord of children is debilitated in the 8th house, you are completely infertile and will never have children. You should wear a red coral gemstone to cure this affliction.",
    expectedModes: [4, 5, 7, 8],
    rationale: "Conflates house/lord tripod checks with a final decree (violates Kāraka-Bhāva Conflation), makes a fatalistic decree (violates Fatalism-Leak), crosses into medical diagnosis (violates Scope-Creep), and prescribes a remedy before/instead of referral (violates Premature-Prescription)."
  },
  {
    id: "draft-4",
    title: "4. The Cherry-Picked Engineering Job",
    text: "Your natal 10th house receives an aspect from Mars, which is exalted, indicating a successful career as an engineer. We do not need to look at the Jaimini Amātyakāraka or the Dashamśa chart because this Mars aspect is strong enough to guarantee it.",
    expectedModes: [1, 6],
    rationale: "Rests the career reading on a single strong indicator (violates Single-Indicator) and explicitly ignores other streams/divisional checks to avoid conflicting evidence (violates Confirmation-Bias)."
  }
];

export function PredictiveFailureModeQuiz() {
  const slug = useLessonSlug();
  const [activeTab, setActiveTab] = useState<"diagnosis" | "self-audit">("diagnosis");
  
  // Timed Mode state (Diagnosis)
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [timerActive, setTimerActive] = useState(false);

  // Diagnosis Mode state
  const [selectedDraftId, setSelectedDraftId] = useState(CURATED_DRAFTS[0].id);
  const [userSelectedModes, setUserSelectedModes] = useState<number[]>([]);
  const [userMappings, setUserMappings] = useState<Record<number, { principle: string; corrective: string }>>({});
  const [diagnosisSubmitted, setDiagnosisSubmitted] = useState(false);
  const [scoreMessage, setScoreMessage] = useState("");

  // Self-Audit Mode state
  const [auditTextType, setAuditTextType] = useState<"curated" | "learner">("curated");
  const [selectedAuditDraftId, setSelectedAuditDraftId] = useState(CURATED_DRAFTS[0].id);
  const [customAuditText, setCustomAuditText] = useState("");
  const [checklistAnswers, setChecklistAnswers] = useState<Record<number, boolean>>({});
  const [confidenceRating, setConfidenceRating] = useState(70);
  const [auditSubmitted, setAuditSubmitted] = useState(false);
  const [readAloudDone, setReadAloudDone] = useState(false);

  // Lesson-aware failure modes and curated drafts configuration
  const activeFailureModes = React.useMemo(() => {
    if (slug === "failure-modes-1-4-indicator-and-timing-errors") {
      return FAILURE_MODES.filter(m => m.id >= 1 && m.id <= 4);
    }
    if (slug === "failure-modes-5-8-tone-and-scope-errors") {
      return FAILURE_MODES.filter(m => m.id >= 5 && m.id <= 8);
    }
    return FAILURE_MODES;
  }, [slug]);

  const activeCuratedDrafts = React.useMemo(() => {
    if (slug === "failure-modes-1-4-indicator-and-timing-errors") {
      return [
        {
          id: "draft-l2-1",
          title: "1. Venus Mahadashā Event",
          text: "Venus Mahadashā is active. Venus is the 7th lord and natural karaka of marriage, so a marriage event is fully guaranteed to happen during this period.",
          expectedModes: [1],
          rationale: "Rests the entire marriage prediction on a single active dasha lord (violates Single-Indicator Over-Reliance / Two-Yes Principle)."
        },
        {
          id: "draft-l2-2",
          title: "2. The Career Transit",
          text: "Exalted Jupiter is transiting your natal 10th house this month, which will trigger a major job promotion.",
          expectedModes: [3],
          rationale: "Reads a career promotion trigger purely from transit without verifying if there is an active dasha window supporting it (violates Transit-Without-Daśā)."
        },
        {
          id: "draft-l2-3",
          title: "3. Debilitated Lord Decree",
          text: "Since your 5th lord of children is debilitated in the 8th house, children are denied.",
          expectedModes: [4],
          rationale: "Conflates the lord's placement in isolation with the whole promise tripod, ignoring house tenancy and karaka Jupiter (violates Kāraka-Bhāva Conflation)."
        },
        {
          id: "draft-l2-4",
          title: "4. Exalted Transit Window",
          text: "Venus is exalted in transit in your 7th house, so relationship timing is ripe, even though the active dasha is Rahu and natal Venus is debilitated.",
          expectedModes: [3],
          rationale: "Reads relationship timing from transit in isolation without an active timing window (violates Transit-Without-Daśā)."
        }
      ];
    }
    if (slug === "failure-modes-5-8-tone-and-scope-errors") {
      return [
        {
          id: "draft-l3-1",
          title: "1. The Absolute Destiny",
          text: "You will definitely get married on October 14, 2026. This is your absolute destiny and cannot be changed by any action.",
          expectedModes: [5],
          rationale: "Uses absolute, fatalistic decree language ('will definitely', 'absolute destiny') instead of calibrated likelihood (violates Fatalism-Leak)."
        },
        {
          id: "draft-l3-2",
          title: "2. Selecting Happy Aspects",
          text: "We only look at the positive aspects on the 7th house; any negative aspect is dismissed because the client wants a happy prediction.",
          expectedModes: [6],
          rationale: "Deliberately cherry-picks supporting indications and ignores conflicting ones to reach a pre-formed conclusion (violates Confirmation-Bias)."
        },
        {
          id: "draft-l3-3",
          title: "3. Chronic Medical Opinion",
          text: "The planetary alignments in your 6th house indicate you have a chronic liver disease and must undergo surgery immediately.",
          expectedModes: [7, 8],
          rationale: "Crosses boundaries into medical diagnosis (violates Scope-Creep) and prescribes an immediate, high-stakes surgical directive (violates Premature-Prescription)."
        },
        {
          id: "draft-l3-4",
          title: "4. Job Loss Remedy",
          text: "You will lose your job this month and must perform a puja to avert this doom.",
          expectedModes: [5, 8],
          rationale: "Uses fatalistic language (violates Fatalism-Leak) and prescribes a remedy immediately without complete diagnosis or safety vetting (violates Premature-Prescription)."
        }
      ];
    }
    return CURATED_DRAFTS;
  }, [slug]);

  // Set default tabs and selectors when active drafts / slug change
  useEffect(() => {
    if (slug === "the-self-audit-discipline-applying-failure-modes-to-your-own-draft") {
      setActiveTab("self-audit");
    } else {
      setActiveTab("diagnosis");
    }
  }, [slug]);

  useEffect(() => {
    if (activeCuratedDrafts.length > 0) {
      setSelectedDraftId(activeCuratedDrafts[0].id);
      setSelectedAuditDraftId(activeCuratedDrafts[0].id);
    }
  }, [activeCuratedDrafts]);

  // Current draft selection helper
  const currentDraft = activeCuratedDrafts.find(d => d.id === selectedDraftId) || activeCuratedDrafts[0];
  const currentAuditDraft = activeCuratedDrafts.find(d => d.id === selectedAuditDraftId) || activeCuratedDrafts[0];

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setDiagnosisSubmitted(true);
      calculateScore(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(45);
    setTimerActive(true);
  };

  const handleDraftChange = (id: string) => {
    setSelectedDraftId(id);
    setUserSelectedModes([]);
    setUserMappings({});
    setDiagnosisSubmitted(false);
    if (timedMode) {
      startTimer();
    }
  };

  const toggleModeSelection = (modeId: number) => {
    if (diagnosisSubmitted) return;
    setUserSelectedModes((prev) =>
      prev.includes(modeId) ? prev.filter((id) => id !== modeId) : [...prev, modeId]
    );
    if (!userMappings[modeId]) {
      setUserMappings((prev) => ({
        ...prev,
        [modeId]: { principle: "", corrective: "" }
      }));
    }
  };

  const handleMappingChange = (modeId: number, field: "principle" | "corrective", value: string) => {
    if (diagnosisSubmitted) return;
    setUserMappings((prev) => ({
      ...prev,
      [modeId]: {
        ...prev[modeId],
        [field]: value
      }
    }));
  };

  const calculateScore = (isTimeOut = false) => {
    const expected = currentDraft.expectedModes;
    const selected = userSelectedModes;

    const correctlyIdentified = selected.filter((m) => expected.includes(m));
    const falsePositives = selected.filter((m) => !expected.includes(m));
    const missed = expected.filter((m) => !selected.includes(m));

    let mappingErrors = 0;
    correctlyIdentified.forEach((modeId) => {
      const actualMode = FAILURE_MODES.find((m) => m.id === modeId);
      const userMap = userMappings[modeId];
      if (actualMode && userMap) {
        if (userMap.principle !== actualMode.principle) mappingErrors++;
        if (userMap.corrective !== actualMode.corrective) mappingErrors++;
      } else {
        mappingErrors += 2;
      }
    });

    if (isTimeOut) {
      setScoreMessage("Time out! The system auto-submitted your current selections.");
      return;
    }

    if (correctlyIdentified.length === expected.length && falsePositives.length === 0 && mappingErrors === 0) {
      setScoreMessage("🎯 Perfect Score! You identified all failure modes, principles, and correctives correctly!");
    } else {
      setScoreMessage(
        `Results: Identified ${correctlyIdentified.length}/${expected.length} active modes. ` +
        (falsePositives.length > 0 ? `Flagged ${falsePositives.length} non-existent modes. ` : "") +
        (missed.length > 0 ? `Missed ${missed.length} modes. ` : "") +
        (mappingErrors > 0 ? `Had ${mappingErrors} incorrect principle/corrective matches.` : "")
      );
    }
  };

  const submitDiagnosis = () => {
    setTimerActive(false);
    setDiagnosisSubmitted(true);
    calculateScore();
  };

  const resetDiagnosis = () => {
    setUserSelectedModes([]);
    setUserMappings({});
    setDiagnosisSubmitted(false);
    setScoreMessage("");
    if (timedMode) {
      startTimer();
    }
  };

  const handleAuditChecklistChange = (modeId: number, answer: boolean) => {
    if (auditSubmitted) return;
    setChecklistAnswers((prev) => ({
      ...prev,
      [modeId]: answer
    }));
  };

  const submitAudit = () => {
    setAuditSubmitted(true);
  };

  const resetAudit = () => {
    setChecklistAnswers({});
    setConfidenceRating(70);
    setAuditSubmitted(false);
    setReadAloudDone(false);
  };

  const getCompromisedParts = () => {
    const parts = new Set<number>();
    
    if (checklistAnswers[1] === false) parts.add(2);
    if (checklistAnswers[4] === false) parts.add(2);
    if (checklistAnswers[2] === false) { parts.add(2); parts.add(4); }
    if (checklistAnswers[3] === false) { parts.add(2); parts.add(4); }
    if (checklistAnswers[5] === false) parts.add(3);
    if (checklistAnswers[6] === false) parts.add(4);
    if (checklistAnswers[7] === false) parts.add(1);
    if (checklistAnswers[8] === false) parts.add(5);

    return Array.from(parts).sort();
  };

  const getFailedAuditCount = () => {
    return Object.values(checklistAnswers).filter(ans => ans === false).length;
  };

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border font-sans"
      style={{
        backgroundColor: BG_TINT,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)"
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>
            Predictive Failure-Mode Quiz
          </h2>
          <p className="text-sm italic text-gray-600">
            Train your diagnostic speed and master the self-audit safety check
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 p-1 bg-amber-950/5 rounded-lg border" style={{ borderColor: HAIRLINE }}>
          <button
            onClick={() => { setActiveTab("diagnosis"); resetDiagnosis(); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "diagnosis" ? "bg-amber-800 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Diagnosis Mode
          </button>
          <button
            onClick={() => { setActiveTab("self-audit"); resetAudit(); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "self-audit" ? "bg-amber-800 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Self-Audit Mode
          </button>
        </div>
      </div>

      {activeTab === "diagnosis" ? (
        // --- DIAGNOSIS MODE ---
        <div>
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Left: Case study & Timing */}
            <div className="lg:w-1/2 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Select Draft Prediction Case Study:</label>
                
                {/* Timed toggle */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-600 cursor-pointer" htmlFor="timed-toggle">
                    Timed Mode
                  </label>
                  <input
                    type="checkbox"
                    id="timed-toggle"
                    checked={timedMode}
                    onChange={(e) => {
                      setTimedMode(e.target.checked);
                      if (e.target.checked) startTimer();
                      else setTimerActive(false);
                    }}
                    className="rounded text-amber-800 focus:ring-amber-800"
                  />
                </div>
              </div>

              {/* Case Selectors */}
              <div className="flex flex-col gap-1.5">
                {activeCuratedDrafts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleDraftChange(d.id)}
                    className="text-left px-3 py-2 text-xs font-semibold rounded border transition-all hover:bg-amber-50"
                    style={{
                      borderColor: selectedDraftId === d.id ? GOLD : HAIRLINE,
                      backgroundColor: selectedDraftId === d.id ? "rgba(156, 122, 47, 0.08)" : "transparent",
                      color: selectedDraftId === d.id ? GOLD : INK_PRIMARY
                    }}
                  >
                    {d.title}
                  </button>
                ))}
              </div>

              {/* Draft Content Card */}
              <div className="p-4 rounded-xl border bg-amber-950/[0.02]" style={{ borderColor: HAIRLINE }}>
                <span className="text-[10px] uppercase tracking-wider block font-bold mb-1" style={{ color: GOLD }}>
                  DRAFT TO DIAGNOSE
                </span>
                <p className="text-sm italic leading-relaxed" style={{ color: INK_SECONDARY }}>
                  "{currentDraft ? currentDraft.text : ""}"
                </p>
              </div>

              {/* Timer Bar */}
              {timedMode && timerActive && (
                <div className="p-3 rounded-lg border bg-amber-50 border-amber-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                    <Clock size={14} className="animate-pulse" /> Time Left: <strong>{timeLeft}s</strong>
                  </span>
                  <div className="w-2/3 bg-amber-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-800 h-full transition-all duration-1000"
                      style={{ width: `${(timeLeft / 45) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Flag modes & Map to principles/fixes */}
            <div className="lg:w-1/2 space-y-4">
              <label className="text-sm font-bold text-gray-700 block">Flag Active Failure Modes & Map Correctives:</label>
              
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {activeFailureModes.map((mode) => {
                  const isSelected = userSelectedModes.includes(mode.id);
                  const isCorrect = currentDraft ? currentDraft.expectedModes.includes(mode.id) : false;
                  
                  return (
                    <div
                      key={mode.id}
                      className="p-3 rounded-xl border transition-all"
                      style={{
                        borderColor: isSelected ? GOLD : HAIRLINE,
                        backgroundColor: isSelected ? "rgba(156, 122, 47, 0.03)" : "white"
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={diagnosisSubmitted}
                          onChange={() => toggleModeSelection(mode.id)}
                          className="rounded text-amber-800 focus:ring-amber-800 border-gray-300"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-bold block">{mode.name}</span>
                        </div>
                        {diagnosisSubmitted && (
                          <span>
                            {isCorrect ? (
                              <CheckCircle size={16} className="text-green-600" />
                            ) : isSelected ? (
                              <XCircle size={16} className="text-red-600" />
                            ) : null}
                          </span>
                        )}
                      </div>

                      {/* Dropdown mappings if checked */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t space-y-2.5" style={{ borderColor: HAIRLINE }}>
                          {/* Map to Principle */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                              Violates Principle:
                            </label>
                            <select
                              disabled={diagnosisSubmitted}
                              value={userMappings[mode.id]?.principle || ""}
                              onChange={(e) => handleMappingChange(mode.id, "principle", e.target.value)}
                              className="w-full text-xs p-1.5 border rounded bg-transparent font-sans"
                            >
                              <option value="">-- Choose Principle --</option>
                              {activeFailureModes.map((m) => (
                                <option key={m.id} value={m.principle}>
                                  {m.principle}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Map to Corrective */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                              System Corrective:
                            </label>
                            <select
                              disabled={diagnosisSubmitted}
                              value={userMappings[mode.id]?.corrective || ""}
                              onChange={(e) => handleMappingChange(mode.id, "corrective", e.target.value)}
                              className="w-full text-xs p-1.5 border rounded bg-transparent font-sans"
                            >
                              <option value="">-- Choose Corrective --</option>
                              {activeFailureModes.map((m) => (
                                <option key={m.id} value={m.corrective}>
                                  {m.corrective}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t" style={{ borderColor: HAIRLINE }}>
            <div className="w-full md:max-w-md">
              {diagnosisSubmitted && (
                <div className="p-3 rounded-lg bg-amber-950/5 border text-xs font-semibold space-y-1">
                  <p className="font-bold text-amber-900">{scoreMessage}</p>
                  <p className="text-gray-600 mt-1">
                    <strong>Solution Rationale:</strong> {currentDraft ? currentDraft.rationale : ""}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetDiagnosis}
                className="px-3 py-1.5 border rounded font-bold text-xs hover:bg-amber-50 transition-all flex items-center gap-1.5"
                style={{ borderColor: HAIRLINE }}
              >
                <RefreshCw size={13} /> Reset
              </button>
              <button
                onClick={submitDiagnosis}
                disabled={diagnosisSubmitted}
                className="px-4 py-2 rounded font-bold text-xs bg-amber-800 text-white hover:bg-amber-900 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                Submit Diagnosis
              </button>
            </div>
          </div>
        </div>
      ) : (
        // --- SELF-AUDIT MODE ---
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Workspace: Draft Input & Read Aloud Check */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Audit Source Text:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAuditTextType("curated")}
                    className={`px-2 py-1 text-[10px] font-bold rounded border ${auditTextType === "curated" ? "bg-amber-800 text-white" : "bg-transparent text-gray-600"}`}
                  >
                    Curated Draft
                  </button>
                  <button
                    onClick={() => setAuditTextType("learner")}
                    className={`px-2 py-1 text-[10px] font-bold rounded border ${auditTextType === "learner" ? "bg-amber-800 text-white" : "bg-transparent text-gray-600"}`}
                  >
                    Compose Custom
                  </button>
                </div>
              </div>

              {auditTextType === "curated" ? (
                <div className="space-y-3">
                  <select
                    value={selectedAuditDraftId}
                    onChange={(e) => setSelectedAuditDraftId(e.target.value)}
                    className="w-full text-xs p-2 border rounded bg-transparent font-sans"
                    style={{ borderColor: HAIRLINE }}
                  >
                    {activeCuratedDrafts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                  <div className="p-3.5 rounded-xl border bg-amber-950/[0.01]" style={{ borderColor: HAIRLINE }}>
                    <span className="text-[10px] uppercase tracking-wider block font-bold mb-1" style={{ color: GOLD }}>
                      ACTIVE CURATED DRAFT
                    </span>
                    <p className="text-xs italic leading-relaxed text-gray-700">
                      "{currentAuditDraft ? currentAuditDraft.text : ""}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={customAuditText}
                    onChange={(e) => setCustomAuditText(e.target.value)}
                    placeholder="Paste or compose your astrological prediction write-up draft here..."
                    className="w-full text-xs p-3 border rounded bg-white text-gray-800 focus:ring-amber-800 focus:border-amber-800"
                    style={{ borderColor: HAIRLINE }}
                  />
                </div>
              )}

              {/* Read Aloud Checklist Card */}
              <div
                className="p-4 rounded-xl border bg-amber-50/50 space-y-3"
                style={{ borderColor: HAIRLINE }}
              >
                <div className="flex items-start gap-2.5">
                  <Volume2 size={16} className="text-amber-800 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block text-amber-900">Read-Aloud Calibration</span>
                    <p className="text-[10px] text-gray-600 leading-normal">
                      Vocalizing the reading bypasses analytical blindness and flags hidden fatalism-leak (commands, absolute outcomes, dates spoken as decree).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="read-aloud-check"
                    checked={readAloudDone}
                    onChange={(e) => setReadAloudDone(e.target.checked)}
                    className="rounded text-amber-800 focus:ring-amber-800"
                  />
                  <label htmlFor="read-aloud-check" className="text-xs font-bold text-amber-950 cursor-pointer">
                    I have read this draft prediction aloud.
                  </label>
                </div>
              </div>

              {/* Pre-Audit Confidence Slider */}
              <div className="p-4 rounded-xl border bg-white space-y-3" style={{ borderColor: HAIRLINE }}>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Sliders size={13} /> Pre-Audit Reader Confidence:
                  </label>
                  <span className="text-xs font-bold font-mono" style={{ color: GOLD }}>{confidenceRating}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={confidenceRating}
                  disabled={auditSubmitted}
                  onChange={(e) => setConfidenceRating(Number(e.target.value))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-semibold text-gray-400">
                  <span>CAUTIOUS / WEAK</span>
                  <span>BALANCED</span>
                  <span>UNSHAKABLE / SURE</span>
                </div>
              </div>
            </div>

            {/* Right Workspace: The 8-Question Audit Checklist */}
            <div className="lg:col-span-7 space-y-4">
              <label className="text-sm font-bold text-gray-700 block">The 8-Point Safe-Prediction Checklist:</label>
              
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {FAILURE_MODES.map((mode) => {
                  const currentAnswer = checklistAnswers[mode.id];
                  
                  return (
                    <div
                      key={mode.id}
                      className="p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white"
                      style={{ borderColor: HAIRLINE }}
                    >
                      <div className="flex-1 space-y-0.5">
                        <span className="text-xs font-bold text-gray-800 block">
                          Q{mode.id}. {mode.name} Check
                        </span>
                        <p className="text-[10px] text-gray-500 leading-normal">
                          Is the draft clean of this error? (Principle: <em>{mode.principle}</em>)
                        </p>
                      </div>

                      {/* Yes/No inputs */}
                      <div className="flex gap-2">
                        <button
                          disabled={auditSubmitted}
                          onClick={() => handleAuditChecklistChange(mode.id, true)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            currentAnswer === true
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-transparent text-gray-600 hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          Yes (Clean)
                        </button>
                        <button
                          disabled={auditSubmitted}
                          onClick={() => handleAuditChecklistChange(mode.id, false)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            currentAnswer === false
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-transparent text-gray-600 hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          No (Flagged)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row & Feedback Analysis */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pt-4 border-t" style={{ borderColor: HAIRLINE }}>
            <div className="w-full md:max-w-2xl">
              {auditSubmitted && (
                <div className="space-y-4">
                  {/* Results summary bar */}
                  <div className="p-3 rounded-lg bg-amber-950/5 border text-xs font-semibold flex flex-col md:flex-row gap-4 items-center">
                    <span className="flex items-center gap-1.5 text-amber-950">
                      <AlertTriangle size={15} /> Flagged Failures: <strong>{getFailedAuditCount()}</strong>
                    </span>
                    <span className="hidden md:inline text-gray-300">|</span>
                    <span className="text-gray-600">
                      Compromised Write-Up Parts:{" "}
                      {getCompromisedParts().length > 0 ? (
                        getCompromisedParts().map((part) => (
                          <span
                            key={part}
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-800 text-white mx-0.5"
                          >
                            Part {part}
                          </span>
                        ))
                      ) : (
                        <span className="text-green-700 font-bold">None (All clear!)</span>
                      )}
                    </span>
                  </div>

                  {/* High Confidence Correlation Alert */}
                  {confidenceRating >= 80 && getFailedAuditCount() > 0 && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-950 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-red-700" /> High-Confidence Bias Detected!
                      </p>
                      <p className="text-gray-600">
                        Your pre-audit reader confidence was set to <strong>{confidenceRating}%</strong>, yet the checklist surfaced <strong>{getFailedAuditCount()}</strong> failure modes in the text. Warm, confident drafts tend to mask structural and tone errors. Audit your most confident drafts twice as hard!
                      </p>
                    </div>
                  )}

                  {/* Read Aloud Warning */}
                  {!readAloudDone && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
                      <p className="font-bold">⚠️ Read Aloud Incomplete</p>
                      <p className="text-gray-600">
                        We strongly suggest speaking the draft aloud to scan for any hidden fatalism-leak or decree language before signing off the audit.
                      </p>
                    </div>
                  )}

                  {/* List of correctives for flagged items */}
                  {getFailedAuditCount() > 0 && (
                    <div className="p-4 rounded-xl border bg-white space-y-3" style={{ borderColor: HAIRLINE }}>
                      <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-500">
                        RECOMMENDED WORKFLOW CORRECTIVES
                      </span>
                      <div className="space-y-3">
                        {FAILURE_MODES.map((mode) => {
                          if (checklistAnswers[mode.id] === false) {
                            return (
                              <div key={mode.id} className="text-xs border-l-2 pl-3 py-0.5" style={{ borderColor: GOLD }}>
                                <span className="font-bold block text-gray-800">
                                  {mode.name} (Q{mode.id} Flag)
                                </span>
                                <p className="text-gray-600 mt-0.5">
                                  <strong>Corrective Action:</strong> {mode.corrective}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 self-end">
              <button
                onClick={resetAudit}
                className="px-3 py-1.5 border rounded font-bold text-xs hover:bg-amber-50 transition-all flex items-center gap-1.5"
                style={{ borderColor: HAIRLINE }}
              >
                <RefreshCw size={13} /> Reset
              </button>
              <button
                onClick={submitAudit}
                disabled={auditSubmitted || Object.keys(checklistAnswers).length < 8}
                className="px-4 py-2 rounded font-bold text-xs bg-amber-800 text-white hover:bg-amber-900 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                Submit Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
