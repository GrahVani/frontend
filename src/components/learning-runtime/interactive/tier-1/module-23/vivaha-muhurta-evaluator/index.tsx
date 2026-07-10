"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CalendarHeart,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Heart,
  Info,
  Moon,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  X,
  XCircle,
} from "lucide-react";
import {
  CANDIDATES,
  CANCELLATION_DOSHAS,
  JUPITER_VENUS_RULES,
  PANCHANGA_RULES,
  SAPTAPADI_LAGNAS,
  type Candidate,
  type Quality,
  scoreCandidate,
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
const VERMILION = "var(--gl-vermilion-on-cream, #A23A1E)";
const JADE = "#2F7D55";
const INDIGO = "#4F6FA8";
const AMBER = "#B9801E";

type TabKey = "evaluate" | "rules" | "doshas" | "saptapadi";

const TABS: { key: TabKey; label: string; sublabel: string; icon: React.ReactNode }[] = [
  { key: "evaluate", label: "Evaluate", sublabel: "4 candidates", icon: <Scale size={15} /> },
  { key: "rules", label: "Wedding Rules", sublabel: "Pañcāṅga weights", icon: <Sparkles size={15} /> },
  { key: "doshas", label: "Doṣa Screener", sublabel: "Cancellation checks", icon: <ShieldCheck size={15} /> },
  { key: "saptapadi", label: "Saptapadī Lagna", sublabel: "Lagna window", icon: <CalendarHeart size={15} /> },
];

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : `rgba(156,122,47,${Number.parseInt(alphaHex, 16) / 255})`;
}

function qualityColor(q: Quality) {
  if (q === "favourable") return JADE;
  if (q === "mixed") return AMBER;
  if (q === "unfavourable") return VERMILION;
  return INK_MUTED;
}

function qualityBg(q: Quality) {
  if (q === "favourable") return wash(JADE, "12");
  if (q === "mixed") return wash(AMBER, "14");
  if (q === "unfavourable") return wash(VERMILION, "12");
  return wash(GOLD, "10");
}

function verdictColor(verdict: "proceed" | "mixed" | "avoid") {
  if (verdict === "proceed") return JADE;
  if (verdict === "mixed") return AMBER;
  return VERMILION;
}

function verdictBg(verdict: "proceed" | "mixed" | "avoid") {
  if (verdict === "proceed") return wash(JADE, "14");
  if (verdict === "mixed") return wash(AMBER, "16");
  return wash(VERMILION, "12");
}

/* ── Sub-components ────────────────────────────────────── */

function QualityBadge({ quality, label }: { quality: Quality; label?: string }) {
  const text = label ?? (quality === "favourable" ? "Favourable" : quality === "mixed" ? "Mixed" : quality === "unfavourable" ? "Unfavourable" : "Neutral");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.18rem 0.55rem",
        borderRadius: 999,
        background: qualityBg(quality),
        color: qualityColor(quality),
        fontSize: "0.72rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {quality === "favourable" ? <Check size={11} /> : quality === "unfavourable" ? <X size={11} /> : <AlertTriangle size={11} />}
      {text}
    </span>
  );
}

function SectionCard({ children, title, icon }: { children: React.ReactNode; title: string; icon?: React.ReactNode }) {
  return (
    <section
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        background: SURFACE,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.85rem 1.1rem",
          borderBottom: `1px solid ${HAIRLINE}`,
          background: SURFACE_2,
          color: GOLD_DEEP,
          fontWeight: 800,
          fontSize: "0.8rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ padding: "1rem 1.1rem" }}>{children}</div>
    </section>
  );
}

