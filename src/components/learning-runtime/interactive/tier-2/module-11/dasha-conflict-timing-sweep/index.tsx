"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const GREEN = "#2F7D55";
const NEUTRAL = "#6B5330";
const NEUTRAL_SOFT = "#FFF7E8";

type Tier = "triple" | "two" | "doctrine" | "none";

type Bhukti = {
  md: string;
  lord: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  tier: Tier;
  indicators: string[];
  note: string;
};

const BHUKTI_DATA: Bhukti[] = [
  { md: "Moon", lord: "Moon", startAge: 26.70, endAge: 27.53, startYear: 2023, endYear: 2024, tier: "none", indicators: [], note: "No connection to houses 1, 6, or 7; not a module kāraka; no relevant special aspect." },
  { md: "Moon", lord: "Mars", startAge: 27.53, endAge: 28.12, startYear: 2024, endYear: 2025, tier: "triple", indicators: ["Mars = contest kāraka", "Mars special-aspects 6th house", "Mars special-aspects 7th house"], note: "Triple indicator via kāraka status plus two special aspects." },
  { md: "Moon", lord: "Rahu", startAge: 28.12, endAge: 29.62, startYear: 2025, endYear: 2026, tier: "none", indicators: [], note: "No standard connection; only conditional under extended nodal-aspect doctrine." },
  { md: "Moon", lord: "Jupiter", startAge: 29.62, endAge: 30.95, startYear: 2026, endYear: 2028, tier: "two", indicators: ["Jupiter rules 7th house", "Jupiter occupies 7th house"], note: "Two-yes window for the adversary's own house; currently running as of mid-2026." },
  { md: "Moon", lord: "Saturn", startAge: 30.95, endAge: 32.53, startYear: 2028, endYear: 2029, tier: "triple", indicators: ["Saturn rules 6th house", "Saturn occupies 6th house", "Saturn = persistence kāraka"], note: "Nearest-term triple-indicator standout." },
  { md: "Moon", lord: "Mercury", startAge: 32.53, endAge: 33.95, startYear: 2029, endYear: 2031, tier: "two", indicators: ["Mercury rules 1st house", "Mercury occupies 1st house"], note: "Two-yes window for the querent's own baseline standing." },
  { md: "Moon", lord: "Ketu", startAge: 33.95, endAge: 34.53, startYear: 2031, endYear: 2032, tier: "none", indicators: [], note: "No standard connection; only conditional under extended nodal-aspect doctrine." },
  { md: "Moon", lord: "Venus", startAge: 34.53, endAge: 36.20, startYear: 2032, endYear: 2034, tier: "none", indicators: [], note: "No connection to the module's six-part significator set." },
  { md: "Moon", lord: "Sun", startAge: 36.20, endAge: 36.70, startYear: 2034, endYear: 2034, tier: "none", indicators: [], note: "No connection to the module's six-part significator set." },

  { md: "Mars", lord: "Mars", startAge: 36.70, endAge: 37.11, startYear: 2034, endYear: 2035, tier: "triple", indicators: ["Mars = contest kāraka", "Mars special-aspects 6th house", "Mars special-aspects 7th house"], note: "Unusually short opening bhukti of Mars Mahādaśā; triple indicator." },
  { md: "Mars", lord: "Rahu", startAge: 37.11, endAge: 38.16, startYear: 2035, endYear: 2036, tier: "none", indicators: [], note: "No standard connection; only conditional under extended nodal-aspect doctrine." },
  { md: "Mars", lord: "Jupiter", startAge: 38.16, endAge: 39.09, startYear: 2036, endYear: 2037, tier: "two", indicators: ["Jupiter rules 7th house", "Jupiter occupies 7th house"], note: "Two-yes window for the adversary's own house." },
  { md: "Mars", lord: "Saturn", startAge: 39.09, endAge: 40.20, startYear: 2037, endYear: 2038, tier: "triple", indicators: ["Saturn rules 6th house", "Saturn occupies 6th house", "Saturn = persistence kāraka"], note: "Most thematically resonant standout: Mars MD + Saturn bhukti." },
  { md: "Mars", lord: "Mercury", startAge: 40.20, endAge: 41.19, startYear: 2038, endYear: 2039, tier: "two", indicators: ["Mercury rules 1st house", "Mercury occupies 1st house"], note: "Two-yes window for the querent's own baseline standing." },
  { md: "Mars", lord: "Ketu", startAge: 41.19, endAge: 41.60, startYear: 2039, endYear: 2040, tier: "none", indicators: [], note: "No standard connection; only conditional under extended nodal-aspect doctrine." },
  { md: "Mars", lord: "Venus", startAge: 41.60, endAge: 42.77, startYear: 2040, endYear: 2041, tier: "none", indicators: [], note: "No connection to the module's six-part significator set." },
  { md: "Mars", lord: "Sun", startAge: 42.77, endAge: 43.12, startYear: 2041, endYear: 2042, tier: "none", indicators: [], note: "No connection to the module's six-part significator set." },
  { md: "Mars", lord: "Moon", startAge: 43.12, endAge: 43.70, startYear: 2042, endYear: 2042, tier: "none", indicators: [], note: "No connection to the module's six-part significator set." },
];

