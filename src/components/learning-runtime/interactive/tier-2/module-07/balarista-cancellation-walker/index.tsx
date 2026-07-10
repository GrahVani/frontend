"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Info,
  ListChecks,
  RotateCcw,
  Scale,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";

type CheckValue = "yes" | "partial" | "no" | "na";
type ConfigKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface CancellationCondition {
  id: number;
  label: string;
  note?: string;
}

interface Configuration {
  id: ConfigKey;
  title: string;
  description: string;
}

const CONFIGURATIONS: Configuration[] = [
  {
    id: 1,
    title: "Moon in a dusthāna, afflicted",
    description: "Moon in the 6th, 8th, or 12th, afflicted by malefics; stronger if lagna is also weak.",
  },
  {
    id: 2,
    title: "Waning Moon in the 12th, malefics in 1st and 8th",
    description: "Waning Moon in 12th, malefics in 1st and 8th, kendras devoid of benefic influence.",
  },
  {
    id: 3,
    title: "Lagna, 7th, and Moon-sign all malefic-occupied",
    description: "The lagna, 7th, and Moon-sign occupied by malefics, with no benefic aspect.",
  },
  {
    id: 4,
    title: "Retrograde benefics in dusthāna",
    description: "Retrograde benefics in 6th/8th/12th aspected by malefics, with weak lagna and Moon.",
  },
  {
    id: 5,
    title: "Eclipsed luminary in lagna, malefic in 8th",
    description: "Eclipsed Moon or Sun in lagna, with Mars or Saturn in the 8th.",
  },
  {
    id: 6,
    title: "Moon in lagna under pāpakartari",
    description: "Moon in lagna under pāpakartari, no benefic aspect, malefics in 7th and 8th.",
  },
  {
    id: 7,
    title: "Weak Moon in kendra/koṇa, afflicted",
    description: "Weak Moon in a kendra or koṇa, afflicted by powerful malefics, no benefic influence.",
  },
  {
    id: 8,
    title: "Eclipse birth, lagna aspected by malefics",
    description: "Birth during an eclipse, with the lagna aspected by malefic planets.",
  },
];

const CONDITIONS: CancellationCondition[] = [
  { id: 1, label: "Jupiter strong in the lagna", note: "Dignified, unafflicted — classically a powerful protective factor." },
  { id: 2, label: "Moon well-dignified or benefic-influenced", note: "Own sign, exalted, or with benefic conjunction/aspect." },
  { id: 3, label: "Strong lagna and lagna lord", note: "Structural foundation mitigates dusthāna affliction." },
  { id: 4, label: "Benefics strong, malefics weak generally", note: "Broad strength-balance across the chart." },
  { id: 5, label: "Kendras and koṇas strongly occupied or well-aspected", note: "Angular and trinal strength as stabilising counterweight." },
  { id: 6, label: "Benefic predominance on lagna, lord, Moon, or kendras", note: "General protective pattern combining several factors." },
  { id: 7, label: "Favourable daśā sequence during vulnerable years", note: "Not assessed in this lesson — leave as not-assessed unless you have reliable daśā data." },
];

const DEFAULT_CHECKS: Record<number, CheckValue> = {
  1: "na",
  2: "na",
  3: "na",
  4: "na",
  5: "na",
  6: "na",
  7: "na",
};

const PRESETS: Record<string, { config: ConfigKey; checks: Record<number, CheckValue> }> = {
  "example-1": {
    config: 1,
    checks: { 1: "yes", 2: "no", 3: "yes", 4: "partial", 5: "yes", 6: "yes", 7: "na" },
  },
  "example-1-minus-jupiter": {
    config: 1,
    checks: { 1: "no", 2: "no", 3: "yes", 4: "partial", 5: "yes", 6: "yes", 7: "na" },
  },
  "fully-uncancelled": {
    config: 1,
    checks: { 1: "no", 2: "no", 3: "no", 4: "no", 5: "no", 6: "no", 7: "na" },
  },
  "mostly-cancelled": {
    config: 1,
    checks: { 1: "yes", 2: "yes", 3: "yes", 4: "partial", 5: "yes", 6: "yes", 7: "na" },
  },
};

const VALUE_SCORE: Record<CheckValue, number> = { yes: 1, partial: 0.5, no: 0, na: 0 };
const VALUE_LABEL: Record<CheckValue, string> = { yes: "Yes", partial: "Partial", no: "No", na: "Not assessed" };
const VALUE_COLOR: Record<CheckValue, string> = { yes: GREEN, partial: GOLD, no: VERMILION, na: BLUE };

