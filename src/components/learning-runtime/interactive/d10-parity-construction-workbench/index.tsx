"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Binary,
  Calculator,
  CircleDot,
  Compass,
  MapPinned,
  RotateCcw,
  Route,
} from "lucide-react";
import { NI_HOUSE_POLYGONS, NI_HOUSE_CENTERS } from "@/lib/north-indian-chart-geometry";

type ModeKey = "planet" | "lagna";
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

const SIGNS: Array<{ key: SignKey; label: string; short: string; parity: "odd" | "even" }> = [
  { key: "aries", label: "Aries", short: "Ar", parity: "odd" },
  { key: "taurus", label: "Taurus", short: "Ta", parity: "even" },
  { key: "gemini", label: "Gemini", short: "Ge", parity: "odd" },
  { key: "cancer", label: "Cancer", short: "Cn", parity: "even" },
  { key: "leo", label: "Leo", short: "Le", parity: "odd" },
  { key: "virgo", label: "Virgo", short: "Vi", parity: "even" },
  { key: "libra", label: "Libra", short: "Li", parity: "odd" },
  { key: "scorpio", label: "Scorpio", short: "Sc", parity: "even" },
  { key: "sagittarius", label: "Sagittarius", short: "Sg", parity: "odd" },
  { key: "capricorn", label: "Capricorn", short: "Cp", parity: "even" },
  { key: "aquarius", label: "Aquarius", short: "Aq", parity: "odd" },
  { key: "pisces", label: "Pisces", short: "Pi", parity: "even" },
];

const DIKPALAS = ["Indra", "Agni", "Yama", "Nirrti", "Varuna", "Vayu", "Kubera", "Isana", "Brahma", "Ananta"];

function wrapIndex(index: number) {
  return ((index % SIGNS.length) + SIGNS.length) % SIGNS.length;
}

function bandFromDegree(degree: number) {
  return Math.min(10, Math.floor(degree / 3) + 1);
}

function formatDegree(degree: number) {
  const whole = Math.floor(degree);
  const minutes = Math.round((degree - whole) * 60);
  if (minutes === 60) return `${whole + 1}deg 00'`;
  return `${whole}deg ${String(minutes).padStart(2, "0")}'`;
}

function inclusivePath(startIndex: number, band: number) {
  return Array.from({ length: band }, (_, index) => SIGNS[wrapIndex(startIndex + index)]);
}

