"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MapPinned,
  RotateCcw,
  Scale,
  Search,
  XCircle
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#D97706";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const VIMSOTTARI_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
};

const VIMSOTTARI_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

const PLANET_COLORS: Record<string, string> = {
  Sun: VERMILION, Moon: BLUE, Mars: VERMILION, Mercury: GREEN,
  Jupiter: GOLD, Venus: GREEN, Saturn: PURPLE, Rahu: PURPLE, Ketu: AMBER
};

type TabKey = "lookup" | "overlay" | "boundary";
type ScenarioKey = "kavya" | "meera-saturn" | "meera-mercury" | "meera-moon" | "custom";

interface Period {
  planet: string;
  years: number;
  days: number;
  startDay: number;
  endDay: number;
}

function buildMuddaSequence(startPlanet: string): Period[] {
  const startIdx = VIMSOTTARI_ORDER.indexOf(startPlanet);
  if (startIdx === -1) return [];
  const raw: { planet: string; years: number; days: number }[] = [];
  for (let i = 0; i < 9; i++) {
    const planet = VIMSOTTARI_ORDER[(startIdx + i) % 9];
    const years = VIMSOTTARI_YEARS[planet];
    const days = Math.round((years / 120) * 360);
    raw.push({ planet, years, days });
  }
  let day = 1;
  return raw.map((r) => {
    const startDay = day;
    const endDay = day + r.days - 1;
    day = endDay + 1;
    return { ...r, startDay, endDay };
  });
}

function findPeriod(day: number, sequence: Period[]): Period | null {
  return sequence.find((p) => day >= p.startDay && day <= p.endDay) || null;
}

const SCENARIOS: Record<ScenarioKey, { label: string; start: string; hypothetical?: boolean; significant: string[]; note?: string }> = {
  kavya: { label: "Kavya — Varṣeśa Venus", start: "Venus", significant: ["Venus", "Sun", "Mercury", "Jupiter"], note: "Venus is Kavya's dominant convergence thread." },
  "meera-saturn": { label: "Meera — hypothetical Saturn start", start: "Saturn", hypothetical: true, significant: ["Saturn", "Mercury", "Moon", "Mars", "Sun"], note: "One of three unresolved Varṣeśa qualifiers." },
  "meera-mercury": { label: "Meera — hypothetical Mercury start", start: "Mercury", hypothetical: true, significant: ["Saturn", "Mercury", "Moon", "Mars", "Sun"], note: "One of three unresolved Varṣeśa qualifiers." },
  "meera-moon": { label: "Meera — hypothetical Moon start", start: "Moon", hypothetical: true, significant: ["Saturn", "Mercury", "Moon", "Mars", "Sun"], note: "One of three unresolved Varṣeśa qualifiers." },
  custom: { label: "Custom Varṣeśa", start: "Venus", significant: [] }
};

