"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Eye,
  Layers3,
  MoveRight,
  RotateCcw,
  Scale,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  workbenchDiagramLayoutStyle,
  workbenchTwoColumnStyle,
} from "@/components/learning-runtime/interactive/lib/layouts";

type GenderKey = "female" | "male";
type LordKey =
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn";
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
  { label: string; short: string; color: string }
> = {
  sun: { label: "Sun", short: "Su", color: VERMILION },
  moon: { label: "Moon", short: "Mo", color: BLUE },
  mars: { label: "Mars", short: "Ma", color: VERMILION },
  mercury: { label: "Mercury", short: "Me", color: GREEN },
  jupiter: { label: "Jupiter", short: "Ju", color: GREEN },
  venus: { label: "Venus", short: "Ve", color: GOLD },
  saturn: { label: "Saturn", short: "Sa", color: PURPLE },
};

const NAISARGIKA_FRIENDS: Record<LordKey, LordKey[]> = {
  sun: ["moon", "mars", "jupiter"],
  moon: ["sun", "mercury"],
  mars: ["sun", "moon", "jupiter"],
  mercury: ["sun", "venus"],
  jupiter: ["sun", "moon", "mars"],
  venus: ["mercury", "saturn"],
  saturn: ["mercury", "venus"],
};

const NAISARGIKA_ENEMIES: Record<LordKey, LordKey[]> = {
  sun: ["venus", "saturn"],
  moon: [],
  mars: ["mercury"],
  mercury: ["moon"],
  jupiter: ["mercury", "venus"],
  venus: ["sun", "moon"],
  saturn: ["sun", "moon", "mars"],
};

const KAVYA_POSITIONS: Record<LordKey, SignKey> = {
  moon: "sagittarius",
  sun: "gemini",
  mars: "aries",
  mercury: "gemini",
  jupiter: "pisces",
  venus: "leo",
  saturn: "libra",
};

const COMPOUND_COLORS: Record<Compound, string> = {
  "Adhi-Mitra": GREEN,
  Mitra: "#4A9A6B",
  Sama: GOLD,
  Shatru: VERMILION,
  "Adhi-Shatru": "#7A1E12",
};

const KARAKA: Record<
  LordKey,
  { domains: string[]; spouseFor?: GenderKey }
> = {
  sun: { domains: ["Father", "Soul / self", "Authority", "Government", "Vitality"] },
  moon: { domains: ["Mother", "Mind", "Emotions", "Public"] },
  mars: { domains: ["Siblings (especially brothers)", "Courage", "Land / property"] },
  mercury: { domains: ["Communication", "Intellect", "Business", "Education"] },
  jupiter: {
    domains: ["Children", "Wisdom", "Guru / teacher", "Dharma", "Wealth"],
    spouseFor: "female",
  },
  venus: {
    domains: ["Luxury", "Arts", "Romance", "Vehicles"],
    spouseFor: "male",
  },
  saturn: { domains: ["Longevity", "Career / karma", "Service", "Discipline", "Delays"] },
};

const TIMING_SNIPPET: Partial<Record<LordKey, string>> = {
  jupiter: "age 33.423–34.756 (about 16 months)",
  venus: "age 38.339–40.006 (about 20 months)",
};

function getNaisargika(mdLord: LordKey, adLord: LordKey): "friend" | "neutral" | "enemy" {
  if (NAISARGIKA_FRIENDS[mdLord].includes(adLord)) return "friend";
  if (NAISARGIKA_ENEMIES[mdLord].includes(adLord)) return "enemy";
  return "neutral";
}

function getTatkalikaDistance(mdSign: SignKey, adSign: SignKey): number {
  return (SIGN_INDEX[adSign] - SIGN_INDEX[mdSign] + 12) % 12 + 1;
}

function getTatkalika(distance: number): "friend" | "enemy" {
  return [2, 3, 4, 10, 11, 12].includes(distance) ? "friend" : "enemy";
}

function getCompound(
  naisargika: "friend" | "neutral" | "enemy",
  tatkalika: "friend" | "enemy"
): Compound {
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
  return "Adhi-Shatru";
}

function getTextureWord(compound: Compound): string {
  if (compound === "Adhi-Mitra" || compound === "Mitra") return "supportive";
  if (compound === "Sama") return "mixed / context-dependent";
  return "friction-leaning";
}

