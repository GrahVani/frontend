"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDownUp, BadgeCheck, Clock, Filter, HelpCircle, RotateCcw, TimerOff } from "lucide-react";
import { UPAGRAHAS } from "./data";

type ViewMode = "all" | "muhurta" | "importance";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const SATURN = "#4F5664";
const JUPITER = "#9C7A2F";
const MERCURY = "#2F7D55";
const SUN = "#B54A2A";
const MARS = "#A23A1E";
const VENUS = "#7B6688";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";

const PLANETS = ["Saturn", "Jupiter", "Mercury", "Sun", "Mars", "Venus"];

function planetColor(planet: string) {
  switch (planet) {
    case "Saturn":
      return SATURN;
    case "Jupiter":
      return JUPITER;
    case "Mercury":
      return MERCURY;
    case "Sun":
      return SUN;
    case "Mars":
      return MARS;
    case "Venus":
      return VENUS;
    default:
      return INK_SECONDARY;
  }
}

function slicePoint(index: number, radius = 118) {
  const angle = -90 + index * 45;
  const rad = (angle * Math.PI) / 180;
  return {
    x: 180 + radius * Math.cos(rad),
    y: 180 + radius * Math.sin(rad),
  };
}

export function UpagrahaList() {
  const [selectedId, setSelectedId] = useState("gulika");
  const [mode, setMode] = useState<ViewMode>("all");
  const [matchId, setMatchId] = useState("gulika");
  const [answer, setAnswer] = useState<string | null>(null);

  const selected = UPAGRAHAS.find((item) => item.id === selectedId) ?? UPAGRAHAS[0];
  const matchItem = UPAGRAHAS.find((item) => item.id === matchId) ?? UPAGRAHAS[0];
  const isCorrect = answer === matchItem.shadows;

  const displayList = useMemo(() => {
    const list = [...UPAGRAHAS];
    if (mode === "muhurta") return list.filter((item) => item.isMuhurta);
    if (mode === "importance") return list.sort((a, b) => a.importanceRank - b.importanceRank);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [mode]);

  function nextMatch() {
    const currentIndex = UPAGRAHAS.findIndex((item) => item.id === matchId);
    const next = UPAGRAHAS[(currentIndex + 1) % UPAGRAHAS.length];
    setMatchId(next.id);
    setSelectedId(next.id);
    setAnswer(null);
  }

  return (
    <div data-interactive="upagraha-list" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Upagraha reference
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Eight calculated shadows below the nine grahas
            </h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }} aria-label="Reference controls">
            <ModeButton icon={<Filter size={15} />} label="All" active={mode === "all"} onClick={() => setMode("all")} />
            <ModeButton icon={<TimerOff size={15} />} label="Muhurta use" active={mode === "muhurta"} onClick={() => setMode("muhurta")} />
            <ModeButton icon={<ArrowDownUp size={15} />} label="Importance" active={mode === "importance"} onClick={() => setMode("importance")} />
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Eight upagraha day division">
          <svg viewBox="0 0 360 360" role="img" aria-label="Eight divisions of the day showing the upagrahas as calculated time-points" style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <filter id="upagrahaSoftShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#4b3a23" floodOpacity="0.16" />
              </filter>
            </defs>
            <rect x="12" y="12" width="336" height="336" rx="18" fill="rgba(255,251,241,0.72)" stroke={HAIRLINE} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
              const item = UPAGRAHAS[index];
              const start = -112.5 + index * 45;
              const end = start + 45;
              const large = end - start > 180 ? 1 : 0;
              const p1 = slicePoint(index - 0.5, 132);
              const p2 = slicePoint(index + 0.5, 132);
              const active = item.id === selected.id;
              const color = planetColor(item.shadows);
              const label = slicePoint(index, 105);
              return (
                <g key={item.id}>
                  <path
                    d={`M 180 180 L ${p1.x} ${p1.y} A 132 132 0 ${large} 1 ${p2.x} ${p2.y} Z`}
                    fill={active ? `${color}2E` : "rgba(184,132,33,0.08)"}
                    stroke={active ? color : "rgba(156,122,47,0.26)"}
                    strokeWidth={active ? 2.5 : 1}
                  />
                  <text x={label.x} y={label.y} textAnchor="middle" fill={active ? color : INK_SECONDARY} fontSize="11" fontWeight="900">
                    {item.name}
                  </text>
                </g>
              );
            })}
            <circle cx="180" cy="180" r="64" fill="#FFFBF1" stroke={GOLD} strokeWidth="2.5" filter="url(#upagrahaSoftShadow)" />
            <text x="180" y="163" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="900" letterSpacing="1">
              DAY DIVIDED
            </text>
            <text x="180" y="188" textAnchor="middle" fill={GOLD} fontSize="34" fontWeight="900">
              8
            </text>
            <text x="180" y="209" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800">
              time-points
            </text>
          </svg>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" }}>
            {displayList.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected.id === item.id}
                onClick={() => setSelectedId(item.id)}
                style={{
                  border: `1px solid ${selected.id === item.id ? planetColor(item.shadows) : HAIRLINE}`,
                  borderRadius: 8,
                  background: selected.id === item.id ? `${planetColor(item.shadows)}18` : "transparent",
                  color: selected.id === item.id ? planetColor(item.shadows) : INK_SECONDARY,
                  padding: "0.62rem 0.65rem",
                  minHeight: 52,
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: 850,
                }}
              >
                <span style={{ display: "block" }}>{item.name}</span>
                <span style={{ color: INK_MUTED, fontSize: "0.72rem" }}>shadows {item.shadows}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={selected.name} eyebrow={`Rank ${selected.importanceRank} of 8`} color={planetColor(selected.shadows)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
              <div>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{selected.note}</p>
                <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, lineHeight: 1.55 }}>{selected.shadowTone}</p>
              </div>
              <strong style={{ border: `1px solid ${planetColor(selected.shadows)}55`, borderRadius: 8, color: planetColor(selected.shadows), padding: "0.45rem 0.6rem", whiteSpace: "nowrap" }}>
                {selected.shadows} shadow
              </strong>
            </div>
            <div style={{ marginTop: "0.85rem", display: "grid", gap: "0.55rem" }}>
              <Fact icon={<Clock size={16} />} title="Primary use" body={selected.primaryUse} color={BLUE} />
              <Fact icon={<TimerOff size={16} />} title="Avoidance cue" body={selected.avoidCue} color={MARS} />
            </div>
          </Panel>

          <Panel title="Match the shadowed planet" eyebrow="Practice" color={BLUE}>
            <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY }}>
              Which planet does <strong>{matchItem.name}</strong> shadow?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
              {PLANETS.map((planet) => (
                <button
                  key={planet}
                  type="button"
                  aria-pressed={answer === planet}
                  onClick={() => setAnswer(planet)}
                  style={{
                    border: `1px solid ${answer === planet ? planetColor(planet) : HAIRLINE}`,
                    borderRadius: 8,
                    background: answer === planet ? `${planetColor(planet)}1F` : "transparent",
                    color: answer === planet ? planetColor(planet) : INK_SECONDARY,
                    padding: "0.6rem 0.4rem",
                    minHeight: 42,
                    fontWeight: 850,
                    cursor: "pointer",
                  }}
                >
                  {planet}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem", border: `1px solid ${answer ? (isCorrect ? GREEN : MARS) : HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: answer ? (isCorrect ? "rgba(47,125,85,0.1)" : "rgba(162,58,30,0.09)") : "rgba(255,251,241,0.65)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: answer ? (isCorrect ? GREEN : MARS) : INK_MUTED, fontWeight: 900 }}>
                {answer ? <BadgeCheck size={17} /> : <HelpCircle size={17} />}
                {answer ? (isCorrect ? "Correct shadow" : "Try the source planet again") : "Choose a planet"}
              </div>
              <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
                {answer
                  ? `${matchItem.name} shadows ${matchItem.shadows}. Read it as a ${matchItem.shadows} flavored time-point, not as a main graha.`
                  : "The lesson's key memory task is pairing each upagraha with the planet it shadows."}
              </p>
              <button
                type="button"
                onClick={nextMatch}
                style={{ marginTop: "0.65rem", display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
              >
                <RotateCcw size={15} aria-hidden="true" />
                Next
              </button>
            </div>
          </Panel>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.8rem" }} aria-label="Upagraha reading discipline">
        <Discipline title="Not bodies" body="Upagrahas are calculated time-points, below even Rahu and Ketu in physical status." />
        <Discipline title="Main use: muhurta" body="Their practical job is avoidance: do not start important work in a troubled slice." />
        <Discipline title="Never the headline" body="They modulate the chart after the nine grahas, houses, aspects, and yogas." />
      </section>
    </div>
  );
}

function ModeButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        borderRadius: 8,
        background: active ? GOLD : "transparent",
        color: active ? "#fff" : INK_SECONDARY,
        padding: "0.55rem 0.7rem",
        fontWeight: 850,
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function Panel({ title, eyebrow, color, children }: { title: string; eyebrow: string; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <p style={{ margin: 0, color, fontSize: "0.76rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{eyebrow}</p>
      <h3 style={{ margin: "0.16rem 0 0.75rem", color, fontSize: "1.2rem" }}>{title}</h3>
      {children}
    </section>
  );
}

function Fact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}33`, borderRadius: 8, background: "rgba(255,251,241,0.72)", padding: "0.72rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 900 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}

function Discipline({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "rgba(255,251,241,0.78)", padding: "0.9rem" }}>
      <strong style={{ color: GOLD }}>{title}</strong>
      <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
