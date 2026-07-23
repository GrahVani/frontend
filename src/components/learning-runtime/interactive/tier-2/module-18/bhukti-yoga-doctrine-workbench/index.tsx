"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  GitCompare,
  Layers3,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type LordKey =
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn"
  | "rahu"
  | "ketu";
type SignKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";
type Naisargika = "friend" | "neutral" | "enemy";
type Tatkalika = "friend" | "neutral" | "enemy";
type Compound =
  | "Adhi-Mitra"
  | "Mitra"
  | "Sama"
  | "Shatru"
  | "Adhi-Shatru";

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

const SIGNS: SignKey[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

const SIGN_INDEX: Record<SignKey, number> = {
  aries: 0,
  taurus: 1,
  gemini: 2,
  cancer: 3,
  leo: 4,
  virgo: 5,
  libra: 6,
  scorpio: 7,
  sagittarius: 8,
  capricorn: 9,
  aquarius: 10,
  pisces: 11,
};

const LORDS: Record<
  LordKey,
  { label: string; short: string; color: string; hasNaisargika: boolean }
> = {
  sun: { label: "Sun", short: "Su", color: VERMILION, hasNaisargika: true },
  moon: { label: "Moon", short: "Mo", color: BLUE, hasNaisargika: true },
  mars: { label: "Mars", short: "Ma", color: VERMILION, hasNaisargika: true },
  mercury: { label: "Mercury", short: "Me", color: GREEN, hasNaisargika: true },
  jupiter: { label: "Jupiter", short: "Ju", color: GREEN, hasNaisargika: true },
  venus: { label: "Venus", short: "Ve", color: GOLD, hasNaisargika: true },
  saturn: { label: "Saturn", short: "Sa", color: PURPLE, hasNaisargika: true },
  rahu: { label: "Rāhu", short: "Ra", color: PURPLE, hasNaisargika: false },
  ketu: { label: "Ketu", short: "Ke", color: PURPLE, hasNaisargika: false },
};

const NAISARGIKA_FRIENDS: Record<LordKey, LordKey[]> = {
  sun: ["moon", "mars", "jupiter"],
  moon: ["sun", "mercury"],
  mars: ["sun", "moon", "jupiter"],
  mercury: ["sun", "venus"],
  jupiter: ["sun", "moon", "mars"],
  venus: ["mercury", "saturn"],
  saturn: ["mercury", "venus"],
  rahu: [],
  ketu: [],
};

const NAISARGIKA_ENEMIES: Record<LordKey, LordKey[]> = {
  sun: ["venus", "saturn"],
  moon: [],
  mars: ["mercury"],
  mercury: ["moon"],
  jupiter: ["mercury", "venus"],
  venus: ["sun", "moon"],
  saturn: ["sun", "moon", "mars"],
  rahu: [],
  ketu: [],
};

const SIGN_LABEL: Record<SignKey, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

const KAVYA_POSITIONS: Partial<Record<LordKey, SignKey>> = {
  moon: "sagittarius",
  sun: "gemini",
  mars: "aries",
  mercury: "gemini",
  jupiter: "pisces",
  venus: "leo",
  saturn: "libra",
};

function getNaisargika(mdLord: LordKey, adLord: LordKey): Naisargika | null {
  if (!LORDS[mdLord].hasNaisargika || !LORDS[adLord].hasNaisargika) return null;
  if (NAISARGIKA_FRIENDS[mdLord].includes(adLord)) return "friend";
  if (NAISARGIKA_ENEMIES[mdLord].includes(adLord)) return "enemy";
  return "neutral";
}

function getTatkalikaDistance(mdSign: SignKey, adSign: SignKey): number {
  return (SIGN_INDEX[adSign] - SIGN_INDEX[mdSign] + 12) % 12 + 1;
}

function getTatkalika(distance: number): Tatkalika {
  const friendDistances = [2, 3, 4, 10, 11, 12];
  return friendDistances.includes(distance) ? "friend" : "enemy";
}

function getCompound(
  naisargika: Naisargika,
  tatkalika: Tatkalika
): Compound | null {
  if (naisargika === "friend" && tatkalika === "friend") return "Adhi-Mitra";
  if (
    (naisargika === "friend" && tatkalika === "enemy") ||
    (naisargika === "enemy" && tatkalika === "friend") ||
    (naisargika === "neutral" && tatkalika === "neutral")
  )
    return "Sama";
  if (
    (naisargika === "friend" && tatkalika === "neutral") ||
    (naisargika === "neutral" && tatkalika === "friend")
  )
    return "Mitra";
  if (
    (naisargika === "neutral" && tatkalika === "enemy") ||
    (naisargika === "enemy" && tatkalika === "neutral")
  )
    return "Shatru";
  if (naisargika === "enemy" && tatkalika === "enemy") return "Adhi-Shatru";
  return null;
}

const COMPOUND_COLORS: Record<Compound, string> = {
  "Adhi-Mitra": GREEN,
  Mitra: "#4A9A6B",
  Sama: GOLD,
  Shatru: VERMILION,
  "Adhi-Shatru": "#7A1E12",
};

export function BhuktiYogaDoctrineWorkbench() {
  const [mdLord, setMdLord] = useState<LordKey>("moon");
  const [mdSign, setMdSign] = useState<SignKey>("sagittarius");
  const [adLord, setAdLord] = useState<LordKey>("jupiter");
  const [adSign, setAdSign] = useState<SignKey>("pisces");
  const [showTerminology, setShowTerminology] = useState(true);

  const naisargika = getNaisargika(mdLord, adLord);
  const distance = getTatkalikaDistance(mdSign, adSign);
  const tatkalika = getTatkalika(distance);
  const compound = naisargika ? getCompound(naisargika, tatkalika) : null;

  const kavyaSpread = useMemo(() => {
    const md = "moon";
    const mdS = KAVYA_POSITIONS[md] ?? "sagittarius";
    const adLords: LordKey[] = [
      "sun",
      "mars",
      "rahu",
      "jupiter",
      "saturn",
      "mercury",
      "ketu",
      "venus",
    ];
    return adLords.map((ad) => {
      const adS = KAVYA_POSITIONS[ad];
      const n = getNaisargika(md, ad);
      if (!adS || n === null) {
        return { adLord: ad, naisargika: null, distance: null, tatkalika: null, compound: null };
      }
      const d = getTatkalikaDistance(mdS, adS);
      const t = getTatkalika(d);
      const c = getCompound(n, t);
      return {
        adLord: ad,
        naisargika: n,
        distance: d,
        tatkalika: t,
        compound: c,
      };
    });
  }, []);

  return (
    <div
      data-interactive="bhukti-yoga-doctrine-workbench"
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
            <p style={eyebrowStyle}>Bhukti-yoga doctrine at full depth</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              Pañcadhā Maitri applied to MD-AD pairs
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Two planets running together tell only part of the story; how they
              relate modulates the period. Compute naisargika and tatkalika
              friendship, compound them, and see the result on Kavya&apos;s
              chart.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMdLord("moon");
              setMdSign("sagittarius");
              setAdLord("jupiter");
              setAdSign("pisces");
              setShowTerminology(true);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${BLUE}66`,
          background: `${BLUE}0A`,
        }}
      >
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
            <p style={eyebrowStyle}>Terminology disclosure</p>
            <h3
              style={{
                margin: "0.15rem 0 0",
                color: BLUE,
                fontSize: "1.18rem",
                fontWeight: 600,
              }}
            >
              Is &ldquo;bhukti yoga&rdquo; a classical term?
            </h3>
          </div>
          <button
            type="button"
            aria-pressed={showTerminology}
            onClick={() => setShowTerminology((v) => !v)}
            style={buttonStyle(showTerminology, BLUE)}
          >
            {showTerminology ? "Hide" : "Show"} note
          </button>
        </div>
        {showTerminology ? (
          <p
            style={{
              margin: "0.65rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            The compound &ldquo;bhukti yoga&rdquo; is this curriculum&apos;s own
            descriptive label, not attested classical terminology. The
            underlying analysis — applying Pañcadhā Maitri to the MD-AD pair —
            is genuine classical doctrine. The label is retained because it is
            load-bearing in the module slugs, but disclosed here.
          </p>
        ) : null}
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Naisargika friendship table</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: GREEN,
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Natural, fixed relationships
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.82rem",
                minWidth: 420,
              }}
            >
              <thead>
                <tr style={{ background: `${GOLD}08` }}>
                  <th style={thStyle}>Planet</th>
                  <th style={thStyle}>Friends</th>
                  <th style={thStyle}>Enemies</th>
                  <th style={thStyle}>Neutral</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    "sun",
                    "moon",
                    "mars",
                    "mercury",
                    "jupiter",
                    "venus",
                    "saturn",
                  ] as LordKey[]
                ).map((lord) => (
                  <tr key={lord}>
                    <td style={tdStyle}>
                      <span style={{ color: LORDS[lord].color, fontWeight: 700 }}>
                        {LORDS[lord].label}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {NAISARGIKA_FRIENDS[lord]
                        .map((l) => LORDS[l].label)
                        .join(", ") || "—"}
                    </td>
                    <td style={tdStyle}>
                      {NAISARGIKA_ENEMIES[lord]
                        .map((l) => LORDS[l].label)
                        .join(", ") || "—"}
                    </td>
                    <td style={tdStyle}>
                      {(
                        [
                          "sun",
                          "moon",
                          "mars",
                          "mercury",
                          "jupiter",
                          "venus",
                          "saturn",
                        ] as LordKey[]
                      )
                        .filter(
                          (l) =>
                            l !== lord &&
                            !NAISARGIKA_FRIENDS[lord].includes(l) &&
                            !NAISARGIKA_ENEMIES[lord].includes(l)
                        )
                        .map((l) => LORDS[l].label)
                        .join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Tatkalika rule" icon={<GitCompare size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              Temporary friendship depends on sign distance from the MD lord.
            </p>
            <div
              style={{
                marginTop: "0.55rem",
                padding: "0.55rem",
                borderRadius: 8,
                background: `${PURPLE}0F`,
                color: INK_PRIMARY,
                fontSize: "0.9rem",
              }}
            >
              Distance in {"{2,3,4,10,11,12}"} → Friend
              <br />
              Distance in {"{1,5,6,7,8,9}"} → Enemy
            </div>
            <p style={bodyTextStyle}>
              Source confidence is lower than naisargika — attributed to BPHS
              3.55-3.56 only via secondary compilation, not independently
              verified this session.
            </p>
          </Panel>

          <Panel title="Compound rule" icon={<Layers3 size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
              <CompoundRuleRow n="friend" t="friend" c="Adhi-Mitra" />
              <CompoundRuleRow n="friend" t="neutral" c="Mitra" />
              <CompoundRuleRow n="neutral" t="friend" c="Mitra" />
              <CompoundRuleRow n="neutral" t="neutral" c="Sama" />
              <CompoundRuleRow n="friend" t="enemy" c="Sama" />
              <CompoundRuleRow n="enemy" t="friend" c="Sama" />
              <CompoundRuleRow n="neutral" t="enemy" c="Shatru" />
              <CompoundRuleRow n="enemy" t="neutral" c="Shatru" />
              <CompoundRuleRow n="enemy" t="enemy" c="Adhi-Shatru" />
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>MD-AD pair calculator</p>
        <h3
          style={{
            margin: "0.15rem 0 0.75rem",
            color: BLUE,
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          Compute naisargika + tatkalika → compound
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.85rem",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 0.4rem",
                color: INK_MUTED,
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              MD lord
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {(
                [
                  "sun",
                  "moon",
                  "mars",
                  "mercury",
                  "jupiter",
                  "venus",
                  "saturn",
                ] as LordKey[]
              ).map((lord) => (
                <button
                  key={lord}
                  type="button"
                  aria-pressed={mdLord === lord}
                  onClick={() => setMdLord(lord)}
                  style={smallChipStyle(mdLord === lord, LORDS[lord].color)}
                >
                  {LORDS[lord].short}
                </button>
              ))}
            </div>
            <select
              value={mdSign}
              onChange={(e) => setMdSign(e.target.value as SignKey)}
              style={{
                width: "100%",
                marginTop: "0.55rem",
                padding: "0.5rem",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                background: "transparent",
                color: INK_PRIMARY,
              }}
            >
              {SIGNS.map((sign) => (
                <option key={sign} value={sign}>
                  {SIGN_LABEL[sign]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p
              style={{
                margin: "0 0 0.4rem",
                color: INK_MUTED,
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              AD lord
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {(
                [
                  "sun",
                  "moon",
                  "mars",
                  "mercury",
                  "jupiter",
                  "venus",
                  "saturn",
                ] as LordKey[]
              ).map((lord) => (
                <button
                  key={lord}
                  type="button"
                  aria-pressed={adLord === lord}
                  onClick={() => setAdLord(lord)}
                  style={smallChipStyle(adLord === lord, LORDS[lord].color)}
                >
                  {LORDS[lord].short}
                </button>
              ))}
            </div>
            <select
              value={adSign}
              onChange={(e) => setAdSign(e.target.value as SignKey)}
              style={{
                width: "100%",
                marginTop: "0.55rem",
                padding: "0.5rem",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                background: "transparent",
                color: INK_PRIMARY,
              }}
            >
              {SIGNS.map((sign) => (
                <option key={sign} value={sign}>
                  {SIGN_LABEL[sign]}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              border: `1px solid ${compound ? COMPOUND_COLORS[compound] : HAIRLINE}`,
              borderRadius: 8,
              padding: "0.85rem",
              background: compound ? `${COMPOUND_COLORS[compound]}0F` : "transparent",
            }}
          >
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
              Result
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: compound ? COMPOUND_COLORS[compound] : INK_PRIMARY,
                fontSize: "1.35rem",
                fontWeight: 700,
              }}
            >
              {compound ?? "N/A"}
            </p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
              {naisargika
                ? `Naisargika ${naisargika}; tatkalika ${tatkalika} (${distance}th sign)`
                : "Nodes carry no naisargika relationship."}
            </p>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Kavya&apos;s Moon mahādaśā spread</p>
        <h3
          style={{
            margin: "0.15rem 0 0.75rem",
            color: PURPLE,
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          Pañcadhā Maitri against each AD lord
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
              minWidth: 420,
            }}
          >
            <thead>
              <tr style={{ background: `${GOLD}08` }}>
                <th style={thStyle}>AD lord</th>
                <th style={thStyle}>Naisargika</th>
                <th style={thStyle}>Tatkalika</th>
                <th style={thStyle}>Compound</th>
              </tr>
            </thead>
            <tbody>
              {kavyaSpread.map((row) => (
                <tr key={row.adLord}>
                  <td style={tdStyle}>
                    <span style={{ color: LORDS[row.adLord].color, fontWeight: 700 }}>
                      {LORDS[row.adLord].label}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {row.naisargika ? (
                      <RelationshipBadge value={row.naisargika} />
                    ) : (
                      <span style={{ color: INK_MUTED }}>excluded</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {row.tatkalika ? (
                      <>
                        <RelationshipBadge value={row.tatkalika} />
                        <span style={{ color: INK_MUTED, fontSize: "0.78rem", marginLeft: "0.35rem" }}>
                          ({row.distance}th)
                        </span>
                      </>
                    ) : (
                      <span style={{ color: INK_MUTED }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {row.compound ? (
                      <span
                        style={{
                          color: COMPOUND_COLORS[row.compound],
                          fontWeight: 700,
                        }}
                      >
                        {row.compound}
                      </span>
                    ) : (
                      <span style={{ color: INK_MUTED }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.9rem" }}>
          Moon has no naisargika enemies, so every Shatru result under a Moon
          mahādaśā is driven entirely by the tatkalika layer.
        </p>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${VERMILION}66`,
          background: `${VERMILION}0A`,
        }}
      >
        <p style={eyebrowStyle}>Tool-scope disclosure</p>
        <h3
          style={{
            margin: "0.15rem 0 0.5rem",
            color: VERMILION,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          What the claimed tool does and does not cover
        </h3>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
          The module overview names <strong style={{ fontWeight: 700 }}>bhukti-yoga-checker</strong>, but no spec with that
          name exists. A related file, <strong style={{ fontWeight: 700 }}>bhukti-yoga-matrix.md</strong>, covers only
          naisargika friendship with a simple 3-way mapping — not the tatkalika
          layer or the full 5-fold Pañcadhā compound this lesson teaches.
        </p>
      </section>
    </div>
  );
}

function CompoundRuleRow({
  n,
  t,
  c,
}: {
  n: Naisargika;
  t: Tatkalika;
  c: Compound;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.35rem 0",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <span style={{ color: INK_SECONDARY }}>
        <RelationshipBadge value={n} /> + <RelationshipBadge value={t} />
      </span>
      <span style={{ color: COMPOUND_COLORS[c], fontWeight: 700 }}>{c}</span>
    </div>
  );
}

function RelationshipBadge({
  value,
}: {
  value: Naisargika | Tatkalika;
}) {
  const color =
    value === "friend" ? GREEN : value === "enemy" ? VERMILION : GOLD;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.45rem",
        borderRadius: 4,
        background: `${color}1A`,
        color,
        fontSize: "0.78rem",
        fontWeight: 700,
        textTransform: "capitalize",
      }}
    >
      {value}
    </span>
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
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color,
          fontWeight: 700,
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
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
    fontSize: "0.85rem",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
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
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const thStyle: CSSProperties = {
  padding: "0.5rem 0.65rem",
  textAlign: "left",
  color: INK_MUTED,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.45rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
};