function CandidateCard({ candidate, selected, onClick }: { candidate: Candidate; selected: boolean; onClick: () => void }) {
  const { verdict, label } = useMemo(() => scoreCandidate(candidate), [candidate]);
  return (
    <button
      type="button"
      onClick={onClick}
      className="gl-focus-ring gl-clickable"
      style={{
        width: "100%",
        textAlign: "left",
        border: `1px solid ${selected ? GOLD : HAIRLINE}`,
        borderRadius: 14,
        background: selected ? "#FFFCF7" : SURFACE,
        padding: "0.9rem 1rem",
        cursor: "pointer",
        transition: "all 180ms ease",
        boxShadow: selected ? `0 0 0 2px ${wash(GOLD, "20")}` : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.5rem" }}>
        <div>
          <p style={{ margin: 0, fontSize: "0.72rem", color: INK_MUTED, fontWeight: 700 }}>{candidate.date} · {candidate.time}</p>
          <p style={{ margin: "0.15rem 0 0", fontWeight: 800, color: INK_PRIMARY, fontSize: "0.98rem" }}>{candidate.label}</p>
        </div>
        <span
          style={{
            padding: "0.2rem 0.55rem",
            borderRadius: 999,
            background: verdictBg(verdict),
            color: verdictColor(verdict),
            fontSize: "0.68rem",
            fontWeight: 800,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>{candidate.tagline}</p>
    </button>
  );
}

function PanchangaGrid({ panchanga }: { panchanga: Candidate["panchanga"] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.7rem" }}>
      {panchanga.map((factor) => (
        <div
          key={factor.key}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 12,
            background: qualityBg(factor.quality),
            padding: "0.75rem 0.85rem",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: INK_MUTED }}>{factor.label}</p>
          <p style={{ margin: "0.2rem 0 0", fontWeight: 800, color: INK_PRIMARY, fontSize: "0.95rem" }}>{factor.value}</p>
          <div style={{ marginTop: "0.35rem" }}>
            <QualityBadge quality={factor.quality} />
          </div>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.4 }}>{factor.note}</p>
        </div>
      ))}
    </div>
  );
}

function JupiterVenusPanel({ candidate }: { candidate: Candidate }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
      <div
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 12,
          background: qualityBg(candidate.jupiterState),
          padding: "0.85rem 1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem" }}>
          <Sun size={16} color={GOLD_DEEP} />
          <span style={{ fontWeight: 800, color: GOLD_DEEP, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Jupiter</span>
        </div>
        <QualityBadge quality={candidate.jupiterState} />
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>{candidate.jupiterNote}</p>
      </div>
      <div
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 12,
          background: qualityBg(candidate.venusState),
          padding: "0.85rem 1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem" }}>
          <Star size={16} color={GOLD_DEEP} />
          <span style={{ fontWeight: 800, color: GOLD_DEEP, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Venus</span>
        </div>
        <QualityBadge quality={candidate.venusState} />
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>{candidate.venusNote}</p>
      </div>
    </div>
  );
}

