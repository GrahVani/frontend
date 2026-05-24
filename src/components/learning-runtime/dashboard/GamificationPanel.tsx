/**
 * GamificationPanel — server-authoritative tier / XP / badges display.
 *
 * Reads the DashboardPayload supplied by `useLearningSync`. When the server is
 * unreachable, the panel collapses gracefully (no flicker) — the upstream
 * dashboard keeps showing locally-derived rank from the rank ladder. Once the
 * server hydrates, this panel takes over with the authoritative tier title,
 * total XP, points-to-next-tier, earned badges, and the next-up badge.
 */

"use client";

import { Trophy, Sparkles, Award, Lock } from "lucide-react";
import type { DashboardPayload, BadgeRecord } from "@/lib/api/learning";

interface Props {
  dashboard: DashboardPayload | null;
  hasIdentity: boolean;
  isReachable: boolean;
}

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INK_PRIMARY = "#2B1F12";
const INK_SECONDARY = "#5C4A2E";
const INK_MUTED = "#7A6747";

const glassPanel = {
  background: "linear-gradient(180deg, rgba(255, 252, 240, 0.94) 0%, rgba(255, 244, 220, 0.78) 100%)",
  border: `1px solid ${GOLD}55`,
  borderRadius: "16px",
  boxShadow:
    "0 1px 0 rgba(255, 255, 255, 0.88) inset, 0 -1px 0 rgba(139, 90, 43, 0.14) inset, 0 10px 30px rgba(62, 42, 31, 0.10), 0 3px 10px rgba(62, 42, 31, 0.06)",
};

export function GamificationPanel({ dashboard, hasIdentity, isReachable }: Props) {
  if (!hasIdentity) {
    return (
      <div style={{ ...glassPanel, padding: "20px 22px" }}>
        <header style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.22em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            Achievements
          </p>
        </header>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "14px", color: INK_MUTED, lineHeight: 1.45 }}>
          Sign in to start earning points, badges, and tier titles.
        </p>
      </div>
    );
  }

  if (!dashboard || !isReachable) {
    return (
      <div style={{ ...glassPanel, padding: "20px 22px" }}>
        <header style={{ marginBottom: "8px" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.22em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            Achievements
          </p>
        </header>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: INK_MUTED }}>
          Server unreachable — local-only mode.
        </p>
      </div>
    );
  }

  const tierPct = dashboard.nextTierThreshold > dashboard.prevTierThreshold
    ? Math.round(((dashboard.totalPoints - dashboard.prevTierThreshold) / (dashboard.nextTierThreshold - dashboard.prevTierThreshold)) * 100)
    : 100;
  const tierName = dashboard.tierNames?.[String(dashboard.currentTier)] ?? dashboard.title;
  const nextTierName = dashboard.tierNames?.[String(dashboard.currentTier + 1)];

  return (
    <div style={{ ...glassPanel, padding: "22px 22px 24px", position: "relative", overflow: "hidden" }}>
      {/* Eyebrow */}
      <p style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.22em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "14px" }}>
        <Trophy size={12} /> Tier {dashboard.currentTier} · {tierName}
      </p>

      {/* XP block */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "32px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1 }}>
          {dashboard.totalPoints.toLocaleString()}
        </span>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: INK_MUTED, fontWeight: 600, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          XP earned
        </span>
      </div>

      {/* Tier progress bar */}
      <div style={{ height: "6px", borderRadius: "999px", background: `${GOLD}1F`, position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 1px rgba(62, 42, 31, 0.10)", marginBottom: "8px" }}>
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: `${Math.max(2, Math.min(100, tierPct))}%`,
            background: `linear-gradient(to right, ${GOLD_LIGHT}, ${GOLD})`,
            borderRadius: "999px",
            boxShadow: `0 0 8px ${GOLD}aa`,
            transition: "width 600ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          }}
        />
      </div>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "12.5px", color: INK_MUTED, marginBottom: "18px" }}>
        {nextTierName
          ? `${dashboard.pointsToNextTier.toLocaleString()} XP to ${nextTierName}`
          : "Top tier reached"}
      </p>

      {/* Stats triplet */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "18px", paddingTop: "14px", borderTop: `1px dashed ${GOLD}33` }}>
        <PanelStat label="Skill score" value={dashboard.skillScore.toString()} accent={GOLD_DEEP} />
        <PanelStat label="Mastered" value={dashboard.lessonsCompleted.toString()} accent="#3A8C5A" />
        <PanelStat label="Perfect runs" value={dashboard.perfectLessons.toString()} accent="#4F6FA8" />
      </div>

      {/* Badges */}
      <BadgeRow earned={dashboard.badges.earned} upcoming={dashboard.badges.upcoming} />
    </div>
  );
}

function PanelStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.1 }}>
        {value}
      </p>
      <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginTop: "2px" }}>
        {label}
      </p>
    </div>
  );
}

function BadgeRow({ earned, upcoming }: { earned: BadgeRecord[]; upcoming: BadgeRecord[] }) {
  const earnedShown = earned.slice(0, 4);
  const nextUp = upcoming[0];

  if (earnedShown.length === 0 && !nextUp) {
    return (
      <div>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.20em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "8px" }}>
          Badges
        </p>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: INK_MUTED, lineHeight: 1.4 }}>
          No badges yet — master your first lesson to unlock <strong style={{ color: INK_SECONDARY, fontStyle: "normal", fontWeight: 600 }}>First Light</strong>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.20em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          Badges
        </p>
        <p style={{ fontSize: "11px", color: INK_MUTED, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
          {earned.length} earned · {upcoming.length} ahead
        </p>
      </div>

      {/* Earned badges row */}
      {earnedShown.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: nextUp ? "14px" : 0 }}>
          {earnedShown.map((b, i) => (
            <EarnedBadgePip key={b.id ?? b.code ?? b.slug ?? i} badge={b} />
          ))}
        </div>
      )}

      {/* Next-up callout */}
      {nextUp && <UpcomingBadgeRow badge={nextUp} />}
    </div>
  );
}

function EarnedBadgePip({ badge }: { badge: BadgeRecord }) {
  return (
    <div
      title={badge.description ?? badge.name}
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
        border: `2px solid ${GOLD_DEEP}`,
        boxShadow: `0 1px 0 rgba(255, 255, 255, 0.55) inset, 0 4px 10px ${GOLD}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Award size={20} color="#FFF9F0" strokeWidth={2.4} />
    </div>
  );
}

function UpcomingBadgeRow({ badge }: { badge: BadgeRecord }) {
  const progress = typeof badge.progress === "number" ? Math.max(0, Math.min(100, badge.progress)) : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "10px",
        background: "rgba(255, 252, 240, 0.62)",
        border: `1px dashed ${GOLD}55`,
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "rgba(252, 230, 184, 0.45)",
          border: `1.4px dashed ${GOLD}88`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: INK_MUTED,
        }}
      >
        <Lock size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "14px", fontWeight: 500, color: INK_PRIMARY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <Sparkles size={11} style={{ display: "inline", marginRight: "4px", color: GOLD_DEEP }} />
            {badge.name}
          </p>
          <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            {progress}%
          </span>
        </div>
        {badge.requirement && (
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "11.5px", color: INK_MUTED, lineHeight: 1.3, marginBottom: "4px" }}>
            {badge.requirement}
          </p>
        )}
        <div style={{ height: "3px", borderRadius: "999px", background: `${GOLD}1F`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${progress}%`, background: `linear-gradient(to right, ${GOLD_LIGHT}, ${GOLD})`, borderRadius: "999px" }} />
        </div>
      </div>
    </div>
  );
}
