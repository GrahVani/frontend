"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Baby,
  CheckCircle2,
  Eye,
  Home,
  Info,
  Moon,
  RotateCcw,
  Search,
  ShieldCheck,
  Sun,
  XCircle,
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
const PURPLE = "#6B5AA8";

type MoonPhase = "waxing" | "waning" | "eclipsed";
type Dignity = "strong" | "weak";

interface ChartState {
  moonHouse: number;
  moonPhase: MoonPhase;
  moonDignity: Dignity;
  moonAfflicted: boolean;
  moonBeneficAspect: boolean;
  moonPapakartari: boolean;
  lagnaAfflicted: boolean;
  lagnaMaleficOccupied: boolean;
  lagnaMaleficAspected: boolean;
  maleficsIn1st: boolean;
  maleficsIn7th: boolean;
  maleficsIn8th: boolean;
  maleficsInDusthana: boolean;
  kendrasDevoidBenefic: boolean;
  retrogradeBeneficsInDusthana: boolean;
  birthEclipse: boolean;
  sunInLagna: boolean;
  sunEclipsed: boolean;
}

const DEFAULT_STATE: ChartState = {
  moonHouse: 2,
  moonPhase: "waxing",
  moonDignity: "strong",
  moonAfflicted: false,
  moonBeneficAspect: true,
  moonPapakartari: false,
  lagnaAfflicted: false,
  lagnaMaleficOccupied: false,
  lagnaMaleficAspected: false,
  maleficsIn1st: false,
  maleficsIn7th: false,
  maleficsIn8th: false,
  maleficsInDusthana: false,
  kendrasDevoidBenefic: false,
  retrogradeBeneficsInDusthana: false,
  birthEclipse: false,
  sunInLagna: false,
  sunEclipsed: false,
};

const PRESETS: Record<string, ChartState> = {
  "chart-h1": DEFAULT_STATE,
  "config-1": {
    ...DEFAULT_STATE,
    moonHouse: 8,
    moonAfflicted: true,
    lagnaAfflicted: true,
  },
  "config-2": {
    ...DEFAULT_STATE,
    moonHouse: 12,
    moonPhase: "waning",
    moonBeneficAspect: false,
    maleficsIn1st: true,
    maleficsIn8th: true,
    kendrasDevoidBenefic: true,
  },
  "config-5": {
    ...DEFAULT_STATE,
    moonHouse: 1,
    moonPhase: "eclipsed",
    moonBeneficAspect: false,
    maleficsIn8th: true,
  },
  "config-6": {
    ...DEFAULT_STATE,
    moonHouse: 1,
    moonPapakartari: true,
    moonBeneficAspect: false,
    maleficsIn7th: true,
    maleficsIn8th: true,
  },
};

interface Configuration {
  id: number;
  title: string;
  description: string;
  match: (s: ChartState) => boolean;
}

