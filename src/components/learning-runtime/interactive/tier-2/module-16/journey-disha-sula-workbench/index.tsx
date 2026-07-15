"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Compass,
  Info,
  MapPin,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const AMBER = "#C78D26";

type Direction = "East" | "South" | "West" | "North";

interface DayData {
  day: string;
  lord: string;
  pairing: Direction | "all" | "avoided";
  dishaSula: Direction | null;
}

const DAYS: DayData[] = [
  { day: "Sunday", lord: "Sun", pairing: "East", dishaSula: "West" },
  { day: "Monday", lord: "Moon", pairing: "East", dishaSula: "East" },
  { day: "Tuesday", lord: "Mars", pairing: "South", dishaSula: "North" },
  { day: "Wednesday", lord: "Mercury", pairing: "North", dishaSula: "North" },
  { day: "Thursday", lord: "Jupiter", pairing: "all", dishaSula: "South" },
  { day: "Friday", lord: "Venus", pairing: "West", dishaSula: "West" },
  { day: "Saturday", lord: "Saturn", pairing: "avoided", dishaSula: "East" },
];

function evaluateDay(day: DayData, direction: Direction, ignoreDishaSula: boolean) {
  const pairingFavours = day.pairing === direction || day.pairing === "all";
  const dishaSulaBlocks = day.dishaSula === direction;
  const isAvoidedDay = day.pairing === "avoided";

  let verdict: "recommended" | "blocked" | "conflict" | "acceptable" | "avoided";
  if (isAvoidedDay) {
    verdict = "avoided";
  } else if (dishaSulaBlocks && !ignoreDishaSula) {
    verdict = pairingFavours ? "conflict" : "blocked";
  } else if (pairingFavours) {
    verdict = "recommended";
  } else {
    verdict = "acceptable";
  }

  return { pairingFavours, dishaSulaBlocks, isAvoidedDay, verdict };
}

function verdictColor(verdict: string): string {
  if (verdict === "recommended") return GREEN;
  if (verdict === "conflict") return AMBER;
  if (verdict === "blocked" || verdict === "avoided") return VERMILION;
  return GOLD;
}

function verdictLabel(verdict: string): string {
  if (verdict === "recommended") return "recommended";
  if (verdict === "conflict") return "pairing favours, Diśā-Śūla blocks";
  if (verdict === "blocked") return "blocked by Diśā-Śūla";
  if (verdict === "avoided") return "day avoided for travel";
  return "acceptable";
}

