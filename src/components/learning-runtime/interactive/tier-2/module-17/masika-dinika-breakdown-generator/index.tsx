"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Lock,
  RotateCcw,
  Sparkles,
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

const MEERA_CANDIDATES = ["Saturn", "Mercury", "Moon"];

type TabKey = "sequencer" | "blocked" | "gap";
type PresetKey = "kavya" | "meera" | "custom";

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

const KAVYA_SIGNIFICANT = ["Venus", "Sun", "Mercury", "Jupiter"];
const MEERA_SIGNIFICANT = ["Saturn", "Mercury", "Moon", "Mars", "Sun"];

export function MasikaDinikaBreakdownGenerator() {
  const [tab, setTab] = useState<TabKey>("sequencer");
  const [preset, setPreset] = useState<PresetKey>("kavya");
  const [customLord, setCustomLord] = useState<string>("Venus");

  const kavyaSequence = useMemo(() => buildMuddaSequence("Venus"), []);
  const meeraSequences = useMemo(() => MEERA_CANDIDATES.map((p) => ({ planet: p, sequence: buildMuddaSequence(p) })), []);
  const customSequence = useMemo(() => buildMuddaSequence(customLord), [customLord]);

  function reset() {
    setTab("sequencer");
    setPreset("kavya");
    setCustomLord("Venus");
  }

  return (
    <div data-interactive="masika-dinika-breakdown-generator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Masika / dinika breakdown generator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Mudda-dasha sequencer with disclosed gaps
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compute a nine-period Mudda-dasha sequence from a Varṣeśa, model an open Varṣeśa blockage, and see why a masa-pravesha chart cannot be generated here.
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
          { key: "sequencer", label: "Mudda-dasha sequencer", icon: Calendar },
          { key: "blocked", label: "Blocked sequence", icon: Lock },
          { key: "gap", label: "Masa-pravesha gap", icon: HelpCircle }
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

      {tab === "sequencer" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Sparkles size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Compression rule</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Mudda-dasha compresses the 120-year Vimsottari cycle to a single varṣa year. Each period length = Vimsottari years ÷ 120 × 360, rounded to whole days. The sequence starts from the Varṣeśa and follows standard Vimsottari order.
            </p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Select starting point</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.75rem" }}>
              {[
                { key: "kavya", label: "Kavya — Varṣeśa Venus" },
                { key: "custom", label: "Custom Varṣeśa" }
              ].map(({ key, label }) => (
                <button key={key} type="button" onClick={() => setPreset(key as PresetKey)} style={smallChipStyle(preset === key, preset === key ? GOLD_DEEP : INK_MUTED)}>
                  {label}
                </button>
              ))}
            </div>

            {preset === "custom" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", alignItems: "center" }}>
                <label style={{ fontSize: "0.85rem", color: INK_SECONDARY, fontWeight: 600 }}>Varṣeśa planet:</label>
                <select
                  value={customLord}
                  onChange={(e) => setCustomLord(e.target.value)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    border: `1.5px solid ${HAIRLINE}`,
                    background: SURFACE,
                    color: INK_PRIMARY,
                    fontSize: "0.9rem"
                  }}
                >
                  {VIMSOTTARI_ORDER.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}
          </section>

          <SequencePanel
            title={preset === "kavya" ? "Kavya's Mudda-dasha sequence" : `Mudda-dasha sequence from ${customLord}`}
            sequence={preset === "kavya" ? kavyaSequence : customSequence}
            significant={preset === "kavya" ? KAVYA_SIGNIFICANT : []}
            note={preset === "kavya" ? "Venus governs the opening 60-day window — the same planet already flagged as Kavya's dominant convergence thread." : undefined}
          />
        </>
      )}

      {tab === "blocked" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Lock size={16} color={VERMILION} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Blocked by an open Varṣeśa</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Meera has three Varṣeśa qualifiers — Saturn, Mercury, and Moon — with no decisive source available to break the tie. Mudda-dasha requires a single starting planet, so her sequence cannot be generated without first making an undisclosed assumption. The honest move is to present the three parallel hypothetical sequences instead of picking one.
            </p>
          </section>

          <div style={{ display: "grid", gap: "1rem" }}>
            {meeraSequences.map(({ planet, sequence }) => (
              <SequencePanel
                key={planet}
                title={`Hypothetical sequence if Varṣeśa = ${planet}`}
                sequence={sequence}
                significant={MEERA_SIGNIFICANT}
                hypothetical
              />
            ))}
          </div>
        </>
      )}

      {tab === "gap" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <HelpCircle size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Masa-pravesha: named but formula-undocumented</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Masa-pravesha (monthly return chart) and dina-pravesha (daily return chart) are real, named Tājika techniques. Independent sources — K.S. Charak&apos;s textbook, Kala software, and Wikipedia — corroborate their existence. None supplies an explicit formula for the casting moment. This tool therefore does not generate a masa-pravesha chart.
            </p>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
            <div style={{ ...cardStyle, borderLeft: `4px solid ${GREEN}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <CheckCircle2 size={16} color={GREEN} />
                <span style={{ fontWeight: 600, color: GREEN }}>Mudda-dasha</span>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                Well-documented period system. Compresses Vimsottari to ~360 days. Sequence starts from Varṣeśa. Computed in this lesson.
              </p>
            </div>
            <div style={{ ...cardStyle, borderLeft: `4px solid ${AMBER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <AlertTriangle size={16} color={AMBER} />
                <span style={{ fontWeight: 600, color: AMBER }}>Masa-pravesha</span>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                Named monthly return-chart technique. Casting moment formula not found in any source checked. Not computed here.
              </p>
            </div>
            <div style={{ ...cardStyle, borderLeft: `4px solid ${AMBER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <AlertTriangle size={16} color={AMBER} />
                <span style={{ fontWeight: 600, color: AMBER }}>Dina-pravesha</span>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                Named daily return-chart technique. Same formula gap as masa-pravesha. Not computed here.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SequencePanel({ title, sequence, significant, note, hypothetical }: { title: string; sequence: Period[]; significant: string[]; note?: string; hypothetical?: boolean }) {
  if (sequence.length === 0) return null;
  const total = sequence[sequence.length - 1].endDay;
  return (
    <section style={{ ...cardStyle, borderColor: hypothetical ? `${AMBER}55` : HAIRLINE }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        {hypothetical ? <AlertCircle size={16} color={AMBER} /> : <Calendar size={16} color={GOLD} />}
        <p style={{ ...eyebrowStyle, margin: 0, color: hypothetical ? AMBER : GOLD_DEEP }}>{title}</p>
      </div>

      <div style={{ marginBottom: "0.85rem" }}>
        <Timeline sequence={sequence} total={total} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem" }}>
        {sequence.map((p) => {
          const isSignificant = significant.includes(p.planet);
          return (
            <div
              key={p.planet}
              style={{
                padding: "0.65rem",
                borderRadius: "8px",
                background: isSignificant ? `${PLANET_COLORS[p.planet]}12` : "rgba(156, 122, 47, 0.05)",
                border: `1.5px solid ${isSignificant ? PLANET_COLORS[p.planet] : HAIRLINE}`
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: PLANET_COLORS[p.planet] }} />
                <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{p.planet}</span>
                {isSignificant && <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, color: GREEN, background: `${GREEN}15`, padding: "0.15rem 0.4rem", borderRadius: "999px" }}>SIGNIFICANT</span>}
              </div>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>
                Days {p.startDay}–{p.endDay} <span style={{ color: INK_MUTED }}>({p.days} days)</span>
              </p>
              <p style={{ margin: "0.15rem 0 0", color: INK_MUTED, fontSize: "0.75rem" }}>
                Vimsottari {p.years} years
              </p>
            </div>
          );
        })}
      </div>

      {note && (
        <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: "8px", background: `${GREEN}08`, border: `1px solid ${GREEN}40`, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
          <CheckCircle2 size={14} color={GREEN} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
          {note}
        </div>
      )}

      {hypothetical && (
        <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: "8px", background: `${AMBER}08`, border: `1px solid ${AMBER}40`, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
          <AlertCircle size={14} color={AMBER} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
          This is one of three possible sequences. The real Varṣeśa is undetermined, so no single sequence can be asserted.
        </div>
      )}
    </section>
  );
}

function Timeline({ sequence, total }: { sequence: Period[]; total: number }) {
  return (
    <div style={{ position: "relative", height: "44px", borderRadius: "8px", background: "rgba(156, 122, 47, 0.06)", overflow: "hidden", display: "flex" }}>
      {sequence.map((p) => {
        const width = (p.days / total) * 100;
        return (
          <div
            key={p.planet}
            style={{
              width: `${width}%`,
              height: "100%",
              background: `${PLANET_COLORS[p.planet]}25`,
              borderRight: `1px solid ${HAIRLINE}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "28px"
            }}
            title={`${p.planet}: days ${p.startDay}-${p.endDay}`}
          >
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: PLANET_COLORS[p.planet] }}>{p.planet.slice(0, 3)}</span>
            <span style={{ fontSize: "0.6rem", color: INK_MUTED }}>{p.days}d</span>
          </div>
        );
      })}
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