const MISTAKES = [
  {
    label: "Stopping at the first cancellation condition",
    wrong: "One condition is checked and the analysis stops there.",
    right: "Check all seven conditions every time — cancellation is cumulative and non-exclusive.",
  },
  {
    label: "Collapsing a graduated finding into binary cancelled/not cancelled",
    wrong: "A chart with several but not all cancellations is forced into yes/no.",
    right: "Preserve the graduated texture: 'substantially weakened by X and Y' is often the honest output.",
  },
  {
    label: "Extending into daśā-timing or client-facing probability statements",
    wrong: "The apparatus is used to generate a percentage-style risk statement.",
    right: "This lesson stops at the cancellation apparatus itself; false-precision probability statements are out of scope.",
  },
];

const PHRASING_OPTIONS: Record<
  string,
  { label: string; correct: boolean; feedback: string }
> = {
  binary: {
    label: "The configuration is cancelled.",
    correct: false,
    feedback: "This collapses a graduated finding into a false binary. The walker almost never gives a clean yes/no.",
  },
  graduated: {
    label: "The configuration is present but substantially weakened by the cancellation conditions checked; the Moon itself remains afflicted, so the honest output is graduated rather than binary.",
    correct: true,
    feedback: "Correct — this preserves the texture the analysis actually produced.",
  },
  percentage: {
    label: "The configuration is 70% cancelled.",
    correct: false,
    feedback: "False precision. The cancellation apparatus does not produce percentage risk statements.",
  },
};

