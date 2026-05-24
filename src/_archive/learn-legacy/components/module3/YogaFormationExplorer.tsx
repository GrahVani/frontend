"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Coins, Star, ArrowRight, Info, RotateCcw,
  GitMerge, Lightbulb, Shield, CircleDot,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
type YogaCategory = "raja" | "dhana" | "mahapurusha";

interface YogaExample {
  id: string;
  name: string;
  sanskrit?: string;
  description: string;
  // Houses to highlight on wheel
  primaryHouses: number[];
  secondaryHouses: number[];
  // Planet placements: house -> { planet, isLord, lordOf }
  placements: { house: number; planet: string; role: "lord" | "planet"; lordOf?: number; sign?: string }[];
  // Logic gate: IF conditions
  conditions: string[];
  // Result
  result: string;
  color: string;
  bg: string;
  border: string;
}

interface CategoryData {
  id: YogaCategory;
  label: string;
  sanskrit: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  description: string;
  housesLabel: string;
  examples: YogaExample[];
}

// ─── Data ─────────────────────────────────────────────────────
const CATEGORIES: CategoryData[] = [
  {
    id: "raja",
    label: "Raja Yoga",
    sanskrit: "राजयोग",
    icon: <Crown className="w-5 h-5" />,
    color: "#7c3aed",
    gradient: "from-violet-500 to-purple-600",
    description: "Kendra lords (1, 4, 7, 10) unite with Trikona lords (1, 5, 9). When action pillars connect with blessing houses, royalty is produced.",
    housesLabel: "Kendras + Trikonas",
    examples: [
      {
        id: "dharma-karmadhipati",
        name: "Dharma-Karmadhipati Raja Yoga",
        sanskrit: "धर्मकर्माधिपति राजयोग",
        description: "The supreme Raja Yoga. The lord of purpose (9th) and the lord of career (10th) exchange or conjoin.",
        primaryHouses: [9, 10],
        secondaryHouses: [1, 4, 5, 7],
        placements: [
          { house: 10, planet: "Ju", role: "lord", lordOf: 9 },
          { house: 9, planet: "Sa", role: "lord", lordOf: 10 },
        ],
        conditions: [
          "Lord of 9th House (Trikona) is placed in 10th House (Kendra)",
          "Lord of 10th House (Kendra) is placed in 9th House (Trikona)",
        ],
        result: "Highest Raja Yoga — alignment of Dharma (purpose) and Karma (career). Supreme status.",
        color: "#7c3aed",
        bg: "#f5f3ff",
        border: "#c4b5fd",
      },
      {
        id: "kendra-trikona-mutual",
        name: "Kendra-Trikona Mutual Aspect",
        sanskrit: "केन्द्रत्रिकोण परस्पर दृष्टि",
        description: "Any Kendra lord aspects a Trikona lord, and vice versa. The pillars and blessings see each other.",
        primaryHouses: [1, 5],
        secondaryHouses: [4, 7, 9, 10],
        placements: [
          { house: 1, planet: "Ma", role: "lord", lordOf: 1 },
          { house: 5, planet: "Su", role: "lord", lordOf: 5 },
        ],
        conditions: [
          "1st Lord (Kendra) aspects 5th Lord (Trikona)",
          "5th Lord (Trikona) aspects 1st Lord (Kendra)",
        ],
        result: "Powerful Raja Yoga — self-identity aligned with creative intelligence and children.",
        color: "#7c3aed",
        bg: "#f5f3ff",
        border: "#c4b5fd",
      },
    ],
  },
  {
    id: "dhana",
    label: "Dhana Yoga",
    sanskrit: "धनयोग",
    icon: <Coins className="w-5 h-5" />,
    color: "#059669",
    gradient: "from-emerald-500 to-teal-600",
    description: "Wealth houses (2nd and 11th) connect with fortune houses (5th and 9th). Liquid assets + luck + intellect = prosperity.",
    housesLabel: "Wealth + Fortune Houses",
    examples: [
      {
        id: "wealth-fortune-conjoin",
        name: "Wealth-Fortune Conjunction",
        sanskrit: "धनभाग्य योग",
        description: "The lord of accumulated wealth (2nd) joins the lord of speculative gains (5th).",
        primaryHouses: [2, 5],
        secondaryHouses: [9, 11],
        placements: [
          { house: 5, planet: "Ve", role: "lord", lordOf: 2 },
          { house: 5, planet: "Ju", role: "lord", lordOf: 5 },
        ],
        conditions: [
          "2nd Lord (wealth accumulation) placed in 5th House",
          "5th Lord (speculation, intellect) conjoins 2nd Lord",
        ],
        result: "Dhana Yoga — massive wealth through intelligence, investments, and creative ventures.",
        color: "#059669",
        bg: "#ecfdf5",
        border: "#6ee7b7",
      },
      {
        id: "gains-lord-in-luck",
        name: "Gains Lord in Luck House",
        sanskrit: "लाभेश भाग्यस्थ",
        description: "The lord of gains (11th) sits in the house of fortune (9th). Income is blessed by luck.",
        primaryHouses: [11, 9],
        secondaryHouses: [2, 5],
        placements: [
          { house: 9, planet: "Me", role: "lord", lordOf: 11 },
        ],
        conditions: [
          "11th Lord (gains, network) placed in 9th House (fortune)",
          "9th House receives the energy of incoming wealth",
        ],
        result: "Strong Dhana Yoga — financial windfalls through luck, father, gurus, and foreign connections.",
        color: "#059669",
        bg: "#ecfdf5",
        border: "#6ee7b7",
      },
    ],
  },
  {
    id: "mahapurusha",
    label: "Pancha Mahapurusha",
    sanskrit: "पञ्चमहापुरुषयोग",
    icon: <Star className="w-5 h-5" />,
    color: "#dc2626",
    gradient: "from-rose-500 to-red-600",
    description: "Each is formed when a specific physical planet sits in a Kendra (1, 4, 7, 10) in its Own Sign or Exaltation. Creates a 'Great Person'.",
    housesLabel: "Kendras Only",
    examples: [
      {
        id: "ruchaka",
        name: "Ruchaka Yoga (Mars)",
        sanskrit: "रुचक योग",
        description: "Mars in a Kendra in its Own Sign (Aries/Scorpio) or Exaltation (Capricorn). Creates a supreme commander.",
        primaryHouses: [1],
        secondaryHouses: [4, 7, 10],
        placements: [
          { house: 1, planet: "Ma", role: "planet", sign: "Aries" },
        ],
        conditions: [
          "Mars placed in a Kendra (1, 4, 7, or 10)",
          "Mars is in Own Sign (Aries/Scorpio) OR Exaltation (Capricon)",
        ],
        result: "Ruchaka Yoga — courage, athleticism, military command, real estate, unshakeable will.",
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fca5a5",
      },
      {
        id: "hamsa",
        name: "Hamsa Yoga (Jupiter)",
        sanskrit: "हंस योग",
        description: "Jupiter in a Kendra in its Own Sign (Sagittarius/Pisces) or Exaltation (Cancer). Creates a spiritual teacher.",
        primaryHouses: [4],
        secondaryHouses: [1, 7, 10],
        placements: [
          { house: 4, planet: "Ju", role: "planet", sign: "Cancer" },
        ],
        conditions: [
          "Jupiter placed in a Kendra (1, 4, 7, or 10)",
          "Jupiter is in Own Sign (Sagittarius/Pisces) OR Exaltation (Cancer)",
        ],
        result: "Hamsa Yoga — wisdom, teaching, religious authority, moral stature, and grace.",
        color: "#ea580c",
        bg: "#fff7ed",
        border: "#fdba74",
      },
      {
        id: "bhadra",
        name: "Bhadra Yoga (Mercury)",
        sanskrit: "भद्र योग",
        description: "Mercury in a Kendra in its Own Sign (Gemini/Virgo) or Exaltation (Virgo). Creates a scholar and orator.",
        primaryHouses: [7],
        secondaryHouses: [1, 4, 10],
        placements: [
          { house: 7, planet: "Me", role: "planet", sign: "Virgo" },
        ],
        conditions: [
          "Mercury placed in a Kendra (1, 4, 7, or 10)",
          "Mercury is in Own Sign (Gemini/Virgo) OR Exaltation (Virgo)",
        ],
        result: "Bhadra Yoga — intellect, communication, business acumen, and persuasive speech.",
        color: "#0891b2",
        bg: "#f0fdfa",
        border: "#5eead4",
      },
      {
        id: "malavya",
        name: "Malavya Yoga (Venus)",
        sanskrit: "मालव्य योग",
        description: "Venus in a Kendra in its Own Sign (Taurus/Libra) or Exaltation (Pisces). Creates a statesman and diplomat.",
        primaryHouses: [10],
        secondaryHouses: [1, 4, 7],
        placements: [
          { house: 10, planet: "Ve", role: "planet", sign: "Pisces" },
        ],
        conditions: [
          "Venus placed in a Kendra (1, 4, 7, or 10)",
          "Venus is in Own Sign (Taurus/Libra) OR Exaltation (Pisces)",
        ],
        result: "Malavya Yoga — luxury, diplomacy, vehicles, refined relationships, and political skill.",
        color: "#db2777",
        bg: "#fdf2f8",
        border: "#f9a8d4",
      },
      {
        id: "shasha",
        name: "Shasha Yoga (Saturn)",
        sanskrit: "शश योग",
        description: "Saturn in a Kendra in its Own Sign (Capricorn/Aquarius) or Exaltation (Libra). Creates a ruler through discipline.",
        primaryHouses: [1],
        secondaryHouses: [4, 7, 10],
        placements: [
          { house: 1, planet: "Sa", role: "planet", sign: "Libra" },
        ],
        conditions: [
          "Saturn placed in a Kendra (1, 4, 7, or 10)",
          "Saturn is in Own Sign (Capricorn/Aquarius) OR Exaltation (Libra)",
        ],
        result: "Shasha Yoga — discipline, land ownership, political power, and mass leadership.",
        color: "#475569",
        bg: "#f1f5f9",
        border: "#94a3b8",
      },
    ],
  },
];

