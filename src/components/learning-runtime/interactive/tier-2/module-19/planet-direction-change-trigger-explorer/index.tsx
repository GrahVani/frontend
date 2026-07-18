"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type MotionKey = "vakra" | "atikara" | "kutila" | "samya" | "manda" | "stambhana";
type ClaimChoice = "overclaim" | "honest" | null;
type ScenarioChoice = "simple" | "verbose" | null;
type MistakeKey = "equalWeight" | "fourthTrigger" | "overDisclose";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const BLUE = "#356CAB";
const AMBER = "#B88421";

const MOTION_STATES: {
  key: MotionKey;
  sanskrit: string;
  label: string;
  effect: string;
  emphasis: number;
}[] = [
  { key: "vakra", sanskrit: "vakra", label: "Retrograde", effect: "amplifies; can reverse some significations; restorative strength", emphasis: 1.3 },
  { key: "atikara", sanskrit: "atikāra", label: "Very fast", effect: "speeds effects; can bring haste", emphasis: 1.15 },
  { key: "kutila", sanskrit: "kuṭila", label: "Zigzag", effect: "mild confusion; a transition", emphasis: 1 },
  { key: "samya", sanskrit: "sāmya", label: "Average", effect: "balanced, unremarkable motion", emphasis: 1 },
  { key: "manda", sanskrit: "manda", label: "Slow", effect: "slows effects", emphasis: 0.85 },
  { key: "stambhana", sanskrit: "stambhana", label: "Stationary", effect: "intensified, concentrated", emphasis: 1.5 },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  equalWeight: {
    label: "Do not cite the station claim as equal in classical weight to the sign-change triggers",
    heldText: "Held: the vocabulary is T1-05's; the station-as-intensifier application is this module's extension.",
    releasedText: "Warning: flattening sourcing depth misrepresents what is independently classically documented.",
  },
  fourthTrigger: {
    label: "Do not double-count a station as a fourth independent trigger",
    heldText: "Held: a station intensifies an existing trigger; it does not activate a new one.",
    releasedText: "Warning: counting the station separately inflates Chapter 4's convergence count.",
  },
  overDisclose: {
    label: "Do not force the full scope disclosure into every client sentence",
    heldText: "Held: client language stays simple and accurate; the practitioner's understanding carries the precision.",
    releasedText: "Warning: over-disclosing can burden the client without improving the reading.",
  },
};

