"use client";

import { useState, useMemo, useEffect } from "react";
import { IAST, Devanagari } from "../../chrome/typography";

const GOLD = "#C28220";
const JADE = "#2d7d46";
const VERMILION = "#A23A1E";
const AMBER = "#B8860B";

type Nature = "auspicious" | "inauspicious" | "mixed";
type FilterKey = "all" | Nature;

interface YogaData {
  number: number;
  name: string;
  devanagari: string;
  nature: Nature;
  ruler: string;
  deity: string;
  effects: string;
  lord: string;
}

const YOGA_DB: YogaData[] = [
  { number: 1, name: "Viṣkambha", devanagari: "विष्कम्भ", nature: "inauspicious", ruler: "Indra", deity: "Vāyu", effects: "Obstacles overcome with effort; generally inauspicious", lord: "Saturn" },
  { number: 2, name: "Prīti", devanagari: "प्रीति", nature: "auspicious", ruler: "Viśvedevā", deity: "Śiva", effects: "Love, affection, prosperity, joy", lord: "Mercury" },
  { number: 3, name: "Āyuṣmān", devanagari: "आयुष्मान्", nature: "auspicious", ruler: "Vāyu", deity: "Pavana", effects: "Longevity, health, vitality", lord: "Jupiter" },
  { number: 4, name: "Saubhāgya", devanagari: "सौभाग्य", nature: "auspicious", ruler: "Brahmā", deity: "Brahmā", effects: "Good fortune, marital bliss, success", lord: "Venus" },
  { number: 5, name: "Śobhana", devanagari: "शोभन", nature: "auspicious", ruler: "Indra", deity: "Śakra", effects: "Splendour, brilliance, auspicious undertakings", lord: "Sun" },
  { number: 6, name: "Atigaṇḍa", devanagari: "अतिगण्ड", nature: "inauspicious", ruler: "Śiva", deity: "Rudra", effects: "Danger, accidents, disputes; avoid new ventures", lord: "Mars" },
  { number: 7, name: "Sukarman", devanagari: "सुकर्मन्", nature: "auspicious", ruler: "Viśvedevā", deity: "Viśvedevā", effects: "Good deeds, merit, righteous actions rewarded", lord: "Jupiter" },
  { number: 8, name: "Dhṛti", devanagari: "धृति", nature: "auspicious", ruler: "Varuṇa", deity: "Jala", effects: "Determination, steadiness, wealth accumulation", lord: "Saturn" },
  { number: 9, name: "Śūla", devanagari: "शूल", nature: "inauspicious", ruler: "Āditya", deity: "Nirṛti", effects: "Pain, conflict, violence; avoid journeys and disputes", lord: "Sun" },
  { number: 10, name: "Gaṇḍa", devanagari: "गण्ड", nature: "inauspicious", ruler: "Soma", deity: "Yama", effects: "Obstacles, calamity; dangerous for new beginnings", lord: "Moon" },
  { number: 11, name: "Vṛddhi", devanagari: "वृद्धि", nature: "auspicious", ruler: "Viśvedevā", deity: "Viṣṇu", effects: "Growth, increase, prosperity, learning", lord: "Mercury" },
  { number: 12, name: "Dhruva", devanagari: "ध्रुव", nature: "auspicious", ruler: "Pṛthivī", deity: "Pṛthivī", effects: "Stability, permanence, firm success", lord: "Ketu" },
  { number: 13, name: "Vyāghāta", devanagari: "व्याघात", nature: "inauspicious", ruler: "Vāyu", deity: "Vāyu", effects: "Violence, hindrance; avoid important undertakings", lord: "Rahu" },
  { number: 14, name: "Harṣaṇa", devanagari: "हर्षण", nature: "auspicious", ruler: "Brahmā", deity: "Brahmā", effects: "Delight, exhilaration, joy, success", lord: "Jupiter" },
  { number: 15, name: "Vajra", devanagari: "वज्र", nature: "inauspicious", ruler: "Indra", deity: "Indra", effects: "Thunderbolt; inauspicious (CORE) — avoid auspicious onsets; suits sharp/transformative action", lord: "Saturn" },
  { number: 16, name: "Siddhi", devanagari: "सिद्धि", nature: "auspicious", ruler: "Mitra", deity: "Mitra", effects: "Accomplishment, perfection, magical attainment", lord: "Mars" },
  { number: 17, name: "Vyatīpāta", devanagari: "व्यतीपात", nature: "inauspicious", ruler: "Ravi", deity: "Rudra", effects: "Great calamity; most dangerous of all yogas", lord: "Rahu" },
  { number: 18, name: "Varīyas", devanagari: "वरीयस्", nature: "auspicious", ruler: "Viśvedevā", deity: "Viśvedevā", effects: "Excellence, choice, noble deeds", lord: "Jupiter" },
  { number: 19, name: "Parigha", devanagari: "परिघ", nature: "inauspicious", ruler: "Indra", deity: "Varuṇa", effects: "Obstruction, iron-bar; imprisonment, confinement", lord: "Venus" },
  { number: 20, name: "Śiva", devanagari: "शिव", nature: "auspicious", ruler: "Pṛthivī", deity: "Śiva", effects: "Auspiciousness, divine grace, spiritual success", lord: "Sun" },
  { number: 21, name: "Siddha", devanagari: "सिद्ध", nature: "auspicious", ruler: "Pitṛ", deity: "Pitṛ", effects: "Attainment, perfection, completion of endeavours", lord: "Mercury" },
  { number: 22, name: "Sādhya", devanagari: "साध्य", nature: "auspicious", ruler: "Brahmā", deity: "Śiva", effects: "Feasible, achievable; good for all undertakings", lord: "Saturn" },
  { number: 23, name: "Śubha", devanagari: "शुभ", nature: "auspicious", ruler: "Lakṣmī", deity: "Viṣṇu", effects: "Auspiciousness, beauty, wealth, grace", lord: "Jupiter" },
  { number: 24, name: "Śukla", devanagari: "शुक्ल", nature: "auspicious", ruler: "Brahmā", deity: "Parameṣṭhī", effects: "Purity, clarity; auspicious (sometimes mixed)", lord: "Moon" },
  { number: 25, name: "Brahma", devanagari: "ब्रह्म", nature: "auspicious", ruler: "Indra", deity: "Brahmā", effects: "Knowledge, sacred study, priestly success", lord: "Mars" },
  { number: 26, name: "Indra", devanagari: "इन्द्र", nature: "auspicious", ruler: "Śiva", deity: "Indra", effects: "Royal power, lordship, victory, rulership", lord: "Venus" },
  { number: 27, name: "Vaidhṛti", devanagari: "वैधृति", nature: "inauspicious", ruler: "Dharma", deity: "Dharma", effects: "Great obstruction; avoid all new ventures", lord: "Sun" },
];

