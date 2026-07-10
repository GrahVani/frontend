"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, GitBranch, Globe2, Layers3, MapPin, RotateCcw, Users } from "lucide-react";

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

type School = (typeof SCHOOLS)[number];

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

const STREAM_DETAILS: Record<string, string[]> = {
  Parashari: ["south", "north", "bengal", "gujarat", "maharashtra", "western"],
  KP: ["south"],
  "Lal Kitab": ["north"],
  "Prasna Marga": ["south"],
  "Jaimini revival": ["north", "western"],
};

const DIAGRAM_NODES: Record<string, { x: number; y: number }> = {
  western: { x: 48, y: 72 },
  north: { x: 292, y: 52 },
  bengal: { x: 536, y: 92 },
  gujarat: { x: 78, y: 276 },
  maharashtra: { x: 294, y: 314 },
  south: { x: 536, y: 266 },
};

function ViewButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
      style={{
        backgroundColor: active ? GOLD : "rgba(255, 249, 240, 0.72)",
        color: active ? "#FFF9F0" : INK_SECONDARY,
        border: active ? `1px solid ${GOLD}` : `1px solid ${HAIRLINE}`,
        boxShadow: active ? "0 8px 20px rgba(122, 94, 30, 0.18)" : "none",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SchoolPicker({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {SCHOOLS.map((school) => {
        const active = school.id === activeId;
        return (
          <button
            key={school.id}
            type="button"
            onClick={() => onSelect(school.id)}
            className="flex min-h-12 items-center gap-2 rounded px-3 py-2 text-left text-xs font-bold transition"
            style={{
              backgroundColor: active ? "rgba(255, 249, 240, 0.95)" : "rgba(255, 249, 240, 0.58)",
              border: active ? `1px solid ${school.color}` : `1px solid ${HAIRLINE}`,
              color: active ? school.color : INK_SECONDARY,
              boxShadow: active ? "0 8px 18px rgba(122, 94, 30, 0.12)" : "none",
            }}
            aria-pressed={active}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: school.color }} />
            <span className="leading-tight">{school.short}</span>
          </button>
        );
      })}
    </div>
  );
}

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
  const center = { x: 380, y: 206 };
  const activeNode = DIAGRAM_NODES[activeId] ?? DIAGRAM_NODES.south;
  const westernNode = DIAGRAM_NODES.western;

  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Network diagram of six Jyotisha regional schools" className="h-auto w-full">
      <defs>
        <filter id="regional-pin-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7A5E1E" floodOpacity="0.18" />
        </filter>
        <filter id="regional-card-shadow" x="-15%" y="-25%" width="130%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#7A5E1E" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="760" height="430" rx="8" fill={CARD} stroke={HAIRLINE} />
      <rect x="18" y="18" width="724" height="394" rx="7" fill={SOFT} opacity="0.42" />

      {showGlobal &&
        SCHOOLS.filter((school) => school.id !== "western").map((school) => {
          const node = DIAGRAM_NODES[school.id];
          return (
            <line
              key={school.id}
              x1={westernNode.x + 72}
              y1={westernNode.y + 29}
              x2={node.x + 72}
              y2={node.y + 29}
              stroke="rgba(79, 111, 168, 0.45)"
              strokeWidth="2.5"
              strokeDasharray="5 7"
            />
          );
        })}

      {SCHOOLS.map((school) => {
        const node = DIAGRAM_NODES[school.id];
        return (
          <line
            key={`field-${school.id}`}
            x1={center.x}
            y1={center.y}
            x2={node.x + 72}
            y2={node.y + 29}
            stroke={school.id === activeId ? school.color : "rgba(156, 122, 47, 0.22)"}
            strokeWidth={school.id === activeId ? 3 : 1.5}
          />
        );
      })}

      <g filter="url(#regional-card-shadow)">
        <circle cx={center.x} cy={center.y} r="76" fill="rgba(255, 249, 240, 0.92)" stroke={HAIRLINE} strokeWidth="1.5" />
        <circle cx={center.x} cy={center.y} r="49" fill="rgba(156, 122, 47, 0.09)" stroke="rgba(156, 122, 47, 0.22)" />
        <text x={center.x} y={center.y - 10} textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="800">
          Regional
        </text>
        <text x={center.x} y={center.y + 10} textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="800">
          practice field
        </text>
        <text x={center.x} y={center.y + 31} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="700">
          schools + lineages
        </text>
      </g>

      <line x1={center.x} y1={center.y} x2={activeNode.x + 72} y2={activeNode.y + 29} stroke={GOLD_HEX} strokeWidth="5" strokeLinecap="round" opacity="0.38" />

      {SCHOOLS.map((school) => {
        const active = school.id === activeId;
        const node = DIAGRAM_NODES[school.id];
        const linkedStreams = STREAM_PATTERNS.filter(([stream]) => STREAM_DETAILS[stream]?.includes(school.id)).map(([stream]) => stream);
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
            <rect
              x={node.x}
              y={node.y}
              width="144"
              height="58"
              rx="8"
              fill={active ? "rgba(255, 249, 240, 0.98)" : "rgba(255, 249, 240, 0.82)"}
              stroke={school.color}
              strokeWidth={active ? 2.5 : 1.5}
              filter={active ? "url(#regional-pin-shadow)" : undefined}
            />
            <circle cx={node.x + 20} cy={node.y + 22} r={active ? 8 : 6} fill={school.color} />
            <text x={node.x + 36} y={node.y + 25} fill={school.color} fontSize="14" fontWeight="900">
              {school.short}
            </text>
            <text x={node.x + 18} y={node.y + 45} fill={INK_SECONDARY} fontSize="10.5" fontWeight="700">
              {school.reach}
            </text>
            {showStreams && (
              <text x={node.x + 126} y={node.y + 45} textAnchor="end" fill={school.color} fontSize="10.5" fontWeight="900">
                {linkedStreams.length}
              </text>
            )}
          </g>
        );
      })}

      {showStreams &&
        STREAM_PATTERNS.map(([stream, place, color], index) => (
          <g key={stream}>
            <rect x={70 + index * 124} y={372} width="112" height="26" rx="13" fill="rgba(255, 249, 240, 0.82)" stroke={color} />
            <text x={126 + index * 124} y={389} textAnchor="middle" fill={color} fontSize="10.5" fontWeight="900">
              {stream}
            </text>
            <title>{place}</title>
          </g>
        ))}
    </svg>
  );
}

