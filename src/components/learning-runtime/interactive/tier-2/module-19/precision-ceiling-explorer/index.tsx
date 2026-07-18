"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type DataQuality = "routine" | "verified";
type PlanetKey = "saturn" | "jupiter";
type MistakeKey = "antardashaAsWindow" | "ingressFinal" | "universalConstant" | "classicalDoctrine";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const MOON = "#5A6B8A";

const PLANETS: Record<PlanetKey, { label: string; arcDeg: number; days: number; vulnerableFraction: number; color: string }> = {
  saturn: { label: "Saturn", arcDeg: 6.5, days: 140, vulnerableFraction: 6.5 / 30, color: PURPLE },
  jupiter: { label: "Jupiter", arcDeg: 10, days: 121, vulnerableFraction: 10 / 30, color: GREEN },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  antardashaAsWindow: {
    label: "Do not report the full antardaśā span as the honest window",
    heldText: "Held: the transit side can narrow a routine case to roughly 2-3 months without requiring better birth data.",
    releasedText: "Warning: stopping at the antardaśā span wastes real information and overstates the window.",
  },
  ingressFinal: {
    label: "Do not treat a fresh sign-ingress as automatically final",
    heldText: "Held: retrograde motion near a station can carry a slow planet back over the boundary before a settled re-entry.",
    releasedText: "Warning: using the first crossing as final ignores the 2-4 month settling uncertainty.",
  },
  universalConstant: {
    label: "Do not apply 2-3 months mechanically to every chart",
    heldText: "Held: this is a routine-case ceiling for slow-planet sign-ingresses; other triggers or data situations need re-checking.",
    releasedText: "Warning: treating the ceiling as a universal constant ignores the specific constraints that produced it.",
  },
  classicalDoctrine: {
    label: "Disclose the modern-synthesis status of this ceiling",
    heldText: "Held: the 2-3 month figure is this module's own synthesis, not a BPHS-stated classical doctrine.",
    releasedText: "Warning: dressing a modern argument in borrowed classical authority misrepresents its basis.",
  },
};

function ConstraintDiagram({ dataQuality, transitDays }: { dataQuality: DataQuality; transitDays: number }) {
  const dashaMin = dataQuality === "routine" ? 183 : 11;
  const dashaMax = dataQuality === "routine" ? 609 : 36;
  const dashaMid = (dashaMin + dashaMax) / 2;
  const maxDays = Math.max(dashaMax, transitDays * 2);

  const transitBarWidth = (transitDays / maxDays) * 100;
  const dashaBarWidth = (dashaMid / maxDays) * 100;
  const transitBinds = transitDays <= dashaMid;

  return (
    <svg width="100%" height="160" viewBox="0 0 400 160" style={{ maxWidth: 480 }}>
      <text x="20" y="25" fontSize="11" fill={INK_MUTED} fontWeight={700}>Daśā-side ceiling</text>
      <rect x="20" y="35" width={(dashaBarWidth * 3.6)} height="22" rx="6" fill={dataQuality === "routine" ? GOLD : GREEN} />
      <text x="28" y="51" fontSize="10" fill="#fff" fontWeight={600}>
        {dataQuality === "routine" ? "antardaśā ~183-609 d" : "pratyantardaśā ~11-36 d"}
      </text>

      <text x="20" y="95" fontSize="11" fill={INK_MUTED} fontWeight={700}>Transit-side settling</text>
      <rect x="20" y="105" width={(transitBarWidth * 3.6)} height="22" rx="6" fill={MOON} />
      <text x="28" y="121" fontSize="10" fill="#fff" fontWeight={600}>
        ~{transitDays} d (2-4 months)
      </text>

      <g transform={`translate(${20 + (transitBinds ? transitBarWidth * 3.6 : dashaBarWidth * 3.6) + 10}, ${transitBinds ? 116 : 46})`}>
        <rect x="0" y="-14" width="86" height="28" rx="6" fill={transitBinds ? MOON : dataQuality === "routine" ? GOLD : GREEN} />
        <text x="43" y="4" fontSize="10" fill="#fff" fontWeight={600} textAnchor="middle">{transitBinds ? "binding" : "binding"}</text>
      </g>

      <text x="20" y="150" fontSize="10" fill={INK_MUTED}>
        {transitBinds
          ? "Transit side is tighter, so it sets the honest ceiling."
          : "Daśā side is tighter; still verify transit-side settling for the specific trigger."}
      </text>
    </svg>
  );
}