function getCombinedRead(
  ad: LordKey,
  compound: Compound,
  gender: GenderKey,
  collapse: boolean
): string {
  const karaka = KARAKA[ad];
  const spouseNote =
    karaka.spouseFor === gender
      ? `; ${LORDS[ad].label} also serves as the ${
          gender === "female" ? "husband" : "wife"
        }-karaka under the ${gender}-chart convention`
      : "";
  const domains = karaka.domains.join(", ") + spouseNote;

  if (collapse) {
    return `${LORDS[ad].label} is ${compound.toLowerCase()} and signifies ${domains}. Therefore, those matters will simply go ${
      compound === "Adhi-Mitra" || compound === "Mitra" ? "well" : "badly"
    }.`;
  }

  return `Moon/${LORDS[ad].label} antardaśā brings ${domains} into focus. The Panchadha layer is ${compound.toLowerCase()}, so this domain tends to run ${getTextureWord(
    compound
  )} relative to the Moon mahādaśā's significations. This is a statement of focus and tendency, not a guarantee.`;
}

export function KarakaOverlayCascadeWorkbench() {
  const [gender, setGender] = useState<GenderKey>("female");
  const [selectedLord, setSelectedLord] = useState<LordKey | null>(null);
  const [collapseMode, setCollapseMode] = useState(false);

  const kavyaRows = useMemo(() => {
    const md: LordKey = "moon";
    const mdSign = KAVYA_POSITIONS[md];
    const adLords: LordKey[] = [
      "jupiter",
      "saturn",
      "sun",
      "mercury",
      "mars",
      "venus",
    ];
    return adLords.map((ad) => {
      const adSign = KAVYA_POSITIONS[ad];
      const n = getNaisargika(md, ad);
      const d = getTatkalikaDistance(mdSign, adSign);
      const t = getTatkalika(d);
      const c = getCompound(n, t);
      return {
        ad,
        compound: c,
        read: getCombinedRead(ad, c, gender, false),
      };
    });
  }, [gender]);

  const activeLord = selectedLord ?? "jupiter";
  const activeRow = kavyaRows.find((r) => r.ad === activeLord)!;

  function resetAll() {
    setGender("female");
    setSelectedLord(null);
    setCollapseMode(false);
  }

  return (
    <div
      data-interactive="karaka-overlay-cascade-workbench"
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
            <p style={eyebrowStyle}>Karaka overlay workbench</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              A third lens: which domain is in focus
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Timing tells *when*, Panchadha tells *how smoothly*, and karaka
              tells *which life domain* a sub-period brings forward. Keep the
              three lenses independent.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAll}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
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
              <p style={eyebrowStyle}>Three-lens synthesis</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: collapseMode ? VERMILION : BLUE,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {collapseMode
                  ? "Lenses collapsed into one claim"
                  : `${LORDS[activeLord].label}: focus + texture + timing`}
              </h3>
            </div>
          </div>
          <LensSvg compound={activeRow.compound} collapse={collapseMode} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
              gap: "0.65rem",
            }}
          >
            <MiniFact
              icon={<Eye size={16} />}
              title="Karaka focus"
              body={getKarakaLabel(activeLord, gender)}
              color={BLUE}
            />
            <MiniFact
              icon={<Scale size={16} />}
              title="Panchadha texture"
              body={activeRow.compound}
              color={COMPOUND_COLORS[activeRow.compound]}
            />
            <MiniFact
              icon={<MoveRight size={16} />}
              title="Timing"
              body={TIMING_SNIPPET[activeLord] ?? "Within Kavya's Moon-MD cascade"}
              color={PURPLE}
            />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Native gender" icon={<User size={18} />} color={PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                type="button"
                aria-pressed={gender === "female"}
                onClick={() => setGender("female")}
                style={smallChipStyle(gender === "female", PURPLE)}
              >
                Female chart (Kavya)
              </button>
              <button
                type="button"
                aria-pressed={gender === "male"}
                onClick={() => setGender("male")}
                style={smallChipStyle(gender === "male", BLUE)}
              >
                Male chart
              </button>
            </div>
            <p style={bodyTextStyle}>
              {gender === "female"
                ? "Jupiter is the husband-karaka; Venus carries only its general significations."
                : "Venus is the wife-karaka; Jupiter carries only its general significations."}
            </p>
          </Panel>

          <Panel title="Select an AD lord" icon={<Layers3 size={18} />} color={BLUE}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
                gap: "0.45rem",
              }}
            >
              {kavyaRows.map((row) => (
                <button
                  key={row.ad}
                  type="button"
                  aria-pressed={activeLord === row.ad}
                  onClick={() => setSelectedLord(row.ad)}
                  style={smallChipStyle(
                    activeLord === row.ad,
                    COMPOUND_COLORS[row.compound]
                  )}
                >
                  {LORDS[row.ad].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>
              Load one of Kavya&apos;s six classified antardaśā lords into the
              three-lens synthesizer.
            </p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Keep the lenses separate</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button
              type="button"
              aria-pressed={!collapseMode}
              onClick={() => setCollapseMode(false)}
              style={togglePanelStyle(!collapseMode, GREEN)}
            >
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <span style={{ fontWeight: 600 }}>Three independent questions</span>
                <span>
                  {`
                    When, how smoothly, and which domain are asked separately;
                    the combined read stays hedged.
                  `}
                </span>
              </span>
            </button>
            <button
              type="button"
              aria-pressed={collapseMode}
              onClick={() => setCollapseMode(true)}
              style={togglePanelStyle(collapseMode, VERMILION)}
            >
              <AlertTriangle size={18} aria-hidden="true" />
              <span>
                <span style={{ fontWeight: 600 }}>Collapse into Panchadha (warning)</span>
                <span>
                  {`
                    Treating karaka domain as automatically favoured or harmed by
                    the Panchadha label is Common Mistake #3.
                  `}
                </span>
              </span>
            </button>
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            borderColor: collapseMode ? `${VERMILION}66` : `${GREEN}66`,
            background: collapseMode ? `${VERMILION}0F` : `${GREEN}0F`,
          }}
        >
          <p style={eyebrowStyle}>Combined read</p>
          <h3
            style={{
              margin: "0.15rem 0 0",
              color: collapseMode ? VERMILION : GREEN,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            {collapseMode
              ? "Flattened prediction"
              : `${LORDS[activeLord].label}: focus + tendency`}
          </h3>
          <p
            style={{
              margin: "0.65rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.6,
            }}
          >
            {getCombinedRead(activeLord, activeRow.compound, gender, collapseMode)}
          </p>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Naisargika karaka reference</p>
        <h3
          style={{
            margin: "0.15rem 0 0.75rem",
            color: BLUE,
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          Fixed significations for the seven classical planets
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.65rem",
          }}
        >
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
            <KarakaCard key={lord} lord={lord} gender={gender} />
          ))}
        </div>
        <p
          style={{
            margin: "0.65rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.5,
            fontSize: "0.9rem",
          }}
        >
          Rāhu and Ketu are omitted because no single naisargika karaka
          assignment is settled enough across traditions to present as fact.
        </p>
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
          Timing + Panchadha + Karaka combined for each AD lord
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
              minWidth: 520,
            }}
          >
            <thead>
              <tr style={{ background: `${GOLD}08` }}>
                <th style={thStyle}>AD lord</th>
                <th style={thStyle}>Panchadha</th>
                <th style={thStyle}>Karaka focus</th>
                <th style={thStyle}>Combined read</th>
              </tr>
            </thead>
            <tbody>
              {kavyaRows.map((row) => {
                const isSelected = activeLord === row.ad;
                return (
                  <tr
                    key={row.ad}
                    onClick={() => setSelectedLord(row.ad)}
                    style={{
                      cursor: "pointer",
                      background: isSelected
                        ? `${COMPOUND_COLORS[row.compound]}0A`
                        : "transparent",
                    }}
                  >
                    <td style={tdStyle}>
                      <span style={{ color: LORDS[row.ad].color, fontWeight: 600 }}>
                        {LORDS[row.ad].label}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          color: COMPOUND_COLORS[row.compound],
                          fontWeight: 600,
                        }}
                      >
                        {row.compound}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: INK_SECONDARY }}>
                        {getKarakaLabel(row.ad, gender)}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: INK_SECONDARY }}>
                      {row.read}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${VERMILION}66`,
          background: `${VERMILION}0A`,
        }}
      >
        <p style={eyebrowStyle}>Source-scope disclosure</p>
        <h3
          style={{
            margin: "0.15rem 0 0.5rem",
            color: VERMILION,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          No claimed interactive design exists for this lesson
        </h3>
        <p
          style={{
            margin: 0,
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          The module overview does not list a karaka-specific tool among its
          six claimed components, and the Tier 1 Module 10 cross-reference
          Lesson 10.4.2 is not authored. This workbench was built directly from
          the lesson&apos;s own teaching content and Kavya&apos;s established
          chart data.
        </p>
      </section>
    </div>
  );
}

function getKarakaLabel(lord: LordKey, gender: GenderKey): string {
  const k = KARAKA[lord];
  const spouse =
    k.spouseFor === gender
      ? `${gender === "female" ? "husband" : "wife"}-karaka; `
      : "";
  return `${spouse}${k.domains.join(", ")}`;
}

function KarakaCard({ lord, gender }: { lord: LordKey; gender: GenderKey }) {
  const k = KARAKA[lord];
  const isSpouse = k.spouseFor === gender;
  return (
    <div
      style={{
        border: `1px solid ${isSpouse ? GOLD : LORDS[lord].color}44`,
        borderRadius: 8,
        background: isSpouse ? `${GOLD}0F` : `${LORDS[lord].color}0A`,
        padding: "0.85rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: LORDS[lord].color,
          fontWeight: 600,
        }}
      >
        <span>{LORDS[lord].label}</span>
        {isSpouse ? (
          <span
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              padding: "0.1rem 0.35rem",
              borderRadius: 4,
              background: GOLD,
              color: "#fff",
            }}
          >
            {gender === "female" ? "husband" : "wife"}-karaka
          </span>
        ) : null}
      </div>
      <p
        style={{
          margin: "0.4rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.4,
          fontSize: "0.88rem",
        }}
      >
        {k.domains.join(", ")}
      </p>
    </div>
  );
}

function LensSvg({
  compound,
  collapse,
}: {
  compound: Compound;
  collapse: boolean;
}) {
  const compoundColor = COMPOUND_COLORS[compound];

  return (
    <svg
      viewBox="0 0 560 280"
      role="img"
      aria-label="Three independent lenses converging into one combined read"
      style={{
        width: "100%",
        maxHeight: 320,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      <rect x="24" y="20" width="512" height="230" rx="8" fill={`${GOLD}0A`} stroke={HAIRLINE} />

      {/* three lens circles */}
      <circle cx="110" cy="95" r="46" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="4" />
      <text x="110" y="90" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight={600}>
        Timing
      </text>
      <text x="110" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>
        when
      </text>

      <circle cx="280" cy="95" r="46" fill={`${compoundColor}18`} stroke={compoundColor} strokeWidth="4" />
      <text x="280" y="90" textAnchor="middle" fill={compoundColor} fontSize="14" fontWeight={600}>
        Panchadha
      </text>
      <text x="280" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>
        texture
      </text>

      <circle cx="450" cy="95" r="46" fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="4" />
      <text x="450" y="90" textAnchor="middle" fill={PURPLE} fontSize="14" fontWeight={600}>
        Karaka
      </text>
      <text x="450" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>
        domain
      </text>

      {/* converging paths */}
      {collapse ? (
        <>
          <path d="M 110 142 L 280 200" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="6 5" />
          <path d="M 280 142 L 280 200" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="6 5" />
          <path d="M 450 142 L 280 200" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="6 5" />
          <circle cx="280" cy="200" r="28" fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="4" />
          <text x="280" y="196" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={600}>
            collapsed
          </text>
          <text x="280" y="212" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight={600}>
            one claim
          </text>
          <path d="M 250 240 L 310 240" stroke={VERMILION} strokeWidth="6" strokeLinecap="round" />
          <path d="M 268 224 L 292 256 M 292 224 L 268 256" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
          <path d="M 268 224 L 292 256 M 292 224 L 268 256" stroke={VERMILION} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M 110 142 C 170 175, 220 175, 250 195" stroke={BLUE} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 280 142 L 280 190" stroke={compoundColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M 450 142 C 390 175, 340 175, 310 195" stroke={PURPLE} strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="280" cy="200" r="28" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="4" />
          <text x="280" y="196" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={600}>
            combined
          </text>
          <text x="280" y="212" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={600}>
            read
          </text>
          <text x="280" y="250" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>
            Three separate inputs → one hedged interpretation
          </text>
        </>
      )}
    </svg>
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
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: `${color}0F`,
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
          lineHeight: 1.35,
        }}
      >
        {body}
      </p>
    </div>
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

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
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
