"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  Info,
  RefreshCcw,
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
const PURPLE = "#6B5AA8";
const MUTED_FILL = "#F7F1E7";

type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
type Stream = "parashari" | "jaimini";
type RudraMode = "primary" | "refinement";
type MaheshvaraMode = "primary" | "override-a" | "override-b" | "alternate";

const PLANETS: Record<PlanetKey, { label: string; short: string; degree: number; color: string }> = {
  mars: { label: "Mars", short: "Ma", degree: 24, color: VERMILION },
  saturn: { label: "Saturn", short: "Sa", degree: 21, color: PURPLE },
  moon: { label: "Moon", short: "Mo", degree: 18, color: BLUE },
  mercury: { label: "Mercury", short: "Me", degree: 14, color: GREEN },
  sun: { label: "Sun", short: "Su", degree: 11, color: GOLD },
  venus: { label: "Venus", short: "Ve", degree: 7, color: GOLD },
  jupiter: { label: "Jupiter", short: "Ju", degree: 4, color: GREEN },
};

const PLANET_ORDER: PlanetKey[] = ["mars", "saturn", "moon", "mercury", "sun", "venus", "jupiter"];
const AK_ANSWER: PlanetKey = "mars";

const SIGNS = [
  { key: "ari", label: "Aries", lord: "mars" as PlanetKey },
  { key: "tau", label: "Taurus", lord: "venus" as PlanetKey },
  { key: "gem", label: "Gemini", lord: "mercury" as PlanetKey },
  { key: "can", label: "Cancer", lord: "moon" as PlanetKey },
  { key: "leo", label: "Leo", lord: "sun" as PlanetKey },
  { key: "vir", label: "Virgo", lord: "mercury" as PlanetKey },
  { key: "lib", label: "Libra", lord: "venus" as PlanetKey },
  { key: "sco", label: "Scorpio", lord: "mars" as PlanetKey },
  { key: "sag", label: "Sagittarius", lord: "jupiter" as PlanetKey },
  { key: "cap", label: "Capricorn", lord: "saturn" as PlanetKey },
  { key: "aqu", label: "Aquarius", lord: "saturn" as PlanetKey },
  { key: "pis", label: "Pisces", lord: "jupiter" as PlanetKey },
];

function signOffset(fromIndex: number, offset: number) {
  return (fromIndex + offset) % 12;
}

function lordOfHouse(fromSignIndex: number, offset: number) {
  return SIGNS[signOffset(fromSignIndex, offset - 1)].lord;
}