// ─── Geometry Helpers ─────────────────────────────────────────
function getHouseAngle(houseNum: number) {
  const deg = -90 - (houseNum - 1) * 30;
  return (deg * Math.PI) / 180;
}

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function getHouseFill(
  houseNum: number,
  category: CategoryData,
  example: YogaExample | null,
) {
  const isPrimary = example?.primaryHouses.includes(houseNum) ?? false;
  const isSecondary = example?.secondaryHouses.includes(houseNum) ?? false;

  if (isPrimary) return { fill: category.color + "22", stroke: category.color, strokeWidth: 2.5 };
  if (isSecondary) return { fill: category.color + "0d", stroke: category.color + "80", strokeWidth: 1.2 };

  // Default groupings when no example selected
  if (category.id === "raja") {
    const kendras = [1, 4, 7, 10];
    const trikonas = [1, 5, 9];
    if (kendras.includes(houseNum)) return { fill: "#7c3aed10", stroke: "#c4b5fd60", strokeWidth: 1 };
    if (trikonas.includes(houseNum)) return { fill: "#f59e0b10", stroke: "#fcd34d60", strokeWidth: 1 };
  }
  if (category.id === "dhana") {
    const wealth = [2, 11];
    const fortune = [5, 9];
    if (wealth.includes(houseNum)) return { fill: "#05966910", stroke: "#6ee7b760", strokeWidth: 1 };
    if (fortune.includes(houseNum)) return { fill: "#f59e0b10", stroke: "#fcd34d60", strokeWidth: 1 };
  }
  if (category.id === "mahapurusha") {
    const kendras = [1, 4, 7, 10];
    if (kendras.includes(houseNum)) return { fill: "#dc262610", stroke: "#fca5a560", strokeWidth: 1 };
  }

  return { fill: "transparent", stroke: "#e2e8f0", strokeWidth: 1 };
}

