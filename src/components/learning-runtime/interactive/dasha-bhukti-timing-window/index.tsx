"use client";

import { useMemo, useState } from "react";
import { Info, Sparkles, Check, X } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  ARIES_DASHAS,
  CHARTS,
  DOMAINS,
  VIRGO_DASHAS,
  type DomainKey,
  getSignOfHouse,
} from "../three-step-shared-data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function DashaBhuktiTimingWindow() {
  const [selectedChartId, setSelectedChartId] = useState<string>("virgo-teach");
  const [selectedDomainKey, setSelectedDomainKey] = useState<DomainKey>("career");
  const [timelineAge, setTimelineAge] = useState<number>(35);
  const [windowVerdict, setWindowVerdict] = useState<"active" | "partial" | "dormant" | "">("");

  const chart = useMemo(
    () => CHARTS.find((c) => c.id === selectedChartId) || CHARTS[0],
    [selectedChartId],
  );

  const domain = useMemo(
    () => DOMAINS.find((d) => d.key === selectedDomainKey) || DOMAINS[0],
    [selectedDomainKey],
  );

  const dashaList = selectedChartId === "virgo-teach" ? VIRGO_DASHAS : ARIES_DASHAS;
  const currentDashaPeriod = useMemo(() => {
    return dashaList.find((d) => timelineAge >= d.ageStart && timelineAge < d.ageEnd) || dashaList[0];
  }, [timelineAge, dashaList]);

  // Compute five-channel signification metrics
  const checkChannels = (lordKey: string) => {
    const planetPlac = chart.planets[lordKey];
    if (!planetPlac) return { c1: false, c2: false, c3: false, c4: false, c5: false, total: 0 };

    const bhavaSignNum = getSignOfHouse(chart.lagnaSignNum, domain.bhavaNum);
    let targetLordKey = "";
    if ([1, 8].includes(bhavaSignNum)) targetLordKey = "MA";
    else if ([2, 7].includes(bhavaSignNum)) targetLordKey = "VE";
    else if ([3, 6].includes(bhavaSignNum)) targetLordKey = "ME";
    else if (bhavaSignNum === 4) targetLordKey = "MO";
    else if (bhavaSignNum === 5) targetLordKey = "SU";
    else if ([9, 12].includes(bhavaSignNum)) targetLordKey = "JU";
    else if ([10, 11].includes(bhavaSignNum)) targetLordKey = "SA";

    const c1 = planetPlac.house === domain.bhavaNum;
    const c2 = lordKey === targetLordKey;

    const aspectsHouse = (pKey: string, pHouse: number, targetHouse: number) => {
      const diff = (targetHouse - pHouse + 12) % 12;
      const step = diff === 0 ? 12 : diff;
      if (step === 7) return true;
      if (pKey === "JU" && [5, 9].includes(step)) return true;
      if (pKey === "MA" && [4, 8].includes(step)) return true;
      if (pKey === "SA" && [3, 10].includes(step)) return true;
      return false;
    };

    const c3 = aspectsHouse(lordKey, planetPlac.house, domain.bhavaNum);
    const c4 = aspectsHouse(lordKey, planetPlac.house, chart.planets[targetLordKey]?.house || 1);
    const karakaKey = domain.karaka === "Saturn" ? "SA" : domain.karaka === "Venus" ? "VE" : domain.karaka === "Jupiter" ? "JU" : domain.karaka === "Sun" ? "SU" : "JU";
    const c5 = planetPlac.house === chart.planets[karakaKey]?.house;

    const hits = [c1, c2, c3, c4, c5].filter(Boolean).length;
    return { c1, c2, c3, c4, c5, total: hits };
  };

  const mdChannels = useMemo(() => checkChannels(currentDashaPeriod.md), [currentDashaPeriod, chart, domain]);
  const adChannels = useMemo(() => checkChannels(currentDashaPeriod.ad), [currentDashaPeriod, chart, domain]);

  // Sanskrit text highlighting states
  let activeVersePart: "lord" | "occupy" | "period" | "none" = "none";
  if (mdChannels.c1 || adChannels.c1 || mdChannels.c2 || adChannels.c2) {
    activeVersePart = "lord";
  } else if (mdChannels.c3 || adChannels.c3 || mdChannels.c5 || adChannels.c5) {
    activeVersePart = "occupy";
  } else if (windowVerdict) {
    activeVersePart = "period";
  }

  // Predefined colored blocks for SVG timeline
  const colorsMap: Record<string, string> = {
    KE: "#cbd5e1",
    VE: "#db2777",
    SU: "#ea580c",
    MO: "#2563eb",
    MA: "#dc2626",
    RA: "#16a34a",
    JU: "#d97706",
    SA: "#7c3aed",
    ME: "#0d9488"
  };

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="dasha-bhukti-timing-window"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Step 2: Dasha-Bhukti Timing Window
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Measuring Signification Strengths
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

      {/* Age Timeline Slider & SVG Timeline Map */}
      <div className="mb-6 p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold">Timeline Position (Age Slider): <strong>{timelineAge} years</strong></label>
          <span className="text-sm px-3 py-1 rounded bg-amber-800 text-white font-bold font-sans flex items-center gap-1.5">
            <Sparkles size={14} /> MD: {currentDashaPeriod.md} • AD: {currentDashaPeriod.ad}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={timelineAge}
          onChange={(e) => setTimelineAge(Number(e.target.value))}
          className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        {/* SVG Vimshottari Timeline mapping */}
        <div className="w-full mt-6 flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider mb-2 font-bold font-sans text-gray-500">120-Year Vimśottarī Mahādaśā Span</span>
          <svg className="w-full max-w-[480px] h-12" viewBox="0 0 120 15">
            {/* Draw dasha segments */}
            {dashaList.map((d, index) => {
              const start = d.ageStart;
              const width = d.ageEnd - d.ageStart;
              const color = colorsMap[d.md] || "#cbd5e1";
              return (
                <rect
                  key={index}
                  x={start}
                  y="2"
                  width={width}
                  height="6"
                  fill={color}
                  stroke="#fff"
                  strokeWidth="0.25"
                  opacity={timelineAge >= start && timelineAge < d.ageEnd ? "1" : "0.4"}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Slider pointer indicator */}
            <line
              x1={timelineAge}
              y1="0"
              x2={timelineAge}
              y2="12"
              stroke="#2d261e"
              strokeWidth="0.75"
              className="transition-all duration-300 ease-out"
            />
            <polygon
              points={`${timelineAge},0 ${timelineAge - 2},-2 ${timelineAge + 2},-2`}
              fill="#2d261e"
              className="transition-all duration-300 ease-out"
            />
          </svg>
        </div>
      </div>

      {/* Five Channel Signification Table */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3" style={{ color: GOLD }}>Five-Channel Signification Analysis</h3>
        <div className="overflow-x-auto rounded-lg border bg-white/40 shadow-sm" style={{ borderColor: HAIRLINE }}>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: SURFACE_2 }}>
                <th className="p-3 font-semibold border-b" style={{ borderColor: HAIRLINE }}>Lord Role</th>
                <th className="p-3 font-semibold border-b text-center" style={{ borderColor: HAIRLINE }}>C1: House Placement</th>
                <th className="p-3 font-semibold border-b text-center" style={{ borderColor: HAIRLINE }}>C2: House Lord</th>
                <th className="p-3 font-semibold border-b text-center" style={{ borderColor: HAIRLINE }}>C3: Aspect House</th>
                <th className="p-3 font-semibold border-b text-center" style={{ borderColor: HAIRLINE }}>C4: Aspect Lord</th>
                <th className="p-3 font-semibold border-b text-center" style={{ borderColor: HAIRLINE }}>C5: Co-tenant Karaka</th>
                <th className="p-3 font-semibold border-b text-center" style={{ borderColor: HAIRLINE }}>Hits Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-amber-50/10">
                <td className="p-3 border-b font-bold" style={{ borderColor: HAIRLINE }}>Mahadasha ({currentDashaPeriod.md})</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{mdChannels.c1 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{mdChannels.c2 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{mdChannels.c3 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{mdChannels.c4 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{mdChannels.c5 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center font-bold text-amber-700" style={{ borderColor: HAIRLINE }}>{mdChannels.total} / 5</td>
              </tr>
              <tr className="hover:bg-amber-50/10">
                <td className="p-3 border-b font-bold" style={{ borderColor: HAIRLINE }}>Bhukti ({currentDashaPeriod.ad})</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{adChannels.c1 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{adChannels.c2 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{adChannels.c3 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{adChannels.c4 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center" style={{ borderColor: HAIRLINE }}>{adChannels.c5 ? <Check className="inline text-green-700" size={16} /> : <X className="inline text-red-700 opacity-30" size={16} />}</td>
                <td className="p-3 border-b text-center font-bold text-amber-700" style={{ borderColor: HAIRLINE }}>{adChannels.total} / 5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Timing Verdict Radio Selection */}
      <div className="mb-6 pb-6 border-b" style={{ borderColor: HAIRLINE }}>
        <span className="block text-sm font-semibold mb-2">Record Timing Window Verdict:</span>
        <div className="flex gap-4">
          {["active", "partial", "dormant"].map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer capitalize font-sans font-bold">
              <input
                type="radio"
                name="window"
                checked={windowVerdict === v}
                onChange={() => setWindowVerdict(v as any)}
                className="accent-amber-700 h-4 w-4"
              />
              {v}
            </label>
          ))}
        </div>
      </div>

      {/* Dasha Period List */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: GOLD }}>Vimśottarī Mahādaśā Periods Timeline Table</h3>
        <div className="overflow-y-auto max-h-48 rounded-lg border bg-white/40 shadow-sm" style={{ borderColor: HAIRLINE }}>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: SURFACE_2 }}>
                <th className="p-2 border-b font-semibold" style={{ borderColor: HAIRLINE }}>Age Range</th>
                <th className="p-2 border-b font-semibold" style={{ borderColor: HAIRLINE }}>Mahadasha</th>
                <th className="p-2 border-b font-semibold" style={{ borderColor: HAIRLINE }}>Bhukti</th>
                <th className="p-2 border-b font-semibold" style={{ borderColor: HAIRLINE }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashaList.map((d, index) => {
                const isActive = timelineAge >= d.ageStart && timelineAge < d.ageEnd;
                return (
                  <tr key={index} className={`hover:bg-amber-50/20 ${isActive ? "bg-amber-100/50 font-bold" : ""}`}>
                    <td className="p-2 border-b" style={{ borderColor: HAIRLINE }}>{d.ageStart} - {d.ageEnd} years</td>
                    <td className="p-2 border-b" style={{ borderColor: HAIRLINE }}>{d.md}</td>
                    <td className="p-2 border-b" style={{ borderColor: HAIRLINE }}>{d.ad}</td>
                    <td className="p-2 border-b" style={{ borderColor: HAIRLINE }}>{isActive ? "Active Now" : "Inactive"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
