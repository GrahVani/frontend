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

type TriggerKey = "saturn" | "jupiter" | "nodes";
type SaturnReading = "transit-only" | "natal-inclusive";
type ScenarioChoice = "yes" | "no" | null;
type MistakeKey = "unreachableAsClear" | "sameFormat" | "gapAsWeakness";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const AMBER = "#B88421";
const MOON = "#5A6B8A";

const SIGNS_FROM_MOON = [
  "Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus",
  "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio",
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  unreachableAsClear: {
    label: "Do not treat 'no applicable table' as 'vedha-clear'",
    heldText: "Held: Trigger 3 is unreachable — no check could be run — which is weaker than a clear finding.",
    releasedText: "Warning: calling it clear overstates what the sourced material can determine.",
  },
  sameFormat: {
    label: "Do not force all three triggers into the same report format",
    heldText: "Held: clear, contested, and unreachable are three distinct finding-shapes.",
    releasedText: "Warning: uniform formatting hides the real difference between a contested and an unreachable result.",
  },
  gapAsWeakness: {
    label: "Do not conflate a verification gap with a weaker underlying case",
    heldText: "Held: hierarchy strength and vedha completeness are separate claims.",
    releasedText: "Warning: 'we can't check this' is an epistemic limit, not evidence the trigger is astrologically weaker.",
  },
};

interface TriggerConfig {
  key: TriggerKey;
  label: string;
  planet: string;
  sign: string;
  positionFromMoon: number;
  vedhaPoint: number | null;
  vedhaSign: string | null;
  natalOccupant: string | null;
  transitingOccupant: string | null;
  color: string;
  hierarchyNote: string;
}

const TRIGGERS: TriggerConfig[] = [
  {
    key: "saturn",
    label: "Saturn → Libra",
    planet: "Sa",
    sign: "Libra",
    positionFromMoon: 11,
    vedhaPoint: 5,
    vedhaSign: "Aries",
    natalOccupant: "Mars",
    transitingOccupant: null,
    color: PURPLE,
    hierarchyNote: "Second: touches natal Saturn / 7th lord twice",
  },
  {
    key: "jupiter",
    label: "Jupiter → Gemini",
    planet: "Ju",
    sign: "Gemini",
    positionFromMoon: 7,
    vedhaPoint: 3,
    vedhaSign: "Aquarius",
    natalOccupant: null,
    transitingOccupant: null,
    color: GREEN,
    hierarchyNote: "Supplies aspect-hits onto Moon and Saturn",
  },
  {
    key: "nodes",
    label: "Nodal-axis reversal",
    planet: "Ra/Ke",
    sign: "Sagittarius / Gemini",
    positionFromMoon: 1,
    vedhaPoint: null,
    vedhaSign: null,
    natalOccupant: null,
    transitingOccupant: null,
    color: VERMILION,
    hierarchyNote: "Highest: triple-touches natal Moon",
  },
];

