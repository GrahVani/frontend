"use client";

import { useState } from "react";
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
  { key: "all", label: "All Varas" },
  { key: "fire", label: "Fire (Agni)" },
  { key: "earth", label: "Earth (Prthvi)" },
  { key: "air", label: "Air (Vayu)" },
  { key: "water", label: "Water (Jala)" },
  { key: "luminary", label: "Luminaries" },
  { key: "benefic", label: "Benefics" },
  { key: "malefic", label: "Malefics" },
] as const;

type FilterKey = (typeof FILTER_OPTIONS)[number]["key"];

/* ─── Wheel ─── */
export function VaraGrahaWheel() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  const getOpacity = (v: VaraData) => {
    if (filter === "all") return 1;
    if (["fire", "earth", "air", "water"].includes(filter)) {
      return v.element === filter ? 1 : 0.18;
    }
    return v.type === filter ? 1 : 0.18;
  };

  const selectedVara = selected !== null ? VARA_DB.find((v) => v.index === selected) ?? null : null;

  const CX = 300;
  const CY = 300;
  const R_OUTER = 220;
  const R_INNER = 90;
  const R_LABEL = (R_OUTER + R_INNER) / 2;

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
      style={{ background: "var(--gl-surface-card, var(--gl-card-surface, rgba(255,249,234,0.78)))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "24px" }}
      data-interactive="vara-graha-wheel"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Vara-Graha Wheel</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          The 7 Varas and Their Lords — click a segment to explore
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className="px-3 py-1.5 text-xs font-medium rounded-full transition-all"
            style={{
              background: filter === opt.key ? "var(--gl-gold-accent)" : "transparent",
              color: filter === opt.key ? "#fff" : "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-gold-hairline)",
              opacity: filter === opt.key ? 1 : 0.8,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full flex justify-center">
          <svg viewBox="0 0 600 600" className="w-full h-auto" style={{ maxWidth: 480 }}>
            <defs>
              <filter id="vwShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6B4423" floodOpacity="0.14" />
              </filter>
            </defs>
            <circle cx={CX} cy={CY} r={R_OUTER + 14} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.4} />
            <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.3} strokeDasharray="4 4" />
            {VARA_DB.map((v) => {
              const opacity = getOpacity(v);
              const isSelected = selected === v.index;
              const midAngle = v.index * (360 / 7) + (360 / 14) - 90;
              const lx = CX + R_LABEL * Math.cos((midAngle * Math.PI) / 180);
              const ly = CY + R_LABEL * Math.sin((midAngle * Math.PI) / 180);
              return (
                <g key={v.index} style={{ cursor: "pointer", opacity, transition: "opacity 0.3s ease" }} onClick={() => setSelected(v.index)}>
                  <path
                    d={getSegmentPath(v.index)}
                    fill={isSelected ? `${v.grahaColor}22` : `${v.grahaColor}10`}
                    stroke={isSelected ? v.grahaColor : "var(--gl-gold-hairline)"}
                    strokeWidth={isSelected ? 2.5 : 1}
                    filter="url(#vwShadow)"
                    style={{ transition: "all 0.25s ease" }}
                  />
                  <text x={lx} y={ly - 10} textAnchor="middle" fill="var(--gl-ink-primary)" fontSize={22} fontWeight={700} style={{ pointerEvents: "none", fontFamily: "serif" }}>
                    {v.grahaSymbol}
                  </text>
                  <text x={lx} y={ly + 12} textAnchor="middle" fill="var(--gl-ink-primary)" fontSize={11} fontWeight={isSelected ? 700 : 500} style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif" }}>
                    {v.english}
                  </text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={R_INNER - 8} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-accent)" strokeWidth={2} filter="url(#vwShadow)" />
            <text x={CX} y={CY - 6} textAnchor="middle" fill="var(--gl-graha-surya)" fontSize={28} fontWeight={700} style={{ fontFamily: "serif" }}>☉</text>
            <text x={CX} y={CY + 14} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={11} fontWeight={600} style={{ fontFamily: "var(--font-sans), sans-serif" }}>Surya</text>
            <text x={CX} y={CY + 28} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9} style={{ fontFamily: "var(--font-sans), sans-serif" }}>Week begins</text>
          </svg>
        </div>

        <div className="w-full lg:w-80 shrink-0">
          {selectedVara ? (
            <div className="rounded-xl p-5" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: `${selectedVara.grahaColor}18`, color: selectedVara.grahaColor }}>
                  {selectedVara.grahaSymbol}
                </span>
                <div>
                  <div className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                    <IAST>{selectedVara.name}</IAST>
                  </div>
                  <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{selectedVara.english}</div>
                </div>
              </div>
              <div className="mb-4">
                <Devanagari size="lg">{selectedVara.devanagari}</Devanagari>
              </div>
              <div className="space-y-3 text-sm">
                <DetailRow label="Ruling Planet" value={selectedVara.graha} />
                <DetailRow label="Deity" value={selectedVara.deity} />
                <DetailRow label="Direction" value={selectedVara.direction} />
                <DetailRow label="Element" value={`${selectedVara.elementSanskrit} (${selectedVara.element})`} />
                <DetailRow label="Color" value={selectedVara.color} />
                <DetailRow label="Type" value={selectedVara.type.charAt(0).toUpperCase() + selectedVara.type.slice(1)} />
              </div>
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--gl-gold-hairline)" }}>
                <p className="text-xs italic" style={{ color: "var(--gl-ink-muted)" }}>
                  The <IAST>{selectedVara.name}</IAST> is ruled by{" "}
                  <span style={{ color: selectedVara.grahaColor, fontWeight: 600 }}>{selectedVara.graha}</span>,
                  a {selectedVara.type} associated with {selectedVara.element}.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-6 text-center" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px dashed var(--gl-gold-hairline)" }}>
              <p className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>Click a segment on the wheel to view its full attributes.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {[
          { label: "Fire", key: "fire", color: "#C8412E" },
          { label: "Earth", key: "earth", color: "#3A8C5A" },
          { label: "Air", key: "air", color: "#7A5E1E" },
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
