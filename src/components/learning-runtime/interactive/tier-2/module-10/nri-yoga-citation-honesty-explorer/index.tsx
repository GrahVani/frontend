"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
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

type Layer = "classical" | "raman" | "modern-label";

const LAYERS: Record<
  Layer,
  { label: string; color: string; description: string }
> = {
  classical: {
    label: "Classical reasoning",
    color: GREEN,
    description: "Genuine bhāva and kāraka logic from classical texts.",
  },
  raman: {
    label: "Raman compilation",
    color: BLUE,
    description: "B.V. Raman's 20th-century organisation and explanation of classical yogas.",
  },
  "modern-label": {
    label: "Modern label / systematisation",
    color: GOLD,
    description: "Recent popular framing, including the 'NRI' legal term and checklist formats.",
  },
};

const ITEMS: { key: string; text: string; layer: Layer }[] = [
  { key: "12th-foreign", text: "12th house signifies foreign lands (videśaś ca)", layer: "classical" },
  { key: "9th-travel", text: "9th house signifies long-distance travel and distant lands", layer: "classical" },
  { key: "7th-videsha", text: "7th house: videśa-gamanam (going to foreign lands)", layer: "classical" },
  { key: "rahu-karaka", text: "Rāhu as foreign / boundary-crossing kāraka", layer: "classical" },
  { key: "videsa-vasa", text: "videśa-vāsa / paradeśa-vāsa terminology", layer: "classical" },
  { key: "raman-300", text: "Three Hundred Important Combinations (1947)", layer: "raman" },
  { key: "raman-organised", text: "Numbered yoga compilations across many life-domains", layer: "raman" },
  { key: "nri-term", text: "'Non-Resident Indian' legal term", layer: "modern-label" },
  { key: "nri-checklist", text: "'NRI yoga' checklist format", layer: "modern-label" },
  { key: "online-pop", text: "Online/popular 'NRI yoga' articles", layer: "modern-label" },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "classical-label",
    label: "'NRI yoga' is a verbatim classical term found in ancient Sanskrit texts.",
    correction:
      "The term 'NRI' is modern (Income Tax Act 1961; FEMA 1999). Classical texts use videśa-vāsa etc.",
  },
  {
    key: "discard",
    label: "Because the label is modern, the underlying reasoning should be discarded.",
    correction:
      "Separate label from substance. The 12th/9th/7th-house and Rāhu reasoning is classically grounded.",
  },
  {
    key: "raman-classical",
    label: "B.V. Raman's Three Hundred Important Combinations is itself an ancient primary text.",
    correction:
      "It is a valuable 20th-century compilation and explanation of classical material, cited as such.",
  },
] as const;

