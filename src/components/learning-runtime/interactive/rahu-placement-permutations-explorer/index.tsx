"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  MapPin,
  RefreshCcw,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

type Category = "reinforced" | "travel-adjacent" | "coloured-citable" | "coloured";

const CATEGORIES: Record<
  Category,
  { label: string; color: string; description: string }
> = {
  reinforced: {
    label: "Reinforced fit",
    color: GREEN,
    description: "House has its own independent classical 'foreign' citation.",
  },
  "travel-adjacent": {
    label: "Travel-adjacent",
    color: GOLD,
    description: "House is travel-related but not explicitly 'foreign'; lighter reinforcement.",
  },
  "coloured-citable": {
    label: "Coloured fit (citable)",
    color: BLUE,
    description: "No independent foreign citation, but a citable T1 worked example exists.",
  },
  coloured: {
    label: "Coloured fit",
    color: INK_MUTED,
    description: "Rāhu's own foreign signature colours this house's base domain.",
  },
};

const HOUSES: {
  house: number;
  category: Category;
  domain: string;
  citation?: string;
  example?: string;
}[] = [
  { house: 1, category: "coloured", domain: "self, body, temperament" },
  { house: 2, category: "coloured", domain: "wealth, family, speech" },
  {
    house: 3,
    category: "travel-adjacent",
    domain: "short journeys, effort, siblings",
  },
  { house: 4, category: "coloured", domain: "home, mother, roots" },
  { house: 5, category: "coloured", domain: "children, intelligence, speculation" },
  { house: 6, category: "coloured", domain: "conflict, service, health" },
  {
    house: 7,
    category: "reinforced",
    domain: "partnership, spouse, trade",
    citation: "BPHS Bhāvādhyāya 12.8 — videśa-gamanam (foreign travel)",
  },
  { house: 8, category: "coloured", domain: "longevity, obstacles, transformation" },
  {
    house: 9,
    category: "reinforced",
    domain: "dharma, long-distance travel, guru",
    citation: "BPHS Bhāvādhyāya 12.10 / T1-06 6.4.3 — foreign/distant lands",
  },
  {
    house: 10,
    category: "coloured-citable",
    domain: "career, status, public role",
    example: "T1-05 5.7.3 — foreign-tinged or technology-driven career",
  },
  {
    house: 11,
    category: "coloured-citable",
    domain: "gains, networks, elder siblings",
    example: "T1-06 6.2.4 — expanding, foreign-flavoured gains and networks",
  },
  {
    house: 12,
    category: "reinforced",
    domain: "foreign lands, expenditure, dissolution",
    citation: "BPHS Bhāvādhyāya 12.13 — videśaś ca (foreign lands)",
  },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "equal",
    label: "Every Rāhu house-placement is an equally strong foreign-settlement indicator.",
    correction:
      "Reinforced-fit houses (12th, 9th, 7th) have independent classical corroboration; coloured-fit houses rely on Rāhu's signature alone.",
  },
  {
    key: "third",
    label: "The 3rd house carries the same kind of explicit 'foreign' citation as the 12th, 9th, and 7th.",
    correction:
      "The 3rd is travel-adjacent (short journeys), not explicitly 'foreign' — a real but lighter reinforcement.",
  },
  {
    key: "invent",
    label: "For houses with no citable example, we can invent a specific classical claim to complete the table.",
    correction:
      "Where no citation exists, disclose the gap rather than manufacture a claim.",
  },
] as const;

