"use client";

import { useState, useMemo } from "react";
import {
  GitBranch,
  ListChecks,
  Layers,
  AlertTriangle,
  Search,
  Trophy,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const AMBER = "#B8860B";
const SLATE = "#5A6B7D";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function toDMS(decimalDeg: number): string {
  const d = Math.floor(Math.abs(decimalDeg));
  const mFull = (Math.abs(decimalDeg) - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${m.toString().padStart(2, "0")}′${s.toString().padStart(2, "0")}″`;
}

/* ─── Decision rules data ─── */
type MethodologyKey =
  | "general-parashari"
  | "kp"
  | "lal-kitab"
  | "jaimini"
  | "raman"
  | "yukteshwar"
  | "pushya"
  | "surya-siddhanta"
  | "western-fusion";

interface DecisionRule {
  key: MethodologyKey;
  context: string;
  ayanamsha: string;
  color: string;
  rationale: string;
}

const DECISION_RULES: DecisionRule[] = [
  {
    key: "general-parashari",
    context: "General Parāśari work (any Parāśari lineage)",
    ayanamsha: "Lahiri",
    color: GOLD,
    rationale:
      "Indian government standard + cross-stream practitioner-community uptake + Parāśari-tradition default. Per Lesson 2.2.2 §4.5: three converging factors establish Lahiri as the general Parāśari default.",
  },
  {
    key: "kp",
    context: "KP work (sub-lord, CSL, Ruling Planets, horary 1-249, stellar centre)",
    ayanamsha: "Krishnamurti",
    color: INDIGO,
    rationale:
      "K.S. Krishnamurti's specification per KP Reader I–VI. The KP horary 1-249 system depends entirely on Krishnamurti-specified sub-lord boundaries. Per the modern-primary doctrine, KP methodology and Krishnamurti ayanāṁśa are operationally inseparable.",
  },
  {
    key: "lal-kitab",
    context: "Lal Kitab work (108 remedies, debt-of-ancestors, andha planets)",
    ayanamsha: "Lahiri (typically)",
    color: GOLD,
    rationale:
      "Lal Kitab regional practitioners typically use Lahiri per Indian-context default. Some regional practitioners use Pushya-pakṣa per traditional conventions.",
  },
  {
    key: "jaimini",
    context: "Jaiminī revival work (cara-rāśi-daśās, ārūḍha, cara kārakas)",
    ayanamsha: "Lahiri (typically)",
    color: GOLD,
    rationale:
      "Sanjay Rath SJC + K.N. Rao BVB Delhi lineages typically use Lahiri per Lesson 1.4.2 §4.3–4.4 + Indian-context default.",
  },
  {
    key: "raman",
    context: "Raman lineage work (B.V. Raman + Astrological Magazine tradition)",
    ayanamsha: "Raman",
    color: VERMILION,
    rationale:
      "B.V. Raman's specification. Operationally coupled to Raman-tradition methodology per Lesson 2.2.5 §4.1.",
  },
  {
    key: "yukteshwar",
    context: "Yukteshwar / SRF lineage work (Self-Realization Fellowship)",
    ayanamsha: "Yukteshwar",
    color: JADE,
    rationale:
      "Sri Yukteshwar's specification per The Holy Science (1894). Operationally coupled to Yukteshwar/SRF-tradition methodology per Lesson 2.2.5 §4.2.",
  },
  {
    key: "pushya",
    context: "Traditional Pushya-tradition work (regional Indian practitioners)",
    ayanamsha: "Pushya-pakṣa",
    color: AMBER,
    rationale:
      "Traditional Pushya-nakṣatra-anchored convention per Lesson 2.2.5 §4.3. Operationally coupled to traditional Pushya-tradition methodology.",
  },
  {
    key: "surya-siddhanta",
    context: "Scholarly classical-tradition direct-engagement work",
    ayanamsha: "Sūrya Siddhānta-derived",
    color: SLATE,
    rationale:
      "Direct Sūrya Siddhānta trepidation-model engagement per Lesson 2.2.5 §4.4. Operationally coupled to scholarly classical-tradition methodology.",
  },
  {
    key: "western-fusion",
    context: "Western-Vedic-fusion experimentalist work",
    ayanamsha: "Varies (mostly Lahiri; sometimes Tropical with transparent flagging)",
    color: "#888888",
    rationale:
      "Mostly Lahiri for standard Vedic-astrology methodology in Western-Vedic-fusion contexts. Sometimes Tropical experimentally — with transparent flagging of the experimental cross-tradition mixing nature.",
  },
];

/* ─── Reference values for verification tab ─── */
const REFERENCE_VALUES = [
  { name: "Lahiri", valueDeg: 24.3167, color: GOLD },
  { name: "Krishnamurti", valueDeg: 24.2167, color: INDIGO },
  { name: "Raman", valueDeg: 22.9167, color: VERMILION },
  { name: "Yukteshwar", valueDeg: 22.7, color: JADE },
  { name: "Pushya-pakṣa", valueDeg: 26.25, color: AMBER },
  { name: "Sūrya Siddhānta-derived", valueDeg: 24.0833, color: SLATE },
  { name: "Tropical", valueDeg: 0, color: "#888888" },
];

/* ─── Flowchart steps ─── */
const FLOWCHART_STEPS = [
  "Identify the methodology + stream + lineage context being applied.",
  "Apply the per-context decision rules (see Rules tab).",
  "Compute the ayanāṁśa for the chart's date (by-hand simplified or engine-precise).",
  "Apply the chosen ayanāṁśa to chart-data conversion (sidereal = tropical − ayanāṁśa).",
  "Conduct all analytical work using the converted sidereal positions.",
  "If doing cross-stream synthesis: repeat Steps 1–5 per stream + flag transparently.",
  "For high-precision work (boundary-case daśā, varga, KP horary): use engine-precise output.",
];

/* ─── Do-not-mix visualiser: nakṣatra boundary SVG ─── */
function BoundaryCaseSVG() {
  const W = 600;
  const H = 120;
  const stripY = 60;
  const stripH = 30;
  const startX = 40;
  const endX = W - 40;
  const totalDeg = 30;
  const pxPerDeg = (endX - startX) / totalDeg;

  // Boundaries: Aśvinī 0°–13°20′ (13.333°), Bharaṇī 13°20′–26°40′ (26.667°), Kṛttikā 26°40′–30°
  const ashviniEnd = startX + 13.3333 * pxPerDeg;
  const bharaniEnd = startX + 26.6667 * pxPerDeg;

  // Lahiri Moon at ~13°20′ (boundary), Krishnamurti at ~13°14′ (just inside Aśvinī)
  const lahiriX = startX + 13.3333 * pxPerDeg;
  const krishnamurtiX = startX + 13.2333 * pxPerDeg;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Nakṣatra strips */}
      <rect x={startX} y={stripY} width={ashviniEnd - startX} height={stripH} fill={`${GOLD}20`} stroke={GOLD} strokeWidth={1} />
      <rect x={ashviniEnd} y={stripY} width={bharaniEnd - ashviniEnd} height={stripH} fill={`${INDIGO}15`} stroke={INDIGO} strokeWidth={1} />
      <rect x={bharaniEnd} y={stripY} width={endX - bharaniEnd} height={stripH} fill={`${VERMILION}15`} stroke={VERMILION} strokeWidth={1} />

      {/* Labels */}
      <text x={(startX + ashviniEnd) / 2} y={stripY + stripH / 2 + 4} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Aśvinī (Ketu)</text>
      <text x={(ashviniEnd + bharaniEnd) / 2} y={stripY + stripH / 2 + 4} textAnchor="middle" fill={INDIGO} fontSize={11} fontWeight={600}>Bharaṇī (Venus)</text>
      <text x={(bharaniEnd + endX) / 2} y={stripY + stripH / 2 + 4} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Kṛttikā (Sun)</text>

      {/* Boundary tick */}
      <line x1={ashviniEnd} y1={stripY - 5} x2={ashviniEnd} y2={stripY + stripH + 5} stroke={INK_PRIMARY} strokeWidth={1.5} strokeDasharray="4 2" />
      <text x={ashviniEnd} y={stripY - 10} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>13°20′</text>

      {/* Markers */}
      {/* Krishnamurti marker (inside Aśvinī) */}
      <polygon points={`${krishnamurtiX},${stripY - 12} ${krishnamurtiX - 5},${stripY - 22} ${krishnamurtiX + 5},${stripY - 22}`} fill={INDIGO} />
      <text x={krishnamurtiX} y={stripY - 26} textAnchor="middle" fill={INDIGO} fontSize={10} fontWeight={600}>KP: 13°14′</text>

      {/* Lahiri marker (on boundary → Bharaṇī) */}
      <polygon points={`${lahiriX},${stripY - 12} ${lahiriX - 5},${stripY - 22} ${lahiriX + 5},${stripY - 22}`} fill={GOLD} />
      <text x={lahiriX} y={stripY - 26} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Lahiri: 13°20′</text>

      {/* Gap annotation */}
      <line x1={krishnamurtiX} y1={stripY + stripH + 18} x2={lahiriX} y2={stripY + stripH + 18} stroke={INK_MUTED} strokeWidth={1} />
      <line x1={krishnamurtiX} y1={stripY + stripH + 15} x2={krishnamurtiX} y2={stripY + stripH + 21} stroke={INK_MUTED} strokeWidth={1} />
      <line x1={lahiriX} y1={stripY + stripH + 15} x2={lahiriX} y2={stripY + stripH + 21} stroke={INK_MUTED} strokeWidth={1} />
      <text x={(krishnamurtiX + lahiriX) / 2} y={stripY + stripH + 32} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>~6′ gap</text>

      {/* Axis */}
      <line x1={startX} y1={stripY + stripH + 8} x2={endX} y2={stripY + stripH + 8} stroke={INK_MUTED} strokeWidth={1} />
      <text x={startX} y={stripY + stripH + 22} textAnchor="middle" fill={INK_MUTED} fontSize={9}>0°</text>
      <text x={endX} y={stripY + stripH + 22} textAnchor="middle" fill={INK_MUTED} fontSize={9}>30°</text>
      <text x={W / 2} y={H - 4} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontStyle="italic">Tropical Aries → sidereal positions</text>
    </svg>
  );
}

export function AyanamshaDecisionFrameworkFlowchart() {
  const [tab, setTab] = useState<
    "scenario" | "rules" | "synthesis" | "donotmix" | "verification" | "capstone"
  >("scenario");
  const [methodology, setMethodology] = useState<MethodologyKey>("general-parashari");
  const [expandedRule, setExpandedRule] = useState<number | null>(null);
  const [softwareInput, setSoftwareInput] = useState("");
  const [synthesisStep, setSynthesisStep] = useState(0);

  const decision = useMemo(() => DECISION_RULES.find((r) => r.key === methodology)!, [methodology]);

  const verificationResult = useMemo(() => {
    if (!softwareInput.trim()) return null;
    // Parse input: try decimal first, then DMS
    let inputDeg = 0;
    const decimalMatch = softwareInput.match(/^\s*(\d+(?:\.\d+)?)\s*°?\s*$/);
    if (decimalMatch) {
      inputDeg = parseFloat(decimalMatch[1]);
    } else {
      const dmsMatch = softwareInput.match(/(\d+)°\s*(\d+)′?\s*(\d+(?:\.\d+)?)?″?/);
      if (dmsMatch) {
        const d = parseInt(dmsMatch[1]);
        const m = parseInt(dmsMatch[2]);
        const s = dmsMatch[3] ? parseFloat(dmsMatch[3]) : 0;
        inputDeg = d + m / 60 + s / 3600;
      } else {
        return { match: null, error: "Enter a value like 24.32 or 24°19′" };
      }
    }

    let closest = REFERENCE_VALUES[0];
    let minDiff = Math.abs(inputDeg - closest.valueDeg);
    for (const ref of REFERENCE_VALUES) {
      const diff = Math.abs(inputDeg - ref.valueDeg);
      if (diff < minDiff) {
        minDiff = diff;
        closest = ref;
      }
    }
    return { match: closest, diff: minDiff, inputDeg };
  }, [softwareInput]);

  const tabs = [
    { key: "scenario" as const, label: "Scenario", icon: GitBranch },
    { key: "rules" as const, label: "Rules", icon: ListChecks },
    { key: "synthesis" as const, label: "Synthesis", icon: Layers },
    { key: "donotmix" as const, label: "Do-Not-Mix", icon: AlertTriangle },
    { key: "verification" as const, label: "Verify", icon: Search },
    { key: "capstone" as const, label: "Capstone", icon: Trophy },
  ];

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => {
          const active = tab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors`}
              style={{
                backgroundColor: active ? INDIGO : "var(--gl-surface-2)",
                color: active ? "#fff" : INK_SECONDARY,
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ─── Scenario tab ─── */}
      {tab === "scenario" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <label className="block text-sm font-medium mb-2" style={{ color: INK_SECONDARY }}>
              Step 1: Which methodology + stream + lineage are you applying?
            </label>
            <select
              value={methodology}
              onChange={(e) => setMethodology(e.target.value as MethodologyKey)}
              className="w-full p-2.5 rounded-md text-sm border"
              style={{
                backgroundColor: "var(--gl-surface-2)",
                borderColor: INK_MUTED,
                color: INK_PRIMARY,
              }}
            >
              {DECISION_RULES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.context}
                </option>
              ))}
            </select>
          </div>

          {/* Decision output */}
          <div
            className="p-5 rounded-lg"
            style={{
              backgroundColor: `${decision.color}10`,
              borderLeft: `4px solid ${decision.color}`,
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: decision.color }}>
              Decision Output
            </div>
            <div className="text-xl font-bold mb-1">{decision.ayanamsha}</div>
            <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              {decision.rationale}
            </p>
          </div>

          {/* 7-step flowchart */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <h4 className="font-semibold text-sm mb-3">7-Step Practitioner Decision Flowchart</h4>
            <div className="space-y-2">
              {FLOWCHART_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: INDIGO }}
                    >
                      {i + 1}
                    </span>
                    {i < FLOWCHART_STEPS.length - 1 && (
                      <div className="w-0.5 h-full min-h-[16px] mt-1" style={{ backgroundColor: `${INDIGO}40` }} />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Rules tab ─── */}
      {tab === "rules" && (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: INK_SECONDARY }}>
            Click any row to expand its full rationale. These are the per-context decision rules that operationalise the methodology-determining-ayanāṁśa principle.
          </p>
          {DECISION_RULES.map((rule, i) => {
            const isOpen = expandedRule === i;
            return (
              <div
                key={rule.key}
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "var(--gl-surface-1)",
                  borderLeft: `4px solid ${rule.color}`,
                }}
              >
                <button
                  onClick={() => setExpandedRule(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: rule.color }}
                    />
                    <span className="text-sm font-medium">{rule.context}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${rule.color}18`, color: rule.color }}
                    >
                      {rule.ayanamsha}
                    </span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-3">
                    <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                      {rule.rationale}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="p-3 rounded-lg" style={{ backgroundColor: `${GOLD}10` }}>
            <div className="flex items-center gap-2 mb-1">
              <Info size={14} style={{ color: GOLD }} />
              <span className="text-xs font-semibold" style={{ color: GOLD }}>
                Default rule
              </span>
            </div>
            <p className="text-xs" style={{ color: INK_SECONDARY }}>
              If the methodology + stream + lineage context is unclear or cross-stream: <strong>default to Lahiri</strong> — Indian government standard + most-widely-used + curriculum default.
            </p>
          </div>
        </div>
      )}

      {/* ─── Synthesis tab ─── */}
      {tab === "synthesis" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: INK_SECONDARY }}>
            A multi-lineage-fluent practitioner (trained in Parāśari + KP + Jaiminī revival) computes multiple chart versions — each with its appropriate ayanāṁśa — and flags transparently. Walk through the layers:
          </p>

          <div className="flex items-center gap-2 mb-2">
            {[0, 1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setSynthesisStep(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors`}
                style={{
                  backgroundColor: synthesisStep === s ? INDIGO : "var(--gl-surface-2)",
                  color: synthesisStep === s ? "#fff" : INK_SECONDARY,
                }}
              >
                Step {s + 1}
              </button>
            ))}
          </div>

          {synthesisStep === 0 && (
            <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: `${GOLD}10`, borderLeft: `4px solid ${GOLD}` }}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: GOLD }}>1</span>
                <span className="font-semibold text-sm">Parāśari Foundational Layer</span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${GOLD}18`, color: GOLD }}>Lahiri ayanāṁśa</span>
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>
                Compute the chart using <strong>Lahiri</strong> ayanāṁśa. Apply Parāśari predictive methodology: graha dignities, rāśi lordships, Vimśottarī daśā timing. All positions are sidereal per the Indian government standard.
              </p>
              <div className="p-2 rounded text-xs font-mono" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                Moon sidereal Capricorn 19°02′ → Śravaṇa nakṣatra (Moon-lorded) → Vimśottarī starting daśā = Moon mahā-daśā
              </div>
            </div>
          )}

          {synthesisStep === 1 && (
            <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: `${INDIGO}10`, borderLeft: `4px solid ${INDIGO}` }}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: INDIGO }}>2</span>
                <span className="font-semibold text-sm">KP CSL Methodology Cross-Reference</span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${INDIGO}18`, color: INDIGO }}>Krishnamurti ayanāṁśa</span>
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>
                Compute a <strong>separate</strong> chart using <strong>Krishnamurti</strong> ayanāṁśa. Apply KP CSL methodology: Placidus house cusps, cusp sub-lord assignments, Ruling Planets.
              </p>
              <div className="p-2 rounded text-xs font-mono" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                7th house Placidus cusp CSL = [computed via Krishnamurti-specified sub-lord boundaries] → CSL analysis indicates [predictive judgment]
              </div>
            </div>
          )}

          {synthesisStep === 2 && (
            <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: `${GOLD}10`, borderLeft: `4px solid ${GOLD}` }}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: GOLD }}>3</span>
                <span className="font-semibold text-sm">Jaiminī Revival Cross-Reference</span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${GOLD}18`, color: GOLD }}>Lahiri ayanāṁśa</span>
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>
                Compute using <strong>Lahiri</strong> ayanāṁśa (per SJC + BVB lineage default). Apply Jaiminī methodology: cara kāraka assignment, ārūḍha calculations, cara-rāśi-daśā timing.
              </p>
              <div className="p-2 rounded text-xs font-mono" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                Ātma Kāraka = [planet per Lahiri degrees] → individualised significator analysis → cara-rāśi-daśā sequence
              </div>
            </div>
          )}

          {synthesisStep === 3 && (
            <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: `${JADE}10`, borderLeft: `4px solid ${JADE}` }}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: JADE }}>4</span>
                <span className="font-semibold text-sm">Transparent Synthesis Integration</span>
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>
                Integrate findings per the analytical question. Convergent themes across layers = reinforcement. Divergent methodology outputs = distinct analytical layers. Cite each stream + ayanāṁśa explicitly.
              </p>
              <div className="p-3 rounded text-xs space-y-1.5" style={{ backgroundColor: "var(--gl-surface-2)", fontFamily: "monospace" }}>
                <div><span style={{ color: GOLD }}>●</span> Parāśari (Lahiri): Moon in Śravaṇa → Moon mahā-daśā</div>
                <div><span style={{ color: INDIGO }}>●</span> KP (Krishnamurti): 7th cusp CSL = [X] → [judgment]</div>
                <div><span style={{ color: GOLD }}>●</span> Jaiminī (Lahiri): AK = [Y] → [significator]</div>
                <div className="pt-1 border-t" style={{ borderColor: INK_MUTED }}>Synthesis: [integrated reading per multi-lineage discipline]</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Do-Not-Mix tab ─── */}
      {tab === "donotmix" && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${VERMILION}10` }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} style={{ color: VERMILION }} />
              <span className="font-semibold text-sm">The Consequence of Mixing</span>
            </div>
            <p className="text-sm" style={{ color: INK_SECONDARY }}>
              Applying KP CSL methodology against Lahiri-computed cusps produces a systematic 6-arc-minute offset error. At nakṣatra boundaries, this can shift the starting daśā lord entirely.
            </p>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <BoundaryCaseSVG />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${GOLD}10`, borderLeft: `3px solid ${GOLD}` }}>
              <div className="font-semibold text-sm mb-1" style={{ color: GOLD }}>Lahiri position</div>
              <p className="text-xs" style={{ color: INK_SECONDARY }}>
                Moon at 13°20′ Aries → <strong>Bharaṇī nakṣatra</strong> (Venus-lorded) → Vimśottarī starting daśā = <strong>Venus mahā-daśā</strong>
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${INDIGO}10`, borderLeft: `3px solid ${INDIGO}` }}>
              <div className="font-semibold text-sm mb-1" style={{ color: INDIGO }}>Krishnamurti position</div>
              <p className="text-xs" style={{ color: INK_SECONDARY }}>
                Moon at 13°14′ Aries → <strong>Aśvinī nakṣatra</strong> (Ketu-lorded) → Vimśottarī starting daśā = <strong>Ketu mahā-daśā</strong>
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: `${VERMILION}10` }}>
            <p className="text-xs" style={{ color: INK_SECONDARY }}>
              <strong>This is not a trivial difference.</strong> Venus mahā-daśā and Ketu mahā-daśā have fundamentally different predictive implications. The 6-arc-minute gap — from mixing methodologies with mismatched ayanāṁśas — produces operationally divergent results.
            </p>
          </div>
        </div>
      )}

      {/* ─── Verification tab ─── */}
      {tab === "verification" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: INK_SECONDARY }}>
            Input your software's claimed ayanāṁśa value for a current-era date. The tool compares it against known reference values to identify which convention your software is actually using.
          </p>

          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <label className="block text-sm font-medium mb-2" style={{ color: INK_SECONDARY }}>
              Software claimed ayanāṁśa value
            </label>
            <input
              type="text"
              value={softwareInput}
              onChange={(e) => setSoftwareInput(e.target.value)}
              placeholder="e.g. 24°19′ or 24.32"
              className="w-full p-2.5 rounded-md text-sm border"
              style={{
                backgroundColor: "var(--gl-surface-2)",
                borderColor: INK_MUTED,
                color: INK_PRIMARY,
              }}
            />
          </div>

          {verificationResult && (
            <div className="space-y-3">
              {verificationResult.error ? (
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${VERMILION}10` }}>
                  <div className="flex items-center gap-2">
                    <XCircle size={16} style={{ color: VERMILION }} />
                    <span className="text-sm font-medium">{verificationResult.error}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: `${verificationResult.match!.color}10`,
                      borderLeft: `4px solid ${verificationResult.match!.color}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {verificationResult.diff! < 0.25 ? (
                        <CheckCircle2 size={16} style={{ color: JADE }} />
                      ) : (
                        <AlertTriangle size={16} style={{ color: AMBER }} />
                      )}
                      <span className="font-semibold text-sm">
                        Closest match: {verificationResult.match!.name}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: INK_SECONDARY }}>
                      Your input {toDMS(verificationResult.inputDeg!)} is{" "}
                      {toDMS(verificationResult.diff!)} from the {verificationResult.match!.name} reference{" "}
                      ({toDMS(verificationResult.match!.valueDeg)}).
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${INK_MUTED}` }}>
                          <th className="text-left py-1.5 px-2">Convention</th>
                          <th className="text-left py-1.5 px-2">Reference</th>
                          <th className="text-left py-1.5 px-2">Diff from input</th>
                        </tr>
                      </thead>
                      <tbody>
                        {REFERENCE_VALUES.map((ref) => {
                          const diff = Math.abs(verificationResult.inputDeg! - ref.valueDeg);
                          const isClosest = ref.name === verificationResult.match!.name;
                          return (
                            <tr
                              key={ref.name}
                              style={{
                                borderBottom: `1px solid ${INK_MUTED}30`,
                                backgroundColor: isClosest ? `${ref.color}08` : undefined,
                              }}
                            >
                              <td className="py-1.5 px-2 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ref.color }} />
                                {ref.name}
                              </td>
                              <td className="py-1.5 px-2 font-mono">{toDMS(ref.valueDeg)}</td>
                              <td className="py-1.5 px-2 font-mono">{toDMS(diff)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: INK_MUTED }}>
              Reference values (approximate, Jan 1 2026)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1 text-xs" style={{ color: INK_SECONDARY }}>
              {REFERENCE_VALUES.map((ref) => (
                <div key={ref.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ref.color }} />
                  <span className="font-mono">{ref.name}: {toDMS(ref.valueDeg)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Capstone tab ─── */}
      {tab === "capstone" && (
        <div className="space-y-5">
          <div
            className="p-5 rounded-lg text-center"
            style={{ backgroundColor: `${GOLD}10`, border: `1px solid ${GOLD}40` }}
          >
            <Trophy size={28} style={{ color: GOLD }} className="mx-auto mb-2" />
            <div className="text-lg font-bold mb-1">Module 02 Chapter 2 — Complete</div>
            <p className="text-sm" style={{ color: INK_SECONDARY }}>
              You now have <strong>complete operational ayanāṁśa fluency</strong> across the full multi-convention landscape.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Why this is Module 02's most important lesson</h4>
            <div className="space-y-2">
              {[
                "Operational decision-making is the practitioner-level capability the curriculum aims for — comparative knowledge alone is necessary but not sufficient.",
                "The Module 02 overview hard rule depends on this lesson: 'Wrong ayanāṁśa = wrong nakṣatra = wrong starting daśā lord.'",
                "The discipline propagates through every subsequent module: Pañcāṅga (Module 03), Nakṣatras (Module 07), Vargas (Module 09), Daśā Systems (Module 10), and all Jātaka horā-skandha modules.",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} style={{ color: JADE }} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm" style={{ color: INK_SECONDARY }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Curriculum propagation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { mod: "Module 03 — Pañcāṅga", desc: "Tithi, nakṣatra, yoga, karaṇa computed per chosen ayanāṁśa" },
                { mod: "Module 07 — Nakṣatras", desc: "Nakṣatra boundaries depend on ayanāṁśa choice" },
                { mod: "Module 09 — Vargas", desc: "Divisional charts compute against sidereal rāśis per chosen ayanāṁśa" },
                { mod: "Module 10 — Daśā Systems", desc: "Most ayanāṁśa-sensitive module: Vimśottarī starting lord depends on it" },
              ].map((item) => (
                <div key={item.mod} className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: INDIGO }}>{item.mod}</div>
                  <div className="text-xs" style={{ color: INK_SECONDARY }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${JADE}10` }}>
            <p className="text-sm font-medium mb-1" style={{ color: JADE }}>
              <CheckCircle2 size={16} className="inline mr-1" />
              Chapter 2 operational decision framework: installed
            </p>
            <p className="text-xs" style={{ color: INK_SECONDARY }}>
              Next: Module 02 Chapter 3 — Yuga-Cycle Time Models
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