function ActorCards({ actors }: { actors: Candidate["actors"] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
      {actors.map((actor) => (
        <div
          key={actor.name}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 12,
            background: SURFACE,
            padding: "0.9rem 1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.45rem" }}>
            <Heart size={16} color={GOLD_DEEP} />
            <span style={{ fontWeight: 800, color: INK_PRIMARY }}>{actor.name}</span>
            <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>(natal {actor.natalStar})</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: INK_MUTED }}>Tārā-bala</p>
              <div style={{ marginTop: "0.2rem" }}>
                <QualityBadge quality={actor.taraQuality} />
              </div>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{actor.taraNote}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: INK_MUTED }}>Lagna-śuddhi ({actor.lagnaSign})</p>
              <div style={{ marginTop: "0.2rem" }}>
                <QualityBadge quality={actor.lagnaQuality} />
              </div>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{actor.lagnaNote}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: INK_MUTED }}>Navāṁśa correspondence</p>
              <div style={{ marginTop: "0.2rem" }}>
                <QualityBadge quality={actor.navamshaQuality} />
              </div>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{actor.navamshaNote}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DoshaList({ doshas }: { doshas: Candidate["doshas"] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
      {doshas.map((dosha) => (
        <div
          key={dosha.key}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.7rem",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 12,
            background: dosha.triggered ? wash(VERMILION, "10") : wash(JADE, "10"),
            padding: "0.75rem 0.9rem",
          }}
        >
          <div style={{ marginTop: "0.05rem" }}>
            {dosha.triggered ? <XCircle size={18} color={VERMILION} /> : <CheckCircle2 size={18} color={JADE} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.88rem" }}>{dosha.label}</span>
              <span
                style={{
                  padding: "0.12rem 0.45rem",
                  borderRadius: 999,
                  background: dosha.triggered ? wash(VERMILION, "18") : wash(JADE, "14"),
                  color: dosha.triggered ? VERMILION : JADE,
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {dosha.triggered ? "Triggered" : "Clear"}
              </span>
            </div>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45 }}>{dosha.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VerdictCard({ candidate }: { candidate: Candidate }) {
  const result = useMemo(() => scoreCandidate(candidate), [candidate]);
  return (
    <div
      style={{
        border: `1px solid ${verdictColor(result.verdict)}`,
        borderRadius: 16,
        background: verdictBg(result.verdict),
        padding: "1.1rem 1.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Crown size={22} color={verdictColor(result.verdict)} />
          <div>
            <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: verdictColor(result.verdict) }}>
              Integrated Verdict
            </p>
            <p style={{ margin: "0.1rem 0 0", fontWeight: 800, color: INK_PRIMARY, fontSize: "1.2rem" }}>{result.label}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "0.75rem", color: INK_MUTED, fontWeight: 700 }}>Score</p>
          <p style={{ margin: "0.1rem 0 0", fontWeight: 800, color: INK_PRIMARY, fontSize: "1.1rem" }}>
            {result.score} / {result.max}
          </p>
        </div>
      </div>
      <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>{candidate.recommendation}</p>
    </div>
  );
}

function RulesView() {
  const ruleGroups = [
    { key: "tithi", title: "Tithi", icon: <Moon size={15} /> },
    { key: "vara", title: "Vāra", icon: <Sun size={15} /> },
    { key: "nakshatra", title: "Nakṣatra", icon: <Star size={15} /> },
    { key: "yoga", title: "Yoga", icon: <Sparkles size={15} /> },
    { key: "karana", title: "Karaṇa", icon: <Scale size={15} /> },
  ] as const;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <SectionCard title="Wedding-specific pañcāṅga weighting" icon={<Sparkles size={16} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
          {ruleGroups.map((group) => {
            const rule = PANCHANGA_RULES[group.key];
            return (
              <div key={group.key} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "0.85rem 1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", color: GOLD_DEEP, fontWeight: 800, fontSize: "0.85rem" }}>
                  {group.icon}
                  {group.title}
                </div>
                <p style={{ margin: "0 0 0.4rem", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{rule.note}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: JADE, textTransform: "uppercase" }}>Prefer:</span>
                    <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{rule.favourable.join("; ")}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: VERMILION, textTransform: "uppercase" }}>Avoid:</span>
                    <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{rule.avoid.join("; ")}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Jupiter-Venus importance discipline" icon={<Crown size={16} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: wash(INDIGO, "10"), padding: "0.85rem 1rem" }}>
            <p style={{ margin: 0, fontWeight: 800, color: INDIGO, fontSize: "0.8rem", textTransform: "uppercase" }}>Jupiter = husband-significator</p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>Wisdom, dharma, expansion, classical wedding-blessing significator.</p>
          </div>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: wash(GOLD, "12"), padding: "0.85rem 1rem" }}>
            <p style={{ margin: 0, fontWeight: 800, color: GOLD_DEEP, fontSize: "0.8rem", textTransform: "uppercase" }}>Venus = wife-significator</p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>Partnership, aesthetics, classical kanyā-significator.</p>
          </div>
        </div>
        <div style={{ marginTop: "0.85rem", border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "0.85rem 1rem" }}>
          <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.85rem" }}>Both must be strong</p>
          <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.55 }}>
            {JUPITER_VENUS_RULES.strongSigns.map((r) => (
              <li key={r}>{r}</li>
            ))}
            {JUPITER_VENUS_RULES.weakSigns.map((r) => (
              <li key={r} style={{ color: VERMILION }}>{r}</li>
            ))}
            {JUPITER_VENUS_RULES.placement.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p style={{ margin: "0.55rem 0 0", fontSize: "0.78rem", color: INK_MUTED, lineHeight: 1.45 }}>{JUPITER_VENUS_RULES.note}</p>
        </div>
      </SectionCard>
    </div>
  );
}

