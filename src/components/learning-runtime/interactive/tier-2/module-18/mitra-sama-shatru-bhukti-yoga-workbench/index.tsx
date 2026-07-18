"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  MoveRight,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import {
  workbenchDiagramLayoutStyle,
  workbenchTwoColumnStyle,
} from "@/components/learning-runtime/interactive/lib/layouts";

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
type DignityKey = "strong" | "mixed" | "weak";

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

const KAVYA_DIGNITY: Record<LordKey, DignityKey> = {
  jupiter: "strong",
  saturn: "strong",
  sun: "mixed",
  mercury: "strong",
  mars: "strong",
  venus: "weak",
};

const COMPOUND_ORDER: Compound[] = [
  "Adhi-Mitra",
  "Mitra",
  "Sama",
  "Shatru",
  "Adhi-Shatru",
];

const COMPOUND_COLORS: Record<Compound, string> = {
  "Adhi-Mitra": GREEN,
  Mitra: "#4A9A6B",
  Sama: GOLD,
  Shatru: VERMILION,
  "Adhi-Shatru": "#7A1E12",
};

const CATEGORIES: Record<
  Compound,
  {
    meaning: string;
    kavyaPresence: string;
    structuralNote: string;
  }
> = {
  "Adhi-Mitra": {
    meaning:
      "Strongest positive modulation. The AD lord actively supports the MD lord's significations.",
    kavyaPresence: "Not present in Kavya's Moon-MD spread.",
    structuralNote:
      "Possible in principle, but none of her six classified antardaśā lords compound here.",
  },
  Mitra: {
    meaning:
      "Genuinely supportive, though less strongly reinforcing than Adhi-Mitra.",
    kavyaPresence: "Present: Jupiter and Saturn antardaśās.",
    structuralNote: "These sub-periods tend to cooperate with the Moon-MD direction.",
  },
  Sama: {
    meaning:
      "Mixed and context-dependent. The relationship gives no strong push either way.",
    kavyaPresence: "Present: Sun and Mercury antardaśās.",
    structuralNote:
      "Other factors — dignity, house-lordship, transits — carry more weight.",
  },
  Shatru: {
    meaning:
      "Friction-leaning. The sub-period requires more active management of the MD significations.",
    kavyaPresence: "Present: Mars and Venus antardaśās.",
    structuralNote:
      "Moon has no naisargika enemies, so these are driven by the tatkalika layer alone.",
  },
  "Adhi-Shatru": {
    meaning:
      "Strongest negative modulation. The AD lord works most actively against the MD lord's significations.",
    kavyaPresence: "Not present in Kavya's Moon-MD spread.",
    structuralNote:
      "Structurally impossible with Moon as MD lord: Moon has no naisargika enemies.",
  },
};

const DIGNITIES: Record<
  DignityKey,
  { label: string; reading: string; vector: "up" | "neutral" | "down" }
