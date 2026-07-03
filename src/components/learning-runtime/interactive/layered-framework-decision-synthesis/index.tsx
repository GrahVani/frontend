"use client";

import { useMemo, useState } from "react";
import { Info, ShieldAlert, Split, CheckCircle, HelpCircle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { PRESETS } from "../layered-shared-data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function LayeredFrameworkDecisionSynthesis() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("q5");
  const [customQuestionText, setCustomQuestionText] = useState("");
  const [questionTypeOverride, setQuestionTypeOverride] = useState<string>("");
  const [selectedLayers, setSelectedLayers] = useState<string[]>(["kp", "jaimini"]);
  const [compoundSplit, setCompoundSplit] = useState<boolean>(true);

  // Verdict states
  const [verdictBase, setVerdictBase] = useState<"supports" | "neutral" | "denies">("supports");
  const [verdictKp, setVerdictKp] = useState<"supports" | "neutral" | "denies">("supports");
  const [verdictJaimini, setVerdictJaimini] = useState<"supports" | "neutral" | "denies">("supports");
  const [verdictLalKitab, setVerdictLalKitab] = useState<"supports" | "neutral" | "denies">("neutral");
  const [verdictTajika, setVerdictTajika] = useState<"supports" | "neutral" | "denies">("neutral");

  const preset = useMemo(() => {
    return PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  }, [selectedPresetId]);

  const activeQuestionText = customQuestionText || preset.text;

  const suggestedType = useMemo(() => {
    if (questionTypeOverride) return questionTypeOverride;
    if (customQuestionText) {
      const lower = customQuestionText.toLowerCase();
      if (lower.includes("should") || lower.includes("remedy") || lower.includes("do about")) return "remedy";
      if (lower.includes("when") || lower.includes("will i")) return "binary";
      if (lower.includes("year") || lower.includes("annual")) return "year";
      if (lower.includes("calling") || lower.includes("purpose")) return "purpose";
      return "compound";
    }
    return preset.suggestedType;
  }, [customQuestionText, preset, questionTypeOverride]);

  const isCompound = suggestedType === "compound";

  const handleStreamToggle = (stream: string) => {
    if (selectedLayers.includes(stream)) {
      setSelectedLayers(selectedLayers.filter(s => s !== stream));
    } else {
      setSelectedLayers([...selectedLayers, stream]);
    }
  };

  const showOverLayerWarning = selectedLayers.length >= 3;

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="layered-framework-decision-synthesis"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Layered Framework Decision Synthesis
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Decompose compound queries and synthesize cross-stream verdicts
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider mb-1 font-bold font-sans" style={{ color: GOLD }}>
            Select Query Preset
          </label>
          <select
            value={selectedPresetId}
            onChange={(e) => {
              setSelectedPresetId(e.target.value);
              setCustomQuestionText("");
              setQuestionTypeOverride("");
              const selectedPreset = PRESETS.find(p => p.id === e.target.value);
              if (selectedPreset) {
                setSelectedLayers(selectedPreset.recommendedLayers);
              }
            }}
            className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
            style={{ borderColor: HAIRLINE }}
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id} style={{ background: SURFACE }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Custom question entry */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2" style={{ color: GOLD }}>Or Enter Custom Question:</label>
        <input
          type="text"
          value={customQuestionText}
          onChange={(e) => setCustomQuestionText(e.target.value)}
          placeholder="e.g. Will I get a job this year, and what is my calling?"
          className="w-full p-2 border rounded bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
          style={{ borderColor: HAIRLINE }}
        />
      </div>

      {/* Classification details */}
      <div className="mb-6 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/30" style={{ borderColor: HAIRLINE }}>
        <div>
          <span className="text-xs uppercase tracking-wider block font-bold text-amber-800 font-sans">Classification:</span>
          <span className="text-lg font-bold capitalize">{suggestedType} Question</span>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider mb-1 font-bold text-amber-850 font-sans">Manual Override Type:</label>
          <select
            value={questionTypeOverride}
            onChange={(e) => setQuestionTypeOverride(e.target.value)}
            className="px-2 py-1 text-xs border rounded bg-transparent font-sans font-semibold"
            style={{ borderColor: HAIRLINE }}
          >
            <option value="">(Suggested Auto)</option>
            <option value="binary">Binary (KP)</option>
            <option value="purpose">Purpose/Calling (Jaimini)</option>
            <option value="remedy">Remedy (Lal Kitab)</option>
            <option value="year">Year Ahead (Tajika)</option>
            <option value="compound">Compound (Multi-stream)</option>
          </select>
        </div>
      </div>

      {/* Grid containing Routing Map SVG and Layers multi-select */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Left Side: SVG Routing Map */}
        <div className="w-full bg-white/50 border rounded-lg p-6 shadow-inner flex flex-col items-center justify-center" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider mb-4 font-bold font-sans text-gray-500">Visual Stream Routing Map</span>
          <svg className="w-full max-w-[280px] h-48" viewBox="0 0 100 80">
            {/* Center Node (Synthesis Base) */}
            <circle cx="50" cy="50" r="8" fill={showOverLayerWarning ? "#dc2626" : "#78350f"} className="transition-all duration-300" />
            <text x="50" y="49" fontSize="2.5" fontWeight="bold" fill="#fff" textAnchor="middle">SYNTHESIS</text>
            <text x="50" y="53" fontSize="2.5" fontWeight="bold" fill="#fff" textAnchor="middle">
              {showOverLayerWarning ? "NOISE" : "CALIBRATED"}
            </text>

            {/* Streams Nodes and lines */}
            {/* KP */}
            <circle cx="15" cy="20" r="5" fill={selectedLayers.includes("kp") ? "#d97706" : "#e2e8f0"} />
            <text x="15" y="21.5" fontSize="3" fontWeight="bold" fill={selectedLayers.includes("kp") ? "#fff" : "#94a3b8"} textAnchor="middle">KP</text>
            <path d="M 19 23 L 43 45" stroke={selectedLayers.includes("kp") ? "#d97706" : "#e2e8f0"} strokeWidth={selectedLayers.includes("kp") ? "1.5" : "0.5"} strokeDasharray={selectedLayers.includes("kp") ? "none" : "2,2"} />

            {/* Jaimini */}
            <circle cx="35" cy="15" r="5" fill={selectedLayers.includes("jaimini") ? "#7c3aed" : "#e2e8f0"} />
            <text x="35" y="16.5" fontSize="2.5" fontWeight="bold" fill={selectedLayers.includes("jaimini") ? "#fff" : "#94a3b8"} textAnchor="middle">JAI</text>
            <path d="M 37 19 L 47 42" stroke={selectedLayers.includes("jaimini") ? "#7c3aed" : "#e2e8f0"} strokeWidth={selectedLayers.includes("jaimini") ? "1.5" : "0.5"} strokeDasharray={selectedLayers.includes("jaimini") ? "none" : "2,2"} />

            {/* Tajika */}
            <circle cx="65" cy="15" r="5" fill={selectedLayers.includes("tajika") ? "#2563eb" : "#e2e8f0"} />
            <text x="65" y="16.5" fontSize="2.5" fontWeight="bold" fill={selectedLayers.includes("tajika") ? "#fff" : "#94a3b8"} textAnchor="middle">TAJ</text>
            <path d="M 63 19 L 53 42" stroke={selectedLayers.includes("tajika") ? "#2563eb" : "#e2e8f0"} strokeWidth={selectedLayers.includes("tajika") ? "1.5" : "0.5"} strokeDasharray={selectedLayers.includes("tajika") ? "none" : "2,2"} />

            {/* Lal Kitab */}
            <circle cx="85" cy="20" r="5" fill={selectedLayers.includes("lal-kitab") ? "#16a34a" : "#e2e8f0"} />
            <text x="85" y="21.5" fontSize="2.5" fontWeight="bold" fill={selectedLayers.includes("lal-kitab") ? "#fff" : "#94a3b8"} textAnchor="middle">LK</text>
            <path d="M 81 23 L 57 45" stroke={selectedLayers.includes("lal-kitab") ? "#16a34a" : "#e2e8f0"} strokeWidth={selectedLayers.includes("lal-kitab") ? "1.5" : "0.5"} strokeDasharray={selectedLayers.includes("lal-kitab") ? "none" : "2,2"} />
          </svg>
        </div>

        {/* Right Side: Stream Layer Selection */}
        <div className="flex flex-col justify-between p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
          <div>
            <h4 className="font-bold text-sm mb-3" style={{ color: GOLD }}>Select Stream Lenses to Layer:</h4>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2 cursor-not-allowed font-bold text-sm p-2 rounded border bg-amber-50/50" style={{ borderColor: HAIRLINE }}>
                <input type="checkbox" checked={true} readOnly className="accent-amber-700 h-4 w-4" />
                <span className="font-sans">Parāśara (Natal Base) - LOCKED</span>
              </label>

              {["KP", "Jaimini", "Lal Kitab", "Tājika"].map((stream) => {
                const key = stream.toLowerCase().replace(" ", "-");
                return (
                  <label key={stream} className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded border border-gray-200 bg-white/80 hover:bg-white transition-all">
                    <input
                      type="checkbox"
                      checked={selectedLayers.includes(key)}
                      onChange={() => handleStreamToggle(key)}
                      className="accent-amber-700 h-4 w-4"
                    />
                    <span className="font-sans font-medium">{stream}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Over-layer warning */}
      {showOverLayerWarning && (
        <div className="mb-6 p-4 rounded-lg border flex items-start gap-3 bg-amber-50 border-amber-200 text-amber-800 shadow-sm">
          <ShieldAlert size={22} className="shrink-0 mt-0.5 text-amber-700 animate-bounce" />
          <div>
            <p className="font-bold text-sm">Over-Layering Guard: Consultation Clutter Warning</p>
            <p className="text-xs mt-1 leading-relaxed">
              Adding 3 or more layers simultaneously leads to interpretation clutter and conflicting indications. Keep your stream layers focused strictly on the question type.
            </p>
          </div>
        </div>
      )}

      {/* Compound Split Decomposition */}
      {isCompound && (
        <div className="mb-6 p-4 rounded-lg border bg-white/30 shadow-sm" style={{ borderColor: HAIRLINE }}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-sm flex items-center gap-1.5" style={{ color: GOLD }}>
              <Split size={16} />
              Compound Question Decomposition
            </h4>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-sans font-semibold">
              <input
                type="checkbox"
                checked={compoundSplit}
                onChange={(e) => setCompoundSplit(e.target.checked)}
                className="accent-amber-700"
              />
              Show Split Breakdown
            </label>
          </div>

          {compoundSplit && (
            <div className="space-y-3">
              <div className="p-3 rounded bg-white/50 border shadow-sm" style={{ borderColor: HAIRLINE }}>
                <span className="text-xs uppercase tracking-wider block font-bold text-amber-850">Sub-Question Part A (Timing/Window aspect):</span>
                <p className="text-sm leading-relaxed">"Will the marriage promise fructify, and when does the Vimshottari timing hit?" ➔ <strong>KP Cuspal / Vimshottari check</strong></p>
              </div>
              <div className="p-3 rounded bg-white/50 border shadow-sm" style={{ borderColor: HAIRLINE }}>
                <span className="text-xs uppercase tracking-wider block font-bold text-amber-850">Sub-Question Part B (Purpose/Remedy aspect):</span>
                <p className="text-sm leading-relaxed">"What is the underlying vocational dharma, or environmental remedy needed?" ➔ <strong>Jaimini Atmakaraka / Lal Kitab check</strong></p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Side-by-Side Playground Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 rounded border" style={{ backgroundColor: SURFACE_2, borderColor: HAIRLINE }}>
          <h4 className="font-bold text-sm mb-2" style={{ color: GOLD }}>Parāśara Base</h4>
          <p className="text-xs italic mb-3 leading-relaxed">"{preset.notes.parashari}"</p>
          <select
            value={verdictBase}
            onChange={(e) => setVerdictBase(e.target.value as any)}
            className="w-full px-2 py-1 text-xs border rounded bg-transparent font-sans font-bold"
            style={{ borderColor: HAIRLINE }}
          >
            <option value="supports">Supports (+)</option>
            <option value="neutral">Neutral (0)</option>
            <option value="denies">Denies (-)</option>
          </select>
        </div>

        {selectedLayers.includes("kp") && (
          <div className="p-4 rounded border" style={{ backgroundColor: SURFACE_2, borderColor: HAIRLINE }}>
            <h4 className="font-bold text-sm mb-2" style={{ color: GOLD }}>KP Cuspal</h4>
            <p className="text-xs italic mb-3 leading-relaxed">"{preset.notes.kp || "Cuspal sub-lord significations evaluated."}"</p>
            <select
              value={verdictKp}
              onChange={(e) => setVerdictKp(e.target.value as any)}
              className="w-full px-2 py-1 text-xs border rounded bg-transparent font-sans font-bold"
              style={{ borderColor: HAIRLINE }}
            >
              <option value="supports">Supports (+)</option>
              <option value="neutral">Neutral (0)</option>
              <option value="denies">Denies (-)</option>
            </select>
          </div>
        )}

        {selectedLayers.includes("jaimini") && (
          <div className="p-4 rounded border" style={{ backgroundColor: SURFACE_2, borderColor: HAIRLINE }}>
            <h4 className="font-bold text-sm mb-2" style={{ color: GOLD }}>Jaimini Vocation</h4>
            <p className="text-xs italic mb-3 leading-relaxed">"{preset.notes.jaimini || "Karakāṁśa vocational significations evaluated."}"</p>
            <select
              value={verdictJaimini}
              onChange={(e) => setVerdictJaimini(e.target.value as any)}
              className="w-full px-2 py-1 text-xs border rounded bg-transparent font-sans font-bold"
              style={{ borderColor: HAIRLINE }}
            >
              <option value="supports">Supports (+)</option>
              <option value="neutral">Neutral (0)</option>
              <option value="denies">Denies (-)</option>
            </select>
          </div>
        )}

        {selectedLayers.includes("lal-kitab") && (
          <div className="p-4 rounded border" style={{ backgroundColor: SURFACE_2, borderColor: HAIRLINE }}>
            <h4 className="font-bold text-sm mb-2" style={{ color: GOLD }}>Lal Kitab</h4>
            <p className="text-xs italic mb-3 leading-relaxed">"{preset.notes["lal-kitab"] || "Ancestral debt recognition checked."}"</p>
            <select
              value={verdictLalKitab}
              onChange={(e) => setVerdictLalKitab(e.target.value as any)}
              className="w-full px-2 py-1 text-xs border rounded bg-transparent font-sans font-bold"
              style={{ borderColor: HAIRLINE }}
            >
              <option value="supports">Supports (+)</option>
              <option value="neutral">Neutral (0)</option>
              <option value="denies">Denies (-)</option>
            </select>
          </div>
        )}

        {selectedLayers.includes("tajika") && (
          <div className="p-4 rounded border" style={{ backgroundColor: SURFACE_2, borderColor: HAIRLINE }}>
            <h4 className="font-bold text-sm mb-2" style={{ color: GOLD }}>Tājika</h4>
            <p className="text-xs italic mb-3 leading-relaxed">"{preset.notes.tajika || "Varṣaphala Year Lord and Muntha checked."}"</p>
            <select
              value={verdictTajika}
              onChange={(e) => setVerdictTajika(e.target.value as any)}
              className="w-full px-2 py-1 text-xs border rounded bg-transparent font-sans font-bold"
              style={{ borderColor: HAIRLINE }}
            >
              <option value="supports">Supports (+)</option>
              <option value="neutral">Neutral (0)</option>
              <option value="denies">Denies (-)</option>
            </select>
          </div>
        )}
      </div>

      {/* Synthesis Output */}
      <div className="p-4 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-amber-50/50" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-center gap-2">
          <Info size={18} style={{ color: GOLD }} />
          <div>
            <p className="font-bold text-sm">Cross-Stream Synthesis Status</p>
            <p className="text-xs font-sans" style={{ color: INK_SECONDARY }}>Observing side-by-side stream convergence details.</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs uppercase tracking-wider block text-gray-500 font-sans" style={{ color: INK_SECONDARY }}>Convergence Status</span>
          <span className="text-lg font-bold text-amber-700">
            {verdictBase === "supports" && (selectedLayers.length === 0 || selectedLayers.every(s => {
              if (s === "kp") return verdictKp === "supports";
              if (s === "jaimini") return verdictJaimini === "supports";
              if (s === "lal-kitab") return verdictLalKitab === "supports";
              if (s === "tajika") return verdictTajika === "supports";
              return true;
            }))
              ? "Strong Concord (Multi-stream agrees)"
              : "Nuanced Divergent Tension (Report separate findings)"}
          </span>
        </div>
      </div>
    </div>
  );
}
