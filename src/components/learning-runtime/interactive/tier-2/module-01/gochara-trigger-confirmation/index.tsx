"use client";

import { useMemo, useState } from "react";
import { Info, CheckCircle2, AlertOctagon, Sparkles } from "lucide-react";
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

export function GocharaTriggerConfirmation() {
  const [selectedChartId, setSelectedChartId] = useState<string>("virgo-teach");
  const [selectedDomainKey, setSelectedDomainKey] = useState<DomainKey>("career");
  const [transitMonthOffset, setTransitMonthOffset] = useState<number>(6);
  const [chartLayout, setChartLayout] = useState<"north" | "south">("south");
  const [syntheticObstruction, setSyntheticObstruction] = useState<boolean>(false);

  const chart = useMemo(
    () => CHARTS.find((c) => c.id === selectedChartId) || CHARTS[0],
    [selectedChartId],
  );

  const domain = useMemo(
    () => DOMAINS.find((d) => d.key === selectedDomainKey) || DOMAINS[0],
    [selectedDomainKey],
  );

  // Compute positions
  // Let's assume natal Moon sits in House 4.
  // Jupiter starts in House 2 and advances to House 3 as slider moves.
  // Saturn starts in House 9 and advances to House 10.
  const jupHouse = 2 + Math.floor(transitMonthOffset / 6);
  const satHouse = 9 + Math.floor(transitMonthOffset / 12);
  const targetHouse = domain.bhavaNum;

  // Aspect helpers
  const jupiterAspects = [jupHouse, (jupHouse + 4) % 12 || 12, (jupHouse + 6) % 12 || 12, (jupHouse + 8) % 12 || 12];
  const saturnAspects = [satHouse, (satHouse + 2) % 12 || 12, (satHouse + 6) % 12 || 12, (satHouse + 9) % 12 || 12];

  const jupHits = jupiterAspects.includes(targetHouse);
  const satHits = saturnAspects.includes(targetHouse);
  const isTriggerActive = jupHits && satHits && !syntheticObstruction;

  // Sanskrit text highlighting states
  let activeVersePart: "moon" | "touch" | "vedha" | "none" = "none";
  if (isTriggerActive) {
    activeVersePart = "touch";
  } else if (syntheticObstruction) {
    activeVersePart = "vedha";
  } else {
    activeVersePart = "moon";
  }

  // South Indian Sign Coordinates
  const houses = [
    { name: "Pisces", x: 0, y: 0, num: 12 },
    { name: "Aries", x: 15, y: 0, num: 1 },
    { name: "Taurus", x: 30, y: 0, num: 2 },
    { name: "Gemini", x: 45, y: 0, num: 3 },
    { name: "Cancer", x: 45, y: 15, num: 4 },
    { name: "Leo", x: 45, y: 30, num: 5 },
    { name: "Virgo", x: 45, y: 45, num: 6 },
    { name: "Libra", x: 30, y: 45, num: 7 },
    { name: "Scorpio", x: 15, y: 45, num: 8 },
    { name: "Sagittarius", x: 0, y: 45, num: 9 },
    { name: "Capricorn", x: 0, y: 30, num: 10 },
    { name: "Aquarius", x: 0, y: 15, num: 11 }
  ];

  // Coordinates mapping from house index to x, y
  const getHouseCoord = (houseNum: number) => {
    // Map natal house number to sign based on Lagna.
    // For Virgo lagna (6), House 1 is Virgo, House 2 is Libra...
    const signIndex = (chart.lagnaSignNum - 1 + houseNum - 1) % 12;
    const h = houses[signIndex];
    return { x: h.x + 7.5, y: h.y + 7.5, name: h.name };
  };

  const targetCoord = getHouseCoord(targetHouse);
  const jupCoord = getHouseCoord(jupHouse);
  const satCoord = getHouseCoord(satHouse);

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="gochara-trigger-confirmation"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Step 3: Gochara Transit Confirmation
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Validating Double-Transit & Vedha Obstructions
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

      {/* Transit Slider Controls */}
      <div className="mb-6 p-4 rounded-lg border bg-white/40 shadow-sm" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold">Transit Slider Window: <strong>+{transitMonthOffset} Months</strong></label>
        </div>
        <input
          type="range"
          min={1}
          max={12}
          value={transitMonthOffset}
          onChange={(e) => setTransitMonthOffset(Number(e.target.value))}
          className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="synthetic-vedha"
            checked={syntheticObstruction}
            onChange={(e) => setSyntheticObstruction(e.target.checked)}
            className="accent-amber-700 h-4 w-4 cursor-pointer"
          />
          <label htmlFor="synthetic-vedha" className="text-xs font-sans font-semibold cursor-pointer text-gray-700">
            Inject Synthetic Vedha Obstruction Planet (Blocks Saturn's aspect)
          </label>
        </div>
      </div>

      {/* Main Grid: SVG Circular Zodiac and Verdict card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Left Side: SVG South Indian Zodiac Chart with overlay transits */}
        <div className="w-full bg-white/50 border rounded-lg p-6 shadow-inner flex flex-col items-center justify-center" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider mb-4 font-bold font-sans text-gray-500">Transit Aspect Map overlay</span>
          <svg className="w-full max-w-[240px] h-48" viewBox="0 0 60 60">
            {/* Draw 12 houses */}
            {houses.map((h, idx) => {
              // Convert sign index to natal house number based on chart Lagna
              const natalHouseNum = ((idx - (chart.lagnaSignNum - 1) + 12) % 12) + 1;
              const isTarget = natalHouseNum === targetHouse;
              const isJup = natalHouseNum === jupHouse;
              const isSat = natalHouseNum === satHouse;

              let fillColor = "#fff";
              if (isTarget) fillColor = "#fef3c7";
              else if (isJup) fillColor = "#dbeafe";
              else if (isSat) fillColor = "#fee2e2";

              return (
                <g key={h.name}>
                  <rect
                    x={h.x}
                    y={h.y}
                    width="15"
                    height="15"
                    fill={fillColor}
                    stroke="#b45309"
                    strokeWidth="0.5"
                  />
                  {/* House Label */}
                  <text x={h.x + 7.5} y={h.y + 4} fontSize="2" fill={INK_SECONDARY} textAnchor="middle">
                    H{natalHouseNum} ({h.name})
                  </text>
                  {/* Planet markers */}
                  {isJup && (
                    <circle cx={h.x + 4} cy={h.y + 9} r="2.5" fill="#2563eb" />
                  )}
                  {isJup && (
                    <text x={h.x + 4} y={h.y + 10} fontSize="2.5" fontWeight="bold" fill="#fff" textAnchor="middle">Ju</text>
                  )}
                  {isSat && (
                    <circle cx={h.x + 11} cy={h.y + 9} r="2.5" fill="#7c3aed" />
                  )}
                  {isSat && (
                    <text x={h.x + 11} y={h.y + 10} fontSize="2.5" fontWeight="bold" fill="#fff" textAnchor="middle">Sa</text>
                  )}
                </g>
              );
            })}

            {/* Inner labeling */}
            <rect x="15" y="15" width="30" height="30" fill="#fffbeb" stroke="#b45309" strokeWidth="0.5" />
            <text x="30" y="27" fontSize="2.5" fontWeight="bold" fill={GOLD} textAnchor="middle">TRANSIT</text>
            <text x="30" y="32" fontSize="2" fill={INK_SECONDARY} textAnchor="middle">Gochara Overlay</text>

            {/* Aspect rays from Jupiter (blue) and Saturn (purple) to target */}
            <line x1={jupCoord.x} y1={jupCoord.y} x2={targetCoord.x} y2={targetCoord.y} stroke="#2563eb" strokeWidth="0.75" strokeDasharray="1,1" opacity={jupHits ? "1" : "0.1"} />
            <line x1={satCoord.x} y1={satCoord.y} x2={targetCoord.x} y2={targetCoord.y} stroke="#7c3aed" strokeWidth="0.75" strokeDasharray="1,1" opacity={satHits && !syntheticObstruction ? "1" : "0.1"} />

            {/* Vedha blocker overlay */}
            {syntheticObstruction && (
              <g>
                <circle cx={targetCoord.x} cy={targetCoord.y} r="4" fill="none" stroke="#ef4444" strokeWidth="1" />
                <line x1={targetCoord.x - 3} y1={targetCoord.y - 3} x2={targetCoord.x + 3} y2={targetCoord.y + 3} stroke="#ef4444" strokeWidth="0.75" />
                <line x1={targetCoord.x + 3} y1={targetCoord.y - 3} x2={targetCoord.x - 3} y2={targetCoord.y + 3} stroke="#ef4444" strokeWidth="0.75" />
              </g>
            )}
          </svg>
        </div>

        {/* Right Side: Verdict and Status messages */}
        <div className="flex flex-col justify-between p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: GOLD }}>Transit Verification Result</h3>

            <div className="p-4 rounded-lg border bg-white/80 shadow-sm mb-4" style={{ borderColor: HAIRLINE }}>
              <span className="text-xs uppercase tracking-wider block text-amber-900 font-sans font-bold font-sans">Double Transit Check</span>
              <ul className="mt-2 space-y-1.5 text-xs text-gray-700">
                <li>• **Target House:** House {targetHouse} ({domain.bhavaName})</li>
                <li>• **Transiting Jupiter:** House {jupHouse} (Aspect hits target: {jupHits ? "✓ Yes" : "✗ No"})</li>
                <li>• **Transiting Saturn:** House {satHouse} (Aspect hits target: {satHits ? "✓ Yes" : "✗ No"})</li>
                <li>• **Vedha Obstruction:** {syntheticObstruction ? "▲ Active Obstruction" : "✓ Free/Clear"}</li>
              </ul>
            </div>

            {/* Transit Trigger Status Banner */}
            <div>
              {syntheticObstruction ? (
                <div className="p-3 rounded border flex items-start gap-2.5 bg-red-50 border-red-200 text-red-950 shadow-sm">
                  <AlertOctagon size={16} className="shrink-0 mt-0.5 text-red-700" />
                  <div>
                    <p className="font-bold text-xs">Blocked: Transit Obstructed by Vedha</p>
                    <p className="text-[10px] mt-0.5 leading-normal">
                      A blocking transit planet in the opposing house neutralizes Saturn's aspect. The event trigger is deactivated.
                    </p>
                  </div>
                </div>
              ) : isTriggerActive ? (
                <div className="p-3 rounded border flex items-start gap-2.5 bg-green-50 border-green-200 text-green-950 shadow-sm">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-700" />
                  <div>
                    <p className="font-bold text-xs flex items-center gap-1">
                      <Sparkles size={12} /> Trigger Confirmed: Double-Transit Active
                    </p>
                    <p className="text-[10px] mt-0.5 leading-normal">
                      Both Jupiter and Saturn transit/aspect the target house, confirming that the ripening time is active.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded border flex items-start gap-2.5 bg-amber-50 border-amber-200 text-amber-950 shadow-sm">
                  <Info size={16} className="shrink-0 mt-0.5 text-amber-700" />
                  <div>
                    <p className="font-bold text-xs">Transit Indicators Incomplete / Partial</p>
                    <p className="text-[10px] mt-0.5 leading-normal">
                      Jupiter and Saturn do not yet both touch the target house in aspect. Adjust Month Offset to find alignment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs font-bold uppercase tracking-wider block text-gray-500 font-sans">Double Transit rule</span>
            <p className="text-xs mt-1" style={{ color: INK_SECONDARY }}>
              Jupiter provides the divine grace and sanction (fructification), while Saturn brings the manifest physical reality and structural change. Both are required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
