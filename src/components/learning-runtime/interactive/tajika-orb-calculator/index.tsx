"use client";

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const RED = "#A8412B";
const PURPLE = "#8b5cf6";

// Classical Tājika dīptāṁśa — Tājika-Nīlakaṇṭhī.
const PLANETS: { name: string; short: string; iast: string; glyph: string; deepta: number; color: string }[] = [
  { name: "Sun",     short: "Su", iast: "Sūrya",   glyph: "☉", deepta: 15, color: "#f59e0b" },
  { name: "Moon",    short: "Mo", iast: "Candra",  glyph: "☽", deepta: 12, color: "#64748b" },
  { name: "Mars",    short: "Ma", iast: "Maṅgala", glyph: "♂", deepta: 8,  color: "#ef4444" },
  { name: "Mercury", short: "Me", iast: "Budha",   glyph: "☿", deepta: 7,  color: "#10b981" },
  { name: "Jupiter", short: "Ju", iast: "Guru",    glyph: "♃", deepta: 9,  color: "#f97316" },
  { name: "Venus",   short: "Ve", iast: "Śukra",   glyph: "♀", deepta: 7,  color: "#ec4899" },
  { name: "Saturn",  short: "Sa", iast: "Śani",    glyph: "♄", deepta: 9,  color: "#475569" },
];

const ANGLES: { deg: number; name: string; short: string }[] = [
  { deg: 0,   name: "conjunction", short: "conj" },
  { deg: 60,  name: "sextile",     short: "sext" },
  { deg: 90,  name: "square",      short: "square" },
  { deg: 120, name: "trine",       short: "trine" },
  { deg: 180, name: "opposition",  short: "opp" },
];

