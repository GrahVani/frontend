"use client";

import { useMemo, useState } from "react";
import { BookOpen, GitBranch, Globe2, Layers3, MapPin, RotateCcw, Users } from "lucide-react";

const GOLD = "var(--gl-gold-on-cream, #A8821E)";
const GOLD_HEX = "#A8821E";
const BLUE = "#4F6FA8";
const GREEN = "#3A8C5A";
const RUST = "var(--gl-vermilion-on-cream, #A23A1E)";
const PLUM = "#7A3E4A";
const CARD = "var(--gl-card-surface-solid, #FFF9F0)";
const SOFT = "var(--gl-manuscript-cream, #F5EDD8)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.30))";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type View = "schools" | "streams" | "global" | "levels";

const SCHOOLS = [
  {
    id: "south",
    name: "South Indian",
    short: "South",
    center: "Tamil Nadu, Kerala, Andhra, Karnataka",
    languages: "Tamil, Malayalam, Telugu, Kannada, Sanskrit, English",
    color: "var(--gl-vermilion-on-cream, #A23A1E)",
    x: 58,
    y: 69,
    reach: "Broad reach",
    emphases: ["KP centre in Tamil Nadu", "Prasna Marga centre in Kerala", "Sanskrit-pundit lineages"],
    features: ["Classical textual emphasis", "Ritual and Sanskrit continuity", "Global KP training rooted here"],
    teachers: ["K.S. Krishnamurti", "Kerala Prasna Marga lineages", "South Indian Sanskrit teachers"],
  },
  {
    id: "north",
    name: "North Indian",
    short: "North",
    center: "Punjab, Delhi, UP, Bihar, Haryana",
    languages: "Hindi, Punjabi, Urdu, Sanskrit, English",
    color: BLUE,
    x: 46,
    y: 31,
    reach: "Broad reach",
    emphases: ["Lal Kitab centre in Punjab", "BVB Delhi institutional teaching", "Banaras Sanskrit lineages"],
    features: ["Hindi and Urdu accessibility", "Large institutional teaching", "Jaimini revival through Delhi networks"],
    teachers: ["Pandit Roop Chand Joshi", "K.N. Rao", "BVB Delhi teachers"],
  },
  {
    id: "bengal",
    name: "Bengali",
    short: "Bengal",
    center: "West Bengal, Bangladesh",
    languages: "Bengali, Sanskrit, English",
    color: GREEN,
    x: 67,
    y: 42,
    reach: "Concentrated",
    emphases: ["Parashari foundation", "Bengali-language teaching", "Regional commentary traditions"],
    features: ["Bengali cultural-religious framing", "Pre-Partition continuity", "Regionally concentrated practice"],
    teachers: ["Bengali pundit lineages", "Bengali translation traditions"],
  },
  {
    id: "gujarat",
    name: "Gujarati",
    short: "Gujarat",
    center: "Gujarat, Mumbai, diaspora",
    languages: "Gujarati, Sanskrit, English",
    color: GOLD,
    x: 36,
    y: 51,
    reach: "Concentrated",
    emphases: ["Parashari foundation", "Commercial consultation culture", "Mumbai practice networks"],
    features: ["Gujarati-medium teaching", "Commercial astrology integration", "Diaspora extension"],
    teachers: ["Gujarati teaching lineages", "Mumbai practitioner networks"],
  },
  {
    id: "maharashtra",
    name: "Maharashtrian",
    short: "Maharashtra",
    center: "Maharashtra, Goa",
    languages: "Marathi, Sanskrit, English",
    color: PLUM,
    x: 48,
    y: 58,
    reach: "Concentrated",
    emphases: ["Parashari foundation", "Pune Sanskrit-pundit centre", "Marathi teaching traditions"],
    features: ["Marathi-medium access", "Sanskrit learning centres", "Regionally concentrated practice"],
    teachers: ["Pune Sanskrit lineages", "Marathi teaching lineages"],
  },
  {
    id: "western",
    name: "Western-Vedic-fusion",
    short: "Western",
    center: "USA, UK, Europe, Australia, global English-medium contexts",
    languages: "English, selective Sanskrit",
    color: "#6A568E",
    x: 20,
    y: 25,
    reach: "Broad reach",
    emphases: ["English-medium teaching", "Jaimini revival via SJC", "Vedic astrology with Yoga/Ayurveda framing"],
    features: ["Cross-cultural translation", "Online global cohorts", "Modern accessibility outside Indian regions"],
    teachers: ["Sanjay Rath", "David Frawley", "Hart Defouw", "Robert Svoboda", "Komilla Sutton"],
  },
];

