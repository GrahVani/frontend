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

interface VocationSignification {
  ak: string;
  sign: string;
  calling: string;
  deva: string;
}

const VOCATION_MAP: Record<string, VocationSignification> = {
  Sun: { ak: "Sun (Surya)", sign: "Leo", calling: "Leadership, Government, Public Administration", deva: "Shiva" },
  Jupiter: { ak: "Jupiter (Guru)", sign: "Sagittarius", calling: "Wisdom, Teaching, Spiritual Counsel", deva: "Prajapati" },
  Mercury: { ak: "Mercury (Budha)", sign: "Gemini", calling: "Communication, Commerce, Astrology, Writing", deva: "Vishnu" },
  Saturn: { ak: "Saturn (Shani)", sign: "Capricorn", calling: "Hard labor, Service, Organizational Discipline", deva: "Yama" }
};

export function JaiminiCallingDecisionTree() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("q2");
  const [activeAK, setActiveAK] = useState<"Sun" | "Jupiter" | "Mercury" | "Saturn">("Sun");
  const [jaiminiVerdict, setJaiminiVerdict] = useState<"supports" | "neutral" | "denies">("supports");

  const preset = useMemo(() => {
    return PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  }, [selectedPresetId]);

  const vocation = VOCATION_MAP[activeAK];

  // South Indian style 12 houses coordinates for SVG
  const houses = [
    { sign: "Pisces", x: 0, y: 0, num: 12 },
    { sign: "Aries", x: 15, y: 0, num: 1 },
    { sign: "Taurus", x: 30, y: 0, num: 2 },
    { sign: "Gemini", x: 45, y: 0, num: 3 },
    { sign: "Cancer", x: 45, y: 15, num: 4 },
    { sign: "Leo", x: 45, y: 30, num: 5 },
    { sign: "Virgo", x: 45, y: 45, num: 6 },
    { sign: "Libra", x: 30, y: 45, num: 7 },
    { sign: "Scorpio", x: 15, y: 45, num: 8 },
    { sign: "Sagittarius", x: 0, y: 45, num: 9 },
    { sign: "Capricorn", x: 0, y: 30, num: 10 },
    { sign: "Aquarius", x: 0, y: 15, num: 11 }
  ];

  // Find Karakāṁśa sign (where AK sits in Navāṁśa)
  const karakamsaSignName = vocation.sign;
  const karakamsaHouse = houses.find(h => h.sign === karakamsaSignName) || houses[0];

  // Compute 10th-from-Karakāṁśa house
  const targetSignIndex = (houses.findIndex(h => h.sign === karakamsaSignName) + 9) % 12;
  const tenthHouse = houses[targetSignIndex];

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="jaimini-calling-decision-tree"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Jaimini Calling Decision Tree
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Jaimini Atmakaraka & Karakāṁśa soul vocation
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
            {PRESETS.filter(p => p.suggestedType === "purpose" || p.id === "q2").map((p) => (
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Left Side: Controls & SVG South Indian Grid */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg" style={{ color: GOLD }}>1. Atmakāraka & Karakāṁśa Setup</h3>

          {/* Atmakaraka selector */}
          <div className="flex gap-4 items-center">
            <span className="text-sm font-semibold">Atmakāraka (AK):</span>
            <select
              value={activeAK}
              onChange={(e) => setActiveAK(e.target.value as any)}
              className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
              style={{ borderColor: HAIRLINE }}
            >
              <option value="Sun">Sun</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Mercury">Mercury</option>
              <option value="Saturn">Saturn</option>
            </select>
          </div>

          {/* SVG South Indian Navamsa Grid */}
          <div className="w-full bg-white/50 border rounded-lg p-4 shadow-inner flex flex-col items-center" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs uppercase tracking-wider mb-3 font-bold font-sans text-gray-500">Navāṁśa Chart (Karakāṁśa mapping)</span>
            <svg className="w-full max-w-[240px] h-44" viewBox="0 0 60 60">
              {/* Outer grid boundary */}
              <rect x="0" y="0" width="60" height="60" fill="none" stroke="#78350f" strokeWidth="1" />

              {/* Draw 12 houses */}
              {houses.map((h) => {
                const isKarakamsa = h.sign === karakamsaSignName;
                const isTenth = h.sign === tenthHouse.sign;

                return (
                  <g key={h.sign}>
                    {/* House border */}
                    <rect
                      x={h.x}
                      y={h.y}
                      width="15"
                      height="15"
                      fill={isKarakamsa ? "#fef3c7" : isTenth ? "#dbeafe" : "#fff"}
                      stroke="#b45309"
                      strokeWidth="0.5"
                    />
                    {/* Planet text */}
                    {isKarakamsa && (
                      <text x={h.x + 7.5} y={h.y + 6} fontSize="3" fontWeight="bold" fill="#78350f" textAnchor="middle">
                        [AK: {activeAK}]
                      </text>
                    )}
                    {isTenth && (
                      <text x={h.x + 7.5} y={h.y + 6} fontSize="3.5" fontWeight="bold" fill="#1e3a8a" textAnchor="middle">
                        10th
                      </text>
                    )}
                    {/* House/Sign Name */}
                    <text x={h.x + 7.5} y={h.y + 12} fontSize="2" fill={INK_SECONDARY} textAnchor="middle">
                      {h.sign}
                    </text>
                  </g>
                );
              })}

              {/* Center space label */}
              <rect x="15" y="15" width="30" height="30" fill="#fffbeb" stroke="#b45309" strokeWidth="0.5" />
              <text x="30" y="27" fontSize="2.5" fontWeight="bold" fill={GOLD} textAnchor="middle">JAIMINĪ</text>
              <text x="30" y="32" fontSize="2" fill={INK_SECONDARY} textAnchor="middle">Karakāṁśa</text>
              <text x="30" y="37" fontSize="2" fill={INK_SECONDARY} textAnchor="middle">Vocation Map</text>

              {/* Aspect line from Karakāṁśa to 10th */}
              <line
                x1={karakamsaHouse.x + 7.5}
                y1={karakamsaHouse.y + 7.5}
                x2={tenthHouse.x + 7.5}
                y2={tenthHouse.y + 7.5}
                stroke="#3b82f6"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </svg>
            <div className="text-center text-xs mt-2 italic text-gray-500">
              Gold signifies the Karakāṁśa Lagna (**{vocation.sign}**). Blue indicates the 10th house of calling (**{tenthHouse.sign}**).
            </div>
          </div>
        </div>

        {/* Right Side: Verdict and Warnings */}
        <div className="flex flex-col justify-between p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: GOLD }}>2. Soul Vocation Calling</h3>

            <div className="p-4 rounded-lg border bg-white/80 shadow-sm mb-4" style={{ borderColor: HAIRLINE }}>
              <span className="text-xs uppercase tracking-wider block text-amber-900 font-sans font-bold">Karakāṁśa Signification</span>
              <ul className="mt-2 space-y-1.5 text-xs">
                <li>• **Atmakāraka Planet:** {vocation.ak}</li>
                <li>• **Karakāṁśa Sign:** {vocation.sign}</li>
                <li>• **10th from Karakāṁśa:** {tenthHouse.sign}</li>
                <li>• **Soul Calling Tendencies:** {vocation.calling}</li>
                <li>• **Vāsanā/Deity Representative:** {vocation.deva}</li>
              </ul>
              <div className="mt-3">
                <span className="text-xs font-semibold font-sans text-gray-600">Jaimini Layer Verdict:</span>
                <select
                  value={jaiminiVerdict}
                  onChange={(e) => setJaiminiVerdict(e.target.value as any)}
                  className="ml-2 px-2 py-0.5 text-xs border rounded bg-transparent font-sans font-bold"
                  style={{ borderColor: HAIRLINE }}
                >
                  <option value="supports">Confirm Call</option>
                  <option value="neutral">Neutral/Dormant</option>
                  <option value="denies">Divergent</option>
                </select>
              </div>
            </div>

            {/* Jaimini Ethics Guard */}
            <div className="p-3 rounded-lg border bg-amber-50 border-amber-200 text-amber-900 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider block text-amber-800 font-sans flex items-center gap-1">
                <ShieldAlert size={14} />
                Jaimini Vocation Ethics Guard:
              </span>
              <p className="text-[11px] leading-relaxed mt-1 text-gray-700">
                <strong>Describe, don't command:</strong> Vocation is an area of conscious alignment. Counsel tendencies, but preserve client agency. Never tell a client "you must become a priest."
              </p>
            </div>
          </div>

          <div className="border-t pt-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs font-bold uppercase tracking-wider block text-gray-500 font-sans">Precedence seed rule</span>
            <p className="text-xs mt-1" style={{ color: INK_SECONDARY }}>
              For calling, character, and dharma questions, Jaimini Atmakaraka and Karakamsa indications override the corporate houses of the Parāśari base.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