export function D10ParityConstructionWorkbench() {
  const [mode, setMode] = useState<ModeKey>("planet");
  const [signKey, setSignKey] = useState<SignKey>("taurus");
  const [degree, setDegree] = useState(10);
  const [showTrap, setShowTrap] = useState(true);
  const [showDikpala, setShowDikpala] = useState(false);

  const calculation = useMemo(() => {
    const natalIndex = SIGNS.findIndex((sign) => sign.key === signKey);
    const natalSign = SIGNS[natalIndex];
    const band = bandFromDegree(degree);
    const startIndex = natalSign.parity === "odd" ? natalIndex : wrapIndex(natalIndex + 8);
    const resultIndex = wrapIndex(startIndex + band - 1);
    const wrongStartIndex = natalSign.parity === "odd" ? wrapIndex(natalIndex + 8) : natalIndex;
    const wrongResultIndex = wrapIndex(wrongStartIndex + band - 1);
    const path = inclusivePath(startIndex, band);
    const wrongPath = inclusivePath(wrongStartIndex, band);
    const bandStart = (band - 1) * 3;
    const bandEnd = band * 3;

    return {
      band,
      bandRange: `${bandStart}deg- ${bandEnd}deg`,
      natalIndex,
      natalSign,
      path,
      resultIndex,
      resultSign: SIGNS[resultIndex],
      startIndex,
      startSign: SIGNS[startIndex],
      wrongPath,
      wrongResultIndex,
      wrongResultSign: SIGNS[wrongResultIndex],
      wrongStartSign: SIGNS[wrongStartIndex],
    };
  }, [degree, signKey]);

  const parityColor = calculation.natalSign.parity === "odd" ? BLUE : PURPLE;
  const entityLabel = mode === "lagna" ? "Ascendant" : "planet";
  const dikpala = calculation.natalSign.parity === "odd" ? DIKPALAS[calculation.band - 1] : DIKPALAS[DIKPALAS.length - calculation.band];

  return (
    <div data-interactive="d10-parity-construction-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D10 construction workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Build the Dashamsha from band, parity, and inclusive count
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 890 }}>
              The degree chooses the 3-degree dashamsha band. The sign parity chooses the starting sign. Count inclusively from there to avoid the D10 parity error.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode("planet");
              setSignKey("taurus");
              setDegree(10);
              setShowTrap(true);
              setShowDikpala(false);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Counting diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: calculation.resultSign.parity === "odd" ? BLUE : PURPLE, fontSize: "1.2rem" }}>
                {calculation.natalSign.label} {formatDegree(degree)} {"->"} D10 {calculation.resultSign.label}
              </h3>
            </div>
            <strong style={{ color: parityColor, fontWeight: 700 }}>{calculation.natalSign.parity.toUpperCase()} sign rule</strong>
          </div>
          <D10Wheel
            natalIndex={calculation.natalIndex}
            startIndex={calculation.startIndex}
            resultIndex={calculation.resultIndex}
            path={calculation.path.map((sign) => sign.key)}
            wrongPath={calculation.wrongPath.map((sign) => sign.key)}
            showTrap={showTrap}
            parityColor={parityColor}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Binary size={16} />} title="Parity" body={`${calculation.natalSign.label} is ${calculation.natalSign.parity}`} color={parityColor} />
            <MiniFact icon={<Compass size={16} />} title="Start sign" body={calculation.startSign.label} color={GOLD} />
            <MiniFact icon={<MapPinned size={16} />} title="D10 result" body={calculation.resultSign.label} color={GREEN} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Input mode" icon={<CircleDot size={18} />} color={mode === "lagna" ? GREEN : BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={mode === "planet"} onClick={() => setMode("planet")} style={smallChipStyle(mode === "planet", BLUE)}>
                Planet
              </button>
              <button type="button" aria-pressed={mode === "lagna"} onClick={() => setMode("lagna")} style={smallChipStyle(mode === "lagna", GREEN)}>
                D10 Lagna
              </button>
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              {mode === "lagna" ? "Use the Ascendant sign and degree; the resulting sign becomes the D10 Lagna." : "Use any natal planet's sign and degree to map its D10 sign."}
            </p>
          </Panel>

          <Panel title={`${entityLabel} sign`} icon={<Route size={18} />} color={parityColor}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: "0.45rem" }}>
              {SIGNS.map((sign) => (
                <button
                  key={sign.key}
                  type="button"
                  aria-pressed={signKey === sign.key}
                  onClick={() => setSignKey(sign.key)}
                  style={smallChipStyle(signKey === sign.key, sign.parity === "odd" ? BLUE : PURPLE)}
                >
                  {sign.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title={`${entityLabel} degree`} icon={<Calculator size={18} />} color={GOLD}>
            <input
              aria-label={`${entityLabel} degree within the sign`}
              type="range"
              min={0}
              max={29.9}
              step={0.1}
              value={degree}
              onChange={(event) => setDegree(Number(event.target.value))}
              style={{ width: "100%", accentColor: GOLD }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", color: INK_MUTED, fontSize: "0.82rem", fontWeight: 600 }}>
              <span>0deg</span>
              <span>{formatDegree(degree)}</span>
              <span>30deg</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
              <button type="button" onClick={() => { setMode("planet"); setSignKey("aries"); setDegree(23.25); }} style={buttonStyle(false, BLUE)}>
                Example: 23deg15 Aries
              </button>
              <button type="button" onClick={() => { setMode("planet"); setSignKey("taurus"); setDegree(10); }} style={buttonStyle(false, PURPLE)}>
                Example: 10deg Taurus
              </button>
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Dashamsha band</p>
        <h3 style={{ margin: "0.15rem 0 0.85rem", color: GOLD, fontSize: "1.18rem" }}>
          Band {calculation.band}: {calculation.bandRange} within {calculation.natalSign.label}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, minmax(0, 1fr))", gap: "0.35rem" }}>
          {Array.from({ length: 10 }, (_, index) => {
            const band = index + 1;
            const active = band === calculation.band;
            return (
              <button
                key={band}
                type="button"
                aria-pressed={active}
                onClick={() => setDegree(index * 3 + 1.5)}
                style={{
                  minHeight: 62,
                  border: `1px solid ${active ? GOLD : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${GOLD}22` : "transparent",
                  color: active ? GOLD : INK_SECONDARY,
                  cursor: "pointer",
                  fontWeight: 600,
                  padding: "0.35rem",
                }}
              >
                <span style={{ display: "block", fontSize: "0.95rem" }}>{band}</span>
                <span style={{ display: "block", fontSize: "0.7rem", color: active ? GOLD : INK_MUTED }}>{index * 3}-{band * 3}deg</span>
              </button>
            );
          })}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Three-step construction</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <StepRow
              index="1"
              title="Find the 3-degree band"
              body={`${formatDegree(degree)} sits in band ${calculation.band}, so the dashamsha number is ${calculation.band}.`}
              color={GOLD}
            />
            <StepRow
              index="2"
              title="Apply deva-asura parity"
              body={calculation.natalSign.parity === "odd" ? `${calculation.natalSign.label} is odd, so count from the sign itself.` : `${calculation.natalSign.label} is even, so start from the 9th sign: ${calculation.startSign.label}.`}
              color={parityColor}
            />
            <StepRow
              index="3"
              title="Count inclusively"
              body={`${calculation.path.map((sign, index) => `${sign.label} ${index + 1}`).join(" -> ")}. Result: ${calculation.resultSign.label}.`}
              color={GREEN}
            />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: showTrap ? `${VERMILION}66` : HAIRLINE, background: showTrap ? `${VERMILION}0F` : SURFACE }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Parity-error trap</p>
              <h3 style={{ margin: "0.15rem 0 0", color: showTrap ? VERMILION : GOLD, fontSize: "1.18rem" }}>
                Wrong rule gives {calculation.wrongResultSign.label}
              </h3>
            </div>
            <button type="button" aria-pressed={showTrap} onClick={() => setShowTrap((value) => !value)} style={smallChipStyle(showTrap, VERMILION)}>
              {showTrap ? "Trap visible" : "Show trap"}
            </button>
          </div>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            If you start from {calculation.wrongStartSign.label} instead of {calculation.startSign.label}, the same band {calculation.band} lands in {calculation.wrongResultSign.label}. That is the cardinal D10 construction error this lesson is training away.
          </p>
          {showTrap ? (
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {calculation.wrongPath.map((sign, index) => (
                <span key={`${sign.key}-${index}`} style={{ border: `1px dashed ${VERMILION}88`, borderRadius: 8, padding: "0.42rem 0.55rem", color: VERMILION, fontWeight: 600 }}>
                  {index + 1}. {sign.label}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Reference layer</p>
            <h3 style={{ margin: "0.15rem 0 0", color: showDikpala ? GOLD : INK_PRIMARY, fontSize: "1.18rem" }}>
              Dikpala recognition is optional; construction comes first
            </h3>
          </div>
          <button type="button" aria-pressed={showDikpala} onClick={() => setShowDikpala((value) => !value)} style={smallChipStyle(showDikpala, GOLD)}>
            {showDikpala ? "Dikpala shown" : "Show dikpala"}
          </button>
        </div>
        {showDikpala ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.5rem", marginTop: "0.8rem" }}>
            {DIKPALAS.map((name, index) => {
              const oddBand = index + 1;
              const evenBand = DIKPALAS.length - index;
              const active = name === dikpala;
              return (
                <div key={name} style={{ border: `1px solid ${active ? GOLD : HAIRLINE}`, borderRadius: 8, background: active ? `${GOLD}18` : "transparent", padding: "0.65rem" }}>
                  <strong style={{ color: active ? GOLD : INK_PRIMARY, fontWeight: 700 }}>{name}</strong>
                  <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.35 }}>
                    Odd band {oddBand}; even band {evenBand}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            For this lesson, master the operative construction rule: odd signs count from themselves; even signs count from the 9th sign. The deity order is a reference layer after the map is correct.
          </p>
        )}
      </section>
    </div>
  );
}

function D10Wheel({
  natalIndex,
  startIndex,
  resultIndex,
  path,
  wrongPath,
  showTrap,
  parityColor,
}: {
  natalIndex: number;
  startIndex: number;
  resultIndex: number;
  path: SignKey[];
  wrongPath: SignKey[];
  showTrap: boolean;
  parityColor: string;
}) {
  const center = 170;
  const natalSign = SIGNS[natalIndex];
  const resultSign = SIGNS[resultIndex];
  const natalHouse = natalIndex + 1;
  const startHouse = startIndex + 1;
  const resultHouse = resultIndex + 1;
  const pathHouses = new Set(path.map((key) => SIGNS.findIndex((sign) => sign.key === key) + 1));
  const wrongHouses = new Set(wrongPath.map((key) => SIGNS.findIndex((sign) => sign.key === key) + 1));

  return (
    <>
      <svg
        viewBox="0 0 340 340"
        role="img"
        aria-label="D10 inclusive counting wheel"
        style={{
          width: "100%",
          maxHeight: 430,
          margin: "0 auto",
          display: "block",
        }}
      >
        {/* Outer border */}
        <rect
          x="10"
          y="10"
          width="320"
          height="320"
          fill={`${GOLD}05`}
          stroke={HAIRLINE}
          strokeWidth="1.5"
        />

        {/* North Indian chart structural lines */}
        <line
          x1="10"
          y1="10"
          x2="330"
          y2="330"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
        <line
          x1="330"
          y1="10"
          x2="10"
          y2="330"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
        <polygon
          points="170,10 10,170 170,330 330,170"
          fill="none"
          stroke={HAIRLINE}
          strokeWidth="1"
        />

        {/* Render all 12 house polygons */}
        {Array.from({ length: 12 }, (_, index) => index + 1).map((h) => {
          const sign = SIGNS[h - 1];
          const isNatal = h === natalHouse;
          const isStart = h === startHouse;
          const isResult = h === resultHouse;
          const isPath = pathHouses.has(h);
          const isWrong = wrongHouses.has(h);
          const active = isNatal || isStart || isResult;

          const fill = isResult
            ? `${GREEN}25`
            : isStart
              ? `${GOLD}25`
              : isNatal
                ? `${parityColor}25`
                : isPath
                  ? `${GREEN}15`
                  : isWrong && showTrap
                    ? `${VERMILION}10`
                    : "transparent";

          const stroke = isResult
            ? GREEN
            : isStart
              ? GOLD
              : isNatal
                ? parityColor
                : isPath
                  ? `${GREEN}55`
                  : isWrong && showTrap
                    ? `${VERMILION}88`
                    : "rgba(168, 120, 48, 0.4)";

          const c = NI_HOUSE_CENTERS[h];

          return (
            <g key={h}>
              <polygon
                points={NI_HOUSE_POLYGONS[h]}
                fill={fill}
                stroke={stroke}
                strokeWidth={active ? 2.5 : isWrong && showTrap ? 2 : 1}
                strokeDasharray={isWrong && showTrap && !active ? "6 5" : undefined}
                style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
              />
              {/* Sign abbreviation badge */}
              <circle
                cx={c.x}
                cy={c.y}
                r={active ? 14 : 11}
                fill={active ? (isResult ? GREEN : isStart ? GOLD : parityColor) : "#fff"}
                stroke={active ? "#fff" : stroke}
                strokeWidth="1.5"
              />
              <text
                x={c.x}
                y={c.y + 4}
                textAnchor="middle"
                fill={active ? "#fff" : INK_SECONDARY}
                fontSize="12"
                fontWeight="400"
              >
                {sign.short}
              </text>

              {/* Role labels */}
              {isNatal ? (
                <text
                  x={c.x}
                  y={c.y + 26}
                  textAnchor="middle"
                  fill={parityColor}
                  fontSize="9"
                  fontWeight="400"
                >
                  Natal
                </text>
              ) : null}
              {isStart ? (
                <text
                  x={c.x}
                  y={c.y - 20}
                  textAnchor="middle"
                  fill={GOLD}
                  fontSize="9"
                  fontWeight="400"
                >
                  Start
                </text>
              ) : null}
              {isResult ? (
                <text
                  x={c.x}
                  y={c.y - 20}
                  textAnchor="middle"
                  fill={GREEN}
                  fontSize="9"
                  fontWeight="400"
                >
                  D10
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Center overlay circle */}
        <circle
          cx={center}
          cy={center}
          r={34}
          fill="#FFF9EA"
          stroke={GOLD}
          strokeWidth="2.5"
        />
        <text
          x={center}
          y={center - 12}
          textAnchor="middle"
          fill={INK_MUTED}
          fontSize="8"
          fontWeight="400"
        >
          D10
        </text>
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          fill={INK_PRIMARY}
          fontSize="15"
          fontWeight="400"
        >
          {natalSign.short} → {resultSign.short}
        </text>
        <text
          x={center}
          y={center + 19}
          textAnchor="middle"
          fill={GREEN}
          fontSize="9"
          fontWeight="400"
        >
          parity ok
        </text>
      </svg>
      {showTrap ? (
        <div
          style={{
            textAlign: "center",
            color: VERMILION,
            fontSize: "0.78rem",
            lineHeight: 1.35,
            marginTop: "0.2rem",
          }}
        >
          Dashed path shows the wrong parity rule
        </div>
      ) : null}
    </>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function StepRow({ index, title, body, color }: { index: string; title: string; body: string; color: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: "0.75rem", alignItems: "start" }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, background: color, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>
        {index}
      </div>
      <div>
        <strong style={{ color, fontWeight: 700 }}>{title}</strong>
        <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
      </div>
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
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
