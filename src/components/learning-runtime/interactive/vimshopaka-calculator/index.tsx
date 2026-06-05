"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, RotateCcw, Scale } from "lucide-react";
import { useLessonSlug } from "../rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#7A5BA6";
const SCHEMES_SLUG = "the-three-vimshopaka-schemes-shadvarga-saptavarga-dasavarga";

type SchemeKey = "shadvarga" | "saptavarga" | "dashavarga";
type DignityKey = "full" | "friend" | "neutral" | "weak";

const DIGNITIES: Record<DignityKey, { label: string; fraction: number; color: string; note: string }> = {
  full: { label: "Own/exalted", fraction: 1, color: GREEN, note: "earns full weight" },
  friend: { label: "Friendly", fraction: 0.75, color: BLUE, note: "earns most weight" },
  neutral: { label: "Neutral", fraction: 0.5, color: GOLD, note: "earns half weight" },
  weak: { label: "Enemy/debilitated", fraction: 0.15, color: VERMILION, note: "earns little weight" },
};

const SCHEMES: Record<SchemeKey, { label: string; role: string; weights: { varga: string; weight: number }[] }> = {
  shadvarga: {
    label: "Shadvarga",
    role: "compact six-varga check",
    weights: [
      { varga: "D1", weight: 6 },
      { varga: "D2", weight: 2 },
      { varga: "D3", weight: 4 },
      { varga: "D9", weight: 5 },
      { varga: "D12", weight: 2 },
      { varga: "D30", weight: 1 },
    ],
  },
  saptavarga: {
    label: "Saptavarga",
    role: "common default set",
    weights: [
      { varga: "D1", weight: 5 },
      { varga: "D2", weight: 2 },
      { varga: "D3", weight: 3 },
      { varga: "D7", weight: 2.5 },
      { varga: "D9", weight: 4.5 },
      { varga: "D12", weight: 2 },
      { varga: "D30", weight: 1 },
    ],
  },
  dashavarga: {
    label: "Dashavarga",
    role: "deep set when D60 is usable",
    weights: [
      { varga: "D1", weight: 3 },
      { varga: "D2", weight: 1.5 },
      { varga: "D3", weight: 1.5 },
      { varga: "D7", weight: 1.5 },
      { varga: "D9", weight: 1.5 },
      { varga: "D10", weight: 1.5 },
      { varga: "D12", weight: 1.5 },
      { varga: "D16", weight: 1.5 },
      { varga: "D30", weight: 1.5 },
      { varga: "D60", weight: 5 },
    ],
  },
};

const PRESETS = [
  {
    label: "Flattering D1, weak set",
    scheme: "saptavarga" as SchemeKey,
    dignity: { D1: "full", D2: "weak", D3: "weak", D7: "neutral", D9: "weak", D12: "neutral", D30: "weak" } as Record<string, DignityKey>,
  },
  {
    label: "D1 and D9 strong",
    scheme: "saptavarga" as SchemeKey,
    dignity: { D1: "full", D2: "neutral", D3: "friend", D7: "neutral", D9: "full", D12: "friend", D30: "neutral" } as Record<string, DignityKey>,
  },
  {
    label: "Deep D60 support",
    scheme: "dashavarga" as SchemeKey,
    dignity: { D1: "friend", D2: "neutral", D3: "neutral", D7: "friend", D9: "friend", D10: "neutral", D12: "neutral", D16: "friend", D30: "weak", D60: "full" } as Record<string, DignityKey>,
  },
];