export function PlanetDirectionChangeTriggerExplorer() {
  const [motion, setMotion] = useState<MotionKey>("stambhana");
  const [kavyaStation, setKavyaStation] = useState(true);
  const [claim, setClaim] = useState<ClaimChoice>(null);
  const [scenario, setScenario] = useState<ScenarioChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    equalWeight: true, fourthTrigger: true, overDisclose: true,
  });

  const motionData = MOTION_STATES.find((m) => m.key === motion)!;
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setMotion("stambhana");
    setKavyaStation(true);
    setClaim(null);
    setScenario(null);
    setMistakes({ equalWeight: true, fourthTrigger: true, overDisclose: true });
  }

  return (
    <div data-interactive="planet-direction-change-trigger-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Direction-change triggers</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Planet direction-change trigger explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              T1-05&apos;s motion-state vocabulary is real and verified. This lesson applies it carefully: a station intensifies a transit already underway, but the station-as-trigger application is this module&apos;s own extension.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>T1-05 motion-state vocabulary</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Select a state to read its classical meaning
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {MOTION_STATES.map((m) => {
            const active = motion === m.key;
            return (
              <button
                key={m.key}
                type="button"
                aria-pressed={active}
                onClick={() => setMotion(m.key)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${active ? PURPLE : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${PURPLE}14` : SURFACE,
                  color: active ? PURPLE : INK_PRIMARY,
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>{m.label}</div>
                <div style={{ color: active ? PURPLE : INK_MUTED, fontSize: "0.85rem", marginTop: "0.2rem", fontStyle: "italic" }}>{m.sanskrit}</div>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.75rem",
            borderRadius: 8,
            background: `${PURPLE}0A`,
            border: `1px solid ${PURPLE}44`,
          }}
        >
          <div style={{ color: PURPLE, fontWeight: 600, fontSize: "1.1rem" }}>
            {motionData.label} ({motionData.sanskrit})
          </div>
          <div style={{ color: INK_SECONDARY, marginTop: "0.35rem", lineHeight: 1.55 }}>
            {motionData.effect}. {motionData.key === "vakra"
              ? "Only the five tārā-grahas go retrograde; Sun and Moon do not; Rāhu and Ketu are always retrograde by the mean-node convention."
              : motionData.key === "stambhana"
                ? "This is the state this lesson extends into a transit-timing intensifier."
                : "This state is part of T1-05's natal strength-grading vocabulary."}
          </div>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Kavya&apos;s Saturn-into-Libra station</p>
          <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
            Ingress + station direct
          </h3>
          <StationTimelineSvg showStation={kavyaStation} />
          <button
            type="button"
            aria-pressed={kavyaStation}
            onClick={() => setKavyaStation((v) => !v)}
            style={{ ...buttonStyle(kavyaStation, PURPLE), marginTop: "0.75rem" }}
          >
            {kavyaStation ? "Remove station window" : "Add station window"}
          </button>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Reading" icon={<GaugeIcon />} color={kavyaStation ? PURPLE : BLUE}>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <div style={{ color: kavyaStation ? PURPLE : BLUE, fontWeight: 600, fontSize: "1.1rem" }}>
                {kavyaStation
                  ? "Ingress + stationary intensifier"
                  : "Ingress alone"}
              </div>
              <div style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {kavyaStation
                  ? "Saturn enters Libra and then stations direct. The favourable, exalted ingress reading is held at concentrated strength for the weeks around the station."
                  : "Saturn enters Libra as a favourable, exalted sign-change trigger. Without a station, the reading is the ingress on its own."}
              </div>
            </div>
          </Panel>

          <Panel title="Scope note" icon={<Lightbulb size={18} />} color={AMBER}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              The vocabulary (vakra, stambhana, etc.) is T1-05&apos;s. The application &mdash; a transiting station intensifies the transit &mdash; is this module&apos;s own scope-honest extension.
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Claim evaluator</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Which statement stays within the lesson&apos;s actual scope?
        </h3>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={claim === "overclaim"}
            onClick={() => setClaim("overclaim")}
            style={claimButtonStyle(claim === "overclaim", VERMILION)}
          >
            <span style={{ fontWeight: 600 }}>Overclaiming:</span>{" "}
            &ldquo;Classical doctrine holds that a planet&apos;s station is a major event trigger &mdash; see BPHS on stambhana.&rdquo;
          </button>
          <button
            type="button"
            aria-pressed={claim === "honest"}
            onClick={() => setClaim("honest")}
            style={claimButtonStyle(claim === "honest", GREEN)}
          >
            <span style={{ fontWeight: 600 }}>Scope-honest:</span>{" "}
            &ldquo;Saturn&apos;s station near its Libra ingress is read, in this module&apos;s extension of T1-05&apos;s vocabulary, as an intensifier of the ingress&apos;s already-established signification.&rdquo;
          </button>
        </div>
        {claim && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: claim === "honest" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${claim === "honest" ? GREEN : VERMILION}55`,
              color: claim === "honest" ? GREEN : VERMILION,
            }}
          >
            {claim === "honest"
              ? "Correct. This wording names the borrowed vocabulary (stambhana), the extension (station as intensifier), and what is not claimed (a dedicated classical transit-timing doctrine)."
              : "Incorrect. This wording implies BPHS itself documents station-as-transit-trigger, which this lesson does not claim. The vocabulary is classical; the specific application is this module's extension."}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Professional judgment</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          How much scope detail belongs in a client-facing sentence?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          A colleague asks: &ldquo;Do I really need to explain the scope distinction from §4.2 to a client, or can I just say &apos;Saturn is stationary, so this period is extra intense&apos;?&rdquo;
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "simple"}
            onClick={() => setScenario("simple")}
            style={scenarioButtonStyle(scenario === "simple", GREEN)}
          >
            Simple client language is enough; internal understanding carries the precision
          </button>
          <button
            type="button"
            aria-pressed={scenario === "verbose"}
            onClick={() => setScenario("verbose")}
            style={scenarioButtonStyle(scenario === "verbose", VERMILION)}
          >
            Recite the full classical-vs-extension disclosure every time
          </button>
        </div>
        {scenario && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: scenario === "simple" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${scenario === "simple" ? GREEN : VERMILION}55`,
              color: scenario === "simple" ? GREEN : VERMILION,
            }}
          >
            {scenario === "simple"
              ? "Correct. The client-facing statement can be simple and accurate; the practitioner must be able to answer follow-ups honestly without reciting the full citation note in every sentence."
              : "Incorrect. Full disclosure is an internal discipline, not a required client script. Over-disclosing can confuse the client without adding analytical value."}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <span style={{ fontWeight: 600 }}>{MISTAKES[key].label}</span>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allMistakesHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}55`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. The station is read as an intensifier with proportionate disclosure."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function StationTimelineSvg({ showStation }: { showStation: boolean }) {
  const width = 560;
  const height = 220;
  const margin = { left: 50, right: 40, top: 50, bottom: 50 };
  const xVirgo = margin.left + 60;
  const xLibra = width / 2;
  const xScorpio = width - margin.right - 80;
  const yPath = 110;
  const yStation = yPath + (showStation ? 28 : 0);
  const xStation = xLibra + 50;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Saturn path through Libra with optional station window" style={{ width: "100%", maxHeight: height, margin: "0.55rem auto 0.25rem", display: "block" }}>
      {/* Sign bands */}
      <rect x={margin.left} y={margin.top} width={xLibra - margin.left} height={height - margin.top - margin.bottom} fill={`${PURPLE}08`} stroke={HAIRLINE} />
      <rect x={xLibra} y={margin.top} width={xScorpio - xLibra} height={height - margin.top - margin.bottom} fill={`${GREEN}08`} stroke={HAIRLINE} />
      <rect x={xScorpio} y={margin.top} width={width - margin.right - xScorpio} height={height - margin.top - margin.bottom} fill={`${VERMILION}08`} stroke={HAIRLINE} />
      <text x={(margin.left + xLibra) / 2} y={margin.top - 12} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>Virgo</text>
      <text x={(xLibra + xScorpio) / 2} y={margin.top - 12} textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={600}>Libra · exalted</text>
      <text x={(xScorpio + width - margin.right) / 2} y={margin.top - 12} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>Scorpio</text>

      {/* Ingress arrow */}
      <g transform={`translate(${xLibra - 4} ${yPath - 10})`}>
        <text x="0" y="-6" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={600}>ingress</text>
        <polygon points="-8,-4 4,0 -8,4" fill={GOLD} />
      </g>

      {/* Saturn path */}
      <path
        d={`M ${margin.left} ${yPath} C ${xVirgo} ${yPath}, ${xLibra - 40} ${yPath}, ${xLibra} ${yPath} ${showStation ? `C ${xLibra + 30} ${yPath}, ${xStation - 20} ${yStation}, ${xStation} ${yStation} C ${xStation + 30} ${yStation}, ${xScorpio - 30} ${yPath}, ${xScorpio} ${yPath}` : `C ${xLibra + 60} ${yPath}, ${xScorpio - 60} ${yPath}, ${xScorpio} ${yPath}`} L ${width - margin.right} ${yPath}`}
        fill="none"
        stroke={PURPLE}
        strokeWidth="2.5"
      />

      {/* Station window */}
      {showStation && (
        <>
          <rect
            x={xStation - 55}
            y={yStation - 35}
            width={110}
            height={70}
            rx={8}
            fill={`${PURPLE}14`}
            stroke={PURPLE}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x={xStation} y={yStation + 52} textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight={600}>station window</text>
        </>
      )}

      {/* Saturn glyph at station or mid-Libra */}
      <g transform={`translate(${showStation ? xStation : (xLibra + xScorpio) / 2} ${showStation ? yStation : yPath})`}>
        <circle r={16} fill={`${PURPLE}22`} stroke={PURPLE} strokeWidth="2" />
        <text y="4" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight={600}>Sa</text>
      </g>

      {/* Direction arrows */}
      <g>
        <polygon points={`${xVirgo + 10},${yPath - 5} ${xVirgo + 20},${yPath} ${xVirgo + 10},${yPath + 5}`} fill={PURPLE} />
        <polygon points={`${xScorpio - 20},${yPath - 5} ${xScorpio - 10},${yPath} ${xScorpio - 20},${yPath + 5}`} fill={PURPLE} />
      </g>

      {/* Legend */}
      <g transform={`translate(${margin.left} ${height - 22})`}>
        <line x1="0" y1="0" x2="24" y2="0" stroke={PURPLE} strokeWidth="2.5" />
        <text x="32" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>Saturn path</text>
        {showStation && (
          <>
            <rect x="110" y="-8" width="16" height="16" rx="4" fill={`${PURPLE}14`} stroke={PURPLE} strokeDasharray="4 4" />
            <text x="134" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>concentrated station window</text>
          </>
        )}
      </g>
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
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

function claimButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.75rem",
    fontWeight: 400,
    cursor: "pointer",
    lineHeight: 1.55,
  };
}

function scenarioButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