const CONFIGURATIONS: Configuration[] = [
  {
    id: 1,
    title: "Moon in a dusthāna, afflicted",
    description: "Moon in the 6th, 8th, or 12th, afflicted by aspect or conjunction with malefics; stronger if lagna is also weak or afflicted.",
    match: (s) => [6, 8, 12].includes(s.moonHouse) && s.moonAfflicted,
  },
  {
    id: 2,
    title: "Waning Moon in the 12th, malefics in 1st and 8th",
    description: "Waning Moon in the 12th, malefics in the 1st and 8th, and the kendras devoid of benefic influence.",
    match: (s) =>
      s.moonHouse === 12 &&
      s.moonPhase === "waning" &&
      s.maleficsIn1st &&
      s.maleficsIn8th &&
      s.kendrasDevoidBenefic,
  },
  {
    id: 3,
    title: "Lagna, 7th, and Moon-sign all malefic-occupied",
    description: "The lagna, the 7th house, and the Moon-sign are all occupied by malefics, with no benefic aspect reaching any of the three.",
    match: (s) =>
      s.lagnaMaleficOccupied &&
      s.maleficsIn7th &&
      s.moonAfflicted &&
      !s.moonBeneficAspect &&
      s.kendrasDevoidBenefic,
  },
  {
    id: 4,
    title: "Retrograde benefics in dusthāna, weak lagna and Moon",
    description: "Retrograde benefics in the 6th, 8th, or 12th, themselves aspected by malefics, with a weak lagna and weak Moon-sign.",
    match: (s) =>
      s.retrogradeBeneficsInDusthana &&
      s.maleficsInDusthana &&
      s.moonDignity === "weak" &&
      s.lagnaAfflicted,
  },
  {
    id: 5,
    title: "Eclipsed luminary in lagna, malefic in 8th",
    description: "An eclipsed Moon or Sun occupying the lagna, with malefics (Mars or Saturn) in the 8th house.",
    match: (s) =>
      ((s.moonHouse === 1 && s.moonPhase === "eclipsed") ||
        (s.sunInLagna && s.sunEclipsed)) &&
      s.maleficsIn8th,
  },
  {
    id: 6,
    title: "Moon in lagna under pāpakartari",
    description: "Moon in the lagna under pāpakartari yoga, no benefic aspect, with malefics in the 7th and 8th.",
    match: (s) =>
      s.moonHouse === 1 &&
      s.moonPapakartari &&
      !s.moonBeneficAspect &&
      s.maleficsIn7th &&
      s.maleficsIn8th,
  },
  {
    id: 7,
    title: "Weak Moon in kendra/koṇa, afflicted, no benefic influence",
    description: "A weak Moon in a kendra or koṇa house, afflicted by powerful malefics, with no benefic influence reaching it.",
    match: (s) =>
      s.moonDignity === "weak" &&
      [1, 4, 5, 7, 9, 10].includes(s.moonHouse) &&
      s.moonAfflicted &&
      !s.moonBeneficAspect,
  },
  {
    id: 8,
    title: "Eclipse birth, lagna aspected by malefics",
    description: "Birth during an eclipse, with the lagna aspected by malefic planets.",
    match: (s) => s.birthEclipse && s.lagnaMaleficAspected,
  },
];

const MISTAKES = [
  {
    label: "Concluding from a configuration match alone",
    wrong: "A matched configuration is treated as a finished analysis.",
    right:
      "Every match is a prompt for Lesson 7.2.3's cancellation check, never a conclusion.",
  },
  {
    label: "Over-attributing precise verse numbers",
    wrong: "Citing a specific BPHS chapter/verse for each configuration without independent verification.",
    right:
      "This lesson's list comes from secondary compilations; cite them honestly without verse-level overclaim.",
  },
  {
    label: "Treating 'no configuration matched' as a failed analysis",
    wrong: "A learner feels something is wrong when no configuration matches.",
    right:
      "'No match' is a complete, valid, and common outcome for this lesson's technique.",
  },
];

