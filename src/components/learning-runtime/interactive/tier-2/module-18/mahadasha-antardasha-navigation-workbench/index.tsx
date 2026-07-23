"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  Calculator,
  Layers3,
  MapPinned,
  RotateCcw,
  Timer,
  Zap,
} from "lucide-react";
import {
  workbenchDiagramLayoutStyle,
  workbenchTwoColumnStyle,
} from "@/components/learning-runtime/interactive/lib/layouts";

type LordKey =
  | "ketu"
  | "venus"
  | "sun"
  | "moon"
  | "mars"
  | "rahu"
  | "jupiter"
  | "saturn"
  | "mercury";

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

const LORDS: Record<
  LordKey,
  { label: string; short: string; years: number; color: string }
> = {
  ketu: { label: "Ketu", short: "Ke", years: 7, color: PURPLE },
  venus: { label: "Venus", short: "Ve", years: 20, color: GOLD },
  sun: { label: "Sun", short: "Su", years: 6, color: VERMILION },
  moon: { label: "Moon", short: "Mo", years: 10, color: BLUE },
  mars: { label: "Mars", short: "Ma", years: 7, color: VERMILION },
  rahu: { label: "Rāhu", short: "Ra", years: 18, color: PURPLE },
  jupiter: { label: "Jupiter", short: "Ju", years: 16, color: GREEN },
  saturn: { label: "Saturn", short: "Sa", years: 19, color: PURPLE },
  mercury: { label: "Mercury", short: "Me", years: 17, color: GREEN },
};

const LORD_ORDER: LordKey[] = [
  "ketu",
  "venus",
  "sun",
  "moon",
  "mars",
  "rahu",
  "jupiter",
  "saturn",
  "mercury",
];

function computeAntardashas(mdLord: LordKey, mdYears: number) {
  const mdIndex = LORD_ORDER.indexOf(mdLord);
  let running = 0;
  return LORD_ORDER.map((_, offset) => {
    const adLord = LORD_ORDER[(mdIndex + offset) % 9];
    const duration = (mdYears * LORDS[adLord].years) / 120;
    const start = running;
    running += duration;
    return { adLord, duration, startAge: start, endAge: running };
  });
}

function formatAge(age: number): string {
  return age.toFixed(3);
}

function yearsToDays(years: number): number {
  return years * 365.25;
}

