"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Baby,
  Calendar,
  Clock,
  Grid3X3,
  HeartPulse,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
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

type Direction = "favourable" | "mixed" | "stressed";
type Strength = "strong" | "moderate" | "weak";
type RootKey =
  | "none"
  | "jupiter"
  | "mars"
  | "mercury"
  | "venus"
  | "saturn"
  | "moon"
  | "sun"
  | "rahu"
  | "ketu";
type RegisterKey = "d1-fifth" | "d7" | "jupiter" | "pk" | "kp";

interface RegisterEntry {
  direction: Direction;
  strength: Strength;
  root: RootKey;
  finding: string;
}

const REGISTERS = [
  {
    key: "d1-fifth" as RegisterKey,
    label: "D1 5th house / lord",
    chapter: "1",
    stream: "Parāśara",
    defaultFinding: "Scorpio 5th; Mars own sign, 10th kendra",
  },
  {
    key: "d7" as RegisterKey,
    label: "D7 Saptāṁśa",
    chapter: "2",
    stream: "Parāśara",
    defaultFinding: "D7 lagna and 5th clean",
  },
  {
    key: "jupiter" as RegisterKey,
    label: "D1 Jupiter",
    chapter: "3",
    stream: "Parāśara",
    defaultFinding: "Own Pisces, 9th trikoṇa, 9th aspect on 5th",
  },
  {
    key: "pk" as RegisterKey,
    label: "Jaimini Putrakāraka",
    chapter: "4.1-4.2",
    stream: "Jaimini",
    defaultFinding: "Mercury, friendly Taurus, 11th house",
  },
  {
    key: "kp" as RegisterKey,
    label: "KP 5th CSL + significators",
    chapter: "4.3-4.4",
    stream: "KP",
    defaultFinding: "Jupiter CSL; Mercury star-lord; fruitful 5th",
  },
] as const;

const DIRECTION_SCORES: Record<Direction, number> = {
  favourable: 1,
  mixed: 0,
  stressed: -1,
};

const STRENGTH_MULTIPLIERS: Record<Strength, number> = {
  strong: 3,
  moderate: 2,
  weak: 1,
};

const ROOT_OPTIONS: { key: RootKey; label: string }[] = [
  { key: "none", label: "Independent" },
  { key: "jupiter", label: "Jupiter root" },
  { key: "mars", label: "Mars root" },
  { key: "mercury", label: "Mercury root" },
  { key: "venus", label: "Venus root" },
  { key: "saturn", label: "Saturn root" },
  { key: "moon", label: "Moon root" },
  { key: "sun", label: "Sun root" },
  { key: "rahu", label: "Rāhu root" },
  { key: "ketu", label: "Ketu root" },
];

const DEFAULT_ENTRIES: Record<RegisterKey, RegisterEntry> = {
  "d1-fifth": {
    direction: "favourable",
    strength: "strong",
    root: "mars",
    finding: REGISTERS[0].defaultFinding,
  },
  d7: {
    direction: "favourable",
    strength: "moderate",
    root: "none",
    finding: REGISTERS[1].defaultFinding,
  },
  jupiter: {
    direction: "favourable",
    strength: "strong",
    root: "jupiter",
    finding: REGISTERS[2].defaultFinding,
  },
  pk: {
    direction: "favourable",
    strength: "moderate",
    root: "none",
    finding: REGISTERS[3].defaultFinding,
  },
  kp: {
    direction: "favourable",
    strength: "strong",
    root: "jupiter",
    finding: REGISTERS[4].defaultFinding,
  },
};

const LORDS = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rāhu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;
const LORD_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rāhu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};
const JUPITER_MD_YEARS = 16;
const BHUKTI_SEQUENCE = [
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rāhu",
] as const;

function formatAge(years: number) {
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12 * 10) / 10;
  return m > 0 ? `${y}y ${m}m` : `${y}y`;
}

function computeBhuktis(startAge: number) {
  let cursor = startAge;
  return BHUKTI_SEQUENCE.map((lord) => {
    const duration = (JUPITER_MD_YEARS * LORD_YEARS[lord]) / 120;
    const from = cursor;
    cursor += duration;
    return { lord, duration, from, to: cursor };
  });
}

