"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "#C28220";
const VERMILION = "#A23A1E";
const CRIMSON = "#8B1A1A";
const INDIGO = "#4F6FA8";
const JADE = "#2d7d46";

// Lesson §4.1/§4.3 classification: the 4 core inauspicious yogas (2 of which
// are Mahādoṣas) + the 5 non-core inauspicious yogas, with differentiated
// stringency. NOT a "highest/high/medium danger" spectrum, and NO remedial
// mantra/charity system (the lesson teaches differentiated avoidance, not remedies).
type Severity = "mahadosa" | "core" | "noncore";

interface InauspiciousYoga {
  name: string;
  number: number;
  severity: Severity;
  sumRange: string;
  description: string;
  avoid: string[];
  note: string;
}

const INAUSPICIOUS: InauspiciousYoga[] = [
  // The 2 Mahādoṣas (gravest) — §4.1
  { name: "Vyatīpāta", number: 17, severity: "mahadosa", sumRange: "213°20′–226°40′", description: "Calamity / 'falling-away'. A Mahādoṣa — one of the 21 grave defects (§4.4).", avoid: ["Marriage", "All saṁskāras", "New ventures", "Journeys", "Business opening"], note: "Absolute avoidance; some traditions reject the whole day, not just the 13°20′ window. No auspicious factor overrides a Mahādoṣa." },
  { name: "Vaidhṛti", number: 27, severity: "mahadosa", sumRange: "346°40′–360°00′", description: "Disjunction / breaking. A Mahādoṣa — overrides otherwise-auspicious combinations.", avoid: ["Marriage", "All saṁskāras", "Legal proceedings", "Investments", "Travels"], note: "Absolute avoidance; some traditions reject the whole day. No auspicious factor overrides a Mahādoṣa." },
  // The 2 core (non-Mahādoṣa) — §4.1
  { name: "Parigha", number: 19, severity: "core", sumRange: "240°00′–253°20′", description: "Iron-bar / barrier — obstruction and confinement. Half-bad: only the first half is the danger.", avoid: ["Auspicious onsets during the first half (Parigha-mukha, 240°00′–246°40′)"], note: "First half = Parigha-mukha (240°00′–246°40′) is worst → avoid; second half (246°40′–253°20′) is permissible in many traditions with supporting auspicious factors. Locate the mukha window, not just the yoga." },
  { name: "Vajra", number: 15, severity: "core", sumRange: "186°40′–200°00′", description: "Thunderbolt / diamond. Inauspicious-core for gentle onset — but genuinely appropriate for sharp / transformative work.", avoid: ["Marriage", "Vidyārambha", "New business / gentle onset"], note: "Contextual: AVOID for auspicious onset, but APPROPRIATE for surgery, obstacle-removal, and dispelling-malefic rites (fitting its thunderbolt symbolism). Do not read Vajra as auspicious because the word sounds powerful — it is inauspicious-core with a contextual exception." },
  // The 5 non-core (lighter, tradition-varying) — §4.3
  { name: "Viṣkambha", number: 1, severity: "noncore", sumRange: "0°00′–13°20′", description: "Obstacle / support / pillar. Generally inauspicious, lighter stringency.", avoid: ["Important onsets (lighter discipline)"], note: "Non-core — usable for non-high-stakes work with auspicious compensation; avoid for marriage and major saṁskāras. Often 'worst at the start'." },
  { name: "Atigaṇḍa", number: 6, severity: "noncore", sumRange: "66°40′–80°00′", description: "Great obstacle. Generally inauspicious, lighter stringency.", avoid: ["Important onsets (lighter discipline)"], note: "Non-core; the obstacle-named yogas (Atigaṇḍa, Gaṇḍa) can suit obstacle-overcoming / Gaṇeśa contexts. Avoid for marriage and major saṁskāras." },
  { name: "Śūla", number: 9, severity: "noncore", sumRange: "106°40′–120°00′", description: "Spear / sharp-pain / piercing. Generally inauspicious, lighter stringency.", avoid: ["Important onsets (lighter discipline)"], note: "Non-core — 'worst at the start' rule; avoid for marriage and major saṁskāras." },
  { name: "Gaṇḍa", number: 10, severity: "noncore", sumRange: "120°00′–133°20′", description: "Obstacle / knot. Generally inauspicious, lighter stringency.", avoid: ["Important onsets (lighter discipline)"], note: "Non-core; can suit obstacle-overcoming / Gaṇeśa contexts. Avoid for marriage and major saṁskāras." },
  { name: "Vyāghāta", number: 13, severity: "noncore", sumRange: "160°00′–173°20′", description: "Obstruction / striking / interruption. Generally inauspicious, lighter stringency.", avoid: ["Important onsets (lighter discipline)"], note: "Non-core — avoid for marriage and major saṁskāras; usable for lower-stakes work with auspicious compensation." },
];

