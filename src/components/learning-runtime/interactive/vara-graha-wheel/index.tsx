"use client";

import { useState, useCallback } from "react";
import { Devanagari, IAST } from "../../chrome/typography";

/* ─── Data ─── */
interface VaraData {
  index: number;
  name: string;
  devanagari: string;
  english: string;
  graha: string;
  grahaDevanagari: string;
  grahaSymbol: string;
  grahaColor: string;
  deity: string;
  direction: string;
  element: "fire" | "earth" | "air" | "water";
  elementSanskrit: string;
  color: string;
  type: "luminary" | "benefic" | "malefic";
}

const VARA_DB: VaraData[] = [
  {
    index: 0, name: "Bhanuvara", devanagari: "भानुवासरः", english: "Sunday",
    graha: "Surya", grahaDevanagari: "सूर्य", grahaSymbol: "☉", grahaColor: "#E8B845",
    deity: "Surya-Narayana", direction: "East", element: "fire", elementSanskrit: "agni", color: "Golden / Red", type: "luminary",
  },
  {
    index: 1, name: "Somavara", devanagari: "सोमवासरः", english: "Monday",
    graha: "Candra", grahaDevanagari: "चन्द्र", grahaSymbol: "☽", grahaColor: "#7A8CB8",
    deity: "Siva / Soma", direction: "North-West", element: "water", elementSanskrit: "jala", color: "White / Silver", type: "luminary",
  },
  {
    index: 2, name: "Mangalavara", devanagari: "मङ्गलवासरः", english: "Tuesday",
    graha: "Mangala", grahaDevanagari: "मङ्गल", grahaSymbol: "♂", grahaColor: "#C8412E",
    deity: "Skanda / Karttikeya", direction: "South", element: "fire", elementSanskrit: "agni", color: "Red / Coral", type: "malefic",
  },
  {
    index: 3, name: "Budhavara", devanagari: "बुधवासरः", english: "Wednesday",
    graha: "Budha", grahaDevanagari: "बुध", grahaSymbol: "☿", grahaColor: "#3A8C5A",
    deity: "Visnu / Budha", direction: "North", element: "earth", elementSanskrit: "prthvi", color: "Green", type: "benefic",
  },
  {
    index: 4, name: "Guruvara", devanagari: "गुरुवासरः", english: "Thursday",
    graha: "Guru", grahaDevanagari: "गुरु", grahaSymbol: "♃", grahaColor: "#E89E2A",
    deity: "Brhaspati / Visnu", direction: "North-East", element: "air", elementSanskrit: "vayu", color: "Yellow / Gold", type: "benefic",
  },
  {
    index: 5, name: "Sukravara", devanagari: "शुक्रवासरः", english: "Friday",
    graha: "Sukra", grahaDevanagari: "शुक्र", grahaSymbol: "♀", grahaColor: "#5A8CC8",
    deity: "Indrani / Laksmi", direction: "South-East", element: "water", elementSanskrit: "jala", color: "White / Variegated", type: "benefic",
  },
  {
    index: 6, name: "Sanivara", devanagari: "शनिवासरः", english: "Saturday",
    graha: "Sani", grahaDevanagari: "शनि", grahaSymbol: "♄", grahaColor: "#5A5A7A",
    deity: "Yama / Sani", direction: "West", element: "air", elementSanskrit: "vayu", color: "Black / Dark Blue", type: "malefic",
  },
];

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "fire", label: "Fire" },
  { key: "earth", label: "Earth" },
  { key: "air", label: "Air" },
  { key: "water", label: "Water" },
  { key: "luminary", label: "Luminaries" },
  { key: "benefic", label: "Benefics" },
  { key: "malefic", label: "Malefics" },
] as const;

type FilterKey = (typeof FILTER_OPTIONS)[number]["key"];

const ELEMENT_META: Record<string, { color: string; bg: string }> = {
  fire: { color: "#C8412E", bg: "#FDE8E5" },
  earth: { color: "#3A8C5A", bg: "#E8F5EE" },
  air: { color: "#B8860B", bg: "#FDF6E3" },
  water: { color: "#4F6FA8", bg: "#EBF0FA" },
};