export function DinikaDailyOverlayWorkbench() {
  const [tab, setTab] = useState<TabKey>("lookup");
  const [scenario, setScenario] = useState<ScenarioKey>("kavya");
  const [customLord, setCustomLord] = useState<string>("Venus");
  const [dayInput, setDayInput] = useState<number>(47);
  const [candidateDate, setCandidateDate] = useState<string>("");
  const [candidateDay, setCandidateDay] = useState<number>(47);

  const activeScenario = SCENARIOS[scenario];
  const startPlanet = scenario === "custom" ? customLord : activeScenario.start;
  const sequence = useMemo(() => buildMuddaSequence(startPlanet), [startPlanet]);
  const period = findPeriod(dayInput, sequence);

  const overlayPeriod = findPeriod(candidateDay, sequence);

  function reset() {
    setTab("lookup");
    setScenario("kavya");
    setCustomLord("Venus");
    setDayInput(47);
    setCandidateDate("");
    setCandidateDay(47);
  }

  return (
    <div data-interactive="dinika-daily-overlay-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Dinika daily breakdown for high-stakes decisions</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Day-level Mudda-dasha lookup plus honest overlay boundaries
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              No dina-pravesha casting formula is available. Use Mudda-dasha&apos;s day-precise boundaries for a genuine day-level tool, then overlay the result onto T2-16 Muhurta technique for real decisions.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { key: "lookup", label: "Day-to-period lookup", icon: Search },
          { key: "overlay", label: "Muhurta overlay builder", icon: Scale },
          { key: "boundary", label: "Exact-date boundary", icon: AlertCircle }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as TabKey)}
              style={{
                ...smallChipStyle(active, active ? GOLD_DEEP : INK_MUTED),
                height: "44px",
                padding: "0 1rem",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Mudda-dasha starting point</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setScenario(key)} style={smallChipStyle(scenario === key, scenario === key ? GOLD_DEEP : INK_MUTED)}>
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>
        {scenario === "custom" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", alignItems: "center" }}>
            <label style={{ fontSize: "0.85rem", color: INK_SECONDARY, fontWeight: 600 }}>Varṣeśa planet:</label>
            <select
              value={customLord}
              onChange={(e) => setCustomLord(e.target.value)}
              style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: `1.5px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontSize: "0.9rem" }}
            >
              {VIMSOTTARI_ORDER.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        )}
        {activeScenario.hypothetical && (
          <div style={{ marginTop: "0.65rem", padding: "0.55rem 0.75rem", borderRadius: "8px", background: `${AMBER}08`, border: `1px solid ${AMBER}40`, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            <AlertCircle size={14} color={AMBER} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
            {activeScenario.note}
          </div>
        )}
      </section>

      {tab === "lookup" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Enter a day of the varṣa year</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <input
                type="number"
                min={1}
                max={360}
                value={dayInput}
                onChange={(e) => setDayInput(Math.max(1, Math.min(360, Number(e.target.value))))}
                style={{ width: "90px", padding: "0.55rem 0.75rem", borderRadius: "8px", border: `1.5px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontSize: "0.95rem" }}
              />
              <input
                type="range"
                min={1}
                max={360}
                value={dayInput}
                onChange={(e) => setDayInput(Number(e.target.value))}
                style={{ flex: 1, minWidth: "200px", accentColor: GOLD }}
              />
            </div>
            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>Day {dayInput} of 360</p>
          </section>

          {period && (
            <section style={{ ...cardStyle, borderLeft: `4px solid ${PLANET_COLORS[period.planet]}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <Clock size={18} color={PLANET_COLORS[period.planet]} />
                <h3 style={{ margin: 0, color: PLANET_COLORS[period.planet], fontSize: "1.2rem" }}>Day {dayInput} is governed by {period.planet}</h3>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                This period runs from day {period.startDay} to day {period.endDay} ({period.days} days), based on {period.planet}&apos;s Vimsottari allocation of {period.years} years.
              </p>
              {activeScenario.significant.includes(period.planet) && (
                <div style={{ marginTop: "0.65rem", padding: "0.55rem 0.75rem", borderRadius: "8px", background: `${GREEN}08`, border: `1px solid ${GREEN}40`, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  <CheckCircle2 size={14} color={GREEN} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                  {period.planet} also appears in this chart&apos;s independently-computed findings, so its period carries extra contextual weight.
                </div>
              )}
              <div style={{ marginTop: "0.85rem" }}>
                <Timeline sequence={sequence} highlightDay={dayInput} />
              </div>
            </section>
          )}
        </>
      )}

      {tab === "overlay" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Scale size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Two-layer overlay</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              For a genuine high-stakes day-question, combine Mudda-dasha context with T2-16&apos;s Muhurta workflow for the actual calendar date. This is not a &quot;dinika chart&quot;; it is a disciplined overlay of two real, sourced techniques.
            </p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Candidate decision day</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, fontWeight: 600 }}>Day of varṣa year</label>
                <input
                  type="number"
                  min={1}
                  max={360}
                  value={candidateDay}
                  onChange={(e) => setCandidateDay(Math.max(1, Math.min(360, Number(e.target.value))))}
                  style={{ padding: "0.55rem 0.75rem", borderRadius: "8px", border: `1.5px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontSize: "0.95rem" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, fontWeight: 600 }}>Calendar date (optional)</label>
                <input
                  type="date"
                  value={candidateDate}
                  onChange={(e) => setCandidateDate(e.target.value)}
                  style={{ padding: "0.55rem 0.75rem", borderRadius: "8px", border: `1.5px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontSize: "0.95rem" }}
                />
              </div>
            </div>
          </section>

          {overlayPeriod && (
            <section style={{ ...cardStyle, borderLeft: `4px solid ${PLANET_COLORS[overlayPeriod.planet]}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <MapPinned size={18} color={PLANET_COLORS[overlayPeriod.planet]} />
                <h3 style={{ margin: 0, color: INK_PRIMARY, fontSize: "1.15rem" }}>Layer 1 — Mudda-dasha context</h3>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                Day {candidateDay} falls under <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>{overlayPeriod.planet}</strong>&apos;s period (days {overlayPeriod.startDay}–{overlayPeriod.endDay}).
                {activeScenario.significant.includes(overlayPeriod.planet) && ` ${overlayPeriod.planet} is also significant in this chart's other findings.`}
              </p>
            </section>
          )}

          <section style={{ ...cardStyle, borderLeft: `4px solid ${BLUE}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <Calendar size={18} color={BLUE} />
              <h3 style={{ margin: 0, color: INK_PRIMARY, fontSize: "1.15rem" }}>Layer 2 — T2-16 Muhurta workflow</h3>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              For the actual calendar date {candidateDate ? `(${candidateDate})` : "(not provided)"}, run the established Muhurta checklist:
            </p>
            <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.25rem", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.6 }}>
              <li>Weekday lord and its dignity</li>
              <li>Tithi and its relationship to the activity</li>
              <li>Nakṣatra suitability</li>
              <li>Horā and other time-quality factors</li>
            </ul>
            <p style={{ margin: "0.65rem 0 0", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
              This module does not duplicate T2-16&apos;s Muhurta engine; the overlay asks you to bring that result in.
            </p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Discipline note</p>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Report both layers separately to the client: &quot;The Mudda-dasha context for day {candidateDay} is {overlayPeriod?.planet || "—"}, and the Muhurta quality for {candidateDate || "the actual calendar date"} still needs its own check.&quot; Do not present the combination as a single &quot;dinika chart&quot; verdict.
            </p>
          </section>
        </>
      )}

      {tab === "boundary" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <AlertCircle size={16} color={VERMILION} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Exact-date boundary</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              A question like &quot;on what exact day does the Sun-Venus Ithasāla reach exact conjunction?&quot; cannot be answered from this module&apos;s data. Chapter 1 fixed planetary snapshot longitudes but not daily motion rates, so yoga-timing sub-classification stays qualitative (Vartamāna / Bhāvi / Pūrṇa) only.
            </p>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
            <div style={{ ...cardStyle, borderLeft: `4px solid ${GREEN}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <CheckCircle2 size={16} color={GREEN} />
                <span style={{ fontWeight: 600, color: GREEN }}>Available</span>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                Qualitative timing: Kavya&apos;s Sun-Venus Ithasāla is Vartamāna — presently applying, active now, as opposed to future or past.
              </p>
            </div>
            <div style={{ ...cardStyle, borderLeft: `4px solid ${VERMILION}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <XCircle size={16} color={VERMILION} />
                <span style={{ fontWeight: 600, color: VERMILION }}>Not available</span>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                Exact date of exact conjunction. Requires daily planetary-motion data not included in this module&apos;s chart design.
              </p>
            </div>
          </div>

          <section style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={eyebrowStyle}>Qualitative timing only</p>
            <svg viewBox="0 0 400 120" role="img" aria-label="Applying aspect without exact date" style={{ width: "100%", maxHeight: 160 }}>
              <circle cx="80" cy="60" r="24" fill={`${VERMILION}15`} stroke={VERMILION} strokeWidth="2" />
              <text x="80" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Sun</text>
              <text x="80" y="70" textAnchor="middle" fill={INK_MUTED} fontSize="9">20° Cancer</text>

              <circle cx="200" cy="60" r="24" fill={`${GREEN}15`} stroke={GREEN} strokeWidth="2" />
              <text x="200" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Venus</text>
              <text x="200" y="70" textAnchor="middle" fill={INK_MUTED} fontSize="9">5° Cancer</text>

              <path d="M 104 60 L 176 60" stroke={GOLD} strokeWidth="2" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD} />
                </marker>
              </defs>

              <text x="140" y="48" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight={600}>applying</text>

              <rect x="280" y="35" width="100" height="50" rx="8" fill={`${VERMILION}08`} stroke={VERMILION} />
              <text x="330" y="55" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight={600}>Exact date</text>
              <text x="330" y="70" textAnchor="middle" fill={INK_MUTED} fontSize="9">not computable</text>
            </svg>
          </section>
        </>
      )}
    </div>
  );
}

function Timeline({ sequence, highlightDay }: { sequence: Period[]; highlightDay: number }) {
  const total = sequence[sequence.length - 1]?.endDay || 360;
  return (
    <div style={{ position: "relative", height: "44px", borderRadius: "8px", background: "rgba(156, 122, 47, 0.06)", overflow: "hidden", display: "flex" }}>
      {sequence.map((p) => {
        const width = (p.days / total) * 100;
        const highlighted = highlightDay >= p.startDay && highlightDay <= p.endDay;
        return (
          <div
            key={p.planet}
            style={{
              width: `${width}%`,
              height: "100%",
              background: highlighted ? `${PLANET_COLORS[p.planet]}45` : `${PLANET_COLORS[p.planet]}18`,
              borderRight: `1px solid ${HAIRLINE}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "24px"
            }}
          >
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: PLANET_COLORS[p.planet] }}>{p.planet.slice(0, 3)}</span>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: `${(highlightDay / total) * 100}%`,
          top: 0,
          bottom: 0,
          width: "3px",
          background: VERMILION,
          transform: "translateX(-50%)"
        }}
      />
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "12px",
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: GOLD_DEEP,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: "0 0 0.35rem"
};

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    padding: "0.45rem 0.75rem",
    borderRadius: "999px",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 150ms ease"
  };
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.5rem 0.85rem",
    borderRadius: "8px",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer"
  };
}