const TIER_META: Record<Tier, { label: string; color: string; description: string }> = {
  triple: { label: "Triple indicator", color: GREEN, description: "Three independent connections to the significator set." },
  two: { label: "Two-yes", color: BLUE, description: "Lord + occupant of one relevant house." },
  doctrine: { label: "Doctrine-dependent", color: GOLD, description: "Conditional under extended nodal-aspect doctrine." },
  none: { label: "No connection", color: NEUTRAL, description: "No verified connection in this sweep." },
};

function tierFill(tier: Tier, selected = false) {
  if (tier === "none") return selected ? NEUTRAL_SOFT : "#F7EBD6";
  return selected ? TIER_META[tier].color : `${TIER_META[tier].color}2B`;
}

function tierTextColor(tier: Tier, selected = false) {
  if (selected && tier !== "none") return "#fff";
  return TIER_META[tier].color;
}

const DISCIPLINE_STATEMENTS = [
  {
    key: "md-strong",
    label: "Every bhukti inside Mars Mahādaśā is automatically strong because Mars is this module's contest kāraka.",
    correction:
      "Each bhukti must be tested individually. Mars MD contains triple, doctrine-dependent, and no-connection bhuktis.",
  },
  {
    key: "soonest-strongest",
    label: "The nearest-term standout window is the strongest overall finding.",
    correction:
      "Soonest and strongest are different questions. The nearest-term standout and the most thematically resonant standout are named separately.",
  },
  {
    key: "complete",
    label: "This daśā sweep is a complete timing answer on its own.",
    correction:
      "The sweep does not compute real-time Saturn transits, a separate indicator type. That layer is named but not fabricated.",
  },
] as const;

