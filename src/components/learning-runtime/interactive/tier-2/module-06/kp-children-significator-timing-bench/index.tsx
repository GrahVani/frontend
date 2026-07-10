"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Baby,
  Calendar,
  Clock,
  RotateCcw,
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

const HOUSES = [2, 5, 11] as const;
type HouseKey = (typeof HOUSES)[number];
type LevelKey = "none" | "owner" | "star-owner" | "occupant" | "star-occupant";
type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";

const LEVELS: Record<LevelKey, { label: string; score: number }> = {
  "star-occupant": { label: "Star of occupant", score: 4 },
  occupant: { label: "Occupant", score: 3 },
  "star-owner": { label: "Star of owner", score: 2 },
  owner: { label: "Owner", score: 1 },
  none: { label: "—", score: 0 },
};

const PLANETS: Record<PlanetKey, { label: string; short: string; color: string; years: number }> = {
  sun: { label: "Sun", short: "Su", color: GOLD, years: 6 },
  moon: { label: "Moon", short: "Mo", color: BLUE, years: 10 },
  mars: { label: "Mars", short: "Ma", color: VERMILION, years: 7 },
  mercury: { label: "Mercury", short: "Me", color: GREEN, years: 17 },
  jupiter: { label: "Jupiter", short: "Ju", color: PURPLE, years: 16 },
  venus: { label: "Venus", short: "Ve", color: GOLD, years: 20 },
  saturn: { label: "Saturn", short: "Sa", color: PURPLE, years: 19 },
  rahu: { label: "Rāhu", short: "Ra", color: VERMILION, years: 18 },
  ketu: { label: "Ketu", short: "Ke", color: BLUE, years: 7 },
};

const JUPITER_MAHADASHA_YEARS = 16;
const DEFAULT_SIGNIFICATORS: Record<PlanetKey, Record<HouseKey, LevelKey>> = {
  sun: { 2: "none", 5: "none", 11: "none" },
  moon: { 2: "none", 5: "none", 11: "none" },
  mars: { 2: "none", 5: "none", 11: "none" },
  mercury: { 2: "none", 5: "occupant", 11: "star-owner" },
  jupiter: { 2: "none", 5: "none", 11: "none" },
  venus: { 2: "star-occupant", 5: "none", 11: "none" },
  saturn: { 2: "none", 5: "none", 11: "none" },
  rahu: { 2: "none", 5: "none", 11: "none" },
  ketu: { 2: "none", 5: "none", 11: "none" },
};

function formatDuration(years: number) {
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12 * 10) / 10;
  if (y === 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
}

function formatAge(years: number) {
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12 * 10) / 10;
  return `${y}y ${m}m`;
}

