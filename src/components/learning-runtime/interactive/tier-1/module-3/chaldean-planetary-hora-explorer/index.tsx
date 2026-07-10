"use client";

import { useState } from "react";
import { IAST } from "@/components/learning-runtime/chrome/typography";

interface GrahaInfo {
  name: string;
  devanagari: string;
  symbol: string;
  color: string;
  period: string;
  speed: string;
  description: string;
}

const CHALDEAN_ORDER: GrahaInfo[] = [
  { name: "Śani", devanagari: "शनि", symbol: "♄", color: "#5A5A7A", period: "29.5y", speed: "Slowest", description: "Saturn — governing discipline, delay, and longevity." },
  { name: "Guru", devanagari: "गुरु", symbol: "♃", color: "#E89E2A", period: "11.9y", speed: "Slow", description: "Jupiter — the great benefic, governing wisdom and dharma." },
  { name: "Maṅgala", devanagari: "मङ्गल", symbol: "♂", color: "#C8412E", period: "1.9y", speed: "Medium", description: "Mars — the warrior, governing courage and energy." },
  { name: "Sūrya", devanagari: "सूर्य", symbol: "☉", color: "#E8B845", period: "1y", speed: "Mean", description: "Sun — the king, governing soul and authority." },
  { name: "Śukra", devanagari: "शुक्र", symbol: "♀", color: "#5A8CC8", period: "225d", speed: "Fast", description: "Venus — governing beauty, pleasure, and wealth." },
  { name: "Budha", devanagari: "बुध", symbol: "☿", color: "#3A8C5A", period: "88d", speed: "Faster", description: "Mercury — governing intellect and commerce." },
  { name: "Candra", devanagari: "चन्द्र", symbol: "☽", color: "#7A8CB8", period: "27d", speed: "Fastest", description: "Moon — governing mind, emotions, and nourishment." },
];

