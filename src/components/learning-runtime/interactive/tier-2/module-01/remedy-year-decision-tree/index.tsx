"use client";

import { useMemo, useState } from "react";
import { Info, ShieldAlert, Sparkles, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { PRESETS } from '@/components/learning-runtime/interactive/layered-shared-data';

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

// Houses and their Muntha quality significations
const MUNTHA_SIGNIFICATIONS = [
  { house: 1, label: "Health, Vitality, Personal Beginnings", beneficial: true },
  { house: 2, label: "Financial growth, family discussions", beneficial: true },
  { house: 3, label: "Travel, effort, sibling support", beneficial: true },
  { house: 4, label: "Home, happiness, domestic shifts", beneficial: true },
  { house: 5, label: "Intellectual growth, romance, children", beneficial: true },
  { house: 6, label: "Debts, litigation, physical strain", beneficial: false },
  { house: 7, label: "Relationships, partnership contracts", beneficial: true },
  { house: 8, label: "Obstacles, sudden changes, vulnerability", beneficial: false },
  { house: 9, label: "Higher study, spiritual journeys, fortune", beneficial: true },
  { house: 10, label: "Career recovery, status elevation, authority", beneficial: true },
  { house: 11, label: "Financial gains, social networks, desires met", beneficial: true },
  { house: 12, label: "Losses, expenditure, foreign travel, isolation", beneficial: false }
];

export function RemedyYearDecisionTree() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("q3");
  const [returnAge, setReturnAge] = useState<number>(33); // solar return age
  const [safetyConfirmed, setSafetyConfirmed] = useState<boolean>(false);
  const [lalKitabVerdict, setLalKitabVerdict] = useState<"supports" | "neutral" | "denies">("supports");
  const [tajikaVerdict, setTajikaVerdict] = useState<"supports" | "neutral" | "denies">("supports");

  const preset = useMemo(() => {
    return PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  }, [selectedPresetId]);

  // Muntha formula: (Natal Lagna House + Age) % 12. Let's assume Lagna is 1st house (1)
  // So Muntha sits in: ((1 - 1 + returnAge) % 12) + 1
  const munthaHouseNum = (returnAge % 12) + 1;
  const munthaInfo = MUNTHA_SIGNIFICATIONS.find(m => m.house === munthaHouseNum) || MUNTHA_SIGNIFICATIONS[0];

  // Coordinates for 12 houses on a circular chart (representing the zodiac return wheel)
  const circularPoints = Array.from({ length: 12 }).map((_, idx) => {
    const angle = ((idx * 30 - 90) * Math.PI) / 180;
    const x = 50 + 28 * Math.cos(angle);
    const y = 50 + 28 * Math.sin(angle);
    return { x, y, label: idx + 1 };
  });

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="remedy-year-decision-tree"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Remedy & Year Decision Tree
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Tājika Varṣaphala (Year Ahead) & Lal Kitab (Remedy Lenses)
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider mb-1 font-bold font-sans" style={{ color: GOLD }}>
            Select Query Preset
          </label>
          <select
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value)}
            className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
            style={{ borderColor: HAIRLINE }}
          >
            {PRESETS.filter(p => p.suggestedType === "remedy" || p.suggestedType === "year" || p.id === "q3" || p.id === "q4").map((p) => (
              <option key={p.id} value={p.id} style={{ background: SURFACE }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>


      <div className="mb-6 p-4 rounded-lg border bg-white/40 shadow-sm" style={{ borderColor: HAIRLINE }}>
        <p className="text-sm font-semibold mb-1" style={{ color: GOLD }}>Question:</p>
        <p className="text-lg italic">"{preset.text}"</p>
      </div>

      {/* Split layout: Tajika Wheel & Lal Kitab Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Left Side: Tajika Solar Return Simulator */}
        <div className="p-6 border rounded-xl bg-white/40 shadow-inner flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: GOLD }}>1. Tājika Varṣaphala Calculator</h3>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold">Solar Return Age: {returnAge} years</label>
                <span className="text-xs font-bold font-sans px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  Muntha in {munthaHouseNum}th House
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={returnAge}
                onChange={(e) => setReturnAge(Number(e.target.value))}
                className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Circular Return Wheel SVG */}
            <div className="w-full bg-white/50 border rounded-lg p-4 flex flex-col items-center mb-4" style={{ borderColor: HAIRLINE }}>
              <svg className="w-full max-w-[200px] h-36" viewBox="0 0 100 100">
                {/* Center wheel circle */}
                <circle cx="50" cy="50" r="35" fill="none" stroke="#b45309" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="5" fill="#78350f" />

                {/* Draw 12 return house nodes */}
                {circularPoints.map((pt) => {
                  const isMuntha = pt.label === munthaHouseNum;
                  return (
                    <g key={pt.label}>
                      {/* Connection line */}
                      <line x1="50" y1="50" x2={pt.x} y2={pt.y} stroke={isMuntha ? "#3b82f6" : "#e2e8f0"} strokeWidth={isMuntha ? "1.5" : "0.5"} />
                      {/* House circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isMuntha ? "5" : "3.5"}
                        fill={isMuntha ? "#3b82f6" : "#fff"}
                        stroke="#b45309"
                        strokeWidth="0.75"
                        className="transition-all duration-300"
                      />
                      {/* Text label */}
                      <text
                        x={pt.x}
                        y={pt.y + 1}
                        fontSize="2.5"
                        fontWeight="bold"
                        fill={isMuntha ? "#fff" : INK_PRIMARY}
                        textAnchor="middle"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}

                {/* Inner labeling */}
                <text x="50" y="47" fontSize="3" fontWeight="bold" fill={GOLD} textAnchor="middle">VARṢA</text>
                <text x="50" y="55" fontSize="2.5" fill={INK_SECONDARY} textAnchor="middle">Sun Return</text>
              </svg>
              <div className="text-center text-xs mt-2 font-sans px-2">
                Muntha placement indicates: <strong className={munthaInfo.beneficial ? "text-green-700" : "text-red-700"}>{munthaInfo.label}</strong>
              </div>
            </div>
          </div>

          <div className="border-t pt-4" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-600">Tājika Verdict:</span>
              <select
                value={tajikaVerdict}
                onChange={(e) => setTajikaVerdict(e.target.value as any)}
                className="px-2 py-0.5 border rounded bg-transparent font-sans font-bold"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="supports">Supports Year Focus</option>
                <option value="neutral">Neutral</option>
                <option value="denies">Divergent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Lal Kitab Layer & Safety Blocker */}
        <div className="p-6 border rounded-xl bg-white/40 shadow-inner flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: GOLD }}>2. Lal Kitab Screening & Safety</h3>

            {/* Checkbox to acknowledge safety limit */}
            <div className="p-4 rounded-lg border bg-amber-50 border-amber-200 text-amber-900 shadow-sm mb-4">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyConfirmed}
                  onChange={(e) => setSafetyConfirmed(e.target.checked)}
                  className="accent-amber-700 h-4 w-4 mt-0.5 shrink-0"
                />
                <span className="text-xs leading-relaxed font-sans font-semibold text-gray-700">
                  I acknowledge the "Recognition Only" safety rule: Upāyas/remedies cannot be prescribed in this training module (deferred to Module 21).
                </span>
              </label>
            </div>

            {/* Locked/Unlocked Content */}
            {safetyConfirmed ? (
              <div className="p-4 rounded-lg border bg-green-50/50 border-green-200 text-green-950 shadow-sm animate-fade-in space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider block text-green-800 font-sans flex items-center gap-1">
                  <ShieldCheck size={14} /> Lal Kitab Recognition Indicators Unlocked:
                </span>
                <p className="text-xs leading-relaxed text-gray-700">
                  • **Active debt pattern:** Pitri Rin (Ancestral Debt) identified relative to Saturn's 8th placement.<br />
                  • **Empirical indicator:** Dry wells, dying neem trees, or iron degradation noted in client environment.<br />
                  • **Actionable path:** Counsel recognition of the debt. Prescription of Saturn remedies is strictly deferred.
                </p>
                <div className="pt-2 border-t border-green-200 flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-600">Lal Kitab Verdict:</span>
                  <select
                    value={lalKitabVerdict}
                    onChange={(e) => setLalKitabVerdict(e.target.value as any)}
                    className="px-2 py-0.5 border rounded bg-transparent font-sans font-bold"
                    style={{ borderColor: HAIRLINE }}
                  >
                    <option value="supports">Supports Recognition</option>
                    <option value="neutral">Neutral</option>
                    <option value="denies">Divergent</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center bg-gray-50/20" style={{ borderColor: HAIRLINE }}>
                <ShieldAlert className="text-gray-400 mb-2" size={28} />
                <p className="text-xs text-gray-500 font-sans max-w-xs leading-relaxed">
                  Please check the safety acknowledgment checkbox above to unlock the Lal Kitab recognition dashboard.
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-4 text-xs leading-relaxed" style={{ borderColor: HAIRLINE }}>
            <span className="font-bold uppercase block text-gray-500 font-sans mb-1">Prescription Safety Block</span>
            <p className="text-[11px] text-gray-600 leading-normal">
              Remedies sit under deep restrictions. Never prescribe gemstones, mantras, or upāyas without full medical/legal disclaimers, proper lineage authority, and the structured verification of Module 21.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
