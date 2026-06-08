"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Scale, GraduationCap, Info } from "lucide-react";

const GOLD = "#C28220";
const JADE = "#2F8C5A";
const INDIGO = "#4A6FA5";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

/* ─── Yuga segment colors ─── */
const SATYA = "#C28220";
const TRETA = "#D4A45A";
const DVAPARA = "#D9B896";
const KALI = "#8B7355";
const ASC_DVAPARA = "#2F8C5A";
const ASC_TRETA = "#5AA87A";
const ASC_SATYA = "#8EC4A0";

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
    totalCycle: "4.32 million years",
    scope: "Operational for traditional muhūrta saṅkalpa + saṁhitā cycle computations",
    detail:
      "The traditional Vedic position grounds yuga-cycle dating in classical astronomical computation. Sūrya Siddhānta Madhyamādhikāra 1.15–19 provides the mathematical structure; Aryabhaṭa's work refines the computational parameters. The start of Kali Yuga at ~3102 BCE is derived from backward projection of planetary positions recorded in classical texts.",
  },
  {
    key: "yukteshwar",
    label: "Yukteshwar / SRF",
    devanagari: "युक्तेश्वर / एसआरएफ",
    color: JADE,
    icon: Scale,
    anchors: "The Holy Science (1894)",
    currentYuga: "Ascending Dvāpara",
    startDate: "Kali ended 1700 CE",
    durations: "Satya 4,800 / Tretā 3,600 / Dvāpara 2,400 / Kali 1,200 years",
    totalCycle: "24,000 years",
    scope: "Used by Self-Realization Fellowship lineage + related Western-Vedic-fusion practitioners",
    detail:
      "Sri Yukteshwar Giri's The Holy Science (1894) proposes a 24,000-year total cycle with each yuga lasting approximately 2,400 years (Kali). Per this framework, Kali Yuga ended in 1700 CE and we entered an ascending Dvāpara Yuga. The 180× scale difference from the traditional framework creates dramatically different present-epoch placement.",
  },
  {
    key: "academic",
    label: "Academic-Indology",
    devanagari: "शैक्षिक-भारतीयविद्या",
    color: INDIGO,
    icon: GraduationCap,
    anchors: "Pingree (1981) + Plofker (2009) + Witzel (1995)",
    currentYuga: "Analytical — no endorsement",
    startDate: "3102 BCE as computationally-derived epoch",
    durations: "Studies all frameworks as textual-cultural constructs",
    totalCycle: "Varies per text",
    scope: "Scholarly research + historical-textual analysis; not an operational practice framework",
    detail:
      "The academic-Indology position approaches the yuga-cycle through textual-historical and philological analysis. It traces framework development across texts, notes variations between Purāṇic accountings, and examines computational evolution. It does not endorse any single dating as empirically verified historical chronology.",
  },
];

const DIAL_FEEDBACK = [
  {
    max: 24,
    label: "Single-position supremacism",
    tone: "#A23A1E",
    feedback:
      "This stance collapses the comparison into one winner and treats the other frameworks as errors. That is not the lesson's discipline.",
  },
  {
    max: 49,
    label: "Partial recognition",
    tone: "#C28220",
    feedback:
      "This stance notices that multiple frameworks exist, but still tries to rank one as universally normative across all contexts.",
  },
  {
    max: 74,
    label: "Context-aware engagement",
    tone: "#4A6FA5",
    feedback:
      "This stance begins to ask the right question: which framework is operationally appropriate for this lineage, ritual, or scholarly context?",
  },
  {
    max: 100,
    label: "Honest pluralistic engagement",
    tone: "#2F8C5A",
    feedback:
      "This is the target skill: hold Traditional, Yukteshwar, and Academic-Indology positions without forcing one register to govern all others.",
  },
];

function getDialFeedback(value: number) {
  return DIAL_FEEDBACK.find((item) => value <= item.max) ?? DIAL_FEEDBACK[DIAL_FEEDBACK.length - 1];
}