export function VimshopakaCalculator() {
  const slug = useLessonSlug();
  const isSchemeLesson = slug === SCHEMES_SLUG;
  const initialScheme = isSchemeLesson ? "shadvarga" : "saptavarga";
  const [schemeKey, setSchemeKey] = useState<SchemeKey>(initialScheme);
  const [dignities, setDignities] = useState<Record<string, DignityKey>>(() => makeDefaultDignities(SCHEMES[initialScheme].weights));
  const [showFormula, setShowFormula] = useState(true);
  const [d60Ready, setD60Ready] = useState(false);

  const scheme = SCHEMES[schemeKey];
  const rows = useMemo(() => scheme.weights.map((item) => {
    const dignityKey = dignities[item.varga] ?? "neutral";
    const dignity = DIGNITIES[dignityKey];
    const earned = item.weight * dignity.fraction;
    return { ...item, dignityKey, dignity, earned };
  }), [dignities, scheme.weights]);
  const score = rows.reduce((sum, row) => sum + row.earned, 0);
  const band = getBand(score);
  const d60Blocked = schemeKey === "dashavarga" && !d60Ready;
  const dominantRows = [...scheme.weights].sort((a, b) => b.weight - a.weight).slice(0, schemeKey === "dashavarga" ? 1 : 2);

  const setScheme = (key: SchemeKey) => {
    setSchemeKey(key);
    setDignities((current) => {
      const next = makeDefaultDignities(SCHEMES[key].weights);
      for (const item of SCHEMES[key].weights) next[item.varga] = current[item.varga] ?? next[item.varga];
      return next;
    });
  };

  const reset = () => {
    setSchemeKey(initialScheme);
    setDignities(makeDefaultDignities(SCHEMES[initialScheme].weights));
    setShowFormula(true);
    setD60Ready(false);
  };

  return (
    <div data-interactive="vimshopaka-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>{isSchemeLesson ? "Vimshopaka scheme tables" : "Vimshopaka-bala formula"}</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>{isSchemeLesson ? "Three schemes, each summing to 20" : "Weighted dignity, scored out of 20"}</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {isSchemeLesson
                ? "Switch among Shadvarga, Saptavarga, and Dashavarga. The memberships and weights change, but every scheme totals 20; Dashavarga is gated because its heaviest single weight is D60."
                : "Each varga contributes its weight multiplied by the planet's dignity fraction. The total answers the question a single varga cannot: how strong is the planet across the chosen set?"}
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>{scheme.label}</p>
              <h3 style={{ margin: "0.2rem 0 0", color: band.color, fontSize: "1.2rem" }}>{score.toFixed(2)} / 20 - {band.label}</h3>
            </div>
            <strong style={{ color: d60Blocked ? VERMILION : band.color }}>{d60Blocked ? "D60 gated" : scheme.role}</strong>
          </div>

          <VimshopakaSvg rows={rows} score={score} bandColor={d60Blocked ? VERMILION : band.color} />

          <div style={{ border: `1px solid ${d60Blocked ? VERMILION : band.color}66`, borderRadius: 8, background: `${d60Blocked ? VERMILION : band.color}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Reading discipline</p>
            <h4 style={{ margin: "0.2rem 0", color: d60Blocked ? VERMILION : band.color, fontSize: "1.08rem" }}>
              {d60Blocked ? "Dashavarga needs a usable D60" : band.summary}
            </h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {d60Blocked ? "Do not use the ten-varga score when the D60 birth-time gate is not satisfied." : isSchemeLesson ? `This ${scheme.label} table totals 20. Dominant contributor${dominantRows.length > 1 ? "s" : ""}: ${dominantRows.map((row) => `${row.varga}=${row.weight}`).join(", ")}.` : "Vimshopaka is one strength component. It feeds later shadbala thinking, but it does not replace dignity, avastha, aspects, or timing."}
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setScheme(preset.scheme);
                    setDignities(preset.dignity);
                    setD60Ready(preset.scheme !== "dashavarga" ? d60Ready : true);
                  }}
                  style={buttonStyle(false, BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Choose scheme" icon={<Scale size={18} />} color={GOLD}>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {(Object.keys(SCHEMES) as SchemeKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setScheme(key)} style={buttonStyle(schemeKey === key, key === "dashavarga" ? PURPLE : GOLD)}>
                  {SCHEMES[key].label}
                </button>
              ))}
            </div>
            {schemeKey === "dashavarga" ? (
              <button type="button" onClick={() => setD60Ready((value) => !value)} style={buttonStyle(d60Ready, d60Ready ? GREEN : VERMILION)}>
                {d60Ready ? "D60 usable" : "D60 not usable"}
              </button>
            ) : null}
          </Panel>

          {isSchemeLesson ? (
            <Panel title="Scheme selection rule" icon={<Scale size={18} />} color={schemeKey === "dashavarga" ? PURPLE : GREEN}>
              <div style={{ display: "grid", gap: "0.45rem" }}>
                <RuleRow active={schemeKey === "shadvarga"} color={GREEN} title="Shadvarga" body="Six vargas; quick or beginner-friendly. D1 and D9 dominate." />
                <RuleRow active={schemeKey === "saptavarga"} color={BLUE} title="Saptavarga" body="Seven vargas; common working default. Adds D7 while keeping D1/D9 heavy." />
                <RuleRow active={schemeKey === "dashavarga"} color={PURPLE} title="Dashavarga" body="Ten vargas; comprehensive, but valid only when D60 is usable." />
              </div>
            </Panel>
          ) : null}

          <Panel title="Formula lens" icon={<GitCompare size={18} />} color={showFormula ? GREEN : BLUE}>
            <button type="button" onClick={() => setShowFormula((value) => !value)} style={buttonStyle(showFormula, GREEN)}>
              {showFormula ? "Formula shown" : "Show formula"}
            </button>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {showFormula ? "For each varga: earned points = varga weight x dignity fraction. Sum all earned points to get a 0-20 score." : "Hidden. Use the rows below to explore the same formula visually."}
            </p>
          </Panel>
        </section>
      </div>

      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Dignity inputs</p>
            <h3 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.1rem" }}>Change a dignity and watch the weighted score move</h3>
          </div>
          <span style={{ color: INK_MUTED, fontWeight: 650 }}>Total weights: {scheme.weights.reduce((sum, item) => sum + item.weight, 0)}</span>
        </div>
        <div style={{ marginTop: "0.85rem", display: "grid", gap: "0.55rem" }}>
          {rows.map((row) => (
            <div key={row.varga} style={{ display: "grid", gridTemplateColumns: "70px minmax(120px, 1fr) minmax(190px, 1.4fr) 74px", gap: "0.55rem", alignItems: "center" }}>
              <strong style={{ color: row.dignity.color }}>{row.varga}</strong>
              <span style={{ color: INK_SECONDARY, fontWeight: 650 }}>weight {row.weight}</span>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
                  <button key={key} type="button" onClick={() => setDignities((current) => ({ ...current, [row.varga]: key }))} style={miniButtonStyle(row.dignityKey === key, DIGNITIES[key].color)}>
                    {DIGNITIES[key].label}
                  </button>
                ))}
              </div>
              <strong style={{ color: row.dignity.color, textAlign: "right" }}>{row.earned.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </section>

      {isSchemeLesson ? (
        <section style={surfaceStyle}>
          <p style={eyebrowStyle}>Three scheme reference</p>
          <h3 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.1rem" }}>Membership and weights at a glance</h3>
          <div style={{ marginTop: "0.85rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
            {(Object.keys(SCHEMES) as SchemeKey[]).map((key) => (
              <SchemeReferenceCard key={key} schemeKey={key} active={schemeKey === key} onSelect={() => setScheme(key)} d60Ready={d60Ready} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function VimshopakaSvg({ rows, score, bandColor }: { rows: { varga: string; weight: number; earned: number; dignity: { color: string; label: string } }[]; score: number; bandColor: string }) {
  const maxWidth = 420;
  return (
    <svg viewBox="0 0 620 560" role="img" aria-label="Vimshopaka weighted strength bars" style={{ ...svgStyle, maxHeight: 580 }}>
      <rect x="34" y="34" width="552" height="480" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="800">
        Weighted dignity across vargas
      </text>
      <text x="310" y="88" textAnchor="middle" fill={INK_MUTED} fontSize="15" fontWeight="800">
        Total score out of 20
      </text>
      <rect x="100" y="116" width={maxWidth} height="34" rx="10" fill={`${HAIRLINE}66`} />
      <rect x="100" y="116" width={(score / 20) * maxWidth} height="34" rx="10" fill={bandColor} opacity="0.86" />
      <text x="310" y="140" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="800">{score.toFixed(2)} / 20</text>
      {rows.map((row, index) => {
        const y = 188 + index * 42;
        const weightWidth = (row.weight / 6) * 170;
        const earnedWidth = row.weight === 0 ? 0 : (row.earned / row.weight) * weightWidth;
        return (
          <g key={row.varga}>
            <text x="78" y={y + 20} fill={INK_PRIMARY} fontSize="17" fontWeight="800">{row.varga}</text>
            <rect x="136" y={y + 3} width={weightWidth} height="24" rx="12" fill={`${row.dignity.color}18`} stroke={`${row.dignity.color}55`} />
            <rect x="136" y={y + 3} width={earnedWidth} height="24" rx="12" fill={row.dignity.color} opacity="0.78" />
            <text x="330" y={y + 20} fill={INK_SECONDARY} fontSize="14" fontWeight="750">w {row.weight}</text>
            <text x="408" y={y + 20} fill={row.dignity.color} fontSize="15" fontWeight="800">{row.dignity.label}</text>
            <text x="532" y={y + 20} textAnchor="end" fill={INK_PRIMARY} fontSize="15" fontWeight="800">{row.earned.toFixed(2)}</text>
          </g>
        );
      })}
      <text x="310" y="488" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="800">A strong D1 alone cannot carry the score if the weighted set is weak.</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function RuleRow({ active, color, title, body }: { active: boolean; color: string; title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : "transparent", padding: "0.65rem" }}>
      <strong style={{ color }}>{title}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{body}</p>
    </div>
  );
}

function SchemeReferenceCard({ schemeKey, active, onSelect, d60Ready }: { schemeKey: SchemeKey; active: boolean; onSelect: () => void; d60Ready: boolean }) {
  const scheme = SCHEMES[schemeKey];
  const color = schemeKey === "dashavarga" ? PURPLE : schemeKey === "saptavarga" ? BLUE : GREEN;
  const total = scheme.weights.reduce((sum, item) => sum + item.weight, 0);
  const top = [...scheme.weights].sort((a, b) => b.weight - a.weight)[0];
  return (
    <button type="button" onClick={onSelect} style={{ border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : "transparent", padding: "0.85rem", textAlign: "left", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <strong style={{ color }}>{scheme.label}</strong>
        <span style={{ color: total === 20 ? GREEN : VERMILION, fontWeight: 800 }}>total {total}</span>
      </div>
      <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {scheme.weights.map((item) => (
          <span key={item.varga} style={{ border: `1px solid ${item.varga === top.varga ? color : HAIRLINE}`, borderRadius: 8, color: item.varga === top.varga ? color : INK_SECONDARY, padding: "0.22rem 0.38rem", fontSize: "0.78rem", fontWeight: 700 }}>
            {item.varga} {item.weight}
          </span>
        ))}
      </div>
      <p style={{ margin: "0.55rem 0 0", color: schemeKey === "dashavarga" && !d60Ready ? VERMILION : INK_MUTED, lineHeight: 1.45 }}>
        {schemeKey === "dashavarga" ? (d60Ready ? "D60 gate open; D60 has the highest single weight." : "Needs D60; keep gated on rough time.") : `${top.varga} carries the highest weight in this scheme.`}
      </p>
    </button>
  );
}

function makeDefaultDignities(weights: { varga: string }[]) {
  return Object.fromEntries(weights.map((item) => [item.varga, "neutral" as DignityKey]));
}

function getBand(score: number) {
  if (score < 5) return { label: "Weak", color: VERMILION, summary: "Weak overall support across the weighted set" };
  if (score < 10) return { label: "Moderate", color: GOLD, summary: "Moderate strength: mixed support across the vargas" };
  if (score < 15) return { label: "Strong", color: BLUE, summary: "Strong support: the weighted set mostly carries the planet" };
  return { label: "Very strong", color: GREEN, summary: "Very strong support across the weighted varga set" };
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
    minHeight: 38,
  };
}

function miniButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.34rem 0.45rem",
    fontSize: "0.78rem",
    fontWeight: 650,
    cursor: "pointer",
  };
}

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.78rem",
  fontWeight: 800,
};

const svgStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  margin: "0.85rem 0",
};