function LevelStack() {
  return (
    <div className="gl-surface-twilight-glass p-4" style={{ borderRadius: "8px" }}>
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Layers3 size={16} style={{ color: GREEN }} />
        Four complementary organisational levels
      </div>
      <div className="grid gap-3">
        {LEVELS.map(([label, text], index) => {
          const active = index === 3;
          return (
            <div
              key={label}
              className="grid gap-2 rounded p-3 sm:grid-cols-[150px_minmax(0,1fr)]"
              style={{
                backgroundColor: active ? "rgba(58, 140, 90, 0.10)" : SOFT,
                border: active ? `1px solid rgba(58, 140, 90, 0.25)` : `1px solid ${HAIRLINE}`,
                borderLeft: active ? `4px solid ${GREEN}` : `4px solid ${HAIRLINE}`,
              }}
            >
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: active ? GREEN : INK_PRIMARY }}>
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs"
                  style={{ backgroundColor: active ? "rgba(58, 140, 90, 0.16)" : "rgba(156, 122, 47, 0.12)" }}
                >
                  {index + 1}
                </span>
                {label}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                {text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SchoolSummary({ school }: { school: School }) {
  return (
    <div className="gl-surface-twilight-glass p-4" style={{ borderLeft: `3px solid ${school.color}`, borderRadius: "8px" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold sm:text-2xl" style={{ color: school.color }}>
            {school.name}
          </h3>
          <p className="text-sm" style={{ color: INK_SECONDARY }}>
            {school.center}
          </p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: "rgba(156, 122, 47, 0.12)", color: school.color, border: `1px solid ${HAIRLINE}` }}>
          {school.reach}
        </span>
      </div>

      <div className="mt-4 rounded p-3" style={{ backgroundColor: SOFT, border: `1px solid ${HAIRLINE}` }}>
        <div className="text-xs font-bold uppercase" style={{ color: INK_MUTED }}>
          Languages
        </div>
        <div className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
          {school.languages}
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        {school.emphases.map((item) => (
          <div key={item} className="rounded p-3 text-sm font-semibold" style={{ backgroundColor: "rgba(156, 122, 47, 0.08)", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailCards({ school }: { school: School }) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div className="gl-surface-twilight-glass p-4" style={{ borderRadius: "8px" }}>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Users size={16} style={{ color: GOLD }} />
          Practitioner-community features
        </div>
        <div className="space-y-2">
          {school.features.map((feature) => (
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
          {school.teachers.map((teacher) => (
            <span key={teacher} className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: "rgba(156, 122, 47, 0.10)", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
              {teacher}
            </span>
          ))}
        </div>
      </div>
    </div>
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
          <ViewButton
            key={key as string}
            active={view === key}
            icon={icon}
            label={label as string}
            onClick={() => setView(key as View)}
          />
        ))}
      </div>

      {view === "levels" ? (
        <LevelStack />
      ) : (
        <>
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(330px,0.95fr)]">
            <section className="gl-surface-twilight-glass p-3" style={{ borderRadius: "8px" }}>
              <RegionalMap activeId={activeId} showStreams={showStreams} showGlobal={showGlobal} onSelect={setActiveId} />
              <div className="mt-3">
                <SchoolPicker activeId={activeId} onSelect={setActiveId} />
              </div>
            </section>

            <section className="space-y-4">
              <SchoolSummary school={activeSchool} />
            </section>
          </div>

          <DetailCards school={activeSchool} />

          <section className="gl-surface-twilight-glass mt-4 p-4" style={{ borderRadius: "8px" }}>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase" style={{ color: INK_MUTED }}>
              <GitBranch size={15} style={{ color: GOLD }} />
              Cross-stream regional emphasis
            </div>
            <div className="grid gap-2 md:grid-cols-5">
              {STREAM_PATTERNS.map(([stream, school, color]) => {
                const selected = STREAM_DETAILS[stream]?.includes(activeId) ?? false;
                return (
                  <div
                    key={stream}
                    className="rounded p-3"
                    style={{
                      backgroundColor: selected ? "rgba(58, 140, 90, 0.09)" : CARD,
                      border: selected ? `1px solid rgba(58, 140, 90, 0.28)` : `1px solid ${HAIRLINE}`,
                      borderLeft: `3px solid ${selected ? GREEN : color}`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: selected ? GREEN : color }}>
                      {selected && <CheckCircle2 size={14} />}
                      {stream}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                      {school}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

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
