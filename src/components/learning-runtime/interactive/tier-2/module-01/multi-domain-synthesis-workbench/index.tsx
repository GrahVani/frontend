"use client";

import { useState } from "react";
import { Info, ShieldAlert, Lock, Unlock, CheckCircle, Layers, RefreshCw } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function MultiDomainSynthesisWorkbench() {
  const [activeTab, setActiveTab] = useState<"base" | "layers" | "timing" | "writeup">("base");

  // State configurations
  const [lagna, setLagna] = useState("Virgo");
  const [queryText, setQueryText] = useState("When will my career transition stabilize?");
  
  // Base locked constraint
  const [attemptedBaseRemoval, setAttemptedBaseRemoval] = useState(false);
  const [isBaseActive, setIsBaseActive] = useState(true);

  // Layer selections
  const [layeredStreams, setLayeredStreams] = useState<string[]>(["stream-kp"]);

  // Writeup input
  const [part5Text, setPart5Text] = useState("");

  const handleBaseToggle = () => {
    setAttemptedBaseRemoval(true);
    setTimeout(() => setAttemptedBaseRemoval(false), 3000);
  };

  const handleStreamToggle = (streamId: string) => {
    if (layeredStreams.includes(streamId)) {
      setLayeredStreams(layeredStreams.filter(s => s !== streamId));
    } else {
      setLayeredStreams([...layeredStreams, streamId]);
    }
  };

  const loadCaseValues = () => {
    setLagna("Virgo");
    setQueryText("When will my career change fructify?");
    setLayeredStreams(["stream-kp", "stream-jaimini"]);
    setPart5Text("Assessed dasha transition window. Advised client to consolidate skills during current sub-period. Framed timing as a window of active capability.");
  };

  const resetFields = () => {
    setLagna("");
    setQueryText("");
    setLayeredStreams([]);
    setPart5Text("");
  };

  // Highlights mapping
  const isYantram = activeTab === "base" || activeTab === "timing";
  const isVivekas = layeredStreams.length >= 3;
  const isDaivajnasya = part5Text.trim().length >= 15;

  const isPart5Valid = part5Text.trim().length >= 15;
  const isOverLayered = layeredStreams.length > 2;

  const lowerPart5 = part5Text.toLowerCase();
  const hasDeterministicViolation = lowerPart5.includes("will ") || lowerPart5.includes("definitely") || lowerPart5.includes("fail");

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="multi-domain-synthesis-workbench"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Multi-Domain Synthesis Workbench (Walkthrough)
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Inspect structural rules, Locked Base, and Speech constraints
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadCaseValues}
            className="px-3 py-1.5 bg-amber-800 text-white rounded hover:bg-amber-900 text-xs font-sans font-bold shadow-sm"
          >
            Pre-load General Case
          </button>
          <button
            onClick={resetFields}
            className="px-2.5 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-xs font-sans font-bold shadow-sm flex items-center gap-1"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>


      {/* Stepper Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto font-sans text-xs font-bold" style={{ borderColor: HAIRLINE }}>
        {[
          { label: "1. Locked Parāśara Base", id: "base" },
          { label: "2. Stream Layering", id: "layers" },
          { label: "3. Timing & Transit Overlay", id: "timing" },
          { label: "4. Assembled Write-Up Log", id: "writeup" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === t.id
                ? "border-amber-700 text-amber-900 font-extrabold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Steps panel */}
      <div className="mb-6 min-h-[220px]">
        {activeTab === "base" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Locked Base Principle (Layer-not-Substitute)</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-serif">
                Auxiliary systems like KP or Jaimini must only act as overlays. Deselecting the Parāśara base is prohibited to preserve synthesis integrity.
              </p>

              <div className="flex items-center gap-3 p-3 rounded-lg border bg-white/70 shadow-sm" style={{ borderColor: HAIRLINE }}>
                <input
                  type="checkbox"
                  checked={isBaseActive}
                  onChange={handleBaseToggle}
                  className="w-4 h-4 text-amber-700 border-gray-300 rounded focus:ring-amber-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Parāśari Base Layer</span>
                  <span className="text-xs text-gray-500 font-sans">Tripod checks locked</span>
                </div>
              </div>

              {attemptedBaseRemoval && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-900 text-xs leading-relaxed animate-shake">
                  <ShieldAlert size={16} className="inline mr-1 text-red-700" />
                  <strong>Substitution Denied:</strong> Parāśara base is locked. Subsystems are overlays, never replacements.
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg border bg-white/40 font-sans text-xs flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Context Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Lagna (Birth Sign):</label>
                    <input
                      type="text"
                      value={lagna}
                      onChange={(e) => setLagna(e.target.value)}
                      className="p-1 text-xs border rounded w-full bg-white/60 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Query Text:</label>
                    <input
                      type="text"
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      className="p-1 text-xs border rounded w-full bg-white/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "layers" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg" style={{ color: GOLD }}>Evidentiary Stream Layering</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-serif">
              Layer secondary systems. Refrain from over-layering (adding more streams than necessary creates visual complexity).
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { id: "stream-kp", name: "KP Cusp System (Timing fructification)" },
                { id: "stream-jaimini", name: "Jaimini Sutra (Amātyakāraka calling)" },
                { id: "stream-tajika", name: "Tajika Varshaphala (Annual returns)" },
                { id: "stream-lalkitab", name: "Lal Kitab (Remedies & Blind planets)" }
              ].map(stream => (
                <button
                  key={stream.id}
                  onClick={() => handleStreamToggle(stream.id)}
                  className={`p-3 rounded-lg border flex items-center gap-2 transition-all font-sans font-semibold text-xs text-left ${
                    layeredStreams.includes(stream.id)
                      ? "bg-amber-100 border-amber-400 text-amber-950 scale-[1.01]"
                      : "bg-white/50 hover:bg-white text-gray-700 border-gray-300"
                  }`}
                  style={{ width: "calc(50% - 8px)" }}
                >
                  <Layers size={16} />
                  {stream.name}
                </button>
              ))}
            </div>

            {isOverLayered && (
              <div className="p-3 rounded bg-orange-50 border border-orange-200 text-orange-955 text-xs flex items-center gap-2">
                <Info size={16} className="text-orange-900 shrink-0" />
                <span>
                  <strong>Fewest-Fitting-Lenses Caution:</strong> Over-layering detected. Limit streams to focus your judgment.
                </span>
              </div>
            )}
          </div>
        )}

        {activeTab === "timing" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Vimshottari Timeline & Gochara Overlay</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Synthesis overlays transit triggers directly on top of the running dasha window to map when natal potential becomes active.
              </p>
              <div className="bg-white/40 p-4 rounded-lg border text-xs space-y-2 font-sans" style={{ borderColor: HAIRLINE }}>
                <p><strong>Running Mahadasha:</strong> Venus (lord of 10th)</p>
                <p><strong>Running Bhukti:</strong> Saturn (lord of 6th - change phase)</p>
                <p><strong>Active Transits:</strong> Jupiter transits 10th house Taurus (Aspecting Lagna)</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-white/40 flex items-center justify-center" style={{ borderColor: HAIRLINE }}>
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2d261e" strokeWidth="1.5" />
                {/* Dasha sector */}
                <path d="M 50 10 A 40 40 0 0 1 90 50 L 50 50 Z" fill="#9C7A2F" opacity="0.15" />
                {/* Transit overlay */}
                <circle cx="70" cy="30" r="4" fill="#15803d" />
                <text x="70" y="24" fontSize="5" textAnchor="middle" fill="#15803d" fontWeight="bold">Jupiter</text>
                <text x="50" y="53" fontSize="6" textAnchor="middle" fill="#4d4133" fontWeight="bold">Alignment Zone</text>
              </svg>
            </div>
          </div>
        )}

        {activeTab === "writeup" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Five-Part Write-Up Log</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                As you complete your analysis, write down Part 5 (Ethical Framing). Leaving it empty keeps the workbench draft locked.
              </p>
              <textarea
                value={part5Text}
                onChange={(e) => setPart5Text(e.target.value)}
                placeholder="Draft Part 5: Ethical Framing & Routing..."
                className="w-full h-24 p-2 border rounded-md bg-white/60 text-xs font-sans focus:outline-none"
                style={{ borderColor: HAIRLINE }}
              />
            </div>

            <div className="p-6 rounded-lg border bg-white/40 flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
              <div>
                <span className="text-xs uppercase tracking-wider block text-gray-500 font-sans font-bold">Ethics Checklist Status</span>
                <span className={`text-lg font-bold block ${isPart5Valid ? "text-green-700" : "text-red-700"} flex items-center gap-1.5`}>
                  {isPart5Valid ? (
                    <>
                      <Unlock size={18} /> Complete & Unlocked
                    </>
                  ) : (
                    <>
                      <Lock size={18} /> Locked: Ethics Missing
                    </>
                  )}
                </span>
                <p className="text-[10px] text-gray-600 leading-relaxed mt-2">
                  Part 5 ensures client agency. It prevents the astrologer from acting as an absolute arbiter of fate.
                </p>
              </div>

              {hasDeterministicViolation && (
                <div className="border-t pt-3 mt-3">
                  <div className="p-2 rounded bg-red-50 border border-red-200 text-red-900 text-[10px] flex items-start gap-1 font-sans">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5 text-red-700" />
                    <span>Deterministic warning: Remove 'will' / 'definitely' from Part 5.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