const DAY_LORDS = ["Sūrya", "Candra", "Maṅgala", "Budha", "Guru", "Śukra", "Śani"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const INK = "#3F2D1D";
const INK_SOFT = "#5C4630";
const INK_MUTED_STRONG = "#745D40";
const GOLD_DEEP = "#8F6818";
const BORDER = "rgba(143, 104, 24, 0.38)";
const PANEL = "rgba(255, 250, 240, 0.96)";
const PANEL_STRONG = "#FFF7E8";
const DAY_DEVANAGARI = ["भानु", "सोम", "मङ्गल", "बुध", "गुरु", "शुक्र", "शनि"];

export function ChaldeanPlanetaryHoraExplorer() {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedGraha, setSelectedGraha] = useState<number | null>(null);
  const [hoverHora, setHoverHora] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const chaldeanNames = CHALDEAN_ORDER.map((g) => g.name);

  const generateHoras = (dayIndex: number) => {
    const dayLord = DAY_LORDS[dayIndex];
    const startIdx = chaldeanNames.indexOf(dayLord);
    const horas = [];
    for (let i = 0; i < 24; i++) {
      const grahaIdx = (startIdx + i) % 7;
      horas.push({ number: i + 1, graha: CHALDEAN_ORDER[grahaIdx] });
    }
    return horas;
  };

  const handleDayChange = (idx: number) => {
    setSelectedDay(idx);
    setAnimKey((k) => k + 1);
  };

  const horas = generateHoras(selectedDay);
  const nextDayLordIndex = (selectedDay + 1) % 7;
  const nextDayFirstHoraGraha = horas[23].graha.name;

  return (
    <div
      className="w-full"
      style={{
        background: "linear-gradient(180deg, #FFF8EA 0%, #F8EBCF 100%)",
        border: `1px solid ${BORDER}`,
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 18px 40px rgba(72, 48, 16, 0.10)",
      }}
      data-interactive="chaldean-planetary-hora-explorer"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold" style={{ color: INK }}>
          <IAST>Chaldean Planetary Hora Explorer</IAST>
        </h2>
        <p className="text-sm mt-1 font-medium" style={{ color: INK_SOFT }}>
          Why the weekdays follow this order — the 24 Hora sequence explained
        </p>
      </div>

      {/* Compact SVG Hora Cycle Ring */}
      <div className="flex justify-center mb-5">
        <HoraCycleRing selectedDay={selectedDay} animKey={animKey} />
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* Left: Chaldean Order — compact */}
        <div className="w-full xl:w-64 shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD_DEEP }}>
            Chaldean Order
          </h3>
          <p className="text-xs mb-3 font-medium" style={{ color: INK_SOFT }}>
            Slowest to fastest orbital speed.
          </p>
          <div className="space-y-1.5">
            {CHALDEAN_ORDER.map((g, idx) => (
              <button
                key={g.name}
                onClick={() => setSelectedGraha(idx)}
                className="w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all hover:scale-[1.01]"
                style={{
                  background: selectedGraha === idx ? `${g.color}1F` : PANEL,
                  border: selectedGraha === idx ? `2px solid ${g.color}` : `1px solid ${BORDER}`,
                  boxShadow: selectedGraha === idx ? "0 8px 18px rgba(72, 48, 16, 0.12)" : "none",
                }}
              >
                <span className="text-base font-bold w-6 text-center" style={{ color: g.color }}>{g.symbol}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold" style={{ color: INK }}>
                    <IAST>{g.name}</IAST>
                  </div>
                  <div className="text-[11px] font-semibold" style={{ color: INK_MUTED_STRONG }}>
                    {g.speed} · {g.period}
                  </div>
                </div>
                <span className="text-[11px] font-bold" style={{ color: INK }}>{idx + 1}</span>
              </button>
            ))}
          </div>
          {selectedGraha !== null && (
            <div className="mt-2 p-2.5 rounded-lg text-xs" style={{ background: PANEL_STRONG, border: `1px solid ${BORDER}` }}>
              <p className="font-medium leading-relaxed" style={{ color: INK_SOFT }}>{CHALDEAN_ORDER[selectedGraha].description}</p>
            </div>
          )}
        </div>

        {/* Right: Hora Sequence */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD_DEEP }}>
            Hora Sequence Generator
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {DAY_NAMES.map((day, idx) => (
              <button
                key={day}
                onClick={() => handleDayChange(idx)}
                className="px-2.5 py-1 text-xs font-medium rounded-full transition-all"
                style={{
                  background: selectedDay === idx ? "var(--gl-gold-accent)" : "transparent",
                  color: selectedDay === idx ? "#fff" : INK,
                  border: selectedDay === idx ? "1px solid var(--gl-gold-accent)" : `1px solid ${BORDER}`,
                  boxShadow: selectedDay === idx ? "0 6px 14px rgba(143, 104, 24, 0.18)" : "none",
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <p className="text-sm mb-3 font-medium" style={{ color: INK_SOFT }}>
            1st hora of <strong style={{ color: INK }}>{DAY_NAMES[selectedDay]}</strong>{" "}
            ({DAY_DEVANAGARI[selectedDay]}) = <IAST>{DAY_LORDS[selectedDay]}</IAST>
          </p>

          {/* 24-Hora Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5 mb-4" key={animKey}>
            {horas.map((h, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center justify-center p-1.5 rounded-lg transition-all cursor-default"
                style={{
                  background: hoverHora === i ? `${h.graha.color}28` : `${h.graha.color}10`,
                  border: hoverHora === i ? `2px solid ${h.graha.color}` : `1px solid ${BORDER}`,
                  animation: `horaFadeIn 0.25s ease ${i * 0.015}s both`,
                  minHeight: 56,
                }}
                onMouseEnter={() => setHoverHora(i)}
                onMouseLeave={() => setHoverHora(null)}
              >
                <span className="text-sm font-bold" style={{ color: h.graha.color }}>{h.graha.symbol}</span>
                <span className="text-[11px] mt-0.5 font-bold" style={{ color: INK_MUTED_STRONG }}>{h.number}</span>
                {i === 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: "var(--gl-gold-accent)" }}>1</span>
                )}
              </div>
            ))}
          </div>

          {hoverHora !== null && (
            <div className="mb-3 p-2.5 rounded-lg text-xs" style={{ background: PANEL_STRONG, border: `1px solid ${BORDER}` }}>
              <span className="font-bold" style={{ color: INK }}>Hora {horas[hoverHora].number}</span>
              <span style={{ color: "var(--gl-ink-secondary)" }}> — ruled by <IAST>{horas[hoverHora].graha.name}</IAST> ({horas[hoverHora].graha.devanagari})</span>
            </div>
          )}

          {/* Mathematical Proof Panel */}
          <div className="rounded-xl p-3" style={{ background: PANEL_STRONG, border: `1px solid ${BORDER}` }}>
            <h4 className="text-sm font-bold mb-2" style={{ color: INK }}>Why does the weekday shift by 3?</h4>
            <div className="space-y-2 text-sm font-medium" style={{ color: INK_SOFT }}>
              <p>24 horas ÷ 7 planets = 3 remainder <strong>3</strong></p>

              <div className="flex flex-col items-center gap-1.5 py-1">
                <div className="flex gap-0.5 flex-wrap justify-center">
                  {Array.from({ length: 24 }, (_, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: i < 21 ? "var(--gl-gold-accent)" : "#C8412E", opacity: i < 21 ? 0.5 : 1 }} />
                  ))}
                </div>
                <div className="flex gap-3 text-[11px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--gl-gold-accent)", opacity: 0.5 }} />3 cycles (21)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#C8412E" }} />Remainder (3)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <div className="px-2.5 py-1 rounded-md text-xs font-mono font-bold" style={{ background: "var(--gl-gold-accent)", color: "#fff" }}>24 mod 7 = 3</div>
                <span className="text-[11px]" style={{ color: "var(--gl-ink-muted)" }}>→ day-lord shifts +3</span>
              </div>

              <svg viewBox="0 0 380 52" className="w-full h-auto" style={{ maxWidth: 380 }}>
                <text x={10} y={16} fill="var(--gl-ink-primary)" fontSize={11} fontWeight={600}>{DAY_NAMES[selectedDay]}</text>
                <text x={6} y={30} fill="var(--gl-ink-muted)" fontSize={10}>1st: <IAST>{DAY_LORDS[selectedDay]}</IAST></text>
                <line x1={90} y1={22} x2={150} y2={22} stroke="var(--gl-gold-accent)" strokeWidth={2} markerEnd="url(#arrowhead)" />
                <defs><marker id="arrowhead" markerWidth={7} markerHeight={5} refX={6} refY={2.5} orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="var(--gl-gold-accent)" /></marker></defs>
                <text x={105} y={16} fill="var(--gl-gold-accent)" fontSize={10} fontWeight={700}>+3</text>
                <text x={170} y={16} fill="var(--gl-ink-primary)" fontSize={11} fontWeight={600}>{DAY_NAMES[nextDayLordIndex]}</text>
                <text x={166} y={30} fill="var(--gl-ink-muted)" fontSize={10}>1st: <IAST>{DAY_LORDS[nextDayLordIndex]}</IAST></text>
                <text x={166} y={44} fill="#A23A1E" fontSize={10} fontWeight={600}>24th: <IAST>{nextDayFirstHoraGraha}</IAST></text>
              </svg>

              <div className="flex items-center gap-1.5 mt-2 pt-2" style={{ borderTop: "1px solid var(--gl-gold-hairline)" }}>
                <span className="text-[11px]" style={{ color: "var(--gl-ink-muted)" }}>Cascade:</span>
                {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                  const dayIdx = (selectedDay + offset) % 7;
                  return (
                    <span key={offset} className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: offset === 0 ? "var(--gl-gold-accent)" : "var(--gl-surface-card)", color: offset === 0 ? "#fff" : "var(--gl-ink-secondary)" }}>
                      {DAY_NAMES[dayIdx].slice(0, 3)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes horaFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Compact SVG Hora Cycle Ring ─── */
function HoraCycleRing({ selectedDay, animKey }: { selectedDay: number; animKey: number }) {
  const CX = 200;
  const CY = 200;
  const R_OUTER = 180;
  const R_INNER = 118;
  const R_LABEL = (R_OUTER + R_INNER) / 2;

  const chaldeanNames = CHALDEAN_ORDER.map((g) => g.name);
  const dayLord = DAY_LORDS[selectedDay];
  const startIdx = chaldeanNames.indexOf(dayLord);

  const getSegmentPath = (idx: number, total: number) => {
    const startAngle = idx * (360 / total) - 90;
    const endAngle = (idx + 1) * (360 / total) - 90;
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

  const horaPositions = [];
  for (let i = 0; i < 24; i++) {
    const grahaIdx = (startIdx + i) % 7;
    horaPositions.push({ number: i + 1, graha: CHALDEAN_ORDER[grahaIdx] });
  }

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxWidth: 420 }}>
      <defs>
        <filter id="hShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity="0.1" />
        </filter>
      </defs>
      <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="none" stroke={BORDER} strokeWidth={1.5} opacity={0.85} />

      {horaPositions.map((h, idx) => {
        const midAngle = idx * (360 / 24) + (360 / 48) - 90;
        const lx = CX + R_LABEL * Math.cos((midAngle * Math.PI) / 180);
        const ly = CY + R_LABEL * Math.sin((midAngle * Math.PI) / 180);
        const isFirst = idx === 0;

        return (
          <g key={`${animKey}-${idx}`} style={{ animation: `horaFadeIn 0.25s ease ${idx * 0.01}s both` }}>
            <path d={getSegmentPath(idx, 24)} fill={`${h.graha.color}18`} stroke={isFirst ? h.graha.color : `${h.graha.color}66`} strokeWidth={isFirst ? 2.8 : 1.1} filter="url(#hShadow)" />
            <text x={lx} y={ly - 4} textAnchor="middle" fill={h.graha.color} fontSize={16} fontWeight={900} style={{ pointerEvents: "none", fontFamily: "serif" }}>{h.graha.symbol}</text>
            <text x={lx} y={ly + 12} textAnchor="middle" fill={INK} fontSize={10} fontWeight={800} style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif" }}>{h.number}</text>
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={R_INNER - 12} fill={PANEL_STRONG} stroke={GOLD_DEEP} strokeWidth={2.2} filter="url(#hShadow)" />
      <text x={CX} y={CY - 13} textAnchor="middle" fill={INK} fontSize={15} fontWeight={900} style={{ fontFamily: "var(--font-sans), sans-serif" }}>{DAY_NAMES[selectedDay]}</text>
      <text x={CX} y={CY + 5} textAnchor="middle" fill={INK_SOFT} fontSize={13} fontWeight={800}>{DAY_DEVANAGARI[selectedDay]}</text>
      <text x={CX} y={CY + 22} textAnchor="middle" fill={INK_MUTED_STRONG} fontSize={12} fontWeight={800}>24 Horas</text>
    </svg>
  );
}
