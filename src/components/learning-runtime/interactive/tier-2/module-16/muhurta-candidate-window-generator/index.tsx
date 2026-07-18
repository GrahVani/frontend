"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  BadgeCheck,

  CalendarDays,
  ChevronDown,
  Filter,
  RotateCcw,

} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const EVENTS = ["Marriage", "Gṛha-praveśa", "Business-launch", "Surgery", "Journey", "Saṁskāra"] as const;
type EventType = (typeof EVENTS)[number];

const ALL_DATES = [
  { date: "2026-11-01", day: "Sun", nak: "Mūla", cls: "Kroora" },
  { date: "2026-11-02", day: "Mon", nak: "Pūrvāṣāḍhā", cls: "Sthira" },
  { date: "2026-11-03", day: "Tue", nak: "Uttarāṣāḍhā", cls: "Sthira" },
  { date: "2026-11-04", day: "Wed", nak: "Śravaṇa", cls: "Cara" },
  { date: "2026-11-05", day: "Thu", nak: "Dhaniṣṭhā", cls: "Cara" },
  { date: "2026-11-06", day: "Fri", nak: "Uttarāṣāḍhā", cls: "Sthira" },
  { date: "2026-11-07", day: "Sat", nak: "Śatabhiṣaj", cls: "Cara" },
  { date: "2026-11-08", day: "Sun", nak: "Puṣya", cls: "Laghu" },
  { date: "2026-11-09", day: "Mon", nak: "Āśleṣā", cls: "Ugra" },
  { date: "2026-11-10", day: "Tue", nak: "Maghā", cls: "Ugra" },
  { date: "2026-11-11", day: "Wed", nak: "Rohiṇī", cls: "Sthira" },
  { date: "2026-11-12", day: "Thu", nak: "Mṛgaśīrṣa", cls: "Cara" },
  { date: "2026-11-13", day: "Fri", nak: "Ārdrā", cls: "Kroora" },
  { date: "2026-11-14", day: "Sat", nak: "Punarvasu", cls: "Cara" },
];

const FAVOURABLE: Record<EventType, string[]> = {
  Marriage: ["Sthira", "Laghu"],
  "Gṛha-praveśa": ["Sthira", "Cara"],
  "Business-launch": ["Sthira", "Laghu"],
  Surgery: ["Cara", "Laghu"],
  Journey: ["Cara", "Laghu"],
  Saṁskāra: ["Sthira", "Laghu"],
};

function stakesFor(event: EventType, scale: string) {
  if (event === "Marriage" || event === "Surgery") return { level: "High-stakes", color: VERMILION, note: "Near-always High-stakes; full five-stage pipeline warranted." };
  if (event === "Journey") return { level: "Medium-stakes", color: GOLD, note: "Typically Medium; pilgrimage or consequential relocation can rise to High." };
  if (event === "Gṛha-praveśa") {
    return scale === "first-entry"
      ? { level: "High-stakes", color: VERMILION, note: "First / Apūrva entry into new construction — High-stakes." }
      : { level: "Medium-stakes", color: GOLD, note: "Sa-pūrva re-entry or low-ceremony move — Medium-stakes." };
  }
  if (event === "Business-launch") {
    return scale === "substantial"
      ? { level: "High-stakes", color: VERMILION, note: "Substantial launch — High-stakes." }
      : { level: "Medium-stakes", color: GOLD, note: "Smaller venture — Medium-stakes." };
  }
  return { level: "Varies", color: GOLD, note: "Saṁskāra stakes depend on which of the 16; decide by scale, not category name." };
}

