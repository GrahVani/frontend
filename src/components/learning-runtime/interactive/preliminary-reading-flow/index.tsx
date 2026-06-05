"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, Compass, Eye, RotateCcw, ShieldCheck, Sun, TrendingUp } from "lucide-react";

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

const RASHIS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanus", "Makara", "Kumbha", "Mina"];

const LAGNA_LORDS = {
  Mesha: "Mars",
  Vrishabha: "Venus",
  Mithuna: "Mercury",
  Karka: "Moon",
  Simha: "Sun",
  Kanya: "Mercury",
  Tula: "Venus",
  Vrishchika: "Mars",
  Dhanus: "Jupiter",
  Makara: "Saturn",
  Kumbha: "Saturn",
  Mina: "Jupiter",
} as const;

const DIGNITIES = {
  exalted: { label: "Exalted / strong", color: GREEN, note: "The chart thread has force, clarity, and capacity to carry the rest of the reading." },
  own: { label: "Own sign / stable", color: BLUE, note: "The chart thread is self-supported and easier to trust as a baseline." },
  mixed: { label: "Mixed", color: GOLD, note: "The baseline is usable, but dignity, aspects, and company must be weighed carefully." },
  afflicted: { label: "Afflicted / weak", color: VERMILION, note: "The baseline needs caution: identity, health, and direction may require support." },
} as const;

const UPACHAYAS = [
  { house: 3, title: "Effort", domain: "courage, initiative", color: BLUE, growth: "growing courage and disciplined self-effort" },
  { house: 6, title: "Struggle", domain: "enemies, illness, service", color: VERMILION, growth: "capacity to overcome rivals, debts, disease, and service pressure" },
  { house: 10, title: "Work", domain: "career, karma", color: GOLD, growth: "career strength forged by responsibility and obstacles" },
  { house: 11, title: "Gains", domain: "networks, income", color: GREEN, growth: "gains, alliances, and ambitions increasing over time" },
] as const;

const MALEFICS = {
  none: { label: "None", color: INK_MUTED, note: "No malefic placed here. Scan the next upachaya." },
  saturn: { label: "Saturn", color: VERMILION, note: "Slow pressure becomes discipline, endurance, and earned capacity." },
  mars: { label: "Mars", color: GOLD, note: "Heat becomes courage, initiative, competition, and direct action." },
  rahu: { label: "Rahu", color: PURPLE, note: "Hunger becomes expansion, experimentation, and unusual growth." },
  ketu: { label: "Ketu", color: BLUE, note: "Sharpness becomes technical focus, independence, and concentrated effort." },
} as const;

const OPENING_ORDER = [
  "Lagna + Lagnesha",
  "Sun + Moon",
  "Other planets",
  "Houses",
  "Aspects / states",
];

type DignityKey = keyof typeof DIGNITIES;
type MaleficKey = keyof typeof MALEFICS;
type UpachayaHouse = (typeof UPACHAYAS)[number]["house"];

