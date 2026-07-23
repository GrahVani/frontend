"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Eye,
  Info,
  MapPinned,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const AMBER = "#D97706";

const RASHI_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const PLANET_COLORS: Record<string, string> = {
  Sun: VERMILION,
  Moon: BLUE,
  Mars: VERMILION,
  Mercury: GREEN,
  Jupiter: GOLD,
  Venus: GREEN,
  Saturn: PURPLE,
};

const ORBS: Record<string, number> = {
  Sun: 15,
  Moon: 12,
  Mars: 8,
  Mercury: 7,
  Jupiter: 9,
  Venus: 7,
  Saturn: 9,
};

interface Candidate {
  office: string;
  planet: string;
  longitude: number;
  basis: string;
}

const KAVYA_CANDIDATES: Candidate[] = [
  { office: "Janma-Lagneśa", planet: "Moon", longitude: 200, basis: "Lord of natal Cancer Lagna" },
  { office: "Varṣa-Lagneśa", planet: "Saturn", longitude: 302, basis: "Lord of varṣa Capricorn Lagna" },
  { office: "Munthā-pati", planet: "Jupiter", longitude: 350, basis: "Lord of Sagittarius munthā-sign" },
  { office: "Tri-Rāśi-pati", planet: "Venus", longitude: 95, basis: "Earth-triplicity day-ruler" },
  { office: "Dina-Rātri-pati", planet: "Sun", longitude: 110, basis: "Day-birth luminary" },
];

const VARSHA_LAGNA_LONGITUDE = 280; // 10° Capricorn
const ASPECT_ANGLES = [0, 60, 90, 120, 180];

function normalizeDeg(deg: number): number {
  let v = deg % 360;
  if (v < 0) v += 360;
  return v;
}

function signIndex(deg: number): number {
  return Math.floor(normalizeDeg(deg) / 30) % 12;
}

