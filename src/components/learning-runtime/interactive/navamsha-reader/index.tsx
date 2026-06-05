"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Clock, Heart, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6A568E";

type Focus = "marriage" | "dharma";
type ChartType = "man" | "woman";

const SIGNS = [
  { name: "Mesha", lord: "Mars", color: "#A23A1E" },
  { name: "Vrishabha", lord: "Venus", color: "#2F7D55" },
  { name: "Mithuna", lord: "Mercury", color: "#356CAB" },
  { name: "Karka", lord: "Moon", color: "#54778A" },
  { name: "Simha", lord: "Sun", color: "#B88421" },
  { name: "Kanya", lord: "Mercury", color: "#6F7F41" },
  { name: "Tula", lord: "Venus", color: "#7A5BA6" },
  { name: "Vrishchika", lord: "Mars", color: "#8E3C55" },
  { name: "Dhanu", lord: "Jupiter", color: "#C26A2C" },
  { name: "Makara", lord: "Saturn", color: "#6D604A" },
  { name: "Kumbha", lord: "Saturn", color: "#4E7896" },
  { name: "Mina", lord: "Jupiter", color: "#4D7F73" },
] as const;

export function NavamshaReader() {
  const [lagnaIndex, setLagnaIndex] = useState(6);
  const [focus, setFocus] = useState<Focus>("marriage");
  const [chartType, setChartType] = useState<ChartType>("man");
  const [karakaVargottama, setKarakaVargottama] = useState(true);
  const [maleficSeventh, setMaleficSeventh] = useState(false);

  const seventhIndex = (lagnaIndex + 6) % 12;
  const lagna = SIGNS[lagnaIndex];
  const seventh = SIGNS[seventhIndex];
  const spouseKaraka = chartType === "man" ? "Venus" : "Jupiter";
  const activeColor = focus === "marriage" ? seventh.color : lagna.color;

  const verdict = useMemo(() => {
    if (focus === "dharma") {
      return `Dharma focus: D9 Lagna ${lagna.name}, ruled by ${lagna.lord}. Read this as purpose, second-half-of-life direction, and deeper self.`;
    }
    if (maleficSeventh) {
      return `Marriage focus: D9 7th is ${seventh.name}, ruled by ${seventh.lord}. Malefic pressure asks for care, patience, and supportive framing.`;
    }
    if (karakaVargottama) {
      return `Marriage focus: ${spouseKaraka} is flagged vargottama, a stability cue. Still read with D1 7th and timing dashas.`;
    }
    return `Marriage focus: read D9 7th ${seventh.name}, its lord ${seventh.lord}, and ${spouseKaraka} as promise and nature, not timing.`;
  }, [focus, karakaVargottama, lagna, maleficSeventh, seventh, spouseKaraka]);

  return (
    <div data-interactive="navamsha-reader" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D9 Navamsha reader</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Marriage and dharma, read supportively
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 880 }}>
              Explore the 7th Navamsha for marriage and the Navamsha Lagna for dharma. Timing stays locked until dasha study.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagnaIndex(6);
              setFocus("marriage");
              setChartType("man");
              setKarakaVargottama(true);
              setMaleficSeventh(false);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Sample D9 frame</p>
              <h3 style={{ margin: "0.2rem 0 0", color: activeColor, fontSize: "1.2rem" }}>
                D9 Lagna {lagna.name}; 7th Navamsha {seventh.name}
              </h3>
            </div>
            <strong style={{ color: focus === "marriage" ? PURPLE : GREEN }}>{focus === "marriage" ? "Marriage" : "Dharma"}</strong>
          </div>

          <NavamshaChartSvg lagnaIndex={lagnaIndex} seventhIndex={seventhIndex} focus={focus} />

          <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Reading cue</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{verdict}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Reader focus" icon={<BadgeCheck size={18} />} color={focus === "marriage" ? PURPLE : GREEN}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setFocus("marriage")} style={buttonStyle(focus === "marriage", PURPLE)}>7th marriage</button>
              <button type="button" onClick={() => setFocus("dharma")} style={buttonStyle(focus === "dharma", GREEN)}>D9 Lagna dharma</button>
            </div>
          </Panel>

          <Panel title="Select Navamsha Lagna" icon={<Sparkles size={18} />} color={GOLD}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: "0.45rem" }}>
              {SIGNS.map((sign, index) => (
                <button key={sign.name} type="button" onClick={() => setLagnaIndex(index)} style={signButtonStyle(lagnaIndex === index, sign.color)}>
                  {sign.name}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Spouse karaka" icon={<Heart size={18} />} color={PURPLE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setChartType("man")} style={buttonStyle(chartType === "man", PURPLE)}>Man: Venus</button>
              <button type="button" onClick={() => setChartType("woman")} style={buttonStyle(chartType === "woman", PURPLE)}>Woman: Jupiter</button>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              Current spouse-karaka: {spouseKaraka}. Read it by D9 sign, house, dignity, and D1 support.
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="Stability and care flags" icon={<ShieldCheck size={18} />} color={karakaVargottama ? GREEN : GOLD}>
          <button type="button" aria-pressed={karakaVargottama} onClick={() => setKarakaVargottama((value) => !value)} style={buttonStyle(karakaVargottama, GREEN)}>
            Vargottama {spouseKaraka}
          </button>
          <button type="button" aria-pressed={maleficSeventh} onClick={() => setMaleficSeventh((value) => !value)} style={buttonStyle(maleficSeventh, VERMILION)}>
            Malefic in D9 7th
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            Use these as indicators, not verdicts. Difficulty is framed as conditions needing care.
          </p>
        </Panel>

        <section style={{ border: `1px solid ${VERMILION}55`, borderRadius: 8, background: `${VERMILION}10`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: VERMILION, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
            <Clock size={18} />
            Timing locked
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            D9 shows promise and nature. Marriage timing needs dashas with D1/D9, so dates stay outside this lesson.
          </p>
        </section>
      </div>
    </div>
  );
}

function NavamshaChartSvg({ lagnaIndex, seventhIndex, focus }: { lagnaIndex: number; seventhIndex: number; focus: Focus }) {
  const cell = 75;
  const positions = [
    [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3],
    [2, 3], [1, 3], [0, 3], [0, 2], [0, 1], [0, 0],
  ];
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label="Navamsha chart with Lagna and seventh house highlighted" style={{ width: "100%", maxHeight: 360, margin: "0.8rem auto", display: "block" }}>
      <rect x="8" y="8" width="284" height="284" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      {positions.map(([col, row], house) => {
        const signIndex = (lagnaIndex + house) % 12;
        const sign = SIGNS[signIndex];
        const isLagna = house === 0;
        const isSeventh = signIndex === seventhIndex;
        const active = focus === "dharma" ? isLagna : isSeventh;
        const x = col * cell;
        const y = row * cell;
        return (
          <g key={house}>
            <rect x={x + 8} y={y + 8} width={cell - 10} height={cell - 10} rx="8" fill={active ? `${sign.color}24` : "rgba(255,251,241,0.68)"} stroke={active ? sign.color : HAIRLINE} strokeWidth={active ? 3 : 1} />
            <text x={x + cell / 2} y={y + 34} textAnchor="middle" fill={active ? sign.color : INK_PRIMARY} fontSize="11.5" fontWeight="700">{sign.name}</text>
            <text x={x + cell / 2} y={y + 53} textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{isLagna ? "Lagna" : isSeventh ? "7th" : `H${house + 1}`}</text>
          </g>
        );
      })}
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

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function signButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.48rem 0.5rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  overflow: "hidden",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
