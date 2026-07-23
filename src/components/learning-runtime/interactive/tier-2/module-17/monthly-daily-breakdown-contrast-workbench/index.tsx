"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  Copy,
  GitCompare,
  Layers,
  RefreshCw,
  Scale,
  Search,
  Sparkles,
  Target
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "sequences" | "stability" | "contrast" | "lookup";
type NativeKey = "kavya" | "meera";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const AMBER = "#D97706";

const VIMSOTTARI_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
};

const VIMSOTTARI_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

const PLANET_COLORS: Record<string, string> = {
  Sun: VERMILION, Moon: BLUE, Mars: VERMILION, Mercury: GREEN,
  Jupiter: GOLD, Venus: GREEN, Saturn: PURPLE, Rahu: PURPLE, Ketu: AMBER
};

interface Period {
  planet: string;
  years: number;
  days: number;
  startDay: number;
  endDay: number;
}

interface Candidate {
  key: string;
  label: string;
  startPlanet: string;
  color: string;
  note: string;
}

const KAVYA_CONVERGENCE: Record<string, string[]> = {
  Venus: ["Varṣeśa", "Punya-pati", "Ithasala partner"],
  Sun: ["Ithasala partner"],
  Jupiter: ["Muntha-pati"],
  Saturn: ["Own-sign this year"]
};

const MEERA_CANDIDATES: Candidate[] = [
  { key: "saturn", label: "If Varṣeśa = Saturn", startPlanet: "Saturn", color: PURPLE, note: "One of three unresolved qualifiers" },
  { key: "mercury", label: "If Varṣeśa = Mercury", startPlanet: "Mercury", color: GREEN, note: "One of three unresolved qualifiers" },
  { key: "moon", label: "If Varṣeśa = Moon", startPlanet: "Moon", color: BLUE, note: "One of three unresolved qualifiers" }
];

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

function findPeriod(day: number, sequence: Period[]): Period | null {
  return sequence.find((p) => day >= p.startDay && day <= p.endDay) || null;
}

const KAVYA_SEQUENCE = buildMuddaSequence("Venus");
const MEERA_SEQUENCES = MEERA_CANDIDATES.map((c) => ({ ...c, sequence: buildMuddaSequence(c.startPlanet) }));