const SEVERITY_META: Record<Severity, { label: string; text: string; bg: string; border: string; desc: string }> = {
  mahadosa: { label: "Mahādoṣa", text: CRIMSON, bg: "#FDE8E5", border: "#E8AFA8", desc: "One of the 21 Mahādoṣas — the gravest defect. Absolute avoidance; no auspicious factor overrides it." },
  core: { label: "Core inauspicious", text: VERMILION, bg: "#FDF0EC", border: "#E8B8A8", desc: "A core inauspicious yoga with a contextual rule (Parigha-mukha half; Vajra's sharp-action exception)." },
  noncore: { label: "Non-core", text: INDIGO, bg: "#EBF0FA", border: "#B0C4DE", desc: "Generally avoided for important onsets, but with lighter, tradition-varying stringency." },
};

/* ─── Severity Spectrum SVG ─── */
function SeveritySpectrum({ severity }: { severity: Severity }) {
  const levels = [
    { key: "noncore" as const, label: "Non-core", cx: 48, color: INDIGO },
    { key: "core" as const, label: "Core", cx: 160, color: VERMILION },
    { key: "mahadosa" as const, label: "Mahādoṣa", cx: 272, color: CRIMSON },
  ];

  return (
    <svg viewBox="0 0 320 56" className="w-full h-auto" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
      <rect x={16} y={20} width={288} height={16} rx={8} fill="#F0F1F5" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} />
      {levels.map((lvl) => {
        const active = severity === lvl.key;
        const fillColor = active ? lvl.color : "#D8D8D8";
        const textColor = active ? lvl.color : "var(--gl-ink-muted)";
        const r = active ? 12 : 8;
        const sw = active ? 2 : 0;
        const fw = active ? 700 : 500;
        return (
          <g key={lvl.key}>
            <circle cx={lvl.cx} cy={28} r={r} fill={fillColor} stroke={active ? "#FFF" : "none"} strokeWidth={sw} />
            <text x={lvl.cx} y={52} textAnchor="middle" fill={textColor} fontSize={10} fontWeight={fw}>{lvl.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Warning Mandala SVG ─── */
function WarningMandala() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto" style={{ maxWidth: 100, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="wmGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FDE8E5" /><stop offset="100%" stopColor="#FDF0EC" /></radialGradient>
      </defs>
      <circle cx={60} cy={60} r={55} fill="url(#wmGrad)" stroke={VERMILION} strokeWidth={1.5} strokeOpacity={0.4} />
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const rad = a * Math.PI / 180;
        const x1 = 60 + 25 * Math.cos(rad);
        const y1 = 60 + 25 * Math.sin(rad);
        const x2 = 60 + 50 * Math.cos(rad);
        const y2 = 60 + 50 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={VERMILION} strokeWidth={1} opacity={0.3} />;
      })}
      <polygon points={(() => {
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const rad = (i * 60 - 90) * Math.PI / 180;
          pts.push(`${60 + 28 * Math.cos(rad)},${60 + 28 * Math.sin(rad)}`);
        }
        return pts.join(" ");
      })()} fill="none" stroke={VERMILION} strokeWidth={1.5} opacity={0.5} />
      <polygon points="60,22 90,72 30,72" fill="none" stroke={CRIMSON} strokeWidth={2} />
      <text x={60} y={64} textAnchor="middle" fill={CRIMSON} fontSize={20} fontWeight={800}>!</text>
      <circle cx={60} cy={60} r={12} fill="none" stroke={CRIMSON} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.5} />
    </svg>
  );
}