function pointOnCircle(index: number, radius: number, cx: number, cy: number) {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function sectorPath(index: number, innerR: number, outerR: number, cx: number, cy: number) {
  const startAngle = (index * 30 - 105) * (Math.PI / 180);
  const endAngle = (index * 30 - 75) * (Math.PI / 180);
  const p1 = { x: cx + innerR * Math.cos(startAngle), y: cy + innerR * Math.sin(startAngle) };
  const p2 = { x: cx + outerR * Math.cos(startAngle), y: cy + outerR * Math.sin(startAngle) };
  const p3 = { x: cx + outerR * Math.cos(endAngle), y: cy + outerR * Math.sin(endAngle) };
  const p4 = { x: cx + innerR * Math.cos(endAngle), y: cy + innerR * Math.sin(endAngle) };
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 0 ${p1.x} ${p1.y} Z`;
}

export function KavyaVedhaCheckExplorer() {
  const [selected, setSelected] = useState<TriggerKey>("jupiter");
  const [saturnReading, setSaturnReading] = useState<SaturnReading>("transit-only");
  const [scenario, setScenario] = useState<ScenarioChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    unreachableAsClear: true, sameFormat: true, gapAsWeakness: true,
  });

  const trigger = TRIGGERS.find((t) => t.key === selected)!;
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setSelected("jupiter");
    setSaturnReading("transit-only");
    setScenario(null);
    setMistakes({ unreachableAsClear: true, sameFormat: true, gapAsWeakness: true });
  }

  return (
    <div data-interactive="kavya-vedha-check-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 3 worked check</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Kavya vedha check explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Run T1-11&apos;s vedha routine on all three Chapter 2 triggers. The three results are genuinely different: clear, contested, and unreachable.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Trigger selector</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {TRIGGERS.map((t) => {
            const active = selected === t.key;
            const status = statusFor(t, t.key === "saturn" ? saturnReading : null);
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(t.key)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${active ? t.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${t.color}14` : SURFACE,
                  color: active ? t.color : INK_PRIMARY,
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>{t.label}</div>
                <div style={{ color: active ? t.color : INK_SECONDARY, fontSize: "0.85rem", marginTop: "0.25rem" }}>{status.label}</div>
              </button>
            );
          })}
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Trigger detail</p>
          <h3 style={{ margin: "0.15rem 0 0", color: trigger.color, fontSize: "1.15rem", fontWeight: 600 }}>
            {trigger.label}
          </h3>

          {trigger.key === "nodes" ? (
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ color: VERMILION, fontWeight: 600, fontSize: "1.1rem" }}>Vedha status: unreachable</div>
              <p style={{ color: INK_SECONDARY, lineHeight: 1.55, margin: "0.45rem 0 0" }}>
                T1-11&apos;s vedha table covers only the seven grahas Sun through Saturn. Rāhu and Ketu have no row, so step 2 of the routine has nothing to look up.
              </p>
              <p style={{ color: INK_SECONDARY, lineHeight: 1.55, margin: "0.45rem 0 0" }}>
                This is not &ldquo;vedha-clear&rdquo; and not &ldquo;vedha-obstructed&rdquo; — it is a statement about the limits of what this curriculum&apos;s sourced content can determine.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gap: "0.35rem", marginTop: "0.55rem", color: INK_SECONDARY }}>
                <div>Position from Moon: <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{trigger.positionFromMoon}</span></div>
                <div>Favourable position: <span style={{ color: GREEN, fontWeight: 600 }}>yes</span></div>
                <div>Vedha-point: <span style={{ color: AMBER, fontWeight: 600 }}>{trigger.vedhaPoint} ({trigger.vedhaSign})</span></div>
                <div>Natal occupant: <span style={{ color: trigger.natalOccupant ? VERMILION : INK_MUTED, fontWeight: 600 }}>{trigger.natalOccupant ?? "none"}</span></div>
                <div>Transiting occupant: <span style={{ color: trigger.transitingOccupant ? VERMILION : INK_MUTED, fontWeight: 600 }}>{trigger.transitingOccupant ?? "none"}</span></div>
              </div>

              {trigger.key === "saturn" && (
                <div style={{ marginTop: "0.75rem" }}>
                  <p style={{ color: INK_SECONDARY, margin: "0 0 0.45rem" }}>Reading for the open natal-vs-transit question:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                    <button
                      type="button"
                      aria-pressed={saturnReading === "transit-only"}
                      onClick={() => setSaturnReading("transit-only")}
                      style={readingButtonStyle(saturnReading === "transit-only", GREEN)}
                    >
                      Transit-only
                    </button>
                    <button
                      type="button"
                      aria-pressed={saturnReading === "natal-inclusive"}
                      onClick={() => setSaturnReading("natal-inclusive")}
                      style={readingButtonStyle(saturnReading === "natal-inclusive", VERMILION)}
                    >
                      Natal-inclusive
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  marginTop: "0.85rem",
                  padding: "0.75rem",
                  borderRadius: 8,
                  background: statusFor(trigger, trigger.key === "saturn" ? saturnReading : null).obstructed ? `${VERMILION}12` : `${GREEN}12`,
                  border: `1px solid ${statusFor(trigger, trigger.key === "saturn" ? saturnReading : null).obstructed ? VERMILION : GREEN}55`,
                }}
              >
                <div style={{ color: statusFor(trigger, trigger.key === "saturn" ? saturnReading : null).obstructed ? VERMILION : GREEN, fontWeight: 600, fontSize: "1.1rem" }}>
                  {statusFor(trigger, trigger.key === "saturn" ? saturnReading : null).label}
                </div>
                <div style={{ color: INK_SECONDARY, marginTop: "0.35rem", lineHeight: 1.55 }}>
                  {statusFor(trigger, trigger.key === "saturn" ? saturnReading : null).note}
                </div>
              </div>

              <TriggerWheel trigger={trigger} reading={trigger.key === "saturn" ? saturnReading : null} />
            </>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Running synthesis" icon={<Lightbulb size={18} />} color={PURPLE}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Trigger</th>
                    <th style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Hierarchy</th>
                    <th style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Vedha status</th>
                  </tr>
                </thead>
                <tbody>
                  {TRIGGERS.map((t) => {
                    const status = statusFor(t, t.key === "saturn" ? saturnReading : null);
                    return (
                      <tr key={t.key}>
                        <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>{t.label}</td>
                        <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>{t.hierarchyNote}</td>
                        <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: status.color, fontWeight: 600 }}>{status.label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Key distinction" icon={<CheckCircle2 size={18} />} color={AMBER}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              The trigger with the highest hierarchy strength (nodal-axis-reversal) is the one least vedha-verifiable. Hierarchy strength and vedha completeness are separate claims.
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Epistemic check</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Does Trigger 3&apos;s unreachable vedha status weaken the overall window?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          A colleague concludes: &ldquo;Since the strongest hierarchy trigger can&apos;t even be vedha-checked, this whole window&apos;s case is now weaker than it looked in Chapter 2.&rdquo;
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "yes"}
            onClick={() => setScenario("yes")}
            style={scenarioButtonStyle(scenario === "yes", VERMILION)}
          >
            Yes — the window is weaker overall
          </button>
          <button
            type="button"
            aria-pressed={scenario === "no"}
            onClick={() => setScenario("no")}
            style={scenarioButtonStyle(scenario === "no", GREEN)}
          >
            No — hierarchy strength and vedha completeness differ
          </button>
        </div>
        {scenario && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: scenario === "no" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${scenario === "no" ? GREEN : VERMILION}55`,
              color: scenario === "no" ? GREEN : VERMILION,
            }}
          >
            {scenario === "no"
              ? "Correct. The hierarchy case (natal Moon triple-touched) still stands. What changed is the completeness of vedha verification, not the underlying chart configuration. These are separate claims."
              : "Incorrect. A gap in this curriculum's verification ability is not the same as a gap in the chart's actual configuration. Conflating them collapses two distinct claims into one."}
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
            ? "All discipline commitments are held. Clear, contested, and unreachable findings are reported as three distinct shapes."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function statusFor(trigger: TriggerConfig, saturnReading: SaturnReading | null) {
  if (trigger.key === "nodes") {
    return { label: "Unreachable", obstructed: false, color: VERMILION, note: "No classical table covers Rāhu/Ketu." };
  }
  if (trigger.key === "jupiter") {
    return { label: "Clear", obstructed: false, color: GREEN, note: "No occupant in Aquarius under either reading." };
  }
  if (saturnReading === "natal-inclusive") {
    return { label: "Obstructed", obstructed: true, color: VERMILION, note: "Natal Mars in Aries counts as occupying the vedha-point." };
  }
  return { label: "Stands", obstructed: false, color: GREEN, note: "No transiting planet in Aries; transit-only reading keeps the favourable result." };
}

function TriggerWheel({ trigger, reading }: { trigger: TriggerConfig; reading: SaturnReading | null }) {
  const cx = 180;
  const cy = 180;
  const outerR = 140;
  const innerR = 60;
  const planetPos = trigger.positionFromMoon - 1;
  const vedhaPos = trigger.vedhaPoint ? trigger.vedhaPoint - 1 : -1;

  return (
    <svg viewBox="0 0 360 360" role="img" aria-label={`Vedha wheel for ${trigger.label}`} style={{ width: "100%", maxHeight: 360, margin: "0.75rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={outerR + 6} fill="transparent" stroke={HAIRLINE} strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + outerR * Math.cos((i * 30 - 90) * (Math.PI / 180))}
          y2={cy + outerR * Math.sin((i * 30 - 90) * (Math.PI / 180))}
          stroke={HAIRLINE}
          strokeWidth="1"
        />
      ))}
      {vedhaPos >= 0 && (
        <path d={sectorPath(vedhaPos, innerR - 8, outerR + 4, cx, cy)} fill={`${AMBER}18`} stroke={AMBER} strokeWidth="2" />
      )}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = pointOnCircle(i, outerR + 22, cx, cy);
        const isVedha = i === vedhaPos;
        const isPlanet = i === planetPos;
        return (
          <g key={`label-${i}`}>
            <text x={pos.x} y={pos.y - 2} textAnchor="middle" fill={isPlanet ? trigger.color : isVedha ? AMBER : INK_SECONDARY} fontSize="9" fontWeight={600}>
              {SIGNS_FROM_MOON[i].slice(0, 3)}
            </text>
            <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>
              {i + 1}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={24} fill={`${MOON}18`} stroke={MOON} strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={MOON} fontSize="10" fontWeight={600}>Moon</text>
      {planetPos >= 0 && (
        <g transform={`translate(${pointOnCircle(planetPos, innerR - 28, cx, cy).x} ${pointOnCircle(planetPos, innerR - 28, cx, cy).y})`}>
          <circle r={16} fill={`${trigger.color}22`} stroke={trigger.color} strokeWidth="2" />
          <text y="3" textAnchor="middle" fill={trigger.color} fontSize="9" fontWeight={600}>{trigger.planet}</text>
        </g>
      )}
      {vedhaPos >= 0 && trigger.natalOccupant && (
        <g transform={`translate(${pointOnCircle(vedhaPos, innerR - 28, cx, cy).x} ${pointOnCircle(vedhaPos, innerR - 28, cx, cy).y})`}>
          <circle r={16} fill={`${VERMILION}22`} stroke={VERMILION} strokeWidth={2} />
          <text y="3" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>{trigger.natalOccupant.slice(0, 2)}</text>
        </g>
      )}
      {vedhaPos >= 0 && reading === "natal-inclusive" && trigger.natalOccupant && (
        <g transform={`translate(${pointOnCircle(vedhaPos, innerR - 58, cx, cy).x} ${pointOnCircle(vedhaPos, innerR - 58, cx, cy).y})`}>
          <circle r="14" fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="2" />
          <text y="4" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={600}>×</text>
        </g>
      )}
      {vedhaPos >= 0 && reading !== "natal-inclusive" && !trigger.natalOccupant && (
        <g transform={`translate(${pointOnCircle(vedhaPos, innerR - 58, cx, cy).x} ${pointOnCircle(vedhaPos, innerR - 58, cx, cy).y})`}>
          <circle r="14" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="2" />
          <text y="4" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={600}>✓</text>
        </g>
      )}
      <g transform="translate(10 330)">
        <LegendItem color={trigger.color} label={`${trigger.planet} (transit)`} x={0} />
        <LegendItem color={AMBER} label="vedha point" x={110} />
        {trigger.natalOccupant && <LegendItem color={VERMILION} label={trigger.natalOccupant} x={210} />}
      </g>
    </svg>
  );
}

function LegendItem({ color, label, x }: { color: string; label: string; x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="5" cy="-4" r="5" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
      <text x="14" y="-1" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>{label}</text>
    </g>
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

function readingButtonStyle(active: boolean, color: string): CSSProperties {
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