export function BalaristaConfigurationSpotter() {
  const [state, setState] = useState<ChartState>(DEFAULT_STATE);
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const matchedIds = useMemo(
    () =>
      CONFIGURATIONS.filter((cfg) => cfg.match(state)).map((cfg) => cfg.id),
    [state]
  );

  const applyPreset = (key: keyof typeof PRESETS) => setState(PRESETS[key]);

  const reset = () => {
    setState(DEFAULT_STATE);
    setShowSloka(false);
    setOpenMistakes({});
  };

  const toggle = (key: keyof ChartState) =>
    setState((prev) => ({ ...prev, [key]: !prev[key] } as ChartState));

  const setMoonHouse = (house: number) =>
    setState((prev) => ({ ...prev, moonHouse: house }));

  const setMoonPhase = (phase: MoonPhase) =>
    setState((prev) => ({ ...prev, moonPhase: phase }));

  const setMoonDignity = (dignity: Dignity) =>
    setState((prev) => ({ ...prev, moonDignity: dignity }));

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div data-interactive="balarista-configuration-spotter" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Bālāriṣṭa configuration identification</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              Spot the pattern, then stop
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              This tool matches a simplified chart-state against the eight commonly-cited Bālāriṣṭa configurations. A match is only a prompt for cancellation analysis — never a conclusion.
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
          <p style={eyebrowStyle}>Chart-state builder</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Set the Moon, lagna, and malefic conditions
          </h3>

          <div style={{ display: "grid", gap: "1rem" }}>
            <Panel title="Moon" icon={<Moon size={18} />} color={BLUE}>
              <div style={{ display: "grid", gap: "0.65rem" }}>
                <div>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>House</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.35rem", marginTop: "0.35rem" }}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => (
                      <button
                        key={house}
                        type="button"
                        aria-pressed={state.moonHouse === house}
                        onClick={() => setMoonHouse(house)}
                        style={tinyChipStyle(state.moonHouse === house, BLUE)}
                      >
                        {house}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>Phase</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.35rem" }}>
                    {(["waxing", "waning", "eclipsed"] as MoonPhase[]).map((phase) => (
                      <button
                        key={phase}
                        type="button"
                        aria-pressed={state.moonPhase === phase}
                        onClick={() => setMoonPhase(phase)}
                        style={tinyChipStyle(state.moonPhase === phase, phase === "eclipsed" ? PURPLE : GOLD)}
                      >
                        {phase}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>Dignity</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.35rem" }}>
                    {(["strong", "weak"] as Dignity[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={state.moonDignity === d}
                        onClick={() => setMoonDignity(d)}
                        style={tinyChipStyle(state.moonDignity === d, d === "strong" ? GREEN : VERMILION)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.45rem" }}>
                  <ToggleButton active={state.moonAfflicted} onClick={() => toggle("moonAfflicted")} color={VERMILION}>
                    Afflicted by malefic
                  </ToggleButton>
                  <ToggleButton active={state.moonBeneficAspect} onClick={() => toggle("moonBeneficAspect")} color={GREEN}>
                    Benefic aspect
                  </ToggleButton>
                  <ToggleButton active={state.moonPapakartari} onClick={() => toggle("moonPapakartari")} color={VERMILION}>
                    Pāpakartari yoga
                  </ToggleButton>
                </div>
              </div>
            </Panel>

            <Panel title="Lagna" icon={<Home size={18} />} color={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.45rem" }}>
                <ToggleButton active={state.lagnaAfflicted} onClick={() => toggle("lagnaAfflicted")} color={VERMILION}>
                  Lagna afflicted / weak
                </ToggleButton>
                <ToggleButton active={state.lagnaMaleficOccupied} onClick={() => toggle("lagnaMaleficOccupied")} color={VERMILION}>
                  Malefic occupies lagna
                </ToggleButton>
                <ToggleButton active={state.lagnaMaleficAspected} onClick={() => toggle("lagnaMaleficAspected")} color={VERMILION}>
                  Lagna aspected by malefic
                </ToggleButton>
              </div>
            </Panel>

            <Panel title="Dusthāna / Kendra" icon={<Search size={18} />} color={PURPLE}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.45rem" }}>
                <ToggleButton active={state.maleficsIn1st} onClick={() => toggle("maleficsIn1st")} color={VERMILION}>
                  Malefics in 1st
                </ToggleButton>
                <ToggleButton active={state.maleficsIn7th} onClick={() => toggle("maleficsIn7th")} color={VERMILION}>
                  Malefics in 7th
                </ToggleButton>
                <ToggleButton active={state.maleficsIn8th} onClick={() => toggle("maleficsIn8th")} color={VERMILION}>
                  Malefics in 8th
                </ToggleButton>
                <ToggleButton active={state.maleficsInDusthana} onClick={() => toggle("maleficsInDusthana")} color={VERMILION}>
                  Malefics in 6/8/12
                </ToggleButton>
                <ToggleButton active={state.kendrasDevoidBenefic} onClick={() => toggle("kendrasDevoidBenefic")} color={GOLD}>
                  Kendras devoid of benefic
                </ToggleButton>
                <ToggleButton active={state.retrogradeBeneficsInDusthana} onClick={() => toggle("retrogradeBeneficsInDusthana")} color={GOLD}>
                  Retrograde benefics in 6/8/12
                </ToggleButton>
              </div>
            </Panel>

            <Panel title="Special conditions" icon={<Sun size={18} />} color={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.45rem" }}>
                <ToggleButton active={state.birthEclipse} onClick={() => toggle("birthEclipse")} color={PURPLE}>
                  Birth during eclipse
                </ToggleButton>
                <ToggleButton active={state.sunInLagna} onClick={() => toggle("sunInLagna")} color={GOLD}>
                  Sun in lagna
                </ToggleButton>
                <ToggleButton active={state.sunEclipsed} onClick={() => toggle("sunEclipsed")} color={PURPLE}>
                  Sun eclipsed
                </ToggleButton>
              </div>
            </Panel>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Moon-and-lagna focus" icon={<Baby size={18} />} color={BLUE}>
            <MoonLagnaSvg state={state} />
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.88rem" }}>
              Classical Bālāriṣṭa analysis centres the Moon and lagna. Every configuration below is read through those two factors.
            </p>
          </Panel>

          <Panel title="Presets" icon={<ShieldCheck size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <button type="button" onClick={() => applyPreset("chart-h1")} style={presetButtonStyle(GOLD)}>
                <span style={{ fontWeight: 500 }}>Chart H1</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Moon in Cancer 2nd, dignified, unafflicted — no match</span>
              </button>
              <button type="button" onClick={() => applyPreset("config-1")} style={presetButtonStyle(VERMILION)}>
                <span style={{ fontWeight: 500 }}>Config 1 match</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Moon in 8th afflicted, lagna afflicted</span>
              </button>
              <button type="button" onClick={() => applyPreset("config-2")} style={presetButtonStyle(VERMILION)}>
                <span style={{ fontWeight: 500 }}>Config 2 match</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Waning Moon in 12th, malefics in 1st and 8th</span>
              </button>
              <button type="button" onClick={() => applyPreset("config-5")} style={presetButtonStyle(VERMILION)}>
                <span style={{ fontWeight: 500 }}>Config 5 match</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Eclipsed Moon in lagna, malefic in 8th</span>
              </button>
              <button type="button" onClick={() => applyPreset("config-6")} style={presetButtonStyle(VERMILION)}>
                <span style={{ fontWeight: 500 }}>Config 6 match</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Moon in lagna under pāpakartari</span>
              </button>
            </div>
          </Panel>
        </section>
      </div>

      <section style={{ ...panelStyle, borderColor: matchedIds.length === 0 ? `${GREEN}66` : `${GOLD}66`, background: matchedIds.length === 0 ? `${GREEN}0A` : SURFACE }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {matchedIds.length === 0 ? (
            <CheckCircle2 size={22} aria-hidden="true" style={{ color: GREEN }} />
          ) : (
            <AlertTriangle size={22} aria-hidden="true" style={{ color: GOLD }} />
          )}
          <div>
            <p style={{ margin: 0, color: matchedIds.length === 0 ? GREEN : GOLD, fontWeight: 600 }}>
              {matchedIds.length === 0
                ? "No configuration matched"
                : `${matchedIds.length} configuration${matchedIds.length > 1 ? "s" : ""} matched`}
            </p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontWeight: 400 }}>
              {matchedIds.length === 0
                ? "This is a complete, valid, and common outcome for this lesson's identification step."
                : "Identification is only the first half of the technique. Every match must be checked against the cancellation apparatus in Lesson 7.2.3 before any conclusion is formed."}
            </p>
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Configuration cards</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Eight commonly-cited patterns
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
          {CONFIGURATIONS.map((cfg) => {
            const matched = matchedIds.includes(cfg.id);
            return (
              <div
                key={cfg.id}
                style={{
                  border: `1px solid ${matched ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: matched ? `${VERMILION}0A` : SURFACE,
                  padding: "0.85rem",
                  boxShadow: matched ? SHADOW : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <span style={{ color: matched ? VERMILION : INK_MUTED, fontWeight: 600 }}>#{cfg.id}</span>
                  {matched ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: VERMILION, fontSize: "0.8rem", fontWeight: 500 }}>
                      <Eye size={14} aria-hidden="true" /> Pattern matched
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 500 }}>
                      <XCircle size={14} aria-hidden="true" /> Not matched
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>{cfg.title}</p>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5, fontWeight: 400 }}>
                  {cfg.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ ...panelStyle, borderColor: `${VERMILION}66`, background: `${VERMILION}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.75rem" }}>
          <AlertTriangle size={22} aria-hidden="true" style={{ color: VERMILION, flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, color: VERMILION, fontWeight: 600 }}>Discipline lock</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              A matched configuration is a prompt for further checking, not a conclusion. Lesson 7.2.3 supplies the cancellation apparatus that makes any further step responsible.
            </p>
          </div>
        </div>
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
              candra-lagne parīkṣye tu yogamātraṁ na nirṇayaḥ |<br />
              bhaṅgam anviṣya paścāt tu nirṇayaḥ kriyate budhaiḥ ||
            </p>
            <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
              &quot;The Moon and lagna are to be examined — a configuration alone is not a conclusion. Having sought out its cancellation afterward, the wise then form a conclusion.&quot;
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
          Hold the identification-only discipline
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

function MoonLagnaSvg({ state }: { state: ChartState }) {
  const moonColor = state.moonDignity === "weak" ? VERMILION : BLUE;
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Moon and lagna as the two primary factors, with surrounding malefic and benefic influences" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={20} y={20} width={280} height={140} rx={8} fill={`${GOLD}0A`} stroke={HAIRLINE} />

      {/* Lagna */}
      <circle cx={80} cy={90} r={34} fill={`${GOLD}18`} stroke={state.lagnaAfflicted || state.lagnaMaleficOccupied || state.lagnaMaleficAspected ? VERMILION : GOLD} strokeWidth="3" />
      <text x={80} y={96} textAnchor="middle" fill={state.lagnaAfflicted ? VERMILION : GOLD} fontSize="14" fontWeight={600}>Lagna</text>

      {/* Moon */}
      <circle cx={240} cy={90} r={34} fill={`${moonColor}18`} stroke={state.moonAfflicted || state.moonPapakartari ? VERMILION : moonColor} strokeWidth="3" />
      <text x={240} y={96} textAnchor="middle" fill={state.moonAfflicted ? VERMILION : moonColor} fontSize="14" fontWeight={600}>Moon</text>

      {/* Influence arrows */}
      {state.moonBeneficAspect && (
        <path d="M 150 70 C 180 50, 210 50, 220 70" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowG)" />
      )}
      {state.moonAfflicted && (
        <path d="M 150 110 C 180 130, 210 130, 220 110" fill="none" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowR)" />
      )}

      <defs>
        <marker id="arrowG" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={GREEN} />
        </marker>
        <marker id="arrowR" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={VERMILION} />
        </marker>
      </defs>

      <text x={160} y={165} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={500}>
        House {state.moonHouse} · {state.moonPhase} · {state.moonDignity}
      </text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "0.85rem", boxShadow: SHADOW }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.65rem" }}>{children}</div>
    </section>
  );
}

function ToggleButton({ active, onClick, color, children }: { active: boolean; onClick: () => void; color: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.35rem",
        border: `1px solid ${active ? color : HAIRLINE}`,
        borderRadius: 8,
        background: active ? `${color}18` : "transparent",
        color: active ? color : INK_SECONDARY,
        padding: "0.5rem 0.65rem",
        fontWeight: 500,
        cursor: "pointer",
        fontSize: "0.86rem",
      }}
    >
      {active ? <CheckCircle2 size={14} aria-hidden="true" /> : <XCircle size={14} aria-hidden="true" style={{ opacity: 0.5 }} />}
      {children}
    </button>
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

function tinyChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 6,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.35rem 0.25rem",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: "0.82rem",
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