export function InauspiciousYogaAvoidanceCalculator() {
  const [selectedYoga, setSelectedYoga] = useState<InauspiciousYoga>(INAUSPICIOUS[0]);

  const meta = SEVERITY_META[selectedYoga.severity];

  return (
    <div
      className="w-full"
      style={{ background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "20px" }}
      data-interactive="inauspicious-yoga-avoidance-calculator"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>Inauspicious Yoga Avoidance Guide</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>The 9 inauspicious time-yogas — 2 Mahādoṣas, 2 core, 5 non-core — handled by differentiated stringency.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Selector grid + Severity spectrum */}
        <div className="space-y-3">
          {/* Severity Spectrum */}
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Stringency Tier</p>
            <SeveritySpectrum severity={selectedYoga.severity} />
          </div>

          {/* Selector grid */}
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Select an Inauspicious Yoga</p>
            <div className="space-y-2">
              {INAUSPICIOUS.map((yoga) => {
                const sm = SEVERITY_META[yoga.severity];
                const isActive = selectedYoga.name === yoga.name;
                return (
                  <button key={yoga.name} onClick={() => setSelectedYoga(yoga)} className="w-full text-left p-3 rounded-lg transition-all" style={{ background: isActive ? sm.bg : "transparent", border: isActive ? `2px solid ${sm.border}` : "1px solid var(--gl-gold-hairline)", cursor: "pointer" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: isActive ? sm.text : "var(--gl-ink-primary)" }}><IAST>{yoga.name}</IAST></p>
                        <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>#{yoga.number} / 27 · {yoga.sumRange}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: sm.bg, color: sm.text, border: `1px solid ${sm.border}` }}>{sm.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="space-y-3">
          {/* Header */}
          <div className="rounded-xl p-4" style={{ background: meta.bg, border: `2px solid ${meta.border}` }}>
            <div className="flex items-center gap-4 mb-3">
              <WarningMandala />
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase" style={{ background: meta.bg, color: meta.text, border: `1px solid ${meta.border}` }}>{meta.label}</span>
                <h3 className="text-2xl mt-1" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, color: meta.text }}><IAST>{selectedYoga.name}</IAST></h3>
                <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Yoga #{selectedYoga.number} of 27 · Sun+Moon sum {selectedYoga.sumRange}</p>
              </div>
            </div>
            <p className="text-sm italic mb-3" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>{selectedYoga.description}</p>
            <p className="text-xs p-2.5 rounded-md" style={{ background: "var(--gl-card-surface-solid)", border: `1px solid ${meta.border}`, color: meta.text, lineHeight: 1.5 }}>{meta.desc}</p>
          </div>

          {/* Activities to avoid */}
          <div className="rounded-xl p-4" style={{ background: "#FDE8E5", border: "1.5px solid #E8AFA8" }}>
            <p className="text-xs font-bold uppercase mb-3" style={{ color: CRIMSON, letterSpacing: "0.06em" }}>Avoid For</p>
            <ul className="space-y-2">
              {selectedYoga.avoid.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#E8AFA8", color: CRIMSON }}>×</span>
                  <span className="text-sm" style={{ color: CRIMSON }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Usage & nuance (lesson §4.1/§4.3 — differentiated discipline, NOT remedies) */}
          <div className="rounded-xl p-4" style={{ background: "#E8F5EE", border: "1.5px solid #A8D4B8" }}>
            <p className="text-xs font-bold uppercase mb-2" style={{ color: JADE, letterSpacing: "0.06em" }}>Stringency &amp; Nuance</p>
            <p className="text-sm" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>{selectedYoga.note}</p>
            <p className="text-xs mt-3 italic" style={{ color: "var(--gl-ink-muted)" }}>Recognition-layer screening only. A full client-facing election needs Module 23&apos;s complete 21-Mahādoṣa system plus lagna, planetary strength, and chart compatibility.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