export function PreliminaryReadingFlow() {
  const [lagna, setLagna] = useState<keyof typeof LAGNA_LORDS>("Mesha");
  const [lagneshaHouse, setLagneshaHouse] = useState(10);
  const [dignity, setDignity] = useState<DignityKey>("exalted");
  const [malefics, setMalefics] = useState<Record<UpachayaHouse, MaleficKey>>({ 3: "saturn", 6: "none", 10: "none", 11: "rahu" });
  const [contrastFifth, setContrastFifth] = useState(false);
  const lagnesha = LAGNA_LORDS[lagna];
  const dignityState = DIGNITIES[dignity];

  const activeGrowth = useMemo(() => {
    return UPACHAYAS.filter((item) => malefics[item.house] !== "none").map((item) => {
      const malefic = MALEFICS[malefics[item.house]];
      return `${malefic.label} in ${item.house}: ${item.growth}`;
    });
  }, [malefics]);

  const synthesis = useMemo(() => {
    const growthText = activeGrowth.length ? activeGrowth.join("; ") : "no upachaya malefics are currently marked";
    const contrast = contrastFifth ? " The 5th contrast is active, reminding you that the upachaya rule does not apply to gentle houses." : "";
    return `${lagna} Lagna with ${lagnesha} in house ${lagneshaHouse} gives the baseline. ${dignityState.label}: ${dignityState.note} Upachaya scan: ${growthText}.${contrast}`;
  }, [activeGrowth, contrastFifth, dignityState.label, dignityState.note, lagna, lagnesha, lagneshaHouse]);

  return (
    <div data-interactive="preliminary-reading-flow" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Two-step preliminary reading</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Lagna baseline, then upachaya scan
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Practice the chapter synthesis: read the Lagna and its lord first, then scan 3, 6, 10, and 11 for malefics as growth domains.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagna("Mesha");
              setLagneshaHouse(10);
              setDignity("exalted");
              setMalefics({ 3: "saturn", 6: "none", 10: "none", 11: "rahu" });
              setContrastFifth(false);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Example reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Chart opening map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.2rem" }}>{lagna} Lagna: read the anchor first</h3>
            </div>
            <strong style={{ color: dignityState.color }}>{lagnesha} in {lagneshaHouse}</strong>
          </div>
          <PreliminaryWheel lagna={lagna} lagneshaHouse={lagneshaHouse} dignityColor={dignityState.color} malefics={malefics} contrastFifth={contrastFifth} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Compass size={16} />} title="Step 1" body="Fix Lagna + Lagnesha" color={BLUE} />
            <MiniFact icon={<TrendingUp size={16} />} title="Step 2" body="Scan 3/6/10/11" color={GREEN} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Discipline" body="Growth, not affliction" color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="1. Establish the Lagna baseline" icon={<Eye size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                {RASHIS.map((item) => (
                  <button key={item} type="button" aria-pressed={lagna === item} onClick={() => setLagna(item as keyof typeof LAGNA_LORDS)} style={smallChipStyle(lagna === item, BLUE)}>
                    {item}
                  </button>
                ))}
              </div>
              <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY, fontWeight: 850 }}>
                Lagnesha house: {lagneshaHouse}
                <input aria-label="Lagnesha house" type="range" min={1} max={12} value={lagneshaHouse} onChange={(event) => setLagneshaHouse(Number(event.target.value))} style={{ width: "100%", accentColor: BLUE }} />
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={dignity === key} onClick={() => setDignity(key)} style={smallChipStyle(dignity === key, DIGNITIES[key].color)}>
                    {DIGNITIES[key].label}
                  </button>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{dignityState.note}</p>
            </div>
          </Panel>

          <Panel title="Opening order" icon={<Sun size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {OPENING_ORDER.map((item, index) => (
                <div key={item} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: "0.55rem", alignItems: "center" }}>
                  <span style={{ display: "inline-grid", placeItems: "center", width: 26, height: 26, borderRadius: 999, background: index === 0 ? BLUE : `${GOLD}22`, color: index === 0 ? "#fff" : GOLD, fontWeight: 950 }}>{index + 1}</span>
                  <strong style={{ color: index === 0 ? BLUE : INK_SECONDARY }}>{item}</strong>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>2. Scan the upachayas</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GREEN, fontSize: "1.18rem" }}>Drop malefics into 3, 6, 10, 11</h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {UPACHAYAS.map((item) => {
              const selected = malefics[item.house];
              const malefic = MALEFICS[selected];
              return (
                <section key={item.house} style={{ border: `1px solid ${item.color}44`, borderRadius: 8, background: `${item.color}0F`, padding: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                    <strong style={{ color: item.color }}>{item.house}: {item.title}</strong>
                    <span style={{ color: INK_MUTED, fontWeight: 850 }}>{item.domain}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
                    {(Object.keys(MALEFICS) as MaleficKey[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={selected === key}
                        onClick={() => setMalefics((current) => ({ ...current, [item.house]: key }))}
                        style={smallChipStyle(selected === key, MALEFICS[key].color)}
                      >
                        {MALEFICS[key].label}
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
                    {selected === "none" ? malefic.note : `${malefic.label} here: ${item.growth}. ${malefic.note}`}
                  </p>
                </section>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Gentle-house contrast" icon={<CircleDot size={18} />} color={contrastFifth ? VERMILION : PURPLE}>
            <button type="button" aria-pressed={contrastFifth} onClick={() => setContrastFifth((value) => !value)} style={smallChipStyle(contrastFifth, VERMILION)}>
              {contrastFifth ? "5th contrast on" : "Place malefic in 5th"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The same malefic that strengthens an effort-house can disrupt a gentle house. The rule is house-nature-dependent.
            </p>
          </Panel>

          <Panel title="Five reasons Lagna leads" icon={<BadgeCheck size={18} />} color={BLUE}>
            <ul style={{ margin: 0, paddingLeft: "1.15rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              <li>Counting origin</li>
              <li>Lagnesha carries the chart thread</li>
              <li>Chart-wide overlay</li>
              <li>Both kendra and trikona</li>
              <li>Soul-anchor of the chart</li>
            </ul>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Preliminary read</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function PreliminaryWheel({ lagna, lagneshaHouse, dignityColor, malefics, contrastFifth }: { lagna: string; lagneshaHouse: number; dignityColor: string; malefics: Record<UpachayaHouse, MaleficKey>; contrastFifth: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return { house: index + 1, x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Preliminary reading wheel" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const upachaya = UPACHAYAS.find((item) => item.house === point.house);
        const hasMalefic = upachaya ? malefics[upachaya.house] !== "none" : false;
        const isLagnesha = point.house === lagneshaHouse;
        const fifth = contrastFifth && point.house === 5;
        const fill = fifth ? VERMILION : hasMalefic && upachaya ? MALEFICS[malefics[upachaya.house]].color : isLagnesha ? dignityColor : upachaya ? `${upachaya.color}2E` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={isLagnesha ? dignityColor : hasMalefic ? fill : `${GOLD}44`} strokeWidth={isLagnesha || hasMalefic || fifth ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={isLagnesha || hasMalefic || fifth ? 19 : upachaya ? 17 : 14} fill={fill} stroke={isLagnesha || hasMalefic || fifth ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={isLagnesha || hasMalefic || fifth ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {isLagnesha ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={dignityColor} fontSize="11" fontWeight="900">Lagnesha</text> : null}
            {hasMalefic && upachaya ? <text x={point.x} y={point.y - 25} textAnchor="middle" fill={MALEFICS[malefics[upachaya.house]].color} fontSize="11" fontWeight="900">{MALEFICS[malefics[upachaya.house]].label}</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={BLUE} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={BLUE} fontSize="22" fontWeight="900">{lagna}</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Lagna first</text>
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">BASELINE THEN UPACHAYA SCAN</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
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
    fontWeight: 850,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.62rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
