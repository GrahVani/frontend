"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { RotateCcw, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

type Panchadha = "Adhi-Mitra" | "Mitra" | "Sama" | "Shatru" | "Adhi-Shatru";

type AdLord =
  | "mars"
  | "jupiter"
  | "saturn"
  | "mercury"
  | "venus"
  | "sun";

interface AdPeriod {
  lord: AdLord;
  label: string;
  start: number;
  end: number;
  panchadha: Panchadha;
  dignity: string;
  domain: string;
  summary: string;
}

interface PdPeriod {
  lord: string;
  panchadha: Panchadha | "self" | "excluded";
  start: number;
  end: number;
  domain: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "var(--gold-dark, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const DARK_RED = "#7A1E12";
const AMBER = "#B88421";

const AD_PERIODS: AdPeriod[] = [
  {
    lord: "mars",
    label: "Moon/Mars",
    start: 31.339,
    end: 31.923,
    panchadha: "Shatru",
    dignity: "Mars in own sign, strong",
    domain: "Siblings, courage, property",
    summary: "Friction with capacity; siblings/property matters in focus",
  },
  {
    lord: "jupiter",
    label: "Moon/Jupiter",
    start: 33.423,
    end: 34.756,
    panchadha: "Mitra",
    dignity: "Jupiter in own sign, strong",
    domain: "Husband, children, wisdom, dharma",
    summary: "Supportive; marriage-adjacent/dharma matters in focus",
  },
  {
    lord: "saturn",
    label: "Moon/Saturn",
    start: 34.756,
    end: 36.339,
    panchadha: "Mitra",
    dignity: "Saturn exalted, strong",
    domain: "Longevity, career, discipline",
    summary: "Supportive; career/discipline matters in focus",
  },
  {
    lord: "mercury",
    label: "Moon/Mercury",
    start: 36.339,
    end: 37.756,
    panchadha: "Sama",
    dignity: "Mercury in own sign, strong",
    domain: "Communication, business, education",
    summary: "Mixed; communication/business matters in focus",
  },
  {
    lord: "venus",
    label: "Moon/Venus",
    start: 38.339,
    end: 40.006,
    panchadha: "Shatru",
    dignity: "Venus in enemy's sign, weak",
    domain: "Romance/luxury, relationships",
    summary: "Friction with less capacity; romance/relationship matters in focus",
  },
  {
    lord: "sun",
    label: "Moon/Sun",
    start: 40.006,
    end: 40.506,
    panchadha: "Sama",
    dignity: "Sun in neutral sign, mixed",
    domain: "Father, authority, vitality",
    summary: "Mixed; father/authority matters in focus",
  },
];

const MOON_JUPITER_PD: PdPeriod[] = [
  { lord: "Jupiter", panchadha: "self", start: 33.423, end: 33.601, domain: "Children, wisdom, dharma" },
  { lord: "Saturn", panchadha: "Shatru", start: 33.601, end: 33.812, domain: "Longevity, career, discipline" },
  { lord: "Mercury", panchadha: "Adhi-Shatru", start: 33.812, end: 34.001, domain: "Communication, business, education" },
  { lord: "Ketu", panchadha: "excluded", start: 34.001, end: 34.079, domain: "—" },
  { lord: "Venus", panchadha: "Adhi-Shatru", start: 34.079, end: 34.301, domain: "Romance/luxury, relationships" },
  { lord: "Sun", panchadha: "Sama", start: 34.301, end: 34.368, domain: "Father, authority, vitality" },
  { lord: "Moon", panchadha: "Adhi-Mitra", start: 34.368, end: 34.479, domain: "Mother, mind, emotions, public" },
  { lord: "Mars", panchadha: "Adhi-Mitra", start: 34.479, end: 34.557, domain: "Siblings, courage, property" },
  { lord: "Rahu", panchadha: "excluded", start: 34.557, end: 34.756, domain: "—" },
];

const MOON_MARS_MIDPOINT = 31.631;
const MOON_JUPITER_MIDPOINT = 34.089;

const TOTAL_START = 31.0;
const TOTAL_END = 41.0;

function panchadhaColor(p: PdPeriod["panchadha"]) {
  switch (p) {
    case "Adhi-Mitra":
      return GREEN;
    case "Mitra":
      return "#4A9A6B";
    case "Sama":
      return AMBER;
    case "Shatru":
      return VERMILION;
    case "Adhi-Shatru":
      return DARK_RED;
    default:
      return INK_MUTED;
  }
}

function formatAge(n: number) {
  return n.toFixed(3);
}

export function SubPeriodBhuktiYogaSynthesisWorkbench() {
  const [selectedLord, setSelectedLord] = useState<AdLord>("jupiter");
  const [depth, setDepth] = useState<"ad" | "pd">("ad");
  const [mode, setMode] = useState<"description" | "prediction">("description");
  const [showWhy, setShowWhy] = useState(false);
  const [drillExample, setDrillExample] = useState<"jupiter" | "mars">("jupiter");
  const [disciplineChoice, setDisciplineChoice] = useState<string | null>(null);

  const selected = useMemo(
    () => AD_PERIODS.find((a) => a.lord === selectedLord)!,
    [selectedLord]
  );

  function reset() {
    setSelectedLord("jupiter");
    setDepth("ad");
    setMode("description");
    setShowWhy(false);
    setDrillExample("jupiter");
    setDisciplineChoice(null);
  }

  const timelineWidth = TOTAL_END - TOTAL_START;

  return (
    <div
      data-interactive="bhukti-yoga-sub-period-synthesis-workbench"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: "var(--font-family-sans)" }}
    >
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chapter 2 synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Sub-Period Bhukti-Yoga Synthesis Workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Assemble timing, Pañcadhā Maitri, and kāraka into one texture-and-domain map, then test the
              scale-invariant method one level deeper.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Antardaśā timeline of Kavya’s Moon mahādaśā</p>
        <div
          style={{
            position: "relative",
            display: "flex",
            height: "44px",
            borderRadius: "8px",
            overflow: "hidden",
            border: `1px solid ${HAIRLINE}`,
            marginTop: "0.75rem",
          }}
        >
          {AD_PERIODS.map((ad) => {
            const left = ((ad.start - TOTAL_START) / timelineWidth) * 100;
            const width = ((ad.end - ad.start) / timelineWidth) * 100;
            const isSelected = ad.lord === selectedLord;
            return (
              <button
                key={ad.lord}
                type="button"
                onClick={() => {
                  setSelectedLord(ad.lord);
                  setDepth("ad");
                  setDisciplineChoice(null);
                }}
                title={`${ad.label}: ${formatAge(ad.start)}–${formatAge(ad.end)} — ${ad.panchadha}`}
                style={{
                  position: "absolute" as const,
                  left: `${left}%`,
                  width: `${width}%`,
                  height: "100%",
                  background: `${panchadhaColor(ad.panchadha)}${isSelected ? "" : "66"}`,
                  border: isSelected ? `2px solid ${INK_PRIMARY}` : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  color: "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                }}
              >
                {ad.label.split("/")[1]}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.75rem", fontSize: "0.78rem", color: INK_MUTED }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: GREEN }} /> Adhi-Mitra
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: "#4A9A6B" }} /> Mitra
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: AMBER }} /> Sama
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: VERMILION }} /> Shatru
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: DARK_RED }} /> Adhi-Shatru
          </span>
        </div>
      </section>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="button" onClick={() => setMode("description")} style={pillStyle(mode === "description")}>
          Texture-and-domain map
        </button>
        <button type="button" onClick={() => setMode("prediction")} style={pillStyle(mode === "prediction")}>
          Prediction check
        </button>
        <button type="button" onClick={() => setDepth("ad")} style={pillStyle(depth === "ad")}>
          Antardaśā level
        </button>
        <button type="button" onClick={() => setDepth("pd")} style={pillStyle(depth === "pd")}>
          Pratyantardaśā drill
        </button>
      </div>

      {mode === "prediction" && (
        <section style={{ ...cardStyle, borderColor: `${AMBER}88`, background: `${AMBER}0A` }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
            <AlertTriangle size={22} color={AMBER} aria-hidden="true" />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: AMBER }}>This is a description, not a prediction</h3>
              <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
                The synthesis table tells you how smoothly a period tends to run and which life domain is
                in focus. A confidence-tiered prediction would need additional, independent lines:
              </p>
              <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
                <li>Natal 7th-house and 7th-lord activation status for a marriage claim</li>
                <li>Navāṁśa confirmation of the same specific outcome</li>
                <li>A converging transit or pratyantardaśā timing line</li>
                <li>Daśā-cusp interplay (the next chapter’s layer)</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {depth === "ad" ? (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Three-lens synthesizer — {selected.label}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "0.75rem" }}>
            <LensCard title="Timing" value={`Age ${formatAge(selected.start)} – ${formatAge(selected.end)}`} />
            <LensCard title="Pañcadhā" value={selected.panchadha} valueColor={panchadhaColor(selected.panchadha)} />
            <LensCard title="Kāraka domain" value={selected.domain} />
          </div>
          <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "8px", background: `${panchadhaColor(selected.panchadha)}11`, border: `1px solid ${panchadhaColor(selected.panchadha)}33` }}>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55 }}>
              <span style={{ color: INK_MUTED, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                Combined texture read
              </span>
              <br />
              {selected.summary} Dignity note: {selected.dignity}.
            </p>
          </div>
        </section>
      ) : (
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <p style={eyebrowStyle}>Pratyantardaśā drill</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" onClick={() => setDrillExample("jupiter")} style={chipStyle(drillExample === "jupiter")}>
                Moon/Jupiter
              </button>
              <button type="button" onClick={() => setDrillExample("mars")} style={chipStyle(drillExample === "mars")}>
                Moon/Mars
              </button>
            </div>
          </div>

          {selectedLord === "saturn" ? (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                Moon/Saturn is Mitra overall. Before claiming anything about its internal texture, what is
                the right next step?
              </p>
              <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
                {[
                  {
                    id: "assume",
                    text: "Assume the whole period is uniformly supportive because its antardaśā-level Pañcadhā is Mitra.",
                  },
                  {
                    id: "drill",
                    text: "Compute Moon/Saturn’s own pratyantardaśās, classify each against Saturn, then describe the internal texture.",
                  },
                  {
                    id: "reflex",
                    text: "Run the pratyantardaśā drill reflexively, because the method is now available.",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDisciplineChoice(opt.id)}
                    style={{
                      textAlign: "left",
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      border: `1px solid ${HAIRLINE}`,
                      background: disciplineChoice === opt.id ? (opt.id === "drill" ? `${GREEN}11` : `${VERMILION}11`) : SURFACE,
                      color: INK_PRIMARY,
                      cursor: "pointer",
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {disciplineChoice === "drill" && (
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "start" }}>
                  <CheckCircle2 size={20} color={GREEN} />
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                    Correct. The method is scale-invariant, but depth is governed by the question, not by
                    the availability of the tool. This lesson deliberately leaves Moon/Saturn uncomputed to
                    model that restraint.
                  </p>
                </div>
              )}
              {disciplineChoice && disciplineChoice !== "drill" && (
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "start" }}>
                  <AlertTriangle size={20} color={VERMILION} />
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                    This matches Common Mistake #2 or #4 from the lesson. The antardaśā label is a summary,
                    not a claim of internal uniformity, and the method should be used only when the question
                    warrants it.
                  </p>
                </div>
              )}
            </div>
          ) : selectedLord === "jupiter" || drillExample === "jupiter" ? (
            <PdTable
              adLabel="Moon/Jupiter"
              midpoint={MOON_JUPITER_MIDPOINT}
              periods={MOON_JUPITER_PD}
              note="The midpoint lands in the Jupiter/Venus pratyantardaśā — Adhi-Śatru — with Venus’s domain (romance/relationships) in tension."
            />
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                For Moon/Mars, the overall antardaśā is Śatru, but its midpoint check lands in the
                Mars/Mercury pratyantardaśā — Sama — not an extreme in either direction.
              </p>
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: `${AMBER}11`,
                  border: `1px solid ${AMBER}44`,
                }}
              >
                <p style={{ margin: 0, color: INK_PRIMARY }}>
                  Midpoint age {formatAge(MOON_MARS_MIDPOINT)} → Mars/Mercury → Sama.
                </p>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  This contrast is reported alongside the Moon/Jupiter finding so cascade depth is not
                  dramatised by default.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      <section
        style={{
          ...cardStyle,
          background: "#F5EDD8",
          borderLeft: "4px solid var(--gold-primary, #C9A24D)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ ...eyebrowStyle, color: "var(--gold-dark, #9C7A2F)" }}>Client-facing finding</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_PRIMARY, lineHeight: 1.65, fontStyle: "italic" }}>
              “Your Moon/Jupiter antardaśā is, overall, a supportive window in which marriage-adjacent,
              wisdom, and dharma matters tend to come into focus. At its middle stretch, though, there is a
              specific few-week pocket where the deeper sub-period lord (Venus) is in the most opposed
              relationship possible to Jupiter, and Venus’s own domain is romance and relationships. That
              does not mean the whole antardaśā turns difficult — it means this particular stretch may bring
              more friction around romantic/relationship matters specifically.”
            </p>
          </div>
          <button type="button" onClick={() => setShowWhy((v) => !v)} style={buttonStyle(showWhy, GOLD)}>
            <Info size={15} aria-hidden="true" /> {showWhy ? "Hide" : "Why this works"}
          </button>
        </div>
        {showWhy && (
          <ul style={{ margin: "0.75rem 0 0", paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
            <li>Reports the genuine finding without dramatising it.</li>
            <li>Keeps the domain-specific caveat attached to the domain-specific pocket.</li>
            <li>Never states this as a tiered prediction — only as a texture-and-domain description.</li>
          </ul>
        )}
      </section>
    </div>
  );
}

function LensCard({
  title,
  value,
  valueColor,
}: {
  title: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div style={{ padding: "1rem", borderRadius: "8px", background: `${valueColor ?? INK_MUTED}08`, border: `1px solid ${HAIRLINE}` }}>
      <p style={{ margin: 0, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, color: INK_MUTED }}>
        {title}
      </p>
      <p style={{ margin: "0.35rem 0 0", fontSize: "1.05rem", fontWeight: 600, color: valueColor ?? INK_PRIMARY }}>
        {value}
      </p>
    </div>
  );
}

function PdTable({
  adLabel,
  midpoint,
  periods,
  note,
}: {
  adLabel: string;
  midpoint: number;
  periods: PdPeriod[];
  note: string;
}) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <p style={{ color: INK_SECONDARY, lineHeight: 1.55, marginBottom: "0.75rem" }}>
        {adLabel} antardaśā divided into its own pratyantardaśā sequence. The marker shows the period’s
        midpoint.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <div style={{ flex: 1, height: 24, borderRadius: 6, overflow: "hidden", display: "flex", border: `1px solid ${HAIRLINE}` }}>
          {periods.map((pd) => {
            const width = ((pd.end - pd.start) / (periods[periods.length - 1].end - periods[0].start)) * 100;
            const isMid = midpoint >= pd.start && midpoint <= pd.end;
            return (
              <div
                key={pd.lord}
                style={{
                  width: `${width}%`,
                  background: panchadhaColor(pd.panchadha),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  color: "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                  border: isMid ? "2px solid #1A1408" : "none",
                }}
                title={`${pd.lord}: ${formatAge(pd.start)}–${formatAge(pd.end)} — ${pd.panchadha}`}
              >
                {pd.lord.slice(0, 2)}
              </div>
            );
          })}
        </div>
        <span style={{ fontSize: "0.75rem", color: INK_MUTED, whiteSpace: "nowrap" }}>age {formatAge(midpoint)}</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: 420 }}>
          <thead>
            <tr style={{ background: `${GOLD}08` }}>
              <th style={thStyle}>Pratyantardaśā</th>
              <th style={thStyle}>Span (age)</th>
              <th style={thStyle}>Pañcadhā</th>
              <th style={thStyle}>Kāraka domain</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((pd) => {
              const isMid = midpoint >= pd.start && midpoint <= pd.end;
              return (
                <tr
                  key={pd.lord}
                  style={{
                    background: isMid ? `${panchadhaColor(pd.panchadha)}14` : "transparent",
                    fontWeight: isMid ? 600 : 400,
                  }}
                >
                  <td style={tdStyle}>{adLabel}/{pd.lord}</td>
                  <td style={tdStyle}>{formatAge(pd.start)}–{formatAge(pd.end)}</td>
                  <td style={tdStyle}>
                    <span style={{ color: panchadhaColor(pd.panchadha), fontWeight: 600 }}>{pd.panchadha}</span>
                  </td>
                  <td style={tdStyle}>{pd.domain}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "start" }}>
        <Info size={18} color={GOLD} />
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>{note}</p>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "8px",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  fontWeight: 700,
  color: INK_MUTED,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.45rem 0.9rem",
    borderRadius: "8px",
    border: `1px solid ${color}`,
    background: active ? color : "transparent",
    color: active ? "#fff" : color,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function pillStyle(active: boolean): CSSProperties {
  return {
    padding: "0.4rem 0.85rem",
    borderRadius: "9999px",
    border: `1px solid ${active ? GOLD : HAIRLINE}`,
    background: active ? `${GOLD}15` : "transparent",
    color: active ? GOLD : INK_SECONDARY,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function chipStyle(active: boolean): CSSProperties {
  return {
    padding: "0.35rem 0.75rem",
    borderRadius: "6px",
    border: `1px solid ${active ? GOLD : HAIRLINE}`,
    background: active ? `${GOLD}15` : SURFACE,
    color: active ? GOLD : INK_PRIMARY,
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const thStyle: CSSProperties = {
  padding: "0.6rem 0.75rem",
  textAlign: "left",
  fontWeight: 600,
  color: INK_MUTED,
  borderBottom: `1px solid ${HAIRLINE}`,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.75rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
};