const NATURE_META: Record<Nature, { label: string; text: string; bg: string; border: string; count: number }> = {
  auspicious: { label: "Auspicious", text: JADE, bg: "#E8F5EE", border: "#A8D4B8", count: 0 },
  inauspicious: { label: "Inauspicious", text: VERMILION, bg: "#FDE8E5", border: "#E8AFA8", count: 0 },
  mixed: { label: "Mixed", text: AMBER, bg: "#FDF6E3", border: "#E8D5A3", count: 0 },
};

for (const y of YOGA_DB) NATURE_META[y.nature].count++;

const NATURE_ORDER: Nature[] = ["auspicious", "inauspicious", "mixed"];

function segmentPath(cx: number, cy: number, rIn: number, rOut: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => d * Math.PI / 180;
  const x1 = cx + rOut * Math.cos(toRad(startDeg));
  const y1 = cy + rOut * Math.sin(toRad(startDeg));
  const x2 = cx + rOut * Math.cos(toRad(endDeg));
  const y2 = cy + rOut * Math.sin(toRad(endDeg));
  const xi1 = cx + rIn * Math.cos(toRad(startDeg));
  const yi1 = cy + rIn * Math.sin(toRad(startDeg));
  const xi2 = cx + rIn * Math.cos(toRad(endDeg));
  const yi2 = cy + rIn * Math.sin(toRad(endDeg));
  return `M ${xi1} ${yi1} L ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${rIn} ${rIn} 0 0 0 ${xi1} ${yi1} Z`;
}