function formatDms(deg: number): string {
  const normalized = normalizeDeg(deg);
  const inSign = normalized % 30;
  const d = Math.floor(inSign);
  const m = Math.floor((inSign - d) * 60);
  const s = Math.round(((inSign - d) * 60 - m) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}′ ${s.toString().padStart(2, "0")}″`;
}

function smallestSeparation(a: number, b: number): number {
  const diff = Math.abs(normalizeDeg(a) - normalizeDeg(b));
  return diff > 180 ? 360 - diff : diff;
}

function nearestAspect(separation: number): { angle: number; diff: number } {
  let best = ASPECT_ANGLES[0];
  let bestDiff = Math.abs(separation - best);
  for (const angle of ASPECT_ANGLES) {
    const diff = Math.abs(separation - angle);
    if (diff < bestDiff) {
      best = angle;
      bestDiff = diff;
    }
  }
  return { angle: best, diff: bestDiff };
}

function evaluateCandidate(candidate: Candidate, lagnaLongitude: number) {
  const separation = smallestSeparation(candidate.longitude, lagnaLongitude);
  const { angle, diff } = nearestAspect(separation);
  const orb = ORBS[candidate.planet] ?? 7;
  const qualifies = diff <= orb;
  const margin = diff - orb;
  return { separation, nearestAspect: angle, diff, orb, qualifies, margin };
}

export function VarsheshaIdentificationWorkbench() {
  const [candidates, setCandidates] = useState<Candidate[]>(KAVYA_CANDIDATES);
  const [jupiterOffset, setJupiterOffset] = useState<number>(0);
  const [showOrbArcs, setShowOrbArcs] = useState<boolean>(true);
  const [showOnlyQualifiers, setShowOnlyQualifiers] = useState<boolean>(false);
  const [showYearCharacter, setShowYearCharacter] = useState<boolean>(true);

  const currentCandidates = useMemo(() => {
    return candidates.map((c) =>
      c.planet === "Jupiter" ? { ...c, longitude: normalizeDeg(c.longitude + jupiterOffset) } : c
    );
  }, [candidates, jupiterOffset]);

  const evaluated = useMemo(
    () => currentCandidates.map((c) => ({ ...c, ...evaluateCandidate(c, VARSHA_LAGNA_LONGITUDE) })),
    [currentCandidates]
  );

  const qualifiers = evaluated.filter((e) => e.qualifies);
  const stipulatedVarshesha = "Venus";
  const munthaHouse = 6;
  const nearMiss = evaluated.find((e) => e.planet === "Jupiter");
  const jupiterMissBy = nearMiss ? Math.abs(nearMiss.margin) : 0;

  const handleReset = () => {
    setCandidates(KAVYA_CANDIDATES);
    setJupiterOffset(0);
    setShowOrbArcs(true);
    setShowOnlyQualifiers(false);
    setShowYearCharacter(true);
  };

  return (
    <div data-interactive="varshesha-identification-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Varṣeśa identification</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Run the five-office system to the degree
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Identify the five Pañcādhikāri office-holders, check each against the varṣa-Lagna with exact degree arithmetic,
              and spot near-misses before any scoring stage.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Dial + controls */}
      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <div>
              <p style={eyebrowStyle}>Aspect-qualification dial</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem", fontWeight: 600 }}>
                Varṣa-Lagna at {formatDms(VARSHA_LAGNA_LONGITUDE)} {RASHI_NAMES[signIndex(VARSHA_LAGNA_LONGITUDE)]}
              </h3>
            </div>
            <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600 }}>
              {qualifiers.length} qualifier{qualifiers.length !== 1 ? "s" : ""}
            </span>
          </div>
          <AspectDial evaluated={evaluated} showOrbArcs={showOrbArcs} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
            <MiniFact icon={<MapPinned size={16} />} title="Varṣa-Lagna" body={`${formatDms(VARSHA_LAGNA_LONGITUDE)} Capricorn`} color={BLUE} />
            <MiniFact icon={<CheckCircle2 size={16} />} title="Qualifiers" body={qualifiers.map((q) => q.planet).join(", ") || "None"} color={GREEN} />
            <MiniFact icon={<AlertTriangle size={16} />} title="Near-miss" body={nearMiss && !nearMiss.qualifies ? `Jupiter by ${jupiterMissBy.toFixed(1)}°` : "None"} color={AMBER} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="View options" icon={<Eye size={18} />} color={BLUE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={showOrbArcs} onClick={() => setShowOrbArcs((v) => !v)} style={smallChipStyle(showOrbArcs, BLUE)}>
                Orb arcs
              </button>
              <button type="button" aria-pressed={showOnlyQualifiers} onClick={() => setShowOnlyQualifiers((v) => !v)} style={smallChipStyle(showOnlyQualifiers, GREEN)}>
                Qualifiers only
              </button>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              Toggle orb arcs to see each candidate&apos;s allowable range around the nearest classical aspect angle.
            </p>
          </Panel>

          <Panel title="Five offices" icon={<ShieldCheck size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {currentCandidates.map((c) => (
                <div key={c.planet} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0.55rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6 }}>
                  <span style={{ fontWeight: 600, color: INK_PRIMARY, fontSize: "0.85rem" }}>{c.planet}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{c.office}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      {/* Candidate table */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Aspect-qualification table</p>
        <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: 640 }}>
            <thead>
              <tr style={{ color: INK_MUTED, textAlign: "left", borderBottom: `1px solid ${HAIRLINE}` }}>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Office</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Planet</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Longitude</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Separation</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Aspect</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Diff</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Orb</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {evaluated
                .filter((e) => !showOnlyQualifiers || e.qualifies)
                .map((e) => (
                  <tr
                    key={e.planet}
                    style={{
                      background: e.qualifies ? "rgba(47, 125, 85, 0.05)" : e.planet === "Jupiter" ? "rgba(217, 119, 6, 0.05)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "0.5rem", color: INK_PRIMARY }}>{e.office}</td>
                    <td style={{ padding: "0.5rem", color: PLANET_COLORS[e.planet] ?? INK_PRIMARY, fontWeight: 600 }}>{e.planet}</td>
                    <td style={{ padding: "0.5rem", color: INK_SECONDARY, fontFamily: "monospace" }}>
                      {formatDms(e.longitude)} {RASHI_NAMES[signIndex(e.longitude)]}
                    </td>
                    <td style={{ padding: "0.5rem", color: INK_SECONDARY, fontFamily: "monospace" }}>{e.separation.toFixed(1)}°</td>
                    <td style={{ padding: "0.5rem", color: INK_SECONDARY }}>{e.nearestAspect}°</td>
                    <td style={{ padding: "0.5rem", color: INK_SECONDARY, fontFamily: "monospace" }}>{e.diff.toFixed(1)}°</td>
                    <td style={{ padding: "0.5rem", color: INK_SECONDARY, fontFamily: "monospace" }}>{e.orb.toFixed(1)}°</td>
                    <td style={{ padding: "0.5rem" }}>
                      {e.qualifies ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: GREEN, fontWeight: 600, fontSize: "0.78rem" }}>
                          <CheckCircle2 size={13} />
                          Qualifies
                        </span>
                      ) : e.planet === "Jupiter" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: AMBER, fontWeight: 600, fontSize: "0.78rem" }}>
                          <AlertTriangle size={13} />
                          Near-miss
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: INK_MUTED, fontSize: "0.78rem" }}>
                          <XCircle size={13} />
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Near-miss sensitivity */}
      <section style={{ ...cardStyle, borderColor: `${AMBER}66`, background: `${AMBER}08` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
          <AlertTriangle size={18} color={AMBER} />
          <p style={{ ...eyebrowStyle, margin: 0, color: AMBER }}>Near-miss sensitivity</p>
        </div>
        <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          Nudge Jupiter&apos;s longitude and watch its qualification status flip at the 9° orb boundary.
          At its actual position, Jupiter misses by exactly 1° — about the same size as the varṣa-Lagna shift from a few minutes of timing error.
        </p>
        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Jupiter offset from real position</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <input
              type="range"
              min={-15}
              max={15}
              step={0.5}
              value={jupiterOffset}
              onChange={(e) => setJupiterOffset(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: AMBER }}
            />
            <span style={{ fontWeight: 600, color: AMBER, minWidth: "4rem", textAlign: "right" }}>
              {jupiterOffset >= 0 ? "+" : ""}
              {jupiterOffset.toFixed(1)}°
            </span>
          </div>
        </label>
        {nearMiss && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.65rem 0.8rem",
              borderRadius: 6,
              border: `1px solid ${nearMiss.qualifies ? GREEN : AMBER}`,
              background: nearMiss.qualifies ? "rgba(47, 125, 85, 0.08)" : "rgba(217, 119, 6, 0.08)",
              color: nearMiss.qualifies ? GREEN : AMBER,
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            {nearMiss.qualifies
              ? `Jupiter now qualifies (separation ${nearMiss.separation.toFixed(1)}°, within ${nearMiss.orb.toFixed(1)}° orb).`
              : `Jupiter misses by ${Math.abs(nearMiss.margin).toFixed(1)}° of orb.`}
          </div>
        )}
      </section>

      {/* Point-value gap notice */}
      <section style={{ ...cardStyle, borderColor: `${PURPLE}66`, background: `${PURPLE}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
          <Info size={20} color={PURPLE} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
          <div>
            <p style={{ margin: 0, color: PURPLE, fontWeight: 600 }}>Honest gap: Pañcavargīya-bala point-values</p>
            <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              Two candidates qualify — Sun and Venus. The higher Pañcavargīya-bala score should win.
              T1-19 names the five factors (kṣetra, uccha, hadda, drekkāṇa, navāṁśa) but explicitly does not publish
              authoritative point-values, directing practitioners to the primary canonical text.
              This module does not independently have that table, so the final tie-break is{" "}
              <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>stipulated, not computed</strong>.
            </p>
            <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>Stipulated Varṣeśa:</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.35rem 0.7rem",
                  borderRadius: 999,
                  border: `1px solid ${GREEN}`,
                  background: `${GREEN}12`,
                  color: GREEN,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <Award size={14} />
                {stipulatedVarshesha}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Year character integration */}
      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
          <Sparkles size={18} color={GOLD} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Year-character integration</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <button type="button" aria-pressed={showYearCharacter} onClick={() => setShowYearCharacter((v) => !v)} style={smallChipStyle(showYearCharacter, GOLD)}>
            Show integrated reading
          </button>
        </div>
        {showYearCharacter && (
          <div style={workbenchTwoColumnStyle}>
            <MiniFact icon={<Award size={16} />} title="Varṣeśa tone" body="Venus carries harmony, partnership, and aesthetic-relational themes." color={GREEN} />
            <MiniFact icon={<MapPinned size={16} />} title="Munthā domain" body={`House ${munthaHouse} — service, health-awareness, competition, daily discipline.`} color={GOLD} />
            <div style={{ gridColumn: "1 / -1", padding: "0.75rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: "rgba(156, 122, 47, 0.04)" }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Integrated reading:</strong> a year whose foreground domain is the 6th-house territory,
                carried with a Venus tone of harmony, negotiation, and relational care. The natal reinforcement (Moon + Ketu in Sagittarius) and
                well-dignified munthā-lord (Jupiter in own sign) from Lessons 17.2.1–17.2.2 converge as supporting context — not as a guarantee,
                but as a quality-framing for the year&apos;s primary domain.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ─────────────── Aspect Dial SVG ─────────────── */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function AspectDial({ evaluated, showOrbArcs }: { evaluated: Array<ReturnType<typeof evaluateCandidate> & Candidate>; showOrbArcs: boolean }) {
  const cx = 200;
  const cy = 200;
  const outerR = 140;
  const innerR = 58;

  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Aspect qualification dial around the varsha lagna" style={{ width: "100%", maxHeight: 380, display: "block" }}>
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={innerR} fill={`${GOLD}0A`} stroke={HAIRLINE} strokeWidth="1.2" />

      {/* Aspect angle spokes */}
      {[0, 60, 90, 120, 180, 240, 270, 300].map((angle) => {
        const pos = polarToCartesian(cx, cy, outerR, angle);
        return (
          <line
            key={angle}
            x1={cx}
            y1={cy}
            x2={pos.x}
            y2={pos.y}
            stroke={HAIRLINE}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Orb arcs per candidate */}
      {showOrbArcs &&
        evaluated.map((e) => {
          const targetAspect = e.nearestAspect;
          const radius = innerR + (outerR - innerR) * 0.5;
          const arcPath = describeArc(cx, cy, radius, targetAspect - e.orb, targetAspect + e.orb);
          const color = e.qualifies ? GREEN : e.planet === "Jupiter" ? AMBER : INK_MUTED;
          return (
            <path
              key={`orb-${e.planet}`}
              d={arcPath}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              opacity={0.35}
            />
          );
        })}

      {/* Candidate dots */}
      {evaluated.map((e, index) => {
        const radius = innerR + ((outerR - innerR) * (0.35 + (index % 3) * 0.25));
        const pos = polarToCartesian(cx, cy, radius, e.separation);
        const color = e.qualifies ? GREEN : e.planet === "Jupiter" ? AMBER : INK_MUTED;
        return (
          <g key={e.planet}>
            <circle cx={pos.x} cy={pos.y} r={8} fill={color} stroke="#fff" strokeWidth="2" />
            <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill="#fff" fontSize="8" fontWeight={600}>
              {e.planet.slice(0, 2)}
            </text>
          </g>
        );
      })}

      {/* Lagna center */}
      <circle cx={cx} cy={cy} r={14} fill={BLUE} stroke="#fff" strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize="8" fontWeight={600}>
        VL
      </text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>
        Varṣa-Lagna
      </text>

      {/* Legend */}
      <g transform="translate(16, 330)">
        <circle cx="6" cy="6" r={6} fill={GREEN} />
        <text x="18" y="9" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>Qualifies</text>
        <circle cx="84" cy="6" r={6} fill={AMBER} />
        <text x="96" y="9" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>Near-miss</text>
        <circle cx="168" cy="6" r={6} fill={INK_MUTED} />
        <text x="180" y="9" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>No aspect</text>
      </g>
    </svg>
  );
}

/* ─────────────── Shared helpers ─────────────── */

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
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
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 999,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.4rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.82rem",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: "0.3rem",
};

const fieldLabelStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