export function MonthlyDailyBreakdownContrastWorkbench() {
  const [tab, setTab] = useState<TabKey>("sequences");
  const [sequenceNative, setSequenceNative] = useState<NativeKey>("kavya");
  const [lookupNative, setLookupNative] = useState<NativeKey>("kavya");
  const [dayInput, setDayInput] = useState<number>(47);
  const [copied, setCopied] = useState(false);

  const lookupSequence = lookupNative === "kavya" ? KAVYA_SEQUENCE : MEERA_SEQUENCES[0].sequence;
  const lookupPeriod = findPeriod(dayInput, lookupSequence);

  const meeraVenusRanges = useMemo(
    () => MEERA_SEQUENCES.map((c) => c.sequence.find((p) => p.planet === "Venus")),
    []
  );

  function reset() {
    setTab("sequences");
    setSequenceNative("kavya");
    setLookupNative("kavya");
    setDayInput(47);
    setCopied(false);
  }

  function copySummary() {
    const text = lookupNative === "kavya"
      ? `Kavya's day ${dayInput} falls under ${lookupPeriod?.planet || "—"}'s Mudda-dasha period (days ${lookupPeriod?.startDay}-${lookupPeriod?.endDay}).`
      : `Meera's day ${dayInput} has three possible period-lords depending on which Varṣeśa candidate resolves: ${MEERA_SEQUENCES.map((c) => `${c.startPlanet} start → ${findPeriod(dayInput, c.sequence)?.planet}`).join("; ")}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div data-interactive="monthly-daily-breakdown-contrast-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Monthly and daily breakdowns on target year</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              One real sequence beside three honest hypotheticals
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Kavya&apos;s Varṣeśa is resolved, giving one real Mudda-dasha sequence. Meera&apos;s Varṣeśa tie-break stays open, so this workbench shows three parallel, clearly-labelled sequences side by side.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { key: "sequences", label: "Sequences", icon: Layers },
          { key: "stability", label: "Stability finder", icon: Scale },
          { key: "contrast", label: "Single vs parallel", icon: GitCompare },
          { key: "lookup", label: "Day lookup", icon: Search }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as TabKey)}
              style={{ ...smallChipStyle(active, active ? GOLD_DEEP : INK_MUTED), height: "44px", padding: "0 1rem", fontSize: "13px", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "sequences" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Select native</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={sequenceNative === "kavya"} onClick={() => setSequenceNative("kavya")} style={smallChipStyle(sequenceNative === "kavya", GREEN)}>
                Kavya — one real sequence
              </button>
              <button type="button" aria-pressed={sequenceNative === "meera"} onClick={() => setSequenceNative("meera")} style={smallChipStyle(sequenceNative === "meera", BLUE)}>
                Meera — three parallel hypotheticals
              </button>
            </div>
          </section>

          {sequenceNative === "kavya" ? (
            <section style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={eyebrowStyle}>Kavya&apos;s real sequence</p>
                  <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.2rem" }}>Varṣeśa Venus, single resolved computation</h3>
                </div>
                <span style={{ color: INK_MUTED, fontSize: "0.85rem", fontWeight: 700 }}>Varṣeśa = Venus</span>
              </div>
              <Timeline sequence={KAVYA_SEQUENCE} />
              <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
                {KAVYA_SEQUENCE.map((p) => {
                  const tags = KAVYA_CONVERGENCE[p.planet] || [];
                  return (
                    <div key={p.planet} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", padding: "0.65rem 0.75rem", borderRadius: "8px", border: `1px solid ${tags.length ? PLANET_COLORS[p.planet] : HAIRLINE}`, background: tags.length ? `${PLANET_COLORS[p.planet]}0A` : "transparent" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: PLANET_COLORS[p.planet] }} />
                        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{p.planet}</span>
                        <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>days {p.startDay}-{p.endDay}</span>
                      </div>
                      {tags.length > 0 && (
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                          {tags.map((tag) => (
                            <span key={tag} style={{ padding: "0.2rem 0.5rem", borderRadius: "999px", background: `${GOLD}18`, color: GOLD_DEEP, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <>
              <section style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={eyebrowStyle}>Meera&apos;s parallel hypotheticals</p>
                    <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.2rem" }}>Three unresolved Varṣeśa candidates</h3>
                  </div>
                  <span style={{ color: INK_MUTED, fontSize: "0.85rem", fontWeight: 700 }}>Saturn / Mercury / Moon</span>
                </div>
                <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
                  Each sequence is computed identically; only the starting planet differs. The correct sequence will be the one whose starting planet eventually resolves as Meera&apos;s true Varṣeśa.
                </p>
              </section>
              {MEERA_SEQUENCES.map((candidate) => (
                <section key={candidate.key} style={{ ...cardStyle, borderLeft: `4px solid ${candidate.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    <h3 style={{ margin: 0, color: candidate.color, fontSize: "1.1rem" }}>{candidate.label}</h3>
                    <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700 }}>{candidate.note}</span>
                  </div>
                  <Timeline sequence={candidate.sequence} />
                </section>
              ))}
            </>
          )}
        </>
      )}

      {tab === "stability" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Scale size={18} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Cross-sequence stability</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Because the same nine Vimsottari periods are merely reordered, every planet keeps the same duration across all three of Meera&apos;s sequences. The robust observation is which planets appear and for how long, not their exact day-range in any one still-unresolved sequence.
            </p>
          </section>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${GREEN}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Sparkles size={18} color={GREEN} />
              <h3 style={{ margin: 0, color: GREEN, fontSize: "1.15rem" }}>Venus is stable across all three</h3>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Venus governs roughly two months in every candidate sequence. Relationship and value-oriented themes therefore have a dedicated window at some point in the year regardless of which Varṣeśa resolves.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
              {meeraVenusRanges.map((period, idx) => period && (
                <div key={idx} style={{ padding: "0.65rem", borderRadius: "8px", border: `1px solid ${MEERA_CANDIDATES[idx].color}`, background: `${MEERA_CANDIDATES[idx].color}0A` }}>
                  <div style={{ color: MEERA_CANDIDATES[idx].color, fontWeight: 700, fontSize: "0.85rem" }}>{MEERA_CANDIDATES[idx].label}</div>
                  <div style={{ color: INK_PRIMARY, fontWeight: 600, marginTop: "0.25rem" }}>Venus days {period.startDay}-{period.endDay}</div>
                  <div style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{period.days} days</div>
                </div>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>What varies vs what holds</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem", marginTop: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: "8px", border: `1px solid ${GREEN}44`, background: `${GREEN}08` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, fontWeight: 700, fontSize: "0.9rem" }}>
                  <CheckCircle2 size={16} />
                  Holds across all three
                </div>
                <ul style={{ margin: "0.45rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                  <li>Each planet&apos;s duration</li>
                  <li>Venus appears for ~60 days</li>
                  <li>The full 360-day year is covered</li>
                </ul>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: "8px", border: `1px solid ${VERMILION}44`, background: `${VERMILION}08` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: VERMILION, fontWeight: 700, fontSize: "0.9rem" }}>
                  <Target size={16} />
                  Varies by candidate
                </div>
                <ul style={{ margin: "0.45rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                  <li>Exact start day of each period</li>
                  <li>Which planet opens the year</li>
                  <li>Which period covers a specific calendar window</li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "contrast" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <GitCompare size={18} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Methodological contrast</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              The two natives produce differently-shaped but equally honest results. Kavya&apos;s chart supports a single computation; Meera&apos;s supports three parallel hypotheticals. Both are the technique working correctly.
            </p>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={{ ...cardStyle, borderTop: `4px solid ${GREEN}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <CheckCircle2 size={18} color={GREEN} />
                <h3 style={{ margin: 0, color: GREEN, fontSize: "1.15rem" }}>Kavya — single real outcome</h3>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
                Varṣeśa Venus is resolved. Her sequence is one real computation. The opening Venus period (days 1-60) carries the densest convergence this module has found for her.
              </p>
              <div style={{ marginTop: "0.75rem" }}>
                <MiniTimeline sequence={KAVYA_SEQUENCE} />
              </div>
            </section>

            <section style={{ ...cardStyle, borderTop: `4px solid ${BLUE}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <ArrowRightLeft size={18} color={BLUE} />
                <h3 style={{ margin: 0, color: BLUE, fontSize: "1.15rem" }}>Meera — three parallel outcomes</h3>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
                Varṣeśa tie-break is open. Three sequences are computed and labelled. None is averaged; exactly one will prove correct once the true Varṣeśa is resolved.
              </p>
              <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.45rem" }}>
                {MEERA_SEQUENCES.map((c) => (
                  <div key={c.key} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: INK_SECONDARY }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: c.color }} />
                    <span style={{ fontWeight: 600, color: c.color }}>{c.startPlanet} start</span>
                    <span>— Venus at days {c.sequence.find((p) => p.planet === "Venus")?.startDay}-{c.sequence.find((p) => p.planet === "Venus")?.endDay}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${GOLD}` }}>
            <p style={eyebrowStyle}>Key takeaway</p>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              A learner who only ever sees fully-resolved examples may assume Tājika always yields one clean answer. Meera&apos;s outcome is the standing counter-example: honest technique sometimes produces parallel, unresolved results.
            </p>
          </section>
        </>
      )}

      {tab === "lookup" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Day lookup</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" aria-pressed={lookupNative === "kavya"} onClick={() => setLookupNative("kavya")} style={smallChipStyle(lookupNative === "kavya", GREEN)}>
                  Kavya
                </button>
                <button type="button" aria-pressed={lookupNative === "meera"} onClick={() => setLookupNative("meera")} style={smallChipStyle(lookupNative === "meera", BLUE)}>
                  Meera
                </button>
              </div>
              <input
                type="number"
                min={1}
                max={360}
                value={dayInput}
                onChange={(e) => setDayInput(Math.max(1, Math.min(360, Number(e.target.value))))}
                style={{ width: "90px", padding: "0.55rem 0.75rem", borderRadius: "8px", border: `1.5px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontSize: "0.95rem" }}
              />
              <input
                type="range"
                min={1}
                max={360}
                value={dayInput}
                onChange={(e) => setDayInput(Number(e.target.value))}
                style={{ flex: 1, minWidth: "200px", accentColor: GOLD }}
              />
            </div>
            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>Day {dayInput} of 360</p>
          </section>

          {lookupNative === "kavya" && lookupPeriod && (
            <section style={{ ...cardStyle, borderLeft: `4px solid ${PLANET_COLORS[lookupPeriod.planet]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={eyebrowStyle}>Kavya day {dayInput}</p>
                  <h3 style={{ margin: "0.15rem 0 0", color: PLANET_COLORS[lookupPeriod.planet], fontSize: "1.2rem" }}>
                    Governed by {lookupPeriod.planet}
                  </h3>
                </div>
                <button type="button" onClick={copySummary} style={buttonStyle(false, GOLD)}>
                  {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
                This period runs from day {lookupPeriod.startDay} to day {lookupPeriod.endDay}. For a high-stakes question on this day, combine this period-lord with a full Muhurta check for the calendar date.
              </p>
              {KAVYA_CONVERGENCE[lookupPeriod.planet] && (
                <div style={{ marginTop: "0.65rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {KAVYA_CONVERGENCE[lookupPeriod.planet].map((tag) => (
                    <span key={tag} style={{ padding: "0.25rem 0.55rem", borderRadius: "999px", background: `${GOLD}18`, color: GOLD_DEEP, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>{tag}</span>
                  ))}
                </div>
              )}
              <div style={{ marginTop: "0.85rem" }}>
                <Timeline sequence={KAVYA_SEQUENCE} highlightDay={dayInput} />
              </div>
            </section>
          )}

          {lookupNative === "meera" && (
            <>
              <section style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={eyebrowStyle}>Meera day {dayInput}</p>
                    <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.2rem" }}>Three possible period-lords</h3>
                  </div>
                  <button type="button" onClick={copySummary} style={buttonStyle(false, GOLD)}>
                    {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
                  Because the Varṣeśa is unresolved, the same day has three possible governing planets. A day-specific reading must therefore stay provisional until the tie-break resolves.
                </p>
              </section>
              {MEERA_SEQUENCES.map((candidate) => {
                const p = findPeriod(dayInput, candidate.sequence);
                if (!p) return null;
                return (
                  <section key={candidate.key} style={{ ...cardStyle, borderLeft: `4px solid ${candidate.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: PLANET_COLORS[p.planet] }} />
                        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{candidate.label}: {p.planet}</span>
                      </div>
                      <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>days {p.startDay}-{p.endDay}</span>
                    </div>
                  </section>
                );
              })}
              <div style={{ marginTop: "0.5rem" }}>
                {MEERA_SEQUENCES.map((candidate) => (
                  <div key={candidate.key} style={{ marginBottom: "0.75rem" }}>
                    <Timeline sequence={candidate.sequence} highlightDay={dayInput} compact />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Timeline({ sequence, highlightDay, compact = false }: { sequence: Period[]; highlightDay?: number | null; compact?: boolean }) {
  const total = sequence[sequence.length - 1]?.endDay || 360;
  return (
    <div style={{ position: "relative", height: compact ? "32px" : "44px", borderRadius: "8px", background: "rgba(156, 122, 47, 0.06)", overflow: "hidden", display: "flex", marginTop: "0.75rem" }}>
      {sequence.map((p) => {
        const width = (p.days / total) * 100;
        const highlighted = highlightDay !== null && highlightDay !== undefined && highlightDay >= p.startDay && highlightDay <= p.endDay;
        return (
          <div
            key={p.planet}
            style={{
              width: `${width}%`,
              height: "100%",
              background: highlighted ? `${PLANET_COLORS[p.planet]}55` : `${PLANET_COLORS[p.planet]}22`,
              borderRight: `1px solid ${HAIRLINE}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "20px"
            }}
          >
            <span style={{ fontSize: compact ? "0.6rem" : "0.65rem", fontWeight: 700, color: PLANET_COLORS[p.planet] }}>{p.planet.slice(0, 3)}</span>
          </div>
        );
      })}
      {highlightDay !== null && highlightDay !== undefined && (
        <div
          style={{
            position: "absolute",
            left: `${(highlightDay / total) * 100}%`,
            top: 0,
            bottom: 0,
            width: "3px",
            background: VERMILION,
            transform: "translateX(-50%)"
          }}
        />
      )}
    </div>
  );
}

function MiniTimeline({ sequence }: { sequence: Period[] }) {
  const total = sequence[sequence.length - 1]?.endDay || 360;
  return (
    <div style={{ display: "flex", height: "28px", borderRadius: "6px", overflow: "hidden", border: `1px solid ${HAIRLINE}` }}>
      {sequence.map((p) => (
        <div
          key={p.planet}
          style={{
            width: `${(p.days / total) * 100}%`,
            height: "100%",
            background: `${PLANET_COLORS[p.planet]}33`,
            borderRight: `1px solid ${HAIRLINE}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "18px"
          }}
        >
          <span style={{ fontSize: "0.55rem", fontWeight: 700, color: PLANET_COLORS[p.planet] }}>{p.planet.slice(0, 2)}</span>
        </div>
      ))}
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
    cursor: "pointer"
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
    cursor: "pointer"
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase"
};