const TYPE_META: Record<string, { color: string; bg: string; label: string }> = {
  luminary: { color: "#C9A24A", bg: "#FDF6E3", label: "Luminary" },
  benefic: { color: "#2d7d46", bg: "#E8F5EE", label: "Benefic" },
  malefic: { color: "#A23A1E", bg: "#FDE8E5", label: "Malefic" },
};

/* ─── Wheel ─── */
export function VaraGrahaWheel() {
  const [selected, setSelected] = useState<number>(0);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [hovered, setHovered] = useState<number | null>(null);

  const getOpacity = (v: VaraData) => {
    if (filter === "all") return 1;
    if (["fire", "earth", "air", "water"].includes(filter)) {
      return v.element === filter ? 1 : 0.18;
    }
    return v.type === filter ? 1 : 0.18;
  };

  const selectedVara = VARA_DB.find((v) => v.index === selected) ?? VARA_DB[0];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelected(idx);
      }
    },
    []
  );

  const CX = 200;
  const CY = 200;
  const R_OUTER = 160;
  const R_INNER = 65;
  const R_LABEL = (R_OUTER + R_INNER) / 2;
  const R_SYMBOL = (R_INNER + R_LABEL) / 2;

  const getSegmentPath = (idx: number) => {
    const startAngle = idx * (360 / 7) - 90;
    const endAngle = (idx + 1) * (360 / 7) - 90;
    const x1 = CX + R_OUTER * Math.cos((startAngle * Math.PI) / 180);
    const y1 = CY + R_OUTER * Math.sin((startAngle * Math.PI) / 180);
    const x2 = CX + R_OUTER * Math.cos((endAngle * Math.PI) / 180);
    const y2 = CY + R_OUTER * Math.sin((endAngle * Math.PI) / 180);
    const xi1 = CX + R_INNER * Math.cos((startAngle * Math.PI) / 180);
    const yi1 = CY + R_INNER * Math.sin((startAngle * Math.PI) / 180);
    const xi2 = CX + R_INNER * Math.cos((endAngle * Math.PI) / 180);
    const yi2 = CY + R_INNER * Math.sin((endAngle * Math.PI) / 180);
    return `M ${xi1} ${yi1} L ${x1} ${y1} A ${R_OUTER} ${R_OUTER} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`;
  };

  return (
    <div
      className="w-full"
      style={{ background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "20px" }}
      data-interactive="vara-graha-wheel"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Vara-Graha Wheel</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          The 7 Varas and Their Lords — click a segment to explore
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4" role="group" aria-label="Filter varas by element or type">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            aria-pressed={filter === opt.key}
            className="px-2.5 py-1 text-xs font-medium rounded-full transition-all"
            style={{
              background: filter === opt.key ? "var(--gl-gold-accent)" : "transparent",
              color: filter === opt.key ? "#fff" : "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-gold-hairline)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        <div className="flex-1 w-full flex justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxWidth: 320 }}>
            <defs>
              <filter id="vwShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation={3} floodColor="#6B4423" floodOpacity="0.12" />
              </filter>
            </defs>
            <circle cx={CX} cy={CY} r={R_OUTER + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.4} />
            <circle cx={CX} cy={CY} r={R_OUTER + 4} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.3} strokeDasharray="3 3" />

            {VARA_DB.map((v) => {
              const opacity = getOpacity(v);
              const isSelected = selected === v.index;
              const isHovered = hovered === v.index;
              const midAngle = v.index * (360 / 7) + (360 / 14) - 90;
              const lx = CX + R_LABEL * Math.cos((midAngle * Math.PI) / 180);
              const ly = CY + R_LABEL * Math.sin((midAngle * Math.PI) / 180);
              const sx = CX + R_SYMBOL * Math.cos((midAngle * Math.PI) / 180);
              const sy = CY + R_SYMBOL * Math.sin((midAngle * Math.PI) / 180);

              return (
                <g
                  key={v.index}
                  style={{ cursor: "pointer", opacity, transition: "opacity 0.3s ease" }}
                  onClick={() => setSelected(v.index)}
                  onMouseEnter={() => setHovered(v.index)}
                  onMouseLeave={() => setHovered(null)}
                  onKeyDown={(e) => handleKeyDown(e, v.index)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${v.english}, ruled by ${v.graha}`}
                >
                  <path
                    d={getSegmentPath(v.index)}
                    fill={isSelected ? `${v.grahaColor}28` : isHovered ? `${v.grahaColor}1A` : `${v.grahaColor}0D`}
                    stroke={isSelected ? v.grahaColor : "var(--gl-gold-hairline)"}
                    strokeWidth={isSelected ? 2.5 : 1}
                    filter="url(#vwShadow)"
                    style={{ transition: "all 0.25s ease" }}
                  />
                  <text x={sx} y={sy - 1} textAnchor="middle" fill={v.grahaColor} fontSize={16} fontWeight={700} style={{ pointerEvents: "none", fontFamily: "serif" }}>
                    {v.grahaSymbol}
                  </text>
                  <text x={lx} y={ly + 10} textAnchor="middle" fill="var(--gl-ink-primary)" fontSize={11} fontWeight={isSelected ? 700 : 500} style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif" }}>
                    {v.english}
                  </text>
                  <circle cx={lx + 24} cy={ly - 4} r={2.5} fill={ELEMENT_META[v.element].color} opacity={0.8} style={{ pointerEvents: "none" }} />
                </g>
              );
            })}

            <circle cx={CX} cy={CY} r={R_INNER - 6} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-accent)" strokeWidth={2} filter="url(#vwShadow)" />
            <text x={CX} y={CY - 6} textAnchor="middle" fill="var(--gl-graha-surya)" fontSize={22} fontWeight={700} style={{ fontFamily: "serif" }}>☉</text>
            <text x={CX} y={CY + 10} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={11} fontWeight={600} style={{ fontFamily: "var(--font-sans), sans-serif" }}>Surya</text>
            <text x={CX} y={CY + 22} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9} style={{ fontFamily: "var(--font-sans), sans-serif" }}>Week begins</text>
          </svg>
        </div>

        <div className="w-full xl:w-72 shrink-0">
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: `${selectedVara.grahaColor}18`, color: selectedVara.grahaColor }}>
                {selectedVara.grahaSymbol}
              </span>
              <div>
                <div className="text-base font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                  <IAST>{selectedVara.name}</IAST>
                </div>
                <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{selectedVara.english}</div>
              </div>
            </div>
            <div className="mb-3">
              <Devanagari size="md">{selectedVara.devanagari}</Devanagari>
            </div>
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: ELEMENT_META[selectedVara.element].bg, color: ELEMENT_META[selectedVara.element].color }}>
                {selectedVara.elementSanskrit}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: TYPE_META[selectedVara.type].bg, color: TYPE_META[selectedVara.type].color }}>
                {TYPE_META[selectedVara.type].label}
              </span>
            </div>
            <div className="space-y-2.5 text-sm">
              <DetailRow label="Ruling Planet" value={selectedVara.graha} />
              <DetailRow label="Deity" value={selectedVara.deity} />
              <DetailRow label="Direction" value={selectedVara.direction} />
              <DetailRow label="Element" value={`${selectedVara.elementSanskrit} (${selectedVara.element})`} />
              <DetailRow label="Color" value={selectedVara.color} />
              <DetailRow label="Type" value={TYPE_META[selectedVara.type].label} />
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--gl-gold-hairline)" }}>
              <p className="text-xs italic" style={{ color: "var(--gl-ink-muted)" }}>
                The <IAST>{selectedVara.name}</IAST> is ruled by <span style={{ color: selectedVara.grahaColor, fontWeight: 600 }}>{selectedVara.graha}</span>, a {selectedVara.type} associated with {selectedVara.element}.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 justify-center">
        {[
          { label: "Fire", key: "fire", color: "#C8412E" },
          { label: "Earth", key: "earth", color: "#3A8C5A" },
          { label: "Air", key: "air", color: "#B8860B" },
          { label: "Water", key: "water", color: "#4F6FA8" },
        ].map((el) => (
          <div key={el.key} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: el.color }} />
            <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{el.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-xs font-medium" style={{ color: "var(--gl-ink-muted)" }}>{label}</span>
      <span className="text-xs font-semibold text-right max-w-[60%]" style={{ color: "var(--gl-ink-primary)" }}>{value}</span>
    </div>
  );
}