const STREAM_PATTERNS = [
  ["Parashari", "All six regional schools", GREEN],
  ["KP", "South Indian, especially Tamil Nadu", RUST],
  ["Lal Kitab", "North Indian, especially Punjab", BLUE],
  ["Prasna Marga", "South Indian, especially Kerala", GOLD_HEX],
  ["Jaimini revival", "BVB Delhi plus Western-Vedic-fusion", "#6A568E"],
];

const GLOBAL_LINKS = [
  ["Sanjay Rath SJC", "global English-medium students"],
  ["K.N. Rao / BVB Delhi", "pan-India and international learners"],
  ["Tamil Nadu KP teachers", "global KP students"],
  ["Punjabi Lal Kitab teachers", "Hindi/English online learners"],
  ["Western teachers", "direct India lineage engagement"],
];

const LEVELS = [
  ["Streams", "Doctrinal lineage: Parashari, Jaimini, KP, Lal Kitab"],
  ["Skandhas", "Primary topical scope: ganita, hora, samhita"],
  ["Sub-branches", "Finer topical work: jataka, prasna, muhurta, vastu, and more"],
  ["Regional schools", "Geographic, cultural-linguistic, and practitioner-community context"],
];

function RegionalMap({
  activeId,
  showStreams,
  showGlobal,
  onSelect,
}: {
  activeId: string;
  showStreams: boolean;
  showGlobal: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Schematic map of six Jyotisha regional schools" className="h-auto w-full">
      <defs>
        <filter id="regional-pin-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7A5E1E" floodOpacity="0.18" />
        </filter>
      </defs>
      <rect x="0" y="0" width="760" height="430" rx="8" fill={CARD} stroke={HAIRLINE} />
      <rect x="18" y="18" width="724" height="394" rx="7" fill={SOFT} opacity="0.42" />
      <path d="M384 86 C448 104 509 147 545 202 C584 260 566 326 506 354 C443 384 355 360 313 301 C270 238 287 149 384 86 Z" fill="rgba(156, 122, 47, 0.10)" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M367 83 C343 133 355 185 338 238 C324 283 338 336 379 365" fill="none" stroke="rgba(92, 74, 42, 0.28)" strokeDasharray="7 8" />
      <text x="392" y="218" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="700">
        Indian regional field
      </text>

      {showGlobal &&
        SCHOOLS.filter((school) => school.id !== "western").map((school) => {
          const west = SCHOOLS.find((item) => item.id === "western")!;
          return (
            <line
              key={school.id}
              x1={`${west.x}%`}
              y1={`${west.y}%`}
              x2={`${school.x}%`}
              y2={`${school.y}%`}
              stroke="rgba(79, 111, 168, 0.45)"
              strokeWidth="2"
              strokeDasharray="5 7"
            />
          );
        })}

      {SCHOOLS.map((school) => {
        const active = school.id === activeId;
        return (
          <g
            key={school.id}
            role="button"
            tabIndex={0}
            aria-label={`${school.name} regional school`}
            onClick={() => onSelect(school.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(school.id);
              }
            }}
            className="cursor-pointer"
          >
            <circle cx={`${school.x}%`} cy={`${school.y}%`} r={active ? 25 : 19} fill={active ? school.color : CARD} stroke={school.color} strokeWidth="3" filter={active ? "url(#regional-pin-shadow)" : undefined} />
            <text x={`${school.x}%`} y={`${school.y + 9}%`} textAnchor="middle" fill={active ? "#fff" : school.color} fontSize="11" fontWeight="800">
              {school.short}
            </text>
          </g>
        );
      })}

      {showStreams &&
        STREAM_PATTERNS.slice(1).map(([stream, place, color], index) => (
          <g key={stream}>
            <rect x={24} y={292 + index * 28} width="260" height="22" rx="5" fill="rgba(156, 122, 47, 0.09)" stroke="rgba(156, 122, 47, 0.18)" />
            <text x={36} y={307 + index * 28} fill={color} fontSize="12" fontWeight="800">
              {stream}
            </text>
            <text x={125} y={307 + index * 28} fill={INK_SECONDARY} fontSize="11">
              {place}
            </text>
          </g>
        ))}
    </svg>
  );
}

