"use client";

import { useMemo, useState } from "react";
import { BookOpen, GitBranch, GraduationCap, Layers3, Network, RotateCcw, Users } from "lucide-react";

const GOLD = "var(--gl-gold-on-cream, #A8821E)";
const CARD = "var(--gl-card-surface-solid, #FFF9F0)";
const SOFT = "var(--gl-manuscript-cream, #F5EDD8)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.30))";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type View = "lineages" | "streams" | "regions" | "engagement";

const LINEAGES = [
  {
    id: "bvb",
    short: "BVB",
    name: "BVB Delhi",
    founder: "K.N. Rao within Bharatiya Vidya Bhavan",
    region: "North Indian, Delhi centre",
    reach: "Broad reach",
    color: "#4F6FA8",
    x: 45,
    y: 31,
    streams: ["Parashari strong", "Jaimini revival strong"],
    infrastructure: ["Multi-year institutional programs", "Indian-context Hindi/English teaching", "Second-generation BVB teachers"],
    features: ["Empirical chart-research emphasis", "Jaimini revival through Chara Dasha teaching", "Institutional practitioner network"],
  },
  {
    id: "sjc",
    short: "SJC",
    name: "Sri Jagannath Center",
    founder: "Sanjay Rath",
    region: "Western-Vedic-fusion plus Indian engagement",
    reach: "Broad reach",
    color: "var(--gl-vermilion-on-cream, #A23A1E)",
    x: 31,
    y: 24,
    streams: ["Parashari strong", "Jaimini revival strong", "KP/Lal Kitab selective"],
    infrastructure: ["PJC structured course", "Global branches", "Online and in-person programs"],
    features: ["Global Jaimini revival centre", "Structured multi-level training", "Cross-stream references without collapse"],
  },
  {
    id: "kp",
    short: "KP",
    name: "KP Teaching Lineages",
    founder: "K.S. Krishnamurti and direct-disciple lines",
    region: "South Indian, Tamil Nadu centre",
    reach: "Broad reach",
    color: "#3A6F8C",
    x: 61,
    y: 69,
    streams: ["KP centre", "Parashari moderate"],
    infrastructure: ["KP Reader I-VI", "Subramaniam, Hariharan, Tin Win lines", "KP publications and conferences"],
    features: ["Multiple parallel sub-lineages", "Ruling planet and sub-lord precision", "Tamil Nadu-rooted global training"],
  },
  {
    id: "lal",
    short: "Lal",
    name: "Lal Kitab Regional Lineages",
    founder: "Pandit Roop Chand Joshi and regional teachers",
    region: "North Indian, Punjab centre",
    reach: "Broad reach",
    color: "#7A3E4A",
    x: 35,
    y: 42,
    streams: ["Lal Kitab centre", "Parashari selective"],
    infrastructure: ["Urdu primary corpus", "Hindi/Punjabi commentary lines", "Regional practitioner teachers"],
    features: ["Remedial framework transmission", "Punjabi/North-Indian cultural embedding", "Diaspora extension"],
  },
  {
    id: "aivs",
    short: "AIVS",
    name: "American Institute of Vedic Studies",
    founder: "David Frawley",
    region: "Western-Vedic-fusion, USA centre",
    reach: "Broad reach",
    color: "#3A8C5A",
    x: 20,
    y: 55,
    streams: ["Parashari strong", "Jaimini/KP light"],
    infrastructure: ["AIVS courses", "Books across Jyotisha, Ayurveda, Yoga", "Global online learners"],
    features: ["Vedic-tradition integration", "Cross-cultural accessibility", "Astrology taught in broader Vedic frame"],
  },
  {
    id: "defouw",
    short: "D/S",
    name: "Defouw-Svoboda",
    founder: "Hart Defouw and Robert Svoboda",
    region: "Western-Vedic-fusion, USA and cross-regional",
    reach: "Broad reach",
    color: "#9C7A2F",
    x: 24,
    y: 72,
    streams: ["Parashari strong", "Jaimini moderate"],
    infrastructure: ["Light on Life", "Courses and workshops", "English-medium synthesis"],
    features: ["Introductory English corpus", "Practical Parashari framing", "Widely used in Western teaching contexts"],
  },
  {
    id: "sutton",
    short: "Sutton",
    name: "Komilla Sutton",
    founder: "Komilla Sutton",
    region: "Western-Vedic-fusion, UK and Europe",
    reach: "Concentrated",
    color: "#7A5E1E",
    x: 20,
    y: 37,
    streams: ["Parashari strong", "Jaimini moderate"],
    infrastructure: ["UK/European courses", "Published teaching corpus", "Workshops"],
    features: ["European-context accessibility", "Parashari plus selective Jaimini", "Cross-cultural teaching style"],
  },
  {
    id: "pundit",
    short: "Pundit",
    name: "Sanskrit-pundit Regional Lineages",
    founder: "Multi-generational teacher-student succession",
    region: "Distributed across Indian regional schools",
    reach: "Regional reach",
    color: "#6F6656",
    x: 58,
    y: 49,
    streams: ["Classical Parashari strong", "Jaimini moderate"],
    infrastructure: ["Regional teacher-student succession", "Sanskrit and regional-language teaching", "Community recognition"],
    features: ["No single modern founder", "Deep classical textual continuity", "Differently structured but real lineage form"],
  },
];

