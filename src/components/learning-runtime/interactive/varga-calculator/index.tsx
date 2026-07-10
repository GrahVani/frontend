"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Baby, BookOpenCheck, BriefcaseBusiness, Car, GitCompare, GraduationCap, HeartPulse, Home, Landmark, RotateCcw, ShieldCheck, UsersRound } from "lucide-react";
import { useLessonSlug } from "@/components/learning-runtime/interactive/tier-1/module-4/rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type Mode = "d4" | "d7" | "d10" | "d12" | "d16" | "d20" | "d24" | "d27" | "d30" | "d40d45";
type SupportFrame = "supportive" | "mixed" | "stressed";
type LineageMode = "d40" | "d45";

const D10_CONSTRUCTION_SLUG = "d10-dashamsha-the-career-magnification";
const D10_DOCTRINE_SLUG = "d10-construction-and-the-deva-asura-distinction";
const D12_SLUG = "d12-dvadashamsha-the-parents-magnification";
const D16_SLUG = "d16-shodashamsha-the-vehicles-magnification";
const D20_SLUG = "d20-vimshamsha-the-spiritual-magnification";
const D24_SLUG = "d24-chaturvimshamsha-the-education-magnification";
const D27_SLUG = "d27-saptavimshamsha-the-strength-magnification";
const D30_SLUG = "d30-trimshamsha-the-evil-magnification";
const D40_D45_SLUG = "d40-khavedamsha-and-d45-akshavedamsha-maternal-and-paternal-lineage";

const SIGNS = [
  { name: "Mesha", color: "#A23A1E" },
  { name: "Vrishabha", color: "#2F7D55" },
  { name: "Mithuna", color: "#356CAB" },
  { name: "Karka", color: "#54778A" },
  { name: "Simha", color: "#B88421" },
  { name: "Kanya", color: "#6F7F41" },
  { name: "Tula", color: "#7A5BA6" },
  { name: "Vrishchika", color: "#8E3C55" },
  { name: "Dhanu", color: "#C26A2C" },
  { name: "Makara", color: "#6D604A" },
  { name: "Kumbha", color: "#4E7896" },
  { name: "Mina", color: "#4D7F73" },
] as const;

const PLANETS = ["Mars", "Saturn", "Moon", "Venus", "Jupiter", "Mercury", "Sun", "Rahu", "Ketu"] as const;

const D4_PRESETS = [
  { label: "12 deg Mesha", planet: "Mars", sign: 0, degree: 12 },
  { label: "20 deg Mesha", planet: "Saturn", sign: 0, degree: 20 },
  { label: "26 deg Mesha", planet: "Moon", sign: 0, degree: 26 },
] as const;

const D7_PRESETS = [
  { label: "2 deg Mesha", planet: "Jupiter", sign: 0, degree: 2 },
  { label: "2 deg Vrishabha", planet: "Jupiter", sign: 1, degree: 2 },
  { label: "5 deg Mesha", planet: "Moon", sign: 0, degree: 5 },
] as const;

const D10_PRESETS = [
  { label: "2 deg Mesha", planet: "Sun", sign: 0, degree: 2 },
  { label: "2 deg Vrishabha", planet: "Saturn", sign: 1, degree: 2 },
  { label: "5 deg Mesha", planet: "Mercury", sign: 0, degree: 5 },
] as const;

const D12_PRESETS = [
  { label: "5 deg Mesha", planet: "Sun", sign: 0, degree: 5 },
  { label: "25 deg Mesha", planet: "Moon", sign: 0, degree: 25 },
  { label: "12 deg Karka", planet: "Moon", sign: 3, degree: 12 },
] as const;

const D16_PRESETS = [
  { label: "5 deg Mesha", planet: "Venus", sign: 0, degree: 5 },
  { label: "1 deg Vrishabha", planet: "Venus", sign: 1, degree: 1 },
  { label: "1 deg Mithuna", planet: "Venus", sign: 2, degree: 1 },
] as const;

const D20_PRESETS = [
  { label: "5 deg Mesha", planet: "Jupiter", sign: 0, degree: 5 },
  { label: "1 deg Vrishabha", planet: "Ketu", sign: 1, degree: 1 },
  { label: "1 deg Mithuna", planet: "Jupiter", sign: 2, degree: 1 },
] as const;

const D24_PRESETS = [
  { label: "5 deg Mesha", planet: "Mercury", sign: 0, degree: 5 },
  { label: "1 deg Vrishabha", planet: "Jupiter", sign: 1, degree: 1 },
  { label: "9 deg Mithuna", planet: "Mercury", sign: 2, degree: 9 },
] as const;

const D27_PRESETS = [
  { label: "0 deg 30 min Mesha", planet: "Mars", sign: 0, degree: 0.5 },
  { label: "0 deg 30 min Vrishabha", planet: "Sun", sign: 1, degree: 0.5 },
  { label: "4 deg Mesha", planet: "Mars", sign: 0, degree: 4 },
] as const;

const D30_PRESETS = [
  { label: "Malefic in 6th", planet: "Saturn", sign: 0, degree: 7 },
  { label: "Mitigated benefic", planet: "Jupiter", sign: 1, degree: 15 },
  { label: "Character-shadow", planet: "Mars", sign: 0, degree: 3 },
] as const;

const D40_D45_PRESETS = [
  { label: "D40 Moon sample", planet: "Moon", sign: 0, degree: 2 },
  { label: "D45 Sun sample", planet: "Sun", sign: 1, degree: 2 },
  { label: "Fine boundary", planet: "Moon", sign: 3, degree: 0.75 },
] as const;

const SUPPORT_TEXT: Record<Mode, Record<SupportFrame, string>> = {
  d4: {
    supportive: "D1 4th house and property karakas support the D4. Property, home, and fortune indications are reinforced.",
    mixed: "D1 gives mixed support. Let D4 qualify the practical pathway rather than replacing the birth-chart promise.",
    stressed: "D1 4th factors are strained. D4 can show where effort gathers, but it cannot erase the base chart pressure.",
  },
  d7: {
    supportive: "D1 5th house and Jupiter support the D7. Children/progeny promise is reinforced.",
    mixed: "D1 gives mixed support. Let D7 qualify progeny matters gently, never as a stand-alone verdict.",
    stressed: "D1 5th factors are strained. D7 can show where care and timing matter, but it cannot erase the base chart pressure.",
  },
  d10: {
    supportive: "D1 10th house and career karakas support the D10. Professional promise and public standing are reinforced.",
    mixed: "D1 gives mixed career support. Let D10 qualify professional expression rather than replacing the birth-chart promise.",
    stressed: "D1 10th factors are strained. D10 can show the career arena, but it cannot erase the base chart pressure.",
  },
  d12: {
    supportive: "D1 9th/Sun and 4th/Moon support the D12. Parental and lineage indications are reinforced.",
    mixed: "D1 gives mixed parental support. Let D12 qualify the parent story rather than replacing the birth-chart promise.",
    stressed: "D1 parental factors are strained. D12 can show where care, repair, or duty gathers, but it is not a stand-alone verdict.",
  },
  d16: {
    supportive: "D1 4th house, Venus, and D4 support the D16. Comforts, vehicles, and ease are reinforced.",
    mixed: "D1/D4 gives mixed comfort support. Let D16 qualify movable comforts rather than replacing the base chart.",
    stressed: "D1 4th or Venus is strained. D16 can show vehicle and comfort friction, but it cannot judge happiness by itself.",
  },
  d20: {
    supportive: "D1 5th/9th/12th, Jupiter, and Ketu support the D20. Practice, devotion, and moksha orientation are reinforced.",
    mixed: "D1 gives mixed spiritual support. Let D20 qualify practice and devotional tenor rather than replacing the base chart.",
    stressed: "D1 spiritual factors are strained. D20 can show where discipline or repair is needed, but it must not prescribe a path.",
  },
  d24: {
    supportive: "D1 4th/5th houses, Mercury, and Jupiter support the D24. Education, learning, and scholarly accomplishment are reinforced.",
    mixed: "D1 gives mixed education support. Let D24 qualify learning style and study outcomes rather than replacing the base chart.",
    stressed: "D1 education factors are strained. D24 can show study obstacles, but it should be read constructively and with timing care.",
  },
  d27: {
    supportive: "D1 Lagna, Lagna lord, Mars, and Sun support the D27. Strength, stamina, vitality, and constitutional resilience are reinforced.",
    mixed: "D1 gives mixed vitality support. Let D27 qualify stamina and resilience rather than replacing the base chart.",
    stressed: "D1 vitality factors are strained. D27 can show where constitution needs care, but it should be read constructively and without fear.",
  },
  d30: {
    supportive: "D1/D9 carry the difficulty. D30 can name a vulnerability area, but strength elsewhere mitigates and steadies the reading.",
    mixed: "D1/D9 give mixed support. D30 should be handled as a tendency that needs timing and context, never as a stand-alone verdict.",
    stressed: "D1 6th/8th/12th factors are strained. Use extra care: name the concern constructively, avoid diagnosis, and recommend professional help for health questions.",
  },
  d40d45: {
    supportive: "D12 and D1 parent factors support the lineage varga. D40/D45 can confirm maternal or paternal line texture, but still stay secondary.",
    mixed: "The parent-line cluster is mixed. Use D40/D45 as a refinement layer beside D12, Moon/4th, Sun/9th, and timing.",
    stressed: "The parent-line cluster is strained. Keep D40/D45 constructive and confirmation-only unless the birth time is rectified.",
  },
};

