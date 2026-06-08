"use client";

import { useState, useMemo, useEffect } from "react";
import { IAST, Devanagari } from "../../chrome/typography";

const GOLD = "#C28220";
const JADE = "#2d7d46";
const VERMILION = "#A23A1E";

type KaranaType = "cara" | "sthira";

interface KaranaDef {
  name: string;
  devanagari: string;
  gloss: string;
  nature: string;
  type: KaranaType;
  positions?: string;
  cycleDescription?: string;
}

// Quality follows tradition (lesson §4.1/§4.2 "Quality" column), NOT etymology (§4.4 "the names lie").
const CARA_KARANAS: KaranaDef[] = [
  { name: "Bava", devanagari: "बव", gloss: "well-being", nature: "Auspicious", type: "cara", cycleDescription: "Positions 1, 8, 15, 22, 29, 36, 43, 50" },
  { name: "Bālava", devanagari: "बालव", gloss: "youthful", nature: "Auspicious", type: "cara", cycleDescription: "Positions 2, 9, 16, 23, 30, 37, 44, 51" },
  { name: "Kaulava", devanagari: "कौलव", gloss: "of the household", nature: "Auspicious", type: "cara", cycleDescription: "Positions 3, 10, 17, 24, 31, 38, 45, 52" },
  { name: "Taitila", devanagari: "तैतिल", gloss: "sesame / offering", nature: "Auspicious", type: "cara", cycleDescription: "Positions 4, 11, 18, 25, 32, 39, 46, 53" },
  { name: "Garaja", devanagari: "गरज", gloss: "strength (elephant)", nature: "Auspicious", type: "cara", cycleDescription: "Positions 5, 12, 19, 26, 33, 40, 47, 54" },
  { name: "Vaṇija", devanagari: "वणिज", gloss: "merchant / trade", nature: "Auspicious", type: "cara", cycleDescription: "Positions 6, 13, 20, 27, 34, 41, 48, 55" },
  { name: "Viṣṭi", devanagari: "विष्टि", gloss: "service / distress (= Bhadrā “blessed” — a euphemism)", nature: "Inauspicious — most-feared (Bhadrā)", type: "cara", cycleDescription: "Positions 7, 14, 21, 28, 35, 42, 49, 56" },
];

// Listed in cycle order: Kintughna opens the month (position 0); the seam triplet closes it (57–59).
const STHIRA_KARANAS: KaranaDef[] = [
  { name: "Kintughna", devanagari: "किंतुघ्न", gloss: "“what-killer” / obstacle-destroyer", nature: "Auspicious — destroyer of obstacles/sin", type: "sthira", positions: "1st half of śukla Pratipadā — position 0 (month-start)" },
  { name: "Śakuni", devanagari: "शकुनि", gloss: "omen-bird", nature: "Inauspicious", type: "sthira", positions: "2nd half of kṛṣṇa Caturdaśī — position 57" },
  { name: "Catuṣpāda", devanagari: "चतुष्पाद", gloss: "four-footed", nature: "Inauspicious", type: "sthira", positions: "1st half of Amāvāsyā — position 58" },
  { name: "Nāga", devanagari: "नाग", gloss: "serpent", nature: "Inauspicious", type: "sthira", positions: "2nd half of Amāvāsyā — position 59" },
];

const ALL_KARANAS = [...CARA_KARANAS, ...STHIRA_KARANAS];

const TYPE_META: Record<KaranaType, { color: string; bg: string; border: string; label: string }> = {
  cara: { color: JADE, bg: "#E8F5EE", border: "#A8D4B8", label: "Cara — Moving / Repeating" },
  sthira: { color: VERMILION, bg: "#FDE8E5", border: "#E8AFA8", label: "Sthira — Fixed / Stationary" },
};

// 60 positions (lesson §4.3): 0 = Kintughna (month-start), 1–56 = the 7 cara cycling 8×,
// 57/58/59 = Śakuni/Catuṣpāda/Nāga at the new-moon seam. The cara cycle starts at 1, not 0.
const CYCLE_60: { idx: number; name: string; type: KaranaType }[] = (() => {
  const arr: { idx: number; name: string; type: KaranaType }[] = [];
  const caraOrder = CARA_KARANAS.map((k) => k.name);
  arr.push({ idx: 0, name: "Kintughna", type: "sthira" });
  for (let i = 1; i <= 56; i++) arr.push({ idx: i, name: caraOrder[(i - 1) % 7], type: "cara" });
  arr.push({ idx: 57, name: "Śakuni", type: "sthira" });
  arr.push({ idx: 58, name: "Catuṣpāda", type: "sthira" });
  arr.push({ idx: 59, name: "Nāga", type: "sthira" });
  return arr;
})();