function DoshaScreenerView() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CANCELLATION_DOSHAS.forEach((d) => {
      initial[d.key] = false;
    });
    return initial;
  });

  const triggered = CANCELLATION_DOSHAS.filter((d) => checked[d.key]);

  return (
    <SectionCard title="Interactive cancellation-doṣa screener" icon={<ShieldCheck size={16} />}>
      <p style={{ margin: "0 0 0.85rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
        Toggle the wedding-specific cancellation doṣas that apply to a candidate. Any triggered doṣa heavily penalises the recommendation; multiple triggered doṣas generally rule the candidate out.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {CANCELLATION_DOSHAS.map((dosha) => (
          <label
            key={dosha.key}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.7rem",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12,
              background: checked[dosha.key] ? wash(VERMILION, "10") : SURFACE,
              padding: "0.8rem 0.95rem",
              cursor: "pointer",
              transition: "background 150ms ease",
            }}
          >
            <input
              type="checkbox"
              checked={checked[dosha.key]}
              onChange={(e) => setChecked((prev) => ({ ...prev, [dosha.key]: e.target.checked }))}
              style={{ marginTop: "0.15rem", accentColor: VERMILION, cursor: "pointer" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.88rem" }}>{dosha.label}</p>
              <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45 }}>{dosha.description}</p>
            </div>
          </label>
        ))}
      </div>
      <div
        style={{
          marginTop: "0.85rem",
          border: `1px solid ${triggered.length > 0 ? VERMILION : JADE}`,
          borderRadius: 12,
          background: triggered.length > 0 ? wash(VERMILION, "12") : wash(JADE, "12"),
          padding: "0.85rem 1rem",
        }}
      >
        <p style={{ margin: 0, fontWeight: 800, color: triggered.length > 0 ? VERMILION : JADE, fontSize: "0.9rem" }}>
          {triggered.length === 0 ? "No cancellation doṣas selected — candidate passes first-pass exclusion." : `${triggered.length} doṣa${triggered.length > 1 ? "s" : ""} selected: ${triggered.map((d) => d.label).join("; ")}. Recommendation is heavily modulated or disqualified.`}
        </p>
      </div>
    </SectionCard>
  );
}