export function DashaConflictTimingSweep() {
  const [extendedNodal, setExtendedNodal] = useState(false);
  const [selectedBhukti, setSelectedBhukti] = useState<Bhukti | null>(null);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "md-strong": false,
    "soonest-strongest": false,
    complete: false,
  });

  const visibleBhuktis = useMemo<Bhukti[]>(() => {
    return BHUKTI_DATA.map((b) => {
      if (!extendedNodal) return b;
      if (b.lord === "Rahu") {
        return {
          ...b,
          tier: "doctrine",
          indicators: ["Extended nodal doctrine: Rahu's 9th aspect reaches 7th house"],
          note: "Conditional connection; reported as weaker and disclosed.",
        };
      }
      if (b.lord === "Ketu") {
        return {
          ...b,
          tier: "doctrine",
          indicators: ["Extended nodal doctrine: Ketu's 9th aspect reaches 1st house"],
          note: "Conditional connection; reported as weaker and disclosed.",
        };
      }
      return b;
    });
  }, [extendedNodal]);

  const tierCounts = useMemo(() => {
    const counts: Record<Tier, number> = { triple: 0, two: 0, doctrine: 0, none: 0 };
    visibleBhuktis.forEach((b) => {
      counts[b.tier]++;
    });
    return counts;
  }, [visibleBhuktis]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setExtendedNodal(false);
    setSelectedBhukti(null);
    setMistakes({ "md-strong": false, "soonest-strongest": false, complete: false });
  }

  return (
    <div data-interactive="dasha-conflict-timing-sweep" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chart L1 — Module 11 timing sweep</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>
              Daśā timing for conflict intensification and resolution
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Sweep Moon and Mars Mahādaśās (ages ~27-44) bhukti-by-bhukti against the six-part significator set: houses 1, 6, 7 plus Mars and Saturn as kārakas.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Significator set</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.75rem", marginTop: "0.55rem" }}>
          <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.75rem" }}>
            <span style={{ color: VERMILION, fontWeight: 600 }}>6th house</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Saturn rules and occupies; querent&apos;s litigation domain.</p>
          </div>
          <div style={{ border: `1px solid ${PURPLE}44`, borderRadius: 8, background: `${PURPLE}0A`, padding: "0.75rem" }}>
            <span style={{ color: PURPLE, fontWeight: 600 }}>7th house</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Jupiter rules and occupies; adversary / other party.</p>
          </div>
          <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.75rem" }}>
            <span style={{ color: BLUE, fontWeight: 600 }}>1st house</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Mercury rules and occupies; querent&apos;s baseline standing.</p>
          </div>
          <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.75rem" }}>
            <span style={{ color: VERMILION, fontWeight: 600 }}>Mars kāraka</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Contest kāraka; special aspects houses 3, 6, 7.</p>
          </div>
          <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.75rem" }}>
            <span style={{ color: GOLD, fontWeight: 600 }}>Saturn kāraka</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Delay / persistence kāraka; special aspects houses 3, 8, 12.</p>
          </div>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={{ ...cardStyle, gridColumn: "1 / -1", minWidth: 0 }}>
          <p style={eyebrowStyle}>Sweep timeline</p>
          <div style={{ overflowX: "auto", marginTop: "0.55rem", maxWidth: "100%", minWidth: 0 }}>
            <TimelineSvg bhuktis={visibleBhuktis} selected={selectedBhukti} onSelect={setSelectedBhukti} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Tier summary</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.55rem" }}>
            {(Object.keys(TIER_META) as Tier[]).map((tier) => (
              <div
                key={tier}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  border: `1px solid ${TIER_META[tier].color}44`,
                  borderRadius: 8,
                  background: `${TIER_META[tier].color}0A`,
                  padding: "0.65rem 0.85rem",
                }}
              >
                <div>
                  <span style={{ color: TIER_META[tier].color, fontWeight: 600 }}>{TIER_META[tier].label}</span>
                  <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.4 }}>
                    {TIER_META[tier].description}
                  </p>
                </div>
                <span style={{ color: TIER_META[tier].color, fontWeight: 600, fontSize: "1.1rem" }}>{tierCounts[tier]}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <p style={eyebrowStyle}>Extended nodal-aspect doctrine</p>
          <button
            type="button"
            aria-pressed={extendedNodal}
            onClick={() => setExtendedNodal((v) => !v)}
            style={buttonStyle(extendedNodal, GOLD)}
          >
            {extendedNodal ? <CheckCircle2 size={15} aria-hidden="true" /> : <XCircle size={15} aria-hidden="true" />}
            {extendedNodal ? "On" : "Off"}
          </button>
        </div>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          Toggle whether Rahu and Ketu receive 5th/9th aspects in addition to the universal 7th. When off, Rahu and Ketu fall into the no-connection tier. When on, they move to the doctrine-dependent single tier.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Bhukti-by-bhukti table</p>
        <div style={{ overflowX: "auto", marginTop: "0.55rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Mahādaśā</th>
                <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Bhukti lord</th>
                <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Age</th>
                <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Years</th>
                <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Tier</th>
              </tr>
            </thead>
            <tbody>
              {visibleBhuktis.map((b) => {
                const meta = TIER_META[b.tier];
                const isSelected = selectedBhukti === b;
                return (
                  <tr
                    key={`${b.md}-${b.lord}`}
                    onClick={() => setSelectedBhukti(isSelected ? null : b)}
                    style={{
                      borderBottom: `1px solid ${HAIRLINE}`,
                      background: isSelected ? `${meta.color}10` : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{b.md}</td>
                    <td style={{ padding: "0.55rem", color: INK_PRIMARY, fontWeight: 600 }}>{b.lord}</td>
                    <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>
                      {b.startAge.toFixed(2)}–{b.endAge.toFixed(2)}
                    </td>
                    <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>
                      {b.startYear}–{b.endYear}
                    </td>
                    <td style={{ padding: "0.55rem" }}>
                      <span style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {selectedBhukti ? (
          <div
            style={{
              marginTop: "0.75rem",
              border: `1px solid ${TIER_META[selectedBhukti.tier].color}55`,
              borderRadius: 8,
              background: `${TIER_META[selectedBhukti.tier].color}0A`,
              padding: "0.85rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: TIER_META[selectedBhukti.tier].color }}>
              <Clock size={16} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>
                {selectedBhukti.md} MD → {selectedBhukti.lord} bhukti
              </span>
            </div>
            {selectedBhukti.indicators.length > 0 ? (
              <ul style={{ margin: "0.55rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
                {selectedBhukti.indicators.map((ind, i) => (
                  <li key={i}>{ind}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY }}>No verified indicator in the base significator set.</p>
            )}
            <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.86rem", lineHeight: 1.5 }}>
              {selectedBhukti.note}
            </p>
          </div>
        ) : null}
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Two standout windows</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.55rem" }}>
            <div style={{ border: `1px solid ${GREEN}55`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: GREEN }}>
                <Clock size={16} aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>Nearest-term standout</span>
              </div>
              <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
                Moon MD → Saturn bhukti, age 30.95–32.53 (~2027–2028). First triple-indicator window ahead of the present moment.
              </p>
            </div>
            <div style={{ border: `1px solid ${GOLD}55`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: GOLD }}>
                <Clock size={16} aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>Most thematically resonant</span>
              </div>
              <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
                Mars MD → Saturn bhukti, age 39.09–40.20 (~2036). Both central kārakas combine directly at the daśā level.
              </p>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Honest scope limits</p>
          <div style={{ display: "flex", alignItems: "start", gap: "0.55rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
            <ShieldCheck size={18} color={BLUE} aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 2 }} />
            <p style={{ margin: 0 }}>
              This sweep covers Moon and Mars Mahādaśās only (ages ~27–44). It does not extend into later mahādaśās.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "start", gap: "0.55rem", color: INK_SECONDARY, lineHeight: 1.65, marginTop: "0.65rem" }}>
            <ShieldAlert size={18} color={GOLD} aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 2 }} />
            <p style={{ margin: 0 }}>
              Real-time Saturn transit checking (sāḍhe-sātī, aṣṭama śani) is a separate layer. This lesson names it but does not fabricate a &quot;today&quot; to compute it.
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}0A` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input type="checkbox" checked={active} onChange={() => toggleMistake(s.key)} />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p style={{ margin: "0.55rem 0 0", color: VERMILION, fontSize: "0.86rem", lineHeight: 1.5 }}>
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${PURPLE}66`,
          background: `${PURPLE}0A`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" /> Sweep result
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.7 }}>
          Saturn and Mars bhuktis both reach triple-indicator strength, but by independent routes: Saturn through 6th-house lordship, occupancy, and kāraka status; Mars through contest-kāraka status and special aspects on both the 6th and 7th. Jupiter and Mercury bhuktis form a two-yes tier, pointed at the adversary&apos;s house and the querent&apos;s baseline respectively. Rahu and Ketu are conditional on the extended nodal-aspect doctrine. Sun, Moon, and Venus show no connection. The nearest-term standout is Moon MD → Saturn bhukti (~2027–2028); the most thematically resonant is Mars MD → Saturn bhukti (~2036). Real-time Saturn transit checking remains a named but uncomputed layer.
        </p>
      </section>
    </div>
  );
}

function TimelineSvg({
  bhuktis,
  selected,
  onSelect,
}: {
  bhuktis: Bhukti[];
  selected: Bhukti | null;
  onSelect: (b: Bhukti | null) => void;
}) {
  const minAge = 26.5;
  const maxAge = 44;
  const total = maxAge - minAge;
  const rowHeight = 34;
  const trackYs: Record<string, number> = { Moon: 88, Mars: 146 };
  const axisY = 200;
  const width = 1180;
  const padding = 88;
  const plotWidth = width - padding * 2;

  function xForAge(age: number) {
    return padding + ((age - minAge) / total) * plotWidth;
  }

  return (
    <svg viewBox={`0 0 ${width} 260`} role="img" aria-label="Daśā sweep timeline showing tier strength by bhukti" style={{ width: "100%", minWidth: 980, minHeight: 260, margin: "0.7rem 0", display: "block" }}>
      <rect x="18" y="18" width={width - 36} height="218" rx="8" fill={SURFACE} stroke={HAIRLINE} />

      {/* Axis labels */}
      {[27, 30, 33, 36, 39, 42, 44].map((age) => (
        <g key={age}>
          <line x1={xForAge(age)} y1={axisY - 8} x2={xForAge(age)} y2={axisY + 8} stroke={HAIRLINE} />
          <text x={xForAge(age)} y={axisY + 30} textAnchor="middle" fill={INK_SECONDARY} fontSize="16" fontWeight="700">
            {age}
          </text>
        </g>
      ))}
      <line x1={padding} y1={axisY} x2={width - padding} y2={axisY} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x={padding} y={54} fill={INK_SECONDARY} fontSize="15" fontWeight="700">
        Age
      </text>
      <text x={padding - 16} y={trackYs.Moon + 10} textAnchor="end" fill={INK_SECONDARY} fontSize="14" fontWeight="700">
        Moon MD
      </text>
      <text x={padding - 16} y={trackYs.Mars + 10} textAnchor="end" fill={INK_SECONDARY} fontSize="14" fontWeight="700">
        Mars MD
      </text>

      {/* MD divider at Mars MD start */}
      <line x1={xForAge(36.70)} y1={trackYs.Moon - 18} x2={xForAge(36.70)} y2={axisY + 16} stroke={HAIRLINE} strokeDasharray="5 4" />
      <text x={xForAge(36.70)} y={axisY + 52} textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="700">
        Mars MD begins
      </text>

      {/* Bhukti bars */}
      {bhuktis.map((b) => {
        const x = xForAge(b.startAge);
        const w = Math.max(2, xForAge(b.endAge) - x);
        const isSelected = selected?.md === b.md && selected?.lord === b.lord;
        const color = TIER_META[b.tier].color;
        const y = trackYs[b.md] ?? trackYs.Moon;
        return (
          <g key={`${b.md}-${b.lord}`}>
            <rect
              x={x}
              y={y - 17}
              width={w}
              height={rowHeight}
              rx={4}
              fill={tierFill(b.tier, isSelected)}
              stroke={isSelected || b.tier === "none" ? color : "transparent"}
              strokeWidth={isSelected ? 2.5 : 1.5}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(isSelected ? null : b)}
            />
            {w > 52 ? (
              <text x={x + w / 2} y={y + 5} textAnchor="middle" fill={tierTextColor(b.tier, isSelected)} fontSize="13" fontWeight="800" pointerEvents="none">
                {b.lord}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${padding}, 230)`}>
        {(Object.keys(TIER_META) as Tier[]).map((tier, i) => (
          <g key={tier} transform={`translate(${i * 210}, 0)`}>
            <rect width="18" height="18" rx="4" fill={tierFill(tier)} stroke={TIER_META[tier].color} />
            <text x="26" y="15" fill={INK_PRIMARY} fontSize="14" fontWeight="700">
              {TIER_META[tier].label}
            </text>
          </g>
        ))}
      </g>
    </svg>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};


