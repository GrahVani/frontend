"use client";

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { NAKSHATRAS, RULER_COLORS } from "../nakshatra-data";

const NAKSHATRA_DEGREE = 13 + 20 / 60;
const PADA_DEGREE = 3 + 20 / 60;

function computeNakshatra(moonLon: number) {
  const normalized = ((moonLon % 360) + 360) % 360;
  const index = Math.floor(normalized / NAKSHATRA_DEGREE);
  const nakshatra = NAKSHATRAS[Math.min(index, 26)];
  const elapsed = normalized - index * NAKSHATRA_DEGREE;
  const pada = Math.min(Math.floor(elapsed / PADA_DEGREE) + 1, 4);
  const remaining = NAKSHATRA_DEGREE - elapsed;
  return { normalized, index: Math.min(index, 26), nakshatra, elapsed, pada, remaining };
}

function toDms(deg: number) {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return { d, m, s };
}

function NakshatraWheel({
  highlightIndex,
  currentLon,
  sunLon,
  sunHighlightIndex,
}: {
  highlightIndex: number;
  currentLon: number;
  sunLon?: number;
  sunHighlightIndex?: number;
}) {
  const CX = 200;
  const CY = 200;
  const R = 170;
  const R_INNER = 48;

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxWidth: 300, display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="nsShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6B4423" floodOpacity="0.12" />
        </filter>
      </defs>
      <circle cx={CX} cy={CY} r={R + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.35} />
      <circle cx={CX} cy={CY} r={R + 3} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.25} strokeDasharray="3 3" />
      {NAKSHATRAS.map((n) => {
        const startAngle = (n.num - 1) * (360 / 27);
        const endAngle = n.num * (360 / 27);
        const x1 = CX + R * Math.cos((startAngle - 90) * (Math.PI / 180));
        const y1 = CY + R * Math.sin((startAngle - 90) * (Math.PI / 180));
        const x2 = CX + R * Math.cos((endAngle - 90) * (Math.PI / 180));
        const y2 = CY + R * Math.sin((endAngle - 90) * (Math.PI / 180));
        const xi1 = CX + R_INNER * Math.cos((startAngle - 90) * (Math.PI / 180));
        const yi1 = CY + R_INNER * Math.sin((startAngle - 90) * (Math.PI / 180));
        const xi2 = CX + R_INNER * Math.cos((endAngle - 90) * (Math.PI / 180));
        const yi2 = CY + R_INNER * Math.sin((endAngle - 90) * (Math.PI / 180));
        
        const isActive = n.num - 1 === highlightIndex;
        const isSunActive = sunHighlightIndex !== undefined && n.num - 1 === sunHighlightIndex;
        const rc = RULER_COLORS[n.rulerKey];
        
        let fill = "var(--gl-card-surface-solid, #FFF9F0)";
        let stroke = "var(--gl-gold-hairline)";
        let strokeWidth = 0.5;
        let textFill = "var(--gl-ink-muted)";
        let fontWeight = 500;
        
        if (isActive && isSunActive) {
          fill = rc.bg;
          stroke = "#e67e22";
          strokeWidth = 2.5;
          textFill = rc.text;
          fontWeight = 800;
        } else if (isActive) {
          fill = rc.bg;
          stroke = rc.border;
          strokeWidth = 2;
          textFill = rc.text;
          fontWeight = 700;
        } else if (isSunActive) {
          fill = "#FDF6E3";
          stroke = "#e67e22";
          strokeWidth = 2;
          textFill = "#e67e22";
          fontWeight = 700;
        }

        const midAngle = (startAngle + endAngle) / 2;
        const labelR = (R_INNER + R) / 2;
        const lx = CX + labelR * Math.cos((midAngle - 90) * (Math.PI / 180));
        const ly = CY + labelR * Math.sin((midAngle - 90) * (Math.PI / 180));
        
        return (
          <g key={n.num}>
            <path
              d={`M ${xi1} ${yi1} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={isActive || isSunActive ? 1 : 0.7}
              style={{ transition: "all 0.25s ease" }}
            />
            <text x={lx} y={ly + 3} textAnchor="middle" fill={textFill} fontSize={9} fontWeight={fontWeight} style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}>
              {n.num}
            </text>
          </g>
        );
      })}
      {(() => {
        const moonAngle = currentLon;
        const mx = CX + (R - 14) * Math.cos((moonAngle - 90) * (Math.PI / 180));
        const my = CY + (R - 14) * Math.sin((moonAngle - 90) * (Math.PI / 180));
        return (
          <g>
            <circle cx={mx} cy={my} r={5} fill="var(--gl-gold-accent)" opacity={0.9}>
              <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={mx} y={my - 9} textAnchor="middle" fill="#C9A24D" fontSize={10} fontWeight="bold" style={{ pointerEvents: "none", fontFamily: "var(--font-sans)" }}>☽</text>
          </g>
        );
      })()}
      {sunLon !== undefined && (() => {
        const sunAngle = sunLon;
        const sx = CX + (R - 26) * Math.cos((sunAngle - 90) * (Math.PI / 180));
        const sy = CY + (R - 26) * Math.sin((sunAngle - 90) * (Math.PI / 180));
        
        const elongation = ((currentLon - sunLon) % 360 + 360) % 360;
        const largeArcFlag = elongation > 180 ? 1 : 0;
        
        const arcR = R - 20;
        const arcStartX = CX + arcR * Math.cos((sunAngle - 90) * (Math.PI / 180));
        const arcStartY = CY + arcR * Math.sin((sunAngle - 90) * (Math.PI / 180));
        const arcEndX = CX + arcR * Math.cos((currentLon - 90) * (Math.PI / 180));
        const arcEndY = CY + arcR * Math.sin((currentLon - 90) * (Math.PI / 180));
        
        return (
          <g>
            <path
              d={`M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 ${largeArcFlag} 1 ${arcEndX} ${arcEndY}`}
              fill="none"
              stroke="#e67e22"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.4}
            />
            <circle cx={sx} cy={sy} r={5} fill="#e67e22" opacity={0.9}>
              <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={sx} cy={sy} r={7} fill="none" stroke="#e67e22" strokeWidth={1.5} opacity={0.8} />
            <text x={sx} y={sy - 9} textAnchor="middle" fill="#e67e22" fontSize={10} fontWeight="bold" style={{ pointerEvents: "none", fontFamily: "var(--font-sans)" }}>☀</text>
          </g>
        );
      })()}
      <circle cx={CX} cy={CY} r={R_INNER - 3} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-hairline)" strokeWidth={1} />
      <text x={CX} y={CY - 2} textAnchor="middle" fill="var(--gl-gold-accent)" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>27 NAKṢATRAS</text>
      <text x={CX} y={CY + 12} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={8} style={{ fontFamily: "var(--font-sans), sans-serif" }}>13°20′ each</text>
    </svg>
  );
}

export function MoonNakshatraCalculator() {
  const [deg, setDeg] = useState<number>(53);
  const [min, setMin] = useState<number>(20);
  const [sunDeg, setSunDeg] = useState<number>(30);
  const [sunMin, setSunMin] = useState<number>(0);
  const [showSun, setShowSun] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [targetBody, setTargetBody] = useState<"moon" | "sun">("moon");
  const [stepTab, setStepTab] = useState<"moon" | "sun">("moon");

  const moonLon = deg + min / 60;
  const result = useMemo(() => computeNakshatra(moonLon), [moonLon]);
  const moonDms = toDms(moonLon);
  const rc = RULER_COLORS[result.nakshatra.rulerKey];

  const sunLon = sunDeg + sunMin / 60;
  const sunResult = useMemo(() => computeNakshatra(sunLon), [sunLon]);
  const sunDms = toDms(sunLon);
  const sunRc = RULER_COLORS[sunResult.nakshatra.rulerKey];

  const activeTarget = showSun ? targetBody : "moon";

  const tithiContext = useMemo(() => {
    if (!showSun) return null;
    const elongation = ((moonLon - sunLon) % 360 + 360) % 360;
    const tithiIndex = Math.floor(elongation / 12);
    const tithiNum = tithiIndex + 1;
    const paksha = elongation < 180 ? "śukla" : "kṛṣṇa";
    const displayNum = elongation < 180 ? tithiNum : tithiNum - 15;
    return { elongation: Math.round(elongation * 10) / 10, tithiNum, paksha, displayNum };
  }, [moonLon, sunLon, showSun]);

  const handleSelectNakshatra = (idx: number) => {
    const startLon = idx * (40 / 3);
    const midLon = startLon + (20 / 3);
    const d = Math.floor(midLon);
    const m = Math.round((midLon - d) * 60);
    if (activeTarget === "moon") {
      setDeg(d);
      setMin(m);
    } else {
      setSunDeg(d);
      setSunMin(m);
    }
  };

  const steps = [
    {
      label: "Step 1 — Normalize longitude",
      math: `λ_Moon = ${moonLon.toFixed(3)}° (mod 360)`,
      subst: `${moonDms.d}° ${moonDms.m}′ ${moonDms.s}″`,
      note: "Ensure the Moon's longitude is within 0–360°.",
    },
    {
      label: "Step 2 — Divide by 13°20′",
      math: `E = ${moonLon.toFixed(3)}° / 13.333° = ${(moonLon / NAKSHATRA_DEGREE).toFixed(4)}`,
      subst: "Each nakṣatra spans 13°20′ (40/3°). The quotient tells us how many full segments have passed.",
      note: "Floor = full nakṣatras elapsed. Remainder = degrees into current nakṣatra.",
    },
    {
      label: "Step 3 — Nakṣatra number",
      math: `N = ⌊${(moonLon / NAKSHATRA_DEGREE).toFixed(4)}⌋ + 1 = ${result.index + 1}`,
      subst: `${result.nakshatra.name} (${result.nakshatra.devanagari})`,
      note: "+1 converts from 0-indexed to 1-indexed (classical convention).",
    },
    {
      label: "Step 4 — Pāda (quarter)",
      math: `pāda = ⌊${result.elapsed.toFixed(2)}° / 3.333°⌋ + 1 = ${result.pada}`,
      subst: `Each pāda = 3°20′. Pāda ${result.pada} of 4.`,
      note: "27 nakṣatras × 4 padas = 108 navāṃśa divisions of the ecliptic.",
    },
    {
      label: "Step 5 — Elapsed & remaining",
      math: `Elapsed: ${result.elapsed.toFixed(2)}° · Remaining: ${result.remaining.toFixed(2)}°`,
      subst: `${Math.round((result.elapsed / NAKSHATRA_DEGREE) * 100)}% through this nakṣatra`,
      note: "Used to estimate nakṣatra transition times in a pañcāṅga.",
    },
  ];

  const sunSteps = [
    {
      label: "Step 1 — Normalize longitude",
      math: `λ_Sun = ${sunLon.toFixed(3)}° (mod 360)`,
      subst: `${sunDms.d}° ${sunDms.m}′ ${sunDms.s}″`,
      note: "Ensure the Sun's longitude is within 0–360°.",
    },
    {
      label: "Step 2 — Divide by 13°20′",
      math: `E = ${sunLon.toFixed(3)}° / 13.333° = ${(sunLon / NAKSHATRA_DEGREE).toFixed(4)}`,
      subst: "Each nakṣatra spans 13°20′ (40/3°). The quotient tells us how many full segments have passed.",
      note: "Floor = full nakṣatras elapsed. Remainder = degrees into current nakṣatra.",
    },
    {
      label: "Step 3 — Nakṣatra number",
      math: `N = ⌊${(sunLon / NAKSHATRA_DEGREE).toFixed(4)}⌋ + 1 = ${sunResult.index + 1}`,
      subst: `${sunResult.nakshatra.name} (${sunResult.nakshatra.devanagari})`,
      note: "+1 converts from 0-indexed to 1-indexed (classical convention).",
    },
    {
      label: "Step 4 — Pāda (quarter)",
      math: `pāda = ⌊${sunResult.elapsed.toFixed(2)}° / 3.333°⌋ + 1 = ${sunResult.pada}`,
      subst: `Each pāda = 3°20′. Pāda ${sunResult.pada} of 4.`,
      note: "27 nakṣatras × 4 padas = 108 navāṃśa divisions of the ecliptic.",
    },
    {
      label: "Step 5 — Elapsed & remaining",
      math: `Elapsed: ${sunResult.elapsed.toFixed(2)}° · Remaining: ${sunResult.remaining.toFixed(2)}°`,
      subst: `${Math.round((sunResult.elapsed / NAKSHATRA_DEGREE) * 100)}% through this nakṣatra`,
      note: "Used to estimate nakṣatra transition times.",
    },
  ];

  if (tithiContext) {
    steps.push({
      label: "Context — Tithi (Lunar Phase)",
      math: `Elongation = (λ_Moon - λ_Sun) mod 360 = ${tithiContext.elongation.toFixed(2)}°`,
      subst: `Tithi = ⌊${tithiContext.elongation.toFixed(2)}° / 12°⌋ + 1 = ${tithiContext.tithiNum}`,
      note: `This places the Moon in the ${tithiContext.paksha} pakṣa, day ${tithiContext.displayNum} of 15.`,
    });
  }

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
        padding: "20px",
      }}
      data-interactive="moon-nakshatra-calculator"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Moon-Nakṣatra Calculator</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Enter the Moon's spaṣṭa longitude. Walk through each step of the classical formula.
        </p>
      </div>

      <div className="rounded-xl p-4 mb-5" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
        <div className="flex flex-wrap items-end gap-3 justify-between">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ☾ Moon Longitude
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <span className="text-[10px] text-gray-500">Degrees</span>
                <input type="number" min={0} max={359} value={deg} onChange={(e) => setDeg(Math.max(0, Math.min(359, Number(e.target.value))))} className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-gray-500">Minutes</span>
                <input type="number" min={0} max={59} value={min} onChange={(e) => setMin(Math.max(0, Math.min(59, Number(e.target.value))))} className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
              </div>
            </div>
          </div>
          <button onClick={() => setShowSun((s) => !s)} className="px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]" style={{ background: showSun ? "#FDF6E3" : "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: showSun ? "var(--gl-gold-accent)" : "var(--gl-ink-muted)" }}>
            {showSun ? "− Hide Sun" : "+ Add Sun"}
          </button>
        </div>

        {showSun && (
          <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: "1px dashed var(--gl-gold-hairline)" }}>
            <div className="flex-1">
              <label className="block text-xs font-bold mb-2" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                ☀ Sun Longitude
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500">Sun Degrees</span>
                  <input type="number" min={0} max={359} value={sunDeg} onChange={(e) => setSunDeg(Math.max(0, Math.min(359, Number(e.target.value))))} className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500">Sun Minutes</span>
                  <input type="number" min={0} max={59} value={sunMin} onChange={(e) => setSunMin(Math.max(0, Math.min(59, Number(e.target.value))))} className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 flex flex-col sm:flex-row gap-3 items-end" style={{ borderTop: "1px dashed var(--gl-gold-hairline)" }}>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold mb-2 text-gray-600" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Quick Jump to Nakṣatra ({activeTarget === "moon" ? "Moon" : "Sun"})
            </label>
            <div className="relative">
              <select 
                className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer transition-all"
                style={{ background: "#FDF6E3", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)", fontWeight: 500 }}
                value={activeTarget === "moon" ? result.index : sunResult.index}
                onChange={(e) => handleSelectNakshatra(Number(e.target.value))}
              >
                {NAKSHATRAS.map((n, idx) => (
                  <option key={n.num} value={idx}>
                    {n.num}. {n.name} ({n.devanagari}) — {n.meaning.split(" — ")[0]}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: "var(--gl-gold-accent)" }}>
                ▼
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowGrid((g) => !g)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] bg-amber-50 border border-amber-200 text-amber-800 shrink-0 w-full sm:w-auto text-center"
          >
            {showGrid ? "📂 Hide 27 Buttons Grid" : "📂 Show 27 Buttons Grid"}
          </button>
        </div>

        {showGrid && (
          <div className="mt-4 p-3 rounded-lg space-y-4" style={{ background: "var(--gl-surface-manuscript, #FFFBF5)", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Preset Nakṣatra Grid (9-9-9 Groups)
              </span>
              {showSun && (
                <div className="flex gap-3 items-center text-xs bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">
                  <span className="font-semibold text-gray-500">Apply to:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="preset-target" checked={targetBody === "moon"} onChange={() => setTargetBody("moon")} className="accent-amber-600" />
                    <span className={targetBody === "moon" ? "font-bold text-amber-800" : ""}>Moon</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="preset-target" checked={targetBody === "sun"} onChange={() => setTargetBody("sun")} className="accent-amber-600" />
                    <span className={targetBody === "sun" ? "font-bold text-amber-800" : ""}>Sun</span>
                  </label>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {[
                { title: "Group I (0°–120°: Aśvinī – Āśleṣā)", range: [0, 9] },
                { title: "Group II (120°–240°: Maghā – Jyeṣṭhā)", range: [9, 18] },
                { title: "Group III (240°–360°: Mūla – Revatī)", range: [18, 27] }
              ].map((group) => (
                <div key={group.title} className="space-y-1">
                  <div className="text-[9px] uppercase tracking-wider font-bold text-gray-500">{group.title}</div>
                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-1">
                    {NAKSHATRAS.slice(group.range[0], group.range[1]).map((n, sliceIdx) => {
                      const idx = group.range[0] + sliceIdx;
                      const rcColors = RULER_COLORS[n.rulerKey];
                      const isSelected = (activeTarget === "moon" && result.index === idx) || (activeTarget === "sun" && showSun && sunResult.index === idx);
                      return (
                        <button
                          key={n.num}
                          onClick={() => handleSelectNakshatra(idx)}
                          className="px-1.5 py-2 text-[10px] font-medium rounded transition-all border w-full text-center hover:scale-[1.03]"
                          style={{
                            background: isSelected ? rcColors.bg : "#ffffff",
                            color: isSelected ? rcColors.text : "var(--gl-ink-secondary)",
                            borderColor: isSelected ? rcColors.border : "var(--gl-gold-hairline)",
                            borderWidth: isSelected ? "1.5px" : "1px",
                            fontWeight: isSelected ? 700 : 500,
                            boxShadow: isSelected ? `0 0 6px ${rcColors.glow}` : "none",
                          }}
                          title={`${n.num}. ${n.name} (${n.devanagari}) — Ruled by ${n.ruler}`}
                        >
                          <div className="font-semibold" style={{ color: isSelected ? rcColors.text : "var(--gl-ink-muted)" }}>{n.num}</div>
                          <div className="truncate">{n.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="space-y-4">
          {/* Moon Result Card */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: `2px solid ${rc.border}`, boxShadow: `0 4px 12px ${rc.glow}40` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: rc.text }}>☾ Moon Result</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: rc.bg, color: rc.text }}>{result.nakshatra.ruler}</span>
            </div>
            <div className="text-center py-1">
              <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>{result.index + 1}</div>
              <div className="text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>Nakṣatra number (1–27)</div>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
                <IAST>{result.nakshatra.name}</IAST>
              </h4>
              <Devanagari size="sm">{result.nakshatra.devanagari}</Devanagari>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-3 text-center" style={{ borderTop: "1px solid var(--gl-gold-hairline)" }}>
              <div>
                <div className="text-base font-bold" style={{ color: "var(--gl-gold-accent)" }}>{result.pada}</div>
                <div className="text-[9px] uppercase tracking-wide text-gray-500">Pāda</div>
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: "var(--gl-gold-accent)" }}>{result.elapsed.toFixed(2)}°</div>
                <div className="text-[9px] uppercase tracking-wide text-gray-500">Elapsed</div>
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: "var(--gl-gold-accent)" }}>{result.remaining.toFixed(2)}°</div>
                <div className="text-[9px] uppercase tracking-wide text-gray-500">Remaining</div>
              </div>
              <div>
                <div className="text-sm font-bold truncate" style={{ color: "var(--gl-gold-accent)" }} title={result.nakshatra.deity}>{result.nakshatra.deity}</div>
                <div className="text-[9px] uppercase tracking-wide text-gray-500">Deity</div>
              </div>
            </div>
            {tithiContext && (
              <div className="rounded-lg p-2.5 text-[11px]" style={{ background: "#FDF6E3", border: "1px solid var(--gl-gold-hairline)" }}>
                <span style={{ color: "var(--gl-gold-accent)", fontWeight: 700 }}>Tithi context:</span>{" "}
                <span style={{ color: "var(--gl-ink-secondary)" }}>Elongation {tithiContext.elongation}° → {tithiContext.paksha} pakṣa, tithi {tithiContext.displayNum}/15</span>
              </div>
            )}
          </div>

          {/* Sun Result Card (optional) */}
          {showSun && (
            <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: `2px solid ${sunRc.border}`, boxShadow: `0 4px 12px ${sunRc.glow}40` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: sunRc.text }}>☀ Sun Result</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: sunRc.bg, color: sunRc.text }}>{sunResult.nakshatra.ruler}</span>
              </div>
              <div className="text-center py-1">
                <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>{sunResult.index + 1}</div>
                <div className="text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>Nakṣatra number (1–27)</div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
                  <IAST>{sunResult.nakshatra.name}</IAST>
                </h4>
                <Devanagari size="sm">{sunResult.nakshatra.devanagari}</Devanagari>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-3 text-center" style={{ borderTop: "1px solid var(--gl-gold-hairline)" }}>
                <div>
                  <div className="text-base font-bold" style={{ color: "#e67e22" }}>{sunResult.pada}</div>
                  <div className="text-[9px] uppercase tracking-wide text-gray-500">Pāda</div>
                </div>
                <div>
                  <div className="text-base font-bold" style={{ color: "#e67e22" }}>{sunResult.elapsed.toFixed(2)}°</div>
                  <div className="text-[9px] uppercase tracking-wide text-gray-500">Elapsed</div>
                </div>
                <div>
                  <div className="text-base font-bold" style={{ color: "#e67e22" }}>{sunResult.remaining.toFixed(2)}°</div>
                  <div className="text-[9px] uppercase tracking-wide text-gray-500">Remaining</div>
                </div>
                <div>
                  <div className="text-sm font-bold truncate" style={{ color: "#e67e22" }} title={sunResult.nakshatra.deity}>{sunResult.nakshatra.deity}</div>
                  <div className="text-[9px] uppercase tracking-wide text-gray-500">Deity</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl p-4 flex items-center justify-center" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <NakshatraWheel highlightIndex={result.index} currentLon={moonLon} sunLon={showSun ? sunLon : undefined} sunHighlightIndex={showSun ? sunResult.index : undefined} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Step-by-step breakdown</h4>
          <div className="flex items-center gap-3">
            {showSun && (
              <div className="flex gap-1.5 text-xs bg-white p-0.5 rounded-lg border border-gray-200">
                <button
                  onClick={() => setStepTab("moon")}
                  className={`px-2 py-1 rounded-md transition-all ${stepTab === "moon" ? "bg-amber-100 text-amber-900 font-bold" : "text-gray-500"}`}
                >
                  ☾ Moon Math
                </button>
                <button
                  onClick={() => setStepTab("sun")}
                  className={`px-2 py-1 rounded-md transition-all ${stepTab === "sun" ? "bg-orange-100 text-orange-900 font-bold" : "text-gray-500"}`}
                >
                  ☀ Sun Math
                </button>
              </div>
            )}
            <button onClick={() => setShowSteps((s) => !s)} className="text-xs font-medium" style={{ color: "var(--gl-ink-muted)" }}>{showSteps ? "Hide" : "Show"}</button>
          </div>
        </div>
        {showSteps && (
          <div className="space-y-2">
            {(stepTab === "moon" || !showSun ? steps : sunSteps).map((s, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
                <div className="text-xs font-bold mb-1" style={{ color: stepTab === "moon" || !showSun ? "var(--gl-gold-accent)" : "#e67e22" }}>{s.label}</div>
                <div className="text-sm font-mono mb-1" style={{ color: "var(--gl-ink-primary)" }}>{s.math}</div>
                <div className="text-sm mb-1" style={{ color: "var(--gl-ink-secondary)" }}>{s.subst}</div>
                <div className="text-xs italic" style={{ color: "var(--gl-ink-muted)" }}>{s.note}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