// ─── Component ────────────────────────────────────────────────
export default function YogaFormationExplorer() {
  const [categoryId, setCategoryId] = useState<YogaCategory>("raja");
  const [exampleId, setExampleId] = useState<string>("dharma-karmadhipati");

  const category = useMemo(() => CATEGORIES.find((c) => c.id === categoryId)!, [categoryId]);
  const example = useMemo(() => category.examples.find((e) => e.id === exampleId) ?? category.examples[0], [category, exampleId]);

  // Reset example when category changes
  React.useEffect(() => {
    setExampleId(category.examples[0].id);
  }, [categoryId]);

  const cx = 280;
  const cy = 280;
  const rOuter = 220;
  const rMid = 160;
  const rInner = 100;
  const rLabel = 250;
  const rPlanet = 190;

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-violet-50/20 to-amber-50/20 rounded-2xl border border-violet-200/60 shadow-lg p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-violet-900">Yoga Formation Explorer</h3>
        <p className="text-sm text-violet-700 mt-1">
          A Yoga is a union of planetary energies. Select a category and example to see how house lords connect.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {CATEGORIES.map((cat) => {
          const active = cat.id === categoryId;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
                active ? "scale-105 shadow-lg" : "hover:scale-[1.02] hover:shadow-md opacity-80 hover:opacity-100"
              }`}
              style={{
                background: active ? cat.color + "12" : "#fff",
                borderColor: active ? cat.color : "#e2e8f0",
                color: active ? cat.color : "#64748b",
              }}
            >
              <span style={{ color: active ? cat.color : "#94a3b8" }}>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="text-[10px] font-medium opacity-70 hidden sm:inline">{cat.sanskrit}</span>
            </button>
          );
        })}
      </div>

      {/* Category Info Banner */}
      <div className="rounded-xl border p-3 mb-5 flex items-start gap-3" style={{ background: category.color + "08", borderColor: category.color + "30" }}>
        <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: category.color }} />
        <div>
          <p className="text-sm font-bold" style={{ color: category.color }}>{category.label} — {category.sanskrit}</p>
          <p className="text-xs text-gray-600 mt-0.5">{category.description}</p>
        </div>
      </div>

      {/* Example Selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {category.examples.map((ex) => {
          const active = ex.id === exampleId;
          return (
            <button
              key={ex.id}
              onClick={() => setExampleId(ex.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                active ? "shadow-md scale-105" : "hover:scale-[1.02] opacity-70 hover:opacity-100"
              }`}
              style={{
                background: active ? ex.color + "15" : "#fff",
                borderColor: active ? ex.color : "#e2e8f0",
                color: active ? ex.color : "#64748b",
              }}
            >
              {ex.name}
            </button>
          );
        })}
      </div>

      {/* Main Content: Chart + Logic */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: SVG Chart */}
        <div className="flex-1 flex justify-center min-w-0">
          <svg viewBox="0 0 560 560" className="w-full h-auto max-w-[520px]">
            {/* Outer rim */}
            <circle cx={cx} cy={cy} r={rOuter} fill="#fafafa" stroke="#e2e8f0" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={rOuter - 1} fill="none" stroke="#fff" strokeWidth={2} />

            {/* Middle reference ring */}
            <circle cx={cx} cy={cy} r={rMid} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />

            {/* Inner hub */}
            <circle cx={cx} cy={cy} r={rInner} fill="#fff" stroke="#e2e8f0" strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={4} fill="#475569" />

            {/* House spokes */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = getHouseAngle(i + 1);
              const x = cx + rOuter * Math.cos(angle);
              const y = cy + rOuter * Math.sin(angle);
              return (
                <line key={`spoke-${i}`} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth={1.5} />
              );
            })}

            {/* House wedges */}
            {Array.from({ length: 12 }).map((_, i) => {
              const houseNum = i + 1;
              const angle = getHouseAngle(houseNum);
              const nextAngle = getHouseAngle(houseNum === 12 ? 1 : houseNum + 1);
              const x1 = cx + rOuter * Math.cos(angle);
              const y1 = cy + rOuter * Math.sin(angle);
              const x2 = cx + rOuter * Math.cos(nextAngle);
              const y2 = cy + rOuter * Math.sin(nextAngle);

              const style = getHouseFill(houseNum, category, example);

              return (
                <path
                  key={`wedge-${houseNum}`}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 0 ${x2} ${y2} Z`}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                />
              );
            })}

            {/* House labels */}
            {Array.from({ length: 12 }).map((_, i) => {
              const houseNum = i + 1;
              const angle = getHouseAngle(houseNum);
              const pos = polar(cx, cy, rLabel, angle);
              const isPrimary = example?.primaryHouses.includes(houseNum);
              const isSecondary = example?.secondaryHouses.includes(houseNum);
              return (
                <text
                  key={`label-${houseNum}`}
                  x={pos.x} y={pos.y}
                  textAnchor="middle" dominantBaseline="central"
                  className="text-lg font-bold"
                  fill={isPrimary ? category.color : isSecondary ? category.color + "aa" : "#94a3b8"}
                >
                  {houseNum}
                </text>
              );
            })}

            {/* Kendra / Trikona / etc labels when no example selected */}
            {!example && category.id === "raja" && (
              <>
                <text x={cx} y={cy - rMid - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#7c3aed">Kendra</text>
                <text x={cx} y={cy - rMid + 4} textAnchor="middle" fontSize={9} fill="#7c3aedaa">(1, 4, 7, 10)</text>
                <text x={cx} y={cy + rMid + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">Trikona</text>
                <text x={cx} y={cy + rMid + 32} textAnchor="middle" fontSize={9} fill="#d97706aa">(1, 5, 9)</text>
              </>
            )}
            {!example && category.id === "dhana" && (
              <>
                <text x={cx} y={cy - rMid - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#059669">Wealth</text>
                <text x={cx} y={cy - rMid + 4} textAnchor="middle" fontSize={9} fill="#059669aa">(2, 11)</text>
                <text x={cx} y={cy + rMid + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">Fortune</text>
                <text x={cx} y={cy + rMid + 32} textAnchor="middle" fontSize={9} fill="#d97706aa">(5, 9)</text>
              </>
            )}
            {!example && category.id === "mahapurusha" && (
              <>
                <text x={cx} y={cy - rMid - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">Kendra</text>
                <text x={cx} y={cy - rMid + 4} textAnchor="middle" fontSize={9} fill="#dc2626aa">(1, 4, 7, 10)</text>
                <text x={cx} y={cy + 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">Own / Exaltation</text>
              </>
            )}

            {/* Connection lines between planets */}
            <AnimatePresence>
              {example && example.placements.length > 1 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {example.placements.map((p, i) => {
                    const next = example.placements[(i + 1) % example.placements.length];
                    if (p.house === next.house) return null; // Same house — conjunction, not line
                    const a1 = getHouseAngle(p.house);
                    const a2 = getHouseAngle(next.house);
                    const pos1 = polar(cx, cy, rPlanet, a1);
                    const pos2 = polar(cx, cy, rPlanet, a2);
                    return (
                      <g key={`conn-${i}`}>
                        <motion.line
                          x1={pos1.x} y1={pos1.y}
                          x2={pos2.x} y2={pos2.y}
                          stroke={example.color}
                          strokeWidth={3}
                          strokeDasharray="6 4"
                          opacity={0.5}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                        <motion.line
                          x1={pos1.x} y1={pos1.y}
                          x2={pos2.x} y2={pos2.y}
                          stroke={example.color}
                          strokeWidth={10}
                          opacity={0.06}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      </g>
                    );
                  })}
                </motion.g>
              )}
            </AnimatePresence>

            {/* Planet markers */}
            <AnimatePresence>
              {example && example.placements.map((p) => {
                const angle = getHouseAngle(p.house);
                const pos = polar(cx, cy, rPlanet, angle);
                const isLord = p.role === "lord";
                return (
                  <motion.g
                    key={`planet-${p.house}-${p.planet}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {/* Glow */}
                    <circle cx={pos.x} cy={pos.y} r={28} fill={example.color} opacity={0.1} />
                    {/* Ring */}
                    <circle cx={pos.x} cy={pos.y} r={22} fill="#fff" stroke={example.color} strokeWidth={isLord ? 3 : 2} />
                    {/* Planet glyph */}
                    <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={800} fill={example.color}>
                      {p.planet}
                    </text>
                    {/* Badge: role */}
                    <rect x={pos.x - 26} y={pos.y + 24} width={52} height={16} rx={5} fill={isLord ? example.color : "#64748b"} opacity={0.9} />
                    <text x={pos.x} y={pos.y + 34} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">
                      {isLord ? `${p.lordOf}L` : p.planet}
                    </text>
                    {/* Sign label */}
                    {p.sign && (
                      <text x={pos.x} y={pos.y - 30} textAnchor="middle" fontSize={9} fontWeight={600} fill="#64748b">
                        {p.sign}
                      </text>
                    )}
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {/* Center label */}
            <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill="#94a3b8">
              {category.housesLabel}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={10} fill="#cbd5e1">
              {category.id === "mahapurusha" ? "Physical Planet + Sign" : "House Lord Connection"}
            </text>
          </svg>
        </div>

        {/* Right: Logic & Details Panel */}
        <div className="lg:w-96 shrink-0 space-y-4 w-full">
          {/* Logic Gate Card */}
          <div className="bg-white rounded-xl border border-violet-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <GitMerge className="w-4 h-4 text-violet-600" />
              <h4 className="text-xs font-bold text-violet-700 uppercase tracking-wide">Logic Gate</h4>
            </div>

            {example ? (
              <div className="space-y-2">
                {example.conditions.map((cond, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white" style={{ background: category.color }}>
                      {idx === 0 ? "IF" : "AND"}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed pt-0.5">{cond}</p>
                  </div>
                ))}
                <div className="flex items-start gap-2 pt-1">
                  <span className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white bg-green-600">
                    THEN
                  </span>
                  <p className="text-xs font-bold text-green-700 leading-relaxed pt-0.5">{example.result}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Select an example to see the IF/AND/THEN logic.</p>
            )}
          </div>

          {/* Example Details */}
          {example && (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border p-4"
              style={{ background: example.bg, borderColor: example.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" style={{ color: example.color }} />
                <h4 className="text-sm font-bold" style={{ color: example.color }}>{example.name}</h4>
              </div>
              {example.sanskrit && (
                <p className="text-[11px] font-medium text-gray-500 mb-2">{example.sanskrit}</p>
              )}
              <p className="text-xs text-gray-700 leading-relaxed">{example.description}</p>

              {/* Placements table */}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: example.border }}>
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Chart Placements</p>
                <div className="space-y-1.5">
                  {example.placements.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: example.color }}>
                        {p.house}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="font-bold" style={{ color: example.color }}>{p.planet}</span>
                      <span className="text-gray-500">{p.role === "lord" ? `(${p.lordOf}th Lord)` : `(Physical Planet)`}</span>
                      {p.sign && <span className="text-gray-400">in {p.sign}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Legend */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CircleDot className="w-3.5 h-3.5 text-gray-500" />
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Legend</h4>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ background: category.color + "22", border: `2px solid ${category.color}` }} />
                <span className="text-[11px] text-gray-600">Primary Houses (directly involved)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ background: category.color + "0d", border: `1.2px solid ${category.color}80` }} />
                <span className="text-[11px] text-gray-600">Secondary Houses (supporting group)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: category.color }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: category.color }} />
                </div>
                <span className="text-[11px] text-gray-600">Planet with Lord badge = House Lord</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 border-b-2 border-dashed" style={{ borderColor: category.color }} />
                <span className="text-[11px] text-gray-600">Dashed line = Connection between lords</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Senior Astrologer Note */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold">Senior Astrologer Note:</span>{" "}
            The <strong>most critical rule</strong> beginners forget: Yogas are formed by{" "}
            <strong>House Lords</strong>, not just planets sitting in houses. A planet in the 10th house
            does NOT create a Raja Yoga by itself — the <em>lord</em> of the 9th must connect with the{" "}
            <em>lord</em> of the 10th. Always trace the lord, not just the occupant.
          </p>
        </div>
      </div>
    </div>
  );
}