/* ─── Compact 60-Position Cycle Wheel ─── */
function CycleWheel({ selectedName, filter, onSelect }: { selectedName: string | null; filter: "all" | KaranaType; onSelect: (name: string) => void }) {
  const W = 360;
  const H = 360;
  const CX = W / 2;
  const CY = H / 2;
  const R_OUT = 150;
  const R_IN = 50;

  const matchingNames = useMemo(() => {
    if (filter === "all") return new Set(ALL_KARANAS.map((k) => k.name));
    return new Set(ALL_KARANAS.filter((k) => k.type === filter).map((k) => k.name));
  }, [filter]);

  const getSegmentPath = (idx: number, total: number) => {
    const startAngle = idx * (360 / total) - 90;
    const endAngle = (idx + 1) * (360 / total) - 90;
    const toRad = (d: number) => d * Math.PI / 180;
    const x1 = CX + R_OUT * Math.cos(toRad(startAngle));
    const y1 = CY + R_OUT * Math.sin(toRad(startAngle));
    const x2 = CX + R_OUT * Math.cos(toRad(endAngle));
    const y2 = CY + R_OUT * Math.sin(toRad(endAngle));
    const xi1 = CX + R_IN * Math.cos(toRad(startAngle));
    const yi1 = CY + R_IN * Math.sin(toRad(startAngle));
    const xi2 = CX + R_IN * Math.cos(toRad(endAngle));
    const yi2 = CY + R_IN * Math.sin(toRad(endAngle));
    return `M ${xi1} ${yi1} L ${x1} ${y1} A ${R_OUT} ${R_OUT} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_IN} ${R_IN} 0 0 0 ${xi1} ${yi1} Z`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "360px", margin: "0 auto", display: "block" }}>
      <defs>
        <filter id="kcShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy={2} stdDeviation={3} floodColor="#6B4423" floodOpacity="0.12" /></filter>
      </defs>

      <circle cx={CX} cy={CY} r={R_OUT + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.3} />

      {CYCLE_60.map((pos) => {
        const isSelected = selectedName === pos.name;
        const isMatch = matchingNames.has(pos.name);
        const meta = TYPE_META[pos.type];
        const midAngle = pos.idx * (360 / 60) + (360 / 120) - 90;
        const lx = CX + (R_OUT + R_IN) / 2 * Math.cos(midAngle * Math.PI / 180);
        const ly = CY + (R_OUT + R_IN) / 2 * Math.sin(midAngle * Math.PI / 180);
        const showLabel = pos.idx % 5 === 0 || pos.type === "sthira";

        const fill = isSelected ? meta.bg : isMatch ? "var(--gl-card-surface-solid, #FFF9F0)" : "#F0F1F5";
        const stroke = isSelected ? meta.border : isMatch ? meta.border : "#D8D8D8";
        const sw = isSelected ? 2.5 : isMatch ? 1 : 0.5;
        const textFill = isSelected ? meta.color : isMatch ? meta.color : "#C0C0C0";
        const textSize = pos.type === "sthira" ? 9 : 7;
        const cursor = isMatch ? "pointer" : "default";

        return (
          <g key={pos.idx} style={{ cursor }} onClick={() => isMatch && onSelect(pos.name)}>
            <path d={getSegmentPath(pos.idx, 60)} fill={fill} stroke={stroke} strokeWidth={sw} style={{ transition: "all 0.2s ease" }} />
            {showLabel && (
              <text x={lx} y={ly + 3} textAnchor="middle" fill={textFill} fontSize={textSize} fontWeight={pos.type === "sthira" ? 800 : 600} style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif", transition: "all 0.2s ease" }}>
                {pos.type === "sthira" ? pos.name.slice(0, 4) : `${pos.idx}`}
              </text>
            )}
          </g>
        );
      })}

      {/* Centre hub */}
      <circle cx={CX} cy={CY} r={R_IN - 10} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke={GOLD} strokeWidth={2} filter="url(#kcShadow)" />
      <text x={CX} y={CY - 4} textAnchor="middle" fill="var(--gl-ink-primary)" fontSize={12} fontWeight={800} style={{ fontFamily: "var(--font-sans), sans-serif" }}>60 Karaṇas</text>
      <text x={CX} y={CY + 10} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={9} fontWeight={700}>30 Tithis x 2</text>
    </svg>
  );
}