export function JourneyDishaSulaWorkbench() {
  const [direction, setDirection] = useState<Direction>("West");
  const [ignoreDishaSula, setIgnoreDishaSula] = useState(false);

  const evaluated = useMemo(() => DAYS.map((d) => ({ day: d, ...evaluateDay(d, direction, ignoreDishaSula) })), [direction, ignoreDishaSula]);

  const recommended = evaluated.find((e) => e.verdict === "recommended");
  const conflicts = evaluated.filter((e) => e.verdict === "conflict");

  return (
    <div data-interactive="journey-disha-sula-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Journey muhūrta — Diśā-Śūla direction-timing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              Pick a direction, then watch Diśā-Śūla override the pairing table
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`Diśā-Śūla blocks a direction on specific weekdays regardless of direction-day-pairing favourability. This is not dik-bala — it is a separate T1-23 journey doctrine.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDirection("West");
              setIgnoreDishaSula(false);
            }}
            style={buttonStyle(false, ACCENT)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: T1-23 Lesson 23.4.4 §4.2-§4.7; Muhūrta-Cintāmaṇi Chapter 9
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>Select travel direction</p>
          <CompassSvg selected={direction} onSelect={setDirection} />

          <div
            style={{
              padding: "0.65rem",
              borderRadius: 6,
              border: `1px solid ${BLUE}`,
              background: `${BLUE}08`,
              fontSize: "0.8rem",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <Info size={14} color={BLUE} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />
            {`Thursday is universally favourable per direction-day-pairing, but its own Diśā-Śūla is South — so Thursday-South travel is still blocked.`}
          </div>

          <button type="button" onClick={() => setIgnoreDishaSula((v) => !v)} style={buttonStyle(ignoreDishaSula, VERMILION)}>
            {ignoreDishaSula ? <AlertTriangle size={14} /> : <XCircle size={14} />}
            {ignoreDishaSula ? "Show Diśā-Śūla again" : "Ignore Diśā-Śūla (mistake)"}
          </button>
        </section>

        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>{`Evaluation for ${direction}-direction travel`}</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Day</th>
                  <th style={thStyle}>Pairing</th>
                  <th style={thStyle}>Diśā-Śūla</th>
                  <th style={thStyle}>Final verdict</th>
                </tr>
              </thead>
              <tbody>
                {evaluated.map((e) => {
                  const color = verdictColor(e.verdict);
                  return (
                    <tr key={e.day.day} style={{ background: e.verdict === "conflict" ? `${AMBER}08` : undefined }}>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{e.day.day}</span>
                        <span style={{ fontSize: "0.75rem", color: INK_MUTED, marginLeft: "0.35rem" }}>({e.day.lord})</span>
                      </td>
                      <td style={tdStyle}>
                        {e.day.pairing === "all" ? (
                          <span style={{ color: GREEN }}>all directions</span>
                        ) : e.day.pairing === "avoided" ? (
                          <span style={{ color: VERMILION }}>avoided for travel</span>
                        ) : e.pairingFavours ? (
                          <span style={{ color: GREEN }}>{e.day.pairing}</span>
                        ) : (
                          <span style={{ color: INK_MUTED }}>{e.day.pairing}</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {e.dishaSulaBlocks ? (
                          <span style={{ color: VERMILION }}>{e.day.dishaSula} blocked</span>
                        ) : e.day.dishaSula ? (
                          <span style={{ color: INK_MUTED }}>{e.day.dishaSula} blocked</span>
                        ) : (
                          <span style={{ color: INK_MUTED }}>—</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color, fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                          {e.verdict === "recommended" && <CheckCircle2 size={12} />}
                          {e.verdict === "conflict" && <AlertTriangle size={12} />}
                          {(e.verdict === "blocked" || e.verdict === "avoided") && <XCircle size={12} />}
                          {verdictLabel(e.verdict)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {conflicts.length > 0 && !ignoreDishaSula && (
            <div
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: 6,
                border: `1px solid ${AMBER}`,
                background: `${AMBER}10`,
                fontSize: "0.85rem",
                color: INK_PRIMARY,
                lineHeight: 1.55,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: AMBER, marginBottom: "0.25rem" }}>
                <AlertTriangle size={12} />
                Within-discipline conflict
              </div>
              {conflicts.map((c) => c.day.day).join(", ")} {conflicts.length > 1 ? "are" : "is"} favoured by direction-day-pairing but blocked by Diśā-Śūla. Diśā-Śūla overrides.
            </div>
          )}

          {recommended ? (
            <div
              style={{
                padding: "0.85rem",
                borderRadius: 8,
                border: `1px solid ${GREEN}`,
                background: `${GREEN}10`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: GREEN, marginBottom: "0.35rem" }}>
                <MapPin size={12} />
                Recommendation
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
                {`For ${direction}-direction travel, ${recommended.day.day} is the best available choice: ${
                  recommended.day.pairing === "all" ? "Thursday is universally favourable" : `its pairing favours ${direction}`
                } and Diśā-Śūla does not block ${direction}.`}
              </p>
            </div>
          ) : (
            <div
              style={{
                padding: "0.85rem",
                borderRadius: 8,
                border: `1px solid ${VERMILION}`,
                background: `${VERMILION}10`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.35rem" }}>
                <XCircle size={12} />
                No recommended day
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
                {ignoreDishaSula
                  ? `With Diśā-Śūla ignored, the table is misleading. Re-enable Diśā-Śūla to see the real discipline.`
                  : `No weekday in the table clears both checks for ${direction}. This is unusual; double-check the direction or consider whether safety-context priority already fixes the travel time.`}
              </p>
            </div>
          )}
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Key distinctions</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem", marginTop: "0.55rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, marginBottom: "0.35rem" }}>Dik-bala (T1-13)</div>
            <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
              {`A ṣaḍbala component measuring a planet's directional strength by house-placement. Nothing to do with which way a traveller goes.`}
            </div>
          </div>
          <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}`, background: `${BLUE}08` }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: BLUE, marginBottom: "0.35rem" }}>Diśā-Śūla (T1-23, this lesson)</div>
            <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
              {`A journey doctrine that blocks specific compass directions on specific weekdays of departure.`}
            </div>
          </div>
          <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}`, background: `${GREEN}08` }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GREEN, marginBottom: "0.35rem" }}>Safety-context priority</div>
            <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
              {`Flight schedules, driving safety, medical-emergency travel, and natural hazards all override muhūrta-optimisation.`}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CompassSvg({ selected, onSelect }: { selected: Direction; onSelect: (d: Direction) => void }) {
  const directions: { key: Direction; x: number; y: number; label: string }[] = [
    { key: "North", x: 80, y: 30, label: "N" },
    { key: "East", x: 150, y: 100, label: "E" },
    { key: "South", x: 80, y: 170, label: "S" },
    { key: "West", x: 10, y: 100, label: "W" },
  ];

  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Compass rose for selecting travel direction" style={{ width: "100%", maxWidth: 180, margin: "0 auto", display: "block" }}>
      <circle cx={80} cy={100} r={70} fill="none" stroke={HAIRLINE} strokeWidth={1} />
      <line x1={80} y1={30} x2={80} y2={170} stroke={HAIRLINE} strokeWidth={1} />
      <line x1={10} y1={100} x2={150} y2={100} stroke={HAIRLINE} strokeWidth={1} />
      {directions.map((d) => {
        const isSelected = d.key === selected;
        return (
          <g key={d.key}>
            <circle cx={d.x} cy={d.y} r={22} fill={isSelected ? `${ACCENT}20` : SURFACE} stroke={isSelected ? ACCENT : HAIRLINE} strokeWidth={isSelected ? 2.5 : 1} />
            <text x={d.x} y={d.y + 5} textAnchor="middle" fontSize={14} fill={isSelected ? ACCENT : INK_PRIMARY} fontWeight={600}>
              {d.label}
            </text>
            <foreignObject x={d.x - 22} y={d.y - 22} width={44} height={44}>
              <button
                type="button"
                aria-label={`Select ${d.key}`}
                onClick={() => onSelect(d.key)}
                style={{ width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
              />
            </foreignObject>
          </g>
        );
      })}
      <Compass size={20} color={ACCENT} style={{ x: 70, y: 90 }} />
    </svg>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: INK_MUTED,
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.55rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
  verticalAlign: "top",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.82rem",
    cursor: "pointer",
  };
}
