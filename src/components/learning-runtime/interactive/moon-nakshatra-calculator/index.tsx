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

const PRESETS = [
  { label: "Rohiṇī", lon: 53.33, desc: "Moon's favourite nakṣatra" },
  { label: "Maghā", lon: 126.67, desc: "Pitṛ-devatā; royal power" },
  { label: "Mūla", lon: 240.00, desc: "Root of destruction & renewal" },
  { label: "Pūrvāṣāḍhā", lon: 253.33, desc: "Invincible victory" },
  { label: "Revatī", lon: 346.67, desc: "Last nakṣatra; Pūṣan" },
  { label: "Aśvinī", lon: 10.00, desc: "Healing twins; start of the ecliptic" },
];

function NakshatraWheel({ highlightIndex }: { highlightIndex: number }) {
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
        const rc = RULER_COLORS[n.rulerKey];
        const midAngle = (startAngle + endAngle) / 2;
        const labelR = (R_INNER + R) / 2;
        const lx = CX + labelR * Math.cos((midAngle - 90) * (Math.PI / 180));
        const ly = CY + labelR * Math.sin((midAngle - 90) * (Math.PI / 180));
        return (
          <g key={n.num}>
            <path
              d={`M ${xi1} ${yi1} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`}
              fill={isActive ? rc.bg : "var(--gl-card-surface-solid, #FFF9F0)"}
              stroke={isActive ? rc.border : "var(--gl-gold-hairline)"}
              strokeWidth={isActive ? 2 : 0.5}
              opacity={isActive ? 1 : 0.7}
              style={{ transition: "all 0.25s ease" }}
            />
            <text x={lx} y={ly + 3} textAnchor="middle" fill={isActive ? rc.text : "var(--gl-ink-muted)"} fontSize={9} fontWeight={isActive ? 700 : 500} style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}>
              {n.num}
            </text>
          </g>
        );
      })}
      {(() => {
        const mid = highlightIndex * (360 / 27) + (360 / 54);
        const mx = CX + (R - 14) * Math.cos((mid - 90) * (Math.PI / 180));
        const my = CY + (R - 14) * Math.sin((mid - 90) * (Math.PI / 180));
        return (
          <circle cx={mx} cy={my} r={4} fill="var(--gl-gold-accent)" opacity={0.9}>
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
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

  const moonLon = deg + min / 60;
  const result = useMemo(() => computeNakshatra(moonLon), [moonLon]);
  const moonDms = toDms(moonLon);
  const rc = RULER_COLORS[result.nakshatra.rulerKey];

  const tithiContext = useMemo(() => {
    if (!showSun) return null;
    const sunLon = sunDeg + sunMin / 60;
    const elongation = ((moonLon - sunLon) % 360 + 360) % 360;
    const tithiIndex = Math.floor(elongation / 12);
    const tithiNum = tithiIndex + 1;
    const paksha = elongation < 180 ? "śukla" : "kṛṣṇa";
    const displayNum = elongation < 180 ? tithiNum : tithiNum - 15;
    return { elongation: Math.round(elongation * 10) / 10, tithiNum, paksha, displayNum };
  }, [moonLon, sunDeg, sunMin, showSun]);

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
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold mb-2" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Moon Longitude
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Degrees</span>
                <input type="number" min={0} max={359} value={deg} onChange={(e) => setDeg(Math.max(0, Math.min(359, Number(e.target.value))))} className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
              </div>
              <div className="flex-1">
                <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Minutes</span>
                <input type="number" min={0} max={59} value={min} onChange={(e) => setMin(Math.max(0, Math.min(59, Number(e.target.value))))} className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
              </div>
            </div>
          </div>
          <button onClick={() => setShowSun((s) => !s)} className="px-3 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: showSun ? "#FDF6E3" : "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: showSun ? "var(--gl-gold-accent)" : "var(--gl-ink-muted)" }}>
            {showSun ? "− Hide Sun" : "+ Add Sun"}
          </button>
        </div>

        {showSun && (
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px dashed var(--gl-gold-hairline)" }}>
            <div className="flex-1">
              <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Sun Degrees</span>
              <input type="number" min={0} max={359} value={sunDeg} onChange={(e) => setSunDeg(Math.max(0, Math.min(359, Number(e.target.value))))} className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
            </div>
            <div className="flex-1">
              <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Sun Minutes</span>
              <input type="number" min={0} max={59} value={sunMin} onChange={(e) => setSunMin(Math.max(0, Math.min(59, Number(e.target.value))))} className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => { setDeg(Math.floor(p.lon)); setMin(Math.round((p.lon % 1) * 60)); }} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all" style={{ background: "#FDF6E3", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)" }} title={p.desc}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: `2px solid ${rc.border}` }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: rc.text }}>Result</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: rc.bg, color: rc.text }}>{result.nakshatra.ruler}</span>
          </div>
          <div className="text-center py-2">
            <div className="text-4xl font-bold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>{result.index + 1}</div>
            <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>Nakṣatra number (1–27)</div>
          </div>
          <div className="text-center">
            <h4 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
              <IAST>{result.nakshatra.name}</IAST>
            </h4>
            <Devanagari size="sm">{result.nakshatra.devanagari}</Devanagari>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-3" style={{ borderTop: "1px solid var(--gl-gold-hairline)" }}>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: "var(--gl-gold-accent)" }}>{result.pada}</div>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>Pāda</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: "var(--gl-gold-accent)" }}>{result.elapsed.toFixed(2)}°</div>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>Elapsed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: "var(--gl-gold-accent)" }}>{result.remaining.toFixed(2)}°</div>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: "var(--gl-gold-accent)" }}>{result.nakshatra.deity}</div>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>Deity</div>
            </div>
          </div>
          {tithiContext && (
            <div className="rounded-lg p-3 text-xs" style={{ background: "#FDF6E3", border: "1px solid var(--gl-gold-hairline)" }}>
              <span style={{ color: "var(--gl-gold-accent)", fontWeight: 700 }}>Tithi context:</span>{" "}
              <span style={{ color: "var(--gl-ink-secondary)" }}>Moon–Sun elongation {tithiContext.elongation}° → {tithiContext.paksha} pakṣa, tithi {tithiContext.displayNum}/15</span>
            </div>
          )}
        </div>
        <div className="rounded-xl p-4 flex items-center justify-center" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <NakshatraWheel highlightIndex={result.index} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Step-by-step breakdown</h4>
          <button onClick={() => setShowSteps((s) => !s)} className="text-xs font-medium" style={{ color: "var(--gl-ink-muted)" }}>{showSteps ? "Hide" : "Show"}</button>
        </div>
        {showSteps && (
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
                <div className="text-xs font-bold mb-1" style={{ color: "var(--gl-gold-accent)" }}>{s.label}</div>
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