/* ─── Cara cycle repeating pattern SVG ─── */
function CaraPatternSVG() {
  const W = 600;
  const H = 90;
  const slotW = 68;
  const gap = 6;
  const totalW = 7 * (slotW + gap) - gap;
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "100%" }}>
      <text x={W / 2} y={16} textAnchor="middle" fill={GOLD} fontSize={12} fontWeight={800} style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Cara Repeating Cycle — 7 karaṇas × 8 = 56 positions</text>
      {CARA_KARANAS.map((k, i) => (
        <g key={k.name}>
          <rect x={startX + i * (slotW + gap)} y={24} width={slotW} height={52} rx={6} fill="#E8F5EE" stroke="#A8D4B8" strokeWidth={1.5} />
          <text x={startX + i * (slotW + gap) + slotW / 2} y={48} textAnchor="middle" fill={JADE} fontSize={12} fontWeight={700} fontStyle="italic">{k.name}</text>
          <text x={startX + i * (slotW + gap) + slotW / 2} y={64} textAnchor="middle" fill={JADE} fontSize={9} opacity={0.7}>{k.devanagari}</text>
        </g>
      ))}
      {/* Repeat arrow */}
      <path d={`M ${startX + totalW + 8} 50 L ${startX + totalW + 22} 50`} stroke={GOLD} strokeWidth={2} markerEnd="url(#cpArr)" />
      <defs><marker id="cpArr" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto"><polygon points="0 0, 6 2, 0 4" fill={GOLD} /></marker></defs>
    </svg>
  );
}

