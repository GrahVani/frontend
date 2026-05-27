"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "#C28220";
const VERMILION = "#A23A1E";
const CRIMSON = "#8B1A1A";
const INDIGO = "#4F6FA8";
const JADE = "#2d7d46";

type Severity = "highest" | "high" | "medium";

interface InauspiciousYoga {
  name: string;
  number: number;
  severity: Severity;
  description: string;
  avoid: string[];
  mitigations: string[];
  traditionalNote: string;
}

const INAUSPICIOUS: InauspiciousYoga[] = [
  { name: "Vyatīpāta", number: 17, severity: "highest", description: "The most dangerous of all 27 yogas. Literally 'falling down' — a calamity-producing yoga.", avoid: ["All new ventures", "Marriage ceremonies", "Journeys", "House warming", "Business opening"], mitigations: ["Worship of Rudra", "Chanting of Mahāmṛtyuñjaya mantra", "Acts of charity to Brahmins"], traditionalNote: "Phaladīpikā: Vyatīpāte vidhir na kartavyaḥ — No rituals should be performed during Vyatīpāta." },
  { name: "Vaidhṛti", number: 27, severity: "highest", description: "Great obstruction. One of the two yogas that override even otherwise auspicious combinations.", avoid: ["All beginnings", "Legal proceedings", "Medical procedures", "Travels", "Investments"], mitigations: ["Worship of Dharma", "Recitation of Viṣṇu-sahasranāma", "Feeding the poor"], traditionalNote: "Vaidhṛtiṁ tyajet sarvatra — Reject Vaidhṛti in all matters." },
  { name: "Parigha", number: 19, severity: "high", description: "Iron-bar yoga. Creates obstructions, confinement, and difficulty in movement.", avoid: ["Travels and journeys", "Legal contracts", "Prison-release activities", "Opening locked endeavours"], mitigations: ["Worship of Varuṇa", "Donation of iron implements", "Recitation of Śiva-stuti"], traditionalNote: "Parighaḥ pratibandhakārī — Parigha is a maker of obstacles." },
  { name: "Śūla", number: 9, severity: "high", description: "Trident yoga. Brings pain, conflict, and sharp, pointed difficulties.", avoid: ["Medical surgeries", "Dispute resolution", "Armed forces activities", "Sharp instrument usage"], mitigations: ["Worship of Nirṛti", "Feeding of cooked food", "Wearing red garments"], traditionalNote: "Śūlaḥ śarīrakleśakaraḥ — Śūla is a producer of bodily pain." },
  { name: "Gaṇḍa", number: 10, severity: "medium", description: "Knot yoga. Creates obstacles at critical moments; delays and interruptions.", avoid: ["Beginning new courses", "Signing contracts", "Taking oaths", "Starting studies"], mitigations: ["Worship of Yama", "Charity to servants", "Avoiding anger"], traditionalNote: "Gaṇḍaḥ pratyūhahetuḥ — Gaṇḍa is a cause of obstacles." },
  { name: "Atigaṇḍa", number: 6, severity: "medium", description: "Great knot. Brings disputes, accidents, and unexpected hindrances.", avoid: ["Construction activities", "Vehicle purchases", "Competitive events", "Debates"], mitigations: ["Worship of Rudra", "Recitation of Rudra-sūkta", "Donation of red cloth"], traditionalNote: "Atigaṇḍaḥ kalahaprado — Atigaṇḍa gives rise to quarrels." },
];

const SEVERITY_META: Record<Severity, { label: string; text: string; bg: string; border: string; bar: string; desc: string }> = {
  highest: { label: "Highest Danger", text: CRIMSON, bg: "#FDE8E5", border: "#E8AFA8", bar: CRIMSON, desc: "Overrides all other auspicious conditions. Complete avoidance advised." },
  high: { label: "High Danger", text: VERMILION, bg: "#FDF0EC", border: "#E8B8A8", bar: VERMILION, desc: "Strongly inauspicious. Beginnings should be avoided if possible." },
  medium: { label: "Medium Danger", text: INDIGO, bg: "#EBF0FA", border: "#B0C4DE", bar: INDIGO, desc: "Caution advised. Not as severe but still unfavourable for new ventures." },
};