function RetrogradeSvg({ planet }: { planet: PlanetKey }) {
  const p = PLANETS[planet];
  const color = p.color;
  const boundaryX = 200;

  return (
    <svg width="100%" height="100%" viewBox="0 0 400 240" style={{ maxWidth: 440 }}>
      {/* sign zones */}
      <rect x="0" y="0" width={boundaryX} height={240} fill={`${VERMILION}08`} />
      <rect x={boundaryX} y="0" width={200} height={240} fill={`${GREEN}08`} />
      <line x1={boundaryX} y1="20" x2={boundaryX} y2="220" stroke={HAIRLINE} strokeWidth={2} strokeDasharray="6 4" />

      {/* vulnerable zone */}
      <rect x={boundaryX} y="20" width={p.vulnerableFraction * 160} height={200} fill={`${color}18`} stroke={color} strokeWidth={1} />
      <text x={boundaryX + 6} y="40" fontSize="10" fill={color} fontWeight={600}>Vulnerable zone</text>
      <text x={boundaryX + 6} y="54" fontSize="9" fill={INK_MUTED}>~{Math.round(p.vulnerableFraction * 100)}% of sign</text>

      {/* planet path */}
      <path
        d={`M 60 190 C 120 190, 160 150, ${boundaryX} 140 C 240 130, 250 90, 230 80 C 210 70, 180 100, ${boundaryX - 10} 110 C 160 120, 170 160, 210 170 C 250 180, 300 170, 340 150`}
        fill="none"
        stroke={color}
        strokeWidth={3}
      />

      {/* markers */}
      <circle cx={boundaryX} cy="140" r="5" fill={color} />
      <text x={boundaryX - 8} y="132" fontSize="9" fill={INK_PRIMARY} fontWeight={600} textAnchor="end">1st crossing</text>

      <circle cx="230" cy="80" r="5" fill={VERMILION} />
      <text x="240" y="76" fontSize="9" fill={VERMILION} fontWeight={600}>Station retrograde</text>

      <circle cx={boundaryX - 10} cy="110" r="5" fill={VERMILION} />
      <text x={boundaryX - 20} y="130" fontSize="9" fill={VERMILION} fontWeight={600} textAnchor="end">Back over boundary</text>

      <circle cx="210" cy="170" r="5" fill={GREEN} />
      <text x="220" y="188" fontSize="9" fill={GREEN} fontWeight={600}>Station direct</text>

      <circle cx="340" cy="150" r="5" fill={GREEN} />
      <text x="350" y="146" fontSize="9" fill={GREEN} fontWeight={600}>Settled re-entry</text>

      <text x="20" y="230" fontSize="9" fill={INK_MUTED}>Previous sign</text>
      <text x="300" y="230" fontSize="9" fill={INK_MUTED}>Target sign</text>
    </svg>
  );
}

