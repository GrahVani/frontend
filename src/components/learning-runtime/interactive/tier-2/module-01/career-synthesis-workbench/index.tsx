"use client";

import { useState } from "react";
import { Info, ShieldAlert, Lock, Unlock, CheckCircle, Briefcase, RefreshCw } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function CareerSynthesisWorkbench() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Base states
  const [houseChecked, setHouseChecked] = useState(false);
  const [lordChecked, setLordChecked] = useState(false);
  const [d10Checked, setD10Checked] = useState(false);

  // Step 2: Jaimini
  const [amkChecked, setAmkChecked] = useState(false);

  // Step 3: Dasha slider (0 for Venus-Mercury, 1 for Sun Mahadasha)
  const [dashaPhase, setDashaPhase] = useState<0 | 1>(0);

  // Step 4: Write-up logs
  const [part1Text, setPart1Text] = useState("");
  const [part4Text, setPart4Text] = useState("");

  const loadCaseValues = () => {
    setHouseChecked(true);
    setLordChecked(true);
    setD10Checked(true);
    setAmkChecked(true);
    setDashaPhase(1); // Slide to Sun MD (active transition)
    setPart1Text("Lagna: Leo (Siṁha). 10th lord Venus in Taurus (10th house). Exalted career promise.");
    setPart4Text("KP cuspal sub-lord indicates delayed fructification during current Venus-Mercury; Sun MD (~2 years out) opens the true transition window.");
  };

  const resetFields = () => {
    setHouseChecked(false);
    setLordChecked(false);
    setD10Checked(false);
    setAmkChecked(false);
    setDashaPhase(0);
    setPart1Text("");
    setPart4Text("");
  };

  // Sanskrit text highlighting states
  const isKarmesha = lordChecked;
  const isDashama = houseChecked;
  const isAmatya = amkChecked;
  const isDashamanshakam = d10Checked;
  const isKalam = dashaPhase === 1;

  // Real-time validations
  const isPart1Valid = part1Text.trim().length >= 10;
  const isPart4Valid = part4Text.trim().length >= 15;
  const isAllValid = houseChecked && lordChecked && d10Checked && amkChecked && isPart1Valid && isPart4Valid;

  const lowerPart4 = part4Text.toLowerCase();
  const hasDeterministicViolation = lowerPart4.includes("will ") || lowerPart4.includes("definitely") || lowerPart4.includes("fail");

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="career-synthesis-workbench"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Career Synthesis Workbench (Nuanced Case)
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Case Study: Leo Lagna, Venus in own sign Taurus (10th house)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadCaseValues}
            className="px-3 py-1.5 bg-amber-800 text-white rounded hover:bg-amber-900 text-xs font-sans font-bold shadow-sm"
          >
            Pre-load Career Placements
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
          { label: "Step 1: Parāśari Base", val: 1 },
          { label: "Step 2: Jaimini Vocation", val: 2 },
          { label: "Step 3: Moving Window", val: 3 },
          { label: "Step 4: Final Synthesis", val: 4 }
        ].map((s) => (
          <button
            key={s.val}
            onClick={() => setActiveStep(s.val as any)}
            className={`px-4 py-2 border-b-2 whitespace-nowrap transition-all ${
              activeStep === s.val
                ? "border-amber-700 text-amber-900 font-extrabold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Steps panel */}
      <div className="mb-6 min-h-[220px]">
        {activeStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Step 1 — Parāśari Base & D10</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-serif">
                Evaluate the career promise. Leo ascendant 10th house (Taurus) is ruled by Venus, which is strong in its own sign in the 10th. Excellent career stability.
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={houseChecked}
                    onChange={(e) => setHouseChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  10th House (Taurus) contains own-sign Venus (Clean natal promise)
                </label>
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={lordChecked}
                    onChange={(e) => setLordChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  10th Lord Venus is exalted in D9 / strong in D1
                </label>
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={d10Checked}
                    onChange={(e) => setD10Checked(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  Daśāṁśa (D10) check confirms strong career foundation
                </label>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-white/40 font-sans text-xs" style={{ borderColor: HAIRLINE }}>
              <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Base Placements</h4>
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                    <td className="py-1 font-bold">Lagna / Lord</td>
                    <td>Leo (Siṁha) / Sun in Taurus</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                    <td className="py-1 font-bold">10th House / Lord</td>
                    <td>Taurus / Venus in Taurus (Own Sign)</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">Livelihood Lord</td>
                    <td className="text-green-700 font-bold">Very Strong (Own Sign)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Step 2 — Vocation Alignment (Jaimini Layer)</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-serif">
                Layer Jaimini to assess soul calling. The Amātyakāraka is Saturn, representing service and structured fields, diverging from the current Venus (glamour/wealth) career.
              </p>

              <div className="space-y-3 font-sans">
                <label className="flex items-start gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={amkChecked}
                    onChange={(e) => setAmkChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700 mt-0.5"
                  />
                  <div>
                    <span>Amātyakāraka (Saturn) indicates calling in service/structure</span>
                    <span className="block text-[10px] text-gray-500">Confirms alignment to the new field.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-white/40 text-xs font-sans space-y-2" style={{ borderColor: HAIRLINE }}>
              <span className="font-bold text-amber-900 block uppercase tracking-wider">Soul-Calling Divergence</span>
              <p className="text-gray-600">
                While the natal promise supports excellent material success in the current Venus field, Saturn (AmK) indicates that the native's true vocational alignment lies in service.
              </p>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Step 3 — Timing Window & Transit Overlay</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Compare the dasha phases. Current Venus-Mercury period consolidates the current job (not a timing window). Upcoming Sun MD (Lagna lord) opens the transition window.
              </p>

              <div className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Select Dasha Phase:</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    value={dashaPhase}
                    onChange={(e) => setDashaPhase(Number(e.target.value) as any)}
                    className="w-full h-1 bg-gray-200 rounded cursor-pointer accent-amber-800"
                  />
                  <div className="flex justify-between text-[10px] font-bold mt-1 text-amber-900">
                    <span>Venus-Mercury (Stay)</span>
                    <span>Sun MD (Transition Window)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Interactive SVG aspects layout */}
            <div className="p-4 rounded-lg border bg-white/40 flex flex-col items-center justify-center" style={{ borderColor: HAIRLINE }}>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2 font-sans" style={{ color: GOLD }}>
                Transit Aspect Map (Leo Lagna)
              </h4>
              
              <div className="relative">
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  {/* North Indian style chart lines */}
                  <rect x="10" y="10" width="80" height="80" fill="none" stroke="#2d261e" strokeWidth="1.5" />
                  <line x1="10" y1="10" x2="90" y2="90" stroke="#2d261e" strokeWidth="1" />
                  <line x1="90" y1="10" x2="10" y2="90" stroke="#2d261e" strokeWidth="1" />
                  
                  {/* Lagna (1st house - Leo) */}
                  <text x="50" y="28" fontSize="5" textAnchor="middle" fill="#4d4133" fontWeight="bold">Lagna (Leo)</text>
                  
                  {/* 10th house (Taurus) */}
                  <text x="50" y="78" fontSize="5" textAnchor="middle" fill="#4d4133" fontWeight="bold">10th (Taurus)</text>

                  {/* Aspect Arrow from Saturn */}
                  {dashaPhase === 1 && (
                    <>
                      <path d="M 30 70 L 45 70" stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="2,2" className="animate-pulse" />
                      <polygon points="48,70 43,67 43,73" fill="#b91c1c" />
                    </>
                  )}
                </svg>

                {dashaPhase === 0 && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs font-sans font-bold text-amber-900 text-center p-2">
                    Slide timeline to Sun MD to trigger transit aspects
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: GOLD }}>Part 1: Context Profile</label>
                <textarea
                  value={part1Text}
                  onChange={(e) => setPart1Text(e.target.value)}
                  placeholder="e.g. Leo Lagna, Venus in Taurus 10th house, Saturn AmK..."
                  className="w-full h-20 p-2 border rounded bg-white/50 text-xs font-sans focus:outline-none"
                  style={{ borderColor: HAIRLINE }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: GOLD }}>Part 4: Technical Caveats & Divergences</label>
                <textarea
                  value={part4Text}
                  onChange={(e) => setPart4Text(e.target.value)}
                  placeholder="Record timing delay details and caveats..."
                  className="w-full h-20 p-2 border rounded bg-white/50 text-xs font-sans focus:outline-none"
                  style={{ borderColor: HAIRLINE }}
                />
              </div>
            </div>

            {/* Final checkout */}
            <div className="p-6 rounded-lg border bg-white/40 flex flex-col justify-between shadow-inner" style={{ borderColor: HAIRLINE }}>
              <div>
                <span className="text-xs uppercase tracking-wider block text-gray-500 font-sans font-bold">Synthesis Verdict</span>
                <span className="text-2xl font-bold block text-amber-700 flex items-center gap-1">
                  <Briefcase size={24} /> Moderate (Divergent)
                </span>
                <p className="text-xs text-gray-600 leading-relaxed mt-2 font-sans font-semibold">
                  Promise supports transition, but the window is delayed by 2 years.
                </p>
              </div>

              <div className="border-t pt-4 mt-4" style={{ borderColor: HAIRLINE }}>
                {hasDeterministicViolation && (
                  <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-900 text-[10px] mb-3 flex items-start gap-1 font-sans">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5 text-red-700" />
                    <span>Deterministic warning: Remove 'will' / 'definitely' from Part 4.</span>
                  </div>
                )}

                {isAllValid && !hasDeterministicViolation ? (
                  <div className="p-2.5 rounded bg-green-50 border border-green-200 text-green-900 text-xs font-sans font-bold flex items-center gap-1">
                    <Unlock size={16} /> Ready for Case Export
                  </div>
                ) : (
                  <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-900 text-xs font-sans font-bold flex items-center gap-1">
                    <Lock size={16} /> Incomplete / Warning Flags
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