/* ─── Filtered Wheel — dims non-matching segments ─── */
function WheelDiagram({ selectedYoga, filter, onSelect }: { selectedYoga: number; filter: FilterKey; onSelect: (n: number) => void }) {
  const W = 400;
  const H = 400;
  const CX = W / 2;
  const CY = H / 2;
  const R_OUT = 172;
  const R_IN = 52;

  const matchingNumbers = useMemo(() => {
    if (filter === "all") return new Set(YOGA_DB.map((y) => y.number));
    return new Set(YOGA_DB.filter((y) => y.nature === filter).map((y) => y.number));
  }, [filter]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 320, display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="whShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity="0.1" /></filter>
      </defs>

      <circle cx={CX} cy={CY} r={R_OUT + 4} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.4} />

      {YOGA_DB.map((yoga) => {
        const startA = (yoga.number - 1) * (360 / 27) - 90;
        const endA = yoga.number * (360 / 27) - 90;
        const path = segmentPath(CX, CY, R_IN, R_OUT, startA, endA);
        const isActive = selectedYoga === yoga.number;
        const isMatch = matchingNumbers.has(yoga.number);
        const meta = NATURE_META[yoga.nature];
        const midA = (startA + endA) / 2;
        const labelR = (R_IN + R_OUT) / 2 + 2;
        const lx = CX + labelR * Math.cos(midA * Math.PI / 180);
        const ly = CY + labelR * Math.sin(midA * Math.PI / 180);

        // Visual state:
        // - Active + match = full color, bold, shadow
        // - Match only = colored fill, thin border
        // - No match = very dim, gray
        const segFill = isActive ? meta.bg : isMatch ? "var(--gl-card-surface-solid, #FFF9F0)" : "#F0F1F5";
        const segStroke = isActive ? meta.border : isMatch ? meta.border : "#D8D8D8";
        const segWidth = isActive ? 2.5 : isMatch ? 1 : 0.5;
        const textFill = isActive ? meta.text : isMatch ? meta.text : "#C0C0C0";
        const textSize = isActive ? 12 : isMatch ? 10 : 9;
        const textWeight = isActive ? 800 : isMatch ? 700 : 400;
        const cursor = isMatch ? "pointer" : "default";

        return (
          <g key={yoga.number} style={{ cursor, transition: "opacity 0.25s ease" }} onClick={() => isMatch && onSelect(yoga.number)}>
            <path d={path} fill={segFill} stroke={segStroke} strokeWidth={segWidth} filter={isActive ? "url(#whShadow)" : undefined} style={{ transition: "all 0.25s ease" }} />
            <text x={lx} y={ly + 3} textAnchor="middle" fill={textFill} fontSize={textSize} fontWeight={textWeight} style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none", transition: "all 0.25s ease" }}>
              {yoga.number}
            </text>
          </g>
        );
      })}

      {/* Center hub */}
      <circle cx={CX} cy={CY} r={R_IN - 4} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke={GOLD} strokeWidth={1.5} filter="url(#whShadow)" />
      <text x={CX} y={CY - 4} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={700}>
        {filter === "all" ? "27" : matchingNumbers.size}
      </text>
      <text x={CX} y={CY + 9} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={8}>
        {filter === "all" ? "All shown" : "Filtered"}
      </text>
    </svg>
  );
}