function SaptapadiView() {
  const [selectedSign, setSelectedSign] = useState<string | null>("Vṛṣabha");
  const selected = SAPTAPADI_LAGNAS.find((s) => s.sign === selectedSign);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <SectionCard title="Wedding-favoured lagna signs for saptapadī window" icon={<CalendarHeart size={16} />}>
        <p style={{ margin: "0 0 0.85rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
          The saptapadī (seven-step ritual) initiation should occur when the lagna is rising into a wedding-favoured sign. Lagna changes roughly every 2 hours; identify the sub-window where the lagna aligns with Venus/Jupiter preference.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.55rem" }}>
          {SAPTAPADI_LAGNAS.map((lagna) => {
            const isSelected = selectedSign === lagna.sign;
            return (
              <button
                key={lagna.sign}
                type="button"
                onClick={() => setSelectedSign(lagna.sign)}
                className="gl-focus-ring gl-clickable"
                style={{
                  border: `1px solid ${isSelected ? GOLD : HAIRLINE}`,
                  borderRadius: 10,
                  background: isSelected ? "#FFFCF7" : SURFACE,
                  padding: "0.6rem 0.5rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 150ms ease",
                  boxShadow: isSelected ? `0 0 0 2px ${wash(GOLD, "18")}` : "none",
                }}
              >
                <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.9rem" }}>{lagna.sign}</p>
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.7rem", color: INK_MUTED }}>{lagna.ruler}</p>
                <div style={{ marginTop: "0.3rem" }}>
                  <QualityBadge quality={lagna.quality} />
                </div>
              </button>
            );
          })}
        </div>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "0.85rem",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12,
              background: qualityBg(selected.quality),
              padding: "0.85rem 1rem",
            }}
          >
            <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.95rem" }}>
              {selected.sign} lagna ({selected.ruler}-ruled)
            </p>
            <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>{selected.note}</p>
          </motion.div>
        )}
      </SectionCard>

      <SectionCard title="Time-window discipline" icon={<Info size={16} />}>
        <ol style={{ margin: 0, paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.84rem", lineHeight: 1.7 }}>
          <li>Begin with the candidate day that passes pañcāṅga + cancellation-doṣa screening.</li>
          <li>Identify the desired wedding lagna sign (Vṛṣabha/Tulā ideal; Jupiter signs acceptable).</li>
          <li>Compute lagna-rise window on that day — lagna spends ~2 hours in each sign.</li>
          <li>Apply pāda-precision for high-stakes wedding context ( Lesson 23.2.4 ).</li>
          <li>Recommend a specific 30–48 minute saptapadī-initiation sub-window within the lagna-rise window.</li>
          <li>Confirm Jupiter-Venus strength and 7th-house-bala for the precise sub-window chart.</li>
        </ol>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */

export function VivahaMuhurtaEvaluator() {
  const [tab, setTab] = useState<TabKey>("evaluate");
  const [selectedId, setSelectedId] = useState<string>(CANDIDATES[0].id);
  const [resetKey, setResetKey] = useState(0);
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

  const selectedCandidate = useMemo(() => CANDIDATES.find((c) => c.id === selectedId) ?? CANDIDATES[0], [selectedId]);

  const handleReset = () => {
    setTab("evaluate");
    setSelectedId(CANDIDATES[0].id);
    setResetKey((k) => k + 1);
  };

  return (
    <div
      data-interactive="vivaha-muhurta-evaluator"
      style={{
        display: "grid",
        gap: "1rem",
        color: INK_PRIMARY,
      }}
    >
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
            width: 140,
            height: 140,
            background: `radial-gradient(circle at 100% 0%, ${wash(GOLD, "10")} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap", position: "relative" }}>
          <div>
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
              Wedding-Muhūrta Evaluator
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 820,
                fontSize: "0.92rem",
              }}
            >
              Apply the wedding-specific event-type framework: pañcāṅga weighting, Jupiter-Venus discipline, cancellation-doṣa screening, multi-actor synergy, and saptapadī lagna-window selection.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="gl-focus-ring gl-clickable"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 0.85rem",
              borderRadius: 8,
              border: `1px solid ${HAIRLINE}`,
              background: SURFACE_2,
              color: INK_SECONDARY,
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: reducedMotion ? "none" : "all 200ms ease",
            }}
          >
            <RefreshCcw size={14} />
            Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Vivāha-Muhūrta evaluator tabs"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className="gl-focus-ring gl-clickable"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.7rem 0.85rem",
                borderRadius: 12,
                border: `1px solid ${active ? GOLD : HAIRLINE}`,
                background: active ? "#FFFCF7" : SURFACE,
                color: active ? GOLD_DEEP : INK_SECONDARY,
                fontWeight: active ? 800 : 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: reducedMotion ? "none" : "all 180ms ease",
                boxShadow: active ? `0 0 0 2px ${wash(GOLD, "18")}` : "none",
              }}
            >
              <span style={{ color: active ? GOLD : INK_MUTED }}>{t.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div>{t.label}</div>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, opacity: 0.82 }}>{t.sublabel}</div>
              </div>
              <ChevronRight
                size={14}
                style={{
                  marginLeft: "auto",
                  opacity: active ? 1 : 0,
                  transform: active ? "translateX(0)" : "translateX(-4px)",
                  transition: reducedMotion ? "none" : "all 180ms ease",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${tab}-${resetKey}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          style={{ display: "grid", gap: "1rem" }}
        >
          {tab === "evaluate" && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(260px, 320px) 1fr",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  <SectionCard title="Candidate windows" icon={<CalendarHeart size={16} />}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      {CANDIDATES.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          selected={selectedId === candidate.id}
                          onClick={() => setSelectedId(candidate.id)}
                        />
                      ))}
                    </div>
                  </SectionCard>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <SectionCard title="Pañcāṅga evaluation" icon={<Scale size={16} />}>
                    <PanchangaGrid panchanga={selectedCandidate.panchanga} />
                  </SectionCard>

                  <SectionCard title="Jupiter-Venus importance" icon={<Crown size={16} />}>
                    <JupiterVenusPanel candidate={selectedCandidate} />
                  </SectionCard>

                  <SectionCard title="Multi-actor synergy (bride + groom)" icon={<Heart size={16} />}>
                    <ActorCards actors={selectedCandidate.actors} />
                  </SectionCard>

                  <SectionCard title="Wedding-specific cancellation doṣas" icon={<ShieldCheck size={16} />}>
                    <DoshaList doshas={selectedCandidate.doshas} />
                  </SectionCard>

                  <VerdictCard candidate={selectedCandidate} />
                </div>
              </div>
            </>
          )}

          {tab === "rules" && <RulesView />}

          {tab === "doshas" && <DoshaScreenerView />}

          {tab === "saptapadi" && <SaptapadiView />}
        </motion.div>
      </AnimatePresence>

      {/* Footer note */}
      <footer
        style={{
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: "0.75rem",
          color: INK_MUTED,
          fontSize: "0.76rem",
          lineHeight: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <Info size={14} style={{ marginTop: "0.15rem", flexShrink: 0 }} />
        <span>
          This evaluator is a pedagogical synthesis drill, not a personal muhūrta calculator. Real wedding-muhūrta selection requires full ephemeris computation, regional-tradition variance awareness, and the M24 ethics framework (scope-clarification, honest articulation, family empowerment).
        </span>
      </footer>
    </div>
  );
}