export function VargaCalculator() {
  const slug = useLessonSlug();
  const isD10Doctrine = slug === D10_DOCTRINE_SLUG;
  const mode: Mode = slug === "d7-saptamsha-the-children-magnification" ? "d7" : slug === D10_CONSTRUCTION_SLUG || isD10Doctrine ? "d10" : slug === D12_SLUG ? "d12" : slug === D16_SLUG ? "d16" : slug === D20_SLUG ? "d20" : slug === D24_SLUG ? "d24" : slug === D27_SLUG ? "d27" : slug === D30_SLUG ? "d30" : slug === D40_D45_SLUG ? "d40d45" : "d4";
  const defaultPreset = mode === "d7" ? D7_PRESETS[0] : mode === "d10" ? D10_PRESETS[0] : mode === "d12" ? D12_PRESETS[0] : mode === "d16" ? D16_PRESETS[0] : mode === "d20" ? D20_PRESETS[0] : mode === "d24" ? D24_PRESETS[0] : mode === "d27" ? D27_PRESETS[0] : mode === "d30" ? D30_PRESETS[0] : mode === "d40d45" ? D40_D45_PRESETS[0] : D4_PRESETS[0];
  const [planet, setPlanet] = useState<(typeof PLANETS)[number]>(defaultPreset.planet);
  const [signIndex, setSignIndex] = useState<number>(defaultPreset.sign);
  const [degree, setDegree] = useState<number>(defaultPreset.degree);
  const [supportFrame, setSupportFrame] = useState<SupportFrame>("supportive");
  const [birthNudge, setBirthNudge] = useState(1);
  const [showRegister, setShowRegister] = useState(true);
  const [lineageMode, setLineageMode] = useState<LineageMode>("d40");

  const result = useMemo(
    () => (mode === "d7" ? calculateD7(signIndex, degree) : mode === "d10" ? calculateD10(signIndex, degree) : mode === "d12" ? calculateD12(signIndex, degree) : mode === "d16" ? calculateD16(signIndex, degree) : mode === "d20" ? calculateD20(signIndex, degree) : mode === "d24" ? calculateD24(signIndex, degree) : mode === "d27" ? calculateD27(signIndex, degree) : mode === "d30" ? calculateD30(signIndex, degree) : mode === "d40d45" ? calculateLineageVarga(signIndex, degree, lineageMode) : calculateD4(signIndex, degree)),
    [degree, lineageMode, mode, signIndex],
  );
  const d27Variant = useMemo(() => calculateD27ElementBased(signIndex, degree), [degree, signIndex]);
  const d30Result = useMemo(() => calculateD30(signIndex, degree), [degree, signIndex]);
  const sign = SIGNS[signIndex];
  const output = SIGNS[result.outputIndex];
  const activeColor = output.color;
  const presets = mode === "d7" ? D7_PRESETS : mode === "d10" ? D10_PRESETS : mode === "d12" ? D12_PRESETS : mode === "d16" ? D16_PRESETS : mode === "d20" ? D20_PRESETS : mode === "d24" ? D24_PRESETS : mode === "d27" ? D27_PRESETS : mode === "d30" ? D30_PRESETS : mode === "d40d45" ? D40_D45_PRESETS : D4_PRESETS;
  const Icon = mode === "d7" ? Baby : mode === "d10" ? BriefcaseBusiness : mode === "d12" ? UsersRound : mode === "d16" ? Car : mode === "d20" ? Landmark : mode === "d24" ? GraduationCap : mode === "d27" ? ShieldCheck : mode === "d30" ? HeartPulse : mode === "d40d45" ? UsersRound : Home;
  const signClass = getSignClass(signIndex);
  const d20SignClass = getD20SignClass(signIndex);
  const lineageStartIndex = lineageMode === "d40" ? (signIndex % 2 === 0 ? 0 : 6) : getSignClass(signIndex).startIndex;
  const birthSensitivityWarn = mode === "d40d45" ? birthNudge >= 1 : mode === "d16" || mode === "d20" || mode === "d24" || mode === "d27" ? birthNudge >= 3 : birthNudge >= 4;
  const d10Register = signIndex % 2 === 0
    ? {
        label: "Deva register",
        color: GREEN,
        summary: "smoother, more benevolent career texture",
        cue: "smoothness and protection, still checked against dignity",
      }
    : {
        label: "Asura register",
        color: VERMILION,
        summary: "effortful, challenge-won career texture",
        cue: "effort, contest, and achievement through pressure; not doom",
      };

  const reset = () => {
    setPlanet(defaultPreset.planet);
    setSignIndex(defaultPreset.sign);
    setDegree(defaultPreset.degree);
    setSupportFrame("supportive");
    setBirthNudge(1);
    setShowRegister(true);
    setLineageMode("d40");
  };

  return (
    <div data-interactive="varga-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>{mode === "d7" ? "D7 Saptamsha calculator" : mode === "d10" ? "D10 Dashamsha calculator" : mode === "d12" ? "D12 Dvadashamsha calculator" : mode === "d16" ? "D16 Shodashamsha calculator" : mode === "d20" ? "D20 Vimshamsha calculator" : mode === "d24" ? "D24 Chaturvimshamsha calculator" : mode === "d27" ? "D27 Saptavimshamsha calculator" : mode === "d30" ? "D30 Trimshamsha honest reader" : mode === "d40d45" ? "D40/D45 lineage calculator" : "D4 Chaturthamsha calculator"}</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              {mode === "d7" ? "Seven parts, odd-even starting point" : mode === "d10" ? (isD10Doctrine ? "Karma begins from dharma" : "Ten parts, career orientation") : mode === "d12" ? "Twelve parts, one steady count" : mode === "d16" ? "Sixteen parts, fire-sign starts" : mode === "d20" ? "Twenty parts, practice-path starts" : mode === "d24" ? "Twenty-four parts, light-ruler starts" : mode === "d27" ? "Twenty-seven parts, disclosed start rule" : mode === "d30" ? "One unequal varga, handled honestly" : mode === "d40d45" ? "Maternal and paternal lineage, separated" : "Four parts, four kendras"}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 880 }}>
              {mode === "d7"
                ? "Move through the seven narrow parts of a sign. Odd signs count from themselves; even signs begin from the 7th sign."
                : mode === "d10"
                  ? isD10Doctrine
                    ? "Toggle the D10 register layer. Odd signs carry the deva register; even signs begin from the 9th dharma-counterpart and carry the asura register as effortful texture, not a verdict."
                    : "Move through the ten 3 degree parts of a sign. Odd signs count from themselves; even signs begin from the 9th sign."
                  : mode === "d12"
                    ? "Move through the twelve 2 degree 30 minute parts. D12 always counts from the same sign forward, so there is no odd/even flip to import from D10."
                    : mode === "d16"
                      ? "Move through sixteen fine parts. D16 starts by sign class: movable signs from Mesha, fixed signs from Simha, and dual signs from Dhanu, not from the D9 start scheme."
                    : mode === "d20"
                      ? "Move through twenty 1 degree 30 minute parts. D20 uses Mesha, Dhanu, and Simha as starts, but paired differently from D16: movable, fixed, and dual respectively."
                    : mode === "d24"
                      ? "Move through twenty-four 1 degree 15 minute parts. Odd signs begin from Simha, the Sun's house; even signs begin from Karka, the Moon's house."
                      : mode === "d27"
                        ? "Move through twenty-seven parts of about 1 degree 06 minutes 40 seconds. The curriculum result uses a universal Aries start; toggle the element-based variant to see why D27 conventions must be disclosed."
                        : mode === "d30"
                          ? "Explore D30 as a vulnerability and character-shadow magnifier. It is the only unequal varga: five tara-graha segments, no luminaries or nodes, and every result must be framed as tendency, not doom."
                          : mode === "d40d45"
                            ? "Toggle D40 for the maternal line and D45 for the paternal line. These are very fine lineage vargas, so they refine D12 only when the birth time is rectified and the construction convention is disclosed."
                : "Move through the four 7.5 degree parts of a sign and watch D4 map to the sign's angular pillars: same, 4th, 7th, and 10th."}
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Current placement</p>
              <h3 style={{ margin: "0.2rem 0 0", color: activeColor, fontSize: "1.2rem" }}>
                {planet} at {formatDegree(degree)} {sign.name}
              </h3>
            </div>
            <strong style={{ color: activeColor }}>{result.partLabel}</strong>
          </div>

          {mode === "d7" ? (
            <D7Svg degree={degree} signIndex={signIndex} activePart={result.part} />
          ) : mode === "d10" ? (
            <D10Svg degree={degree} signIndex={signIndex} activePart={result.part} showRegister={isD10Doctrine && showRegister} />
          ) : mode === "d12" ? (
            <D12Svg degree={degree} signIndex={signIndex} activePart={result.part} />
          ) : mode === "d16" ? (
            <D16Svg degree={degree} signIndex={signIndex} activePart={result.part} />
          ) : mode === "d20" ? (
            <D20Svg degree={degree} signIndex={signIndex} activePart={result.part} />
          ) : mode === "d24" ? (
            <D24Svg degree={degree} signIndex={signIndex} activePart={result.part} />
          ) : mode === "d27" ? (
            <D27Svg degree={degree} activePart={result.part} showElementVariant={showRegister} variantStartIndex={d27Variant.startIndex} />
          ) : mode === "d30" ? (
            <D30Svg degree={degree} signIndex={signIndex} activePart={result.part} />
          ) : mode === "d40d45" ? (
            <LineageVargaSvg degree={degree} signIndex={signIndex} activePart={result.part} lineageMode={lineageMode} />
          ) : (
            <D4Svg degree={degree} signIndex={signIndex} activePart={result.part} />
          )}

          <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Calculated {mode === "d7" ? "D7" : mode === "d10" ? "D10" : mode === "d12" ? "D12" : mode === "d16" ? "D16" : mode === "d20" ? "D20" : mode === "d24" ? "D24" : mode === "d27" ? "D27" : mode === "d30" ? "D30" : mode === "d40d45" ? lineageMode.toUpperCase() : "D4"} sign</p>
            <h4 style={{ margin: "0.2rem 0", color: activeColor, fontSize: "1.08rem" }}>
              {result.partLabel}: {output.name}{mode === "d30" ? ` (${d30Result.lord} segment)` : ""}
            </h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Rule: {result.rule}.</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<Icon size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setPlanet(preset.planet);
                    setSignIndex(preset.sign);
                    setDegree(preset.degree);
                    if (mode === "d40d45") setLineageMode(preset.planet === "Sun" ? "d45" : "d40");
                  }}
                  style={buttonStyle(planet === preset.planet && signIndex === preset.sign && degree === preset.degree, BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Select planet and sign" icon={<BadgeCheck size={18} />} color={GOLD}>
            <select value={planet} onChange={(event) => setPlanet(event.target.value as (typeof PLANETS)[number])} style={selectStyle}>
              {PLANETS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: "0.45rem" }}>
              {SIGNS.map((item, index) => (
                <button key={item.name} type="button" onClick={() => setSignIndex(index)} style={signButtonStyle(signIndex === index, item.color)}>
                  {item.name}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Degree within sign" icon={<GitCompare size={18} />} color={activeColor}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
              {formatDegree(degree)} {sign.name}
              <input
                type="range"
                min={0}
                max={29.5}
                step={mode === "d40d45" ? (lineageMode === "d45" ? 1 / 6 : 0.25) : mode === "d27" ? 1 / 6 : mode === "d24" ? 0.25 : mode === "d30" ? 0.25 : 0.5}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                style={{ width: "100%", accentColor: activeColor }}
              />
            </label>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {mode === "d7"
                ? "Each part is about 4 deg 17 min 08 sec. Narrow parts make birth-time precision matter."
                : mode === "d10"
                  ? "Each Dashamsha part is exactly 3 deg."
                  : mode === "d12"
                    ? "Each Dvadashamsha part is exactly 2 deg 30 min, counted forward from the same sign."
                    : mode === "d16"
                      ? "Each Shodashamsha part is 1 deg 52 min 30 sec. Fine parts make birth-time precision matter."
                    : mode === "d20"
                      ? "Each Vimshamsha part is exactly 1 deg 30 min. Fine parts make birth-time precision matter."
                    : mode === "d24"
                      ? "Each Chaturvimshamsha part is exactly 1 deg 15 min. Fine parts make birth-time precision matter."
                      : mode === "d27"
                        ? "Each Saptavimshamsha part is about 1 deg 06 min 40 sec. This is strongly birth-time-sensitive."
                        : mode === "d30"
                          ? "Do not divide D30 into thirty equal 1 deg parts. It uses five unequal tara-graha segments; exact construction is reinforced in the next lesson."
                          : mode === "d40d45"
                            ? lineageMode === "d40" ? "D40 splits each sign into forty 45 minute parts. It refines maternal lineage through the 4th and Moon." : "D45 splits each sign into forty-five 40 minute parts. It refines paternal lineage through the 9th and Sun."
                  : "Boundaries: 7.5 deg, 15 deg, and 22.5 deg."}
            </p>
          </Panel>

          {mode === "d40d45" ? (
            <Panel title="Choose lineage varga" icon={<UsersRound size={18} />} color={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.45rem" }}>
                <button type="button" onClick={() => setLineageMode("d40")} style={buttonStyle(lineageMode === "d40", GREEN)}>
                  D40 maternal
                </button>
                <button type="button" onClick={() => setLineageMode("d45")} style={buttonStyle(lineageMode === "d45", VERMILION)}>
                  D45 paternal
                </button>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                {lineageMode === "d40"
                  ? "Khavedamsha is the maternal-line magnifier: read the D40 4th, Moon, D12, and D1 4th together."
                  : "Akshavedamsha is the paternal-line magnifier: read the D45 9th, Sun, D12, and D1 9th together."}
              </p>
            </Panel>
          ) : null}

          {mode === "d40d45" ? (
            <Panel title="Start convention" icon={<BookOpenCheck size={18} />} color={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: lineageMode === "d40" ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))", gap: "0.45rem" }}>
                {(lineageMode === "d40"
                  ? [
                      { label: "Odd signs", start: "Mesha", active: signIndex % 2 === 0 },
                      { label: "Even signs", start: "Tula", active: signIndex % 2 === 1 },
                    ]
                  : [
                      { label: "Movable", start: "Mesha", active: signClass.label === "Movable" },
                      { label: "Fixed", start: "Simha", active: signClass.label === "Fixed" },
                      { label: "Dual", start: "Dhanu", active: signClass.label === "Dual" },
                    ]).map((item) => (
                    <div key={item.label} style={{ border: `1px solid ${item.active ? activeColor : HAIRLINE}`, borderRadius: 8, background: item.active ? `${activeColor}12` : "transparent", padding: "0.65rem", color: item.active ? activeColor : INK_SECONDARY, fontWeight: 700 }}>
                      <div>{item.label}</div>
                      <small style={{ color: INK_MUTED }}>start {item.start}</small>
                    </div>
                  ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                {lineageMode === "d40"
                  ? `${sign.name} is ${signIndex % 2 === 0 ? "odd" : "even"}, so D40 begins from ${SIGNS[lineageStartIndex].name} and counts ${result.part + 1} fine part${result.part === 0 ? "" : "s"}.`
                  : `${sign.name} is ${signClass.label.toLowerCase()}, so D45 begins from ${SIGNS[lineageStartIndex].name} and counts ${result.part + 1} fine part${result.part === 0 ? "" : "s"}.`}
              </p>
            </Panel>
          ) : null}

          {mode === "d16" ? (
            <Panel title="Sign-class start" icon={<BookOpenCheck size={18} />} color={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.45rem" }}>
                {[
                  { label: "Movable", start: "Mesha", active: signClass.label === "Movable" },
                  { label: "Fixed", start: "Simha", active: signClass.label === "Fixed" },
                  { label: "Dual", start: "Dhanu", active: signClass.label === "Dual" },
                ].map((item) => (
                  <div key={item.label} style={{ border: `1px solid ${item.active ? activeColor : HAIRLINE}`, borderRadius: 8, background: item.active ? `${activeColor}12` : "transparent", padding: "0.65rem", color: item.active ? activeColor : INK_SECONDARY, fontWeight: 700 }}>
                    <div>{item.label}</div>
                    <small style={{ color: INK_MUTED }}>start {item.start}</small>
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Current sign is {signClass.label.toLowerCase()}, so D16 begins from {SIGNS[signClass.startIndex].name}. This is different from the D9 start pattern.</p>
            </Panel>
          ) : null}

          {mode === "d24" ? (
            <Panel title="Light-ruler start" icon={<BookOpenCheck size={18} />} color={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.45rem" }}>
                {[
                  { label: "Odd signs", start: "Simha", active: signIndex % 2 === 0 },
                  { label: "Even signs", start: "Karka", active: signIndex % 2 === 1 },
                ].map((item) => (
                  <div key={item.label} style={{ border: `1px solid ${item.active ? activeColor : HAIRLINE}`, borderRadius: 8, background: item.active ? `${activeColor}12` : "transparent", padding: "0.65rem", color: item.active ? activeColor : INK_SECONDARY, fontWeight: 700 }}>
                    <div>{item.label}</div>
                    <small style={{ color: INK_MUTED }}>start {item.start}</small>
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{sign.name} is {signIndex % 2 === 0 ? "odd" : "even"}, so D24 begins from {signIndex % 2 === 0 ? "Simha, the Sun's house" : "Karka, the Moon's house"}. This is the light-of-knowledge cue.</p>
            </Panel>
          ) : null}

          {mode === "d27" ? (
            <Panel title="Construction convention" icon={<BookOpenCheck size={18} />} color={GOLD}>
              <button type="button" onClick={() => setShowRegister((value) => !value)} style={buttonStyle(showRegister, GOLD)}>
                {showRegister ? "Element variant shown" : "Show element variant"}
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.45rem" }}>
                <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "0.65rem" }}>
                  <strong style={{ color: activeColor }}>Curriculum default</strong>
                  <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>Every sign starts from Mesha. Current result: {output.name}.</p>
                </div>
                <div style={{ border: `1px solid ${SIGNS[d27Variant.outputIndex].color}66`, borderRadius: 8, background: showRegister ? `${SIGNS[d27Variant.outputIndex].color}12` : "transparent", padding: "0.65rem", opacity: showRegister ? 1 : 0.62 }}>
                  <strong style={{ color: SIGNS[d27Variant.outputIndex].color }}>Element-based variant</strong>
                  <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>
                    {showRegister ? `${d27Variant.element} starts from ${SIGNS[d27Variant.startIndex].name}; result: ${SIGNS[d27Variant.outputIndex].name}.` : "Hidden, but disclose if this source convention is used."}
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>The lesson uses universal Aries for calculation, while showing the source-variable element start as a comparison layer.</p>
            </Panel>
          ) : null}

          {mode === "d30" ? (
            <Panel title="Five tara-graha segments" icon={<BookOpenCheck size={18} />} color={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "0.45rem" }}>
                {["Mars", "Saturn", "Jupiter", "Mercury", "Venus"].map((lord) => (
                  <div key={lord} style={{ border: `1px solid ${d30Result.lord === lord ? activeColor : HAIRLINE}`, borderRadius: 8, background: d30Result.lord === lord ? `${activeColor}12` : "transparent", padding: "0.55rem", color: d30Result.lord === lord ? activeColor : INK_SECONDARY, fontWeight: 900, textAlign: "center" }}>
                    {lord}
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Current segment lord is {d30Result.lord}. D30 uses only these five tara-grahas: no luminaries and no nodes.</p>
            </Panel>
          ) : null}

          {mode === "d30" ? (
            <Panel title="Honest-handling prompt" icon={<HeartPulse size={18} />} color={VERMILION}>
              <button type="button" onClick={() => setShowRegister((value) => !value)} style={buttonStyle(showRegister, VERMILION)}>
                {showRegister ? "Care prompts on" : "Show care prompts"}
              </button>
              {showRegister ? (
                <div style={{ display: "grid", gap: "0.45rem" }}>
                  {[
                    "Name a vulnerability area, not a fixed outcome.",
                    "Never diagnose disease or predict mortality from D30.",
                    "Weigh D1/D9 strength and timing before any claim.",
                    "For health questions, recommend a medical professional.",
                  ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
                </div>
              ) : (
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>D30 is the highest-care varga in this chapter. Keep the reading constructive.</p>
              )}
            </Panel>
          ) : null}

          {mode === "d20" ? (
            <Panel title="Sign-class start" icon={<BookOpenCheck size={18} />} color={GOLD}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.45rem" }}>
                {[
                  { label: "Movable", start: "Mesha", active: d20SignClass.label === "Movable" },
                  { label: "Fixed", start: "Dhanu", active: d20SignClass.label === "Fixed" },
                  { label: "Dual", start: "Simha", active: d20SignClass.label === "Dual" },
                ].map((item) => (
                  <div key={item.label} style={{ border: `1px solid ${item.active ? activeColor : HAIRLINE}`, borderRadius: 8, background: item.active ? `${activeColor}12` : "transparent", padding: "0.65rem", color: item.active ? activeColor : INK_SECONDARY, fontWeight: 700 }}>
                    <div>{item.label}</div>
                    <small style={{ color: INK_MUTED }}>start {item.start}</small>
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Current sign is {d20SignClass.label.toLowerCase()}, so D20 begins from {SIGNS[d20SignClass.startIndex].name}. Same fire anchors as D16, different assignment.</p>
            </Panel>
          ) : null}

          {isD10Doctrine ? (
            <Panel title="Deva/asura layer" icon={<BookOpenCheck size={18} />} color={d10Register.color}>
              <button type="button" onClick={() => setShowRegister((value) => !value)} style={buttonStyle(showRegister, d10Register.color)}>
                {showRegister ? "Register shading on" : "Register shading off"}
              </button>
              <div style={{ border: `1px solid ${d10Register.color}44`, borderRadius: 8, background: `${d10Register.color}10`, padding: "0.75rem" }}>
                <p style={{ margin: 0, color: d10Register.color, fontWeight: 800 }}>{d10Register.label}</p>
                <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{d10Register.summary}. Specific named deity lists are deferred in Tier 1.</p>
              </div>
            </Panel>
          ) : null}
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title={mode === "d7" ? "D1 5th and Jupiter overlay" : mode === "d10" ? "D1 10th and karakas overlay" : mode === "d12" ? "D1 parent overlay" : mode === "d16" ? "D1 4th, Venus, and D4 overlay" : mode === "d20" ? "D1 5th, 9th, 12th overlay" : mode === "d24" ? "D1 4th, 5th, Mercury, Jupiter overlay" : mode === "d27" ? "D1 Lagna, Mars, Sun overlay" : mode === "d30" ? "D1/D9 and dusthana overlay" : mode === "d40d45" ? (lineageMode === "d40" ? "D12 + D40 maternal overlay" : "D12 + D45 paternal overlay") : "D1 4th-house overlay"} icon={<ShieldCheck size={18} />} color={GREEN}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["supportive", "mixed", "stressed"] as SupportFrame[]).map((frame) => (
              <button
                key={frame}
                type="button"
                onClick={() => setSupportFrame(frame)}
                style={buttonStyle(supportFrame === frame, frame === "supportive" ? GREEN : frame === "mixed" ? GOLD : VERMILION)}
              >
                {frame === "supportive" ? "D1 supports" : frame === "mixed" ? "Mixed D1" : "D1 strained"}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{SUPPORT_TEXT[mode][supportFrame]}</p>
        </Panel>

        {mode === "d7" || mode === "d16" || mode === "d20" || mode === "d24" || mode === "d27" || mode === "d40d45" ? (
          <Panel title="Birth-time sensitivity" icon={<GitCompare size={18} />} color={birthSensitivityWarn ? VERMILION : GREEN}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
              Time uncertainty: {birthNudge} min
              <input
                type="range"
                min={0}
                max={8}
                value={birthNudge}
                onChange={(event) => setBirthNudge(Number(event.target.value))}
                style={{ width: "100%", accentColor: birthSensitivityWarn ? VERMILION : GREEN }}
              />
            </label>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {mode === "d16"
                ? birthNudge >= 3
                  ? "Caution: D16 parts are very fine, so rough birth time can change the comfort-chart placement."
                  : "Stable enough for a teaching example, but D16 still deserves accurate timing."
                : mode === "d20"
                  ? birthNudge >= 3
                    ? "Caution: D20's 1 deg 30 min parts can shift with rough birth time; treat spiritual detail as confirmation."
                    : "Stable enough for a teaching example, but D20 still needs accurate timing for real charts."
                  : mode === "d24"
                    ? birthNudge >= 3
                      ? "Caution: D24's 1 deg 15 min parts can shift with rough birth time; avoid over-reading education detail."
                      : "Stable enough for a teaching example, but D24 still needs accurate timing for real charts."
                    : mode === "d27"
                      ? birthNudge >= 3
                        ? "Caution: D27's ~1 deg 06 min 40 sec parts are very fine; use strength details as confirmation with rough birth times."
                        : "Stable enough for a teaching example, but D27 still needs accurate timing for real charts."
                    : mode === "d40d45"
                      ? birthNudge >= 1
                        ? `Caution: ${lineageMode.toUpperCase()} parts are extremely fine (${lineageMode === "d40" ? "45 minutes" : "40 minutes"} each). Use it as confirmation only unless the time is rectified.`
                        : "Rectified-level teaching sample: still disclose the construction convention before interpreting lineage detail."
                : birthNudge >= 4
                  ? "Caution: narrow D7 parts can shift with rough birth time."
                  : "Stable enough for a teaching example, but exact charts still need careful timing."}
            </p>
          </Panel>
        ) : (
          <ReadingCue color={activeColor} mode={mode} planet={planet} outputName={output.name} doctrineCue={isD10Doctrine ? d10Register.cue : undefined} />
        )}

        {mode === "d7" || mode === "d16" || mode === "d20" || mode === "d24" || mode === "d27" || mode === "d40d45" ? <ReadingCue color={activeColor} mode={mode} planet={planet} outputName={output.name} lineageMode={lineageMode} /> : null}
      </div>
    </div>
  );
}

function calculateD4(signIndex: number, degree: number) {
  const part = Math.min(3, Math.floor(degree / 7.5));
  const offsets = [0, 3, 6, 9];
  const labels = ["1st chaturthamsha", "2nd chaturthamsha", "3rd chaturthamsha", "4th chaturthamsha"];
  const rules = ["same sign", "4th from the sign", "7th from the sign", "10th from the sign"];
  return { part, outputIndex: (signIndex + offsets[part]) % 12, partLabel: labels[part], rule: `${rules[part]}. D4 uses kendras, not the D3 trinal pattern` };
}

function calculateD7(signIndex: number, degree: number) {
  const partSize = 30 / 7;
  const part = Math.min(6, Math.floor(degree / partSize));
  const oddSign = signIndex % 2 === 0;
  const startIndex = oddSign ? signIndex : (signIndex + 6) % 12;
  const outputIndex = (startIndex + part) % 12;
  const startText = oddSign ? "odd sign starts from itself" : "even sign starts from the 7th sign";
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} saptamsha`,
    rule: `${startText}; then count ${part + 1} consecutive sign${part === 0 ? "" : "s"}`,
  };
}

function calculateD10(signIndex: number, degree: number) {
  const part = Math.min(9, Math.floor(degree / 3));
  const oddSign = signIndex % 2 === 0;
  const startIndex = oddSign ? signIndex : (signIndex + 8) % 12;
  const outputIndex = (startIndex + part) % 12;
  const startText = oddSign ? "odd sign starts from itself" : "even sign starts from the 9th sign";
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} dashamsha`,
    rule: `${startText}; then count ${part + 1} consecutive sign${part === 0 ? "" : "s"}. D10 even-start differs from D7`,
  };
}

function calculateD12(signIndex: number, degree: number) {
  const part = degree === 0 ? 0 : Math.min(11, Math.ceil(degree / 2.5) - 1);
  const outputIndex = (signIndex + part) % 12;
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} dvadashamsha`,
    rule: `same-sign forward count; the ${ordinal(part + 1)} part maps to the ${ordinal(part + 1)} sign from ${SIGNS[signIndex].name}. No odd/even distinction`,
  };
}

function calculateD16(signIndex: number, degree: number) {
  const partSize = 30 / 16;
  const part = Math.min(15, Math.floor(degree / partSize));
  const startIndex = getSignClass(signIndex).startIndex;
  const outputIndex = (startIndex + part) % 12;
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} shodashamsha`,
    rule: `${getSignClass(signIndex).label.toLowerCase()} sign starts from ${SIGNS[startIndex].name}; then count ${part + 1} consecutive sign${part === 0 ? "" : "s"}. D16 starts differ from D9`,
  };
}

function calculateD20(signIndex: number, degree: number) {
  const partSize = 30 / 20;
  const part = Math.min(19, Math.floor(degree / partSize));
  const startIndex = getD20SignClass(signIndex).startIndex;
  const outputIndex = (startIndex + part) % 12;
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} vimshamsha`,
    rule: `${getD20SignClass(signIndex).label.toLowerCase()} sign starts from ${SIGNS[startIndex].name}; then count ${part + 1} consecutive sign${part === 0 ? "" : "s"}. D20 uses the D16 fire anchors in a different class pairing`,
  };
}

function calculateD24(signIndex: number, degree: number) {
  const partSize = 30 / 24;
  const part = degree === 0 ? 0 : Math.min(23, Math.ceil(degree / partSize) - 1);
  const oddSign = signIndex % 2 === 0;
  const startIndex = oddSign ? 4 : 3;
  const outputIndex = (startIndex + part) % 12;
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} chaturvimshamsha`,
    rule: `${oddSign ? "odd sign starts from Simha, the Sun's house" : "even sign starts from Karka, the Moon's house"}; then count ${part + 1} consecutive sign${part === 0 ? "" : "s"}. D24 uses the light-ruler symbolism for education`,
  };
}

function calculateD27(signIndex: number, degree: number) {
  const partSize = 30 / 27;
  const part = Math.min(26, Math.floor(degree / partSize));
  const outputIndex = part % 12;
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} saptavimshamsha`,
    rule: `curriculum convention starts every sign from Mesha; then count ${part + 1} consecutive sign${part === 0 ? "" : "s"}. Source conventions vary, so disclose universal Aries before interpreting D27 strength`,
  };
}

function calculateD27ElementBased(signIndex: number, degree: number) {
  const partSize = 30 / 27;
  const part = Math.min(26, Math.floor(degree / partSize));
  const elementStart = getD27ElementStart(signIndex);
  return {
    part,
    startIndex: elementStart.startIndex,
    outputIndex: (elementStart.startIndex + part) % 12,
    element: elementStart.element,
  };
}

function calculateD30(signIndex: number, degree: number) {
  const oddSign = signIndex % 2 === 0;
  const segments = oddSign
    ? [
        { start: 0, end: 5, lord: "Mars", outputIndex: 0 },
        { start: 5, end: 10, lord: "Saturn", outputIndex: 10 },
        { start: 10, end: 18, lord: "Jupiter", outputIndex: 8 },
        { start: 18, end: 25, lord: "Mercury", outputIndex: 2 },
        { start: 25, end: 30, lord: "Venus", outputIndex: 6 },
      ]
    : [
        { start: 0, end: 5, lord: "Venus", outputIndex: 1 },
        { start: 5, end: 12, lord: "Mercury", outputIndex: 5 },
        { start: 12, end: 20, lord: "Jupiter", outputIndex: 11 },
        { start: 20, end: 25, lord: "Saturn", outputIndex: 9 },
        { start: 25, end: 30, lord: "Mars", outputIndex: 7 },
      ];
  const part = Math.max(0, segments.findIndex((segment) => degree >= segment.start && degree < segment.end));
  const segment = segments[part] ?? segments[segments.length - 1];
  return {
    part,
    outputIndex: segment.outputIndex,
    partLabel: `${ordinal(part + 1)} trimshamsha`,
    rule: `${oddSign ? "odd" : "even"} sign uses the unequal D30 table; ${formatDegree(segment.start)}-${formatDegree(segment.end)} belongs to ${segment.lord}, giving ${SIGNS[segment.outputIndex].name}. Treat it as a tendency or growth-area, not doom`,
    lord: segment.lord,
    start: segment.start,
    end: segment.end,
  };
}

function calculateLineageVarga(signIndex: number, degree: number, lineageMode: LineageMode) {
  if (lineageMode === "d40") return calculateD40(signIndex, degree);
  return calculateD45(signIndex, degree);
}

function calculateD40(signIndex: number, degree: number) {
  const partSize = 30 / 40;
  const part = Math.min(39, Math.floor(degree / partSize));
  const oddSign = signIndex % 2 === 0;
  const startIndex = oddSign ? 0 : 6;
  const outputIndex = (startIndex + part) % 12;
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} khavedamsha`,
    rule: `${oddSign ? "odd sign starts from Mesha" : "even sign starts from Tula"}; then count ${part + 1} consecutive fine part${part === 0 ? "" : "s"}. Read D40 as maternal lineage through the 4th house and Moon, with D12 as the parent baseline`,
  };
}

function calculateD45(signIndex: number, degree: number) {
  const partSize = 30 / 45;
  const part = Math.min(44, Math.floor(degree / partSize));
  const signClass = getSignClass(signIndex);
  const outputIndex = (signClass.startIndex + part) % 12;
  return {
    part,
    outputIndex,
    partLabel: `${ordinal(part + 1)} akshavedamsha`,
    rule: `${signClass.label.toLowerCase()} sign starts from ${SIGNS[signClass.startIndex].name}; then count ${part + 1} consecutive fine part${part === 0 ? "" : "s"}. Read D45 as paternal lineage through the 9th house and Sun, with D12 as the parent baseline`,
  };
}

function D4Svg({ degree, signIndex, activePart }: { degree: number; signIndex: number; activePart: number }) {
  const markerX = 60 + (degree / 30) * 500;
  const targets = [signIndex, (signIndex + 3) % 12, (signIndex + 6) % 12, (signIndex + 9) % 12];

  return (
    <svg viewBox="0 0 620 320" role="img" aria-label="D4 four-part kendra mapping" style={svgStyle}>
      <rect x="34" y="34" width="552" height="240" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">One rashi split into four kendra parts</text>
      {["Same", "4th", "7th", "10th"].map((label, index) => {
        const target = SIGNS[targets[index]];
        const x = 60 + index * 125;
        const active = activePart === index;
        return (
          <g key={label}>
            <rect x={x} y="90" width="125" height="88" rx="8" fill={`${target.color}20`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.5} />
            <text x={x + 62.5} y="120" textAnchor="middle" fill={target.color} fontSize="14" fontWeight="750">{target.name}</text>
            <text x={x + 62.5} y="145" textAnchor="middle" fill={INK_SECONDARY} fontSize="11.5" fontWeight="650">{label}</text>
            <text x={x + 62.5} y="164" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{formatDegree(index * 7.5)}-{formatDegree((index + 1) * 7.5)}</text>
          </g>
        );
      })}
      <Marker x={markerX} degree={degree} />
      <text x="310" y="292" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="700">D4 maps to the angular pillars from the sign: 1, 4, 7, 10.</text>
    </svg>
  );
}

function D7Svg({ degree, signIndex, activePart }: { degree: number; signIndex: number; activePart: number }) {
  const markerX = 60 + (degree / 30) * 500;
  const partWidth = 500 / 7;
  const startIndex = signIndex % 2 === 0 ? signIndex : (signIndex + 6) % 12;

  return (
    <svg viewBox="0 0 620 330" role="img" aria-label="D7 seven-part odd even start mapping" style={svgStyle}>
      <rect x="34" y="34" width="552" height="250" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">Seven narrow parts; count from same sign or from the 7th</text>
      {Array.from({ length: 7 }).map((_, index) => {
        const target = SIGNS[(startIndex + index) % 12];
        const x = 60 + index * partWidth;
        const active = activePart === index;
        return (
          <g key={target.name + index}>
            <rect x={x} y="90" width={partWidth} height="92" rx="8" fill={`${target.color}20`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.25} />
            <text x={x + partWidth / 2} y="120" textAnchor="middle" fill={target.color} fontSize="11.8" fontWeight="700">{compactSignName(target.name)}</text>
            <text x={x + partWidth / 2} y="145" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="650">{ordinal(index + 1)}</text>
            <text x={x + partWidth / 2} y="164" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">~4 deg 17 min</text>
          </g>
        );
      })}
      <Marker x={markerX} degree={degree} />
      <text x="310" y="294" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="700">
        {signIndex % 2 === 0 ? "Odd sign: count from the same sign." : "Even sign: begin from the 7th sign, then continue."}
      </text>
    </svg>
  );
}

function D10Svg({ degree, signIndex, activePart, showRegister = false }: { degree: number; signIndex: number; activePart: number; showRegister?: boolean }) {
  const markerX = 60 + (degree / 30) * 500;
  const oddSign = signIndex % 2 === 0;
  const startIndex = oddSign ? signIndex : (signIndex + 8) % 12;
  const registerColor = oddSign ? GREEN : VERMILION;

  return (
    <svg viewBox="0 0 620 430" role="img" aria-label="D10 ten-part odd even start mapping" style={svgStyle}>
      <rect x="34" y="34" width="552" height="344" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">
        {showRegister ? `${oddSign ? "Odd sign: deva register" : "Even sign: asura register"} across ten dashamshas` : "Ten clean 3 degree parts; count from same sign or from the 9th"}
      </text>
      {Array.from({ length: 10 }).map((_, index) => {
        const target = SIGNS[(startIndex + index) % 12];
        const col = index % 5;
        const row = Math.floor(index / 5);
        const x = 60 + col * 100;
        const y = 94 + row * 94;
        const active = activePart === index;
        const fillColor = showRegister ? registerColor : target.color;
        return (
          <g key={target.name + index}>
            <rect x={x} y={y} width="88" height="76" rx="8" fill={`${fillColor}20`} stroke={active ? fillColor : `${fillColor}66`} strokeWidth={active ? 3 : 1.2} />
            <text x={x + 44} y={y + 27} textAnchor="middle" fill={target.color} fontSize="12" fontWeight="750">{compactSignName(target.name)}</text>
            <text x={x + 44} y={y + 49} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="650">{ordinal(index + 1)}</text>
            <text x={x + 44} y={y + 66} textAnchor="middle" fill={showRegister ? registerColor : INK_MUTED} fontSize="10.5" fontWeight={showRegister ? "700" : "400"}>
              {showRegister ? (oddSign ? "deva" : "asura") : "3 deg"}
            </text>
          </g>
        );
      })}
      <line x1={markerX} y1="78" x2={markerX} y2="292" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="78" r="8" fill={VERMILION} />
      <text x={markerX} y="316" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="392" textAnchor="middle" fill={INK_SECONDARY} fontSize="12.5" fontWeight="700">
        <tspan x="310">{oddSign ? "Odd sign: count from the same sign." : "Even sign: begin from the 9th dharma-counterpart."}</tspan>
        <tspan x="310" dy="17">{oddSign ? "Deva register is read as smoother texture." : "Asura register is effortful, not doomed."}</tspan>
      </text>
    </svg>
  );
}

function D12Svg({ degree, signIndex, activePart }: { degree: number; signIndex: number; activePart: number }) {
  const markerX = 60 + (degree / 30) * 500;

  return (
    <svg viewBox="0 0 620 430" role="img" aria-label="D12 twelve-part same sign forward mapping" style={svgStyle}>
      <rect x="34" y="34" width="552" height="344" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">Twelve 2 deg 30 min parts; count from the same sign</text>
      {Array.from({ length: 12 }).map((_, index) => {
        const target = SIGNS[(signIndex + index) % 12];
        const col = index % 6;
        const row = Math.floor(index / 6);
        const x = 50 + col * 86;
        const y = 94 + row * 94;
        const active = activePart === index;
        return (
          <g key={target.name + index}>
            <rect x={x} y={y} width="74" height="76" rx="8" fill={`${target.color}18`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.15} />
            <text x={x + 37} y={y + 27} textAnchor="middle" fill={target.color} fontSize="11.5" fontWeight="700">{compactSignName(target.name)}</text>
            <text x={x + 37} y={y + 49} textAnchor="middle" fill={INK_SECONDARY} fontSize="10.5" fontWeight="650">{ordinal(index + 1)}</text>
            <text x={x + 37} y={y + 66} textAnchor="middle" fill={INK_MUTED} fontSize="10">2 deg 30</text>
          </g>
        );
      })}
      <line x1={markerX} y1="78" x2={markerX} y2="292" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="78" r="8" fill={VERMILION} />
      <text x={markerX} y="316" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="392" textAnchor="middle" fill={INK_SECONDARY} fontSize="12.5" fontWeight="700">
        <tspan x="310">D12 parent reading: Sun plus 9th for father, Moon plus 4th for mother.</tspan>
        <tspan x="310" dy="17">D40/D45 refine lineage later.</tspan>
      </text>
    </svg>
  );
}

function D16Svg({ degree, signIndex, activePart }: { degree: number; signIndex: number; activePart: number }) {
  const signClass = getSignClass(signIndex);
  const markerX = 62 + (degree / 30) * 472;

  return (
    <svg viewBox="0 0 620 390" role="img" aria-label="D16 sixteen-part sign class start mapping" style={svgStyle}>
      <rect x="34" y="34" width="552" height="320" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">
        {signClass.label} sign: start from {SIGNS[signClass.startIndex].name}; sixteen fine parts
      </text>
      <line x1="62" y1="78" x2="534" y2="78" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      <line x1={markerX} y1="68" x2={markerX} y2="318" stroke={VERMILION} strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
      <circle cx={markerX} cy="78" r="8" fill={VERMILION} />
      {Array.from({ length: 16 }).map((_, index) => {
        const target = SIGNS[(signClass.startIndex + index) % 12];
        const col = index % 4;
        const row = Math.floor(index / 4);
        const x = 62 + col * 121;
        const y = 98 + row * 60;
        const active = activePart === index;
        return (
          <g key={target.name + index}>
            <rect x={x} y={y} width="108" height="46" rx="8" fill={`${target.color}18`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.15} />
            <text x={x + 54} y={y + 18} textAnchor="middle" fill={target.color} fontSize="11.5" fontWeight="700">{target.name}</text>
            <text x={x + 54} y={y + 35} textAnchor="middle" fill={INK_SECONDARY} fontSize="10.5" fontWeight="650">{ordinal(index + 1)} part</text>
          </g>
        );
      })}
      <text x={markerX} y="368" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="334" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="700">
        <tspan x="310">Read D16 with the D1 4th, Venus, and D4.</tspan>
        <tspan x="310" dy="19">Vehicles and movable comforts, not property alone.</tspan>
      </text>
    </svg>
  );
}

function D20Svg({ degree, signIndex, activePart }: { degree: number; signIndex: number; activePart: number }) {
  const signClass = getD20SignClass(signIndex);
  const markerX = 62 + (degree / 30) * 472;

  return (
    <svg viewBox="0 0 620 430" role="img" aria-label="D20 twenty-part spiritual sign class start mapping" style={svgStyle}>
      <rect x="34" y="34" width="552" height="360" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="58" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="800">
        <tspan x="310">{signClass.label} sign: start from {SIGNS[signClass.startIndex].name}</tspan>
        <tspan x="310" dy="18">Twenty spiritual-practice parts</tspan>
      </text>
      <line x1="62" y1="88" x2="534" y2="88" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      <line x1={markerX} y1="78" x2={markerX} y2="332" stroke={VERMILION} strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
      <circle cx={markerX} cy="88" r="8" fill={VERMILION} />
      {Array.from({ length: 20 }).map((_, index) => {
        const target = SIGNS[(signClass.startIndex + index) % 12];
        const col = index % 5;
        const row = Math.floor(index / 5);
        const x = 54 + col * 103;
        const y = 108 + row * 58;
        const active = activePart === index;
        return (
          <g key={target.name + index}>
            <rect x={x} y={y} width="92" height="48" rx="8" fill={`${target.color}18`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.1} />
            <text x={x + 46} y={y + 20} textAnchor="middle" fill={target.color} fontSize="14" fontWeight="750">{compactSignName(target.name)}</text>
            <text x={x + 46} y={y + 38} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="650">{ordinal(index + 1)} part</text>
          </g>
        );
      })}
      <text x={markerX} y="408" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="358" textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight="750">
        <tspan x="310">Read D20 with D1 spiritual houses, Jupiter, and Ketu.</tspan>
        <tspan x="310" dy="20">Keep practice distinct from D24 education and D60 karma.</tspan>
      </text>
    </svg>
  );
}

function D24Svg({ degree, signIndex, activePart }: { degree: number; signIndex: number; activePart: number }) {
  const oddSign = signIndex % 2 === 0;
  const startIndex = oddSign ? 4 : 3;
  const markerX = 62 + (degree / 30) * 472;

  return (
    <svg viewBox="0 0 620 430" role="img" aria-label="D24 twenty-four-part education light ruler start mapping" style={svgStyle}>
      <rect x="34" y="34" width="552" height="360" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">
        {oddSign ? "Odd sign: start from Simha" : "Even sign: start from Karka"}; twenty-four education parts
      </text>
      <line x1="62" y1="78" x2="534" y2="78" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      <line x1={markerX} y1="68" x2={markerX} y2="332" stroke={VERMILION} strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
      <circle cx={markerX} cy="78" r="8" fill={VERMILION} />
      {Array.from({ length: 24 }).map((_, index) => {
        const target = SIGNS[(startIndex + index) % 12];
        const col = index % 6;
        const row = Math.floor(index / 6);
        const x = 44 + col * 87;
        const y = 98 + row * 60;
        const active = activePart === index;
        return (
          <g key={target.name + index}>
            <rect x={x} y={y} width="78" height="46" rx="8" fill={`${target.color}18`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.05} />
            <text x={x + 39} y={y + 18} textAnchor="middle" fill={target.color} fontSize="10.8" fontWeight="700">{compactSignName(target.name)}</text>
            <text x={x + 39} y={y + 35} textAnchor="middle" fill={INK_SECONDARY} fontSize="10.8" fontWeight="650">{ordinal(index + 1)} part</text>
          </g>
        );
      })}
      <text x={markerX} y="408" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="358" textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight="750">
        <tspan x="310">Read D24 with D1 4th/5th, Mercury, and Jupiter.</tspan>
        <tspan x="310" dy="20">Siddhamsha here means scholarly accomplishment.</tspan>
      </text>
    </svg>
  );
}

function D27Svg({ degree, activePart, showElementVariant, variantStartIndex }: { degree: number; activePart: number; showElementVariant: boolean; variantStartIndex: number }) {
  const markerX = 62 + (degree / 30) * 472;
  const variantOutputIndex = (variantStartIndex + activePart) % 12;

  return (
    <svg viewBox="0 0 620 610" role="img" aria-label="D27 twenty-seven-part strength universal Aries start mapping" style={{ ...svgStyle, maxHeight: 620 }}>
      <rect x="34" y="34" width="552" height="520" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="60" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="750">
        Universal Aries Start
      </text>
      <text x="310" y="82" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="700">
        Twenty-seven strength and vitality parts
      </text>
      <line x1="62" y1="98" x2="534" y2="98" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      <line x1={markerX} y1="88" x2={markerX} y2="464" stroke={VERMILION} strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
      <circle cx={markerX} cy="98" r="8" fill={VERMILION} />
      {Array.from({ length: 27 }).map((_, index) => {
        const target = SIGNS[index % 12];
        const variantTarget = SIGNS[(variantStartIndex + index) % 12];
        const col = index % 6;
        const row = Math.floor(index / 6);
        const x = 52 + col * 86;
        const y = 120 + row * 72;
        const active = activePart === index;
        return (
          <g key={target.name + index}>
            <rect x={x} y={y} width="74" height="56" rx="8" fill={`${target.color}18`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3.2 : 1.2} />
            <text x={x + 37} y={y + 19} textAnchor="middle" fill={target.color} fontSize="13" fontWeight="700">{compactSignName(target.name)}</text>
            <text x={x + 37} y={y + 36} textAnchor="middle" fill={INK_PRIMARY} fontSize="11.5" fontWeight="650">{ordinal(index + 1)}</text>
            <text x={x + 37} y={y + 50} textAnchor="middle" fill={showElementVariant && active ? variantTarget.color : INK_SECONDARY} fontSize="11" fontWeight={showElementVariant && active ? "700" : "600"}>
              {showElementVariant && active ? compactSignName(variantTarget.name) : "~1d06"}
            </text>
          </g>
        );
      })}
      <text x={markerX} y="584" textAnchor="middle" fill={VERMILION} fontSize="14" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="494" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="700">
        <tspan x="310">D27 reads strength, stamina, vitality, and constitution.</tspan>
        <tspan x="310" dy="20">Pair it with D1 Lagna, Mars, and Sun.</tspan>
      </text>
      {showElementVariant ? (
        <text x="310" y="540" textAnchor="middle" fill={SIGNS[variantOutputIndex].color} fontSize="13" fontWeight="700">
          Element variant maps this part to {SIGNS[variantOutputIndex].name}.
        </text>
      ) : null}
    </svg>
  );
}

function D30Svg({ degree, signIndex, activePart }: { degree: number; signIndex: number; activePart: number }) {
  const oddSign = signIndex % 2 === 0;
  const segments = oddSign
    ? [
        { lord: "Mars", sign: 0, start: 0, width: 5 },
        { lord: "Saturn", sign: 10, start: 5, width: 5 },
        { lord: "Jupiter", sign: 8, start: 10, width: 8 },
        { lord: "Mercury", sign: 2, start: 18, width: 7 },
        { lord: "Venus", sign: 6, start: 25, width: 5 },
      ]
    : [
        { lord: "Venus", sign: 1, start: 0, width: 5 },
        { lord: "Mercury", sign: 5, start: 5, width: 7 },
        { lord: "Jupiter", sign: 11, start: 12, width: 8 },
        { lord: "Saturn", sign: 9, start: 20, width: 5 },
        { lord: "Mars", sign: 7, start: 25, width: 5 },
      ];
  const markerX = 60 + (degree / 30) * 500;

  return (
    <svg viewBox="0 0 620 370" role="img" aria-label="D30 unequal five-segment honest handling map" style={svgStyle}>
      <rect x="34" y="34" width="552" height="296" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900">
        {oddSign ? "Odd sign" : "Even sign"} D30: five unequal tara-graha segments
      </text>
      {segments.map((segment, index) => {
        const target = SIGNS[segment.sign];
        const x = 60 + (segment.start / 30) * 500;
        const width = (segment.width / 30) * 500;
        const active = activePart === index;
        return (
          <g key={segment.lord}>
            <rect x={x} y="98" width={width} height="112" rx="8" fill={`${target.color}18`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.15} />
            <text x={x + width / 2} y="128" textAnchor="middle" fill={target.color} fontSize="12" fontWeight="950">{segment.lord}</text>
            <text x={x + width / 2} y="153" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="900">{target.name}</text>
            <text x={x + width / 2} y="177" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="850">{formatDegree(segment.start)}-{formatDegree(segment.start + segment.width)}</text>
            <text x={x + width / 2} y="196" textAnchor="middle" fill={INK_MUTED} fontSize="10">{segment.width} deg</text>
          </g>
        );
      })}
      <line x1={markerX} y1="84" x2={markerX} y2="226" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="84" r="8" fill={VERMILION} />
      <text x={markerX} y="248" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="950">{formatDegree(degree)}</text>
      <text x="310" y="286" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="850">
        <tspan x="310">D30 flags vulnerabilities and character-shadow.</tspan>
        <tspan x="310" dy="16">Read with D1/D9 and the 6th/8th/12th.</tspan>
      </text>
      <text x="310" y="314" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="900">
        Tendency, not doom. No diagnosis, no mortality claim, no fear-based verdict.
      </text>
    </svg>
  );
}

function LineageVargaSvg({ degree, signIndex, activePart, lineageMode }: { degree: number; signIndex: number; activePart: number; lineageMode: LineageMode }) {
  const isD40 = lineageMode === "d40";
  const partCount = isD40 ? 40 : 45;
  const columns = isD40 ? 8 : 9;
  const startIndex = isD40 ? (signIndex % 2 === 0 ? 0 : 6) : getSignClass(signIndex).startIndex;
  const markerX = 62 + (degree / 30) * 472;
  const cellWidth = isD40 ? 62 : 55;
  const cellHeight = 50;
  const rowGap = 58;

  return (
    <svg viewBox="0 0 620 560" role="img" aria-label={`${lineageMode.toUpperCase()} lineage varga fine-part mapping`} style={{ ...svgStyle, maxHeight: 580 }}>
      <rect x="34" y="34" width="552" height="470" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="58" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="800">
        {isD40 ? "D40 Maternal Lineage" : "D45 Paternal Lineage"}
      </text>
      <text x="310" y="78" textAnchor="middle" fill={INK_MUTED} fontSize="12.5" fontWeight="800">
        {isD40 ? "Odd Mesha, even Tula" : "Movable Mesha, fixed Simha, dual Dhanu"}
      </text>
      <line x1="62" y1="94" x2="534" y2="94" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      <line x1={markerX} y1="84" x2={markerX} y2="424" stroke={VERMILION} strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
      <circle cx={markerX} cy="94" r="8" fill={VERMILION} />
      {Array.from({ length: partCount }).map((_, index) => {
        const target = SIGNS[(startIndex + index) % 12];
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = isD40 ? 48 + col * cellWidth : 44 + col * cellWidth;
        const y = 116 + row * rowGap;
        const active = activePart === index;
        return (
          <g key={target.name + index}>
            <rect x={x} y={y} width={cellWidth - 8} height={cellHeight} rx="8" fill={`${target.color}18`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.15} />
            <text x={x + (cellWidth - 8) / 2} y={y + 19} textAnchor="middle" fill={target.color} fontSize="10.8" fontWeight="700">{compactSignName(target.name)}</text>
            <text x={x + (cellWidth - 8) / 2} y={y + 38} textAnchor="middle" fill={INK_PRIMARY} fontSize="11.2" fontWeight="700">{index + 1}</text>
          </g>
        );
      })}
      <text x={markerX} y="536" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="456" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="750">
        <tspan x="310">{isD40 ? "Read with D40 4th, Moon, D12, and D1 4th." : "Read with D45 9th, Sun, D12, and D1 9th."}</tspan>
        <tspan x="310" dy="18">{isD40 ? "Maternal-line refinement, not a stand-alone verdict." : "Paternal-line refinement, not a stand-alone verdict."}</tspan>
      </text>
      <text x="310" y="494" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="750">
        Very fine varga: rectified time preferred; rough time means confirmation only.
      </text>
    </svg>
  );
}

function Marker({ x, degree }: { x: number; degree: number }) {
  return (
    <>
      <line x1={x} y1="78" x2={x} y2="196" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={x} cy="78" r="8" fill={VERMILION} />
      <text x={x} y="218" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="800">{formatDegree(degree)}</text>
    </>
  );
}

function ReadingCue({ color, mode, planet, outputName, doctrineCue, lineageMode = "d40" }: { color: string; mode: Mode; planet: string; outputName: string; doctrineCue?: string; lineageMode?: LineageMode }) {
  return (
    <section style={{ border: `1px solid ${color}66`, borderRadius: 8, background: `${color}10`, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
        {mode === "d7" ? <Baby size={18} /> : mode === "d10" ? <BriefcaseBusiness size={18} /> : mode === "d12" ? <UsersRound size={18} /> : mode === "d16" ? <Car size={18} /> : mode === "d20" ? <Landmark size={18} /> : mode === "d24" ? <GraduationCap size={18} /> : mode === "d27" ? <ShieldCheck size={18} /> : mode === "d30" ? <HeartPulse size={18} /> : mode === "d40d45" ? <UsersRound size={18} /> : <Home size={18} />}
        {mode === "d7" ? "Children reading cue" : mode === "d10" ? "Career reading cue" : mode === "d12" ? "Parents reading cue" : mode === "d16" ? "Comforts reading cue" : mode === "d20" ? "Practice reading cue" : mode === "d24" ? "Education reading cue" : mode === "d27" ? "Strength reading cue" : mode === "d30" ? "Honest D30 cue" : mode === "d40d45" ? "Lineage reading cue" : "Property reading cue"}
      </div>
      <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {mode === "d7"
          ? `${planet} maps to ${outputName} in D7. Read the D7 5th house, its lord, and Jupiter with the D1 5th and D9 support.`
          : mode === "d10"
            ? doctrineCue
              ? `${planet} maps to ${outputName} in D10. This register points to ${doctrineCue}. Hold it as texture and read it with dignity, never as a verdict.`
              : `${planet} maps to ${outputName} in D10. Read the D10 10th house, its lord, and Sun/Saturn, with Mercury and Mars by field, alongside the D1 10th.`
            : mode === "d12"
              ? `${planet} maps to ${outputName} in D12. Read Sun with the D12 9th for father and Moon with the D12 4th for mother, then compare the D1 9th/4th without confusing D12 with D40 or D45.`
              : mode === "d16"
                ? `${planet} maps to ${outputName} in D16. Read the D16 4th house, its lord, and Venus for vehicles and comforts, then pair the result with D1 4th-house support and the D4.`
                : mode === "d20"
                  ? `${planet} maps to ${outputName} in D20. Read the D20 5th for mantra and devata, the 9th for dharma, the 12th for moksha, with Jupiter and Ketu alongside the D1 spiritual houses.`
                  : mode === "d24"
                    ? `${planet} maps to ${outputName} in D24. Read the D24 4th for formal education and the 5th for intellect, with Mercury and Jupiter alongside the D1 4th/5th. Keep D24 distinct from D20 spiritual practice.`
                    : mode === "d27"
                      ? `${planet} maps to ${outputName} in D27 by the curriculum's universal Aries start. Read the D27 Lagna and its lord with Mars and Sun, alongside the D1 Lagna, for strength, stamina, vitality, and constitution.`
                      : mode === "d30"
                        ? `${planet} maps to ${outputName} in D30. This can name a vulnerability or character-shadow area to handle with care, but never a diagnosis, doom verdict, or mortality claim. Read it with D1/D9, dusthana factors, timing, and practical support.`
                        : mode === "d40d45"
                          ? lineageMode === "d40"
                            ? `${planet} maps to ${outputName} in D40. Read the D40 4th house and Moon with D12 and the D1 4th; this is maternal-line refinement, not a stand-alone ancestry verdict.`
                            : `${planet} maps to ${outputName} in D45. Read the D45 9th house and Sun with D12 and the D1 9th; this is paternal-line refinement, not a stand-alone ancestry verdict.`
          : `${planet} maps to ${outputName} in D4. Read the D4 4th house, its lord, Mars/Saturn for land, and Moon for home with the D1 4th.`}
      </p>
    </section>
  );
}

function EvidenceRow({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color: INK_SECONDARY, fontWeight: 650 }}>
      <BadgeCheck size={15} color={GREEN} aria-hidden="true" />
      {children}
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function formatDegree(value: number) {
  const degrees = Math.floor(value);
  const minutes = Math.round((value - degrees) * 60);
  if (minutes === 0) return `${degrees} deg`;
  return `${degrees} deg ${minutes} min`;
}

function compactSignName(name: string) {
  const labels: Record<string, string> = {
    Vrishabha: "Vrsab",
    Mithuna: "Mithu",
    Vrishchika: "Vrsch",
    Makara: "Makar",
    Kumbha: "Kumbh",
  };
  return labels[name] ?? name;
}

function ordinal(value: number) {
  const lastTwo = value % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function getSignClass(signIndex: number) {
  if ([0, 3, 6, 9].includes(signIndex)) return { label: "Movable", startIndex: 0 };
  if ([1, 4, 7, 10].includes(signIndex)) return { label: "Fixed", startIndex: 4 };
  return { label: "Dual", startIndex: 8 };
}

function getD20SignClass(signIndex: number) {
  if ([0, 3, 6, 9].includes(signIndex)) return { label: "Movable", startIndex: 0 };
  if ([1, 4, 7, 10].includes(signIndex)) return { label: "Fixed", startIndex: 8 };
  return { label: "Dual", startIndex: 4 };
}

function getD27ElementStart(signIndex: number) {
  if ([0, 4, 8].includes(signIndex)) return { element: "Fire sign", startIndex: 0 };
  if ([1, 5, 9].includes(signIndex)) return { element: "Earth sign", startIndex: 3 };
  if ([2, 6, 10].includes(signIndex)) return { element: "Air sign", startIndex: 6 };
  return { element: "Water sign", startIndex: 9 };
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function signButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.48rem 0.5rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const svgStyle: CSSProperties = {
  width: "100%",
  maxHeight: 450,
  margin: "0.8rem auto",
  display: "block",
};

const selectStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.72)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 700,
};

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  overflow: "hidden",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
