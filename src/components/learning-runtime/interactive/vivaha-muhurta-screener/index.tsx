"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  Scale,
  ShieldAlert,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import {
  DOSHAS,
  JUPITER_CRITERIA,
  KARANAS,
  LAGNA_SIGNS,
  NAKSHATRAS,
  TITHIS,
  VARAS,
  VENUS_CRITERIA,
  YOGAS,
  qualityColor,
  qualityLabel,
  qualityScore,
  type Dosha,
  type Favourability,
  type Option,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #3D3115)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #5C4A2A)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.30))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-manuscript-cream, #F5EDD8)";
const GOLD = "var(--gl-gold, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GOLD_LIGHT = "var(--gl-gold-light, #F4C77B)";
const VERMILION = "var(--gl-vermilion-on-cream, #A23A1E)";
const JADE = "#2F7D55";
const AMBER = "#B9801E";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : `rgba(156,122,47,0.12)`;
}

/* ── Tabs ──────────────────────────────────────────────── */
type TabKey = "pancanga" | "grahas" | "doshas" | "verdict";

const TABS: { key: TabKey; label: string; sublabel: string; icon: React.ReactNode }[] = [
  { key: "pancanga", label: "Pañcāṅga", sublabel: "Wedding weighting", icon: <Star size={15} /> },
  { key: "grahas", label: "Jupiter-Venus", sublabel: "Wedding significators", icon: <Heart size={15} /> },
  { key: "doshas", label: "Doṣas", sublabel: "Cancellation checks", icon: <ShieldAlert size={15} /> },
  { key: "verdict", label: "Verdict", sublabel: "Integrated recommendation", icon: <Scale size={15} /> },
];

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */

export function VivahaMuhurtaScreener() {
  const [tab, setTab] = useState<TabKey>("pancanga");
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [selections, setSelections] = useState({
    tithi: TITHIS[4].id, // Pañcamī
    vara: VARAS[4].id, // Thursday
    nakshatra: NAKSHATRAS[3].id, // Rohiṇī
    yoga: YOGAS[3].id, // Saubhāgya
    karana: KARANAS[0].id, // Bava
    lagna: LAGNA_SIGNS[1].id, // Vṛṣabha
  });

  const [jupiterChecks, setJupiterChecks] = useState<Set<string>>(new Set(["jupiter_sign", "jupiter_house", "jupiter_combust", "jupiter_aspect"]));
  const [venusChecks, setVenusChecks] = useState<Set<string>>(new Set(["venus_sign", "venus_house", "venus_combust", "venus_aspect"]));
  const [activeDoshas, setActiveDoshas] = useState<Set<string>>(new Set());

  const updateSelection = (key: keyof typeof selections, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCriterion = (set: Set<string>, updater: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
    updater((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleDosha = (id: string) => {
    setActiveDoshas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scoreData = useMemo(() => {
    const pancangaItems = [
      TITHIS.find((o) => o.id === selections.tithi)!,
      VARAS.find((o) => o.id === selections.vara)!,
      NAKSHATRAS.find((o) => o.id === selections.nakshatra)!,
      YOGAS.find((o) => o.id === selections.yoga)!,
      KARANAS.find((o) => o.id === selections.karana)!,
      LAGNA_SIGNS.find((o) => o.id === selections.lagna)!,
    ];

    const pancangaScore = pancangaItems.reduce((sum, item) => sum + qualityScore(item.quality), 0);
    const avoidedCount = pancangaItems.filter((item) => item.quality === "avoided").length;

    const jupiterScore = jupiterChecks.size;
    const venusScore = venusChecks.size;
    const grahaScore = jupiterScore + venusScore;

    const doshaCount = activeDoshas.size;

    const totalScore = pancangaScore + grahaScore - doshaCount * 4;
    const maxScore = 12 + 8; // 6 pancanga items × 2 + 8 graha criteria
    const minScore = -12 - 8 - 12; // worst case

    const normalized = ((totalScore - minScore) / (maxScore - minScore)) * 100;

    let verdict: "strong" | "mixed" | "weak" | "cancel";
    if (doshaCount > 0 || avoidedCount > 0) verdict = "cancel";
    else if (normalized >= 70) verdict = "strong";
    else if (normalized >= 45) verdict = "mixed";
    else verdict = "weak";

    return {
      pancangaItems,
      pancangaScore,
      avoidedCount,
      jupiterScore,
      venusScore,
      grahaScore,
      doshaCount,
      totalScore,
      normalized,
      verdict,
    };
  }, [selections, jupiterChecks, venusChecks, activeDoshas]);

  return (
    <div data-interactive="vivaha-muhurta-screener" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          background: SURFACE,
          padding: "1.1rem 1.25rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            background: `radial-gradient(circle at 100% 0%, ${wash(GOLD, "10")} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: GOLD_DEEP,
            }}
          >
            Lesson 23.4.1 — Vivāha-Muhūrta
          </p>
          <h2
            style={{
              margin: "0.2rem 0 0",
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "1.55rem",
              color: GOLD_DEEP,
              fontWeight: 600,
            }}
          >
            Wedding-Muhūrta Screener
          </h2>
          <p
            style={{
              margin: "0.45rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
              maxWidth: 780,
              fontSize: "0.92rem",
            }}
          >
            Apply the wedding-specific event-type framework: pañcāṅga-weighting, Jupiter-Venus strength, cancellation-doṣas, and integrated verdict.
          </p>
        </div>
      </section>

      {/* Mini score board */}
      <MiniScoreBoard scoreData={scoreData} reducedMotion={reducedMotion} />

      {/* Tab Bar */}
      <TabBar active={tab} onChange={setTab} reducedMotion={reducedMotion} />

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
        >
          {tab === "pancanga" && (
            <PancangaTab
              selections={selections}
              onChange={updateSelection}
              reducedMotion={reducedMotion}
            />
          )}
          {tab === "grahas" && (
            <GrahasTab
              jupiterChecks={jupiterChecks}
              venusChecks={venusChecks}
              onToggleJupiter={(id) => toggleCriterion(jupiterChecks, setJupiterChecks, id)}
              onToggleVenus={(id) => toggleCriterion(venusChecks, setVenusChecks, id)}
              reducedMotion={reducedMotion}
            />
          )}
          {tab === "doshas" && (
            <DoshasTab activeDoshas={activeDoshas} onToggle={toggleDosha} reducedMotion={reducedMotion} />
          )}
          {tab === "verdict" && (
            <VerdictTab scoreData={scoreData} reducedMotion={reducedMotion} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Mini Score Board ──────────────────────────────────── */

interface ScoreData {
  pancangaItems: Option[];
  pancangaScore: number;
  avoidedCount: number;
  jupiterScore: number;
  venusScore: number;
  grahaScore: number;
  doshaCount: number;
  totalScore: number;
  normalized: number;
  verdict: "strong" | "mixed" | "weak" | "cancel";
}

function MiniScoreBoard({
  scoreData,
  reducedMotion,
}: {
  scoreData: ScoreData;
  reducedMotion: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "0.65rem",
      }}
    >
      <MiniScoreCard
        label="Pañcāṅga"
        value={scoreData.pancangaScore}
        max={12}
        color={scoreData.avoidedCount > 0 ? VERMILION : scoreData.pancangaScore >= 8 ? JADE : AMBER}
        status={scoreData.avoidedCount > 0 ? "Doṣa present" : scoreData.pancangaScore >= 8 ? "Strong" : "Mixed"}
        reducedMotion={reducedMotion}
      />
      <MiniScoreCard
        label="Jupiter + Venus"
        value={scoreData.grahaScore}
        max={8}
        color={scoreData.grahaScore >= 7 ? JADE : scoreData.grahaScore >= 5 ? AMBER : VERMILION}
        status={scoreData.grahaScore >= 7 ? "Strong" : scoreData.grahaScore >= 5 ? "Mixed" : "Weak"}
        reducedMotion={reducedMotion}
      />
      <MiniScoreCard
        label="Doṣas"
        value={scoreData.doshaCount}
        max={3}
        color={scoreData.doshaCount === 0 ? JADE : scoreData.doshaCount === 1 ? AMBER : VERMILION}
        status={scoreData.doshaCount === 0 ? "Clear" : `${scoreData.doshaCount} active`}
        invert
        reducedMotion={reducedMotion}
      />
      <MiniScoreCard
        label="Overall"
        value={Math.round(scoreData.normalized)}
        max={100}
        color={
          scoreData.verdict === "strong" ? JADE : scoreData.verdict === "mixed" ? AMBER : scoreData.verdict === "weak" ? VERMILION : "#6B4C9A"
        }
        status={
          scoreData.verdict === "strong"
            ? "Recommend"
            : scoreData.verdict === "mixed"
            ? "Proceed with caveats"
            : scoreData.verdict === "weak"
            ? "Weak candidate"
            : "Cancel"
        }
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

function MiniScoreCard({
  label,
  value,
  max,
  color,
  status,
  invert = false,
  reducedMotion,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  status: string;
  invert?: boolean;
  reducedMotion: boolean;
}) {
  const pct = invert ? ((max - value) / max) * 100 : (value / max) * 100;
  return (
    <motion.div
      animate={{ borderColor: color }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      style={{
        border: `1.5px solid ${color}`,
        borderRadius: 12,
        padding: "0.8rem",
        background: wash(color, "08"),
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      }}
    >
      <div style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
        <span style={{ fontSize: "1.35rem", fontWeight: 800, color }}>{value}</span>
        <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>/ {max}</span>
      </div>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: INK_SECONDARY }}>{status}</div>
      <div style={{ height: 4, borderRadius: 2, background: wash(color, "20"), overflow: "hidden", marginTop: 2 }}>
        <motion.div
          animate={{ width: `${pct}%`, backgroundColor: color }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
          style={{ height: "100%", borderRadius: 2 }}
        />
      </div>
    </motion.div>
  );
}

/* ── Tab Bar ───────────────────────────────────────────── */

function TabBar({
  active,
  onChange,
  reducedMotion,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  reducedMotion: boolean;
}) {
  return (
    <div className="flex gap-1 rounded-xl p-1" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            aria-pressed={isActive}
            className="gl-focus-ring gl-clickable flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              background: isActive ? SURFACE : "transparent",
              color: isActive ? GOLD_DEEP : INK_SECONDARY,
              border: isActive ? `1px solid ${HAIRLINE}` : "1px solid transparent",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              cursor: "pointer",
              transition: reducedMotion ? "none" : "all 200ms ease",
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.sublabel}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Pañcāṅga Tab
   ══════════════════════════════════════════════════════════ */

function PancangaTab({
  selections,
  onChange,
  reducedMotion,
}: {
  selections: {
    tithi: string;
    vara: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    lagna: string;
  };
  onChange: (key: "tithi" | "vara" | "nakshatra" | "yoga" | "karana" | "lagna", value: string) => void;
  reducedMotion: boolean;
}) {
  const fields: { key: "tithi" | "vara" | "nakshatra" | "yoga" | "karana" | "lagna"; label: string; options: Option[] }[] = [
    { key: "tithi", label: "Tithi", options: TITHIS },
    { key: "vara", label: "Vāra", options: VARAS },
    { key: "nakshatra", label: "Nakṣatra", options: NAKSHATRAS },
    { key: "yoga", label: "Yoga", options: YOGAS },
    { key: "karana", label: "Karaṇa", options: KARANAS },
    { key: "lagna", label: "Muhūrta Lagna", options: LAGNA_SIGNS },
  ];

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <article
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          background: SURFACE,
          padding: "1.25rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "1.35rem",
              color: GOLD_DEEP,
              fontWeight: 600,
            }}
          >
            Wedding-Specific Pañcāṅga Weighting
          </h3>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
            Select each pañcāṅga limb and the muhūrta-lagna. The card shows the wedding-specific quality and explains the classical reasoning.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
          {fields.map((field) => (
            <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: INK_MUTED,
                }}
              >
                {field.label}
              </label>
              <select
                value={selections[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="gl-focus-ring"
                style={{
                  padding: "0.65rem 0.75rem",
                  borderRadius: 8,
                  border: `1px solid ${HAIRLINE}`,
                  background: SURFACE_2,
                  color: INK_PRIMARY,
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {field.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "0.25rem" }}>
          {fields.map((field) => {
            const selected = field.options.find((o) => o.id === selections[field.key])!;
            return (
              <ResultBadge
                key={field.key}
                label={field.label}
                option={selected}
                reducedMotion={reducedMotion}
              />
            );
          })}
        </div>
      </article>
    </section>
  );
}

function ResultBadge({ label, option, reducedMotion }: { label: string; option: Option; reducedMotion: boolean }) {
  const color = qualityColor(option.quality);
  return (
    <motion.div
      animate={{ borderColor: color, backgroundColor: wash(color, "08") }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      style={{
        border: `1.5px solid ${color}`,
        borderRadius: 10,
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: INK_MUTED }}>{label}</span>
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            padding: "0.15rem 0.45rem",
            borderRadius: 10,
            background: wash(color, "20"),
            color,
          }}
        >
          {qualityLabel(option.quality)}
        </span>
      </div>
      <div style={{ fontSize: "0.92rem", fontWeight: 700, color: INK_PRIMARY }}>
        {option.devanagari ? `${option.devanagari} · ` : ""}
        {option.label}
      </div>
      <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{option.note}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Jupiter-Venus Tab
   ══════════════════════════════════════════════════════════ */

function GrahasTab({
  jupiterChecks,
  venusChecks,
  onToggleJupiter,
  onToggleVenus,
  reducedMotion,
}: {
  jupiterChecks: Set<string>;
  venusChecks: Set<string>;
  onToggleJupiter: (id: string) => void;
  onToggleVenus: (id: string) => void;
  reducedMotion: boolean;
}) {
  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <article
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          background: SURFACE,
          padding: "1.25rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "1.35rem",
              color: GOLD_DEEP,
              fontWeight: 600,
            }}
          >
            Jupiter-Venus Importance Discipline
          </h3>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
            For wedding-muhūrta, both Jupiter and Venus should be strong. Toggle the strength criteria for each significator and watch the score update.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <SignificatorCard
            title="Jupiter (Guru)"
            subtitle="Husband-significator · wisdom-dharma-expansion · wedding blessing"
            color={JADE}
            icon={<Star size={18} />}
            criteria={JUPITER_CRITERIA}
            checked={jupiterChecks}
            onToggle={onToggleJupiter}
            reducedMotion={reducedMotion}
          />
          <SignificatorCard
            title="Venus (Śukra)"
            subtitle="Wife-significator · partnership-aesthetics · kāma-tattva"
            color="#C28220"
            icon={<Heart size={18} />}
            criteria={VENUS_CRITERIA}
            checked={venusChecks}
            onToggle={onToggleVenus}
            reducedMotion={reducedMotion}
          />
        </div>
      </article>
    </section>
  );
}

function SignificatorCard({
  title,
  subtitle,
  color,
  icon,
  criteria,
  checked,
  onToggle,
  reducedMotion,
}: {
  title: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  criteria: { id: string; label: string; description: string }[];
  checked: Set<string>;
  onToggle: (id: string) => void;
  reducedMotion: boolean;
}) {
  const score = criteria.filter((c) => checked.has(c.id)).length;
  const max = criteria.length;
  const strong = score === max;

  return (
    <div
      style={{
        border: `1.5px solid ${color}`,
        borderRadius: 14,
        padding: "1rem 1.15rem",
        background: wash(color, "08"),
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: wash(color, "18"),
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color }}>{title}</div>
          <div style={{ fontSize: "0.76rem", color: INK_SECONDARY, lineHeight: 1.4 }}>{subtitle}</div>
        </div>
        <div
          style={{
            padding: "0.3rem 0.65rem",
            borderRadius: 12,
            background: strong ? color : wash(color, "20"),
            color: strong ? "#FFF" : color,
            fontSize: "0.78rem",
            fontWeight: 800,
          }}
        >
          {score}/{max}
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        {criteria.map((c) => {
          const isChecked = checked.has(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onToggle(c.id)}
              className="gl-focus-ring gl-clickable"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.65rem 0.75rem",
                borderRadius: 8,
                border: `1.5px solid ${isChecked ? color : HAIRLINE}`,
                background: isChecked ? wash(color, "14") : SURFACE,
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  flexShrink: 0,
                  marginTop: 1,
                  background: isChecked ? color : "transparent",
                  border: `2px solid ${isChecked ? color : HAIRLINE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFF",
                }}
              >
                {isChecked && <Check size={12} />}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                <span style={{ fontSize: "0.86rem", fontWeight: isChecked ? 700 : 600, color: INK_PRIMARY }}>{c.label}</span>
                <span style={{ fontSize: "0.76rem", color: INK_SECONDARY, lineHeight: 1.4 }}>{c.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Doṣas Tab
   ══════════════════════════════════════════════════════════ */

function DoshasTab({
  activeDoshas,
  onToggle,
  reducedMotion,
}: {
  activeDoshas: Set<string>;
  onToggle: (id: string) => void;
  reducedMotion: boolean;
}) {
  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <article
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          background: SURFACE,
          padding: "1.25rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "1.35rem",
              color: GOLD_DEEP,
              fontWeight: 600,
            }}
          >
            Wedding-Specific Cancellation-Doṣas
          </h3>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
            Toggle any doṣa that applies to the candidate. Even one active wedding-specific doṣa cancels the candidate per MC Chapter 8.
          </p>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {DOSHAS.map((dosha) => {
            const active = activeDoshas.has(dosha.id);
            return (
              <motion.div
                key={dosha.id}
                animate={{
                  borderColor: active ? VERMILION : HAIRLINE,
                  backgroundColor: active ? wash(VERMILION, "08") : SURFACE,
                }}
                transition={{ duration: reducedMotion ? 0 : 0.2 }}
                style={{
                  border: `1.5px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 12,
                  padding: "0.85rem 1rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  cursor: "pointer",
                }}
                onClick={() => onToggle(dosha.id)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(dosha.id);
                  }}
                  className="gl-focus-ring gl-clickable"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    border: `2px solid ${active ? VERMILION : HAIRLINE}`,
                    background: active ? VERMILION : "transparent",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                    cursor: "pointer",
                  }}
                >
                  {active && <X size={14} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 800, color: active ? VERMILION : INK_PRIMARY }}>{dosha.label}</span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "0.15rem 0.45rem",
                        borderRadius: 10,
                        background: active ? wash(VERMILION, "20") : wash(JADE, "12"),
                        color: active ? VERMILION : JADE,
                      }}
                    >
                      {active ? "Active" : "Not present"}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.84rem", color: INK_SECONDARY, marginTop: 4, lineHeight: 1.5 }}>{dosha.description}</div>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{
                        marginTop: 8,
                        padding: "0.55rem 0.75rem",
                        borderRadius: 8,
                        background: wash(VERMILION, "12"),
                        border: `1px solid ${wash(VERMILION, "25")}`,
                        fontSize: "0.8rem",
                        color: VERMILION,
                        fontWeight: 600,
                      }}
                    >
                      <AlertTriangle size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                      Mitigation: {dosha.mitigation}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </article>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   Verdict Tab
   ══════════════════════════════════════════════════════════ */

function VerdictTab({
  scoreData,
  reducedMotion,
}: {
  scoreData: ScoreData;
  reducedMotion: boolean;
}) {
  const { verdict, normalized, avoidedCount, doshaCount, pancangaScore, grahaScore } = scoreData;

  const verdictConfig = {
    strong: {
      color: JADE,
      title: "Recommend this candidate",
      icon: <Check size={28} />,
      message:
        "Pañcāṅga, lagna, and Jupiter-Venus all align favourably, and no cancellation-doṣa is present. This is a strong wedding-muhūrta candidate per MC Chapter 8.",
    },
    mixed: {
      color: AMBER,
      title: "Proceed with honest caveats",
      icon: <AlertTriangle size={28} />,
      message:
        "Some factors are favourable while others are mixed. The recommendation is usable, but the practitioner must articulate trade-offs to the family and consider window-adjustments.",
    },
    weak: {
      color: VERMILION,
      title: "Weak candidate — seek alternatives",
      icon: <X size={28} />,
      message:
        "Too many factors score as less-favoured or weak. Unless logistics strongly constrain the window, a better candidate should be sought.",
    },
    cancel: {
      color: "#6B4C9A",
      title: "Cancel the candidate",
      icon: <ShieldAlert size={28} />,
      message:
        "A cancellation-grade factor is present (avoided pañcāṅga limb or active wedding-specific doṣa). MC Chapter 8 requires the muhūrta to be sarva-doṣa-vivarjitaḥ — free from all doṣas.",
    },
  }[verdict];

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <article
        style={{
          border: `1.5px solid ${verdictConfig.color}`,
          borderRadius: 16,
          background: wash(verdictConfig.color, "08"),
          padding: "1.25rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: verdictConfig.color,
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 14px ${wash(verdictConfig.color, "40")}`,
            }}
          >
            {verdictConfig.icon}
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: verdictConfig.color }}>
              Integrated Verdict
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: verdictConfig.color }}>{verdictConfig.title}</div>
          </div>
        </div>

        <div style={{ fontSize: "0.92rem", color: INK_PRIMARY, lineHeight: 1.6 }}>{verdictConfig.message}</div>

        <div style={{ height: 10, borderRadius: 5, background: wash(verdictConfig.color, "18"), overflow: "hidden" }}>
          <motion.div
            animate={{ width: `${normalized}%`, backgroundColor: verdictConfig.color }}
            transition={{ duration: reducedMotion ? 0 : 0.4 }}
            style={{ height: "100%", borderRadius: 5 }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.65rem",
            padding: "0.75rem",
            borderRadius: 10,
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <VerdictStat label="Pañcāṅga score" value={`${pancangaScore}/12`} color={avoidedCount > 0 ? VERMILION : pancangaScore >= 8 ? JADE : AMBER} />
          <VerdictStat label="Jupiter + Venus" value={`${grahaScore}/8`} color={grahaScore >= 7 ? JADE : grahaScore >= 5 ? AMBER : VERMILION} />
          <VerdictStat label="Avoided limbs" value={`${avoidedCount}`} color={avoidedCount > 0 ? VERMILION : JADE} />
          <VerdictStat label="Active doṣas" value={`${doshaCount}`} color={doshaCount > 0 ? VERMILION : JADE} />
        </div>

        <div
          style={{
            padding: "0.85rem 1rem",
            borderRadius: 10,
            background: SURFACE,
            border: `1px dashed ${HAIRLINE}`,
            fontSize: "0.85rem",
            color: INK_SECONDARY,
            lineHeight: 1.55,
            fontStyle: "italic",
          }}
        >
          <Sparkles size={14} style={{ verticalAlign: "middle", marginRight: 6, color: GOLD_DEEP }} />
          <strong>Honest-articulation discipline:</strong> Wedding-muhūrta is one input among several to marital unfolding — couple-compatibility, decision-quality, commitment, family-support, and broader circumstances all also operate. A recommendation is not a guarantee; a mixed muhūrta does not determine a mixed marriage.
        </div>
      </article>

      <article
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          background: SURFACE,
          padding: "1.25rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "1.2rem",
            color: GOLD_DEEP,
            fontWeight: 600,
          }}
        >
          Saptapadī-Time-Window Reminder
        </h3>
        <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          After the integrated verdict, identify the wedding-favoured lagna-rise-window on the candidate day. Within that 1–2 hour window, apply pāda-precision (Lesson 23.2.4) to select the specific 30–48 minute saptapadī-initiation sub-window. The family makes the final decision per the empowerment-principle.
        </p>
      </article>
    </section>
  );
}

function VerdictStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: INK_MUTED }}>{label}</div>
      <div style={{ fontSize: "1.15rem", fontWeight: 800, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}

