"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Info, Layers, RotateCcw, Scale } from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const EVENTS = ["Marriage", "Business-launch", "Journey", "Gṛha-praveśa", "Surgery"] as const;
type EventType = (typeof EVENTS)[number];

type Limb = "tithi" | "vara" | "nakshatra" | "yoga" | "karana" | "tara" | "candra";
type Status = "strong" | "neutral" | "weak";

const LIMB_LABELS: Record<Limb, string> = {
  tithi: "Tithi",
  vara: "Vāra",
  nakshatra: "Nakṣatra",
  yoga: "Yoga",
  karana: "Karaṇa",
  tara: "Tārā bala",
  candra: "Candra bala",
};

const LIMB_ORDER: Limb[] = ["tithi", "vara", "nakshatra", "yoga", "karana", "tara", "candra"];

const WEIGHTS: Record<EventType, Record<Limb, number>> = {
  Marriage: { tithi: 1, vara: 2, nakshatra: 3, yoga: 1, karana: 1, tara: 3, candra: 3 },
  "Business-launch": { tithi: 3, vara: 3, nakshatra: 2, yoga: 1, karana: 1, tara: 2, candra: 1 },
  Journey: { tithi: 2, vara: 3, nakshatra: 3, yoga: 1, karana: 1, tara: 1, candra: 2 },
  "Gṛha-praveśa": { tithi: 3, vara: 2, nakshatra: 3, yoga: 1, karana: 1, tara: 2, candra: 3 },
  Surgery: { tithi: 2, vara: 3, nakshatra: 3, yoga: 2, karana: 3, tara: 1, candra: 1 },
};

const SOURCE_TAG: Record<EventType, { source: string; note: string }> = {
  Marriage: { source: "T1-23 Lesson 23.1.2 §4.8, verbatim", note: "Weighting taken directly from T1-23's own aggregation table." },
  "Business-launch": { source: "T1-23 Lesson 23.1.2 §4.8, verbatim", note: "Weighting taken directly from T1-23's own aggregation table." },
  Journey: { source: "T1-23 Lesson 23.1.2 §4.8, verbatim", note: "Weighting taken directly from T1-23's own aggregation table." },
  "Gṛha-praveśa": {
    source: "This module's own extension",
    note: "Reasoned from T1-23 Lesson 23.4.3's own Venus-Moon-Jupiter triad emphasis for gṛha-praveśa.",
  },
  Surgery: {
    source: "This module's own extension",
    note: "Reasoned from T1-23's distributed surgical-exception thread (vāra, nakṣatra, karaṇa).",
  },
};

interface Candidate {
  label: string;
  dateNote: string;
  limbs: Record<Limb, Status>;
  detail: string;
}

const CANDIDATES: Record<string, Candidate> = {
  "meera-arjun-candidate-3": {
    label: "Meera & Arjun — Candidate 3 (11 Nov, Rohiṇī)",
    dateNote: "Wed 11 Nov 2026 — marriage candidate from Lesson 16.1.1 §6",
    limbs: {
      tithi: "strong",
      vara: "neutral",
      nakshatra: "strong",
      yoga: "neutral",
      karana: "neutral",
      tara: "strong",
      candra: "strong",
    },
    detail: "Pūrṇā tithi (auspicious class), Rohiṇī nakṣatra (Sthira), bride tārā Sampat and groom tārā Sadhaka both auspicious, candra bala favourable in the 7th house.",
  },
  "surgery-example": {
    label: "Surgery example — incisive-action window",
    dateNote: "Tuesday — hypothetical surgical candidate from Lesson 16.1.3 §4.3",
    limbs: {
      tithi: "neutral",
      vara: "strong",
      nakshatra: "strong",
      yoga: "neutral",
      karana: "strong",
      tara: "neutral",
      candra: "neutral",
    },
    detail: "Tuesday/Mars vāra exception, Tīkṣṇa nakṣatra exception, and Bhadrā-puccha karaṇa exception all align on a single incisive-action theme.",
  },
};

function statusColor(status: Status): string {
  if (status === "strong") return GREEN;
  if (status === "weak") return VERMILION;
  return GOLD;
}

function statusLabel(status: Status): string {
  if (status === "strong") return "Strong";
  if (status === "weak") return "Weak";
  return "Neutral";
}