export function MahadashaAntardashaNavigationWorkbench() {
  const [mdLord, setMdLord] = useState<LordKey>("moon");
  const [mdStartAge, setMdStartAge] = useState<number>(30.506);
  const [targetAge, setTargetAge] = useState<number>(33.0);
  const [forwardSteps, setForwardSteps] = useState<number>(3);
  const [directTargetLord, setDirectTargetLord] = useState<LordKey>("venus");
  const [rescaleLord, setRescaleLord] = useState<LordKey>("rahu");

  const mdYears = LORDS[mdLord].years;
  const mdEndAge = mdStartAge + mdYears;
  const antardashas = useMemo(
    () => computeAntardashas(mdLord, mdYears),
    [mdLord, mdYears]
  );

  const activeAd = antardashas.find(
    (ad) => targetAge >= mdStartAge + ad.startAge && targetAge < mdStartAge + ad.endAge
  );

  const directAd = antardashas.find((ad) => ad.adLord === directTargetLord);
  const directStartAge = directAd ? mdStartAge + directAd.startAge : mdStartAge;
  const directEndAge = directAd ? mdStartAge + directAd.endAge : mdStartAge;

  const mdIndex = LORD_ORDER.indexOf(mdLord);
  const targetIndex = LORD_ORDER.indexOf(directTargetLord);
  const cyclicTargetIndex = (targetIndex - mdIndex + 9) % 9;
  const precedingLords = antardashas.slice(0, cyclicTargetIndex).map((ad) => ad.adLord);
  const precedingSum = precedingLords.reduce(
    (sum, lord) => sum + LORDS[lord].years,
    0
  );
  const directJumpOffset = (mdYears * precedingSum) / 120;

  const rescaleExamples: LordKey[] = ["moon", "venus", "sun"];

  return (
    <div
      data-interactive="mahadasha-antardasha-navigation-workbench"
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
            <p style={eyebrowStyle}>Mahādaśā to antardaśā navigation</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              Two shortcuts: forward lookup and direct jump
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Avoid rebuilding the full nine-row table. Learn to enter the
              proportional rule from either direction: date → active antardaśā,
              or named antardaśā → start and end dates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMdLord("moon");
              setMdStartAge(30.506);
              setTargetAge(33.0);
              setForwardSteps(3);
              setDirectTargetLord("venus");
              setRescaleLord("rahu");
            }}
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
              <p style={eyebrowStyle}>Mahādaśā timeline</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: BLUE,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {LORDS[mdLord].label} MD: age {formatAge(mdStartAge)}–
                {formatAge(mdEndAge)}
              </h3>
            </div>
            <strong style={{ color: BLUE, fontWeight: 700 }}>
              {mdYears} years
            </strong>
          </div>
          <TimelineSvg
            mdLord={mdLord}
            mdStartAge={mdStartAge}
            mdEndAge={mdEndAge}
            antardashas={antardashas}
            targetAge={targetAge}
            activeAd={activeAd}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
              gap: "0.65rem",
            }}
          >
            <MiniFact
              icon={<Timer size={16} />}
              title="MD start"
              body={`Age ${formatAge(mdStartAge)}`}
              color={BLUE}
            />
            <MiniFact
              icon={<Layers3 size={16} />}
              title="Active now"
              body={
                activeAd
                  ? `${LORDS[mdLord].label}/${LORDS[activeAd.adLord].label}`
                  : "—"
              }
              color={activeAd ? LORDS[activeAd.adLord].color : INK_MUTED}
            />
            <MiniFact
              icon={<MapPinned size={16} />}
              title="Target age"
              body={`Age ${formatAge(targetAge)}`}
              color={GOLD}
            />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Mahādaśā lord" icon={<Timer size={18} />} color={BLUE}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.45rem",
              }}
            >
              {LORD_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={mdLord === key}
                  onClick={() => setMdLord(key)}
                  style={smallChipStyle(mdLord === key, LORDS[key].color)}
                >
                  {LORDS[key].short}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>
              {LORDS[mdLord].label} MD lasts {mdYears} years. Antardaśās start
              from {LORDS[mdLord].label}, not from Ketu.
            </p>
          </Panel>

          <Panel title="MD start age" icon={<Calculator size={18} />} color={GREEN}>
            <input
              type="number"
              step="0.001"
              value={mdStartAge}
              onChange={(e) => setMdStartAge(parseFloat(e.target.value) || 0)}
              style={{
                width: "100%",
                padding: "0.55rem",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                background: "transparent",
                color: INK_PRIMARY,
                fontSize: "0.95rem",
              }}
            />
            <p style={bodyTextStyle}>
              Kavya&apos;s Moon MD starts at age 30.506. Change this to practice
              on other charts.
            </p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Forward lookup</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: GREEN,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            Date → active antardaśā
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            Walk the cyclic order with a running total. Stop as soon as the
            target age falls inside the current bracket.
          </p>

          <Panel title="Target age" icon={<MapPinned size={18} />} color={GOLD}>
            <input
              type="range"
              min={mdStartAge}
              max={mdEndAge}
              step="0.01"
              value={Math.min(Math.max(targetAge, mdStartAge), mdEndAge)}
              onChange={(e) => setTargetAge(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.35rem",
                color: INK_MUTED,
                fontSize: "0.78rem",
              }}
            >
              <span>{formatAge(mdStartAge)}</span>
              <span style={{ color: GOLD, fontWeight: 700 }}>
                Age {formatAge(targetAge)}
              </span>
              <span>{formatAge(mdEndAge)}</span>
            </div>
          </Panel>

          <div style={{ marginTop: "0.85rem" }}>
            <p style={{ ...eyebrowStyle, marginBottom: "0.5rem" }}>
              Cumulative walk (steps revealed: {forwardSteps})
            </p>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {antardashas.slice(0, forwardSteps).map((ad, index) => {
                const bracketStart = mdStartAge + ad.startAge;
                const bracketEnd = mdStartAge + ad.endAge;
                const containsTarget =
                  targetAge >= bracketStart && targetAge < bracketEnd;
                return (
                  <div
                    key={ad.adLord}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.55rem 0.65rem",
                      borderRadius: 8,
                      border: `1px solid ${containsTarget ? LORDS[ad.adLord].color : HAIRLINE}`,
                      background: containsTarget
                        ? `${LORDS[ad.adLord].color}12`
                        : "transparent",
                    }}
                  >
                    <span style={{ color: LORDS[ad.adLord].color, fontWeight: 700 }}>
                      {LORDS[mdLord].label}/{LORDS[ad.adLord].label}
                    </span>
                    <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>
                      {formatAge(bracketStart)}–{formatAge(bracketEnd)}
                    </span>
                    {containsTarget ? (
                      <span
                        style={{
                          color: GREEN,
                          fontSize: "0.78rem",
                          fontWeight: 700,
                        }}
                      >
                        target here
                      </span>
                    ) : (
                      <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>
                        step {index + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "0.65rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setForwardSteps((s) => Math.min(s + 1, 9))}
                style={buttonStyle(false, GREEN)}
              >
                <ArrowRight size={15} aria-hidden="true" />
                Reveal next
              </button>
              <button
                type="button"
                onClick={() => setForwardSteps((s) => Math.max(s - 1, 1))}
                style={buttonStyle(false, INK_MUTED)}
              >
                Hide last
              </button>
              <button
                type="button"
                onClick={() => {
                  const foundIndex = antardashas.findIndex(
                    (ad) =>
                      targetAge >= mdStartAge + ad.startAge &&
                      targetAge < mdStartAge + ad.endAge
                  );
                  setForwardSteps(foundIndex >= 0 ? foundIndex + 1 : 9);
                }}
                style={buttonStyle(false, GOLD)}
              >
                <Zap size={15} aria-hidden="true" />
                Jump to answer
              </button>
            </div>
            {activeAd ? (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: 8,
                  background: `${GREEN}0F`,
                  border: `1px solid ${GREEN}44`,
                  color: INK_SECONDARY,
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: GREEN, fontWeight: 700 }}>Answer:</strong>{" "}
                Age {formatAge(targetAge)} falls in{" "}
                <span style={{ color: LORDS[activeAd.adLord].color, fontWeight: 700 }}>
                  {LORDS[mdLord].label}/{LORDS[activeAd.adLord].label}
                </span>{" "}
                ({formatAge(mdStartAge + activeAd.startAge)}–
                {formatAge(mdStartAge + activeAd.endAge)}).
              </div>
            ) : null}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Direct jump</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: GOLD,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            Named antardaśā → start and end
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            Sum the year-values of all lords preceding the target in cyclic
            order, then convert in one step.
          </p>

          <Panel title="Target antardaśā lord" icon={<Timer size={18} />} color={GOLD}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.45rem",
              }}
            >
              {antardashas.map((ad) => (
                <button
                  key={ad.adLord}
                  type="button"
                  aria-pressed={directTargetLord === ad.adLord}
                  onClick={() => setDirectTargetLord(ad.adLord)}
                  style={smallChipStyle(
                    directTargetLord === ad.adLord,
                    LORDS[ad.adLord].color
                  )}
                >
                  {LORDS[ad.adLord].short}
                </button>
              ))}
            </div>
          </Panel>

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: `${GOLD}08`,
              border: `1px solid ${GOLD}33`,
            }}
          >
            <p
              style={{
                margin: 0,
                color: INK_MUTED,
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Preceding lords in cyclic order
            </p>
            <p style={{ margin: "0.4rem 0 0", color: INK_PRIMARY }}>
              {precedingLords.length > 0
                ? precedingLords
                    .map((lord) => `${LORDS[lord].label}(${LORDS[lord].years})`)
                    .join(" + ")
                : "None — this is the first antardaśā"}
            </p>
            {precedingLords.length > 0 ? (
              <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
                Sum = {precedingSum}; offset = {mdYears} × ({precedingSum} ÷ 120) ={" "}
                {directJumpOffset.toFixed(4)} yr
              </p>
            ) : null}
          </div>

          {directAd ? (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                borderRadius: 8,
                background: `${GREEN}0F`,
                border: `1px solid ${GREEN}44`,
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: GREEN, fontWeight: 700 }}>Result:</strong>{" "}
              {LORDS[mdLord].label}/{LORDS[directTargetLord].label} runs{" "}
              {formatAge(directStartAge)}–{formatAge(directEndAge)} ({
                formatAge(directAd.duration)
              }{" "}
              yr).
            </div>
          ) : null}
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Rescaling trap</p>
        <h3
          style={{
            margin: "0.15rem 0 0.75rem",
            color: VERMILION,
            fontSize: "1.18rem",
            fontWeight: 600,
          }}
        >
          A planet&apos;s antardaśā length is not fixed
        </h3>
        <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          The same planet gets different antardaśā lengths inside different
          mahādaśās. Always rescale with the current MD total.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
            gap: "0.75rem",
          }}
        >
          {rescaleExamples.map((hostLord) => {
            const hostYears = LORDS[hostLord].years;
            const adDuration = (hostYears * LORDS[rescaleLord].years) / 120;
            return (
              <div
                key={hostLord}
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 8,
                  padding: "0.75rem",
                  background:
                    hostLord === mdLord ? `${LORDS[hostLord].color}0F` : "transparent",
                }}
              >
                <div
                  style={{
                    color: LORDS[hostLord].color,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Inside {LORDS[hostLord].label} MD
                </div>
                <p
                  style={{
                    margin: "0.35rem 0 0",
                    color: INK_SECONDARY,
                    fontSize: "0.85rem",
                  }}
                >
                  {LORDS[hostLord].label}/{LORDS[rescaleLord].label} ≈{" "}
                  {yearsToDays(adDuration).toFixed(0)} days
                </p>
                <p
                  style={{
                    margin: "0.2rem 0 0",
                    color: INK_MUTED,
                    fontSize: "0.78rem",
                  }}
                >
                  {hostYears} × {LORDS[rescaleLord].years} ÷ 120
                </p>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
            Choose a planet to rescale:
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.45rem" }}>
            {LORD_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={rescaleLord === key}
                onClick={() => setRescaleLord(key)}
                style={smallChipStyle(rescaleLord === key, LORDS[key].color)}
              >
                {LORDS[key].short}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${BLUE}66`,
          background: `${BLUE}0A`,
        }}
      >
        <p style={eyebrowStyle}>Tool scope disclosure</p>
        <h3
          style={{
            margin: "0.15rem 0 0.5rem",
            color: BLUE,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          What dasha-balance-calculator does and does not yet do
        </h3>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
          This module&apos;s genuinely-implemented <strong style={{ fontWeight: 700 }}>dasha-balance-calculator</strong>{" "}
          computes birth-balance arithmetic and produces the mahādaśā start
          point. Its own spec lists antardaśā-level display as a future item,
          not yet built. The forward-lookup and direct-jump skills above are
          therefore hand-computable — which is the point of fluency.
        </p>
      </section>
    </div>
  );
}

function TimelineSvg({
  mdLord,
  mdStartAge,
  mdEndAge,
  antardashas,
  targetAge,
  activeAd,
}: {
  mdLord: LordKey;
  mdStartAge: number;
  mdEndAge: number;
  antardashas: ReturnType<typeof computeAntardashas>;
  targetAge: number;
  activeAd: ReturnType<typeof computeAntardashas>[number] | undefined;
}) {
  const width = 520;
  const height = 220;
  const padding = { top: 50, right: 30, bottom: 50, left: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const mdDuration = mdEndAge - mdStartAge;

  function xForAge(age: number) {
    return (
      padding.left +
      ((age - mdStartAge) / mdDuration) * chartWidth
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Mahādaśā timeline with antardaśā brackets"
      style={{
        width: "100%",
        maxHeight: 320,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      <rect
        x={padding.left}
        y={padding.top}
        width={chartWidth}
        height={chartHeight}
        rx={8}
        fill={`${BLUE}08`}
        stroke={HAIRLINE}
      />

      {antardashas.map((ad) => {
        const x1 = xForAge(mdStartAge + ad.startAge);
        const x2 = xForAge(mdStartAge + ad.endAge);
        const isActive = activeAd?.adLord === ad.adLord;
        return (
          <g key={ad.adLord}>
            <rect
              x={x1}
              y={padding.top + 8}
              width={Math.max(2, x2 - x1)}
              height={chartHeight - 16}
              fill={isActive ? `${LORDS[ad.adLord].color}30` : `${LORDS[ad.adLord].color}12`}
              stroke={isActive ? LORDS[ad.adLord].color : HAIRLINE}
              strokeWidth={isActive ? 2 : 1}
            />
            {x2 - x1 > 28 ? (
              <text
                x={(x1 + x2) / 2}
                y={padding.top + chartHeight / 2 + 4}
                textAnchor="middle"
                fill={LORDS[ad.adLord].color}
                fontSize="11"
                fontWeight={700}
              >
                {LORDS[ad.adLord].short}
              </text>
            ) : null}
          </g>
        );
      })}

      <line
        x1={xForAge(targetAge)}
        y1={padding.top - 12}
        x2={xForAge(targetAge)}
        y2={padding.top + chartHeight + 12}
        stroke={GOLD}
        strokeWidth={3}
        strokeDasharray="6 4"
      />
      <polygon
        points={`${xForAge(targetAge) - 6},${padding.top - 12} ${xForAge(targetAge) + 6},${padding.top - 12} ${xForAge(targetAge)},${padding.top - 2}`}
        fill={GOLD}
      />
      <text
        x={xForAge(targetAge)}
        y={padding.top - 18}
        textAnchor="middle"
        fill={GOLD}
        fontSize="11"
        fontWeight={700}
      >
        age {targetAge.toFixed(2)}
      </text>

      <text
        x={padding.left}
        y={height - 18}
        textAnchor="start"
        fill={INK_MUTED}
        fontSize="12"
        fontWeight={700}
      >
        {mdStartAge.toFixed(2)}
      </text>
      <text
        x={padding.left + chartWidth}
        y={height - 18}
        textAnchor="end"
        fill={INK_MUTED}
        fontSize="12"
        fontWeight={700}
      >
        {mdEndAge.toFixed(2)}
      </text>
      <text
        x={padding.left + chartWidth / 2}
        y={padding.top - 34}
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="12"
        fontWeight={700}
      >
        {LORDS[mdLord].label} mahādaśā with antardaśā brackets
      </text>
    </svg>
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
          fontWeight: 700,
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
          fontWeight: 700,
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
