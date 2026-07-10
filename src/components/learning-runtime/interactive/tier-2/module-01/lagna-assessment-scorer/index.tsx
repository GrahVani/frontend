"use client";

import { useMemo, useState } from "react";
import { Info, HelpCircle, CheckCircle2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CHARTS,
  DOMAINS,
  type DomainKey,
  getSignOfHouse,
  SIGN_NAMES,
} from '@/components/learning-runtime/interactive/three-step-shared-data';

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function LagnaAssessmentScorer() {
  const [selectedChartId, setSelectedChartId] = useState<string>("virgo-teach");
  const [selectedDomainKey, setSelectedDomainKey] = useState<DomainKey>("career");
  const [promiseVerdict, setPromiseVerdict] = useState<"strong" | "qualified" | "absent" | "">("");

  // Scorer Sliders (Tripod strength weights)
  const [bhavaStrength, setBhavaStrength] = useState<number>(80);
  const [bhaveshaStrength, setBhaveshaStrength] = useState<number>(75);
  const [karakaStrength, setKarakaStrength] = useState<number>(85);

  const chart = useMemo(
    () => CHARTS.find((c) => c.id === selectedChartId) || CHARTS[0],
    [selectedChartId],
  );

  const domain = useMemo(
    () => DOMAINS.find((d) => d.key === selectedDomainKey) || DOMAINS[0],
    [selectedDomainKey],
  );

  const tripod = useMemo(() => {
    const bhavaSignNum = getSignOfHouse(chart.lagnaSignNum, domain.bhavaNum);
    const bhavaSignName = SIGN_NAMES[bhavaSignNum - 1];

    const occupiedPlanets = Object.entries(chart.planets)
      .filter(([_, p]) => p.house === domain.bhavaNum)
      .map(([k, p]) => ({ key: k, ...p }));

    let lordKey = "";
    if ([1, 8].includes(bhavaSignNum)) lordKey = "MA";
    else if ([2, 7].includes(bhavaSignNum)) lordKey = "VE";
    else if ([3, 6].includes(bhavaSignNum)) lordKey = "ME";
    else if (bhavaSignNum === 4) lordKey = "MO";
    else if (bhavaSignNum === 5) lordKey = "SU";
    else if ([9, 12].includes(bhavaSignNum)) lordKey = "JU";
    else if ([10, 11].includes(bhavaSignNum)) lordKey = "SA";

    const lordPlacement = chart.planets[lordKey];
    const karakaKey = domain.karaka === "Saturn" ? "SA" : domain.karaka === "Venus" ? "VE" : domain.karaka === "Jupiter" ? "JU" : domain.karaka === "Sun" ? "SU" : "JU";
    const karakaPlacement = chart.planets[karakaKey];

    return {
      bhavaNum: domain.bhavaNum,
      bhavaSignName,
      occupied: occupiedPlanets,
      lordKey,
      lordPlacement,
      karakaName: domain.karaka,
      karakaKey,
      karakaPlacement,
    };
  }, [chart, domain]);

  // Sanskrit text highlighting states
  let activeVersePart: "tripod" | "weigh" | "promise" | "none" = "none";
  if (promiseVerdict) {
    activeVersePart = "promise";
  } else if (bhavaStrength !== 80 || bhaveshaStrength !== 75 || karakaStrength !== 85) {
    activeVersePart = "weigh";
  } else {
    activeVersePart = "tripod";
  }

  // Calculate dynamic pillar geometries
  const pillarHeightA = 10 + (bhavaStrength / 100) * 30;
  const pillarHeightB = 10 + (bhaveshaStrength / 100) * 30;
  const pillarHeightC = 10 + (karakaStrength / 100) * 30;

  const showCracksA = bhavaStrength < 30;
  const showCracksB = bhaveshaStrength < 30;
  const showCracksC = karakaStrength < 30;

  const allStrong = bhavaStrength >= 65 && bhaveshaStrength >= 65 && karakaStrength >= 65;

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="lagna-assessment-scorer"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Step 1: Lagna Assessment Scorer
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Establishing the Natal Promise Tripod
          </p>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1 font-bold font-sans" style={{ color: GOLD }}>
              Select Chart
            </label>
            <select
              value={selectedChartId}
              onChange={(e) => setSelectedChartId(e.target.value)}
              className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
              style={{ borderColor: HAIRLINE }}
            >
              {CHARTS.map((c) => (
                <option key={c.id} value={c.id} style={{ background: SURFACE }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-1 font-bold font-sans" style={{ color: GOLD }}>
              Domain
            </label>
            <select
              value={selectedDomainKey}
              onChange={(e) => setSelectedDomainKey(e.target.value as DomainKey)}
              className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
              style={{ borderColor: HAIRLINE }}
            >
              {DOMAINS.map((d) => (
                <option key={d.key} value={d.key} style={{ background: SURFACE }}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid: SVG Tripod Pillars vs Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Sliders and Info */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg" style={{ color: GOLD }}>1. Tripod Strengths Calibration</h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold">Bhāva (House {tripod.bhavaNum}) Strength:</span>
              <span className="text-sm font-bold font-sans text-amber-900">{bhavaStrength}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bhavaStrength}
              onChange={(e) => setBhavaStrength(Number(e.target.value))}
              className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 block mt-1">
              Evaluates occupancy of benefics/malefics and cusp degrees.
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold">Bhāveśa ({tripod.lordKey} Lord) Strength:</span>
              <span className="text-sm font-bold font-sans text-amber-900">{bhaveshaStrength}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bhaveshaStrength}
              onChange={(e) => setBhaveshaStrength(Number(e.target.value))}
              className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 block mt-1">
              Evaluates lord's exaltation, sign occupancy, and combustion.
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold">Kāraka ({tripod.karakaName}) Strength:</span>
              <span className="text-sm font-bold font-sans text-amber-900">{karakaStrength}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={karakaStrength}
              onChange={(e) => setKarakaStrength(Number(e.target.value))}
              className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 block mt-1">
              Evaluates the natural significator's dignity in the chart.
            </span>
          </div>
        </div>

        {/* SVG Temple Archway visualizer */}
        <div className="w-full bg-white/50 border rounded-lg p-6 shadow-inner flex flex-col items-center justify-center" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider mb-4 font-bold font-sans text-gray-500">Tripod Structure visualizer</span>
          <svg className="w-full max-w-[240px] h-48" viewBox="0 0 100 80">
            {/* Base platform */}
            <rect x="10" y="65" width="80" height="6" fill="#78350f" rx="1" />
            <rect x="5" y="71" width="90" height="4" fill="#451a03" rx="0.5" />

            {/* Archway Header (grows gold if all strong) */}
            <path
              d="M 15 20 C 15 5, 85 5, 85 20 L 85 25 L 15 25 Z"
              fill={allStrong ? "url(#goldGrad)" : "#d97706"}
              stroke="#78350f"
              strokeWidth="0.75"
              className="transition-all duration-500"
            />
            <text x="50" y="21" fontSize="4.5" fontWeight="bold" fill={allStrong ? "#7f1d1d" : "#fff"} textAnchor="middle" style={{ fontFamily: "sans-serif" }}>
              NATAL PROMISE
            </text>

            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {/* Pillar A: Bhāva */}
            <g>
              <rect x="20" y={65 - pillarHeightA} width="10" height={pillarHeightA} fill="#b45309" stroke="#78350f" strokeWidth="0.5" className="transition-all duration-300" />
              {showCracksA && (
                <path d={`M 22 ${65 - pillarHeightA / 2} L 28 ${65 - pillarHeightA / 2 + 3} M 24 ${65 - pillarHeightA / 2 + 1} L 26 ${65 - pillarHeightA / 2 + 5}`} stroke="#ef4444" strokeWidth="0.75" />
              )}
              <text x="25" y="61" fontSize="2.5" fontWeight="bold" fill="#fff" textAnchor="middle" style={{ fontFamily: "sans-serif" }}>House</text>
            </g>

            {/* Pillar B: Bhāveśa */}
            <g>
              <rect x="45" y={65 - pillarHeightB} width="10" height={pillarHeightB} fill="#b45309" stroke="#78350f" strokeWidth="0.5" className="transition-all duration-300" />
              {showCracksB && (
                <path d={`M 47 ${65 - pillarHeightB / 2} L 53 ${65 - pillarHeightB / 2 + 3} M 49 ${65 - pillarHeightB / 2 + 1} L 51 ${65 - pillarHeightB / 2 + 5}`} stroke="#ef4444" strokeWidth="0.75" />
              )}
              <text x="50" y="61" fontSize="2.5" fontWeight="bold" fill="#fff" textAnchor="middle" style={{ fontFamily: "sans-serif" }}>Lord</text>
            </g>

            {/* Pillar C: Kāraka */}
            <g>
              <rect x="70" y={65 - pillarHeightC} width="10" height={pillarHeightC} fill="#b45309" stroke="#78350f" strokeWidth="0.5" className="transition-all duration-300" />
              {showCracksC && (
                <path d={`M 72 ${65 - pillarHeightC / 2} L 78 ${65 - pillarHeightC / 2 + 3} M 74 ${65 - pillarHeightC / 2 + 1} L 76 ${65 - pillarHeightC / 2 + 5}`} stroke="#ef4444" strokeWidth="0.75" />
              )}
              <text x="75" y="61" fontSize="2.5" fontWeight="bold" fill="#fff" textAnchor="middle" style={{ fontFamily: "sans-serif" }}>Kāraka</text>
            </g>
          </svg>
        </div>
      </div>

      {/* The Tripod Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 rounded-lg border bg-white/70 shadow-sm" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-900" style={{ color: GOLD }}>Leg A: Bhāva (House)</span>
          <p className="text-lg font-bold mt-1">House {tripod.bhavaNum} ({domain.bhavaName})</p>
          <p className="text-sm mt-1" style={{ color: INK_SECONDARY }}>
            Occupied by: {tripod.occupied.length > 0 ? tripod.occupied.map(o => o.planet).join(", ") : "None"}
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-white/70 shadow-sm" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-900" style={{ color: GOLD }}>Leg B: Bhāveśa (Lord)</span>
          <p className="text-lg font-bold mt-1">{tripod.lordKey} Lord Placement</p>
          <p className="text-sm mt-1" style={{ color: INK_SECONDARY }}>
            Placed in House {tripod.lordPlacement?.house} in {tripod.lordPlacement?.sign} ({tripod.lordPlacement?.dignity})
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-white/70 shadow-sm" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-900" style={{ color: GOLD }}>Leg C: Kāraka (Significator)</span>
          <p className="text-lg font-bold mt-1">{tripod.karakaName}</p>
          <p className="text-sm mt-1" style={{ color: INK_SECONDARY }}>
            Placed in House {tripod.karakaPlacement?.house} in {tripod.karakaPlacement?.sign} ({tripod.karakaPlacement?.dignity})
          </p>
        </div>
      </div>

      {/* Scorer Evaluation Input */}
      <div className="mb-6 pb-6 border-b" style={{ borderColor: HAIRLINE }}>
        <span className="block text-sm font-semibold mb-2">Record Lagna Promise Verdict:</span>
        <div className="flex gap-4 mb-4">
          {["strong", "qualified", "absent"].map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer capitalize font-sans font-bold">
              <input
                type="radio"
                name="promise"
                checked={promiseVerdict === v}
                onChange={() => setPromiseVerdict(v as any)}
                className="accent-amber-700 h-4 w-4"
              />
              {v}
            </label>
          ))}
        </div>
        {promiseVerdict && (
          <div className="p-3 rounded border flex items-center gap-2 bg-amber-50 border-amber-200 text-amber-800 text-sm">
            <CheckCircle2 size={16} className="text-green-700" />
            <span>Recorded Promise: <strong>{promiseVerdict}</strong>. The tripod check is saved.</span>
          </div>
        )}
      </div>

      {/* Natal Placements Table */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: GOLD }}>
          Natal Sign & House Placements Table
        </h3>
        <div className="overflow-x-auto rounded-lg border bg-white/40 shadow-sm" style={{ borderColor: HAIRLINE }}>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: SURFACE_2 }}>
                <th className="p-3 font-semibold border-b" style={{ borderColor: HAIRLINE }}>Planet</th>
                <th className="p-3 font-semibold border-b" style={{ borderColor: HAIRLINE }}>Sign</th>
                <th className="p-3 font-semibold border-b" style={{ borderColor: HAIRLINE }}>House</th>
                <th className="p-3 font-semibold border-b" style={{ borderColor: HAIRLINE }}>Dignity</th>
                <th className="p-3 font-semibold border-b" style={{ borderColor: HAIRLINE }}>Degree</th>
                <th className="p-3 font-semibold border-b" style={{ borderColor: HAIRLINE }}>Vargottama</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(chart.planets).map(([key, p]) => (
                <tr key={key} className="hover:bg-amber-50/20">
                  <td className="p-3 border-b font-medium" style={{ borderColor: HAIRLINE }}>{p.planet} ({key})</td>
                  <td className="p-3 border-b" style={{ borderColor: HAIRLINE }}>{p.sign}</td>
                  <td className="p-3 border-b font-semibold" style={{ borderColor: HAIRLINE }}>House {p.house}</td>
                  <td className="p-3 border-b capitalize" style={{ borderColor: HAIRLINE }}>{p.dignity.replace("-", " ")}</td>
                  <td className="p-3 border-b" style={{ borderColor: HAIRLINE }}>{p.degree}°</td>
                  <td className="p-3 border-b" style={{ borderColor: HAIRLINE }}>{p.vargottama ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