function computeAntardashas(
  bhuktiLord: string,
  bhuktiFrom: number,
  bhuktiYears: number,
) {
  const startIndex = LORDS.indexOf(bhuktiLord as (typeof LORDS)[number]);
  let cursor = bhuktiFrom;
  const result: { lord: string; duration: number; from: number; to: number }[] = [];
  for (let i = 0; i < 9; i += 1) {
    const lord = LORDS[(startIndex + i) % 9];
    const duration = (bhuktiYears * LORD_YEARS[lord as string]) / 120;
    const from = cursor;
    cursor += duration;
    result.push({ lord, duration, from, to: cursor });
  }
  return result;
}

function directionColor(direction: Direction) {
  return direction === "favourable"
    ? GREEN
    : direction === "stressed"
      ? VERMILION
      : GOLD;
}

export function WhenWillChildrenSynthesisBench() {
  const [entries, setEntries] = useState<Record<RegisterKey, RegisterEntry>>(
    DEFAULT_ENTRIES,
  );
  const [startAge, setStartAge] = useState(27);
  const [highlightMercury, setHighlightMercury] = useState(true);
  const [highlightMars, setHighlightMars] = useState(true);
  const [kpBhukti, setKpBhukti] = useState("Mercury");
  const [kpAntar, setKpAntar] = useState("Jupiter");
  const [sigH2, setSigH2] = useState(true);
  const [sigH5, setSigH5] = useState(true);
  const [sigH11, setSigH11] = useState(true);
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [noCountGender, setNoCountGender] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [pauseDistress, setPauseDistress] = useState(true);

  const {
    independentGroups,
    netScore,
    convergence,
    tier,
  } = useMemo(() => {
    const groups = new Map<
      RootKey,
      {
        score: number;
        registers: RegisterKey[];
        dominantDirection: Direction;
      }
    >();
    for (const reg of REGISTERS) {
      const entry = entries[reg.key];
      const score =
        DIRECTION_SCORES[entry.direction] *
        STRENGTH_MULTIPLIERS[entry.strength];
      const root = entry.root;
      const existing = groups.get(root);
      if (!existing || Math.abs(score) > Math.abs(existing.score)) {
        groups.set(root, {
          score,
          registers: [reg.key],
          dominantDirection: entry.direction,
        });
      } else if (existing && Math.abs(score) === Math.abs(existing.score)) {
        existing.registers.push(reg.key);
        if (score > existing.score)
          existing.dominantDirection = entry.direction;
      }
    }
    const independentGroups = Array.from(groups.entries()).map(
      ([root, data]) => {
        let label: string;
        if (root === "none") {
          label = data.registers
            .map((key) => REGISTERS.find((r) => r.key === key)?.label)
            .join(", ");
        } else if (
          root === "jupiter" &&
          data.registers.includes("jupiter") &&
          data.registers.includes("kp")
        ) {
          label = "Jupiter complex (kāraka + CSL + aspect)";
        } else {
          label = `${ROOT_OPTIONS.find((r) => r.key === root)?.label} group`;
        }
        return { root, ...data, label };
      },
    );
    const netScore = independentGroups.reduce(
      (sum, group) => sum + group.score,
      0,
    );
    const favourableCount = independentGroups.filter((g) => g.score > 0).length;
    const stressedCount = independentGroups.filter((g) => g.score < 0).length;
    const convergence =
      favourableCount > 0 && stressedCount === 0
        ? "favourable"
        : stressedCount > 0 && favourableCount === 0
          ? "stressed"
          : "mixed";
    let tier = "inconclusive";
    if (convergence === "favourable") {
      if (netScore >= 7) tier = "high-confidence favourable";
      else if (netScore >= 4) tier = "moderate-confidence favourable";
      else tier = "weak favourable";
    } else if (convergence === "stressed") {
      if (netScore <= -7) tier = "high-confidence stressed";
      else if (netScore <= -4) tier = "moderate-confidence stressed";
      else tier = "weak stressed";
    } else {
      tier = "mixed / held open";
    }
    return { independentGroups, netScore, convergence, tier };
  }, [entries]);

  const bhuktis = useMemo(() => computeBhuktis(startAge), [startAge]);
  const mercuryWindow = bhuktis.find((b) => b.lord === "Mercury");
  const marsWindow = bhuktis.find((b) => b.lord === "Mars");

  const kpRange = useMemo(() => {
    const bhukti = bhuktis.find((b) => b.lord === kpBhukti);
    if (!bhukti) return null;
    const antars = computeAntardashas(
      bhukti.lord,
      bhukti.from,
      bhukti.duration,
    );
    return antars.find((a) => a.lord === kpAntar) ?? null;
  }, [bhuktis, kpBhukti, kpAntar]);

  const overlapsMercury =
    kpRange &&
    mercuryWindow &&
    kpRange.from < mercuryWindow.to &&
    kpRange.to > mercuryWindow.from;
  const overlapsMars =
    kpRange &&
    marsWindow &&
    kpRange.from < marsWindow.to &&
    kpRange.to > marsWindow.from;

  const allGuards =
    nonFatalistic && noCountGender && medicalRoute && pauseDistress;
  const allSignificators = sigH2 && sigH5 && sigH11;

  const synthesis = useMemo(() => {
    if (!allGuards) {
      return "Enable all four ethical-closing toggles before presenting the synthesis.";
    }
    const gridSummary = REGISTERS.map((reg) => {
      const entry = entries[reg.key];
      return `${reg.label}: ${entry.direction} (${entry.strength})`;
    }).join("; ");
    const independentSummary = independentGroups
      .map((g) =>
        `${g.label} → ${
          g.score > 0 ? "favourable" : g.score < 0 ? "stressed" : "mixed"
        }`,
      )
      .join("; ");
    const parashariText =
      mercuryWindow && marsWindow
        ? `Parāśari Jupiter MD from age ${formatAge(
            startAge,
          )}: primary window ${formatAge(mercuryWindow.from)}–${formatAge(
            mercuryWindow.to,
          )} (Jupiter–Mercury); secondary window ${formatAge(
            marsWindow.from,
          )}–${formatAge(marsWindow.to)} (Jupiter–Mars).`
        : "";
    const kpText = kpRange
      ? `KP joint period ${kpBhukti}–${kpAntar} runs ${formatAge(
          kpRange.from,
        )}–${formatAge(kpRange.to)} and ${
          overlapsMercury
            ? "overlaps the primary Parāśari window"
            : overlapsMars
              ? "overlaps the secondary Parāśari window"
              : "does not overlap either Parāśari window"
        }.`
      : "";
    const timingText = `${parashariText} ${kpText} These are trend periods, not deadlines or guarantees.`;
    return `Findings: ${gridSummary}. Independent counts: ${independentSummary}. Net tier: ${tier}. ${timingText} Close with non-fatalistic language, no count or gender claim, medical routing, and attention to the client&apos;s emotional state.`;
  }, [
    allGuards,
    entries,
    independentGroups,
    tier,
    startAge,
    mercuryWindow,
    marsWindow,
    kpRange,
    kpBhukti,
    kpAntar,
    overlapsMercury,
    overlapsMars,
  ]);

  function updateEntry(
    key: RegisterKey,
    patch: Partial<RegisterEntry>,
  ) {
    setEntries((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  function reset() {
    setEntries(DEFAULT_ENTRIES);
    setStartAge(27);
    setHighlightMercury(true);
    setHighlightMars(true);
    setKpBhukti("Mercury");
    setKpAntar("Jupiter");
    setSigH2(true);
    setSigH5(true);
    setSigH11(true);
    setNonFatalistic(true);
    setNoCountGender(true);
    setMedicalRoute(true);
    setPauseDistress(true);
  }

  return (
    <div
      data-interactive="when-will-children-synthesis-bench"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}
    >
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>Worked synthesis: &quot;When will we have children?&quot;</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.32rem",
                fontWeight: 600,
              }}
            >
              Build the five-technique grid, count once, layer two timing methods
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              This bench preloads the Lesson 6.5.2 worked example (Cancer Lagna). Edit the registers, watch the Jupiter complex collapse to one counted finding, and check how the Parāśari and KP timing windows relate.
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={eyebrowStyle}>Synthesis map</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color:
                    convergence === "favourable"
                      ? GREEN
                      : convergence === "stressed"
                        ? VERMILION
                        : GOLD,
                  fontSize: "1.15rem",
                  fontWeight: 600,
                }}
              >
                {convergence} convergence
              </h3>
            </div>
            <strong
              style={{
                color:
                  netScore >= 4 ? GREEN : netScore <= -4 ? VERMILION : GOLD,
                fontWeight: 600,
              }}
            >
              Net score {netScore}
            </strong>
          </div>
          <SynthesisMapSvg entries={entries} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
              gap: "0.65rem",
            }}
          >
            <MiniFact
              icon={<Grid3X3 size={16} />}
              title="Registers"
              body={`${REGISTERS.length}`}
              color={PURPLE}
            />
            <MiniFact
              icon={<Scale size={16} />}
              title="Independent groups"
              body={`${independentGroups.length}`}
              color={BLUE}
            />
            <MiniFact
              icon={<Sparkles size={16} />}
              title="Net tier"
              body={tier}
              color={
                netScore >= 4 ? GREEN : netScore <= -4 ? VERMILION : GOLD
              }
            />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Findings grid</p>
            <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.5rem" }}>
              {REGISTERS.map((reg) => {
                const entry = entries[reg.key];
                const color = directionColor(entry.direction);
                return (
                  <div
                    key={reg.key}
                    style={{
                      border: `1px solid ${color}${"44"}`,
                      borderRadius: 8,
                      background: `${color}${"0A"}`,
                      padding: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ color, fontWeight: 600 }}>{reg.label}</span>
                      <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>
                        {reg.stream} · Ch.{reg.chapter}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0.35rem 0 0",
                        color: INK_SECONDARY,
                        fontSize: "0.86rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {entry.finding}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginTop: "0.55rem",
                      }}
                    >
                      {(["favourable", "mixed", "stressed"] as Direction[]).map(
                        (dir) => (
                          <button
                            key={dir}
                            type="button"
                            aria-pressed={entry.direction === dir}
                            onClick={() =>
                              updateEntry(reg.key, { direction: dir })
                            }
                            style={smallChipStyle(
                              entry.direction === dir,
                              directionColor(dir),
                            )}
                          >
                            {dir}
                          </button>
                        ),
                      )}
                      {(["strong", "moderate", "weak"] as Strength[]).map(
                        (str) => (
                          <button
                            key={str}
                            type="button"
                            aria-pressed={entry.strength === str}
                            onClick={() =>
                              updateEntry(reg.key, { strength: str })
                            }
                            style={smallChipStyle(
                              entry.strength === str,
                              GOLD,
                            )}
                          >
                            {str}
                          </button>
                        ),
                      )}
                    </div>
                    <label
                      style={{
                        display: "grid",
                        gap: "0.3rem",
                        color: INK_SECONDARY,
                        marginTop: "0.55rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>Underlying root (for counting discipline)</span>
                      <select
                        value={entry.root}
                        onChange={(e) =>
                          updateEntry(reg.key, {
                            root: e.target.value as RootKey,
                          })
                        }
                        style={selectStyle}
                      >
                        {ROOT_OPTIONS.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                );
              })}
            </div>
          </section>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Independent groups</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.9rem",
          }}
        >
          Registers sharing a root are counted once, using the strongest score in the group. Here D1 Jupiter and the KP 5th CSL share Jupiter, so they form one triple-reinforced complex.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: "0.55rem",
            marginTop: "0.75rem",
          }}
        >
          {independentGroups.map((group, index) => {
            const color =
              group.score > 0
                ? GREEN
                : group.score < 0
                  ? VERMILION
                  : GOLD;
            return (
              <div
                key={index}
                style={{
                  border: `1px solid ${color}${"44"}`,
                  borderRadius: 8,
                  background: `${color}${"0A"}`,
                  padding: "0.7rem",
                }}
              >
                <p style={{ margin: 0, color, fontWeight: 600 }}>
                  {group.label}
                </p>
                <p
                  style={{
                    margin: "0.3rem 0 0",
                    color: INK_SECONDARY,
                    fontSize: "0.85rem",
                  }}
                >
                  Score {group.score} · {group.dominantDirection}
                </p>
                {group.root !== "none" ? (
                  <p
                    style={{
                      margin: "0.3rem 0 0",
                      color: INK_MUTED,
                      fontSize: "0.78rem",
                    }}
                  >
                    Counted once: shared underlying fact
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={eyebrowStyle}>Parāśari timing</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: PURPLE,
                  fontSize: "1.12rem",
                  fontWeight: 600,
                }}
              >
                Jupiter mahādaśa bhukti windows
              </h3>
            </div>
            <strong style={{ color: INK_MUTED, fontWeight: 600 }}>
              Starts age {formatAge(startAge)}
            </strong>
          </div>
          <TimelineSvg
            bhuktis={bhuktis}
            highlightMercury={highlightMercury}
            highlightMars={highlightMars}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "0.55rem",
            }}
          >
            {mercuryWindow ? (
              <MiniFact
                icon={<Calendar size={16} />}
                title="Jupiter–Mercury"
                body={`${formatAge(mercuryWindow.from)} – ${formatAge(
                  mercuryWindow.to,
                )}`}
                color={GREEN}
              />
            ) : null}
            {marsWindow ? (
              <MiniFact
                icon={<Calendar size={16} />}
                title="Jupiter–Mars"
                body={`${formatAge(marsWindow.from)} – ${formatAge(
                  marsWindow.to,
                )}`}
                color={BLUE}
              />
            ) : null}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Timing inputs" icon={<Clock size={18} />} color={PURPLE}>
            <label
              style={{
                display: "grid",
                gap: "0.35rem",
                color: INK_SECONDARY,
              }}
            >
              <span>Jupiter mahādaśa starts at age</span>
              <input
                type="range"
                min={0}
                max={80}
                step={1}
                value={startAge}
                onChange={(e) => setStartAge(Number(e.target.value))}
                style={{ accentColor: GOLD, width: "100%" }}
                aria-label="Jupiter mahadasha start age"
              />
              <span style={{ color: GOLD, fontWeight: 600 }}>
                {formatAge(startAge)}
              </span>
            </label>
            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                marginTop: "0.75rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: INK_SECONDARY,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={highlightMercury}
                  onChange={(e) => setHighlightMercury(e.target.checked)}
                />
                Highlight Jupiter–Mercury bhukti (PK + star-lord echo)
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: INK_SECONDARY,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={highlightMars}
                  onChange={(e) => setHighlightMars(e.target.checked)}
                />
                Highlight Jupiter–Mars bhukti (5th-lord register)
              </label>
            </div>
          </Panel>

          <Panel title="KP joint-period check" icon={<Scale size={18} />} color={BLUE}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
                gap: "0.65rem",
              }}
            >
              <label style={{ display: "grid", gap: "0.3rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
                <span>Bhukti lord</span>
                <select
                  value={kpBhukti}
                  onChange={(e) => setKpBhukti(e.target.value)}
                  style={selectStyle}
                >
                  {LORDS.map((lord) => (
                    <option key={lord} value={lord}>
                      {lord}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "0.3rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
                <span>Antardaśā lord</span>
                <select
                  value={kpAntar}
                  onChange={(e) => setKpAntar(e.target.value)}
                  style={selectStyle}
                >
                  {LORDS.map((lord) => (
                    <option key={lord} value={lord}>
                      {lord}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginTop: "0.75rem",
              }}
            >
              {[
                { key: "2nd", label: "2nd", state: sigH2, set: setSigH2 },
                { key: "5th", label: "5th", state: sigH5, set: setSigH5 },
                { key: "11th", label: "11th", state: sigH11, set: setSigH11 },
              ].map((sig) => (
                <button
                  key={sig.key}
                  type="button"
                  aria-pressed={sig.state}
                  onClick={() => sig.set((v) => !v)}
                  style={smallChipStyle(sig.state, GREEN)}
                >
                  {sig.label} significator
                </button>
              ))}
            </div>
            {kpRange ? (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.65rem",
                  borderRadius: 8,
                  border: `1px solid ${
                    overlapsMercury || overlapsMars ? GREEN : GOLD
                  }${"44"}`,
                  background: `${
                    overlapsMercury || overlapsMars ? GREEN : GOLD
                  }${"0A"}`,
                }}
              >
                <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600 }}>
                  {kpBhukti}–{kpAntar}: {formatAge(kpRange.from)} –{" "}
                  {formatAge(kpRange.to)}
                </p>
                <p
                  style={{
                    margin: "0.3rem 0 0",
                    color: INK_SECONDARY,
                    fontSize: "0.86rem",
                  }}
                >
                  {overlapsMercury
                    ? "Overlaps the primary Parāśari Jupiter–Mercury window."
                    : overlapsMars
                      ? "Overlaps the secondary Parāśari Jupiter–Mars window."
                      : "No overlap with the highlighted Parāśari windows."}
                </p>
                {!allSignificators ? (
                  <p
                    style={{
                      margin: "0.3rem 0 0",
                      color: VERMILION,
                      fontSize: "0.86rem",
                    }}
                  >
                    Activate 2nd, 5th, and 11th significators for a children-timing claim.
                  </p>
                ) : null}
              </div>
            ) : null}
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical closing</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <GuardToggle
              active={nonFatalistic}
              icon={<Scale size={18} />}
              title="Non-fatalistic"
              body={
                nonFatalistic
                  ? "No verdict forecloses biological possibility."
                  : "Warning: avoid foreclosure language."
              }
              onClick={() => setNonFatalistic((v) => !v)}
            />
            <GuardToggle
              active={noCountGender}
              icon={<Baby size={18} />}
              title="No count or gender"
              body={
                noCountGender
                  ? "Categorical refusal, regardless of convergence."
                  : "Warning: count/gender claims are out of scope."
              }
              onClick={() => setNoCountGender((v) => !v)}
            />
            <GuardToggle
              active={medicalRoute}
              icon={<HeartPulse size={18} />}
              title="Medical routing"
              body={
                medicalRoute
                  ? "Clinical concerns go to a specialist."
                  : "Warning: do not let astrology override medical care."
              }
              onClick={() => setMedicalRoute((v) => !v)}
            />
            <GuardToggle
              active={pauseDistress}
              icon={<ShieldCheck size={18} />}
              title="Pause for distress"
              body={
                pauseDistress
                  ? "Client state takes priority over the schedule."
                  : "Warning: do not push the synthesis past real distress."
              }
              onClick={() => setPauseDistress((v) => !v)}
            />
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            borderColor: allGuards
              ? `${GREEN}${"66"}`
              : `${VERMILION}${"66"}`,
            background: allGuards ? `${GREEN}${"0F"}` : `${VERMILION}${"0F"}`,
          }}
        >
          <p style={eyebrowStyle}>Net synthesis</p>
          <h3
            style={{
              margin: "0.15rem 0 0",
              color: allGuards
                ? convergence === "favourable"
                  ? GREEN
                  : convergence === "stressed"
                    ? VERMILION
                    : GOLD
                : VERMILION,
              fontSize: "1.15rem",
              fontWeight: 600,
            }}
          >
            {allGuards ? tier : "Ethical closing incomplete"}
          </h3>
          <p
            style={{
              margin: "0.65rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.6,
            }}
          >
            {synthesis}
          </p>
        </section>
      </div>
    </div>
  );
}