/* ─── Severity Spectrum SVG ─── */
function SeveritySpectrum({ severity }: { severity: Severity }) {
  const levels = [
    { key: "medium" as const, label: "Medium", cx: 48, color: INDIGO },
    { key: "high" as const, label: "High", cx: 160, color: VERMILION },
    { key: "highest" as const, label: "Highest", cx: 272, color: CRIMSON },
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
      {/* Outer ring */}
      <circle cx={60} cy={60} r={55} fill="url(#wmGrad)" stroke={VERMILION} strokeWidth={1.5} strokeOpacity={0.4} />
      {/* Inner spokes */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const rad = a * Math.PI / 180;
        const x1 = 60 + 25 * Math.cos(rad);
        const y1 = 60 + 25 * Math.sin(rad);
        const x2 = 60 + 50 * Math.cos(rad);
        const y2 = 60 + 50 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={VERMILION} strokeWidth={1} opacity={0.3} />;
      })}
      {/* Inner hexagon */}
      <polygon points={(() => {
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const rad = (i * 60 - 90) * Math.PI / 180;
          pts.push(`${60 + 28 * Math.cos(rad)},${60 + 28 * Math.sin(rad)}`);
        }
        return pts.join(" ");
      })()} fill="none" stroke={VERMILION} strokeWidth={1.5} opacity={0.5} />
      {/* Warning triangle */}
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
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>The 6 dangerous yogas of the 27. Know them. Avoid them. Mitigate them.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Selector grid + Severity spectrum */}
        <div className="space-y-3">
          {/* Severity Spectrum */}
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Severity Spectrum</p>
            <SeveritySpectrum severity={selectedYoga.severity} />
          </div>

          {/* Selector grid */}
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Select a Dangerous Yoga</p>
            <div className="space-y-2">
              {INAUSPICIOUS.map((yoga) => {
                const sm = SEVERITY_META[yoga.severity];
                const isActive = selectedYoga.name === yoga.name;
                return (
                  <button key={yoga.name} onClick={() => setSelectedYoga(yoga)} className="w-full text-left p-3 rounded-lg transition-all" style={{ background: isActive ? sm.bg : "transparent", border: isActive ? `2px solid ${sm.border}` : "1px solid var(--gl-gold-hairline)", cursor: "pointer" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: isActive ? sm.text : "var(--gl-ink-primary)" }}><IAST>{yoga.name}</IAST></p>
                        <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>#{yoga.number} / 27</p>
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
                <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Yoga #{selectedYoga.number} of 27</p>
              </div>
            </div>
            <p className="text-sm italic mb-3" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>{selectedYoga.description}</p>
            <p className="text-sm p-2.5 rounded-md" style={{ background: "var(--gl-card-surface-solid)", border: `1px solid ${meta.border}`, color: meta.text, fontStyle: "italic", lineHeight: 1.5 }}>{selectedYoga.traditionalNote}</p>
          </div>

          {/* Activities to avoid */}
          <div className="rounded-xl p-4" style={{ background: "#FDE8E5", border: "1.5px solid #E8AFA8" }}>
            <p className="text-xs font-bold uppercase mb-3" style={{ color: CRIMSON, letterSpacing: "0.06em" }}>Activities to Avoid</p>
            <ul className="space-y-2">
              {selectedYoga.avoid.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#E8AFA8", color: CRIMSON }}>×</span>
                  <span className="text-sm" style={{ color: CRIMSON }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mitigations */}
          <div className="rounded-xl p-4" style={{ background: "#E8F5EE", border: "1.5px solid #A8D4B8" }}>
            <p className="text-xs font-bold uppercase mb-3" style={{ color: JADE, letterSpacing: "0.06em" }}>Mitigation Measures</p>
            <ul className="space-y-2">
              {selectedYoga.mitigations.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: "#A8D4B8", color: JADE }}>OK</span>
                  <span className="text-sm" style={{ color: "var(--gl-ink-primary)" }}>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs mt-3 italic" style={{ color: "var(--gl-ink-muted)" }}>Traditional remedial measures as prescribed in Bṛhat Parāśara Horā Śāstra and Phaladīpikā. Consult a qualified jyotiṣī for personalised guidance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