export function PrecisionCeilingExplorer() {
  const [dataQuality, setDataQuality] = useState<DataQuality>("routine");
  const [planet, setPlanet] = useState<PlanetKey>("saturn");
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    antardashaAsWindow: true,
    ingressFinal: true,
    universalConstant: true,
    classicalDoctrine: true,
  });

  const p = PLANETS[planet];
  const transitDays = 75; // illustrative central 2.5 months
  const dashaMin = dataQuality === "routine" ? 183 : 11;
  const dashaMax = dataQuality === "routine" ? 609 : 36;
  const dashaMid = (dashaMin + dashaMax) / 2;
  const transitBinds = transitDays <= dashaMid;

  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setDataQuality("routine");
    setPlanet("saturn");
    setMistakes({ antardashaAsWindow: true, ingressFinal: true, universalConstant: true, classicalDoctrine: true });
  }

  return (
    <div data-interactive="precision-ceiling-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 5</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Precision ceiling explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              See how the daśā-side precision rule and the transit-side retrograde-settling uncertainty combine to set a routine precision ceiling of roughly 2-3 months.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Which constraint binds?</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Daśā-side ceiling vs transit-side settling
          </h3>
          <div style={{ marginTop: "0.55rem" }}>
            <label style={{ color: INK_SECONDARY, fontSize: "0.9rem" }}>Birth data quality</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.35rem" }}>
              <button type="button" aria-pressed={dataQuality === "routine"} onClick={() => setDataQuality("routine")} style={buttonStyle(dataQuality === "routine", GOLD)}>
                Routine (undocumented)
              </button>
              <button type="button" aria-pressed={dataQuality === "verified"} onClick={() => setDataQuality("verified")} style={buttonStyle(dataQuality === "verified", GREEN)}>
                Verified / rectified
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <ConstraintDiagram dataQuality={dataQuality} transitDays={transitDays} />
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: transitBinds ? `${MOON}12` : `${GREEN}12`,
              border: `1px solid ${transitBinds ? MOON : GREEN}55`,
              color: INK_PRIMARY,
              lineHeight: 1.55,
            }}
          >
            <span style={{ color: transitBinds ? MOON : GREEN, fontWeight: 600 }}>
              {transitBinds ? "Transit side binds" : "Daśā side can bind"}
            </span>
            {" "}
            {transitBinds
              ? "For routine data, the ~2-3 month settling window is narrower than the antardaśā span, so it becomes the honest precision ceiling without needing better birth data."
              : "With verified data, the daśā side may narrow below the transit-side window. Still verify the actual trigger's retrograde-settling status, because the transit-side constraint is independent of birth-data quality."}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Retrograde re-entry</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Why a fresh ingress may not be final
          </h3>
          <div style={{ marginTop: "0.55rem" }}>
            <label style={{ color: INK_SECONDARY, fontSize: "0.9rem" }}>Planet</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.35rem" }}>
              <button type="button" aria-pressed={planet === "saturn"} onClick={() => setPlanet("saturn")} style={buttonStyle(planet === "saturn", PURPLE)}>
                Saturn
              </button>
              <button type="button" aria-pressed={planet === "jupiter"} onClick={() => setPlanet("jupiter")} style={buttonStyle(planet === "jupiter", GREEN)}>
                Jupiter
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <RetrogradeSvg planet={planet} />
          </div>
          <div style={{ marginTop: "0.55rem", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
            {p.label} retrograde arc: ~{p.arcDeg}° over ~{p.days} days. Vulnerable zone near sign start: ~{Math.round(p.vulnerableFraction * 100)}% of the sign.
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Apply to Kavya&apos;s window</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          From Chapter 4 convergence to a 2-3 month ceiling
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}44`, background: `${PURPLE}08` }}>
            <div style={{ color: PURPLE, fontWeight: 600 }}>Trigger 1: Saturn → Libra</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", marginTop: "0.35rem" }}>
              Fresh ingress can reverse; wait for station-direct re-entry or ~2-3 months of settled motion.
            </div>
          </div>
          <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}44`, background: `${GREEN}08` }}>
            <div style={{ color: GREEN, fontWeight: 600 }}>Trigger 2: Jupiter → Gemini</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", marginTop: "0.35rem" }}>
              Same settling constraint. The honest window is anchored on the later of the two triggers to stabilise.
            </div>
          </div>
          <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${MOON}44`, background: `${MOON}08` }}>
            <div style={{ color: MOON, fontWeight: 600 }}>Honest report</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", marginTop: "0.35rem" }}>
              A 2-to-3-month window around the later settling point, within the Moon MD / Jupiter AD.
            </div>
          </div>
        </div>
        <p style={{ margin: "0.65rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
          <Info size={13} style={{ display: "inline", marginRight: "0.25rem" }} aria-hidden="true" />
          This is not a date, not the full antardaśā, and not a guarantee. It is a narrowed, defensible season.
        </p>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Modern synthesis disclosure</p>
          <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
            Not classical doctrine
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            The 2-3 month ceiling is this module&apos;s own synthesis, built from two real inputs: T2-18 18.1.4&apos;s data-quality rule and general orbital mechanics. It is disclosed plainly, not dressed in borrowed classical authority.
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Hold the discipline</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.55rem" }}>
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
                  {held ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
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
              marginTop: "0.65rem",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              background: allMistakesHeld ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}55`,
              color: allMistakesHeld ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {allMistakesHeld
              ? "All discipline commitments are held. The ceiling is applied honestly and disclosed accurately."
              : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
          </div>
        </section>
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
    padding: "0.65rem",
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
