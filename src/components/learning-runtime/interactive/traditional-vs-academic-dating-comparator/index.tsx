"use client";

import { useState } from "react";
import { BookOpen, Scale, GraduationCap, ChevronDown, ChevronUp, Info } from "lucide-react";

const GOLD = "#C28220";
const JADE = "#2F8C5A";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const POSITIONS = [
  {
    key: "traditional",
    label: "Traditional Vedic",
    devanagari: "पारम्परिक वैदिक",
    color: GOLD,
    icon: BookOpen,
    anchors: "Sūrya Siddhānta + Aryabhaṭīya",
    currentYuga: "Kali Yuga",
    startDate: "~3102 BCE",
    durations: "Satya 1.728M / Tretā 1.296M / Dvāpara 864K / Kali 432K years",
    scope: "Operational for traditional muhūrta saṅkalpa + saṁhitā cycle computations",
    detail:
      "The traditional Vedic position grounds yuga-cycle dating in classical astronomical computation. Sūrya Siddhānta Madhyamādhikāra 1.15–19 provides the mathematical structure; Aryabhaṭa's work refines the computational parameters. The start of Kali Yuga at ~3102 BCE is derived from backward projection of planetary positions recorded in classical texts. This position is operationally required for saṅkalpa formula construction and certain saṁhitā-tradition computations.",
  },
  {
    key: "yukteshwar",
    label: "Yukteshwar / SRF",
    devanagari: "युक्तेश्वर / एसआरएफ",
    color: JADE,
    icon: Scale,
    anchors: "The Holy Science (1894)",
    currentYuga: "Ascending Dvāpara Yuga",
    startDate: "Dvāpara began 1699 CE",
    durations: "Satya 4,800 / Tretā 3,600 / Dvāpara 2,400 / Kali 1,200 years (24,000-year cycle)",
    scope: "Used by Self-Realization Fellowship lineage + related Western-Vedic-fusion practitioners",
    detail:
      "Sri Yukteshwar Giri's The Holy Science (1894) proposes a radically different yuga framework: a 24,000-year total cycle (not 4.32 million), with each yuga lasting approximately 2,400 years. Per this framework, Kali Yuga ended in 1699 CE and we entered an ascending Dvāpara Yuga. The framework derives from Yukteshwar's astronomical-spiritual synthesis and is operationally used within the SRF lineage. The 180× scale difference from the traditional framework creates dramatically different present-epoch placement.",
  },
  {
    key: "academic",
    label: "Academic-Indology",
    devanagari: "शैक्षिक-भारतीयविद्या",
    color: INDIGO,
    icon: GraduationCap,
    anchors: "Pingree (1981) + Plofker (2009) + Witzel (1995)",
    currentYuga: "Analytical position — no single dating endorsed",
    startDate: "Treats 3102 BCE as computationally-derived epoch, not empirical historical date",
    durations: "Studies all frameworks as textual-cultural constructs with historical stratification",
    scope: "Scholarly research + historical-textual analysis; not an operational practice framework",
    detail:
      "The academic-Indology position (represented by David Pingree, Kim Plofker, Michael Witzel, and others) approaches the yuga-cycle through textual-historical and philological analysis. It traces how the framework developed across texts, notes variations between Purāṇic accountings, and examines the computational evolution from early to classical Indian astronomy. It does not endorse any single dating as empirically verified historical chronology. The 3102 BCE date is treated as a computationally-derived epoch within the classical tradition, not as an archaeologically attested historical event.",
  },
];

const DIAL_FEEDBACK = [
  { min: 0, max: 20, label: "Single-position supremacist", color: VERMILION, text: "You are leaning toward declaring one position 'correct' and dismissing others. The curriculum teaches honest pluralistic engagement — each position is valid within its own framework." },
  { min: 21, max: 40, label: "Strong preference", color: `${VERMILION}aa`, text: "You have a strong preference for one position. While having a primary framework is natural, be careful not to dismiss other positions without understanding them on their own terms." },
  { min: 41, max: 60, label: "Honest engagement", color: GOLD, text: "You are in the honest engagement zone — recognizing multiple valid positions while maintaining analytical clarity. This is the curriculum's target stance." },
  { min: 61, max: 80, label: "Open pluralism", color: `${JADE}aa`, text: "You are highly open to multiple positions. Stay grounded — the curriculum does not advocate collapsing all distinctions into undifferentiated relativism." },
  { min: 81, max: 100, label: "Collapsing relativism", color: JADE, text: "You are leaning toward treating all positions as interchangeable 'opinions.' The curriculum teaches that positions have real differences and operational consequences — engage them honestly, not indiscriminately." },
];