export function YogaWheel27() {
  const [selectedYoga, setSelectedYoga] = useState<number>(1);
  const [filter, setFilter] = useState<FilterKey>("all");

  const filteredYogas = useMemo(() => {
    if (filter === "all") return YOGA_DB;
    return YOGA_DB.filter((y) => y.nature === filter);
  }, [filter]);

  // Auto-select first matching yoga when filter changes
  useEffect(() => {
    const current = YOGA_DB.find((y) => y.number === selectedYoga);
    if (filter !== "all" && current?.nature !== filter) {
      const firstMatch = YOGA_DB.find((y) => y.nature === filter);
      if (firstMatch) setSelectedYoga(firstMatch.number);
    }
  }, [filter]);

  const selectedData = YOGA_DB.find((y) => y.number === selectedYoga) ?? YOGA_DB[0];
  const selMeta = NATURE_META[selectedData.nature];

  const filterLabels: Record<FilterKey, { label: string; short: string }> = {
    all: { label: "All 27", short: "All" },
    auspicious: { label: "Auspicious", short: "Good" },
    inauspicious: { label: "Inauspicious", short: "Danger" },
    mixed: { label: "Mixed", short: "Mixed" },
  };

  return (
    <div
      className="w-full"
      style={{ background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "20px" }}
      data-interactive="yoga-wheel-27"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>27-Yoga Explorer</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>Click a filter to highlight matching yogas on the wheel. Click any segment for details.</p>
      </div>

      {/* Filter bar + stats — single row, non-wrapping */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {(["all", "auspicious", "inauspicious"] as FilterKey[]).map((f) => {
          const meta = f === "all" ? null : NATURE_META[f];
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all" style={{ background: active ? (meta?.text ?? GOLD) : "var(--gl-card-surface-solid)", color: active ? "#fff" : (meta?.text ?? GOLD), border: `1.5px solid ${active ? (meta?.text ?? GOLD) : "var(--gl-gold-hairline)"}`, cursor: "pointer", whiteSpace: "nowrap" }}>
              {filterLabels[f].short}
              {f !== "all" && <span className="ml-1 opacity-70">({NATURE_META[f].count})</span>}
            </button>
          );
        })}
        <div className="flex-shrink-0 ml-auto text-xs" style={{ color: "var(--gl-ink-muted)", whiteSpace: "nowrap" }}>
          Showing {filteredYogas.length} of 27
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Left: Wheel + legend */}
        <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <WheelDiagram selectedYoga={selectedYoga} filter={filter} onSelect={setSelectedYoga} />
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: JADE }}><span className="inline-block rounded-full" style={{ width: 10, height: 10, background: JADE }} />Auspicious ({NATURE_META.auspicious.count})</span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: VERMILION }}><span className="inline-block rounded-full" style={{ width: 10, height: 10, background: VERMILION }} />Inauspicious ({NATURE_META.inauspicious.count})</span>
          </div>
        </div>

        {/* Right: Detail panel + mini list */}
        <div className="space-y-3">
          {/* Active yoga detail */}
          <div className="rounded-xl p-4" style={{ background: selMeta.bg, border: `2px solid ${selMeta.border}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase" style={{ background: selMeta.bg, color: selMeta.text, border: `1px solid ${selMeta.border}` }}>{selectedData.nature}</span>
              <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>#{selectedData.number} / 27</span>
            </div>
            <h3 className="text-2xl mb-0.5" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, color: selMeta.text }}><IAST>{selectedData.name}</IAST></h3>
            <Devanagari size="sm">{selectedData.devanagari}</Devanagari>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { label: "Ruler", value: selectedData.ruler },
                { label: "Deity", value: selectedData.deity },
                { label: "Lord", value: selectedData.lord },
                { label: "Span", value: "13°20′" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg p-2.5" style={{ background: "var(--gl-card-surface-solid)", border: `1px solid ${selMeta.border}` }}>
                  <p className="text-[10px] uppercase mb-1" style={{ color: selMeta.text, letterSpacing: "0.06em", fontWeight: 700 }}>{item.label}</p>
                  <p className="text-sm" style={{ color: "var(--gl-ink-primary)" }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2.5 rounded-lg" style={{ background: "var(--gl-card-surface-solid)", border: `1px solid ${selMeta.border}` }}>
              <p className="text-[10px] uppercase mb-1" style={{ color: selMeta.text, letterSpacing: "0.06em", fontWeight: 700 }}>Effects</p>
              <p className="text-sm italic" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>{selectedData.effects}</p>
            </div>
            {selectedData.nature === "inauspicious" && (
              <div className="mt-3 p-2.5 rounded-lg" style={{ background: "#FDE8E5", border: "1px solid #E8AFA8" }}>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: VERMILION, letterSpacing: "0.06em" }}>Advisory</p>
                <p className="text-sm" style={{ color: VERMILION, lineHeight: 1.5 }}>This yoga is classified as inauspicious. Avoid beginning new ventures, important journeys, or major undertakings during this yoga.</p>
              </div>
            )}
          </div>

          {/* Mini list of filtered yogas — integrated next to detail */}
          <div className="rounded-xl p-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>
              {filter === "all" ? "All 27 Yogas" : `${NATURE_META[filter].label} (${filteredYogas.length})`}
            </p>
            <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
              <table className="w-full" style={{ fontSize: "12px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th className="text-left px-2 py-1 text-[10px] uppercase" style={{ color: GOLD, borderBottom: "1px solid var(--gl-gold-hairline)" }}>#</th>
                    <th className="text-left px-2 py-1 text-[10px] uppercase" style={{ color: GOLD, borderBottom: "1px solid var(--gl-gold-hairline)" }}>Name</th>
                    <th className="text-left px-2 py-1 text-[10px] uppercase" style={{ color: GOLD, borderBottom: "1px solid var(--gl-gold-hairline)" }}>Nature</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredYogas.map((y) => (
                    <tr key={y.number} style={{ cursor: "pointer", transition: "background 0.15s" }} onClick={() => setSelectedYoga(y.number)} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gl-card-surface)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <td className="px-2 py-1.5" style={{ color: selectedYoga === y.number ? GOLD : "var(--gl-ink-muted)", borderBottom: "1px solid var(--gl-gold-hairline)", fontWeight: selectedYoga === y.number ? 700 : 400 }}>{y.number}</td>
                      <td className="px-2 py-1.5" style={{ color: "var(--gl-ink-primary)", borderBottom: "1px solid var(--gl-gold-hairline)", fontWeight: selectedYoga === y.number ? 600 : 400 }}><IAST>{y.name}</IAST></td>
                      <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--gl-gold-hairline)" }}>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: NATURE_META[y.nature].bg, color: NATURE_META[y.nature].text }}>{y.nature[0]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
