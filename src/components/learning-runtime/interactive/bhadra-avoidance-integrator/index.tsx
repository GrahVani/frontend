"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "#C28220";
const JADE = "#2d7d46";
const VERMILION = "#A23A1E";
const AMBER = "#B8860B";
const INDIGO = "#4F6FA8";

const DAYS = [
  { name: "Sunday", short: "Sun", dev: "भानुवासरः", graha: "Sūrya", symbol: "☉", color: "#B8860B" },
  { name: "Monday", short: "Mon", dev: "सोमवासरः", graha: "Soma", symbol: "☽", color: "#7A8CB8" },
  { name: "Tuesday", short: "Tue", dev: "मङ्गलवासरः", graha: "Maṅgala", symbol: "♂", color: "#C8412E" },
  { name: "Wednesday", short: "Wed", dev: "बुधवासरः", graha: "Budha", symbol: "☿", color: "#3A8C5A" },
  { name: "Thursday", short: "Thu", dev: "गुरुवासरः", graha: "Guru", symbol: "♃", color: "#E89E2A" },
  { name: "Friday", short: "Fri", dev: "शुक्रवासरः", graha: "Śukra", symbol: "♀", color: "#5A8CC8" },
  { name: "Saturday", short: "Sat", dev: "शनिवासरः", graha: "Śani", symbol: "♄", color: "#5A5A7A" },
];

const BHADRA_PERIODS: Record<string, { period: string; tithiContext: string; karanaName: string }> = {
  Sunday: { period: "2nd half of Pratipadā / 1st half of Dvitīyā", tithiContext: "Tithi 1 to 2 transition", karanaName: "Kimstughna / Bava" },
  Monday: { period: "2nd half of Saptamī / 1st half of Aṣṭamī", tithiContext: "Tithi 7 to 8 transition", karanaName: "Gara / Viṣṭi" },
  Tuesday: { period: "2nd half of Caturthī / 1st half of Pañcamī", tithiContext: "Tithi 4 to 5 transition", karanaName: "Vaṇija / Bava" },
  Wednesday: { period: "2nd half of Daśamī / 1st half of Ekādaśī", tithiContext: "Tithi 10 to 11 transition", karanaName: "Taitila / Gara" },
  Thursday: { period: "2nd half of Trayodaśī / 1st half of Caturdaśī", tithiContext: "Tithi 13 to 14 transition", karanaName: "Kaulava / Taitila" },
  Friday: { period: "2nd half of Navamī / 1st half of Daśamī", tithiContext: "Tithi 9 to 10 transition", karanaName: "Bālava / Vaṇija" },
  Saturday: { period: "2nd half of Ṣaṣṭhī / 1st half of Saptamī", tithiContext: "Tithi 6 to 7 transition", karanaName: "Bava / Bālava" },
};

const AVOID_ACTIVITIES = [
  "New ventures", "Marriage", "Travel", "Construction", "Important decisions",
  "Business opening", "Legal matters", "Foundation-laying", "Medical procedures",
];

const INAUSPICIOUS_PERIODS = [
  { name: "Bhadrā (Viṣṭi)", source: "Karaṇa-based", duration: "~6 hours", severity: "High", severityColor: AMBER, bg: "#FDF6E3", border: "#E8D5A3", avoid: "All new beginnings, marriage, travel, construction", note: "Most inauspicious karaṇa. Occurs daily in rotating tithi-halves." },
  { name: "Rāhu Kālam", source: "Vāra-based", duration: "~90 min/day", severity: "High", severityColor: VERMILION, bg: "#FDE8E5", border: "#E8AFA8", avoid: "New beginnings, travel, signing contracts", note: "Varies by weekday. Daily inauspicious window." },
  { name: "Vyatīpāta / Vaidhṛti", source: "Yoga-based", duration: "~24 hours", severity: "Highest", severityColor: "#8B1A1A", bg: "#FDE8E5", border: "#E8AFA8", avoid: "All important acts — complete avoidance", note: "Most dangerous yogas. Postpone everything if possible." },
  { name: "Riktā Tithi", source: "Tithi-based", duration: "~24 hours", severity: "Medium", severityColor: GOLD, bg: "#FDF6E3", border: "#E8D5A3", avoid: "New ventures (exceptions for worship)", note: "Sacred for Gaṇeśa, Devī, Śiva observances." },
];

