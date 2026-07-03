"use client";

import { useState } from "react";
import { Info, ShieldAlert, Heart, Lock, Unlock, CheckCircle, Compass, HelpCircle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function MarriageSynthesisWorkbench() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Tripod states
  const [houseChecked, setHouseChecked] = useState(false);
  const [lordChecked, setLordChecked] = useState(false);
  const [karakaChecked, setKarakaChecked] = useState(false);
  const [navamsaChecked, setNavamsaChecked] = useState(false);

  // Step 2: Layers
  const [kpChecked, setKpChecked] = useState(false);
  const [jaiminiChecked, setJaiminiChecked] = useState(false);

  // Step 3: Dasha and Transit
  const [dashaAligned, setDashaAligned] = useState(true);
  const [transitAspects, setTransitAspects] = useState(false);

  // Step 4: Write-up logs
  const [part1Text, setPart1Text] = useState("");
  const [part5Text, setPart5Text] = useState("");

  const loadCaseValues = () => {
    setHouseChecked(true);
    setLordChecked(true);
    setKarakaChecked(true);
    setNavamsaChecked(true);
    setKpChecked(true);
    setJaiminiChecked(true);
    setTransitAspects(true);
    setPart1Text("Lagna: Libra (Tulā). 7th house Aries unoccupied, receives Jupiter aspect. 7th lord Mars exalted in Capricorn. Venus in Cancer.");
    setPart5Text("Venus-Mars Dasha timing is active. Advised client to focus on emotional maturity and collaborative communication. Avoided naming an exact date.");
  };

  // Sanskrit text highlighting states
  const isSaptamam = houseChecked;
  const isSaptamesham = lordChecked;
  const isShukram = karakaChecked;
  const isNavamshakam = navamsaChecked;
  const isDarabjam = jaiminiChecked;
  const isPadam = jaiminiChecked;

  // Real-time validations
  const isPart1Valid = part1Text.trim().length >= 10;
  const isPart5Valid = part5Text.trim().length >= 15;
  const isAllValid = houseChecked && lordChecked && karakaChecked && navamsaChecked && kpChecked && jaiminiChecked && transitAspects && isPart1Valid && isPart5Valid;

  const lowerPart5 = part5Text.toLowerCase();
  const hasDeterministicViolation = lowerPart5.includes("will marry") || lowerPart5.includes("definitely") || lowerPart5.includes("destined");

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="marriage-synthesis-workbench"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Marriage Synthesis Workbench (Worked Case)
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Case Study: 7th House Aries, Libra Lagna (Tulā)
          </p>
        </div>
        <button
          onClick={loadCaseValues}
          className="px-3 py-1.5 bg-amber-800 text-white rounded hover:bg-amber-900 text-xs font-sans font-bold shadow-sm"
        >
          Pre-load Marriage Case Placements
        </button>
      </div>


      {/* Stepper Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto font-sans text-xs font-bold" style={{ borderColor: HAIRLINE }}>
        {[
          { label: "Step 1: Parāśari Tripod", val: 1 },
          { label: "Step 2: KP & Jaimini Layers", val: 2 },
          { label: "Step 3: Dasha & Transits", val: 3 },
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
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Step 1 — Parāśari Base (Tripod & D9)</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-serif">
                Evaluate the marriage promise using the Libra ascendant base. Venus rules both the Lagna and acts as Kāraka, situated in Cancer. Mars, 7th lord, is exalted in Capricorn.
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={houseChecked}
                    onChange={(e) => setHouseChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  7th House (Aries) is unoccupied & aspected by Jupiter (Tulā Lagna check)
                </label>
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={lordChecked}
                    onChange={(e) => setLordChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  7th Lord Mars is exalted in Capricorn (4th House Kendra)
                </label>
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={karakaChecked}
                    onChange={(e) => setKarakaChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  Venus (Kāraka) holds Kendra placement in Cancer (10th House)
                </label>
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={navamsaChecked}
                    onChange={(e) => setNavamsaChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  Navāmśa (D9) verification holds (no dignitary collapse)
                </label>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-white/40 font-sans text-xs" style={{ borderColor: HAIRLINE }}>
              <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Base Placements</h4>
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                    <td className="py-1 font-bold">Lagna / Lord</td>
                    <td>Libra (Tulā) / Venus in Cancer</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                    <td className="py-1 font-bold">7th House / Lord</td>
                    <td>Aries / Mars exalted in Capricorn</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">Jupiter Aspect</td>
                    <td className="text-green-700 font-bold">5th Aspect from Sagittarius (Benefic support)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Step 2 — Secondary Layers (KP & Jaimini)</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-serif">
                Layer KP cuspal sub-lords to answer timing fructification yes/no, and Jaimini Dārakāraka (spouse nature) and Upapada (spouse image/durability).
              </p>

              <div className="space-y-3 font-sans">
                <label className="flex items-start gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={kpChecked}
                    onChange={(e) => setKpChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700 mt-0.5"
                  />
                  <div>
                    <span>KP Layer: 7th cuspal sub-lord signifies houses 2, 7, and 11</span>
                    <span className="block text-[10px] text-gray-500">Confirms event fructification directly.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={jaiminiChecked}
                    onChange={(e) => setJaiminiChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-700 mt-0.5"
                  />
                  <div>
                    <span>Jaimini Layer: Dārakāraka (Jupiter) + Upapada check</span>
                    <span className="block text-[10px] text-gray-500">Determines the supportive nature of the partner.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-white/40 text-xs font-sans space-y-2" style={{ borderColor: HAIRLINE }}>
              <span className="font-bold text-amber-900 block uppercase tracking-wider">Independent Evidentiary Count</span>
              <p className="text-gray-600">
                Each layer represents a different mathematical system, satisfying the two-yes requirement of independent corroboration.
              </p>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ color: GOLD }}>Step 3 — Timing Window & Transit Overlay</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The native runs **Venus Mahadashā (Lagna lord + Kāraka)** and **Mars Bhukti (7th lord)**. Both agree on marriage. Jupiter and Saturn transit aspect Aries (7th house) simultaneously.
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={dashaAligned}
                    onChange={(e) => setDashaAligned(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  Venus Mahadashā & Mars Bhukti are active (Satisfies both-agree rule)
                </label>
                <label className="flex items-center gap-2 text-xs font-sans font-semibold">
                  <input
                    type="checkbox"
                    checked={transitAspects}
                    onChange={(e) => setTransitAspects(e.target.checked)}
                    className="w-4 h-4 text-amber-700"
                  />
                  Jupiter & Saturn double-aspect transit Aries (7th) without Vedha
                </label>
              </div>
            </div>

            {/* Custom Interactive SVG aspects layout */}
            <div className="p-4 rounded-lg border bg-white/40 flex flex-col items-center justify-center" style={{ borderColor: HAIRLINE }}>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2 font-sans" style={{ color: GOLD }}>
                Transit Aspect Overlay (Libra Lagna)
              </h4>
              
              <div className="relative">
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  {/* North Indian style chart lines */}
                  <rect x="10" y="10" width="80" height="80" fill="none" stroke="#2d261e" strokeWidth="1.5" />
                  <line x1="10" y1="10" x2="90" y2="90" stroke="#2d261e" strokeWidth="1" />
                  <line x1="90" y1="10" x2="10" y2="90" stroke="#2d261e" strokeWidth="1" />
                  
                  {/* Lagna (1st house - Libra) */}
                  <text x="50" y="28" fontSize="5" textAnchor="middle" fill="#4d4133" fontWeight="bold">Lagna (Libra)</text>
                  
                  {/* 7th house (Aries) */}
                  <text x="50" y="78" fontSize="5" textAnchor="middle" fill="#4d4133" fontWeight="bold">7th (Aries)</text>

                  {/* Aspect Arrow from Jupiter (Taurus / Sagittarius) */}
                  {transitAspects && (
                    <>
                      <path d="M 50 35 L 50 68" stroke="#15803d" strokeWidth="1.5" strokeDasharray="2,2" className="animate-pulse" />
                      <polygon points="50,71 47,66 53,66" fill="#15803d" />
                    </>
                  )}
                </svg>

                {!transitAspects && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs font-sans font-bold text-amber-900 text-center p-2">
                    Check Transit Box to view Aspect lines
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
                  placeholder="e.g. Libra Lagna, 7th lord Mars exalted, Venus Kāraka active..."
                  className="w-full h-20 p-2 border rounded bg-white/50 text-xs font-sans focus:outline-none"
                  style={{ borderColor: HAIRLINE }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: GOLD }}>Part 5: Ethical Framing & Client Action</label>
                <textarea
                  value={part5Text}
                  onChange={(e) => setPart5Text(e.target.value)}
                  placeholder="Describe supportive counseling advice..."
                  className="w-full h-20 p-2 border rounded bg-white/50 text-xs font-sans focus:outline-none"
                  style={{ borderColor: HAIRLINE }}
                />
              </div>
            </div>

            {/* Final checkout */}
            <div className="p-6 rounded-lg border bg-white/40 flex flex-col justify-between shadow-inner" style={{ borderColor: HAIRLINE }}>
              <div>
                <span className="text-xs uppercase tracking-wider block text-gray-500 font-sans font-bold">Synthesis Verdict</span>
                <span className="text-2xl font-bold block text-green-700 flex items-center gap-1">
                  <Heart size={24} /> Strong Prediction
                </span>
                <p className="text-xs text-gray-600 leading-relaxed mt-2 font-sans font-semibold">
                  All 5 layers are active and satisfied. No obstructions found.
                </p>
              </div>

              <div className="border-t pt-4 mt-4" style={{ borderColor: HAIRLINE }}>
                {hasDeterministicViolation && (
                  <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-900 text-[10px] mb-3 flex items-start gap-1 font-sans">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5 text-red-700" />
                    <span>Deterministic warning: Remove 'will' / 'definitely' from Part 5.</span>
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