export function RahuPlacementPermutationsExplorer() {
  const [primary, setPrimary] = useState(12);
  const [compare, setCompare] = useState(5);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    equal: false,
    third: false,
    invent: false,
  });

  const primaryHouse = HOUSES.find((h) => h.house === primary)!;
  const compareHouse = HOUSES.find((h) => h.house === compare)!;

  const synthesis = useMemo(() => {
    const pCat = CATEGORIES[primaryHouse.category];
    const cCat = CATEGORIES[compareHouse.category];
    return `Chart T1's Rāhu is in the ${primaryHouse.house}th house — a ${pCat.label.toLowerCase()} because ${pCat.description.toLowerCase()} Comparing with the ${compareHouse.house}th house (${cCat.label.toLowerCase()}) shows the difference in evidential weight.`;
  }, [primaryHouse, compareHouse]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setPrimary(12);
    setCompare(5);
    setMistakes({ equal: false, third: false, invent: false });
  }

  return (
    <div
      data-interactive="rahu-placement-permutations-explorer"
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
            <p style={eyebrowStyle}>Chart T1 — Rāhu placement permutations</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Reinforced-fit vs coloured-fit houses
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Move Rāhu through the twelve houses and see which placements are doubly reinforced by the house&apos;s own classical foreign citation, which are travel-adjacent, and which are simply coloured by Rāhu&apos;s signature.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>House selector</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          Click a house to make it the primary placement. Shift-click (or click again) a second house to set the comparison. Chart T1 default is the 12th.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 60px), 1fr))",
            gap: "0.45rem",
            marginTop: "0.65rem",
          }}
        >
          {HOUSES.map((h) => {
            const isPrimary = primary === h.house;
            const isCompare = compare === h.house;
            const cat = CATEGORIES[h.category];
            return (
              <button
                key={h.house}
                type="button"
                aria-pressed={isPrimary || isCompare}
                onClick={() => {
                  if (isPrimary) return;
                  if (isCompare) {
                    setPrimary(h.house);
                    setCompare(compare === h.house ? 5 : compare);
                    return;
                  }
                  setCompare(primary);
                  setPrimary(h.house);
                }}
                style={{
                  position: "relative",
                  border: `1px solid ${
                    isPrimary ? cat.color : isCompare ? `${cat.color}88` : HAIRLINE
                  }`,
                  borderRadius: 8,
                  background: isPrimary
                    ? cat.color
                    : isCompare
                      ? `${cat.color}22`
                      : "transparent",
                  color: isPrimary ? "#fff" : cat.color,
                  padding: "0.55rem 0.35rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {h.house}
                {isPrimary ? (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: GOLD,
                      color: "#fff",
                      fontSize: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    1
                  </span>
                ) : null}
                {isCompare ? (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: INK_MUTED,
                      color: "#fff",
                      fontSize: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    2
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.55rem",
            marginTop: "0.75rem",
          }}
        >
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <span
              key={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: cat.color,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: cat.color,
                }}
              />
              {cat.label}
            </span>
          ))}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <HouseDetailCard
          rank={1}
          house={primaryHouse}
          onChange={(h) => setPrimary(h)}
        />
        <HouseDetailCard
          rank={2}
          house={compareHouse}
          onChange={(h) => setCompare(h)}
        />
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}${"0A"}` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleMistake(s.key)}
                  />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: VERMILION,
                      fontSize: "0.86rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <AlertTriangle size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Integrated reading</p>
        <p
          style={{
            margin: "0.45rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          {synthesis}
        </p>
      </section>
    </div>
  );
}

function HouseDetailCard({
  rank,
  house,
  onChange,
}: {
  rank: number;
  house: (typeof HOUSES)[number];
  onChange: (house: number) => void;
}) {
  const cat = CATEGORIES[house.category];
  return (
    <section
      style={{
        ...cardStyle,
        borderColor: `${cat.color}${"66"}`,
        background: `${cat.color}${"08"}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
          alignItems: "start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={eyebrowStyle}>
            {rank === 1 ? "Primary placement" : "Comparison placement"}
          </p>
          <h3
            style={{
              margin: "0.15rem 0 0",
              color: cat.color,
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            {house.house}th house · {cat.label}
          </h3>
        </div>
        <select
          value={house.house}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            border: `1px solid ${cat.color}`,
            borderRadius: 8,
            background: SURFACE,
            color: INK_PRIMARY,
            padding: "0.4rem 0.6rem",
            fontWeight: 600,
          }}
        >
          {HOUSES.map((h) => (
            <option key={h.house} value={h.house}>
              {h.house}th
            </option>
          ))}
        </select>
      </div>
      <p
        style={{
          margin: "0.55rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.5,
        }}
      >
        <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>Domain:</span>{" "}
        {house.domain}
      </p>
      {house.citation ? (
        <p
          style={{
            margin: "0.45rem 0 0",
            color: GREEN,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          <BookOpen size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
          {house.citation}
        </p>
      ) : null}
      {house.example ? (
        <p
          style={{
            margin: "0.45rem 0 0",
            color: BLUE,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          <MapPin size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
          {house.example}
        </p>
      ) : null}
      <p
        style={{
          margin: "0.55rem 0 0",
          color: INK_SECONDARY,
          fontSize: "0.86rem",
          lineHeight: 1.55,
        }}
      >
        {cat.description}
      </p>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
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