/* ─── SVG Timeline ─── */
function YugaTimelineSVG() {
  const W = 640;
  const H = 260;
  const barY = [55, 125, 195];
  const barW = 520;
  const barX = 80;
  const barH = 28;

  // Traditional bar: Satya(4) + Tretā(3) + Dvāpara(2) + Kali(1) = 10 parts
  const tradParts = [
    { label: "Satya", w: (4 / 10) * barW, color: SATYA },
    { label: "Tretā", w: (3 / 10) * barW, color: TRETA },
    { label: "Dvāpara", w: (2 / 10) * barW, color: DVAPARA },
    { label: "Kali", w: (1 / 10) * barW, color: KALI },
  ];

  // Yukteshwar bar: Satya(4) + Tretā(3) + Dvāpara(2) + Kali(1) + Asc.Dvāpara(2) + Asc.Tretā(3) + Asc.Satya(4) = 19 parts
  // NOW is early in Asc.Dvāpara (after Kali ended 1700 CE)
  const yukParts = [
    { label: "Satya", w: (4 / 19) * barW, color: SATYA },
    { label: "Tretā", w: (3 / 19) * barW, color: TRETA },
    { label: "Dvāpara", w: (2 / 19) * barW, color: DVAPARA },
    { label: "Kali", w: (1 / 19) * barW, color: KALI },
    { label: "Asc.Dvāpara", w: (2 / 19) * barW, color: ASC_DVAPARA },
    { label: "Asc.Tretā", w: (3 / 19) * barW, color: ASC_TRETA },
    { label: "Asc.Satya", w: (4 / 19) * barW, color: ASC_SATYA },
  ];

  // NOW positions (x offset from barX)
  const nowTrad = barX + (4 / 10) * barW + 4; // early in Kali
  const nowYuk = barX + (10 / 19) * barW + 8; // early in ascending Dvāpara

  function renderBar(
    y: number,
    parts: { label: string; w: number; color: string }[],
    nowX: number | null,
    label: string,
    labelColor: string
  ) {
    let cx = barX;
    return (
      <g>
        {/* Label */}
        <text x={10} y={y + barH / 2 + 4} fill={labelColor} fontSize={11} fontWeight={600}>
          {label}
        </text>
        {/* Segments */}
        {parts.map((p, i) => {
          const x = cx;
          cx += p.w;
          return (
            <g key={i}>
              <rect x={x} y={y} width={p.w - 1} height={barH} rx={3} fill={p.color} opacity={0.7} />
              {p.w > 35 && (
                <text x={x + p.w / 2} y={y + barH / 2 + 4} textAnchor="middle" fill="#fff" fontSize={8} fontWeight={600}>
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
        {/* NOW marker */}
        {nowX !== null && (
          <g>
            <line x1={nowX} y1={y - 8} x2={nowX} y2={y + barH + 8} stroke="#A23A1E" strokeWidth={2} strokeDasharray="4 2" />
            <polygon points={`${nowX - 5},${y - 8} ${nowX + 5},${y - 8} ${nowX},${y - 3}`} fill="#A23A1E" />
            <text x={nowX} y={y - 12} textAnchor="middle" fill="#A23A1E" fontSize={9} fontWeight={700}>
              NOW
            </text>
          </g>
        )}
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Title */}
      <text x={W / 2} y={18} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>
        Where each position places &quot;now&quot; on the yuga cycle
      </text>

      {/* Traditional */}
      {renderBar(barY[0], tradParts, nowTrad, "Traditional", GOLD)}
      <text x={barX} y={barY[0] + barH + 14} fill={INK_MUTED} fontSize={9}>
        Cycle: 4.32M years · NOW is ~1.2% into Kali
      </text>

      {/* Yukteshwar */}
      {renderBar(barY[1], yukParts, nowYuk, "Yukteshwar", JADE)}
      <text x={barX} y={barY[1] + barH + 14} fill={INK_MUTED} fontSize={9}>
        Cycle: 24,000 years · NOW is in ascending Dvāpara
      </text>

      {/* Academic */}
      <text x={10} y={barY[2] + barH / 2 + 4} fill={INDIGO} fontSize={11} fontWeight={600}>
        Academic
      </text>
      <rect x={barX} y={barY[2]} width={barW} height={barH} rx={3} fill={`${INDIGO}12`} stroke={`${INDIGO}30`} strokeWidth={1} />
      <text x={barX + barW / 2} y={barY[2] + barH / 2 + 4} textAnchor="middle" fill={INDIGO} fontSize={10} fontWeight={500}>
        3102 BCE treated as computationally-derived epoch · studied as textual construct
      </text>
      <text x={barX} y={barY[2] + barH + 14} fill={INK_MUTED} fontSize={9}>
        No single chronological endorsement · analytical position
      </text>
    </svg>
  );
}

export function TraditionalVsAcademicDatingComparator() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dialValue, setDialValue] = useState(85);
  const dial = getDialFeedback(dialValue);

  return (
    <div className="w-full" data-interactive="traditional-vs-academic-dating-comparator" style={{ color: INK_PRIMARY }}>
      {/* Position cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {POSITIONS.map((pos) => {
          const Icon = pos.icon;
          const isOpen = expanded === pos.key;
          return (
            <motion.button
              key={pos.key}
              onClick={() => setExpanded(isOpen ? null : pos.key)}
              className="text-left gl-surface-twilight-glass p-4 rounded-lg transition-all"
              style={{
                borderTop: `3px solid ${isOpen ? pos.color : `${pos.color}50`}`,
                backgroundColor: isOpen ? `${pos.color}06` : undefined,
              }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} style={{ color: pos.color }} />
                <span className="font-semibold text-sm" style={{ color: isOpen ? pos.color : INK_PRIMARY }}>
                  {pos.label}
                </span>
              </div>
              <div className="text-xs mb-2" style={{ color: INK_MUTED }}>{pos.devanagari}</div>

              <div className="text-xs grid grid-cols-1 gap-1">
                <div className="flex justify-between">
                  <span style={{ color: INK_MUTED }}>Current yuga:</span>
                  <span className="font-medium">{pos.currentYuga}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: INK_MUTED }}>Start / epoch:</span>
                  <span className="font-medium">{pos.startDate}</span>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 mt-2 space-y-2 border-t" style={{ borderColor: `${INK_MUTED}25` }}>
                      <div className="text-xs">
                        <span style={{ color: INK_MUTED }}>Durations: </span>
                        <span>{pos.durations}</span>
                      </div>
                      <div className="text-xs">
                        <span style={{ color: INK_MUTED }}>Scope: </span>
                        <span>{pos.scope}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                        {pos.detail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* SVG Timeline — the centerpiece */}
      <div className="gl-surface-twilight-glass p-5 mb-5">
        <YugaTimelineSVG />
      </div>

      {/* Comparison table */}
      <div className="gl-surface-twilight-glass p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
          Side-by-side comparison
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${INK_MUTED}30` }}>
                <th className="text-left py-2 px-2 text-xs font-semibold" style={{ color: INK_MUTED }}>Dimension</th>
                {POSITIONS.map((p) => (
                  <th key={p.key} className="text-left py-2 px-2 text-xs font-semibold" style={{ color: p.color }}>
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { dim: "Current yuga", vals: ["Kali", "Ascending Dvāpara", "Analytical — no endorsement"] },
                { dim: "Kali start date", vals: ["~3102 BCE", "Ended 1700 CE", "Computational epoch"] },
                { dim: "Kali duration", vals: ["432,000 years", "~1,200 years", "Studied as textual construct"] },
                { dim: "Total cycle", vals: ["4.32M years", "24,000 years", "Varies per text"] },
                { dim: "Primary use", vals: ["Muhūrta + saṁhitā", "SRF lineage practice", "Scholarly analysis"] },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${INK_MUTED}15` }}>
                  <td className="py-2 px-2 font-medium text-xs">{row.dim}</td>
                  {row.vals.map((v, j) => (
                    <td key={j} className="py-2 px-2 text-xs" style={{ color: INK_SECONDARY }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Honesty dial */}
      <div className="gl-surface-twilight-glass p-5 mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: INK_MUTED }}>
              Synthesis honesty dial
            </div>
            <div className="text-base font-semibold" style={{ color: dial.tone }}>
              {dial.label}
            </div>
          </div>
          <div className="text-sm font-semibold tabular-nums" style={{ color: INK_SECONDARY }}>
            {dialValue}/100
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={dialValue}
          onChange={(event) => setDialValue(Number(event.target.value))}
          aria-label="Synthesis honesty dial"
          className="mt-4 w-full"
          style={{ accentColor: dial.tone }}
        />
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4" style={{ color: INK_MUTED }}>
          <span>Supremacist</span>
          <span>Partial</span>
          <span>Context-aware</span>
          <span className="text-right sm:text-left">Pluralistic</span>
        </div>
        <p className="mt-3 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          {dial.feedback}
        </p>
      </div>

      {/* Footer note */}
      <div className="gl-surface-twilight-glass p-4 flex items-start gap-3">
        <Info size={16} style={{ color: INK_MUTED }} className="mt-0.5 flex-shrink-0" />
        <p className="text-sm" style={{ color: INK_SECONDARY }}>
          The curriculum does not ask you to &quot;pick the correct position.&quot; It asks you to understand each position on its own terms, recognise their operational contexts, and engage them honestly — following the same multi-ayanāṁśa honesty discipline from Lesson 2.2.5.
        </p>
      </div>
    </div>
  );
}
