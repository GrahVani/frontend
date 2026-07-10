"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Baby,
  BookOpen,
  CheckCircle2,
  Crown,
  Eye,
  GitBranch,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type SchemeKey = "seven" | "eight";
type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu";

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

const PLANETS: Record<PlanetKey, { label: string; short: string; degree: number; color: string; nature: string }> = {
  sun: { label: "Sun", short: "Su", degree: 22, color: GOLD, nature: "visible, leadership-oriented, strong-willed — held as a gentle tendency" },
  moon: { label: "Moon", short: "Mo", degree: 12, color: BLUE, nature: "responsive, emotionally attuned, nurturing — held as a gentle tendency" },
  mars: { label: "Mars", short: "Ma", degree: 8, color: VERMILION, nature: "energetic, driven, competitive — never a fixed aggression-decree" },
  mercury: { label: "Mercury", short: "Me", degree: 18, color: GREEN, nature: "communicative, curious, adaptable, many interests — held as a gentle tendency" },
  jupiter: { label: "Jupiter", short: "Ju", degree: 20, color: PURPLE, nature: "wise, protective, dharmic, expansive — held as a gentle tendency" },
  venus: { label: "Venus", short: "Ve", degree: 25, color: GOLD, nature: "harmonious, relational, artistic — held as a gentle tendency" },
  saturn: { label: "Saturn", short: "Sa", degree: 28, color: PURPLE, nature: "disciplined, reserved, late-blooming — held as a gentle tendency" },
  rahu: { label: "Rāhu", short: "Ra", degree: 2, color: VERMILION, nature: "unconventional, foreign-tinged, technically ambitious — held as a gentle tendency" },
};

const ROLE_LABELS_SEVEN = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];
const ROLE_LABELS_EIGHT = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK", "PiK"];

const PRESETS = {
  mercury: { sun: 22, moon: 12, mars: 8, mercury: 18, jupiter: 20, venus: 25, saturn: 28, rahu: 2 },
  mars: { sun: 10, moon: 6, mars: 26, mercury: 14, jupiter: 18, venus: 24, saturn: 28, rahu: 2 },
  rahuShift: { sun: 22, moon: 12, mars: 8, mercury: 18, jupiter: 20, venus: 25, saturn: 28, rahu: 4 },
};