const LIMB_CHECK = [
  { name: "Tithi", rule: "Avoid Riktā for new ventures", status: "check" as const },
  { name: "Vāra", rule: "Check weekday suitability", status: "check" as const },
  { name: "Nakṣatra", rule: "Check activity compatibility", status: "check" as const },
  { name: "Yoga", rule: "Avoid Vyatīpāta / Vaidhṛti", status: "check" as const },
  { name: "Karaṇa", rule: "AVOID Bhadrā (Viṣṭi)", status: "warn" as const },
];

/* ─── Compact Bhadrā Danger Clock SVG ─── */
function DangerClock({ activeDay, onSelect }: { activeDay: number; onSelect: (i: number) => void }) {
  const W = 320;
  const H = 300;
  const CX = W / 2;
  const CY = H / 2 + 4;
  const R = 100;
  const R_LABEL = 128;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "320px", margin: "0 auto", display: "block" }}>
      <defs>
        <filter id="dcShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy={2} stdDeviation={3} floodColor="#6B4423" floodOpacity="0.12" /></filter>
        <radialGradient id="dcGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF9F0" /><stop offset="100%" stopColor="#FDF6E3" /></radialGradient>
      </defs>

      {/* Background disc */}
      <circle cx={CX} cy={CY} r={R + 24} fill="url(#dcGrad)" stroke={GOLD} strokeWidth={1} strokeOpacity={0.25} filter="url(#dcShadow)" />
      <circle cx={CX} cy={CY} r={R + 8} fill="none" stroke={GOLD} strokeWidth={1} strokeDasharray="6 4" opacity={0.3} />

      {/* Connection lines from center to each day */}
      {DAYS.map((_, i) => {
        const angle = (i * (360 / 7) - 90) * Math.PI / 180;
        const x1 = CX + 28 * Math.cos(angle);
        const y1 = CY + 28 * Math.sin(angle);
        const x2 = CX + (R - 6) * Math.cos(angle);
        const y2 = CY + (R - 6) * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={0.8} opacity={0.2} />;
      })}

      {/* Day nodes */}
      {DAYS.map((day, i) => {
        const angle = (i * (360 / 7) - 90) * Math.PI / 180;
        const x = CX + R * Math.cos(angle);
        const y = CY + R * Math.sin(angle);
        const lx = CX + R_LABEL * Math.cos(angle);
        const ly = CY + R_LABEL * Math.sin(angle);
        const isActive = i === activeDay;

        return (
          <g key={day.name} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
            {/* Outer glow for active */}
            {isActive && <circle cx={x} cy={y} r={22} fill={AMBER} opacity={0.12} />}
            {/* Node circle */}
            <circle cx={x} cy={y} r={isActive ? 20 : 16} fill={isActive ? AMBER : "#FFF9F0"} stroke={isActive ? AMBER : day.color} strokeWidth={isActive ? 3 : 2} filter="url(#dcShadow)" style={{ transition: "all 0.3s ease" }} />
            {/* Planet symbol */}
            <text x={x} y={y + 5} textAnchor="middle" fill={isActive ? "#fff" : day.color} fontSize={isActive ? 16 : 12} fontWeight={800} style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif", transition: "all 0.3s ease" }}>
              {day.symbol}
            </text>
            {/* Day name label */}
            <text x={lx} y={ly + 4} textAnchor="middle" fill={isActive ? AMBER : "var(--gl-ink-secondary)"} fontSize={isActive ? 11 : 9} fontWeight={isActive ? 700 : 500} style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif", transition: "all 0.3s ease" }}>
              {day.short}
            </text>
          </g>
        );
      })}

      {/* Center warning hub */}
      <circle cx={CX} cy={CY} r={36} fill="#FDE8E5" stroke={AMBER} strokeWidth={2.5} filter="url(#dcShadow)" />
      {/* Warning triangle */}
      <polygon points={`${CX},${CY - 14} ${CX + 13},${CY + 11} ${CX - 13},${CY + 11}`} fill="none" stroke={AMBER} strokeWidth={2.5} strokeLinejoin="round" />
      <text x={CX} y={CY + 8} textAnchor="middle" fill={AMBER} fontSize={18} fontWeight={900} style={{ fontFamily: "var(--font-sans), sans-serif" }}>!</text>
      <text x={CX} y={CY + 22} textAnchor="middle" fill={AMBER} fontSize={7} fontWeight={700} style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Bhadrā</text>
    </svg>
  );
}

