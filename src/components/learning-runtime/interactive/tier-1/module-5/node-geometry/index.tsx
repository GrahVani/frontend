"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Eclipse, Moon, Orbit, RotateCcw, Shuffle, Sun } from "lucide-react";

type Phase = "new" | "full" | "quarter";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const RAHU = "#6B5AA8";
const KETU = "#8A6A2A";
const SUN = "#D99622";
const MOON = "#6D7FA8";
const GREEN = "#2F7D55";

function orbitPoint(angle: number, tilt: number) {
  const rad = (angle * Math.PI) / 180;
  const x = 220 + 156 * Math.cos(rad);
  const y = 220 + 72 * Math.sin(rad) + Math.sin(rad) * tilt * 2.2;
  return { x, y };
}

// Rotate a point about the diagram centre (the ecliptic pole). Used to precess
// the whole node-frame so the line of nodes can be shown regressing over time.
function rotateAround(point: { x: number; y: number }, deg: number) {
  const r = (deg * Math.PI) / 180;
  const dx = point.x - 220;
  const dy = point.y - 220;
  return {
    x: 220 + dx * Math.cos(r) - dy * Math.sin(r),
    y: 220 + dx * Math.sin(r) + dy * Math.cos(r),
  };
}

function angularDistance(a: number, b: number) {
  const diff = Math.abs((((a - b) % 360) + 540) % 360 - 180);
  return diff;
}

