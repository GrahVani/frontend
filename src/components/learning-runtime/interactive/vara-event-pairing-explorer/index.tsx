"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

interface EventCategory {
  key: string;
  label: string;
  best: string[];
  good: string[];
  avoid: string[];
  reasoning: string;
}

const EVENTS: EventCategory[] = [
  {
    key: "marriage",
    label: "Marriage",
    best: ["Friday (Sukra)", "Wednesday (Budha)"],
    good: ["Sunday (Surya)", "Thursday (Guru)"],
    avoid: ["Tuesday (Mangala)", "Saturday (Sani)"],
    reasoning: "Venus (Sukra) governs union and pleasure; Mercury (Budha) brings communication. Mars brings conflict and Saturn delays.",
  },
  {
    key: "travel",
    label: "Travel",
    best: ["Sunday (Surya)", "Wednesday (Budha)", "Saturday (Sani)"],
    good: ["Friday (Sukra)", "Thursday (Guru)"],
    avoid: ["Monday (Candra)", "Tuesday (Mangala)"],
    reasoning: "Sun gives clear direction; Mercury rules movement. Moon causes emotional instability; Mars risks accidents.",
  },
  {
    key: "medical",
    label: "Medical",
    best: ["Monday (Candra)", "Wednesday (Budha)"],
    good: ["Thursday (Guru)", "Friday (Sukra)"],
    avoid: ["Tuesday (Mangala)", "Saturday (Sani)"],
    reasoning: "Moon governs fluids and healing; Mercury rules medicine. Mars causes bleeding and Saturn brings chronicity.",
  },
  {
    key: "legal",
    label: "Legal",
    best: ["Thursday (Guru)", "Sunday (Surya)"],
    good: ["Wednesday (Budha)", "Friday (Sukra)"],
    avoid: ["Saturday (Sani)", "Tuesday (Mangala)"],
    reasoning: "Jupiter is the natural judge; Sun is authority. Saturn delays justice; Mars provokes disputes.",
  },
  {
    key: "education",
    label: "Education",
    best: ["Wednesday (Budha)", "Thursday (Guru)", "Friday (Sukra)"],
    good: ["Sunday (Surya)", "Monday (Candra)"],
    avoid: ["Saturday (Sani)", "Tuesday (Mangala)"],
    reasoning: "Mercury is learning; Jupiter is wisdom; Venus is arts. Saturn obstructs and Mars distracts.",
  },
  {
    key: "business",
    label: "Business",
    best: ["Wednesday (Budha)", "Friday (Sukra)", "Thursday (Guru)"],
    good: ["Sunday (Surya)", "Monday (Candra)"],
    avoid: ["Saturday (Sani)", "Tuesday (Mangala)"],
    reasoning: "Mercury governs commerce; Venus wealth; Jupiter expansion. Saturn causes losses; Mars conflicts.",
  },
  {
    key: "spiritual",
    label: "Spiritual",
    best: ["Thursday (Guru)", "Monday (Candra)", "Saturday (Sani)"],
    good: ["Sunday (Surya)", "Friday (Sukra)"],
    avoid: ["Tuesday (Mangala)", "Wednesday (Budha)"],
    reasoning: "Jupiter is dharma; Moon devotion; Saturn austerity and renunciation. Mars is too aggressive for subtle practices.",
  },
];

const VARA_GRID = [
  { day: "Sunday", lord: "Surya", symbol: "☉", quality: "Mixed", best: ["Leadership", "Travel", "Legal"], avoid: ["Subtle work", "Water rituals"], color: "var(--gl-graha-surya)" },
  { day: "Monday", lord: "Candra", symbol: "☽", quality: "Gentle", best: ["Medical", "Spiritual", "Commerce"], avoid: ["Conflict", "Travel"], color: "var(--gl-graha-candra)" },
  { day: "Tuesday", lord: "Mangala", symbol: "♂", quality: "Aggressive", best: ["Athletics", "War", "Surgery"], avoid: ["Marriage", "Business", "Legal"], color: "var(--gl-graha-mangala)" },
  { day: "Wednesday", lord: "Budha", symbol: "☿", quality: "Balanced", best: ["Education", "Business", "Marriage", "Medical"], avoid: ["Heavy labour"], color: "var(--gl-graha-budha)" },
  { day: "Thursday", lord: "Guru", symbol: "♃", quality: "Auspicious", best: ["Education", "Legal", "Business", "Spiritual"], avoid: ["Deceitful acts"], color: "var(--gl-graha-guru)" },
  { day: "Friday", lord: "Sukra", symbol: "♀", quality: "Pleasant", best: ["Marriage", "Business", "Education", "Arts"], avoid: ["Conflict", "Surgery"], color: "var(--gl-graha-shukra)" },
  { day: "Saturday", lord: "Sani", symbol: "♄", quality: "Heavy", best: ["Austerity", "Property", "Spiritual"], avoid: ["Marriage", "Medical", "Business", "Legal"], color: "var(--gl-graha-shani)" },
];

const FRIENDSHIP: Record<string, string[]> = {
  Surya: ["Candra", "Mangala", "Guru"],
  Candra: ["Surya", "Budha"],
  Mangala: ["Surya", "Candra", "Guru"],
  Budha: ["Surya", "Sukra"],
  Guru: ["Surya", "Mangala", "Candra"],
  Sukra: ["Budha", "Sani"],
  Sani: ["Budha", "Sukra"],
};

const ENMITY: Record<string, string[]> = {
  Surya: ["Sani", "Sukra"],
  Candra: ["Sani", "Mangala"],
  Mangala: ["Budha", "Sani"],
  Budha: ["Candra", "Mangala"],
  Guru: ["Sukra", "Budha"],
  Sukra: ["Surya", "Mangala"],
  Sani: ["Surya", "Candra", "Mangala"],
};

