"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Baby,
  CheckCircle2,
  MapPin,
  RotateCcw,
  Scale,
  Star,
  Target,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type PlanetKey = "saturn" | "jupiter" | "mars" | "sun" | "venus" | "mercury" | "moon" | "rahu" | "ketu";

const PLANETS: Record<PlanetKey, { label: string; short: string; color: string; years: number }> = {
  saturn: { label: "Saturn", short: "Sa", color: PURPLE, years: 19 },
  jupiter: { label: "Jupiter", short: "Ju", color: GREEN, years: 16 },
  mars: { label: "Mars", short: "Ma", color: VERMILION, years: 7 },
  sun: { label: "Sun", short: "Su", color: GOLD, years: 6 },
  venus: { label: "Venus", short: "Ve", color: GOLD, years: 20 },
  mercury: { label: "Mercury", short: "Me", color: GREEN, years: 17 },
  moon: { label: "Moon", short: "Mo", color: BLUE, years: 10 },
  rahu: { label: "Rāhu", short: "Ra", color: VERMILION, years: 18 },
  ketu: { label: "Ketu", short: "Ke", color: BLUE, years: 7 },
};

const ROLE_LABELS_SEVEN = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];

const NAKSHATRAS = [
  { name: "Aśvinī", lord: "ketu" },
  { name: "Bharaṇī", lord: "venus" },
  { name: "Kṛttikā", lord: "sun" },
  { name: "Rohiṇī", lord: "moon" },
  { name: "Mṛgaśīrṣa", lord: "mars" },
  { name: "Ārdrā", lord: "rahu" },
  { name: "Punarvasu", lord: "jupiter" },
  { name: "Puṣya", lord: "saturn" },
  { name: "Āśleṣā", lord: "mercury" },
  { name: "Maghā", lord: "ketu" },
  { name: "Pūrvaphalgunī", lord: "venus" },
  { name: "Uttaraphalgunī", lord: "sun" },
  { name: "Hasta", lord: "moon" },
  { name: "Citrā", lord: "mars" },
  { name: "Svātī", lord: "rahu" },
  { name: "Viśākhā", lord: "jupiter" },
  { name: "Anurādhā", lord: "saturn" },
  { name: "Jyeṣṭhā", lord: "mercury" },
  { name: "Mūla", lord: "ketu" },
  { name: "Pūrvāṣāḍhā", lord: "venus" },
  { name: "Uttarāṣāḍhā", lord: "sun" },
  { name: "Śravaṇa", lord: "moon" },
  { name: "Dhaniṣṭhā", lord: "mars" },
  { name: "Śatabhiṣaj", lord: "rahu" },
  { name: "Pūrvabhādrapadā", lord: "jupiter" },
  { name: "Uttarabhādrapadā", lord: "saturn" },
  { name: "Revatī", lord: "mercury" },
] as const;

const SUB_LORD_SEQUENCE: PlanetKey[] = ["mercury", "ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn"];

function toArcminutes(degrees: number) {
  return degrees * 60;
}

function formatDms(degrees: number) {
  const d = Math.floor(degrees);
  const mFull = (degrees - d) * 60;
  const m = Math.floor(mFull);
  return `${d}°${m.toString().padStart(2, "0")}′`;
}

function computeCsl(signIndex: number, degreeInSign: number) {
  const totalDegrees = signIndex * 30 + degreeInSign;
  const totalArcminutes = toArcminutes(totalDegrees);
  const nakshatraIndex = Math.floor(totalArcminutes / 800) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const offsetInNakshatra = totalArcminutes % 800;

  // sub-lord cycle starts at star-lord
  const startIndex = SUB_LORD_SEQUENCE.findIndex((p) => p === nakshatra.lord);
  const cycle: PlanetKey[] = [];
  for (let i = 0; i < 9; i += 1) {
    cycle.push(SUB_LORD_SEQUENCE[(startIndex + i) % 9]);
  }
  let cursor = 0;
  let csl: PlanetKey = cycle[0];
  for (const lord of cycle) {
    const span = (PLANETS[lord].years / 120) * 800;
    if (offsetInNakshatra >= cursor && offsetInNakshatra < cursor + span) {
      csl = lord;
      break;
    }
    cursor += span;
  }
  return { totalDegrees, nakshatraIndex, nakshatra, offsetInNakshatra, csl };
}

