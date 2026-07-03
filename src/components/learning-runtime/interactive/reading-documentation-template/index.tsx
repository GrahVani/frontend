"use client";

import React, { useState, useMemo } from "react";
import { Compass, Info, Check, Copy, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles, Award } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

// Lesson Achievements definition
interface Achievement {
  id: string;
  label: string;
  done: boolean;
}

export function ReadingDocumentationTemplate() {
  const [activePreset, setActivePreset] = useState<"custom" | "marriage" | "career">("custom");
  const [activeLessonTab, setActiveLessonTab] = useState<1 | 2 | 4 | 5>(1);

  // Form States
  const [clientName, setClientName] = useState("");
  const [question, setQuestion] = useState("");
  const [birthDetails, setBirthDetails] = useState("");
  const [ayanamsha, setAyanamsha] = useState("");
  const [houseSystem, setHouseSystem] = useState("");
  const [btrStatus, setBtrStatus] = useState<"proceed" | "caveat" | "rectified">("proceed");

  // Indicators (Step 1-4)
  const [indicatorCapacity, setIndicatorCapacity] = useState("");
  const [indicatorYogas, setIndicatorYogas] = useState("");
  const [indicatorDasha, setIndicatorDasha] = useState("");
  const [indicatorTransits, setIndicatorTransits] = useState("");

  // Confidence & Verification
  const [crossStream, setCrossStream] = useState<"convergent" | "divergent">("convergent");
  const [eventConfidence, setEventConfidence] = useState(50);
  const [timingConfidence, setTimingConfidence] = useState(50);

  // Caveats, Ethics & Follow-up
  const [caveats, setCaveats] = useState("");
  const [ethics, setEthics] = useState("");
  const [followUp, setFollowUp] = useState("");

  // Consent & Purpose
  const [consent, setConsent] = useState(false);
  const [purpose, setPurpose] = useState("");

  const [copied, setCopied] = useState(false);

  // Auto-generate Case ID
  const caseId = useMemo(() => {
    return "CASE-" + Math.floor(1000 + Math.random() * 9000);
  }, []);

  // Presets Handlers
  const handlePresetSelect = (preset: "custom" | "marriage" | "career") => {
    setActivePreset(preset);
    if (preset === "custom") {
      setClientName("");
      setQuestion("");
      setBirthDetails("");
      setAyanamsha("");
      setHouseSystem("");
      setBtrStatus("proceed");
      setIndicatorCapacity("");
      setIndicatorYogas("");
      setIndicatorDasha("");
      setIndicatorTransits("");
      setCrossStream("convergent");
      setEventConfidence(50);
      setTimingConfidence(50);
      setCaveats("");
      setEthics("");
      setFollowUp("");
      setConsent(false);
      setPurpose("");
    } else if (preset === "marriage") {
      setClientName("Anjali Sharma");
      setQuestion("Will I get married during the upcoming Jupiter-Venus dasha sequence (late 2026)?");
      setBirthDetails("October 14, 1994, 08:32 AM, Delhi, India");
      setAyanamsha("Lahiri");
      setHouseSystem("Whole Sign");
      setBtrStatus("proceed");
      setIndicatorCapacity("Jupiter is strong in Taurus (9th house of marriage aspects), Venus is own-sign in Libra (2nd house of family).");
      setIndicatorYogas("Dara-karaka aspects the Chara Dasha sign, forming strong timing convergence.");
      setIndicatorDasha("Entering Jupiter-Venus Dasha (Jupiter rules 7th house, Venus rules 2nd house).");
      setIndicatorTransits("Transiting Jupiter aspects natal 7th house; Saturn double-aspects 7th house of marriage.");
      setCrossStream("convergent");
      setEventConfidence(90);
      setTimingConfidence(85);
      setCaveats("Requires remaining within standard family counseling settings; minor delay if Saturn is retrograding.");
      setEthics("Counsel client to focus on emotional compatibility; avoid deterministic absolute guarantees.");
      setFollowUp("Revisit transits in late 2026.");
      setConsent(true);
      setPurpose("Personal relationship advice and family planning.");
      setActiveLessonTab(4);
    } else if (preset === "career") {
      setClientName("Rohan Varma");
      setQuestion("Should I quit my corporate job to start a business in mid-2027?");
      setBirthDetails("March 22, 1988, 14:15 PM, Mumbai, India");
      setAyanamsha("Lahiri");
      setHouseSystem("Whole Sign");
      setBtrStatus("caveat");
      setIndicatorCapacity("Sun in 10th (strong status), but 10th lord Venus in 8th (dignity afflicted).");
      setIndicatorYogas("No supportive yogas; minor Shatru-dosha active.");
      setIndicatorDasha("Mars-Rahu dasha (Mars rules 6th of disputes, Rahu causes sudden impulses).");
      setIndicatorTransits("Saturn transits 12th house (expenditures, high business risk); Jupiter transits 4th house.");
      setCrossStream("divergent");
      setEventConfidence(40);
      setTimingConfidence(25);
      setCaveats("Extremely high financial risk; business starting coordinates lack sub-lord verification.");
      setEthics("Advise caution, retain current corporate role as safety guard, recommend professional skill upskilling before launch.");
      setFollowUp("Re-examine BTR rectifications in late 2027.");
      setConsent(true);
      setPurpose("Career transition feasibility assessment.");
      setActiveLessonTab(5);
    }
  };

  // Lesson Specific achievements
  const achievements = useMemo(() => {
    const hasIndicators = !!(indicatorCapacity && indicatorYogas && indicatorDasha && indicatorTransits);
    const hasConfidence = eventConfidence !== 50 || timingConfidence !== 50;
    
    if (activeLessonTab === 1) {
      return [
        { id: "verbatim", label: "Enter verbatim client question", done: !!question },
        { id: "settings", label: "Specify Ayanāmśa and House System", done: !!(ayanamsha && houseSystem) },
        { id: "order", label: "Reasoning before Verdict (indicators before confidence)", done: hasIndicators && hasConfidence }
      ];
    }
    if (activeLessonTab === 2) {
      return [
        { id: "consent_off", label: "Test consent off (observe REDACTION status)", done: !consent },
        { id: "consent_on", label: "Test consent staged to authorize case-log entry", done: consent },
        { id: "minimization", label: "Input structured purpose without sensitive third-party logs", done: !!purpose }
      ];
    }
    if (activeLessonTab === 4) {
      return [
        { id: "load_marriage", label: "Load Worked Case 1 preset", done: activePreset === "marriage" },
        { id: "check_convergent", label: "Verify cross-stream is convergent", done: activePreset === "marriage" && crossStream === "convergent" },
        { id: "export_marriage", label: "Verify high confidence (>=80%) write-up is exportable", done: activePreset === "marriage" && consent }
      ];
    }
    return [
      { id: "load_career", label: "Load Worked Case 2 preset", done: activePreset === "career" },
      { id: "check_divergent", label: "Verify cross-stream is divergent", done: activePreset === "career" && crossStream === "divergent" },
      { id: "check_downgrade", label: "Observe timing confidence capped below 50% due to divergence", done: activePreset === "career" && timingConfidence <= 50 }
    ];
  }, [activeLessonTab, question, ayanamsha, houseSystem, indicatorCapacity, indicatorYogas, indicatorDasha, indicatorTransits, eventConfidence, timingConfidence, consent, purpose, activePreset, crossStream]);

  // Senior Astrologer commentary on Split Confidence Tiers
  const confidenceCommentary = useMemo(() => {
    const gap = Math.abs(eventConfidence - timingConfidence);
    if (gap >= 30) {
      return "High promise but high timing volatility. Typical when main house significators are strong, but transits/dasha transitions present friction.";
    }
    if (eventConfidence >= 80 && timingConfidence >= 80) {
      return "Convergent Timing Lock. Excellent alignment; safe to predict clean event delivery.";
    }
    if (eventConfidence <= 40) {
      return "Afflicted promise. Focus client consultation on mitigation, spiritual remedies, or structural rectifications.";
    }
    return "Balanced reading. Propose caveats to client, highlighting minor delays or conditional milestones.";
  }, [eventConfidence, timingConfidence]);

  // Live guards check
  const guards = useMemo(() => {
    const list: { type: "success" | "warning" | "danger"; label: string; desc: string }[] = [];

    if (!ayanamsha || !houseSystem) {
      list.push({
        type: "warning",
        label: "Settings Unspecified",
        desc: "Ayanāmśa or House System choice is left empty. Specify settings to ensure reproducibility."
      });
    }

    const hasIndicators = indicatorCapacity && indicatorYogas && indicatorDasha && indicatorTransits;
    const hasConfidence = eventConfidence !== 50 || timingConfidence !== 50;
    if (hasConfidence && !hasIndicators) {
      list.push({
        type: "danger",
        label: "Verdict Precedes Indicators",
        desc: "A final confidence rating has been set before detailing the four-step indicators. Enforce reasoning before verdict."
      });
    }

    if (crossStream === "divergent" && (eventConfidence > 50 || timingConfidence > 50)) {
      list.push({
        type: "danger",
        label: "Divergence Over-Confidence",
        desc: "Cross-stream checks are marked as Divergent, yet confidence scores exceed 50%. Divergent signals require downgrading predictive stakes."
      });
    }

    const missingFields: string[] = [];
    if (!caveats) missingFields.push("Caveats");
    if (!ethics) missingFields.push("Ethical Care Framing");

    if (missingFields.length > 0) {
      list.push({
        type: "warning",
        label: "Incomplete Sections",
        desc: `Required safeguards missing: ${missingFields.join(", ")}. Document these to make the record accountable.`
      });
    }

    if (!consent) {
      list.push({
        type: "danger",
        label: "Consent Blocked",
        desc: "Client confidentiality consent flag is false. Case-log exporting and third-party transmission are blocked."
      });
    }

    return list;
  }, [ayanamsha, houseSystem, indicatorCapacity, indicatorYogas, indicatorDasha, indicatorTransits, eventConfidence, timingConfidence, crossStream, caveats, ethics, consent]);

  // Standard Document preview
  const renderedDocument = useMemo(() => {
    return `# ASTROLOGICAL CONSULTATION RECORD
Case ID: ${caseId}
Question Type: ${purpose || "Unstated"}

## SECTION 1: QUESTION (AS ASKED)
"${question || "(No question entered)"}"

## SECTION 2: DATA VERDICT & SYSTEM SETTINGS
- **Ayanāmśa:** ${ayanamsha || "Unstated"}
- **House System:** ${houseSystem || "Unstated"}
- **BTR Verification:** ${btrStatus.toUpperCase()}
- **Birth Details:** ${consent ? birthDetails : "[REDACTED FOR CONFIDENTIALITY]"}

## SECTION 3: PLANETARY INDICATORS (FOUR-STEP ANALYSIS)
- **1. Capacity (Dignity/Shadbala):** ${indicatorCapacity || "Pending"}
- **2. Combinations (Yogas/Doshas):** ${indicatorYogas || "Pending"}
- **3. Dasha Period timing:** ${indicatorDasha || "Pending"}
- **4. Transit (Gochara) support:** ${indicatorTransits || "Pending"}

## SECTION 4: PREDICTIVE CONFIDENCE & CONVERGENCE
- **Event Occurrence Confidence:** ${eventConfidence}%
- **Timing/Delivery Confidence:** ${timingConfidence}%
- **Cross-Stream verification:** ${crossStream.toUpperCase()}

## SECTION 5: CAVEATS & BOUNDARY GUARDS
${caveats || "(No caveats documented)"}

## SECTION 6: ETHICAL CARE FRAMING & FOLLOW-UP
- **Supportive counseling care:** ${ethics || "(No framing documented)"}
- **Follow-up target timeline:** ${followUp || "Unstated"}`;
  }, [caseId, question, ayanamsha, houseSystem, btrStatus, birthDetails, consent, indicatorCapacity, indicatorYogas, indicatorDasha, indicatorTransits, eventConfidence, timingConfidence, crossStream, caveats, ethics, followUp, purpose]);

  // Pseudonymised entry
  const pseudonymisedCaseLog = useMemo(() => {
    return JSON.stringify(
      {
        caseId,
        questionType: purpose || "General Consultation",
        predictionSummary: question ? `Assessed query: "${question.slice(0, 40)}..."` : "Pending query",
        crossStreamResult: crossStream,
        eventConfidenceTier: `${eventConfidence}%`,
        timingConfidenceTier: `${timingConfidence}%`,
        recordStagedDate: new Date().toISOString().split("T")[0],
        verdictOutcome: "BLANK (To be recorded at outcome window)"
      },
      null,
      2
    );
  }, [caseId, purpose, question, crossStream, eventConfidence, timingConfidence]);

  const copyToClipboard = () => {
    if (!consent) return;
    navigator.clipboard.writeText(renderedDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border font-sans animate-fade-in"
      style={{
        backgroundColor: BG_TINT,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)"
      }}
    >
      <div className="pb-4 border-b mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900 animate-fade-in" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Reading Documentation Template
          </h2>
          <p className="text-xs italic text-gray-600">
            Chapter 5: Document client consultations in the six-section standard with active consent guards.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.5.1
        </div>
      </div>

      {/* Interactive Achievements Panel */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
              <Award size={11} className="text-amber-800" /> Active Lesson Tasks & Achievments
            </span>
            <p className="text-xs text-gray-600">Choose a lesson tab to guide your custom entry or preset tests.</p>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 bg-amber-950/5 p-0.5 rounded-lg border" style={{ borderColor: HAIRLINE }}>
            {[1, 2, 4, 5].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLessonTab(tab as any)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                  activeLessonTab === tab ? "bg-amber-800 text-white shadow-sm" : "text-gray-600 hover:text-amber-950"
                }`}
              >
                Lesson {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List of achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t pt-3" style={{ borderColor: HAIRLINE }}>
          {achievements.map((ach) => (
            <div key={ach.id} className="flex items-center gap-2.5 p-2 rounded-lg border bg-amber-50/10 text-xs font-semibold" style={{ borderColor: ach.done ? "rgba(22, 163, 74, 0.2)" : HAIRLINE }}>
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${ach.done ? "bg-green-700 animate-scale-up" : "bg-gray-300"}`}>
                {ach.done ? "✓" : "-"}
              </div>
              <span className={ach.done ? "text-gray-800 font-bold" : "text-gray-400 font-medium"}>{ach.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Presets Cockpit */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ borderColor: HAIRLINE }}>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-800" /> Presets cockpit
          </span>
          <p className="text-xs text-gray-600">Quickly load convergent or divergent worked cases from lessons.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePresetSelect("marriage")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              activePreset === "marriage" ? "bg-green-700 text-white border-green-700" : "bg-transparent text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderColor: activePreset === "marriage" ? "transparent" : HAIRLINE }}
          >
            Load Worked Case 1 (Marriage)
          </button>
          <button
            onClick={() => handlePresetSelect("career")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              activePreset === "career" ? "bg-amber-800 text-white border-amber-850" : "bg-transparent text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderColor: activePreset === "career" ? "transparent" : HAIRLINE }}
          >
            Load Worked Case 2 (Career)
          </button>
          <button
            onClick={() => handlePresetSelect("custom")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              activePreset === "custom" ? "bg-gray-800 text-white border-gray-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderColor: activePreset === "custom" ? "transparent" : HAIRLINE }}
          >
            Clear Form
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Entry Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1 & 2: Client context */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">Client & System Settings</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Client Name / Code:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-xs p-2 border rounded focus:ring-amber-800"
                  placeholder="e.g. Anjali Sharma"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Purpose / Domain:</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full text-xs p-2 border rounded focus:ring-amber-800"
                  placeholder="e.g. Marriage Question"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Verbatim Client Question:</label>
              <textarea
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full text-xs p-2 border rounded focus:ring-amber-800 font-sans"
                placeholder="Type the exact question asked..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Ayanāmśa System:</label>
                <input
                  type="text"
                  value={ayanamsha}
                  onChange={(e) => setAyanamsha(e.target.value)}
                  className="w-full text-xs p-1.5 border rounded focus:ring-amber-800"
                  placeholder="Lahiri / Raman / KP"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">House System:</label>
                <input
                  type="text"
                  value={houseSystem}
                  onChange={(e) => setHouseSystem(e.target.value)}
                  className="w-full text-xs p-1.5 border rounded focus:ring-amber-800"
                  placeholder="Whole Sign / Placidus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">BTR Status Check:</label>
                <select
                  value={btrStatus}
                  onChange={(e) => setBtrStatus(e.target.value as any)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                >
                  <option value="proceed">Proceed (Verified)</option>
                  <option value="caveat">Caveat (Approx)</option>
                  <option value="rectified">Rectified (BTR Done)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Indicators */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">Four-Step Astrological Indicators</span>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">1. Capacity (Dignity & Shadbala):</label>
              <textarea
                rows={2}
                value={indicatorCapacity}
                onChange={(e) => setIndicatorCapacity(e.target.value)}
                className="w-full text-xs p-2 border rounded focus:ring-amber-800 font-sans"
                placeholder="Document planetary nobility and raw execution capacity..."
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">2. Combinations (Yogas & Doshas):</label>
              <textarea
                rows={2}
                value={indicatorYogas}
                onChange={(e) => setIndicatorYogas(e.target.value)}
                className="w-full text-xs p-2 border rounded focus:ring-amber-800 font-sans"
                placeholder="Note active Pancha Mahapurusha yogas or isolation doshas..."
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">3. Dasha Timing Context:</label>
              <textarea
                rows={2}
                value={indicatorDasha}
                onChange={(e) => setIndicatorDasha(e.target.value)}
                className="w-full text-xs p-2 border rounded focus:ring-amber-800 font-sans"
                placeholder="Verify Vimshottari / Chara Dasha lords ownership..."
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">4. Transit Triggers (Gochara):</label>
              <textarea
                rows={2}
                value={indicatorTransits}
                onChange={(e) => setIndicatorTransits(e.target.value)}
                className="w-full text-xs p-2 border rounded focus:ring-amber-800 font-sans"
                placeholder="Check double aspect trigger intersections on target houses..."
              />
            </div>
          </div>

          {/* Section 4 & 5: Confidence, Caveats & Ethics */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">Confidence, Safeguards & Ethics</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-bold text-gray-500">Cross-Stream Result:</label>
                <select
                  value={crossStream}
                  onChange={(e) => {
                    setCrossStream(e.target.value as any);
                    if (e.target.value === "divergent") {
                      // Cap confidence on divergence
                      if (eventConfidence > 50) setEventConfidence(50);
                      if (timingConfidence > 50) setTimingConfidence(50);
                    }
                  }}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-bold"
                >
                  <option value="convergent">Convergent (System Agreement)</option>
                  <option value="divergent">Divergent (Conflicting Streams)</option>
                </select>
              </div>
              <div className="space-y-2">
                {/* Event Confidence slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-gray-600">
                    <span>Event Occurrence Confidence:</span>
                    <span className="font-mono text-amber-800">{eventConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={crossStream === "divergent" ? "50" : "100"}
                    value={eventConfidence}
                    onChange={(e) => setEventConfidence(Number(e.target.value))}
                    className="w-full accent-amber-800 cursor-pointer"
                  />
                </div>
                {/* Timing Confidence slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-gray-600">
                    <span>Timing Precision Confidence:</span>
                    <span className="font-mono text-amber-800">{timingConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={crossStream === "divergent" ? "50" : "100"}
                    value={timingConfidence}
                    onChange={(e) => setTimingConfidence(Number(e.target.value))}
                    className="w-full accent-amber-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Split Tiers Commentary box */}
            <div className="p-3 rounded border text-xs bg-amber-50/10" style={{ borderColor: HAIRLINE }}>
              <span className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">Astrologer Commentary (Confidence analysis)</span>
              <p className="text-gray-600 font-medium italic">"{confidenceCommentary}"</p>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Section 5: Caveats & Limits:</label>
              <textarea
                rows={2}
                value={caveats}
                onChange={(e) => setCaveats(e.target.value)}
                className="w-full text-xs p-2 border rounded focus:ring-amber-800 font-sans"
                placeholder="Highlight dependency limitations or risk factors..."
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Section 6: Ethical care framing:</label>
              <textarea
                rows={2}
                value={ethics}
                onChange={(e) => setEthics(e.target.value)}
                className="w-full text-xs p-2 border rounded focus:ring-amber-800 font-sans"
                placeholder="Structure client counseling delivery notes here..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Follow-up timeline:</label>
                <input
                  type="text"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="w-full text-xs p-1.5 border rounded focus:ring-amber-800"
                  placeholder="e.g. Revisit late 2026"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Confidentiality Consent:</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (e.target.checked && activePreset === "custom") {
                        setBirthDetails("Staging chart coordinates");
                      }
                    }}
                    className="accent-amber-800"
                  />
                  Consent Staged
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Document Draft & Live Guards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Confidentiality Shield visual */}
          <div className="p-4 rounded-xl border bg-white shadow-sm flex items-center gap-4" style={{ borderColor: HAIRLINE }}>
            <div className="shrink-0">
              {consent ? (
                <div className="p-2.5 bg-green-50 rounded-full border border-green-200 text-green-700">
                  <ShieldCheck size={26} className="animate-pulse" />
                </div>
              ) : (
                <div className="p-2.5 bg-red-50 rounded-full border border-red-200 text-red-700">
                  <ShieldAlert size={26} />
                </div>
              )}
            </div>
            <div className="space-y-0.5 text-xs">
              <strong className="block font-bold text-gray-800">
                {consent ? "Confidentiality Shield: AUTHORIZED" : "Confidentiality Shield: SECURED"}
              </strong>
              <p className="text-gray-500 text-[11px] leading-normal font-normal">
                {consent
                  ? "Consent is active. Pseudonymised case logs and copy functions are fully authorized."
                  : "Private details are redacted from preview templates. Copy and log export are blocked."}
              </p>
            </div>
          </div>

          {/* Live Alerts Area */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">Compliance Guard Alerts</span>
            <div className="space-y-2">
              {guards.length === 0 ? (
                <div className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 p-2.5 rounded border border-green-100">
                  <Check size={14} /> All compliance checks passed. Staging draft is ready!
                </div>
              ) : (
                guards.map((guard, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded border text-xs leading-relaxed flex items-start gap-2.5 ${
                      guard.type === "danger"
                        ? "bg-red-50 border-red-200 text-red-950"
                        : "bg-amber-50 border-amber-200 text-amber-950"
                    }`}
                  >
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <div>
                      <strong className="block font-bold">{guard.label}</strong>
                      <span className="text-[11px] text-gray-600 block leading-normal mt-0.5">{guard.desc}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Six-Section standard preview */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
              <span className="text-[10px] uppercase font-bold text-gray-400">Document Draft Preview</span>
              <button
                onClick={copyToClipboard}
                disabled={!consent}
                className={`px-2 py-1 text-[10px] font-bold rounded border transition-all flex items-center gap-1.5 bg-transparent ${
                  consent ? "hover:bg-amber-50 cursor-pointer" : "opacity-40 cursor-not-allowed"
                }`}
                style={{ borderColor: HAIRLINE }}
              >
                {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy Draft"}
              </button>
            </div>
            <textarea
              readOnly
              rows={14}
              value={renderedDocument}
              className="w-full text-[10px] font-mono p-3 border rounded bg-amber-950/[0.01] text-gray-600 focus:outline-none leading-relaxed"
              style={{ borderColor: HAIRLINE }}
            />
          </div>

          {/* Case Log Pseudonymised Output */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Case-Log Pseudonymised Entry (Lesson 2.5.3)
            </span>
            {consent ? (
              <pre className="w-full text-[9px] font-mono p-3 border rounded bg-gray-50 text-gray-600 overflow-x-auto leading-relaxed">
                {pseudonymisedCaseLog}
              </pre>
            ) : (
              <div className="text-[10px] text-gray-400 italic text-center py-6">
                Client consent flag must be checked to generate pseudonymised case-log entries.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
