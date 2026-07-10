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

const LINEAGE_NODES: Record<string, { x: number; y: number; group: "institutional" | "western" | "specialist" | "classical" }> = {
  sjc: { x: 50, y: 66, group: "western" },
  aivs: { x: 50, y: 162, group: "western" },
  defouw: { x: 50, y: 258, group: "western" },
  sutton: { x: 50, y: 340, group: "western" },
  bvb: { x: 548, y: 66, group: "institutional" },
  pundit: { x: 548, y: 162, group: "classical" },
  lal: { x: 548, y: 258, group: "specialist" },
  kp: { x: 548, y: 340, group: "specialist" },
};

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
  const center = { x: 380, y: 214 };
  const activeNode = LINEAGE_NODES[activeId] ?? LINEAGE_NODES.bvb;
  const streamTags = [
    ["Parashari", "#3A8C5A"],
    ["Jaimini", "#6A568E"],
    ["KP", "#3A6F8C"],
    ["Lal Kitab", "#7A3E4A"],
  ];

  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Network of eight modern Jyotisha lineage threads" className="h-auto w-full">
      <defs>
        <filter id="lineage-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7A5E1E" floodOpacity="0.18" />
        </filter>
        <filter id="lineage-card-shadow" x="-15%" y="-25%" width="130%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#7A5E1E" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="760" height="430" rx="8" fill={CARD} stroke={HAIRLINE} />
      <rect x="18" y="18" width="724" height="394" rx="7" fill={SOFT} opacity="0.45" />

      <rect x="34" y="34" width="190" height="362" rx="10" fill="rgba(79, 111, 168, 0.06)" stroke="rgba(79, 111, 168, 0.16)" />
      <text x="129" y="58" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="900">
        Western/global teaching
      </text>
      <rect x="536" y="34" width="190" height="362" rx="10" fill="rgba(156, 122, 47, 0.07)" stroke="rgba(156, 122, 47, 0.18)" />
      <text x="631" y="58" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="900">
        Indian/regional roots
      </text>

      {LINEAGES.map((lineage) => {
        const node = LINEAGE_NODES[lineage.id];
        const isActive = lineage.id === activeId;
        return (
          <line
            key={`hub-${lineage.id}`}
            x1={center.x}
            y1={center.y}
            x2={node.x + 81}
            y2={node.y + 29}
            stroke={isActive ? lineage.color : "rgba(92, 74, 42, 0.16)"}
            strokeWidth={isActive ? 3 : 1.4}
            strokeDasharray={showRegions && !isActive ? "6 7" : undefined}
          />
        );
      })}

      {showStreams && (
        <g>
          {streamTags.map(([label, color], index) => (
            <g key={label}>
              <rect x={214 + index * 84} y={360} width="74" height="29" rx="14.5" fill="rgba(255, 249, 240, 0.86)" stroke={color} />
              <text x={251 + index * 84} y={379} textAnchor="middle" fill={color} fontSize="12" fontWeight="900">
                {label}
              </text>
            </g>
          ))}
        </g>
      )}

      <g filter="url(#lineage-card-shadow)">
        <circle cx={center.x} cy={center.y} r="86" fill="rgba(255, 249, 240, 0.94)" stroke={HAIRLINE} strokeWidth="1.5" />
        <circle cx={center.x} cy={center.y} r="56" fill="rgba(156, 122, 47, 0.09)" stroke="rgba(156, 122, 47, 0.22)" />
        <text x={center.x} y={center.y - 16} textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="900">
          Lineage
        </text>
        <text x={center.x} y={center.y + 7} textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="900">
          thread landscape
        </text>
        <text x={center.x} y={center.y + 35} textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="800">
          teacher networks, not streams
        </text>
      </g>

      <line x1={center.x} y1={center.y} x2={activeNode.x + 81} y2={activeNode.y + 29} stroke={GOLD} strokeWidth="5" strokeLinecap="round" opacity="0.34" />

      {LINEAGES.map((lineage) => {
        const isActive = lineage.id === activeId;
        const node = LINEAGE_NODES[lineage.id];
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
            <rect
              x={node.x}
              y={node.y}
              width="162"
              height="58"
              rx="8"
              fill={isActive ? "rgba(255, 249, 240, 0.98)" : "rgba(255, 249, 240, 0.82)"}
              stroke={lineage.color}
              strokeWidth={isActive ? 2.5 : 1.5}
              filter={isActive ? "url(#lineage-shadow)" : undefined}
            />
            <circle cx={node.x + 22} cy={node.y + 22} r={isActive ? 9 : 7} fill={lineage.color} />
            <text x={node.x + 40} y={node.y + 27} fill={lineage.color} fontSize="18" fontWeight="900">
              {lineage.short}
            </text>
            <text x={node.x + 20} y={node.y + 48} fill={INK_SECONDARY} fontSize="12" fontWeight="800">
              {lineage.reach}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineagePicker({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {LINEAGES.map((lineage) => {
        const active = lineage.id === activeId;
        return (
          <button
            key={lineage.id}
            type="button"
            onClick={() => onSelect(lineage.id)}
            className="flex min-h-12 items-center gap-2 rounded px-3 py-2 text-left text-xs font-bold transition"
            style={{
              backgroundColor: active ? "rgba(255, 249, 240, 0.95)" : "rgba(255, 249, 240, 0.58)",
              border: active ? `1px solid ${lineage.color}` : `1px solid ${HAIRLINE}`,
              color: active ? lineage.color : INK_SECONDARY,
              boxShadow: active ? "0 8px 18px rgba(122, 94, 30, 0.12)" : "none",
            }}
            aria-pressed={active}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: lineage.color }} />
            <span className="leading-tight">{lineage.short}</span>
          </button>
        );
      })}
    </div>
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
          <div className="mt-3">
            <LineagePicker activeId={activeId} onSelect={setActiveId} />
          </div>
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
