"use client";

import { useMemo, useState } from "react";
import { Info, ShieldAlert, Sparkles } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { PRESETS } from '@/components/learning-runtime/interactive/layered-shared-data';

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function ParasharaDefaultExplorer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("q1");
  const [attemptedBaseDeselect, setAttemptedBaseDeselect] = useState<boolean>(false);

  const preset = useMemo(() => {
    return PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  }, [selectedPresetId]);

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="parashara-default-explorer"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Parāśara as Default Explorer
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            The "Layer, Not Substitute" Primacy check
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
              setAttemptedBaseDeselect(false);
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


      <div className="mb-6 p-4 rounded-lg border bg-white/40 shadow-sm" style={{ borderColor: HAIRLINE }}>
        <p className="text-sm font-semibold mb-1" style={{ color: GOLD }}>Query text:</p>
        <p className="text-lg italic">"{preset.text}"</p>
      </div>

      {/* Main Grid: Tree Visualization and Layers Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Left Side: SVG Root-and-Branch visualizer */}
        <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider mb-4 font-bold font-sans text-gray-500">The Doctrinal Tree</span>
          <svg className="w-full max-w-[280px] h-52" viewBox="0 0 100 90">
            {/* Trunk: Parāśara */}
            <path
              d="M 50 85 L 50 50"
              stroke="#78350f"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Glowing Aura for Trunk */}
            <path
              d="M 50 85 L 50 50"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.25"
              className="animate-pulse"
            />
            <text x="50" y="65" fontSize="4.5" fontWeight="bold" fill="#fff" textAnchor="middle" style={{ fontFamily: "sans-serif" }}>MŪLA</text>

            {/* Branches: Secondary layers */}
            {/* Branch 1: KP */}
            <path
              d="M 50 55 C 40 45, 30 45, 20 40"
              fill="none"
              stroke={preset.recommendedLayers.includes("kp") ? "#d97706" : "#cbd5e1"}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text x="18" y="36" fontSize="4" fontWeight="bold" fill={preset.recommendedLayers.includes("kp") ? GOLD : "#94a3b8"} textAnchor="middle" style={{ fontFamily: "sans-serif" }}>KP</text>

            {/* Branch 2: Jaimini */}
            <path
              d="M 50 50 C 42 38, 35 32, 30 20"
              fill="none"
              stroke={preset.recommendedLayers.includes("jaimini") ? "#7c3aed" : "#cbd5e1"}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text x="30" y="16" fontSize="4" fontWeight="bold" fill={preset.recommendedLayers.includes("jaimini") ? GOLD : "#94a3b8"} textAnchor="middle" style={{ fontFamily: "sans-serif" }}>Jaimini</text>

            {/* Branch 3: Tajika */}
            <path
              d="M 50 50 C 58 38, 65 32, 70 20"
              fill="none"
              stroke={preset.recommendedLayers.includes("tajika") ? "#2563eb" : "#cbd5e1"}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text x="70" y="16" fontSize="4" fontWeight="bold" fill={preset.recommendedLayers.includes("tajika") ? GOLD : "#94a3b8"} textAnchor="middle" style={{ fontFamily: "sans-serif" }}>Tajika</text>

            {/* Branch 4: Lal Kitab */}
            <path
              d="M 50 55 C 60 45, 70 45, 80 40"
              fill="none"
              stroke={preset.recommendedLayers.includes("lal-kitab") ? "#16a34a" : "#cbd5e1"}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text x="82" y="36" fontSize="4" fontWeight="bold" fill={preset.recommendedLayers.includes("lal-kitab") ? GOLD : "#94a3b8"} textAnchor="middle" style={{ fontFamily: "sans-serif" }}>Lal Kitab</text>

            {/* Root/Base badge */}
            <rect x="25" y="80" width="50" height="8" rx="2" fill="#78350f" />
            <text x="50" y="85" fontSize="3.5" fontWeight="bold" fill="#fff" textAnchor="middle" style={{ fontFamily: "sans-serif" }}>PARĀŚARA BASE</text>
          </svg>
        </div>

        {/* Right Side: Available Streams Layer Selection */}
        <div className="flex flex-col justify-between p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ color: GOLD }}>Available Streams Layer Selection</h4>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold p-2.5 rounded border bg-amber-50/50 hover:bg-amber-100/50 transition-colors" style={{ borderColor: HAIRLINE }}>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => setAttemptedBaseDeselect(true)}
                  className="accent-amber-700 h-4 w-4"
                />
                <span className="text-sm font-sans">Parāśara (Locked Natal Base)</span>
              </label>

              {["KP", "Jaimini", "Lal Kitab", "Tājika"].map((stream) => {
                const isChecked = preset.recommendedLayers.includes(stream.toLowerCase().replace(" ", "-"));
                return (
                  <label key={stream} className="flex items-center gap-2 opacity-60 cursor-not-allowed p-2.5 rounded border border-gray-200 bg-gray-50/30">
                    <input
                      type="checkbox"
                      disabled
                      checked={isChecked}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-sans font-medium">{stream} {isChecked && "➔ (Recommended)"}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <span className="text-xs uppercase tracking-wider block text-gray-500 font-sans font-semibold">Base Status</span>
            <span className="text-lg font-bold flex items-center gap-1 text-green-700">
              <Sparkles size={18} /> Active & Locked
            </span>
          </div>
        </div>
      </div>

      {/* Warnings & Rationale */}
      {attemptedBaseDeselect && (
        <div className="mb-6 p-4 rounded-lg border flex items-start gap-3 bg-red-50 border-red-200 text-red-900 animate-fade-in shadow-sm">
          <ShieldAlert size={22} className="shrink-0 mt-0.5 text-red-700 animate-pulse" />
          <div>
            <p className="font-bold text-sm">Substitution Blocked: Parāśara is the Immutable Base</p>
            <p className="text-xs mt-1 leading-relaxed">
              <em>mūlaṁ tyaktvā na kutrāpi</em> — "Never anywhere abandoning the root."
              In Grahvani, you can only layer supplementary lenses (KP, Jaimini, Lal Kitab, Tajika) onto the base chart. You can never substitute or disable the base Parāśari readings.
            </p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg border" style={{ backgroundColor: SURFACE_2, borderColor: HAIRLINE }}>
        <h4 className="font-bold text-sm mb-1" style={{ color: GOLD }}>Rule Rationale</h4>
        <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
          The Parāśari framework defines the raw planetary dignities, houses, and dasas (the constitution of the chart). Secondary systems can clarify binary timelines or spiritual vocations, but they must not be used to override the root promises.
        </p>
      </div>
    </div>
  );
}