const DEFAULT_DEGREES: Record<PlanetKey, number> = {
  saturn: 28 + 40 / 60,
  venus: 24 + 15 / 60,
  jupiter: 20 + 50 / 60,
  moon: 16 + 5 / 60,
  mercury: 11 + 30 / 60,
  mars: 8 + 45 / 60,
  sun: 3 + 20 / 60,
  rahu: 9 + 15 / 60,
  ketu: 15,
};

export function JaiminiKpChildrenSynthesisBench() {
  const [degrees, setDegrees] = useState<Record<PlanetKey, number>>(DEFAULT_DEGREES);
  const [cuspSign, setCuspSign] = useState(7); // Scorpio index 0 = Aries; 7 = Scorpio
  const [cuspDegree, setCuspDegree] = useState(26 + 50 / 60);
  const [jupiterInNinth, setJupiterInNinth] = useState(true);
  const [jupiterOwnSign, setJupiterOwnSign] = useState(true);
  const [jupiterAspectsFifth, setJupiterAspectsFifth] = useState(true);
  const [fifthLordStrong, setFifthLordStrong] = useState(true);
  const [d7Clean, setD7Clean] = useState(true);
  const [noCountGender, setNoCountGender] = useState(true);
  const [nonFatalistic, setNonFatalistic] = useState(true);

  const sevenRanked = useMemo(() => {
    const included = (Object.keys(PLANETS) as PlanetKey[]).filter((key) => key !== "rahu");
    return included
      .map((key) => ({ key, ...PLANETS[key], rankingDegree: degrees[key] }))
      .sort((a, b) => b.rankingDegree - a.rankingDegree);
  }, [degrees]);

  const eightRanked = useMemo(() => {
    const included = Object.keys(PLANETS) as PlanetKey[];
    return included
      .map((key) => ({ key, ...PLANETS[key], rankingDegree: key === "rahu" ? 30 - degrees[key] : degrees[key] }))
      .sort((a, b) => b.rankingDegree - a.rankingDegree);
  }, [degrees]);

  const pkSeven = sevenRanked[4];
  const pkEight = eightRanked[4];
  const cslResult = useMemo(() => computeCsl(cuspSign, cuspDegree), [cuspSign, cuspDegree]);

  const jupiterConvergence = cslResult.csl === "jupiter" && jupiterInNinth && jupiterOwnSign && jupiterAspectsFifth;
  const registerCount = [jupiterConvergence, fifthLordStrong, d7Clean, pkSeven.key === "mercury"].filter(Boolean).length;
  const allGuards = noCountGender && nonFatalistic;

  const synthesis = useMemo(() => {
    if (!allGuards) {
      return "Enable the non-fatalistic framing and the count/gender refusal before presenting the synthesis.";
    }
    const pkText = `7-karaka PK is ${PLANETS[pkSeven.key].label}; the 8-karaka scheme gives ${PLANETS[pkEight.key].label} as PK.`;
    const cslText = `The 5th cusp at ${formatDms(cuspDegree)} ${signName(cuspSign)} falls in ${cslResult.nakshatra.name} (star-lord ${PLANETS[cslResult.nakshatra.lord].label}), making ${PLANETS[cslResult.csl].label} the CSL.`;
    const convergenceText = jupiterConvergence
      ? "Jupiter is both the CSL and the D1 saṁtāna-kāraka, and it aspects the 5th — a rare triple convergence."
      : "The CSL and Jupiter convergence is partial or absent; weigh the registers honestly.";
    const otherText = `${registerCount} of 4 core registers align strongly.`;
    const frameText = "Frame this as a strong indication, never a count, gender, guarantee, or medical verdict.";
    return `${pkText} ${cslText} ${convergenceText} ${otherText} ${frameText}`;
  }, [allGuards, cslResult, cuspDegree, cuspSign, jupiterConvergence, pkSeven.key, pkEight.key, registerCount]);

  function updateDegree(key: PlanetKey, value: number) {
    setDegrees((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setDegrees(DEFAULT_DEGREES);
    setCuspSign(7);
    setCuspDegree(26 + 50 / 60);
    setJupiterInNinth(true);
    setJupiterOwnSign(true);
    setJupiterAspectsFifth(true);
    setFifthLordStrong(true);
    setD7Clean(true);
    setNoCountGender(true);
    setNonFatalistic(true);
  }

  return (
    <div data-interactive="jaimini-kp-children-synthesis-bench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Jaimini + KP worked example</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.32rem", fontWeight: 600 }}>
              Compute PK, 5th CSL, and synthesise across registers
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Reproduce the worked example: rank degrees to find the PK in both schemes, derive the 5th cuspal sub-lord from a longitude, and weigh the Jupiter kāraka-CSL-aspect convergence.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>PK computation</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
            Edit the degrees to see the 7- and 8-kāraka rankings update. Rāhu uses reverse degree (30° − value) in the 8-kāraka scheme.
          </p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
              <div key={key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ width: 70, color: PLANETS[key].color, fontWeight: 600 }}>{PLANETS[key].label}</span>
                <input type="range" min={0} max={29.99} step={0.01} value={degrees[key]} onChange={(e) => updateDegree(key, Number(e.target.value))} style={{ flex: 1, accentColor: PLANETS[key].color }} aria-label={`${PLANETS[key].label} degree`} />
                <span style={{ width: 70, color: INK_SECONDARY, fontSize: "0.85rem", textAlign: "right" }}>{formatDms(degrees[key])}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>7-kāraka scheme</p>
            <RankingList ranked={sevenRanked} pkIndex={4} />
          </section>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>8-kāraka scheme</p>
            <RankingList ranked={eightRanked} pkIndex={4} />
          </section>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>5th cuspal sub-lord computation</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.5rem" }}>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
              <span>5th cusp sign</span>
              <select value={cuspSign} onChange={(e) => setCuspSign(Number(e.target.value))} style={selectStyle}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {signName(i)}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
              <span>Degree in sign</span>
              <input type="range" min={0} max={29.99} step={0.01} value={cuspDegree} onChange={(e) => setCuspDegree(Number(e.target.value))} style={{ accentColor: PURPLE, width: "100%" }} aria-label="5th cusp degree" />
              <span style={{ color: PURPLE, fontWeight: 600 }}>{formatDms(cuspDegree)}</span>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
            <MiniFact icon={<Star size={16} />} title="Longitude" body={`${formatDms(cslResult.totalDegrees)}`} color={PURPLE} />
            <MiniFact icon={<MapPin size={16} />} title="Nakṣatra" body={`${cslResult.nakshatra.name} (${PLANETS[cslResult.nakshatra.lord].label})`} color={BLUE} />
            <MiniFact icon={<Target size={16} />} title="CSL" body={PLANETS[cslResult.csl].label} color={PLANETS[cslResult.csl].color} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Jupiter convergence</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
            The worked example finds Jupiter as both D1 saṁtāna-kāraka and 5th CSL, aspecting the 5th from the 9th. Toggle these conditions to see how the convergence weakens.
          </p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <ConvergenceToggle active={jupiterInNinth} title="Jupiter in 9th house (Pisces)" body="A trikoṇa, structurally strong" onClick={() => setJupiterInNinth((v) => !v)} />
            <ConvergenceToggle active={jupiterOwnSign} title="Jupiter in own sign" body="Pisces, dignified" onClick={() => setJupiterOwnSign((v) => !v)} />
            <ConvergenceToggle active={jupiterAspectsFifth} title="Jupiter aspects 5th house" body="9th-house graha-dṛṣṭi lands on the 5th" onClick={() => setJupiterAspectsFifth((v) => !v)} />
          </div>
        </section>
      </div>

      <ConvergenceSvg sevenPk={pkSeven} eightPk={pkEight} csl={cslResult.csl} jupiterConvergence={jupiterConvergence} />

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Other registers</p>
        <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
          <ConvergenceToggle active={fifthLordStrong} title="5th lord strong" body="Mars in Aries, 10th house" onClick={() => setFifthLordStrong((v) => !v)} />
          <ConvergenceToggle active={d7Clean} title="D7 clean" body="Dedicated children divisional supports the theme" onClick={() => setD7Clean((v) => !v)} />
        </div>
        <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: `${registerCount >= 3 ? GREEN : registerCount >= 2 ? GOLD : VERMILION}${"12"}`, border: `1px solid ${registerCount >= 3 ? GREEN : registerCount >= 2 ? GOLD : VERMILION}` }}>
          <p style={{ margin: 0, color: registerCount >= 3 ? GREEN : registerCount >= 2 ? GOLD : VERMILION, fontWeight: 600 }}>
            {registerCount} of 4 core registers converging
          </p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Framing guards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <GuardToggle active={nonFatalistic} icon={<Scale size={18} />} title="Non-fatalistic framing" body={nonFatalistic ? "Indication, not guarantee" : "Warning: do not present the result as certain."} onClick={() => setNonFatalistic((v) => !v)} />
            <GuardToggle active={noCountGender} icon={<Baby size={18} />} title="No count or gender" body={noCountGender ? "Refuse count and gender regardless of convergence." : "Warning: strong convergence does not license count or gender."} onClick={() => setNoCountGender((v) => !v)} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: allGuards ? `${GREEN}${"66"}` : `${VERMILION}${"66"}`, background: allGuards ? `${GREEN}${"0F"}` : `${VERMILION}${"0F"}` }}>
          <p style={eyebrowStyle}>Synthesis</p>
          <h3 style={{ margin: "0.15rem 0 0", color: allGuards ? (jupiterConvergence ? GREEN : GOLD) : VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
            {allGuards ? (jupiterConvergence ? "Strong multi-register convergence" : registerCount >= 2 ? "Moderate convergence" : "Weak or contested") : "Framing guard off"}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function signName(index: number) {
  const names = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  return names[index];
}

function RankingList({ ranked, pkIndex }: { ranked: Array<{ key: PlanetKey; label: string; short: string; color: string; rankingDegree: number }>; pkIndex: number }) {
  return (
    <div style={{ display: "grid", gap: "0.35rem" }}>
      {ranked.map((planet, index) => {
        const isPk = index === pkIndex;
        return (
          <div key={planet.key} style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", padding: "0.45rem 0.6rem", borderRadius: 6, border: `1px solid ${isPk ? planet.color : HAIRLINE}`, background: isPk ? `${planet.color}${"12"}` : "transparent" }}>
            <span style={{ color: isPk ? planet.color : INK_PRIMARY, fontWeight: 600 }}>
              {ROLE_LABELS_SEVEN[index]} · {planet.label}
            </span>
            <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>{formatDms(planet.rankingDegree)}</span>
          </div>
        );
      })}
    </div>
  );
}

function ConvergenceSvg({ sevenPk, eightPk, csl, jupiterConvergence }: { sevenPk: { key: PlanetKey; label: string; color: string }; eightPk: { key: PlanetKey; label: string; color: string }; csl: PlanetKey; jupiterConvergence: boolean }) {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Convergence diagram</p>
      <svg viewBox="0 0 560 240" role="img" aria-label="Jaimini and KP convergence diagram" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0", display: "block" }}>
        <rect x="14" y="14" width="532" height="212" rx="8" fill={`${GOLD}${"0F"}`} stroke={HAIRLINE} />

        {/* PK 7 */}
        <circle cx="80" cy="80" r="40" fill={`${sevenPk.color}${"18"}`} stroke={sevenPk.color} strokeWidth="3" />
        <text x="80" y="74" textAnchor="middle" fill={sevenPk.color} fontSize="12" fontWeight="600">7-karaka PK</text>
        <text x="80" y="92" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">{sevenPk.label}</text>

        {/* PK 8 */}
        <circle cx="80" cy="170" r="40" fill={`${eightPk.color}${"18"}`} stroke={eightPk.color} strokeWidth="3" />
        <text x="80" y="164" textAnchor="middle" fill={eightPk.color} fontSize="12" fontWeight="600">8-karaka PK</text>
        <text x="80" y="182" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">{eightPk.label}</text>

        {/* CSL */}
        <circle cx="280" cy="125" r="44" fill={`${PLANETS[csl].color}${"18"}`} stroke={PLANETS[csl].color} strokeWidth="3" />
        <text x="280" y="119" textAnchor="middle" fill={PLANETS[csl].color} fontSize="13" fontWeight="600">5th CSL</text>
        <text x="280" y="138" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">{PLANETS[csl].label}</text>

        {/* Jupiter node */}
        <circle cx="480" cy="80" r="44" fill={`${GREEN}${jupiterConvergence ? "22" : "10"}`} stroke={jupiterConvergence ? GREEN : HAIRLINE} strokeWidth={jupiterConvergence ? 3 : 2} />
        <text x="480" y="74" textAnchor="middle" fill={jupiterConvergence ? GREEN : INK_SECONDARY} fontSize="13" fontWeight="600">Jupiter</text>
        <text x="480" y="92" textAnchor="middle" fill={jupiterConvergence ? GREEN : INK_SECONDARY} fontSize="12" fontWeight="600">kāraka</text>

        {/* 5th house */}
        <circle cx="480" cy="170" r="44" fill={`${BLUE}${jupiterConvergence ? "22" : "10"}`} stroke={jupiterConvergence ? GREEN : HAIRLINE} strokeWidth={jupiterConvergence ? 3 : 2} />
        <text x="480" y="164" textAnchor="middle" fill={jupiterConvergence ? GREEN : INK_SECONDARY} fontSize="13" fontWeight="600">5th house</text>
        <text x="480" y="182" textAnchor="middle" fill={jupiterConvergence ? GREEN : INK_SECONDARY} fontSize="12" fontWeight="600">Scorpio</text>

        {/* Links */}
        <path d="M 120 80 C 180 80, 220 100, 236 125" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeLinecap="round" />
        <path d="M 120 170 C 180 170, 220 150, 236 125" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeLinecap="round" />
        <path d="M 324 125 C 380 125, 420 100, 436 80" fill="none" stroke={csl === "jupiter" ? GREEN : HAIRLINE} strokeWidth={csl === "jupiter" ? 3 : 2} strokeLinecap="round" />
        {jupiterConvergence ? (
          <>
            <path d="M 480 124 L 480 126" fill="none" stroke={GREEN} strokeWidth="3" />
            <path d="M 436 170 C 420 150, 380 125, 324 125" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
            <text x="380" y="50" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="600">CSL = kāraka</text>
            <text x="380" y="210" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="600">aspects 5th</text>
          </>
        ) : null}
      </svg>
    </section>
  );
}

function ConvergenceToggle({ active, title, body, onClick }: { active: boolean; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, active ? GREEN : VERMILION)}>
      <span style={{ color: active ? GREEN : VERMILION }}>{active ? <CheckCircle2 size={18} /> : <XCircle size={18} />}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

function GuardToggle({ active, icon, title, body, onClick }: { active: boolean; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, active ? GREEN : VERMILION)}>
      <span style={{ color: active ? GREEN : VERMILION }}>{active ? icon : <XCircle size={18} />}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"0F"}`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_PRIMARY,
  padding: "0.45rem 0.6rem",
  fontWeight: 400,
};

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}