export function NriYogaCitationHonestyExplorer() {
  const [classifications, setClassifications] = useState<Record<string, Layer | null>>({});
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "classical-label": false,
    discard: false,
    "raman-classical": false,
  });

  const score = useMemo(() => {
    let correct = 0;
    ITEMS.forEach((item) => {
      if (classifications[item.key] === item.layer) correct += 1;
    });
    return correct;
  }, [classifications]);

  function setLayer(key: string, layer: Layer) {
    setClassifications((prev) => ({
      ...prev,
      [key]: prev[key] === layer ? null : layer,
    }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setClassifications({});
    setMistakes({
      "classical-label": false,
      discard: false,
      "raman-classical": false,
    });
  }

  return (
    <div
      data-interactive="nri-yoga-citation-honesty-explorer"
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
            <p style={eyebrowStyle}>NRI yogas — honest citation explorer</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Separate the classical substance from the modern label
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              The term &quot;NRI yoga&quot; is modern, but the underlying house and kāraka logic is old. Classify each item into its proper historical layer and practise the honest-citation discipline.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Historical layers timeline</p>
        <TimelineSvg />
      </section>

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
            <p style={eyebrowStyle}>Classify each item</p>
            <h3
              style={{
                margin: "0.15rem 0 0",
                color: GOLD,
                fontSize: "1.12rem",
                fontWeight: 600,
              }}
            >
              Score: {score} / {ITEMS.length}
            </h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {Object.entries(LAYERS).map(([key, layer]) => (
              <span
                key={key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.8rem",
                  color: layer.color,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: layer.color,
                  }}
                />
                {layer.label}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {ITEMS.map((item) => {
            const selected = classifications[item.key];
            const isCorrect = selected === item.layer;
            return (
              <div
                key={item.key}
                style={{
                  border: `1px solid ${
                    selected ? (isCorrect ? GREEN : VERMILION) : HAIRLINE
                  }`,
                  borderRadius: 8,
                  background: selected
                    ? isCorrect
                      ? `${GREEN}${"0A"}`
                      : `${VERMILION}${"0A"}`
                    : "transparent",
                  padding: "0.75rem",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.55rem",
                    color: INK_PRIMARY,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {item.text}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {(Object.keys(LAYERS) as Layer[]).map((layerKey) => {
                    const active = selected === layerKey;
                    return (
                      <button
                        key={layerKey}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setLayer(item.key, layerKey)}
                        style={smallChipStyle(active, LAYERS[layerKey].color)}
                      >
                        {LAYERS[layerKey].label}
                      </button>
                    );
                  })}
                </div>
                {selected && !isCorrect ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: VERMILION,
                      fontSize: "0.82rem",
                    }}
                  >
                    Correct layer: {LAYERS[item.layer].label}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

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
        <p style={eyebrowStyle}>Honest citation formula</p>
        <p
          style={{
            margin: "0.45rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          Cite the underlying reasoning classically (12th, 9th, 7th houses; Rāhu). Cite the numbered compilation as B.V. Raman&apos;s 20th-century organisation. Cite the &quot;NRI&quot; framing as a modern legal/popular label. Never present one layer as another.
        </p>
      </section>
    </div>
  );
}

function TimelineSvg() {
  return (
    <svg
      viewBox="0 0 760 180"
      role="img"
      aria-label="Timeline of NRI yoga historical layers"
      style={{
        width: "100%",
        maxHeight: 200,
        margin: "0.55rem auto 0",
        display: "block",
      }}
    >
      <rect x="10" y="10" width="740" height="160" rx="10" fill={`${GOLD}${"06"}`} stroke={HAIRLINE} />

      {/* Baseline */}
      <line x1="50" y1="100" x2="710" y2="100" stroke={INK_MUTED} strokeWidth="2" />

      {/* Classical era */}
      <circle cx="120" cy="100" r="10" fill={GREEN} />
      <text x="120" y="70" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="600">
        Classical texts
      </text>
      <text x="120" y="135" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
        bhāva/kāraka logic
      </text>

      {/* Raman 1947 */}
      <circle cx="320" cy="100" r="10" fill={BLUE} />
      <text x="320" y="70" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">
        B.V. Raman 1947
      </text>
      <text x="320" y="135" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
        modern compilation
      </text>

      {/* Income Tax Act 1961 */}
      <circle cx="480" cy="100" r="10" fill={GOLD} />
      <text x="480" y="70" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="600">
        Income Tax Act 1961
      </text>
      <text x="480" y="135" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
        &apos;NRI&apos; legal term
      </text>

      {/* Modern checklist */}
      <circle cx="640" cy="100" r="10" fill={GOLD} />
      <text x="640" y="70" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="600">
        Modern checklists
      </text>
      <text x="640" y="135" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
        &apos;NRI yoga&apos; label
      </text>

      {/* Arrow */}
      <path d="M 700 100 L 710 100" stroke={INK_MUTED} strokeWidth="2" markerEnd="url(#arrow-timeline)" />
      <defs>
        <marker id="arrow-timeline" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill={INK_MUTED} />
        </marker>
      </defs>
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
    padding: "0.35rem 0.55rem",
    fontSize: "0.8rem",
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
