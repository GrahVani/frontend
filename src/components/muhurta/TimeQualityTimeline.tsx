"use client";

import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import type {
  TimeQualityData,
  ChoghadiyaQuality,
  GowriQuality,
  BothQuality,
} from "@/types/muhurta.types";

// ─── Auspicious / Inauspicious classification ──────────────

const CHOGHADIYA_AUSPICIOUS = new Set(["Amrit", "Shubh", "Labh"]);
const CHOGHADIYA_INAUSPICIOUS = new Set(["Kaal", "Rog", "Udveg"]);

const GOWRI_AUSPICIOUS = new Set(["Amirtham", "Udayam", "Labhham", "Sugam"]);
const GOWRI_INAUSPICIOUS = new Set(["Aravam", "Visham", "Rogam", "Dosham"]);

type SegmentNature = "auspicious" | "inauspicious" | "neutral";

function classifyChoghadiya(name: string): SegmentNature {
  if (CHOGHADIYA_AUSPICIOUS.has(name)) return "auspicious";
  if (CHOGHADIYA_INAUSPICIOUS.has(name)) return "inauspicious";
  return "neutral";
}

function classifyGowri(name: string): SegmentNature {
  if (GOWRI_AUSPICIOUS.has(name)) return "auspicious";
  if (GOWRI_INAUSPICIOUS.has(name)) return "inauspicious";
  return "neutral";
}

const NATURE_COLORS: Record<SegmentNature, { bg: string; activeBg: string; text: string }> = {
  auspicious: {
    bg: "bg-status-success/20",
    activeBg: "bg-status-success/40",
    text: "text-status-success",
  },
  inauspicious: {
    bg: "bg-status-error/15",
    activeBg: "bg-status-error/35",
    text: "text-status-error",
  },
  neutral: {
    bg: "bg-status-warning/15",
    activeBg: "bg-status-warning/35",
    text: "text-status-warning",
  },
};

// ─── Props ──────────────────────────────────────────────────

interface TimeQualityTimelineProps {
  timeQuality: TimeQualityData;
  sunrise?: string;
  sunset?: string;
  className?: string;
}

// ─── Single System Timeline ─────────────────────────────────

function SingleTimeline({
  systemLabel,
  knowledgeTerm,
  segments,
  activeIndex,
  classify,
}: {
  systemLabel: string;
  knowledgeTerm: string;
  segments: string[];
  activeIndex: number;
  classify: (name: string) => SegmentNature;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <KnowledgeTooltip term={knowledgeTerm}>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-dark">
            {systemLabel}
          </span>
        </KnowledgeTooltip>
      </div>

      {/* Bar */}
      <div className="flex rounded-lg overflow-hidden border border-antique h-7">
        {segments.map((name, i) => {
          const nature = classify(name);
          const colors = NATURE_COLORS[nature];
          const isActive = i === activeIndex;

          return (
            <div
              key={`${name}-${i}`}
              className={cn(
                "flex-1 flex items-center justify-center relative transition-all",
                isActive ? colors.activeBg : colors.bg,
                i > 0 && "border-l border-antique/40",
              )}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-sm ring-2 ring-gold-primary/60 animate-pulse pointer-events-none" />
              )}
              <span
                className={cn(
                  "text-[10px] leading-none truncate px-0.5",
                  isActive ? "font-extrabold" : "font-medium",
                  colors.text,
                )}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Labels below */}
      <div className="flex mt-1">
        {segments.map((name, i) => {
          const nature = classify(name);
          const isActive = i === activeIndex;
          return (
            <div key={`label-${name}-${i}`} className="flex-1 text-center">
              <span
                className={cn(
                  "text-[9px] uppercase tracking-wider",
                  isActive
                    ? cn("font-bold", NATURE_COLORS[nature].text)
                    : "text-ink/40 font-medium",
                )}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────

export default function TimeQualityTimeline({
  timeQuality,
  sunrise,
  sunset,
  className,
}: TimeQualityTimelineProps) {
  const isBoth = timeQuality.system === "BOTH";
  const isChoghadiya = timeQuality.system === "CHOGHADIYA";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Sun timings */}
      {(sunrise || sunset) && (
        <div className="flex items-center gap-4 text-[12px] text-ink/50">
          {sunrise && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gold-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 18a5 5 0 0 0-10 0" />
                <line x1="12" y1="9" x2="12" y2="2" />
                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
                <line x1="1" y1="18" x2="3" y2="18" />
                <line x1="21" y1="18" x2="23" y2="18" />
                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
              </svg>
              <span className="font-medium text-ink">{sunrise}</span>
            </span>
          )}
          {sunset && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gold-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 18a5 5 0 0 0-10 0" />
                <line x1="12" y1="2" x2="12" y2="9" />
                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
                <line x1="1" y1="18" x2="3" y2="18" />
                <line x1="21" y1="18" x2="23" y2="18" />
                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
              </svg>
              <span className="font-medium text-ink">{sunset}</span>
            </span>
          )}
        </div>
      )}

      {/* BOTH system: two stacked timelines */}
      {isBoth && (
        <>
          <SingleTimeline
            systemLabel="Choghadiya"
            knowledgeTerm="choghadiya"
            segments={(timeQuality as BothQuality).choghadiya.all_day_segments}
            activeIndex={(timeQuality as BothQuality).choghadiya.segment_index}
            classify={classifyChoghadiya}
          />
          <SingleTimeline
            systemLabel="Gowri Panchangam"
            knowledgeTerm="gowri_panchangam"
            segments={(timeQuality as BothQuality).gowri_panchangam.all_day_segments}
            activeIndex={(timeQuality as BothQuality).gowri_panchangam.segment_index}
            classify={classifyGowri}
          />
        </>
      )}

      {/* Single system: Choghadiya */}
      {!isBoth && isChoghadiya && (
        <SingleTimeline
          systemLabel="Choghadiya"
          knowledgeTerm="choghadiya"
          segments={(timeQuality as ChoghadiyaQuality).all_day_segments}
          activeIndex={(timeQuality as ChoghadiyaQuality).segment_index}
          classify={classifyChoghadiya}
        />
      )}

      {/* Single system: Gowri Panchangam */}
      {!isBoth && !isChoghadiya && (
        <SingleTimeline
          systemLabel="Gowri Panchangam"
          knowledgeTerm="gowri_panchangam"
          segments={(timeQuality as GowriQuality).all_day_segments}
          activeIndex={(timeQuality as GowriQuality).segment_index}
          classify={classifyGowri}
        />
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 pt-1">
        {(["auspicious", "inauspicious", "neutral"] as const).map((nature) => (
          <div key={nature} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded-sm border border-antique/30", NATURE_COLORS[nature].bg)} />
            <span className="text-[11px] text-ink/45 capitalize">{nature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