function weightTier(weight: number): { label: string; color: string } {
  if (weight === 3) return { label: "Heaviest", color: PURPLE };
  if (weight === 2) return { label: "Intermediate", color: BLUE };
  return { label: "Lighter", color: GOLD };
}

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function MuhurtaMultiOverlayScreener() {
  const [event, setEvent] = useState<EventType>("Marriage");
  const [candidateKey, setCandidateKey] = useState<string>("meera-arjun-candidate-3");

  const candidate = CANDIDATES[candidateKey];
  const weights = WEIGHTS[event];
  const source = SOURCE_TAG[event];

  const maxWeight = useMemo(() => Math.max(...LIMB_ORDER.map((l) => weights[l])), [weights]);

  const sortedLimbs = useMemo(() => {
    if (event !== "Surgery") return LIMB_ORDER;
    const elevated: Limb[] = ["vara", "nakshatra", "karana"];
    return [...elevated, ...LIMB_ORDER.filter((l) => !elevated.includes(l))];
  }, [event]);

  const report = useMemo(() => {
    const heaviest = sortedLimbs.filter((l) => weights[l] === maxWeight);
    const strongHeaviest = heaviest.filter((l) => candidate.limbs[l] === "strong");
    const neutralHeaviest = heaviest.filter((l) => candidate.limbs[l] === "neutral");
    const weakHeaviest = heaviest.filter((l) => candidate.limbs[l] === "weak");

    const lighter = sortedLimbs.filter((l) => weights[l] < maxWeight);
    const weakLighter = lighter.filter((l) => candidate.limbs[l] === "weak");
    const strongLighter = lighter.filter((l) => candidate.limbs[l] === "strong");
    const neutralLighter = lighter.filter((l) => candidate.limbs[l] === "neutral");

    const strongHeaviestLabels = strongHeaviest.map((l) => LIMB_LABELS[l]);
    const weakHeaviestLabels = weakHeaviest.map((l) => LIMB_LABELS[l]);
    const neutralHeaviestLabels = neutralHeaviest.map((l) => LIMB_LABELS[l]);
    const weakLighterLabels = weakLighter.map((l) => LIMB_LABELS[l]);
    const neutralLighterLabels = neutralLighter.map((l) => LIMB_LABELS[l]);

    let text = "";
    if (strongHeaviest.length === heaviest.length) {
      text += `This candidate is strong on every heaviest-weighted limb for ${event.toLowerCase()} — ${joinList(strongHeaviestLabels)}.`;
    } else if (strongHeaviest.length > 0) {
      text += `This candidate is strong where ${event.toLowerCase()} weighs heaviest — ${joinList(strongHeaviestLabels)}.`;
      if (weakHeaviest.length > 0) {
        text += ` It is weak on a heaviest-weighted limb — ${joinList(weakHeaviestLabels)} — which matters more than a weak lighter limb.`;
      } else if (neutralHeaviest.length > 0) {
        text += ` It is only neutral on another heaviest-weighted limb — ${joinList(neutralHeaviestLabels)}.`;
      }
    } else if (weakHeaviest.length > 0) {
      text += `This candidate is weak on the heaviest-weighted limb(s) for ${event.toLowerCase()} — ${joinList(weakHeaviestLabels)} — so it is not a strong match even if lighter limbs look good.`;
    } else {
      text += `This candidate is neutral on the heaviest-weighted limbs for ${event.toLowerCase()} — ${joinList(neutralHeaviestLabels)}.`;
    }

    if (weakLighter.length > 0) {
      text += ` Its lighter-weighted limbs that are weak — ${joinList(weakLighterLabels)} — are honestly named but do not override the heaviest-weighted verdict.`;
    }
    if (strongLighter.length > 0) {
      text += ` Strong lighter limbs (${joinList(strongLighter.map((l) => LIMB_LABELS[l]))}) help, but they cannot compensate for a weak heaviest limb.`;
    }
    if (neutralLighter.length > 0 && weakLighter.length === 0 && strongLighter.length === 0) {
      text += ` The remaining limbs — ${joinList(neutralLighterLabels)} — are neutral and weighed lighter for this event.`;
    }

    if (event === "Surgery" && strongHeaviest.length >= 2) {
      text += " For surgery, these elevated limbs rise together on one shared 'incisive action' theme — not as unrelated coincidences.";
    }

    return { text, strongHeaviest, weakHeaviest, heaviest };
  }, [candidate, event, maxWeight, sortedLimbs, weights]);

  const reset = () => {
    setEvent("Marriage");
    setCandidateKey("meera-arjun-candidate-3");
  };

  return (
    <div data-interactive="muhurta-multi-overlay-screener" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Muhūrta multi-overlay screener</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Foundational screening plus event-specific weighting
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Select an event-type to load its limb-weighting table, then inspect a candidate limb-by-limb. The honest report names which limbs are driving the recommendation and which are merely neutral.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Event context</p>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Event type</label>
          <div style={{ position: "relative", marginBottom: "0.65rem" }}>
            <select value={event} onChange={(e) => setEvent(e.target.value as EventType)} style={selectStyle}>
              {EVENTS.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </div>

          <div style={{ padding: "0.55rem", borderRadius: 6, border: "1px solid " + PURPLE, background: PURPLE + "10" }}>
            <p style={{ margin: 0, color: PURPLE, fontWeight: 600 }}>
              <Scale size={14} style={{ verticalAlign: "text-bottom", marginRight: 6 }} aria-hidden="true" />
              Weighting source
            </p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
              <strong>{source.source}</strong> — {source.note}
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Candidate</p>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Loaded candidate</label>
          <div style={{ position: "relative", marginBottom: "0.55rem" }}>
            <select value={candidateKey} onChange={(e) => setCandidateKey(e.target.value)} style={selectStyle}>
              {Object.entries(CANDIDATES).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.82rem" }}>{candidate.dateNote}</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{candidate.detail}</p>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <p style={eyebrowStyle}>Limb weighting for {event.toLowerCase()}</p>
          <div style={{ display: "flex", gap: "0.65rem", fontSize: "0.78rem", color: INK_MUTED }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: PURPLE }} />
              Heaviest
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: BLUE }} />
              Intermediate
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: GOLD }} />
              Lighter
            </span>
          </div>
        </div>

        {event === "Surgery" && (
          <div style={{ marginBottom: "0.65rem", padding: "0.55rem", borderRadius: 6, border: "1px solid " + VERMILION, background: VERMILION + "10" }}>
            <p style={{ margin: 0, color: VERMILION, fontWeight: 600 }}>
              <Layers size={14} style={{ verticalAlign: "text-bottom", marginRight: 6 }} aria-hidden="true" />
              Shared incisive-action logic
            </p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
              Vāra, nakṣatra and karaṇa are elevated together by one theme — incisive, cutting action matches surgical action — not by three independent coincidences.
            </p>
          </div>
        )}

        <div style={{ display: "grid", gap: "0.55rem" }}>
          {sortedLimbs.map((limb) => {
            const weight = weights[limb];
            const tier = weightTier(weight);
            const status = candidate.limbs[limb];
            const color = statusColor(status);
            return (
              <div key={limb} style={{ display: "grid", gap: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                  <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{LIMB_LABELS[limb]}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>{tier.label}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.15rem 0.45rem",
                        borderRadius: 4,
                        background: color + "15",
                        color,
                        border: "1px solid " + color,
                      }}
                    >
                      {statusLabel(status)}
                    </span>
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#E8E0D3", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(weight / 3) * 100}%`,
                      height: "100%",
                      background: tier.color,
                      borderRadius: 4,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Honest weighted report</p>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <Info size={18} style={{ color: BLUE, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6 }}>{report.text}</p>
        </div>
      </section>
    </div>
  );
}

const cardStyle: CSSProperties = { background: SURFACE, border: "1px solid " + HAIRLINE, borderRadius: 8, padding: "0.9rem 1rem" };
const eyebrowStyle: CSSProperties = { color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 0.25rem" };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 600,
    padding: "0.35rem 0.65rem", borderRadius: 6, cursor: "pointer",
    border: "1px solid " + color, background: active ? color : "transparent", color: active ? "white" : color,
  };
}

const selectStyle: CSSProperties = {
  width: "100%", appearance: "none", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE,
  borderRadius: 6, padding: "0.4rem 0.55rem", fontSize: "0.88rem", fontWeight: 500,
};