export function MuhurtaCandidateWindowGenerator() {
  const [event, setEvent] = useState<EventType>("Marriage");
  const [scale, setScale] = useState<string>("first-entry");
  const [rangeStart, setRangeStart] = useState("2026-11-01");
  const [rangeEnd, setRangeEnd] = useState("2026-11-15");
  const [weekendsOnly, setWeekendsOnly] = useState(false);
  const [includeWed11, setIncludeWed11] = useState(true);
  const [softPref, setSoftPref] = useState(false);

  const stakes = useMemo(() => stakesFor(event, scale), [event, scale]);

  const candidates = useMemo(() => {
    const favourable = FAVOURABLE[event];
    return ALL_DATES.filter((d) => {
      if (d.date < rangeStart || d.date > rangeEnd) return false;
      if (weekendsOnly && !["Sat", "Sun"].includes(d.day)) return false;
      if (d.date === "2026-11-11" && !includeWed11) return false;
      return favourable.includes(d.cls);
    });
  }, [event, rangeStart, rangeEnd, weekendsOnly, includeWed11]);

  const reset = () => {
    setEvent("Marriage");
    setScale("first-entry");
    setRangeStart("2026-11-01");
    setRangeEnd("2026-11-15");
    setWeekendsOnly(false);
    setIncludeWed11(true);
    setSoftPref(false);
  };

  return (
    <div data-interactive="muhurta-candidate-window-generator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Muhūrta candidate-window generator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              From event context to a genuine candidate set
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Separate hard constraints, soft preferences, and stakes-indicators. Then scan the bounded range for dates whose nakṣatra class is generically favourable for the event type.
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
              {EVENTS.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
          </div>

          {(event === "Gṛha-praveśa" || event === "Business-launch") && (
            <div style={{ position: "relative", marginBottom: "0.65rem" }}>
              <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Scale / variant</label>
              <select value={scale} onChange={(e) => setScale(e.target.value)} style={selectStyle}>
                {event === "Gṛha-praveśa" && (
                  <>
                    <option value="first-entry">First / Apūrva entry</option>
                    <option value="re-entry">Sa-pūrva re-entry</option>
                  </>
                )}
                {event === "Business-launch" && (
                  <>
                    <option value="substantial">Substantial launch</option>
                    <option value="small">Smaller venture</option>
                  </>
                )}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
            </div>
          )}

          <div style={{ padding: "0.55rem", borderRadius: 6, border: "1px solid " + stakes.color, background: stakes.color + "10" }}>
            <p style={{ margin: 0, color: stakes.color, fontWeight: 600 }}>Stakes: {stakes.level}</p>
            <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>{stakes.note}</p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Intake categories</p>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <CategoryCard title="Hard constraints" color={VERMILION} note="Venue, officiant, travel, work/school — bound the window before astrology." />
            <CategoryCard title="Soft preferences" color={GOLD} note="Preferred month, day-of-week, time-of-day — applied later, can yield." />
            <CategoryCard title="Stakes indicators" color={GREEN} note="Event type + scale/variant — feed Stage 1 classification." />
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hard-constraint filters</p>
        <div style={workbenchTwoColumnStyle}>
          <div>
            <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Date range</label>
            <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
              <input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} style={inputStyle} />
              <span style={{ color: INK_MUTED }}>to</span>
              <input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Practical limits</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <button type="button" aria-pressed={weekendsOnly} onClick={() => setWeekendsOnly((v) => !v)} style={buttonStyle(weekendsOnly, BLUE)}>
                <CalendarDays size={14} aria-hidden="true" />
                Weekends only
              </button>
              <button type="button" aria-pressed={includeWed11} onClick={() => setIncludeWed11((v) => !v)} style={buttonStyle(includeWed11, BLUE)}>
                <BadgeCheck size={14} aria-hidden="true" />
                Include 11 Nov
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.65rem" }}>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Soft preference</label>
          <button type="button" aria-pressed={softPref} onClick={() => setSoftPref((v) => !v)} style={buttonStyle(softPref, GOLD)}>
            <Filter size={14} aria-hidden="true" />
            {softPref ? "Prefer non-early-morning (not yet applied)" : "No soft preference applied"}
          </button>
          <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>
            Soft preferences are considered only after the astrological short list exists; they do not bound the initial window.
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Generated candidate window</p>
        {candidates.length === 0 ? (
          <div style={{ padding: "0.65rem", borderRadius: 6, border: "1px solid " + VERMILION, background: VERMILION + "10", color: VERMILION }}>
            No generically favourable nakṣatra dates in the bounded range. Present the least-weak option with its limiting factor named explicitly.
          </div>
        ) : (
          <>
            <p style={{ color: INK_SECONDARY, marginBottom: "0.55rem" }}>
              Found {candidates.length} candidate(s) whose nakṣatra class is favourable for {event.toLowerCase()}. These now move to Stages 3-4.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.55rem" }}>
              {candidates.map((c) => (
                <div key={c.date} style={{ border: "1px solid " + GREEN, borderRadius: 6, padding: "0.55rem", background: GREEN + "10" }}>
                  <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>{c.day} {c.date.slice(5)}</p>
                  <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 600 }}>{c.nak}</p>
                  <p style={{ margin: "0.1rem 0 0", color: GREEN, fontSize: "0.8rem", fontWeight: 600 }}>{c.cls}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function CategoryCard({ title, color, note }: { title: string; color: string; note: string }) {
  return (
    <div style={{ border: "1px solid " + color, borderRadius: 6, padding: "0.55rem", background: color + "10" }}>
      <p style={{ margin: 0, color, fontWeight: 600, fontSize: "0.9rem" }}>{title}</p>
      <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.4 }}>{note}</p>
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
  borderRadius: 6, padding: "0.4rem 1.6rem 0.4rem 0.55rem", fontSize: "0.88rem", fontWeight: 500,
};

const inputStyle: CSSProperties = {
  background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE, borderRadius: 6,
  padding: "0.4rem 0.55rem", fontSize: "0.88rem", fontWeight: 500,
};
