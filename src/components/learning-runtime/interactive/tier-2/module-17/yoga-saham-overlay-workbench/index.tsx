"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  MapPinned,
  RotateCcw,
  Star,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

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

type TabKey = "stack" | "thread" | "open";
type NativeKey = "kavya" | "meera";

interface Occurrence {
  layer: string;
  note: string;
  color: string;
}

interface Thread {
  planet: string;
  count: number;
  occurrences: Occurrence[];
  reading: string;
}

interface YogaItem {
  yoga: string;
  pair: string;
  note: string;
}

interface NativeProfile {
  label: string;
  muntha: string;
  munthaDomain: string;
  varsesha: string;
  varseshaOpen?: boolean;
  punya: string;
  punyaLord: string;
  yogas: YogaItem[];
  dominant: Thread;
  coexisting: string;
  openQuestions: string[];
}

const PROFILES: Record<NativeKey, NativeProfile> = {
  kavya: {
    label: "Kavya — year 30",
    muntha: "6th house / Sagittarius / lord Jupiter",
    munthaDomain: "service, health, competition",
    varsesha: "Venus (stipulated; Sun also qualified)",
    varseshaOpen: false,
    punya: "185.00° = 5°00′ Libra, 10th house",
    punyaLord: "Venus",
    yogas: [
      { yoga: "Eesarphā", pair: "Sun–Mercury", note: "Mercury separating from Sun in Cancer" },
      { yoga: "Ithasāla + Manaau", pair: "Sun–Venus", note: "Venus applying to Sun; Sun and Venus are mutual enemies" },
      { yoga: "Ikkavāla x3", pair: "Cancer cluster", note: "Sun, Mercury, Venus all co-occupy Cancer" },
      { yoga: "Sajjana", pair: "Mercury–Venus", note: "Mutual friends, but out of orb" },
      { yoga: "Dureph", pair: "Moon, Mars, Jupiter, Saturn", note: "No same-sign aspect partner" }
    ],
    dominant: {
      planet: "Venus",
      count: 4,
      occurrences: [
        { layer: "Varṣeśa", note: "Stipulated year-lord candidate", color: PURPLE },
        { layer: "Punya-pati", note: "Lord of Punya Saham's 10th house", color: GREEN },
        { layer: "Ithasāla partner", note: "Applying to the Sun (Vartamāna)", color: GOLD },
        { layer: "Manaau participant", note: "Enemy conjunction with the Sun", color: VERMILION }
      ],
      reading: "Venus is this year's single dominant thread, but it does not totalise the year. The muntha sits in a different domain (6th house), so the honest picture is two coexisting layers."
    },
    coexisting: "Muntha foreground: 6th house Sagittarius — service, health, and competition themes run through the year independently of the Venus convergence.",
    openQuestions: [
      "Final Varṣeśa determination would require Pancavargīya-bala point-values not fully sourced in this module.",
      "Monthly (masika) and daily (dinika) timing are outside this chapter's scope.",
      "Natal-annual synthesis, including Vimsottari mahadasha context, is reserved for Chapter 5."
    ]
  },
  meera: {
    label: "Meera — year 25",
    muntha: "1st house / Libra / lord Venus",
    munthaDomain: "identity, self-presentation",
    varsesha: "Open — Saturn, Mercury, and Moon are qualifiers; tie deliberately not resolved",
    varseshaOpen: true,
    punya: "140.00° = 20°00′ Leo, 7th house",
    punyaLord: "Sun",
    yogas: [
      { yoga: "Eesarphā + Ikkavāla", pair: "Sun–Mercury", note: "Mercury separating from Sun in Sagittarius" },
      { yoga: "Kuttha", pair: "Mars", note: "Mars debilitated in Cancer, varsaphala 6th house" },
      { yoga: "Dureph", pair: "Moon, Mars, Jupiter, Venus, Saturn", note: "No same-sign aspect partner" }
    ],
    dominant: {
      planet: "Saturn",
      count: 3,
      occurrences: [
        { layer: "Varṣeśa qualifier", note: "Strongest qualifier by exact aspect", color: PURPLE },
        { layer: "Punya conjunction", note: "Exact 0.00° conjunction in Leo", color: GREEN },
        { layer: "Dureph", note: "No same-sign aspect partner this year", color: AMBER }
      ],
      reading: "Saturn plays a genuine dual role, but this does not resolve the open Varṣeśa tie-break. The conjunction is read as structure, delay, and endurance in the partnership domain, not a simple good/bad label."
    },
    coexisting: "Muntha foreground: 1st house Libra — identity and self-presentation are the year's foreground domain. Mars debilitated in the 6th house is a real, disclosed finding held as an area for careful attention rather than guaranteed difficulty.",
    openQuestions: [
      "Varṣeśa tie-break between Saturn, Mercury, and Moon remains genuinely open; Pancavargīya-bala point-values are not available.",
      "Monthly (masika) and daily (dinika) timing are outside this chapter's scope.",
      "Natal-annual synthesis, including Vimsottari mahadasha context, is reserved for Chapter 5."
    ]
  }
};