export function RegionalSchoolsExplorer() {
  const [activeId, setActiveId] = useState("south");
  const [view, setView] = useState<View>("schools");
  const activeSchool = useMemo(() => SCHOOLS.find((school) => school.id === activeId) ?? SCHOOLS[0], [activeId]);
  const showStreams = view === "streams";
  const showGlobal = view === "global";

  return (
    <div className="w-full" data-interactive="regional-schools-explorer" style={{ color: INK_PRIMARY }}>
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["schools", "Schools", <MapPin key="icon" size={15} />],
          ["streams", "Stream overlay", <GitBranch key="icon" size={15} />],
          ["global", "Global links", <Globe2 key="icon" size={15} />],
          ["levels", "Four levels", <Layers3 key="icon" size={15} />],
        ].map(([key, label, icon]) => (
          <button
            key={key as string}
            type="button"
            onClick={() => setView(key as View)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: view === key ? GOLD : "transparent",
              color: view === key ? "#FFF9F0" : INK_SECONDARY,
              border: view === key ? `1px solid ${GOLD}` : `1px solid transparent`,
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(330px,0.95fr)]">
        <section className="gl-surface-twilight-glass p-3" style={{ borderRadius: "8px" }}>
          <RegionalMap activeId={activeId} showStreams={showStreams} showGlobal={showGlobal} onSelect={setActiveId} />
        </section>

        <section className="space-y-4">
          {view !== "levels" ? (
            <>
              <div className="gl-surface-twilight-glass p-4" style={{ borderLeft: `3px solid ${activeSchool.color}`, borderRadius: "8px" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: activeSchool.color }}>
                      {activeSchool.name}
                    </h3>
                    <p className="text-sm" style={{ color: INK_SECONDARY }}>{activeSchool.center}</p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: "rgba(156, 122, 47, 0.12)", color: activeSchool.color, border: `1px solid ${HAIRLINE}` }}>
                    {activeSchool.reach}
                  </span>
                </div>

                <div className="mt-4 rounded p-3" style={{ backgroundColor: SOFT, border: `1px solid ${HAIRLINE}` }}>
                  <div className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: INK_MUTED }}>Languages</div>
                  <div className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{activeSchool.languages}</div>
                </div>

                <div className="mt-3 grid gap-2">
                  {activeSchool.emphases.map((item) => (
                    <div key={item} className="rounded p-3 text-sm font-semibold" style={{ backgroundColor: "rgba(156, 122, 47, 0.08)", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="gl-surface-twilight-glass p-4" style={{ borderRadius: "8px" }}>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Users size={16} style={{ color: GOLD }} />
                  Practitioner-community features
                </div>
                <div className="space-y-2">
                  {activeSchool.features.map((feature) => (
                    <div key={feature} className="rounded p-3 text-sm" style={{ backgroundColor: SOFT, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="gl-surface-twilight-glass p-4" style={{ borderRadius: "8px" }}>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <BookOpen size={16} style={{ color: BLUE }} />
                  Named teachers and lineage cues
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeSchool.teachers.map((teacher) => (
                    <span key={teacher} className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: "rgba(156, 122, 47, 0.10)", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                      {teacher}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="gl-surface-twilight-glass p-4" style={{ borderRadius: "8px" }}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Layers3 size={16} style={{ color: GREEN }} />
                Four complementary organisational levels
              </div>
              <div className="space-y-3">
                {LEVELS.map(([label, text], index) => (
                  <div key={label} className="rounded p-3" style={{ backgroundColor: index === 3 ? "rgba(58, 140, 90, 0.10)" : SOFT, border: index === 3 ? `1px solid rgba(58, 140, 90, 0.25)` : `1px solid ${HAIRLINE}`, borderLeft: index === 3 ? `3px solid ${GREEN}` : `3px solid ${HAIRLINE}` }}>
                    <div className="text-sm font-bold" style={{ color: index === 3 ? GREEN : INK_PRIMARY }}>{label}</div>
                    <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="gl-surface-twilight-glass mt-4 p-4" style={{ borderRadius: "8px" }}>
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.08em]" style={{ color: INK_MUTED }}>
          Cross-stream regional emphasis
        </div>
        <div className="grid gap-2 md:grid-cols-5">
          {STREAM_PATTERNS.map(([stream, school, color]) => (
            <div key={stream} className="rounded p-3" style={{ backgroundColor: CARD, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${color}` }}>
              <div className="text-sm font-bold" style={{ color }}>{stream}</div>
              <div className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>{school}</div>
            </div>
          ))}
        </div>
      </section>

      {view === "global" && (
        <section className="gl-surface-twilight-glass mt-4 p-4" style={{ borderRadius: "8px" }}>
          <div className="mb-3 text-sm font-semibold">Modern globalisation connections</div>
          <div className="grid gap-2 md:grid-cols-5">
            {GLOBAL_LINKS.map(([from, to]) => (
              <div key={from} className="rounded p-3" style={{ backgroundColor: CARD, border: `1px solid ${HAIRLINE}` }}>
                <div className="text-sm font-bold" style={{ color: BLUE }}>{from}</div>
                <div className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>{to}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => {
            setActiveId("south");
            setView("schools");
          }}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ backgroundColor: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>
    </div>
  );
}