export function NodeGeometry() {
  const [moonLongitude, setMoonLongitude] = useState(0);
  const [tilt, setTilt] = useState(5);
  const [phase, setPhase] = useState<Phase>("new");
  const [months, setMonths] = useState(0);
  // Mean node regresses ~19.35 deg/year (a full loop of the zodiac ~18.6 years).
  const NODE_REGRESSION_PER_MONTH = 19.35 / 12;
  const regressedDeg = months * NODE_REGRESSION_PER_MONTH;
  const nodeRot = -regressedDeg; // negative = westward = retrograde
  const rahu = rotateAround(orbitPoint(0, tilt), nodeRot);
  const ketu = rotateAround(orbitPoint(180, tilt), nodeRot);
  const moon = rotateAround(orbitPoint(moonLongitude, tilt), nodeRot);
  // Node positions live at orbit-frame 0/180 and the Moon at moonLongitude in the
  // same frame, so proximity is rotation-invariant: regression never breaks eclipse logic.
  const nearNode = Math.min(angularDistance(moonLongitude, 0), angularDistance(moonLongitude, 180));
  const eclipseReady = nearNode <= 10 && phase !== "quarter";
  const eclipseType = phase === "new" ? "Solar eclipse condition" : phase === "full" ? "Lunar eclipse condition" : "No eclipse";

  const diagnosis = useMemo(() => {
    if (eclipseReady) return `${eclipseType}: the ${phase === "new" ? "new moon" : "full moon"} is close enough to the nodal axis.`;
    if (phase === "quarter") return "No eclipse: the Moon is not aligned with the Sun, even if it nears a node.";
    return "No eclipse: a new/full moon needs to land near Rahu or Ketu.";
  }, [eclipseReady, eclipseType, phase]);

  return (
    <div data-interactive="node-geometry" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Node geometry
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: RAHU, fontSize: "1.35rem" }}>
              Rahu and Ketu are points, not planets
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setMoonLongitude(0);
              setTilt(5);
              setPhase("new");
              setMonths(0);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Ecliptic and lunar node geometry">
          <svg viewBox="0 0 440 440" role="img" aria-label="The ecliptic and the Moon's tilted orbit crossing at Rahu and Ketu" style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x="18" y="18" width="404" height="404" rx="18" fill="rgba(255, 251, 241, 0.62)" stroke={HAIRLINE} />
            <ellipse cx="220" cy="220" rx="168" ry="78" fill="none" stroke={SUN} strokeWidth="3" />
            <text x="220" y="127" textAnchor="middle" fill={SUN} fontSize="13" fontWeight="900">Ecliptic: Sun&apos;s path</text>
            <g transform={`rotate(${tilt * 1.55 + nodeRot} 220 220)`}>
              <ellipse cx="220" cy="220" rx="156" ry="72" fill="none" stroke={MOON} strokeWidth="3" strokeDasharray="8 6" />
            </g>
            <line x1={rahu.x} y1={rahu.y} x2={ketu.x} y2={ketu.y} stroke="rgba(75,58,35,0.35)" strokeWidth="3" strokeDasharray="7 5" />
            <circle cx="220" cy="220" r="31" fill="rgba(217,150,34,0.16)" stroke={SUN} strokeWidth="2" />
            <Sun x={207} y={207} size={26} color={SUN} aria-hidden="true" />
            <circle cx={rahu.x} cy={rahu.y} r="20" fill={RAHU} filter="url(#nodeGlow)" />
            <text x={rahu.x} y={rahu.y + 5} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">Ra</text>
            <text x={rahu.x} y={rahu.y + 36} textAnchor="middle" fill={RAHU} fontSize="12" fontWeight="900">Rahu</text>
            <circle cx={ketu.x} cy={ketu.y} r="20" fill={KETU} filter="url(#nodeGlow)" />
            <text x={ketu.x} y={ketu.y + 5} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">Ke</text>
            <text x={ketu.x} y={ketu.y - 28} textAnchor="middle" fill={KETU} fontSize="12" fontWeight="900">Ketu</text>
            <circle cx={moon.x} cy={moon.y} r="18" fill={eclipseReady ? "#111827" : MOON} stroke={eclipseReady ? SUN : "#fff"} strokeWidth="3" />
            <Moon x={moon.x - 10} y={moon.y - 10} size={20} color="#fff" aria-hidden="true" />
            {eclipseReady ? <circle cx={moon.x} cy={moon.y} r="28" fill="none" stroke={SUN} strokeWidth="3" strokeDasharray="4 3" /> : null}
          </svg>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Node geometry controls">
          <Panel title="1. Tilt the Moon orbit" icon={<Orbit size={18} aria-hidden="true" />} color={MOON}>
            <input type="range" min={0} max={10} step={1} value={tilt} onChange={(event) => setTilt(Number(event.target.value))} aria-label="Moon orbit tilt" style={{ width: "100%", accentColor: MOON }} />
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY }}>Tilt shown: {tilt.toFixed(1)} degrees. The lesson baseline is about 5.1 degrees.</p>
          </Panel>

          <Panel title="2. Move the Moon" icon={<Moon size={18} aria-hidden="true" />} color={RAHU}>
            <input type="range" min={0} max={359} step={1} value={moonLongitude} onChange={(event) => setMoonLongitude(Number(event.target.value))} aria-label="Moon longitude on its orbit" style={{ width: "100%", accentColor: RAHU }} />
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY }}>Moon position: {moonLongitude} degrees. Nearest node gap: {nearNode.toFixed(0)} degrees.</p>
          </Panel>

          <Panel title="3. Choose lunar phase" icon={<Shuffle size={18} aria-hidden="true" />} color={KETU}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(["new", "full", "quarter"] as Phase[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={phase === item}
                  onClick={() => setPhase(item)}
                  style={{ border: `1px solid ${phase === item ? KETU : HAIRLINE}`, borderRadius: 8, background: phase === item ? KETU : "transparent", color: phase === item ? "#fff" : INK_SECONDARY, padding: "0.6rem 0.5rem", fontWeight: 850, cursor: "pointer", textTransform: "capitalize" }}
                >
                  {item}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="4. Step time forward (node regression)" icon={<Orbit size={18} aria-hidden="true" />} color={GREEN}>
            <input type="range" min={0} max={223} step={1} value={months} onChange={(event) => setMonths(Number(event.target.value))} aria-label="Months elapsed (node regression)" style={{ width: "100%", accentColor: GREEN }} />
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY }}>
              Time elapsed: {(months / 12).toFixed(1)} years. The node axis has regressed {regressedDeg.toFixed(0)} degrees westward (about 19.35 degrees per year) &mdash; one full loop takes ~18.6 years. Retrograde is the baseline, not a special state.
            </p>
          </Panel>

          <section style={{ border: `1px solid ${eclipseReady ? GREEN : HAIRLINE}`, borderRadius: 8, background: eclipseReady ? "rgba(47, 125, 85, 0.12)" : SURFACE, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: eclipseReady ? GREEN : INK_MUTED, fontWeight: 900 }}>
              <Eclipse size={19} aria-hidden="true" />
              {eclipseReady ? eclipseType : "No eclipse condition"}
            </div>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{diagnosis}</p>
          </section>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.8rem" }} aria-label="Node facts">
        <Fact title="Two points" body="The nodes are where the Moon's tilted orbit crosses the ecliptic. No physical body sits there." color={RAHU} />
        <Fact title="One axis" body="Rahu and Ketu are the two ends of one line, so they stay exactly 180 degrees apart." color={KETU} />
        <Fact title="Always retrograde" body="By mean-node convention the node line regresses ~19.35 deg/year. Step time forward to watch the whole axis drift westward; retrograde is the baseline, not a special state." color={MOON} />
      </section>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Fact({ title, body, color }: { title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: "rgba(255,251,241,0.78)", padding: "0.9rem" }}>
      <strong style={{ color }}>{title}</strong>
      <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