/* ─── Reusable detail panel ─── */
function KaranaDetailPanel({ k }: { k: KaranaDef }) {
  const tm = TYPE_META[k.type];
  return (
    <div className="rounded-xl p-4 h-full" style={{ background: tm.bg, border: `2px solid ${tm.border}` }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0" style={{ background: "var(--gl-card-surface-solid)", color: tm.color, border: `1.5px solid ${tm.border}` }}>
          {k.devanagari.charAt(0)}
        </span>
        <div>
          <h3 className="text-lg font-bold" style={{ color: tm.color }}><IAST>{k.name}</IAST></h3>
          <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{k.devanagari} · {tm.label}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="p-2.5 rounded-lg" style={{ background: "var(--gl-card-surface-solid)", border: `1px solid ${tm.border}` }}>
          <p className="text-[10px] uppercase mb-1" style={{ color: tm.color, letterSpacing: "0.06em", fontWeight: 700 }}>Meaning</p>
          <p style={{ color: "var(--gl-ink-primary)" }}>{k.gloss}</p>
        </div>
        <div className="p-2.5 rounded-lg" style={{ background: "var(--gl-card-surface-solid)", border: `1px solid ${tm.border}` }}>
          <p className="text-[10px] uppercase mb-1" style={{ color: tm.color, letterSpacing: "0.06em", fontWeight: 700 }}>Nature</p>
          <p style={{ color: "var(--gl-ink-primary)" }}>{k.nature}</p>
        </div>
        <div className="p-2.5 rounded-lg" style={{ background: "var(--gl-card-surface-solid)", border: `1px solid ${tm.border}` }}>
          <p className="text-[10px] uppercase mb-1" style={{ color: tm.color, letterSpacing: "0.06em", fontWeight: 700 }}>Type</p>
          <p style={{ color: "var(--gl-ink-primary)" }}>{k.type === "cara" ? "Repeating cycle" : "Fixed position"}</p>
        </div>
        {k.type === "cara" && k.cycleDescription && (
          <div className="text-xs pt-2" style={{ color: "var(--gl-ink-muted)" }}>{k.cycleDescription}</div>
        )}
        {k.type === "sthira" && k.positions && (
          <div className="text-xs pt-2" style={{ color: "var(--gl-ink-muted)" }}><strong>Fixed at:</strong> {k.positions}</div>
        )}
      </div>
    </div>
  );
}

export function KaranaCycleDiagram() {
  const [filter, setFilter] = useState<"all" | KaranaType>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [showCycle, setShowCycle] = useState(false);

  const filtered = filter === "all" ? ALL_KARANAS : ALL_KARANAS.filter((k) => k.type === filter);
  const selKarana = ALL_KARANAS.find((k) => k.name === selected) || null;

  useEffect(() => {
    if (filter !== "all" && selected) {
      const current = ALL_KARANAS.find((k) => k.name === selected);
      if (current?.type !== filter) {
        const firstMatch = ALL_KARANAS.find((k) => k.type === filter);
        if (firstMatch) setSelected(firstMatch.name);
      }
    }
  }, [filter]);

  const filterCounts = { all: 11, cara: 7, sthira: 4 };

  return (
    <div className="w-full" style={{ background: "var(--gl-surface-card, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", borderRadius: "16px", padding: "20px" }} data-interactive="karana-cycle-diagram">
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>The 11 Karaṇas: 7 Cara + 4 Sthira</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>Browse karaṇas by type, explore the 60-position monthly cycle, and click any karaṇa for details.</p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {(["all", "cara", "sthira"] as const).map((f) => {
          const active = filter === f;
          const meta = f === "all" ? null : TYPE_META[f];
          return (
            <button key={f} onClick={() => setFilter(f)} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all" style={{ background: active ? (meta?.color ?? GOLD) : "var(--gl-card-surface-solid)", color: active ? "#fff" : (meta?.color ?? GOLD), border: `1.5px solid ${active ? (meta?.color ?? GOLD) : "var(--gl-gold-hairline)"}`, cursor: "pointer", whiteSpace: "nowrap" }}>
              {f} ({filterCounts[f]})
            </button>
          );
        })}
        <button onClick={() => setShowCycle((s) => !s)} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ml-auto" style={{ background: showCycle ? "#FDF6E3" : "var(--gl-card-surface-solid)", color: showCycle ? GOLD : "var(--gl-ink-primary)", border: `1.5px solid ${showCycle ? GOLD : "var(--gl-gold-hairline)"}`, cursor: "pointer", whiteSpace: "nowrap" }}>
          {showCycle ? "Hide Cycle" : "60-Position Cycle"}
        </button>
      </div>

      {/* Side-by-side: Wheel + Detail Panel */}
      {showCycle && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Left: Compact wheel */}
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1.5px solid var(--gl-gold-hairline)" }}>
            <CycleWheel selectedName={selected} filter={filter} onSelect={(name) => setSelected(selected === name ? null : name)} />
            <div className="flex justify-center gap-6 mt-3">
              <span className="flex items-center gap-2 text-sm" style={{ color: JADE }}><span className="inline-block rounded-full" style={{ width: 12, height: 12, background: JADE }} />Cara (repeating)</span>
              <span className="flex items-center gap-2 text-sm" style={{ color: VERMILION }}><span className="inline-block rounded-full" style={{ width: 12, height: 12, background: VERMILION }} />Sthira (fixed)</span>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: "var(--gl-ink-muted)" }}>Click any segment to explore the karaṇa. Kintughna opens at position 0; Śakuni, Catuṣpāda and Nāga close at positions 57–59 — all four sthira are labelled.</p>
          </div>
          {/* Right: Detail or hint */}
          <div>
            {selKarana ? (
              <KaranaDetailPanel k={selKarana} />
            ) : (
              <div className="rounded-xl p-6 h-full flex flex-col items-center justify-center text-center" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1.5px solid var(--gl-gold-hairline)" }}>
                <span className="text-3xl mb-3" style={{ color: GOLD }}>☸</span>
                <p className="text-sm font-medium" style={{ color: "var(--gl-ink-secondary)" }}>Click any segment on the wheel to see karaṇa details.</p>
                <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>Sthira segments are labelled with names; Cara segments show position numbers.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cara pattern bar */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1.5px solid var(--gl-gold-hairline)" }}>
        <CaraPatternSVG />
      </div>

      {/* Karaṇa Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
        {filtered.map((k) => {
          const tm = TYPE_META[k.type];
          const isSelected = selected === k.name;
          return (
            <button key={k.name} onClick={() => setSelected(isSelected ? null : k.name)} className="p-3 rounded-lg text-left transition-all" style={{ background: isSelected ? tm.bg : "var(--gl-card-surface-solid)", border: `2px solid ${isSelected ? tm.border : "var(--gl-gold-hairline)"}`, cursor: "pointer" }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold" style={{ color: isSelected ? tm.color : "var(--gl-ink-primary)" }}><IAST>{k.name}</IAST></span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: tm.bg, color: tm.color }}>{k.type}</span>
              </div>
              <Devanagari size="sm">{k.devanagari}</Devanagari>
              {isSelected && (
                <div className="mt-2 pt-2 text-xs space-y-1" style={{ borderTop: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)" }}>
                  <div><strong style={{ color: GOLD }}>Meaning:</strong> {k.gloss}</div>
                  <div><strong style={{ color: GOLD }}>Nature:</strong> {k.nature}</div>
                  {k.type === "cara" && k.cycleDescription && <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{k.cycleDescription}</div>}
                  {k.type === "sthira" && k.positions && <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}><strong>Fixed at:</strong> {k.positions}</div>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Detail Panel — only when cycle is hidden */}
      {!showCycle && selKarana && (
        <div className="mb-4">
          <KaranaDetailPanel k={selKarana} />
        </div>
      )}

      {/* Pattern Explanation */}
      <div className="p-4 rounded-lg text-sm" style={{ background: "#F0F1F5", color: "var(--gl-ink-secondary)", border: "1px dashed var(--gl-gold-hairline)" }}>
        <strong style={{ color: GOLD }}>Cycle Pattern:</strong>{" "}
        Kintughna (sthira) opens the month at position 0. The 7 cara karaṇas then cycle eight times through positions 1–56.
        The remaining three sthira — Śakuni, Catuṣpāda, Nāga — close the cycle at the new-moon seam (positions 57–59).
        Each tithi holds 2 karaṇas (1st half + 2nd half), so 30 tithis × 2 = 60 positions. The cara cycle starts at position 1, not 0 — a common off-by-one trap.
      </div>
    </div>
  );
}