const LAYER_COLORS: Record<string, string> = {
  Munthā: BLUE,
  Varṣeśa: PURPLE,
  "Punya Saham": GREEN,
  Yogas: AMBER
};

export function YogaSahamOverlayWorkbench() {
  const [tab, setTab] = useState<TabKey>("stack");
  const [native, setNative] = useState<NativeKey>("kavya");
  const profile = PROFILES[native];

  function reset() {
    setTab("stack");
    setNative("kavya");
  }

  return (
    <div data-interactive="yoga-saham-overlay-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Yoga and saham overlay on the annual chart</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Consolidate the chapter and find the dominant planetary thread
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Layer every Chapter 3 finding onto Chapter 2&apos;s muntha and Varṣeśa results, surface the planet that recurs most often, and name what remains genuinely open.
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
          { key: "stack", label: "Layer stack", icon: Layers },
          { key: "thread", label: "Dominant thread", icon: Star },
          { key: "open", label: "Open questions", icon: HelpCircle }
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

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Select native</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
          {(Object.keys(PROFILES) as NativeKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setNative(key)} style={smallChipStyle(native === key, native === key ? GOLD_DEEP : INK_MUTED)}>
              {PROFILES[key].label}
            </button>
          ))}
        </div>
      </section>

      {tab === "stack" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Full layer stack</p>
            <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
              Each row restates a verified finding from this chapter or Chapter 2, with its source layer. No new computation is introduced here.
            </p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <LayerRow layer="Munthā" value={profile.muntha} domain={profile.munthaDomain} source="Lesson 17.2.1 / 17.2.2" />
              <LayerRow layer="Varṣeśa" value={profile.varsesha} source="Lesson 17.2.3 / 17.2.4" open={profile.varseshaOpen} />
              <LayerRow layer="Punya Saham" value={profile.punya} domain={`lord ${profile.punyaLord}`} source="Lesson 17.3.1" />
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Active yoga findings</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.55rem" }}>
              {profile.yogas.map((y, idx) => (
                <div key={idx} style={{ padding: "0.65rem", borderRadius: "8px", background: `${AMBER}08`, border: `1px solid ${AMBER}40` }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: "0.06em" }}>{y.yoga}</div>
                  <div style={{ margin: "0.2rem 0 0", color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{y.pair}</div>
                  <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45 }}>{y.note}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === "thread" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Star size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Dominant thread</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              A planet that appears in three or more independent layers is surfaced as the chart&apos;s dominant thread. The thread is named precisely bounded, not as a totalising verdict.
            </p>
          </section>

          <div style={workbenchDiagramLayoutStyle}>
            <section style={{ ...cardStyle, flex: "1 1 320px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <ThreadDiagram thread={profile.dominant} />
            </section>

            <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
              <div style={{ ...cardStyle, borderLeft: `4px solid ${GOLD}` }}>
                <p style={eyebrowStyle}>Thread summary</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.25rem" }}>
                  {profile.dominant.planet} appears in {profile.dominant.count} layers
                </h3>
                <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{profile.dominant.reading}</p>
              </div>

              <div style={cardStyle}>
                <p style={eyebrowStyle}>Occurrence checklist</p>
                {profile.dominant.occurrences.map((occ, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "start", gap: "0.5rem", marginBottom: "0.45rem" }}>
                    <CheckCircle2 size={16} color={occ.color} style={{ marginTop: "0.15rem", flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 600, color: INK_PRIMARY, fontSize: "0.85rem" }}>{occ.layer}</span>
                      <p style={{ margin: "0.05rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.4 }}>{occ.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ ...cardStyle, background: `${BLUE}08`, borderColor: `${BLUE}40` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                  <MapPinned size={16} color={BLUE} />
                  <span style={{ fontWeight: 600, color: BLUE, fontSize: "0.85rem" }}>Coexisting muntha layer</span>
                </div>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{profile.coexisting}</p>
              </div>
            </section>
          </div>
        </>
      )}

      {tab === "open" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <HelpCircle size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Open questions and scope boundaries</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Naming what is still unresolved is part of the discipline. These items are not silently papered over; they mark the edges of this chapter&apos;s honest reach.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {profile.openQuestions.map((q, idx) => (
              <div key={idx} style={{ ...cardStyle, display: "flex", alignItems: "start", gap: "0.65rem", background: `${AMBER}06`, borderColor: `${AMBER}40` }}>
                <AlertCircle size={18} color={AMBER} style={{ marginTop: "0.1rem", flexShrink: 0 }} />
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{q}</p>
              </div>
            ))}
          </div>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Chapter scope close</p>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              This chapter has produced a construction-complete, honestly-bounded saham-and-yoga picture for both natives. It stops at the yearly, static level. Chapter 4 will take the annual chart down to masika and dinika resolution; Chapter 5 will integrate the annual picture with the natal chart and Vimsottari context.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function LayerRow({ layer, value, domain, source, open }: { layer: string; value: string; domain?: string; source: string; open?: boolean }) {
  const color = LAYER_COLORS[layer] || GOLD;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "10px", background: `${color}06`, border: `1px solid ${color}35` }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em", minWidth: "110px" }}>{layer}</span>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{value}</span>
        {domain && <span style={{ color: INK_MUTED, fontSize: "0.85rem", marginLeft: "0.4rem" }}>({domain})</span>}
        {open && <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", fontWeight: 700, color: AMBER, background: `${AMBER}15`, padding: "0.15rem 0.4rem", borderRadius: "999px" }}>OPEN</span>}
      </div>
      <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>{source}</span>
    </div>
  );
}

function ThreadDiagram({ thread }: { thread: Thread }) {
  const cx = 150;
  const cy = 150;
  const radius = 90;
  const count = thread.occurrences.length;
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label={`${thread.planet} dominant thread across ${count} layers`} style={{ width: "100%", maxHeight: 320 }}>
      <circle cx={cx} cy={cy} r={radius + 30} fill="none" stroke={HAIRLINE} strokeDasharray="4 4" />
      {thread.occurrences.map((occ, idx) => {
        const angle = (idx / count) * 2 * Math.PI - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        return (
          <g key={idx}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={occ.color} strokeWidth="2" />
            <circle cx={x} cy={y} r="28" fill={`${occ.color}18`} stroke={occ.color} strokeWidth="2" />
            <text x={x} y={y - 4} textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight={600}>{occ.layer}</text>
            <text x={x} y={y + 10} textAnchor="middle" fill={INK_MUTED} fontSize="7">{occ.note.length > 22 ? `${occ.note.slice(0, 22)}...` : occ.note}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="42" fill={`${GOLD}20`} stroke={GOLD} strokeWidth="3" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={GOLD_DEEP} fontSize="14" fontWeight={700}>{thread.planet}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>{thread.count} layers</text>
    </svg>
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
