"use client";

import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { KnowledgeTooltip } from "@/components/knowledge";
import type { InauspiciousWindowsResponse, InauspiciousPeriod } from "@/types/muhurta.types";

// ─── Knowledge tooltip term mapping ─────────────────────────

const PERIOD_KNOWLEDGE_TERMS: Record<string, string> = {
  rahu_kaal: "rahu_kaal",
  yamaganda_kaal: "yamaghanta",
  gulika_kaal: "gulika_kaal",
  abhijit_muhurat: "abhijit_muhurta",
  pradosh_kaal: "pradosh_kaal",
};

// ─── Props ──────────────────────────────────────────────────

interface InauspiciousPeriodsProps {
  data: InauspiciousWindowsResponse;
  className?: string;
}

// ─── Period Row ─────────────────────────────────────────────

function PeriodRow({
  label,
  knowledgeTerm,
  period,
  accent,
  isMandatoryAvoid,
}: {
  label: string;
  knowledgeTerm?: string;
  period: InauspiciousPeriod;
  accent: "green" | "red";
  isMandatoryAvoid: boolean;
}) {
  const accentColor = accent === "green"
    ? "border-l-status-success"
    : "border-l-status-error";

  const timeDisplay = period.start_time && period.end_time
    ? `${period.start_time} — ${period.end_time}`
    : "N/A";

  return (
    <div className={cn("flex items-center justify-between py-2.5 px-3 border-l-[3px] rounded-r-lg", accentColor)}>
      <div className="flex items-center gap-2 min-w-0">
        {knowledgeTerm ? (
          <KnowledgeTooltip term={knowledgeTerm}>
            <span className="text-[14px] font-serif font-semibold text-ink">{label}</span>
          </KnowledgeTooltip>
        ) : (
          <span className="text-[14px] font-serif font-semibold text-ink">{label}</span>
        )}

        {period.quality && (
          <Badge
            variant={accent === "green" ? "success" : "error"}
            size="sm"
          >
            {period.quality}
          </Badge>
        )}

        {isMandatoryAvoid && (
          <Badge variant="error" size="sm">
            MUST AVOID
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[14px] font-medium text-ink tabular-nums">{timeDisplay}</span>
        {period.duration_minutes != null && (
          <span className="text-[12px] text-ink/40">{period.duration_minutes}m</span>
        )}
      </div>
    </div>
  );
}

// ─── Dur Muhurat Row ────────────────────────────────────────

function DurMuhuratRow({
  period,
  index,
  isMandatoryAvoid,
}: {
  period: InauspiciousPeriod;
  index: number;
  isMandatoryAvoid: boolean;
}) {
  const timeDisplay = period.start_time && period.end_time
    ? `${period.start_time} — ${period.end_time}`
    : "N/A";

  return (
    <div className="flex items-center justify-between py-2 px-3 border-l-[3px] border-l-status-error rounded-r-lg">
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-serif font-semibold text-ink">
          Dur Muhurat {index + 1}
        </span>
        {isMandatoryAvoid && (
          <Badge variant="error" size="sm">MUST AVOID</Badge>
        )}
      </div>
      <span className="text-[14px] font-medium text-ink tabular-nums">{timeDisplay}</span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────

export default function InauspiciousPeriods({ data, className }: InauspiciousPeriodsProps) {
  const { sun_timings, auspicious_periods, inauspicious_periods, tradition_annotations } = data;
  const mandatorySet = new Set(tradition_annotations.mandatory_avoid ?? []);

  const auspiciousEntries = Object.entries(auspicious_periods);
  const hasAuspicious = auspiciousEntries.length > 0;
  const hasDurMuhurats = inauspicious_periods.dur_muhurats.length > 0;
  const penalties = tradition_annotations.penalty_multipliers ?? {};
  const hasPenalties = Object.keys(penalties).length > 0;

  return (
    <div className={cn("prem-card p-5 space-y-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-serif font-bold text-ink">
          Daily Inauspicious &amp; Auspicious Windows
        </h3>
        <span className="text-[12px] text-ink/45 font-medium">
          {data.weekday}, {data.date}
        </span>
      </div>

      {/* Sun Timings */}
      <div className="flex items-center gap-6 py-3 px-4 rounded-lg bg-surface-warm/40">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gold-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <div>
            <span className="text-[11px] text-ink/40 uppercase tracking-wider block">Sunrise</span>
            <span className="text-[14px] font-serif font-bold text-ink">{sun_timings.sunrise}</span>
          </div>
        </div>

        <div className="h-8 w-px bg-gold-primary/20" />

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gold-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <div>
            <span className="text-[11px] text-ink/40 uppercase tracking-wider block">Sunset</span>
            <span className="text-[14px] font-serif font-bold text-ink">{sun_timings.sunset}</span>
          </div>
        </div>

        <div className="h-8 w-px bg-gold-primary/20" />

        <div>
          <span className="text-[11px] text-ink/40 uppercase tracking-wider block">Day Duration</span>
          <span className="text-[14px] font-serif font-bold text-ink">{sun_timings.day_duration_formatted}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/25 to-transparent" />

      {/* Auspicious Periods */}
      {hasAuspicious && (
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-status-success mb-2">
            Auspicious Periods
          </h4>
          <div className="space-y-1.5">
            {auspiciousEntries.map(([key, period]) => {
              const label = key
                .split("_")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
              return (
                <PeriodRow
                  key={key}
                  label={label}
                  knowledgeTerm={PERIOD_KNOWLEDGE_TERMS[key]}
                  period={period}
                  accent="green"
                  isMandatoryAvoid={false}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/25 to-transparent" />

      {/* Inauspicious Periods */}
      <div>
        <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-status-error mb-2">
          Inauspicious Periods
        </h4>
        <div className="space-y-1.5">
          <PeriodRow
            label="Rahu Kaal"
            knowledgeTerm="rahu_kaal"
            period={inauspicious_periods.rahu_kaal}
            accent="red"
            isMandatoryAvoid={mandatorySet.has("rahu_kaal")}
          />
          <PeriodRow
            label="Yamaganda Kaal"
            knowledgeTerm="yamaghanta"
            period={inauspicious_periods.yamaganda_kaal}
            accent="red"
            isMandatoryAvoid={mandatorySet.has("yamaganda_kaal")}
          />
          <PeriodRow
            label="Gulika Kaal"
            knowledgeTerm="gulika_kaal"
            period={inauspicious_periods.gulika_kaal}
            accent="red"
            isMandatoryAvoid={mandatorySet.has("gulika_kaal")}
          />
          {hasDurMuhurats &&
            inauspicious_periods.dur_muhurats.map((dm, i) => (
              <DurMuhuratRow
                key={`dm-${i}`}
                period={dm}
                index={i}
                isMandatoryAvoid={mandatorySet.has("dur_muhurats")}
              />
            ))}
        </div>
      </div>

      {/* Tradition Annotations */}
      {(hasPenalties || tradition_annotations.rahu_kaal_note) && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/25 to-transparent" />

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-gold-dark mb-2">
              Tradition Notes — {tradition_annotations.tradition_display}
            </h4>

            {hasPenalties && (
              <div className="space-y-1 mb-2">
                {Object.entries(penalties).map(([period, multiplier]) => (
                  <div key={period} className="flex items-center gap-2 py-1 px-3 bg-status-warning/8 rounded-lg">
                    <span className="text-[12px] text-ink/70 capitalize">
                      {period.replace(/_/g, " ")}
                    </span>
                    <Badge variant="warning" size="sm">
                      {multiplier}x penalty
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {tradition_annotations.rahu_kaal_note && (
              <p className="text-[12px] text-ink/50 italic leading-relaxed px-3">
                {tradition_annotations.rahu_kaal_note}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