export function JaiminiRudraMaheshvaraExplorer() {
  const [stream, setStream] = useState<Stream>("jaimini");
  const [akSelected, setAkSelected] = useState<PlanetKey | null>(null);
  const [showAkFeedback, setShowAkFeedback] = useState(false);
  const [rudraMode, setRudraMode] = useState<RudraMode>("primary");
  const [rudraStronger, setRudraStronger] = useState<"second" | "eighth">("eighth");
  const [maheshvaraMode, setMaheshvaraMode] = useState<MaheshvaraMode>("primary");
  const [akSignIndex, setAkSignIndex] = useState(7); // Scorpio
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const reset = () => {
    setStream("jaimini");
    setAkSelected(null);
    setShowAkFeedback(false);
    setRudraMode("primary");
    setRudraStronger("eighth");
    setMaheshvaraMode("primary");
    setAkSignIndex(7);
    setOpenMistakes({});
  };

  const toggleMistake = (index: number) => setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const akSign = SIGNS[akSignIndex];
  const eighthLord = lordOfHouse(akSignIndex, 8);
  const twelfthLord = lordOfHouse(akSignIndex, 12);
  const sixthLord = lordOfHouse(akSignIndex, 6);

  let maheshvaraPlanet: PlanetKey = eighthLord;
  let maheshvaraLabel = `${PLANETS[eighthLord].label} — lord of 8th from AK`;
  let maheshvaraNote = "Primary rule: count 8 houses from the AK's sign and take that lord.";

  if (maheshvaraMode === "override-a") {
    maheshvaraPlanet = twelfthLord;
    maheshvaraLabel = `${PLANETS[twelfthLord].label} — 12th-from-AK lord (override a)`;
    maheshvaraNote = "Override (a): if the 8th-from-AK lord is placed in the 8th-from-AK, use the 12th-from-AK lord instead.";
  } else if (maheshvaraMode === "override-b") {
    maheshvaraPlanet = sixthLord;
    maheshvaraLabel = `${PLANETS[sixthLord].label} — 6th-from-AK lord (override b)`;
    maheshvaraNote = "Override (b): if Rāhu/Ketu occupies 1st or 8th from AK, use the 6th-from-AK lord instead.";
  } else if (maheshvaraMode === "alternate") {
    maheshvaraPlanet = eighthLord;
    maheshvaraLabel = `${PLANETS[eighthLord].label} — 8th-from-AK lord, confirmed by own/exaltation dignity`;
    maheshvaraNote = "Alternate procedure: some sources confirm the 8th-from-AK lord only if it is in own or exalted sign; otherwise compare the 6th, 8th, and 12th lords by strength.";
  }

  return (
    <div data-interactive="jaimini-rudra-maheshvara-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Jaimini longevity significators</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Rudra and Maheśvara — identification with honest source accounting
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              A kāraka-based lens on longevity-relevant planets: find the Ātmakāraka, then derive Rudra from the lagna and Maheśvara from the AK — while holding documented source disagreement openly.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, PURPLE)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Structural comparison</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: stream === "parashari" ? BLUE : PURPLE, fontSize: "1.1rem", fontWeight: 600 }}>
          Parāśarī house-lordship versus Jaimini kāraka-based
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <button type="button" aria-pressed={stream === "parashari"} onClick={() => setStream("parashari")} style={smallChipStyle(stream === "parashari", BLUE)}>
            Parāśarī maraka
          </button>
          <button type="button" aria-pressed={stream === "jaimini"} onClick={() => setStream("jaimini")} style={smallChipStyle(stream === "jaimini", PURPLE)}>
            Jaimini Rudra / Maheśvara
          </button>
        </div>
        <StreamSvg stream={stream} />
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
          {stream === "parashari"
            ? "Parāśarī identifies marakas mechanically: whoever rules the 2nd or 7th from the lagna is a maraka, for every chart."
            : "Jaimini starts from the Ātmakāraka, a chart-specific significator found by degree. Rudra compares the 2nd/8th lords by strength; Maheśvara counts from the AK's sign."}
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Ātmakāraka trainer</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Identify the soul-significator by degree-within-sign
        </h3>
        <AkSvg selected={akSelected} answer={AK_ANSWER} showFeedback={showAkFeedback} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 90px), 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
          {PLANET_ORDER.map((key) => {
            const planet = PLANETS[key];
            const isSelected = akSelected === key;
            return (
              <button key={key} type="button" aria-pressed={isSelected} onClick={() => { setAkSelected(key); setShowAkFeedback(true); }} style={chipStyle(isSelected, planet.color)}>
                <span style={{ fontWeight: 600 }}>{planet.label}</span>
                <span style={{ fontSize: "0.78rem", color: INK_MUTED, fontWeight: 500 }}>{planet.degree}°</span>
              </button>
            );
          })}
        </div>
        {showAkFeedback && akSelected && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${akSelected === AK_ANSWER ? GREEN : VERMILION}55`, background: `${akSelected === AK_ANSWER ? GREEN : VERMILION}10` }}>
            <p style={{ margin: 0, color: akSelected === AK_ANSWER ? GREEN : VERMILION, fontWeight: 500 }}>
              {akSelected === AK_ANSWER
                ? "Correct — Mars has the highest degree-within-sign, so Mars is the Ātmakāraka."
                : `Not quite — ${PLANETS[akSelected].label} is ${PLANETS[akSelected].degree}°, but Mars at ${PLANETS[AK_ANSWER].degree}° is higher. Mars is the AK.`}
            </p>
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Rudra inspector</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          Stronger of the 2nd and 8th lords from the lagna
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <button type="button" aria-pressed={rudraMode === "primary"} onClick={() => setRudraMode("primary")} style={smallChipStyle(rudraMode === "primary", VERMILION)}>
            Primary rule
          </button>
          <button type="button" aria-pressed={rudraMode === "refinement"} onClick={() => setRudraMode("refinement")} style={smallChipStyle(rudraMode === "refinement", GOLD)}>
            Documented refinement
          </button>
        </div>
        <RudraSvg stronger={rudraStronger} mode={rudraMode} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button type="button" aria-pressed={rudraStronger === "second"} onClick={() => setRudraStronger("second")} style={smallChipStyle(rudraStronger === "second", GREEN)}>
            2nd lord stronger
          </button>
          <button type="button" aria-pressed={rudraStronger === "eighth"} onClick={() => setRudraStronger("eighth")} style={smallChipStyle(rudraStronger === "eighth", VERMILION)}>
            8th lord stronger
          </button>
        </div>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${rudraMode === "primary" ? VERMILION : GOLD}55`, background: `${rudraMode === "primary" ? VERMILION : GOLD}10` }}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
            {rudraMode === "primary"
              ? `Primary rule: Rudra = the stronger of the 2nd-lord and 8th-lord from the lagna. Here the 8th lord is stronger, so Rudra is Saturn. This simplified Prāṇi Rudra form is the one recommended for longevity work.`
              : `Refinement variance: some sources say the weaker candidate can become Rudra if heavily afflicted by malefics, or that a malefic candidate is preferred when the two split benefic/malefic. This curriculum treats that as a documented secondary check, not an override of the primary strength rule.`}
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Maheśvara inspector</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
          Lord of the 8th house counted from the AK&apos;s sign
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
          {SIGNS.map((sign, index) => (
            <button key={sign.key} type="button" aria-pressed={akSignIndex === index} onClick={() => setAkSignIndex(index)} style={smallChipStyle(akSignIndex === index, akSignIndex === index ? PLANETS[sign.lord].color : INK_MUTED)}>
              {sign.label} (lord: {PLANETS[sign.lord].label})
            </button>
          ))}
        </div>
        <MaheshvaraSvg akSignIndex={akSignIndex} mode={maheshvaraMode} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button type="button" aria-pressed={maheshvaraMode === "primary"} onClick={() => setMaheshvaraMode("primary")} style={smallChipStyle(maheshvaraMode === "primary", BLUE)}>
            Primary
          </button>
          <button type="button" aria-pressed={maheshvaraMode === "override-a"} onClick={() => setMaheshvaraMode("override-a")} style={smallChipStyle(maheshvaraMode === "override-a", GOLD)}>
            Override (a)
          </button>
          <button type="button" aria-pressed={maheshvaraMode === "override-b"} onClick={() => setMaheshvaraMode("override-b")} style={smallChipStyle(maheshvaraMode === "override-b", VERMILION)}>
            Override (b)
          </button>
          <button type="button" aria-pressed={maheshvaraMode === "alternate"} onClick={() => setMaheshvaraMode("alternate")} style={smallChipStyle(maheshvaraMode === "alternate", PURPLE)}>
            Alternate procedure
          </button>
        </div>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${PLANETS[maheshvaraPlanet].color}55`, background: `${PLANETS[maheshvaraPlanet].color}10` }}>
          <p style={{ margin: 0, color: PLANETS[maheshvaraPlanet].color, fontWeight: 500 }}>
            AK in {akSign.label} → 8th from AK is {SIGNS[signOffset(akSignIndex, 7)].label} (lord {PLANETS[eighthLord].label}). {maheshvaraLabel}.
          </p>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
            {maheshvaraNote}
          </p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={{ ...cardStyle, background: `${GOLD}0A` }}>
          <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
            <Scale size={20} aria-hidden="true" style={{ color: GOLD, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, color: GOLD, fontWeight: 600 }}>Source-honesty note</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                Secondary sources agree on the primary rules but disagree on refinements — especially Maheśvara. This curriculum presents both documented procedures honestly rather than resolving the disagreement by fiat. Lesson 7.5.2 applies both to Chart H1.
              </p>
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, background: `${BLUE}0A` }}>
          <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
            <BookOpen size={20} aria-hidden="true" style={{ color: BLUE, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, color: BLUE, fontWeight: 600 }}>Scope boundary</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                This lesson teaches Rudra and Maheśvara as longevity-relevant significators only. Brahma and the full Brahma-Rudra-Maheśvara Sthira Daśā timing system belong to the dedicated daśā-systems module and are out of scope here.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          Three ways this doctrine is mishandled
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {[
            {
              label: "Treating Rudra/Maheśvara identification as identical to Parāśarī maraka identification",
              wrong: "Applying Chapter 4's house-lordship-only method and calling it Rudra, or looking for Maheśvara from the lagna instead of the AK.",
              right: "Hold the structural distinction: Parāśarī maraka is mechanical house-lordship; Jaimini Rudra requires a strength comparison; Jaimini Maheśvara is computed from the AK.",
            },
            {
              label: "Expanding this chapter's scope to the full Sthira Daśā system",
              wrong: "After learning Rudra and Maheśvara, attempting to also compute Brahma and build a full Sthira Daśā timeline.",
              right: "Hold the explicit scope boundary — Brahma and Sthira Daśā belong to this curriculum's dedicated daśā-systems module, not here.",
            },
            {
              label: "Presenting the Maheśvara refinement variance as resolved",
              wrong: "Picking one documented Maheśvara refinement procedure and applying it as if it were the only one, without acknowledging the other.",
              right: "Teach both documented procedures and show what happens when both are actually applied, as Lesson 7.5.2 does.",
            },
          ].map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button type="button" onClick={() => toggleMistake(index)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}>
                      <span style={{ fontWeight: 600 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 600, color: GREEN }}>Honest reading:</span> {item.right}
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

function StreamSvg({ stream }: { stream: Stream }) {
  const parashariActive = stream === "parashari";
  const parashariOpacity = parashariActive ? 1 : 0;
  const jaiminiOpacity = parashariActive ? 0 : 1;
  return (
    <svg
      viewBox="0 0 560 200"
      role="img"
      aria-label="Parashari versus Jaimini structural comparison"
      style={{ display: "block", width: "min(100%, 680px)", margin: "0.75rem auto 0" }}
    >
      <rect x="24" y="30" width="512" height="140" rx="8" fill={`${parashariActive ? BLUE : PURPLE}0F`} stroke={HAIRLINE} />
      <g opacity={parashariOpacity}>
      <rect x="50" y="70" width="110" height="70" rx="6" fill={parashariActive ? `${BLUE}18` : MUTED_FILL} stroke={parashariActive ? BLUE : HAIRLINE} />
      <text x="105" y="100" textAnchor="middle" fill={parashariActive ? BLUE : INK_MUTED} fontSize="13" fontWeight={600}>Lagna</text>
      <text x="105" y="120" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={500}>starting point</text>
      <path d="M 170 105 L 230 105" stroke={parashariActive ? BLUE : HAIRLINE} strokeWidth={parashariActive ? 4 : 2} strokeLinecap="round" />
      <rect x="240" y="65" width="120" height="80" rx="6" fill={parashariActive ? `${BLUE}18` : MUTED_FILL} stroke={parashariActive ? BLUE : HAIRLINE} />
      <text x="300" y="95" textAnchor="middle" fill={parashariActive ? BLUE : INK_MUTED} fontSize="13" fontWeight={600}>House lordship</text>
      <text x="300" y="115" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={500}>2nd / 7th rulers</text>
      <text x="300" y="132" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={500}>mechanical</text>
      <path d="M 370 105 L 430 105" stroke={parashariActive ? BLUE : HAIRLINE} strokeWidth={parashariActive ? 4 : 2} strokeLinecap="round" />
      <rect x="440" y="70" width="80" height="70" rx="6" fill={parashariActive ? `${BLUE}18` : MUTED_FILL} stroke={parashariActive ? BLUE : HAIRLINE} />
      <text x="480" y="100" textAnchor="middle" fill={parashariActive ? BLUE : INK_MUTED} fontSize="13" fontWeight={600}>Maraka</text>
      <text x="480" y="120" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={500}>every chart</text>
      </g>

      <g opacity={jaiminiOpacity}>
        <rect x="50" y="70" width="110" height="70" rx="6" fill={`${PURPLE}18`} stroke={PURPLE} />
        <text x="105" y="96" textAnchor="middle" fill={PURPLE} fontSize="12" fontWeight={600}>Degree</text>
        <text x="105" y="112" textAnchor="middle" fill={PURPLE} fontSize="12" fontWeight={600}>ranking</text>
        <text x="105" y="132" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={500}>find AK</text>
        <path d="M 170 105 L 230 105" stroke={PURPLE} strokeWidth={4} strokeLinecap="round" />
        <rect x="240" y="65" width="120" height="86" rx="6" fill={`${PURPLE}18`} stroke={PURPLE} />
        <text x="300" y="95" textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight={600}>Kāraka status</text>
        <text x="300" y="120" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>2nd/8th strength</text>
        <text x="300" y="137" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>8th from AK</text>
        <path d="M 370 105 L 430 105" stroke={PURPLE} strokeWidth={4} strokeLinecap="round" />
        <rect x="440" y="70" width="80" height="70" rx="6" fill={`${PURPLE}18`} stroke={PURPLE} />
        <text x="480" y="100" textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight={600}>Rudra /</text>
        <text x="480" y="118" textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight={600}>Maheśvara</text>
        <text x="480" y="135" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>chart-specific</text>
      </g>
    </svg>
  );
}

function AkSvg({ selected, answer, showFeedback }: { selected: PlanetKey | null; answer: PlanetKey; showFeedback: boolean }) {
  const sorted = PLANET_ORDER.map((key) => PLANETS[key]);
  const maxDegree = Math.max(...sorted.map((p) => p.degree));
  return (
    <svg viewBox="0 0 560 160" role="img" aria-label="Atmakaraka degree ranking">
      <rect x="24" y="20" width="512" height="120" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      {sorted.map((planet, index) => {
        const key = PLANET_ORDER[index];
        const isAnswer = key === answer;
        const isSelected = key === selected;
        const showCorrect = showFeedback && isAnswer;
        const showWrong = showFeedback && isSelected && !isAnswer;
        const barHeight = Math.max(12, (planet.degree / maxDegree) * 56);
        const x = 52 + index * 66;
        return (
          <g key={key} transform={`translate(${x} 90)`}>
            <rect x="0" y={-barHeight} width="44" height={barHeight} rx="6" fill={showWrong ? VERMILION : showCorrect ? GREEN : planet.color} opacity={showCorrect ? 1 : 0.85} stroke={isSelected ? INK_PRIMARY : "none"} strokeWidth={isSelected ? 2 : 0} />
            <text x="22" y={-barHeight - 8} textAnchor="middle" fill={showCorrect ? GREEN : showWrong ? VERMILION : INK_MUTED} fontSize="11" fontWeight={600}>{planet.degree}°</text>
            <text x="22" y="20" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>{planet.short}</text>
          </g>
        );
      })}
      <text x="280" y="140" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={500}>Highest degree-within-sign is Ātmakāraka</text>
    </svg>
  );
}

function RudraSvg({ stronger, mode }: { stronger: "second" | "eighth"; mode: RudraMode }) {
  const secondColor = stronger === "second" ? VERMILION : INK_MUTED;
  const eighthColor = stronger === "eighth" ? VERMILION : INK_MUTED;
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="Rudra strength comparison">
      <rect x="24" y="30" width="512" height="160" rx="8" fill={`${VERMILION}0F`} stroke={HAIRLINE} />
      <circle cx="145" cy="110" r={stronger === "second" ? 52 : 42} fill={`${secondColor}18`} stroke={secondColor} strokeWidth={4} />
      <text x="145" y="100" textAnchor="middle" fill={secondColor} fontSize="14" fontWeight={600}>2nd lord</text>
      <text x="145" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Mercury</text>
      <circle cx="415" cy="110" r={stronger === "eighth" ? 52 : 42} fill={`${eighthColor}18`} stroke={eighthColor} strokeWidth={4} />
      <text x="415" y="100" textAnchor="middle" fill={eighthColor} fontSize="14" fontWeight={600}>8th lord</text>
      <text x="415" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Saturn</text>
      <path d="M 197 110 C 255 110, 305 110, 363 110" fill="none" stroke={VERMILION} strokeWidth={4} strokeLinecap="round" />
      <text x="280" y="90" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight={600}>compare strength</text>
      {mode === "refinement" && (
        <g>
          <text x="280" y="165" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={500}>Refinement: weaker candidate, or malefic, may be considered in some sources</text>
        </g>
      )}
    </svg>
  );
}

function MaheshvaraSvg({ akSignIndex, mode }: { akSignIndex: number; mode: MaheshvaraMode }) {
  const signs = Array.from({ length: 12 }, (_, i) => SIGNS[(akSignIndex + i) % 12]);
  const radius = 92;
  const cx = 280;
  const cy = 130;
  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="Maheshvara 8th from AK counting">
      <rect x="24" y="20" width="512" height="220" rx="8" fill={`${BLUE}0F`} stroke={HAIRLINE} />
      {signs.map((sign, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const isAk = i === 0;
        const isEighth = i === 7;
        const isTwelfth = mode === "override-a" && i === 11;
        const isSixth = mode === "override-b" && i === 5;
        let fill = MUTED_FILL;
        let stroke = HAIRLINE;
        if (isAk) { fill = `${GOLD}22`; stroke = GOLD; }
        else if (isEighth) { fill = `${BLUE}22`; stroke = BLUE; }
        else if (isTwelfth || isSixth) { fill = `${VERMILION}22`; stroke = VERMILION; }
        return (
          <g key={sign.key}>
            <circle cx={x} cy={y} r={22} fill={fill} stroke={stroke} strokeWidth={isAk || isEighth || isTwelfth || isSixth ? 3 : 1} />
            <text x={x} y={y - 3} textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>{sign.label.slice(0, 3)}</text>
            <text x={x} y={y + 9} textAnchor="middle" fill={PLANETS[sign.lord].color} fontSize="9" fontWeight={500}>{PLANETS[sign.lord].short}</text>
            {i === 0 && <text x={x} y={y + 22} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={600}>AK</text>}
            {i === 7 && <text x={x} y={y + 22} textAnchor="middle" fill={BLUE} fontSize="9" fontWeight={600}>8th</text>}
            {(i === 11 && mode === "override-a") && <text x={x} y={y + 22} textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>12th</text>}
            {(i === 5 && mode === "override-b") && <text x={x} y={y + 22} textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>6th</text>}
          </g>
        );
      })}
      <text x="280" y="245" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={500}>Count 8 houses from the AK sign; its lord is Maheśvara in the primary form</text>
    </svg>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
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
    fontWeight: 600,
    cursor: "pointer",
  };
}

function chipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.2rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_PRIMARY,
    padding: "0.55rem 0.45rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};