const GRAHA_LIST = ["Surya", "Candra", "Mangala", "Budha", "Guru", "Sukra", "Sani"];
const GRAHA_COLORS: Record<string, string> = {
  Surya: "var(--gl-graha-surya)",
  Candra: "var(--gl-graha-candra)",
  Mangala: "var(--gl-graha-mangala)",
  Budha: "var(--gl-graha-budha)",
  Guru: "var(--gl-graha-guru)",
  Sukra: "var(--gl-graha-shukra)",
  Sani: "var(--gl-graha-shani)",
};

export function VaraEventPairingExplorer() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [hoverGraha, setHoverGraha] = useState<string | null>(null);

  const eventData = EVENTS.find((e) => e.key === selectedEvent);

  return (
    <div className="w-full" style={{ background: "var(--gl-surface-card, var(--gl-card-surface))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "24px" }} data-interactive="vara-event-pairing-explorer">
      <div className="mb-5">
        <h2 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Vara-Event Pairing Explorer</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Which weekday is best for which event — Muhurta pairing guide
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {EVENTS.map((evt) => (
          <button key={evt.key} onClick={() => setSelectedEvent(evt.key)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: selectedEvent === evt.key ? "var(--gl-gold-accent)" : "var(--gl-card-surface-solid, #FFF9F0)", color: selectedEvent === evt.key ? "#fff" : "var(--gl-ink-primary)", border: "1px solid var(--gl-gold-hairline)" }}>
            {evt.label}
          </button>
        ))}
      </div>

      {eventData && (
        <div className="rounded-xl p-5 mb-6" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--gl-ink-primary)" }}>{eventData.label}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#4A7C59" }}>Best Varas</p>
              {eventData.best.map((b) => <p key={b} className="text-sm" style={{ color: "var(--gl-ink-primary)" }}>{b}</p>)}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#7A5E1E" }}>Good Varas</p>
              {eventData.good.map((g) => <p key={g} className="text-sm" style={{ color: "var(--gl-ink-primary)" }}>{g}</p>)}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#8B3A3A" }}>Avoid</p>
              {eventData.avoid.map((a) => <p key={a} className="text-sm" style={{ color: "var(--gl-ink-primary)" }}>{a}</p>)}
            </div>
          </div>
          <p className="text-xs italic" style={{ color: "var(--gl-ink-muted)" }}>{eventData.reasoning}</p>
        </div>
      )}

      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--gl-gold-accent)" }}>Vara Reference Grid</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {VARA_GRID.map((v) => (
          <div key={v.day} className="rounded-lg p-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg" style={{ color: v.color }}>{v.symbol}</span>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{v.day}</div>
                <div className="text-[10px]" style={{ color: "var(--gl-ink-muted)" }}><IAST>{v.lord}</IAST> · {v.quality}</div>
              </div>
            </div>
            <div className="text-xs mb-1" style={{ color: "#4A7C59" }}>
              <strong>Best:</strong> {v.best.join(", ")}
            </div>
            <div className="text-xs" style={{ color: "#8B3A3A" }}>
              <strong>Avoid:</strong> {v.avoid.join(", ")}
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--gl-gold-accent)" }}>Planetary Relationships</h3>
      <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
        <p className="text-xs mb-4" style={{ color: "var(--gl-ink-muted)" }}>
          Hover over a planet to see its friends (green) and enemies (red).
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {GRAHA_LIST.map((g) => (
            <button key={g} className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all" style={{ background: hoverGraha === g ? `${GRAHA_COLORS[g]}18` : "transparent", border: hoverGraha === g ? `1.5px solid ${GRAHA_COLORS[g]}` : "1px solid var(--gl-gold-hairline)" }} onMouseEnter={() => setHoverGraha(g)} onMouseLeave={() => setHoverGraha(null)}>
              <span className="text-xl font-bold" style={{ color: GRAHA_COLORS[g] }}>
                {VARA_GRID.find((v) => v.lord === g)?.symbol}
              </span>
              <span className="text-[10px] font-semibold" style={{ color: "var(--gl-ink-secondary)" }}>
                <IAST>{g}</IAST>
              </span>
            </button>
          ))}
        </div>

        {hoverGraha && (
          <div className="flex flex-col sm:flex-row gap-4 text-xs">
            <div className="flex-1 rounded-lg p-3" style={{ background: "rgba(74,124,89,0.08)", border: "1px solid rgba(74,124,89,0.25)" }}>
              <p className="font-bold mb-1" style={{ color: "#4A7C59" }}>Friends of <IAST>{hoverGraha}</IAST></p>
              <p style={{ color: "var(--gl-ink-secondary)" }}>
                {FRIENDSHIP[hoverGraha].map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 mr-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: GRAHA_COLORS[f] }} />
                    <IAST>{f}</IAST>
                  </span>
                ))}
              </p>
            </div>
            <div className="flex-1 rounded-lg p-3" style={{ background: "rgba(139,58,58,0.08)", border: "1px solid rgba(139,58,58,0.25)" }}>
              <p className="font-bold mb-1" style={{ color: "#8B3A3A" }}>Enemies of <IAST>{hoverGraha}</IAST></p>
              <p style={{ color: "var(--gl-ink-secondary)" }}>
                {ENMITY[hoverGraha].map((e) => (
                  <span key={e} className="inline-flex items-center gap-1 mr-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: GRAHA_COLORS[e] }} />
                    <IAST>{e}</IAST>
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