export function TraditionalVsAcademicDatingComparator() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dialValue, setDialValue] = useState(50);

  const feedback = DIAL_FEEDBACK.find((f) => dialValue >= f.min && dialValue <= f.max)!;

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Position cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {POSITIONS.map((pos) => {
          const Icon = pos.icon;
          const isOpen = expanded === pos.key;
          return (
            <div
              key={pos.key}
              className="rounded-lg overflow-hidden"
              style={{
                backgroundColor: "var(--gl-surface-1)",
                borderTop: `4px solid ${pos.color}`,
              }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : pos.key)}
                className="w-full p-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color: pos.color }} />
                    <span className="font-semibold text-sm">{pos.label}</span>
                  </div>
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                <div className="text-xs mt-0.5" style={{ color: INK_MUTED }}>
                  {pos.devanagari}
                </div>
              </button>

              <div className="px-3 pb-3 space-y-2">
                <div className="text-xs grid grid-cols-1 gap-1">
                  <div className="flex justify-between">
                    <span style={{ color: INK_MUTED }}>Current yuga:</span>
                    <span className="font-medium">{pos.currentYuga}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: INK_MUTED }}>Start / epoch:</span>
                    <span className="font-medium">{pos.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: INK_MUTED }}>Primary anchors:</span>
                    <span className="font-medium">{pos.anchors}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="pt-2 space-y-2 border-t" style={{ borderColor: `${INK_MUTED}30` }}>
                    <div className="text-xs">
                      <span style={{ color: INK_MUTED }}>Durations: </span>
                      <span>{pos.durations}</span>
                    </div>
                    <div className="text-xs">
                      <span style={{ color: INK_MUTED }}>Operational scope: </span>
                      <span>{pos.scope}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                      {pos.detail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${INK_MUTED}` }}>
              <th className="text-left py-2 px-2 font-semibold">Dimension</th>
              {POSITIONS.map((p) => (
                <th key={p.key} className="text-left py-2 px-2 font-semibold" style={{ color: p.color }}>
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { dim: "Current yuga", vals: ["Kali", "Dvāpara (ascending)", "Analytical — no endorsement"] },
              { dim: "Kali start date", vals: ["~3102 BCE", "Ended 1699 CE", "Computational epoch"] },
              { dim: "Kali duration", vals: ["432,000 years", "~1,200 years", "Studied as textual construct"] },
              { dim: "Total cycle", vals: ["4.32M years", "24,000 years", "Varies per text"] },
              { dim: "Primary use", vals: ["Muhūrta + saṁhitā", "SRF lineage practice", "Scholarly analysis"] },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${INK_MUTED}20` }}>
                <td className="py-2 px-2 font-medium">{row.dim}</td>
                {row.vals.map((v, j) => (
                  <td key={j} className="py-2 px-2" style={{ color: INK_SECONDARY }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Synthesis honesty dial */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Scale size={16} style={{ color: INDIGO }} />
          <span className="font-semibold text-sm">Synthesis Honesty Dial</span>
        </div>
        <p className="text-xs mb-3" style={{ color: INK_SECONDARY }}>
          Slide to indicate where you naturally fall when engaging multiple positions. This is a self-awareness tool, not a test.
        </p>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-medium" style={{ color: VERMILION }}>Supremacist</span>
          <input
            type="range"
            min={0}
            max={100}
            value={dialValue}
            onChange={(e) => setDialValue(parseInt(e.target.value))}
            className="flex-1 accent-[#4A6FA5]"
          />
          <span className="text-xs font-medium" style={{ color: JADE }}>Relativist</span>
        </div>

        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${feedback.color}15`, borderLeft: `3px solid ${feedback.color}` }}
        >
          <div className="text-xs font-semibold mb-1" style={{ color: feedback.color }}>
            {feedback.label} ({dialValue}%)
          </div>
          <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            {feedback.text}
          </p>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs mt-3" style={{ color: INK_MUTED }}>
        <Info size={12} className="inline mr-1" />
        The curriculum does not ask you to "pick the correct position." It asks you to understand each position on its own terms, recognise their operational contexts, and engage them honestly — following the same multi-ayanāṁśa honesty discipline from Lesson 2.2.6.
      </p>
    </div>
  );
}