export function KpChildrenSignificatorTimingBench() {
  const [significators, setSignificators] = useState<Record<PlanetKey, Record<HouseKey, LevelKey>>>(DEFAULT_SIGNIFICATORS);
  const [mdLord, setMdLord] = useState<PlanetKey>("mercury");
  const [bhuktiLord, setBhuktiLord] = useState<PlanetKey>("venus");
  const [antarLord, setAntarLord] = useState<PlanetKey>("mercury");
  const [fifthLord, setFifthLord] = useState<PlanetKey>("venus");
  const [jupiterStartAge, setJupiterStartAge] = useState(32);
  const [parashariOverlay, setParashariOverlay] = useState(true);
  const [nonUrgency, setNonUrgency] = useState(true);
  const [noCountGender, setNoCountGender] = useState(true);

  const planetStats = useMemo(() => {
    return (Object.keys(PLANETS) as PlanetKey[]).map((key) => {
      const houseScores = HOUSES.map((house) => ({ house, level: significators[key][house], score: LEVELS[significators[key][house]].score }));
      const total = houseScores.reduce((sum, item) => sum + item.score, 0);
      const activeHouses = houseScores.filter((item) => item.score > 0).map((item) => item.house);
      const topLevel = Math.max(...houseScores.map((item) => item.score));
      const isMultiHouse = activeHouses.length >= 2;
      const isStrong = total >= 4 || isMultiHouse;
      return { key, ...PLANETS[key], houseScores, total, activeHouses, topLevel, isMultiHouse, isStrong };
    }).sort((a, b) => b.total - a.total);
  }, [significators]);

  const topSignificators = planetStats.filter((p) => p.isStrong);

  const jointVerdict = useMemo(() => {
    const selected = [mdLord, bhuktiLord, antarLord];
    const selectedStats = selected.map((key) => planetStats.find((p) => p.key === key)!);
    const strongCount = selectedStats.filter((s) => s.isStrong).length;
    const uniqueHouses = new Set(selectedStats.flatMap((s) => s.activeHouses));
    if (strongCount === 3 && uniqueHouses.size >= 2) return "very-strong";
    if (strongCount >= 2 && uniqueHouses.size >= 2) return "strong";
    if (strongCount >= 1) return "moderate";
    return "weak";
  }, [mdLord, bhuktiLord, antarLord, planetStats]);

  const parashariWindow = (() => {
    const sequence = ["jupiter", "saturn", "mercury", "ketu", "venus", "sun", "moon", "mars", "rahu"] as PlanetKey[];
    let cursor = 0;
    for (const lord of sequence) {
      const duration = (JUPITER_MAHADASHA_YEARS * PLANETS[lord].years) / 120;
      if (lord === fifthLord) {
        return { from: jupiterStartAge + cursor, to: jupiterStartAge + cursor + duration, duration };
      }
      cursor += duration;
    }
    return null;
  })();

  const kpWindowText = `${PLANETS[mdLord].label} mahādaśā / ${PLANETS[bhuktiLord].label} bhukti / ${PLANETS[antarLord].label} antardaśā`;
  const overlap = parashariOverlay && parashariWindow && mdLord === "jupiter" && bhuktiLord === fifthLord;

  const synthesis = useMemo(() => {
    if (!nonUrgency || !noCountGender) {
      return "Enable both the non-urgency framing and the count/gender refusal before delivering any timing reading.";
    }
    const ranked = topSignificators.map((p) => `${p.label} (${p.activeHouses.join(", ")}${p.isMultiHouse ? ", multi-house" : ""})`).join("; ");
    const rankedText = topSignificators.length ? `Top significators: ${ranked}.` : "No strong significators are currently assigned.";
    const jointText = `Selected joint period is ${jointVerdict.replace(/-/g, " ")}: ${kpWindowText}.`;
    const paraText = parashariOverlay && parashariWindow
      ? `The Parāśari Jupiter–${PLANETS[fifthLord].label} bhukti runs about age ${formatAge(parashariWindow.from)} to ${formatAge(parashariWindow.to)}.`
      : "";
    const overlapText = overlap
      ? "This KP joint period overlaps the Parāśari window — the strongest timing confluence this module can offer, still framed as a trend."
      : parashariOverlay
        ? "Compare this KP window against the Parāśari window; overlap is the strongest signal, divergence is reported honestly."
        : "";
    return `${rankedText} ${jointText} ${paraText} ${overlapText}`.trim();
  }, [fifthLord, jointVerdict, kpWindowText, noCountGender, nonUrgency, overlap, parashariOverlay, parashariWindow, topSignificators]);

  function setLevel(planet: PlanetKey, house: HouseKey, level: LevelKey) {
    setSignificators((prev) => ({
      ...prev,
      [planet]: { ...prev[planet], [house]: level },
    }));
  }

  function reset() {
    setSignificators(DEFAULT_SIGNIFICATORS);
    setMdLord("mercury");
    setBhuktiLord("venus");
    setAntarLord("mercury");
    setFifthLord("venus");
    setJupiterStartAge(32);
    setParashariOverlay(true);
    setNonUrgency(true);
    setNoCountGender(true);
  }

  return (
    <div data-interactive="kp-children-significator-timing-bench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP children significator timing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.32rem", fontWeight: 600 }}>
              Rank significators of 2, 5, 11 and find joint periods
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Build the four-level KP significator hierarchy, identify multi-house significators, select a joint mahādaśā-bhukti-antardaśā, and layer it against the Parāśari Jupiter-5th-lord window.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Four-level significator matrix</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          Set each planet&apos;s level for houses 2, 5, and 11. Stronger levels (star-of-occupant → occupant → star-of-owner → owner) score higher; multi-house planets are flagged.
        </p>
        <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 600 }}>Planet</th>
                {HOUSES.map((house) => (
                  <th key={house} style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 600 }}>House {house}</th>
                ))}
                <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 600 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {planetStats.map((planet) => (
                <tr key={planet.key} style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.5rem", color: planet.color, fontWeight: 600 }}>{planet.label}</td>
                  {HOUSES.map((house) => (
                    <td key={house} style={{ padding: "0.5rem" }}>
                      <select
                        value={planet.houseScores.find((h) => h.house === house)?.level}
                        onChange={(e) => setLevel(planet.key, house, e.target.value as LevelKey)}
                        style={smallSelectStyle}
                        aria-label={`${planet.label} level for house ${house}`}
                      >
                        {(Object.keys(LEVELS) as LevelKey[]).map((level) => (
                          <option key={level} value={level}>
                            {LEVELS[level].label}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                  <td style={{ padding: "0.5rem", color: planet.isStrong ? GREEN : INK_SECONDARY, fontWeight: 600 }}>
                    {planet.total} {planet.isMultiHouse ? "★" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ranked significators</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            {topSignificators.length === 0 ? (
              <p style={{ color: INK_SECONDARY }}>No strong significators assigned yet.</p>
            ) : (
              topSignificators.map((planet) => (
                <div key={planet.key} style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", padding: "0.6rem", borderRadius: 6, border: `1px solid ${planet.color}${"44"}`, background: `${planet.color}${"0F"}` }}>
                  <span style={{ color: planet.color, fontWeight: 600 }}>{planet.label}</span>
                  <span style={{ color: INK_SECONDARY }}>
                    houses {planet.activeHouses.join(", ")} {planet.isMultiHouse ? "• multi-house" : ""}
                  </span>
                  <span style={{ color: INK_MUTED, fontWeight: 600 }}>{planet.total} pts</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Joint period selector</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <JointSelect label="Mahādaśā lord" value={mdLord} onChange={setMdLord} />
            <JointSelect label="Bhukti lord" value={bhuktiLord} onChange={setBhuktiLord} />
            <JointSelect label="Antardaśā lord" value={antarLord} onChange={setAntarLord} />
          </div>
          <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: `${jointVerdict === "very-strong" ? GREEN : jointVerdict === "strong" ? GREEN : jointVerdict === "moderate" ? GOLD : VERMILION}${"12"}`, border: `1px solid ${jointVerdict === "very-strong" ? GREEN : jointVerdict === "strong" ? GREEN : jointVerdict === "moderate" ? GOLD : VERMILION}` }}>
            <p style={{ margin: 0, color: jointVerdict === "very-strong" ? GREEN : jointVerdict === "strong" ? GREEN : jointVerdict === "moderate" ? GOLD : VERMILION, fontWeight: 600 }}>
              Joint period strength: {jointVerdict.replace(/-/g, " ")}
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Parāśari window overlay</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginTop: "0.75rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_SECONDARY, cursor: "pointer" }}>
            <input type="checkbox" checked={parashariOverlay} onChange={(e) => setParashariOverlay(e.target.checked)} aria-label="Show Parashari overlay" />
            Show Parāśari window
          </label>
          {parashariOverlay ? (
            <>
              <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
                <span>5th lord</span>
                <select value={fifthLord} onChange={(e) => setFifthLord(e.target.value as PlanetKey)} style={selectStyle}>
                  {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
                    <option key={key} value={key}>
                      {PLANETS[key].label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY, minWidth: 180 }}>
                <span>Jupiter mahādaśā starts at age</span>
                <input type="range" min={0} max={80} step={1} value={jupiterStartAge} onChange={(e) => setJupiterStartAge(Number(e.target.value))} style={{ accentColor: GOLD, width: "100%" }} aria-label="Jupiter mahadasha start age" />
                <span style={{ color: GOLD, fontWeight: 600 }}>{jupiterStartAge} years</span>
              </label>
            </>
          ) : null}
        </div>
        {parashariOverlay && parashariWindow ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
              <MiniFact icon={<Calendar size={16} />} title="Parāśari window" body={`${formatAge(parashariWindow.from)} – ${formatAge(parashariWindow.to)}`} color={BLUE} />
              <MiniFact icon={<Clock size={16} />} title="Duration" body={formatDuration(parashariWindow.duration)} color={PURPLE} />
              <MiniFact icon={<Target size={16} />} title="Overlap" body={overlap ? "KP = Parāśari window" : "No automatic overlap"} color={overlap ? GREEN : GOLD} />
            </div>
            <TimelineSvg startAge={jupiterStartAge} fifthLord={fifthLord} highlightBhukti={mdLord === "jupiter" ? bhuktiLord : null} />
          </>
        ) : null}
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Framing guards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <GuardToggle active={nonUrgency} icon={<Clock size={18} />} title="Non-urgency framing" body={nonUrgency ? "Window is a trend, never a due date or countdown." : "Warning: do not convert the window into pressure."} onClick={() => setNonUrgency((v) => !v)} />
            <GuardToggle active={noCountGender} icon={<Baby size={18} />} title="No count or gender" body={noCountGender ? "Timing precision does not license count or gender claims." : "Warning: timing is not a backdoor to count or gender."} onClick={() => setNoCountGender((v) => !v)} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: nonUrgency && noCountGender ? `${GREEN}${"66"}` : `${VERMILION}${"66"}`, background: nonUrgency && noCountGender ? `${GREEN}${"0F"}` : `${VERMILION}${"0F"}` }}>
          <p style={eyebrowStyle}>Timing synthesis</p>
          <h3 style={{ margin: "0.15rem 0 0", color: nonUrgency && noCountGender ? (overlap ? GREEN : GOLD) : VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
            {nonUrgency && noCountGender ? (overlap ? "Strongest confluence" : "KP timing picture") : "Framing guard off"}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function JointSelect({ label, value, onChange }: { label: string; value: PlanetKey; onChange: (key: PlanetKey) => void }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as PlanetKey)} style={selectStyle}>
        {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
          <option key={key} value={key}>
            {PLANETS[key].label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TimelineSvg({ startAge, fifthLord, highlightBhukti }: { startAge: number; fifthLord: PlanetKey; highlightBhukti: PlanetKey | null }) {
  const sequence = ["jupiter", "saturn", "mercury", "ketu", "venus", "sun", "moon", "mars", "rahu"] as PlanetKey[];
  let cursor = 0;
  const bhuktis = sequence.map((lord) => {
    const duration = (JUPITER_MAHADASHA_YEARS * PLANETS[lord].years) / 120;
    const from = cursor;
    const to = cursor + duration;
    cursor = to;
    return { lord, duration, from, to, highlighted: lord === fifthLord || (highlightBhukti ? lord === highlightBhukti : false) };
  });
  const total = JUPITER_MAHADASHA_YEARS;
  const startX = 40;
  const endX = 520;
  const trackY = 110;
  const trackWidth = endX - startX;

  return (
    <svg viewBox="0 0 560 190" role="img" aria-label="Jupiter mahadasha timeline with fifth lord bhukti highlighted" style={{ width: "100%", maxHeight: 220, margin: "0.75rem auto 0", display: "block" }}>
      <rect x="10" y="10" width="540" height="170" rx="8" fill={`${GOLD}${"0F"}`} stroke={HAIRLINE} />
      <line x1={startX} y1={trackY} x2={endX} y2={trackY} stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      {bhuktis.map((b, i) => {
        const left = startX + (b.from / total) * trackWidth;
        const width = (b.duration / total) * trackWidth;
        return (
          <g key={b.lord}>
            <rect x={left} y={trackY - 12} width={width} height="24" rx="4" fill={b.highlighted ? `${GREEN}${"22"}` : `${i % 2 === 0 ? BLUE : PURPLE}${"22"}`} stroke={b.highlighted ? GREEN : HAIRLINE} strokeWidth={b.highlighted ? 2 : 1} />
            <text x={left + width / 2} y={trackY + 4} textAnchor="middle" fill={b.highlighted ? GREEN : INK_SECONDARY} fontSize={width > 32 ? "10" : "8"} fontWeight="600">
              {PLANETS[b.lord].short}
            </text>
          </g>
        );
      })}
      <text x={startX} y={trackY + 36} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">age {formatAge(startAge)}</text>
      <text x={endX} y={trackY + 36} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">age {formatAge(startAge + total)}</text>
      <g transform="translate(40 160)">
        <rect x="0" y="-6" width="14" height="12" rx="3" fill={`${GREEN}${"22"}`} stroke={GREEN} strokeWidth="1.5" />
        <text x="20" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">{fifthLord === highlightBhukti ? "5th-lord bhukti / KP joint" : "5th-lord bhukti"}</text>
        {highlightBhukti && highlightBhukti !== fifthLord ? (
          <>
            <rect x="150" y="-6" width="14" height="12" rx="3" fill={`${GOLD}${"22"}`} stroke={GOLD} strokeWidth="1.5" />
            <text x="170" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">KP bhukti</text>
          </>
        ) : null}
      </g>
    </svg>
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

const smallSelectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 6,
  background: "transparent",
  color: INK_PRIMARY,
  padding: "0.3rem 0.4rem",
  fontSize: "0.85rem",
  fontWeight: 400,
  width: "100%",
};