export function BalaristaCancellationWalker() {
  const [selectedConfig, setSelectedConfig] = useState<ConfigKey>(1);
  const [checks, setChecks] = useState<Record<number, CheckValue>>({ ...DEFAULT_CHECKS });
  const [selectedPhrasing, setSelectedPhrasing] = useState<string | null>(null);
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const applyPreset = (key: keyof typeof PRESETS) => {
    const preset = PRESETS[key];
    setSelectedConfig(preset.config);
    setChecks({ ...preset.checks });
    setSelectedPhrasing(null);
  };

  const reset = () => {
    setSelectedConfig(1);
    setChecks({ ...DEFAULT_CHECKS });
    setSelectedPhrasing(null);
    setShowSloka(false);
    setOpenMistakes({});
  };

  const setCheck = (id: number, value: CheckValue) =>
    setChecks((prev) => ({ ...prev, [id]: value }));

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const { yesCount, partialCount, noCount, naCount, score, assessedCount } = useMemo(() => {
    const values = Object.values(checks);
    const yes = values.filter((v) => v === "yes").length;
    const partial = values.filter((v) => v === "partial").length;
    const no = values.filter((v) => v === "no").length;
    const na = values.filter((v) => v === "na").length;
    const assessed = values.length - na;
    const s = yes * VALUE_SCORE.yes + partial * VALUE_SCORE.partial;
    return { yesCount: yes, partialCount: partial, noCount: no, naCount: na, score: s, assessedCount: assessed };
  }, [checks]);

  const synthesis = useMemo(() => {
    if (assessedCount === 0) {
      return {
        headline: "Check the cancellation conditions",
        body: "A matched configuration is only the first half of the technique. Work through all seven conditions above before forming any conclusion.",
        color: INK_MUTED,
      };
    }
    if (yesCount === 0 && partialCount === 0) {
      return {
        headline: "No cancellation conditions present",
        body: "In this simplified walker, the configuration remains uncancelled. In practice, such a combination is rare once all seven conditions are checked.",
        color: VERMILION,
      };
    }
    if (yesCount >= 5) {
      return {
        headline: "Very substantially cancelled",
        body: "Most independent protective pathways are present. The configuration is heavily weakened, though it may not be completely absent.",
        color: GREEN,
      };
    }
    if (score >= 3.5) {
      return {
        headline: "Substantially cancelled",
        body: "Multiple independent conditions weaken the configuration. The honest output is graduated — not a clean yes/no.",
        color: GREEN,
      };
    }
    if (score >= 1.5) {
      return {
        headline: "Weakly cancelled",
        body: "Some protective factors are present, but the configuration retains real weight. Continue holding a graduated view.",
        color: GOLD,
      };
    }
    return {
      headline: "Minimal cancellation",
      body: "Only faint protective factors are present; the configuration remains largely uncancelled in this walker.",
      color: VERMILION,
    };
  }, [assessedCount, yesCount, partialCount, score]);

  const presentYesPartials = useMemo(() => {
    return CONDITIONS.filter((c) => checks[c.id] === "yes" || checks[c.id] === "partial").map((c) => c.id);
  }, [checks]);

  return (
    <div data-interactive="balarista-cancellation-walker" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Bālāriṣṭa cancellation walker</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GREEN, fontSize: "1.35rem", fontWeight: 600 }}>
              Walk every condition, then word it honestly
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920, fontWeight: 400 }}>
              This tool walks a matched configuration through all seven classical cancellation conditions and produces a graduated — not binary — output.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.85fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Configuration selector</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
            Start with the matched configuration
          </h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {CONFIGURATIONS.map((cfg) => (
              <button
                key={cfg.id}
                type="button"
                aria-pressed={selectedConfig === cfg.id}
                onClick={() => {
                  setSelectedConfig(cfg.id);
                  setSelectedPhrasing(null);
                }}
                style={configRowStyle(selectedConfig === cfg.id)}
              >
                <span style={{ color: selectedConfig === cfg.id ? VERMILION : INK_MUTED, fontWeight: 600, minWidth: 28 }}>#{cfg.id}</span>
                <span style={{ textAlign: "left" }}>
                  <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{cfg.title}</span>
                  <span style={{ display: "block", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45, fontWeight: 400 }}>{cfg.description}</span>
                </span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: "0.85rem" }}>
            <TwoStepSvg />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Presets" icon={<ListChecks size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <button type="button" onClick={() => applyPreset("example-1")} style={presetButtonStyle(GREEN)}>
                <span style={{ fontWeight: 500 }}>Example 1</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Config 1 + four yes + one partial</span>
              </button>
              <button type="button" onClick={() => applyPreset("example-1-minus-jupiter")} style={presetButtonStyle(GOLD)}>
                <span style={{ fontWeight: 500 }}>Example 1 minus Jupiter</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Remove condition 1, observe the shift</span>
              </button>
              <button type="button" onClick={() => applyPreset("mostly-cancelled")} style={presetButtonStyle(GREEN)}>
                <span style={{ fontWeight: 500 }}>Mostly cancelled</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Five yes + one partial</span>
              </button>
              <button type="button" onClick={() => applyPreset("fully-uncancelled")} style={presetButtonStyle(VERMILION)}>
                <span style={{ fontWeight: 500 }}>Fully uncancelled</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>All conditions no — rare in practice</span>
              </button>
            </div>
          </Panel>

          <Panel title="How to read the output" icon={<Scale size={18} />} color={GOLD}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Cancellation is cumulative and non-exclusive. Multiple partial conditions combine to weaken a configuration. Resist compressing the result into a simple yes/no.
            </p>
          </Panel>
        </section>
      </div>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Cancellation checklist</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
          Check all seven conditions for configuration #{selectedConfig}
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {CONDITIONS.map((condition) => (
            <div
              key={condition.id}
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                background: SURFACE,
                padding: "0.75rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.75rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>
                    {condition.id}. {condition.label}
                  </p>
                  {condition.note && (
                    <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5, fontWeight: 400 }}>
                      {condition.note}
                    </p>
                  )}
                </div>
                <span
                  style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: 6,
                    background: `${VALUE_COLOR[checks[condition.id]]}18`,
                    color: VALUE_COLOR[checks[condition.id]],
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {VALUE_LABEL[checks[condition.id]]}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.55rem" }}>
                {(["yes", "partial", "no", "na"] as CheckValue[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={checks[condition.id] === value}
                    onClick={() => setCheck(condition.id, value)}
                    style={checkChipStyle(checks[condition.id] === value, VALUE_COLOR[value])}
                  >
                    {VALUE_LABEL[value]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...panelStyle, borderColor: `${synthesis.color}66`, background: synthesis.color === INK_MUTED ? SURFACE : `${synthesis.color}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.75rem", flexWrap: "wrap" }}>
          {assessedCount === 0 ? (
            <Info size={24} aria-hidden="true" style={{ color: synthesis.color, flexShrink: 0 }} />
          ) : (
            <Scale size={24} aria-hidden="true" style={{ color: synthesis.color, flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, color: synthesis.color, fontWeight: 600, fontSize: "1.1rem" }}>{synthesis.headline}</p>
            <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>{synthesis.body}</p>
            {assessedCount > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.65rem" }}>
                <MiniBadge label={`${yesCount} yes`} color={GREEN} />
                <MiniBadge label={`${partialCount} partial`} color={GOLD} />
                <MiniBadge label={`${noCount} no`} color={VERMILION} />
                <MiniBadge label={`${naCount} not assessed`} color={BLUE} />
              </div>
            )}
            {presentYesPartials.length > 0 && assessedCount > 0 && (
              <p style={{ margin: "0.6rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55, fontWeight: 400 }}>
                Conditions contributing to cancellation: {presentYesPartials.map((id) => `#${id}`).join(", ")}.
              </p>
            )}
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Internal-note trainer</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Practise graduated phrasing
        </h3>
        <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
          You have completed the cancellation check. Which internal note best preserves the graduated texture of the analysis?
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {(Object.entries(PHRASING_OPTIONS) as [string, typeof PHRASING_OPTIONS.graduated][]).map(([key, option]) => (
            <button
              key={key}
              type="button"
              aria-pressed={selectedPhrasing === key}
              onClick={() => setSelectedPhrasing(key)}
              style={phrasingChipStyle(selectedPhrasing === key, option.correct ? GREEN : VERMILION)}
            >
              <span style={{ fontWeight: 500 }}>{option.label}</span>
            </button>
          ))}
        </div>
        {selectedPhrasing && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: PHRASING_OPTIONS[selectedPhrasing].correct ? `${GREEN}10` : `${VERMILION}10`,
              border: `1px solid ${PHRASING_OPTIONS[selectedPhrasing].correct ? GREEN : VERMILION}55`,
            }}
          >
            <p style={{ margin: 0, color: PHRASING_OPTIONS[selectedPhrasing].correct ? GREEN : VERMILION, fontWeight: 500 }}>
              {PHRASING_OPTIONS[selectedPhrasing].correct ? "Correct phrasing" : "Avoid this phrasing"}
            </p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              {PHRASING_OPTIONS[selectedPhrasing].feedback}
            </p>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Teaching verse</p>
          <button type="button" aria-pressed={showSloka} onClick={() => setShowSloka((v) => !v)} style={smallChipStyle(showSloka, GOLD)}>
            {showSloka ? "Hide verse" : "Show verse"}
          </button>
        </div>
        {showSloka && (
          <div style={{ marginTop: "0.75rem", color: INK_SECONDARY, lineHeight: 1.7, fontWeight: 400 }}>
            <p style={{ margin: 0, fontStyle: "italic" }}>
              bahavo bhaṅga-hetavaḥ saṁhatya balam ādiśet |<br />
              naikaṁ dṛṣṭvā viramyeta sarvān paśyet prayatnataḥ ||
            </p>
            <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
              &quot;The causes of cancellation are many; combined together, they indicate strength. One should not stop having seen only one — all should be examined with diligence.&quot;
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
              Composite teaching paraphrase, not a verbatim quotation.
            </p>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Hold the graduated discipline
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {MISTAKES.map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => toggleMistake(index)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}>
                      <span style={{ fontWeight: 500 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 500, color: GREEN }}>Honest reading:</span> {item.right}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TwoStepSvg() {
  return (
    <svg viewBox="0 0 560 130" role="img" aria-label="Configuration matched, then cancellation walker, then graduated conclusion" style={{ width: "100%", maxHeight: 160, display: "block" }}>
      <rect x={20} y={30} width={150} height={70} rx={8} fill={`${VERMILION}12`} stroke={VERMILION} strokeWidth="1.5" />
      <text x={95} y={60} textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight={600}>Configuration</text>
      <text x={95} y={78} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={500}>matched</text>

      <path d="M 170 65 L 230 65" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="230,65 220,60 220,70" fill={HAIRLINE} />

      <rect x={240} y={30} width={150} height={70} rx={8} fill={`${GREEN}12`} stroke={GREEN} strokeWidth="1.5" />
      <text x={315} y={60} textAnchor="middle" fill={GREEN} fontSize="13" fontWeight={600}>Cancellation</text>
      <text x={315} y={78} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={500}>all 7 conditions</text>

      <path d="M 390 65 L 450 65" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="450,65 440,60 440,70" fill={HAIRLINE} />

      <rect x={460} y={30} width={80} height={70} rx={8} fill={`${GOLD}12`} stroke={GOLD} strokeWidth="1.5" />
      <text x={500} y={69} textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={600}>Graduated</text>

      <text x={280} y={120} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={500}>One inseparable two-step technique</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem", boxShadow: SHADOW }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ padding: "0.25rem 0.5rem", borderRadius: 6, background: `${color}18`, color, fontSize: "0.8rem", fontWeight: 500 }}>
      {label}
    </span>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function configRowStyle(active: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.65rem",
    textAlign: "left",
    border: `1px solid ${active ? VERMILION : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${VERMILION}0A` : SURFACE,
    padding: "0.65rem",
    cursor: "pointer",
  };
}

function presetButtonStyle(color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.15rem",
    textAlign: "left",
    border: `1px solid ${color}66`,
    borderRadius: 8,
    background: `${color}10`,
    color,
    padding: "0.65rem",
    cursor: "pointer",
  };
}

function checkChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.4rem 0.6rem",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: "0.85rem",
  };
}

function phrasingChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem",
    cursor: "pointer",
  };
}

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};