> = {
  strong: {
    label: "Strong",
    reading: "well-resourced and able to offset friction or reinforce support",
    vector: "up",
  },
  mixed: {
    label: "Mixed",
    reading: "moderate; the Panchadha layer keeps most of the say",
    vector: "neutral",
  },
  weak: {
    label: "Weak",
    reading: "under-resourced, so the Panchadha friction compounds or support thins",
    vector: "down",
  },
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

function getInterpretiveRead(compound: Compound, dignity: DignityKey): string {
  if (compound === "Adhi-Mitra") {
    return `Strong support ${
      dignity === "weak"
        ? "thinned by the AD lord's weaker dignity — still cooperative, but with less capacity to deliver."
        : dignity === "mixed"
        ? "with moderate delivery; the relationship itself carries the read."
        : "with real capacity to deliver — the most cooperative texture in the system."
    }`;
  }
  if (compound === "Mitra") {
    return `Supportive baseline ${
      dignity === "weak"
        ? "but the AD lord is under-resourced, so the cooperation is weaker than it looks."
        : dignity === "mixed"
        ? "with ordinary delivery; a genuinely cooperative sub-period."
        : "and well-resourced — a smooth, cooperative sub-period."
    }`;
  }
  if (compound === "Sama") {
    return `No strong Panchadha push ${
      dignity === "weak"
        ? "and weaker dignity tilts the read toward effort; context matters more."
        : dignity === "mixed"
        ? "— dignity is also mixed, so house-lordship and transits dominate."
        : "but strong dignity gives the AD lord capacity to shape the period constructively."
    }`;
  }
  if (compound === "Shatru") {
    return `Friction-leaning baseline ${
      dignity === "weak"
        ? "with under-resourced AD lord — the friction runs harder and has less built-in capacity to offset it."
        : dignity === "mixed"
        ? "with moderate capacity; active management is still called for."
        : "but the AD lord is well-resourced — friction with capacity to meet it."
    }`;
  }
  return `Strongest opposition ${
    dignity === "weak"
      ? "and under-resourced AD lord — the hardest-leaning texture."
      : dignity === "mixed"
      ? "with moderate capacity; still the most actively opposed baseline."
      : "offset partly by AD lord strength — still opposed, but not helpless."
  }`;
}

export function MitraSamaShatruBhuktiYogaWorkbench() {
  const [selectedCategory, setSelectedCategory] = useState<Compound | null>(null);
  const [selectedLord, setSelectedLord] = useState<LordKey | null>(null);
  const [lordDignity, setLordDignity] = useState<Record<LordKey, DignityKey>>({
    ...KAVYA_DIGNITY,
  });
  const [verdictMode, setVerdictMode] = useState(false);

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
        dignity: lordDignity[ad],
        read: getInterpretiveRead(c, lordDignity[ad]),
      };
    });
  }, [lordDignity]);

  const activeLord = selectedLord ?? "mars";
  const activeCompound = useMemo(
    () => kavyaRows.find((r) => r.ad === activeLord)?.compound ?? "Shatru",
    [kavyaRows, activeLord]
  );
  const activeDignity = lordDignity[activeLord];

  function resetAll() {
    setSelectedCategory(null);
    setSelectedLord(null);
    setLordDignity({ ...KAVYA_DIGNITY });
    setVerdictMode(false);
  }

  return (
    <div
      data-interactive="mitra-sama-shatru-bhukti-yoga-workbench"
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
            <p style={eyebrowStyle}>Bhukti-yoga interpretive workbench</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              From Panchadha label to lived texture
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              The Pañcadhā category is a baseline modulator, not a verdict.
              Layer dignity on top and the same label can produce genuinely
              different textures.
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
            <p style={eyebrowStyle}>Modulator spectrum</p>
            <h3
              style={{
                margin: "0.15rem 0 0",
                color: selectedCategory
                  ? COMPOUND_COLORS[selectedCategory]
                  : INK_PRIMARY,
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              {selectedCategory
                ? `${selectedCategory}: ${CATEGORIES[selectedCategory].meaning}`
                : "Click a category to see its interpretive meaning"}
            </h3>
          </div>
        </div>
        <SpectrumSvg
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        {selectedCategory ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "0.65rem",
              marginTop: "0.75rem",
            }}
          >
            <MiniFact
              icon={<CheckCircle2 size={16} />}
              title="Kavya's chart"
              body={CATEGORIES[selectedCategory].kavyaPresence}
              color={COMPOUND_COLORS[selectedCategory]}
            />
            <MiniFact
              icon={<Scale size={16} />}
              title="Structural note"
              body={CATEGORIES[selectedCategory].structuralNote}
              color={INK_MUTED}
            />
          </div>
        ) : null}
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
              <p style={eyebrowStyle}>Dignity modulator</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: verdictMode ? VERMILION : COMPOUND_COLORS[activeCompound],
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {verdictMode
                  ? "Verdict mode — flattening the read"
                  : `${LORDS[activeLord].label}: ${activeCompound}`}
              </h3>
            </div>
          </div>
          <TextureSvg
            compound={activeCompound}
            dignity={activeDignity}
            verdictMode={verdictMode}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
              gap: "0.65rem",
            }}
          >
            <MiniFact
              icon={<ArrowLeftRight size={16} />}
              title="Panchadha baseline"
              body={activeCompound}
              color={COMPOUND_COLORS[activeCompound]}
            />
            <MiniFact
              icon={<SlidersHorizontal size={16} />}
              title="Dignity overlay"
              body={DIGNITIES[activeDignity].label}
              color={
                activeDignity === "strong"
                  ? GREEN
                  : activeDignity === "weak"
                  ? VERMILION
                  : GOLD
              }
            />
            <MiniFact
              icon={<MoveRight size={16} />}
              title="Modulated texture"
              body={getInterpretiveRead(activeCompound, activeDignity)}
              color={verdictMode ? VERMILION : GREEN}
            />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Select an AD lord" icon={<Scale size={18} />} color={BLUE}>
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
              Choose one of Kavya&apos;s six classified antardaśā lords to layer
              dignity onto its Panchadha baseline.
            </p>
          </Panel>

          <Panel
            title="Set AD lord dignity"
            icon={<SlidersHorizontal size={18} />}
            color={
              activeDignity === "strong"
                ? GREEN
                : activeDignity === "weak"
                ? VERMILION
                : GOLD
            }
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={activeDignity === key}
                  onClick={() =>
                    setLordDignity((prev) => ({ ...prev, [activeLord]: key }))
                  }
                  style={smallChipStyle(
                    activeDignity === key,
                    key === "strong"
                      ? GREEN
                      : key === "weak"
                      ? VERMILION
                      : GOLD
                  )}
                >
                  {DIGNITIES[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{DIGNITIES[activeDignity].reading}.</p>
            <button
              type="button"
              onClick={() =>
                setLordDignity((prev) => ({
                  ...prev,
                  [activeLord]: KAVYA_DIGNITY[activeLord],
                }))
              }
              style={{
                ...buttonStyle(false, GOLD),
                marginTop: "0.55rem",
                width: "100%",
                justifyContent: "center",
              }}
            >
              Use Kavya&apos;s actual dignity
            </button>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Modulator, not verdict</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button
              type="button"
              aria-pressed={!verdictMode}
              onClick={() => setVerdictMode(false)}
              style={togglePanelStyle(!verdictMode, GREEN)}
            >
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <span style={{ fontWeight: 600 }}>Modulator framing</span>
                <span>
                  {`
                    The label describes a baseline tendency; dignity and other
                    factors shape the actual texture.
                  `}
                </span>
              </span>
            </button>
            <button
              type="button"
              aria-pressed={verdictMode}
              onClick={() => setVerdictMode(true)}
              style={togglePanelStyle(verdictMode, VERMILION)}
            >
              <AlertTriangle size={18} aria-hidden="true" />
              <span>
                <span style={{ fontWeight: 600 }}>Verdict framing (warning)</span>
                <span>
                  {`
                    Delivering a Shatru read as "this period will be bad" is
                    exactly the mistake this lesson warns against.
                  `}
                </span>
              </span>
            </button>
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            borderColor: verdictMode ? `${VERMILION}66` : `${GREEN}66`,
            background: verdictMode ? `${VERMILION}0F` : `${GREEN}0F`,
          }}
        >
          <p style={eyebrowStyle}>Combined interpretive read</p>
          <h3
            style={{
              margin: "0.15rem 0 0",
              color: verdictMode ? VERMILION : GREEN,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            {verdictMode
              ? "Caution: reading flattened into a verdict"
              : `${LORDS[activeLord].label} antardaśā texture`}
          </h3>
          <p
            style={{
              margin: "0.65rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.6,
            }}
          >
            {verdictMode
              ? `A ${activeCompound} finding for ${LORDS[activeLord].label} would be delivered as a flat good-or-bad prediction. That misses the dignity layer: the same label can point in different directions once capacity is checked.`
              : getInterpretiveRead(activeCompound, activeDignity)}
          </p>
        </section>
      </div>

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
          Panchadha baseline + dignity = differentiated read
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
              minWidth: 480,
            }}
          >
            <thead>
              <tr style={{ background: `${GOLD}08` }}>
                <th style={thStyle}>AD lord</th>
                <th style={thStyle}>Panchadha</th>
                <th style={thStyle}>Dignity state</th>
                <th style={thStyle}>Interpretive read</th>
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
                      background: isSelected ? `${COMPOUND_COLORS[row.compound]}0A` : "transparent",
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
                      <DignityBadge value={row.dignity} />
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
        <p
          style={{
            margin: "0.65rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.5,
            fontSize: "0.9rem",
          }}
        >
          Rāhu and Ketu are omitted from this table because they carry no
          naisargika relationship and therefore do not receive a Pañcadhā
          classification. Kavya&apos;s real spread reaches only the three middle
          categories.
        </p>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${BLUE}66`,
          background: `${BLUE}0A`,
        }}
      >
        <p style={eyebrowStyle}>Source-scope disclosure</p>
        <h3
          style={{
            margin: "0.15rem 0 0.5rem",
            color: BLUE,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          Why this workbench is new
        </h3>
        <p
          style={{
            margin: 0,
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          The existing{" "}
          <span style={{ fontWeight: 600 }}>bhukti-yoga-matrix.md</span> design
          is tied to an unauthored Tier 1 lesson and scoped to naisargika-only
          relationships with simple dignity toggles. This lesson needs the full
          Pañcadhā layer, the tatkalika contribution, and Kavya&apos;s actual
          chart — so a separate component was built instead of retrofitting the
          older spec.
        </p>
      </section>
    </div>
  );
}

function SpectrumSvg({
  selected,
  onSelect,
}: {
  selected: Compound | null;
  onSelect: (c: Compound) => void;
}) {
  const positions: Record<Compound, number> = {
    "Adhi-Mitra": 70,
    Mitra: 175,
    Sama: 280,
    Shatru: 385,
    "Adhi-Shatru": 490,
  };

  return (
    <svg
      viewBox="0 0 560 130"
      role="img"
      aria-label="Panchadha Maitri spectrum from Adhi-Mitra to Adhi-Shatru"
      style={{
        width: "100%",
        maxHeight: 180,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      <defs>
        <linearGradient id="panchadhaGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GREEN} />
          <stop offset="35%" stopColor={GREEN} />
          <stop offset="50%" stopColor={GOLD} />
          <stop offset="65%" stopColor={VERMILION} />
          <stop offset="100%" stopColor="#7A1E12" />
        </linearGradient>
      </defs>
      <rect x="30" y="52" width="500" height="16" rx="8" fill="url(#panchadhaGradient)" />
      {COMPOUND_ORDER.map((c) => {
        const isSelected = selected === c;
        return (
          <g
            key={c}
            onClick={() => onSelect(c)}
            style={{ cursor: "pointer" }}
            role="button"
            aria-pressed={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect(c);
            }}
          >
            <circle
              cx={positions[c]}
              cy="60"
              r={isSelected ? 16 : 11}
              fill={isSelected ? COMPOUND_COLORS[c] : SURFACE}
              stroke={COMPOUND_COLORS[c]}
              strokeWidth={isSelected ? 5 : 3}
            />
            <text
              x={positions[c]}
              y="105"
              textAnchor="middle"
              fill={isSelected ? COMPOUND_COLORS[c] : INK_SECONDARY}
              fontSize="12"
              fontWeight={isSelected ? 700 : 600}
            >
              {c}
            </text>
          </g>
        );
      })}
      <text x="30" y="30" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        supportive baseline
      </text>
      <text x="530" y="30" textAnchor="end" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        friction baseline
      </text>
    </svg>
  );
}

function TextureSvg({
  compound,
  dignity,
  verdictMode,
}: {
  compound: Compound;
  dignity: DignityKey;
  verdictMode: boolean;
}) {
  const baselineColor = COMPOUND_COLORS[compound];
  const dignityColor =
    dignity === "strong" ? GREEN : dignity === "weak" ? VERMILION : GOLD;
  const baselineX =
    compound === "Adhi-Mitra"
      ? 110
      : compound === "Mitra"
      ? 185
      : compound === "Sama"
      ? 280
      : compound === "Shatru"
      ? 375
      : 450;

  return (
    <svg
      viewBox="0 0 560 260"
      role="img"
      aria-label="Panchadha baseline and dignity overlay forming a modulated texture"
      style={{
        width: "100%",
        maxHeight: 300,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      <rect x="24" y="24" width="512" height="200" rx="8" fill={`${GOLD}0A`} stroke={HAIRLINE} />

      {/* baseline arrow */}
      <line x1="80" y1="120" x2="480" y2="120" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="480,116 490,120 480,124" fill={INK_MUTED} />
      <circle cx={baselineX} cy="120" r="26" fill={`${baselineColor}18`} stroke={baselineColor} strokeWidth="4" />
      <text x={baselineX} y="116" textAnchor="middle" fill={baselineColor} fontSize="13" fontWeight={600}>
        {compound}
      </text>
      <text x={baselineX} y="132" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>
        baseline
      </text>
      <text x="75" y="150" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        support
      </text>
      <text x="485" y="150" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        friction
      </text>

      {/* dignity arrow */}
      <line x1="280" y1="170" x2="280" y2="70" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="276,70 280,60 284,70" fill={INK_MUTED} />
      <line
        x1="280"
        y1="170"
        x2="280"
        y2={dignity === "strong" ? 80 : dignity === "weak" ? 170 : 125}
        stroke={dignityColor}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text x="300" y="82" fill={dignityColor} fontSize="12" fontWeight={600}>
        strong dignity
      </text>
      <text x="300" y="178" fill={VERMILION} fontSize="12" fontWeight={600}>
        weak dignity
      </text>

      {verdictMode ? (
        <>
          <path d="M 250 200 L 310 200" stroke={VERMILION} strokeWidth="6" strokeLinecap="round" />
          <path d="M 268 184 L 292 216 M 292 184 L 268 216" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
          <path d="M 268 184 L 292 216 M 292 184 L 268 216" stroke={VERMILION} strokeWidth="4" strokeLinecap="round" />
          <text x="280" y="238" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={600}>
            Verdict mode flattens both layers
          </text>
        </>
      ) : (
        <>
          <circle cx="280" cy="120" r="10" fill={GREEN} />
          <text x="280" y="238" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={600}>
            Baseline + dignity = modulated texture
          </text>
        </>
      )}
    </svg>
  );
}

function DignityBadge({ value }: { value: DignityKey }) {
  const color =
    value === "strong" ? GREEN : value === "weak" ? VERMILION : GOLD;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.45rem",
        borderRadius: 4,
        background: `${color}1A`,
        color,
        fontSize: "0.78rem",
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {DIGNITIES[value].label}
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