const PATTERNS = [
  ["Cross-region", "SJC, KP, AIVS, Defouw-Svoboda, and Sutton reach students beyond their origin context."],
  ["Multi-stream", "BVB and SJC teach Parashari with substantial Jaimini revival emphasis."],
  ["Practitioner mobility", "Modern learners often combine foundational, intermediate, and specialised training across lineages."],
];

function NetworkSvg({
  activeId,
  showStreams,
  showRegions,
  onSelect,
}: {
  activeId: string;
  showStreams: boolean;
  showRegions: boolean;
  onSelect: (id: string) => void;
}) {
  const active = LINEAGES.find((lineage) => lineage.id === activeId) ?? LINEAGES[0];

  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Network of eight modern Jyotisha lineage threads" className="h-auto w-full">
      <defs>
        <filter id="lineage-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7A5E1E" floodOpacity="0.18" />
        </filter>
      </defs>
      <rect x="0" y="0" width="760" height="430" rx="8" fill={CARD} stroke={HAIRLINE} />
      <rect x="18" y="18" width="724" height="394" rx="7" fill={SOFT} opacity="0.45" />

      {LINEAGES.filter((lineage) => lineage.id !== activeId).map((lineage) => (
        <line
          key={lineage.id}
          x1={`${active.x}%`}
          y1={`${active.y}%`}
          x2={`${lineage.x}%`}
          y2={`${lineage.y}%`}
          stroke={showRegions ? "rgba(156, 122, 47, 0.30)" : "rgba(92, 74, 42, 0.18)"}
          strokeWidth={showRegions ? 2 : 1}
          strokeDasharray={showRegions ? "6 7" : undefined}
        />
      ))}

      {showStreams && (
        <g>
          <rect x="470" y="42" width="250" height="112" rx="8" fill="rgba(156, 122, 47, 0.09)" stroke={HAIRLINE} />
          <text x="490" y="68" fill={GOLD} fontSize="13" fontWeight="800">Stream emphasis overlay</text>
          <text x="490" y="94" fill={INK_SECONDARY} fontSize="12">KP: KP lineages</text>
          <text x="490" y="116" fill={INK_SECONDARY} fontSize="12">Lal Kitab: Punjabi/North lines</text>
          <text x="490" y="138" fill={INK_SECONDARY} fontSize="12">Jaimini revival: BVB + SJC</text>
        </g>
      )}

      {LINEAGES.map((lineage) => {
        const isActive = lineage.id === activeId;
        return (
          <g
            key={lineage.id}
            role="button"
            tabIndex={0}
            aria-label={`${lineage.name} lineage`}
            onClick={() => onSelect(lineage.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(lineage.id);
              }
            }}
            className="cursor-pointer"
          >
            <circle cx={`${lineage.x}%`} cy={`${lineage.y}%`} r={isActive ? 28 : 21} fill={isActive ? lineage.color : CARD} stroke={lineage.color} strokeWidth="3" filter={isActive ? "url(#lineage-shadow)" : undefined} />
            <text x={`${lineage.x}%`} y={`${lineage.y + 9}%`} textAnchor="middle" fill={isActive ? "#FFF9F0" : lineage.color} fontSize="11" fontWeight="800">
              {lineage.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineageThreadsNetworkExplorer() {
  const [activeId, setActiveId] = useState("bvb");
  const [view, setView] = useState<View>("lineages");
  const active = useMemo(() => LINEAGES.find((lineage) => lineage.id === activeId) ?? LINEAGES[0], [activeId]);

  return (
    <div className="w-full" data-interactive="lineage-threads-network-explorer" style={{ color: INK_PRIMARY }}>
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["lineages", "Lineages", <Network key="icon" size={15} />],
          ["streams", "Stream overlay", <GitBranch key="icon" size={15} />],
          ["regions", "Regional reach", <Layers3 key="icon" size={15} />],
          ["engagement", "Engagement", <GraduationCap key="icon" size={15} />],
        ].map(([key, label, icon]) => (
          <button
            key={key as string}
            type="button"
            onClick={() => setView(key as View)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: view === key ? GOLD : "transparent",
              color: view === key ? "#FFF9F0" : INK_SECONDARY,
              border: view === key ? `1px solid ${GOLD}` : "1px solid transparent",
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(330px,0.95fr)]">
        <section className="gl-surface-twilight-glass p-3" style={{ borderRadius: "8px" }}>
          <NetworkSvg activeId={activeId} showStreams={view === "streams"} showRegions={view === "regions"} onSelect={setActiveId} />
        </section>

        <section className="space-y-4">
          {view !== "engagement" ? (
            <>
              <div className="gl-surface-twilight-glass p-4" style={{ borderLeft: `3px solid ${active.color}`, borderRadius: "8px" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: active.color }}>{active.name}</h3>
                    <p className="text-sm" style={{ color: INK_SECONDARY }}>{active.region}</p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: "rgba(156, 122, 47, 0.12)", color: active.color, border: `1px solid ${HAIRLINE}` }}>{active.reach}</span>
                </div>
                <div className="mt-4 rounded p-3" style={{ backgroundColor: SOFT, border: `1px solid ${HAIRLINE}` }}>
                  <div className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: INK_MUTED }}>Founder / context</div>
                  <div className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{active.founder}</div>
                </div>
                <div className="mt-3 grid gap-2">
                  {active.streams.map((stream) => (
                    <div key={stream} className="rounded p-3 text-sm font-semibold" style={{ backgroundColor: "rgba(156, 122, 47, 0.08)", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>{stream}</div>
                  ))}
                </div>
              </div>

              <div className="gl-surface-twilight-glass p-4" style={{ borderRadius: "8px" }}>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><BookOpen size={16} style={{ color: GOLD }} /> Teaching infrastructure</div>
                <div className="space-y-2">
                  {active.infrastructure.map((item) => (
                    <div key={item} className="rounded p-3 text-sm" style={{ backgroundColor: SOFT, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>{item}</div>
                  ))}
                </div>
              </div>

              <div className="gl-surface-twilight-glass p-4" style={{ borderRadius: "8px" }}>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Users size={16} style={{ color: GOLD }} /> Distinctive lineage features</div>
                <div className="space-y-2">
                  {active.features.map((item) => (
                    <div key={item} className="rounded p-3 text-sm" style={{ backgroundColor: CARD, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>{item}</div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="gl-surface-twilight-glass p-4" style={{ borderRadius: "8px" }}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><GraduationCap size={16} style={{ color: GOLD }} /> Curriculum vs lineage engagement</div>
              <div className="space-y-3">
                {[
                  ["Curriculum engagement", "Cross-stream and cross-region literacy; modern-teaching synthesis; not lineage credentialing."],
                  ["Lineage engagement", "Direct teacher-student pathway; lineage-internal methods, recognition, and practitioner community."],
                  ["Best pathway", "For serious practice, curriculum plus lineage engagement is complementary rather than competitive."],
                ].map(([label, text]) => (
                  <div key={label} className="rounded p-3" style={{ backgroundColor: SOFT, border: `1px solid ${HAIRLINE}` }}>
                    <div className="text-sm font-bold" style={{ color: GOLD }}>{label}</div>
                    <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="gl-surface-twilight-glass mt-4 p-4" style={{ borderRadius: "8px" }}>
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.08em]" style={{ color: INK_MUTED }}>Cross-cutting lineage patterns</div>
        <div className="grid gap-2 md:grid-cols-3">
          {PATTERNS.map(([label, text]) => (
            <div key={label} className="rounded p-3" style={{ backgroundColor: CARD, border: `1px solid ${HAIRLINE}` }}>
              <div className="text-sm font-bold" style={{ color: GOLD }}>{label}</div>
              <div className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>{text}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => {
            setActiveId("bvb");
            setView("lineages");
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