function SynthesisMapSvg({
  entries,
}: {
  entries: Record<RegisterKey, RegisterEntry>;
}) {
  const nodes = REGISTERS.map((reg, index) => {
    const angle = (index / REGISTERS.length) * Math.PI * 2 - Math.PI / 2;
    const x = 280 + 150 * Math.cos(angle);
    const y = 120 + 90 * Math.sin(angle);
    return { ...reg, x, y, ...entries[reg.key] };
  });

  const rootGroups = new Map<RootKey, typeof nodes>();
  for (const node of nodes) {
    if (node.root !== "none") {
      const list = rootGroups.get(node.root) ?? [];
      list.push(node);
      rootGroups.set(node.root, list);
    }
  }

  return (
    <svg
      viewBox="0 0 560 260"
      role="img"
      aria-label="Five register synthesis map"
      style={{
        width: "100%",
        maxHeight: 300,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      <rect
        x="14"
        y="14"
        width="532"
        height="232"
        rx="8"
        fill={`${GOLD}${"0F"}`}
        stroke={HAIRLINE}
      />
      {Array.from(rootGroups.values()).map((group) =>
        group.map((node, i) =>
          group.slice(i + 1).map((other) => (
            <line
              key={`${node.key}-${other.key}`}
              x1={node.x}
              y1={node.y}
              x2={other.x}
              y2={other.y}
              stroke={directionColor(node.direction)}
              strokeWidth="3"
              strokeDasharray="5 4"
              opacity="0.75"
            />
          )),
        ),
      )}
      {nodes.map((node) => {
        const color = directionColor(node.direction);
        const r =
          node.strength === "strong" ? 28 : node.strength === "moderate" ? 24 : 20;
        return (
          <g key={node.key}>
            <circle
              cx={node.x}
              cy={node.y}
              r={r}
              fill={`${color}${"18"}`}
              stroke={color}
              strokeWidth="3"
            />
            <text
              x={node.x}
              y={node.y - 4}
              textAnchor="middle"
              fill={color}
              fontSize="11"
              fontWeight="600"
            >
              {node.label.split(" ")[0]}
            </text>
            <text
              x={node.x}
              y={node.y + 10}
              textAnchor="middle"
              fill={INK_PRIMARY}
              fontSize="10"
              fontWeight="600"
            >
              {node.direction}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TimelineSvg({
  bhuktis,
  highlightMercury,
  highlightMars,
}: {
  bhuktis: Array<{ lord: string; duration: number; from: number; to: number }>;
  highlightMercury: boolean;
  highlightMars: boolean;
}) {
  const total = bhuktis[bhuktis.length - 1].to - bhuktis[0].from;
  const startX = 50;
  const endX = 510;
  const trackY = 120;
  const trackWidth = endX - startX;

  return (
    <svg
      viewBox="0 0 560 260"
      role="img"
      aria-label="Jupiter mahadasha bhukti timeline"
      style={{
        width: "100%",
        maxHeight: 300,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      <rect
        x="14"
        y="14"
        width="532"
        height="232"
        rx="8"
        fill={`${PURPLE}${"05"}`}
        stroke={HAIRLINE}
      />
      <line
        x1={startX}
        y1={trackY}
        x2={endX}
        y2={trackY}
        stroke={HAIRLINE}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {bhuktis.map((b, i) => {
        const left = startX + ((b.from - bhuktis[0].from) / total) * trackWidth;
        const width = (b.duration / total) * trackWidth;
        const isHighlighted =
          (b.lord === "Mercury" && highlightMercury) ||
          (b.lord === "Mars" && highlightMars);
        return (
          <g key={b.lord}>
            <rect
              x={left}
              y={trackY - 14}
              width={width}
              height="28"
              rx="5"
              fill={
                isHighlighted
                  ? b.lord === "Mercury"
                    ? GREEN
                    : BLUE
                  : i % 2 === 0
                    ? `${BLUE}${"22"}`
                    : `${GOLD}${"22"}`
              }
              stroke={isHighlighted ? (b.lord === "Mercury" ? GREEN : BLUE) : HAIRLINE}
              strokeWidth={isHighlighted ? 2 : 1}
            />
            <text
              x={left + width / 2}
              y={trackY + 4}
              textAnchor="middle"
              fill={isHighlighted ? "#fff" : INK_SECONDARY}
              fontSize={width > 32 ? "10" : "8"}
              fontWeight="600"
            >
              {b.lord.slice(0, 3)}
            </text>
            {isHighlighted ? (
              <text
                x={left + width / 2}
                y={trackY - 24}
                textAnchor="middle"
                fill={b.lord === "Mercury" ? GREEN : BLUE}
                fontSize="10"
                fontWeight="600"
              >
                {b.lord === "Mercury" ? "primary" : "secondary"}
              </text>
            ) : null}
          </g>
        );
      })}
      <text
        x={startX}
        y={trackY + 40}
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="10"
        fontWeight="600"
      >
        {formatAge(bhuktis[0].from)}
      </text>
      <text
        x={endX}
        y={trackY + 40}
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="10"
        fontWeight="600"
      >
        {formatAge(bhuktis[bhuktis.length - 1].to)}
      </text>
      <g transform="translate(50 210)">
        <rect
          x="0"
          y="-6"
          width="14"
          height="12"
          rx="3"
          fill={GREEN}
        />
        <text
          x="22"
          y="4"
          fill={INK_SECONDARY}
          fontSize="10"
          fontWeight="600"
        >
          primary window
        </text>
        <rect
          x="130"
          y="-6"
          width="14"
          height="12"
          rx="3"
          fill={BLUE}
        />
        <text
          x="152"
          y="4"
          fill={INK_SECONDARY}
          fontSize="10"
          fontWeight="600"
        >
          secondary window
        </text>
      </g>
    </svg>
  );
}

function Panel({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        border: `1px solid ${color}${"44"}`,
        borderRadius: 8,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          color,
          fontWeight: 600,
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({
  icon,
  title,
  body,
  color,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}${"44"}`,
        borderRadius: 8,
        background: `${color}${"10"}`,
        padding: "0.7rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          color,
          fontWeight: 600,
        }}
      >
        {icon}
        {title}
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          fontSize: "0.86rem",
          lineHeight: 1.35,
        }}
      >
        {body}
      </p>
    </div>
  );
}

function GuardToggle({
  active,
  icon,
  title,
  body,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={toggleStyle(active, active ? GREEN : VERMILION)}
    >
      <span style={{ color: active ? GREEN : VERMILION }}>
        {active ? icon : <XCircle size={18} />}
      </span>
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
    padding: "0.4rem 0.6rem",
    fontSize: "0.82rem",
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