/* ─── 5-Limb Mandala SVG ─── */
function LimbMandala() {
  const limbs = [
    { abbr: "Ti", label: "Tithi", color: INDIGO },
    { abbr: "Vā", label: "Vāra", color: GOLD },
    { abbr: "Nk", label: "Nakṣatra", color: "#8B5FC0" },
    { abbr: "Yo", label: "Yoga", color: "#2E8B57" },
    { abbr: "Kr", label: "Karaṇa", color: AMBER },
  ];
  const W = 240;
  const H = 240;
  const CX = W / 2;
  const CY = H / 2;
  const R = 76;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "200px", display: "block", margin: "0 auto" }}>
      <circle cx={CX} cy={CY} r={R + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.3} />
      {limbs.map((limb, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = CX + R * Math.cos(angle);
        const y = CY + R * Math.sin(angle);
        return (
          <g key={limb.abbr}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.35} />
            <circle cx={x} cy={y} r={18} fill="#FFF9F0" stroke={limb.color} strokeWidth={1.5} />
            <text x={x} y={y + 4} textAnchor="middle" fill={limb.color} fontSize={10} fontWeight={800}>{limb.abbr}</text>
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r={26} fill="#FFF9F0" stroke={GOLD} strokeWidth={2} />
      <text x={CX} y={CY + 4} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={800}>Pañcāṅga</text>
    </svg>
  );
}

export function BhadraAvoidanceIntegrator() {
  const [day, setDay] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const d = DAYS[day];
  const b = BHADRA_PERIODS[d.name];

  return (
    <div className="w-full" style={{ background: "var(--gl-surface-card, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", borderRadius: "16px", padding: "20px" }} data-interactive="bhadra-avoidance-integrator">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>Bhadrā (Viṣṭi) Avoidance Integrator</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>Click any day on the danger clock to see when Bhadrā occurs. Module 03 capstone integration.</p>
      </div>

      {/* Side-by-side: Danger Clock + Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Left: Compact Danger Clock */}
        <div className="rounded-xl p-4" style={{ background: "#FFF9F0", border: "1.5px solid var(--gl-gold-hairline)" }}>
          <DangerClock activeDay={day} onSelect={setDay} />
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            {DAYS.map((dItem, i) => (
              <button
                key={dItem.name}
                onClick={() => setDay(i)}
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transition-all"
                style={{
                  background: i === day ? AMBER : "var(--gl-card-surface-solid)",
                  color: i === day ? "#fff" : dItem.color,
                  border: `1px solid ${i === day ? AMBER : "var(--gl-gold-hairline)"}`,
                  cursor: "pointer",
                }}
              >
                {dItem.short}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Day Details stacked */}
        <div className="space-y-3">
          {/* Bhadrā Summary */}
          <div className="rounded-xl p-4" style={{ background: "#FDF6E3", border: "2px solid #E8D5A3" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0" style={{ background: "#FDE8E5", color: AMBER, border: `2px solid ${AMBER}`, fontWeight: 800 }}>!</div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: AMBER }}><IAST>Bhadrā on {d.name}</IAST></h3>
                <p className="text-[10px]" style={{ color: "var(--gl-ink-secondary)" }}>{d.dev} · Ruled by {d.graha}</p>
              </div>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mb-2" style={{ background: AMBER, color: "#fff" }}>High Severity</span>
            <p className="text-xs italic" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>Bhadrā (Viṣṭi) is the most inauspicious karaṇa — associated with obstruction, delay, and difficulty. Classical texts advise against initiating any important activity during this period.</p>
          </div>

          {/* Period Details */}
          <div className="rounded-xl p-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: GOLD }}>Period Details</p>
            <div className="space-y-1 text-xs">
              <div><strong style={{ color: "var(--gl-ink-primary)" }}>When:</strong> <span style={{ color: "var(--gl-ink-secondary)" }}>{b.period}</span></div>
              <div><strong style={{ color: "var(--gl-ink-primary)" }}>Context:</strong> <span style={{ color: "var(--gl-ink-secondary)" }}>{b.tithiContext}</span></div>
              <div><strong style={{ color: "var(--gl-ink-primary)" }}>Karaṇas:</strong> <span style={{ color: "var(--gl-ink-secondary)" }}>{b.karanaName}</span></div>
            </div>
          </div>

          {/* Activities to Avoid */}
          <div className="rounded-xl p-3" style={{ background: "#FDE8E5", border: "1.5px solid #E8AFA8" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: VERMILION }}>Activities to Avoid</p>
            <div className="flex flex-wrap gap-1">
              {AVOID_ACTIVITIES.map((a, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "#E8AFA8", color: VERMILION }}>{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setShowComparison((s) => !s)} className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all" style={{ background: showComparison ? "#FDF6E3" : "var(--gl-card-surface-solid)", color: showComparison ? GOLD : "var(--gl-ink-primary)", border: `1.5px solid ${showComparison ? GOLD : "var(--gl-gold-hairline)"}`, cursor: "pointer" }}>
          {showComparison ? "Hide" : "Show"} Comparison with Other Inauspicious Periods
        </button>
        <button onClick={() => setShowWorkflow((s) => !s)} className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all" style={{ background: showWorkflow ? "#E8F5EE" : "var(--gl-card-surface-solid)", color: showWorkflow ? JADE : "var(--gl-ink-primary)", border: `1.5px solid ${showWorkflow ? JADE : "var(--gl-gold-hairline)"}`, cursor: "pointer" }}>
          {showWorkflow ? "Hide" : "Show"} 5-Limb Integration Workflow
        </button>
      </div>

      {/* Comparison Panel */}
      {showComparison && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {INAUSPICIOUS_PERIODS.map((p, i) => (
            <div key={i} className="rounded-lg p-4 space-y-2" style={{ background: p.bg, border: `1.5px solid ${p.border}` }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.severityColor }} />
                <span className="text-sm font-bold" style={{ color: p.severityColor }}>{p.name}</span>
              </div>
              <div className="text-xs space-y-1" style={{ color: "var(--gl-ink-secondary)" }}>
                <div><strong>Source:</strong> {p.source}</div>
                <div><strong>Duration:</strong> {p.duration}</div>
                <div><strong>Severity:</strong> {p.severity}</div>
                <div><strong>Avoid:</strong> {p.avoid}</div>
              </div>
              <div className="text-xs pt-2" style={{ borderTop: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-muted)" }}>{p.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* Integration Workflow */}
      {showWorkflow && (
        <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Module 03 Integrated Muhūrta Screening — 5-Limb Checklist</p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {LIMB_CHECK.map((limb, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: limb.name === "Karaṇa" ? "#FDF6E3" : "var(--gl-card-surface-solid)", border: `1.5px solid ${limb.name === "Karaṇa" ? AMBER : "var(--gl-gold-hairline)"}` }}>
                    <div className="text-xs font-bold mb-1" style={{ color: limb.name === "Karaṇa" ? AMBER : "var(--gl-ink-muted)" }}>{limb.name}</div>
                    <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{limb.rule}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: "var(--gl-ink-muted)" }}>Full practitioner muhūrta requires also checking lagna, horā, and complete pañcāṅga cross-validation.</p>
            </div>
            <div className="flex items-center justify-center"><LimbMandala /></div>
          </div>
        </div>
      )}
    </div>
  );
}