const PRESETS = [
  { label: "Sun–Jupiter trine",  a: 0, b: 4, sep: 120 },
  { label: "Mercury–Venus miss", a: 3, b: 5, sep: 67 },
  { label: "117° test",          a: 0, b: 2, sep: 117 },
  { label: "Exact opposition",   a: 0, b: 6, sep: 180 },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const sweep = endDeg >= startDeg ? endDeg - startDeg : endDeg + 360 - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export function TajikaOrbCalculator() {
  const [aIdx, setAIdx] = useState(0);
  const [bIdx, setBIdx] = useState(2);
  const [sep, setSep] = useState(117);

  const a = PLANETS[aIdx];
  const b = PLANETS[bIdx];
  const orb = (a.deepta + b.deepta) / 2;

  const nearest = useMemo(() => {
    return ANGLES.reduce((best, ang) => (Math.abs(sep - ang.deg) < Math.abs(sep - best.deg) ? ang : best), ANGLES[0]);
  }, [sep]);
  const gap = Math.abs(sep - nearest.deg);
  const forms = gap <= orb;

  const setPreset = (p: typeof PRESETS[number]) => {
    setAIdx(p.a);
    setBIdx(p.b);
    setSep(p.sep);
  };

  // Compact centered dial
  const size = 260, cx = size / 2, cy = size / 2, R = 102, rPlanet = 104;
  const pa = polar(cx, cy, rPlanet, 0);
  const pb = polar(cx, cy, rPlanet, sep);
  const pTarget = polar(cx, cy, rPlanet, nearest.deg);
  const orbSpan = Math.min(orb, 26);

  return (
    <div data-interactive="tajika-orb-calculator" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Tājika Orb (<IAST>Dīptāṁśa</IAST>) — Does the aspect form?
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Two grahas aspect when their degree-separation is within an orb of 0°/60°/90°/120°/180°.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        <SelectPlanet label="Graha A" idx={aIdx} set={setAIdx} />
        <SelectPlanet label="Graha B" idx={bIdx} set={setBIdx} />
        <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Sep</span>
        <input type="range" min={0} max={180} step={1} value={sep} onChange={e => setSep(Number(e.target.value))} style={{ width: "120px", accentColor: GOLD }} aria-label="angular separation" />
        <span style={{ fontSize: "14px", fontWeight: 900, color: GOLD, minWidth: "36px" }}>{sep}°</span>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => setPreset(p)} style={{ fontSize: "9px", fontWeight: 700, padding: "3px 6px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", background: "rgba(156,122,47,0.06)", color: GOLD_DEEP, cursor: "pointer" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>
        
        {/* Dial column */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Outer ring */}
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(156,122,47,0.18)" strokeWidth="2" />
            <circle cx={cx} cy={cy} r={R - 24} fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
            {/* Angle ticks */}
            {ANGLES.map(ang => {
              const outer = polar(cx, cy, R + 4, ang.deg);
              const inner = polar(cx, cy, R - 5, ang.deg);
              return <line key={ang.deg} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(156,122,47,0.35)" strokeWidth="1.5" />;
            })}
            {/* Angle labels */}
            {ANGLES.map(ang => {
              const pt = polar(cx, cy, R + 17, ang.deg);
              return <text key={`lbl-${ang.deg}`} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fontWeight: 800, fill: GOLD_DEEP }}>{ang.deg}°</text>;
            })}
            {/* Orb tolerance band */}
            <path d={arcPath(cx, cy, R - 14, nearest.deg - orbSpan, nearest.deg + orbSpan)} fill={forms ? `${GREEN}16` : `${GREEN}08`} stroke={forms ? GREEN : `${GREEN}55`} strokeWidth="1.5" />
            {/* Target exact-angle line */}
            <line x1={cx} y1={cy} x2={pTarget.x} y2={pTarget.y} stroke={forms ? GREEN : GOLD} strokeWidth="2" strokeDasharray="4 3" />
            {/* Separation arc */}
            <path d={arcPath(cx, cy, 48, 0, sep)} fill={`${PURPLE}10`} stroke={PURPLE} strokeWidth="1.2" />
            {/* Planet A marker */}
            <g>
              <circle cx={pa.x} cy={pa.y} r="15" fill="#ffffff" stroke={a.color} strokeWidth="3" />
              <text x={pa.x} y={pa.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "12px", fontWeight: 900, fill: a.color }}>{a.glyph}</text>
              <text x={pa.x} y={pa.y + 25} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: a.color }}>{a.short}</text>
            </g>
            {/* Planet B marker */}
            <g>
              <circle cx={pb.x} cy={pb.y} r="15" fill="#ffffff" stroke={b.color} strokeWidth="3" />
              <text x={pb.x} y={pb.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "12px", fontWeight: 900, fill: b.color }}>{b.glyph}</text>
              <text x={pb.x} y={pb.y + 25} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: b.color }}>{b.short}</text>
            </g>
            {/* Center hub */}
            <circle cx={cx} cy={cy} r="24" fill="#ffffff" stroke="rgba(156,122,47,0.2)" strokeWidth="1.5" />
            <text x={cx} y={cy - 3} textAnchor="middle" style={{ fontSize: "7px", fontWeight: 700, fill: INK_MUTED }}>GAP</text>
            <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, fill: forms ? GREEN : RED }}>{gap}°</text>
          </svg>
          <div style={{ fontSize: "9px", color: INK_MUTED, textAlign: "center", marginTop: "4px" }}>
            Shaded band = allowed orb ({orb}°) around exact {nearest.name} ({nearest.deg}°)
          </div>
        </div>

        {/* Readout column */}
        <div style={{ flex: "1 1 260px", minWidth: "240px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Verdict */}
          <div style={{ background: forms ? `${GREEN}10` : `${RED}08`, border: `1.2px solid ${forms ? GREEN : RED}`, borderRadius: "8px", padding: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
              <span style={{ fontSize: "14px" }}>{forms ? "✓" : "✗"}</span>
              <span style={{ fontSize: "12px", fontWeight: 800, color: forms ? GREEN : RED }}>
                {forms ? "Aspect forms" : "No aspect"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {a.name} & {b.name}: gap {gap}° from exact {nearest.name} ({nearest.deg}°), orb {orb}°. {forms ? "Gap ≤ orb." : "Gap exceeds orb."}
            </p>
          </div>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            <MiniMetric label="Orb" value={`${orb}°`} note={`${a.deepta}+${b.deepta}`} />
            <MiniMetric label="Angle" value={`${nearest.deg}°`} note={nearest.name} />
            <MiniMetric label="Gap" value={`${gap}°`} note={forms ? "inside" : "outside"} />
          </div>

          {/* Linear gauge */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginBottom: "3px" }}>
              <span>Gap vs orb</span>
              <span style={{ color: forms ? GREEN : RED, fontWeight: 800 }}>{gap}° / {orb}°</span>
            </div>
            <div style={{ height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%", background: `linear-gradient(90deg, ${GREEN}35 0%, ${GREEN}35 50%, ${RED}18 50%, ${RED}18 100%)` }} />
              <div style={{ position: "absolute", left: `${Math.min(100, (gap / Math.max(orb, gap)) * 100)}%`, top: "-2px", width: "3px", height: "12px", background: forms ? GREEN : RED, borderRadius: "1px" }} />
            </div>
          </div>

          {/* Compact Diptamsa */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px" }}>
            <h5 style={{ margin: "0 0 5px 0", fontSize: "8px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Dīptāṁśa reference</h5>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "2px" }}>
              {PLANETS.map(p => (
                <div key={p.name} style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
                  <div style={{ fontSize: "12px", color: p.color }}>{p.glyph}</div>
                  <div style={{ fontSize: "7px", color: INK_MUTED, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><IAST>{p.iast}</IAST></div>
                  <div style={{ fontSize: "8px", fontWeight: 900, color: GOLD_DEEP }}>{p.deepta}°</div>
                </div>
              ))}
            </div>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> <IAST>Tājika Nīlakaṇṭhī</IAST>. Allowed orb = (dīptāṁśa₁ + dīptāṁśa₂) ÷ 2. Angles: 0°/60°/90°/120°/180°.
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectPlanet({ label, idx, set }: { label: string; idx: number; set: (n: number) => void }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>{label}</span>
      <select value={idx} onChange={e => set(Number(e.target.value))} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700 }}>
        {PLANETS.map((p, i) => (
          <option key={p.name} value={i}>{p.glyph} {p.name} ({p.deepta}°)</option>
        ))}
      </select>
    </span>
  );
}

function MiniMetric({ label, value, note }: { label: string; value: string; note: React.ReactNode }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.1)", borderRadius: "6px", padding: "6px", textAlign: "center" }}>
      <div style={{ fontSize: "8px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: "15px", fontWeight: 900, color: GOLD }}>{value}</div>
      <div style={{ fontSize: "8px", color: INK_MUTED }}>{note}</div>
    </div>
  );
}