export function PutraKarakaPkConvergenceBench() {
  const [scheme, setScheme] = useState<SchemeKey>("seven");
  const [degrees, setDegrees] = useState<Record<PlanetKey, number>>({ ...PRESETS.mercury });
  const [pkHouse, setPkHouse] = useState(5);
  const [fifthSupportive, setFifthSupportive] = useState(true);
  const [d7Supportive, setD7Supportive] = useState(true);
  const [jupiterStrong, setJupiterStrong] = useState(true);
  const [pkDignified, setPkDignified] = useState(true);
  const [noCountGender, setNoCountGender] = useState(true);
  const [tendenciesOnly, setTendenciesOnly] = useState(true);
  const [combinedReading, setCombinedReading] = useState(true);

  const rankedPlanets = useMemo(() => {
    const included = (Object.keys(PLANETS) as PlanetKey[]).filter((key) => scheme === "eight" || key !== "rahu");
    return included
      .map((key) => {
        const planet = PLANETS[key];
        const rankingDegree = key === "rahu" ? 30 - degrees[key] : degrees[key];
        return { key, ...planet, rankingDegree };
      })
      .sort((a, b) => b.rankingDegree - a.rankingDegree);
  }, [degrees, scheme]);

  const pk = rankedPlanets[4];
  const pkIndex = 4;
  const schemeChanged = useMemo(() => {
    const sevenRanked = (Object.keys(PLANETS) as PlanetKey[])
      .filter((key) => key !== "rahu")
      .map((key) => ({ key, rank: degrees[key] }))
      .sort((a, b) => b.rank - a.rank);
    const eightRanked = (Object.keys(PLANETS) as PlanetKey[])
      .map((key) => ({ key, rank: key === "rahu" ? 30 - degrees[key] : degrees[key] }))
      .sort((a, b) => b.rank - a.rank);
    return sevenRanked[4]?.key !== eightRanked[4]?.key;
  }, [degrees]);

  const convergenceCount = [fifthSupportive, d7Supportive, jupiterStrong, pkDignified].filter(Boolean).length;
  const allGuards = noCountGender && tendenciesOnly && combinedReading;
  const fifthFromPk = ((pkHouse + 4 - 1) % 12) + 1;

  const synthesis = useMemo(() => {
    if (!allGuards) {
      return "Turn on all three guard toggles before delivering a PK reading. The PK never licenses count, gender, a fixed portrait, or a standalone verdict.";
    }
    const schemeText = scheme === "seven" ? "7-karaka scheme (Sun–Saturn)." : "8-karaka scheme (Rāhu included by reverse degree).";
    const variantNote = schemeChanged ? " The 7- and 8-karaka schemes give different PKs here — note the variant honestly." : "";
    const pkSentence = `${pk.label} is the Putrakāraka; its nature reads as ${pk.nature}.`;
    const convergenceText =
      convergenceCount === 4
        ? "All four saṁtāna registers converge — a robust, high-confidence indication, still framed as tendencies."
        : convergenceCount >= 2
          ? `${convergenceCount} of 4 saṁtāna registers align — useful context, held lightly until more registers confirm.`
          : "Only one or none of the four saṁtāna registers aligns — the PK signal is weak or contested; do not push it.";
    return `${schemeText}${variantNote} ${pkSentence} ${convergenceText}`;
  }, [allGuards, scheme, schemeChanged, pk, convergenceCount]);

  function setPreset(name: keyof typeof PRESETS) {
    setDegrees({ ...PRESETS[name] });
  }

  function reset() {
    setScheme("seven");
    setDegrees({ ...PRESETS.mercury });
    setPkHouse(5);
    setFifthSupportive(true);
    setD7Supportive(true);
    setJupiterStrong(true);
    setPkDignified(true);
    setNoCountGender(true);
    setTendenciesOnly(true);
    setCombinedReading(true);
  }

  function updateDegree(key: PlanetKey, value: number) {
    setDegrees((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div data-interactive="putra-karaka-pk-convergence-bench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Putrakāraka identity and convergence</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.32rem", fontWeight: 600 }}>
              Find the fifth cara-kāraka and read it as a fourth saṁtāna register
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Rank the planets by degree, identify the PK, and practise keeping the reading bounded: tendencies only, no count or gender, and never standalone.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Cara-kāraka ranking</p>
              <h3 style={{ margin: "0.15rem 0 0", color: allGuards ? GREEN : VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
                {allGuards ? `${pk.label} is the PK` : "Guard toggles incomplete"}
              </h3>
            </div>
            <strong style={{ color: scheme === "seven" ? BLUE : PURPLE, fontWeight: 600 }}>{scheme === "seven" ? "7-karaka" : "8-karaka"} scheme</strong>
          </div>
          <RankingSvg rankedPlanets={rankedPlanets} pkIndex={pkIndex} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Crown size={16} />} title="AK" body={`${rankedPlanets[0]?.label ?? "-"}: soul`} color={GOLD} />
            <MiniFact icon={<Baby size={16} />} title="PK" body={`${pk.label}: children-significator`} color={GREEN} />
            <MiniFact icon={<Users size={16} />} title="DK" body={`${rankedPlanets[rankedPlanets.length - 1]?.label ?? "-"}: spouse`} color={BLUE} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Karaka scheme" icon={<SlidersHorizontal size={18} />} color={scheme === "seven" ? BLUE : PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={scheme === "seven"} onClick={() => setScheme("seven")} style={smallChipStyle(scheme === "seven", BLUE)}>
                7-karaka
              </button>
              <button type="button" aria-pressed={scheme === "eight"} onClick={() => setScheme("eight")} style={smallChipStyle(scheme === "eight", PURPLE)}>
                8-karaka
              </button>
            </div>
            <p style={bodyTextStyle}>
              {scheme === "seven"
                ? "Sun through Saturn only. State this scheme for reproducibility."
                : "Rāhu enters by reverse degree (30° − longitude-in-sign). Notice how an insertion above PK can shift the identity."}
            </p>
          </Panel>

          <Panel title="Presets" icon={<Sparkles size={18} />} color={GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" onClick={() => setPreset("mercury")} style={smallChipStyle(false, GREEN)}>
                Mercury PK
              </button>
              <button type="button" onClick={() => setPreset("mars")} style={smallChipStyle(false, VERMILION)}>
                Mars PK
              </button>
              <button type="button" onClick={() => setPreset("rahuShift")} style={smallChipStyle(false, PURPLE)}>
                Rāhu shifts PK
              </button>
            </div>
            <p style={bodyTextStyle}>Each preset changes degrees so a different planet lands at the fifth rank.</p>
          </Panel>

          <Panel title="PK house" icon={<Eye size={18} />} color={BLUE}>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
              <span>Place the PK in house</span>
              <input type="range" min={1} max={12} step={1} value={pkHouse} onChange={(e) => setPkHouse(Number(e.target.value))} style={{ accentColor: BLUE, width: "100%" }} aria-label="PK house" />
              <span style={{ color: BLUE, fontWeight: 600 }}>House {pkHouse} → 5th from PK is house {fifthFromPk}</span>
            </label>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Degree ranking table</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {rankedPlanets.map((planet, index) => {
            const role = scheme === "seven" ? ROLE_LABELS_SEVEN[index] : ROLE_LABELS_EIGHT[index];
            const isPk = index === pkIndex;
            const isAk = index === 0;
            return (
              <div key={planet.key} style={{ border: `1px solid ${isPk ? planet.color : isAk ? GOLD : HAIRLINE}`, borderRadius: 8, background: isPk ? `${planet.color}${"12"}` : isAk ? `${GOLD}${"12"}` : "transparent", padding: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ color: isAk ? GOLD : isPk ? planet.color : INK_PRIMARY, fontWeight: 600 }}>{role}</span>
                  <span style={{ color: INK_MUTED, fontWeight: 600 }}>#{index + 1}</span>
                </div>
                <p style={{ margin: "0.35rem 0 0", color: planet.color, fontWeight: 600 }}>{planet.label}</p>
                <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  {planet.key === "rahu" ? `${planet.degree}deg natal / ${planet.rankingDegree}deg ranked` : `${planet.degree}deg`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>PK reading</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${pk.color}${"20"}`, border: `2px solid ${pk.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: pk.color, fontWeight: 600 }}>
              {pk.short}
            </div>
            <div>
              <h3 style={{ margin: 0, color: pk.color, fontSize: "1.15rem", fontWeight: 600 }}>
                {pk.label} as Putrakāraka
              </h3>
              <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>{pk.nature}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.55rem", marginTop: "0.85rem" }}>
            <MiniFact icon={<BookOpen size={16} />} title="PK house" body={`House ${pkHouse}`} color={BLUE} />
            <MiniFact icon={<Eye size={16} />} title="5th from PK" body={`House ${fifthFromPk}`} color={PURPLE} />
            <MiniFact icon={<Scale size={16} />} title="Dignity" body={pkDignified ? "Dignified / well-placed" : "Afflicted / weak"} color={pkDignified ? GREEN : VERMILION} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Four-register convergence</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <ConvergenceToggle active={fifthSupportive} color={fifthSupportive ? GREEN : VERMILION} icon={<CheckCircle2 size={18} />} title="D1 5th house / lord" body={fifthSupportive ? "Supportive" : "Not supportive"} onClick={() => setFifthSupportive((v) => !v)} />
            <ConvergenceToggle active={d7Supportive} color={d7Supportive ? GREEN : VERMILION} icon={<CheckCircle2 size={18} />} title="D7 saṁtāna varga" body={d7Supportive ? "Supportive" : "Not supportive"} onClick={() => setD7Supportive((v) => !v)} />
            <ConvergenceToggle active={jupiterStrong} color={jupiterStrong ? GREEN : VERMILION} icon={<CheckCircle2 size={18} />} title="D1 Jupiter strong" body={jupiterStrong ? "Strong kāraka" : "Stressed kāraka"} onClick={() => setJupiterStrong((v) => !v)} />
            <ConvergenceToggle active={pkDignified} color={pkDignified ? GREEN : VERMILION} icon={<CheckCircle2 size={18} />} title="PK dignified" body={pkDignified ? "Well-placed PK" : "Afflicted PK"} onClick={() => setPkDignified((v) => !v)} />
          </div>
          <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: `${convergenceCount === 4 ? GREEN : convergenceCount >= 2 ? GOLD : VERMILION}${"12"}`, border: `1px solid ${convergenceCount === 4 ? GREEN : convergenceCount >= 2 ? GOLD : VERMILION}` }}>
            <p style={{ margin: 0, color: convergenceCount === 4 ? GREEN : convergenceCount >= 2 ? GOLD : VERMILION, fontWeight: 600 }}>
              {convergenceCount} of 4 registers aligned
            </p>
          </div>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading guards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <GuardToggle active={noCountGender} icon={<ShieldCheck size={18} />} title="No count or gender claim" body={noCountGender ? "PK does not license number or gender of children." : "Warning: predicting count or gender from PK is out of scope and, for gender, may be unlawful."} onClick={() => setNoCountGender((v) => !v)} />
            <GuardToggle active={tendenciesOnly} icon={<Scale size={18} />} title="Character as tendencies only" body={tendenciesOnly ? "Nature is held loosely, not as a fixed portrait." : "Warning: do not decree a fixed personality from the PK."} onClick={() => setTendenciesOnly((v) => !v)} />
            <GuardToggle active={combinedReading} icon={<GitBranch size={18} />} title="Combine with other registers" body={combinedReading ? "PK is the fourth register, read alongside 5th, D7, and Jupiter." : "Warning: do not read the PK in isolation."} onClick={() => setCombinedReading((v) => !v)} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: allGuards ? `${GREEN}${"66"}` : `${VERMILION}${"66"}`, background: allGuards ? `${GREEN}${"0F"}` : `${VERMILION}${"0F"}` }}>
          <p style={eyebrowStyle}>Synthesis</p>
          <h3 style={{ margin: "0.15rem 0 0", color: allGuards ? GREEN : VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
            {allGuards ? (convergenceCount >= 3 ? "Bounded PK reading" : "Weak or contested signal") : "Discipline warning"}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Nudge the casting</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(PLANETS) as PlanetKey[]).map((key) => {
            const planet = PLANETS[key];
            const assignment = rankedPlanets.find((item) => item.key === key);
            return (
              <div key={key} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ color: planet.color, fontWeight: 600 }}>{planet.label}</span>
                  {assignment ? <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600 }}>{scheme === "seven" ? ROLE_LABELS_SEVEN[rankedPlanets.indexOf(assignment)] : ROLE_LABELS_EIGHT[rankedPlanets.indexOf(assignment)]}</span> : null}
                </div>
                <input type="range" min={0} max={29.99} step={0.01} value={degrees[key]} onChange={(e) => updateDegree(key, Number(e.target.value))} style={{ accentColor: planet.color, width: "100%", marginTop: "0.55rem" }} aria-label={`${planet.label} degree`} />
                <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  {degrees[key].toFixed(2)}° {key === "rahu" ? `(ranked as ${(30 - degrees[key]).toFixed(2)}°)` : ""}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RankingSvg({ rankedPlanets, pkIndex }: { rankedPlanets: Array<{ key: PlanetKey; label: string; short: string; rankingDegree: number; color: string }>; pkIndex: number }) {
  const widthPerNode = 64;
  const startX = 40;
  const trackY = 120;
  const totalWidth = startX * 2 + rankedPlanets.length * widthPerNode;

  return (
    <svg viewBox={`0 0 ${totalWidth} 220`} role="img" aria-label="Cara-karaka ranking with PK highlighted" style={{ width: "100%", maxHeight: 300, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="12" y="12" width={totalWidth - 24} height="196" rx="8" fill={`${GOLD}${"0F"}`} stroke={HAIRLINE} />
      <line x1={startX} y1={trackY} x2={startX + (rankedPlanets.length - 1) * widthPerNode} y2={trackY} stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      <text x={startX} y={trackY - 24} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        highest degree
      </text>
      <text x={startX + (rankedPlanets.length - 1) * widthPerNode} y={trackY - 24} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        lowest degree
      </text>

      {rankedPlanets.map((planet, index) => {
        const x = startX + index * widthPerNode;
        const isPk = index === pkIndex;
        const isAk = index === 0;
        const r = isPk ? 22 : isAk ? 18 : 13;
        return (
          <g key={planet.key}>
            <circle cx={x} cy={trackY} r={r} fill={`${planet.color}${isPk ? "22" : "14"}`} stroke={isPk ? planet.color : isAk ? GOLD : HAIRLINE} strokeWidth={isPk ? 3 : 2} />
            <text x={x} y={trackY + 4} textAnchor="middle" fill={isPk ? planet.color : INK_PRIMARY} fontSize={isPk ? "12" : "10"} fontWeight="600">
              {planet.short}
            </text>
            <text x={x} y={trackY + 46} textAnchor="middle" fill={isPk ? planet.color : INK_SECONDARY} fontSize="10" fontWeight="600">
              {planet.label}
            </text>
            <text x={x} y={trackY + 62} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">
              {planet.rankingDegree.toFixed(1)}°
            </text>
            {isPk ? (
              <g>
                <polygon points={`${x - 6},${trackY - 36} ${x + 6},${trackY - 36} ${x},${trackY - 24}`} fill={GREEN} />
                <text x={x} y={trackY - 42} textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">
                  PK
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"0F"}`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function ConvergenceToggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{active ? icon : <XCircle size={18} />}</span>
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
      <span style={{ color: active ? GREEN : VERMILION }}>{active ? icon : <AlertTriangle size={18} />}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
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
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
